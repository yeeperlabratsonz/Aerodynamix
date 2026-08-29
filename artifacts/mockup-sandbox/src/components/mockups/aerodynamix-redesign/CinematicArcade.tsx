import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  ChevronRight,
  CircleHelp,
  Clock3,
  Command,
  Gamepad2,
  Heart,
  Menu,
  Pause,
  Play,
  Search,
  Settings2,
  SlidersHorizontal,
  Sparkles,
  X,
  Volume2,
} from "lucide-react";

const imageRoot = "/__mockup/images/aerodynamix/";

type Game = {
  file: string;
  name: string;
  category: string;
  time: string;
};

const games: Game[] = [
  ["run-3.jpg", "Run 3", "Arcade", "Quick"],
  ["drive-mad.jpg", "Drive Mad", "Racing", "Quick"],
  ["retro-bowl.jpg", "Retro Bowl", "Sports", "10 min"],
  ["slope.jpg", "Slope", "Arcade", "Quick"],
  ["mc.png", "Minecraft", "Adventure", "Long play"],
  ["supersmashflash.jpg", "Super Smash Flash", "Fighting", "15 min"],
  ["papaspizzeria.png", "Papa's Pizzeria", "Strategy", "20 min"],
  ["papasfreezeria.png", "Papa's Freezeria", "Strategy", "20 min"],
  ["papas-pancakeria.png", "Papa's Pancakeria", "Strategy", "20 min"],
  ["papas-bakeria.png", "Papa's Bakeria", "Strategy", "20 min"],
  ["meat-boy.png", "Meat Boy", "Platformer", "Quick"],
  ["newgrounds-rumble.png", "Newgrounds Rumble", "Fighting", "15 min"],
  ["we-become-what-we-behold.png", "We Become What We Behold", "Story", "5 min"],
  ["bad-time-simulator.png", "Bad Time Simulator", "Arcade", "Quick"],
  ["deltarune.png", "Deltarune", "Adventure", "Long play"],
  ["adventure-capitalist.png", "Adventure Capitalist", "Strategy", "10 min"],
  ["fridaynightfunkin.png", "Friday Night Funkin'", "Rhythm", "Quick"],
  ["run-2.png", "Run 2", "Arcade", "Quick"],
  ["picoschool.png", "Pico's School", "Story", "15 min"],
  ["worldshardestgame.png", "World's Hardest Game", "Arcade", "Quick"],
  ["sandboxels.png", "Sandboxels", "Creative", "Long play"],
  ["alien-hominid.png", "Alien Hominid", "Action", "15 min"],
  ["subway-surfers-sf.jpg", "Subway Surfers San Francisco", "Racing", "Quick"],
  ["hobo-1.png", "Hobo 1", "Action", "Quick"],
  ["hobo-2.png", "Hobo 2", "Action", "Quick"],
  ["hobo-3.png", "Hobo 3", "Action", "Quick"],
  ["hobo-4.png", "Hobo 4", "Action", "Quick"],
  ["hobo-5.png", "Hobo 5", "Action", "Quick"],
  ["hobo-6.png", "Hobo 6", "Action", "Quick"],
  ["hobo-7.png", "Hobo 7", "Action", "Quick"],
  ["gladihoppers.jpg", "Gladihoppers", "Action", "10 min"],
  ["fruit-ninja.png", "Fruit Ninja", "Arcade", "Quick"],
  ["binding-of-isaac.png", "Binding of Isaac", "Adventure", "Long play"],
  ["crossy-road.png", "Crossy Road", "Arcade", "Quick"],
  ["cookie-clicker.png", "Cookie Clicker", "Creative", "Long play"],
  ["duck-life.png", "Duck Life", "Sports", "10 min"],
  ["geometry-dash-lite.jpg", "Geometry Dash Lite", "Rhythm", "Quick"],
  ["doom.png", "Doom", "Action", "15 min"],
  ["doki-doki-literature-club.jpg", "Doki Doki Literature Club", "Story", "Long play"],
  ["baldis-basics-classic-remastered.png", "Baldi's Basics Classic Remastered", "Story", "15 min"],
  ["stickmin-breaking-bank.jpg", "Breaking the Bank", "Story", "5 min"],
  ["stickmin-escaping-prison.avif", "Escaping the Prison", "Story", "10 min"],
  ["stickmin-stealing-diamond.avif", "Stealing the Diamond", "Story", "10 min"],
  ["stickmin-infiltrating-airship.avif", "Infiltrating the Airship", "Story", "10 min"],
  ["stickmin-fleeing-complex.avif", "Fleeing the Complex", "Story", "10 min"],
  ["greatest-game-square.svg", "The Greatest Game of All Time", "Special", "5 min"],
  ["nubbys-number-factory.jpg", "Nubby's Number Factory", "Creative", "15 min"],
].map(([file, name, category, time]) => ({ file, name, category, time }));

