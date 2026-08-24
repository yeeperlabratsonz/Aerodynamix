/* YANDHI-only gate for the Aerodynamix (Dev Edition) export. */
(function () {
  'use strict';
  var ORIGIN = 'https://aerodynamix20.onrender.com';
  var gate;

  function showGate(message) {
    if (!gate) {
      var style = document.createElement('style');
      style.textContent = '#aeroDevGate{position:fixed;inset:0;z-index:20000;display:grid;place-items:center;padding:24px;background:rgba(2,5,12,.94);backdrop-filter:blur(16px);font-family:Montserrat,sans-serif;color:#fff}.aero-dev-card{width:min(440px,100%);padding:32px;border:1px solid rgba(130,185,255,.3);border-radius:22px;background:rgba(7,18,38,.96);box-shadow:0 30px 90px rgba(0,0,0,.6);text-align:center}.aero-dev-card h2{margin:0 0 10px}.aero-dev-card p{color:rgba(255,255,255,.65);line-height:1.5}.aero-dev-card button{border:0;border-radius:10px;padding:12px 18px;background:#2c7ffc;color:#fff;font:700 .82rem Montserrat,sans-serif;cursor:pointer}';
      document.head.appendChild(style);
      gate = document.createElement('div');
      gate.id = 'aeroDevGate';
      gate.innerHTML = '<div class="aero-dev-card"><h2>Aerodynamix (Dev Edition)</h2><p id="aeroDevGateMessage"></p><button type="button" id="aeroDevLogin">Log in as YANDHI</button></div>';
      document.body.appendChild(gate);
      document.getElementById('aeroDevLogin').onclick = function () {
        gate.style.display = 'none';
        var connect = document.getElementById('connectNav');
        if (connect) connect.click();
      };
    }
    document.getElementById('aeroDevGateMessage').textContent = message;
    gate.style.display = 'grid';
  }

  async function checkAccess() {
    try {
      var response = await fetch(ORIGIN + '/api/me', { credentials: 'include' });
      var data = await response.json();
      if (data.user && data.user.username === 'YANDHI') {
        if (gate) gate.style.display = 'none';
        return true;
      }
    } catch (error) {}
    showGate('This version is restricted to the logged-in YANDHI account. Use the button below to open Connect and sign in.');
    return false;
  }

  function init() {
    checkAccess();
    setInterval(checkAccess, 4000);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
}());