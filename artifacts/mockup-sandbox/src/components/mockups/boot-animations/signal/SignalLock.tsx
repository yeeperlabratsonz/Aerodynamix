import { useEffect, useState } from "react";

type LockPhase = "acquiring" | "verifying" | "locked" | "ready";

const logoSrc = "/__mockup/images/aerodynamix/logo.gif";
const bootDuration = 5600;

const checks = [
  { label: "LOCAL VAULT", code: "AERO / 01", threshold: 0 },
  { label: "SIGNAL PATH", code: "LOOPBACK", threshold: 22 },
  { label: "MEDIA INDEX", code: "7,284 ITEMS", threshold: 49 },
  { label: "PRIVATE GATE", code: "SEALED", threshold: 76 },
];

function phaseForProgress(progress: number): LockPhase {
  if (progress >= 100) return "ready";
  if (progress >= 76) return "locked";
  if (progress >= 36) return "verifying";
  return "acquiring";
}

function phaseLabel(phase: LockPhase): string {
  if (phase === "ready") return "LINK ESTABLISHED";
  if (phase === "locked") return "SIGNAL LOCKED";
  if (phase === "verifying") return "VERIFYING SOURCE";
  return "ACQUIRING SIGNAL";
}

export function SignalLock() {
  const [cycle, setCycle] = useState(0);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<LockPhase>("acquiring");
  const [isExiting, setIsExiting] = useState(false);
  const [isIdle, setIsIdle] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(() =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleMotionPreference = () => setReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleMotionPreference);
    return () => mediaQuery.removeEventListener("change", handleMotionPreference);
  }, []);

  useEffect(() => {
    let animationFrame = 0;
    let exitTimer = 0;
    let settleTimer = 0;
    const startTime = performance.now();

    setProgress(0);
    setPhase("acquiring");
    setIsExiting(false);
    setIsIdle(false);

    const finish = () => {
      setProgress(100);
      setPhase("ready");
      exitTimer = window.setTimeout(() => {
        setIsExiting(true);
        settleTimer = window.setTimeout(() => {
          setIsExiting(false);
          setIsIdle(true);
        }, reducedMotion ? 80 : 780);
      }, reducedMotion ? 500 : 620);
    };

    if (reducedMotion) {
      finish();
    } else {
      const tick = (now: number) => {
        const nextProgress = Math.min(100, ((now - startTime) / bootDuration) * 100);
        setProgress(nextProgress);
        setPhase(phaseForProgress(nextProgress));
        if (nextProgress >= 100) {
          finish();
          return;
        }
        animationFrame = requestAnimationFrame(tick);
      };
      animationFrame = requestAnimationFrame(tick);
    }

    return () => {
      cancelAnimationFrame(animationFrame);
      window.clearTimeout(exitTimer);
      window.clearTimeout(settleTimer);
    };
  }, [cycle, reducedMotion]);

  const replay = () => setCycle((currentCycle) => currentCycle + 1);
  const activeCheckCount = checks.filter((check) => progress >= check.threshold).length;

  return (
    <main className={`signal-lock ${isExiting ? "is-exiting" : ""} ${isIdle ? "is-idle" : ""}`}>
      <style>{`
        .signal-lock {
          --signal-ink: #071319;
          --signal-deep: #091c25;
          --signal-panel: rgba(8, 27, 35, .76);
          --signal-line: rgba(135, 220, 218, .17);
          --signal-muted: #63848a;
          --signal-soft: #a9cacc;
          --signal-bright: #dff8ee;
          --signal-cyan: #8ce4dc;
          --signal-amber: #ecbe7b;
          position: relative;
          display: flex;
          min-height: 100dvh;
          overflow: hidden;
          isolation: isolate;
          color: var(--signal-bright);
          background:
            radial-gradient(ellipse at 50% 42%, rgba(30, 93, 100, .24), transparent 44%),
            radial-gradient(ellipse at 50% 110%, rgba(203, 140, 75, .08), transparent 48%),
            var(--signal-ink);
          font-family: "Space Mono", "SFMono-Regular", Consolas, monospace;
          transition: opacity .78s cubic-bezier(.65, 0, .35, 1), filter .78s ease;
        }
        .signal-lock *, .signal-lock *::before, .signal-lock *::after { box-sizing: border-box; }
        .signal-lock::before {
          position: absolute;
          z-index: 8;
          inset: 0;
          pointer-events: none;
          opacity: .29;
          background: repeating-linear-gradient(
            0deg,
            transparent 0,
            transparent 3px,
            rgba(156, 238, 224, .055) 4px,
            transparent 5px
          );
          content: "";
          mix-blend-mode: screen;
        }
        .signal-lock::after {
          position: absolute;
          z-index: 8;
          inset: 0;
          pointer-events: none;
          opacity: .32;
          background-image: radial-gradient(rgba(217, 253, 241, .18) .65px, transparent .8px);
          background-size: 5px 5px;
          content: "";
          mix-blend-mode: soft-light;
        }
        .signal-lock.is-exiting { opacity: 0; filter: blur(3px); }
        .signal-lock.is-idle { background:
          radial-gradient(ellipse at 50% 42%, rgba(30, 93, 100, .13), transparent 44%),
          var(--signal-ink);
        }
        .signal-lock button {
          font: inherit;
          -webkit-tap-highlight-color: transparent;
        }
        .signal-lock button:focus-visible {
          outline: 1px solid var(--signal-cyan);
          outline-offset: 4px;
        }
        .signal-lock__rail {
          position: absolute;
          z-index: 3;
          top: 28px;
          bottom: 28px;
          left: clamp(18px, 5vw, 68px);
          display: flex;
          width: 132px;
          flex-direction: column;
          justify-content: space-between;
          color: var(--signal-muted);
          font-size: 9px;
          letter-spacing: .08em;
        }
        .signal-lock__eyebrow {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--signal-soft);
          font-size: 9px;
          letter-spacing: .14em;
          white-space: nowrap;
        }
        .signal-lock__eyebrow::before {
          width: 7px;
          height: 7px;
          border: 1px solid var(--signal-amber);
          border-radius: 50%;
          content: "";
        }
        .signal-lock__rail-data {
          display: grid;
          gap: 11px;
          border-left: 1px solid var(--signal-line);
          padding-left: 12px;
        }
        .signal-lock__rail-data span {
          display: block;
          margin-bottom: 3px;
          color: #3e646c;
          font-size: 7px;
          letter-spacing: .16em;
        }
        .signal-lock__rail-data strong {
          color: var(--signal-soft);
          font-size: 9px;
          font-weight: 400;
          letter-spacing: .05em;
        }
        .signal-lock__rail-mark {
          display: flex;
          align-items: center;
          gap: 8px;
          transform: rotate(-90deg) translateX(-34px);
          transform-origin: left center;
          color: #335760;
          font-size: 7px;
          letter-spacing: .3em;
          white-space: nowrap;
        }
        .signal-lock__rail-mark::before {
          width: 42px;
          height: 1px;
          background: var(--signal-line);
          content: "";
        }
        .signal-lock__topline {
          position: absolute;
          z-index: 3;
          top: 28px;
          right: clamp(18px, 5vw, 68px);
          left: calc(clamp(18px, 5vw, 68px) + 150px);
          display: flex;
          justify-content: space-between;
          color: #46686e;
          font-size: 8px;
          letter-spacing: .16em;
          text-transform: uppercase;
        }
        .signal-lock__topline span:last-child { color: var(--signal-amber); }
        .signal-lock__center {
          position: relative;
          z-index: 2;
          display: flex;
          width: min(100%, 680px);
          min-height: 100dvh;
          margin: 0 auto;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 84px 30px 94px;
          text-align: center;
        }
        .signal-lock__coordinates {
          position: absolute;
          top: 28px;
          left: 50%;
          color: #51757a;
          font-size: 8px;
          letter-spacing: .08em;
          transform: translateX(-50%);
          white-space: nowrap;
        }
        .signal-lock__target {
          position: relative;
          display: grid;
          place-items: center;
          width: clamp(148px, 34vw, 208px);
          height: clamp(148px, 34vw, 208px);
          margin-bottom: 27px;
        }
        .signal-lock__target::before,
        .signal-lock__target::after {
          position: absolute;
          border: 1px solid rgba(140, 228, 220, .18);
          border-radius: 50%;
          content: "";
        }
        .signal-lock__target::before { inset: 13px; }
        .signal-lock__target::after { inset: 34px; border-color: rgba(140, 228, 220, .34); }
        .signal-lock__crosshair {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          animation: signal-rotate 14s linear infinite;
        }
        .signal-lock__crosshair::before,
        .signal-lock__crosshair::after {
          position: absolute;
          top: 50%;
          left: 50%;
          background: rgba(140, 228, 220, .6);
          content: "";
        }
        .signal-lock__crosshair::before { width: 100%; height: 1px; transform: translate(-50%, -50%); }
        .signal-lock__crosshair::after { width: 1px; height: 100%; transform: translate(-50%, -50%); }
        .signal-lock__arc {
          position: absolute;
          inset: 0;
          border: 1px solid transparent;
          border-top-color: var(--signal-cyan);
          border-right-color: rgba(236, 190, 123, .75);
          border-radius: 50%;
          animation: signal-rotate 5.6s cubic-bezier(.65, 0, .35, 1) infinite;
        }
        .signal-lock__arc--inner {
          inset: 25px;
          border-top-color: transparent;
          border-bottom-color: var(--signal-cyan);
          border-left-color: rgba(140, 228, 220, .46);
          animation-direction: reverse;
          animation-duration: 4.2s;
        }
        .signal-lock__logo-frame {
          position: relative;
          z-index: 1;
          display: grid;
          place-items: center;
          width: 77px;
          height: 77px;
          overflow: hidden;
          border: 1px solid rgba(223, 248, 238, .48);
          border-radius: 20px;
          background: #071015;
          box-shadow: 0 0 0 7px rgba(140, 228, 220, .035), 0 0 50px rgba(140, 228, 220, .17);
          animation: signal-pulse 3.6s ease-in-out infinite;
        }
        .signal-lock__logo-frame img {
          display: block;
          width: 64px;
          height: 64px;
          object-fit: cover;
          border-radius: 15px;
        }
        .signal-lock__notch {
          position: absolute;
          z-index: 3;
          width: 5px;
          height: 5px;
          border: 1px solid var(--signal-cyan);
          background: var(--signal-ink);
        }
        .signal-lock__notch--tl { top: 4px; left: 4px; border-right: 0; border-bottom: 0; }
        .signal-lock__notch--tr { top: 4px; right: 4px; border-bottom: 0; border-left: 0; }
        .signal-lock__notch--bl { bottom: 4px; left: 4px; border-top: 0; border-right: 0; }
        .signal-lock__notch--br { right: 4px; bottom: 4px; border-top: 0; border-left: 0; }
        .signal-lock__title {
          margin: 0;
          color: var(--signal-bright);
          font-family: "Rajdhani", "Trebuchet MS", sans-serif;
          font-size: clamp(2rem, 7vw, 3.2rem);
          font-weight: 500;
          letter-spacing: .24em;
          line-height: 1;
          text-indent: .24em;
        }
        .signal-lock__descriptor {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 13px;
          color: #709196;
          font-size: 8px;
          letter-spacing: .27em;
          text-indent: .27em;
        }
        .signal-lock__descriptor::before,
        .signal-lock__descriptor::after {
          width: 22px;
          height: 1px;
          background: var(--signal-line);
          content: "";
        }
        .signal-lock__status {
          display: flex;
          align-items: center;
          gap: 9px;
          margin-top: 29px;
          color: var(--signal-amber);
          font-size: 9px;
          letter-spacing: .15em;
        }
        .signal-lock__status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: currentColor;
          box-shadow: 0 0 0 4px rgba(236, 190, 123, .08);
          animation: signal-blink 1.2s steps(2, jump-none) infinite;
        }
        .signal-lock__progress-shell {
          position: relative;
          width: min(100%, 400px);
          margin-top: 19px;
        }
        .signal-lock__progress-meta {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          color: #54767c;
          font-size: 7px;
          letter-spacing: .12em;
        }
        .signal-lock__progress-meta strong {
          color: var(--signal-soft);
          font-weight: 400;
        }
        .signal-lock__progress-track {
          position: relative;
          height: 2px;
          overflow: visible;
          background: rgba(140, 228, 220, .14);
        }
        .signal-lock__progress-fill {
          position: relative;
          height: 100%;
          background: linear-gradient(90deg, rgba(236, 190, 123, .9), var(--signal-cyan));
          transition: width .08s linear;
        }
        .signal-lock__progress-fill::after {
          position: absolute;
          top: 50%;
          right: 0;
          width: 6px;
          height: 6px;
          border: 1px solid var(--signal-bright);
          background: var(--signal-ink);
          content: "";
          transform: translate(50%, -50%) rotate(45deg);
        }
        .signal-lock__checks {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          width: min(100%, 500px);
          margin-top: 30px;
          border-top: 1px solid var(--signal-line);
        }
        .signal-lock__check {
          position: relative;
          padding: 13px 7px 0;
          color: #45666c;
          font-size: 7px;
          letter-spacing: .05em;
          text-align: center;
        }
        .signal-lock__check::before {
          position: absolute;
          top: -3px;
          left: 50%;
          width: 5px;
          height: 5px;
          border: 1px solid #45666c;
          border-radius: 50%;
          background: var(--signal-ink);
          content: "";
          transform: translateX(-50%);
        }
        .signal-lock__check.is-complete { color: var(--signal-soft); }
        .signal-lock__check.is-complete::before {
          border-color: var(--signal-cyan);
          background: var(--signal-cyan);
          box-shadow: 0 0 0 3px rgba(140, 228, 220, .08);
        }
        .signal-lock__check strong {
          display: block;
          margin-bottom: 5px;
          color: inherit;
          font-size: 7px;
          font-weight: 400;
          line-height: 1.35;
        }
        .signal-lock__check span { color: #38575d; font-size: 6px; }
        .signal-lock__check.is-complete span { color: var(--signal-cyan); }
        .signal-lock__footer {
          position: absolute;
          z-index: 3;
          right: clamp(18px, 5vw, 68px);
          bottom: 28px;
          left: calc(clamp(18px, 5vw, 68px) + 150px);
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: #42656c;
          font-size: 7px;
          letter-spacing: .12em;
        }
        .signal-lock__footer-status { color: var(--signal-cyan); }
        .signal-lock__replay {
          border: 0;
          padding: 5px 0 5px 9px;
          color: #75979a;
          background: transparent;
          cursor: pointer;
          font-size: 7px;
          letter-spacing: .14em;
          text-transform: uppercase;
          transition: color .2s ease, transform .2s ease;
        }
        .signal-lock__replay::before {
          display: inline-block;
          margin-right: 7px;
          color: var(--signal-amber);
          content: "↻";
          font-family: sans-serif;
          font-size: 13px;
          vertical-align: -1px;
        }
        .signal-lock__replay:hover { color: var(--signal-bright); transform: translateX(-2px); }
        .signal-lock.is-idle .signal-lock__target { opacity: .68; }
        .signal-lock.is-idle .signal-lock__status { color: var(--signal-cyan); }
        .signal-lock.is-idle .signal-lock__status-dot { animation: none; }
        .signal-lock.is-idle .signal-lock__checks { opacity: .72; }
        @keyframes signal-rotate { to { transform: rotate(360deg); } }
        @keyframes signal-pulse {
          0%, 100% { box-shadow: 0 0 0 7px rgba(140, 228, 220, .035), 0 0 42px rgba(140, 228, 220, .12); }
          50% { box-shadow: 0 0 0 11px rgba(140, 228, 220, .045), 0 0 64px rgba(140, 228, 220, .24); }
        }
        @keyframes signal-blink { 50% { opacity: .35; } }
        @media (max-width: 620px) {
          .signal-lock__rail { width: 92px; }
          .signal-lock__topline, .signal-lock__footer {
            left: calc(clamp(18px, 5vw, 68px) + 108px);
          }
          .signal-lock__title { font-size: clamp(1.78rem, 9vw, 2.8rem); }
        }
        @media (max-width: 460px) {
          .signal-lock__rail { top: 23px; bottom: 23px; left: 17px; width: 52px; }
          .signal-lock__rail-data { display: none; }
          .signal-lock__rail-mark { transform: rotate(-90deg) translateX(-8px); }
          .signal-lock__topline { top: 23px; right: 18px; left: 84px; font-size: 7px; }
          .signal-lock__topline span:first-child { display: none; }
          .signal-lock__coordinates { top: 47px; font-size: 7px; }
          .signal-lock__center { padding: 82px 20px 80px; }
          .signal-lock__target { width: 164px; height: 164px; margin-bottom: 25px; }
          .signal-lock__logo-frame { width: 68px; height: 68px; border-radius: 17px; }
          .signal-lock__logo-frame img { width: 57px; height: 57px; border-radius: 13px; }
          .signal-lock__descriptor { font-size: 7px; letter-spacing: .19em; text-indent: .19em; }
          .signal-lock__descriptor::before, .signal-lock__descriptor::after { width: 15px; }
          .signal-lock__checks { margin-top: 25px; }
          .signal-lock__check { padding-right: 2px; padding-left: 2px; font-size: 6px; }
          .signal-lock__check strong { font-size: 6px; }
          .signal-lock__check span { display: none; }
          .signal-lock__footer { right: 18px; bottom: 23px; left: 84px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .signal-lock, .signal-lock *, .signal-lock *::before, .signal-lock *::after {
            animation-duration: .01ms !important;
            animation-iteration-count: 1 !important;
            scroll-behavior: auto !important;
            transition-duration: .01ms !important;
          }
        }
      `}</style>

      <aside className="signal-lock__rail" aria-label="System metadata">
        <div className="signal-lock__eyebrow">AERODYNAMIX / 00</div>
        <div className="signal-lock__rail-data">
          <div><span>PROTOCOL</span><strong>SL-7.4.2</strong></div>
          <div><span>NODE</span><strong>HOME//LOCAL</strong></div>
          <div><span>LATENCY</span><strong>0.04 MS</strong></div>
        </div>
        <div className="signal-lock__rail-mark">PRIVATE COLLECTION</div>
      </aside>

      <div className="signal-lock__topline" aria-hidden="true">
        <span>BOOT SEQUENCE / HANDSHAKE</span>
        <span>NO REMOTE LINK</span>
      </div>

      <section className="signal-lock__center" aria-labelledby="signal-lock-title">
        <div className="signal-lock__coordinates">45° 31' 07" N&nbsp;&nbsp; / &nbsp;&nbsp;122° 40' 25" W</div>
        <div className="signal-lock__target" aria-hidden="true">
          <div className="signal-lock__crosshair" />
          <div className="signal-lock__arc" />
          <div className="signal-lock__arc signal-lock__arc--inner" />
          <div className="signal-lock__logo-frame">
            <span className="signal-lock__notch signal-lock__notch--tl" />
            <span className="signal-lock__notch signal-lock__notch--tr" />
            <span className="signal-lock__notch signal-lock__notch--bl" />
            <span className="signal-lock__notch signal-lock__notch--br" />
            <img src={logoSrc} alt="Aerodynamix" />
          </div>
        </div>

        <h1 className="signal-lock__title" id="signal-lock-title">AERODYNAMIX</h1>
        <div className="signal-lock__descriptor">PRIVATE MEDIA COLLECTION</div>

        <div className="signal-lock__status" role="status" aria-live="polite">
          <span className="signal-lock__status-dot" aria-hidden="true" />
          <span>{phaseLabel(phase)}</span>
        </div>

        <div className="signal-lock__progress-shell">
          <div className="signal-lock__progress-meta">
            <span>ESTABLISHING LOCAL CHANNEL</span>
            <strong>{Math.round(progress).toString().padStart(3, "0")}%</strong>
          </div>
          <div
            className="signal-lock__progress-track"
            role="progressbar"
            aria-label="Boot progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress)}
          >
            <div className="signal-lock__progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="signal-lock__checks" aria-label="Handshake checks">
          {checks.map((check) => {
            const isComplete = progress >= check.threshold;
            return (
              <div className={`signal-lock__check ${isComplete ? "is-complete" : ""}`} key={check.label}>
                <strong>{check.label}</strong>
                <span>{isComplete ? check.code : "WAITING"}</span>
              </div>
            );
          })}
        </div>
      </section>

      <footer className="signal-lock__footer">
        <span className="signal-lock__footer-status">
          {isIdle ? "CHANNEL HELD / READY" : `${activeCheckCount} OF ${checks.length} CHECKS PASSED`}
        </span>
        <button className="signal-lock__replay" type="button" onClick={replay}>
          Replay handshake
        </button>
      </footer>
    </main>
  );
}

export default SignalLock;