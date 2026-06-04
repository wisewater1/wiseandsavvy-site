/* global React */
const { useState } = React;

// ---- Header ---------------------------------------------------------------
function SiteHeader({ active = "studio", onNav }) {
  const links = [
    ["studio", "Studio"],
    ["worlds", "Worlds"],
    ["artifacts", "Artifacts"],
    ["inquiries", "Inquiries"],
  ];
  return (
    <header className="ws-header">
      <div className="ws-header-inner">
        <a href="#" className="ws-lockup" onClick={(e) => { e.preventDefault(); onNav && onNav("studio"); }}>
          WISE &amp; SAVVY
        </a>
        <nav className="ws-nav">
          {links.map(([id, label]) => (
            <a
              key={id}
              href={`#${id}`}
              className={"ws-nav-link" + (active === id ? " is-active" : "")}
              onClick={(e) => { e.preventDefault(); onNav && onNav(id); }}
            >{label}</a>
          ))}
        </nav>
        <a href="#worlds" className="ws-btn ws-btn-primary ws-header-cta" onClick={(e) => { e.preventDefault(); onNav && onNav("worlds"); }}>
          Enter Worlds
        </a>
      </div>
    </header>
  );
}

// ---- Eyebrow --------------------------------------------------------------
function Eyebrow({ children }) {
  return <span className="ws-eyebrow-pill"><span className="ws-dot"/>{children}</span>;
}

// ---- Buttons --------------------------------------------------------------
function Button({ children, variant = "primary", onClick, href }) {
  const cls = "ws-btn ws-btn-" + variant;
  if (href) return <a className={cls} href={href} onClick={onClick}>{children}</a>;
  return <button className={cls} onClick={onClick}>{children}</button>;
}

// ---- Vector divider (brand asset) -----------------------------------------
function VectorDivider({ flip = false }) {
  return (
    <div className={"ws-divider" + (flip ? " is-flip" : "")} aria-hidden="true">
      <svg viewBox="0 0 1440 160" preserveAspectRatio="none">
        <defs>
          <linearGradient id="ws-d-s" x1="0" x2="1440" y1="0" y2="0">
            <stop offset="0%" stopColor="#57D8FF" stopOpacity="0"/>
            <stop offset="34%" stopColor="#57D8FF" stopOpacity="0.72"/>
            <stop offset="62%" stopColor="#F4ECDD" stopOpacity="0.32"/>
            <stop offset="100%" stopColor="#57D8FF" stopOpacity="0"/>
          </linearGradient>
          <linearGradient id="ws-d-f" x1="0" x2="1440" y1="0" y2="0">
            <stop offset="0%" stopColor="#57D8FF" stopOpacity="0"/>
            <stop offset="42%" stopColor="#57D8FF" stopOpacity="0.1"/>
            <stop offset="62%" stopColor="#F4ECDD" stopOpacity="0.05"/>
            <stop offset="100%" stopColor="#57D8FF" stopOpacity="0"/>
          </linearGradient>
        </defs>
        <path d="M0 98C118 118 236 120 352 104C486 84 578 44 700 42C830 40 924 86 1044 102C1164 118 1296 112 1440 88"
              stroke="url(#ws-d-s)" strokeWidth="2" fill="none" strokeLinecap="round"/>
        <path d="M0 98C118 118 236 120 352 104C486 84 578 44 700 42C830 40 924 86 1044 102C1164 118 1296 112 1440 88V160H0V98Z"
              fill="url(#ws-d-f)"/>
      </svg>
    </div>
  );
}

