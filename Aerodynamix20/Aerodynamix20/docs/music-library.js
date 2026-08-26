/* Aerodynamix public music library */
(function () {
    'use strict';

    const MUSIC_ROOT = 'https://pub-608acebadadc4864937f6480d225b2e0.r2.dev';
    const LIBRARY_URL = MUSIC_ROOT + '/Music/library.json';
    const AUDIO_EXTENSIONS = /\.(mp3|m4a|aac|ogg|opus|wav|flac)$/i;
    const GRADUATION_ALBUM = {
        title: 'Graduation',
        artist: 'Kanye West',
        cover: 'Music/Kanye West - Graduation/cover.jpg',
        tracks: [
            { title: 'Good Morning', artist: 'Kanye West', file: '01 - Kanye West - Good Morning.mp3' },
            { title: 'Champion', artist: 'Kanye West', file: '02 - Kanye West - Champion.mp3' },
            { title: 'Stronger', artist: 'Kanye West', file: '03 - Kanye West - Stronger.mp3' },
            { title: 'I Wonder', artist: 'Kanye West', file: '04 - Kanye West - I Wonder.mp3' },
            { title: 'Good Life (feat. T-Pain)', artist: 'Kanye West', file: '05 - T-Pain - Good Life (feat. T-Pain).mp3' },
            { title: "Can't Tell Me Nothing", artist: 'Kanye West', file: "06 - Kanye West - Can't Tell Me Nothing.mp3" },
            { title: 'Barry Bonds (feat. Lil Wayne)', artist: 'Kanye West', file: '07 - Lil Wayne - Barry Bonds (feat. Lil Wayne).mp3' },
            { title: 'Drunk and Hot Girls (feat. Mos Def)', artist: 'Kanye West', file: '08 - Mos Def - Drunk and Hot Girls (feat. Mos Def).mp3' },
            { title: 'Flashing Lights (feat. Dwele)', artist: 'Kanye West', file: '09 - Dwele - Flashing Lights (feat. Dwele).mp3' },
            { title: 'Everything I Am (feat. DJ Premier)', artist: 'Kanye West', file: '10 - DJ Premier - Everything I Am (feat. DJ Premier).mp3' },
            { title: 'The Glory', artist: 'Kanye West', file: '11 - Kanye West - The Glory.mp3' },
            { title: 'Homecoming (feat. Chris Martin)', artist: 'Kanye West', file: '12 - Chris Martin - Homecoming (feat. Chris Martin).mp3' },
            { title: 'Big Brother', artist: 'Kanye West', file: '13 - Kanye West - Big Brother.mp3' },
            { title: 'Good Night (feat. Mos Def & Al Be Back)', artist: 'Kanye West', file: '14 - Mos Def - Good Night (feat. Mos Def & Al Be Back).mp3' }
        ]
    };

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

    function normalizeDefaultAlbum(album) {
        const folder = 'Music/Kanye West - Graduation/';
        return {
            title: album.title,
            artist: album.artist,
            cover: assetUrl(album.cover),
            tracks: album.tracks.map(track => ({
                title: track.title,
                artist: track.artist,
                src: assetUrl(folder + track.file),
                art: assetUrl(album.cover),
                duration: ''
            }))
        };
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

    function withFeaturedAlbums(albums) {
        const featured = normalizeDefaultAlbum(GRADUATION_ALBUM);
        const hasGraduation = albums.some(album =>
            album.title.toLowerCase() === featured.title.toLowerCase() &&
            album.artist.toLowerCase() === featured.artist.toLowerCase()
        );
        return hasGraduation ? albums : [featured].concat(albums);
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
            if (album.cover) {
                const art = card.querySelector('.album-card-art');
                art.addEventListener('error', () => {
                    const placeholder = document.createElement('span');
                    placeholder.className = 'album-card-placeholder';
                    placeholder.setAttribute('aria-hidden', 'true');
                    placeholder.textContent = firstLetter;
                    art.replaceWith(placeholder);
                });
            }
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
            const albums = withFeaturedAlbums(normalizeLibrary(await response.json()));
            if (!albums.length) {
                showMessage('No playable albums yet', 'Albums will appear here as they are added to the music library.');
                status.textContent = 'Library is empty';
                return;
            }
            renderAlbums(albums);
        } catch (error) {
            console.warn('Aerodynamix music library:', error);
            renderAlbums([normalizeDefaultAlbum(GRADUATION_ALBUM)]);
            status.textContent = '1 album ready';
        }
    }

    loadLibrary();
})();