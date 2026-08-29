import{r as o,j as e}from"./index-DDtURTn1.js";const x=[{id:"wake",label:"Wake cabinet",code:"A-01"},{id:"index",label:"Index collection",code:"A-02"},{id:"calibrate",label:"Calibrate controls",code:"A-03"},{id:"link",label:"Open player link",code:"A-04"}];function v(t){return t>=100?"ready":t>=74?"link":t>=49?"calibrate":t>=23?"index":"wake"}function k(){const[t,s]=o.useState(0),[f,b]=o.useState(0),[u,d]=o.useState(!1),[m,h]=o.useState(!1);o.useEffect(()=>{const i=window.matchMedia("(prefers-reduced-motion: reduce)"),a=()=>h(i.matches);return a(),i.addEventListener?.("change",a),()=>i.removeEventListener?.("change",a)},[]),o.useEffect(()=>{if(s(0),d(!1),m){const r=window.setTimeout(()=>s(100),120);return()=>window.clearTimeout(r)}const i=performance.now();let a;const c=window.setInterval(()=>{const r=performance.now()-i,p=Math.min(100,Math.round(r/4050*100));s(p),p>=100&&(window.clearInterval(c),a=window.setTimeout(()=>d(!0),1050))},42);return()=>{window.clearInterval(c),a&&window.clearTimeout(a)}},[m,f]);const l=o.useMemo(()=>v(t),[t]),n=l==="ready",y=()=>{s(0),d(!1),b(i=>i+1)};return e.jsxs("main",{className:`arcade-ignition ${n?"is-ready":""} ${u?"is-settled":""}`,"aria-label":"Aerodynamix arcade ignition boot screen",children:[e.jsx("style",{children:`
        .arcade-ignition {
          --cabinet: #07151b;
          --cabinet-deep: #040d12;
          --panel: #0c2228;
          --panel-lift: #12343a;
          --line: rgba(166, 233, 218, .17);
          --ink: #e2f5e7;
          --muted: #789a98;
          --signal: #d7ff59;
          --signal-dim: rgba(215, 255, 89, .12);
          --heat: #ff9855;
          --cyan: #78e5e0;
          position: relative;
          isolation: isolate;
          display: grid;
          min-height: 100dvh;
          overflow: hidden;
          color: var(--ink);
          background:
            radial-gradient(ellipse at 50% 40%, rgba(31, 111, 113, .2), transparent 47%),
            radial-gradient(ellipse at 50% 120%, rgba(215, 255, 89, .12), transparent 48%),
            var(--cabinet);
          font-family: "Space Grotesk", "Avenir Next", sans-serif;
        }
        .arcade-ignition *, .arcade-ignition *::before, .arcade-ignition *::after { box-sizing: border-box; }
        .arcade-ignition::before {
          position: absolute;
          z-index: -1;
          inset: 0;
          opacity: .22;
          background: repeating-linear-gradient(0deg, transparent 0 3px, rgba(220,255,236,.055) 3px 4px);
          content: "";
          pointer-events: none;
        }
        .arcade-ignition::after {
          position: absolute;
          z-index: 0;
          inset: 0;
          opacity: .2;
          background-image: radial-gradient(rgba(215,255,89,.5) .6px, transparent .8px);
          background-size: 19px 19px;
          content: "";
          pointer-events: none;
        }
        .ignition-shell {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          width: min(100%, 690px);
          min-height: 100dvh;
          margin: 0 auto;
          padding: clamp(20px, 6vw, 44px) clamp(18px, 6vw, 48px) 24px;
        }
        .ignition-topline {
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: var(--muted);
          font-family: "DM Mono", "SFMono-Regular", monospace;
          font-size: 9px;
          letter-spacing: .17em;
          text-transform: uppercase;
        }
        .topline-signal {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: var(--signal);
        }
        .signal-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: currentColor;
          box-shadow: 0 0 0 4px var(--signal-dim);
          animation: ignition-blink 1.2s ease-in-out infinite;
        }
        .replay-control {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 8px 10px;
          border: 1px solid var(--line);
          border-radius: 3px;
          color: var(--muted);
          background: rgba(7, 21, 27, .58);
          cursor: pointer;
          font: inherit;
          font-size: 9px;
          letter-spacing: .13em;
          text-transform: uppercase;
          transition: color .18s ease, border-color .18s ease, transform .18s ease;
        }
        .replay-control:hover, .replay-control:focus-visible {
          border-color: rgba(215,255,89,.62);
          color: var(--signal);
          outline: none;
          transform: translateY(-1px);
        }
        .replay-icon {
          display: inline-block;
          width: 10px;
          height: 10px;
          border: 1px solid currentColor;
          border-left-color: transparent;
          border-radius: 50%;
          transform: rotate(-38deg);
        }
        .ignition-core {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          margin: auto 0;
          padding: 30px 0 32px;
        }
        .core-ghost {
          position: absolute;
          top: 50%;
          left: 50%;
          width: min(88vw, 390px);
          aspect-ratio: 1;
          border: 1px solid rgba(120,229,224,.1);
          border-radius: 50%;
          opacity: .8;
          transform: translate(-50%, -50%);
          pointer-events: none;
        }
        .core-ghost::before, .core-ghost::after {
          position: absolute;
          inset: 10%;
          border: 1px solid rgba(215,255,89,.08);
          border-radius: 50%;
          content: "";
        }
        .core-ghost::after {
          inset: 25%;
          border-color: rgba(120,229,224,.13);
        }
        .logo-lockup {
          position: relative;
          display: grid;
          place-items: center;
          width: 102px;
          height: 102px;
          overflow: hidden;
          border: 1px solid rgba(215,255,89,.55);
          border-radius: 14px;
          background: #061016;
          box-shadow: 0 0 0 8px rgba(215,255,89,.035), 0 20px 54px rgba(0,0,0,.35);
          animation: ignition-pop .7s cubic-bezier(.16, 1, .3, 1) both;
        }
        .logo-lockup::before, .logo-lockup::after {
          position: absolute;
          z-index: 2;
          width: 10px;
          height: 10px;
          border-color: var(--signal);
          content: "";
          pointer-events: none;
        }
        .logo-lockup::before {
          top: -1px;
          left: -1px;
          border-top: 2px solid;
          border-left: 2px solid;
        }
        .logo-lockup::after {
          right: -1px;
          bottom: -1px;
          border-right: 2px solid;
          border-bottom: 2px solid;
        }
        .logo-lockup img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: .96;
        }
        .logo-kicker {
          position: relative;
          margin: 25px 0 7px;
          color: var(--signal);
          font-family: "DM Mono", "SFMono-Regular", monospace;
          font-size: 9px;
          letter-spacing: .27em;
          text-indent: .27em;
          text-transform: uppercase;
          animation: ignition-rise .7s .18s cubic-bezier(.16,1,.3,1) both;
        }
        .ignition-title {
          position: relative;
          margin: 0;
          color: var(--ink);
          font-size: clamp(2rem, 9vw, 3.9rem);
          font-weight: 800;
          letter-spacing: -.075em;
          line-height: .94;
          text-align: center;
          animation: ignition-rise .75s .24s cubic-bezier(.16,1,.3,1) both;
        }
        .ignition-title span { color: var(--signal); }
        .title-rule {
          position: relative;
          width: min(100%, 302px);
          height: 1px;
          margin: 21px 0 12px;
          overflow: hidden;
          background: var(--line);
        }
        .title-rule::after {
          position: absolute;
          top: 0;
          left: 0;
          width: 38%;
          height: 100%;
          background: var(--heat);
          content: "";
          transform: translateX(-110%);
          animation: ignition-scan 1.8s .7s cubic-bezier(.16,1,.3,1) infinite;
        }
        .core-caption {
          position: relative;
          margin: 0;
          color: var(--muted);
          font-family: "DM Mono", "SFMono-Regular", monospace;
          font-size: 9px;
          letter-spacing: .12em;
          text-align: center;
          text-transform: uppercase;
          animation: ignition-rise .75s .35s cubic-bezier(.16,1,.3,1) both;
        }
        .boot-readout {
          position: relative;
          width: min(100%, 330px);
          margin-top: 38px;
          padding: 16px;
          border: 1px solid var(--line);
          border-radius: 4px;
          background: rgba(5, 17, 22, .72);
          box-shadow: 0 13px 38px rgba(0,0,0,.2);
          animation: ignition-rise .8s .48s cubic-bezier(.16,1,.3,1) both;
        }
        .readout-head, .progress-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-family: "DM Mono", "SFMono-Regular", monospace;
          font-size: 9px;
          letter-spacing: .08em;
          text-transform: uppercase;
        }
        .readout-head { margin-bottom: 13px; color: var(--muted); }
        .readout-head strong { color: var(--cyan); font-weight: 400; }
        .stage-list {
          display: grid;
          gap: 8px;
          margin: 0 0 17px;
          padding: 0;
          list-style: none;
        }
        .stage-item {
          display: grid;
          grid-template-columns: 14px 1fr auto;
          align-items: center;
          gap: 7px;
          color: #527371;
          font-family: "DM Mono", "SFMono-Regular", monospace;
          font-size: 9px;
          letter-spacing: .03em;
          transition: color .18s ease, transform .18s ease;
        }
        .stage-item.is-active { color: var(--ink); transform: translateX(3px); }
        .stage-item.is-done { color: var(--cyan); }
        .stage-marker {
          display: block;
          width: 7px;
          height: 7px;
          border: 1px solid currentColor;
          transform: rotate(45deg);
        }
        .stage-item.is-active .stage-marker {
          border-color: var(--signal);
          background: var(--signal);
          box-shadow: 0 0 0 3px var(--signal-dim);
        }
        .stage-code { opacity: .6; }
        .progress-meta { margin-bottom: 7px; color: var(--muted); }
        .progress-meta strong { color: var(--signal); font-weight: 500; }
        .progress-track {
          position: relative;
          height: 11px;
          padding: 2px;
          border: 1px solid rgba(215,255,89,.34);
          background: var(--cabinet-deep);
        }
        .progress-fill {
          height: 100%;
          background: repeating-linear-gradient(90deg, var(--signal) 0 16px, #aed742 16px 19px);
          transform-origin: left center;
          will-change: width;
        }
        .progress-track::after {
          position: absolute;
          top: -4px;
          bottom: -4px;
          left: calc(var(--progress) * 1%);
          width: 2px;
          background: var(--heat);
          box-shadow: 0 0 12px rgba(255,152,85,.55);
          content: "";
          transform: translateX(-1px);
        }
        .ready-plate {
          position: absolute;
          top: 50%;
          left: 50%;
          z-index: 3;
          display: flex;
          flex-direction: column;
          align-items: center;
          width: min(100%, 350px);
          padding: 24px 20px 21px;
          border: 1px solid var(--signal);
          border-radius: 4px;
          background: rgba(5, 18, 20, .96);
          box-shadow: 0 0 0 7px rgba(215,255,89,.06), 0 24px 70px rgba(0,0,0,.5);
          opacity: 0;
          pointer-events: none;
          transform: translate(-50%, -43%) scale(.94);
        }
        .is-ready .ready-plate {
          opacity: 1;
          pointer-events: auto;
          transform: translate(-50%, -43%) scale(1);
          transition: opacity .55s ease, transform .55s cubic-bezier(.16,1,.3,1);
        }
        .ready-plate::before {
          position: absolute;
          inset: 6px;
          border: 1px solid rgba(215,255,89,.22);
          content: "";
          pointer-events: none;
        }
        .ready-overline {
          position: relative;
          color: var(--signal);
          font-family: "DM Mono", "SFMono-Regular", monospace;
          font-size: 9px;
          letter-spacing: .27em;
          text-indent: .27em;
          text-transform: uppercase;
        }
        .ready-title {
          position: relative;
          margin: 10px 0 4px;
          color: var(--ink);
          font-size: clamp(1.9rem, 8vw, 2.8rem);
          font-weight: 800;
          letter-spacing: -.07em;
          line-height: 1;
          text-align: center;
        }
        .ready-copy {
          position: relative;
          margin: 0;
          color: var(--muted);
          font-family: "DM Mono", "SFMono-Regular", monospace;
          font-size: 9px;
          letter-spacing: .06em;
          text-align: center;
        }
        .ready-arrow {
          position: relative;
          display: flex;
          align-items: center;
          gap: 9px;
          margin-top: 21px;
          padding: 10px 15px;
          border: 1px solid var(--heat);
          color: var(--heat);
          background: rgba(255,152,85,.08);
          font-family: "DM Mono", "SFMono-Regular", monospace;
          font-size: 10px;
          letter-spacing: .17em;
          text-transform: uppercase;
        }
        .ready-arrow::after {
          width: 14px;
          height: 1px;
          background: currentColor;
          content: "";
          transform: scaleX(.7);
          transform-origin: right;
        }
        .ignition-footer {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          color: var(--muted);
          font-family: "DM Mono", "SFMono-Regular", monospace;
          font-size: 8px;
          letter-spacing: .09em;
          line-height: 1.5;
          text-transform: uppercase;
        }
        .footer-legend { display: inline-flex; align-items: center; gap: 7px; }
        .legend-block { width: 8px; height: 8px; background: var(--heat); }
        .footer-build { color: rgba(120,229,224,.52); text-align: right; }
        .is-settled .ignition-core > *:not(.ready-plate) { opacity: .5; transition: opacity .75s ease; }
        @keyframes ignition-pop {
          from { opacity: 0; transform: scale(.74); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes ignition-rise {
          from { opacity: 0; transform: translateY(13px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes ignition-scan {
          0% { opacity: 0; transform: translateX(-110%); }
          18%, 65% { opacity: 1; }
          100% { opacity: 0; transform: translateX(370%); }
        }
        @keyframes ignition-blink {
          0%, 100% { opacity: .4; transform: scale(.85); }
          50% { opacity: 1; transform: scale(1); }
        }
        @media (max-width: 430px) {
          .ignition-shell { padding-top: 19px; padding-bottom: 18px; }
          .ignition-core { padding-top: 18px; padding-bottom: 20px; }
          .logo-lockup { width: 86px; height: 86px; }
          .boot-readout { margin-top: 26px; padding: 13px; }
          .stage-list { gap: 6px; margin-bottom: 13px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .arcade-ignition *, .arcade-ignition *::before, .arcade-ignition *::after {
            animation-duration: .01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: .01ms !important;
          }
        }
      `}),e.jsxs("section",{className:"ignition-shell",children:[e.jsxs("header",{className:"ignition-topline",children:[e.jsxs("span",{className:"topline-signal",children:[e.jsx("i",{className:"signal-dot"})," cabinet online"]}),e.jsxs("button",{className:"replay-control",type:"button",onClick:y,"aria-label":"Replay boot animation",children:[e.jsx("i",{className:"replay-icon","aria-hidden":"true"})," replay"]})]}),e.jsxs("section",{className:"ignition-core","aria-live":"polite",children:[e.jsx("div",{className:"core-ghost","aria-hidden":"true"}),e.jsx("div",{className:"logo-lockup",children:e.jsx("img",{src:"/images/aerodynamix/logo.gif",alt:"Aerodynamix logo"})}),e.jsx("p",{className:"logo-kicker",children:"personal portal / attract mode"}),e.jsxs("h1",{className:"ignition-title",children:["AERO",e.jsx("span",{children:"DYNAMIX"})]}),e.jsx("div",{className:"title-rule","aria-hidden":"true"}),e.jsx("p",{className:"core-caption",children:n?"session handoff complete":"private media collection // starting"}),e.jsxs("section",{className:"boot-readout","aria-label":"Boot progress",children:[e.jsxs("div",{className:"readout-head",children:[e.jsx("span",{children:"ignition sequence"}),e.jsx("strong",{children:n?"ready":l})]}),e.jsx("ul",{className:"stage-list",children:x.map(i=>{const a=x.findIndex(g=>g.id===i.id),c=x.findIndex(g=>g.id===l),r=n||a<c,p=!n&&i.id===l;return e.jsxs("li",{className:`stage-item ${p?"is-active":""} ${r?"is-done":""}`,children:[e.jsx("i",{className:"stage-marker","aria-hidden":"true"}),e.jsx("span",{children:i.label}),e.jsx("span",{className:"stage-code",children:r?"done":i.code})]},i.id)})}),e.jsxs("div",{className:"progress-meta",children:[e.jsx("span",{children:"player handoff"}),e.jsxs("strong",{children:[String(t).padStart(3,"0"),"%"]})]}),e.jsx("div",{className:"progress-track",style:{"--progress":t},children:e.jsx("div",{className:"progress-fill",style:{width:`${t}%`}})})]}),e.jsxs("section",{className:"ready-plate","aria-label":"Aerodynamix ready",children:[e.jsx("span",{className:"ready-overline",children:"signal acquired"}),e.jsx("h2",{className:"ready-title",children:"READY TO PLAY"}),e.jsx("p",{className:"ready-copy",children:"the collection is yours again"}),e.jsx("div",{className:"ready-arrow",children:"press start"})]})]}),e.jsxs("footer",{className:"ignition-footer",children:[e.jsxs("span",{className:"footer-legend",children:[e.jsx("i",{className:"legend-block"})," local only / no broadcast"]}),e.jsxs("span",{className:"footer-build",children:["A-DX 04.07",e.jsx("br",{}),"seat: private"]})]})]})]})}export{k as ArcadeIgnition,k as default};
