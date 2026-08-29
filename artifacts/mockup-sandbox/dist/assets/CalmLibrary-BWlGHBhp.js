import{r as i,j as a}from"./index-DwxHoslL.js";import{S as T}from"./settings-2-BqW-bvib.js";import{c as S,X as y,P as u,S as z,V as q}from"./x-Dky74Pai.js";import{M as H,H as L}from"./menu-DExgKH1B.js";import{C as I}from"./check-CQHiKMkJ.js";import{S as O}from"./sparkles-Dxb5M4FV.js";import{S as Y}from"./sliders-horizontal-CDOANKAF.js";import{C as _}from"./chevron-left-D1FuzuC8.js";import{P as V}from"./pause-Bs5v1HOe.js";import{C as W}from"./chevron-right-CpBnHoL_.js";const Q=[["path",{d:"M12 3v18",key:"108xh3"}],["path",{d:"M3 12h18",key:"1i2n21"}],["rect",{x:"3",y:"3",width:"18",height:"18",rx:"2",key:"h1oib"}]],X=S("grid-2x2",Q);const J=[["path",{d:"m16 6 4 14",key:"ji33uf"}],["path",{d:"M12 6v14",key:"1n7gus"}],["path",{d:"M8 8v12",key:"1gg7y9"}],["path",{d:"M4 4v16",key:"6qkkli"}]],U=S("library",J),m="/__mockup/images/aerodynamix/",c=[{file:"run-3.jpg",name:"Run 3",note:"Endless momentum",tag:"Fast start",tint:"#d8f2ff"},{file:"drive-mad.jpg",name:"Drive Mad",note:"Unreasonably fun driving",tag:"Popular",tint:"#ffe4d8"},{file:"papaspizzeria.png",name:"Papa's Pizzeria",note:"Take the next order",tag:"Time well spent",tint:"#fff0b8"},{file:"supersmashflash.jpg",name:"Super Smash Flash",note:"Pick your fighter",tag:"Multiplayer",tint:"#e6ddff"}],o=[["run-3.jpg","Run 3"],["drive-mad.jpg","Drive Mad"],["retro-bowl.jpg","Retro Bowl"],["slope.jpg","Slope"],["mc.png","Minecraft"],["supersmashflash.jpg","Super Smash Flash"],["papaspizzeria.png","Papa's Pizzeria"],["papasfreezeria.png","Papa's Freezeria"],["papas-pancakeria.png","Papa's Pancakeria"],["papas-bakeria.png","Papa's Bakeria"],["meat-boy.png","Meat Boy"],["newgrounds-rumble.png","Newgrounds Rumble"],["we-become-what-we-behold.png","We Become What We Behold"],["bad-time-simulator.png","Bad Time Simulator"],["deltarune.png","Deltarune"],["adventure-capitalist.png","Adventure Capitalist"],["fridaynightfunkin.png","Friday Night Funkin'"],["run-2.png","Run 2"],["picoschool.png","Pico's School"],["worldshardestgame.png","World's Hardest Game"],["sandboxels.png","Sandboxels"],["alien-hominid.png","Alien Hominid"],["subway-surfers-sf.jpg","Subway Surfers San Francisco"],["hobo-1.png","Hobo 1"],["hobo-2.png","Hobo 2"],["hobo-3.png","Hobo 3"],["hobo-4.png","Hobo 4"],["hobo-5.png","Hobo 5"],["hobo-6.png","Hobo 6"],["hobo-7.png","Hobo 7"],["gladihoppers.jpg","Gladihoppers"],["fruit-ninja.png","Fruit Ninja"],["binding-of-isaac.png","Binding of Isaac"],["crossy-road.png","Crossy Road"],["cookie-clicker.png","Cookie Clicker"],["duck-life.png","Duck Life"],["geometry-dash-lite.jpg","Geometry Dash Lite"],["doom.png","Doom"],["doki-doki-literature-club.jpg","Doki Doki Literature Club"],["baldis-basics-classic-remastered.png","Baldi's Basics Classic Remastered"],["stickmin-breaking-bank.jpg","Breaking the Bank"],["stickmin-escaping-prison.avif","Escaping the Prison"],["stickmin-stealing-diamond.avif","Stealing the Diamond"],["stickmin-infiltrating-airship.avif","Infiltrating the Airship"],["stickmin-fleeing-complex.avif","Fleeing the Complex"],["greatest-game-square.svg","THE GREATEST GAME OF ALL TIME"],["nubbys-number-factory.jpg","Nubby's Number Factory"]],K=["All games","Quick play","Classics","Odd little gems"];function Z({label:p,onClick:d,quiet:l=!1}){return a.jsxs("button",{type:"button",className:`calm-play-button ${l?"calm-play-button--quiet":""}`,onClick:d,"aria-label":p,children:[a.jsx(u,{size:l?14:16,fill:"currentColor",strokeWidth:2.2}),!l&&a.jsx("span",{children:"Play now"})]})}function pa(){const[p,d]=i.useState(""),[l,C]=i.useState("All games"),[g,b]=i.useState(!1),[M,P]=i.useState(!1),[F,$]=i.useState(["Run 3"]),[n,v]=i.useState(null),[k,j]=i.useState(!1),[A,B]=i.useState(72),[w,G]=i.useState(!1),[h,R]=i.useState(!0),f=i.useMemo(()=>{const e=p.trim().toLowerCase();return o.filter(([,r],t)=>{const s=r.toLowerCase().includes(e),E=l==="All games"||l==="Quick play"&&t<12||l==="Classics"&&t>=12&&t<25||l==="Odd little gems"&&t>=25;return s&&E})},[l,p]),D=e=>{$(r=>r.includes(e)?r.filter(t=>t!==e):[...r,e])},x=e=>{v(e),j(!1)},N=e=>{const r=o.findIndex(([,s])=>s===n),t=r<0?0:e==="next"?(r+1)%o.length:(r-1+o.length)%o.length;x(o[t][1])};return a.jsxs("main",{className:"calm-page",children:[a.jsx("style",{children:`
        .calm-page {
          --calm-ink: #18253a;
          --calm-muted: #718096;
          --calm-line: #dce5ee;
          --calm-paper: #f7fafc;
          --calm-panel: #ffffff;
          --calm-blue: #3867dc;
          --calm-blue-soft: #eaf0ff;
          --calm-coral: #e47b62;
          position: relative;
          min-height: 100vh;
          overflow-x: hidden;
          padding-bottom: 92px;
          color: var(--calm-ink);
          background: #f6f8fa;
          font-family: "DM Sans", "Plus Jakarta Sans", sans-serif;
          isolation: isolate;
        }
        .calm-page *, .calm-page *::before, .calm-page *::after { box-sizing: border-box; }
        .calm-page::before {
          content: "";
          position: absolute;
          z-index: -1;
          inset: 0 0 auto;
          height: 510px;
          pointer-events: none;
          background:
            radial-gradient(circle at 16% 18%, rgba(214, 239, 248, .9), transparent 28%),
            radial-gradient(circle at 86% 2%, rgba(231, 225, 255, .82), transparent 32%),
            linear-gradient(180deg, #edf5f8 0%, #f6f8fa 88%);
        }
        .calm-page::after {
          content: "";
          position: fixed;
          z-index: 20;
          inset: 0;
          pointer-events: none;
          opacity: .12;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.19'/%3E%3C/svg%3E");
        }
        .calm-shell { width: min(1160px, calc(100% - 40px)); margin: 0 auto; }
        .calm-nav {
          position: sticky; top: 0; z-index: 10; height: 72px;
          border-bottom: 1px solid rgba(220, 229, 238, .9);
          background: rgba(247, 250, 252, .84);
          backdrop-filter: blur(18px);
        }
        .calm-nav-inner { height: 100%; display: flex; align-items: center; gap: 22px; }
        .calm-wordmark { display: inline-flex; align-items: center; gap: 10px; border: 0; padding: 0; color: var(--calm-ink); background: transparent; text-decoration: none; cursor: pointer; }
        .calm-wordmark img { width: 34px; height: 34px; border-radius: 10px; object-fit: cover; background: #09101c; padding: 3px; box-shadow: 0 4px 12px rgba(24,37,58,.14); }
        .calm-wordmark strong { font-family: "Space Mono", monospace; font-size: 13px; letter-spacing: .13em; }
        .calm-wordmark strong span { color: var(--calm-coral); }
        .calm-nav-links { display: flex; align-items: center; gap: 4px; margin-left: auto; }
        .calm-nav-links button, .calm-settings-button {
          border: 0; border-radius: 10px; padding: 9px 12px; color: #64748b; background: transparent;
          font: 700 12px "DM Sans", sans-serif; cursor: pointer; transition: transform .2s ease, background-color .2s ease, color .2s ease;
        }
        .calm-nav-links button:hover, .calm-nav-links button:focus-visible, .calm-settings-button:hover, .calm-settings-button:focus-visible { color: var(--calm-ink); background: #eaf0f6; outline: none; transform: translateY(-1px); }
        .calm-nav-links button.is-active { color: var(--calm-blue); background: var(--calm-blue-soft); }
        .calm-settings-button { display: inline-flex; align-items: center; gap: 7px; margin-left: 2px; }
        .calm-menu-button { display: none; margin-left: auto; border: 1px solid var(--calm-line); border-radius: 10px; padding: 9px 11px; color: var(--calm-ink); background: rgba(255,255,255,.68); cursor: pointer; }
        .calm-main { padding: 44px 0 26px; }
        .calm-kicker { display: flex; align-items: center; gap: 8px; color: var(--calm-blue); font: 700 11px "Space Mono", monospace; letter-spacing: .11em; text-transform: uppercase; }
        .calm-kicker::before { content: ""; width: 22px; height: 1px; background: var(--calm-blue); }
        .calm-hero-head { display: flex; align-items: end; justify-content: space-between; gap: 24px; margin: 12px 0 26px; }
        .calm-hero-head h1 { max-width: 700px; margin: 0; font-family: "Bricolage Grotesque", sans-serif; font-size: clamp(2.3rem, 5vw, 4.6rem); line-height: .97; letter-spacing: -.065em; font-weight: 600; }
        .calm-hero-head h1 em { color: var(--calm-blue); font-style: normal; }
        .calm-hero-copy { max-width: 225px; margin: 0 0 3px; color: var(--calm-muted); font-size: 13px; line-height: 1.55; }
        .calm-featured { display: grid; grid-template-columns: 1.38fr 1fr; gap: 14px; }
        .calm-featured-main { position: relative; min-height: 306px; overflow: hidden; border-radius: 23px; background: #d9eef8; box-shadow: 0 14px 38px rgba(39, 68, 100, .10); }
        .calm-featured-main img { width: 100%; height: 100%; min-height: 306px; display: block; object-fit: cover; transition: transform .55s cubic-bezier(.2,.7,.2,1), filter .35s ease; }
        .calm-featured-main:hover img { transform: scale(1.035); filter: saturate(1.08); }
        .calm-featured-main::after { content: ""; position: absolute; inset: 38% 0 0; background: linear-gradient(180deg, transparent, rgba(20,33,52,.78)); pointer-events: none; }
        .calm-featured-content { position: absolute; z-index: 1; inset: auto 24px 21px; display: flex; align-items: end; justify-content: space-between; gap: 20px; color: white; }
        .calm-featured-content h2 { margin: 7px 0 4px; font-family: "Bricolage Grotesque", sans-serif; font-size: 31px; letter-spacing: -.04em; }
        .calm-featured-content p { margin: 0; color: rgba(255,255,255,.77); font-size: 12px; }
        .calm-featured-pill { width: fit-content; border: 1px solid rgba(255,255,255,.28); border-radius: 99px; padding: 5px 9px; color: rgba(255,255,255,.82); background: rgba(16,30,49,.22); font: 700 9px "Space Mono", monospace; letter-spacing: .04em; text-transform: uppercase; }
        .calm-featured-play { flex: 0 0 auto; display: inline-flex; align-items: center; gap: 8px; border: 0; border-radius: 99px; padding: 12px 16px; color: var(--calm-ink); background: #fff; font: 800 12px "DM Sans", sans-serif; cursor: pointer; box-shadow: 0 8px 18px rgba(11, 23, 38, .16); transition: transform .2s ease, box-shadow .2s ease; }
        .calm-featured-play:hover, .calm-featured-play:focus-visible { transform: translateY(-2px); box-shadow: 0 11px 24px rgba(11, 23, 38, .24); outline: none; }
        .calm-featured-side { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .calm-mini-card { position: relative; min-height: 146px; overflow: hidden; border: 1px solid rgba(220,229,238,.95); border-radius: 19px; background: var(--calm-panel); box-shadow: 0 10px 24px rgba(39, 68, 100, .06); transition: transform .25s ease, box-shadow .25s ease; }
        .calm-mini-card:hover { transform: translateY(-3px); box-shadow: 0 15px 28px rgba(39, 68, 100, .12); }
        .calm-mini-card img { display: block; width: 100%; height: 108px; object-fit: cover; }
        .calm-mini-card span { display: block; overflow: hidden; padding: 9px 11px; text-overflow: ellipsis; white-space: nowrap; font-size: 11px; font-weight: 800; }
        .calm-mini-card button { position: absolute; top: 80px; right: 8px; }
        .calm-play-button { display: inline-flex; align-items: center; gap: 7px; border: 0; border-radius: 99px; padding: 10px 13px; color: white; background: var(--calm-blue); font: 800 11px "DM Sans", sans-serif; cursor: pointer; box-shadow: 0 6px 15px rgba(56,103,220,.23); transition: transform .2s ease, background-color .2s ease; }
        .calm-play-button:hover, .calm-play-button:focus-visible { background: #274fbd; transform: translateY(-2px); outline: none; }
        .calm-play-button--quiet { width: 34px; height: 34px; justify-content: center; padding: 0; border: 2px solid white; color: var(--calm-ink); background: white; box-shadow: 0 5px 13px rgba(24,37,58,.18); }
        .calm-library { margin-top: 50px; }
        .calm-library-top { display: flex; align-items: end; justify-content: space-between; gap: 24px; padding-bottom: 15px; border-bottom: 1px solid var(--calm-line); }
        .calm-section-label { margin: 0 0 5px; color: var(--calm-blue); font: 700 10px "Space Mono", monospace; letter-spacing: .13em; text-transform: uppercase; }
        .calm-library h2 { margin: 0; font-family: "Bricolage Grotesque", sans-serif; font-size: 28px; letter-spacing: -.04em; }
        .calm-library-meta { display: flex; align-items: center; gap: 8px; color: var(--calm-muted); font-size: 12px; }
        .calm-search { display: flex; align-items: center; width: min(300px, 100%); border: 1px solid var(--calm-line); border-radius: 12px; padding: 0 12px; background: #fff; box-shadow: 0 5px 16px rgba(39,68,100,.05); transition: border-color .2s ease, box-shadow .2s ease; }
        .calm-search:focus-within { border-color: #9db5ef; box-shadow: 0 0 0 4px rgba(56,103,220,.09); }
        .calm-search svg { flex: 0 0 auto; color: #8ca0b7; }
        .calm-search input { width: 100%; min-width: 0; border: 0; outline: 0; padding: 12px 9px; color: var(--calm-ink); background: transparent; font: 600 12px "DM Sans", sans-serif; }
        .calm-search input::placeholder { color: #9aaabd; }
        .calm-search button { display: grid; place-items: center; border: 0; padding: 3px; color: #8ca0b7; background: transparent; cursor: pointer; }
        .calm-filter-row { display: flex; align-items: center; gap: 7px; overflow-x: auto; margin: 17px 0 18px; padding-bottom: 2px; scrollbar-width: none; }
        .calm-filter-row::-webkit-scrollbar { display: none; }
        .calm-filter { display: inline-flex; align-items: center; gap: 7px; flex: 0 0 auto; border: 1px solid transparent; border-radius: 99px; padding: 8px 11px; color: #7b8b9f; background: transparent; font: 700 11px "DM Sans", sans-serif; cursor: pointer; transition: color .2s ease, background-color .2s ease, border-color .2s ease; }
        .calm-filter:hover { color: var(--calm-ink); background: #edf2f7; }
        .calm-filter.is-active { border-color: #cbd8fb; color: var(--calm-blue); background: var(--calm-blue-soft); }
        .calm-filter-count { color: #a5b2c0; font: 700 10px "Space Mono", monospace; }
        .calm-game-grid { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 14px; }
        .calm-game-card { position: relative; min-width: 0; border: 1px solid var(--calm-line); border-radius: 15px; padding: 6px 6px 9px; background: rgba(255,255,255,.78); box-shadow: 0 7px 18px rgba(39,68,100,.045); transition: transform .23s ease, border-color .23s ease, box-shadow .23s ease; }
        .calm-game-card:hover, .calm-game-card:focus-within { border-color: #b8c9ed; box-shadow: 0 12px 25px rgba(39,68,100,.12); transform: translateY(-3px); }
        .calm-game-art { position: relative; overflow: hidden; aspect-ratio: 1; border-radius: 11px; background: #e8eef3; }
        .calm-game-art img { width: 100%; height: 100%; display: block; object-fit: cover; transition: transform .35s ease, filter .35s ease; }
        .calm-game-card:hover .calm-game-art img { transform: scale(1.06); filter: saturate(1.08); }
        .calm-game-hover { position: absolute; inset: 0; display: grid; place-items: center; opacity: 0; background: rgba(24,37,58,.25); transition: opacity .2s ease; }
        .calm-game-card:hover .calm-game-hover, .calm-game-card:focus-within .calm-game-hover { opacity: 1; }
        .calm-favorite { position: absolute; z-index: 1; top: 9px; right: 9px; display: grid; place-items: center; width: 26px; height: 26px; border: 0; border-radius: 50%; color: white; background: rgba(24,37,58,.38); cursor: pointer; transition: transform .2s ease, background-color .2s ease; }
        .calm-favorite:hover, .calm-favorite:focus-visible { transform: scale(1.08); background: rgba(24,37,58,.66); outline: none; }
        .calm-favorite.is-loved { color: #e47b62; background: white; }
        .calm-game-name { display: block; overflow: hidden; padding: 8px 3px 0; text-overflow: ellipsis; white-space: nowrap; font-size: 11px; font-weight: 800; }
        .calm-game-type { display: block; padding: 2px 3px 0; color: #9aaabd; font: 9px "Space Mono", monospace; text-transform: uppercase; letter-spacing: .04em; }
        .calm-empty { display: grid; place-items: center; min-height: 180px; grid-column: 1 / -1; border: 1px dashed #c4d1dd; border-radius: 17px; color: var(--calm-muted); background: rgba(255,255,255,.5); text-align: center; }
        .calm-empty strong { display: block; margin-bottom: 5px; color: var(--calm-ink); font-family: "Bricolage Grotesque", sans-serif; font-size: 20px; }
        .calm-settings-panel { position: fixed; z-index: 12; top: 82px; right: max(20px, calc((100vw - 1160px) / 2)); width: 252px; border: 1px solid var(--calm-line); border-radius: 17px; padding: 17px; background: rgba(255,255,255,.96); box-shadow: 0 18px 44px rgba(39,68,100,.18); animation: calm-rise .22s ease both; }
        .calm-settings-panel h3 { margin: 0 0 13px; font: 700 14px "Bricolage Grotesque", sans-serif; }
        .calm-setting-line { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 10px 0; border-top: 1px solid #edf1f5; color: #718096; font-size: 11px; }
        .calm-setting-line strong { color: var(--calm-ink); font-size: 11px; }
        .calm-toggle { width: 31px; height: 19px; border: 0; border-radius: 99px; padding: 3px; background: #ced8e4; cursor: pointer; }
        .calm-toggle::after { content: ""; display: block; width: 13px; height: 13px; border-radius: 50%; background: white; transition: transform .2s ease; }
        .calm-toggle.is-on { background: var(--calm-blue); }
        .calm-toggle.is-on::after { transform: translateX(12px); }
        .calm-player { position: fixed; z-index: 11; right: 0; bottom: 0; left: 0; border-top: 1px solid #d8e2eb; background: rgba(255,255,255,.93); box-shadow: 0 -8px 28px rgba(39,68,100,.08); backdrop-filter: blur(18px); }
        .calm-player-inner { display: grid; grid-template-columns: 1.3fr auto 1.3fr; align-items: center; gap: 24px; min-height: 76px; }
        .calm-track { display: flex; align-items: center; gap: 10px; min-width: 0; }
        .calm-track-art { width: 42px; height: 42px; border-radius: 10px; object-fit: cover; opacity: .75; background: #e8eef3; }
        .calm-track-meta { min-width: 0; }
        .calm-track-meta strong, .calm-track-meta span { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .calm-track-meta strong { font-size: 12px; }
        .calm-track-meta span { margin-top: 2px; color: #8c9bad; font-size: 10px; }
        .calm-player-controls { display: flex; align-items: center; gap: 12px; }
        .calm-player-controls button { display: grid; place-items: center; width: 30px; height: 30px; border: 0; border-radius: 50%; color: #63748a; background: transparent; cursor: pointer; }
        .calm-player-controls button:hover, .calm-player-controls button:focus-visible { color: var(--calm-ink); background: #edf2f7; outline: none; }
        .calm-player-controls .calm-player-main { width: 38px; height: 38px; color: white; background: var(--calm-blue); box-shadow: 0 5px 13px rgba(56,103,220,.22); }
        .calm-player-progress { display: flex; align-items: center; justify-content: end; gap: 9px; color: #8493a5; font: 10px "Space Mono", monospace; }
        .calm-range { accent-color: var(--calm-blue); width: 100px; height: 3px; cursor: pointer; }
        .calm-volume { display: flex; align-items: center; gap: 7px; }
        @keyframes calm-rise { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
        @media (max-width: 860px) {
          .calm-shell { width: min(100% - 28px, 680px); }
          .calm-nav-links { display: none; position: absolute; top: 62px; right: 14px; left: 14px; flex-direction: column; align-items: stretch; gap: 3px; border: 1px solid var(--calm-line); border-radius: 14px; padding: 7px; background: rgba(255,255,255,.98); box-shadow: 0 18px 40px rgba(39,68,100,.14); }
          .calm-nav-links.is-open { display: flex; }
          .calm-nav-links button { text-align: left; }
          .calm-menu-button { display: inline-flex; align-items: center; gap: 7px; }
          .calm-hero-head { display: block; }
          .calm-hero-copy { margin-top: 14px; }
          .calm-featured { grid-template-columns: 1fr; }
          .calm-featured-main { min-height: 300px; }
          .calm-featured-side { grid-template-columns: repeat(4, 1fr); }
          .calm-mini-card { min-height: 116px; }
          .calm-mini-card img { height: 82px; }
          .calm-mini-card button { top: 53px; }
          .calm-game-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
          .calm-player-inner { grid-template-columns: 1fr auto; gap: 10px; }
          .calm-player-progress { grid-column: 1 / -1; grid-row: 2; justify-content: stretch; padding-bottom: 9px; }
          .calm-player { padding-bottom: env(safe-area-inset-bottom); }
        }
        @media (max-width: 520px) {
          .calm-page { padding-bottom: 124px; }
          .calm-main { padding-top: 30px; }
          .calm-shell { width: min(100% - 24px, 440px); }
          .calm-nav { height: 62px; }
          .calm-wordmark strong { font-size: 11px; }
          .calm-hero-head h1 { font-size: 2.55rem; }
          .calm-featured-main, .calm-featured-main img { min-height: 250px; }
          .calm-featured-content { inset: auto 16px 15px; }
          .calm-featured-content h2 { font-size: 25px; }
          .calm-featured-play { padding: 10px 12px; }
          .calm-featured-side { display: flex; overflow-x: auto; gap: 9px; padding-bottom: 3px; }
          .calm-mini-card { flex: 0 0 132px; }
          .calm-library { margin-top: 37px; }
          .calm-library-top { display: block; }
          .calm-library-meta { margin-top: 10px; }
          .calm-search { width: 100%; margin-top: 16px; }
          .calm-game-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
          .calm-player-inner { min-height: 82px; }
          .calm-range { width: auto; flex: 1; }
          .calm-volume { display: none; }
        }
      `}),a.jsx("nav",{className:"calm-nav","aria-label":"Aerodynamix navigation",children:a.jsxs("div",{className:"calm-shell calm-nav-inner",children:[a.jsxs("button",{className:"calm-wordmark",type:"button",onClick:()=>window.scrollTo({top:0,behavior:"smooth"}),"aria-label":"Return to Aerodynamix home",children:[a.jsx("img",{src:`${m}logo.gif`,alt:""}),a.jsxs("strong",{children:[a.jsx("span",{children:"A"}),"ERODYNAMIX"]})]}),a.jsxs("div",{className:`calm-nav-links ${g?"is-open":""}`,children:[["Games","Apps","Media Player","Connect"].map((e,r)=>a.jsx("button",{type:"button",className:r===0?"is-active":"",onClick:()=>b(!1),children:e},e)),a.jsxs("button",{type:"button",onClick:()=>{P(e=>!e),b(!1)},children:[a.jsx(T,{size:13})," Settings"]})]}),a.jsxs("button",{className:"calm-menu-button",type:"button",onClick:()=>b(e=>!e),"aria-expanded":g,"aria-label":"Toggle navigation menu",children:[g?a.jsx(y,{size:15}):a.jsx(H,{size:15})," ",g?"Close":"Menu"]})]})}),M&&a.jsxs("section",{className:"calm-settings-panel","aria-label":"Settings panel",children:[a.jsx("h3",{children:"Small preferences"}),a.jsxs("div",{className:"calm-setting-line",children:[a.jsx("span",{children:"Reduce motion"}),a.jsx("button",{className:`calm-toggle ${w?"is-on":""}`,type:"button","aria-label":"Toggle reduce motion","aria-pressed":w,onClick:()=>G(e=>!e)})]}),a.jsxs("div",{className:"calm-setting-line",children:[a.jsx("span",{children:"Show favorites first"}),a.jsx("button",{className:`calm-toggle ${h?"is-on":""}`,type:"button","aria-label":"Toggle favorites first","aria-pressed":h,onClick:()=>R(e=>!e),children:h&&a.jsx(I,{size:11,color:"white"})})]}),a.jsxs("div",{className:"calm-setting-line",children:[a.jsx("span",{children:"Library layout"}),a.jsx("strong",{children:"Grid"})]})]}),a.jsxs("div",{className:"calm-shell calm-main",children:[a.jsxs("div",{className:"calm-kicker",children:[a.jsx(O,{size:13})," A quieter way to play"]}),a.jsxs("header",{className:"calm-hero-head",children:[a.jsxs("h1",{children:["Good games,",a.jsx("br",{}),a.jsx("em",{children:"no searching required."})]}),a.jsx("p",{className:"calm-hero-copy",children:"A private-feeling corner of the internet for the games you already love — and the ones you are about to."})]}),a.jsx("section",{"aria-labelledby":"spotlight-title",children:a.jsxs("div",{className:"calm-featured",children:[a.jsxs("article",{className:"calm-featured-main",children:[a.jsx("img",{src:`${m}${c[0].file}`,alt:c[0].name}),a.jsxs("div",{className:"calm-featured-content",children:[a.jsxs("div",{children:[a.jsxs("span",{className:"calm-featured-pill",children:["Featured · ",c[0].tag]}),a.jsx("h2",{id:"spotlight-title",children:c[0].name}),a.jsx("p",{children:c[0].note})]}),a.jsxs("button",{className:"calm-featured-play",type:"button",onClick:()=>x(c[0].name),children:[a.jsx(u,{size:15,fill:"currentColor"})," Play"]})]})]}),a.jsx("div",{className:"calm-featured-side","aria-label":"More featured games",children:c.slice(1).map(e=>a.jsxs("article",{className:"calm-mini-card",children:[a.jsx("img",{src:`${m}${e.file}`,alt:e.name}),a.jsx("button",{type:"button",className:"calm-play-button calm-play-button--quiet",onClick:()=>x(e.name),"aria-label":`Play ${e.name}`,children:a.jsx(u,{size:14,fill:"currentColor"})}),a.jsx("span",{children:e.name})]},e.name))})]})}),a.jsxs("section",{className:"calm-library","aria-labelledby":"library-title",children:[a.jsxs("div",{className:"calm-library-top",children:[a.jsxs("div",{children:[a.jsx("p",{className:"calm-section-label",children:"The full collection"}),a.jsx("h2",{id:"library-title",children:"Find your next game"}),a.jsxs("div",{className:"calm-library-meta",children:[a.jsx(U,{size:13})," ",f.length," titles ready to play"]})]}),a.jsxs("label",{className:"calm-search",children:[a.jsx(z,{size:16}),a.jsx("input",{value:p,onChange:e=>d(e.target.value),type:"search",placeholder:"Search the library","aria-label":"Search games"}),p&&a.jsx("button",{type:"button",onClick:()=>d(""),"aria-label":"Clear search",children:a.jsx(y,{size:14})})]})]}),a.jsxs("div",{className:"calm-filter-row","aria-label":"Filter games",children:[a.jsx(Y,{size:14,color:"#9aaabd","aria-hidden":"true"}),K.map(e=>a.jsxs("button",{type:"button",className:`calm-filter ${l===e?"is-active":""}`,onClick:()=>C(e),children:[e,e==="All games"&&a.jsx("span",{className:"calm-filter-count",children:o.length})]},e)),a.jsxs("span",{style:{marginLeft:"auto",display:"inline-flex",alignItems:"center",gap:6,color:"#9aaabd",fontSize:10,whiteSpace:"nowrap"},children:[a.jsx(X,{size:13})," Curated grid"]})]}),a.jsxs("div",{className:"calm-game-grid",children:[f.map(([e,r],t)=>{const s=F.includes(r);return a.jsxs("article",{className:"calm-game-card",children:[a.jsxs("div",{className:"calm-game-art",children:[a.jsx("img",{src:`${m}${e}`,alt:r,loading:t<12?"eager":"lazy"}),a.jsx("button",{className:`calm-favorite ${s?"is-loved":""}`,type:"button",onClick:()=>D(r),"aria-label":`${s?"Remove":"Add"} ${r} ${s?"from":"to"} favorites`,"aria-pressed":s,children:a.jsx(L,{size:13,fill:s?"currentColor":"none"})}),a.jsx("div",{className:"calm-game-hover",children:a.jsx(Z,{label:`Play ${r}`,onClick:()=>x(r),quiet:!0})})]}),a.jsx("span",{className:"calm-game-name",title:r,children:r}),a.jsx("span",{className:"calm-game-type",children:t%3===0?"Arcade":t%3===1?"Classic":"Browser game"})]},e)}),f.length===0&&a.jsx("div",{className:"calm-empty",children:a.jsxs("div",{children:[a.jsx(z,{size:20,color:"#9aaabd"}),a.jsx("strong",{children:"No games in that corner."}),a.jsx("span",{children:"Try a different title or clear the filter."})]})})]})]})]}),a.jsx("aside",{className:"calm-player","aria-label":"Persistent media player",children:a.jsxs("div",{className:"calm-shell calm-player-inner",children:[a.jsxs("div",{className:"calm-track",children:[a.jsx("img",{className:"calm-track-art",src:`${m}${n?o.find(([,e])=>e===n)?.[0]??"logo.gif":"logo.gif"}`,alt:""}),a.jsxs("div",{className:"calm-track-meta",children:[a.jsx("strong",{children:n??"Nothing queued"}),a.jsx("span",{children:n?"Game session":"Media Player · ready when you are"})]})]}),a.jsxs("div",{className:"calm-player-controls",children:[a.jsx("button",{type:"button","aria-label":"Previous track",onClick:()=>N("previous"),children:a.jsx(_,{size:16})}),a.jsx("button",{className:"calm-player-main",type:"button","aria-label":k?"Resume media":"Pause media",onClick:()=>j(e=>!e),children:k?a.jsx(u,{size:15,fill:"currentColor"}):a.jsx(V,{size:15,fill:"currentColor"})}),a.jsx("button",{type:"button","aria-label":"Next track",onClick:()=>N("next"),children:a.jsx(W,{size:16})})]}),a.jsxs("div",{className:"calm-player-progress",children:[a.jsxs("span",{children:["0:00"," / ",n?"—":"0:00"]}),a.jsx("input",{className:"calm-range",type:"range",min:"0",max:"100",defaultValue:"14","aria-label":"Track progress"}),a.jsxs("div",{className:"calm-volume",children:[a.jsx(q,{size:14}),a.jsx("input",{className:"calm-range",type:"range",min:"0",max:"100",value:A,onChange:e=>B(Number(e.target.value)),"aria-label":"Volume"})]}),a.jsx("button",{type:"button","aria-label":"Close media player",onClick:()=>v(null),style:{display:"grid",placeItems:"center",border:0,color:"#8493a5",background:"transparent",cursor:"pointer"},children:a.jsx(y,{size:14})})]})]})})]})}export{pa as CalmLibrary};