// ---- Ambient smoke (runs forever) -----------------------------------------
// Multi-layer turbulence-displaced plumes + curl-noise fibers + drifting embers.
// Six independent CSS-keyframe layers (38–90s, none aligning) keep the field
// from ever visibly looping. Scroll just nudges intensity.
function AmbientBackground() {
  const fibersRef = React.useRef(null);
  const embersRef = React.useRef(null);
  const scrollRef = React.useRef(0);

  React.useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    const fibers = fibersRef.current;
    const embers = embersRef.current;
    if (!fibers || !embers) return;
    const fCtx = fibers.getContext('2d');
    const eCtx = embers.getContext('2d');

    function sizeCanvas(c) {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      c.width = Math.floor(window.innerWidth * dpr);
      c.height = Math.floor(window.innerHeight * dpr);
      c.style.width = window.innerWidth + 'px';
      c.style.height = window.innerHeight + 'px';
      c.getContext('2d').setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    const sizeAll = () => { sizeCanvas(fibers); sizeCanvas(embers); };
    sizeAll();
    window.addEventListener('resize', sizeAll);

    const onScroll = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      scrollRef.current = Math.max(0, Math.min(1, (window.scrollY || 0) / max));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Cheap value-noise → curl
    const H = new Uint8Array(512);
    for (let i = 0; i < 256; i++) H[i] = H[i + 256] = Math.floor(Math.random() * 256);
    const fade = t => t * t * t * (t * (t * 6 - 15) + 10);
    const lerp = (a, b, t) => a + (b - a) * t;
    const grad = (h, x, y) => {
      switch (h & 3) { case 0: return x + y; case 1: return -x + y; case 2: return x - y; default: return -x - y; }
    };
    const noise2 = (x, y) => {
      const xi = Math.floor(x) & 255, yi = Math.floor(y) & 255;
      const xf = x - Math.floor(x), yf = y - Math.floor(y);
      const u = fade(xf), v = fade(yf);
      const aa = H[H[xi] + yi], ab = H[H[xi] + yi + 1];
      const ba = H[H[xi + 1] + yi], bb = H[H[xi + 1] + yi + 1];
      return lerp(
        lerp(grad(aa, xf, yf), grad(ba, xf - 1, yf), u),
        lerp(grad(ab, xf, yf - 1), grad(bb, xf - 1, yf - 1), u),
        v
      );
    };
    const curl = (x, y) => {
      const e = 0.08;
      return [
        (noise2(x, y + e) - noise2(x, y - e)) / (2 * e),
        -(noise2(x + e, y) - noise2(x - e, y)) / (2 * e),
      ];
    };

    // Fibers
    const N_FIB = 220;
    const fibs = [];
    const resetFib = (i, hard = true) => {
      fibs[i] = {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        life: Math.random() * 300 + 160,
        age: hard ? Math.random() * 300 : 0,
        hue: Math.random() < 0.7 ? 'cyan' : 'violet',
        w: 0.4 + Math.random() * 0.9,
        seed: Math.random() * 1000,
      };
    };
    for (let i = 0; i < N_FIB; i++) resetFib(i);

    // Embers
    const N_EMB = 80;
    const ems = [];
    for (let i = 0; i < N_EMB; i++) {
      ems.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.25,
        vy: -0.04 - Math.random() * 0.22,
        r: 0.4 + Math.random() * 1.4,
        tw: Math.random() * Math.PI * 2,
      });
    }

    let t = 0;
    let raf;
    const frame = () => {
      t += 1;
      const tt = t * 0.0025;
      const W = window.innerWidth, Hpx = window.innerHeight;
      const flow = 1.6 + 0.4 * Math.sin(tt * 0.3);
      const updraft = -0.30 - 0.05 * Math.sin(tt * 0.2);
      const intensity = 0.85 + 0.15 * scrollRef.current;

      fCtx.globalCompositeOperation = 'destination-out';
      fCtx.fillStyle = 'rgba(0,0,0,0.085)';
      fCtx.fillRect(0, 0, W, Hpx);
      fCtx.globalCompositeOperation = 'lighter';

      for (let i = 0; i < N_FIB; i++) {
        const f = fibs[i];
        f.age += 1;
        if (f.age > f.life || f.x < -20 || f.x > W + 20 || f.y < -20 || f.y > Hpx + 20) { resetFib(i, false); continue; }
        const nx = (f.x + f.seed) * 0.0018;
        const ny = (f.y + f.seed) * 0.0018 + tt * 0.6;
        const [cx, cy] = curl(nx, ny);
        const px = f.x, py = f.y;
        f.x += cx * flow + 0.05 * Math.sin(tt + i * 0.1);
        f.y += cy * flow + updraft;
        const lifeRatio = f.age / f.life;
        const alpha = Math.sin(lifeRatio * Math.PI) * 0.30 * intensity;
        fCtx.strokeStyle = f.hue === 'cyan'
          ? `rgba(180,230,255,${alpha.toFixed(3)})`
          : `rgba(170,165,240,${(alpha * 0.85).toFixed(3)})`;
        fCtx.lineWidth = f.w;
        fCtx.beginPath();
        fCtx.moveTo(px, py);
        fCtx.lineTo(f.x, f.y);
        fCtx.stroke();
      }

      eCtx.clearRect(0, 0, W, Hpx);
      eCtx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < N_EMB; i++) {
        const e = ems[i];
        e.tw += 0.05;
        e.x += e.vx + Math.sin(e.tw * 0.5 + i) * 0.12;
        e.y += e.vy;
        if (e.y < -10) { e.y = Hpx + 10; e.x = Math.random() * W; }
        if (e.x < -10) e.x = W + 10;
        if (e.x > W + 10) e.x = -10;
        const flick = 0.5 + Math.sin(e.tw) * 0.5;
        const a = (0.16 + flick * 0.30) * intensity;
        const r = e.r * (1 + flick * 0.4);
        const g = eCtx.createRadialGradient(e.x, e.y, 0, e.x, e.y, r * 6);
        g.addColorStop(0, `rgba(220,240,255,${a.toFixed(3)})`);
        g.addColorStop(0.4, `rgba(87,216,255,${(a * 0.35).toFixed(3)})`);
        g.addColorStop(1, 'rgba(87,216,255,0)');
        eCtx.fillStyle = g;
        eCtx.beginPath();
        eCtx.arc(e.x, e.y, r * 6, 0, Math.PI * 2);
        eCtx.fill();
      }

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', sizeAll);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <div className="ws-ambient" aria-hidden="true">
      {/* Turbulence filters used by the plume layers */}
      <svg width="0" height="0" style={{position:'absolute'}} aria-hidden="true">
        <defs>
          <filter id="ws-turb-1" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.0065 0.010" numOctaves="2" seed="3"/>
            <feDisplacementMap in="SourceGraphic" scale="240" xChannelSelector="R" yChannelSelector="G"/>
          </filter>
          <filter id="ws-turb-2" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.009 0.013" numOctaves="2" seed="11"/>
            <feDisplacementMap in="SourceGraphic" scale="280" xChannelSelector="R" yChannelSelector="G"/>
          </filter>
          <filter id="ws-turb-3" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.0045 0.008" numOctaves="3" seed="7"/>
            <feDisplacementMap in="SourceGraphic" scale="360" xChannelSelector="R" yChannelSelector="G"/>
          </filter>
          <filter id="ws-turb-4" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.020 0.030" numOctaves="2" seed="19"/>
            <feDisplacementMap in="SourceGraphic" scale="120" xChannelSelector="R" yChannelSelector="G"/>
          </filter>
          <filter id="ws-turb-5" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.011 0.014" numOctaves="2" seed="27"/>
            <feDisplacementMap in="SourceGraphic" scale="220" xChannelSelector="R" yChannelSelector="G"/>
          </filter>
          <filter id="ws-turb-6" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.0050 0.0075" numOctaves="2" seed="33"/>
            <feDisplacementMap in="SourceGraphic" scale="300" xChannelSelector="R" yChannelSelector="G"/>
          </filter>
        </defs>
      </svg>

      <div className="ws-smoke-wrap">
        <div className="ws-plume ws-plume-3"/>
        <div className="ws-plume ws-plume-6"/>
        <div className="ws-plume ws-plume-2"/>
        <div className="ws-plume ws-plume-5"/>
        <div className="ws-plume ws-plume-1"/>
        <div className="ws-plume ws-plume-4"/>
      </div>
      <div className="ws-glow ws-glow-violet"/>
      <div className="ws-glow ws-glow-accent"/>
      <canvas ref={fibersRef} className="ws-fibers"/>
      <canvas ref={embersRef} className="ws-embers"/>
      <div className="ws-grid"/>
      <div className="ws-noise"/>
      <div className="ws-vignette"/>
    </div>
  );
}

