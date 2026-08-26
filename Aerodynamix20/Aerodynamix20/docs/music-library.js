/* Aerodynamix public music library */
(function () {
    'use strict';

    const MUSIC_ROOT = 'https://pub-608acebadadc4864937f6480d225b2e0.r2.dev';
    const LIBRARY_URL = MUSIC_ROOT + '/Music/library.json';
    const AUDIO_EXTENSIONS = /\.(mp3|m4a|aac|ogg|opus|wav|flac)$/i;

    const grid = document.getElementById('album-grid');
    const message = document.getElementById('music-message');
    const messageTitle = document.getElementById('music-message-title');
    const messageCopy = document.getElementById('music-message-copy');
    const status = document.getElementById('music-status');
    const panel = document.getElementById('album-panel');
    const panelTitle = document.getElementById('album-panel-title');
    const panelSubtitle = document.getElementById('album-panel-subtitle');
    const trackList = document.getElementById('album-track-list');
    const closePanel = document.getElementById('album-close');

    function assetUrl(value, fallback) {
        if (!value) return fallback || '';
        if (/^(https?:|data:|blob:)/i.test(value)) return value;
        return new URL(String(value).replace(/^\/+/, ''), MUSIC_ROOT + '/').href;
    }

    function cleanTitle(value, fallback) {
        return String(value || fallback || '')
            .replace(/\.[^.]+$/, '')
            .replace(/^\d+[\s._-]+/, '')
            .replace(/[-_]+/g, ' ')
            .trim();
    }

    function normalizeLibrary(payload) {
        const albums = Array.isArray(payload) ? payload : payload && (payload.albums || payload.library);
        if (!Array.isArray(albums)) return [];
        return albums.map((album, albumIndex) => {
            const albumTitle = cleanTitle(album.title || album.name, 'Album ' + (albumIndex + 1));
            const albumFolder = album.folder || album.path || '';
            const tracks = Array.isArray(album.tracks) ? album.tracks : (Array.isArray(album.files) ? album.files : []);
            return {
                title: albumTitle,
                artist: album.artist || 'Aerodynamix',
                cover: assetUrl(album.cover || album.art || album.coverUrl),
                tracks: tracks.map((track, trackIndex) => {
                    const rawFile = typeof track === 'string' ? track : (track.file || track.url || track.src || '');
                    const file = rawFile && !/^(https?:|data:|blob:)/i.test(rawFile) && albumFolder && !rawFile.startsWith(albumFolder)
                        ? albumFolder.replace(/\/?$/, '/') + rawFile.replace(/^\/+/, '')
                        : rawFile;
                    return {
                        title: cleanTitle(typeof track === 'string' ? track : track.title || track.name, 'Track ' + (trackIndex + 1)),
                        artist: typeof track === 'string' ? album.artist || 'Aerodynamix' : track.artist || album.artist || 'Aerodynamix',
                        src: assetUrl(file),
                        art: assetUrl(typeof track === 'string' ? '' : track.cover || track.art || track.artUrl, assetUrl(album.cover || album.art || album.coverUrl)),
                        duration: typeof track === 'string' ? '' : track.duration || ''
                    };
                }).filter(track => track.src && AUDIO_EXTENSIONS.test(track.src))
            };
        }).filter(album => album.tracks.length);
    }

    function showMessage(title, copy) {
        messageTitle.textContent = title;
        messageCopy.innerHTML = copy;
        message.hidden = false;
    }

    function renderAlbums(albums) {
        grid.innerHTML = '';
        albums.forEach((album, index) => {
            const card = document.createElement('button');
            card.className = 'album-card';
            card.type = 'button';
            card.setAttribute('aria-label', 'Open ' + album.title);
            const firstLetter = album.title.slice(0, 1).toUpperCase() || '♪';
            card.innerHTML = album.cover
                ? '<img class="album-card-art" src="' + album.cover + '" alt="" loading="lazy">'
                : '<span class="album-card-placeholder" aria-hidden="true">' + firstLetter + '</span>';
            card.insertAdjacentHTML('beforeend',
                '<span class="album-card-play" aria-hidden="true"><i class="fa-solid fa-play"></i></span>' +
                '<span class="album-card-copy"><strong class="album-card-title"></strong><span class="album-card-meta"></span></span>');
            card.querySelector('.album-card-title').textContent = album.title;
            card.querySelector('.album-card-meta').textContent = album.artist + ' · ' + album.tracks.length + ' track' + (album.tracks.length === 1 ? '' : 's');
            card.addEventListener('click', () => openAlbum(album));
            grid.appendChild(card);
        });
        grid.hidden = !albums.length;
        message.hidden = Boolean(albums.length);
        status.textContent = albums.length + ' album' + (albums.length === 1 ? '' : 's') + ' ready';
    }

    function openAlbum(album) {
        panelTitle.textContent = album.title;
        panelSubtitle.textContent = album.artist + ' · ' + album.tracks.length + ' track' + (album.tracks.length === 1 ? '' : 's');
        trackList.innerHTML = '';
        const playlist = album.tracks.map(track => ({
            src: track.src,
            title: track.title,
            album: album.title,
            art: track.art || album.cover
        }));
        album.tracks.forEach((track, index) => {
            const button = document.createElement('button');
            button.className = 'album-track';
            button.type = 'button';
            button.innerHTML = '<i class="fa-solid fa-play"></i><span class="album-track-name"></span><span class="album-track-meta"></span>';
            button.querySelector('.album-track-name').textContent = track.title;
            button.querySelector('.album-track-meta').textContent = track.duration || '';
            button.addEventListener('click', () => {
                window.AeroMusic.setTrack(track.src, track.title, album.title, track.art || album.cover);
                window.AeroMusic.setTrackList(playlist);
            });
            trackList.appendChild(button);
            if (index === 0) button.setAttribute('aria-label', 'Play ' + track.title);
        });
        panel.hidden = false;
        panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    closePanel.addEventListener('click', () => { panel.hidden = true; });

    async function loadLibrary() {
        try {
            const response = await fetch(LIBRARY_URL, { cache: 'no-store', mode: 'cors' });
            if (!response.ok) throw new Error('library.json returned ' + response.status);
            const albums = normalizeLibrary(await response.json());
            if (!albums.length) {
                showMessage('No playable albums yet', 'Add albums with audio files and a public <strong>Music/library.json</strong> file to your R2 bucket.');
                status.textContent = 'Library is empty';
                return;
            }
            renderAlbums(albums);
        } catch (error) {
            console.warn('Aerodynamix music library:', error);
            showMessage('Your albums are almost ready', 'Add a public <strong>Music/library.json</strong> file to your R2 bucket so Aerodynamix can list the album folders and songs.');
            status.textContent = 'Waiting for library';
        }
    }

    loadLibrary();
})();