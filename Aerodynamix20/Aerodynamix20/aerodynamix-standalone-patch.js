/* Aerodynamix standalone enhancement layer.
 * This runs after the self-contained export and keeps its media player and
 * embedded fallbacks while replacing the shell around them.
 */
(function () {
  'use strict';

  var SETTINGS_KEY = 'aerodynamixStandaloneSettings';
  var CONNECT_ORIGIN = 'https://aerodynamix20.onrender.com';
  var DB_NAME = 'aerodynamixStandaloneLibrary';
  var DB_STORE = 'games';
  var DEFAULT_PUBLIC_ROOT = 'https://yeeperlabratsonz.github.io/Aerodynamix/Aerodynamix20/Aerodynamix20/';
  var CLOAK_PRESETS = {
    google: { title: 'Google', icon: 'https://www.google.com/favicon.ico' },
    deltaMath: { title: 'DeltaMath', path: 'attached_assets/delta-math-grad-cap.png' },
    classroom: { title: 'Google Classroom', path: 'attached_assets/google-classroom-chalkboard.jpg' }
  };
  var settings = readSettings();
  var builtInGames = [];
  var customGames = [];
  var objectUrls = [];
  var libraryLoadVersion = 0;
  var effectTimer = null;
  var effectLayer = null;
  var clockTimer = null;

  var themes = {
    black: {
      label: 'Black',
      background: '#030509',
      image: 'radial-gradient(ellipse at 50% 130%, rgba(44,127,252,.32), transparent 65%)',
      color: '#ffffff',
      accent: '#2c7ffc'
    },
    'frutiger-aero': {
      label: 'Frutiger Aero',
      background: '#87ceeb',
      image: '',
      color: '#002244',
      accent: '#0879bd'
    },
    purple: {
      label: 'Midnight Purple',
      background: '#180826',
      image: 'radial-gradient(ellipse at 50% 130%, rgba(160,80,255,.42), transparent 65%)',
      color: '#f0e0ff',
      accent: '#9333ea'
    },
    blue: {
      label: 'Genesis Blue',
      background: '#040d24',
      image: 'radial-gradient(ellipse at 50% 130%, rgba(59,130,246,.45), transparent 65%)',
      color: '#e0f0ff',
      accent: '#3b82f6'
    },
    christmas: {
      label: 'Christmas',
      background: '#0a180d',
      image: 'radial-gradient(ellipse at 50% 120%, rgba(180,40,40,.22), transparent 55%)',
      color: '#fcebd4',
      accent: '#c41e3a'
    },
    'bubble-gum-pink': {
      label: 'Bubble Gum Pink',
      background: '#ff69b4',
      image: 'radial-gradient(circle at 18% 8%, rgba(255,255,255,.28), transparent 30%)',
      color: '#ffffff',
      accent: '#ff1493'
    },
    'blood-red': {
      label: 'Blood Red',
      background: '#3b050b',
      image: 'radial-gradient(ellipse at 50% 130%, rgba(239,35,60,.58), transparent 65%)',
      color: '#fff1f2',
      accent: '#ef233c'
    },
    'citrus-orange': {
      label: 'Citrus Orange',
      background: '#4a1d00',
      image: 'radial-gradient(ellipse at 50% 130%, rgba(255,122,0,.6), transparent 65%)',
      color: '#fff4e8',
      accent: '#ff7a00'
    },
    'golden-yellow': {
      label: 'Golden Yellow',
      background: '#493800',
      image: 'radial-gradient(ellipse at 50% 130%, rgba(255,208,0,.58), transparent 65%)',
      color: '#fffbea',
      accent: '#ffd000'
    },
    'emerald-green': {
      label: 'Emerald Green',
      background: '#022b19',
      image: 'radial-gradient(ellipse at 50% 130%, rgba(0,200,83,.58), transparent 65%)',
      color: '#ecfff4',
      accent: '#00c853'
    }
  };

  function readSettings() {
    try {
      return JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}') || {};
    } catch (error) {
      return {};
    }
  }

  function saveSettings() {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {}
  }

  function injectStyles() {
    var style = document.createElement('style');
    style.id = 'aerodynamix-standalone-styles';
    style.textContent = `
      :root {
        --standalone-accent: #2c7ffc;
        --standalone-bg: #030509;
        --standalone-text: #fff;
        --standalone-panel: rgba(7,18,38,.88);
        --standalone-line: rgba(130,185,255,.23);
      }
      body.aerodynamix-standalone {
        color: var(--standalone-text);
        transition: background-color .35s ease, background-image .35s ease, color .35s ease;
      }
      body.aerodynamix-standalone .lite-label,
      body.aerodynamix-standalone #settingsPanel {
        display: none !important;
      }
      .settings-nav.active {
        box-shadow: 0 0 0 2px rgba(255,255,255,.18), 0 8px 25px color-mix(in srgb, var(--standalone-accent) 45%, transparent);
      }
      #aeroSettingsView {
        display: none;
        min-height: 100vh;
        padding: clamp(110px, 10vw, 150px) 20px 80px;
        box-sizing: border-box;
        color: var(--standalone-text);
      }
      #aeroSettingsView.active {
        display: block;
        animation: aeroViewIn .24s ease both;
      }
      .aero-settings-shell {
        width: min(1060px, 100%);
        margin: 0 auto;
      }
      .aero-settings-title {
        margin-bottom: 24px;
      }
      .aero-kicker {
        color: var(--standalone-accent);
        font-size: .72rem;
        font-weight: 800;
        letter-spacing: .18em;
        text-transform: uppercase;
      }
      .aero-settings-title h2 {
        margin: 7px 0 8px;
        font-size: clamp(2rem, 5vw, 4rem);
        letter-spacing: -.055em;
      }
      .aero-muted {
        color: color-mix(in srgb, var(--standalone-text) 66%, transparent);
        font-size: .9rem;
        line-height: 1.55;
      }
      .aero-settings-grid {
        display: grid;
        grid-template-columns: minmax(0, 1.15fr) minmax(300px, .85fr);
        gap: 18px;
        align-items: start;
      }
      .aero-settings-card {
        padding: 24px;
        border: 1px solid var(--standalone-line);
        border-radius: 22px;
        background: var(--standalone-panel);
        box-shadow: 0 24px 70px rgba(0,0,0,.3);
        backdrop-filter: blur(18px);
      }
      .aero-settings-card h3 {
        margin: 0 0 6px;
        font-size: 1.18rem;
      }
      .aero-theme-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0,1fr));
        gap: 10px;
        margin-top: 18px;
      }
      .aero-theme-button,
      .aero-button,
      .aero-icon-button {
        border: 1px solid var(--standalone-line);
        color: inherit;
        font: inherit;
        cursor: pointer;
        transition: transform .16s ease, border-color .16s ease, box-shadow .16s ease;
      }
      .aero-theme-button {
        min-height: 82px;
        padding: 14px;
        border-radius: 13px;
        background-color: var(--theme-color);
        background-size: cover;
        background-position: center;
        color: var(--theme-text, #fff);
        text-align: left;
        font-weight: 800;
        position: relative;
        overflow: hidden;
        text-shadow: 0 2px 8px rgba(0,0,0,.45);
      }
      .aero-theme-button::after {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(135deg, rgba(255,255,255,.2), transparent 48%);
        pointer-events: none;
      }
      .aero-theme-button:hover,
      .aero-button:hover {
        transform: translateY(-2px);
        border-color: var(--standalone-accent);
      }
      .aero-theme-button.active {
        outline: 2px solid var(--standalone-accent);
        outline-offset: 2px;
        box-shadow: 0 12px 34px color-mix(in srgb, var(--standalone-accent) 28%, transparent);
      }
      .aero-setting-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 18px;
        padding: 16px 0;
        border-bottom: 1px solid var(--standalone-line);
      }
      .aero-setting-row:last-of-type {
        border-bottom: 0;
      }
      .aero-switch {
        width: 48px;
        height: 27px;
        flex: 0 0 auto;
        border: 0;
        border-radius: 999px;
        background: #35475b;
        cursor: pointer;
        position: relative;
      }
      .aero-switch::after {
        content: '';
        position: absolute;
        left: 3px;
        top: 3px;
        width: 21px;
        height: 21px;
        border-radius: 50%;
        background: #e8f4ff;
        transition: transform .2s ease;
      }
      .aero-switch.on {
        background: var(--standalone-accent);
      }
      .aero-switch.on::after {
        transform: translateX(21px);
      }
      .aero-label {
        display: block;
        margin: 20px 0 7px;
        font-size: .78rem;
        font-weight: 800;
        letter-spacing: .04em;
      }
      .aero-input {
        width: 100%;
        box-sizing: border-box;
        padding: 12px 13px;
        border: 1px solid var(--standalone-line);
        border-radius: 11px;
        background: rgba(0,0,0,.26);
        color: inherit;
        font: inherit;
        outline: 0;
      }
      .aero-input:focus {
        border-color: var(--standalone-accent);
        box-shadow: 0 0 0 3px color-mix(in srgb, var(--standalone-accent) 18%, transparent);
      }
      .aero-button {
        padding: 11px 15px;
        border-radius: 11px;
        background: var(--standalone-accent);
        color: #04101f;
        font-weight: 800;
      }
      .aero-button.secondary {
        background: rgba(255,255,255,.08);
        color: inherit;
      }
      .aero-plus {
        display: grid !important;
        min-height: 210px;
        place-items: center;
        border: 1px dashed var(--standalone-accent) !important;
        background: color-mix(in srgb, var(--standalone-accent) 8%, rgba(3,5,9,.72)) !important;
        color: var(--standalone-accent);
        cursor: pointer;
      }
      .aero-plus-inner {
        display: grid;
        place-items: center;
        gap: 10px;
        text-align: center;
      }
      .aero-plus-mark {
        display: grid;
        width: 56px;
        height: 56px;
        place-items: center;
        border: 1px solid currentColor;
        border-radius: 16px;
        font-size: 2rem;
        line-height: 1;
      }
      .aero-plus strong {
        font-size: .88rem;
        letter-spacing: .08em;
        text-transform: uppercase;
      }
      .aero-custom-card {
        position: relative;
      }
      .aero-custom-card .thumb-placeholder {
        width: 100%;
        aspect-ratio: 16/9;
        display: grid;
        place-items: center;
        background: linear-gradient(145deg, color-mix(in srgb, var(--standalone-accent) 32%, #071226), #030509);
        color: #fff;
        font-size: 2rem;
        font-weight: 900;
      }
      .aero-delete {
        position: absolute;
        top: 8px;
        right: 8px;
        z-index: 2;
        padding: 6px 9px;
        border: 1px solid rgba(255,255,255,.28);
        border-radius: 9px;
        background: rgba(3,5,9,.82);
        color: #fff;
        cursor: pointer;
      }
      #aeroImportModal {
        position: fixed;
        inset: 0;
        z-index: 10060;
        display: grid;
        place-items: center;
        padding: 14px;
        background: rgba(1,5,13,.76);
        backdrop-filter: blur(10px);
        opacity: 0;
        pointer-events: none;
        transition: opacity .2s ease;
      }
      #aeroImportModal.open {
        opacity: 1;
        pointer-events: auto;
      }
      .aero-modal {
        width: min(520px, 100%);
        padding: 25px;
        box-sizing: border-box;
        border: 1px solid rgba(130,185,255,.34);
        border-radius: 22px;
        background: #0a1830;
        color: #eef7ff;
        box-shadow: 0 30px 100px rgba(0,0,0,.72);
        transform: translateY(12px);
        transition: transform .2s ease;
      }
      #aeroImportModal.open .aero-modal {
        transform: none;
      }
      .aero-modal-head,
      .aero-modal-actions {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
      }
      .aero-modal-head h3 {
        margin: 4px 0 0;
        font-size: 1.45rem;
      }
      .aero-icon-button {
        width: 34px;
        height: 34px;
        border-radius: 10px;
        background: rgba(255,255,255,.07);
      }
      .aero-form {
        display: grid;
        gap: 15px;
        margin-top: 20px;
      }
      .aero-form label {
        font-size: .79rem;
        font-weight: 800;
      }
      .aero-form input[type="file"] {
        display: block;
        width: 100%;
        margin-top: 8px;
        color: #b7cae0;
      }
      .aero-modal-actions {
        justify-content: flex-end;
        margin-top: 6px;
      }
      #aeroToast {
        position: fixed;
        left: 50%;
        bottom: 22px;
        z-index: 10100;
        max-width: min(420px, calc(100% - 30px));
        padding: 12px 16px;
        border: 1px solid rgba(130,185,255,.3);
        border-radius: 12px;
        background: rgba(7,18,38,.96);
        color: #fff;
        box-shadow: 0 14px 44px rgba(0,0,0,.55);
        opacity: 0;
        transform: translate(-50%, 16px);
        pointer-events: none;
        transition: opacity .18s ease, transform .18s ease;
      }
      #aeroToast.show {
        opacity: 1;
        transform: translate(-50%, 0);
      }
      #aeroMessageNotification {
        position: fixed;
        top: 14px;
        left: 50%;
        z-index: 10101;
        display: flex;
        align-items: center;
        gap: 11px;
        width: min(410px, calc(100% - 28px));
        padding: 10px 14px 10px 10px;
        border: 1px solid rgba(130,185,255,.42);
        border-radius: 14px;
        background: rgba(7,18,38,.97);
        color: #fff;
        box-shadow: 0 14px 44px rgba(0,0,0,.55);
        opacity: 0;
        transform: translate(-50%, -18px);
        pointer-events: none;
        cursor: pointer;
        transition: opacity .18s ease, transform .18s ease;
      }
      #aeroMessageNotification.show {
        opacity: 1;
        transform: translate(-50%, 0);
        pointer-events: auto;
      }
      #aeroMessageNotification .aero-message-avatar {
        width: 38px;
        height: 38px;
        flex: 0 0 38px;
        border-radius: 50%;
        background: rgba(44,127,252,.28);
        color: #fff;
        display: grid;
        place-items: center;
        overflow: hidden;
        font-size: .72rem;
        font-weight: 800;
      }
      #aeroMessageNotification .aero-message-avatar img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      #aeroMessageNotification .aero-message-copy {
        min-width: 0;
        line-height: 1.25;
      }
      #aeroMessageNotification .aero-message-title {
        font-size: .82rem;
        font-weight: 800;
      }
      #aeroMessageNotification .aero-message-preview {
        margin-top: 3px;
        overflow: hidden;
        color: rgba(255,255,255,.68);
        font-size: .74rem;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      #aeroThemeEffects {
        position: fixed;
        inset: 0;
        z-index: 2;
        overflow: hidden;
        pointer-events: none;
      }
      .aero-bubble {
        position: absolute;
        top: -90px;
        border: 1px solid rgba(255,255,255,.7);
        border-radius: 50%;
        background: radial-gradient(circle at 32% 28%, rgba(255,255,255,.96), rgba(165,220,255,.42) 42%, rgba(70,160,235,.08) 72%);
        box-shadow: inset -3px -4px 10px rgba(255,255,255,.78), 0 9px 24px rgba(0,100,190,.15);
        animation: aeroBubbleFall var(--duration) linear forwards;
        pointer-events: auto;
        cursor: pointer;
      }
      .aero-snow {
        position: absolute;
        top: -12px;
        border-radius: 50%;
        background: rgba(255,255,255,.9);
        filter: blur(var(--blur));
        animation: aeroSnowFall var(--duration) linear infinite;
      }
      body.aero-reduce-effects *,
      body.aero-reduce-effects *::before,
      body.aero-reduce-effects *::after {
        animation-duration: .01ms !important;
        transition-duration: .01ms !important;
      }
      @keyframes aeroViewIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: none; }
      }
      @keyframes aeroBubbleFall {
        from { transform: translate3d(0,0,0); opacity: .85; }
        to { transform: translate3d(var(--drift), 115vh, 0); opacity: .3; }
      }
      @keyframes aeroSnowFall {
        from { transform: translate3d(0,-5vh,0); }
        to { transform: translate3d(var(--drift), 110vh,0); }
      }
      @media (max-width: 760px) {
        .aero-settings-grid { grid-template-columns: 1fr; }
        .aero-theme-grid { grid-template-columns: 1fr 1fr; }
        .aero-settings-card { padding: 18px; }
        #aeroSettingsView { padding-left: 14px; padding-right: 14px; }
      }
      @media (max-width: 480px) {
        .aero-theme-grid { grid-template-columns: 1fr; }
        .aero-setting-row { align-items: flex-start; }
      }
      @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after { scroll-behavior: auto !important; transition-duration: .01ms !important; }
      }
      #aeroConnectView {
        display: none;
        min-height: 100vh;
        padding: clamp(86px, 8vw, 118px) 0 0;
        box-sizing: border-box;
      }
      #aeroConnectView.active {
        display: block;
        animation: aeroViewIn .24s ease both;
      }
      #aeroAppsView,
      #aeroDrawingView {
        display: none;
      }
      #aeroAppsView.active,
      #aeroDrawingView.active {
        display: block;
      }
      #aeroClockView {
        display: none;
        min-height: calc(100vh - 118px);
        padding: clamp(86px, 9vw, 130px) 5vw 8rem;
        box-sizing: border-box;
      }
      #aeroClockView.active { display: block; animation: aeroViewIn .24s ease both; }
      .aero-clock-shell { max-width: 1180px; margin: 0 auto; }
      .aero-clock-heading { text-align: center; }
      .aero-clock-heading h2 { margin: 0 0 .45rem; color: var(--standalone-text); font-size: clamp(1.8rem, 4vw, 3.5rem); letter-spacing: .08em; text-transform: uppercase; }
      .aero-clock-heading p { margin: 0; color: color-mix(in srgb, var(--standalone-text) 62%, transparent); }
      .aero-clock-display {
        margin: clamp(2.2rem, 7vw, 6rem) auto 2.3rem;
        padding: clamp(1.4rem, 5vw, 4.5rem) 2vw;
        border: 1px solid color-mix(in srgb, var(--standalone-accent) 38%, transparent);
        border-radius: 32px;
        background: linear-gradient(145deg, color-mix(in srgb, var(--standalone-accent) 17%, var(--standalone-bg)), color-mix(in srgb, var(--standalone-bg) 92%, #000));
        box-shadow: 0 26px 70px rgba(0,0,0,.35), 0 0 50px color-mix(in srgb, var(--standalone-accent) 12%, transparent);
        text-align: center;
      }
      .aero-clock-time {
        color: var(--aero-clock-color, var(--standalone-text));
        font: 700 clamp(3.2rem, 12vw, 10rem)/.95 "Courier New", monospace;
        letter-spacing: .06em;
        text-shadow: 0 0 22px color-mix(in srgb, var(--standalone-accent) 55%, transparent);
        font-variant-numeric: tabular-nums;
      }
      .aero-clock-date { margin-top: 1.2rem; color: color-mix(in srgb, var(--standalone-text) 66%, transparent); font-size: clamp(.8rem, 1.6vw, 1.1rem); letter-spacing: .16em; text-transform: uppercase; }
      .aero-clock-display.liquid { border-color: rgba(255,255,255,.5); background: linear-gradient(135deg, rgba(255,255,255,.28), rgba(126,207,255,.12) 38%, rgba(221,146,255,.22)); backdrop-filter: blur(18px) saturate(150%); box-shadow: inset 0 1px 0 rgba(255,255,255,.55), 0 24px 65px rgba(0,60,130,.34); }
      .aero-clock-display.liquid .aero-clock-time { color: rgba(255,255,255,.92); text-shadow: 0 2px 0 rgba(255,255,255,.32), 0 0 28px rgba(111,213,255,.95); -webkit-text-stroke: 1px rgba(255,255,255,.18); }
      .aero-clock-display.neon .aero-clock-time { color: var(--aero-clock-color, var(--standalone-accent)); text-shadow: 0 0 8px var(--aero-clock-color, var(--standalone-accent)), 0 0 35px var(--aero-clock-color, var(--standalone-accent)); }
      .aero-clock-display.minimal { background: transparent; box-shadow: none; }
      .aero-clock-time.clock-font-square { font-family: Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif; letter-spacing: .08em; }
      .aero-clock-time.clock-font-rounded { font-family: "Trebuchet MS", Arial, sans-serif; font-weight: 800; letter-spacing: .02em; }
      .aero-clock-time.clock-font-serif { font-family: Georgia, serif; font-weight: 700; letter-spacing: .02em; }
      .aero-clock-controls { display: flex; flex-wrap: wrap; justify-content: center; gap: 1rem; margin: 0 auto; }
      .aero-clock-control { display: grid; gap: .4rem; min-width: 170px; color: color-mix(in srgb, var(--standalone-text) 72%, transparent); font-size: .72rem; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; }
      .aero-clock-control select, .aero-clock-control button { width: 100%; min-height: 42px; border: 1px solid var(--standalone-line); border-radius: 10px; background: var(--standalone-panel); color: var(--standalone-text); padding: .65rem .75rem; font: inherit; text-transform: none; cursor: pointer; }
      .aero-clock-control button { background: var(--standalone-accent); color: #fff; }
      .aero-clock-back { display: block; width: max-content; margin: 2rem auto 0; color: color-mix(in srgb, var(--standalone-text) 72%, transparent); cursor: pointer; font-size: .8rem; }
      .aero-connect-shell {
        width: 100%;
        margin: 0 auto;
      }
      .aero-connect-empty {
        display: grid;
        place-items: center;
        min-height: 420px;
        padding: 30px;
        text-align: center;
        border: 1px dashed var(--standalone-line);
        border-radius: 22px;
        background: var(--standalone-panel);
      }
      .aero-connect-empty[hidden],
      .aero-connect-iframe[hidden] { display: none !important; }
      .aero-connect-empty h2 { margin: 0 0 10px; }
      .aero-connect-empty p { max-width: 620px; margin: 0 auto 18px; }
      .aero-connect-error { color: #ff8791; }
      .aero-connect-page {
        min-height: calc(100vh - 118px);
        background: var(--standalone-bg);
        color: var(--standalone-text);
      }
      .aero-connect-page .dc-container {
        padding-top: clamp(22px, 3vw, 42px);
      }
      .aero-connect-page .dc-header h1 {
        color: var(--standalone-text);
        background: none;
        -webkit-text-fill-color: currentColor;
      }
      .aero-connect-page .dc-card {
        border-color: color-mix(in srgb, var(--standalone-accent) 32%, transparent);
      }
      .aero-connect-page .dc-btn,
      .aero-connect-page .dc-page-tab.active {
        background: var(--standalone-accent);
      }
      .aero-connect-page .dc-modal-overlay {
        z-index: 10080;
      }
      /* Keep the controls recognizable if the external Font Awesome sheet is
         unavailable while this file is opened offline or on a filtered network. */
      .aero-connect-page .fas {
        display: inline-block;
        min-width: 1em;
        text-align: center;
      }
      .aero-connect-page .fa-home::before { content: "⌂"; }
      .aero-connect-page .fa-user-friends::before,
      .aero-connect-page .fa-user-plus::before,
      .aero-connect-page .fa-user-check::before,
      .aero-connect-page .fa-user-minus::before { content: "♙"; }
      .aero-connect-page .fa-envelope::before { content: "✉"; }
      .aero-connect-page .fa-video::before { content: "▣"; }
      .aero-connect-page .fa-camera::before { content: "▣"; }
      .aero-connect-page .fa-microphone::before { content: "♩"; }
      .aero-connect-page .fa-phone::before { content: "☎"; }
      .aero-connect-page .fa-phone-slash::before { content: "✕"; }
      .aero-connect-page .fa-times::before { content: "×"; }
      .aero-connect-page .fa-paper-plane::before { content: "➤"; }
      .aero-connect-page .fa-image::before { content: "▧"; }
      .aero-connect-page .fa-trash::before { content: "⌫"; }
      .aero-connect-page .fa-arrow-left::before { content: "←"; }
      .aero-connect-page .fa-user::before { content: "●"; }
      @media (max-width: 620px) {
        .aero-connect-page { min-height: calc(100vh - 78px); }
      }
    `;
    document.head.appendChild(style);
  }

  function createMarkup() {
    var nav = document.querySelector('.real-nav');
    var navLinks = nav && nav.querySelector('.nav-links');
    if (navLinks && !document.getElementById('connectNav')) {
      var connectNav = document.createElement('a');
      connectNav.id = 'connectNav';
      connectNav.href = '#';
      connectNav.title = 'Dynamix Connect';
      connectNav.textContent = 'Connect';
      navLinks.insertBefore(connectNav, navLinks.firstChild ? navLinks.firstChild.nextSibling : null);
    }
    if (navLinks && !document.getElementById('appsNav')) {
      var appsNav = document.createElement('a');
      appsNav.id = 'appsNav';
      appsNav.href = '#';
      appsNav.title = 'Apps';
      appsNav.textContent = 'Apps';
      navLinks.insertBefore(appsNav, document.getElementById('mediaNav') || null);
    }
    var settingsView = document.createElement('main');
    settingsView.id = 'aeroSettingsView';
    settingsView.innerHTML = `
      <div class="aero-settings-shell">
        <header class="aero-settings-title">
          <div class="aero-kicker">Aerodynamix settings</div>
          <h2>Make it yours.</h2>
          <p class="aero-muted">Themes and preferences are saved in this browser and restored the next time you open this file.</p>
        </header>
        <div class="aero-settings-grid">
          <section class="aero-settings-card">
            <h3>Choose Theme</h3>
            <p class="aero-muted">The complete Aerodynamix visual collection, including its original animated effects.</p>
            <div class="aero-theme-grid" id="aeroThemeGrid"></div>
          </section>
          <section class="aero-settings-card">
            <h3>Experience</h3>
            <p class="aero-muted">Control privacy, performance, and where downloaded files load built-in games from.</p>
            <div class="aero-setting-row">
              <div>
                <strong>Tab Cloak</strong>
                <div class="aero-muted">Choose a familiar school tab title and icon. Enabled by default.</div>
              </div>
              <button class="aero-switch" id="aeroCloakToggle" type="button" aria-label="Toggle Tab Cloak"></button>
            </div>
            <label class="aero-label" for="aeroCloakPreset">Cloak preset</label>
            <select class="aero-input" id="aeroCloakPreset">
              <option value="google">Google · G favicon</option>
              <option value="deltaMath">DeltaMath · grad cap</option>
              <option value="classroom">Google Classroom · chalkboard</option>
            </select>
            <div class="aero-setting-row">
              <div>
                <strong>Reduce effects</strong>
                <div class="aero-muted">Disable bubbles, snow, and most motion.</div>
              </div>
              <button class="aero-switch" id="aeroEffectsToggle" type="button" aria-label="Toggle reduced effects"></button>
            </div>
            <label class="aero-label" for="aeroSourceOrigin">Game library URL for downloaded copies</label>
            <p class="aero-muted">Downloaded copies use the official Aerodynamix game library automatically. Change this only if you want to use another published copy of the site.</p>
            <input class="aero-input" id="aeroSourceOrigin" type="url" inputmode="url" placeholder="https://your-aerodynamix-site.example/">
            <button class="aero-button secondary" id="aeroSaveOrigin" type="button" style="margin-top:10px">Save game source</button>
          </section>
        </div>
      </div>
    `;
    if (nav && nav.parentNode) {
      nav.parentNode.insertBefore(settingsView, nav.nextSibling);
    } else {
      document.body.prepend(settingsView);
    }

    var connectView = document.createElement('main');
    connectView.id = 'aeroConnectView';
    connectView.innerHTML = `
      <div class="aero-connect-shell">
        <div id="aeroConnectEmpty" class="aero-connect-empty">
          <div>
            <div class="aero-kicker">Dynamix Connect</div>
            <h2>Connect to the community</h2>
            <p class="aero-muted">Loading the Aerodynamix community…</p>
          </div>
        </div>
        <div id="aeroConnectPage" hidden></div>
      </div>
    `;
    if (nav && nav.parentNode) {
      nav.parentNode.insertBefore(connectView, nav.nextSibling);
    } else {
      document.body.prepend(connectView);
    }

    var appsView = document.createElement('main');
    appsView.id = 'aeroAppsView';
    var appsTemplate = document.getElementById('aeroAppsMarkup');
    appsView.innerHTML = appsTemplate ? appsTemplate.innerHTML : '<main class="apps-page"><h1 class="apps-title">Apps</h1></main>';
    if (nav && nav.parentNode) nav.parentNode.insertBefore(appsView, nav.nextSibling);
    else document.body.prepend(appsView);

    var drawingView = document.createElement('main');
    drawingView.id = 'aeroDrawingView';
    var drawingTemplate = document.getElementById('aeroDrawingMarkup');
    drawingView.innerHTML = drawingTemplate ? drawingTemplate.innerHTML : '<main class="drawing-page"></main>';
    if (nav && nav.parentNode) nav.parentNode.insertBefore(drawingView, nav.nextSibling);
    else document.body.prepend(drawingView);

    var clockView = document.createElement('main');
    clockView.id = 'aeroClockView';
    clockView.innerHTML = `
      <div class="aero-clock-shell">
        <header class="aero-clock-heading">
          <h2>Pacific Time</h2>
          <p>Your little Aerodynamix clock easter egg.</p>
        </header>
        <section class="aero-clock-display" id="aeroClockDisplay">
          <div class="aero-clock-time" id="aeroClockTime">--:--:--</div>
          <div class="aero-clock-date" id="aeroClockDate">Loading time…</div>
        </section>
        <div class="aero-clock-controls">
          <label class="aero-clock-control">Timezone
            <select id="aeroClockTimezone"></select>
          </label>
          <label class="aero-clock-control">Clock color
            <input id="aeroClockColor" type="color" value="#2c7ffc" aria-label="Choose clock color">
          </label>
          <label class="aero-clock-control">Number style
            <select id="aeroClockFont">
              <option value="digital">Digital Mono</option>
              <option value="square">Square Tech</option>
              <option value="rounded">Rounded</option>
              <option value="serif">Classic Serif</option>
            </select>
          </label>
          <label class="aero-clock-control">Display look
            <select id="aeroClockStyle">
              <option value="theme">Match current theme</option>
              <option value="liquid">Liquid glass</option>
              <option value="neon">Neon glow</option>
              <option value="minimal">Minimal</option>
            </select>
          </label>
          <label class="aero-clock-control">Time format
            <button type="button" id="aeroClockFormat">Switch to 24-hour</button>
          </label>
        </div>
        <a class="aero-clock-back" id="aeroClockBack" href="#">← Back to Games</a>
      </div>
    `;
    if (nav && nav.parentNode) nav.parentNode.insertBefore(clockView, nav.nextSibling);
    else document.body.prepend(clockView);
    // The standalone keeps the compact status clock in the top bar, but does
    // not expose the optional clock easter-egg page.
    clockView.remove();

    var appsStyles = document.getElementById('aeroAppsStyles');
    if (appsStyles) {
      appsStyles.textContent += `
        .aeroAppsView {}
        #aeroAppsView .apps-page {
          color: var(--standalone-text);
          background: transparent;
        }
        #aeroAppsView .apps-title { color: var(--standalone-text); }
        #aeroAppsView .apps-subtitle { color: color-mix(in srgb, var(--standalone-text) 58%, transparent); }
        #aeroAppsView .search { display:flex; width:min(30vw, 300px); margin:2.5vw 0 .8rem 1.2vw; }
        #aeroAppsView .search input {
          min-width:0; flex:1; background:color-mix(in srgb, var(--standalone-text) 8%, transparent);
          border:0; border-radius:1vw 0 0 1vw; color:var(--standalone-text);
          font:600 clamp(.9rem,1.5vw,1.15rem) Montserrat,sans-serif; padding:.8vw 1.5vw; outline:0;
        }
        #aeroAppsView .search input::placeholder {
          color:color-mix(in srgb, var(--standalone-text) 82%, transparent); font:600 clamp(.9rem,1.5vw,1.15rem) Montserrat,sans-serif;
        }
        #aeroAppsView .search button {
          flex:none; border:0; border-radius:0 1vw 1vw 0; background:var(--standalone-text);
          color:var(--standalone-bg); font-size:clamp(1rem,1.5vw,1.2rem); padding:.8vw 1vw; cursor:pointer;
        }
        #aeroAppsView .app-card {
          border-color:color-mix(in srgb, var(--standalone-accent) 35%, transparent);
          background:linear-gradient(150deg,color-mix(in srgb, var(--standalone-accent) 24%, var(--standalone-bg)),color-mix(in srgb, var(--standalone-bg) 92%, #000));
        }
        #aeroAppsView .app-card-art { background:linear-gradient(135deg,color-mix(in srgb, var(--standalone-accent) 70%, #173f87),#6b37a8 60%,#ef7b9a); }
        #aeroAppsView .app-card-body p { color:color-mix(in srgb, var(--standalone-text) 58%, transparent); }
        #aeroAppsView .app-card-launch { background:linear-gradient(135deg,var(--standalone-accent),color-mix(in srgb, var(--standalone-accent) 62%, #000)); }
        @media (max-width:768px) { #aeroAppsView .search { width:calc(100% - 2.4vw); margin:1.5rem 1.2vw .8rem; } }
      `;
    }

    var modal = document.createElement('div');
    modal.id = 'aeroImportModal';
    modal.setAttribute('aria-hidden', 'true');
    modal.innerHTML = `
      <section class="aero-modal" role="dialog" aria-modal="true" aria-labelledby="aeroImportTitle">
        <header class="aero-modal-head">
          <div>
            <div class="aero-kicker">Personal library</div>
            <h3 id="aeroImportTitle">Add your own game</h3>
          </div>
          <button class="aero-icon-button" id="aeroImportClose" type="button" aria-label="Close">×</button>
        </header>
        <p class="aero-muted">Choose a self-contained HTML game and an optional thumbnail. Both files stay in this browser.</p>
        <form class="aero-form" id="aeroImportForm">
          <label>
            Game title
            <input class="aero-input" id="aeroGameTitle" maxlength="80" placeholder="My game">
          </label>
          <label>
            HTML game file
            <input id="aeroGameFile" type="file" accept=".html,.htm,text/html" required>
          </label>
          <label>
            Thumbnail (optional)
            <input id="aeroGameThumb" type="file" accept="image/*">
          </label>
          <div class="aero-modal-actions">
            <button class="aero-button secondary" id="aeroImportCancel" type="button">Cancel</button>
            <button class="aero-button" type="submit">Add to library</button>
          </div>
        </form>
      </section>
    `;
    document.body.appendChild(modal);

    var toast = document.createElement('div');
    toast.id = 'aeroToast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    document.body.appendChild(toast);

    var messageNotification = document.createElement('div');
    messageNotification.id = 'aeroMessageNotification';
    messageNotification.setAttribute('role', 'alert');
    messageNotification.setAttribute('aria-live', 'polite');
    messageNotification.innerHTML =
      '<div class="aero-message-avatar"></div>' +
      '<div class="aero-message-copy">' +
        '<div class="aero-message-title">New message</div>' +
        '<div class="aero-message-preview"></div>' +
      '</div>';
    messageNotification.addEventListener('click', function () {
      messageNotification.classList.remove('show');
      showView('connect');
      loadConnectFrame();
    });
    document.body.appendChild(messageNotification);
  }

  function toast(message) {
    var element = document.getElementById('aeroToast');
    if (!element) return;
    element.textContent = message;
    element.classList.add('show');
    clearTimeout(toast.timer);
    toast.timer = setTimeout(function () {
      element.classList.remove('show');
    }, 2600);
  }

  var messageNotificationTimer = null;
  var unreadMessageSnapshot = null;
  var messageNotificationPoll = null;

  function showMessageNotification(conversation) {
    var element = document.getElementById('aeroMessageNotification');
    if (!element || !conversation || !conversation.user) return;
    var user = conversation.user;
    var avatar = element.querySelector('.aero-message-avatar');
    var title = element.querySelector('.aero-message-title');
    var preview = element.querySelector('.aero-message-preview');
    var message = conversation.last_message;
    var initials = (user.username || '?').slice(0, 2).toUpperCase();
    avatar.textContent = initials;
    if (user.pfp_url) {
      var image = document.createElement('img');
      image.alt = '';
      image.src = resolveSitePath(user.pfp_url);
      image.style.objectPosition = (user.pfp_offset_x || 50) + '% ' + (user.pfp_offset_y || 50) + '%';
      image.addEventListener('error', function () { image.remove(); });
      avatar.textContent = '';
      avatar.appendChild(image);
    }
    title.textContent = 'New message from ' + (user.username || 'someone');
    preview.textContent = message && message.text ? message.text : 'You have an unread message';
    element.classList.add('show');
    clearTimeout(messageNotificationTimer);
    messageNotificationTimer = setTimeout(function () {
      element.classList.remove('show');
    }, 5000);
  }

  async function pollStandaloneMessages() {
    if (!window.fetch) return;
    try {
      var response = await fetch(new URL('/api/dms', CONNECT_ORIGIN).href, { credentials: 'include' });
      if (!response.ok) return;
      var data = await response.json();
      var conversations = Array.isArray(data.conversations) ? data.conversations : [];
      var totalUnread = conversations.reduce(function (sum, item) {
        return sum + Number(item.unread || 0);
      }, 0);
      if (unreadMessageSnapshot !== null && totalUnread > unreadMessageSnapshot) {
        var newest = conversations
          .filter(function (item) { return Number(item.unread || 0) > 0; })
          .sort(function (a, b) {
            return String(b.last_message && b.last_message.created_at || '')
              .localeCompare(String(a.last_message && a.last_message.created_at || ''));
          })[0];
        if (newest) showMessageNotification(newest);
      }
      unreadMessageSnapshot = totalUnread;
    } catch (error) {
      // Notifications are supplemental; an unavailable session should not
      // affect navigation or the embedded Connect page.
    }
  }

  function startStandaloneMessageNotifications() {
    if (messageNotificationPoll) return;
    pollStandaloneMessages();
    messageNotificationPoll = setInterval(pollStandaloneMessages, 5000);
  }

  function getManifest() {
    try {
      var manifest = window.eval('GAMES');
      return Array.isArray(manifest) ? manifest : [];
    } catch (error) {
      return [];
    }
  }

  function getSiteBase() {
    if (location.protocol === 'http:' || location.protocol === 'https:') {
      if (
        location.hostname.endsWith('github.io') &&
        location.pathname.includes('/Aerodynamix/Aerodynamix20/Aerodynamix20/')
      ) {
        return DEFAULT_PUBLIC_ROOT;
      }
      return location.origin.replace(/\/?$/, '/');
    }
    return (settings.sourceOrigin || DEFAULT_PUBLIC_ROOT).replace(/\/?$/, '/');
  }

  function normalizeLiveGameTitle(value) {
    var title = String(value || '').trim();
    if (!title) return 'Untitled game';
    return title.replace(/\w\S*/g, function (word) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    });
  }

  async function refreshLiveCatalogue() {
    var liveBase = DEFAULT_PUBLIC_ROOT;
    try {
      var response = await fetch(new URL('index.html', liveBase).href, {
        credentials: 'omit',
        cache: 'no-store'
      });
      if (!response.ok) throw new Error('Live catalogue returned HTTP ' + response.status);
      var html = await response.text();
      var parsed = new DOMParser().parseFromString(html, 'text/html');
      var liveGames = [];
      parsed.querySelectorAll('#games a[href*="game-frame.html?game="]').forEach(function (card) {
        var image = card.querySelector('img');
        var link = card.getAttribute('href') || '';
        var gamePath = '';
        try {
          gamePath = new URL(link, liveBase).searchParams.get('game') || '';
        } catch (error) {}
        if (!gamePath) return;
        var gameUrl = new URL(gamePath, liveBase).href;
        var thumbPath = image && image.getAttribute('src');
        var thumb = thumbPath ? new URL(thumbPath, liveBase).href : '';
        liveGames.push({
          title: normalizeLiveGameTitle(image && image.getAttribute('alt')),
          game: gamePath,
          url: gameUrl,
          thumb: thumb
        });
      });
      if (!liveGames.length) throw new Error('Live catalogue contained no games');

      var known = {};
      builtInGames.forEach(function (game) {
        known[game.url || game.game || game.gamePath || game.path || game.title] = true;
      });
      var additions = liveGames.filter(function (game) {
        var key = game.game || game.url || game.title;
        if (known[key]) return false;
        known[key] = true;
        return true;
      });
      if (additions.length) {
        builtInGames = builtInGames.concat(additions);
        drawLibrary();
        wireFeaturedGames();
      }
    } catch (error) {
      // The bundled catalogue remains available when the live site is offline,
      // blocked by a browser, or opened without network access.
    }
  }

  function resolveSitePath(path) {
    if (!path) return '';
    if (/^(https?:|blob:|data:)/i.test(path)) return path;
    var base = getSiteBase();
    if (!base) return '';
    var normalizedPath = path.replace(/^\/+/, '');
    if (
      base === DEFAULT_PUBLIC_ROOT &&
      /^(games|images|sounds)\//.test(normalizedPath)
    ) {
      normalizedPath = 'docs/' + normalizedPath;
    }
    if (normalizedPath.endsWith('/')) normalizedPath += 'index.html';
    try {
      return new URL(normalizedPath, base).href;
    } catch (error) {
      return '';
    }
  }

  function getFallbackContent(game) {
    if (!game || !game.content) return '';
    if (/^(data:|blob:|https?:)/i.test(game.content)) return game.content;
    return URL.createObjectURL(new Blob([game.content], { type: 'text/html' }));
  }

  function sanitizeStandaloneGameHtml(html, gameUrl) {
    var parser = new DOMParser();
    var documentCopy = parser.parseFromString(html, 'text/html');
    var adPattern = /adservice|adsbygoogle|googlesyndication|doubleclick|popunder|popads|adsterra|propellerads|juicyads|exoclick|clickadu|monetag|hilltopads|trafficjunky|adroll|advertising|(^|[-_])ads?([._-]|$)/i;

    documentCopy.querySelectorAll('script[src], iframe, object, embed, meta[http-equiv]').forEach(function (element) {
      var source = element.getAttribute('src') || element.getAttribute('data') || '';
      var metaRefresh = element.tagName === 'META' && /refresh/i.test(element.getAttribute('http-equiv') || '');
      if (element.tagName !== 'SCRIPT' || adPattern.test(source) || metaRefresh) element.remove();
    });
    documentCopy.querySelectorAll('[id], [class], [style]').forEach(function (element) {
      var label = [element.id, element.className, element.getAttribute('style') || ''].join(' ');
      if (adPattern.test(label)) element.remove();
    });
    documentCopy.querySelectorAll('*').forEach(function (element) {
      Array.from(element.attributes).forEach(function (attribute) {
        if (/^on/i.test(attribute.name) && /window\.open|location\.(href|replace|assign)|popunder/i.test(attribute.value)) {
          element.removeAttribute(attribute.name);
        }
      });
    });
    var guard = documentCopy.createElement('script');
    guard.textContent = '(function(){window.open=function(){return null;};try{Object.defineProperty(window,"opener",{value:null,configurable:false});}catch(e){}})();';
    documentCopy.head.insertBefore(guard, documentCopy.head.firstChild);
    var base = documentCopy.createElement('base');
    base.href = gameUrl;
    documentCopy.head.insertBefore(base, documentCopy.head.firstChild);
    return '<!doctype html>\n' + documentCopy.documentElement.outerHTML;
  }

  async function openSanitizedStandaloneGame(url, frame) {
    try {
      var response = await fetch(url, { credentials: 'omit' });
      if (!response.ok) throw new Error('Game could not be loaded');
      frame.srcdoc = sanitizeStandaloneGameHtml(await response.text(), url);
    } catch (error) {
      // Some legacy hosts do not allow fetching their HTML. Keep the sandboxed
      // fallback so those games remain playable.
      frame.removeAttribute('srcdoc');
      frame.src = url;
    }
  }

  function openGame(game) {
    var gamePath = game.game || game.gamePath || game.path || '';
    var url = game.url || resolveSitePath(gamePath);

    if (!url && location.protocol === 'file:' && gamePath) {
      showView('settings');
      var originInput = document.getElementById('aeroSourceOrigin');
      if (originInput) originInput.focus();
      toast('Enter the published Aerodynamix URL to load built-in games.');
      return;
    }

    if (!url) url = getFallbackContent(game);
    if (!url) {
      toast('This game does not have a playable file.');
      return;
    }

    var player = document.getElementById('player');
    var frame = document.getElementById('frame');
    var playing = document.getElementById('playing');
    if (!player || !frame) return;

    if (playing) playing.textContent = game.title || 'Game';
    if (game.custom === true) {
      frame.setAttribute('sandbox', 'allow-scripts allow-forms allow-modals allow-pointer-lock');
    } else {
      frame.setAttribute('sandbox', 'allow-scripts allow-forms allow-modals allow-pointer-lock');
    }
    if (location.protocol === 'file:' && game.custom !== true) {
      frame.removeAttribute('src');
      openSanitizedStandaloneGame(url, frame);
    } else {
      frame.src = url;
    }
    player.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function createCard(game, isCustom) {
    var article = document.createElement('article');
    article.className = 'card' + (isCustom ? ' aero-custom-card' : '');

    if (game.thumb) {
      var image = document.createElement('img');
      image.className = 'thumb';
      image.src = game.thumb;
      image.alt = game.title || 'Game';
      image.loading = 'lazy';
      article.appendChild(image);
    } else {
      var placeholder = document.createElement('div');
      placeholder.className = 'thumb-placeholder';
      placeholder.textContent = (game.title || 'A').slice(0, 1).toUpperCase();
      article.appendChild(placeholder);
    }

    var title = document.createElement('h2');
    title.textContent = game.title || 'Untitled game';
    article.appendChild(title);
    article.addEventListener('click', function () {
      openGame(game);
    });

    if (isCustom) {
      var remove = document.createElement('button');
      remove.className = 'aero-delete';
      remove.type = 'button';
      remove.textContent = 'Remove';
      remove.setAttribute('aria-label', 'Remove ' + (game.title || 'custom game'));
      remove.addEventListener('click', function (event) {
        event.stopPropagation();
        if (window.confirm('Remove "' + (game.title || 'this game') + '" from your library?')) {
          removeCustomGame(game.id);
        }
      });
      article.appendChild(remove);
    }
    return article;
  }

  function createAddCard() {
    var article = document.createElement('article');
    article.className = 'card aero-plus';
    article.setAttribute('role', 'button');
    article.tabIndex = 0;
    article.innerHTML = `
      <div class="aero-plus-inner">
        <span class="aero-plus-mark" aria-hidden="true">+</span>
        <strong>Add your game</strong>
      </div>
    `;
    article.addEventListener('click', showImport);
    article.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        showImport();
      }
    });
    return article;
  }

  function drawLibrary() {
    var grid = document.getElementById('grid');
    if (!grid) return;
    var input = document.getElementById('search');
    var query = ((input && input.value) || '').trim().toLowerCase();
    var combined = builtInGames.concat(customGames);
    var visible = combined.filter(function (game) {
      return (game.title || '').toLowerCase().includes(query);
    });

    grid.innerHTML = '';
    grid.appendChild(createAddCard());
    visible.forEach(function (game) {
      grid.appendChild(createCard(game, game.custom === true));
    });

    var count = document.getElementById('count');
    if (count) count.textContent = visible.length + ' OF ' + combined.length + ' GAMES';
    var empty = document.getElementById('empty');
    if (empty) empty.style.display = visible.length ? 'none' : 'block';
  }

  function wireFeaturedGames() {
    var featured = document.getElementById('featured');
    if (!featured) return;
    featured.querySelectorAll('[data-i]').forEach(function (card) {
      card.onclick = function () {
        var game = builtInGames[Number(card.dataset.i)];
        if (game) openGame(game);
      };
    });
  }

  function openDatabase() {
    return new Promise(function (resolve, reject) {
      var request = indexedDB.open(DB_NAME, 1);
      request.onupgradeneeded = function () {
        if (!request.result.objectStoreNames.contains(DB_STORE)) {
          request.result.createObjectStore(DB_STORE, { keyPath: 'id', autoIncrement: true });
        }
      };
      request.onsuccess = function () { resolve(request.result); };
      request.onerror = function () { reject(request.error); };
    });
  }

  function requestResult(request) {
    return new Promise(function (resolve, reject) {
      request.onsuccess = function () { resolve(request.result); };
      request.onerror = function () { reject(request.error); };
    });
  }

  function transactionComplete(transaction) {
    return new Promise(function (resolve, reject) {
      transaction.oncomplete = function () { resolve(); };
      transaction.onerror = function () { reject(transaction.error); };
      transaction.onabort = function () { reject(transaction.error); };
    });
  }

  function revokeObjectUrls() {
    objectUrls.forEach(function (url) {
      try { URL.revokeObjectURL(url); } catch (error) {}
    });
    objectUrls = [];
  }

  async function loadCustomGames() {
    var loadVersion = ++libraryLoadVersion;
    try {
      var database = await openDatabase();
      var request = database.transaction(DB_STORE, 'readonly').objectStore(DB_STORE).getAll();
      var records = await requestResult(request);
      if (loadVersion !== libraryLoadVersion) return;
      revokeObjectUrls();
      customGames = records.map(function (record) {
        var gameUrl = URL.createObjectURL(record.html);
        objectUrls.push(gameUrl);
        var thumbUrl = '';
        if (record.thumbnail) {
          thumbUrl = URL.createObjectURL(record.thumbnail);
          objectUrls.push(thumbUrl);
        }
        return {
          id: record.id,
          title: record.title,
          url: gameUrl,
          thumb: thumbUrl,
          custom: true
        };
      });
      drawLibrary();
    } catch (error) {
      toast('Custom game storage is unavailable in this browser.');
    }
  }

  async function addCustomGame(record) {
    try {
      var database = await openDatabase();
      var transaction = database.transaction(DB_STORE, 'readwrite');
      transaction.objectStore(DB_STORE).add(record);
      await transactionComplete(transaction);
      await loadCustomGames();
      toast('Game added to your library.');
    } catch (error) {
      toast('That game could not be saved.');
    }
  }

  async function removeCustomGame(id) {
    try {
      var database = await openDatabase();
      var transaction = database.transaction(DB_STORE, 'readwrite');
      transaction.objectStore(DB_STORE).delete(id);
      await transactionComplete(transaction);
      await loadCustomGames();
      toast('Game removed.');
    } catch (error) {
      toast('That game could not be removed.');
    }
  }

  function showImport() {
    var modal = document.getElementById('aeroImportModal');
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    setTimeout(function () {
      document.getElementById('aeroGameTitle').focus();
    }, 40);
  }

  function hideImport() {
    var modal = document.getElementById('aeroImportModal');
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  }

  function updateClockDisplay() {
    var time = document.getElementById('aeroClockTime');
    var date = document.getElementById('aeroClockDate');
    if (!time || !date) return;
    var now = new Date();
    var use24 = settings.clock24 === true;
    var timezone = settings.clockTimezone || 'America/Los_Angeles';
    time.textContent = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: !use24
    }).format(now);
    date.textContent = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }).format(now);
  }

  function populateClockTimezones(select) {
    if (!select || select.options.length) return;
    var zones = typeof Intl.supportedValuesOf === 'function'
      ? Intl.supportedValuesOf('timeZone')
      : ['America/Los_Angeles', 'America/New_York', 'America/Chicago', 'America/Denver', 'Europe/London', 'Europe/Paris', 'Asia/Tokyo', 'Asia/Shanghai', 'Australia/Sydney', 'Pacific/Auckland', 'UTC'];
    zones.forEach(function (zone) {
      var option = document.createElement('option');
      option.value = zone;
      option.textContent = zone.replace(/_/g, ' ').replace(/\//g, ' / ');
      select.appendChild(option);
    });
    select.value = settings.clockTimezone || 'America/Los_Angeles';
  }

  function applyClockDisplay() {
    var display = document.getElementById('aeroClockDisplay');
    var font = document.getElementById('aeroClockFont');
    var style = document.getElementById('aeroClockStyle');
    var timezone = document.getElementById('aeroClockTimezone');
    var color = document.getElementById('aeroClockColor');
    var format = document.getElementById('aeroClockFormat');
    if (!display) return;
    var selectedStyle = settings.clockStyle || 'theme';
    display.classList.remove('liquid', 'neon', 'minimal');
    display.classList.add(selectedStyle === 'theme' && settings.theme === 'frutiger-aero' ? 'liquid' : selectedStyle === 'theme' ? 'minimal' : selectedStyle);
    display.classList.remove('clock-font-digital', 'clock-font-square', 'clock-font-rounded', 'clock-font-serif');
    display.classList.add('clock-font-' + (settings.clockFont || 'digital'));
    display.style.setProperty('--aero-clock-color', settings.clockColor || getComputedStyle(document.documentElement).getPropertyValue('--standalone-accent').trim() || '#2c7ffc');
    if (font) font.value = settings.clockFont || 'digital';
    if (style) style.value = selectedStyle;
    if (timezone) timezone.value = settings.clockTimezone || 'America/Los_Angeles';
    if (color) color.value = settings.clockColor || '#2c7ffc';
    if (format) format.textContent = settings.clock24 ? 'Switch to 12-hour' : 'Switch to 24-hour';
  }

  function showView(view) {
    var gamesView = document.querySelector('main.content');
    var mediaView = document.getElementById('mediaView');
    var settingsView = document.getElementById('aeroSettingsView');
    var connectView = document.getElementById('aeroConnectView');
    var appsView = document.getElementById('aeroAppsView');
    var drawingView = document.getElementById('aeroDrawingView');
    if (gamesView) gamesView.style.display = view === 'games' ? 'block' : 'none';
    if (mediaView) mediaView.classList.toggle('active', view === 'media');
    if (settingsView) settingsView.classList.toggle('active', view === 'settings');
    if (connectView) connectView.classList.toggle('active', view === 'connect');
    if (appsView) appsView.classList.toggle('active', view === 'apps');
    if (drawingView) drawingView.classList.toggle('active', view === 'drawing');
    var clockView = document.getElementById('aeroClockView');
    if (clockView) clockView.classList.toggle('active', view === 'clock');

    document.querySelectorAll('.nav-links a, .settings-nav').forEach(function (link) {
      link.classList.remove('active');
    });
    var active = view === 'settings'
      ? document.getElementById('settingsToggle')
      : document.getElementById(view + 'Nav');
    if (active) active.classList.add('active');
    if (view === 'drawing' && drawingView && !drawingView.dataset.loaded) {
      var drawingClient = document.getElementById('aeroDrawingClient');
      var drawingStyles = document.getElementById('aeroDrawingStyles');
      if (drawingStyles && !document.getElementById('aeroDrawingPageStyles')) {
        var style = document.createElement('style');
        style.id = 'aeroDrawingPageStyles';
        style.textContent = drawingStyles.textContent;
        document.head.appendChild(style);
      }
      if (drawingClient) {
        (new Function(drawingClient.textContent))();
        drawingView.dataset.loaded = 'true';
      }
    }
    if (view === 'clock') {
      applyClockDisplay();
      updateClockDisplay();
      if (!clockTimer) clockTimer = setInterval(updateClockDisplay, 1000);
    }
    window.scrollTo(0, 0);
  }

  function getConnectOrigin() {
    return CONNECT_ORIGIN;
  }

  var connectMounted = false;
  function loadConnectFrame() {
    var page = document.getElementById('aeroConnectPage');
    var empty = document.getElementById('aeroConnectEmpty');
    if (!page || !empty || connectMounted) return;
    try {
      var template = document.getElementById('aeroConnectMarkup');
      var styles = document.getElementById('aeroConnectStyles');
      var client = document.getElementById('aeroConnectClient');
      if (!template || !styles || !client) throw new Error('Connect assets missing');
      page.appendChild(template.content.cloneNode(true));
      // Calling is intentionally unavailable in the downloaded standalone
      // edition. Keep the hosted Connect page's calling feature unchanged.
      if (window.location.protocol === 'file:' || window.AERO_CONNECT_ORIGIN) {
        ['profile-call-btn', 'incoming-call-modal', 'video-call-modal'].forEach(function (id) {
          var callElement = page.querySelector('#' + id);
          if (callElement) {
            if (id === 'profile-call-btn') callElement.remove();
            else callElement.remove();
          }
        });
      }
      // Fixed-position modals can be trapped by the standalone view's
      // animation/stacking context in Chromium. Keep them at document level.
      page.querySelectorAll('.dc-modal-overlay').forEach(function (modal) {
        document.body.appendChild(modal);
      });
      if (!document.getElementById('aeroConnectPageStyles')) {
        var style = document.createElement('style');
        style.id = 'aeroConnectPageStyles';
        style.textContent = styles.textContent;
        document.head.appendChild(style);
      }
      page.hidden = false;
      empty.hidden = true;
      connectMounted = true;
      if (!document.getElementById('aeroFontAwesome')) {
        var iconFont = document.createElement('link');
        iconFont.id = 'aeroFontAwesome';
        iconFont.rel = 'stylesheet';
        iconFont.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
        document.head.appendChild(iconFont);
      }
      (new Function(client.textContent))();
    } catch (error) {
      page.hidden = true;
      empty.hidden = false;
      empty.querySelector('p').textContent = 'Dynamix Connect could not be loaded right now.';
      empty.querySelector('p').classList.add('aero-connect-error');
    }
  }

  function getFrutigerImage() {
    var url = resolveSitePath('images/frutiger-aero-bg.jpg');
    return url ? "url('" + url.replace(/'/g, '%27') + "')" : themes['frutiger-aero'].image;
  }

  function applyTheme(name, quiet) {
    var selected = themes[name] || themes.black;
    settings.theme = themes[name] ? name : 'black';
    saveSettings();
    document.body.classList.add('aerodynamix-standalone');
    document.body.dataset.aeroTheme = settings.theme;
    document.body.style.backgroundColor = selected.background;
    document.body.style.backgroundImage = name === 'frutiger-aero' ? getFrutigerImage() : selected.image;
    document.body.style.backgroundSize = name === 'frutiger-aero' ? 'cover' : '';
    document.body.style.backgroundPosition = name === 'frutiger-aero' ? 'center' : '';
    document.body.style.backgroundAttachment = 'fixed';
    document.documentElement.style.setProperty('--standalone-bg', selected.background);
    document.documentElement.style.setProperty('--standalone-text', selected.color);
    document.documentElement.style.setProperty('--standalone-accent', selected.accent);
    applyClockDisplay();
    document.querySelectorAll('.aero-theme-button').forEach(function (button) {
      button.classList.toggle('active', button.dataset.theme === settings.theme);
    });
    syncThemeEffects();
    if (!quiet) toast(selected.label + ' theme applied.');
  }

  function standaloneIcon() {
    return 'data:image/svg+xml,' + encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">' +
      '<rect width="64" height="64" rx="16" fill="#071226"/>' +
      '<path d="M13 49 29 13h8l15 36h-9l-3-8H25l-3 8zm15-16h9l-4-11z" fill="#55a7ff"/>' +
      '</svg>'
    );
  }

  function applyCloak(enabled) {
    settings.cloak = enabled;
    saveSettings();
    var preset = CLOAK_PRESETS[settings.cloakPreset] || CLOAK_PRESETS.google;
    document.title = enabled ? preset.title : 'Aerodynamix';
    var icon = document.querySelector('link[rel~="icon"]');
    if (!icon) {
      icon = document.createElement('link');
      icon.rel = 'icon';
      document.head.appendChild(icon);
    }
    icon.href = enabled
      ? (preset.icon || resolveSitePath(preset.path) || standaloneIcon())
      : standaloneIcon();
    var toggle = document.getElementById('aeroCloakToggle');
    if (toggle) toggle.classList.toggle('on', enabled);
    var select = document.getElementById('aeroCloakPreset');
    if (select) select.value = settings.cloakPreset || 'google';
  }

  function createEffectLayer() {
    var layer = document.createElement('div');
    layer.id = 'aeroThemeEffects';
    document.body.appendChild(layer);
    effectLayer = layer;
    return layer;
  }

  function stopThemeEffects() {
    clearInterval(effectTimer);
    effectTimer = null;
    if (effectLayer) effectLayer.remove();
    effectLayer = null;
  }

  function spawnBubble() {
    if (!effectLayer || effectLayer.childElementCount > 26) return;
    var bubble = document.createElement('button');
    var size = Math.round(22 + Math.random() * 52);
    bubble.className = 'aero-bubble';
    bubble.type = 'button';
    bubble.tabIndex = -1;
    bubble.setAttribute('aria-label', 'Pop bubble');
    bubble.style.left = Math.round(Math.random() * 94) + 'vw';
    bubble.style.width = size + 'px';
    bubble.style.height = size + 'px';
    bubble.style.setProperty('--duration', (5 + Math.random() * 6).toFixed(2) + 's');
    bubble.style.setProperty('--drift', Math.round(-35 + Math.random() * 70) + 'px');
    bubble.onclick = function () {
      bubble.style.transform = 'scale(1.35)';
      bubble.style.opacity = '0';
      setTimeout(function () { bubble.remove(); }, 140);
    };
    bubble.onanimationend = function () { bubble.remove(); };
    effectLayer.appendChild(bubble);
  }

  function spawnSnow() {
    if (!effectLayer) return;
    for (var index = 0; index < 55; index += 1) {
      var flake = document.createElement('span');
      var size = 2 + Math.random() * 5;
      flake.className = 'aero-snow';
      flake.style.left = Math.random() * 100 + 'vw';
      flake.style.width = size + 'px';
      flake.style.height = size + 'px';
      flake.style.opacity = (.35 + Math.random() * .6).toFixed(2);
      flake.style.setProperty('--blur', Math.random() > .72 ? '1px' : '0');
      flake.style.setProperty('--duration', (5 + Math.random() * 7).toFixed(2) + 's');
      flake.style.setProperty('--drift', Math.round(-45 + Math.random() * 90) + 'px');
      flake.style.animationDelay = (-Math.random() * 10).toFixed(2) + 's';
      effectLayer.appendChild(flake);
    }
  }

  function syncThemeEffects() {
    stopThemeEffects();
    document.body.classList.toggle('aero-reduce-effects', settings.reduceEffects === true);
    var toggle = document.getElementById('aeroEffectsToggle');
    if (toggle) toggle.classList.toggle('on', settings.reduceEffects === true);
    if (settings.reduceEffects) return;

    if (settings.theme === 'frutiger-aero') {
      createEffectLayer();
      spawnBubble();
      effectTimer = setInterval(spawnBubble, 520);
    } else if (settings.theme === 'christmas') {
      createEffectLayer();
      spawnSnow();
    }
  }

  function renderThemeButtons() {
    var container = document.getElementById('aeroThemeGrid');
    Object.keys(themes).forEach(function (name) {
      var theme = themes[name];
      var button = document.createElement('button');
      button.className = 'aero-theme-button';
      button.type = 'button';
      button.dataset.theme = name;
      button.style.setProperty('--theme-color', theme.background);
      button.style.setProperty('--theme-text', theme.color);
      if (name === 'frutiger-aero') {
        var image = resolveSitePath('images/frutiger-aero-btn-bg.png');
        if (image) button.style.backgroundImage = "url('" + image.replace(/'/g, '%27') + "')";
      }
      button.textContent = theme.label;
      button.onclick = function () { applyTheme(name, false); };
      container.appendChild(button);
    });
  }

  function updateConnectionStatus() {
    var status = document.getElementById('offlineStatus');
    if (status) status.textContent = navigator.onLine ? 'Online' : 'Offline';
  }

  function wireEvents() {
    var gamesNav = document.getElementById('gamesNav');
    var mediaNav = document.getElementById('mediaNav');
    var connectNav = document.getElementById('connectNav');
    var appsNav = document.getElementById('appsNav');
    var clock = document.getElementById('pstClock');
    var settingsNav = document.getElementById('settingsToggle');
    if (gamesNav) gamesNav.onclick = function (event) {
      event.preventDefault();
      showView('games');
    };
    if (mediaNav) mediaNav.onclick = function (event) {
      event.preventDefault();
      showView('media');
    };
    if (connectNav) connectNav.onclick = function (event) {
      event.preventDefault();
      showView('connect');
      loadConnectFrame();
    };
    if (appsNav) appsNav.onclick = function (event) {
      event.preventDefault();
      showView('apps');
    };
    if (clock) {
      clock.title = 'Pacific time';
      clock.style.cursor = 'default';
    }
    var clockFont = document.getElementById('aeroClockFont');
    var clockStyle = document.getElementById('aeroClockStyle');
    var clockTimezone = document.getElementById('aeroClockTimezone');
    var clockColor = document.getElementById('aeroClockColor');
    var clockFormat = document.getElementById('aeroClockFormat');
    if (clockFont) clockFont.onchange = function () {
      settings.clockFont = clockFont.value;
      saveSettings();
      applyClockDisplay();
    };
    if (clockStyle) clockStyle.onchange = function () {
      settings.clockStyle = clockStyle.value;
      saveSettings();
      applyClockDisplay();
    };
    populateClockTimezones(clockTimezone);
    if (clockTimezone) clockTimezone.onchange = function () {
      settings.clockTimezone = clockTimezone.value;
      saveSettings();
      updateClockDisplay();
    };
    if (clockColor) clockColor.oninput = function () {
      settings.clockColor = clockColor.value;
      saveSettings();
      applyClockDisplay();
    };
    if (clockFormat) clockFormat.onclick = function () {
      settings.clock24 = !settings.clock24;
      saveSettings();
      updateClockDisplay();
      applyClockDisplay();
    };
    var clockBack = document.getElementById('aeroClockBack');
    if (clockBack) clockBack.onclick = function (event) {
      event.preventDefault();
      showView('games');
    };
    var drawingCard = document.querySelector('#aeroAppsView .app-card');
    if (drawingCard) drawingCard.addEventListener('click', function (event) {
      event.preventDefault();
      showView('drawing');
    });
    var drawingBack = document.querySelector('#aeroDrawingView .drawing-back');
    if (drawingBack) drawingBack.addEventListener('click', function (event) {
      event.preventDefault();
      showView('apps');
    });
    var appsSearch = document.querySelector('#aeroAppsView .search input');
    var appsSearchButton = document.querySelector('#aeroAppsView .search button');
    function filterApps() {
      var query = (appsSearch && appsSearch.value || '').trim().toLowerCase();
      document.querySelectorAll('#aeroAppsView .app-card').forEach(function (card) {
        card.hidden = Boolean(query) && !(card.dataset.appName || '').includes(query);
      });
    }
    if (appsSearch) appsSearch.addEventListener('input', filterApps);
    if (appsSearchButton) appsSearchButton.addEventListener('click', filterApps);
    if (settingsNav) {
      settingsNav.textContent = 'Settings';
      settingsNav.onclick = function (event) {
        event.preventDefault();
        showView('settings');
      };
    }

    var search = document.getElementById('search');
    if (search) search.oninput = drawLibrary;
    var searchButton = document.getElementById('searchButton');
    if (searchButton) searchButton.onclick = drawLibrary;

    document.getElementById('aeroCloakToggle').onclick = function () {
      applyCloak(!settings.cloak);
    };
    document.getElementById('aeroCloakPreset').onchange = function (event) {
      if (!CLOAK_PRESETS[event.target.value]) return;
      settings.cloakPreset = event.target.value;
      saveSettings();
      if (settings.cloak) applyCloak(true);
    };
    document.getElementById('aeroEffectsToggle').onclick = function () {
      settings.reduceEffects = !settings.reduceEffects;
      saveSettings();
      syncThemeEffects();
      toast(settings.reduceEffects ? 'Visual effects reduced.' : 'Full visual effects restored.');
    };

    var origin = document.getElementById('aeroSourceOrigin');
    origin.value = settings.sourceOrigin || (location.protocol === 'file:' ? DEFAULT_PUBLIC_ROOT : '');
    document.getElementById('aeroSaveOrigin').onclick = function () {
      var value = origin.value.trim();
      if (value && !/^https?:\/\//i.test(value)) {
        toast('Use a complete http:// or https:// URL.');
        origin.focus();
        return;
      }
      settings.sourceOrigin = value.replace(/\/?$/, '/');
      saveSettings();
      applyTheme(settings.theme || 'black', true);
      toast(value ? 'Game source saved.' : 'Saved game source cleared.');
    };

    var importModal = document.getElementById('aeroImportModal');
    document.getElementById('aeroImportClose').onclick = hideImport;
    document.getElementById('aeroImportCancel').onclick = hideImport;
    importModal.onclick = function (event) {
      if (event.target === importModal) hideImport();
    };
    document.getElementById('aeroImportForm').onsubmit = function (event) {
      event.preventDefault();
      var html = document.getElementById('aeroGameFile').files[0];
      var thumbnail = document.getElementById('aeroGameThumb').files[0] || null;
      var titleInput = document.getElementById('aeroGameTitle');
      if (!html) return;
      var title = titleInput.value.trim() || html.name.replace(/\.(html?|HTML?)$/, '');
      addCustomGame({ title: title, html: html, thumbnail: thumbnail });
      hideImport();
      event.target.reset();
    };

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && importModal.classList.contains('open')) hideImport();
    });
    window.addEventListener('online', updateConnectionStatus);
    window.addEventListener('offline', updateConnectionStatus);
    window.addEventListener('beforeunload', revokeObjectUrls);
  }

  function rebrand() {
    document.querySelectorAll('.lite-label').forEach(function (label) { label.remove(); });
    var heading = document.querySelector('.real-nav h1');
    if (heading) heading.textContent = 'AERODYNAMIX';
    document.body.dataset.originalTitle = 'Aerodynamix';
  }

  function init() {
    if (document.getElementById('aerodynamix-standalone-styles')) return;
    injectStyles();
    createMarkup();
    rebrand();
    renderThemeButtons();
    wireEvents();
    builtInGames = getManifest();
    window.openGame = openGame;
    wireFeaturedGames();
    if (settings.cloak === undefined) settings.cloak = true;
    if (!settings.cloakPreset) settings.cloakPreset = 'google';
    if (!settings.theme) settings.theme = 'black';
    saveSettings();
    applyCloak(settings.cloak);
    applyTheme(settings.theme, true);
    updateConnectionStatus();
    startStandaloneMessageNotifications();
    drawLibrary();
    loadCustomGames();
    refreshLiveCatalogue();
    var params = new URLSearchParams(location.search);
    var requestedView = params.get('view');
    var validView = requestedView === 'media' || requestedView === 'settings' || requestedView === 'connect' ||
      requestedView === 'apps' || requestedView === 'drawing' || requestedView === 'clock'
      ? requestedView
      : 'games';
    showView(validView);
    if (validView === 'connect') loadConnectFrame();
    var requestedGame = Number(params.get('game'));
    if (params.has('game') && Number.isInteger(requestedGame) && builtInGames[requestedGame]) {
      setTimeout(function () { openGame(builtInGames[requestedGame]); }, 0);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();