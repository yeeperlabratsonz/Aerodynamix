import os
import datetime
from zoneinfo import ZoneInfo
import re
import uuid
import random
import time
import mimetypes
import urllib.error
import urllib.request
from io import BytesIO
from flask import Flask, request, jsonify, session, send_from_directory, abort, Response, g, redirect, stream_with_context
from werkzeug.exceptions import RequestEntityTooLarge
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from sqlalchemy import create_engine, Column, String, Integer, DateTime, LargeBinary, Text, Float, Boolean, ForeignKey, text
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import declarative_base, sessionmaker, scoped_session, relationship
from sqlalchemy.sql import func
from bad_words import contains_bad_words
import json

PORT = int(os.environ.get('PORT', 5000))
DATABASE_URL = os.environ.get('DATABASE_URL', 'sqlite:///dynamix.db')
if DATABASE_URL.startswith('postgres://'):
    DATABASE_URL = DATABASE_URL.replace('postgres://', 'postgresql://', 1)

UPLOAD_FOLDER = 'docs/uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp'}
GAME_COSTS = {
    'games/the-greatest-game/index.html': 1000,
    'aerodynamix-lite-download': 2000,
}
DEFAULT_CORS_ORIGINS = {
    'https://yeeperlabratsonz.github.io',
    # A downloaded standalone HTML file is sent by browsers with a null origin.
    # Keep this explicit so the native Connect page can use the API without an
    # iframe or a same-origin portal.
    'null',
}
ALLOWED_CORS_ORIGINS = DEFAULT_CORS_ORIGINS | {
    origin.strip().rstrip('/')
    for origin in os.environ.get('ALLOWED_CORS_ORIGINS', '').split(',')
    if origin.strip()
}
CONNECT_UPSTREAM_ORIGIN = os.environ.get(
    'CONNECT_UPSTREAM_ORIGIN',
    'https://aerodynamix20.onrender.com',
).rstrip('/')
CONNECT_PROXY_TIMEOUT_SECONDS = max(
    5,
    float(os.environ.get('CONNECT_PROXY_TIMEOUT_SECONDS', '12'))
)
UPDATE_UPSTREAM_ORIGIN = os.environ.get(
    'UPDATE_UPSTREAM_ORIGIN',
    'https://yeeperlabratsonz.github.io/Aerodynamix/Aerodynamix20/Aerodynamix20/docs',
).rstrip('/')

app = Flask(__name__, static_folder='docs', static_url_path='')
app.secret_key = os.environ.get('SESSION_SECRET', 'dev-secret-key')
app.config['MAX_CONTENT_LENGTH'] = 30 * 1024 * 1024  # 30 MB max upload
if os.environ.get('RENDER') or os.environ.get('RENDER_SERVICE_ID'):
    # The native standalone page talks to Render from a downloaded file. Render
    # must mark its session cookies as secure cross-site cookies for login and
    # account actions to survive those API requests.
    app.config['SESSION_COOKIE_SAMESITE'] = 'None'
    app.config['SESSION_COOKIE_SECURE'] = True
NEXTBOT_ROOM_TTL = 600
NEXTBOT_PEER_TTL = 20
NEXTBOT_GAME_MODES = {'hangout', 'nextbots', 'deathmatch'}


def _download_standalone_file(filename):
    content_type = (
        'application/x-xz'
        if filename.endswith('.xz')
        else 'application/zip'
        if filename.endswith('.zip')
        else 'text/html; charset=utf-8'
    )
    response = send_from_directory(
        os.path.join(app.root_path, 'attached_assets'),
        filename,
        mimetype=content_type,
        as_attachment=True,
        download_name=filename,
    )
    response.headers['Access-Control-Allow-Origin'] = '*'
    return response


@app.route('/download/aerodynamix-standalone.html')
def download_standalone_export():
    return _download_standalone_file('Aerodynamix-Standalone.html')


@app.route('/download/aerodynamix-dev-edition.html')
def download_dev_export():
    return _download_standalone_file('Aerodynamix-Dev-Edition.html')


@app.route('/download/aerodynamix-standalone-slim.html')
def download_slim_standalone_export():
    return _download_standalone_file('Aerodynamix-Standalone-Slim.html')


@app.route('/download/aerodynamix-dev-edition-slim.html')
def download_slim_dev_export():
    return _download_standalone_file('Aerodynamix-Dev-Edition-Slim.html')


@app.route('/download/aerodynamix-standalone.zip')
def download_standalone_zip():
    return _download_standalone_file('Aerodynamix-Standalone.zip')


@app.route('/download/aerodynamix-dev-edition.zip')
def download_dev_zip():
    return _download_standalone_file('Aerodynamix-Dev-Edition.zip')


@app.route('/download/aerodynamix-standalone-slim.zip')
def download_slim_standalone_zip():
    return _download_standalone_file('Aerodynamix-Standalone-Slim.zip')


@app.route('/download/aerodynamix-dev-edition-slim.zip')
def download_slim_dev_zip():
    return _download_standalone_file('Aerodynamix-Dev-Edition-Slim.zip')


@app.route('/download/aerodynamix-standalone.html.xz')
def download_standalone_xz():
    return _download_standalone_file('Aerodynamix-Standalone.html.xz')


@app.route('/download/aerodynamix-dev-edition.html.xz')
def download_dev_xz():
    return _download_standalone_file('Aerodynamix-Dev-Edition.html.xz')


@app.route('/download/aerodynamix-standalone-slim.html.xz')
def download_slim_standalone_xz():
    return _download_standalone_file('Aerodynamix-Standalone-Slim.html.xz')


@app.route('/download/aerodynamix-dev-edition-slim.html.xz')
def download_slim_dev_xz():
    return _download_standalone_file('Aerodynamix-Dev-Edition-Slim.html.xz')


@app.route('/api/standalone-updates.json')
def standalone_updates_manifest():
    response = send_from_directory(
        os.path.join(app.root_path, 'docs'),
        'standalone-updates.json',
        mimetype='application/json',
        max_age=0,
    )
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Cache-Control'] = 'no-store, max-age=0'
    return response


@app.route('/api/music-catalog.json')
def music_catalog_manifest():
    response = send_from_directory(
        os.path.join(app.root_path, 'docs'),
        'music-catalog.json',
        mimetype='application/json',
        max_age=0,
    )
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Cache-Control'] = 'no-store, max-age=0'
    return response


@app.route('/api/music/<path:filename>')
def music_asset(filename):
    extension = os.path.splitext(filename)[1].lower()
    if extension not in {'.mp3', '.m4a', '.wav', '.ogg', '.flac', '.webp', '.jpg', '.jpeg', '.png'}:
        abort(404)
    response = send_from_directory(
        os.path.join(app.root_path, 'attached_assets'),
        filename,
        as_attachment=False,
        max_age=86400,
    )
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Cache-Control'] = 'public, max-age=86400'
    return response


@app.route('/api/nextbot/room/join', methods=['POST'])
def nextbot_room_join():
    data = request.get_json(silent=True) or {}
    room = re.sub(r'[^A-Z0-9]', '', str(data.get('room', '')).upper())[:8]
    mode = str(data.get('mode', 'join')).lower()
    requested_model = str(data.get('player_model', 'dora')).lower()
    player_model = requested_model if requested_model in {'dora', 'shrek', 'rick'} else 'dora'
    requested_game_mode = str(data.get('game_mode', 'nextbots')).lower()
    if mode == 'create':
        for _ in range(20):
            candidate = ''.join(random.choice('ABCDEFGHJKLMNPQRSTUVWXYZ23456789') for _ in range(6))
            with engine.begin() as connection:
                exists = connection.execute(text('SELECT 1 FROM nextbot_room_members WHERE room = :room LIMIT 1'), {'room': candidate}).first()
            if not exists:
                room = candidate
                break
        else:
            return jsonify({'error': 'Could not create a room right now.'}), 503
    if len(room) < 3:
        return jsonify({'error': 'Enter a room code with at least 3 characters.'}), 400
    now = time.time()
    room_level = 'backrooms'
    game_mode = 'nextbots'
    with engine.begin() as connection:
        connection.execute(text('DELETE FROM nextbot_room_members WHERE updated < :stale'), {'stale': now - NEXTBOT_ROOM_TTL})
        room_owner = connection.execute(
            text('SELECT owner_id FROM nextbot_room_members WHERE room = :room LIMIT 1'),
            {'room': room},
        ).scalar()
        if room_owner:
            room_level = connection.execute(
                text('SELECT level FROM nextbot_room_members WHERE room = :room LIMIT 1'),
                {'room': room},
            ).scalar() or 'backrooms'
            game_mode = connection.execute(
                text('SELECT game_mode FROM nextbot_room_members WHERE room = :room LIMIT 1'),
                {'room': room},
            ).scalar() or 'nextbots'
        elif mode == 'create':
            game_mode = requested_game_mode if requested_game_mode in NEXTBOT_GAME_MODES else 'nextbots'
        if mode != 'create' and not room_owner:
            return jsonify({'error': 'Room not found. Check the code and try again.'}), 404
        if mode != 'create':
            owner_exists = connection.execute(
                text('SELECT 1 FROM nextbot_room_members WHERE room = :room AND player_id = owner_id LIMIT 1'),
                {'room': room},
            ).first()
            if not owner_exists:
                connection.execute(text('DELETE FROM nextbot_room_members WHERE room = :room'), {'room': room})
                return jsonify({'error': 'Room not found. The room creator has left.'}), 404
    player_id = uuid.uuid4().hex[:12]
    owner_id = player_id if mode == 'create' else room_owner
    with engine.begin() as connection:
        connection.execute(text('''
            INSERT INTO nextbot_room_members
                (room, player_id, owner_id, x, y, z, yaw, sliding, crouching, player_model, level, game_mode, health, kills, deaths, updated)
            VALUES
                (:room, :player_id, :owner_id, -68, 1.35, 5, 0, :sliding, :crouching, :player_model, :level, :game_mode, 100, 0, 0, :updated)
        '''), {'room': room, 'player_id': player_id, 'owner_id': owner_id, 'sliding': False, 'crouching': False, 'player_model': player_model, 'level': room_level, 'game_mode': game_mode, 'updated': now})
    return jsonify({'room': room, 'player_id': player_id, 'player_model': player_model, 'room_level': room_level, 'game_mode': game_mode, 'is_owner': player_id == owner_id})


@app.route('/api/nextbot/room/leave', methods=['POST'])
def nextbot_room_leave():
    data = request.get_json(silent=True) or {}
    room = re.sub(r'[^A-Z0-9]', '', str(data.get('room', '')).upper())[:8]
    player_id = re.sub(r'[^a-zA-Z0-9]', '', str(data.get('player_id', '')))[:24]
    if not room or not player_id:
        return jsonify({'ok': True})
    with engine.begin() as connection:
        owner_id = connection.execute(
            text('SELECT owner_id FROM nextbot_room_members WHERE room = :room AND player_id = :player_id'),
            {'room': room, 'player_id': player_id},
        ).scalar()
        if owner_id == player_id:
            connection.execute(text('DELETE FROM nextbot_room_members WHERE room = :room'), {'room': room})
            connection.execute(text('DELETE FROM nextbot_voice_signals WHERE room = :room'), {'room': room})
        elif owner_id:
            connection.execute(
                text('DELETE FROM nextbot_room_members WHERE room = :room AND player_id = :player_id'),
                {'room': room, 'player_id': player_id},
            )
            connection.execute(text('DELETE FROM nextbot_voice_signals WHERE room = :room AND (sender_id = :player_id OR target_id = :player_id)'), {'room': room, 'player_id': player_id})
    return jsonify({'ok': True})


@app.route('/api/nextbot/room/state', methods=['POST'])
def nextbot_room_state():
    data = request.get_json(silent=True) or {}
    room = re.sub(r'[^A-Z0-9]', '', str(data.get('room', '')).upper())[:8]
    player_id = re.sub(r'[^a-zA-Z0-9]', '', str(data.get('player_id', '')))[:24]
    if not room or not player_id:
        return jsonify({'error': 'Room session expired.'}), 404
    now = time.time()
    with engine.begin() as connection:
        member = connection.execute(
            text('SELECT owner_id, x, y, z, yaw, sliding, crouching, level, game_mode, health, kills, deaths, last_killer_id FROM nextbot_room_members WHERE room = :room AND player_id = :player_id'),
            {'room': room, 'player_id': player_id},
        ).mappings().first()
        if not member:
            return jsonify({'error': 'Room session expired.'}), 404
        owner_exists = connection.execute(
            text('SELECT 1 FROM nextbot_room_members WHERE room = :room AND player_id = owner_id LIMIT 1'),
            {'room': room},
        ).first()
        if not owner_exists:
            connection.execute(text('DELETE FROM nextbot_room_members WHERE room = :room'), {'room': room})
            return jsonify({'error': 'Room expired because the creator left.'}), 404
        values = {'room': room, 'player_id': player_id, 'x': member['x'], 'y': member['y'], 'z': member['z'], 'yaw': member['yaw']}
        for key in ('x', 'y', 'z', 'yaw'):
            try:
                values[key] = float(data.get(key, member[key]))
            except (TypeError, ValueError):
                pass
        shot_target_id = re.sub(r'[^a-zA-Z0-9]', '', str(data.get('shot_target_id', '')))[:24]
        if member['game_mode'] == 'deathmatch' and shot_target_id and shot_target_id != player_id:
            target = connection.execute(text('SELECT x, y, z FROM nextbot_room_members WHERE room = :room AND player_id = :target_id'), {'room': room, 'target_id': shot_target_id}).mappings().first()
            if target and (float(target['x']) - values['x']) ** 2 + (float(target['y']) - values['y']) ** 2 + (float(target['z']) - values['z']) ** 2 <= 10000:
                connection.execute(text('UPDATE nextbot_room_members SET health = health - 25 WHERE room = :room AND player_id = :target_id AND health > 0'), {'room': room, 'target_id': shot_target_id})
                target_health = connection.execute(text('SELECT health FROM nextbot_room_members WHERE player_id = :target_id'), {'target_id': shot_target_id}).scalar()
                if target_health is not None and target_health <= 0:
                    connection.execute(text('UPDATE nextbot_room_members SET health = 100, x = -68, y = 1.35, z = 5, deaths = deaths + 1, last_killer_id = :killer_id WHERE player_id = :target_id'), {'target_id': shot_target_id, 'killer_id': player_id})
                    connection.execute(text('UPDATE nextbot_room_members SET kills = kills + 1 WHERE room = :room AND player_id = :player_id'), {'room': room, 'player_id': player_id})
        requested_model = str(data.get('player_model', 'dora')).lower()
        player_model = requested_model if requested_model in {'dora', 'shrek', 'rick'} else 'dora'
        requested_level = str(data.get('level', 'backrooms')).lower()
        if requested_level not in {'backrooms', 'liminal', 'gorilla'}:
            requested_level = 'backrooms'
        connection.execute(text('''
            UPDATE nextbot_room_members
            SET x = :x, y = :y, z = :z, yaw = :yaw, sliding = :sliding, crouching = :crouching,
                player_model = :player_model,
                level = CASE
                    WHEN :requested_level = 'gorilla' THEN 'gorilla'
                    WHEN :requested_level = 'liminal' AND level = 'backrooms' THEN 'liminal'
                    ELSE level
                END,
                updated = :updated
            WHERE room = :room AND player_id = :player_id
        '''), {**values, 'sliding': bool(data.get('sliding', False)), 'crouching': bool(data.get('crouching', False)), 'player_model': player_model, 'requested_level': requested_level, 'updated': now})
        if requested_level == 'gorilla':
            connection.execute(
                text("UPDATE nextbot_room_members SET level = 'gorilla' WHERE room = :room"),
                {'room': room},
            )
        elif requested_level == 'liminal':
            connection.execute(
                text("UPDATE nextbot_room_members SET level = 'liminal' WHERE room = :room AND level = 'backrooms'"),
                {'room': room},
            )
        connection.execute(text('DELETE FROM nextbot_voice_signals WHERE created_at < :stale'), {'stale': now - 60})
        voice_signal = data.get('voice_signal')
        if isinstance(voice_signal, dict):
            target_id = re.sub(r'[^a-zA-Z0-9]', '', str(voice_signal.get('target', '')))[:24]
            kind = str(voice_signal.get('kind', ''))[:12]
            payload = voice_signal.get('payload')
            target_exists = target_id and kind in {'offer', 'answer', 'ice'} and isinstance(payload, dict) and connection.execute(
                text('SELECT 1 FROM nextbot_room_members WHERE room = :room AND player_id = :target_id'),
                {'room': room, 'target_id': target_id},
            ).first()
            if target_exists:
                connection.execute(text('''
                    INSERT INTO nextbot_voice_signals
                        (signal_id, room, sender_id, target_id, kind, payload, created_at)
                    VALUES (:signal_id, :room, :sender_id, :target_id, :kind, :payload, :created_at)
                '''), {
                    'signal_id': uuid.uuid4().hex,
                    'room': room,
                    'sender_id': player_id,
                    'target_id': target_id,
                    'kind': kind,
                    'payload': json.dumps(payload),
                    'created_at': now,
                })
        peers = connection.execute(text('''
            SELECT player_id AS id, x, y, z, yaw, sliding, crouching, player_model, health, kills, deaths
            FROM nextbot_room_members
            WHERE room = :room AND player_id != :player_id AND updated >= :peer_cutoff
        '''), {'room': room, 'player_id': player_id, 'peer_cutoff': now - NEXTBOT_PEER_TTL}).mappings().all()
        signals = connection.execute(text('''
            SELECT signal_id, sender_id, kind, payload
            FROM nextbot_voice_signals
            WHERE room = :room AND target_id = :target_id AND created_at >= :signal_cutoff
            ORDER BY created_at ASC
        '''), {'room': room, 'target_id': player_id, 'signal_cutoff': now - 60}).mappings().all()
        room_level = connection.execute(
            text('SELECT level FROM nextbot_room_members WHERE room = :room LIMIT 1'),
            {'room': room},
        ).scalar() or 'backrooms'
        game_mode = member['game_mode']
        killer = None
        if member['last_killer_id']:
            killer = connection.execute(text('''
                SELECT player_id AS id, x, y, z, player_model
                FROM nextbot_room_members
                WHERE room = :room AND player_id = :killer_id
            '''), {'room': room, 'killer_id': member['last_killer_id']}).mappings().first()
            connection.execute(text('UPDATE nextbot_room_members SET last_killer_id = NULL WHERE room = :room AND player_id = :player_id'), {'room': room, 'player_id': player_id})
    return jsonify({
        'room_level': room_level,
        'game_mode': game_mode,
        'health': member['health'],
        'kills': member['kills'],
        'deaths': member['deaths'],
        'killer': dict(killer) if killer else None,
        'peers': [dict(peer) for peer in peers],
        'voice_signals': [
            {'id': signal['signal_id'], 'sender': signal['sender_id'], 'kind': signal['kind'], 'payload': json.loads(signal['payload'])}
            for signal in signals
        ],
    })

