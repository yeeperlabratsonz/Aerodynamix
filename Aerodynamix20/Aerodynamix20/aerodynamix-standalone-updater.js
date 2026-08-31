/* Early bootstrap for downloadable Aerodynamix standalone files.
 * The builder inlines this before the original app so a local file can
 * install a newer HTML copy without needing permission to overwrite itself.
 */
(function () {
  'use strict';

  var CURRENT_VERSION = '__AERODYNAMIX_VERSION__';
  var EDITION = window.AERODYNAMIX_EDITION === 'dev' ? 'dev' : 'normal';
  var VARIANT = '__AERODYNAMIX_VARIANT__';
  var UPDATE_ORIGIN = 'https://aerodynamix20.onrender.com';
  var UPDATE_PROXY = UPDATE_ORIGIN + '/api/update-proxy/';
  var MANIFEST_URL = UPDATE_ORIGIN + '/api/standalone-updates.json';
  var DB_NAME = 'aerodynamixStandaloneUpdates';
  var DB_VERSION = 1;
  var STORE_NAME = 'bundles';
  var CACHE_KEY = EDITION + ':' + VARIANT;
  var RELOAD_MARKER = 'aerodynamix-auto-updated:';

  function compareVersions(left, right) {
    var a = String(left || '0').split('.').map(Number);
    var b = String(right || '0').split('.').map(Number);
    for (var index = 0; index < Math.max(a.length, b.length); index += 1) {
      var leftPart = a[index] || 0;
      var rightPart = b[index] || 0;
      if (leftPart !== rightPart) return leftPart > rightPart ? 1 : -1;
    }
    return 0;
  }

  function openDatabase() {
    return new Promise(function (resolve, reject) {
      if (!window.indexedDB) {
        reject(new Error('IndexedDB is unavailable'));
        return;
      }
      var request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = function () {
        if (!request.result.objectStoreNames.contains(STORE_NAME)) {
          request.result.createObjectStore(STORE_NAME, { keyPath: 'key' });
        }
      };
      request.onsuccess = function () { resolve(request.result); };
      request.onerror = function () { reject(request.error || new Error('Could not open update cache')); };
    });
  }

  function readCachedBundle() {
    return openDatabase().then(function (database) {
      return new Promise(function (resolve, reject) {
        var transaction = database.transaction(STORE_NAME, 'readonly');
        var request = transaction.objectStore(STORE_NAME).get(CACHE_KEY);
        request.onsuccess = function () { resolve(request.result || null); };
        request.onerror = function () { reject(request.error || new Error('Could not read update cache')); };
        transaction.oncomplete = function () { database.close(); };
        transaction.onerror = function () { database.close(); };
      });
    });
  }

  function writeCachedBundle(version, html) {
    return openDatabase().then(function (database) {
      return new Promise(function (resolve, reject) {
        var transaction = database.transaction(STORE_NAME, 'readwrite');
        transaction.objectStore(STORE_NAME).put({
          key: CACHE_KEY,
          version: String(version),
          html: html
        });
        transaction.oncomplete = function () {
          database.close();
          resolve();
        };
        transaction.onerror = function () {
          database.close();
          reject(transaction.error || new Error('Could not cache update'));
        };
      });
    });
  }

  function fetchWithTimeout(url, options, timeout) {
    var controller = window.AbortController ? new AbortController() : null;
    var requestOptions = options || {};
    if (controller) requestOptions.signal = controller.signal;
    var timer = window.setTimeout(function () {
      if (controller) controller.abort();
    }, timeout);
    return fetch(url, requestOptions).then(function (response) {
      window.clearTimeout(timer);
      return response;
    }, function (error) {
      window.clearTimeout(timer);
      throw error;
    });
  }

  function updateDownloadPath(manifest) {
    if (EDITION === 'dev') {
      return VARIANT === 'slim' ? manifest.dev_slim_download : manifest.dev_download;
    }
    return VARIANT === 'slim' ? manifest.slim_download : manifest.download;
  }

  function validStandaloneHtml(html) {
    return typeof html === 'string' &&
      html.length > 20000 &&
      /<html[\s>]/i.test(html) &&
      /AERODYNAMIX/i.test(html);
  }

  function revealCurrentDocument() {
    if (document.documentElement) {
      document.documentElement.style.visibility = '';
      document.documentElement.removeAttribute('data-aerodynamix-update-pending');
    }
  }

  function replaceWithUpdatedDocument(html, version) {
    if (!validStandaloneHtml(html)) throw new Error('The update was not a standalone HTML file');
    window.name = RELOAD_MARKER + String(version);
    document.open();
    document.write(html);
    document.close();
  }

  function fetchAndInstall(manifest, currentVersion) {
    var latest = manifest && manifest.version;
    var downloadPath = updateDownloadPath(manifest || {});
    if (!latest || !downloadPath || compareVersions(latest, currentVersion) <= 0) return Promise.resolve(false);
    return fetchWithTimeout(downloadPath, { credentials: 'omit', cache: 'no-store' }, 30000)
      .then(function (response) {
        if (!response.ok) throw new Error('Update server returned HTTP ' + response.status);
        return response.text();
      })
      .then(function (html) {
        return writeCachedBundle(latest, html).then(function () {
          replaceWithUpdatedDocument(html, latest);
          return true;
        });
      });
  }

  function run() {
    if (document.documentElement) {
      document.documentElement.setAttribute('data-aerodynamix-update-pending', '');
      document.documentElement.style.visibility = 'hidden';
    }

    var marker = window.name || '';
    return readCachedBundle().catch(function () {
      return null;
    }).then(function (cached) {
      if (marker === RELOAD_MARKER + String(cached && cached.version)) {
        window.name = '';
        revealCurrentDocument();
        return false;
      }
      if (cached && compareVersions(cached.version, CURRENT_VERSION) > 0 && validStandaloneHtml(cached.html)) {
        replaceWithUpdatedDocument(cached.html, cached.version);
        return true;
      }
      return fetchWithTimeout(MANIFEST_URL, { credentials: 'omit', cache: 'no-store' }, 8000)
        .then(function (response) {
          if (!response.ok) throw new Error('Manifest server returned HTTP ' + response.status);
          return response.json();
        })
        .then(function (manifest) {
          return fetchAndInstall(manifest, CURRENT_VERSION);
        });
    }).catch(function () {
      return false;
    }).then(function (replaced) {
      if (!replaced) revealCurrentDocument();
    });
  }

  run();
})();