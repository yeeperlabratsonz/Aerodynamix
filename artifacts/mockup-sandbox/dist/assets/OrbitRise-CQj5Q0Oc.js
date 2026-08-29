import{r as i,j as e}from"./index-DDtURTn1.js";const h=[{left:"8%",top:"17%",size:2,delay:"0s"},{left:"19%",top:"28%",size:1,delay:"1.1s"},{left:"29%",top:"11%",size:1,delay:"2.2s"},{left:"42%",top:"21%",size:2,delay:".6s"},{left:"58%",top:"9%",size:1,delay:"1.8s"},{left:"72%",top:"24%",size:2,delay:".2s"},{left:"88%",top:"14%",size:1,delay:"2.7s"},{left:"94%",top:"35%",size:1,delay:"1.4s"},{left:"13%",top:"45%",size:1,delay:"2.9s"},{left:"36%",top:"37%",size:1,delay:"1.7s"},{left:"67%",top:"42%",size:1,delay:"3.3s"},{left:"81%",top:"51%",size:2,delay:".9s"}],c=[{label:"wake signal",at:0},{label:"private index",at:36},{label:"media orbit",at:67},{label:"ready state",at:100}];function w(){const[b,a]=i.useState("booting"),[l,d]=i.useState(0),[g,m]=i.useState(0),[n,x]=i.useState(!1),o=i.useRef([]);i.useEffect(()=>{const r=window.matchMedia("(prefers-reduced-motion: reduce)"),t=()=>x(r.matches);return t(),r.addEventListener?.("change",t),()=>r.removeEventListener?.("change",t)},[]),i.useEffect(()=>{if(o.current.forEach(window.clearTimeout),o.current=[],a("booting"),d(n?100:0),n){a("ready");const s=window.setTimeout(()=>a("settled"),700);return o.current.push(s),()=>window.clearTimeout(s)}const r=window.setInterval(()=>{d(s=>{const p=Math.min(s+(s<70?2:1),100);return p===100&&window.clearInterval(r),p})},72),t=window.setTimeout(()=>a("ready"),3500),u=window.setTimeout(()=>a("settled"),4850);return o.current.push(t,u),()=>{window.clearInterval(r),o.current.forEach(window.clearTimeout)}},[n,g]);const f=()=>{m(r=>r+1)};return e.jsxs("main",{className:`orbit-rise orbit-rise--${b} ${n?"orbit-rise--reduced":""}`,"aria-label":"Aerodynamix boot sequence",children:[e.jsx("style",{children:`
        .orbit-rise {
          --night: #071319;
          --deep-night: #0b2025;
          --mist: #b9d8d2;
          --quiet: #75918f;
          --line: rgba(188, 227, 216, .2);
          --cyan: #90e4da;
          --sun: #ef9b75;
          position: relative;
          min-height: 100dvh;
          overflow: hidden;
          isolation: isolate;
          color: #e8f2eb;
          background:
            radial-gradient(ellipse at 50% 94%, rgba(217, 112, 91, .17) 0%, transparent 23%),
            radial-gradient(ellipse at 50% 70%, rgba(91, 166, 157, .11) 0%, transparent 33%),
            linear-gradient(180deg, #071117 0%, var(--night) 48%, #102b2e 100%);
          font-family: "Avenir Next", "Trebuchet MS", sans-serif;
        }
        .orbit-rise *, .orbit-rise *::before, .orbit-rise *::after { box-sizing: border-box; }
        .orbit-rise::before {
          position: absolute;
          z-index: 5;
          inset: 0;
          pointer-events: none;
          opacity: .17;
          background-image: repeating-linear-gradient(0deg, rgba(216, 247, 228, .14) 0 1px, transparent 1px 4px);
          mix-blend-mode: overlay;
          content: "";
        }
        .orbit-rise::after {
          position: absolute;
          z-index: 4;
          inset: 0;
          pointer-events: none;
          opacity: .42;
          background: radial-gradient(ellipse at center, transparent 35%, rgba(2, 10, 13, .64) 100%);
          content: "";
        }
        .orbit-sky {
          position: absolute;
          inset: 0;
          z-index: -1;
          opacity: .9;
        }
        .orbit-star {
          position: absolute;
          display: block;
          width: var(--star-size);
          height: var(--star-size);
          border-radius: 50%;
          background: #d6eee4;
          box-shadow: 0 0 9px rgba(190, 240, 225, .48);
          animation: orbit-twinkle 4.7s ease-in-out var(--star-delay) infinite;
        }
        .orbit-ambient {
          position: absolute;
          top: 45%;
          left: 50%;
          width: min(92vw, 560px);
          height: min(92vw, 560px);
          border-radius: 50%;
          background: radial-gradient(circle, rgba(137, 224, 211, .12), transparent 64%);
          transform: translate(-50%, -50%);
          animation: orbit-breathe 7s ease-in-out infinite;
        }
        .orbit-sun {
          position: absolute;
          top: 64%;
          left: 50%;
          width: 68px;
          height: 68px;
          border-radius: 50%;
          background: radial-gradient(circle at 45% 40%, #ffd2ae 0 8%, var(--sun) 44%, rgba(239, 155, 117, .05) 72%);
          box-shadow: 0 0 45px rgba(239, 155, 117, .4), 0 0 120px rgba(239, 155, 117, .15);
          opacity: .75;
          transform: translate(-50%, -50%);
          animation: sun-rise 4.3s cubic-bezier(.22, 1, .36, 1) both;
        }
        .orbit-horizon {
          position: absolute;
          right: -20%;
          bottom: 12.5%;
          left: -20%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(211, 235, 221, .72) 32%, rgba(245, 170, 131, .9) 50%, rgba(211, 235, 221, .72) 68%, transparent);
          box-shadow: 0 0 26px rgba(191, 226, 205, .34);
          opacity: 0;
          animation: horizon-in 1.8s ease-out .65s forwards;
        }
        .orbit-horizon::after {
          position: absolute;
          top: -23px;
          right: 15%;
          left: 15%;
          height: 45px;
          background: linear-gradient(180deg, transparent, rgba(122, 206, 190, .12), transparent);
          content: "";
        }
        .orbit-plane {
          position: absolute;
          right: -45%;
          bottom: -24%;
          left: -45%;
          height: 63%;
          opacity: 0;
          perspective: 180px;
          transform: rotateX(66deg);
          animation: plane-rise 2.4s cubic-bezier(.22, 1, .36, 1) .2s forwards;
        }
        .orbit-plane::before, .orbit-plane::after {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(137, 224, 211, .13) 1px, transparent 1px),
            linear-gradient(90deg, rgba(137, 224, 211, .13) 1px, transparent 1px);
          background-size: 42px 28px;
          content: "";
        }
        .orbit-plane::after {
          background: radial-gradient(ellipse at center, transparent 8%, rgba(8, 24, 27, .38) 54%, var(--night) 78%);
        }
        .orbit-ring {
          position: absolute;
          z-index: 1;
          top: 50%;
          left: 50%;
          width: min(92vw, 500px);
          height: min(92vw, 160px);
          border: 1px solid rgba(144, 228, 218, .42);
          border-radius: 50%;
          box-shadow: 0 0 24px rgba(144, 228, 218, .11), inset 0 0 14px rgba(144, 228, 218, .07);
          opacity: 0;
          transform: translate(-50%, -50%) rotate(-12deg);
          animation: ring-rise 2s cubic-bezier(.22, 1, .36, 1) 1.2s forwards, ring-drift 12s linear 3.2s infinite;
        }
        .orbit-ring::before {
          position: absolute;
          top: -3px;
          left: 18%;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--sun);
          box-shadow: 0 0 13px var(--sun);
          content: "";
        }
        .orbit-ring--far {
          width: min(120vw, 680px);
          height: min(120vw, 226px);
          border-color: rgba(143, 200, 191, .13);
          animation-delay: 1.6s, 3.8s;
        }
        .orbit-content {
          position: relative;
          z-index: 3;
          display: flex;
          flex-direction: column;
          align-items: center;
          min-height: 100dvh;
          padding: clamp(42px, 10vh, 92px) 24px 26px;
          text-align: center;
        }
        .orbit-kicker {
          display: flex;
          align-items: center;
          gap: 11px;
          color: var(--quiet);
          font-family: "Space Mono", "SFMono-Regular", monospace;
          font-size: .54rem;
          letter-spacing: .22em;
          line-height: 1;
          text-transform: uppercase;
          opacity: 0;
          animation: rise-in .9s ease-out .15s forwards;
        }
        .orbit-kicker::before, .orbit-kicker::after {
          width: 24px;
          height: 1px;
          background: var(--line);
          content: "";
        }
        .orbit-logo-wrap {
          position: relative;
          display: grid;
          place-items: center;
          width: 112px;
          height: 112px;
          margin-top: clamp(38px, 8vh, 72px);
          border: 1px solid rgba(166, 226, 213, .24);
          border-radius: 31px;
          background: rgba(10, 30, 33, .58);
          box-shadow: 0 22px 62px rgba(1, 11, 13, .52), inset 0 0 26px rgba(158, 224, 207, .08);
          opacity: 0;
          transform: translateY(24px) scale(.82);
          animation: logo-rise 1.25s cubic-bezier(.22, 1, .36, 1) .3s forwards;
        }
        .orbit-logo-wrap::before {
          position: absolute;
          inset: -15px;
          border: 1px solid rgba(144, 228, 218, .09);
          border-radius: 39px;
          transform: rotate(8deg);
          content: "";
        }
        .orbit-logo-wrap img {
          display: block;
          width: 78px;
          height: 78px;
          border-radius: 21px;
          object-fit: cover;
          filter: saturate(.82) contrast(1.06);
        }
        .orbit-wordmark {
          margin: 28px 0 0;
          color: #edf5ee;
          font-size: clamp(1.68rem, 8.5vw, 2.42rem);
          font-weight: 500;
          letter-spacing: .205em;
          line-height: .98;
          text-indent: .205em;
          text-shadow: 0 0 28px rgba(166, 232, 218, .17);
          opacity: 0;
          transform: translateY(15px);
          animation: rise-in 1.1s cubic-bezier(.22, 1, .36, 1) 1.05s forwards;
        }
        .orbit-subtitle {
          margin: 15px 0 0;
          color: var(--quiet);
          font-family: "Space Mono", "SFMono-Regular", monospace;
          font-size: .55rem;
          letter-spacing: .16em;
          text-transform: uppercase;
          opacity: 0;
          animation: rise-in .9s ease-out 1.48s forwards;
        }
        .orbit-readout {
          display: flex;
          justify-content: space-between;
          width: min(100%, 350px);
          margin-top: auto;
          color: rgba(190, 224, 212, .56);
          font-family: "Space Mono", "SFMono-Regular", monospace;
          font-size: .5rem;
          letter-spacing: .08em;
          text-transform: uppercase;
          opacity: 0;
          animation: rise-in .8s ease-out 1.9s forwards;
        }
        .orbit-readout strong { color: var(--cyan); font-weight: 400; }
        .orbit-progress {
          width: min(100%, 350px);
          margin-top: 11px;
          opacity: 0;
          animation: rise-in .8s ease-out 1.85s forwards;
        }
        .orbit-progress__track {
          position: relative;
          width: 100%;
          height: 2px;
          overflow: hidden;
          background: rgba(204, 233, 219, .12);
        }
        .orbit-progress__fill {
          width: 0%;
          height: 100%;
          background: linear-gradient(90deg, var(--sun), var(--cyan));
          box-shadow: 0 0 12px rgba(144, 228, 218, .55);
          transition: width .25s ease-out;
        }
        .orbit-progress__tick {
          position: absolute;
          top: -2px;
          width: 6px;
          height: 6px;
          border: 1px solid var(--night);
          border-radius: 50%;
          background: var(--cyan);
          box-shadow: 0 0 9px rgba(144, 228, 218, .45);
          transform: translateX(-50%);
        }
        .orbit-stages {
          display: flex;
          justify-content: space-between;
          width: min(100%, 350px);
          margin-top: 10px;
          color: rgba(184, 216, 204, .39);
          font-family: "Space Mono", "SFMono-Regular", monospace;
          font-size: .43rem;
          letter-spacing: .02em;
          text-transform: uppercase;
        }
        .orbit-stage { position: relative; }
        .orbit-stage.is-active { color: var(--cyan); }
        .orbit-stage.is-active::before {
          position: absolute;
          top: -9px;
          left: 0;
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: var(--sun);
          content: "";
        }
        .orbit-ready {
          position: absolute;
          top: 47%;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          opacity: 0;
          transform: translateY(16px);
          pointer-events: none;
        }
        .orbit-rise--ready .orbit-ready, .orbit-rise--settled .orbit-ready {
          animation: ready-in 1.1s cubic-bezier(.22, 1, .36, 1) forwards;
          pointer-events: auto;
        }
        .orbit-ready__signal {
          display: grid;
          place-items: center;
          width: 28px;
          height: 28px;
          border: 1px solid rgba(144, 228, 218, .62);
          border-radius: 50%;
          color: var(--cyan);
          font-family: "Space Mono", monospace;
          font-size: .7rem;
        }
        .orbit-ready__signal::before {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--cyan);
          box-shadow: 0 0 13px var(--cyan);
          content: "";
        }
        .orbit-ready__title {
          color: #e9f3e9;
          font-size: .77rem;
          font-weight: 500;
          letter-spacing: .32em;
          text-indent: .32em;
        }
        .orbit-ready__copy {
          color: var(--quiet);
          font-family: "Space Mono", monospace;
          font-size: .48rem;
          letter-spacing: .09em;
          text-transform: uppercase;
        }
        .orbit-rise--ready .orbit-logo-wrap,
        .orbit-rise--ready .orbit-wordmark,
        .orbit-rise--ready .orbit-subtitle,
        .orbit-rise--ready .orbit-kicker,
        .orbit-rise--settled .orbit-logo-wrap,
        .orbit-rise--settled .orbit-wordmark,
        .orbit-rise--settled .orbit-subtitle,
        .orbit-rise--settled .orbit-kicker {
          opacity: .1;
          transition: opacity 1.2s ease;
        }
        .orbit-rise--ready .orbit-progress,
        .orbit-rise--settled .orbit-progress,
        .orbit-rise--ready .orbit-readout,
        .orbit-rise--settled .orbit-readout,
        .orbit-rise--ready .orbit-stages,
        .orbit-rise--settled .orbit-stages {
          opacity: 0;
          transition: opacity .7s ease;
        }
        .orbit-replay {
          position: absolute;
          z-index: 8;
          right: 22px;
          bottom: 21px;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 8px 10px;
          border: 1px solid rgba(186, 224, 211, .19);
          border-radius: 4px;
          color: rgba(198, 226, 216, .68);
          background: rgba(7, 19, 24, .6);
          font-family: "Space Mono", monospace;
          font-size: .48rem;
          letter-spacing: .1em;
          text-transform: uppercase;
          cursor: pointer;
          transition: color .2s ease, border-color .2s ease, background .2s ease;
        }
        .orbit-replay:hover, .orbit-replay:focus-visible {
          border-color: rgba(144, 228, 218, .7);
          color: var(--cyan);
          background: rgba(21, 59, 61, .7);
          outline: none;
        }
        .orbit-replay svg { width: 11px; height: 11px; }
        @keyframes rise-in { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes logo-rise { from { opacity: 0; transform: translateY(24px) scale(.82); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes horizon-in { from { opacity: 0; transform: scaleX(.2); } to { opacity: 1; transform: scaleX(1); } }
        @keyframes plane-rise { from { opacity: 0; transform: rotateX(66deg) translateY(90px); } to { opacity: .92; transform: rotateX(66deg) translateY(0); } }
        @keyframes ring-rise { from { opacity: 0; transform: translate(-50%, -50%) rotate(-12deg) scale(.52); } to { opacity: 1; transform: translate(-50%, -50%) rotate(-12deg) scale(1); } }
        @keyframes ring-drift { 0%, 100% { margin-left: 0; } 50% { margin-left: 12px; } }
        @keyframes sun-rise { from { opacity: 0; transform: translate(-50%, 24px) scale(.65); } to { opacity: .75; transform: translate(-50%, -50%) scale(1); } }
        @keyframes orbit-twinkle { 0%, 100% { opacity: .25; transform: scale(.75); } 48% { opacity: .9; transform: scale(1); } }
        @keyframes orbit-breathe { 0%, 100% { opacity: .62; transform: translate(-50%, -50%) scale(.92); } 50% { opacity: 1; transform: translate(-50%, -50%) scale(1.08); } }
        @keyframes ready-in { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @media (max-width: 430px) {
          .orbit-content { padding-right: 20px; padding-left: 20px; }
          .orbit-logo-wrap { margin-top: 40px; }
          .orbit-wordmark { font-size: clamp(1.45rem, 8vw, 2rem); }
          .orbit-stages { font-size: .39rem; }
        }
        @media (prefers-reduced-motion: reduce) {
          .orbit-rise *, .orbit-rise *::before, .orbit-rise *::after {
            animation-duration: .01ms !important;
            animation-iteration-count: 1 !important;
            scroll-behavior: auto !important;
            transition-duration: .01ms !important;
          }
          .orbit-rise--reduced .orbit-logo-wrap,
          .orbit-rise--reduced .orbit-wordmark,
          .orbit-rise--reduced .orbit-subtitle,
          .orbit-rise--reduced .orbit-kicker,
          .orbit-rise--reduced .orbit-readout,
          .orbit-rise--reduced .orbit-progress { opacity: 1; transform: none; }
        }
      `}),e.jsxs("div",{className:"orbit-sky","aria-hidden":"true",children:[h.map((r,t)=>e.jsx("i",{className:"orbit-star",style:{left:r.left,top:r.top,"--star-size":`${r.size}px`,"--star-delay":r.delay}},`${r.left}-${t}`)),e.jsx("div",{className:"orbit-ambient"}),e.jsx("div",{className:"orbit-sun"}),e.jsx("div",{className:"orbit-plane"}),e.jsx("div",{className:"orbit-horizon"}),e.jsx("div",{className:"orbit-ring"}),e.jsx("div",{className:"orbit-ring orbit-ring--far"})]}),e.jsxs("section",{className:"orbit-content",children:[e.jsxs("div",{className:"orbit-kicker",children:[e.jsx("span",{children:"private collection"}),e.jsx("span",{children:"boot / 07"})]}),e.jsx("div",{className:"orbit-logo-wrap",children:e.jsx("img",{src:"/images/aerodynamix/logo.gif",alt:"Aerodynamix logo"})}),e.jsx("h1",{className:"orbit-wordmark",children:"AERODYNAMIX"}),e.jsx("p",{className:"orbit-subtitle",children:"a quiet world, coming online"}),e.jsxs("div",{className:"orbit-ready","aria-live":"polite",children:[e.jsx("span",{className:"orbit-ready__signal","aria-hidden":"true"}),e.jsx("strong",{className:"orbit-ready__title",children:"READY"}),e.jsx("span",{className:"orbit-ready__copy",children:"your orbit is clear"})]}),e.jsxs("div",{className:"orbit-readout",children:[e.jsxs("span",{children:["system ",e.jsx("strong",{children:"awakening"})]}),e.jsxs("span",{children:["local / ",e.jsx("strong",{children:"07"})]})]}),e.jsx("div",{className:"orbit-progress","aria-label":`Loading ${l}%`,children:e.jsxs("div",{className:"orbit-progress__track",children:[e.jsx("div",{className:"orbit-progress__fill",style:{width:`${l}%`}}),c.slice(1,3).map(r=>e.jsx("span",{className:"orbit-progress__tick",style:{left:`${r.at}%`},"aria-hidden":"true"},r.label))]})}),e.jsx("div",{className:"orbit-stages","aria-hidden":"true",children:c.map(r=>e.jsx("span",{className:`orbit-stage ${l>=r.at?"is-active":""}`,children:r.label},r.label))})]}),e.jsxs("button",{className:"orbit-replay",type:"button",onClick:f,"aria-label":"Replay boot animation",children:[e.jsxs("svg",{viewBox:"0 0 16 16",fill:"none","aria-hidden":"true",children:[e.jsx("path",{d:"M13 5.4A5.2 5.2 0 1 0 13.2 9",stroke:"currentColor",strokeWidth:"1.3",strokeLinecap:"round"}),e.jsx("path",{d:"M10.8 2.8 13.5 5l-3.1 1",stroke:"currentColor",strokeWidth:"1.3",strokeLinecap:"round",strokeLinejoin:"round"})]}),"replay"]})]})}export{w as OrbitRise,w as default};