engine_options = {'pool_pre_ping': True}
if DATABASE_URL.startswith('sqlite:'):
    engine_options['connect_args'] = {'check_same_thread': False, 'timeout': 30}
engine = create_engine(DATABASE_URL, **engine_options)
with engine.begin() as _connection:
    if DATABASE_URL.startswith('sqlite:'):
        _connection.execute(text('PRAGMA journal_mode=WAL'))
        _connection.execute(text('PRAGMA synchronous=NORMAL'))
        _connection.execute(text('PRAGMA busy_timeout=30000'))
    _connection.execute(text('''
        CREATE TABLE IF NOT EXISTS nextbot_room_members (
            room VARCHAR(8) NOT NULL,
            player_id VARCHAR(24) PRIMARY KEY,
            owner_id VARCHAR(24) NOT NULL,
            x REAL NOT NULL DEFAULT -68,
            y REAL NOT NULL DEFAULT 1.35,
            z REAL NOT NULL DEFAULT 5,
            yaw REAL NOT NULL DEFAULT 0,
            sliding BOOLEAN NOT NULL DEFAULT FALSE,
            crouching BOOLEAN NOT NULL DEFAULT FALSE,
            player_model VARCHAR(32) NOT NULL DEFAULT 'dora',
            level VARCHAR(32) NOT NULL DEFAULT 'backrooms',
            game_mode VARCHAR(32) NOT NULL DEFAULT 'nextbots',
            health INTEGER NOT NULL DEFAULT 100,
            kills INTEGER NOT NULL DEFAULT 0,
            deaths INTEGER NOT NULL DEFAULT 0,
            last_killer_id VARCHAR(24),
            updated DOUBLE PRECISION NOT NULL
        )
    '''))
    _connection.execute(text('CREATE INDEX IF NOT EXISTS idx_nextbot_room ON nextbot_room_members (room)'))
    _connection.execute(text('CREATE INDEX IF NOT EXISTS idx_nextbot_updated ON nextbot_room_members (updated)'))
    if _connection.engine.dialect.name == 'postgresql':
        level_column = _connection.execute(text('''
            SELECT 1
            FROM information_schema.columns
            WHERE table_name = 'nextbot_room_members' AND column_name = 'level'
            LIMIT 1
        ''')).first()
        if not level_column:
            _connection.execute(text("ALTER TABLE nextbot_room_members ADD COLUMN level VARCHAR(32) NOT NULL DEFAULT 'backrooms'"))
    else:
        try:
            _connection.execute(text("ALTER TABLE nextbot_room_members ADD COLUMN level VARCHAR(32) NOT NULL DEFAULT 'backrooms'"))
        except Exception:
            pass
    if _connection.engine.dialect.name == 'postgresql':
        existing_columns = {
            row[0] for row in _connection.execute(text('''
                SELECT column_name
                FROM information_schema.columns
                WHERE table_name = 'nextbot_room_members'
            ''')).all()
        }
    else:
        existing_columns = {
            row[1] for row in _connection.execute(text('PRAGMA table_info(nextbot_room_members)')).all()
        }
    for column, definition in (
        ('game_mode', "VARCHAR(32) NOT NULL DEFAULT 'nextbots'"),
        ('health', 'INTEGER NOT NULL DEFAULT 100'),
        ('kills', 'INTEGER NOT NULL DEFAULT 0'),
        ('deaths', 'INTEGER NOT NULL DEFAULT 0'),
        ('last_killer_id', 'VARCHAR(24)'),
    ):
        if column not in existing_columns:
            _connection.execute(text(f'ALTER TABLE nextbot_room_members ADD COLUMN {column} {definition}'))
    _connection.execute(text('''
        CREATE TABLE IF NOT EXISTS nextbot_voice_signals (
            signal_id VARCHAR(64) PRIMARY KEY,
            room VARCHAR(8) NOT NULL,
            sender_id VARCHAR(24) NOT NULL,
            target_id VARCHAR(24) NOT NULL,
            kind VARCHAR(12) NOT NULL,
            payload TEXT NOT NULL,
            created_at DOUBLE PRECISION NOT NULL
        )
    '''))
    _connection.execute(text('CREATE INDEX IF NOT EXISTS idx_nextbot_voice_target ON nextbot_voice_signals (room, target_id, created_at)'))
    if _connection.engine.dialect.name == 'postgresql':
        timestamp_columns = {
            (row[0], row[1]): row[2]
            for row in _connection.execute(text('''
                SELECT table_name, column_name, data_type
                FROM information_schema.columns
                WHERE (table_name = 'nextbot_room_members' AND column_name = 'updated')
                   OR (table_name = 'nextbot_voice_signals' AND column_name = 'created_at')
            ''')).all()
        }
        if timestamp_columns.get(('nextbot_room_members', 'updated')) != 'double precision':
            _connection.execute(text(
                'ALTER TABLE nextbot_room_members '
                'ALTER COLUMN updated TYPE DOUBLE PRECISION USING updated::double precision'
            ))
        if timestamp_columns.get(('nextbot_voice_signals', 'created_at')) != 'double precision':
            _connection.execute(text(
                'ALTER TABLE nextbot_voice_signals '
                'ALTER COLUMN created_at TYPE DOUBLE PRECISION USING created_at::double precision'
            ))
Base = declarative_base()
DBSession = scoped_session(sessionmaker(bind=engine))
GuestStateSession = sessionmaker(bind=engine, expire_on_commit=False)


class User(Base):
    __tablename__ = 'users'
    id             = Column(Integer, primary_key=True, autoincrement=True)
    username       = Column(String(20), unique=True, nullable=False)
    password_hash  = Column(String(255), nullable=False)
    bio            = Column(Text, nullable=True)
    pfp_data       = Column(LargeBinary, nullable=True)
    pfp_mimetype   = Column(String(50), nullable=True)
    pfp_offset_x   = Column(Float, default=50.0)
    pfp_offset_y   = Column(Float, default=50.0)
    disc_balance   = Column(Integer, default=0)
    last_daily_login = Column(DateTime, nullable=True)
    last_daily_card_pack = Column(DateTime, nullable=True)
    purchased_themes = Column(Text, nullable=True, default='[]')
    purchased_games  = Column(Text, nullable=True, default='[]')
    trading_cards    = Column(Text, nullable=True, default='[]')
    media_unlocked = Column(Boolean, default=False)
    full_access = Column(Boolean, default=False, nullable=False)
    first_login_bonus_claimed = Column(Boolean, default=False)
    is_verified    = Column(Boolean, default=False, nullable=False)
    created_at     = Column(DateTime, default=datetime.datetime.utcnow)
    posts          = relationship('Post', back_populates='user', cascade='all, delete-orphan')


class DeviceBonusClaim(Base):
    __tablename__ = 'device_bonus_claims'
    device_id    = Column(String(64), primary_key=True)
    claimed_at   = Column(DateTime, default=datetime.datetime.utcnow)


class GuestState(Base):
    """Durable state for visitors who have not created an account yet."""
    __tablename__ = 'guest_states'
    device_id           = Column(String(64), primary_key=True)
    disc_balance        = Column(Integer, nullable=False, default=0)
    purchased_games     = Column(Text, nullable=False, default='[]')
    trading_cards       = Column(Text, nullable=False, default='[]')
    purchased_themes    = Column(Text, nullable=False, default='[]')
    media_unlocked      = Column(Boolean, nullable=False, default=False)
    full_access          = Column(Boolean, nullable=False, default=False)
    last_daily_login    = Column(DateTime, nullable=True)
    last_card_pack      = Column(DateTime, nullable=True)


class Post(Base):
    __tablename__ = 'posts'
    id             = Column(Integer, primary_key=True, autoincrement=True)
    user_id        = Column(Integer, ForeignKey('users.id'), nullable=False)
    text           = Column(Text, nullable=False)
    image_filename = Column(String(255))
    image_data     = Column(LargeBinary)
    image_mimetype = Column(String(50))
    created_at     = Column(DateTime, default=datetime.datetime.utcnow)
    user           = relationship('User', back_populates='posts')
    comments       = relationship('Comment', back_populates='post', cascade='all, delete-orphan')


class CallSession(Base):
    __tablename__ = 'call_sessions'
    id          = Column(String(36), primary_key=True)
    caller_id   = Column(Integer, ForeignKey('users.id'), nullable=False)
    recipient_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    status      = Column(String(20), nullable=False, default='ringing')
    created_at  = Column(DateTime, default=datetime.datetime.utcnow)
    ended_at    = Column(DateTime, nullable=True)


class CallSignal(Base):
    __tablename__ = 'call_signals'
    id          = Column(Integer, primary_key=True, autoincrement=True)
    call_id     = Column(String(36), ForeignKey('call_sessions.id'), nullable=False)
    sender_id   = Column(Integer, ForeignKey('users.id'), nullable=False)
    signal_type = Column(String(20), nullable=False)
    payload     = Column(Text, nullable=False)
    created_at  = Column(DateTime, default=datetime.datetime.utcnow)


class Comment(Base):
    __tablename__ = 'comments'
    id         = Column(Integer, primary_key=True, autoincrement=True)
    post_id    = Column(Integer, ForeignKey('posts.id'), nullable=False)
    user_id    = Column(Integer, ForeignKey('users.id'), nullable=False)
    text       = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    post       = relationship('Post', back_populates='comments')
    user       = relationship('User')


class Friendship(Base):
    __tablename__ = 'friendships'
    id           = Column(Integer, primary_key=True, autoincrement=True)
    requester_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    addressee_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    status       = Column(String(20), nullable=False, default='pending')
    created_at   = Column(DateTime, default=datetime.datetime.utcnow)


class DirectMessage(Base):
    __tablename__ = 'direct_messages'
    id           = Column(Integer, primary_key=True, autoincrement=True)
    sender_id    = Column(Integer, ForeignKey('users.id'), nullable=False)
    recipient_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    text         = Column(Text, nullable=False)
    created_at   = Column(DateTime, default=datetime.datetime.utcnow)
    is_read      = Column(Boolean, default=False)


class ConnectBan(Base):
    __tablename__ = 'connect_bans'
    id          = Column(Integer, primary_key=True, autoincrement=True)
    target_id   = Column(Integer, ForeignKey('users.id'), nullable=False)
    issuer_id   = Column(Integer, ForeignKey('users.id'), nullable=False)
    reason      = Column(String(500), nullable=False)
    expires_at  = Column(DateTime, nullable=True)
    created_at  = Column(DateTime, default=datetime.datetime.utcnow)
    revoked_at  = Column(DateTime, nullable=True)


class TradeOffer(Base):
    __tablename__ = 'trade_offers'
    id                   = Column(Integer, primary_key=True, autoincrement=True)
    initiator_id         = Column(Integer, ForeignKey('users.id'), nullable=False)
    recipient_id         = Column(Integer, ForeignKey('users.id'), nullable=False)
    offered_card_ids     = Column(Text, nullable=False)
    requested_card_ids   = Column(Text, nullable=False)
    status               = Column(String(20), nullable=False, default='pending')
    created_at           = Column(DateTime, default=datetime.datetime.utcnow)
    responded_at         = Column(DateTime, nullable=True)


class TradeCardLock(Base):
    """One row per card reserved by a pending trade.

    A primary key on card_id makes it impossible for the same card to be
    promised in two pending trades, even if two requests arrive together.
    """
    __tablename__ = 'trade_card_locks'
    card_id   = Column(String(36), primary_key=True)
    trade_id  = Column(Integer, ForeignKey('trade_offers.id'), nullable=False)


Base.metadata.create_all(engine)

