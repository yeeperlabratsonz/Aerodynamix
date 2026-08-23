/* Shared Aerodynamix tab cloak */
(function () {
    'use strict';

    const CLOAK_KEY = 'aerodynamixTabCloak';
    const CLOAK_PRESET_KEY = 'aerodynamixTabCloakPreset';
    const CLOAK_PRESETS = {
        google: { title: 'Google', icon: 'https://www.google.com/favicon.ico' },
        deltaMath: { title: 'DeltaMath', icon: 'images/delta-math-grad-cap.png' },
        classroom: { title: 'Google Classroom', icon: 'images/google-classroom-chalkboard.jpg' }
    };

    function setFavicon(href) {
        let link = document.querySelector('link[rel~="icon"]');
        if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.head.appendChild(link);
        }
        link.type = 'image/x-icon';
        link.href = href;
    }

    function getPreset() {
        const selected = localStorage.getItem(CLOAK_PRESET_KEY);
        return CLOAK_PRESETS[selected] || CLOAK_PRESETS.google;
    }

    function applyTabCloak(enabled) {
        const preset = getPreset();
        if (enabled) {
            document.title = preset.title;
            setFavicon(preset.icon);
        } else {
            document.title = document.body?.dataset.originalTitle || 'Aerodynamix';
            setFavicon('favicon.png');
        }
    }

    function isTabCloaked() {
        return localStorage.getItem(CLOAK_KEY) === 'true';
    }

    window.enableTabCloak = function () {
        const enabled = !isTabCloaked();
        localStorage.setItem(CLOAK_KEY, enabled ? 'true' : 'false');
        applyTabCloak(enabled);
        const button = document.querySelector('[onclick*="enableTabCloak"]');
        if (button) button.textContent = enabled ? 'Tab Cloak: ON' : 'Tab Cloak';
    };

    window.setTabCloakPreset = function (preset) {
        if (!CLOAK_PRESETS[preset]) return;
        localStorage.setItem(CLOAK_PRESET_KEY, preset);
        const select = document.getElementById('tab-cloak-preset');
        if (select) select.value = preset;
        if (isTabCloaked()) applyTabCloak(true);
    };

    function init() {
        if (document.body && !document.body.dataset.originalTitle) {
            document.body.dataset.originalTitle = document.title;
        }
        applyTabCloak(isTabCloaked());
        const button = document.querySelector('[onclick*="enableTabCloak"]');
        if (button && isTabCloaked()) button.textContent = 'Tab Cloak: ON';
        const select = document.getElementById('tab-cloak-preset');
        if (select) select.value = localStorage.getItem(CLOAK_PRESET_KEY) || 'google';
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();