(function () {
  'use strict';

  /*
   * These placeholders are replaced while building the downloadable file.
   * The resulting standalone document does not need the hosted Aerodynamix
   * pages for Apps, Local AI, or the built-in Games catalogue.
   */
  var LOCAL_AI_HTML = '__AERO_LOCAL_AI_HTML__';
  var gamesInstalled = false;
  var commerceRemoved = false;
  var appsInstalled = false;
  var musicArtworkRepaired = false;

  function openEmbedded(title, html) {
    var existing = document.getElementById('aeroSingleFileEmbed');
    if (existing) existing.remove();

    var modal = document.createElement('div');
    modal.id = 'aeroSingleFileEmbed';
    modal.style.cssText = 'position:fixed;inset:0;z-index:2147483000;display:flex;flex-direction:column;background:#030711ef;padding:clamp(10px,2vw,26px);';
    var header = document.createElement('div');
    header.style.cssText = 'display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 14px;background:#0c1830;border:1px solid #7db8ff55;border-bottom:0;border-radius:14px 14px 0 0;color:#fff;font:600 15px Arial,sans-serif;';
    var label = document.createElement('span');
    label.textContent = title;
    var close = document.createElement('button');
    close.type = 'button';
    close.textContent = 'Close';
    close.setAttribute('aria-label', 'Close');
    close.style.cssText = 'border:0;border-radius:8px;padding:6px 12px;background:#2c7ffc;color:#fff;font:inherit;cursor:pointer;';
    header.append(label, close);

    var frame = document.createElement('iframe');
    frame.title = title;
    frame.allow = 'webgpu; microphone; camera; fullscreen; autoplay; gamepad';
    frame.setAttribute('allowfullscreen', '');
    frame.style.cssText = 'width:100%;height:100%;min-height:0;border:1px solid #7db8ff55;border-radius:0 0 14px 14px;background:#071226;';
    frame.srcdoc = html;
    modal.append(header, frame);

    close.onclick = function () { modal.remove(); };
    modal.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') modal.remove();
    });
    document.body.appendChild(modal);
    close.focus();
  }

  function addCard(grid, name, icon, description, label, callback) {
    if (!grid || grid.querySelector('[data-single-file-app="' + name + '"]')) return;
    var card = document.createElement('a');
    card.className = 'app-card';
    card.href = '#';
    card.dataset.appName = name.toLowerCase();
    card.dataset.singleFileApp = name;
    card.innerHTML =
      '<div class="app-card-art"><i class="' + icon + '"></i></div>' +
      '<div class="app-card-body"><h2>' + name + '</h2><p>' + description + '</p>' +
      '<span class="app-card-launch">' + label + ' <i class="fas fa-arrow-right"></i></span></div>';
    card.onclick = function (event) {
      event.preventDefault();
      callback();
    };
    grid.appendChild(card);
  }

  function addCurrentGames() {
    if (gamesInstalled) return;
    if (typeof GAMES === 'undefined' || !Array.isArray(GAMES)) return;

    // The download uses the real site's published game packages. Do not keep
    // stale wrapper payloads when a canonical game URL is available.
    GAMES.forEach(function (game) {
      if (game.url) delete game.content;
    });
    gamesInstalled = true;
  }

  function removeLegacyCommerce() {
    if (commerceRemoved) return;
    ['shop', 'cards', 'discs'].forEach(function (name) {
      document.querySelectorAll('[data-view="' + name + '"], [data-page="' + name + '"]').forEach(function (node) {
        node.remove();
      });
    });
    document.querySelectorAll('#balance, #shop-balance, #shop-games, #theme-shop, #card-grid').forEach(function (node) {
      node.remove();
    });
    document.querySelectorAll('.nav-tabs [data-view="shop"], .nav-tabs [data-view="cards"], .nav-tabs [data-view="discs"]').forEach(function (node) {
      node.remove();
    });
    commerceRemoved = true;
  }

  function installApps() {
    if (appsInstalled) return;
    var grid = document.querySelector('#aeroAppsView .apps-grid');
    if (!grid) return;

    addCard(grid, 'Local AI', 'fas fa-microchip',
      'Download a private on-device assistant once, then chat without an API key or hosted Aerodynamix page.',
      'Download and open',
      function () { openEmbedded('Local AI', LOCAL_AI_HTML); });

    // The retired rhythm-game app is intentionally unavailable in downloads.
    var retiredRhythmApp = ['FNF', ' Mods'].join('');
    grid.querySelectorAll('[data-single-file-app="' + retiredRhythmApp + '"], [data-app-name="fnf mods"]').forEach(function (node) {
      node.remove();
    });

    grid.querySelectorAll('.app-card[data-app-name*="soundboard"]').forEach(function (node) {
      node.remove();
    });
    appsInstalled = true;
  }

  function repairMusicArtwork() {
    if (musicArtworkRepaired) return;
    var list = document.getElementById('aeroMusicTrackList');
    if (list) {
      list.querySelectorAll('button, [role="button"], .aero-music-track').forEach(function (node) {
        if ((node.textContent || '').trim() === '20 Min') {
          var image = node.querySelector('img');
          if (image) image.src = window.AERO_LUV_RAGE_2_ART || image.src;
        }
      });
    }
    var artwork = document.getElementById('aeroMusicNowArt');
    var title = document.getElementById('aeroMusicNowTitle');
    if (artwork && title && /20\s*Min/i.test(title.textContent || '')) {
      artwork.src = window.AERO_LUV_RAGE_2_ART || artwork.src;
    }
    if (list || (artwork && title)) musicArtworkRepaired = true;
  }

  function install() {
    var embeddedGames = window.AeroLoadEmbeddedGames
      ? window.AeroLoadEmbeddedGames()
      : Promise.resolve();
    embeddedGames.then(function () {
      addCurrentGames();
      removeLegacyCommerce();
      installApps();
      repairMusicArtwork();
    }).catch(function () {
      removeLegacyCommerce();
      installApps();
      repairMusicArtwork();
    });
  }

  install();
})();