import{r as i,j as n}from"./index-DFVDn7O1.js";import{S as G}from"./settings-DKp7t7LX.js";import{X as w,P as N,S as L,V as I}from"./x-DsfhEe0S.js";import{M as $,H as F}from"./menu-D0sgf27C.js";import{C as S}from"./check-xcwN1ccB.js";import{Z as H}from"./zap-Cs9NGwiF.js";import{S as O}from"./sparkles-C6qXgTOV.js";import{S as T}from"./sliders-horizontal-CjUMQHQo.js";import{C as B}from"./chevron-left-xIZlUFhO.js";import{P as Y}from"./pause-B55YClLI.js";import{C as V}from"./chevron-right-DrteR-Fq.js";import{L as W}from"./layout-grid-CLsVTV9Z.js";const s="/__mockup/images/aerodynamix/",r=[{file:"run-3.jpg",name:"Run 3",category:"Arcade",signal:"98.4"},{file:"drive-mad.jpg",name:"Drive Mad",category:"Racing",signal:"91.7"},{file:"papaspizzeria.png",name:"Papa's Pizzeria",category:"Casual",signal:"86.3"},{file:"supersmashflash.jpg",name:"Super Smash Flash",category:"Action",signal:"83.9"}],c=[["run-3.jpg","Run 3","Arcade"],["drive-mad.jpg","Drive Mad","Racing"],["retro-bowl.jpg","Retro Bowl","Sports"],["slope.jpg","Slope","Arcade"],["mc.png","Minecraft","Sandbox"],["supersmashflash.jpg","Super Smash Flash","Action"],["papaspizzeria.png","Papa's Pizzeria","Casual"],["papasfreezeria.png","Papa's Freezeria","Casual"],["papas-pancakeria.png","Papa's Pancakeria","Casual"],["papas-bakeria.png","Papa's Bakeria","Casual"],["meat-boy.png","Meat Boy","Platformer"],["newgrounds-rumble.png","Newgrounds Rumble","Action"],["we-become-what-we-behold.png","We Become What We Behold","Puzzle"],["bad-time-simulator.png","Bad Time Simulator","Action"],["deltarune.png","Deltarune","RPG"],["adventure-capitalist.png","Adventure Capitalist","Strategy"],["fridaynightfunkin.png","Friday Night Funkin'","Rhythm"],["run-2.png","Run 2","Arcade"],["picoschool.png","Pico's School","Adventure"],["worldshardestgame.png","World's Hardest Game","Challenge"],["sandboxels.png","Sandboxels","Sandbox"],["alien-hominid.png","Alien Hominid","Action"],["subway-surfers-sf.jpg","Subway Surfers San Francisco","Arcade"],["hobo-1.png","Hobo 1","Action"],["hobo-2.png","Hobo 2","Action"],["hobo-3.png","Hobo 3","Action"],["hobo-4.png","Hobo 4","Action"],["hobo-5.png","Hobo 5","Action"],["hobo-6.png","Hobo 6","Action"],["hobo-7.png","Hobo 7","Action"],["gladihoppers.jpg","Gladihoppers","Action"],["fruit-ninja.png","Fruit Ninja","Arcade"],["binding-of-isaac.png","Binding of Isaac","RPG"],["crossy-road.png","Crossy Road","Arcade"],["cookie-clicker.png","Cookie Clicker","Idle"],["duck-life.png","Duck Life","Casual"],["geometry-dash-lite.jpg","Geometry Dash Lite","Rhythm"],["doom.png","Doom","Action"],["doki-doki-literature-club.jpg","Doki Doki Literature Club","RPG"],["baldis-basics-classic-remastered.png","Baldi's Basics Classic Remastered","Challenge"],["stickmin-breaking-bank.jpg","Breaking the Bank","Adventure"],["stickmin-escaping-prison.avif","Escaping the Prison","Adventure"],["stickmin-stealing-diamond.avif","Stealing the Diamond","Adventure"],["stickmin-infiltrating-airship.avif","Infiltrating the Airship","Adventure"],["stickmin-fleeing-complex.avif","Fleeing the Complex","Adventure"],["greatest-game-square.svg","The Greatest Game of All Time","Special"],["nubbys-number-factory.jpg","Nubby's Number Factory","Strategy"]],K=["All","Arcade","Action","Casual","Adventure","Challenge"];function on(){const[g,z]=i.useState(""),[l,C]=i.useState("All"),[p,A]=i.useState(!1),[m,M]=i.useState(["Run 3","Deltarune"]),[v,x]=i.useState("Run 3"),[o,y]=i.useState(!1),[h,j]=i.useState(!0),[P,R]=i.useState(72),[b,D]=i.useState(!1),u=i.useMemo(()=>c.filter(([,e,a])=>e.toLowerCase().includes(g.toLowerCase())&&(l==="All"||a===l)),[l,g]),E=e=>{M(a=>a.includes(e)?a.filter(d=>d!==e):[...a,e])},t=e=>{x(e),y(!0)};return n.jsxs("main",{className:"neon-network",children:[n.jsx("style",{children:`
        .neon-network {
          --nn-bg: #070d19;
          --nn-panel: #0c1526;
          --nn-panel-2: #111e32;
          --nn-line: rgba(143, 192, 225, .16);
          --nn-muted: #8292a8;
          --nn-copy: #e8f3f6;
          --nn-cyan: #68e6df;
          --nn-lime: #c7ee65;
          --nn-coral: #ff7e67;
          min-height: 100vh;
          overflow-x: hidden;
          color: var(--nn-copy);
          background:
            radial-gradient(circle at 77% 14%, rgba(39, 111, 130, .17), transparent 25rem),
            radial-gradient(circle at 15% 38%, rgba(44, 71, 120, .14), transparent 30rem),
            var(--nn-bg);
          font-family: "DM Sans", "Trebuchet MS", sans-serif;
          padding-bottom: ${h?"92px":"24px"};
        }
        .neon-network *, .neon-network *::before, .neon-network *::after { box-sizing: border-box; }
        .nn-noise {
          position: fixed; inset: 0; z-index: 0; pointer-events: none; opacity: .035;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 140 140' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.5'/%3E%3C/svg%3E");
        }
        .nn-shell { position: relative; z-index: 1; width: min(1180px, 100%); margin: 0 auto; padding: 0 28px; }
        .nn-topbar {
          position: sticky; top: 0; z-index: 20; height: 70px; display: flex; align-items: center;
          gap: 26px; border-bottom: 1px solid var(--nn-line); background: rgba(7, 13, 25, .86);
          backdrop-filter: blur(18px); 
        }
        .nn-topbar-inner { display: flex; align-items: center; width: 100%; gap: 26px; }
        .nn-brand { display: flex; align-items: center; gap: 10px; color: var(--nn-copy); text-decoration: none; min-width: max-content; }
        .nn-logo { width: 35px; height: 35px; border-radius: 10px; object-fit: cover; background: #050a12; border: 1px solid rgba(104, 230, 223, .35); box-shadow: 0 0 22px rgba(104, 230, 223, .12); }
        .nn-brand-word { font-size: 14px; font-weight: 800; letter-spacing: .17em; }
        .nn-brand-word b { color: var(--nn-cyan); font-weight: 800; }
        .nn-nav { display: flex; align-items: center; gap: 4px; flex: 1; }
        .nn-nav button, .nn-settings {
          border: 0; color: var(--nn-muted); background: transparent; border-radius: 8px; padding: 9px 12px;
          font: 700 11px "DM Sans", sans-serif; letter-spacing: .05em; cursor: pointer; transition: color .2s, background .2s, transform .2s;
        }
        .nn-nav button:hover, .nn-nav button.active, .nn-settings:hover { color: var(--nn-copy); background: rgba(104, 230, 223, .1); }
        .nn-nav button.active { box-shadow: inset 0 -2px var(--nn-cyan); }
        .nn-settings { display: inline-flex; align-items: center; gap: 7px; min-width: max-content; }
        .nn-menu { display: none; margin-left: auto; }
        .nn-menu button { display: inline-flex; gap: 7px; align-items: center; color: var(--nn-copy); background: var(--nn-panel-2); border: 1px solid var(--nn-line); border-radius: 8px; padding: 9px 11px; font: 700 11px "DM Sans"; }
        .nn-intro { display: grid; grid-template-columns: minmax(0, 1fr) 310px; gap: 18px; padding: 34px 0 20px; }
        .nn-kicker { display: flex; align-items: center; gap: 8px; color: var(--nn-lime); font: 700 10px "Space Mono", monospace; letter-spacing: .11em; text-transform: uppercase; }
        .nn-kicker i { display: block; width: 7px; height: 7px; border-radius: 50%; background: var(--nn-lime); box-shadow: 0 0 12px var(--nn-lime); }
        .nn-title { margin: 12px 0 10px; font-size: clamp(32px, 5.2vw, 66px); line-height: .96; letter-spacing: -.065em; font-weight: 800; max-width: 650px; }
        .nn-title em { color: var(--nn-cyan); font-style: normal; }
        .nn-subtitle { margin: 0; color: var(--nn-muted); max-width: 480px; font-size: 14px; line-height: 1.55; }
        .nn-scan { display: inline-flex; align-items: center; gap: 10px; margin-top: 21px; padding: 11px 15px; border: 1px solid rgba(199,238,101,.42); border-radius: 8px; color: var(--nn-lime); background: rgba(199,238,101,.08); font: 800 11px "Space Mono", monospace; cursor: pointer; transition: background .2s, transform .2s, border-color .2s; }
        .nn-scan:hover { background: rgba(199,238,101,.15); border-color: var(--nn-lime); transform: translateY(-2px); }
        .nn-scan.done { color: var(--nn-cyan); border-color: rgba(104,230,223,.45); background: rgba(104,230,223,.08); }
        .nn-status-panel { border: 1px solid var(--nn-line); background: linear-gradient(145deg, rgba(17,30,50,.95), rgba(9,17,31,.92)); border-radius: 12px; padding: 16px; align-self: end; }
        .nn-status-head { display: flex; justify-content: space-between; color: var(--nn-muted); font: 700 10px "Space Mono", monospace; letter-spacing: .08em; text-transform: uppercase; }
        .nn-status-head span:last-child { color: var(--nn-lime); }
        .nn-readout { display: flex; align-items: end; gap: 12px; margin: 16px 0 12px; }
        .nn-readout strong { font-size: 37px; line-height: .9; letter-spacing: -.06em; }
        .nn-readout span { color: var(--nn-muted); font: 11px "Space Mono", monospace; padding-bottom: 3px; }
        .nn-meter { height: 5px; overflow: hidden; background: #1d2a3d; border-radius: 3px; }
        .nn-meter i { display: block; width: 82%; height: 100%; background: var(--nn-cyan); box-shadow: 0 0 13px rgba(104,230,223,.75); border-radius: inherit; }
        .nn-status-foot { display: flex; justify-content: space-between; margin-top: 10px; color: var(--nn-muted); font: 10px "Space Mono", monospace; }
        .nn-status-foot b { color: var(--nn-copy); font-weight: 400; }
        .nn-network-map { position: relative; display: grid; grid-template-columns: 1.5fr 1fr 1fr; gap: 12px; min-height: 282px; margin: 4px 0 34px; padding: 14px; overflow: hidden; border: 1px solid var(--nn-line); border-radius: 14px; background: linear-gradient(135deg, rgba(11, 24, 42, .93), rgba(8, 14, 27, .95)); }
        .nn-map-lines { position: absolute; inset: 0; pointer-events: none; opacity: .4; background-image: linear-gradient(27deg, transparent 48%, rgba(104,230,223,.26) 49%, transparent 50%), linear-gradient(153deg, transparent 47%, rgba(199,238,101,.17) 48%, transparent 49%), linear-gradient(90deg, transparent 49.8%, rgba(104,230,223,.1) 50%, transparent 50.2%); background-size: 240px 170px, 260px 190px, 180px 100%; }
        .nn-map-label { position: absolute; top: 14px; left: 16px; z-index: 1; color: var(--nn-muted); font: 10px "Space Mono", monospace; letter-spacing: .09em; }
        .nn-map-label b { color: var(--nn-cyan); font-weight: 400; }
        .nn-featured-node { position: relative; z-index: 1; align-self: end; min-width: 0; border-radius: 10px; overflow: hidden; cursor: pointer; border: 1px solid rgba(104,230,223,.55); box-shadow: 0 0 0 1px rgba(104,230,223,.08), 0 14px 38px rgba(0,0,0,.24); transition: transform .25s, border-color .25s; }
        .nn-featured-node:hover { transform: translateY(-4px); border-color: var(--nn-cyan); }
        .nn-featured-node img { display: block; width: 100%; height: 248px; object-fit: cover; filter: saturate(.9); }
        .nn-featured-node::after { content: ""; position: absolute; inset: 45% 0 0; background: linear-gradient(transparent, rgba(4,10,18,.95)); }
        .nn-node-copy { position: absolute; z-index: 2; right: 15px; bottom: 13px; left: 15px; display: flex; align-items: end; justify-content: space-between; gap: 12px; }
        .nn-node-copy h2 { margin: 0; font-size: 20px; letter-spacing: -.04em; }
        .nn-node-copy small { display: block; margin-top: 4px; color: var(--nn-cyan); font: 10px "Space Mono", monospace; }
        .nn-launch { display: inline-flex; flex: 0 0 auto; align-items: center; justify-content: center; width: 34px; height: 34px; border: 0; border-radius: 50%; color: #071019; background: var(--nn-lime); cursor: pointer; }
        .nn-mini-nodes { position: relative; z-index: 1; display: grid; grid-template-rows: 1fr 1fr; gap: 12px; }
        .nn-mini-card { position: relative; display: flex; align-items: end; min-height: 0; overflow: hidden; border: 1px solid var(--nn-line); border-radius: 10px; cursor: pointer; transition: transform .25s, border-color .25s; }
        .nn-mini-card:hover { transform: translateY(-3px); border-color: rgba(104,230,223,.6); }
        .nn-mini-card img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: .76; transition: transform .3s, opacity .3s; }
        .nn-mini-card:hover img { transform: scale(1.06); opacity: .92; }
        .nn-mini-card::after { content: ""; position: absolute; inset: 25% 0 0; background: linear-gradient(transparent, rgba(5,11,20,.96)); }
        .nn-mini-copy { position: relative; z-index: 1; padding: 12px; }
        .nn-mini-copy h3 { margin: 0; font-size: 14px; letter-spacing: -.02em; }
        .nn-mini-copy span { color: var(--nn-muted); font: 9px "Space Mono", monospace; }
        .nn-map-aside { position: relative; z-index: 1; display: flex; flex-direction: column; justify-content: space-between; padding: 32px 10px 10px; }
        .nn-map-aside h3 { margin: 0; max-width: 150px; font-size: 23px; line-height: 1.02; letter-spacing: -.05em; }
        .nn-map-aside p { margin: 8px 0 0; color: var(--nn-muted); font-size: 11px; line-height: 1.45; }
        .nn-route { display: flex; align-items: center; gap: 7px; color: var(--nn-lime); font: 10px "Space Mono", monospace; }
        .nn-route::before { content: ""; width: 28px; height: 1px; background: var(--nn-lime); box-shadow: 0 0 8px var(--nn-lime); }
        .nn-section-bar { display: flex; align-items: end; justify-content: space-between; gap: 16px; margin-bottom: 15px; }
        .nn-section-bar h2 { margin: 0; font-size: 24px; letter-spacing: -.05em; }
        .nn-section-bar p { margin: 5px 0 0; color: var(--nn-muted); font-size: 11px; }
        .nn-library-meta { color: var(--nn-muted); font: 10px "Space Mono", monospace; }
        .nn-toolbar { display: flex; align-items: center; gap: 10px; margin-bottom: 18px; }
        .nn-search { display: flex; align-items: center; flex: 1; gap: 10px; max-width: 410px; padding: 0 12px; border: 1px solid var(--nn-line); border-radius: 8px; background: rgba(17,30,50,.7); color: var(--nn-muted); transition: border-color .2s, background .2s; }
        .nn-search:focus-within { border-color: rgba(104,230,223,.6); background: rgba(17,30,50,.96); }
        .nn-search input { width: 100%; padding: 11px 0; border: 0; outline: 0; color: var(--nn-copy); background: transparent; font: 12px "DM Sans", sans-serif; }
        .nn-search input::placeholder { color: #65748b; }
        .nn-filter { display: flex; gap: 5px; overflow-x: auto; scrollbar-width: none; }
        .nn-filter::-webkit-scrollbar { display: none; }
        .nn-filter button { flex: 0 0 auto; border: 1px solid transparent; border-radius: 7px; padding: 8px 10px; color: var(--nn-muted); background: transparent; font: 700 10px "Space Mono", monospace; cursor: pointer; transition: color .2s, border-color .2s, background .2s; }
        .nn-filter button:hover, .nn-filter button.active { color: var(--nn-cyan); border-color: rgba(104,230,223,.3); background: rgba(104,230,223,.07); }
        .nn-grid { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 10px; padding-bottom: 28px; }
        .nn-game { position: relative; min-width: 0; overflow: hidden; aspect-ratio: 1 / 1; border: 1px solid var(--nn-line); border-radius: 9px; background: var(--nn-panel); cursor: pointer; transition: transform .24s, border-color .24s, box-shadow .24s; }
        .nn-game:hover, .nn-game:focus-within { transform: translateY(-4px); border-color: rgba(104,230,223,.65); box-shadow: 0 12px 30px rgba(0,0,0,.26); }
        .nn-game:first-child { grid-column: span 2; grid-row: span 2; }
        .nn-game img { display: block; width: 100%; height: 100%; object-fit: cover; transition: transform .3s, filter .3s; }
        .nn-game:hover img { transform: scale(1.07); filter: brightness(.74) saturate(1.12); }
        .nn-game::after { content: ""; position: absolute; right: 0; bottom: 0; left: 0; height: 55%; background: linear-gradient(transparent, rgba(4,9,17,.95)); pointer-events: none; }
        .nn-game-info { position: absolute; z-index: 2; right: 9px; bottom: 9px; left: 9px; display: flex; align-items: end; justify-content: space-between; gap: 5px; }
        .nn-game-info h3 { margin: 0; overflow: hidden; color: #f2f8f7; font-size: 11px; line-height: 1.1; text-overflow: ellipsis; white-space: nowrap; }
        .nn-game-info span { display: block; margin-top: 4px; color: var(--nn-cyan); font: 8px "Space Mono", monospace; }
        .nn-fav { display: grid; flex: 0 0 auto; place-items: center; width: 25px; height: 25px; border: 1px solid rgba(255,255,255,.18); border-radius: 7px; color: #d9e4e7; background: rgba(7,13,25,.62); cursor: pointer; opacity: 0; transition: opacity .2s, color .2s, background .2s; }
        .nn-game:hover .nn-fav, .nn-fav.saved { opacity: 1; }
        .nn-fav.saved { color: var(--nn-coral); background: rgba(255,126,103,.12); }
        .nn-empty { grid-column: 1 / -1; padding: 40px 20px; border: 1px dashed var(--nn-line); border-radius: 12px; color: var(--nn-muted); text-align: center; font-size: 13px; }
        .nn-player { position: fixed; z-index: 30; right: 0; bottom: 0; left: 0; border-top: 1px solid rgba(104,230,223,.22); background: rgba(8,16,29,.94); backdrop-filter: blur(18px); box-shadow: 0 -10px 32px rgba(0,0,0,.22); }
        .nn-player-inner { display: grid; grid-template-columns: minmax(180px, 1.1fr) auto minmax(180px, 1fr); align-items: center; gap: 22px; min-height: 76px; }
        .nn-track { display: flex; align-items: center; gap: 10px; min-width: 0; }
        .nn-track-art { width: 44px; height: 44px; flex: 0 0 auto; object-fit: cover; border-radius: 7px; border: 1px solid rgba(104,230,223,.3); }
        .nn-track-meta { min-width: 0; }
        .nn-track-meta strong, .nn-track-meta span { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .nn-track-meta strong { font-size: 12px; }
        .nn-track-meta span { margin-top: 3px; color: var(--nn-muted); font: 9px "Space Mono", monospace; }
        .nn-live { margin-left: auto; padding: 4px 6px; border-radius: 4px; color: var(--nn-lime); background: rgba(199,238,101,.1); font: 9px "Space Mono", monospace; }
        .nn-controls { display: flex; align-items: center; gap: 13px; }
        .nn-player button { display: inline-grid; place-items: center; border: 0; color: var(--nn-muted); background: transparent; cursor: pointer; transition: color .2s, transform .2s; }
        .nn-player button:hover { color: var(--nn-copy); transform: translateY(-1px); }
        .nn-play { width: 38px; height: 38px; border-radius: 50% !important; color: #071019 !important; background: var(--nn-lime) !important; }
        .nn-progress { display: flex; align-items: center; justify-content: end; gap: 9px; color: var(--nn-muted); font: 9px "Space Mono", monospace; }
        .nn-progress input { accent-color: var(--nn-cyan); width: 100px; }
        .nn-close { margin-left: 4px; }
        @media (max-width: 760px) {
          .nn-shell { padding: 0 15px; }
          .nn-topbar { height: 62px; }
          .nn-topbar-inner { gap: 12px; }
          .nn-brand-word { font-size: 12px; }
          .nn-nav { position: absolute; top: 58px; right: 15px; left: 15px; display: ${p?"flex":"none"}; flex-direction: column; align-items: stretch; padding: 7px; border: 1px solid var(--nn-line); border-radius: 10px; background: #0b1729; box-shadow: 0 18px 35px rgba(0,0,0,.4); }
          .nn-nav button { text-align: left; }
          .nn-settings { display: none; }
          .nn-menu { display: block; }
          .nn-intro { grid-template-columns: 1fr; gap: 16px; padding-top: 26px; }
          .nn-title { font-size: clamp(38px, 13vw, 58px); }
          .nn-status-panel { max-width: none; }
          .nn-network-map { grid-template-columns: 1.35fr 1fr; min-height: 260px; }
          .nn-map-aside { display: none; }
          .nn-featured-node img { height: 225px; }
          .nn-toolbar { align-items: stretch; flex-direction: column; }
          .nn-search { max-width: none; }
          .nn-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
          .nn-game:first-child { grid-column: span 2; grid-row: span 2; }
          .nn-player-inner { grid-template-columns: 1fr auto; gap: 10px; min-height: 68px; }
          .nn-progress { grid-column: 1 / -1; display: none; }
          .nn-player { padding: 0; }
          .nn-track-art { width: 38px; height: 38px; }
          .nn-live { display: none; }
        }
        @media (max-width: 450px) {
          .nn-brand-word { letter-spacing: .1em; }
          .nn-network-map { display: flex; flex-direction: column; min-height: 0; padding: 12px; }
          .nn-featured-node img { height: 214px; }
          .nn-mini-nodes { grid-template-columns: 1fr 1fr; grid-template-rows: 110px; }
          .nn-game-info h3 { font-size: 9px; }
          .nn-game-info span { display: none; }
          .nn-fav { width: 22px; height: 22px; }
          .nn-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .nn-game:first-child { grid-column: span 2; grid-row: span 2; }
          .nn-controls { gap: 7px; }
        }
      `}),n.jsx("div",{className:"nn-noise"}),n.jsx("header",{className:"nn-topbar",children:n.jsxs("div",{className:"nn-shell nn-topbar-inner",children:[n.jsxs("button",{className:"nn-brand",type:"button",onClick:()=>window.scrollTo({top:0,behavior:"smooth"}),children:[n.jsx("img",{className:"nn-logo",src:`${s}logo.gif`,alt:"Aerodynamix"}),n.jsxs("span",{className:"nn-brand-word",children:[n.jsx("b",{children:"A"}),"ERODYNAMIX"]})]}),n.jsx("nav",{className:"nn-nav","aria-label":"Aerodynamix navigation",children:["Games","Apps","Media Player","Connect"].map((e,a)=>n.jsx("button",{className:a===0?"active":"",type:"button",children:e},e))}),n.jsxs("button",{className:"nn-settings",type:"button",children:[n.jsx(G,{size:14})," Settings"]}),n.jsx("div",{className:"nn-menu",children:n.jsxs("button",{type:"button",onClick:()=>A(e=>!e),"aria-expanded":p,children:[p?n.jsx(w,{size:14}):n.jsx($,{size:14})," ",p?"Close":"Menu"]})})]})}),n.jsxs("div",{className:"nn-shell",children:[n.jsxs("section",{className:"nn-intro","aria-labelledby":"network-title",children:[n.jsxs("div",{children:[n.jsxs("div",{className:"nn-kicker",children:[n.jsx("i",{})," Network online / 04:12:08 ",n.jsx(S,{size:12})]}),n.jsxs("h1",{className:"nn-title",id:"network-title",children:["Find your next",n.jsx("br",{}),n.jsx("em",{children:"instant launch."})]}),n.jsx("p",{className:"nn-subtitle",children:"A private arcade of sharp little worlds. Scan the network, save what catches, and launch without the detour."}),n.jsxs("button",{className:`nn-scan ${b?"done":""}`,type:"button",onClick:()=>D(!0),children:[b?n.jsx(S,{size:15}):n.jsx(H,{size:15})," ",b?"NETWORK SCANNED":"SCAN FOR SIGNALS"]})]}),n.jsxs("aside",{className:"nn-status-panel","aria-label":"Network status",children:[n.jsxs("div",{className:"nn-status-head",children:[n.jsx("span",{children:"Collection status"}),n.jsx("span",{children:"Live"})]}),n.jsxs("div",{className:"nn-readout",children:[n.jsx("strong",{children:"47"}),n.jsxs("span",{children:["games",n.jsx("br",{}),"indexed"]})]}),n.jsx("div",{className:"nn-meter",children:n.jsx("i",{})}),n.jsxs("div",{className:"nn-status-foot",children:[n.jsx("span",{children:"Availability"}),n.jsx("b",{children:"100% local"})]})]})]}),n.jsxs("section",{className:"nn-network-map","aria-labelledby":"spotlight-heading",children:[n.jsx("div",{className:"nn-map-lines"}),n.jsxs("div",{className:"nn-map-label",children:[n.jsx("b",{children:"SPOTLIGHT /"})," HIGH SIGNAL ROUTES"]}),n.jsxs("article",{className:"nn-featured-node",onClick:()=>t(r[0].name),tabIndex:0,role:"button",onKeyDown:e=>e.key==="Enter"&&t(r[0].name),children:[n.jsx("img",{src:`${s}${r[0].file}`,alt:r[0].name}),n.jsxs("div",{className:"nn-node-copy",children:[n.jsxs("div",{children:[n.jsx("h2",{id:"spotlight-heading",children:r[0].name}),n.jsxs("small",{children:[r[0].category," / SIGNAL ",r[0].signal]})]}),n.jsx("button",{className:"nn-launch",type:"button","aria-label":`Launch ${r[0].name}`,onClick:e=>{e.stopPropagation(),t(r[0].name)},children:n.jsx(N,{size:15,fill:"currentColor"})})]})]}),n.jsx("div",{className:"nn-mini-nodes",children:r.slice(1,3).map(e=>n.jsxs("article",{className:"nn-mini-card",onClick:()=>t(e.name),tabIndex:0,role:"button",onKeyDown:a=>a.key==="Enter"&&t(e.name),children:[n.jsx("img",{src:`${s}${e.file}`,alt:e.name}),n.jsxs("div",{className:"nn-mini-copy",children:[n.jsx("h3",{children:e.name}),n.jsxs("span",{children:[e.category," / ",e.signal]})]})]},e.name))}),n.jsxs("div",{className:"nn-map-aside",children:[n.jsxs("div",{children:[n.jsxs("div",{className:"nn-kicker",children:[n.jsx(O,{size:12})," New route"]}),n.jsx("h3",{children:"One clean path to play."}),n.jsx("p",{children:"Every node is ready when you are. No accounts, no waiting room."})]}),n.jsx("div",{className:"nn-route",children:"ROUTE READY"})]})]}),n.jsxs("section",{"aria-labelledby":"library-heading",children:[n.jsxs("div",{className:"nn-section-bar",children:[n.jsxs("div",{children:[n.jsx("h2",{id:"library-heading",children:"Game library"}),n.jsx("p",{children:"Browse the full collection by signal type."})]}),n.jsxs("span",{className:"nn-library-meta",children:[u.length.toString().padStart(2,"0")," / ",c.length," NODES"]})]}),n.jsxs("div",{className:"nn-toolbar",children:[n.jsxs("label",{className:"nn-search",children:[n.jsx(L,{size:16}),n.jsx("input",{type:"search",value:g,onChange:e=>z(e.target.value),placeholder:"Search the network","aria-label":"Search games"})]}),n.jsx("div",{className:"nn-filter","aria-label":"Filter games",children:K.map(e=>n.jsx("button",{type:"button",className:l===e?"active":"",onClick:()=>C(e),children:e},e))}),n.jsx("button",{type:"button","aria-label":"Library view options",className:"nn-settings",children:n.jsx(T,{size:15})})]}),n.jsx("div",{className:"nn-grid",children:u.length?u.map(([e,a,d],k)=>n.jsxs("article",{className:"nn-game",onClick:()=>t(a),tabIndex:0,role:"button",onKeyDown:f=>f.key==="Enter"&&t(a),children:[n.jsx("img",{src:`${s}${e}`,alt:a,loading:k>5?"lazy":"eager"}),n.jsxs("div",{className:"nn-game-info",children:[n.jsxs("div",{children:[n.jsx("h3",{children:a}),n.jsx("span",{children:d})]}),n.jsx("button",{type:"button",className:`nn-fav ${m.includes(a)?"saved":""}`,"aria-label":`${m.includes(a)?"Remove":"Save"} ${a}`,onClick:f=>{f.stopPropagation(),E(a)},children:n.jsx(F,{size:13,fill:m.includes(a)?"currentColor":"none"})})]})]},e)):n.jsx("div",{className:"nn-empty",children:"No nodes match that scan. Try another title or signal type."})})]})]}),h&&n.jsx("aside",{className:"nn-player","aria-label":"Persistent media player",children:n.jsxs("div",{className:"nn-shell nn-player-inner",children:[n.jsxs("div",{className:"nn-track",children:[n.jsx("img",{className:"nn-track-art",src:`${s}${(c.find(([,e])=>e===v)??c[0])[0]}`,alt:""}),n.jsxs("div",{className:"nn-track-meta",children:[n.jsx("strong",{children:v}),n.jsx("span",{children:o?"Launch signal active":"Ready to launch"})]}),n.jsx("span",{className:"nn-live",children:o?"LIVE":"READY"})]}),n.jsxs("div",{className:"nn-controls",children:[n.jsx("button",{type:"button","aria-label":"Previous game",onClick:()=>x(r[0].name),children:n.jsx(B,{size:17})}),n.jsx("button",{className:"nn-play",type:"button","aria-label":o?"Pause":"Play",onClick:()=>y(e=>!e),children:o?n.jsx(Y,{size:16,fill:"currentColor"}):n.jsx(N,{size:16,fill:"currentColor"})}),n.jsx("button",{type:"button","aria-label":"Next game",onClick:()=>x(r[1].name),children:n.jsx(V,{size:17})})]}),n.jsxs("div",{className:"nn-progress",children:[n.jsxs("span",{children:[o?"0:12":"0:00"," / 0:45"]}),n.jsx("input",{type:"range",min:"0",max:"100",defaultValue:"24","aria-label":"Track progress"}),n.jsx(I,{size:14}),n.jsx("input",{type:"range",min:"0",max:"100",value:P,onChange:e=>R(Number(e.target.value)),"aria-label":"Volume"}),n.jsx("button",{className:"nn-close",type:"button","aria-label":"Close player",onClick:()=>j(!1),children:n.jsx(w,{size:15})})]})]})}),!h&&n.jsx("button",{type:"button",onClick:()=>j(!0),style:{position:"fixed",right:16,bottom:16,zIndex:30,display:"grid",placeItems:"center",width:42,height:42,border:"1px solid rgba(104,230,223,.45)",borderRadius:"50%",color:"#071019",background:"#c7ee65",cursor:"pointer"},"aria-label":"Open media player",children:n.jsx(W,{size:17})})]})}export{on as NeonNetwork};
