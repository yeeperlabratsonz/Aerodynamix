(function () {
  'use strict';

  const THEME_KEY = 'aerodynamixTheme';
  const LITE_KEY = 'aerodynamixLite';
  const CLOAK_KEY = 'aerodynamixTabCloak';
  const FRUTIGER_BACKGROUND = '/aerodynamix-offline/images/frutiger-aero-bg.jpg';
  const BUBBLE_SOUND = '/aerodynamix-offline/sounds/bubble-pop.mp3';
  const themes = [
    ['black', 'Black'],
    ['frutiger-aero', 'Frutiger Aero'],
    ['purple', 'Midnight Purple'],
    ['blue', 'Genesis Blue'],
    ['christmas', 'Christmas'],
    ['bubble-gum-pink', 'Bubble Gum Pink'],
    ['blood-red', 'Blood Red'],
    ['citrus-orange', 'Citrus Orange'],
    ['golden-yellow', 'Golden Yellow'],
    ['emerald-green', 'Emerald Green']
  ];

  let bubbleLayer = null;
  let bubbleTimer = null;
  let snowLayer = null;
  let snowTimer = null;

  function addStyles() {
    if (document.getElementById('aerodynamix-lite-settings-styles')) return;
    const style = document.createElement('style');
    style.id = 'aerodynamix-lite-settings-styles';
    style.textContent = `
      #settingsView {
        display: none;
        min-height: calc(100vh - 7vw);
        padding: clamp(2.5rem, 7vw, 6rem) clamp(1rem, 5vw, 5rem);
        color: #fff;
      }
      #settingsView.active {
        display: block;
      }
      .lite-settings-shell {
        width: min(780px, 100%);
        margin: 0 auto;
      }
      .lite-settings-card {
        padding: clamp(1.25rem, 4vw, 2.5rem);
        border: 1px solid #8ed0ff3d;
        border-radius: 1.1rem;
        background: linear-gradient(145deg, #0d2234ee, #07131fe8);
        box-shadow: 0 24px 80px #0008, inset 0 1px #ffffff12;
      }
      .lite-settings-card h2 {
        margin: 0 0 .6rem;
        color: inherit;
        font-size: clamp(1.45rem, 3vw, 2.1rem);
      }
      .lite-settings-card p {
        margin: 0 0 1.4rem;
        color: #a9c4da;
        line-height: 1.6;
      }
      .lite-theme-options {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: .7rem;
      }
      .lite-theme-button,
      .lite-settings-action {
        min-height: 3rem;
        padding: .75rem 1rem;
        border: 1px solid #8ed0ff35;
        border-radius: .7rem;
        color: #d9efff;
        background: #8ed0ff0d;
        font: inherit;
        font-weight: 700;
        text-align: left;
        cursor: pointer;
        transition: transform .18s ease, border-color .18s ease, background .18s ease;
      }
      .lite-theme-button:hover,
      .lite-settings-action:hover {
        border-color: #8ed0ff;
        background: #8ed0ff1e;
        transform: translateY(-1px);
      }
      .lite-theme-button.active {
        border-color: #8ed0ff;
        color: #06101b;
        background: #8ed0ff;
        box-shadow: 0 6px 20px #8ed0ff38;
      }
      .lite-settings-section {
        margin-top: 2.4rem;
        padding-top: 1.5rem;
        border-top: 1px solid #8ed0ff20;
      }
      .lite-settings-actions {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: .7rem;
      }
      .lite-settings-action {
        text-align: center;
      }
      .lite-settings-action.active {
        border-color: #65e39a;
        color: #06130a;
        background: #65e39a;
      }
      .lite-settings-status {
        min-height: 1.4em;
        margin-top: .65rem !important;
        color: #91abc0 !important;
        font-size: .82rem;
      }
      .lite-settings-back {
        display: inline-block;
        margin-top: 1.2rem;
        color: #a9c4da;
        text-decoration: none;
      }
      .lite-settings-back:hover {
        color: #fff;
      }
      .lite-manifest-card {
        display: flex;
        align-items: flex-end;
        padding: 1rem;
        background:
          radial-gradient(circle at 18% 18%, #3a86ff55, transparent 38%),
          linear-gradient(145deg, #10253a, #07111f);
      }
      .lite-manifest-card::before {
        content: 'PLAY';
        position: absolute;
        top: .8rem;
        left: .8rem;
        color: #8ed0ff;
        font-size: .65rem;
        font-weight: 800;
        letter-spacing: .14em;
      }
      .lite-manifest-card h2 {
        position: static;
        width: 100%;
        padding: 2.5rem 0 0;
        background: none;
      }
      .lite-manifest-featured {
        display: flex;
        align-items: flex-end;
        min-height: min(16vw, 220px);
        padding: 1rem;
        border: 1px solid #8ed0ff40;
        border-radius: 1.2vw;
        background:
          radial-gradient(circle at 20% 20%, #3a86ff66, transparent 40%),
          linear-gradient(145deg, #10253a, #07111f);
      }
      .lite-manifest-featured h2 {
        margin: 0;
        font-size: clamp(.7rem, 1vw, 1rem);
        line-height: 1.25;
      }
      #aerodynamix-lite-bubbles,
      #aerodynamix-lite-snow {
        position: fixed;
        inset: 0;
        overflow: hidden;
        pointer-events: none;
        z-index: 9998;
      }
      .lite-bubble {
        position: absolute;
        top: -80px;
        border: 1.5px solid #ffffffaa;
        border-radius: 50%;
        background: radial-gradient(circle at 32% 30%, #ffffffe8 0 12%, #c9edff9c 35%, #5ab4f72b 70%, transparent 100%);
        box-shadow: inset -3px -4px 9px #ffffffaa, 0 5px 18px #0078dc22;
        pointer-events: auto;
        cursor: pointer;
        animation: aerodynamix-lite-bubble-fall linear forwards;
      }
      .lite-snowflake {
        position: absolute;
        top: -8px;
        border-radius: 50%;
        background: #ffffffdd;
        animation: aerodynamix-lite-snow-fall linear infinite;
      }
      @keyframes aerodynamix-lite-bubble-fall {
        from { transform: translate3d(0, -10vh, 0); opacity: .9; }
        to { transform: translate3d(var(--bubble-drift), 115vh, 0); opacity: .2; }
      }
      @keyframes aerodynamix-lite-snow-fall {
        from { transform: translate3d(0, -10px, 0); }
        to { transform: translate3d(var(--snow-drift), 110vh, 0); }
      }
      @media (max-width: 700px) {
        #settingsView {
          min-height: calc(100vh - 64px);
          padding: 2rem .75rem 3rem;
        }
        .lite-theme-options,
        .lite-settings-actions {
          grid-template-columns: 1fr;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function addSettingsPage() {
    if (document.getElementById('settingsView')) return;
    const page = document.createElement('section');
    page.id = 'settingsView';
    page.className = 'settings-view';
    page.innerHTML = `
      <div class="lite-settings-shell">
        <div class="lite-settings-card">
          <h2>Choose Theme</h2>
          <p>Your theme, tab cloak, and performance preferences are saved in this browser.</p>
          <div class="lite-theme-options" id="liteThemeOptions">
            ${themes.map(([id, label]) => `<button class="lite-theme-button" data-lite-theme="${id}" type="button">${label}</button>`).join('')}
          </div>
          <div class="lite-settings-section">
            <h2>Performance</h2>
            <p>Lite Mode reduces visual effects and animations. It is saved automatically.</p>
            <div class="lite-settings-actions">
              <button class="lite-settings-action" id="liteModeButton" type="button">Lite Mode</button>
              <button class="lite-settings-action" id="tabCloakButton" type="button">Tab Cloak</button>
            </div>
            <p class="lite-settings-status" id="liteSettingsStatus"></p>
          </div>
          <a class="lite-settings-back" id="settingsBack" href="#">← Back to Games</a>
        </div>
      </div>
    `;
    document.querySelector('.content')?.after(page);
  }

  function removeOldSettingsAndExtraNav() {
    document.querySelector('.settings-panel')?.remove();
    document.getElementById('tipsNav')?.remove();
    document.getElementById('tipsView')?.remove();
    ['pstClock', 'batteryStatus', 'offlineStatus'].forEach(id => {
      const element = document.getElementById(id);
      if (element) element.style.display = 'none';
    });
  }

  function setFavicon(href) {
    let icon = document.querySelector('link[rel~="icon"]');
    if (!icon) {
      icon = document.createElement('link');
      icon.rel = 'icon';
      document.head.appendChild(icon);
    }
    icon.type = 'image/x-icon';
    icon.href = href;
  }

  function isTabCloaked() {
    return localStorage.getItem(CLOAK_KEY) === 'true';
  }

  function applyTabCloak(enabled) {
    document.title = enabled
      ? 'Google'
      : (document.body.dataset.originalTitle || 'Aerodynamix Lite');
    setFavicon(enabled ? 'https://www.google.com/favicon.ico' : '/aerodynamix-offline/favicon.png');
    const button = document.getElementById('tabCloakButton');
    if (button) {
      button.classList.toggle('active', enabled);
      button.textContent = enabled ? 'Tab Cloak: ON' : 'Tab Cloak: OFF';
    }
  }

  function toggleTabCloak() {
    const enabled = !isTabCloaked();
    localStorage.setItem(CLOAK_KEY, enabled ? 'true' : 'false');
    applyTabCloak(enabled);
  }

  function applyNavTheme(theme) {
    const nav = document.querySelector('nav');
    const links = document.querySelectorAll('.nav-links a');
    const settings = document.getElementById('settingsToggle');
    if (!nav) return;
    const palettes = {
      black: ['rgba(5,11,24,.97)', '#fff', '#2c7ffc'],
      'frutiger-aero': ['rgba(0,52,105,.82)', '#fff', '#0a5795'],
      purple: ['rgba(28,8,47,.96)', '#f0e0ff', '#9333ea'],
      blue: ['rgba(4,13,36,.97)', '#e0f0ff', '#3b82f6'],
      christmas: ['rgba(7,29,15,.96)', '#fcebd4', '#b92e40'],
      'bubble-gum-pink': ['#ffb6d9', '#fff', '#ff1493'],
      'blood-red': ['rgba(38,4,8,.97)', '#ffe4e4', '#d11f35'],
      'citrus-orange': ['rgba(48,24,2,.97)', '#fff0d0', '#f28b18'],
      'golden-yellow': ['rgba(42,32,0,.97)', '#fff8c4', '#d7a900'],
      'emerald-green': ['rgba(2,37,23,.97)', '#d9ffe8', '#00a866']
    };
    const palette = palettes[theme] || palettes.black;
    nav.style.background = palette[0];
    nav.style.borderBottomColor = `${palette[2]}66`;
    links.forEach(link => {
      link.style.color = link.classList.contains('active') ? '#06101b' : palette[1];
    });
    if (settings) {
      settings.style.background = palette[2];
      settings.style.color = '#fff';
      settings.style.boxShadow = `0 6px 22px ${palette[2]}55`;
    }
  }

  function applyLiteTheme(theme) {
    const valid = themes.some(([id]) => id === theme) ? theme : 'black';
    const body = document.body;
    body.style.backgroundImage = 'none';
    body.style.backgroundAttachment = '';
    body.style.backgroundSize = '';
    body.style.backgroundPosition = '';
    body.style.backgroundRepeat = '';

    const styles = {
      black: ['#030509', 'radial-gradient(ellipse at 50% 130%, rgba(44,127,252,.32), transparent 65%), radial-gradient(ellipse at 20% 0%, rgba(44,127,252,.1), transparent 35%)', '#fff', '#2c7ffc'],
      'frutiger-aero': ['#87ceeb', `url('${FRUTIGER_BACKGROUND}')`, '#002244', '#075b9f'],
      purple: ['#180826', 'radial-gradient(ellipse at 50% 130%, rgba(160,80,255,.42), transparent 65%), radial-gradient(ellipse at 80% 0%, rgba(200,100,255,.18), transparent 35%)', '#f0e0ff', '#9333ea'],
      blue: ['#040d24', 'radial-gradient(ellipse at 50% 130%, rgba(59,130,246,.45), transparent 65%), radial-gradient(ellipse at 20% 0%, rgba(96,165,250,.18), transparent 35%)', '#e0f0ff', '#3b82f6'],
      christmas: ['#0a180d', 'radial-gradient(ellipse at 50% 120%, rgba(180,40,40,.2), transparent 55%)', '#fcebd4', '#b92e40'],
      'bubble-gum-pink': ['#ff69b4', 'none', '#fff', '#ff1493'],
      'blood-red': ['#250408', 'radial-gradient(ellipse at 50% 120%, rgba(210,20,45,.35), transparent 65%)', '#ffe4e4', '#d11f35'],
      'citrus-orange': ['#321b03', 'radial-gradient(ellipse at 50% 120%, rgba(242,139,24,.35), transparent 65%)', '#fff0d0', '#f28b18'],
      'golden-yellow': ['#2a2100', 'radial-gradient(ellipse at 50% 120%, rgba(255,208,0,.35), transparent 65%)', '#fff8c4', '#d7a900'],
      'emerald-green': ['#022517', 'radial-gradient(ellipse at 50% 120%, rgba(0,168,102,.35), transparent 65%)', '#d9ffe8', '#00a866']
    };
    const [background, image, color, accent] = styles[valid];
    body.style.backgroundColor = background;
    body.style.backgroundImage = image;
    body.style.backgroundSize = 'cover';
    body.style.backgroundAttachment = 'fixed';
    body.style.backgroundPosition = 'center';
    body.style.backgroundRepeat = 'no-repeat';
    body.style.color = color;
    document.documentElement.style.setProperty('--accent', accent);
    document.querySelectorAll('[data-lite-theme]').forEach(button => {
      button.classList.toggle('active', button.dataset.liteTheme === valid);
    });
    document.querySelectorAll('#settingsView h2').forEach(heading => {
      heading.style.color = color;
    });
    applyNavTheme(valid);
    localStorage.setItem(THEME_KEY, valid);
    syncEffects(valid);
  }

  function clearBubbles() {
    if (bubbleTimer) {
      clearInterval(bubbleTimer);
      bubbleTimer = null;
    }
    bubbleLayer?.remove();
    bubbleLayer = null;
  }

  function addBubble() {
    if (!bubbleLayer || bubbleLayer.children.length >= 22) return;
    const bubble = document.createElement('div');
    const size = 24 + Math.random() * 48;
    bubble.className = 'lite-bubble';
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    bubble.style.left = `${Math.random() * 96}vw`;
    bubble.style.animationDuration = `${3 + Math.random() * 4}s`;
    bubble.style.setProperty('--bubble-drift', `${-28 + Math.random() * 56}px`);
    bubble.addEventListener('click', () => bubble.remove());
    bubbleLayer.appendChild(bubble);
  }

  function startBubbles() {
    if (bubbleLayer) return;
    bubbleLayer = document.createElement('div');
    bubbleLayer.id = 'aerodynamix-lite-bubbles';
    document.body.appendChild(bubbleLayer);
    for (let i = 0; i < 8; i += 1) addBubble();
    bubbleTimer = setInterval(addBubble, 650);
  }

  function clearSnow() {
    if (snowTimer) {
      clearInterval(snowTimer);
      snowTimer = null;
    }
    snowLayer?.remove();
    snowLayer = null;
  }

  function addSnowflake() {
    if (!snowLayer || snowLayer.children.length >= 55) return;
    const flake = document.createElement('div');
    const size = 2 + Math.random() * 4;
    flake.className = 'lite-snowflake';
    flake.style.width = `${size}px`;
    flake.style.height = `${size}px`;
    flake.style.left = `${Math.random() * 100}vw`;
    flake.style.opacity = `${.35 + Math.random() * .55}`;
    flake.style.animationDuration = `${5 + Math.random() * 6}s`;
    flake.style.animationDelay = `${-Math.random() * 6}s`;
    flake.style.setProperty('--snow-drift', `${-18 + Math.random() * 36}px`);
    snowLayer.appendChild(flake);
  }

  function startSnow() {
    if (snowLayer) return;
    snowLayer = document.createElement('div');
    snowLayer.id = 'aerodynamix-lite-snow';
    document.body.appendChild(snowLayer);
    for (let i = 0; i < 55; i += 1) addSnowflake();
    snowTimer = setInterval(addSnowflake, 500);
  }

  function syncEffects(theme) {
    if (localStorage.getItem(LITE_KEY) === 'true') {
      clearBubbles();
      clearSnow();
      return;
    }
    if (theme === 'frutiger-aero') startBubbles();
    else clearBubbles();
    if (theme === 'christmas') startSnow();
    else clearSnow();
  }

  function showLiteView(view) {
    const games = document.querySelector('.content');
    const media = document.getElementById('mediaView');
    const settings = document.getElementById('settingsView');
    if (!games || !media || !settings) return;
    games.style.display = view === 'games' ? 'block' : 'none';
    media.classList.toggle('active', view === 'media');
    settings.classList.toggle('active', view === 'settings');
    document.querySelectorAll('.nav-links a, #settingsToggle').forEach(link => link.classList.remove('active'));
    const active = view === 'settings'
      ? document.getElementById('settingsToggle')
      : document.getElementById(`${view}Nav`);
    active?.classList.add('active');
    window.scrollTo(0, 0);
  }

  function installHtmlGameLaunchFix() {
    const fallbackGames = [
      {title: 'Run 3', game: 'attached_assets/clrun3_1785269152832.html'},
      {title: 'Drive Mad', game: 'attached_assets/cldrivemad_1785269192927.html'},
      {title: "Papa's Pizzeria", game: 'games/papaspizzeria/'},
      {title: 'Super Smash Flash', game: 'games/supersmashflash/'},
      {title: 'Retrobowl', game: 'attached_assets/clretrobowl_1785269280952.html'},
      {title: 'Slope', game: 'games/slope/'},
      {title: 'Minecraft', game: 'attached_assets/Eaglercraft1.12_1785377874032.html'},
      {title: "Papa's Freezeria", game: 'games/papasfreezeria/'},
      {title: "Papa's Pancakeria", game: 'attached_assets/clpapaspancakeria_1785823156106.html'},
      {title: "Papa's Bakeria", game: 'attached_assets/clpapabakeria_1785823158430.html'},
      {title: 'Meat Boy', game: 'attached_assets/Meatboy_1785823544552.html'},
      {title: 'Newgrounds Rumble', game: 'attached_assets/clnewgroundsrumble_1785823619219.html'},
      {title: 'We Become What We Behold', game: 'attached_assets/clwebecomewhatwebehold_1785823806062.html'},
      {title: 'Bad Time Simulator', game: 'attached_assets/clbadtimesim_1785823969837.html'},
      {title: 'Deltarune', game: 'attached_assets/cldeltarune_1785824146159.html'},
      {title: 'Adventure Capitalist', game: 'games/adventure-capitalist/'},
      {title: "Friday Night Funkin'", game: 'games/fridaynightfunkin/'},
      {title: 'Run 2', game: 'games/run-2/'},
      {title: "Pico's School", game: 'games/picoschool/'},
      {title: "World's Hardest Game", game: 'games/worldshardestgame/'},
      {title: 'Sandboxels', game: 'games/sandboxels/'},
      {title: 'Alien Hominid', game: 'attached_assets/Alien_Hominid_1784867581921.html'},
      {title: 'Subway Surfers San Francisco', game: 'attached_assets/clsubwaysurferssanfrancisco_(1)_1784785408303.html'},
      {title: 'Hobo 1', game: 'attached_assets/hobo-fixed-1.html'},
      {title: 'Hobo 2', game: 'attached_assets/hobo-fixed-2.html'},
      {title: 'Hobo 3', game: 'attached_assets/hobo-fixed-3.html'},
      {title: 'Hobo 4', game: 'attached_assets/hobo-fixed-4.html'},
      {title: 'Hobo 5', game: 'attached_assets/hobo-fixed-5.html'},
      {title: 'Hobo 6', game: 'attached_assets/hobo-fixed-6.html'},
      {title: 'Hobo 7', game: 'attached_assets/hobo-fixed-7.html'},
      {title: 'Gladihoppers', game: 'attached_assets/Gladihoppers_1784866393639.html'},
      {title: 'Fruit Ninja', game: 'attached_assets/Fruit_Ninja_1784866426153.html'},
      {title: 'Binding Of Isaac: Wrath Of The Lamb', game: 'attached_assets/Binding_of_Issac__Wrath_of_the_Lamb_1784866537332.html'},
      {title: 'Crossy Road', game: 'attached_assets/Crossy_Road_1785017138507.html'},
      {title: 'Cookie Clicker', game: 'attached_assets/Cookie_Clicker_1785028048876.html'},
      {title: 'Duck Life', game: 'attached_assets/Duck_Life_1785028116865.html'},
      {title: 'Geometry Dash Lite', game: 'attached_assets/clgdlite_1785028362055.html'},
      {title: 'Doom', game: 'attached_assets/DOOM_1785028500807.html'},
      {title: 'Doki Doki Literature Club', game: 'attached_assets/cldokidokiliteratureclub_1785271141970.html'},
      {title: "Baldi's Basics Classic Remastered", game: 'attached_assets/clbaldisbasicsremaster_1785376652529.html'},
      {title: 'Breaking The Bank', game: 'attached_assets/clstickminbreakingbank_1785806522581.html'},
      {title: 'Escaping The Prison', game: 'attached_assets/clstickminescapingprison_1785806520945.html'},
      {title: 'Stealing The Diamond', game: 'attached_assets/clstickmanstealingdiamond_1785806516884.html'},
      {title: 'Infiltrating The Airship', game: 'attached_assets/clstickminairship_1785806516884.html'},
      {title: 'Fleeing The Complex', game: 'attached_assets/clstickminfleecomplex_1785806519008.html'}
    ];
    let games = fallbackGames;
    try {
      const embeddedGames = window.eval('GAMES');
      if (Array.isArray(embeddedGames) && embeddedGames.length) games = embeddedGames;
    } catch (error) {}

    const grid = document.getElementById('grid');
    const featured = document.getElementById('featured');
    const search = document.getElementById('search');
    const count = document.getElementById('count');
    const empty = document.getElementById('empty');
    if (!grid || !featured || !search) return;

    const escapeHtml = value => String(value || '').replace(/[&<>"']/g, char => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[char]));

    const launchFromCard = event => {
      const card = event.target.closest('[data-lite-game]');
      if (!card) return;
      const game = games[Number(card.dataset.liteGame)];
      const source = game?.game || game?.content;
      if (!source) return;

      const frame = document.getElementById('frame');
      const player = document.getElementById('player');
      const playing = document.getElementById('playing');
      if (!frame || !player || !playing) return;

      event.preventDefault();
      event.stopImmediatePropagation();
      playing.textContent = game.title || '';
      frame.src = source.startsWith('data:') || source.startsWith('/')
        ? source
        : `/${source}`;
      player.classList.add('open');
      document.body.style.overflow = 'hidden';
    };

    const card = (game, index, isFeatured) => isFeatured
      ? `<article class="featured-card lite-manifest-featured" data-lite-game="${index}"><h2>${escapeHtml(game.title)}</h2></article>`
      : `<article class="card lite-manifest-card" data-lite-game="${index}"><h2>${escapeHtml(game.title)}</h2></article>`;

    const render = () => {
      const query = search.value.trim().toLowerCase();
      const matches = games
        .map((game, index) => ({ game, index }))
        .filter(({ game }) => String(game.title || '').toLowerCase().includes(query));
      grid.innerHTML = matches.map(({ game, index }) => card(game, index, false)).join('');
      featured.innerHTML = games.slice(0, 4).map((game, index) => card(game, index, true)).join('');
      if (count) count.textContent = `${matches.length} OF ${games.length} GAMES`;
      if (empty) empty.style.display = matches.length ? 'none' : 'block';
      grid.querySelectorAll('[data-lite-game]').forEach(element => {
        element.onclick = launchFromCard;
      });
      featured.querySelectorAll('[data-lite-game]').forEach(element => {
        element.onclick = launchFromCard;
      });
    };

    search.oninput = render;
    document.getElementById('searchButton')?.addEventListener('click', render);
    render();
  }

  function addMagnoliaToLitePlayer() {
    const playlist = document.getElementById('playlist');
    if (!playlist) {
      window.setTimeout(addMagnoliaToLitePlayer, 250);
      return;
    }
    if (document.getElementById('liteMagnoliaTrack')) return;

    const audio = document.getElementById('liteMagnoliaAudio') || document.createElement('audio');
    audio.id = 'liteMagnoliaAudio';
    audio.src = '/attached_assets/magnolia.mp3';
    audio.preload = 'metadata';
    audio.controls = true;
    audio.style.cssText = 'display:none; width:100%; margin:8px 12px 12px;';
    if (!audio.parentElement) playlist.parentElement?.appendChild(audio);

    const item = document.createElement('button');
    item.id = 'liteMagnoliaTrack';
    item.type = 'button';
    item.className = 'playlist-item';
    item.style.cssText = 'width:100%; border:0; text-align:left; background:transparent; font:inherit;';
    item.innerHTML = `
      <div class="pl-thumb"><img src="/attached_assets/magnolia-cover.jpg" alt=""></div>
      <div class="pl-info">
        <div class="pl-name">Magnolia</div>
        <div class="pl-meta">Playboi Carti · audio</div>
      </div>`;
    item.addEventListener('click', () => {
      const title = document.getElementById('trackTitle');
      const artist = document.getElementById('trackArtist');
      const album = document.getElementById('trackAlbum');
      const art = document.getElementById('albumArt');
      const audioPlayer = document.getElementById('audioPlayer');
      if (title) title.textContent = 'Magnolia';
      if (artist) artist.textContent = 'Playboi Carti';
      if (album) album.textContent = 'Playboi Carti';
      if (art) {
        art.src = '/attached_assets/magnolia-cover.jpg';
        art.hidden = false;
      }
      if (audioPlayer) audioPlayer.classList.add('visible');
      audio.style.display = 'block';
      audio.play().catch(() => {});
    });
    playlist.prepend(item);
  }

  function updateLiteMode() {
    const enabled = localStorage.getItem(LITE_KEY) === 'true';
    document.body.classList.toggle('lite-mode', enabled);
    const button = document.getElementById('liteModeButton');
    const status = document.getElementById('liteSettingsStatus');
    if (button) {
      button.classList.toggle('active', enabled);
      button.textContent = enabled ? 'Lite Mode: ON' : 'Lite Mode: OFF';
    }
    if (status && !status.dataset.cloakMessage) {
      status.textContent = enabled
        ? 'Lite Mode is active. Visual effects are reduced.'
        : 'Lite Mode is off. Full theme effects are enabled.';
    }
  }

  function toggleLiteMode() {
    const enabled = localStorage.getItem(LITE_KEY) === 'true';
    localStorage.setItem(LITE_KEY, enabled ? 'false' : 'true');
    updateLiteMode();
    window.dispatchEvent(new CustomEvent('aerodynamixLiteChanged', {detail: {enabled: !enabled}}));
  }

  function wirePage() {
    const settingsToggle = document.getElementById('settingsToggle');
    const gamesNav = document.getElementById('gamesNav');
    const mediaNav = document.getElementById('mediaNav');
    if (settingsToggle) settingsToggle.onclick = null;
    settingsToggle?.addEventListener('click', event => {
      event.preventDefault();
      window.location.href = '/aerodynamix-lite-settings.html';
    });
    gamesNav?.addEventListener('click', event => {
      event.preventDefault();
      showLiteView('games');
    });
    mediaNav?.addEventListener('click', event => {
      event.preventDefault();
      showLiteView('media');
    });
    document.getElementById('settingsBack')?.addEventListener('click', event => {
      event.preventDefault();
      window.location.href = '/aerodynamix-lite/';
    });
    document.querySelectorAll('[data-lite-theme]').forEach(button => {
      button.addEventListener('click', () => applyLiteTheme(button.dataset.liteTheme));
    });
    document.getElementById('liteModeButton')?.addEventListener('click', toggleLiteMode);
    document.getElementById('tabCloakButton')?.addEventListener('click', toggleTabCloak);
  }

  function init() {
    if (document.getElementById('aerodynamix-lite-settings-styles')) return;
    if (document.body && !document.body.dataset.originalTitle) {
      document.body.dataset.originalTitle = document.title;
    }
    addStyles();
    removeOldSettingsAndExtraNav();
    addSettingsPage();
    wirePage();
    installHtmlGameLaunchFix();
    addMagnoliaToLitePlayer();
    const settingsToggle = document.getElementById('settingsToggle');
    if (settingsToggle) settingsToggle.href = '/aerodynamix-lite-settings.html';
    const settingsBack = document.getElementById('settingsBack');
    if (settingsBack) settingsBack.href = '/aerodynamix-lite/';
    updateLiteMode();
    const savedCloak = localStorage.getItem(CLOAK_KEY);
    if (savedCloak === null) localStorage.setItem(CLOAK_KEY, 'true');
    applyTabCloak(isTabCloaked());
    applyLiteTheme(localStorage.getItem(THEME_KEY) || 'black');
    showLiteView(
      window.location.pathname.endsWith('/aerodynamix-lite-settings.html') ||
      window.location.hash === '#settings'
        ? 'settings'
        : 'games'
    );
  }

  window.applyLiteTheme = applyLiteTheme;
  window.toggleLiteMode = toggleLiteMode;
  window.toggleLiteTabCloak = toggleTabCloak;

  if (document.getElementById('grid')) {
    init();
  } else if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, {once: true});
  } else {
    init();
  }

  window.addEventListener('load', () => {
    installHtmlGameLaunchFix();
    addMagnoliaToLitePlayer();
  }, {once: true});
})();