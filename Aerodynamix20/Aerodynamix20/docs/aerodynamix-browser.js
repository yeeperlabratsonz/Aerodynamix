(() => {
    const applyBranding = () => {
        document.title = 'Aerodynamix Browser';
        document.documentElement.dataset.aerodynamixBrowser = 'true';

        const titlebar = document.querySelector('.titlebar');
        if (titlebar && !titlebar.querySelector('.aero-brand')) {
            const brand = document.createElement('div');
            brand.className = 'aero-brand';
            brand.setAttribute('aria-label', 'Aerodynamix Browser');
            brand.innerHTML = `
                <span class="aero-brand-mark" aria-hidden="true"><i class="fas fa-compass"></i></span>
                <span class="aero-brand-copy">
                    AERODYNAMIX
                    <span class="aero-brand-sub">BROWSER</span>
                </span>
            `;
            titlebar.prepend(brand);
        }

        const newTabBrand = document.querySelector('.nt-brand');
        if (newTabBrand && !newTabBrand.querySelector('.aero-home-mark')) {
            newTabBrand.innerHTML = `
                <span class="aero-home-mark" aria-hidden="true"><i class="fas fa-compass"></i></span>
                <span>AERODYNAMIX</span>
                <span class="gust-badge-anim">BROWSER</span>
            `;
            newTabBrand.setAttribute('aria-label', 'Aerodynamix Browser');
        }

        const oldCredit = document.getElementById('gustCredit');
        if (oldCredit) oldCredit.setAttribute('aria-hidden', 'true');

        const tab = document.getElementById('tabActive');
        if (tab) tab.setAttribute('aria-label', 'Aerodynamix Browser new tab');

        // Keep the optimized edition's preference independent from /gust/.
        // The original GUST handler updates its class before this timer runs.
        document.addEventListener('click', (event) => {
            const poolSwitch = event.target.closest('#settingsPoolModeSwitch, #gxcWispSw');
            if (!poolSwitch) return;
            setTimeout(() => {
                try {
                    const enabled = poolSwitch.classList.contains('on');
                    localStorage.setItem('aerodynamix:wisp:poolmode:v1', enabled ? '1' : '0');
                    localStorage.setItem('gust:wisp:poolmode:v1', enabled ? '1' : '0');
                } catch (_) {}
            }, 0);
        });
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyBranding, { once: true });
    } else {
        applyBranding();
    }
})();