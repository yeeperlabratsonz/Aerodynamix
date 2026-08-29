import{r,j as e}from"./index-DDtURTn1.js";import{S as q}from"./settings-2-Dh2soIX1.js";import{M as H,H as L}from"./menu-CVMIhgIs.js";import{P as x,S as $,V as G,X as O}from"./x-D3nRQYv6.js";import{S as U}from"./sliders-horizontal-slbVQ7gm.js";import{C as V}from"./chevron-down-OOkHC08D.js";import{C as W}from"./check-DWkeSrKW.js";import{C as X}from"./chevron-left-B8CU46lr.js";import{C as _}from"./chevron-right-CVRZrJpt.js";const m="/__mockup/images/aerodynamix/",d=[["run-3.jpg","Run 3","arcade","Runner","#9ad5d0"],["drive-mad.jpg","Drive Mad","arcade","Driving","#f0b26f"],["retro-bowl.jpg","Retro Bowl","classic","Sports","#c3a5e7"],["slope.jpg","Slope","arcade","Reflex","#9cb7ed"],["mc.png","Minecraft","story","Sandbox","#b7d39c"],["supersmashflash.jpg","Super Smash Flash","arcade","Fighter","#ee9aa0"],["papaspizzeria.png","Papa's Pizzeria","sim","Time mgmt.","#f2bf80"],["papasfreezeria.png","Papa's Freezeria","sim","Time mgmt.","#9ed7db"],["papas-pancakeria.png","Papa's Pancakeria","sim","Time mgmt.","#e0b1a5"],["papas-bakeria.png","Papa's Bakeria","sim","Time mgmt.","#e4c48e"],["meat-boy.png","Meat Boy","arcade","Platformer","#e4928f"],["newgrounds-rumble.png","Newgrounds Rumble","arcade","Fighter","#e3a8d0"],["we-become-what-we-behold.png","We Become What We Behold","story","Interactive","#c8d9d0"],["bad-time-simulator.png","Bad Time Simulator","classic","Challenge","#b6a9dd"],["deltarune.png","Deltarune","story","RPG","#8caee4"],["adventure-capitalist.png","Adventure Capitalist","sim","Idle","#d9c88d"],["fridaynightfunkin.png","Friday Night Funkin'","arcade","Rhythm","#e6a2a6"],["run-2.png","Run 2","arcade","Runner","#a6c8dc"],["picoschool.png","Pico's School","story","Adventure","#dfb09f"],["worldshardestgame.png","World's Hardest Game","classic","Challenge","#a4b3db"],["sandboxels.png","Sandboxels","sim","Physics","#c9d899"],["alien-hominid.png","Alien Hominid","arcade","Action","#e39c7c"],["subway-surfers-sf.jpg","Subway Surfers San Francisco","arcade","Runner","#9fc9b9"],["hobo-1.png","Hobo 1","classic","Brawler","#c6ad93"],["hobo-2.png","Hobo 2","classic","Brawler","#d6a2a1"],["hobo-3.png","Hobo 3","classic","Brawler","#a7b9a7"],["hobo-4.png","Hobo 4","classic","Brawler","#bba9d2"],["hobo-5.png","Hobo 5","classic","Brawler","#d4b18e"],["hobo-6.png","Hobo 6","classic","Brawler","#a6bdd1"],["hobo-7.png","Hobo 7","classic","Brawler","#d9a2a0"],["gladihoppers.jpg","Gladihoppers","arcade","Action","#ccb07c"],["fruit-ninja.png","Fruit Ninja","arcade","Arcade","#e19a85"],["binding-of-isaac.png","Binding of Isaac","story","Roguelike","#aaa0c8"],["crossy-road.png","Crossy Road","arcade","Arcade","#a7d2c2"],["cookie-clicker.png","Cookie Clicker","sim","Idle","#d1ab81"],["duck-life.png","Duck Life","sim","Adventure","#d3be89"],["geometry-dash-lite.jpg","Geometry Dash Lite","arcade","Rhythm","#9fafd9"],["doom.png","Doom","classic","Shooter","#d98b7e"],["doki-doki-literature-club.jpg","Doki Doki Literature Club","story","Visual novel","#db9fb3"],["baldis-basics-classic-remastered.png","Baldi's Basics Classic Remastered","classic","Horror","#cbb67f"],["stickmin-breaking-bank.jpg","Breaking the Bank","story","Stickman","#aebdcb"],["stickmin-escaping-prison.avif","Escaping the Prison","story","Stickman","#c6b8a0"],["stickmin-stealing-diamond.avif","Stealing the Diamond","story","Stickman","#c5a7b3"],["stickmin-infiltrating-airship.avif","Infiltrating the Airship","story","Stickman","#a8c5bb"],["stickmin-fleeing-complex.avif","Fleeing the Complex","story","Stickman","#b7abd1"],["greatest-game-square.svg","The Greatest Game of All Time","classic","Special","#e2bb72"],["nubbys-number-factory.jpg","Nubby's Number Factory","sim","Puzzle","#a8c7c0"]].map(([o,n,t,p,l])=>({file:o,name:n,kind:t,tag:p,color:l})),z=d.slice(0,4),K=[{id:"all",label:"All games"},{id:"favorites",label:"Saved"},{id:"arcade",label:"Arcade"},{id:"story",label:"Story"},{id:"classic",label:"Classics"}],Q=new Set(["Run 3","Retro Bowl","Papa's Pizzeria","Deltarune"]);function D({game:o,priority:n=!1}){return e.jsx("img",{className:"sg-game-image",src:`${m}${o.file}`,alt:o.name,loading:n?"eager":"lazy"})}function ne(){const[o,n]=r.useState(""),[t,p]=r.useState("all"),[l,A]=r.useState(Q),[v,j]=r.useState(!1),[k,R]=r.useState(!1),[w,b]=r.useState("Games"),[g,P]=r.useState(null),[u,N]=r.useState(!1),[S,h]=r.useState(!0),[E,I]=r.useState(28),[T,B]=r.useState(72),f=r.useMemo(()=>{const a=o.toLowerCase().trim();return d.filter(s=>{const i=!a||`${s.name} ${s.tag}`.toLowerCase().includes(a),y=t==="all"||t==="favorites"||s.kind===t,Y=t!=="favorites"||l.has(s.name);return i&&y&&Y})},[l,t,o]),F=a=>{A(s=>{const i=new Set(s);return i.has(a)?i.delete(a):i.add(a),i})},c=a=>{P(a),N(!0),h(!0)},C=a=>{const i=((g?d.findIndex(y=>y.name===g.name):0)+a+d.length)%d.length;c(d[i])},M=["Games","Apps","Media Player","Connect"];return e.jsxs("div",{className:"sg-shell",children:[e.jsx("style",{children:`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .sg-shell {
          --ink: #182330;
          --ink-soft: #526171;
          --paper: #edf1f2;
          --panel: #f6f8f8;
          --line: #d5dde0;
          --blue: #245d80;
          --blue-deep: #173e59;
          --mint: #a8d6c6;
          --yellow: #e7c873;
          min-height: 100vh;
          padding-bottom: ${S?"82px":"28px"};
          color: var(--ink);
          background:
            linear-gradient(rgba(31, 58, 74, .035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(31, 58, 74, .035) 1px, transparent 1px),
            var(--paper);
          background-size: 24px 24px;
          font-family: "Plus Jakarta Sans", sans-serif;
          overflow-x: hidden;
        }
        .sg-shell *, .sg-shell *::before, .sg-shell *::after { box-sizing: border-box; }
        .sg-topbar {
          position: sticky; top: 0; z-index: 20;
          display: flex; align-items: center; gap: 22px;
          min-height: 66px; padding: 10px 28px;
          border-bottom: 1px solid rgba(213, 221, 224, .92);
          background: rgba(237, 241, 242, .9);
          backdrop-filter: blur(18px);
        }
        .sg-brand-link { display: flex; align-items: center; gap: 11px; color: var(--ink); text-decoration: none; flex: 0 0 auto; }
        .sg-logo { width: 38px; height: 38px; padding: 3px; object-fit: contain; border-radius: 11px; background: #08121a; }
        .sg-brand { font-size: 15px; font-weight: 800; letter-spacing: .13em; line-height: 1; }
        .sg-brand small { display: block; margin-top: 5px; color: #788792; font: 500 8px "DM Mono", monospace; letter-spacing: .11em; }
        .sg-nav { display: flex; align-items: center; gap: 3px; margin: 0 auto; }
        .sg-nav button, .sg-settings, .sg-menu {
          display: inline-flex; align-items: center; justify-content: center; gap: 7px;
          border: 1px solid transparent; border-radius: 7px; padding: 9px 12px;
          color: var(--ink-soft); background: transparent; font: 600 11px "DM Mono", monospace;
          cursor: pointer; transition: background .2s ease, color .2s ease, border-color .2s ease, transform .2s ease;
        }
        .sg-nav button:hover, .sg-settings:hover, .sg-menu:hover { color: var(--blue-deep); background: rgba(255,255,255,.64); border-color: var(--line); }
        .sg-nav button.active { color: var(--blue-deep); background: #d5e8e4; border-color: #bddbd3; }
        .sg-settings { color: var(--blue-deep); border-color: #b8cbd1; background: rgba(255,255,255,.48); }
        .sg-menu { display: none; }
        .sg-menu-panel { display: none; }
        .sg-main { width: min(1180px, calc(100% - 56px)); margin: 0 auto; }
        .sg-utility { display: flex; justify-content: space-between; align-items: center; padding: 18px 0 12px; color: #72808a; font: 500 10px "DM Mono", monospace; letter-spacing: .04em; }
        .sg-utility strong { color: var(--blue); font-weight: 500; }
        .sg-status { display: inline-flex; align-items: center; gap: 7px; }
        .sg-status::before { content: ""; width: 6px; height: 6px; border-radius: 50%; background: #71ad88; box-shadow: 0 0 0 3px rgba(113,173,136,.15); }
        .sg-hero { display: grid; grid-template-columns: minmax(0, 1.4fr) minmax(290px, .8fr); gap: 18px; align-items: stretch; }
        .sg-hero-copy, .sg-hero-queue { min-height: 238px; border: 1px solid var(--line); border-radius: 12px; background: rgba(246,248,248,.88); }
        .sg-hero-copy { position: relative; display: flex; flex-direction: column; justify-content: space-between; overflow: hidden; padding: 26px 28px; }
        .sg-hero-copy::after { content: ""; position: absolute; right: -40px; bottom: -70px; width: 260px; height: 190px; border: 1px solid rgba(36,93,128,.2); border-radius: 50%; transform: rotate(-18deg); box-shadow: 0 0 0 14px rgba(36,93,128,.035), 0 0 0 28px rgba(36,93,128,.035); pointer-events: none; }
        .sg-kicker { display: flex; align-items: center; gap: 9px; color: var(--blue); font: 500 10px "DM Mono", monospace; letter-spacing: .1em; text-transform: uppercase; }
        .sg-kicker span { width: 22px; height: 1px; background: var(--blue); }
        .sg-hero h1 { max-width: 570px; margin: 18px 0 0; font-size: clamp(27px, 4vw, 45px); line-height: 1.05; letter-spacing: -.055em; font-weight: 800; }
        .sg-hero h1 em { color: var(--blue); font-style: normal; }
        .sg-hero-footer { display: flex; align-items: end; justify-content: space-between; gap: 20px; }
        .sg-hero-footer p { max-width: 390px; margin: 22px 0 0; color: var(--ink-soft); font-size: 12px; line-height: 1.55; }
        .sg-hero-code { color: #81909a; font: 500 9px "DM Mono", monospace; line-height: 1.7; text-align: right; }
        .sg-hero-code b { color: var(--blue); font-weight: 500; }
        .sg-hero-queue { padding: 17px; background: var(--blue-deep); color: #e8f0f0; }
        .sg-queue-head { display: flex; justify-content: space-between; align-items: center; padding-bottom: 14px; border-bottom: 1px solid rgba(215,236,232,.18); color: #b7cbd0; font: 500 10px "DM Mono", monospace; letter-spacing: .06em; text-transform: uppercase; }
        .sg-queue-head b { color: var(--mint); font-weight: 500; }
        .sg-queue-list { display: flex; flex-direction: column; gap: 3px; padding-top: 10px; }
        .sg-queue-item { display: grid; grid-template-columns: 40px 1fr auto; gap: 10px; align-items: center; padding: 7px 6px; border-radius: 7px; cursor: pointer; transition: background .2s ease, transform .2s ease; }
        .sg-queue-item:hover { background: rgba(255,255,255,.08); transform: translateX(2px); }
        .sg-queue-item img { width: 40px; height: 40px; border-radius: 5px; object-fit: cover; }
        .sg-queue-item strong { display: block; overflow: hidden; color: #f1f5f3; font-size: 11px; font-weight: 700; text-overflow: ellipsis; white-space: nowrap; }
        .sg-queue-item small { display: block; margin-top: 3px; color: #93aeb2; font: 500 9px "DM Mono", monospace; }
        .sg-play-mark { display: grid; place-items: center; width: 27px; height: 27px; border: 1px solid rgba(168,214,198,.32); border-radius: 50%; color: var(--mint); }
        .sg-play-mark svg { width: 12px; height: 12px; fill: currentColor; margin-left: 1px; }
        .sg-section-bar { display: flex; align-items: center; justify-content: space-between; gap: 15px; margin-top: 28px; padding-bottom: 11px; border-bottom: 1px solid #c4d0d3; }
        .sg-section-title { display: flex; align-items: baseline; gap: 10px; }
        .sg-section-title h2 { margin: 0; color: var(--ink); font-size: 15px; font-weight: 800; letter-spacing: -.02em; }
        .sg-count { color: #80909a; font: 500 10px "DM Mono", monospace; }
        .sg-featured-row { display: grid; grid-template-columns: 1.4fr 1fr 1fr 1fr; gap: 10px; margin-top: 12px; }
        .sg-featured-card { position: relative; min-width: 0; overflow: hidden; border-radius: 9px; border: 1px solid var(--line); background: var(--panel); cursor: pointer; transition: transform .25s ease, border-color .25s ease, box-shadow .25s ease; }
        .sg-featured-card:hover { transform: translateY(-3px); border-color: #9ebcc2; box-shadow: 0 10px 24px rgba(24,35,48,.11); }
        .sg-featured-card:first-child { grid-row: span 2; }
        .sg-featured-card img { display: block; width: 100%; aspect-ratio: 1.65; object-fit: cover; }
        .sg-featured-card:first-child img { aspect-ratio: 1.09; }
        .sg-featured-overlay { position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: end; padding: 13px; background: linear-gradient(transparent 32%, rgba(9,24,33,.83)); }
        .sg-featured-overlay strong { color: #fff; font-size: 13px; font-weight: 800; }
        .sg-featured-overlay small { margin-top: 5px; color: #c6dcda; font: 500 9px "DM Mono", monospace; }
        .sg-featured-card:not(:first-child) .sg-featured-overlay { padding: 9px; }
        .sg-featured-card:not(:first-child) .sg-featured-overlay strong { font-size: 10px; }
        .sg-featured-card:not(:first-child) .sg-featured-overlay small { margin-top: 3px; font-size: 8px; }
        .sg-card-play { position: absolute; top: 9px; right: 9px; display: grid; place-items: center; width: 26px; height: 26px; border: 0; border-radius: 50%; color: var(--ink); background: var(--mint); cursor: pointer; opacity: 0; transform: translateY(-4px); transition: opacity .2s ease, transform .2s ease; }
        .sg-featured-card:hover .sg-card-play, .sg-featured-card:focus-within .sg-card-play { opacity: 1; transform: translateY(0); }
        .sg-card-play svg { width: 12px; height: 12px; fill: currentColor; margin-left: 1px; }
        .sg-library-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-top: 34px; }
        .sg-library-head h2 { margin: 0; font-size: 22px; letter-spacing: -.045em; }
        .sg-library-head h2 span { color: var(--blue); }
        .sg-library-tools { display: flex; align-items: center; gap: 8px; }
        .sg-search { display: flex; align-items: center; gap: 9px; width: min(260px, 34vw); padding: 9px 11px; border: 1px solid #becbd0; border-radius: 7px; background: rgba(255,255,255,.58); transition: border-color .2s ease, background .2s ease; }
        .sg-search:focus-within { border-color: var(--blue); background: #fff; }
        .sg-search svg { flex: 0 0 auto; color: #708390; }
        .sg-search input { width: 100%; min-width: 0; border: 0; outline: 0; color: var(--ink); background: transparent; font: 500 11px "DM Mono", monospace; }
        .sg-search input::placeholder { color: #84939b; }
        .sg-filter-toggle { display: inline-flex; align-items: center; gap: 6px; border: 1px solid #becbd0; border-radius: 7px; padding: 9px 10px; color: var(--blue-deep); background: rgba(255,255,255,.58); font: 500 10px "DM Mono", monospace; cursor: pointer; }
        .sg-filter-toggle:hover { border-color: var(--blue); }
        .sg-filter-row { display: flex; gap: 7px; flex-wrap: wrap; margin-top: 14px; }
        .sg-filter { border: 1px solid #c7d2d5; border-radius: 99px; padding: 7px 11px; color: #667782; background: rgba(255,255,255,.35); font: 500 10px "DM Mono", monospace; cursor: pointer; transition: background .2s ease, color .2s ease, border-color .2s ease; }
        .sg-filter:hover, .sg-filter.active { color: var(--blue-deep); border-color: #9ebdc0; background: #d8eae4; }
        .sg-game-grid { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 11px; margin-top: 14px; }
        .sg-game-card { position: relative; min-width: 0; overflow: hidden; border: 1px solid var(--line); border-radius: 8px; background: rgba(246,248,248,.82); transition: transform .22s ease, box-shadow .22s ease, border-color .22s ease; }
        .sg-game-card:hover { z-index: 1; border-color: #a3bcc0; box-shadow: 0 9px 20px rgba(24,35,48,.12); transform: translateY(-2px); }
        .sg-game-cover { position: relative; overflow: hidden; }
        .sg-game-image { display: block; width: 100%; aspect-ratio: 1.28; object-fit: cover; transition: transform .35s ease, filter .35s ease; }
        .sg-game-card:hover .sg-game-image { transform: scale(1.045); filter: saturate(1.08); }
        .sg-game-action { position: absolute; right: 7px; bottom: 7px; display: grid; place-items: center; width: 27px; height: 27px; border: 0; border-radius: 50%; color: #eff8f4; background: var(--blue-deep); cursor: pointer; opacity: 0; transform: translateY(4px); transition: opacity .2s ease, transform .2s ease, background .2s ease; }
        .sg-game-card:hover .sg-game-action, .sg-game-card:focus-within .sg-game-action { opacity: 1; transform: translateY(0); }
        .sg-game-action:hover { background: var(--blue); }
        .sg-game-action svg { width: 12px; height: 12px; fill: currentColor; margin-left: 1px; }
        .sg-save { position: absolute; top: 7px; right: 7px; display: grid; place-items: center; width: 26px; height: 26px; border: 1px solid rgba(255,255,255,.42); border-radius: 6px; color: #f4f7f3; background: rgba(24,35,48,.48); cursor: pointer; transition: color .2s ease, background .2s ease, transform .2s ease; }
        .sg-save:hover { transform: scale(1.06); background: rgba(24,35,48,.75); }
        .sg-save.saved { color: #f4dc8b; background: rgba(24,35,48,.76); }
        .sg-save svg { width: 13px; height: 13px; fill: currentColor; }
        .sg-game-info { padding: 9px 9px 10px; }
        .sg-game-name { display: block; overflow: hidden; color: var(--ink); font-size: 10px; font-weight: 700; line-height: 1.3; text-overflow: ellipsis; white-space: nowrap; }
        .sg-game-meta { display: flex; justify-content: space-between; gap: 5px; margin-top: 6px; color: #80909a; font: 500 8px "DM Mono", monospace; }
        .sg-game-meta i { display: inline-block; width: 6px; height: 6px; margin-right: 4px; border-radius: 50%; background: var(--tile-color); }
        .sg-empty { grid-column: 1 / -1; padding: 42px 20px; border: 1px dashed #b7c6ca; border-radius: 10px; color: #6e7f88; text-align: center; font: 500 11px "DM Mono", monospace; }
        .sg-empty button { display: block; margin: 12px auto 0; border: 0; color: var(--blue); background: transparent; font: inherit; text-decoration: underline; cursor: pointer; }
        .sg-player { position: fixed; z-index: 30; right: 0; bottom: 0; left: 0; border-top: 1px solid #304e5d; color: #e6f0ed; background: rgba(20,44,59,.98); box-shadow: 0 -8px 26px rgba(24,35,48,.1); }
        .sg-player-inner { display: grid; grid-template-columns: 1.2fr 1fr 1.2fr; align-items: center; gap: 28px; width: min(1180px, calc(100% - 56px)); min-height: 72px; margin: 0 auto; }
        .sg-player-track { display: flex; align-items: center; gap: 11px; min-width: 0; }
        .sg-player-art { width: 42px; height: 42px; border-radius: 5px; object-fit: cover; background: #365869; }
        .sg-player-track strong, .sg-player-track small { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .sg-player-track strong { color: #f0f5f2; font-size: 11px; }
        .sg-player-track small { margin-top: 4px; color: #9eb3b7; font: 500 9px "DM Mono", monospace; }
        .sg-player-controls { display: flex; align-items: center; justify-content: center; gap: 14px; }
        .sg-player button { display: grid; place-items: center; border: 0; color: #b8cdcd; background: transparent; cursor: pointer; transition: color .2s ease, transform .2s ease; }
        .sg-player button:hover { color: #fff; transform: translateY(-1px); }
        .sg-player .sg-main-control { width: 34px; height: 34px; border-radius: 50%; color: var(--blue-deep); background: var(--mint); }
        .sg-main-control svg { width: 15px; height: 15px; fill: currentColor; margin-left: 1px; }
        .sg-player-progress { display: flex; align-items: center; justify-content: flex-end; gap: 9px; color: #aac0c1; font: 500 9px "DM Mono", monospace; }
        .sg-range { height: 3px; accent-color: var(--mint); cursor: pointer; }
        .sg-progress-range { width: min(180px, 20vw); }
        .sg-volume-range { width: 68px; }
        .sg-player-close { margin-left: 3px; }
        .sg-collapsed-player { position: fixed; right: 19px; bottom: 18px; z-index: 30; display: flex; align-items: center; gap: 9px; padding: 9px 12px; border: 1px solid #304e5d; border-radius: 8px; color: #e6f0ed; background: var(--blue-deep); font: 500 10px "DM Mono", monospace; cursor: pointer; box-shadow: 0 8px 22px rgba(24,35,48,.2); }
        .sg-collapsed-player .sg-live-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--mint); }
        @media (max-width: 760px) {
          .sg-topbar { gap: 10px; padding: 9px 15px; }
          .sg-nav { display: none; }
          .sg-settings { margin-left: auto; }
          .sg-menu { display: inline-flex; }
          .sg-menu-panel { position: absolute; top: 60px; right: 15px; left: 15px; display: ${v?"flex":"none"}; flex-direction: column; gap: 3px; padding: 6px; border: 1px solid var(--line); border-radius: 9px; background: rgba(246,248,248,.98); box-shadow: 0 12px 28px rgba(24,35,48,.16); }
          .sg-menu-panel button { padding: 10px; border: 0; border-radius: 6px; color: var(--ink-soft); background: transparent; text-align: left; font: 500 11px "DM Mono", monospace; cursor: pointer; }
          .sg-menu-panel button.active, .sg-menu-panel button:hover { color: var(--blue-deep); background: #d8eae4; }
          .sg-main { width: min(100% - 30px, 560px); }
          .sg-utility { padding-top: 14px; }
          .sg-hero { grid-template-columns: 1fr; }
          .sg-hero-copy { min-height: 240px; padding: 22px; }
          .sg-hero-queue { min-height: auto; }
          .sg-featured-row { display: flex; overflow-x: auto; padding-bottom: 4px; }
          .sg-featured-card, .sg-featured-card:first-child { flex: 0 0 190px; }
          .sg-featured-card img, .sg-featured-card:first-child img { aspect-ratio: 1.1; }
          .sg-library-head { align-items: flex-start; flex-direction: column; gap: 12px; }
          .sg-library-tools, .sg-search { width: 100%; }
          .sg-filter-toggle { flex: 0 0 auto; }
          .sg-search { flex: 1; }
          .sg-game-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 9px; }
          .sg-player-inner { grid-template-columns: 1fr auto; width: min(100% - 30px, 560px); gap: 10px; min-height: 65px; }
          .sg-player-progress { grid-column: 1 / -1; justify-content: stretch; padding-bottom: 8px; }
          .sg-progress-range { flex: 1; width: auto; }
          .sg-volume-range { width: 58px; }
        }
        @media (max-width: 420px) {
          .sg-brand { font-size: 12px; }
          .sg-brand small { font-size: 7px; }
          .sg-settings { padding-inline: 8px; }
          .sg-hero h1 { font-size: 31px; }
          .sg-hero-footer { align-items: flex-start; flex-direction: column; gap: 7px; }
          .sg-hero-code { text-align: left; }
        }
      `}),e.jsxs("header",{className:"sg-topbar",children:[e.jsxs("button",{className:"sg-brand-link",type:"button",onClick:()=>{n(""),p("all")},"aria-label":"Reset library",children:[e.jsx("img",{className:"sg-logo",src:`${m}logo.gif`,alt:"Aerodynamix"}),e.jsxs("span",{className:"sg-brand",children:["AERODYNAMIX",e.jsx("small",{children:"PRIVATE ARCADE / 2005—NOW"})]})]}),e.jsx("nav",{className:"sg-nav","aria-label":"Main navigation",children:M.map(a=>e.jsx("button",{className:w===a?"active":"",type:"button",onClick:()=>b(a),children:a},a))}),e.jsxs("button",{className:"sg-settings",type:"button",onClick:()=>b("Settings"),children:[e.jsx(q,{size:14})," Settings"]}),e.jsxs("button",{className:"sg-menu",type:"button",onClick:()=>j(a=>!a),"aria-expanded":v,children:[e.jsx(H,{size:15})," Menu"]}),e.jsx("div",{className:"sg-menu-panel",children:[...M,"Settings"].map(a=>e.jsx("button",{type:"button",className:w===a?"active":"",onClick:()=>{b(a),j(!1)},children:a},a))})]}),e.jsxs("main",{className:"sg-main",children:[e.jsxs("div",{className:"sg-utility",children:[e.jsxs("span",{children:["INDEX / ",e.jsx("strong",{children:"GAMES"})]}),e.jsxs("span",{className:"sg-status",children:["SYSTEM READY ",e.jsxs("span",{children:["· ",d.length," TITLES"]})]})]}),e.jsxs("section",{className:"sg-hero","aria-label":"Arcade overview",children:[e.jsxs("div",{className:"sg-hero-copy",children:[e.jsxs("div",{children:[e.jsxs("div",{className:"sg-kicker",children:[e.jsx("span",{})," personal arcade / live index"]}),e.jsxs("h1",{children:["Find your next",e.jsx("br",{}),e.jsx("em",{children:"five-minute world."})]})]}),e.jsxs("div",{className:"sg-hero-footer",children:[e.jsx("p",{children:"Your games, sorted and ready. Pick a tile, press play, and get back to the good part."}),e.jsxs("div",{className:"sg-hero-code",children:["LIBRARY_STATUS ",e.jsx("b",{children:"OK"}),e.jsx("br",{}),"LAST_SYNC 04:26:18"]})]})]}),e.jsxs("div",{className:"sg-hero-queue",children:[e.jsxs("div",{className:"sg-queue-head",children:[e.jsx("span",{children:"QUICK LAUNCH"}),e.jsx("b",{children:"4 READY"})]}),e.jsx("div",{className:"sg-queue-list",children:z.map((a,s)=>e.jsxs("button",{className:"sg-queue-item",type:"button",onClick:()=>c(a),children:[e.jsx("img",{src:`${m}${a.file}`,alt:""}),e.jsxs("span",{children:[e.jsx("strong",{children:a.name}),e.jsxs("small",{children:[String(s+1).padStart(2,"0")," / ",a.tag.toUpperCase()]})]}),e.jsx("span",{className:"sg-play-mark",children:e.jsx(x,{})})]},a.name))})]})]}),e.jsxs("section",{"aria-labelledby":"featured-heading",children:[e.jsxs("div",{className:"sg-section-bar",children:[e.jsxs("div",{className:"sg-section-title",children:[e.jsx("h2",{id:"featured-heading",children:"Featured rotation"}),e.jsx("span",{className:"sg-count",children:"CURATED / 04"})]}),e.jsx("span",{className:"sg-count",children:"UPDATED TODAY"})]}),e.jsx("div",{className:"sg-featured-row",children:z.map(a=>e.jsxs("div",{className:"sg-featured-card",tabIndex:0,role:"button",onClick:()=>c(a),onKeyDown:s=>{s.key==="Enter"&&c(a)},children:[e.jsx(D,{game:a,priority:!0}),e.jsxs("div",{className:"sg-featured-overlay",children:[e.jsx("strong",{children:a.name}),e.jsxs("small",{children:[a.tag.toUpperCase()," / READY"]})]}),e.jsx("button",{className:"sg-card-play",type:"button","aria-label":`Launch ${a.name}`,onClick:s=>{s.stopPropagation(),c(a)},children:e.jsx(x,{})})]},a.name))})]}),e.jsxs("section",{"aria-labelledby":"library-heading",children:[e.jsxs("div",{className:"sg-library-head",children:[e.jsxs("h2",{id:"library-heading",children:["Complete library ",e.jsx("span",{children:"/"})," ",e.jsxs("small",{children:[f.length," indexed"]})]}),e.jsxs("div",{className:"sg-library-tools",children:[e.jsxs("label",{className:"sg-search",children:[e.jsx($,{size:15}),e.jsx("input",{value:o,onChange:a=>n(a.target.value),type:"search",placeholder:"Search titles or genres","aria-label":"Search titles or genres"})]}),e.jsxs("button",{className:"sg-filter-toggle",type:"button",onClick:()=>R(a=>!a),children:[e.jsx(U,{size:14})," Filter ",e.jsx(V,{size:13,style:{transform:k?"rotate(180deg)":"none"}})]})]})]}),k&&e.jsx("div",{className:"sg-filter-row","aria-label":"Library filters",children:K.map(a=>e.jsx("button",{type:"button",className:`sg-filter ${t===a.id?"active":""}`,onClick:()=>p(a.id),children:a.label},a.id))}),e.jsxs("div",{className:"sg-game-grid",children:[f.map(a=>e.jsxs("article",{className:"sg-game-card",tabIndex:0,children:[e.jsxs("div",{className:"sg-game-cover",children:[e.jsx(D,{game:a}),e.jsx("button",{className:`sg-save ${l.has(a.name)?"saved":""}`,type:"button","aria-label":`${l.has(a.name)?"Remove":"Save"} ${a.name}`,onClick:()=>F(a.name),children:e.jsx(L,{size:13})}),e.jsx("button",{className:"sg-game-action",type:"button","aria-label":`Launch ${a.name}`,onClick:()=>c(a),children:e.jsx(x,{})})]}),e.jsxs("div",{className:"sg-game-info",children:[e.jsx("span",{className:"sg-game-name",title:a.name,children:a.name}),e.jsxs("div",{className:"sg-game-meta",children:[e.jsxs("span",{children:[e.jsx("i",{style:{"--tile-color":a.color}}),a.tag]}),e.jsx("span",{children:l.has(a.name)?e.jsx(W,{size:9}):"READY"})]})]})]},a.name)),f.length===0&&e.jsxs("div",{className:"sg-empty",children:["NO TITLES MATCH THIS FILTER.",e.jsx("button",{type:"button",onClick:()=>{n(""),p("all")},children:"Clear index"})]})]})]})]}),S?e.jsx("aside",{className:"sg-player","aria-label":"Media player",children:e.jsxs("div",{className:"sg-player-inner",children:[e.jsxs("div",{className:"sg-player-track",children:[e.jsx("img",{className:"sg-player-art",src:`${m}${g?.file??"logo.gif"}`,alt:""}),e.jsxs("span",{children:[e.jsx("strong",{children:g?.name??"No track selected"}),e.jsx("small",{children:g?"GAME SESSION / READY":"MEDIA PLAYER / STANDBY"})]})]}),e.jsxs("div",{className:"sg-player-controls",children:[e.jsx("button",{type:"button","aria-label":"Previous game",onClick:()=>C(-1),children:e.jsx(X,{size:18})}),e.jsx("button",{className:"sg-main-control",type:"button","aria-label":u?"Pause":"Play",onClick:()=>N(a=>!a),children:u?e.jsx("span",{style:{fontSize:15,lineHeight:1},children:"Ⅱ"}):e.jsx(x,{})}),e.jsx("button",{type:"button","aria-label":"Next game",onClick:()=>C(1),children:e.jsx(_,{size:18})})]}),e.jsxs("div",{className:"sg-player-progress",children:[e.jsx("span",{children:u?"01:18":"00:00"}),e.jsx("input",{className:"sg-range sg-progress-range",type:"range",min:"0",max:"100",value:E,onChange:a=>I(Number(a.target.value)),"aria-label":"Track progress"}),e.jsx(G,{size:14}),e.jsx("input",{className:"sg-range sg-volume-range",type:"range",min:"0",max:"100",value:T,onChange:a=>B(Number(a.target.value)),"aria-label":"Volume"}),e.jsx("button",{className:"sg-player-close",type:"button","aria-label":"Collapse media player",onClick:()=>h(!1),children:e.jsx(O,{size:15})})]})]})}):e.jsxs("button",{className:"sg-collapsed-player",type:"button",onClick:()=>h(!0),children:[e.jsx("span",{className:"sg-live-dot"})," OPEN PLAYER"]})]})}export{ne as SystemGrid};
