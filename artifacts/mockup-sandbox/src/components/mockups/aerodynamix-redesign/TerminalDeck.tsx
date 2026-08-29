import { useMemo, useState, type ReactNode } from "react";
import {
  Check,
  ChevronDown,
  ChevronRight,
  Clock3,
  Command,
  Gamepad2,
  Heart,
  Menu,
  Pause,
  Play,
  Search,
  Settings2,
  SkipBack,
  SkipForward,
  SlidersHorizontal,
  Sparkles,
  Volume2,
  X,
  Zap,
} from "lucide-react";

type Game = {
  file: string;
  name: string;
  category: string;
  tone: string;
  meta: string;
  featured?: boolean;
};

const imageRoot = "/__mockup/images/aerodynamix/";

const games: Game[] = [
  { file: "run-3.jpg", name: "Run 3", category: "Arcade", tone: "orbit", meta: "Runner · 2009", featured: true },
  { file: "drive-mad.jpg", name: "Drive Mad", category: "Racing", tone: "heat", meta: "Physics · 2021", featured: true },
  { file: "papaspizzeria.png", name: "Papa's Pizzeria", category: "Casual", tone: "cream", meta: "Time management · 2007", featured: true },
  { file: "supersmashflash.jpg", name: "Super Smash Flash", category: "Action", tone: "violet", meta: "Fighter · 2006", featured: true },
  { file: "retro-bowl.jpg", name: "Retro Bowl", category: "Sports", tone: "field", meta: "Sports · 2020" },
  { file: "slope.jpg", name: "Slope", category: "Arcade", tone: "slope", meta: "Reflex · 2014" },
  { file: "mc.png", name: "Minecraft", category: "Adventure", tone: "block", meta: "Sandbox · 2011" },
  { file: "papasfreezeria.png", name: "Papa's Freezeria", category: "Casual", tone: "ice", meta: "Time management · 2011" },
  { file: "papas-pancakeria.png", name: "Papa's Pancakeria", category: "Casual", tone: "gold", meta: "Time management · 2012" },
  { file: "papas-bakeria.png", name: "Papa's Bakeria", category: "Casual", tone: "bake", meta: "Time management · 2016" },
  { file: "meat-boy.png", name: "Meat Boy", category: "Action", tone: "red", meta: "Platformer · 2010" },
  { file: "newgrounds-rumble.png", name: "Newgrounds Rumble", category: "Action", tone: "orange", meta: "Fighter · 2007" },
  { file: "we-become-what-we-behold.png", name: "We Become What We Behold", category: "Puzzle", tone: "press", meta: "Narrative · 2018" },
  { file: "bad-time-simulator.png", name: "Bad Time Simulator", category: "Action", tone: "bone", meta: "Bullet hell · 2015" },
  { file: "deltarune.png", name: "Deltarune", category: "Adventure", tone: "dark", meta: "RPG · 2018" },
  { file: "adventure-capitalist.png", name: "Adventure Capitalist", category: "Strategy", tone: "money", meta: "Idle · 2014" },
  { file: "fridaynightfunkin.png", name: "Friday Night Funkin'", category: "Music", tone: "funk", meta: "Rhythm · 2020" },
  { file: "run-2.png", name: "Run 2", category: "Arcade", tone: "orbit", meta: "Runner · 2008" },
  { file: "picoschool.png", name: "Pico's School", category: "Adventure", tone: "school", meta: "Point & click · 1999" },
  { file: "worldshardestgame.png", name: "World's Hardest Game", category: "Puzzle", tone: "hard", meta: "Reflex · 2007" },
  { file: "sandboxels.png", name: "Sandboxels", category: "Strategy", tone: "lab", meta: "Simulation · 2021" },
  { file: "alien-hominid.png", name: "Alien Hominid", category: "Action", tone: "alien", meta: "Arcade · 2004" },
  { file: "subway-surfers-sf.jpg", name: "Subway Surfers San Francisco", category: "Racing", tone: "city", meta: "Runner · 2012" },
  { file: "hobo-1.png", name: "Hobo 1", category: "Action", tone: "grit", meta: "Beat 'em up · 2008" },
  { file: "hobo-2.png", name: "Hobo 2", category: "Action", tone: "grit", meta: "Beat 'em up · 2009" },
  { file: "hobo-3.png", name: "Hobo 3", category: "Action", tone: "grit", meta: "Beat 'em up · 2010" },
  { file: "hobo-4.png", name: "Hobo 4", category: "Action", tone: "grit", meta: "Beat 'em up · 2011" },
  { file: "hobo-5.png", name: "Hobo 5", category: "Action", tone: "grit", meta: "Beat 'em up · 2012" },
  { file: "hobo-6.png", name: "Hobo 6", category: "Action", tone: "grit", meta: "Beat 'em up · 2013" },
  { file: "hobo-7.png", name: "Hobo 7", category: "Action", tone: "grit", meta: "Beat 'em up · 2014" },
  { file: "gladihoppers.jpg", name: "Gladihoppers", category: "Action", tone: "arena", meta: "Fighter · 2016" },
  { file: "fruit-ninja.png", name: "Fruit Ninja", category: "Arcade", tone: "fruit", meta: "Action · 2010" },
  { file: "binding-of-isaac.png", name: "Binding of Isaac", category: "Adventure", tone: "dungeon", meta: "Roguelike · 2011" },
  { file: "crossy-road.png", name: "Crossy Road", category: "Arcade", tone: "road", meta: "Reflex · 2014" },
  { file: "cookie-clicker.png", name: "Cookie Clicker", category: "Strategy", tone: "cookie", meta: "Idle · 2013" },
  { file: "duck-life.png", name: "Duck Life", category: "Sports", tone: "duck", meta: "Adventure · 2007" },
  { file: "geometry-dash-lite.jpg", name: "Geometry Dash Lite", category: "Music", tone: "dash", meta: "Rhythm · 2013" },
  { file: "doom.png", name: "Doom", category: "Action", tone: "hell", meta: "Shooter · 1993" },
  { file: "doki-doki-literature-club.jpg", name: "Doki Doki Literature Club", category: "Adventure", tone: "pink", meta: "Visual novel · 2017" },
  { file: "baldis-basics-classic-remastered.png", name: "Baldi's Basics Classic Remastered", category: "Puzzle", tone: "school", meta: "Horror · 2022" },
  { file: "stickmin-breaking-bank.jpg", name: "Breaking the Bank", category: "Puzzle", tone: "stick", meta: "Point & click · 2008" },
  { file: "stickmin-escaping-prison.avif", name: "Escaping the Prison", category: "Puzzle", tone: "stick", meta: "Point & click · 2010" },
  { file: "stickmin-stealing-diamond.avif", name: "Stealing the Diamond", category: "Puzzle", tone: "stick", meta: "Point & click · 2011" },
  { file: "stickmin-infiltrating-airship.avif", name: "Infiltrating the Airship", category: "Puzzle", tone: "stick", meta: "Point & click · 2013" },
  { file: "stickmin-fleeing-complex.avif", name: "Fleeing the Complex", category: "Puzzle", tone: "stick", meta: "Point & click · 2015" },
  { file: "greatest-game-square.svg", name: "The Greatest Game of All Time", category: "Arcade", tone: "greatest", meta: "Mystery · 2024" },
  { file: "nubbys-number-factory.jpg", name: "Nubby's Number Factory", category: "Strategy", tone: "factory", meta: "Simulation · 2024" },
];

