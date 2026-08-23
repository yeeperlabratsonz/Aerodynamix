/* Aerodynamix - Unified Auth Gate */
(function() {
    'use strict';

    startSiteClockEasterEgg();
    startSiteMessageNotifications();

    function startSiteClockEasterEgg() {
        if (window.__aeroSiteClock || location.protocol === 'file:') return;
        window.__aeroSiteClock = true;
        const clockSettingsKey = 'aerodynamixClockSettings';
        let clockSettings = {};
        try { clockSettings = JSON.parse(localStorage.getItem(clockSettingsKey) || '{}') || {}; } catch (error) {}

        const style = document.createElement('style');
        style.textContent = `
            .aero-site-status {
                display:flex; align-items:center; justify-content:center; gap:7px; margin-left:auto;
                margin-right:1vw; white-space:nowrap; font:600 .72rem Montserrat,sans-serif;
            }
            .aero-site-status-item {
                border:1px solid rgba(130,185,255,.25); border-radius:8px; padding:8px 10px;
                background:rgba(7,18,38,.55); color:rgba(255,255,255,.75);
            }
            .aero-site-clock { cursor:pointer; transition:.2s ease; }
            .aero-site-clock:hover, .aero-site-clock:focus { color:#fff; border-color:rgba(130,185,255,.7); outline:none; transform:translateY(-1px); }
            .aero-site-battery { color:#9ff0bd; }
            .aero-site-online { color:#9ecbff; }
            #aero-site-clock-overlay {
                position:fixed; inset:0; z-index:10090; display:none; overflow:auto; padding:90px 5vw 60px;
                box-sizing:border-box; background:var(--aero-clock-bg,#030509); color:#fff;
            }
            #aero-site-clock-overlay.open { display:block; animation:aeroSiteClockIn .2s ease both; }
            @keyframes aeroSiteClockIn { from { opacity:0; } to { opacity:1; } }
            .aero-site-clock-shell { max-width:1180px; margin:0 auto; }
            .aero-site-clock-heading { text-align:center; }
            .aero-site-clock-heading h2 { margin:0 0 .45rem; font:800 clamp(1.8rem,4vw,3.5rem) Montserrat,sans-serif; letter-spacing:.08em; text-transform:uppercase; }
            .aero-site-clock-heading p { margin:0; color:rgba(255,255,255,.62); }
            .aero-site-clock-display {
                margin:clamp(2.2rem,7vw,6rem) auto 2.3rem; padding:clamp(1.4rem,5vw,4.5rem) 2vw;
                border:1px solid color-mix(in srgb,var(--aero-clock-accent,#2c7ffc) 38%,transparent);
                border-radius:32px; background:linear-gradient(145deg,color-mix(in srgb,var(--aero-clock-accent,#2c7ffc) 17%,var(--aero-clock-bg,#030509)),rgba(0,0,0,.3));
                box-shadow:0 26px 70px rgba(0,0,0,.35),0 0 50px color-mix(in srgb,var(--aero-clock-accent,#2c7ffc) 12%,transparent); text-align:center;
            }
            .aero-site-clock-time { color:#fff; font:700 clamp(3.2rem,12vw,10rem)/.95 "Courier New",monospace; letter-spacing:.06em; font-variant-numeric:tabular-nums; text-shadow:0 0 22px var(--aero-clock-accent,#2c7ffc); }
            .aero-site-clock-date { margin-top:1.2rem; color:rgba(255,255,255,.66); font:600 clamp(.8rem,1.6vw,1.1rem) Montserrat,sans-serif; letter-spacing:.16em; text-transform:uppercase; }
            .aero-site-clock-display.liquid { border-color:rgba(255,255,255,.5); background:linear-gradient(135deg,rgba(255,255,255,.28),rgba(126,207,255,.12) 38%,rgba(221,146,255,.22)); backdrop-filter:blur(18px) saturate(150%); box-shadow:inset 0 1px 0 rgba(255,255,255,.55),0 24px 65px rgba(0,60,130,.34); }
            .aero-site-clock-display.liquid .aero-site-clock-time { text-shadow:0 2px 0 rgba(255,255,255,.32),0 0 28px rgba(111,213,255,.95); -webkit-text-stroke:1px rgba(255,255,255,.18); }
            .aero-site-clock-display.neon .aero-site-clock-time { color:var(--aero-clock-accent,#2c7ffc); text-shadow:0 0 8px var(--aero-clock-accent,#2c7ffc),0 0 35px var(--aero-clock-accent,#2c7ffc); }
            .aero-site-clock-display.minimal { background:transparent; box-shadow:none; }
            .aero-site-clock-time.font-square { font-family:Impact,"Arial Narrow Bold",sans-serif; }
            .aero-site-clock-time.font-rounded { font-family:"Trebuchet MS",Arial,sans-serif; letter-spacing:.02em; }
            .aero-site-clock-time.font-serif { font-family:Georgia,serif; letter-spacing:.02em; }
            .aero-site-clock-controls { display:flex; flex-wrap:wrap; justify-content:center; gap:1rem; }
            .aero-site-clock-control { display:grid; gap:.4rem; min-width:170px; color:rgba(255,255,255,.75); font:800 .72rem Montserrat,sans-serif; letter-spacing:.08em; text-transform:uppercase; }
            .aero-site-clock-control select,.aero-site-clock-control button { width:100%; min-height:42px; border:1px solid rgba(130,185,255,.3); border-radius:10px; background:rgba(7,18,38,.8); color:#fff; padding:.65rem .75rem; font:inherit; text-transform:none; cursor:pointer; }
            .aero-site-clock-control button { background:var(--aero-clock-accent,#2c7ffc); }
            .aero-site-clock-close { display:block; width:max-content; margin:2rem auto 0; color:rgba(255,255,255,.75); cursor:pointer; font:600 .8rem Montserrat,sans-serif; }
            @media(max-width:850px) { .aero-site-status { gap:3px; margin-right:4px; } .aero-site-status-item { padding:6px; font-size:.6rem; } }
            @media(max-width:620px) { .aero-site-status .aero-site-online { display:none; } .aero-site-status { order:3; width:100%; margin:4px 0 0; } }
        `;
        document.head.appendChild(style);

        const nav = document.querySelector('nav');
        if (nav) {
            const navLinks = nav.querySelector('div[style*="justify-content:center"]') || nav.children[2];
            const status = document.createElement('div');
            status.className = 'aero-site-status';
            status.innerHTML = '<button class="aero-site-status-item aero-site-clock" id="aeroSiteClock" type="button" aria-label="Open clock easter egg">PST --:--:--</button>' +
                '<span class="aero-site-status-item aero-site-battery" id="aeroSiteBattery">Battery --</span>' +
                '<span class="aero-site-status-item aero-site-online" id="aeroSiteOnline">Online</span>';
            if (navLinks && navLinks.parentNode) navLinks.parentNode.insertBefore(status, navLinks.nextSibling);
            else nav.appendChild(status);
        }

        const overlay = document.createElement('section');
        overlay.id = 'aero-site-clock-overlay';
        overlay.setAttribute('aria-hidden', 'true');
        overlay.innerHTML = `
            <div class="aero-site-clock-shell">
                <header class="aero-site-clock-heading"><h2>Pacific Time</h2><p>Your little Aerodynamix clock easter egg.</p></header>
                <div class="aero-site-clock-display" id="aeroSiteClockDisplay">
                    <div class="aero-site-clock-time" id="aeroSiteClockTime">--:--:--</div>
                    <div class="aero-site-clock-date" id="aeroSiteClockDate">Loading time…</div>
                </div>
                <div class="aero-site-clock-controls">
                    <label class="aero-site-clock-control">Number style<select id="aeroSiteClockFont"><option value="digital">Digital Mono</option><option value="square">Square Tech</option><option value="rounded">Rounded</option><option value="serif">Classic Serif</option></select></label>
                    <label class="aero-site-clock-control">Display look<select id="aeroSiteClockStyle"><option value="theme">Match current theme</option><option value="liquid">Liquid glass</option><option value="neon">Neon glow</option><option value="minimal">Minimal</option></select></label>
                    <label class="aero-site-clock-control">Time format<button type="button" id="aeroSiteClockFormat">Switch to 24-hour</button></label>
                </div>
                <button class="aero-site-clock-close" id="aeroSiteClockClose" type="button">← Close clock</button>
            </div>`;
        document.body.appendChild(overlay);

        const save = () => { try { localStorage.setItem(clockSettingsKey, JSON.stringify(clockSettings)); } catch (error) {} };
        const update = () => {
            const now = new Date();
            const use24 = clockSettings.clock24 === true;
            document.getElementById('aeroSiteClockTime').textContent = new Intl.DateTimeFormat('en-US', { timeZone:'America/Los_Angeles', hour:'2-digit', minute:'2-digit', second:'2-digit', hour12:!use24 }).format(now);
            document.getElementById('aeroSiteClockDate').textContent = new Intl.DateTimeFormat('en-US', { timeZone:'America/Los_Angeles', weekday:'long', month:'long', day:'numeric', year:'numeric' }).format(now);
            document.getElementById('aeroSiteClock').textContent = 'PST ' + new Intl.DateTimeFormat('en-US', { timeZone:'America/Los_Angeles', hour:'2-digit', minute:'2-digit', second:'2-digit', hour12:true }).format(now);
        };
        const apply = () => {
            const display = document.getElementById('aeroSiteClockDisplay');
            const selected = clockSettings.clockStyle || 'theme';
            display.classList.remove('liquid','neon','minimal');
            display.classList.add(selected === 'theme' ? (document.body.dataset.theme === 'frutiger-aero' ? 'liquid' : 'minimal') : selected);
            document.getElementById('aeroSiteClockTime').className = 'aero-site-clock-time font-' + (clockSettings.clockFont || 'digital');
            document.getElementById('aeroSiteClockFont').value = clockSettings.clockFont || 'digital';
            document.getElementById('aeroSiteClockStyle').value = selected;
            document.getElementById('aeroSiteClockFormat').textContent = clockSettings.clock24 ? 'Switch to 12-hour' : 'Switch to 24-hour';
        };
        const open = () => { overlay.classList.add('open'); overlay.setAttribute('aria-hidden','false'); update(); apply(); };
        const close = () => { overlay.classList.remove('open'); overlay.setAttribute('aria-hidden','true'); };
        document.getElementById('aeroSiteClock').addEventListener('click', open);
        document.getElementById('aeroSiteClockClose').addEventListener('click', close);
        document.getElementById('aeroSiteClockFont').addEventListener('change', e => { clockSettings.clockFont=e.target.value; save(); apply(); });
        document.getElementById('aeroSiteClockStyle').addEventListener('change', e => { clockSettings.clockStyle=e.target.value; save(); apply(); });
        document.getElementById('aeroSiteClockFormat').addEventListener('click', () => { clockSettings.clock24=!clockSettings.clock24; save(); update(); apply(); });
        document.addEventListener('keydown', e => { if (e.key === 'Escape' && overlay.classList.contains('open')) close(); });
        setInterval(update, 1000);
        if (navigator.getBattery) navigator.getBattery().then(battery => {
            const render = () => { const pct=Math.round(battery.level*100); const el=document.getElementById('aeroSiteBattery'); el.textContent='Battery '+pct+'%'+(battery.charging?' ⚡':''); };
            render(); battery.addEventListener('levelchange',render); battery.addEventListener('chargingchange',render);
        }).catch(() => { document.getElementById('aeroSiteBattery').textContent='Battery unavailable'; });
        const online = () => { document.getElementById('aeroSiteOnline').textContent = navigator.onLine ? 'Online' : 'Offline'; };
        online(); window.addEventListener('online',online); window.addEventListener('offline',online);
    }

    function startSiteMessageNotifications() {
        if (window.__aeroSiteMessageNotifications || location.protocol === 'file:') return;
        window.__aeroSiteMessageNotifications = true;

        const style = document.createElement('style');
        style.textContent = `
            #aero-site-message-notification {
                position: fixed; top: 14px; left: 50%; z-index: 10101;
                display: flex; align-items: center; gap: 11px;
                width: min(410px, calc(100% - 28px)); box-sizing: border-box;
                padding: 10px 14px 10px 10px; border: 1px solid rgba(130,185,255,.42);
                border-radius: 14px; background: rgba(7,18,38,.97); color: #fff;
                box-shadow: 0 14px 44px rgba(0,0,0,.55); opacity: 0;
                transform: translate(-50%, -18px); pointer-events: none; cursor: pointer;
                transition: opacity .18s ease, transform .18s ease;
                font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;
            }
            #aero-site-message-notification.show {
                opacity: 1; transform: translate(-50%, 0); pointer-events: auto;
            }
            #aero-site-message-notification .aero-site-message-avatar {
                width: 38px; height: 38px; flex: 0 0 38px; border-radius: 50%;
                display: grid; place-items: center; overflow: hidden;
                background: rgba(44,127,252,.28); color: #fff;
                font-size: .72rem; font-weight: 800;
            }
            #aero-site-message-notification img {
                width: 100%; height: 100%; object-fit: cover;
            }
            #aero-site-message-notification .aero-site-message-copy {
                min-width: 0; line-height: 1.25;
            }
            #aero-site-message-notification .aero-site-message-title {
                font-size: .82rem; font-weight: 800;
            }
            #aero-site-message-notification .aero-site-message-preview {
                margin-top: 3px; overflow: hidden; color: rgba(255,255,255,.68);
                font-size: .74rem; text-overflow: ellipsis; white-space: nowrap;
            }
        `;
        document.head.appendChild(style);

        const notification = document.createElement('div');
        notification.id = 'aero-site-message-notification';
        notification.setAttribute('role', 'alert');
        notification.setAttribute('aria-live', 'polite');
        notification.innerHTML =
            '<div class="aero-site-message-avatar"></div>' +
            '<div class="aero-site-message-copy">' +
                '<div class="aero-site-message-title">New message</div>' +
                '<div class="aero-site-message-preview"></div>' +
            '</div>';
        document.body.appendChild(notification);

        let previousUnread = null;
        let hideTimer = null;

        function showNotification(conversation) {
            const user = conversation && conversation.user;
            if (!user) return;
            const avatar = notification.querySelector('.aero-site-message-avatar');
            const title = notification.querySelector('.aero-site-message-title');
            const preview = notification.querySelector('.aero-site-message-preview');
            avatar.textContent = (user.username || '?').slice(0, 2).toUpperCase();
            if (user.pfp_url) {
                const image = document.createElement('img');
                image.alt = '';
                image.src = /^https?:\/\//i.test(user.pfp_url)
                    ? user.pfp_url
                    : new URL(user.pfp_url, location.origin).href;
                image.style.objectPosition = `${user.pfp_offset_x || 50}% ${user.pfp_offset_y || 50}%`;
                image.addEventListener('error', () => image.remove());
                avatar.textContent = '';
                avatar.appendChild(image);
            }
            title.textContent = `New message from ${user.username || 'someone'}`;
            preview.textContent = conversation.last_message?.text || 'You have an unread message';
            notification.classList.add('show');
            clearTimeout(hideTimer);
            hideTimer = setTimeout(() => notification.classList.remove('show'), 5000);
        }

        notification.addEventListener('click', () => {
            notification.classList.remove('show');
            const connectLink = document.querySelector('nav a[href$="dynamix-connect.html"]');
            if (connectLink) connectLink.click();
            else location.href = 'dynamix-connect.html';
        });

        async function pollMessages() {
            try {
                const response = await fetch('/api/dms', { credentials: 'include' });
                if (!response.ok) return;
                const data = await response.json();
                const conversations = Array.isArray(data.conversations) ? data.conversations : [];
                const totalUnread = conversations.reduce(
                    (total, conversation) => total + Number(conversation.unread || 0), 0
                );
                if (previousUnread !== null && totalUnread > previousUnread) {
                    const newest = conversations
                        .filter(conversation => Number(conversation.unread || 0) > 0)
                        .sort((a, b) => String(b.last_message?.created_at || '')
                            .localeCompare(String(a.last_message?.created_at || '')))[0];
                    if (newest) showNotification(newest);
                }
                previousUnread = totalUnread;
            } catch (error) {
                // Notifications are supplemental and must never block page loading.
            }
        }

        pollMessages();
        setInterval(pollMessages, 5000);
    }

    const PERSISTENT_ACCESS_KEY = 'aerodynamix_full_access';

    // Full access is a one-time unlock. Restore it when a new browser session
    // starts; the server also persists the same state by device/account.
    if (localStorage.getItem(PERSISTENT_ACCESS_KEY) === 'true') {
        sessionStorage.setItem('authorized', 'true');
        sessionStorage.removeItem('free_trial');
    }

    function isAuthorized() { return sessionStorage.getItem('authorized') === 'true'; }
    function isFreeTrial()  { return sessionStorage.getItem('free_trial') === 'true'; }

    // The basic experience is the default. Keep the alternate access path below
    // intact for internal use, but do not make normal visitors enter a key.
    if (!isAuthorized() && !isFreeTrial()) {
        sessionStorage.setItem('free_trial', 'true');
    }

    // Already authorized or basic mode — dispatch event and let page load normally
    if (isAuthorized() || isFreeTrial()) {
        window.dispatchEvent(new CustomEvent('aerodynamixAuthorized'));
        if (isFreeTrial()) window.dispatchEvent(new CustomEvent('aerodynamixFreeTrial'));
        revealGames();
        return;
    }

    injectStyles();
    injectOverlay();

    function injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            #key-overlay {
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background: radial-gradient(ellipse at 50% 120%, rgba(44,127,252,0.18) 0%, transparent 55%), #030509;
                z-index: 9999;
                display: flex; align-items: center; justify-content: center; flex-direction: column;
                font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif;
            }
            .key-card {
                text-align: center;
                background: rgba(10, 14, 24, 0.85);
                padding: 52px 56px 44px;
                border-radius: 22px;
                border: 1px solid rgba(44,127,252,0.22);
                box-shadow: 0 30px 80px rgba(0,0,0,0.7), 0 0 60px rgba(44,127,252,0.08), inset 0 1px 0 rgba(255,255,255,0.06);
                backdrop-filter: blur(20px);
                max-width: 400px;
                width: 90%;
                box-sizing: border-box;
            }
            .key-logo { width: 64px; height: 64px; border-radius: 16px; margin: 0 auto 22px; display: block; box-shadow: 0 8px 28px rgba(44,127,252,0.35); }
            .key-title { margin: 0 0 6px; font-size: 1.45rem; font-weight: 700; color: #fff; letter-spacing: 0.32em; text-indent: 0.32em; }
            .key-sub { margin: 0 0 30px; font-size: 0.8rem; font-weight: 400; color: rgba(255,255,255,0.45); letter-spacing: 0.08em; }
            .key-input-wrap { position: relative; width: 100%; margin: 0 auto; }
            #game-key-input {
                width: 100%; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.12);
                border-radius: 12px; color: #fff; padding: 15px 74px 15px 18px; font-size: 1rem;
                letter-spacing: 0.15em; outline: none; box-sizing: border-box;
                transition: border-color 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
                font-family: inherit;
            }
            #game-key-input::placeholder { color: rgba(255,255,255,0.25); letter-spacing: 0.05em; }
            #game-key-input:focus { border-color: rgba(44,127,252,0.65); box-shadow: 0 0 0 4px rgba(44,127,252,0.12), 0 0 24px rgba(44,127,252,0.15); background: rgba(44,127,252,0.05); }
            #toggle-password {
                position: absolute; right: 10px; top: 50%; transform: translateY(-50%);
                background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
                border-radius: 8px; color: rgba(255,255,255,0.55); padding: 6px 12px; cursor: pointer;
                font-size: 0.68rem; font-weight: 600; letter-spacing: 0.08em;
                user-select: none; transition: all 0.2s ease; font-family: inherit;
            }
            #toggle-password:hover { color: #fff; background: rgba(44,127,252,0.2); border-color: rgba(44,127,252,0.4); }
            #submit-key {
                margin-top: 22px; width: 100%;
                background: linear-gradient(135deg, #2c7ffc 0%, #1a5fd0 100%);
                border: none; border-radius: 12px; color: #fff; padding: 15px 0;
                font-size: 0.95rem; font-weight: 600; letter-spacing: 0.22em; text-indent: 0.22em;
                cursor: pointer; transition: all 0.25s ease; font-family: inherit; text-transform: uppercase;
                box-shadow: 0 10px 30px rgba(44,127,252,0.35);
            }
            #submit-key:hover { transform: translateY(-1px); box-shadow: 0 14px 40px rgba(44,127,252,0.5); filter: brightness(1.1); }
            #submit-key:active { transform: translateY(0); filter: brightness(0.95); }
            #error-msg { color: #ff5b6a; margin: 16px 0 0; display: none; font-weight: 500; font-size: 0.82rem; letter-spacing: 0.05em; }
        `;
        document.head.appendChild(style);
    }

    function injectOverlay() {
        document.body.style.overflow = 'hidden';

        const overlay = document.createElement('div');
        overlay.id = 'key-overlay';
        overlay.innerHTML = `
            <div class="key-card">
                <img src="images/logo.gif" alt="" class="key-logo">
                <h1 class="key-title">AERODYNAMIX</h1>
                <p class="key-sub">Enter your access key to continue</p>
                <div class="key-input-wrap">
                    <input type="password" id="game-key-input" placeholder="Access key" autocomplete="off">
                    <button id="toggle-password">SHOW</button>
                </div>
                <button id="submit-key">Unlock</button>
                <p id="error-msg">ACCESS DENIED</p>
            </div>
        `;
        document.body.appendChild(overlay);

        const input = document.getElementById('game-key-input');
        const button = document.getElementById('submit-key');
        const toggleBtn = document.getElementById('toggle-password');
        const error = document.getElementById('error-msg');
        const validKey = atob('U2Vld2l0aHlvdXJtaW5kNjY2JA==').trim();
        const trialKey = atob('ZnJlZXRyaWFs');

        toggleBtn.addEventListener('mousedown', () => input.type = 'text');
        toggleBtn.addEventListener('mouseup', () => input.type = 'password');
        toggleBtn.addEventListener('mouseleave', () => input.type = 'password');
        toggleBtn.addEventListener('touchstart', (e) => { e.preventDefault(); input.type = 'text'; });
        toggleBtn.addEventListener('touchend', () => input.type = 'password');

        let snitchCount = 0;
        async function checkKey() {
            const val = input.value.trim();
            if (val === 'snitch') {
                snitchCount++;
                input.value = '';
                if (snitchCount >= 3) { window.location.href = 'https://www.google.com/search?q=stop'; return; }
                return;
            } else { snitchCount = 0; }

            if (val === 'alannah') {
                error.innerText = 'sigh, she was annoying'; error.className = ''; error.style.display = 'block'; input.value = ''; return;
            } else if (val.toLowerCase() === 'bill cipher' || val.toLowerCase() === 'billcipher') {
                error.innerText = 'Reality is an illusion, The universe is a hologram, buy gold, bye!';
                error.className = 'rainbow-text'; error.style.display = 'block'; input.value = ''; return;
            } else if (val === validKey || val.toLowerCase() === validKey.toLowerCase()) {
                try {
                    const response = await fetch('/api/access/secret-unlock', {
                        method: 'POST',
                        credentials: 'same-origin'
                    });
                    if (!response.ok) throw new Error('Could not save access.');
                    localStorage.setItem(PERSISTENT_ACCESS_KEY, 'true');
                    sessionStorage.setItem('authorized', 'true');
                    sessionStorage.removeItem('free_trial');
                    dismissOverlay();
                    window.dispatchEvent(new CustomEvent('aerodynamixAuthorized'));
                    var _tries = 0;
                    (function tryApply() {
                        if (typeof applyTheme === 'function') { applyTheme('black'); }
                        else if (++_tries < 50) { setTimeout(tryApply, 80); }
                    })();
                } catch (unlockError) {
                    error.innerText = 'Could not save access. Please try again.';
                    error.className = ''; error.style.display = 'block';
                }
            } else if (val === trialKey) {
                sessionStorage.setItem('free_trial', 'true');
                dismissOverlay();
                window.dispatchEvent(new CustomEvent('aerodynamixAuthorized'));
                window.dispatchEvent(new CustomEvent('aerodynamixFreeTrial'));
                revealGames();
            } else {
                error.innerText = val.length === validKey.length ? 'Incorrect access key' : 'Incorrect access key (' + val.length + '/' + validKey.length + ')';
                error.className = ''; error.style.display = 'block'; input.value = '';
            }
        }

        function dismissOverlay() {
            overlay.remove();
            const msg = document.getElementById('no-games-msg');
            if (msg) msg.style.display = 'none';
            document.body.style.overflow = '';
        }

        button.addEventListener('click', checkKey);
        input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); checkKey(); } });
    }

    function revealGames() {
        const msg = document.getElementById('no-games-msg');
        if (msg) msg.style.display = 'none';
        const oldGames = document.getElementById('games');
        if (oldGames) {
            const parent = oldGames.parentElement;
            const newGames = oldGames.cloneNode(true);
            newGames.classList.add('revealed');
            parent.replaceChild(newGames, oldGames);
        }
        document.body.style.overflow = '';
    }
})();