const navItems = ["Games", "Apps", "Media Player", "Connect"];
const categories = ["All games", "Arcade", "Action", "Story", "Strategy", "Quick play"];
const featuredGames = games.slice(0, 4);
const heroGame = games[0];

export function CinematicArcade() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All games");
  const [menuOpen, setMenuOpen] = useState(false);
  const [favoriteGames, setFavoriteGames] = useState<Set<string>>(new Set(["Run 3"]));
  const [selectedGame, setSelectedGame] = useState<Game>(games[0]);
  const [playing, setPlaying] = useState(false);
  const [dockOpen, setDockOpen] = useState(true);
  const [volume, setVolume] = useState(72);

  const shownGames = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return games.filter((game) => {
      const matchesQuery = game.name.toLowerCase().includes(normalizedQuery);
      const matchesCategory =
        activeCategory === "All games" ||
        (activeCategory === "Quick play" ? game.time === "Quick" : game.category === activeCategory);
      return matchesQuery && matchesCategory;
    });
  }, [activeCategory, query]);

  const toggleFavorite = (name: string) => {
    setFavoriteGames((current) => {
      const next = new Set(current);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const launchGame = (game: Game) => {
    setSelectedGame(game);
    setPlaying(true);
  };

  return (
    <main className="cinematic-arcade min-h-[100dvh] overflow-x-hidden pb-24 text-slate-100">
      <div className="cinematic-noise" aria-hidden="true" />
      <nav className="cinematic-nav" aria-label="Aerodynamix navigation">
        <button className="cinematic-wordmark" type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Aerodynamix home">
          <img src={`${imageRoot}logo.gif`} alt="" />
          <span><b>A</b>ERODYNAMIX</span>
        </button>
        <div className={`cinematic-nav-links ${menuOpen ? "is-open" : ""}`}>
          {navItems.map((item, index) => (
            <button key={item} className={index === 0 ? "is-active" : ""} type="button" onClick={() => setMenuOpen(false)}>
              {item}
            </button>
          ))}
        </div>
        <button className="cinematic-settings" type="button" onClick={() => setMenuOpen(false)}>
          <Settings2 size={15} /> Settings
        </button>
        <button className="cinematic-menu" type="button" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-label="Toggle navigation menu">
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
          <span>{menuOpen ? "Close" : "Menu"}</span>
        </button>
      </nav>

      <section className="cinematic-hero" aria-labelledby="hero-title">
        <img className="cinematic-hero-image" src={`${imageRoot}${heroGame.file}`} alt="" />
        <div className="cinematic-hero-tint" />
        <div className="cinematic-hero-grid" aria-hidden="true" />
        <div className="cinematic-hero-content">
          <div className="cinematic-kicker"><span className="cinematic-pulse" /> Your next five minutes, sorted</div>
          <p className="cinematic-eyebrow">Featured game / 001</p>
          <h1 id="hero-title">Run<br /><em>3</em></h1>
          <p className="cinematic-hero-copy">Keep moving. The floor is optional, the momentum is not.</p>
          <div className="cinematic-hero-actions">
            <button className="cinematic-play-button" type="button" onClick={() => launchGame(heroGame)}>
              <Play size={16} fill="currentColor" /> Play now <ArrowUpRight size={16} />
            </button>
            <button className={`cinematic-save-button ${favoriteGames.has(heroGame.name) ? "is-saved" : ""}`} type="button" onClick={() => toggleFavorite(heroGame.name)} aria-label={`Save ${heroGame.name}`}>
              <Heart size={18} fill={favoriteGames.has(heroGame.name) ? "currentColor" : "none"} />
            </button>
          </div>
          <div className="cinematic-hero-meta">
            <span><Gamepad2 size={14} /> Browser arcade</span>
            <span><Clock3 size={14} /> Quick play</span>
            <span className="cinematic-meta-dot">No account needed</span>
          </div>
        </div>
        <div className="cinematic-hero-index" aria-hidden="true"><strong>01</strong><span>/</span><span>04</span></div>
        <div className="cinematic-hero-scroll"><span>Scroll to browse</span><ChevronRight size={16} /></div>
      </section>

      <section className="cinematic-featured-section" aria-labelledby="spotlight-title">
        <div className="cinematic-section-heading">
          <div>
            <p className="cinematic-section-label"><Sparkles size={14} /> The spotlight</p>
            <h2 id="spotlight-title">Start with something good.</h2>
          </div>
          <p className="cinematic-section-note">Four hand-picked ways to disappear for a while.</p>
        </div>
        <div className="cinematic-featured-grid">
          {featuredGames.map((game, index) => (
            <button key={game.name} className={`cinematic-feature-card ${selectedGame.name === game.name ? "is-selected" : ""}`} type="button" onClick={() => launchGame(game)}>
              <span className="cinematic-feature-number">0{index + 1}</span>
              <img src={`${imageRoot}${game.file}`} alt={game.name} />
              <span className="cinematic-feature-overlay" />
              <span className="cinematic-feature-info"><strong>{game.name}</strong><small>{game.category} · {game.time}</small></span>
              <span className="cinematic-feature-play"><Play size={15} fill="currentColor" /></span>
            </button>
          ))}
        </div>
      </section>

      <section className="cinematic-library-section" aria-labelledby="library-title">
        <div className="cinematic-library-topline">
          <div>
            <p className="cinematic-section-label"><Command size={14} /> The collection</p>
            <h2 id="library-title">Find your next <i>thing.</i></h2>
          </div>
          <span className="cinematic-library-count">{shownGames.length} titles online</span>
        </div>
        <div className="cinematic-library-tools">
          <label className="cinematic-search">
            <Search size={17} />
            <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search the library" aria-label="Search the game library" />
            {query && <button type="button" onClick={() => setQuery("")} aria-label="Clear search"><X size={15} /></button>}
          </label>
          <div className="cinematic-filter-scroll" aria-label="Filter games">
            <SlidersHorizontal size={15} />
            {categories.map((category) => (
              <button key={category} className={activeCategory === category ? "is-active" : ""} type="button" onClick={() => setActiveCategory(category)}>
                {category}
              </button>
            ))}
          </div>
        </div>
        {shownGames.length > 0 ? (
          <div className="cinematic-library-grid">
            {shownGames.map((game, index) => (
              <article className={`cinematic-game-card ${selectedGame.name === game.name ? "is-selected" : ""}`} key={game.name}>
                <button className="cinematic-game-art" type="button" onClick={() => launchGame(game)} aria-label={`Play ${game.name}`}>
                  <img src={`${imageRoot}${game.file}`} alt="" loading={index > 8 ? "lazy" : "eager"} />
                  <span className="cinematic-game-hover"><Play size={19} fill="currentColor" /></span>
                  <span className="cinematic-game-tag">{game.category}</span>
                </button>
                <div className="cinematic-game-footer">
                  <button type="button" onClick={() => launchGame(game)}><strong>{game.name}</strong><small>{game.time}</small></button>
                  <button className={`cinematic-heart ${favoriteGames.has(game.name) ? "is-saved" : ""}`} type="button" onClick={() => toggleFavorite(game.name)} aria-label={`${favoriteGames.has(game.name) ? "Remove" : "Save"} ${game.name}`}>
                    <Heart size={15} fill={favoriteGames.has(game.name) ? "currentColor" : "none"} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="cinematic-empty"><Search size={23} /><strong>Nothing in that lane yet.</strong><p>Try a different title or clear the filter.</p><button type="button" onClick={() => { setQuery(""); setActiveCategory("All games"); }}>Reset library</button></div>
        )}
      </section>

      <footer className="cinematic-footer">
        <span><img src={`${imageRoot}logo.gif`} alt="" /> Aerodynamix</span>
        <span>Good games, no ceremony.</span>
        <button type="button" aria-label="Help"><CircleHelp size={17} /></button>
      </footer>

      {dockOpen ? (
        <aside className="cinematic-dock" aria-label="Media player">
          <div className="cinematic-dock-track">
            <div className={`cinematic-dock-art ${playing ? "is-playing" : ""}`}><img src={`${imageRoot}${selectedGame.file}`} alt="" /></div>
            <div><span className="cinematic-dock-label">{playing ? "Now launching" : "Aerodynamix radio"}</span><strong>{playing ? selectedGame.name : "Press play when you're ready"}</strong></div>
          </div>
          <div className="cinematic-dock-controls">
            <button type="button" aria-label={playing ? "Pause" : "Play"} onClick={() => setPlaying((value) => !value)}>{playing ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}</button>
            <div className="cinematic-dock-line"><span style={{ width: playing ? "42%" : "18%" }} /></div>
            <span className="cinematic-dock-time">{playing ? "0:42" : "0:00"} <i>/ 2:18</i></span>
          </div>
          <div className="cinematic-dock-volume"><Volume2 size={15} /><input type="range" min="0" max="100" value={volume} onChange={(event) => setVolume(Number(event.target.value))} aria-label="Volume" /></div>
          <button className="cinematic-dock-close" type="button" onClick={() => setDockOpen(false)} aria-label="Close media player"><X size={16} /></button>
        </aside>
      ) : (
        <button className="cinematic-dock-reopen" type="button" onClick={() => setDockOpen(true)}><Volume2 size={15} /> Media player</button>
      )}
      <style>{`
        .cinematic-arcade { --ink: #f6f4ee; --muted: #9ca5b5; --blue: #8fc8ff; --ice: #d6f0ff; --panel: #101923; --line: rgba(214,240,255,.15); position: relative; background: #07101b; font-family: "Plus Jakarta Sans", "Trebuchet MS", sans-serif; }
        .cinematic-arcade * { box-sizing: border-box; }
        .cinematic-arcade button { color: inherit; font: inherit; cursor: pointer; }
        .cinematic-noise { position: fixed; z-index: 20; inset: 0; pointer-events: none; opacity: .035; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 160 160' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.7'/%3E%3C/svg%3E"); }
        .cinematic-nav { height: 68px; padding: 0 28px; position: fixed; z-index: 12; inset: 0 0 auto; display: flex; align-items: center; gap: 30px; border-bottom: 1px solid rgba(214,240,255,.11); background: rgba(7,16,27,.68); backdrop-filter: blur(18px); }
        .cinematic-wordmark { display: flex; align-items: center; gap: 10px; border: 0; background: transparent; padding: 0; letter-spacing: .12em; font-size: 12px; font-weight: 800; white-space: nowrap; }
        .cinematic-wordmark img { width: 35px; height: 35px; object-fit: cover; border-radius: 9px; background: #020a12; padding: 2px; }
        .cinematic-wordmark b { color: var(--blue); font-weight: 900; }
        .cinematic-nav-links { display: flex; align-items: center; gap: 4px; flex: 1; justify-content: center; }
        .cinematic-nav-links button, .cinematic-settings { border: 0; background: transparent; color: #aab7c8; border-radius: 7px; padding: 9px 13px; font-size: 11px; transition: background .2s ease, color .2s ease, transform .2s ease; }
        .cinematic-nav-links button:hover, .cinematic-nav-links button.is-active, .cinematic-settings:hover { color: var(--ink); background: rgba(143,200,255,.13); }
        .cinematic-nav-links button.is-active { box-shadow: inset 0 -2px var(--blue); }
        .cinematic-settings { display: flex; align-items: center; gap: 7px; color: var(--ink); }
        .cinematic-menu { display: none; align-items: center; gap: 7px; border: 1px solid var(--line); background: rgba(143,200,255,.1); border-radius: 8px; padding: 8px 10px; font-size: 11px; }
        .cinematic-hero { position: relative; min-height: 520px; overflow: hidden; border-bottom: 1px solid var(--line); }
        .cinematic-hero-image { position: absolute; inset: 0 0 0 35%; width: 65%; height: 100%; object-fit: cover; object-position: center; filter: saturate(.82) contrast(1.08); }
        .cinematic-hero-tint { position: absolute; inset: 0; background: linear-gradient(90deg, #07101b 0%, rgba(7,16,27,.96) 31%, rgba(7,16,27,.58) 59%, rgba(7,16,27,.11) 100%), linear-gradient(0deg, rgba(7,16,27,.92), transparent 33%); }
        .cinematic-hero-grid { position: absolute; inset: 0; opacity: .22; background-image: linear-gradient(rgba(214,240,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(214,240,255,.1) 1px, transparent 1px); background-size: 66px 66px; mask-image: linear-gradient(90deg, black, transparent 76%); }
        .cinematic-hero-content { position: relative; max-width: 1080px; margin: auto; padding: 124px 48px 65px; min-height: 520px; }
        .cinematic-kicker, .cinematic-eyebrow, .cinematic-section-label { text-transform: uppercase; letter-spacing: .18em; font-size: 10px; font-weight: 800; color: var(--blue); }
        .cinematic-kicker { display: inline-flex; align-items: center; gap: 8px; padding: 7px 11px; border: 1px solid rgba(143,200,255,.2); border-radius: 99px; background: rgba(143,200,255,.08); }
        .cinematic-pulse { width: 6px; height: 6px; border-radius: 50%; background: #9fe2b2; box-shadow: 0 0 0 4px rgba(159,226,178,.12); }
        .cinematic-eyebrow { margin: 60px 0 13px; color: #8293a9; }
        .cinematic-hero h1 { margin: 0; color: var(--ink); font-family: Georgia, "Times New Roman", serif; font-size: clamp(68px, 11vw, 126px); letter-spacing: -.08em; line-height: .78; font-weight: 400; }
        .cinematic-hero h1 em { color: var(--blue); font-style: italic; }
        .cinematic-hero-copy { max-width: 275px; margin: 25px 0; color: #b5c0ce; font-size: 13px; line-height: 1.65; }
        .cinematic-hero-actions { display: flex; align-items: center; gap: 10px; }
        .cinematic-play-button { display: inline-flex; align-items: center; gap: 10px; border: 0; padding: 12px 16px; color: #06121d; background: var(--ice); border-radius: 7px; font-size: 11px; font-weight: 800; box-shadow: 0 10px 30px rgba(143,200,255,.16); transition: transform .2s ease, background .2s ease; }
        .cinematic-play-button:hover { transform: translateY(-2px); background: #fff; }
        .cinematic-save-button { width: 40px; height: 40px; display: grid; place-items: center; border: 1px solid rgba(214,240,255,.22); border-radius: 7px; background: rgba(7,16,27,.4); color: #d3dce8; }
        .cinematic-save-button.is-saved, .cinematic-heart.is-saved { color: #f5a1aa; }
        .cinematic-hero-meta { display: flex; align-items: center; gap: 18px; margin-top: 46px; color: #8391a4; font-size: 10px; }
        .cinematic-hero-meta span { display: inline-flex; align-items: center; gap: 6px; }
        .cinematic-meta-dot::before { content: ""; width: 4px; height: 4px; background: #9fe2b2; border-radius: 50%; margin-right: 1px; }
        .cinematic-hero-index { position: absolute; right: 34px; bottom: 62px; display: flex; gap: 7px; align-items: baseline; color: #7b8a9e; font: 11px "Space Mono", monospace; }
        .cinematic-hero-index strong { color: var(--ice); font-size: 21px; }
        .cinematic-hero-scroll { position: absolute; right: 30px; bottom: 20px; display: flex; align-items: center; gap: 8px; color: #7b8a9e; font-size: 9px; letter-spacing: .14em; text-transform: uppercase; }
        .cinematic-featured-section, .cinematic-library-section { max-width: 1080px; margin: auto; padding: 60px 48px 45px; }
        .cinematic-section-heading, .cinematic-library-topline { display: flex; justify-content: space-between; align-items: end; gap: 24px; margin-bottom: 24px; }
        .cinematic-section-label { display: flex; align-items: center; gap: 7px; margin: 0 0 11px; color: #7592ad; }
        .cinematic-section-heading h2, .cinematic-library-topline h2 { margin: 0; color: var(--ink); font-family: Georgia, serif; font-size: clamp(28px, 4vw, 43px); font-weight: 400; letter-spacing: -.045em; }
        .cinematic-section-heading h2 { color: #eef1f0; }
        .cinematic-section-note { max-width: 190px; margin: 0 0 3px; color: #7f8e9e; font-size: 11px; line-height: 1.5; text-align: right; }
        .cinematic-featured-grid { display: grid; grid-template-columns: 1.35fr 1fr 1fr 1fr; gap: 9px; }
        .cinematic-feature-card { position: relative; min-width: 0; aspect-ratio: 1.25; overflow: hidden; padding: 0; border: 1px solid transparent; border-radius: 8px; background: #142130; text-align: left; transition: transform .25s ease, border-color .25s ease; }
        .cinematic-feature-card:hover, .cinematic-feature-card.is-selected { transform: translateY(-4px); border-color: rgba(143,200,255,.62); }
        .cinematic-feature-card img, .cinematic-feature-overlay { position: absolute; inset: 0; width: 100%; height: 100%; }
        .cinematic-feature-card img { object-fit: cover; transition: transform .35s ease, filter .35s ease; }
        .cinematic-feature-card:hover img { transform: scale(1.06); filter: saturate(1.1); }
        .cinematic-feature-overlay { background: linear-gradient(0deg, rgba(3,10,17,.94), transparent 60%); }
        .cinematic-feature-number { position: absolute; z-index: 1; top: 11px; left: 12px; color: rgba(240,247,255,.72); font: 10px "Space Mono", monospace; }
        .cinematic-feature-info { position: absolute; z-index: 1; inset: auto 12px 12px; display: flex; flex-direction: column; gap: 3px; }
        .cinematic-feature-info strong { color: #eef3f7; font-size: 12px; }
        .cinematic-feature-info small { color: #8ea2b6; font-size: 9px; }
        .cinematic-feature-play { position: absolute; z-index: 2; top: 10px; right: 10px; width: 29px; height: 29px; display: grid; place-items: center; border-radius: 50%; color: #06121d; background: var(--ice); opacity: 0; transform: translateY(4px); transition: opacity .2s ease, transform .2s ease; }
        .cinematic-feature-card:hover .cinematic-feature-play { opacity: 1; transform: translateY(0); }
        .cinematic-library-section { padding-top: 42px; }
        .cinematic-library-topline { align-items: center; }
        .cinematic-library-topline h2 i { color: var(--blue); font-style: italic; }
        .cinematic-library-count { color: #758699; font: 10px "Space Mono", monospace; }
        .cinematic-library-tools { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; }
        .cinematic-search { display: flex; align-items: center; gap: 9px; min-width: 230px; padding: 10px 12px; color: #8193a7; border: 1px solid var(--line); border-radius: 7px; background: rgba(16,25,35,.78); }
        .cinematic-search:focus-within { border-color: rgba(143,200,255,.7); }
        .cinematic-search input { width: 100%; min-width: 0; outline: 0; border: 0; color: #eaf1f6; background: transparent; font-size: 11px; }
        .cinematic-search input::placeholder { color: #728399; }
        .cinematic-search button { display: grid; place-items: center; padding: 0; border: 0; color: #8193a7; background: transparent; }
        .cinematic-filter-scroll { display: flex; align-items: center; gap: 5px; overflow-x: auto; scrollbar-width: none; color: #7c8da0; }
        .cinematic-filter-scroll::-webkit-scrollbar { display: none; }
        .cinematic-filter-scroll > svg { flex: 0 0 auto; margin-right: 4px; }
        .cinematic-filter-scroll button { flex: 0 0 auto; padding: 7px 9px; border: 1px solid transparent; border-radius: 5px; color: #7c8da0; background: transparent; font-size: 10px; white-space: nowrap; }
        .cinematic-filter-scroll button:hover, .cinematic-filter-scroll button.is-active { color: var(--ice); border-color: rgba(143,200,255,.24); background: rgba(143,200,255,.1); }
        .cinematic-library-grid { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 18px 10px; }
        .cinematic-game-card { min-width: 0; }
        .cinematic-game-art { position: relative; display: block; width: 100%; aspect-ratio: 1; overflow: hidden; padding: 0; border: 1px solid rgba(214,240,255,.09); border-radius: 7px; background: #142130; }
        .cinematic-game-art img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform .25s ease, filter .25s ease; }
        .cinematic-game-art:hover img { transform: scale(1.07); filter: brightness(.65) saturate(1.15); }
        .cinematic-game-hover { position: absolute; inset: 0; display: grid; place-items: center; color: var(--ice); opacity: 0; transition: opacity .2s ease; }
        .cinematic-game-art:hover .cinematic-game-hover { opacity: 1; }
        .cinematic-game-tag { position: absolute; left: 6px; bottom: 6px; padding: 3px 5px; border-radius: 3px; color: #d4e6f4; background: rgba(7,16,27,.72); font-size: 8px; }
        .cinematic-game-footer { display: flex; align-items: start; justify-content: space-between; gap: 4px; padding-top: 8px; }
        .cinematic-game-footer > button:first-child { display: flex; flex-direction: column; min-width: 0; padding: 0; border: 0; background: transparent; text-align: left; }
        .cinematic-game-footer strong { overflow: hidden; color: #d9e0e6; font-size: 10px; font-weight: 700; text-overflow: ellipsis; white-space: nowrap; }
        .cinematic-game-footer small { margin-top: 4px; color: #718194; font-size: 9px; }
        .cinematic-heart { flex: 0 0 auto; padding: 1px; border: 0; color: #697a8c; background: transparent; }
        .cinematic-heart:hover { color: #f5a1aa; }
        .cinematic-empty { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 55px 20px; border: 1px dashed rgba(214,240,255,.2); border-radius: 9px; color: #8391a4; text-align: center; }
        .cinematic-empty strong { color: #dce7ef; font-size: 13px; }
        .cinematic-empty p { margin: 0; font-size: 11px; }
        .cinematic-empty button { margin-top: 7px; padding: 8px 12px; border: 1px solid var(--line); border-radius: 5px; color: var(--ice); background: rgba(143,200,255,.1); font-size: 10px; }
        .cinematic-footer { display: flex; align-items: center; justify-content: space-between; max-width: 1080px; margin: 10px auto 110px; padding: 25px 48px; border-top: 1px solid var(--line); color: #6e7d8e; font-size: 10px; }
        .cinematic-footer span:first-child { display: flex; align-items: center; gap: 8px; color: #b8c5d1; font-weight: 700; }
        .cinematic-footer img { width: 21px; height: 21px; border-radius: 5px; }
        .cinematic-footer button { padding: 0; border: 0; color: #6e7d8e; background: transparent; }
        .cinematic-dock { position: fixed; z-index: 15; right: 20px; bottom: 16px; left: 20px; display: flex; align-items: center; gap: 18px; max-width: 1040px; margin: auto; padding: 10px 13px; border: 1px solid rgba(214,240,255,.18); border-radius: 10px; background: rgba(11,22,34,.94); box-shadow: 0 16px 50px rgba(0,0,0,.34); backdrop-filter: blur(18px); }
        .cinematic-dock-track { display: flex; align-items: center; gap: 10px; min-width: 220px; }
        .cinematic-dock-art { width: 38px; height: 38px; overflow: hidden; border-radius: 6px; background: #18293b; }
        .cinematic-dock-art img { width: 100%; height: 100%; object-fit: cover; opacity: .85; }
        .cinematic-dock-art.is-playing img { animation: cinematic-breathe 2.2s ease-in-out infinite; }
        .cinematic-dock-track div:last-child { min-width: 0; display: flex; flex-direction: column; gap: 3px; }
        .cinematic-dock-label { color: #7e9ab1; font-size: 8px; letter-spacing: .13em; text-transform: uppercase; }
        .cinematic-dock-track strong { overflow: hidden; color: #dce8ef; font-size: 10px; text-overflow: ellipsis; white-space: nowrap; }
        .cinematic-dock-controls { display: flex; align-items: center; gap: 10px; flex: 1; }
        .cinematic-dock-controls > button { width: 28px; height: 28px; display: grid; place-items: center; border: 0; border-radius: 50%; color: #06121d; background: var(--ice); }
        .cinematic-dock-line { height: 3px; flex: 1; overflow: hidden; border-radius: 2px; background: #293b4d; }
        .cinematic-dock-line span { display: block; height: 100%; border-radius: inherit; background: var(--blue); transition: width .2s ease; }
        .cinematic-dock-time { color: #b1bfca; font: 9px "Space Mono", monospace; white-space: nowrap; }
        .cinematic-dock-time i { color: #68788b; font-style: normal; }
        .cinematic-dock-volume { display: flex; align-items: center; gap: 7px; color: #8294a7; }
        .cinematic-dock-volume input { width: 70px; accent-color: var(--blue); }
        .cinematic-dock-close { display: grid; place-items: center; padding: 5px; border: 0; color: #78899a; background: transparent; }
        .cinematic-dock-reopen { position: fixed; z-index: 15; right: 20px; bottom: 18px; display: flex; align-items: center; gap: 7px; padding: 10px 13px; border: 1px solid var(--line); border-radius: 7px; color: var(--ice); background: #101e2b; font-size: 10px; }
        @keyframes cinematic-breathe { 50% { transform: scale(1.07); } }
        @media (max-width: 760px) {
          .cinematic-nav { padding: 0 14px; gap: 12px; }
          .cinematic-nav-links { position: absolute; top: 59px; right: 12px; left: 12px; display: none; flex-direction: column; align-items: stretch; padding: 7px; border: 1px solid var(--line); border-radius: 9px; background: rgba(9,21,33,.98); box-shadow: 0 20px 40px rgba(0,0,0,.35); }
          .cinematic-nav-links.is-open { display: flex; }
          .cinematic-nav-links button { text-align: left; }
          .cinematic-settings { display: none; }
          .cinematic-menu { display: inline-flex; margin-left: auto; }
          .cinematic-hero { min-height: 600px; }
          .cinematic-hero-image { inset: 0; width: 100%; opacity: .62; object-position: 62% center; }
          .cinematic-hero-tint { background: linear-gradient(0deg, #07101b 0%, rgba(7,16,27,.82) 44%, rgba(7,16,27,.2) 100%); }
          .cinematic-hero-content { min-height: 600px; padding: 105px 22px 52px; display: flex; flex-direction: column; justify-content: end; }
          .cinematic-eyebrow { margin-top: auto; }
          .cinematic-hero-meta { flex-wrap: wrap; gap: 10px 14px; margin-top: 30px; }
          .cinematic-hero-index { right: 20px; bottom: 62px; }
          .cinematic-hero-scroll { display: none; }
          .cinematic-featured-section, .cinematic-library-section { padding: 42px 16px 28px; }
          .cinematic-section-heading, .cinematic-library-topline { align-items: start; flex-direction: column; gap: 11px; }
          .cinematic-section-note { text-align: left; }
          .cinematic-featured-grid { display: flex; overflow-x: auto; gap: 8px; margin-right: -16px; padding-right: 16px; scrollbar-width: none; }
          .cinematic-feature-card { flex: 0 0 68vw; }
          .cinematic-feature-play { opacity: 1; transform: none; }
          .cinematic-library-tools { display: block; }
          .cinematic-search { width: 100%; margin-bottom: 11px; }
          .cinematic-filter-scroll { padding-bottom: 3px; }
          .cinematic-library-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 19px 9px; }
          .cinematic-footer { margin-bottom: 120px; padding: 22px 16px; }
          .cinematic-footer > span:nth-child(2) { display: none; }
          .cinematic-dock { right: 10px; bottom: 10px; left: 10px; flex-wrap: wrap; gap: 8px 12px; padding: 9px; }
          .cinematic-dock-track { min-width: 0; flex: 1; }
          .cinematic-dock-volume { display: none; }
          .cinematic-dock-controls { flex-basis: 100%; order: 3; }
        }
        @media (prefers-reduced-motion: reduce) {
          .cinematic-arcade *, .cinematic-arcade *::before, .cinematic-arcade *::after { animation-duration: .01ms !important; transition-duration: .01ms !important; }
        }
      `}</style>
    </main>
  );
}