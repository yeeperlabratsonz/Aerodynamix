import{r as o,j as e}from"./index-DeIwXHh6.js";import{G as O}from"./gamepad-2-C3qiekpv.js";import{G as T}from"./grid-2x2-C4cn53wz.js";import{c as $,X as x,S as Y,P as j,V as _}from"./x-x2WjqxL_.js";import{S as q}from"./settings-wtCQMGMU.js";import{M as V,H as P}from"./menu-Cd_hz7dF.js";import{S as W}from"./sparkles-dgmfJBuQ.js";import{C as E}from"./chevron-left-HtsZJQFH.js";import{P as Q}from"./pause-D0iaVWME.js";import{C as J}from"./chevron-right-DRGgTUpK.js";const X=[["circle",{cx:"8",cy:"18",r:"4",key:"1fc0mg"}],["path",{d:"M12 18V2l7 4",key:"g04rme"}]],G=$("music-2",X);const K=[["path",{d:"M16.247 7.761a6 6 0 0 1 0 8.478",key:"1fwjs5"}],["path",{d:"M19.075 4.933a10 10 0 0 1 0 14.134",key:"ehdyv1"}],["path",{d:"M4.925 19.067a10 10 0 0 1 0-14.134",key:"1q22gi"}],["path",{d:"M7.753 16.239a6 6 0 0 1 0-8.478",key:"r2q7qm"}],["circle",{cx:"12",cy:"12",r:"2",key:"1c9p78"}]],U=$("radio",K),d="/__mockup/images/aerodynamix/",Z=[["run-3.jpg","Run 3","Action","fast"],["drive-mad.jpg","Drive Mad","Action","new"],["retro-bowl.jpg","Retro Bowl","Classic","hot"],["slope.jpg","Slope","Action","fast"],["mc.png","Minecraft","Chill","sandbox"],["supersmashflash.jpg","Super Smash Flash","Action","hot"],["papaspizzeria.png","Papa's Pizzeria","Chill","cozy"],["papasfreezeria.png","Papa's Freezeria","Chill","cozy"],["papas-pancakeria.png","Papa's Pancakeria","Chill","cozy"],["papas-bakeria.png","Papa's Bakeria","Chill","cozy"],["meat-boy.png","Meat Boy","Action","hard"],["newgrounds-rumble.png","Newgrounds Rumble","Action","arcade"],["we-become-what-we-behold.png","We Become What We Behold","Story","odd"],["bad-time-simulator.png","Bad Time Simulator","Action","hard"],["deltarune.png","Deltarune","Story","story"],["adventure-capitalist.png","Adventure Capitalist","Chill","idle"],["fridaynightfunkin.png","Friday Night Funkin'","Action","rhythm"],["run-2.png","Run 2","Classic","fast"],["picoschool.png","Pico's School","Story","odd"],["worldshardestgame.png","World's Hardest Game","Classic","hard"],["sandboxels.png","Sandboxels","Chill","sandbox"],["alien-hominid.png","Alien Hominid","Action","arcade"],["subway-surfers-sf.jpg","Subway Surfers San Francisco","Action","fast"],["hobo-1.png","Hobo 1","Classic","arcade"],["hobo-2.png","Hobo 2","Classic","arcade"],["hobo-3.png","Hobo 3","Classic","arcade"],["hobo-4.png","Hobo 4","Classic","arcade"],["hobo-5.png","Hobo 5","Classic","arcade"],["hobo-6.png","Hobo 6","Classic","arcade"],["hobo-7.png","Hobo 7","Classic","arcade"],["gladihoppers.jpg","Gladihoppers","Action","arcade"],["fruit-ninja.png","Fruit Ninja","Action","fast"],["binding-of-isaac.png","Binding of Isaac","Story","dark"],["crossy-road.png","Crossy Road","Classic","fast"],["cookie-clicker.png","Cookie Clicker","Chill","idle"],["duck-life.png","Duck Life","Chill","cozy"],["geometry-dash-lite.jpg","Geometry Dash Lite","Action","rhythm"],["doom.png","Doom","Action","classic"],["doki-doki-literature-club.jpg","Doki Doki Literature Club","Story","story"],["baldis-basics-classic-remastered.png","Baldi's Basics","Story","odd"],["stickmin-breaking-bank.jpg","Breaking the Bank","Story","odd"],["stickmin-escaping-prison.avif","Escaping the Prison","Story","story"],["stickmin-stealing-diamond.avif","Stealing the Diamond","Story","story"],["stickmin-infiltrating-airship.avif","Infiltrating the Airship","Story","story"],["stickmin-fleeing-complex.avif","Fleeing the Complex","Story","story"],["greatest-game-square.svg","The Greatest Game","Classic","wild"],["nubbys-number-factory.jpg","Nubby's Number Factory","Chill","odd"]],t=Z.map(([n,p,i,h])=>({file:n,name:p,genre:i,tag:h})),ee=[t[0],t[1],t[5],t[6],t[2],t[36]],ae=["All","Action","Chill","Classic","Story"],re=[{label:"Games",icon:O},{label:"Apps",icon:T},{label:"Media Player",icon:G},{label:"Connect",icon:U},{label:"Settings",icon:q}];function me(){const[n,p]=o.useState(""),[i,h]=o.useState("All"),[f,w]=o.useState("Games"),[g,C]=o.useState(!1),[s,F]=o.useState(!1),[m,R]=o.useState(["Run 3","Retro Bowl"]),[l,u]=o.useState(null),[y,z]=o.useState(t[0]),[b,N]=o.useState(!1),[B,S]=o.useState(!0),[H,L]=o.useState(72),v=o.useMemo(()=>{const a=n.trim().toLowerCase();return t.filter(r=>{const c=!a||r.name.toLowerCase().includes(a)||r.genre.toLowerCase().includes(a),k=i==="All"||r.genre===i,D=!s||m.includes(r.name);return c&&k&&D})},[i,m,n,s]),I=a=>{R(r=>r.includes(a)?r.filter(c=>c!==a):[...r,a])},A=a=>{z(a),u(a),N(!0)},M=a=>{const c=(t.findIndex(k=>k.name===y.name)+a+t.length)%t.length;z(t[c])};return e.jsxs("main",{className:"reference-arcade",children:[e.jsx("style",{children:`
        .reference-arcade {
          --ink: #08090b;
          --panel: #111317;
          --panel-hi: #191c20;
          --line: rgba(255,255,255,.105);
          --muted: #8c9199;
          --soft: #d8dce0;
          --acid: #b6ff6b;
          --acid-dim: rgba(182,255,107,.13);
          min-height: 100dvh;
          overflow: hidden;
          padding: 0 20px 108px;
          color: #f4f5f4;
          background-color: var(--ink);
          background-image:
            radial-gradient(circle at 11% 18%, rgba(255,255,255,.7) 0 1px, transparent 1.5px),
            radial-gradient(circle at 76% 21%, rgba(255,255,255,.38) 0 1px, transparent 1.5px),
            radial-gradient(circle at 88% 66%, rgba(255,255,255,.55) 0 1px, transparent 1.5px),
            radial-gradient(circle at 24% 72%, rgba(182,255,107,.3) 0 1px, transparent 1.5px),
            radial-gradient(circle at 56% 40%, rgba(255,255,255,.23) 0 1px, transparent 1.5px),
            radial-gradient(ellipse at 50% -30%, #1a1c20 0%, var(--ink) 58%);
          font-family: "Nunito Sans", "Avenir Next", "Trebuchet MS", sans-serif;
          letter-spacing: -.01em;
        }
        .reference-arcade *, .reference-arcade *::before, .reference-arcade *::after { box-sizing: border-box; }
        .reference-arcade button, .reference-arcade input { font: inherit; }
        .reference-arcade button { -webkit-tap-highlight-color: transparent; }
        .arcade-topbar {
          position: relative;
          z-index: 3;
          display: flex;
          align-items: center;
          justify-content: center;
          width: min(100%, 370px);
          height: 42px;
          margin: 0 auto;
          padding: 5px 8px;
          border: 1px solid rgba(255,255,255,.055);
          border-top: 0;
          border-radius: 0 0 16px 16px;
          background: rgba(24,26,28,.89);
          box-shadow: 0 12px 40px rgba(0,0,0,.3);
          backdrop-filter: blur(14px);
        }
        .arcade-brand {
          display: grid;
          place-items: center;
          width: 28px;
          height: 28px;
          margin-right: 7px;
          overflow: hidden;
          border-radius: 9px;
          background: #080909;
          color: var(--acid);
        }
        .arcade-brand img { width: 24px; height: 24px; object-fit: cover; opacity: .92; }
        .arcade-nav {
          display: flex;
          align-items: center;
          gap: 2px;
        }
        .arcade-nav button, .arcade-menu-button {
          display: inline-grid;
          place-items: center;
          width: 35px;
          height: 31px;
          border: 1px solid transparent;
          border-radius: 9px;
          color: #aeb3b9;
          background: transparent;
          cursor: pointer;
          transition: transform .18s ease, color .18s ease, background .18s ease;
        }
        .arcade-nav button:hover, .arcade-nav button:focus-visible,
        .arcade-menu-button:hover, .arcade-menu-button:focus-visible {
          color: #fff;
          background: rgba(255,255,255,.08);
          outline: none;
        }
        .arcade-nav button.active {
          color: var(--acid);
          background: var(--acid-dim);
        }
        .arcade-nav button.active::after {
          position: absolute;
          bottom: -1px;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: var(--acid);
          content: "";
        }
        .arcade-menu-button { display: none; margin-left: auto; }
        .arcade-nav-label {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          overflow: hidden;
          clip: rect(0,0,0,0);
          white-space: nowrap;
          border: 0;
        }
        .arcade-heading {
          margin: 23px auto 0;
          text-align: center;
        }
        .arcade-heading h1 {
          margin: 0;
          color: #f2f3f3;
          font-size: clamp(1.7rem, 4vw, 2.35rem);
          font-weight: 800;
          letter-spacing: -.055em;
          line-height: 1;
        }
        .arcade-heading p {
          margin: 10px 0 0;
          color: #9ba0a6;
          font-family: "Space Mono", ui-monospace, monospace;
          font-size: .61rem;
          letter-spacing: .025em;
        }
        .arcade-heading p strong { color: var(--acid); font-weight: 400; }
        .spotlight {
          display: flex;
          gap: 8px;
          width: min(100%, 600px);
          margin: 14px auto 0;
          padding: 7px;
          overflow-x: auto;
          border: 1px solid rgba(162,196,255,.13);
          border-radius: 12px;
          background: rgba(13,22,38,.75);
          scrollbar-width: none;
        }
        .spotlight::-webkit-scrollbar { display: none; }
        .spotlight-card {
          position: relative;
          display: block;
          flex: 0 0 78px;
          height: 54px;
          overflow: hidden;
          border: 0;
          border-radius: 7px;
          background: #262a31;
          cursor: pointer;
          transition: transform .2s ease, filter .2s ease;
        }
        .spotlight-card:hover, .spotlight-card:focus-visible { transform: translateY(-2px); filter: brightness(1.13); outline: 2px solid var(--acid); outline-offset: 2px; }
        .spotlight-card img { width: 100%; height: 100%; display: block; object-fit: cover; }
        .spotlight-card::after {
          position: absolute;
          right: 4px;
          bottom: 4px;
          display: grid;
          place-items: center;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          color: #071008;
          background: var(--acid);
          content: "›";
          font-size: 14px;
          font-weight: 900;
          opacity: 0;
          transform: translateY(3px);
          transition: transform .18s ease, opacity .18s ease;
        }
        .spotlight-card:hover::after, .spotlight-card:focus-visible::after { opacity: 1; transform: translateY(0); }
        .arcade-controls {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          gap: 9px;
          max-width: 700px;
          margin: 13px auto 0;
        }
        .arcade-search {
          display: flex;
          align-items: center;
          width: min(100%, 340px);
          height: 38px;
          padding: 0 13px;
          border: 1px solid rgba(255,255,255,.11);
          border-radius: 999px;
          background: rgba(13,14,16,.82);
          transition: border-color .2s ease, box-shadow .2s ease;
        }
        .arcade-search:focus-within { border-color: rgba(182,255,107,.7); box-shadow: 0 0 0 3px rgba(182,255,107,.08); }
        .arcade-search svg { flex: none; color: #848990; }
        .arcade-search input {
          width: 100%;
          min-width: 0;
          padding: 0 9px;
          border: 0;
          outline: 0;
          color: #f1f3f1;
          background: transparent;
          font-size: .78rem;
          text-align: center;
        }
        .arcade-search input::placeholder { color: #737980; }
        .saved-toggle {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          height: 34px;
          padding: 0 11px;
          border: 1px solid rgba(255,255,255,.12);
          border-radius: 999px;
          color: #9ca2a8;
          background: rgba(15,16,18,.76);
          cursor: pointer;
          font-size: .68rem;
          transition: color .2s ease, border-color .2s ease, background .2s ease;
        }
        .saved-toggle:hover, .saved-toggle:focus-visible, .saved-toggle.active { border-color: rgba(182,255,107,.58); color: var(--acid); background: var(--acid-dim); outline: none; }
        .category-row {
          display: flex;
          justify-content: center;
          gap: 4px;
          width: 100%;
          margin-top: 11px;
          overflow-x: auto;
          scrollbar-width: none;
        }
        .category-row::-webkit-scrollbar { display: none; }
        .category-button {
          flex: none;
          padding: 4px 9px;
          border: 0;
          border-radius: 999px;
          color: #70757b;
          background: transparent;
          cursor: pointer;
          font-size: .62rem;
          transition: color .18s ease, background .18s ease;
        }
        .category-button:hover, .category-button:focus-visible { color: #fff; outline: none; }
        .category-button.active { color: #10140c; background: var(--acid); font-weight: 800; }
        .library {
          width: min(100%, 804px);
          margin: 13px auto 0;
        }
        .library-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
          color: #737980;
          font-family: "Space Mono", ui-monospace, monospace;
          font-size: .57rem;
        }
        .library-meta strong { color: #d0d5d2; font-weight: 400; }
        .game-grid {
          display: grid;
          grid-template-columns: repeat(6, minmax(0, 1fr));
          gap: 9px;
        }
        .game-card {
          position: relative;
          aspect-ratio: 1;
          min-width: 0;
          overflow: hidden;
          border-radius: 9px;
          background: #17191d;
          box-shadow: 0 3px 0 rgba(255,255,255,.03);
          isolation: isolate;
        }
        .game-card img { display: block; width: 100%; height: 100%; object-fit: cover; transition: transform .25s ease, filter .25s ease; }
        .game-card::after {
          position: absolute;
          inset: 0;
          z-index: 1;
          background: linear-gradient(180deg, transparent 38%, rgba(5,7,8,.88) 100%);
          content: "";
          opacity: 0;
          transition: opacity .2s ease;
        }
        .game-card:hover img, .game-card:focus-within img { transform: scale(1.06); filter: saturate(1.08) brightness(.74); }
        .game-card:hover::after, .game-card:focus-within::after { opacity: 1; }
        .game-launch {
          position: absolute;
          inset: 0;
          z-index: 2;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          align-items: flex-start;
          width: 100%;
          padding: 9px;
          border: 0;
          color: #fff;
          background: transparent;
          text-align: left;
          cursor: pointer;
        }
        .game-name { max-width: calc(100% - 22px); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: .66rem; font-weight: 800; opacity: 0; transform: translateY(5px); transition: opacity .2s ease, transform .2s ease; }
        .game-genre { margin-top: 2px; color: var(--acid); font-family: "Space Mono", monospace; font-size: .47rem; text-transform: uppercase; opacity: 0; transform: translateY(5px); transition: opacity .2s ease .02s, transform .2s ease .02s; }
        .game-launch:hover .game-name, .game-launch:focus-visible .game-name, .game-launch:hover .game-genre, .game-launch:focus-visible .game-genre { opacity: 1; transform: translateY(0); }
        .game-launch:focus-visible { outline: 2px solid var(--acid); outline-offset: -3px; }
        .game-play {
          position: absolute;
          top: 9px;
          right: 9px;
          display: grid;
          place-items: center;
          width: 25px;
          height: 25px;
          border-radius: 50%;
          color: #0b100b;
          background: var(--acid);
          opacity: 0;
          transform: scale(.8);
          transition: opacity .2s ease, transform .2s ease;
        }
        .game-launch:hover .game-play, .game-launch:focus-visible .game-play { opacity: 1; transform: scale(1); }
        .favorite-button {
          position: absolute;
          z-index: 3;
          top: 7px;
          left: 7px;
          display: grid;
          place-items: center;
          width: 23px;
          height: 23px;
          border: 1px solid rgba(255,255,255,.18);
          border-radius: 50%;
          color: #fff;
          background: rgba(7,8,9,.55);
          cursor: pointer;
          opacity: 0;
          transition: opacity .2s ease, color .2s ease, background .2s ease;
        }
        .game-card:hover .favorite-button, .game-card:focus-within .favorite-button, .favorite-button.is-favorite { opacity: 1; }
        .favorite-button.is-favorite { color: #10140c; background: var(--acid); }
        .favorite-button:hover, .favorite-button:focus-visible { outline: 2px solid var(--acid); outline-offset: 1px; }
        .empty-library { grid-column: 1 / -1; padding: 40px 20px; border: 1px dashed rgba(255,255,255,.15); border-radius: 12px; color: #899097; text-align: center; font-size: .8rem; }
        .empty-library strong { display: block; margin-bottom: 4px; color: #f3f5f2; font-size: .95rem; }
        .arcade-player {
          position: fixed;
          z-index: 8;
          right: 14px;
          bottom: 13px;
          left: 14px;
          display: grid;
          grid-template-columns: minmax(160px, 1fr) auto minmax(160px, 1fr);
          align-items: center;
          gap: 16px;
          min-height: 59px;
          padding: 8px 12px;
          border: 1px solid rgba(255,255,255,.1);
          border-radius: 14px;
          background: rgba(22,24,27,.92);
          box-shadow: 0 12px 42px rgba(0,0,0,.45);
          backdrop-filter: blur(16px);
        }
        .track-meta { display: flex; align-items: center; gap: 9px; min-width: 0; }
        .track-art { width: 41px; height: 41px; flex: none; object-fit: cover; border-radius: 7px; }
        .track-copy { min-width: 0; }
        .track-title { overflow: hidden; color: #f4f5f3; text-overflow: ellipsis; white-space: nowrap; font-size: .7rem; font-weight: 800; }
        .track-subtitle { margin-top: 2px; color: #858b91; font-family: "Space Mono", monospace; font-size: .5rem; }
        .player-controls { display: flex; align-items: center; gap: 8px; }
        .player-controls button, .player-close {
          display: grid;
          place-items: center;
          width: 27px;
          height: 27px;
          border: 0;
          border-radius: 50%;
          color: #c5cbd0;
          background: transparent;
          cursor: pointer;
        }
        .player-controls button:hover, .player-controls button:focus-visible, .player-close:hover, .player-close:focus-visible { color: var(--acid); outline: none; }
        .player-controls .play-toggle { width: 32px; height: 32px; color: #0a1108; background: var(--acid); }
        .player-controls .play-toggle:hover, .player-controls .play-toggle:focus-visible { color: #0a1108; background: #d4ff9e; }
        .player-tools { display: flex; align-items: center; justify-content: flex-end; gap: 8px; color: #80868c; }
        .player-tools input { width: 76px; accent-color: var(--acid); cursor: pointer; }
        .player-time { font-family: "Space Mono", monospace; font-size: .5rem; }
        .player-close { margin-left: 3px; }
        .reopen-player { position: fixed; z-index: 8; right: 16px; bottom: 16px; display: grid; place-items: center; width: 42px; height: 42px; border: 1px solid rgba(182,255,107,.4); border-radius: 50%; color: #10150d; background: var(--acid); cursor: pointer; }
        .launch-modal-backdrop { position: fixed; z-index: 20; inset: 0; display: grid; place-items: center; padding: 20px; background: rgba(2,3,4,.78); backdrop-filter: blur(8px); }
        .launch-modal { position: relative; display: grid; grid-template-columns: 140px 1fr; gap: 18px; width: min(100%, 420px); padding: 14px; border: 1px solid rgba(182,255,107,.28); border-radius: 17px; background: #171a1c; box-shadow: 0 22px 80px rgba(0,0,0,.65); }
        .launch-modal img { width: 140px; aspect-ratio: 1; object-fit: cover; border-radius: 10px; }
        .launch-modal-copy { align-self: center; }
        .launch-modal-copy small { color: var(--acid); font-family: "Space Mono", monospace; font-size: .53rem; text-transform: uppercase; }
        .launch-modal-copy h2 { margin: 7px 0 5px; font-size: 1.28rem; letter-spacing: -.04em; }
        .launch-modal-copy p { margin: 0; color: #969da2; font-size: .69rem; line-height: 1.45; }
        .modal-launch { display: inline-flex; align-items: center; gap: 6px; margin-top: 14px; padding: 8px 12px; border: 0; border-radius: 8px; color: #10140c; background: var(--acid); cursor: pointer; font-size: .68rem; font-weight: 800; }
        .modal-close { position: absolute; top: 9px; right: 9px; display: grid; place-items: center; width: 25px; height: 25px; border: 0; border-radius: 50%; color: #bfc5c9; background: rgba(255,255,255,.08); cursor: pointer; }
        .modal-close:hover, .modal-close:focus-visible { color: #fff; outline: 2px solid var(--acid); }
        @media (max-width: 680px) {
          .reference-arcade { padding-right: 12px; padding-left: 12px; }
          .arcade-topbar { width: min(100%, 330px); }
          .arcade-nav { display: none; position: absolute; top: 47px; right: 0; left: 0; flex-wrap: wrap; justify-content: center; padding: 7px; border: 1px solid var(--line); border-radius: 13px; background: rgba(22,24,27,.98); box-shadow: 0 15px 32px rgba(0,0,0,.5); }
          .arcade-nav.open { display: flex; }
          .arcade-menu-button { display: inline-grid; }
          .arcade-heading { margin-top: 24px; }
          .spotlight { justify-content: flex-start; }
          .game-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 7px; }
          .arcade-player { grid-template-columns: 1fr auto; gap: 8px; }
          .player-tools { grid-column: 1 / -1; justify-content: space-between; padding: 0 3px; }
          .player-tools input { flex: 1; max-width: none; }
        }
        @media (max-width: 400px) {
          .game-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .spotlight-card { flex-basis: 72px; }
          .launch-modal { grid-template-columns: 95px 1fr; gap: 12px; }
          .launch-modal img { width: 95px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .reference-arcade *, .reference-arcade *::before, .reference-arcade *::after { transition-duration: .01ms !important; }
        }
      `}),e.jsxs("header",{className:"arcade-topbar",children:[e.jsx("button",{className:"arcade-brand",type:"button",onClick:()=>w("Games"),"aria-label":"Aerodynamix home",children:e.jsx("img",{src:`${d}logo.gif`,alt:"Aerodynamix"})}),e.jsx("nav",{className:`arcade-nav ${g?"open":""}`,"aria-label":"Aerodynamix navigation",children:re.map(({label:a,icon:r})=>e.jsxs("button",{className:f===a?"active":"",type:"button",onClick:()=>{w(a),C(!1)},"aria-label":a,"aria-pressed":f===a,children:[e.jsx(r,{size:17,strokeWidth:2.2}),e.jsx("span",{className:"arcade-nav-label",children:a})]},a))}),e.jsx("button",{className:"arcade-menu-button",type:"button",onClick:()=>C(a=>!a),"aria-expanded":g,"aria-label":g?"Close navigation":"Open navigation",children:g?e.jsx(x,{size:18}):e.jsx(V,{size:18})})]}),e.jsxs("section",{className:"arcade-heading","aria-labelledby":"arcade-title",children:[e.jsx("h1",{id:"arcade-title",children:f.toLowerCase()}),e.jsxs("p",{children:[e.jsx("strong",{children:"●"})," loaded ",t.length," games · local collection"]})]}),e.jsx("section",{className:"spotlight","aria-label":"Quick picks",children:ee.map(a=>e.jsx("button",{className:"spotlight-card",type:"button",onClick:()=>A(a),"aria-label":`Launch ${a.name}`,children:e.jsx("img",{src:`${d}${a.file}`,alt:a.name})},a.name))}),e.jsxs("section",{className:"arcade-controls","aria-label":"Find a game",children:[e.jsxs("label",{className:"arcade-search",children:[e.jsx(Y,{size:15,"aria-hidden":"true"}),e.jsx("input",{type:"search",value:n,onChange:a=>p(a.target.value),placeholder:"find what you want…","aria-label":"Find a game"}),n&&e.jsx("button",{type:"button",onClick:()=>p(""),"aria-label":"Clear search",children:e.jsx(x,{size:14})})]}),e.jsxs("button",{className:`saved-toggle ${s?"active":""}`,type:"button",onClick:()=>F(a=>!a),"aria-pressed":s,children:[e.jsx(P,{size:13,fill:s?"currentColor":"none"}),"saved ",m.length]})]}),e.jsx("div",{className:"category-row","aria-label":"Game categories",children:ae.map(a=>e.jsx("button",{className:`category-button ${i===a?"active":""}`,type:"button",onClick:()=>h(a),"aria-pressed":i===a,children:a},a))}),e.jsxs("section",{className:"library","aria-labelledby":"library-title",children:[e.jsxs("div",{className:"library-meta",children:[e.jsxs("span",{id:"library-title",children:[e.jsx("strong",{children:v.length})," results"]}),e.jsxs("span",{children:[e.jsx(W,{size:10,"aria-hidden":"true"})," picks for you"]})]}),e.jsx("div",{className:"game-grid",children:v.length?v.map(a=>{const r=m.includes(a.name);return e.jsxs("article",{className:"game-card",children:[e.jsx("img",{src:`${d}${a.file}`,alt:`${a.name} game artwork`,loading:"lazy"}),e.jsx("button",{className:`favorite-button ${r?"is-favorite":""}`,type:"button",onClick:()=>I(a.name),"aria-label":r?`Remove ${a.name} from saved games`:`Save ${a.name}`,"aria-pressed":r,children:e.jsx(P,{size:12,fill:r?"currentColor":"none"})}),e.jsxs("button",{className:"game-launch",type:"button",onClick:()=>A(a),"aria-label":`Launch ${a.name}`,children:[e.jsx("span",{className:"game-play",children:e.jsx(j,{size:11,fill:"currentColor"})}),e.jsx("span",{className:"game-name",children:a.name}),e.jsxs("span",{className:"game-genre",children:[a.genre," · ",a.tag]})]})]},a.name)}):e.jsxs("div",{className:"empty-library",children:[e.jsx("strong",{children:"nothing in this orbit"}),"Try another search or clear the saved filter."]})})]}),B?e.jsxs("aside",{className:"arcade-player","aria-label":"Persistent media player",children:[e.jsxs("div",{className:"track-meta",children:[e.jsx("img",{className:"track-art",src:`${d}${y.file}`,alt:""}),e.jsxs("div",{className:"track-copy",children:[e.jsx("div",{className:"track-title",children:y.name}),e.jsx("div",{className:"track-subtitle",children:b?"now playing locally":"media player · ready"})]})]}),e.jsxs("div",{className:"player-controls",children:[e.jsx("button",{type:"button",onClick:()=>M(-1),"aria-label":"Previous track",children:e.jsx(E,{size:17})}),e.jsx("button",{className:"play-toggle",type:"button",onClick:()=>N(a=>!a),"aria-label":b?"Pause":"Play",children:b?e.jsx(Q,{size:14,fill:"currentColor"}):e.jsx(j,{size:14,fill:"currentColor"})}),e.jsx("button",{type:"button",onClick:()=>M(1),"aria-label":"Next track",children:e.jsx(J,{size:17})})]}),e.jsxs("div",{className:"player-tools",children:[e.jsxs("span",{className:"player-time",children:[b?"0:18":"0:00"," / 2:47"]}),e.jsx(_,{size:14,"aria-hidden":"true"}),e.jsx("input",{type:"range",min:"0",max:"100",value:H,onChange:a=>L(Number(a.target.value)),"aria-label":"Volume"}),e.jsx("button",{className:"player-close",type:"button",onClick:()=>S(!1),"aria-label":"Close media player",children:e.jsx(x,{size:15})})]})]}):e.jsx("button",{className:"reopen-player",type:"button",onClick:()=>S(!0),"aria-label":"Open media player",children:e.jsx(G,{size:18})}),l&&e.jsx("div",{className:"launch-modal-backdrop",role:"presentation",onClick:()=>u(null),children:e.jsxs("section",{className:"launch-modal",role:"dialog","aria-modal":"true","aria-labelledby":"launch-title",onClick:a=>a.stopPropagation(),children:[e.jsx("img",{src:`${d}${l.file}`,alt:""}),e.jsxs("div",{className:"launch-modal-copy",children:[e.jsx("small",{children:"local launch ready"}),e.jsx("h2",{id:"launch-title",children:l.name}),e.jsxs("p",{children:[l.genre," · ",l.tag,e.jsx("br",{}),"No account. No waiting. Just play."]}),e.jsxs("button",{className:"modal-launch",type:"button",onClick:()=>u(null),children:[e.jsx(j,{size:13,fill:"currentColor"})," enter game"]})]}),e.jsx("button",{className:"modal-close",type:"button",onClick:()=>u(null),"aria-label":"Close launch dialog",children:e.jsx(x,{size:14})})]})})]})}export{me as ReferenceArcade};