# Migrate existing DB to add new User columns if they don't exist yet
_is_pg = engine.dialect.name == 'postgresql'
_new_user_cols = [
    ('bio',            'TEXT'),
    ('pfp_data',       'BYTEA'                            if _is_pg else 'BLOB'),
    ('pfp_mimetype',   'VARCHAR(50)'),
    ('pfp_offset_x',   'DOUBLE PRECISION DEFAULT 50.0'    if _is_pg else 'FLOAT DEFAULT 50.0'),
    ('pfp_offset_y',   'DOUBLE PRECISION DEFAULT 50.0'    if _is_pg else 'FLOAT DEFAULT 50.0'),
    ('disc_balance',   'INTEGER DEFAULT 0'),
    ('last_daily_login', 'TIMESTAMP'                       if _is_pg else 'DATETIME'),
    ('last_daily_card_pack', 'TIMESTAMP'                  if _is_pg else 'DATETIME'),
    ('purchased_themes', 'TEXT DEFAULT \'[]\''),
    ('purchased_games',  'TEXT DEFAULT \'[]\''),
    ('trading_cards',    'TEXT DEFAULT \'[]\''),
    ('media_unlocked', 'BOOLEAN DEFAULT FALSE'             if _is_pg else 'INTEGER DEFAULT 0'),
    ('full_access', 'BOOLEAN DEFAULT FALSE'                if _is_pg else 'INTEGER DEFAULT 0'),
    ('first_login_bonus_claimed', 'BOOLEAN DEFAULT FALSE' if _is_pg else 'INTEGER DEFAULT 0'),
    ('is_verified', 'BOOLEAN DEFAULT FALSE' if _is_pg else 'INTEGER DEFAULT 0'),
]
_if_not_exists = 'IF NOT EXISTS' if _is_pg else ''
for _col, _typedef in _new_user_cols:
    try:
        with engine.connect() as _conn:
            _conn.execute(text(f'ALTER TABLE users ADD COLUMN {_if_not_exists} {_col} {_typedef}'))
            _conn.commit()
    except Exception:
        pass

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Migrate the durable anonymous-state table for existing databases.
try:
    with engine.connect() as _conn:
        _conn.execute(text(
            f'ALTER TABLE guest_states ADD COLUMN '
            f'{_if_not_exists} full_access '
            f'{"BOOLEAN DEFAULT FALSE" if _is_pg else "INTEGER DEFAULT 0"}'
        ))
        _conn.commit()
except Exception:
    pass


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def user_to_dict(user):
    daily_available, next_claim_at = _daily_claim_status(user.last_daily_login)
    card_pack_available, next_card_pack_at = _daily_claim_status(user.last_daily_card_pack)
    return {
        'id':               user.id,
        'username':         user.username,
        'is_verified':      bool(user.is_verified),
        'bio':              user.bio or '',
        'pfp_url':          f'/api/pfp/{user.id}' if user.pfp_data else None,
        'pfp_offset_x':     user.pfp_offset_x if user.pfp_offset_x is not None else 50.0,
        'pfp_offset_y':     user.pfp_offset_y if user.pfp_offset_y is not None else 50.0,
        'disc_balance':     user.disc_balance or 0,
        'media_unlocked': bool(user.media_unlocked),
        'full_access':     bool(user.full_access),
        'purchased_themes': json.loads(user.purchased_themes or '[]') if user.purchased_themes else [],
        'purchased_games':  json.loads(user.purchased_games  or '[]') if user.purchased_games  else [],
        'daily_available': daily_available,
        'next_claim_at': next_claim_at.isoformat(),
        'card_pack_available': card_pack_available,
        'next_card_pack_at': next_card_pack_at.isoformat(),
    }


def _active_connect_ban(db, user_id):
    now = datetime.datetime.utcnow()
    return db.query(ConnectBan).filter(
        ConnectBan.target_id == user_id,
        ConnectBan.revoked_at.is_(None),
        ((ConnectBan.expires_at.is_(None)) | (ConnectBan.expires_at > now)),
    ).order_by(ConnectBan.created_at.desc()).first()


def _is_yandhi(user):
    return bool(user and user.username == 'YANDHI')


def _current_user(db):
    user_id = session.get('user_id')
    return db.query(User).filter_by(id=user_id).first() if user_id else None


def _connect_ban_response(ban):
    return {
        'active': bool(ban),
        'reason': ban.reason if ban else None,
        'permanent': bool(ban and ban.expires_at is None),
        'expires_at': ban.expires_at.isoformat() if ban and ban.expires_at else None,
    }


@app.before_request
def enforce_connect_bans():
    if not session.get('user_id'):
        return None
    protected = (
        request.path.startswith('/api/posts'),
        request.path.startswith('/api/comments'),
        request.path.startswith('/api/friends'),
        request.path.startswith('/api/dms'),
        request.path.startswith('/api/calls'),
        request.path.startswith('/api/users/'),
    )
    if not any(protected):
        return None
    db = DBSession()
    try:
        ban = _active_connect_ban(db, session['user_id'])
        if ban:
            return jsonify({
                'error': 'Your Connect access is suspended.',
                'reason': ban.reason,
                'permanent': ban.expires_at is None,
                'expires_at': ban.expires_at.isoformat() if ban.expires_at else None,
            }), 403
    finally:
        db.close()
    return None


def _user_disc_row(user_id):
    db   = DBSession()
    user = db.query(User).filter_by(id=user_id).first()
    db.close()
    if not user:
        return None
    return user


def _save_user_discs(user, db=None):
    owns = db is not None
    if not owns:
        db = DBSession()
    try:
        db.add(user)
        db.commit()
    finally:
        if not owns:
            db.close()


def _device_has_claimed_bonus(device_id, db=None):
    close_db = db is None
    if close_db:
        db = DBSession()
    try:
        claim = db.query(DeviceBonusClaim).filter_by(device_id=device_id).first()
        return claim is not None
    finally:
        if close_db:
            db.close()


def _mark_device_bonus_claimed(device_id, db=None):
    close_db = db is None
    if close_db:
        db = DBSession()
    try:
        db.add(DeviceBonusClaim(device_id=device_id))
        db.commit()
    except Exception:
        if close_db:
            db.rollback()
    finally:
        if close_db:
            db.close()


# ── Anonymous visitor state ───────────────────────────────────────────────────

def _guest_state_device_id():
    return getattr(g, 'device_id', None) or request.cookies.get('aerodynamix_device_id')


def _parse_guest_json(value, fallback=None):
    try:
        parsed = json.loads(value or '[]')
        return parsed if isinstance(parsed, list) else (fallback if fallback is not None else [])
    except (TypeError, ValueError):
        return fallback if fallback is not None else []


def _read_guest_state():
    device_id = _guest_state_device_id()
    if not device_id:
        return {}
    db = GuestStateSession()
    try:
        state = db.query(GuestState).filter_by(device_id=device_id).first()
        if state:
            return {
                'disc_balance': state.disc_balance or 0,
                'purchased_games': _parse_guest_json(state.purchased_games),
                'trading_cards': _parse_guest_json(state.trading_cards),
                'purchased_themes': _parse_guest_json(state.purchased_themes),
                'media_unlocked': bool(state.media_unlocked),
        'full_access': bool(state.full_access),
                'last_daily_login': state.last_daily_login,
                'last_card_pack': state.last_card_pack,
            }
        # Read old signed-cookie state once so it can be migrated on the next write.
        return {
            'disc_balance': int(session.get('disc_balance', 0) or 0),
            'purchased_games': _parse_guest_json(session.get('purchased_games')),
            'trading_cards': session.get('trading_cards', []),
            'purchased_themes': _parse_guest_json(session.get('purchased_themes')),
            'media_unlocked': bool(session.get('media_unlocked', False)),
            'full_access': bool(session.get('authorized', False)),
            'last_daily_login': _parse_guest_datetime(session.get('last_daily_login')),
            'last_card_pack': _parse_guest_datetime(session.get('last_daily_card_pack')),
        }
    finally:
        db.close()


def _parse_guest_datetime(value):
    if not value:
        return None
    if isinstance(value, datetime.datetime):
        return value
    try:
        return datetime.datetime.fromisoformat(value)
    except (TypeError, ValueError):
        return None


def _clear_legacy_guest_session():
    for key in (
        'disc_balance', 'purchased_games', 'trading_cards',
        'purchased_themes', 'media_unlocked', 'full_access', 'last_daily_login',
        'last_daily_card_pack',
    ):
        session.pop(key, None)


def _update_guest_state(**changes):
    device_id = _guest_state_device_id()
    if not device_id:
        return
    current = _read_guest_state()
    db = GuestStateSession()
    try:
        state = db.query(GuestState).filter_by(device_id=device_id).first()
        if not state:
            state = GuestState(
                device_id=device_id,
                disc_balance=int(current.get('disc_balance', 0) or 0),
                purchased_games=json.dumps(current.get('purchased_games', [])),
                trading_cards=json.dumps(current.get('trading_cards', [])),
                purchased_themes=json.dumps(current.get('purchased_themes', [])),
                media_unlocked=bool(current.get('media_unlocked', False)),
                full_access=bool(current.get('full_access', False)),
                last_daily_login=current.get('last_daily_login'),
                last_card_pack=current.get('last_card_pack'),
            )
            db.add(state)
        if 'disc_balance' in changes:
            state.disc_balance = max(0, int(changes['disc_balance']))
        if 'purchased_games' in changes:
            state.purchased_games = json.dumps(list(changes['purchased_games']))
        if 'trading_cards' in changes:
            state.trading_cards = json.dumps(list(changes['trading_cards']))
        if 'purchased_themes' in changes:
            state.purchased_themes = json.dumps(list(changes['purchased_themes']))
        if 'media_unlocked' in changes:
            state.media_unlocked = bool(changes['media_unlocked'])
        if 'full_access' in changes:
            state.full_access = bool(changes['full_access'])
        if 'last_daily_login' in changes:
            state.last_daily_login = changes['last_daily_login']
        if 'last_card_pack' in changes:
            state.last_card_pack = changes['last_card_pack']
        db.commit()
        _clear_legacy_guest_session()
    finally:
        db.close()


def _delete_guest_state():
    device_id = _guest_state_device_id()
    if not device_id:
        return
    db = GuestStateSession()
    try:
        state = db.query(GuestState).filter_by(device_id=device_id).first()
        if state:
            db.delete(state)
            db.commit()
        _clear_legacy_guest_session()
    finally:
        db.close()


def _get_session_discs():
    return int(_read_guest_state().get('disc_balance', 0) or 0)


def _set_session_discs(amount):
    _update_guest_state(disc_balance=max(0, int(amount)))


def _has_full_access():
    """Alternate access includes games and site features, not unlimited Discs."""
    if session.get('authorized') is True or session.get('authorized') == 'true':
        return True
    if session.get('user_id'):
        db = DBSession()
        try:
            user = db.query(User).filter_by(id=session['user_id']).first()
            return bool(user and user.full_access)
        finally:
            db.close()
    return bool(_read_guest_state().get('full_access', False))


def _get_session_last_daily():
    return _parse_guest_datetime(_read_guest_state().get('last_daily_login'))


def _set_session_last_daily(dt):
    _update_guest_state(last_daily_login=dt)


def _get_session_last_card_pack():
    return _parse_guest_datetime(_read_guest_state().get('last_card_pack'))


def _set_session_last_card_pack(dt):
    _update_guest_state(last_card_pack=dt)


PACIFIC_TZ = ZoneInfo('America/Los_Angeles')
DAILY_CLAIM_REWARD = 100


def _daily_claim_status(last_claim):
    """Daily claims reset at 12:00 AM America/Los_Angeles."""
    now = datetime.datetime.now(datetime.timezone.utc)
    today_pacific = now.astimezone(PACIFIC_TZ).date()
    last_date = None
    if last_claim:
        if last_claim.tzinfo is None:
            last_claim = last_claim.replace(tzinfo=datetime.timezone.utc)
        last_date = last_claim.astimezone(PACIFIC_TZ).date()
    next_midnight = datetime.datetime.combine(
        today_pacific + datetime.timedelta(days=1),
        datetime.time.min,
        tzinfo=PACIFIC_TZ,
    ).astimezone(datetime.timezone.utc)
    return last_date != today_pacific, next_midnight


def _daily_claim_payload(last_claim):
    available, next_claim_at = _daily_claim_status(last_claim)
    return {
        'daily_available': available,
        'next_claim_at': next_claim_at.isoformat(),
    }


TRADING_CARD_PACK_COST = 100
RARITY_STYLES = {
    'Common': {'accent': '#ffffff', 'glow': 0},
    'Uncommon': {'accent': '#42d979', 'glow': 0},
    'Rare': {'accent': '#3997ff', 'glow': 0},
    'Epic': {'accent': '#a85cff', 'glow': 1},
    'Legendary': {'accent': '#ffd447', 'glow': 2},
    'Mythic': {'accent': '#d94b62', 'glow': 3},
    'GODLY': {'accent': '#ff4bd8', 'glow': 4},
    'Secret': {'accent': '#ffffff', 'glow': 5},
}
CARD_SELL_VALUES = {
    'COMMON': 10,
    'UNCOMMON': 15,
    'RARE': 20,
    'EPIC': 25,
    'LEGENDARY': 50,
    'MYTHIC': 100,
    'GODLY': 500,
    'SECRET': 3000,
}

# Cards are built from the same game art shown in the Games shop.
# Cards in the Aerodynamix set use the rarity odds shown in the shop.
# The per-card values divide each rarity's target chance evenly across the
# cards in that rarity.
AERODYNAMIX_CARD_POOL = [
    # ── Common ──────────────────────────────────────────────────────────────
    {'name': 'Run 3',              'image': 'images/run-3.jpg',              'rarity': 'Common',   'number': '001'},
    {'name': 'Drive Mad',          'image': 'images/drive-mad.jpg',          'rarity': 'Common',   'number': '002'},
    {'name': 'Retro Bowl',         'image': 'images/retro-bowl.jpg',         'rarity': 'Common',   'number': '003'},
    {'name': 'Adventure Capitalist','image': 'images/adventure-capitalist.png','rarity': 'Common', 'number': '004'},
    {'name': 'Cookie Clicker',     'image': 'images/cookie-clicker.png',     'rarity': 'Common',   'number': '005'},
    {'name': 'Crossy Road',        'image': 'images/crossy-road.png',        'rarity': 'Common',   'number': '006'},
    {'name': 'Duck Life',          'image': 'images/duck-life.png',          'rarity': 'Common',   'number': '007'},
    {'name': 'Fruit Ninja',        'image': 'images/fruit-ninja.png',        'rarity': 'Common',   'number': '008'},
    {'name': 'Sandboxels',         'image': 'images/sandboxels.png',         'rarity': 'Common',   'number': '009'},
    {'name': 'Hobo 1',             'image': 'images/hobo-1.png',             'rarity': 'Common',   'number': '010'},
    {'name': 'Hobo 2',             'image': 'images/hobo-2.png',             'rarity': 'Common',   'number': '011'},
    # ── Uncommon ────────────────────────────────────────────────────────────
    {'name': 'Slope',              'image': 'images/slope.jpg',              'rarity': 'Uncommon', 'number': '012'},
    {'name': 'Minecraft',          'image': 'images/mc.png',                 'rarity': 'Uncommon', 'number': '013'},
    {'name': 'Subway Surfers SF',  'image': 'images/subway-surfers-sf.jpg',  'rarity': 'Uncommon', 'number': '014'},
    {'name': 'Gladihoppers',       'image': 'images/gladihoppers.jpg',       'rarity': 'Uncommon', 'number': '015'},
    {'name': "Papa's Freezeria",   'image': 'images/papasfreezeria.png',     'rarity': 'Uncommon', 'number': '016'},
    {'name': 'Hobo 3',             'image': 'images/hobo-3.png',             'rarity': 'Uncommon', 'number': '017'},
    {'name': 'Hobo 4',             'image': 'images/hobo-4.png',             'rarity': 'Uncommon', 'number': '018'},
    # ── Rare ────────────────────────────────────────────────────────────────
    {'name': 'Super Smash Flash',  'image': 'images/supersmashflash.jpg',    'rarity': 'Rare',     'number': '019'},
    {'name': "Papa's Pizzeria",    'image': 'images/papaspizzeria.png',      'rarity': 'Rare',     'number': '020'},
    {'name': 'Hobo 5',             'image': 'images/hobo-5.png',             'rarity': 'Rare',     'number': '022'},
    {'name': 'Hobo 6',             'image': 'images/hobo-6.png',             'rarity': 'Rare',     'number': '023'},
    # ── Epic ────────────────────────────────────────────────────────────────
    {'name': 'Binding of Isaac',   'image': 'images/binding-of-isaac.png',   'rarity': 'Epic',     'number': '021'},
    {'name': 'Friday Night Funkin\u2019', 'image': 'images/fridaynightfunkin.png', 'rarity': 'Epic', 'number': '024'},
    {'name': 'Run 2',              'image': 'images/run-2.png',              'rarity': 'Epic',     'number': '025'},
    {'name': 'Hobo 7',             'image': 'images/hobo-7.png',             'rarity': 'Epic',     'number': '027'},
    # ── Legendary ───────────────────────────────────────────────────────────
    {'name': 'Pico\u2019s School', 'image': 'images/picoschool.png',         'rarity': 'Legendary','number': '028'},
    {'name': "World's Hardest Game",'image': 'images/worldshardestgame.png', 'rarity': 'Legendary','number': '029'},
    # ── Mythic ──────────────────────────────────────────────────────────────
    {'name': 'Alien Hominid',      'image': 'images/alien-hominid.png',      'rarity': 'Mythic',   'number': '030'},
    {'name': 'Geometry Dash Lite', 'image': 'images/geometry-dash-lite.jpg', 'rarity': 'Mythic',   'number': '031'},
    # ── GODLY ───────────────────────────────────────────────────────────────
    {'name': 'Doki Doki Literature Club', 'image': 'images/doki-doki-literature-club.jpg', 'rarity': 'GODLY', 'number': '026'},
    {'name': 'DOOM',               'image': 'images/doom.png',               'rarity': 'GODLY',    'number': '032'},
    # ── SECRET ──────────────────────────────────────────────────────────────
    {'name': 'THE GREATEST GAME OF ALL TIME', 'image': 'images/greatest-game-square.svg', 'rarity': 'Secret', 'number': '033'},
]
for _card in AERODYNAMIX_CARD_POOL:
    _card.update(RARITY_STYLES[_card['rarity']])