const categories = ["All games", "Arcade", "Action", "Casual", "Puzzle", "Adventure", "Strategy"];
const recentNames = ["Run 3", "Drive Mad", "Papa's Pizzeria"];

function NavItem({
  icon,
  label,
  active,
  count,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  active?: boolean;
  count?: string;
  onClick: () => void;
}) {
  return (
    <button className={`td-nav-item ${active ? "is-active" : ""}`} type="button" onClick={onClick}>
      <span className="td-nav-icon">{icon}</span>
      <span className="td-nav-label">{label}</span>
      {count && <span className="td-nav-count">{count}</span>}
    </button>
  );
}

function GameCard({
  game,
  selected,
  favorite,
  onSelect,
  onFavorite,
}: {
  game: Game;
  selected: boolean;
  favorite: boolean;
  onSelect: () => void;
  onFavorite: () => void;
}) {
  return (
    <article className={`td-game-card ${selected ? "is-selected" : ""}`} onClick={onSelect}>
      <div className={`td-game-art tone-${game.tone}`}>
        <img src={`${imageRoot}${game.file}`} alt={game.name} loading="lazy" />
        <button
          className={`td-favorite ${favorite ? "is-favorite" : ""}`}
          type="button"
          aria-label={`${favorite ? "Remove" : "Add"} ${game.name} ${favorite ? "from" : "to"} favorites`}
          onClick={(event) => {
            event.stopPropagation();
            onFavorite();
          }}
        >
          <Heart size={14} fill={favorite ? "currentColor" : "none"} />
        </button>
        <span className="td-card-launch"><Play size={13} fill="currentColor" /></span>
      </div>
      <div className="td-game-card-copy">
        <h3>{game.name}</h3>
        <span>{game.category}</span>
      </div>
    </article>
  );
}