// ---- Hero -----------------------------------------------------------------
function Hero({ onEnter }) {
  return (
    <section className="ws-hero" id="studio">
      <div className="ws-section-shell ws-hero-grid">
        <div className="ws-hero-left">
          <Eyebrow>A Studio of Worlds</Eyebrow>
          <h1 className="ws-h1">
            A studio world where ideas become <em>worlds you can enter.</em>
          </h1>
          <p className="ws-lead">
            Wise &amp; Savvy is Joshua Blake&rsquo;s studio. Five worlds — EverAfterAI, Root Races, WiseGold, Power Studio, and Texas Lottery Oracle — each with their own surface, all carrying one voice.
          </p>
          <div className="ws-hero-ctas">
            <Button onClick={onEnter}>Enter Worlds</Button>
            <Button variant="secondary" href="#studio">Open DeepDive</Button>
          </div>
          <div className="ws-hero-meta">
            <div><span className="ws-label">Current node</span><div className="ws-meta-val">EverAfterAI · live</div></div>
            <div><span className="ws-label">Latest transmission</span><div className="ws-meta-val">April 2026</div></div>
          </div>
        </div>
        <aside className="ws-hero-panel">
          <div className="ws-hero-panel-eyebrow">The Map</div>
          <h2 className="ws-hero-panel-title">Five worlds, one studio.</h2>
          <p className="ws-hero-panel-lead">
            Each world carries its own surface. Together they map an archive of ideas, fiction, research, and live public experiments.
          </p>
          <ul className="ws-hero-panel-list">
            {[
              ["EverAfterAI", "AI concept world"],
              ["Root Races", "Noir fiction archive"],
              ["WiseGold", "Signal economics"],
              ["Power Studio", "Research branch"],
              ["Texas Lottery Oracle", "Live app"],
            ].map(([name, sub]) => (
              <li key={name}>
                <span className="ws-hero-panel-name">{name}</span>
                <span className="ws-hero-panel-sub">{sub}</span>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </section>
  );
}

// ---- Worlds ledger --------------------------------------------------------
const WORLDS = [
  { id: "everafter", eyebrow: "AI Concept World", title: "EverAfterAI", phase: "Live public node",
    lead: "A digital family tree fused with AI that stores family information and lets people interact with it.",
    ticks: ["Family history stored in one connected archive.", "AI interaction layered on stored memory.", "Presence across generations, not just records."],
    cta: "Visit EverAfter" },
  { id: "root", eyebrow: "Noir Fiction World", title: "Root Races", phase: "Published",
    lead: "Joshua Blake's noir fiction world about hidden power, spiritual conflict, and metaphysical intrigue.",
    ticks: ["Reads like a dark recovered archive.", "Secret structures and symbolic consequence.", "Available on Barnes & Noble and Reedsy."],
    cta: "Open the archive" },
  { id: "wisegold", eyebrow: "Cultural Value", title: "WiseGold", phase: "Concept architecture",
    lead: "A concept for programmable reputation and social currency — signal economics for cultural value.",
    ticks: ["White paper exploring signal, not speculation.", "Reputation as a programmable substrate."],
    cta: "Read the white paper" },
  { id: "power", eyebrow: "Research Branch", title: "Power Studio",  phase: "Active",
    lead: "The studio branch holding DeepDive — a living archive of research, model packages, and systems in progress.",
    ticks: ["SELF, CPT, MSR, UBI model packages.", "VRFLottery and on-chain systems.", "Platform folders for long-running inquiries."],
    cta: "Open DeepDive" },
  { id: "oracle", eyebrow: "Live Lottery World", title: "Texas Lottery Oracle", phase: "Live",
    lead: "A verifiable, VRF-backed lottery oracle — a live experiment in cryptographic fairness.",
    ticks: ["Chainlink VRF verifiable draws.", "Runs as a public web app today."],
    cta: "Launch the live app" },
];

function WorldsLedger({ onOpen }) {
  return (
    <section className="ws-section" id="worlds">
      <div className="ws-section-shell">
        <header className="ws-section-head">
          <Eyebrow>The Worlds</Eyebrow>
          <h2 className="ws-h2">Each world carries its own surface.</h2>
          <p className="ws-section-sub">
            They read like chapters in a single archive. Enter any one and the voice stays consistent; the subject changes.
          </p>
        </header>
        <div className="ws-ledger">
          {WORLDS.map((w) => (
            <article key={w.id} className="ws-ledger-row">
              <div className="ws-ledger-id">
                <div className="ws-ledger-eyebrow">{w.eyebrow}</div>
                <h3 className="ws-ledger-title">{w.title}</h3>
                <span className="ws-phase">{w.phase}</span>
              </div>
              <div className="ws-ledger-body">
                <p className="ws-ledger-lead">{w.lead}</p>
                <ul className="ws-ticks">{w.ticks.map((t,i) => <li key={i}>{t}</li>)}</ul>
              </div>
              <div className="ws-ledger-cta">
                <Button onClick={() => onOpen && onOpen(w.id)}>{w.cta}</Button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---- Artifacts (cards) ----------------------------------------------------
function Artifacts() {
  const items = [
    { kind: "White paper", title: "WiseGold: Social Currency", meta: "PDF · 2025" },
    { kind: "Model package", title: "SELF — Sovereign Economic Layer", meta: "DeepDive · draft 3" },
    { kind: "Transmission", title: "Notes on metaphysical intrigue", meta: "Root Races · chapter notes" },
    { kind: "System", title: "VRFLottery — Chainlink-verified draws", meta: "Live · Texas Lottery Oracle" },
  ];
  return (
    <section className="ws-section" id="artifacts">
      <div className="ws-section-shell">
        <header className="ws-section-head">
          <Eyebrow>Artifacts</Eyebrow>
          <h2 className="ws-h2">Documents from the archive.</h2>
        </header>
        <div className="ws-artifact-grid">
          {items.map((a, i) => (
            <a key={i} href="#artifacts" className="ws-artifact" onClick={(e)=>e.preventDefault()}>
              <div className="ws-artifact-kind">{a.kind}</div>
              <h4 className="ws-artifact-title">{a.title}</h4>
              <div className="ws-artifact-meta">{a.meta}</div>
              <div className="ws-artifact-arrow">Open →</div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---- Inquiries ------------------------------------------------------------
function Inquiries() {
  const [sent, setSent] = useState(false);
  return (
    <section className="ws-section" id="inquiries">
      <div className="ws-section-shell ws-inquiries-grid">
        <div>
          <Eyebrow>Inquiries</Eyebrow>
          <h2 className="ws-h2">Open a signal to the studio.</h2>
          <p className="ws-lead">
            Working inquiries, press, or collaboration — name the world or artifact and we&rsquo;ll follow the thread.
          </p>
        </div>
        <form className="ws-form" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
          <label>
            <span className="ws-label">Subject</span>
            <input type="text" placeholder="Name the world or artifact" />
          </label>
          <div className="ws-form-row">
            <label><span className="ws-label">Name</span><input placeholder="Your name"/></label>
            <label><span className="ws-label">Channel</span><input placeholder="Email / signal"/></label>
          </div>
          <label>
            <span className="ws-label">Message</span>
            <textarea rows={3} placeholder="Write your message..."/>
          </label>
          <div className="ws-form-foot">
            <Button>{sent ? "Transmission received" : "Send transmission"}</Button>
            <span className="ws-meta">Replies within a week.</span>
          </div>
        </form>
      </div>
    </section>
  );
}

// ---- Footer ---------------------------------------------------------------
function SiteFooter() {
  return (
    <footer className="ws-footer">
      <div className="ws-section-shell ws-footer-grid">
        <div>
          <div className="ws-lockup">WISE &amp; SAVVY</div>
          <p className="ws-footer-note">A studio world. Joshua Blake.</p>
        </div>
        <div>
          <div className="ws-label">Worlds</div>
          <ul>
            <li>EverAfterAI</li><li>Root Races</li><li>WiseGold</li><li>Power Studio</li><li>Texas Lottery Oracle</li>
          </ul>
        </div>
        <div>
          <div className="ws-label">Archive</div>
          <ul><li>DeepDive</li><li>Artifacts</li><li>Transmissions</li><li>Inquiries</li></ul>
        </div>
        <div>
          <div className="ws-label">Signal</div>
          <p className="ws-footer-note">wiseandsavvy.com</p>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, {
  SiteHeader, Eyebrow, Button, VectorDivider, AmbientBackground,
  Hero, WorldsLedger, Artifacts, Inquiries, SiteFooter,
});