# Weights keep per-rarity drop-rate percentages constant; each card within a
# rarity shares that rarity's total weight equally.
# Common 50% (11 cards), Uncommon 20% (7), Rare 12% (4), Epic 7% (4),
# Legendary 5% (2), Mythic 4% (2), GODLY 2% (2). Secret is intentionally
# omitted from the public odds and has a hidden 0.0000000001% pull chance.
SECRET_CARD_WEIGHT = 0.0000000001
AERODYNAMIX_CARD_WEIGHTS = [
    *([50 / 11] * 11),  # Common
    *([20 / 7]  * 7),   # Uncommon
    *([12 / 4]  * 4),   # Rare
    *([7  / 4]  * 4),   # Epic
    *([5  / 2]  * 2),   # Legendary
    *([4  / 2]  * 2),   # Mythic
    *([2  / 2]  * 2),   # GODLY
    SECRET_CARD_WEIGHT,  # Secret (hidden)
]


def _get_session_trading_cards():
    cards = _read_guest_state().get('trading_cards', [])
    return cards if isinstance(cards, list) else []


def _set_session_trading_cards(cards):
    _update_guest_state(trading_cards=cards)


def _merge_session_trading_cards(user, db):
    """Transfer durable guest progress into an authenticated account."""
    guest = _read_guest_state()
    guest_cards = guest.get('trading_cards', [])
    guest_games = guest.get('purchased_games', [])
    guest_themes = guest.get('purchased_themes', [])

    owned_cards = _load_card_inventory(user)
    owned_card_ids = {str(card['id']) for card in owned_cards}
    merged_cards = owned_cards + [
        card for card in guest_cards
        if isinstance(card, dict)
        and card.get('id')
        and str(card['id']) not in owned_card_ids
    ]
    owned_games = _parse_guest_json(user.purchased_games)
    owned_themes = _parse_guest_json(user.purchased_themes)

    _store_card_inventory(user, merged_cards)
    user.purchased_games = json.dumps(list(dict.fromkeys(owned_games + guest_games)))
    user.purchased_themes = json.dumps(list(dict.fromkeys(owned_themes + guest_themes)))
    user.disc_balance = (user.disc_balance or 0) + int(guest.get('disc_balance', 0) or 0)
    user.media_unlocked = bool(user.media_unlocked or guest.get('media_unlocked', False))
    user.full_access = bool(user.full_access or guest.get('full_access', False))
    if not user.last_daily_login and guest.get('last_daily_login'):
        user.last_daily_login = guest['last_daily_login']
    if not user.last_daily_card_pack and guest.get('last_card_pack'):
        user.last_daily_card_pack = guest['last_card_pack']
    db.add(user)
    db.commit()
    db.refresh(user)
    _delete_guest_state()
    return bool(guest_cards or guest_games or guest_themes or guest.get('disc_balance')
                or guest.get('media_unlocked') or guest.get('full_access'))


def _get_session_purchased_themes():
    return _read_guest_state().get('purchased_themes', [])


def _set_session_purchased_themes(themes):
    _update_guest_state(purchased_themes=themes)


def _is_session_media_unlocked():
    return bool(_read_guest_state().get('media_unlocked', False))


def _set_session_media_unlocked():
    _update_guest_state(media_unlocked=True)


def _get_session_purchased_games():
    return _read_guest_state().get('purchased_games', [])


def _set_session_purchased_games(games):
    _update_guest_state(purchased_games=games)


def _anonymous_discs_dict():
    last = _get_session_last_daily()
    daily_available, next_claim_at = _daily_claim_status(last)
    card_pack_available, next_card_pack_at = _daily_claim_status(_get_session_last_card_pack())
    return {
        'id':               None,
        'username':         None,
        'bio':              '',
        'pfp_url':          None,
        'pfp_offset_x':     50.0,
        'pfp_offset_y':     50.0,
        'disc_balance':     _get_session_discs(),
        'media_unlocked': _is_session_media_unlocked(),
        'purchased_themes': _get_session_purchased_themes(),
        'daily_available': daily_available,
        'next_claim_at': next_claim_at.isoformat(),
        'card_pack_available': card_pack_available,
        'next_card_pack_at': next_card_pack_at.isoformat(),
    }


def _maybe_award_first_login_bonus(user, db):
    """Give one-time 200-disc bonus when an account is first used on a device."""
    if user.first_login_bonus_claimed:
        return False
    device_id = getattr(g, 'device_id', None)
    if not device_id or _device_has_claimed_bonus(device_id, db):
        return False
    user.disc_balance = (user.disc_balance or 0) + 200
    user.first_login_bonus_claimed = True
    db.add(user)
    db.commit()
    db.refresh(user)
    _mark_device_bonus_claimed(device_id, db)
    return True


@app.teardown_appcontext
def remove_session(exception=None):
    DBSession.remove()


@app.before_request
def ensure_device_id():
    g.device_id = request.cookies.get('aerodynamix_device_id')
    if not g.device_id:
        g.device_id = uuid.uuid4().hex


@app.after_request
def add_no_cache_headers(response):
    response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, max-age=0'
    response.headers['Pragma']  = 'no-cache'
    response.headers['Expires'] = '0'
    request_origin = request.headers.get('Origin', '').rstrip('/')
    if request_origin in ALLOWED_CORS_ORIGINS:
        response.headers['Access-Control-Allow-Origin'] = request_origin
        response.headers['Access-Control-Allow-Methods'] = 'GET, POST, DELETE, OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
        response.headers['Access-Control-Allow-Credentials'] = 'true'
        response.headers['Vary'] = 'Origin'
    if not request.cookies.get('aerodynamix_device_id'):
        response.set_cookie(
            'aerodynamix_device_id',
            g.device_id,
            max_age=365 * 24 * 60 * 60,
            httponly=True,
            path='/',
            samesite='Lax'
        )
    return response


@app.errorhandler(RequestEntityTooLarge)
def handle_oversized_request(error):
    if request.path.startswith('/api/'):
        return jsonify({
            'error': 'That upload is larger than the 30 MB limit.'
        }), 413
    return error


@app.route('/')
def index():
    return send_from_directory('docs', 'index.html')


@app.route('/attached_assets/<path:filename>')
def attached_game_asset(filename):
    return send_from_directory('attached_assets', filename)


@app.route('/aerodynamix-games-offline.html')
def offline_games_export():
    return send_from_directory('.', 'aerodynamix-games-offline.html')


def _stream_lite_export_with_patch():
    marker = b'<main class="grid" id="grid"></main>'
    buffer = b''
    source_path = os.path.join(app.root_path, 'aerodynamix-lite-tips.html')
    with open(source_path, 'rb') as source:
        while chunk := source.read(64 * 1024):
            data = buffer + chunk
            marker_index = data.find(marker)
            if marker_index >= 0:
                marker_end = marker_index + len(marker)
                yield data[:marker_end]
                yield b'<script src="/aerodynamix-lite-settings.js"></script>'
                yield data[marker_end:]
                yield from source
                return
            keep = len(marker) - 1
            if len(data) > keep:
                yield data[:-keep]
                buffer = data[-keep:]
            else:
                buffer = data
    if buffer:
        yield buffer


def _stream_standalone_export_with_patch():
    marker = b'</body>'
    buffer = b''
    workspace_root = os.path.dirname(os.path.dirname(app.root_path))
    source_path = os.path.join(
        workspace_root,
        'attached_assets',
        'presentation_1787450952428.html',
    )
    with open(source_path, 'rb') as source:
        while chunk := source.read(64 * 1024):
            data = buffer + chunk
            marker_index = data.find(marker)
            if marker_index >= 0:
                yield data[:marker_index]
                yield b'<script src="/aerodynamix-standalone-patch.js"></script>'
                yield data[marker_index:]
                yield from source
                return
            keep = len(marker) - 1
            if len(data) > keep:
                yield data[:-keep]
                buffer = data[-keep:]
            else:
                buffer = data
    if buffer:
        yield buffer


@app.route('/aerodynamix-lite/')
def aerodynamix_lite_export():
    return Response(
        stream_with_context(_stream_lite_export_with_patch()),
        content_type='text/html; charset=utf-8'
    )


@app.route('/aerodynamix-standalone/')
def aerodynamix_standalone_export():
    return Response(
        stream_with_context(_stream_standalone_export_with_patch()),
        content_type='text/html; charset=utf-8',
    )


@app.route('/aerodynamix-standalone-patch.js')
def aerodynamix_standalone_patch_asset():
    return send_from_directory('.', 'aerodynamix-standalone-patch.js')


@app.route('/aerodynamix-lite-tips.html')
def aerodynamix_lite_tips_file():
    return send_from_directory('.', 'aerodynamix-lite-tips.html')


@app.route('/download/aerodynamix-lite.html')
def download_aerodynamix_lite_file():
    return send_from_directory(
        '.',
        'aerodynamix-lite-tips.html',
        as_attachment=True,
        download_name='aerodynamix-lite-fixed.html',
    )


@app.route('/aerodynamix-lite-settings.html')
def aerodynamix_lite_settings_file():
    return send_from_directory('.', 'aerodynamix-lite-tips.html')


@app.route('/aerodynamix-lite-settings.js')
def aerodynamix_lite_settings_asset():
    return send_from_directory('.', 'aerodynamix-lite-settings.js')


@app.route('/aerodynamix-one-file.html')
def aerodynamix_one_file_export():
    return send_from_directory('.', 'aerodynamix-one-file.html')


@app.route('/aerodynamix-lite-connect/')
def aerodynamix_lite_connect_export():
    return send_from_directory('docs/aerodynamix-lite-connect', 'index.html')


@app.route('/aerodynamix-refactor/')
def aerodynamix_refactor_export():
    return send_from_directory('docs/aerodynamix-refactor', 'index.html')


@app.route('/aerodynamix-offline/')
def aerodynamix_offline_export():
    return send_from_directory('docs/aerodynamix-offline', 'index.html')


@app.route('/aerodynamix-offline/<path:filename>')
def aerodynamix_offline_asset(filename):
    return send_from_directory('docs/aerodynamix-offline', filename)


# ── Auth ──────────────────────────────────────────────────────────────────────

@app.route('/api/register', methods=['POST'])
def register():
    data     = request.get_json()
    username = (data.get('username') or '').strip()
    password = (data.get('password') or '').strip()

    db = DBSession()
    try:
        if not username or not password:
            return jsonify({'error': 'Username and password are required'}), 400
        if len(username) < 3 or len(username) > 20:
            return jsonify({'error': 'Username must be 3–20 characters'}), 400
        if len(password) < 4:
            return jsonify({'error': 'Password must be at least 4 characters'}), 400
        if not re.match(r'^[a-zA-Z0-9_]+$', username):
            return jsonify({'error': 'Username can only contain letters, numbers, and underscores'}), 400

        password_hash = generate_password_hash(password)
        user = User(username=username, password_hash=password_hash)
        db.add(user)
        db.commit()
        db.refresh(user)
        _merge_session_trading_cards(user, db)
        _maybe_award_first_login_bonus(user, db)
        db.commit()
        session['user_id']  = user.id
        session['username'] = user.username
        return jsonify({'success': True, 'user': user_to_dict(user)})
    except Exception as e:
        db.rollback()
        app.logger.error('Registration error: %s', e)
        if 'unique' in str(e).lower() or 'duplicate' in str(e).lower():
            return jsonify({'error': 'Username already taken'}), 409
        return jsonify({'error': 'Could not create account'}), 500
    finally:
        db.close()


@app.route('/api/login', methods=['POST'])
def login():
    data     = request.get_json()
    username = (data.get('username') or '').strip()
    password = (data.get('password') or '').strip()

    db = DBSession()
    try:
        user = db.query(User).filter_by(username=username).first()
        if user and check_password_hash(user.password_hash, password):
            _merge_session_trading_cards(user, db)
            _maybe_award_first_login_bonus(user, db)
            db.commit()
            session['user_id'] = user.id
            session['username'] = user.username
            return jsonify({'success': True, 'user': user_to_dict(user)})
        return jsonify({'error': 'Invalid username or password'}), 401
    finally:
        db.close()


@app.route('/api/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({'success': True})


@app.route('/api/me', methods=['GET'])
def me():
    if 'user_id' not in session:
        return jsonify({'user': None})
    db   = DBSession()
    user = db.query(User).filter_by(id=session['user_id']).first()
    if user:
        ban = _active_connect_ban(db, user.id)
        payload = user_to_dict(user)
        payload['connect_ban'] = _connect_ban_response(ban)
        payload['can_moderate_connect'] = _is_yandhi(user)
        db.close()
        return jsonify({'user': payload})
    db.close()
    return jsonify({'user': None})


@app.route('/api/connect-proxy/<path:upstream_path>', methods=['GET', 'POST', 'DELETE', 'OPTIONS'])
def connect_proxy(upstream_path):
    """Forward standalone Connect API calls through the hosted backend."""
    if request.method == 'OPTIONS':
        return ('', 204)
    target = f'{CONNECT_UPSTREAM_ORIGIN}/{upstream_path}'
    if request.query_string:
        target += '?' + request.query_string.decode('utf-8', 'replace')
    headers = {}
    for name in ('Accept', 'Content-Type', 'Cookie'):
        value = request.headers.get(name)
        if value:
            headers[name] = value
    proxy_request = urllib.request.Request(
        target,
        data=request.get_data() if request.method != 'GET' else None,
        headers=headers,
        method=request.method,
    )
    attempts = 2 if request.method in {'GET', 'DELETE'} else 1
    for attempt in range(attempts):
        try:
            with urllib.request.urlopen(
                proxy_request,
                timeout=CONNECT_PROXY_TIMEOUT_SECONDS
            ) as upstream:
                body = upstream.read()
                status = upstream.status
                response_headers = {
                    name: value
                    for name, value in upstream.headers.items()
                    if name.lower() in {'content-type', 'set-cookie'}
                }
                break
        except urllib.error.HTTPError as upstream:
            body = upstream.read()
            status = upstream.code
            response_headers = {
                name: value
                for name, value in upstream.headers.items()
                if name.lower() in {'content-type', 'set-cookie'}
            }
            if status in {502, 503, 504} and attempt + 1 < attempts:
                continue
            break
        except (urllib.error.URLError, TimeoutError) as error:
            if attempt + 1 < attempts:
                continue
            reason = error.reason if hasattr(error, 'reason') else error
            return jsonify({'error': f'Connect service unavailable: {reason}'}), 502
    return Response(body, status=status, headers=response_headers)


@app.route('/api/update-proxy/<path:update_path>', methods=['GET', 'OPTIONS'])
def update_proxy(update_path):
    """Serve the fixed public update host through a read-only gateway."""
    if request.method == 'OPTIONS':
        return ('', 204, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        })
    target = f'{UPDATE_UPSTREAM_ORIGIN}/{update_path}'
    if request.query_string:
        target += '?' + request.query_string.decode('utf-8', 'replace')
    proxy_request = urllib.request.Request(
        target,
        headers={'Accept': request.headers.get('Accept', '*/*')},
        method='GET',
    )
    try:
        with urllib.request.urlopen(proxy_request, timeout=30) as upstream:
            body = upstream.read()
            status = upstream.status
            response_headers = {
                name: value
                for name, value in upstream.headers.items()
                if name.lower() in {'content-type', 'content-disposition', 'content-length'}
            }
    except urllib.error.HTTPError as upstream:
        body = upstream.read()
        status = upstream.code
        response_headers = {
            name: value
            for name, value in upstream.headers.items()
            if name.lower() in {'content-type', 'content-disposition', 'content-length'}
        }
    except (urllib.error.URLError, TimeoutError) as error:
        return jsonify({'error': f'Update service unavailable: {error.reason if hasattr(error, "reason") else error}'}), 502
    response_headers['Access-Control-Allow-Origin'] = '*'
    return Response(body, status=status, headers=response_headers)