export function TerminalDeck() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All games");
  const [selectedName, setSelectedName] = useState("Run 3");
  const [favorites, setFavorites] = useState<string[]>(["Drive Mad", "Deltarune"]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [playerOpen, setPlayerOpen] = useState(true);
  const [activeNav, setActiveNav] = useState("Games");
  const [volume, setVolume] = useState(72);

  const selectedGame = games.find((game) => game.name === selectedName) ?? games[0];
  const featured = games.filter((game) => game.featured);
  const filteredGames = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return games.filter((game) => {
      const matchesQuery = !normalized || `${game.name} ${game.category}`.toLowerCase().includes(normalized);
      const matchesCategory = category === "All games" || game.category === category;
      return matchesQuery && matchesCategory;
    });
  }, [category, query]);

  const toggleFavorite = (name: string) => {
    setFavorites((current) => current.includes(name) ? current.filter((item) => item !== name) : [...current, name]);
  };

  const launchGame = (game: Game) => {
    setSelectedName(game.name);
    setPlaying(true);
  };

  return (
    <main className="td-shell">
      <style>{`
        .td-shell {
          --td-ink: #e7edf4;
          --td-muted: #8d9bae;
          --td-faint: #526174;
          --td-line: rgba(163, 183, 205, .13);
          --td-panel: #101923;
          --td-panel-2: #151f2c;
          --td-bg: #080d13;
          --td-cyan: #79e3d0;
          --td-blue: #75a9ff;
          --td-coral: #ff927f;
          min-height: 100dvh;
          color: var(--td-ink);
          background:
            radial-gradient(circle at 78% -10%, rgba(48, 105, 135, .22), transparent 31rem),
            linear-gradient(145deg, #0a1018 0%, #070b11 56%, #0b1118 100%);
          font-family: "DM Sans", "Plus Jakarta Sans", sans-serif;
          padding: 16px 16px 88px;
          overflow-x: hidden;
        }
        .td-shell *, .td-shell *::before, .td-shell *::after { box-sizing: border-box; }
        .td-shell button, .td-shell input { font: inherit; }
        .td-app { display: flex; min-height: calc(100dvh - 32px); max-width: 1280px; margin: 0 auto; }
        .td-sidebar {
          width: 174px; flex: 0 0 174px; display: flex; flex-direction: column; padding: 10px 12px 16px 2px;
          border-right: 1px solid var(--td-line); margin-right: 20px;
        }
        .td-mark { display: flex; align-items: center; gap: 9px; border: 0; color: var(--td-ink); background: transparent; padding: 0 6px; text-align: left; cursor: pointer; }
        .td-mark img { width: 30px; height: 30px; border-radius: 8px; object-fit: cover; background: #05080c; }
        .td-mark strong { font-size: 13px; letter-spacing: .15em; font-weight: 800; }
        .td-mark small { display: block; margin-top: 3px; color: var(--td-faint); font: 9px "Space Mono", monospace; letter-spacing: .08em; }
        .td-sidebar-heading { margin: 37px 9px 9px; color: #647489; font: 9px "Space Mono", monospace; letter-spacing: .13em; text-transform: uppercase; }
        .td-nav { display: grid; gap: 3px; }
        .td-nav-item { display: flex; align-items: center; gap: 10px; min-height: 37px; width: 100%; border: 1px solid transparent; border-radius: 8px; padding: 0 9px; color: #8d9bae; background: transparent; cursor: pointer; text-align: left; transition: color .2s ease, background .2s ease, border-color .2s ease, transform .2s ease; }
        .td-nav-item:hover { color: var(--td-ink); background: rgba(121, 227, 208, .06); transform: translateX(2px); }
        .td-nav-item.is-active { color: var(--td-cyan); background: rgba(121, 227, 208, .09); border-color: rgba(121, 227, 208, .16); }
        .td-nav-icon { display: grid; place-items: center; width: 16px; }
        .td-nav-icon svg { width: 15px; height: 15px; stroke-width: 1.8; }
        .td-nav-label { font-size: 12px; font-weight: 650; }
        .td-nav-count { margin-left: auto; color: #65758a; font: 10px "Space Mono", monospace; }
        .td-sidebar-foot { margin-top: auto; padding: 13px 8px 0; border-top: 1px solid var(--td-line); color: #718196; font: 9px "Space Mono", monospace; line-height: 1.65; }
        .td-signal { display: inline-flex; align-items: center; gap: 6px; color: var(--td-cyan); }
        .td-signal i { width: 6px; height: 6px; display: inline-block; border-radius: 50%; background: var(--td-cyan); box-shadow: 0 0 0 3px rgba(121,227,208,.1); }
        .td-main { min-width: 0; flex: 1; }
        .td-topbar { display: flex; align-items: center; justify-content: space-between; height: 42px; margin-bottom: 15px; }
        .td-breadcrumb { display: flex; align-items: center; gap: 8px; color: #738399; font: 10px "Space Mono", monospace; letter-spacing: .04em; }
        .td-breadcrumb strong { color: #cbd7e4; font-weight: 400; }
        .td-breadcrumb svg { width: 12px; }
        .td-top-actions { display: flex; align-items: center; gap: 8px; }
        .td-top-actions button { display: grid; place-items: center; width: 31px; height: 31px; color: #91a2b7; background: rgba(255,255,255,.035); border: 1px solid var(--td-line); border-radius: 7px; cursor: pointer; transition: .2s ease; }
        .td-top-actions button:hover { color: var(--td-cyan); border-color: rgba(121,227,208,.3); }
        .td-command { display: flex; align-items: center; gap: 10px; width: min(330px, 42vw); height: 32px; padding: 0 10px; color: #8d9bae; background: rgba(9, 15, 23, .8); border: 1px solid var(--td-line); border-radius: 7px; }
        .td-command:focus-within { border-color: rgba(121,227,208,.45); box-shadow: 0 0 0 3px rgba(121,227,208,.06); }
        .td-command svg { width: 14px; color: var(--td-cyan); flex: 0 0 auto; }
        .td-command input { min-width: 0; width: 100%; border: 0; outline: 0; color: var(--td-ink); background: transparent; font-size: 11px; }
        .td-command input::placeholder { color: #65758a; }
        .td-command kbd { display: inline-flex; align-items: center; gap: 2px; color: #647489; font: 9px "Space Mono", monospace; white-space: nowrap; }
        .td-menu-button { display: none !important; }
        .td-hero { position: relative; overflow: hidden; display: grid; grid-template-columns: 1.08fr .92fr; min-height: 182px; border: 1px solid rgba(121,227,208,.18); border-radius: 12px; background: linear-gradient(108deg, rgba(18, 37, 48, .96), rgba(14, 23, 34, .96)); }
        .td-hero::after { content: ""; position: absolute; inset: 0; pointer-events: none; opacity: .23; background-image: linear-gradient(rgba(121,227,208,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(121,227,208,.08) 1px, transparent 1px); background-size: 26px 26px; mask-image: linear-gradient(90deg, #000, transparent 75%); }
        .td-hero-copy { position: relative; z-index: 1; display: flex; flex-direction: column; justify-content: center; padding: 24px 25px; }
        .td-eyebrow { display: flex; align-items: center; gap: 8px; color: var(--td-cyan); font: 9px "Space Mono", monospace; letter-spacing: .14em; text-transform: uppercase; }
        .td-eyebrow span { color: #60758b; }
        .td-hero h1 { max-width: 395px; margin: 13px 0 7px; color: #f0f5f8; font-size: clamp(26px, 3.2vw, 42px); line-height: .99; letter-spacing: -.045em; font-weight: 750; }
        .td-hero p { margin: 0; color: #8999aa; font-size: 12px; }
        .td-hero-actions { display: flex; gap: 8px; margin-top: 18px; }
        .td-primary, .td-secondary { display: inline-flex; align-items: center; justify-content: center; gap: 8px; min-height: 31px; padding: 0 12px; border-radius: 6px; font-size: 11px; font-weight: 700; cursor: pointer; transition: transform .2s ease, background .2s ease, border-color .2s ease; }
        .td-primary { color: #0b1518; background: var(--td-cyan); border: 1px solid var(--td-cyan); }
        .td-primary:hover { transform: translateY(-2px); background: #a1f0e2; }
        .td-secondary { color: #b4c2d0; background: rgba(255,255,255,.04); border: 1px solid rgba(173,194,214,.2); }
        .td-secondary:hover { color: var(--td-ink); border-color: rgba(173,194,214,.44); }
        .td-hero-art { position: relative; min-height: 182px; }
        .td-hero-art img { position: absolute; inset: 17px 22px 17px 0; width: calc(100% - 25px); height: calc(100% - 34px); object-fit: cover; border-radius: 8px; opacity: .9; filter: saturate(.82) contrast(1.05); }
        .td-hero-art::before { content: "01"; position: absolute; z-index: 2; right: 27px; top: 26px; color: rgba(226,246,241,.65); font: 10px "Space Mono", monospace; letter-spacing: .08em; }
        .td-hero-art::after { content: ""; position: absolute; inset: 17px 22px 17px 0; border: 1px solid rgba(121,227,208,.31); border-radius: 8px; pointer-events: none; }
        .td-section { margin-top: 22px; }
        .td-section-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
        .td-section-title { display: flex; align-items: baseline; gap: 9px; margin: 0; color: #d8e1e9; font-size: 14px; font-weight: 700; letter-spacing: -.01em; }
        .td-section-title small { color: #607184; font: 9px "Space Mono", monospace; letter-spacing: .05em; }
        .td-text-button { display: inline-flex; align-items: center; gap: 5px; color: #7c8ea3; background: transparent; border: 0; font: 10px "Space Mono", monospace; cursor: pointer; }
        .td-text-button:hover { color: var(--td-cyan); }
        .td-recent-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 9px; }
        .td-recent { display: flex; align-items: center; min-width: 0; gap: 9px; padding: 8px; color: inherit; text-align: left; background: rgba(16,25,35,.72); border: 1px solid var(--td-line); border-radius: 8px; cursor: pointer; transition: transform .2s ease, border-color .2s ease, background .2s ease; }
        .td-recent:hover, .td-recent.is-selected { transform: translateY(-2px); border-color: rgba(121,227,208,.3); background: rgba(25,42,52,.88); }
        .td-recent img { width: 37px; height: 37px; flex: 0 0 auto; object-fit: cover; border-radius: 5px; }
        .td-recent-copy { min-width: 0; }
        .td-recent-copy strong { display: block; overflow: hidden; color: #d4dde7; font-size: 11px; text-overflow: ellipsis; white-space: nowrap; }
        .td-recent-copy span { display: block; margin-top: 4px; color: #687a8e; font: 9px "Space Mono", monospace; }
        .td-recent > svg { margin-left: auto; width: 13px; color: #526174; }
        .td-library-shell { display: grid; grid-template-columns: minmax(0, 1fr) 196px; gap: 13px; align-items: start; }
        .td-library-main { min-width: 0; }
        .td-toolbar { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 12px; }
        .td-filters { display: flex; gap: 5px; overflow-x: auto; scrollbar-width: none; }
        .td-filters::-webkit-scrollbar { display: none; }
        .td-filter { flex: 0 0 auto; min-height: 26px; padding: 0 9px; color: #8292a5; background: transparent; border: 1px solid transparent; border-radius: 5px; font: 9px "Space Mono", monospace; cursor: pointer; transition: .2s ease; }
        .td-filter:hover { color: #ced9e3; border-color: var(--td-line); }
        .td-filter.is-active { color: #081313; background: var(--td-cyan); border-color: var(--td-cyan); font-weight: 700; }
        .td-results-count { flex: 0 0 auto; color: #617287; font: 9px "Space Mono", monospace; white-space: nowrap; }
        .td-game-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 9px; }
        .td-game-card { min-width: 0; cursor: pointer; }
        .td-game-art { position: relative; overflow: hidden; aspect-ratio: 1.12; border: 1px solid var(--td-line); border-radius: 7px; background: #121c27; transition: transform .2s ease, border-color .2s ease, box-shadow .2s ease; }
        .td-game-card:hover .td-game-art, .td-game-card.is-selected .td-game-art { transform: translateY(-3px); border-color: rgba(121,227,208,.53); box-shadow: 0 10px 24px rgba(0,0,0,.25); }
        .td-game-art img { display: block; width: 100%; height: 100%; object-fit: cover; transition: transform .3s ease, filter .3s ease; }
        .td-game-card:hover .td-game-art img { transform: scale(1.05); filter: saturate(1.08); }
        .td-favorite { position: absolute; z-index: 2; top: 6px; right: 6px; display: grid; place-items: center; width: 24px; height: 24px; color: #e3eaf0; background: rgba(4,8,12,.63); border: 1px solid rgba(255,255,255,.14); border-radius: 50%; cursor: pointer; opacity: 0; transition: opacity .2s ease, color .2s ease, transform .2s ease; }
        .td-game-card:hover .td-favorite, .td-favorite.is-favorite { opacity: 1; }
        .td-favorite:hover { transform: scale(1.08); color: var(--td-coral); }
        .td-favorite.is-favorite { color: var(--td-coral); }
        .td-card-launch { position: absolute; inset: 0; display: grid; place-items: center; color: #09201e; opacity: 0; transition: opacity .2s ease; }
        .td-card-launch::before { content: ""; position: absolute; width: 34px; height: 34px; border-radius: 50%; background: rgba(121,227,208,.92); box-shadow: 0 8px 20px rgba(0,0,0,.25); }
        .td-card-launch svg { position: relative; z-index: 1; margin-left: 1px; }
        .td-game-card:hover .td-card-launch { opacity: 1; }
        .td-game-card-copy { padding: 6px 2px 0; }
        .td-game-card-copy h3 { overflow: hidden; margin: 0; color: #c5d0dc; font-size: 10px; font-weight: 700; text-overflow: ellipsis; white-space: nowrap; }
        .td-game-card-copy span { display: block; margin-top: 3px; color: #607184; font: 8px "Space Mono", monospace; }
        .td-detail { position: sticky; top: 10px; padding: 10px; background: rgba(16,25,35,.8); border: 1px solid var(--td-line); border-radius: 9px; }
        .td-detail-label { display: flex; align-items: center; justify-content: space-between; color: #65768b; font: 8px "Space Mono", monospace; letter-spacing: .08em; text-transform: uppercase; }
        .td-detail-label b { color: var(--td-cyan); font-weight: 400; }
        .td-detail img { display: block; width: 100%; aspect-ratio: 1.3; margin: 10px 0; object-fit: cover; border-radius: 6px; }
        .td-detail h2 { margin: 0; color: #edf3f6; font-size: 16px; line-height: 1.1; letter-spacing: -.03em; }
        .td-detail-meta { display: flex; gap: 6px; margin: 7px 0 13px; color: #718297; font: 8px "Space Mono", monospace; }
        .td-detail-meta span + span::before { content: "·"; margin-right: 6px; color: #415166; }
        .td-detail .td-primary { width: 100%; }
        .td-detail-foot { display: flex; align-items: center; justify-content: space-between; margin-top: 12px; color: #617287; font: 8px "Space Mono", monospace; }
        .td-detail-fav { display: inline-flex; align-items: center; gap: 5px; padding: 0; color: #7e8da0; background: transparent; border: 0; font: inherit; cursor: pointer; }
        .td-detail-fav:hover, .td-detail-fav.is-favorite { color: var(--td-coral); }
        .td-empty { grid-column: 1 / -1; padding: 35px 10px; color: #728399; text-align: center; border: 1px dashed rgba(145,164,185,.2); border-radius: 8px; font-size: 12px; }
        .td-player { position: fixed; z-index: 10; right: 16px; bottom: 14px; left: 16px; display: flex; align-items: center; gap: 17px; min-height: 57px; padding: 8px 12px; border: 1px solid rgba(121,227,208,.18); border-radius: 10px; background: rgba(11,18,27,.94); box-shadow: 0 18px 46px rgba(0,0,0,.38); backdrop-filter: blur(16px); }
        .td-player-track { display: flex; align-items: center; gap: 9px; min-width: 175px; }
        .td-player-track img { width: 38px; height: 38px; object-fit: cover; border-radius: 5px; }
        .td-player-track strong { display: block; color: #d8e2eb; font-size: 10px; }
        .td-player-track span { display: block; margin-top: 3px; color: #697a8e; font: 8px "Space Mono", monospace; }
        .td-player-controls { display: flex; align-items: center; gap: 6px; }
        .td-player-controls button, .td-player-close { display: grid; place-items: center; width: 25px; height: 25px; color: #90a0b2; background: transparent; border: 0; border-radius: 5px; cursor: pointer; }
        .td-player-controls button:hover, .td-player-close:hover { color: var(--td-cyan); background: rgba(121,227,208,.08); }
        .td-player-controls .td-player-play { width: 31px; height: 31px; color: #0b1518; background: var(--td-cyan); border-radius: 50%; }
        .td-player-controls .td-player-play:hover { color: #0b1518; background: #a1f0e2; }
        .td-player-progress { display: flex; align-items: center; gap: 9px; flex: 1; color: #607184; font: 8px "Space Mono", monospace; }
        .td-range { width: 100%; height: 3px; accent-color: var(--td-cyan); cursor: pointer; }
        .td-volume { display: flex; align-items: center; gap: 6px; width: 105px; }
        .td-volume svg { width: 14px; color: #718298; }
        .td-player-close { margin-left: auto; }
        .td-player-reopen { position: fixed; z-index: 10; right: 16px; bottom: 14px; min-height: 33px; padding: 0 12px; color: #081313; background: var(--td-cyan); border: 1px solid var(--td-cyan); border-radius: 6px; font: 700 10px "Space Mono", monospace; cursor: pointer; box-shadow: 0 12px 32px rgba(0,0,0,.3); }
        .td-player-reopen:hover { background: #a1f0e2; }
        @media (max-width: 760px) {
          .td-shell { padding: 9px 10px 104px; }
          .td-app { min-height: calc(100dvh - 18px); }
          .td-sidebar { position: fixed; z-index: 20; top: 9px; bottom: 9px; left: 10px; width: 226px; padding: 15px; margin: 0; border: 1px solid var(--td-line); border-radius: 11px; background: #0d151f; box-shadow: 0 25px 70px rgba(0,0,0,.5); transform: translateX(-120%); transition: transform .25s ease; }
          .td-sidebar.is-open { transform: translateX(0); }
          .td-sidebar-heading { margin-top: 32px; }
          .td-menu-button { display: grid !important; }
          .td-main { width: 100%; }
          .td-topbar { margin-bottom: 11px; }
          .td-topbar .td-breadcrumb { display: none; }
          .td-command { width: min(100%, 290px); }
          .td-hero { grid-template-columns: 1fr; min-height: 285px; }
          .td-hero-copy { padding: 22px 19px 13px; }
          .td-hero-art { min-height: 125px; }
          .td-hero-art img, .td-hero-art::after { inset: 0 14px 12px 14px; width: calc(100% - 28px); height: calc(100% - 12px); }
          .td-hero-art::before { right: 23px; top: 10px; }
          .td-recent-row { grid-template-columns: 1fr; }
          .td-library-shell { grid-template-columns: 1fr; }
          .td-detail { position: relative; order: -1; display: grid; grid-template-columns: 92px 1fr; gap: 0 10px; padding: 9px; }
          .td-detail-label { grid-column: 1 / -1; }
          .td-detail img { grid-row: 2 / span 4; width: 92px; aspect-ratio: 1; margin: 9px 0 0; }
          .td-detail h2 { align-self: end; margin-top: 9px; }
          .td-detail-meta { align-self: start; margin: 6px 0; }
          .td-detail .td-primary { align-self: start; }
          .td-detail-foot { display: none; }
        }
        @media (max-width: 500px) {
          .td-command { width: 100%; }
          .td-top-actions > button:not(.td-menu-button) { display: none; }
          .td-topbar { gap: 8px; }
          .td-topbar .td-command { flex: 1; }
          .td-hero h1 { font-size: 31px; }
          .td-game-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
          .td-game-art { aspect-ratio: 1.08; }
          .td-player { right: 10px; bottom: 9px; left: 10px; flex-wrap: wrap; gap: 6px 12px; padding: 8px; }
          .td-player-track { min-width: 0; flex: 1; }
          .td-player-controls { order: 2; }
          .td-player-progress { order: 3; flex-basis: 100%; }
          .td-volume { display: none; }
        }
      `}</style>

      <div className="td-app">
        <aside className={`td-sidebar ${menuOpen ? "is-open" : ""}`}>
          <button className="td-mark" type="button" onClick={() => setActiveNav("Games")}>
            <img src={`${imageRoot}logo.gif`} alt="Aerodynamix" />
            <span><strong>AERODYNAMIX</strong><small>PRIVATE / LAUNCH DECK</small></span>
          </button>
          <div className="td-sidebar-heading">Navigate</div>
          <nav className="td-nav" aria-label="Aerodynamix navigation">
            <NavItem icon={<Gamepad2 />} label="Games" active={activeNav === "Games"} onClick={() => setActiveNav("Games")} />
            <NavItem icon={<Sparkles />} label="Apps" active={activeNav === "Apps"} onClick={() => setActiveNav("Apps")} />
            <NavItem icon={<Volume2 />} label="Media Player" active={activeNav === "Media Player"} onClick={() => { setActiveNav("Media Player"); setPlayerOpen(true); }} />
            <NavItem icon={<Zap />} label="Connect" active={activeNav === "Connect"} onClick={() => setActiveNav("Connect")} />
          </nav>
          <div className="td-sidebar-heading">Your deck</div>
          <nav className="td-nav">
            <NavItem icon={<Heart />} label="Favorites" count={String(favorites.length).padStart(2, "0")} active={activeNav === "Favorites"} onClick={() => setActiveNav("Favorites")} />
            <NavItem icon={<Clock3 />} label="Recent" active={activeNav === "Recent"} onClick={() => setActiveNav("Recent")} />
            <NavItem icon={<Settings2 />} label="Settings" active={activeNav === "Settings"} onClick={() => setActiveNav("Settings")} />
          </nav>
          <div className="td-sidebar-foot"><span className="td-signal"><i /> SYSTEM READY</span><br />46 TITLES INDEXED<br />SYNCED JUST NOW</div>
        </aside>

        <section className="td-main">
          <header className="td-topbar">
            <div className="td-breadcrumb"><span>DECK</span><ChevronRight /><strong>{activeNav.toUpperCase()}</strong></div>
            <div className="td-top-actions">
              <label className="td-command">
                <Search />
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find a game..." aria-label="Search games" />
                <kbd><Command size={10} /> K</kbd>
              </label>
              <button type="button" aria-label="Open filters" onClick={() => setCategory(category === "All games" ? "Arcade" : "All games")}><SlidersHorizontal size={14} /></button>
              <button className="td-menu-button" type="button" aria-label="Toggle navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>{menuOpen ? <X size={15} /> : <Menu size={15} />}</button>
            </div>
          </header>

          <section className="td-hero" aria-label="Featured launch">
            <div className="td-hero-copy">
              <div className="td-eyebrow"><span>01</span> SPOTLIGHT <span>/</span> READY TO PLAY</div>
              <h1>Choose your next run.</h1>
              <p>A fast lane to the games worth opening.</p>
              <div className="td-hero-actions">
                <button className="td-primary" type="button" onClick={() => launchGame(selectedGame)}><Play size={13} fill="currentColor" /> Launch {selectedGame.name}</button>
                <button className="td-secondary" type="button" onClick={() => toggleFavorite(selectedGame.name)}><Heart size={13} fill={favorites.includes(selectedGame.name) ? "currentColor" : "none"} /> {favorites.includes(selectedGame.name) ? "Saved" : "Save"}</button>
              </div>
            </div>
            <div className="td-hero-art">
              <img src={`${imageRoot}${selectedGame.file}`} alt={`${selectedGame.name} featured artwork`} />
            </div>
          </section>

          <section className="td-section" aria-labelledby="recent-title">
            <div className="td-section-head">
              <h2 className="td-section-title" id="recent-title">Pick up where you left off <small>RECENT / 03</small></h2>
              <button className="td-text-button" type="button" onClick={() => { setQuery(""); setCategory("All games"); }}>View all <ChevronRight size={12} /></button>
            </div>
            <div className="td-recent-row">
              {recentNames.map((name) => {
                const game = games.find((item) => item.name === name)!;
                return <button className={`td-recent ${selectedName === name ? "is-selected" : ""}`} key={name} type="button" onClick={() => setSelectedName(name)}>
                  <img src={`${imageRoot}${game.file}`} alt="" />
                  <span className="td-recent-copy"><strong>{game.name}</strong><span>{game.meta}</span></span>
                  <ChevronRight size={13} />
                </button>;
              })}
            </div>
          </section>

          <section className="td-section" aria-labelledby="library-title">
            <div className="td-section-head">
              <h2 className="td-section-title" id="library-title">Game library <small>INDEX / {games.length}</small></h2>
              <span className="td-results-count">{filteredGames.length} MATCHES</span>
            </div>
            <div className="td-library-shell">
              <div className="td-library-main">
                <div className="td-toolbar">
                  <div className="td-filters" role="tablist" aria-label="Game categories">
                    {categories.map((item) => <button className={`td-filter ${category === item ? "is-active" : ""}`} key={item} type="button" role="tab" aria-selected={category === item} onClick={() => setCategory(item)}>{item}</button>)}
                  </div>
                  <span className="td-results-count"><Check size={10} /> LOCAL</span>
                </div>
                <div className="td-game-grid">
                  {filteredGames.length > 0 ? filteredGames.map((game) => <GameCard key={game.name} game={game} selected={selectedName === game.name} favorite={favorites.includes(game.name)} onSelect={() => setSelectedName(game.name)} onFavorite={() => toggleFavorite(game.name)} />) : <div className="td-empty">No titles match that search. Try a different signal.</div>}
                </div>
              </div>
              <aside className="td-detail" aria-label="Selected game">
                <div className="td-detail-label"><span>Selected title</span><b>READY</b></div>
                <img src={`${imageRoot}${selectedGame.file}`} alt={selectedGame.name} />
                <h2>{selectedGame.name}</h2>
                <div className="td-detail-meta"><span>{selectedGame.category}</span><span>{selectedGame.meta.split(" · ")[1]}</span></div>
                <button className="td-primary" type="button" onClick={() => launchGame(selectedGame)}><Play size={13} fill="currentColor" /> Launch now</button>
                <div className="td-detail-foot"><span>ONE STEP / NO QUEUE</span><button className={`td-detail-fav ${favorites.includes(selectedGame.name) ? "is-favorite" : ""}`} type="button" onClick={() => toggleFavorite(selectedGame.name)}><Heart size={12} fill={favorites.includes(selectedGame.name) ? "currentColor" : "none"} /> {favorites.includes(selectedGame.name) ? "Saved" : "Save"}</button></div>
              </aside>
            </div>
          </section>
        </section>
      </div>

      {playerOpen && <aside className="td-player" aria-label="Media player dock">
        <div className="td-player-track">
          <img src={`${imageRoot}logo.gif`} alt="" />
          <div><strong>{playing ? "Aerodynamix session" : "Media player dock"}</strong><span>{playing ? `${selectedGame.name} is ready` : "Nothing queued · choose a track"}</span></div>
        </div>
        <div className="td-player-controls">
          <button type="button" aria-label="Previous track"><SkipBack size={14} /></button>
          <button className="td-player-play" type="button" aria-label={playing ? "Pause" : "Play"} onClick={() => setPlaying((value) => !value)}>{playing ? <Pause size={13} fill="currentColor" /> : <Play size={13} fill="currentColor" />}</button>
          <button type="button" aria-label="Next track"><SkipForward size={14} /></button>
        </div>
        <div className="td-player-progress"><span>0:00</span><input className="td-range" type="range" min="0" max="100" defaultValue="18" aria-label="Track progress" /><span>0:00</span></div>
        <div className="td-volume"><Volume2 size={14} /><input className="td-range" type="range" min="0" max="100" value={volume} onChange={(event) => setVolume(Number(event.target.value))} aria-label="Volume" /></div>
        <button className="td-player-close" type="button" aria-label="Close media player" onClick={() => setPlayerOpen(false)}><X size={15} /></button>
      </aside>}
      {!playerOpen && <button className="td-player-reopen" type="button" onClick={() => setPlayerOpen(true)}>Open player</button>}
    </main>
  );
}