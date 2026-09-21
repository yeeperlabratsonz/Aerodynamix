(function () {
  'use strict';
  function start() {
    var view = document.getElementById('aeroMusicView');
    var heroPlay = document.getElementById('aeroMusicHeroPlay');
    var player = document.getElementById('aeroMusicPlayer');
    if (!view || !heroPlay || !player) return;
    heroPlay.onclick = function () {
      var play = document.getElementById('aeroMusicPlay');
      if (play) play.click();
    };
    function sync() {
      var title = document.getElementById('aeroMusicNowTitle');
      var meta = document.getElementById('aeroMusicNowMeta');
      var art = document.getElementById('aeroMusicNowArt');
      var heroTitle = document.getElementById('aeroMusicHeroTitle');
      var heroMeta = document.getElementById('aeroMusicHeroMeta');
      var heroArt = document.getElementById('aeroMusicHeroArt');
      var play = document.getElementById('aeroMusicPlay');
      if (heroTitle && title && title.textContent && title.textContent !== 'Nothing playing') heroTitle.textContent = title.textContent;
      if (heroMeta && meta && meta.textContent && heroMeta.textContent !== meta.textContent) {
        heroMeta.textContent = meta.textContent;
      }
      if (heroArt && art && art.src) {
        if (heroArt.src !== art.src) heroArt.src = art.src;
        var alt = art.alt || 'Album artwork';
        if (heroArt.alt !== alt) heroArt.alt = alt;
      }
      if (heroPlay && play) {
        var label = play.textContent === 'Ⅱ' ? 'Pause' : 'Play';
        if (heroPlay.textContent !== label) heroPlay.textContent = label;
      }
    }
    var syncPending = false;
    new MutationObserver(function () {
      if (syncPending) return;
      syncPending = true;
      requestAnimationFrame(function () {
        syncPending = false;
        sync();
      });
    }).observe(player, { subtree: true, childList: true, characterData: true, attributes: true });
    sync();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();