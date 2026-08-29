import{r as t,j as e}from"./index-DFVDn7O1.js";import{S as B}from"./settings-2-Dn881918.js";import{X as f,P as h,S as I,V as $}from"./x-DsfhEe0S.js";import{M as E,H as F}from"./menu-D0sgf27C.js";import{C as D}from"./command-DVMRBiKU.js";import{C as b}from"./chevron-right-DrteR-Fq.js";import{L as T}from"./layout-grid-CLsVTV9Z.js";import{S as G}from"./sliders-horizontal-CjUMQHQo.js";import{S as H}from"./sparkles-C6qXgTOV.js";import{C as L}from"./chevron-left-xIZlUFhO.js";import{P as O}from"./pause-B55YClLI.js";import{B as V}from"./bookmark-CpKdn_2x.js";const g="/__mockup/images/aerodynamix/",N=[{file:"run-3.jpg",name:"Run 3",genre:"Endless runner",time:"12 min",accent:"#78b6ff"},{file:"drive-mad.jpg",name:"Drive Mad",genre:"Physics racer",time:"8 min",accent:"#ff996e"},{file:"papaspizzeria.png",name:"Papa's Pizzeria",genre:"Time management",time:"20 min",accent:"#ffc65b"},{file:"supersmashflash.jpg",name:"Super Smash Flash",genre:"Arcade fighter",time:"16 min",accent:"#d29aff"}],W=[["run-3.jpg","Run 3","Endless runner","12 min","#78b6ff"],["drive-mad.jpg","Drive Mad","Physics racer","8 min","#ff996e"],["retro-bowl.jpg","Retro Bowl","Sports sim","15 min","#f27d8c"],["slope.jpg","Slope","Reflex","6 min","#86d0b2"],["mc.png","Minecraft","Sandbox","30 min","#8eb0f5"],["supersmashflash.jpg","Super Smash Flash","Arcade fighter","16 min","#d29aff"],["papaspizzeria.png","Papa's Pizzeria","Time management","20 min","#ffc65b"],["papasfreezeria.png","Papa's Freezeria","Time management","18 min","#96cbea"],["papas-pancakeria.png","Papa's Pancakeria","Time management","17 min","#f6a9b7"],["papas-bakeria.png","Papa's Bakeria","Time management","19 min","#efa278"],["meat-boy.png","Meat Boy","Platformer","11 min","#ee7381"],["newgrounds-rumble.png","Newgrounds Rumble","Brawler","14 min","#f5ba6a"],["we-become-what-we-behold.png","We Become What We Behold","Interactive story","5 min","#9cc3be"],["bad-time-simulator.png","Bad Time Simulator","Bullet hell","9 min","#bb9ef3"],["deltarune.png","Deltarune","Adventure RPG","25 min","#96b9ff"],["adventure-capitalist.png","Adventure Capitalist","Idle","10 min","#ffca78"],["fridaynightfunkin.png","Friday Night Funkin'","Rhythm","13 min","#78c8ec"],["run-2.png","Run 2","Endless runner","10 min","#8eb7f3"],["picoschool.png","Pico's School","Adventure","12 min","#ec987d"],["worldshardestgame.png","World's Hardest Game","Precision","7 min","#ef8f9d"],["sandboxels.png","Sandboxels","Simulation","18 min","#94c9a7"],["alien-hominid.png","Alien Hominid","Run and gun","14 min","#f2bc6a"],["subway-surfers-sf.jpg","Subway Surfers San Francisco","Runner","12 min","#72b9da"],["hobo-1.png","Hobo 1","Beat 'em up","11 min","#c1a687"],["hobo-2.png","Hobo 2","Beat 'em up","11 min","#c1a687"],["hobo-3.png","Hobo 3","Beat 'em up","11 min","#c1a687"],["hobo-4.png","Hobo 4","Beat 'em up","11 min","#c1a687"],["hobo-5.png","Hobo 5","Beat 'em up","11 min","#c1a687"],["hobo-6.png","Hobo 6","Beat 'em up","11 min","#c1a687"],["hobo-7.png","Hobo 7","Beat 'em up","11 min","#c1a687"],["gladihoppers.jpg","Gladihoppers","Arena","9 min","#d7a47a"],["fruit-ninja.png","Fruit Ninja","Arcade","8 min","#eb8a73"],["binding-of-isaac.png","Binding of Isaac","Dungeon crawler","24 min","#b997c6"],["crossy-road.png","Crossy Road","Arcade","6 min","#f4c174"],["cookie-clicker.png","Cookie Clicker","Idle","10 min","#dbad78"],["duck-life.png","Duck Life","Adventure","14 min","#f2ce78"],["geometry-dash-lite.jpg","Geometry Dash Lite","Rhythm platformer","9 min","#88afea"],["doom.png","Doom","Action","26 min","#dd817d"],["doki-doki-literature-club.jpg","Doki Doki Literature Club","Visual novel","30 min","#ec9ec0"],["baldis-basics-classic-remastered.png","Baldi's Basics Classic Remastered","Horror","18 min","#c8b36a"],["stickmin-breaking-bank.jpg","Breaking the Bank","Interactive story","5 min","#a8b9c5"],["stickmin-escaping-prison.avif","Escaping the Prison","Interactive story","7 min","#a8b9c5"],["stickmin-stealing-diamond.avif","Stealing the Diamond","Interactive story","8 min","#a8b9c5"],["stickmin-infiltrating-airship.avif","Infiltrating the Airship","Interactive story","9 min","#a8b9c5"],["stickmin-fleeing-complex.avif","Fleeing the Complex","Interactive story","10 min","#a8b9c5"],["greatest-game-square.svg","THE GREATEST GAME OF ALL TIME","Experimental","4 min","#a6a8ef"],["nubbys-number-factory.jpg","Nubby's Number Factory","Puzzle","12 min","#e6ad70"]].map(([n,d,s,c,o])=>({file:n,name:d,genre:s,time:c,accent:o})),Y=["Games","Apps","Media Player","Connect"],q=["All games","Quick play","Favorites"];function Q({small:n=!1}){return e.jsx("span",{className:`gp-play-orb ${n?"gp-play-orb-small":""}`,"aria-hidden":"true",children:e.jsx(h,{size:n?13:16,fill:"currentColor",strokeWidth:1.8})})}function pe(){const[n,d]=t.useState(""),[s,c]=t.useState("All games"),[o,y]=t.useState(!1),[v,z]=t.useState(!1),[m,S]=t.useState(["Run 3","Deltarune"]),[i,C]=t.useState(N[0]),[x,j]=t.useState(!1),[w,k]=t.useState(!0),[P,A]=t.useState("Games"),u=t.useMemo(()=>{const a=n.trim().toLowerCase();return W.filter(r=>{const p=!a||`${r.name} ${r.genre}`.toLowerCase().includes(a),R=s==="All games"||s==="Quick play"&&Number.parseInt(r.time,10)<=10||s==="Favorites"&&m.includes(r.name);return p&&R})},[m,s,n]),l=a=>{C(a),j(!0)},M=a=>{S(r=>r.includes(a)?r.filter(p=>p!==a):[...r,a])};return e.jsxs("main",{className:"gp-page",children:[e.jsx("style",{children:`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap');
        .gp-page {
          --gp-ink: #18233c;
          --gp-muted: #68748e;
          --gp-blue: #3977e8;
          --gp-coral: #ea806b;
          min-height: 100vh;
          box-sizing: border-box;
          padding: 22px 24px 124px;
          color: var(--gp-ink);
          font-family: 'DM Sans', ui-sans-serif, sans-serif;
          background:
            radial-gradient(circle at 8% 10%, rgba(167, 208, 255, .8), transparent 26%),
            radial-gradient(circle at 96% 25%, rgba(248, 194, 176, .62), transparent 28%),
            linear-gradient(135deg, #e8f0f1 0%, #f3f4ee 48%, #e7edf6 100%);
          overflow-x: hidden;
        }
        .gp-page *, .gp-page *::before, .gp-page *::after { box-sizing: border-box; }
        .gp-page button, .gp-page input { font: inherit; }
        .gp-page button { cursor: pointer; }
        .gp-shell { width: min(100%, 1120px); margin: 0 auto; }
        .gp-glass {
          border: 1px solid rgba(255,255,255,.72);
          background: rgba(255,255,255,.56);
          box-shadow: 0 22px 70px rgba(57, 83, 121, .12), inset 0 1px 0 rgba(255,255,255,.75);
          backdrop-filter: blur(22px) saturate(120%);
        }
        .gp-topbar {
          position: sticky; top: 14px; z-index: 20;
          display: flex; align-items: center; gap: 12px; min-height: 58px;
          padding: 8px 10px 8px 12px; border-radius: 20px;
        }
        .gp-brand { display: flex; align-items: center; gap: 10px; color: var(--gp-ink); text-decoration: none; min-width: 188px; }
        .gp-logo { width: 38px; height: 38px; padding: 3px; border-radius: 12px; background: #131a2d; object-fit: contain; box-shadow: 0 7px 16px rgba(25,35,60,.18); }
        .gp-brand-word { font-size: 13px; font-weight: 700; letter-spacing: .2em; }
        .gp-brand-sub { display: block; margin-top: 1px; color: var(--gp-muted); font: 9px 'Space Mono', monospace; letter-spacing: .08em; }
        .gp-nav { display: flex; justify-content: center; gap: 3px; flex: 1; }
        .gp-nav button, .gp-settings-btn, .gp-menu-btn {
          border: 0; border-radius: 11px; color: var(--gp-muted); background: transparent;
          padding: 10px 12px; font-size: 12px; font-weight: 600; transition: transform .2s ease, background .2s ease, color .2s ease;
        }
        .gp-nav button:hover, .gp-nav button:focus-visible, .gp-settings-btn:hover, .gp-menu-btn:hover { background: rgba(255,255,255,.72); color: var(--gp-ink); }
        .gp-nav button.gp-active { color: #fff; background: var(--gp-blue); box-shadow: 0 8px 18px rgba(57,119,232,.2); }
        .gp-settings-btn { display: inline-flex; align-items: center; gap: 7px; }
        .gp-menu-btn { display: none; padding: 10px; }
        .gp-hero { display: grid; grid-template-columns: minmax(0,1.28fr) minmax(250px,.72fr); gap: 15px; padding-top: 24px; }
        .gp-hero-main { position: relative; min-height: 302px; padding: 30px; border-radius: 28px; overflow: hidden; background: linear-gradient(112deg, rgba(22,35,66,.98), rgba(42,74,128,.9) 58%, rgba(83,130,193,.68)); color: #f7fbff; box-shadow: 0 26px 58px rgba(33,55,96,.26); }
        .gp-hero-main::after { content: ''; position: absolute; right: -76px; top: -80px; width: 300px; height: 300px; border: 1px solid rgba(255,255,255,.28); border-radius: 50%; box-shadow: 0 0 0 24px rgba(255,255,255,.04), 0 0 0 55px rgba(255,255,255,.035), 0 0 0 92px rgba(255,255,255,.025); }
        .gp-kicker { display: flex; align-items: center; gap: 8px; margin-bottom: 32px; color: #a9cbff; font: 10px 'Space Mono', monospace; letter-spacing: .12em; text-transform: uppercase; }
        .gp-kicker i { width: 7px; height: 7px; border-radius: 50%; background: #a9cbff; box-shadow: 0 0 0 5px rgba(169,203,255,.13); }
        .gp-hero-main h1 { max-width: 470px; margin: 0; font-size: clamp(2.1rem, 5vw, 4.6rem); line-height: .92; letter-spacing: -.065em; font-weight: 700; }
        .gp-hero-main p { max-width: 380px; margin: 18px 0 25px; color: rgba(235,243,255,.7); font-size: 13px; line-height: 1.5; }
        .gp-hero-actions { display: flex; align-items: center; gap: 9px; }
        .gp-primary {
          display: inline-flex; align-items: center; gap: 8px; border: 0; border-radius: 12px; padding: 11px 15px;
          color: #fff; background: var(--gp-coral); font-size: 12px; font-weight: 700; box-shadow: 0 9px 20px rgba(234,128,107,.23); transition: transform .2s ease, filter .2s ease;
        }
        .gp-primary:hover { transform: translateY(-2px); filter: saturate(1.1) brightness(1.04); }
        .gp-ghost-light { display: inline-flex; align-items: center; gap: 7px; border: 1px solid rgba(255,255,255,.22); border-radius: 12px; padding: 10px 13px; color: rgba(246,250,255,.84); background: rgba(255,255,255,.09); font-size: 12px; font-weight: 600; }
        .gp-ghost-light:hover { background: rgba(255,255,255,.17); }
        .gp-hero-side { display: flex; flex-direction: column; gap: 12px; min-width: 0; }
        .gp-now-card { flex: 1; padding: 18px; border-radius: 23px; }
        .gp-side-label { display: flex; justify-content: space-between; align-items: center; color: var(--gp-muted); font: 10px 'Space Mono', monospace; text-transform: uppercase; letter-spacing: .09em; }
        .gp-side-label span:last-child { color: var(--gp-coral); }
        .gp-now-art { display: grid; grid-template-columns: 90px 1fr; gap: 13px; align-items: center; margin-top: 16px; }
        .gp-now-art img { width: 90px; height: 90px; object-fit: cover; border-radius: 16px; box-shadow: 0 10px 22px rgba(45,69,102,.18); }
        .gp-now-art h2 { margin: 0 0 5px; font-size: 18px; letter-spacing: -.03em; }
        .gp-now-art p { margin: 0 0 12px; color: var(--gp-muted); font-size: 11px; }
        .gp-inline-play { display: inline-flex; align-items: center; gap: 6px; border: 0; color: var(--gp-blue); background: transparent; padding: 0; font-size: 11px; font-weight: 700; }
        .gp-inline-play:hover { color: var(--gp-coral); }
        .gp-stat-card { display: grid; grid-template-columns: 1fr 1fr; gap: 9px; }
        .gp-stat { padding: 14px 16px; border-radius: 18px; }
        .gp-stat b { display: block; margin-bottom: 3px; font-size: 19px; letter-spacing: -.04em; }
        .gp-stat span { color: var(--gp-muted); font-size: 10px; }
        .gp-content { padding-top: 34px; }
        .gp-section-head { display: flex; align-items: end; justify-content: space-between; gap: 18px; margin-bottom: 14px; }
        .gp-section-head h2 { margin: 0; font-size: 22px; letter-spacing: -.045em; }
        .gp-section-head p { margin: 5px 0 0; color: var(--gp-muted); font-size: 11px; }
        .gp-section-link { display: inline-flex; align-items: center; gap: 4px; color: var(--gp-blue); background: none; border: 0; font-size: 11px; font-weight: 700; }
        .gp-feature-row { display: grid; grid-template-columns: 1.35fr 1fr 1fr 1fr; gap: 10px; }
        .gp-feature-card { position: relative; min-width: 0; aspect-ratio: 1.24; border-radius: 20px; overflow: hidden; border: 1px solid rgba(255,255,255,.62); background: #ced9df; cursor: pointer; box-shadow: 0 13px 30px rgba(51,77,111,.11); transition: transform .24s ease, box-shadow .24s ease; }
        .gp-feature-card:hover, .gp-feature-card:focus-visible { transform: translateY(-4px); box-shadow: 0 20px 35px rgba(51,77,111,.19); outline: none; }
        .gp-feature-card img { width: 100%; height: 100%; display: block; object-fit: cover; transition: transform .35s ease; }
        .gp-feature-card:hover img { transform: scale(1.045); }
        .gp-feature-card::after { content: ''; position: absolute; inset: 0; background: linear-gradient(180deg, transparent 38%, rgba(11,25,48,.76)); }
        .gp-feature-info { position: absolute; z-index: 1; left: 13px; right: 10px; bottom: 11px; color: #fff; }
        .gp-feature-info h3 { margin: 0 0 3px; font-size: 13px; letter-spacing: -.02em; }
        .gp-feature-info span { color: rgba(255,255,255,.7); font: 9px 'Space Mono', monospace; }
        .gp-feature-card .gp-play-orb { position: absolute; z-index: 2; top: 12px; right: 12px; }
        .gp-play-orb { display: grid; place-items: center; width: 34px; height: 34px; border: 0; border-radius: 50%; color: #1b2b49; background: rgba(255,255,255,.86); box-shadow: 0 7px 16px rgba(22,35,60,.18); transition: transform .2s ease, background .2s ease; }
        .gp-play-orb:hover { transform: scale(1.08); background: #fff; }
        .gp-play-orb-small { width: 28px; height: 28px; }
        .gp-library { margin-top: 38px; padding: 20px; border-radius: 25px; }
        .gp-library-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 19px; }
        .gp-library-title { display: flex; align-items: center; gap: 10px; }
        .gp-library-title h2 { margin: 0; font-size: 20px; letter-spacing: -.04em; }
        .gp-library-title span { display: inline-flex; align-items: center; height: 21px; padding: 0 7px; border-radius: 7px; color: var(--gp-blue); background: rgba(57,119,232,.1); font: 10px 'Space Mono', monospace; }
        .gp-search { display: flex; align-items: center; gap: 9px; width: min(250px, 44%); padding: 9px 11px; border: 1px solid rgba(92,113,150,.18); border-radius: 12px; color: var(--gp-muted); background: rgba(255,255,255,.4); }
        .gp-search:focus-within { border-color: rgba(57,119,232,.55); box-shadow: 0 0 0 3px rgba(57,119,232,.09); }
        .gp-search input { width: 100%; border: 0; outline: 0; color: var(--gp-ink); background: transparent; font-size: 11px; }
        .gp-search input::placeholder { color: #8792a6; }
        .gp-filter-row { display: flex; align-items: center; gap: 6px; margin-bottom: 17px; overflow-x: auto; scrollbar-width: none; }
        .gp-filter-row::-webkit-scrollbar { display: none; }
        .gp-filter { flex: 0 0 auto; border: 1px solid transparent; border-radius: 9px; padding: 7px 10px; color: var(--gp-muted); background: transparent; font-size: 10px; font-weight: 600; }
        .gp-filter:hover { color: var(--gp-ink); background: rgba(255,255,255,.48); }
        .gp-filter.gp-filter-active { color: var(--gp-blue); border-color: rgba(57,119,232,.16); background: rgba(57,119,232,.09); }
        .gp-filter-tools { display: flex; align-items: center; gap: 6px; margin-left: auto; color: var(--gp-muted); font-size: 10px; }
        .gp-game-grid { display: grid; grid-template-columns: repeat(6, minmax(0,1fr)); gap: 12px 10px; }
        .gp-game-tile { min-width: 0; border: 0; padding: 0; color: var(--gp-ink); background: transparent; text-align: left; }
        .gp-game-image { position: relative; aspect-ratio: 1; overflow: hidden; border-radius: 15px; background: #d7e0e1; box-shadow: 0 7px 17px rgba(51,77,111,.09); }
        .gp-game-image img { display: block; width: 100%; height: 100%; object-fit: cover; transition: transform .25s ease, filter .25s ease; }
        .gp-game-tile:hover .gp-game-image img, .gp-game-tile:focus-visible .gp-game-image img { transform: scale(1.06); filter: saturate(1.1); }
        .gp-game-tile:focus-visible { outline: 2px solid var(--gp-blue); outline-offset: 4px; border-radius: 10px; }
        .gp-game-hover { position: absolute; inset: 0; display: grid; place-items: center; opacity: 0; background: rgba(22,37,65,.34); transition: opacity .2s ease; }
        .gp-game-tile:hover .gp-game-hover, .gp-game-tile:focus-visible .gp-game-hover { opacity: 1; }
        .gp-heart { position: absolute; z-index: 1; top: 7px; right: 7px; display: grid; place-items: center; width: 25px; height: 25px; border: 0; border-radius: 50%; color: #fff; background: rgba(20,35,61,.52); opacity: 0; transition: opacity .2s ease, transform .2s ease, background .2s ease; }
        .gp-game-tile:hover .gp-heart, .gp-heart.gp-heart-on { opacity: 1; }
        .gp-heart:hover { transform: scale(1.08); background: rgba(234,128,107,.88); }
        .gp-heart-on { color: #ffddcf; }
        .gp-game-name { display: block; overflow: hidden; margin-top: 8px; text-overflow: ellipsis; white-space: nowrap; font-size: 11px; font-weight: 700; }
        .gp-game-meta { display: block; overflow: hidden; margin-top: 3px; color: var(--gp-muted); text-overflow: ellipsis; white-space: nowrap; font: 9px 'Space Mono', monospace; }
        .gp-empty { grid-column: 1 / -1; padding: 36px 12px; color: var(--gp-muted); text-align: center; }
        .gp-empty strong { display: block; margin-bottom: 5px; color: var(--gp-ink); font-size: 14px; }
        .gp-footer-note { display: flex; align-items: center; justify-content: center; gap: 7px; padding: 30px 0 6px; color: var(--gp-muted); font: 9px 'Space Mono', monospace; letter-spacing: .04em; }
        .gp-settings-pop { position: absolute; top: 70px; right: 16px; z-index: 25; width: 210px; padding: 14px; border-radius: 16px; }
        .gp-settings-pop h3 { margin: 0 0 11px; font-size: 12px; }
        .gp-settings-line { display: flex; align-items: center; justify-content: space-between; padding: 8px 0; border-top: 1px solid rgba(92,113,150,.13); color: var(--gp-muted); font-size: 10px; }
        .gp-toggle { width: 29px; height: 17px; border: 0; border-radius: 10px; padding: 2px; background: #c8d0dc; }
        .gp-toggle::after { content: ''; display: block; width: 13px; height: 13px; border-radius: 50%; background: #fff; transition: transform .2s ease; }
        .gp-toggle-on { background: var(--gp-blue); }
        .gp-toggle-on::after { transform: translateX(12px); }
        .gp-player {
          position: fixed; z-index: 30; left: 50%; bottom: 13px; transform: translateX(-50%);
          width: min(calc(100% - 34px), 920px); min-height: 67px; padding: 9px 13px;
          display: grid; grid-template-columns: minmax(180px, 1.1fr) auto minmax(180px, 1fr); align-items: center; gap: 16px; border-radius: 19px;
          border-color: rgba(255,255,255,.78); background: rgba(245,248,246,.78); box-shadow: 0 18px 50px rgba(32,51,79,.2); backdrop-filter: blur(24px) saturate(140%);
        }
        .gp-track { display: flex; align-items: center; gap: 9px; min-width: 0; }
        .gp-track img { width: 42px; height: 42px; border-radius: 11px; object-fit: cover; }
        .gp-track-copy { min-width: 0; }
        .gp-track-copy strong, .gp-track-copy span { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .gp-track-copy strong { font-size: 11px; }
        .gp-track-copy span { margin-top: 3px; color: var(--gp-muted); font: 9px 'Space Mono', monospace; }
        .gp-player-actions { display: flex; align-items: center; gap: 8px; }
        .gp-player-actions button, .gp-player-close { display: grid; place-items: center; width: 31px; height: 31px; border: 0; border-radius: 50%; color: var(--gp-muted); background: transparent; }
        .gp-player-actions button:hover, .gp-player-close:hover { color: var(--gp-ink); background: rgba(255,255,255,.76); }
        .gp-player-actions .gp-pause { width: 35px; height: 35px; color: #fff; background: var(--gp-ink); }
        .gp-player-progress { display: flex; align-items: center; gap: 9px; min-width: 0; color: var(--gp-muted); font: 9px 'Space Mono', monospace; }
        .gp-player-progress input { width: 100%; min-width: 45px; accent-color: var(--gp-blue); }
        .gp-player-volume { display: flex; align-items: center; gap: 6px; width: 86px; }
        .gp-player-volume input { width: 55px; accent-color: var(--gp-blue); }
        .gp-player-hidden { display: none; }
        @media (max-width: 760px) {
          .gp-page { padding: 12px 13px 118px; }
          .gp-topbar { top: 8px; border-radius: 16px; }
          .gp-brand { min-width: 0; flex: 1; }
          .gp-brand-word { font-size: 11px; }
          .gp-nav { position: absolute; top: 66px; left: 0; right: 0; display: none; flex-direction: column; padding: 8px; border: 1px solid rgba(255,255,255,.72); border-radius: 15px; background: rgba(239,244,243,.94); box-shadow: 0 18px 45px rgba(32,51,79,.18); }
          .gp-nav.gp-nav-open { display: flex; }
          .gp-nav button { text-align: left; }
          .gp-settings-btn { display: none; }
          .gp-menu-btn { display: inline-flex; }
          .gp-hero { grid-template-columns: 1fr; padding-top: 18px; }
          .gp-hero-main { min-height: 325px; padding: 24px; }
          .gp-hero-main h1 { font-size: clamp(2.6rem, 13vw, 4.5rem); }
          .gp-hero-side { display: grid; grid-template-columns: 1fr 1fr; }
          .gp-now-art { grid-template-columns: 65px 1fr; }
          .gp-now-art img { width: 65px; height: 65px; }
          .gp-stat-card { grid-column: 1 / -1; }
          .gp-feature-row { display: flex; overflow-x: auto; padding: 2px 2px 8px; scroll-snap-type: x proximity; }
          .gp-feature-card { flex: 0 0 67vw; scroll-snap-align: start; }
          .gp-library { margin-top: 25px; padding: 15px; }
          .gp-library-head { align-items: stretch; flex-direction: column; }
          .gp-search { width: 100%; }
          .gp-game-grid { grid-template-columns: repeat(3, minmax(0,1fr)); gap: 14px 8px; }
          .gp-player { width: calc(100% - 22px); grid-template-columns: 1fr auto; gap: 8px; }
          .gp-player-actions { order: 2; }
          .gp-player-progress { grid-column: 1 / -1; order: 3; }
          .gp-player-volume { display: none; }
          .gp-player-close { position: absolute; top: -8px; right: -5px; width: 22px; height: 22px; color: var(--gp-muted); background: #edf2ef; box-shadow: 0 3px 8px rgba(32,51,79,.12); }
        }
        .gp-player-reopen { position: fixed; right: 16px; bottom: 16px; z-index: 30; display: grid; place-items: center; width: 42px; height: 42px; border: 1px solid rgba(255,255,255,.78); border-radius: 14px; color: var(--gp-blue); background: rgba(245,248,246,.86); box-shadow: 0 12px 30px rgba(32,51,79,.17); backdrop-filter: blur(18px); }
        .gp-player-reopen:hover { transform: translateY(-2px); }
        @media (max-width: 430px) {
          .gp-hero-side { display: flex; }
          .gp-now-card { min-height: 145px; }
          .gp-feature-card { flex-basis: 76vw; }
          .gp-game-grid { grid-template-columns: repeat(2, minmax(0,1fr)); }
        }
      `}),e.jsxs("div",{className:"gp-shell",children:[e.jsxs("header",{className:"gp-topbar gp-glass",children:[e.jsxs("button",{className:"gp-brand",type:"button","aria-label":"Return to Aerodynamix home",onClick:()=>window.scrollTo({top:0,behavior:"smooth"}),children:[e.jsx("img",{className:"gp-logo",src:`${g}logo.gif`,alt:"Aerodynamix logo"}),e.jsxs("span",{children:[e.jsx("span",{className:"gp-brand-word",children:"AERODYNAMIX"}),e.jsx("span",{className:"gp-brand-sub",children:"PERSONAL ARCADE / 01"})]})]}),e.jsx("nav",{className:`gp-nav ${o?"gp-nav-open":""}`,"aria-label":"Aerodynamix navigation",children:Y.map(a=>e.jsx("button",{className:P===a?"gp-active":"",type:"button",onClick:()=>{A(a),y(!1)},children:a},a))}),e.jsxs("button",{className:"gp-settings-btn",type:"button",onClick:()=>z(a=>!a),"aria-expanded":v,children:[e.jsx(B,{size:14})," Settings"]}),e.jsx("button",{className:"gp-menu-btn",type:"button",onClick:()=>y(a=>!a),"aria-label":"Toggle navigation","aria-expanded":o,children:o?e.jsx(f,{size:18}):e.jsx(E,{size:18})}),v&&e.jsxs("div",{className:"gp-settings-pop gp-glass",role:"dialog","aria-label":"Settings",children:[e.jsx("h3",{children:"Portal settings"}),e.jsxs("div",{className:"gp-settings-line",children:[e.jsx("span",{children:"Remember favorites"}),e.jsx("button",{className:"gp-toggle gp-toggle-on",type:"button","aria-label":"Remember favorites enabled"})]}),e.jsxs("div",{className:"gp-settings-line",children:[e.jsx("span",{children:"Motion effects"}),e.jsx("button",{className:"gp-toggle gp-toggle-on",type:"button","aria-label":"Motion effects enabled"})]}),e.jsxs("div",{className:"gp-settings-line",children:[e.jsx("span",{children:"Keyboard shortcuts"}),e.jsx(D,{size:13})]})]})]}),e.jsxs("section",{className:"gp-hero","aria-labelledby":"portal-title",children:[e.jsxs("div",{className:"gp-hero-main",children:[e.jsxs("div",{className:"gp-kicker",children:[e.jsx("i",{})," Welcome back, player"]}),e.jsx("h1",{id:"portal-title",children:"Your next play is waiting."}),e.jsx("p",{children:"A quiet corner of the internet for excellent games. Pick up where you left off or follow the spark somewhere new."}),e.jsxs("div",{className:"gp-hero-actions",children:[e.jsxs("button",{className:"gp-primary",type:"button",onClick:()=>l(i),children:[e.jsx(h,{size:14,fill:"currentColor"})," Play ",i.name]}),e.jsxs("button",{className:"gp-ghost-light",type:"button",onClick:()=>{c("Quick play"),document.getElementById("library")?.scrollIntoView({behavior:"smooth"})},children:["Browse quick plays ",e.jsx(b,{size:14})]})]})]}),e.jsxs("div",{className:"gp-hero-side",children:[e.jsxs("div",{className:"gp-now-card gp-glass",children:[e.jsxs("div",{className:"gp-side-label",children:[e.jsx("span",{children:"Continue your orbit"}),e.jsx("span",{children:"08:24"})]}),e.jsxs("div",{className:"gp-now-art",children:[e.jsx("img",{src:`${g}${i.file}`,alt:i.name}),e.jsxs("div",{children:[e.jsx("h2",{children:i.name}),e.jsxs("p",{children:[i.genre," / ",i.time]}),e.jsxs("button",{className:"gp-inline-play",type:"button",onClick:()=>l(i),children:["Resume session ",e.jsx(b,{size:13})]})]})]})]}),e.jsxs("div",{className:"gp-stat-card",children:[e.jsxs("div",{className:"gp-stat gp-glass",children:[e.jsx("b",{children:m.length}),e.jsx("span",{children:"saved games"})]}),e.jsxs("div",{className:"gp-stat gp-glass",children:[e.jsx("b",{children:"47"}),e.jsx("span",{children:"in the library"})]})]})]})]}),e.jsxs("section",{className:"gp-content","aria-labelledby":"spotlight-title",children:[e.jsxs("div",{className:"gp-section-head",children:[e.jsxs("div",{children:[e.jsx("h2",{id:"spotlight-title",children:"A good place to start"}),e.jsx("p",{children:"Four hand-picked portals for the next few minutes."})]}),e.jsxs("button",{className:"gp-section-link",type:"button",onClick:()=>document.getElementById("library")?.scrollIntoView({behavior:"smooth"}),children:["See full library ",e.jsx(b,{size:13})]})]}),e.jsx("div",{className:"gp-feature-row",children:N.map(a=>e.jsxs("button",{className:"gp-feature-card",type:"button",onClick:()=>l(a),"aria-label":`Play ${a.name}`,children:[e.jsx("img",{src:`${g}${a.file}`,alt:""}),e.jsx("span",{className:"gp-play-orb",children:e.jsx(h,{size:15,fill:"currentColor"})}),e.jsxs("span",{className:"gp-feature-info",children:[e.jsx("h3",{children:a.name}),e.jsxs("span",{children:[a.genre," / ",a.time]})]})]},a.name))})]}),e.jsxs("section",{className:"gp-library gp-glass",id:"library","aria-labelledby":"library-title",children:[e.jsxs("div",{className:"gp-library-head",children:[e.jsxs("div",{className:"gp-library-title",children:[e.jsx(T,{size:17,color:"var(--gp-blue)"}),e.jsx("h2",{id:"library-title",children:"The full library"}),e.jsx("span",{children:u.length})]}),e.jsxs("label",{className:"gp-search",children:[e.jsx(I,{size:15}),e.jsx("input",{type:"search",value:n,onChange:a=>d(a.target.value),placeholder:"Search games or genres","aria-label":"Search games or genres"}),n&&e.jsx("button",{type:"button",onClick:()=>d(""),"aria-label":"Clear search",children:e.jsx(f,{size:13})})]})]}),e.jsxs("div",{className:"gp-filter-row","aria-label":"Library filters",children:[q.map(a=>e.jsx("button",{className:`gp-filter ${s===a?"gp-filter-active":""}`,type:"button",onClick:()=>c(a),children:a},a)),e.jsxs("span",{className:"gp-filter-tools",children:[e.jsx(G,{size:13})," curated by feel"]})]}),e.jsxs("div",{className:"gp-game-grid",children:[u.map(a=>{const r=m.includes(a.name);return e.jsxs("div",{className:"gp-game-tile",onClick:()=>l(a),onKeyDown:p=>{(p.key==="Enter"||p.key===" ")&&(p.preventDefault(),l(a))},role:"button",tabIndex:0,"aria-label":`Play ${a.name}`,children:[e.jsxs("span",{className:"gp-game-image",children:[e.jsx("img",{src:`${g}${a.file}`,alt:"",loading:"lazy"}),e.jsx("span",{className:"gp-game-hover",children:e.jsx(Q,{small:!0})}),e.jsx("button",{className:`gp-heart ${r?"gp-heart-on":""}`,type:"button","aria-label":`${r?"Remove":"Save"} ${a.name}`,onClick:p=>{p.stopPropagation(),M(a.name)},children:e.jsx(F,{size:13,fill:r?"currentColor":"none"})})]}),e.jsx("span",{className:"gp-game-name",children:a.name}),e.jsxs("span",{className:"gp-game-meta",children:[a.genre," / ",a.time]})]},a.name)}),u.length===0&&e.jsxs("div",{className:"gp-empty",children:[e.jsx("strong",{children:"No portals found"}),"Try another title, genre, or return to all games."]})]})]}),e.jsxs("div",{className:"gp-footer-note",children:[e.jsx(H,{size:12})," Aerodynamix keeps the good stuff close."]})]}),w&&e.jsxs("aside",{className:"gp-player gp-glass","aria-label":"Media player",children:[e.jsxs("div",{className:"gp-track",children:[e.jsx("img",{src:`${g}${i.file}`,alt:""}),e.jsxs("div",{className:"gp-track-copy",children:[e.jsx("strong",{children:x?i.name:"Choose a game to begin"}),e.jsx("span",{children:x?"Now playing in Aerodynamix":"Media Player"})]})]}),e.jsxs("div",{className:"gp-player-actions",children:[e.jsx("button",{type:"button","aria-label":"Previous track",children:e.jsx(L,{size:16})}),e.jsx("button",{className:"gp-pause",type:"button","aria-label":x?"Pause":"Play",onClick:()=>j(a=>!a),children:x?e.jsx(O,{size:15,fill:"currentColor"}):e.jsx(h,{size:15,fill:"currentColor"})}),e.jsx("button",{type:"button","aria-label":"Next track",children:e.jsx(b,{size:16})})]}),e.jsxs("div",{className:"gp-player-progress",children:[e.jsx("span",{children:"0:00"}),e.jsx("input",{type:"range",min:"0",max:"100",defaultValue:"22","aria-label":"Track progress"}),e.jsx("span",{children:"0:00"}),e.jsxs("span",{className:"gp-player-volume",children:[e.jsx($,{size:13}),e.jsx("input",{type:"range",min:"0",max:"100",defaultValue:"72","aria-label":"Volume"})]})]}),e.jsx("button",{className:"gp-player-close",type:"button",onClick:()=>k(!1),"aria-label":"Close media player",children:e.jsx(f,{size:14})})]}),!w&&e.jsx("button",{className:"gp-player-reopen",type:"button",onClick:()=>k(!0),"aria-label":"Open media player",children:e.jsx(V,{size:15})})]})}export{pe as GlassPortal};
