/* Private Dev Tools page for the Aerodynamix Dev Edition. */
(function () {
  'use strict';
  var ORIGIN = 'https://aerodynamix20.onrender.com';
  var panel, settingsCard, access = false, refreshTimer;

  function api(path, options) {
    return fetch(ORIGIN + path, Object.assign({
      credentials: 'include',
      mode: 'cors',
      cache: 'no-store'
    }, options || {}))
      .then(function (response) {
        return response.json().catch(function () { return {}; }).then(function (data) {
          if (!response.ok) {
            var fallback = response.status === 404
              ? 'The Dev Tools moderation routes are not deployed on the Connect server yet.'
              : ('Server returned HTTP ' + response.status + '.');
            var error = new Error(data.error || fallback);
            error.status = response.status;
            throw error;
          }
          return data;
        });
      })
      .catch(function (error) {
        if (error && error.status) throw error;
        throw new Error('Could not reach the Connect server. Check your internet connection, then sign in to Connect again.');
      });
  }

  function escapeHtml(value) {
    var div = document.createElement('div');
    div.textContent = value == null ? '' : String(value);
    return div.innerHTML;
  }

  function addPanelStyles() {
    if (document.getElementById('aeroDevPanelStyles')) return;
    var style = document.createElement('style');
    style.id = 'aeroDevPanelStyles';
    style.textContent = [
        '#aeroDevPanel{display:none;min-height:100vh;box-sizing:border-box;padding:clamp(96px,10vw,138px) 24px 60px;color:var(--standalone-text,#fff);font-family:Montserrat,sans-serif}',
        '#aeroDevPanel.active{display:block;animation:aeroViewIn .24s ease both}',
        '.aero-dev-panel button{border:0;border-radius:10px;padding:11px 16px;background:var(--standalone-accent,#2c7ffc);color:#fff;font:700 .82rem Montserrat,sans-serif;cursor:pointer}',
        '.aero-dev-panel{max-width:980px;margin:0 auto}',
        '.aero-dev-panel-head{display:flex;align-items:end;justify-content:space-between;gap:20px;margin-bottom:22px}.aero-dev-panel h2{margin:0;font-size:clamp(1.8rem,4vw,3rem)}',
        '.aero-dev-panel-kicker{color:#6ba8ff;font-size:.72rem;font-weight:800;letter-spacing:.18em;text-transform:uppercase;margin-bottom:8px}',
        '.aero-dev-panel-sub{color:rgba(255,255,255,.58);margin:8px 0 0}.aero-dev-panel-card{background:rgba(10,14,24,.86);border:1px solid rgba(44,127,252,.25);border-radius:18px;padding:20px;margin-bottom:18px;box-shadow:0 18px 50px rgba(0,0,0,.3)}',
        '.aero-dev-search{display:flex;gap:10px}.aero-dev-search input{flex:1;min-width:0;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.14);border-radius:10px;color:#fff;padding:12px 14px;font:inherit;outline:none}',
        '.aero-dev-list{display:grid;gap:10px}.aero-dev-row{display:flex;align-items:center;justify-content:space-between;gap:14px;padding:14px;border:1px solid rgba(255,255,255,.1);border-radius:12px;background:rgba(255,255,255,.035)}',
        '.aero-dev-user{display:flex;align-items:center;gap:11px;min-width:0}.aero-dev-avatar{width:38px;height:38px;border-radius:50%;display:grid;place-items:center;background:linear-gradient(135deg,#2c7ffc,#a855f7);font-weight:800;flex:none}.aero-dev-name{font-weight:800}.aero-dev-meta{font-size:.78rem;color:rgba(255,255,255,.55);margin-top:4px}.aero-dev-actions{display:flex;align-items:center;gap:8px;flex-wrap:wrap;justify-content:flex-end}.aero-dev-actions button.secondary{background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.16)}.aero-dev-actions button.danger{background:#a83245}.aero-dev-status{color:#ffb0b9;font-size:.78rem}.aero-dev-status.perma{color:#ff7182}.aero-dev-status.clear{color:#70d99a}.aero-dev-message{min-height:20px;color:#70d99a;font-size:.85rem;margin:10px 0 0}.aero-dev-message.error{color:#ff7182}.aero-dev-section-title{display:flex;justify-content:space-between;align-items:center;margin:0 0 12px}.aero-dev-section-title h3{margin:0}.aero-dev-badge{color:#70d99a;font-size:.75rem;font-weight:700}.aero-dev-verified{color:#70d99a;margin-left:4px}.aero-dev-hidden{display:none!important}@media(max-width:620px){.aero-dev-panel{padding-left:14px;padding-right:14px}.aero-dev-panel-head{display:block}.aero-dev-row{align-items:flex-start;flex-direction:column}.aero-dev-actions{justify-content:flex-start}.aero-dev-search{display:block}.aero-dev-search button{margin-top:8px;width:100%}}'
    ].join('');
    document.head.appendChild(style);
  }

  function closeOtherViews() {
    ['aeroSettingsView', 'aeroConnectView', 'aeroAppsView', 'aeroDrawingView', 'aeroClockView', 'aeroDevPanel'].forEach(function (id) {
      var view = document.getElementById(id);
      if (view) view.classList.remove('active');
    });
    var games = document.querySelector('main.content');
    if (games) games.style.display = 'none';
    document.querySelectorAll('.nav-links a, .settings-nav').forEach(function (link) { link.classList.remove('active'); });
  }

  function remaining(expiresAt) {
    if (!expiresAt) return '<span class="aero-dev-status perma">Permanent ban</span>';
    var ms = new Date(expiresAt).getTime() - Date.now();
    if (ms <= 0) return '<span class="aero-dev-status clear">Expired</span>';
    var minutes = Math.ceil(ms / 60000), days = Math.floor(minutes / 1440);
    minutes %= 1440;
    var hours = Math.floor(minutes / 60);
    minutes %= 60;
    var label = (days ? days + 'd ' : '') + (hours ? hours + 'h ' : '') + minutes + 'm left';
    return '<span class="aero-dev-status">' + label.trim() + '</span>';
  }

  function message(text, error) {
    var el = panel && panel.querySelector('#aeroDevMessage');
    if (!el) return;
    el.textContent = text || '';
    el.classList.toggle('error', !!error);
  }

  function userRow(user) {
    var ban = user.active_ban;
    return '<div class="aero-dev-row" data-user-id="' + user.id + '">' +
      '<div class="aero-dev-user"><div class="aero-dev-avatar">' + escapeHtml(user.username.slice(0, 2).toUpperCase()) + '</div><div><div class="aero-dev-name">' + escapeHtml(user.username) + (user.is_verified ? '<span class="aero-dev-verified" title="Verified">✓</span>' : '') + '</div><div class="aero-dev-meta">' + (ban ? escapeHtml(ban.reason) : 'No active ban') + '</div></div></div>' +
      '<div class="aero-dev-actions">' + (ban ? remaining(ban.expires_at) + '<button class="danger" data-unban="' + ban.id + '">Unban</button>' : '<span class="aero-dev-status clear">Clear</span>') +
      '<button class="secondary" data-verify="' + user.id + '" data-value="' + (!user.is_verified) + '">' + (user.is_verified ? 'Remove verified' : 'Give verified') + '</button></div></div>';
  }

  function banRow(ban) {
    return '<div class="aero-dev-row"><div><div class="aero-dev-name">' + escapeHtml(ban.username || 'Unknown user') + '</div><div class="aero-dev-meta">' + escapeHtml(ban.reason) + '</div></div><div class="aero-dev-actions">' + remaining(ban.expires_at) + '<button class="danger" data-unban="' + ban.id + '">Unban</button></div></div>';
  }

  function wireRows() {
    panel.querySelectorAll('[data-unban]').forEach(function (button) {
      button.onclick = function () {
        button.disabled = true;
        api('/api/moderation/bans/' + button.dataset.unban, { method: 'DELETE' }).then(function () {
          message('User unbanned successfully.');
          loadPanel();
        }).catch(function (error) { button.disabled = false; message(error.message, true); });
      };
    });
    panel.querySelectorAll('[data-verify]').forEach(function (button) {
      button.onclick = function () {
        button.disabled = true;
        api('/api/moderation/users/' + button.dataset.verify + '/verification', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ verified: button.dataset.value === 'true' })
        }).then(function () {
          message('Verification status updated.');
          loadPanel();
        }).catch(function (error) { button.disabled = false; message(error.message, true); });
      };
    });
  }

  function loadPanel() {
    if (!panel || !access) return;
    var query = panel.querySelector('#aeroDevSearch').value.trim();
    panel.querySelector('#aeroDevUsers').innerHTML = '<div class="aero-dev-meta">Searching users…</div>';
    Promise.all([api('/api/moderation/users?q=' + encodeURIComponent(query)), api('/api/moderation/bans')])
      .then(function (results) {
        var users = results[0].users || [], bans = results[1].bans || [];
        panel.querySelector('#aeroDevUsers').innerHTML = users.length ? users.map(userRow).join('') : '<div class="aero-dev-meta">No users found.</div>';
        panel.querySelector('#aeroDevBans').innerHTML = bans.length ? bans.map(banRow).join('') : '<div class="aero-dev-meta">No active bans.</div>';
        wireRows();
      }).catch(function (error) { message(error.message, true); });
  }

  function openPanel() {
    if (!access || !panel) return;
    closeOtherViews();
    panel.classList.add('active');
    loadPanel();
  }

  function openSettings() {
    closeOtherViews();
    var settings = document.getElementById('aeroSettingsView');
    if (settings) settings.classList.add('active');
  }

  function createPanel() {
    addPanelStyles();
    var settingsGrid = document.querySelector('#aeroSettingsView .aero-settings-grid');
    if (!settingsGrid) {
      setTimeout(createPanel, 250);
      return;
    }
    if (settingsGrid && !settingsCard) {
      settingsCard = document.createElement('section');
      settingsCard.className = 'aero-settings-card';
       settingsCard.innerHTML = '<h3>Developer tools</h3><p class="aero-muted">Private Connect moderation controls.</p><button id="aeroOpenDevPanel" class="aero-button" type="button">Open Dev Tools</button>';
      settingsGrid.appendChild(settingsCard);
      settingsCard.querySelector('#aeroOpenDevPanel').onclick = openPanel;
    }
    if (settingsCard) settingsCard.style.display = '';
    if (panel) return;
    panel = document.createElement('main');
    panel.id = 'aeroDevPanel';
    panel.className = 'aero-dev-panel';
    panel.innerHTML = '<div class="aero-dev-panel-head"><div><div class="aero-dev-panel-kicker">Private tools</div><h2>Dev Tools</h2><p class="aero-dev-panel-sub">Manage Connect access and community verification.</p></div><div class="aero-dev-actions"><button id="aeroDevBack" class="secondary" type="button">Back to Settings</button><button id="aeroDevRefresh" type="button">Refresh</button></div></div>' +
      '<div class="aero-dev-panel-card"><div class="aero-dev-search"><input id="aeroDevSearch" type="search" placeholder="Search users by username" autocomplete="off"><button id="aeroDevSearchButton" type="button">Search</button></div><div id="aeroDevMessage" class="aero-dev-message" aria-live="polite"></div></div>' +
      '<section class="aero-dev-panel-card"><div class="aero-dev-section-title"><h3>User management</h3><span class="aero-dev-badge">Private</span></div><div id="aeroDevUsers" class="aero-dev-list"></div></section>' +
      '<section class="aero-dev-panel-card"><div class="aero-dev-section-title"><h3>Active bans</h3></div><div id="aeroDevBans" class="aero-dev-list"></div></section>';
    document.body.appendChild(panel);
    panel.querySelector('#aeroDevBack').onclick = openSettings;
    panel.querySelector('#aeroDevSearchButton').onclick = loadPanel;
    panel.querySelector('#aeroDevSearch').onkeydown = function (event) { if (event.key === 'Enter') loadPanel(); };
    panel.querySelector('#aeroDevRefresh').onclick = loadPanel;
  }

  function checkAccess() {
    return api('/api/me').then(function (data) {
      // The server remains authoritative for every moderation action. The
      // client only needs the exact username to reveal the Settings shortcut,
      // which also works while an older hosted /api/me response is cached.
      access = !!(data.user && data.user.username === 'YANDHI');
      if (access) {
        createPanel();
      } else {
        if (panel) panel.classList.remove('active');
        if (settingsCard) settingsCard.style.display = 'none';
      }
    }).catch(function () {
      access = false;
      if (panel) panel.classList.add('aero-dev-hidden');
      if (settingsCard) settingsCard.style.display = 'none';
    });
  }

  function init() {
    checkAccess();
    refreshTimer = setInterval(checkAccess, 4000);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
}());