@app.route('/api/moderation/bans', methods=['POST'])
def create_connect_ban():
    if 'user_id' not in session:
        return jsonify({'error': 'Not logged in'}), 401
    db = DBSession()
    try:
        issuer = _current_user(db)
        if not _is_yandhi(issuer):
            return jsonify({'error': 'Only YANDHI can manage Connect bans.'}), 403
        data = request.get_json(silent=True) or {}
        username = str(data.get('username') or '').strip()
        reason = str(data.get('reason') or '').strip()[:500]
        permanent = bool(data.get('permanent'))
        if not username or not reason:
            return jsonify({'error': 'A username and reason are required.'}), 400
        target = db.query(User).filter_by(username=username).first()
        if not target:
            return jsonify({'error': 'User not found.'}), 404
        if target.id == issuer.id:
            return jsonify({'error': 'YANDHI cannot ban this account.'}), 400
        expires_at = None
        if not permanent:
            try:
                duration_minutes = int(data.get('duration_minutes'))
            except (TypeError, ValueError):
                duration_minutes = 0
            if duration_minutes < 1 or duration_minutes > 52560000:
                return jsonify({'error': 'Choose a duration from 1 minute to 100 years, or permanent.'}), 400
            expires_at = datetime.datetime.utcnow() + datetime.timedelta(minutes=duration_minutes)
        now = datetime.datetime.utcnow()
        db.query(ConnectBan).filter(
            ConnectBan.target_id == target.id,
            ConnectBan.revoked_at.is_(None),
            ((ConnectBan.expires_at.is_(None)) | (ConnectBan.expires_at > now)),
        ).update({'revoked_at': now}, synchronize_session=False)
        ban = ConnectBan(target_id=target.id, issuer_id=issuer.id, reason=reason, expires_at=expires_at)
        db.add(ban)
        db.commit()
        return jsonify({'success': True, 'ban': _connect_ban_response(ban)})
    except Exception:
        db.rollback()
        return jsonify({'error': 'Could not create ban.'}), 500
    finally:
        db.close()


@app.route('/api/moderation/users', methods=['GET'])
def moderation_users():
    db = DBSession()
    try:
        viewer = _current_user(db)
        if not _is_yandhi(viewer):
            return jsonify({'error': 'Only YANDHI can access the Dev Panel.'}), 403
        query = str(request.args.get('q') or '').strip()
        users_query = db.query(User)
        if query:
            users_query = users_query.filter(User.username.ilike(f'%{query[:50]}%'))
        users = users_query.order_by(User.username.asc()).limit(50).all()
        rows = []
        for user in users:
            ban = _active_connect_ban(db, user.id)
            rows.append({
                'id': user.id,
                'username': user.username,
                'is_verified': bool(user.is_verified),
                'pfp_url': f'/api/pfp/{user.id}' if user.pfp_data else None,
                'active_ban': {
                    'id': ban.id,
                    'reason': ban.reason,
                    'permanent': ban.expires_at is None,
                    'expires_at': ban.expires_at.isoformat() if ban.expires_at else None,
                } if ban else None,
            })
        return jsonify({'users': rows})
    finally:
        db.close()


@app.route('/api/moderation/bans', methods=['GET'])
def moderation_bans():
    db = DBSession()
    try:
        viewer = _current_user(db)
        if not _is_yandhi(viewer):
            return jsonify({'error': 'Only YANDHI can access the Dev Panel.'}), 403
        now = datetime.datetime.utcnow()
        bans = db.query(ConnectBan).filter(
            ConnectBan.revoked_at.is_(None),
            ((ConnectBan.expires_at.is_(None)) | (ConnectBan.expires_at > now)),
        ).order_by(ConnectBan.created_at.desc()).all()
        return jsonify({'bans': [{
            'id': ban.id,
            'username': db.query(User.username).filter_by(id=ban.target_id).scalar(),
            'reason': ban.reason,
            'permanent': ban.expires_at is None,
            'expires_at': ban.expires_at.isoformat() if ban.expires_at else None,
            'created_at': ban.created_at.isoformat() if ban.created_at else None,
        } for ban in bans]})
    finally:
        db.close()


@app.route('/api/moderation/bans/<int:ban_id>', methods=['DELETE'])
def revoke_connect_ban(ban_id):
    db = DBSession()
    try:
        viewer = _current_user(db)
        if not _is_yandhi(viewer):
            return jsonify({'error': 'Only YANDHI can manage Connect bans.'}), 403
        ban = db.query(ConnectBan).filter_by(id=ban_id).first()
        if not ban or ban.revoked_at is not None:
            return jsonify({'error': 'Active ban not found.'}), 404
        ban.revoked_at = datetime.datetime.utcnow()
        db.commit()
        return jsonify({'success': True})
    except Exception:
        db.rollback()
        return jsonify({'error': 'Could not unban user.'}), 500
    finally:
        db.close()


@app.route('/api/moderation/users/<int:user_id>/verification', methods=['POST'])
def set_user_verification(user_id):
    db = DBSession()
    try:
        viewer = _current_user(db)
        if not _is_yandhi(viewer):
            return jsonify({'error': 'Only YANDHI can manage verification.'}), 403
        if viewer.id == user_id:
            return jsonify({'error': 'YANDHI verification is managed automatically.'}), 400
        target = db.query(User).filter_by(id=user_id).first()
        if not target:
            return jsonify({'error': 'User not found.'}), 404
        data = request.get_json(silent=True) or {}
        if 'verified' not in data:
            return jsonify({'error': 'Choose whether the user is verified.'}), 400
        target.is_verified = bool(data['verified'])
        db.commit()
        return jsonify({'success': True, 'username': target.username, 'is_verified': bool(target.is_verified)})
    except Exception:
        db.rollback()
        return jsonify({'error': 'Could not update verification.'}), 500
    finally:
        db.close()


# ── Profile ───────────────────────────────────────────────────────────────────

@app.route('/api/pfp/<int:user_id>', methods=['GET'])
def get_pfp(user_id):
    db   = DBSession()
    user = db.query(User).filter_by(id=user_id).first()
    db.close()
    if user and user.pfp_data:
        return Response(user.pfp_data, mimetype=user.pfp_mimetype or 'image/jpeg')
    abort(404)


@app.route('/api/profile/pfp', methods=['POST'])
def update_pfp():
    if 'user_id' not in session:
        return jsonify({'error': 'Not logged in'}), 401
    if 'pfp' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    file = request.files['pfp']
    if not file or not file.filename or not allowed_file(file.filename):
        return jsonify({'error': 'Invalid file type'}), 400

    try:
        offset_x = float(request.form.get('offset_x', 50))
        offset_y = float(request.form.get('offset_y', 50))
    except (TypeError, ValueError):
        offset_x, offset_y = 50.0, 50.0

    offset_x = max(0.0, min(100.0, offset_x))
    offset_y = max(0.0, min(100.0, offset_y))

    data     = file.read()
    mimetype = mimetypes.guess_type(file.filename)[0] or 'image/jpeg'

    db = DBSession()
    try:
        user              = db.query(User).filter_by(id=session['user_id']).first()
        user.pfp_data     = data
        user.pfp_mimetype = mimetype
        user.pfp_offset_x = offset_x
        user.pfp_offset_y = offset_y
        db.commit()
        return jsonify({
            'success':  True,
            'pfp_url':  f'/api/pfp/{user.id}',
            'offset_x': offset_x,
            'offset_y': offset_y,
        })
    except Exception:
        db.rollback()
        return jsonify({'error': 'Could not update profile picture'}), 500
    finally:
        db.close()


@app.route('/api/profile/pfp-position', methods=['POST'])
def update_pfp_position():
    if 'user_id' not in session:
        return jsonify({'error': 'Not logged in'}), 401

    data = request.get_json() or {}
    try:
        offset_x = float(data.get('offset_x', 50))
        offset_y = float(data.get('offset_y', 50))
    except (TypeError, ValueError):
        offset_x, offset_y = 50.0, 50.0

    offset_x = max(0.0, min(100.0, offset_x))
    offset_y = max(0.0, min(100.0, offset_y))

    db = DBSession()
    try:
        user              = db.query(User).filter_by(id=session['user_id']).first()
        user.pfp_offset_x = offset_x
        user.pfp_offset_y = offset_y
        db.commit()
        return jsonify({'success': True, 'offset_x': offset_x, 'offset_y': offset_y})
    except Exception:
        db.rollback()
        return jsonify({'error': 'Could not update position'}), 500
    finally:
        db.close()


@app.route('/api/profile/bio', methods=['POST'])
def update_bio():
    if 'user_id' not in session:
        return jsonify({'error': 'Not logged in'}), 401

    data = request.get_json() or {}
    bio  = (data.get('bio') or '').strip()[:200]

    db = DBSession()
    try:
        user     = db.query(User).filter_by(id=session['user_id']).first()
        user.bio = bio
        db.commit()
        return jsonify({'success': True})
    except Exception:
        db.rollback()
        return jsonify({'error': 'Could not update bio'}), 500
    finally:
        db.close()


@app.route('/api/users/<username>', methods=['GET'])
def get_user_profile(username):
    db   = DBSession()
    user = db.query(User).filter_by(username=username).first()
    if not user:
        db.close()
        return jsonify({'error': 'User not found'}), 404

    posts = db.query(Post).filter_by(user_id=user.id).order_by(Post.created_at.desc()).all()
    posts_data = [
        {
            'id':         p.id,
            'text':       p.text,
            'image_url':  f'/uploads/{p.image_filename}' if p.image_filename else None,
            'created_at': p.created_at.strftime('%Y-%m-%d %H:%M:%S') if p.created_at else None,
        }
        for p in posts
    ]

    viewer_id = session.get('user_id')
    viewer = db.query(User).filter_by(id=viewer_id).first() if viewer_id else None
    can_moderate_connect = _is_yandhi(viewer) and viewer.id != user.id
    target_ban = _active_connect_ban(db, user.id) if can_moderate_connect else None
    friend_status = 'none'
    friendship_id = None
    if viewer_id and viewer_id != user.id:
        f = db.query(Friendship).filter(
            ((Friendship.requester_id == viewer_id) & (Friendship.addressee_id == user.id)) |
            ((Friendship.requester_id == user.id) & (Friendship.addressee_id == viewer_id))
        ).first()
        if f:
            friendship_id = f.id
            if f.status == 'accepted':
                friend_status = 'friends'
            elif f.requester_id == viewer_id:
                friend_status = 'pending_sent'
            else:
                friend_status = 'pending_received'
    db.close()

    return jsonify({
        'user':          {
            **user_to_dict(user),
            'created_at': user.created_at.strftime('%b %Y') if user.created_at else None,
        },
        'posts':         posts_data,
        'friend_status': friend_status,
        'friendship_id': friendship_id,
        'can_moderate_connect': can_moderate_connect,
        'active_ban': _connect_ban_response(target_ban) if can_moderate_connect else None,
    })


# ── Dynamix Discs ─────────────────────────────────────────────────────────────

@app.route('/api/discs', methods=['GET'])
def get_discs():
    if 'user_id' in session:
        user = _user_disc_row(session['user_id'])
        if not user:
            return jsonify({'error': 'User not found'}), 404
        return jsonify({'discs': user_to_dict(user)})
    return jsonify({'discs': _anonymous_discs_dict()})


@app.route('/api/access/secret-unlock', methods=['POST'])
def secret_unlock_access():
    """Persist full access for the hidden Shop combo or the mobile access key."""
    data = request.get_json(silent=True) or {}
    submitted_code = str(data.get('code') or '').strip().casefold()
    if submitted_code and submitted_code != 'grad2007':
        return jsonify({'error': 'Incorrect access code.', 'authorized': False}), 401
    if session.get('user_id'):
        db = DBSession()
        try:
            user = db.query(User).filter_by(id=session['user_id']).first()
            if not user:
                return jsonify({'error': 'User not found'}), 404
            user.full_access = True
            db.commit()
        finally:
            db.close()
    else:
        _update_guest_state(full_access=True)
    session['authorized'] = True
    session.pop('free_trial', None)
    return jsonify({'success': True, 'authorized': True})


@app.route('/api/trading-cards', methods=['GET'])
def get_trading_cards():
    if 'user_id' in session:
        db = DBSession()
        try:
            user = db.query(User).filter_by(id=session['user_id']).first()
            if not user:
                return jsonify({'error': 'User not found'}), 404
            return jsonify({'cards': [_card_view(card) for card in _load_card_inventory(user)]})
        finally:
            db.close()
    return jsonify({'cards': _get_session_trading_cards()})


