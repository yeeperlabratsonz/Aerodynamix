/*
 * URL helpers for authorized custom domains.
 *
 * First-party requests should stay same-origin. Relative URLs already work in
 * the browser, while these helpers are useful when a caller needs an absolute
 * URL (for example, a WebSocket or an iframe URL) without knowing the domain
 * in advance.
 */
(function (global) {
    'use strict';

    function sameOriginUrl(path, query) {
        const url = new URL(path, window.location.origin);
        if (query && typeof query === 'object') {
            Object.entries(query).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    url.searchParams.set(key, String(value));
                }
            });
        }
        return url;
    }

    function apiUrl(path, query) {
        const normalizedPath = String(path || '').replace(/^\/+/, '');
        const apiPath = normalizedPath.startsWith('api/')
            ? `/${normalizedPath}`
            : `/api/${normalizedPath}`;
        return sameOriginUrl(apiPath, query);
    }

    function websocketUrl(path, query) {
        const url = sameOriginUrl(path, query);
        url.protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        return url;
    }

    global.DynamixOrigin = Object.freeze({
        origin: window.location.origin,
        sameOriginUrl,
        apiUrl,
        websocketUrl
    });
})(window);