@app.route('/api/trading-cards/purchase-pack', methods=['POST'])
def purchase_trading_card_pack():
    data = request.get_json(silent=True) or {}
    # Alternate access includes the site and games, but card packs use the shared
    # Dynamix Disc balance for every user type.
    full_version = bool(data.get('full_version'))
    pack_cost = TRADING_CARD_PACK_COST
    now = datetime.datetime.now(datetime.timezone.utc)
    cards = random.choices(
        AERODYNAMIX_CARD_POOL,
        weights=AERODYNAMIX_CARD_WEIGHTS,
        k=4,
    )
    awarded = [
        {**card, 'id': str(uuid.uuid4()), 'game': 'Aerodynamix',
         'obtained_at': datetime.datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')}
        for card in cards
    ]

    if 'user_id' in session:
        db = DBSession()
        user = db.query(User).filter_by(id=session['user_id']).first()
        if not user:
            db.close()
            return jsonify({'error': 'User not found'}), 404
        if (user.disc_balance or 0) < pack_cost:
            db.close()
            return jsonify({'error': 'Not enough Dynamix Discs',
                            'disc_balance': user.disc_balance or 0}), 402
        owned = _load_card_inventory(user)
        owned.extend(awarded)
        user.disc_balance = (user.disc_balance or 0) - pack_cost
        _store_card_inventory(user, owned)
        db.commit()
        db.refresh(user)
        result = {'success': True, 'cards': awarded,
                  'disc_balance': user.disc_balance}
        db.close()
        return jsonify(result)

    balance = _get_session_discs()
    if balance < pack_cost:
        return jsonify({'error': 'Not enough Dynamix Discs',
                        'disc_balance': balance}), 402
    owned = _get_session_trading_cards()
    owned.extend(awarded)
    _set_session_trading_cards(owned)
    _set_session_discs(balance - pack_cost)
    result = {'success': True, 'cards': awarded,
              'disc_balance': _get_session_discs()}
    return jsonify(result)


@app.route('/api/trading-cards/sell', methods=['POST'])
def sell_trading_card():
    data = request.get_json(silent=True) or {}
    card_id = str(data.get('card_id') or '').strip()
    if not card_id:
        return jsonify({'error': 'Card ID is required'}), 400

    def remove_card(cards):
        for index, card in enumerate(cards):
            if str(card.get('id', '')) == card_id:
                return cards[:index] + cards[index + 1:], card
        return None, None

    if 'user_id' in session:
        db = DBSession()
        user = db.query(User).filter_by(id=session['user_id']).first()
        if not user:
            db.close()
            return jsonify({'error': 'User not found'}), 404
        owned = _load_card_inventory(user)
        if db.query(TradeCardLock).filter_by(card_id=card_id).first():
            db.close()
            return jsonify({'error': 'This card is reserved in a pending trade. Cancel or finish the trade before selling it.'}), 409
        remaining, card = remove_card(owned)
        if not card:
            db.close()
            return jsonify({'error': 'Card not found'}), 404
        rarity = str(card.get('rarity') or 'Common').upper()
        value = CARD_SELL_VALUES.get(rarity, CARD_SELL_VALUES['COMMON'])
        _store_card_inventory(user, remaining)
        user.disc_balance = (user.disc_balance or 0) + value
        db.commit()
        balance = user.disc_balance
        db.close()
        return jsonify({'success': True, 'sold': card, 'tokens': value, 'disc_balance': balance})

    owned = _get_session_trading_cards()
    remaining, card = remove_card(owned)
    if not card:
        return jsonify({'error': 'Card not found'}), 404
    rarity = str(card.get('rarity') or 'Common').upper()
    value = CARD_SELL_VALUES.get(rarity, CARD_SELL_VALUES['COMMON'])
    _set_session_trading_cards(remaining)
    balance = _get_session_discs() + value
    _set_session_discs(balance)
    return jsonify({'success': True, 'sold': card, 'tokens': value, 'disc_balance': balance})


@app.route('/api/discs/claim', methods=['POST'])
def claim_daily_discs():
    now = datetime.datetime.now(datetime.timezone.utc)

    if 'user_id' in session:
        db = DBSession()
        user = db.query(User).filter_by(id=session['user_id']).first()
        if not user:
            db.close()
            return jsonify({'error': 'User not found'}), 404

        available, next_midnight = _daily_claim_status(user.last_daily_login)
        if not available:
            db.close()
            return jsonify({
                'error': 'Daily bonus already claimed',
                'next_claim_at': next_midnight.isoformat(),
            }), 429

        user.disc_balance = (user.disc_balance or 0) + DAILY_CLAIM_REWARD
        user.last_daily_login = now.replace(tzinfo=None)
        db.commit()
        db.refresh(user)
        db.close()
        return jsonify({
            'success': True, 'disc_balance': user.disc_balance, 'claimed': DAILY_CLAIM_REWARD,
            'reward': DAILY_CLAIM_REWARD,
            **_daily_claim_payload(user.last_daily_login),
        })

    # Anonymous users use session-based balance
    last = _get_session_last_daily()
    available, next_midnight = _daily_claim_status(last)
    if not available:
        return jsonify({
            'error': 'Daily bonus already claimed',
            'next_claim_at': next_midnight.isoformat(),
        }), 429

    new_balance = _get_session_discs() + DAILY_CLAIM_REWARD
    _set_session_discs(new_balance)
    _set_session_last_daily(now.replace(tzinfo=None))
    return jsonify({
        'success': True, 'disc_balance': new_balance, 'claimed': DAILY_CLAIM_REWARD,
        'reward': DAILY_CLAIM_REWARD,
        **_daily_claim_payload(now),
    })


@app.route('/api/discs/spend', methods=['POST'])
def spend_discs():
    data = request.get_json() or {}
    amount = int(data.get('amount', 0))
    feature = (data.get('feature') or '').strip()

    if amount <= 0:
        return jsonify({'error': 'Invalid amount'}), 400
    # Currency has been retired. Keep this legacy endpoint harmless for older
    # clients while never charging an account.
    return jsonify({'success': True, 'disc_balance': 0, 'feature': feature,
                    'spent': 0, 'included': True})

    if 'user_id' in session:
        db = DBSession()
        user = db.query(User).filter_by(id=session['user_id']).first()
        if not user:
            db.close()
            return jsonify({'error': 'User not found'}), 404

        if (user.disc_balance or 0) < amount:
            db.close()
            return jsonify({'error': 'Not enough Dynamix Discs', 'disc_balance': user.disc_balance or 0}), 402

        user.disc_balance = (user.disc_balance or 0) - amount
        db.commit()
        db.refresh(user)
        db.close()
        return jsonify({'success': True, 'disc_balance': user.disc_balance, 'feature': feature, 'spent': amount})

    balance = _get_session_discs()
    if balance < amount:
        return jsonify({'error': 'Not enough Dynamix Discs', 'disc_balance': balance}), 402
    new_balance = balance - amount
    _set_session_discs(new_balance)
    return jsonify({'success': True, 'disc_balance': new_balance, 'feature': feature, 'spent': amount})


@app.route('/api/discs/purchase-theme', methods=['POST'])
def purchase_theme():
    data  = request.get_json() or {}
    theme = (data.get('theme') or '').strip()
    cost  = 200

    if not theme:
        return jsonify({'error': 'Theme name required'}), 400
    return jsonify({'success': True, 'purchased': True, 'included': True,
                    'disc_balance': 0})

    if _has_full_access():
        return jsonify({'success': True, 'purchased': True, 'included': True,
                        'disc_balance': _get_session_discs()})

    if 'user_id' in session:
        db = DBSession()
        user = db.query(User).filter_by(id=session['user_id']).first()
        if not user:
            db.close()
            return jsonify({'error': 'User not found'}), 404

        purchased = json.loads(user.purchased_themes or '[]') if user.purchased_themes else []
        if theme in purchased:
            db.close()
            return jsonify({'success': True, 'purchased': True, 'disc_balance': user.disc_balance or 0})

        if (user.disc_balance or 0) < cost:
            db.close()
            return jsonify({'error': 'Not enough Dynamix Discs', 'disc_balance': user.disc_balance or 0}), 402

        user.disc_balance = (user.disc_balance or 0) - cost
        purchased.append(theme)
        user.purchased_themes = json.dumps(purchased)
        db.commit()
        db.refresh(user)
        db.close()
        return jsonify({'success': True, 'purchased': True, 'disc_balance': user.disc_balance})

    purchased = _get_session_purchased_themes()
    if theme in purchased:
        return jsonify({'success': True, 'purchased': True, 'disc_balance': _get_session_discs()})
    balance = _get_session_discs()
    if balance < cost:
        return jsonify({'error': 'Not enough Dynamix Discs', 'disc_balance': balance}), 402
    purchased.append(theme)
    _set_session_purchased_themes(purchased)
    _set_session_discs(balance - cost)
    return jsonify({'success': True, 'purchased': True, 'disc_balance': _get_session_discs()})


@app.route('/api/discs/unlock-media', methods=['POST'])
def unlock_media_player():
    cost = 200
    return jsonify({'success': True, 'unlocked': True, 'included': True,
                    'disc_balance': 0})

    if _has_full_access():
        return jsonify({'success': True, 'unlocked': True, 'included': True,
                        'disc_balance': _get_session_discs()})

    if 'user_id' in session:
        db = DBSession()
        user = db.query(User).filter_by(id=session['user_id']).first()
        if not user:
            db.close()
            return jsonify({'error': 'User not found'}), 404

        if user.media_unlocked:
            db.close()
            return jsonify({'success': True, 'unlocked': True, 'disc_balance': user.disc_balance or 0})

        if (user.disc_balance or 0) < cost:
            db.close()
            return jsonify({'error': 'Not enough Dynamix Discs', 'disc_balance': user.disc_balance or 0}), 402

        user.disc_balance = (user.disc_balance or 0) - cost
        user.media_unlocked = True
        db.commit()
        db.refresh(user)
        db.close()
        return jsonify({'success': True, 'unlocked': True, 'disc_balance': user.disc_balance})

    if _is_session_media_unlocked():
        return jsonify({'success': True, 'unlocked': True, 'disc_balance': _get_session_discs()})

    balance = _get_session_discs()
    if balance < cost:
        return jsonify({'error': 'Not enough Dynamix Discs', 'disc_balance': balance}), 402
    _set_session_discs(balance - cost)
    _set_session_media_unlocked()
    return jsonify({'success': True, 'unlocked': True, 'disc_balance': _get_session_discs()})


@app.route('/api/discs/purchased-games', methods=['GET'])
def get_purchased_games():
    if 'user_id' in session:
        user = _user_disc_row(session['user_id'])
        if not user:
            return jsonify({'error': 'User not found'}), 404
        return jsonify({'games': json.loads(user.purchased_games or '[]') if user.purchased_games else []})
    return jsonify({'games': _get_session_purchased_games()})


@app.route('/api/discs/purchase-game', methods=['POST'])
def purchase_game():
    data = request.get_json() or {}
    game = (data.get('game') or '').strip()
    cost = GAME_COSTS.get(game, 100)

    if not game:
        return jsonify({'error': 'Game name required'}), 400
    return jsonify({'success': True, 'purchased': True, 'included': True,
                    'disc_balance': 0})

    if _has_full_access():
        return jsonify({'success': True, 'purchased': True, 'included': True,
                        'disc_balance': _get_session_discs()})

    if 'user_id' in session:
        db = DBSession()
        user = db.query(User).filter_by(id=session['user_id']).first()
        if not user:
            db.close()
            return jsonify({'error': 'User not found'}), 404

        purchased = json.loads(user.purchased_games or '[]') if user.purchased_games else []
        if game in purchased:
            db.close()
            return jsonify({'success': True, 'purchased': True, 'disc_balance': user.disc_balance or 0})

        if (user.disc_balance or 0) < cost:
            db.close()
            return jsonify({'error': 'Not enough Dynamix Discs', 'disc_balance': user.disc_balance or 0}), 402

        user.disc_balance = (user.disc_balance or 0) - cost
        purchased.append(game)
        user.purchased_games = json.dumps(purchased)
        db.commit()
        db.refresh(user)
        db.close()
        return jsonify({'success': True, 'purchased': True, 'disc_balance': user.disc_balance})

    purchased = _get_session_purchased_games()
    if game in purchased:
        return jsonify({'success': True, 'purchased': True, 'disc_balance': _get_session_discs()})
    balance = _get_session_discs()
    if balance < cost:
        return jsonify({'error': 'Not enough Dynamix Discs', 'disc_balance': balance}), 402
    purchased.append(game)
    _set_session_purchased_games(purchased)
    _set_session_discs(balance - cost)
    return jsonify({'success': True, 'purchased': True, 'disc_balance': _get_session_discs()})


# ── One-to-one WebRTC call signaling ──────────────────────────────────────────

def _require_call_user(db):
    user_id = session.get('user_id')
    if not user_id:
        return None, (jsonify({'error': 'Log in to use video calling'}), 401)
    user = db.query(User).filter_by(id=user_id).first()
    if not user:
        return None, (jsonify({'error': 'User not found'}), 404)
    return user, None


def _call_to_dict(call, db):
    caller = db.query(User).filter_by(id=call.caller_id).first()
    recipient = db.query(User).filter_by(id=call.recipient_id).first()
    return {
        'id': call.id,
        'caller_id': call.caller_id,
        'caller_username': caller.username if caller else 'Unknown',
        'caller_is_verified': bool(caller.is_verified) if caller else False,
        'recipient_id': call.recipient_id,
        'recipient_username': recipient.username if recipient else 'Unknown',
        'recipient_is_verified': bool(recipient.is_verified) if recipient else False,
        'status': call.status,
        'created_at': call.created_at.strftime('%Y-%m-%d %H:%M:%S') if call.created_at else None,
    }


@app.route('/api/calls', methods=['POST'])
def create_call():
    db = DBSession()
    try:
        user, error = _require_call_user(db)
        if error:
            return error
        data = request.get_json() or {}
        recipient_username = (data.get('username') or '').strip()
        recipient = db.query(User).filter_by(username=recipient_username).first()
        if not recipient:
            return jsonify({'error': 'User not found'}), 404
        if recipient.id == user.id:
            return jsonify({'error': 'You cannot call yourself'}), 400

        active = db.query(CallSession).filter(
            CallSession.status.in_(['ringing', 'active']),
            ((CallSession.caller_id == user.id) | (CallSession.recipient_id == user.id))
        ).first()
        if active:
            return jsonify({'error': 'You already have an active call'}), 409

        call = CallSession(id=str(uuid.uuid4()), caller_id=user.id, recipient_id=recipient.id)
        db.add(call)
        db.commit()
        return jsonify({'success': True, 'call': _call_to_dict(call, db)})
    finally:
        db.close()


@app.route('/api/calls/incoming', methods=['GET'])
def incoming_calls():
    db = DBSession()
    try:
        user, error = _require_call_user(db)
        if error:
            return error
        calls = db.query(CallSession).filter_by(
            recipient_id=user.id, status='ringing'
        ).order_by(CallSession.created_at.desc()).all()
        return jsonify({'calls': [_call_to_dict(call, db) for call in calls]})
    finally:
        db.close()


@app.route('/api/calls/config', methods=['GET'])
def call_config():
    """Return browser-safe ICE configuration.

    STUN works for many networks. Optional TURN values can be supplied through
    TURN_SERVER, TURN_USERNAME, and TURN_CREDENTIAL for reliable NAT traversal.
    """
    db = DBSession()
    user, error = _require_call_user(db)
    db.close()
    if error:
        return error

    ice_servers = [{
        'urls': [
            'stun:stun.l.google.com:19302',
            'stun:stun1.l.google.com:19302',
        ]
    }, {
        'urls': ['stun:stun.cloudflare.com:3478']
    }]

    turn_urls = []
    for env_name in ('TURN_SERVER', 'TURN_TLS_SERVER', 'TURN_TCP_SERVER'):
        raw_value = os.environ.get(env_name, '')
        turn_urls.extend(
            value.strip()
            for value in raw_value.split(',')
            if value.strip()
        )
    raw_servers = os.environ.get('TURN_SERVERS', '').strip()
    if raw_servers:
        try:
            parsed_servers = json.loads(raw_servers)
            if isinstance(parsed_servers, list):
                turn_urls.extend(str(value).strip() for value in parsed_servers if str(value).strip())
            else:
                turn_urls.extend(value.strip() for value in raw_servers.split(',') if value.strip())
        except (TypeError, ValueError):
            turn_urls.extend(value.strip() for value in raw_servers.split(',') if value.strip())

    turn_urls = list(dict.fromkeys(turn_urls))
    turn_username = os.environ.get('TURN_USERNAME', '').strip()
    turn_credential = os.environ.get('TURN_CREDENTIAL', '').strip()
    if turn_urls and turn_username and turn_credential:
        ice_servers.append({
            'urls': turn_urls,
            'username': turn_username,
            'credential': turn_credential,
        })
    return jsonify({'iceServers': ice_servers})


@app.route('/api/calls/<call_id>', methods=['GET'])
def get_call(call_id):
    db = DBSession()
    try:
        user, error = _require_call_user(db)
        if error:
            return error
        call = db.query(CallSession).filter_by(id=call_id).first()
        if not call or user.id not in (call.caller_id, call.recipient_id):
            return jsonify({'error': 'Call not found'}), 404
        return jsonify({'call': _call_to_dict(call, db)})
    finally:
        db.close()


@app.route('/api/calls/<call_id>/accept', methods=['POST'])
def accept_call(call_id):
    db = DBSession()
    try:
        user, error = _require_call_user(db)
        if error:
            return error
        call = db.query(CallSession).filter_by(id=call_id).first()
        if not call or call.recipient_id != user.id:
            return jsonify({'error': 'Call not found'}), 404
        if call.status != 'ringing':
            return jsonify({'error': 'Call is no longer ringing'}), 409
        call.status = 'active'
        db.commit()
        return jsonify({'success': True, 'call': _call_to_dict(call, db)})
    finally:
        db.close()


@app.route('/api/calls/<call_id>/signals', methods=['GET', 'POST'])
def call_signals(call_id):
    db = DBSession()
    try:
        user, error = _require_call_user(db)
        if error:
            return error
        call = db.query(CallSession).filter_by(id=call_id).first()
        if not call or user.id not in (call.caller_id, call.recipient_id):
            return jsonify({'error': 'Call not found'}), 404

        if request.method == 'POST':
            if call.status not in ('ringing', 'active'):
                return jsonify({'error': 'Call is no longer active'}), 409
            data = request.get_json() or {}
            signal_type = (data.get('type') or '').strip()
            payload = data.get('payload')
            if signal_type not in ('offer', 'answer', 'candidate') or payload is None:
                return jsonify({'error': 'Invalid call signal'}), 400
            signal = CallSignal(
                call_id=call.id, sender_id=user.id, signal_type=signal_type,
                payload=json.dumps(payload)
            )
            db.add(signal)
            db.commit()
            return jsonify({'success': True})

        after_id = request.args.get('after', 0, type=int)
        signals = db.query(CallSignal).filter(
            CallSignal.call_id == call.id,
            CallSignal.sender_id != user.id,
            CallSignal.id > after_id
        ).order_by(CallSignal.id.asc()).limit(100).all()
        return jsonify({'signals': [
            {'id': signal.id, 'type': signal.signal_type, 'payload': json.loads(signal.payload)}
            for signal in signals
        ], 'status': call.status})
    finally:
        db.close()


@app.route('/api/calls/<call_id>/end', methods=['POST'])
def end_call(call_id):
    db = DBSession()
    try:
        user, error = _require_call_user(db)
        if error:
            return error
        call = db.query(CallSession).filter_by(id=call_id).first()
        if not call or user.id not in (call.caller_id, call.recipient_id):
            return jsonify({'error': 'Call not found'}), 404
        call.status = 'ended'
        call.ended_at = datetime.datetime.utcnow()
        db.query(CallSignal).filter_by(call_id=call.id).delete()
        db.commit()
        return jsonify({'success': True})
    finally:
        db.close()


# ── Posts ─────────────────────────────────────────────────────────────────────

@app.route('/api/posts', methods=['GET'])
def get_posts():
    db    = DBSession()
    rows  = db.query(Post, User).join(User, Post.user_id == User.id).order_by(Post.created_at.desc()).all()
    comment_counts = dict(
        db.query(Comment.post_id, func.count(Comment.id)).group_by(Comment.post_id).all()
    )
    db.close()

    return jsonify({
        'posts': [
            {
                'id':            post.id,
                'text':          post.text,
                'image_url':     f'/uploads/{post.image_filename}' if post.image_filename else None,
                'created_at':    post.created_at.strftime('%Y-%m-%d %H:%M:%S') if post.created_at else None,
                'username':      user.username,
                'is_verified':   bool(user.is_verified),
                'user_id':       user.id,
                'pfp_url':       f'/api/pfp/{user.id}' if user.pfp_data else None,
                'pfp_offset_x':  user.pfp_offset_x if user.pfp_offset_x is not None else 50.0,
                'pfp_offset_y':  user.pfp_offset_y if user.pfp_offset_y is not None else 50.0,
                'comment_count': comment_counts.get(post.id, 0),
            }
            for post, user in rows
        ]
    })


@app.route('/api/posts', methods=['POST'])
def create_post():
    if 'user_id' not in session:
        return jsonify({'error': 'You must be logged in to post'}), 401

    text = (request.form.get('text') or '').strip()
    if not text:
        return jsonify({'error': 'Post text is required'}), 400
    if len(text) > 500:
        return jsonify({'error': 'Post must be 500 characters or less'}), 400
    if contains_bad_words(text):
        return jsonify({'error': 'Your post contains words that are not allowed on Dynamix Connect.'}), 400

    image_filename = None
    image_data     = None
    image_mimetype = None

    if 'image' in request.files:
        file = request.files['image']
        if file and file.filename and allowed_file(file.filename):
            ext            = secure_filename(file.filename).rsplit('.', 1)[1].lower()
            filename       = f'{uuid.uuid4().hex}.{ext}'
            image_filename = secure_filename(filename)
            image_data     = file.read()
            image_mimetype = mimetypes.guess_type(image_filename)[0] or 'application/octet-stream'

    db = DBSession()
    try:
        post = Post(
            user_id        = session['user_id'],
            text           = text,
            image_filename = image_filename,
            image_data     = image_data,
            image_mimetype = image_mimetype,
        )
        db.add(post)
        db.commit()
        db.refresh(post)
        return jsonify({'success': True, 'post_id': post.id})
    except Exception:
        db.rollback()
        return jsonify({'error': 'Could not create post'}), 500
    finally:
        db.close()


@app.route('/api/posts/<int:post_id>', methods=['DELETE'])
def delete_post(post_id):
    if 'user_id' not in session:
        return jsonify({'error': 'You must be logged in'}), 401

    db   = DBSession()
    post = db.query(Post).filter_by(id=post_id).first()
    if not post:
        db.close()
        return jsonify({'error': 'Post not found'}), 404
    if post.user_id != session['user_id']:
        db.close()
        return jsonify({'error': 'You can only delete your own posts'}), 403

    db.delete(post)
    db.commit()
    db.close()
    return jsonify({'success': True})


@app.route('/uploads/<path:filename>')
def uploaded_file(filename):
    db   = DBSession()
    post = db.query(Post).filter_by(image_filename=filename).first()
    db.close()
    if post and post.image_data:
        return Response(
            post.image_data,
            mimetype=post.image_mimetype or mimetypes.guess_type(filename)[0] or 'application/octet-stream'
        )
    abort(404)


# ── Comments ──────────────────────────────────────────────────────────────────

@app.route('/api/posts/<int:post_id>/comments', methods=['GET'])
def get_comments(post_id):
    db = DBSession()
    try:
        post = db.query(Post).filter_by(id=post_id).first()
        if not post:
            return jsonify({'error': 'Post not found'}), 404
        rows = db.query(Comment, User).join(User, Comment.user_id == User.id).filter(
            Comment.post_id == post_id
        ).order_by(Comment.created_at.asc()).all()
        return jsonify({'comments': [
            {
                'id':           c.id,
                'text':         c.text,
                'created_at':   c.created_at.strftime('%Y-%m-%d %H:%M:%S') if c.created_at else None,
                'username':     u.username,
                'is_verified':  bool(u.is_verified),
                'user_id':      u.id,
                'pfp_url':      f'/api/pfp/{u.id}' if u.pfp_data else None,
                'pfp_offset_x': u.pfp_offset_x if u.pfp_offset_x is not None else 50.0,
                'pfp_offset_y': u.pfp_offset_y if u.pfp_offset_y is not None else 50.0,
            }
            for c, u in rows
        ]})
    finally:
        db.close()


@app.route('/api/posts/<int:post_id>/comments', methods=['POST'])
def create_comment(post_id):
    if 'user_id' not in session:
        return jsonify({'error': 'You must be logged in to comment'}), 401
    data = request.get_json() or {}
    text = (data.get('text') or '').strip()
    if not text:
        return jsonify({'error': 'Comment text is required'}), 400
    if len(text) > 300:
        return jsonify({'error': 'Comment must be 300 characters or less'}), 400
    if contains_bad_words(text):
        return jsonify({'error': 'Your comment contains words that are not allowed.'}), 400
    db = DBSession()
    try:
        post = db.query(Post).filter_by(id=post_id).first()
        if not post:
            return jsonify({'error': 'Post not found'}), 404
        comment = Comment(post_id=post_id, user_id=session['user_id'], text=text)
        db.add(comment)
        db.commit()
        db.refresh(comment)
        user = db.query(User).filter_by(id=session['user_id']).first()
        return jsonify({'success': True, 'comment': {
            'id':           comment.id,
            'text':         comment.text,
            'created_at':   comment.created_at.strftime('%Y-%m-%d %H:%M:%S') if comment.created_at else None,
            'username':     user.username,
            'is_verified':  bool(user.is_verified),
            'user_id':      user.id,
            'pfp_url':      f'/api/pfp/{user.id}' if user.pfp_data else None,
            'pfp_offset_x': user.pfp_offset_x if user.pfp_offset_x is not None else 50.0,
            'pfp_offset_y': user.pfp_offset_y if user.pfp_offset_y is not None else 50.0,
        }})
    except Exception:
        db.rollback()
        return jsonify({'error': 'Could not post comment'}), 500
    finally:
        db.close()


@app.route('/api/comments/<int:comment_id>', methods=['DELETE'])
def delete_comment(comment_id):
    if 'user_id' not in session:
        return jsonify({'error': 'You must be logged in'}), 401
    db = DBSession()
    try:
        comment = db.query(Comment).filter_by(id=comment_id).first()
        if not comment:
            return jsonify({'error': 'Comment not found'}), 404
        if comment.user_id != session['user_id']:
            return jsonify({'error': 'You can only delete your own comments'}), 403
        db.delete(comment)
        db.commit()
        return jsonify({'success': True})
    except Exception:
        db.rollback()
        return jsonify({'error': 'Could not delete comment'}), 500
    finally:
        db.close()


# ── Friends ───────────────────────────────────────────────────────────────────

def _friendship_between(db, uid, other_id):
    return db.query(Friendship).filter(
        ((Friendship.requester_id == uid) & (Friendship.addressee_id == other_id)) |
        ((Friendship.requester_id == other_id) & (Friendship.addressee_id == uid))
    ).first()


def _user_mini(u):
    return {
        'id':           u.id,
        'username':     u.username,
        'is_verified':  bool(u.is_verified),
        'pfp_url':      f'/api/pfp/{u.id}' if u.pfp_data else None,
        'pfp_offset_x': u.pfp_offset_x if u.pfp_offset_x is not None else 50.0,
        'pfp_offset_y': u.pfp_offset_y if u.pfp_offset_y is not None else 50.0,
        'bio':          u.bio or '',
    }


def _load_card_inventory(user):
    return _normalize_card_inventory(user.trading_cards)


def _normalize_card_inventory(value):
    """Return one validated, de-duplicated account inventory."""
    if isinstance(value, str):
        try:
            value = json.loads(value or '[]')
        except (TypeError, ValueError):
            value = []
    if not isinstance(value, list):
        return []

    normalized = []
    seen_ids = set()
    for card in value:
        if not isinstance(card, dict):
            continue
        card_id = str(card.get('id') or '').strip()
        if not card_id or card_id in seen_ids:
            continue
        seen_ids.add(card_id)
        normalized.append({**card, 'id': card_id})
    return normalized


def _store_card_inventory(user, cards):
    """Persist the canonical inventory on the authenticated account."""
    user.trading_cards = json.dumps(_normalize_card_inventory(cards))


def _card_view(card):
    rarity = str(card.get('rarity') or 'Common')
    return {
        'id': str(card.get('id') or ''),
        'name': str(card.get('name') or 'Mystery Card'),
        'image': str(card.get('image') or ''),
        'rarity': rarity,
        'number': str(card.get('number') or ''),
        'sell_value': CARD_SELL_VALUES.get(rarity.upper(), CARD_SELL_VALUES['COMMON']),
        'accent': card.get('accent') or RARITY_STYLES.get(
            rarity, RARITY_STYLES['Common']
        )['accent'],
    }


def _card_map(cards):
    return {str(card.get('id')): card for card in cards if card.get('id')}


def _locked_card_ids(db):
    return {
        str(row.card_id)
        for row in db.query(TradeCardLock).join(
            TradeOffer, TradeOffer.id == TradeCardLock.trade_id
        ).filter(TradeOffer.status == 'pending').all()
    }


def _is_accepted_friend(db, uid, other_id):
    friendship = _friendship_between(db, uid, other_id)
    return bool(friendship and friendship.status == 'accepted')


def _trade_payload(db, trade, viewer_id):
    initiator = db.query(User).filter_by(id=trade.initiator_id).first()
    recipient = db.query(User).filter_by(id=trade.recipient_id).first()
    offered_ids = json.loads(trade.offered_card_ids or '[]')
    requested_ids = json.loads(trade.requested_card_ids or '[]')
    initiator_cards = _card_map(_load_card_inventory(initiator)) if initiator else {}
    recipient_cards = _card_map(_load_card_inventory(recipient)) if recipient else {}
    return {
        'id': trade.id,
        'status': trade.status,
        'created_at': trade.created_at.strftime('%Y-%m-%d %H:%M:%S') if trade.created_at else None,
        'responded_at': trade.responded_at.strftime('%Y-%m-%d %H:%M:%S') if trade.responded_at else None,
        'is_incoming': trade.recipient_id == viewer_id,
        'initiator': _user_mini(initiator) if initiator else None,
        'recipient': _user_mini(recipient) if recipient else None,
        'offered_cards': [
            _card_view(initiator_cards[card_id])
            for card_id in offered_ids if card_id in initiator_cards
        ],
        'requested_cards': [
            _card_view(recipient_cards[card_id])
            for card_id in requested_ids if card_id in recipient_cards
        ],
    }


@app.route('/api/friends/request', methods=['POST'])
def send_friend_request():
    if 'user_id' not in session:
        return jsonify({'error': 'Not logged in'}), 401
    data = request.get_json() or {}
    username = (data.get('username') or '').strip()
    db = DBSession()
    try:
        uid = session['user_id']
        other = db.query(User).filter_by(username=username).first()
        if not other:
            return jsonify({'error': 'User not found'}), 404
        if other.id == uid:
            return jsonify({'error': 'You cannot add yourself'}), 400
        existing = _friendship_between(db, uid, other.id)
        if existing:
            return jsonify({'error': 'Friend relationship already exists'}), 409
        f = Friendship(requester_id=uid, addressee_id=other.id)
        db.add(f)
        db.commit()
        db.refresh(f)
        return jsonify({'success': True, 'status': 'pending_sent', 'friendship_id': f.id})
    except Exception:
        db.rollback()
        return jsonify({'error': 'Could not send friend request'}), 500
    finally:
        db.close()


@app.route('/api/friends/<int:friendship_id>/accept', methods=['POST'])
def accept_friend_request(friendship_id):
    if 'user_id' not in session:
        return jsonify({'error': 'Not logged in'}), 401
    db = DBSession()
    try:
        f = db.query(Friendship).filter_by(id=friendship_id, addressee_id=session['user_id'], status='pending').first()
        if not f:
            return jsonify({'error': 'Friend request not found'}), 404
        f.status = 'accepted'
        db.commit()
        return jsonify({'success': True})
    except Exception:
        db.rollback()
        return jsonify({'error': 'Could not accept request'}), 500
    finally:
        db.close()


@app.route('/api/friends/<int:friendship_id>/decline', methods=['POST'])
def decline_friend_request(friendship_id):
    if 'user_id' not in session:
        return jsonify({'error': 'Not logged in'}), 401
    db = DBSession()
    try:
        f = db.query(Friendship).filter_by(id=friendship_id, addressee_id=session['user_id'], status='pending').first()
        if not f:
            return jsonify({'error': 'Friend request not found'}), 404
        db.delete(f)
        db.commit()
        return jsonify({'success': True})
    except Exception:
        db.rollback()
        return jsonify({'error': 'Could not decline request'}), 500
    finally:
        db.close()


@app.route('/api/friends/<int:friendship_id>', methods=['DELETE'])
def remove_friend(friendship_id):
    if 'user_id' not in session:
        return jsonify({'error': 'Not logged in'}), 401
    db = DBSession()
    try:
        uid = session['user_id']
        f = db.query(Friendship).filter(
            Friendship.id == friendship_id,
            (Friendship.requester_id == uid) | (Friendship.addressee_id == uid)
        ).first()
        if not f:
            return jsonify({'error': 'Friendship not found'}), 404
        pending_trades = db.query(TradeOffer).filter(
            TradeOffer.status == 'pending',
            ((TradeOffer.initiator_id == f.requester_id) & (TradeOffer.recipient_id == f.addressee_id)) |
            ((TradeOffer.initiator_id == f.addressee_id) & (TradeOffer.recipient_id == f.requester_id))
        ).all()
        for trade in pending_trades:
            trade.status = 'cancelled'
            trade.responded_at = datetime.datetime.utcnow()
            db.query(TradeCardLock).filter_by(trade_id=trade.id).delete()
        db.delete(f)
        db.commit()
        return jsonify({'success': True})
    except Exception:
        db.rollback()
        return jsonify({'error': 'Could not remove friend'}), 500
    finally:
        db.close()


@app.route('/api/friends', methods=['GET'])
def get_friends():
    if 'user_id' not in session:
        return jsonify({'error': 'Not logged in'}), 401
    db = DBSession()
    try:
        uid = session['user_id']
        accepted = db.query(Friendship).filter(
            Friendship.status == 'accepted',
            (Friendship.requester_id == uid) | (Friendship.addressee_id == uid)
        ).all()
        friends = []
        for f in accepted:
            other_id = f.addressee_id if f.requester_id == uid else f.requester_id
            other = db.query(User).filter_by(id=other_id).first()
            if other:
                friends.append({'friendship_id': f.id, 'user': _user_mini(other)})

        received = db.query(Friendship).filter_by(addressee_id=uid, status='pending').all()
        requests_in = []
        for f in received:
            other = db.query(User).filter_by(id=f.requester_id).first()
            if other:
                requests_in.append({'friendship_id': f.id, 'user': _user_mini(other)})

        return jsonify({'friends': friends, 'requests': requests_in})
    finally:
        db.close()


# ── Card Trades ─────────────────────────────────────────────────────────────────

@app.route('/api/tradeable-cards/self', methods=['GET'])
def get_my_tradeable_cards():
    if 'user_id' not in session:
        return jsonify({'error': 'Not logged in'}), 401
    db = DBSession()
    try:
        locked = _locked_card_ids(db)
        user = db.query(User).filter_by(id=session['user_id']).first()
        if not user:
            return jsonify({'error': 'User not found'}), 404
        cards = [
            _card_view(card) for card in _load_card_inventory(user)
            if str(card.get('id') or '') not in locked
        ]
        return jsonify({'cards': cards})
    finally:
        db.close()


@app.route('/api/tradeable-cards/<username>', methods=['GET'])
def get_tradeable_cards(username):
    if 'user_id' not in session:
        return jsonify({'error': 'Not logged in'}), 401
    db = DBSession()
    try:
        uid = session['user_id']
        other = db.query(User).filter_by(username=username).first()
        if not other:
            return jsonify({'error': 'User not found'}), 404
        if other.id == uid or not _is_accepted_friend(db, uid, other.id):
            return jsonify({'error': 'You can only trade with accepted friends'}), 403
        locked = _locked_card_ids(db)
        cards = [
            _card_view(card) for card in _load_card_inventory(other)
            if str(card.get('id') or '') not in locked
        ]
        return jsonify({'cards': cards})
    finally:
        db.close()


@app.route('/api/trades', methods=['GET'])
def list_trades():
    if 'user_id' not in session:
        return jsonify({'error': 'Not logged in'}), 401
    db = DBSession()
    try:
        uid = session['user_id']
        peer_name = (request.args.get('with') or '').strip()
        query = db.query(TradeOffer).filter(
            TradeOffer.status == 'pending',
            (TradeOffer.initiator_id == uid) | (TradeOffer.recipient_id == uid)
        )
        if peer_name:
            peer = db.query(User).filter_by(username=peer_name).first()
            if not peer:
                return jsonify({'trades': []})
            query = query.filter(
                ((TradeOffer.initiator_id == uid) & (TradeOffer.recipient_id == peer.id)) |
                ((TradeOffer.initiator_id == peer.id) & (TradeOffer.recipient_id == uid))
            )
        trades = query.order_by(TradeOffer.created_at.desc()).all()
        return jsonify({'trades': [_trade_payload(db, trade, uid) for trade in trades]})
    finally:
        db.close()


@app.route('/api/trades', methods=['POST'])
def create_trade():
    if 'user_id' not in session:
        return jsonify({'error': 'Not logged in'}), 401
    data = request.get_json(silent=True) or {}
    recipient_username = (data.get('recipient_username') or '').strip()
    offered_ids = [str(value).strip() for value in (data.get('offered_card_ids') or [])]
    requested_ids = [str(value).strip() for value in (data.get('requested_card_ids') or [])]
    if not recipient_username:
        return jsonify({'error': 'Choose a friend to trade with'}), 400
    if not offered_ids and not requested_ids:
        return jsonify({'error': 'Select at least one card'}), 400
    if len(offered_ids) > 12 or len(requested_ids) > 12:
        return jsonify({'error': 'A trade can include at most 12 cards per side'}), 400
    if len(set(offered_ids)) != len(offered_ids) or len(set(requested_ids)) != len(requested_ids):
        return jsonify({'error': 'A card can only appear once in a trade'}), 400
    db = DBSession()
    try:
        uid = session['user_id']
        recipient = db.query(User).filter_by(username=recipient_username).first()
        if not recipient:
            return jsonify({'error': 'Friend not found'}), 404
        if recipient.id == uid or not _is_accepted_friend(db, uid, recipient.id):
            return jsonify({'error': 'You can only trade with accepted friends'}), 403
        initiator = db.query(User).filter_by(id=uid).first()
        initiator_map = _card_map(_load_card_inventory(initiator))
        recipient_map = _card_map(_load_card_inventory(recipient))
        if any(card_id not in initiator_map for card_id in offered_ids):
            return jsonify({'error': 'One or more offered cards are not in your collection'}), 400
        if any(card_id not in recipient_map for card_id in requested_ids):
            return jsonify({'error': 'One or more requested cards are no longer available'}), 400
        locked = _locked_card_ids(db)
        if any(card_id in locked for card_id in offered_ids + requested_ids):
            return jsonify({'error': 'One or more selected cards are already reserved in another trade'}), 409
        trade = TradeOffer(
            initiator_id=uid,
            recipient_id=recipient.id,
            offered_card_ids=json.dumps(offered_ids),
            requested_card_ids=json.dumps(requested_ids),
        )
        db.add(trade)
        db.flush()
        db.add_all([TradeCardLock(card_id=card_id, trade_id=trade.id)
                    for card_id in offered_ids + requested_ids])
        try:
            db.commit()
        except IntegrityError:
            db.rollback()
            return jsonify({'error': 'A selected card was just reserved. Refresh and try again.'}), 409
        db.refresh(trade)
        return jsonify({'success': True, 'trade': _trade_payload(db, trade, uid)}), 201
    except Exception:
        db.rollback()
        return jsonify({'error': 'Could not create trade offer'}), 500
    finally:
        db.close()


def _change_trade_status(trade_id, status):
    if 'user_id' not in session:
        return jsonify({'error': 'Not logged in'}), 401
    db = DBSession()
    try:
        uid = session['user_id']
        trade = db.query(TradeOffer).filter_by(id=trade_id, status='pending').first()
        if not trade:
            return jsonify({'error': 'Trade offer is no longer pending'}), 404
        if status == 'rejected' and trade.recipient_id != uid:
            return jsonify({'error': 'You cannot reject this trade offer'}), 403
        if status == 'cancelled' and trade.initiator_id != uid:
            return jsonify({'error': 'You cannot cancel this trade offer'}), 403
        trade.status = status
        trade.responded_at = datetime.datetime.utcnow()
        db.query(TradeCardLock).filter_by(trade_id=trade.id).delete()
        db.commit()
        return jsonify({'success': True, 'status': status})
    except Exception:
        db.rollback()
        return jsonify({'error': 'Could not update trade offer'}), 500
    finally:
        db.close()


@app.route('/api/trades/<int:trade_id>/reject', methods=['POST'])
def reject_trade(trade_id):
    return _change_trade_status(trade_id, 'rejected')


@app.route('/api/trades/<int:trade_id>/cancel', methods=['POST'])
def cancel_trade(trade_id):
    return _change_trade_status(trade_id, 'cancelled')


@app.route('/api/trades/<int:trade_id>/accept', methods=['POST'])
def accept_trade(trade_id):
    if 'user_id' not in session:
        return jsonify({'error': 'Not logged in'}), 401
    db = DBSession()
    try:
        uid = session['user_id']
        trade = db.query(TradeOffer).filter_by(id=trade_id, status='pending').first()
        if not trade:
            return jsonify({'error': 'Trade offer is no longer pending'}), 404
        if trade.recipient_id != uid:
            return jsonify({'error': 'Only the receiving friend can accept this offer'}), 403
        if not _is_accepted_friend(db, trade.initiator_id, trade.recipient_id):
            return jsonify({'error': 'Trading is only available between accepted friends'}), 403

        initiator = db.query(User).filter_by(id=trade.initiator_id).first()
        recipient = db.query(User).filter_by(id=trade.recipient_id).first()
        offered_ids = json.loads(trade.offered_card_ids or '[]')
        requested_ids = json.loads(trade.requested_card_ids or '[]')
        initiator_cards = _load_card_inventory(initiator)
        recipient_cards = _load_card_inventory(recipient)
        initiator_map = _card_map(initiator_cards)
        recipient_map = _card_map(recipient_cards)
        if any(card_id not in initiator_map for card_id in offered_ids) or any(card_id not in recipient_map for card_id in requested_ids):
            return jsonify({'error': 'A card in this offer is no longer available'}), 409

        offered_set = set(offered_ids)
        requested_set = set(requested_ids)
        _store_card_inventory(initiator,
            [card for card in initiator_cards if str(card.get('id')) not in offered_set] +
            [recipient_map[card_id] for card_id in requested_ids]
        )
        _store_card_inventory(recipient,
            [card for card in recipient_cards if str(card.get('id')) not in requested_set] +
            [initiator_map[card_id] for card_id in offered_ids]
        )
        trade.status = 'accepted'
        trade.responded_at = datetime.datetime.utcnow()
        db.query(TradeCardLock).filter_by(trade_id=trade.id).delete()
        db.commit()
        return jsonify({'success': True, 'status': 'accepted'})
    except Exception:
        db.rollback()
        return jsonify({'error': 'Could not complete this trade'}), 500
    finally:
        db.close()


# ── Direct Messages ───────────────────────────────────────────────────────────

@app.route('/api/dms', methods=['GET'])
def list_dm_conversations():
    if 'user_id' not in session:
        return jsonify({'error': 'Not logged in'}), 401
    db = DBSession()
    try:
        uid = session['user_id']
        messages = db.query(DirectMessage).filter(
            (DirectMessage.sender_id == uid) | (DirectMessage.recipient_id == uid)
        ).order_by(DirectMessage.created_at.desc()).all()
        seen = {}
        for m in messages:
            other_id = m.recipient_id if m.sender_id == uid else m.sender_id
            entry = seen.setdefault(other_id, {
                'last_message': None,
                'activity_at': m.created_at,
                'pending_trades': 0,
            })
            if entry['last_message'] is None:
                entry['last_message'] = m
            if m.created_at and (not entry['activity_at'] or m.created_at > entry['activity_at']):
                entry['activity_at'] = m.created_at

        pending_trades = db.query(TradeOffer).filter(
            TradeOffer.status == 'pending',
            (TradeOffer.initiator_id == uid) | (TradeOffer.recipient_id == uid)
        ).all()
        for trade in pending_trades:
            other_id = trade.recipient_id if trade.initiator_id == uid else trade.initiator_id
            entry = seen.setdefault(other_id, {
                'last_message': None,
                'activity_at': trade.created_at,
                'pending_trades': 0,
            })
            entry['pending_trades'] += 1
            if trade.created_at and (not entry['activity_at'] or trade.created_at > entry['activity_at']):
                entry['activity_at'] = trade.created_at
        convos = []
        for other_id, entry in sorted(
            seen.items(),
            key=lambda item: item[1]['activity_at'] or datetime.datetime.min,
            reverse=True,
        ):
            other = db.query(User).filter_by(id=other_id).first()
            if not other:
                continue
            unread = db.query(DirectMessage).filter_by(
                sender_id=other_id, recipient_id=uid, is_read=False
            ).count()
            last_msg = entry['last_message']
            convos.append({
                'user':         _user_mini(other),
                'last_message': {
                    'text':       last_msg.text,
                    'sender_id':  last_msg.sender_id,
                    'created_at': last_msg.created_at.strftime('%Y-%m-%d %H:%M:%S') if last_msg.created_at else None,
                } if last_msg else None,
                'unread': unread,
                'pending_trades': entry['pending_trades'],
            })
        return jsonify({'conversations': convos})
    finally:
        db.close()


@app.route('/api/dms/unread', methods=['GET'])
def unread_dm_count():
    if 'user_id' not in session:
        return jsonify({'count': 0})
    db = DBSession()
    try:
        count = db.query(DirectMessage).filter_by(recipient_id=session['user_id'], is_read=False).count()
        return jsonify({'count': count})
    finally:
        db.close()


@app.route('/api/dms/<username>', methods=['GET'])
def get_dm_thread(username):
    if 'user_id' not in session:
        return jsonify({'error': 'Not logged in'}), 401
    db = DBSession()
    try:
        uid = session['user_id']
        other = db.query(User).filter_by(username=username).first()
        if not other:
            return jsonify({'error': 'User not found'}), 404
        db.query(DirectMessage).filter_by(
            sender_id=other.id, recipient_id=uid, is_read=False
        ).update({'is_read': True})
        db.commit()
        msgs = db.query(DirectMessage).filter(
            ((DirectMessage.sender_id == uid) & (DirectMessage.recipient_id == other.id)) |
            ((DirectMessage.sender_id == other.id) & (DirectMessage.recipient_id == uid))
        ).order_by(DirectMessage.created_at.asc()).all()
        return jsonify({
            'other_user': _user_mini(other),
            'messages': [
                {
                    'id':         m.id,
                    'text':       m.text,
                    'sender_id':  m.sender_id,
                    'created_at': m.created_at.strftime('%Y-%m-%d %H:%M:%S') if m.created_at else None,
                }
                for m in msgs
            ]
        })
    finally:
        db.close()


@app.route('/api/dms/<username>', methods=['POST'])
def send_dm(username):
    if 'user_id' not in session:
        return jsonify({'error': 'Not logged in'}), 401
    data = request.get_json() or {}
    text = (data.get('text') or '').strip()
    if not text:
        return jsonify({'error': 'Message text is required'}), 400
    if len(text) > 1000:
        return jsonify({'error': 'Message must be 1000 characters or less'}), 400
    db = DBSession()
    try:
        uid = session['user_id']
        other = db.query(User).filter_by(username=username).first()
        if not other:
            return jsonify({'error': 'User not found'}), 404
        if other.id == uid:
            return jsonify({'error': 'You cannot message yourself'}), 400
        msg = DirectMessage(sender_id=uid, recipient_id=other.id, text=text)
        db.add(msg)
        db.commit()
        db.refresh(msg)
        return jsonify({'success': True, 'message': {
            'id':         msg.id,
            'text':       msg.text,
            'sender_id':  msg.sender_id,
            'created_at': msg.created_at.strftime('%Y-%m-%d %H:%M:%S') if msg.created_at else None,
        }})
    except Exception:
        db.rollback()
        return jsonify({'error': 'Could not send message'}), 500
    finally:
        db.close()


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=PORT, debug=False)
