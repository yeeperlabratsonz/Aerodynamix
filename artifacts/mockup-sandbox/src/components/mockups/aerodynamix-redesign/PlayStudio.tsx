import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Heart,
  Headphones,
  Menu,
  PanelTop,
  Play,
  Search,
  Settings2,
  SlidersHorizontal,
  Sparkles,
  Volume2,
  X,
} from "lucide-react";

const imageRoot = "/__mockup/images/aerodynamix/";

type Game = {
  file: string;
  name: string;
  eyebrow: string;
  category: "Quick hit" | "Cozy" | "Story" | "Chaos";
  tone: string;
  size?: "wide" | "tall";
};

const games: Game[] = [
  { file: "run-3.jpg", name: "Run 3", eyebrow: "Orbiting classic", category: "Quick hit", tone: "sky" },
  { file: "drive-mad.jpg", name: "Drive Mad", eyebrow: "One more run", category: "Chaos", tone: "coral" },
  { file: "retro-bowl.jpg", name: "Retro Bowl", eyebrow: "Sunday energy", category: "Quick hit", tone: "cream" },
  { file: "slope.jpg", name: "Slope", eyebrow: "Clean lines", category: "Quick hit", tone: "mint" },
  { file: "mc.png", name: "Minecraft", eyebrow: "Build a little world", category: "Cozy", tone: "moss" },
  { file: "supersmashflash.jpg", name: "Super Smash Flash", eyebrow: "Everybody's here", category: "Chaos", tone: "red" },
  { file: "papaspizzeria.png", name: "Papa's Pizzeria", eyebrow: "Order up", category: "Cozy", tone: "butter" },
  { file: "papasfreezeria.png", name: "Papa's Freezeria", eyebrow: "Cold treats", category: "Cozy", tone: "ice" },
  { file: "papas-pancakeria.png", name: "Papa's Pancakeria", eyebrow: "Stack it high", category: "Cozy", tone: "peach" },
  { file: "papas-bakeria.png", name: "Papa's Bakeria", eyebrow: "Fresh from the oven", category: "Cozy", tone: "amber" },
  { file: "meat-boy.png", name: "Meat Boy", eyebrow: "Tiny hero, huge heart", category: "Chaos", tone: "rose" },
  { file: "newgrounds-rumble.png", name: "Newgrounds Rumble", eyebrow: "Internet legend", category: "Chaos", tone: "acid" },
  { file: "we-become-what-we-behold.png", name: "We Become What We Behold", eyebrow: "A short story", category: "Story", tone: "violet" },
  { file: "bad-time-simulator.png", name: "Bad Time Simulator", eyebrow: "Do not blink", category: "Chaos", tone: "ink" },
  { file: "deltarune.png", name: "Deltarune", eyebrow: "A longer night", category: "Story", tone: "blue" },
  { file: "adventure-capitalist.png", name: "Adventure Capitalist", eyebrow: "Numbers go up", category: "Quick hit", tone: "gold" },
  { file: "fridaynightfunkin.png", name: "Friday Night Funkin'", eyebrow: "Find the beat", category: "Chaos", tone: "pink" },
  { file: "run-2.png", name: "Run 2", eyebrow: "Before the orbit", category: "Quick hit", tone: "sky" },
  { file: "picoschool.png", name: "Pico's School", eyebrow: "After class", category: "Story", tone: "orange" },
  { file: "worldshardestgame.png", name: "World's Hardest Game", eyebrow: "You can do this", category: "Chaos", tone: "red" },
  { file: "sandboxels.png", name: "Sandboxels", eyebrow: "Make your own rules", category: "Cozy", tone: "mint" },
  { file: "alien-hominid.png", name: "Alien Hominid", eyebrow: "Strange little guy", category: "Chaos", tone: "lime" },
  { file: "subway-surfers-sf.jpg", name: "Subway Surfers San Francisco", eyebrow: "City sprint", category: "Quick hit", tone: "sunset" },
  { file: "gladihoppers.jpg", name: "Gladihoppers", eyebrow: "Tiny gladiators", category: "Chaos", tone: "sand" },
  { file: "fruit-ninja.png", name: "Fruit Ninja", eyebrow: "Slice session", category: "Quick hit", tone: "fruit" },
  { file: "binding-of-isaac.png", name: "Binding of Isaac", eyebrow: "Down the rabbit hole", category: "Story", tone: "plum" },
  { file: "crossy-road.png", name: "Crossy Road", eyebrow: "Just cross it", category: "Quick hit", tone: "road" },
  { file: "cookie-clicker.png", name: "Cookie Clicker", eyebrow: "A quiet obsession", category: "Cozy", tone: "cookie" },
  { file: "duck-life.png", name: "Duck Life", eyebrow: "Raise a champion", category: "Cozy", tone: "duck" },
  { file: "geometry-dash-lite.jpg", name: "Geometry Dash Lite", eyebrow: "Pulse perfect", category: "Chaos", tone: "neon" },
  { file: "doom.png", name: "Doom", eyebrow: "Rip and tear", category: "Chaos", tone: "hell" },
  { file: "doki-doki-literature-club.jpg", name: "Doki Doki Literature Club", eyebrow: "Read between lines", category: "Story", tone: "blush" },
  { file: "baldis-basics-classic-remastered.png", name: "Baldi's Basics Classic Remastered", eyebrow: "Pop quiz", category: "Chaos", tone: "chalk" },
  { file: "stickmin-breaking-bank.jpg", name: "Breaking the Bank", eyebrow: "The first bad idea", category: "Story", tone: "stick" },
  { file: "stickmin-escaping-prison.avif", name: "Escaping the Prison", eyebrow: "Choose wisely", category: "Story", tone: "stick" },
  { file: "stickmin-stealing-diamond.avif", name: "Stealing the Diamond", eyebrow: "A very shiny problem", category: "Story", tone: "stick" },
  { file: "greatest-game-square.svg", name: "The Greatest Game of All Time", eyebrow: "A bold claim", category: "Story", tone: "great" },
  { file: "nubbys-number-factory.jpg", name: "Nubby's Number Factory", eyebrow: "Numbers, somehow", category: "Cozy", tone: "factory" },
];

const categories = ["All", "Quick hit", "Cozy", "Story", "Chaos"] as const;
const navItems = ["Games", "Apps", "Media Player", "Connect"];

function GameImage({ game, className = "" }: { game: Game; className?: string }) {
  return (
    <img
      className={`studio-game-image ${className}`}
      src={`${imageRoot}${game.file}`}
      alt={game.name}
      loading="lazy"
    />
  );
}

export function PlayStudio() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof categories)[number]>("All");
  const [menuOpen, setMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(["Run 3"]);
  const [playing, setPlaying] = useState<Game>(games[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [toast, setToast] = useState("Pick a game. Stay as long as you like.");
  const [activeNav, setActiveNav] = useState("Games");
  const [showFilters, setShowFilters] = useState(false);

  const filteredGames = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return games.filter((game) => {
      const matchesQuery =
        !normalized ||
        game.name.toLowerCase().includes(normalized) ||
        game.eyebrow.toLowerCase().includes(normalized);
      const matchesCategory = category === "All" || game.category === category;
      return matchesQuery && matchesCategory;
    });
  }, [category, query]);

  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast("Pick a game. Stay as long as you like."), 2800);
  };

  const launch = (game: Game) => {
    setPlaying(game);
    setIsPlaying(true);
    notify(`${game.name} is ready when you are.`);
  };

  const toggleFavorite = (name: string) => {
    setFavorites((current) =>
      current.includes(name) ? current.filter((item) => item !== name) : [...current, name],
    );
  };

  return (
    <main className="play-studio">
      <style>{`
        .play-studio {
          --ink: #171a2b;
          --ink-soft: #31354a;
          --cream: #f4f0e8;
          --paper: #fbf9f4;
          --line: rgba(23,26,43,.14);
          --coral: #ef6f61;
          --yellow: #f5c957;
          --blue: #82bdf1;
          --mint: #b8dbc9;
          min-height: 100vh;
          padding: 0 0 96px;
          overflow: hidden;
          color: var(--ink);
          background: var(--cream);
          font-family: "Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif;
        }
        .play-studio *, .play-studio *::before, .play-studio *::after { box-sizing: border-box; }
        .studio-shell { width: min(1180px, calc(100% - 40px)); margin: 0 auto; }
        .studio-nav {
          position: sticky; top: 0; z-index: 20; display: flex; align-items: center; gap: 20px;
          min-height: 74px; padding: 14px 0; background: rgba(244,240,232,.93);
          border-bottom: 1px solid var(--line); backdrop-filter: blur(18px);
        }
        .studio-mark { display: inline-flex; align-items: center; gap: 10px; color: var(--ink); text-decoration: none; }
        .studio-mark img { width: 38px; height: 38px; padding: 3px; object-fit: contain; border-radius: 11px; background: var(--ink); }
        .studio-wordmark { font-family: Syne, "Plus Jakarta Sans", sans-serif; font-size: 17px; font-weight: 800; letter-spacing: .095em; }
        .studio-wordmark span { color: var(--coral); }
        .studio-nav-links { display: flex; align-items: center; gap: 4px; margin-left: auto; }
        .studio-nav button, .studio-settings { border: 0; cursor: pointer; font: 700 12px inherit; color: var(--ink-soft); background: transparent; }
        .studio-nav-link { padding: 9px 12px; border-radius: 9px; transition: transform .2s ease, background .2s ease, color .2s ease; }
        .studio-nav-link:hover, .studio-nav-link:focus-visible { color: var(--ink); background: rgba(130,189,241,.25); transform: translateY(-1px); outline: none; }
        .studio-nav-link.active { color: var(--ink); background: var(--yellow); }
        .studio-settings { display: inline-flex; align-items: center; gap: 7px; margin-left: 10px; padding: 9px 12px; border: 1px solid var(--line); border-radius: 10px; }
        .studio-settings:hover, .studio-settings:focus-visible { background: var(--paper); outline: 2px solid rgba(239,111,97,.25); }
        .studio-menu { display: none; margin-left: auto; padding: 9px 10px; border: 1px solid var(--line)!important; border-radius: 10px; }
        .studio-settings-popover { position: absolute; right: max(20px, calc((100% - 1180px)/2)); top: 64px; width: 220px; padding: 15px; border: 1px solid var(--line); border-radius: 15px; background: var(--paper); box-shadow: 0 16px 40px rgba(23,26,43,.14); animation: studio-rise .22s ease both; }
        .studio-settings-popover p { margin: 0 0 10px; font-size: 11px; line-height: 1.5; color: #737487; }
        .studio-settings-popover strong { display: block; margin-bottom: 4px; font-size: 13px; }
        .studio-popover-action { width: 100%; padding: 9px; border: 1px solid var(--line); border-radius: 9px; color: var(--ink); background: var(--cream); font: 700 11px inherit; cursor: pointer; }
        .studio-hero { display: grid; grid-template-columns: minmax(0, .9fr) minmax(0, 1.1fr); gap: clamp(24px, 5vw, 72px); align-items: center; padding: 62px 0 54px; }
        .studio-kicker { display: inline-flex; align-items: center; gap: 8px; margin-bottom: 18px; color: #777486; font-size: 11px; font-weight: 800; letter-spacing: .16em; text-transform: uppercase; }
        .studio-kicker::before { content: ""; display: block; width: 26px; height: 2px; background: var(--coral); }
        .studio-hero h1 { max-width: 470px; margin: 0; font-family: Syne, "Plus Jakarta Sans", sans-serif; font-size: clamp(42px, 6.5vw, 77px); line-height: .95; letter-spacing: -.065em; font-weight: 800; }
        .studio-hero h1 em { color: var(--coral); font-style: normal; }
        .studio-hero-copy { max-width: 400px; margin: 22px 0 27px; color: #656577; font-size: 14px; line-height: 1.7; }
        .studio-hero-actions { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
        .studio-primary, .studio-quiet { display: inline-flex; align-items: center; justify-content: center; gap: 8px; border-radius: 10px; padding: 12px 15px; cursor: pointer; font: 800 12px inherit; transition: transform .2s ease, box-shadow .2s ease, background .2s ease; }
        .studio-primary { border: 0; color: var(--paper); background: var(--ink); box-shadow: 0 8px 0 rgba(23,26,43,.12); }
        .studio-primary:hover, .studio-primary:focus-visible { transform: translateY(-2px); box-shadow: 0 10px 0 rgba(23,26,43,.1); outline: none; }
        .studio-quiet { border: 1px solid var(--line); color: var(--ink); background: transparent; }
        .studio-quiet:hover, .studio-quiet:focus-visible { background: var(--paper); outline: none; }
        .studio-note { display: flex; align-items: center; gap: 8px; margin-top: 27px; color: #85818b; font-size: 11px; }
        .studio-note b { color: var(--ink); font-weight: 800; }
        .studio-feature-stage { position: relative; min-height: 370px; }
        .studio-feature-card { position: absolute; overflow: hidden; border-radius: 17px; background: var(--ink); box-shadow: 0 22px 45px rgba(23,26,43,.16); }
        .studio-feature-card.main { inset: 0 10% 0 0; transform: rotate(-2.2deg); }
        .studio-feature-card.side { right: 0; bottom: 14px; width: 37%; padding: 8px; transform: rotate(4deg); background: var(--yellow); }
        .studio-feature-card img { display: block; width: 100%; height: 100%; object-fit: cover; }
        .studio-feature-card.main img { opacity: .87; }
        .studio-feature-card.main::after { content: ""; position: absolute; inset: 46% 0 0; background: linear-gradient(transparent, rgba(15,17,31,.94)); }
        .studio-feature-meta { position: absolute; z-index: 1; right: 22px; bottom: 20px; left: 22px; display: flex; align-items: end; justify-content: space-between; color: var(--paper); }
        .studio-feature-meta small { display: block; margin-bottom: 4px; color: #e8d9c8; font-size: 10px; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; }
        .studio-feature-meta h2 { margin: 0; font-family: Syne, sans-serif; font-size: clamp(22px, 3vw, 38px); letter-spacing: -.05em; }
        .studio-play-circle { display: grid; width: 45px; height: 45px; flex: 0 0 auto; place-items: center; border: 0; border-radius: 50%; color: var(--ink); background: var(--yellow); cursor: pointer; transition: transform .2s ease; }
        .studio-play-circle:hover, .studio-play-circle:focus-visible { transform: scale(1.08); outline: 3px solid rgba(245,201,87,.35); }
        .studio-feature-card.side img { height: 155px; border-radius: 11px; }
        .studio-feature-card.side span { display: block; padding: 9px 3px 3px; font-family: Syne, sans-serif; font-size: 13px; font-weight: 800; }
        .studio-scribble { position: absolute; right: 0; top: -25px; color: var(--coral); font-family: "Space Mono", monospace; font-size: 10px; transform: rotate(8deg); }
        .studio-scribble::after { content: "↘"; display: inline-block; margin-left: 5px; font-size: 16px; }
        .studio-section { padding: 15px 0 54px; }
        .studio-section-head { display: flex; align-items: end; justify-content: space-between; gap: 16px; margin-bottom: 17px; }
        .studio-section-label { margin: 0 0 4px; color: #87838c; font-size: 10px; font-weight: 800; letter-spacing: .16em; text-transform: uppercase; }
        .studio-section h2 { margin: 0; font-family: Syne, sans-serif; font-size: clamp(25px, 3.2vw, 38px); letter-spacing: -.055em; }
        .studio-section-head p { max-width: 270px; margin: 0; color: #807e89; font-size: 12px; line-height: 1.5; text-align: right; }
        .studio-collections { display: grid; grid-template-columns: 1.25fr .8fr .8fr; gap: 12px; }
        .studio-collection { min-height: 164px; display: flex; flex-direction: column; justify-content: space-between; padding: 19px; overflow: hidden; border-radius: 15px; border: 1px solid var(--line); background: var(--paper); transition: transform .2s ease, box-shadow .2s ease; }
        .studio-collection:hover { transform: translateY(-4px); box-shadow: 0 15px 30px rgba(23,26,43,.09); }
        .studio-collection.primary { color: var(--paper); border-color: var(--ink); background: var(--ink); }
        .studio-collection.mint { background: var(--mint); }
        .studio-collection.coral { background: var(--coral); }
        .studio-collection-top { display: flex; align-items: start; justify-content: space-between; gap: 10px; }
        .studio-collection-count { color: inherit; opacity: .62; font: 700 10px "Space Mono", monospace; }
        .studio-collection h3 { max-width: 220px; margin: 0; font-family: Syne, sans-serif; font-size: 22px; line-height: 1; letter-spacing: -.045em; }
        .studio-collection p { max-width: 240px; margin: 9px 0 0; color: inherit; opacity: .68; font-size: 11px; line-height: 1.45; }
        .studio-collection-foot { display: flex; align-items: center; justify-content: space-between; margin-top: 15px; font-size: 11px; font-weight: 800; }
        .studio-collection-foot svg { transition: transform .2s ease; }
        .studio-collection:hover .studio-collection-foot svg { transform: translate(3px, -3px); }
        .studio-library { padding-top: 18px; }
        .studio-library-bar { display: flex; align-items: center; justify-content: space-between; gap: 14px; margin-bottom: 24px; padding: 13px 0; border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }
        .studio-search { display: flex; align-items: center; gap: 10px; min-width: 230px; color: #96939b; }
        .studio-search input { width: 100%; border: 0; outline: 0; color: var(--ink); background: transparent; font: 700 13px inherit; }
        .studio-search input::placeholder { color: #99969d; }
        .studio-filter-toggle { display: inline-flex; align-items: center; gap: 7px; padding: 8px 10px; border: 1px solid var(--line); border-radius: 8px; color: var(--ink-soft); background: transparent; cursor: pointer; font: 800 11px inherit; }
        .studio-filter-toggle[aria-pressed="true"] { border-color: var(--ink); background: var(--ink); color: var(--paper); }
        .studio-chips { display: flex; align-items: center; gap: 6px; overflow-x: auto; scrollbar-width: none; }
        .studio-chips::-webkit-scrollbar { display: none; }
        .studio-chip { flex: 0 0 auto; padding: 7px 10px; border: 1px solid transparent; border-radius: 999px; color: #777582; background: transparent; cursor: pointer; font: 800 10px inherit; }
        .studio-chip:hover { color: var(--ink); background: rgba(255,255,255,.5); }
        .studio-chip.active { color: var(--ink); border-color: var(--ink); background: var(--yellow); }
        .studio-results { margin: 0 0 14px; color: #99949a; font: 700 10px "Space Mono", monospace; text-transform: uppercase; }
        .studio-grid { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 12px; }
        .studio-game { position: relative; min-width: 0; border: 0; padding: 0; color: var(--ink); background: transparent; text-align: left; cursor: pointer; }
        .studio-game-image-wrap { position: relative; overflow: hidden; aspect-ratio: 1; border-radius: 13px; background: #ddd; }
        .studio-game-image { display: block; width: 100%; height: 100%; object-fit: cover; transition: transform .3s ease, filter .3s ease; }
        .studio-game:hover .studio-game-image, .studio-game:focus-visible .studio-game-image { transform: scale(1.06); filter: saturate(1.08); }
        .studio-game:focus-visible { outline: 3px solid var(--coral); outline-offset: 4px; border-radius: 14px; }
        .studio-game-overlay { position: absolute; inset: 0; display: flex; align-items: end; justify-content: space-between; padding: 9px; opacity: 0; background: linear-gradient(transparent 25%, rgba(23,26,43,.83)); transition: opacity .2s ease; }
        .studio-game:hover .studio-game-overlay, .studio-game:focus-visible .studio-game-overlay { opacity: 1; }
        .studio-game-play { display: grid; width: 26px; height: 26px; place-items: center; border-radius: 50%; color: var(--ink); background: var(--yellow); }
        .studio-heart { display: grid; width: 26px; height: 26px; place-items: center; border: 0; border-radius: 50%; color: var(--paper); background: rgba(23,26,43,.65); cursor: pointer; }
        .studio-heart.saved { color: var(--coral); background: var(--paper); }
        .studio-game-name { margin: 9px 1px 0; overflow: hidden; font-size: 11px; font-weight: 800; line-height: 1.25; text-overflow: ellipsis; white-space: nowrap; }
        .studio-game-type { margin: 4px 1px 0; color: #9a969c; font-size: 9px; font-weight: 700; }
        .studio-empty { grid-column: 1 / -1; padding: 54px 20px; border: 1px dashed var(--line); border-radius: 14px; color: #777582; text-align: center; }
        .studio-empty strong { display: block; margin-bottom: 7px; color: var(--ink); font-family: Syne, sans-serif; font-size: 20px; }
        .studio-footer-note { display: flex; align-items: center; justify-content: space-between; gap: 20px; padding: 25px 0 0; border-top: 1px solid var(--line); color: #88848e; font-size: 11px; }
        .studio-footer-note b { color: var(--ink); }
        .studio-dock { position: fixed; z-index: 30; right: 16px; bottom: 16px; left: 16px; display: flex; align-items: center; gap: 18px; max-width: 940px; min-height: 68px; margin: 0 auto; padding: 10px 14px; color: var(--paper); border: 1px solid rgba(255,255,255,.13); border-radius: 16px; background: rgba(23,26,43,.96); box-shadow: 0 18px 50px rgba(23,26,43,.24); backdrop-filter: blur(18px); }
        .studio-dock-track { display: flex; align-items: center; gap: 10px; min-width: 180px; }
        .studio-dock-track img { width: 44px; height: 44px; border-radius: 9px; object-fit: cover; }
        .studio-dock-meta { min-width: 0; }
        .studio-dock-meta strong, .studio-dock-meta span { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .studio-dock-meta strong { font-size: 11px; }
        .studio-dock-meta span { margin-top: 4px; color: #9c9ba9; font-size: 9px; }
        .studio-dock-controls { display: flex; align-items: center; gap: 5px; }
        .studio-dock button { display: grid; place-items: center; width: 30px; height: 30px; border: 0; border-radius: 50%; color: #bbb9c4; background: transparent; cursor: pointer; }
        .studio-dock button:hover, .studio-dock button:focus-visible { color: var(--paper); background: rgba(255,255,255,.12); outline: none; }
        .studio-dock .studio-dock-play { width: 36px; height: 36px; color: var(--ink); background: var(--yellow); }
        .studio-dock-progress { display: flex; align-items: center; gap: 10px; flex: 1; color: #9c9ba9; font: 9px "Space Mono", monospace; }
        .studio-dock-progress input { width: 100%; accent-color: var(--yellow); }
        .studio-dock-volume { display: flex; align-items: center; gap: 7px; width: 105px; }
        .studio-dock-volume input { width: 70px; accent-color: var(--coral); }
        .studio-toast { position: fixed; z-index: 40; right: 24px; top: 90px; padding: 10px 13px; border: 1px solid var(--line); border-radius: 10px; color: var(--ink); background: var(--paper); box-shadow: 0 10px 25px rgba(23,26,43,.11); font-size: 11px; font-weight: 800; animation: studio-rise .24s ease both; }
        @keyframes studio-rise { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
        @media (max-width: 800px) {
          .studio-shell { width: min(100% - 28px, 650px); }
          .studio-nav { min-height: 64px; }
          .studio-nav-links { position: absolute; top: 60px; right: 0; display: none; flex-direction: column; align-items: stretch; width: 190px; padding: 7px; border: 1px solid var(--line); border-radius: 13px; background: var(--paper); box-shadow: 0 15px 30px rgba(23,26,43,.12); }
          .studio-nav-links.open { display: flex; animation: studio-rise .2s ease both; }
          .studio-nav-link { text-align: left; }
          .studio-settings { display: none; }
          .studio-menu { display: inline-flex; align-items: center; gap: 6px; }
          .studio-hero { grid-template-columns: 1fr; padding: 42px 0 38px; }
          .studio-hero h1 { max-width: 600px; font-size: clamp(42px, 12vw, 68px); }
          .studio-feature-stage { min-height: min(74vw, 370px); }
          .studio-collections { grid-template-columns: 1fr 1fr; }
          .studio-collection.primary { grid-column: 1 / -1; }
          .studio-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 10px; }
        }
        @media (max-width: 520px) {
          .studio-section-head { align-items: start; flex-direction: column; }
          .studio-section-head p { text-align: left; }
          .studio-library-bar { align-items: stretch; flex-direction: column; }
          .studio-search { min-width: 0; padding-bottom: 9px; border-bottom: 1px solid var(--line); }
          .studio-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 13px 10px; }
          .studio-feature-card.side { width: 39%; }
          .studio-feature-card.side img { height: 28vw; }
          .studio-footer-note { align-items: start; flex-direction: column; gap: 8px; }
          .studio-dock { right: 8px; bottom: 8px; left: 8px; gap: 8px; padding: 8px; }
          .studio-dock-track { min-width: 0; flex: 1; }
          .studio-dock-progress { position: absolute; right: 12px; bottom: 3px; left: 12px; gap: 0; }
          .studio-dock-progress span { display: none; }
          .studio-dock-volume { display: none; }
        }
      `}</style>

      <nav className="studio-nav" aria-label="Aerodynamix navigation">
        <div className="studio-shell" style={{ display: "flex", alignItems: "center", width: "min(1180px, calc(100% - 40px))" }}>
          <button className="studio-mark" type="button" onClick={() => { setActiveNav("Games"); window.scrollTo({ top: 0, behavior: "smooth" }); }} aria-label="Aerodynamix home">
            <img src={`${imageRoot}logo.gif`} alt="" />
            <span className="studio-wordmark"><span>A</span>ERODYNAMIX</span>
          </button>
          <div className={`studio-nav-links ${menuOpen ? "open" : ""}`}>
            {navItems.map((item) => (
              <button
                className={`studio-nav-link ${activeNav === item ? "active" : ""}`}
                type="button"
                key={item}
                onClick={() => { setActiveNav(item); setMenuOpen(false); notify(`${item} is part of the studio map.`); }}
              >
                {item}
              </button>
            ))}
          </div>
          <button className="studio-settings" type="button" onClick={() => setSettingsOpen((open) => !open)} aria-expanded={settingsOpen}>
            <Settings2 size={14} /> Settings <ChevronDown size={13} />
          </button>
          <button className="studio-menu" type="button" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-label="Toggle navigation menu">
            {menuOpen ? <X size={16} /> : <Menu size={16} />} <span>{menuOpen ? "Close" : "Menu"}</span>
          </button>
        </div>
        {settingsOpen && (
          <div className="studio-settings-popover" role="dialog" aria-label="Settings preview">
            <strong>Studio settings</strong>
            <p>Private by default. Your saved games stay in this browser prototype.</p>
            <button className="studio-popover-action" type="button" onClick={() => { setSettingsOpen(false); notify("Your local preferences are already saved."); }}>Done</button>
          </div>
        )}
      </nav>

      <div className="studio-shell">
        <section className="studio-hero" aria-labelledby="studio-title">
          <div>
            <div className="studio-kicker"><Sparkles size={13} /> The play studio / issue 01</div>
            <h1 id="studio-title">Find your next <em>little obsession.</em></h1>
            <p className="studio-hero-copy">A fast, friendly corner of the internet for games that deserve a second life. No account. No feed to keep up with. Just pick something good.</p>
            <div className="studio-hero-actions">
              <button className="studio-primary" type="button" onClick={() => { document.getElementById("library")?.scrollIntoView({ behavior: "smooth" }); notify("The full shelf is just below."); }}>
                Browse the shelf <ArrowUpRight size={15} />
              </button>
              <button className="studio-quiet" type="button" onClick={() => launch(games[1])}>
                <Play size={14} fill="currentColor" /> Surprise me
              </button>
            </div>
            <div className="studio-note"><Headphones size={13} /> <b>47 games</b> · hand-picked for a five-minute break</div>
          </div>
          <div className="studio-feature-stage" aria-label="Featured games">
            <span className="studio-scribble">curated for today</span>
            <button className="studio-feature-card main" type="button" onClick={() => launch(games[0])} aria-label="Play Run 3">
              <GameImage game={games[0]} />
              <div className="studio-feature-meta">
                <div><small>Featured / zero gravity</small><h2>Run 3</h2></div>
                <span className="studio-play-circle"><Play size={18} fill="currentColor" /></span>
              </div>
            </button>
            <button className="studio-feature-card side" type="button" onClick={() => launch(games[1])} aria-label="Play Drive Mad">
              <GameImage game={games[1]} />
              <span>Drive Mad <ArrowUpRight size={13} /></span>
            </button>
          </div>
        </section>

        <section className="studio-section" aria-labelledby="collections-title">
          <div className="studio-section-head">
            <div><p className="studio-section-label">Choose a mood</p><h2 id="collections-title">Open a collection.</h2></div>
            <p>Different days call for different games. These shelves know the feeling.</p>
          </div>
          <div className="studio-collections">
            <button className="studio-collection primary" type="button" onClick={() => { setCategory("Quick hit"); document.getElementById("library")?.scrollIntoView({ behavior: "smooth" }); }}>
              <div className="studio-collection-top"><div><h3>Five minutes,<br />make it count.</h3><p>Fast starts, satisfying loops, no tutorial required.</p></div><span className="studio-collection-count">12 TITLES</span></div>
              <div className="studio-collection-foot">Quick hits <ArrowUpRight size={15} /></div>
            </button>
            <button className="studio-collection mint" type="button" onClick={() => { setCategory("Cozy"); document.getElementById("library")?.scrollIntoView({ behavior: "smooth" }); }}>
              <div className="studio-collection-top"><div><h3>Low stakes,<br />high comfort.</h3><p>For a softer kind of afternoon.</p></div><span className="studio-collection-count">09</span></div>
              <div className="studio-collection-foot">Cozy games <ArrowUpRight size={15} /></div>
            </button>
            <button className="studio-collection coral" type="button" onClick={() => { setCategory("Story"); document.getElementById("library")?.scrollIntoView({ behavior: "smooth" }); }}>
              <div className="studio-collection-top"><div><h3>Stay for<br />the plot.</h3><p>Short stories, strange worlds.</p></div><span className="studio-collection-count">11</span></div>
              <div className="studio-collection-foot">Story mode <ArrowUpRight size={15} /></div>
            </button>
          </div>
        </section>

        <section className="studio-section studio-library" id="library" aria-labelledby="library-title">
          <div className="studio-section-head">
            <div><p className="studio-section-label">The full library</p><h2 id="library-title">Take your pick.</h2></div>
            <p>Search by title or vibe. Every tile opens in one click.</p>
          </div>
          <div className="studio-library-bar">
            <label className="studio-search">
              <Search size={17} aria-hidden="true" />
              <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search the shelf" aria-label="Search games" />
            </label>
            <button className="studio-filter-toggle" type="button" aria-pressed={showFilters} onClick={() => setShowFilters((shown) => !shown)}>
              <SlidersHorizontal size={14} /> Filters <ChevronDown size={13} />
            </button>
            <div className="studio-chips" aria-label="Game collections">
              {categories.map((item) => (
                <button className={`studio-chip ${category === item ? "active" : ""}`} key={item} type="button" onClick={() => setCategory(item)}>{item}</button>
              ))}
            </div>
          </div>
          {showFilters && <div className="studio-results">Showing {filteredGames.length} of {games.length} games · {favorites.length} saved</div>}
          <div className="studio-grid">
            {filteredGames.map((game) => {
              const saved = favorites.includes(game.name);
              return (
                <button className="studio-game" type="button" key={game.name} onClick={() => launch(game)} aria-label={`Play ${game.name}`}>
                  <div className="studio-game-image-wrap">
                    <GameImage game={game} />
                    <div className="studio-game-overlay">
                      <span className="studio-game-play"><Play size={12} fill="currentColor" /></span>
                      <span className={`studio-heart ${saved ? "saved" : ""}`} role="button" aria-label={saved ? `Remove ${game.name} from saved games` : `Save ${game.name}`} onClick={(event) => { event.stopPropagation(); toggleFavorite(game.name); }}>
                        <Heart size={13} fill={saved ? "currentColor" : "none"} />
                      </span>
                    </div>
                  </div>
                  <div className="studio-game-name">{game.name}</div>
                  <div className="studio-game-type">{game.eyebrow}</div>
                </button>
              );
            })}
            {filteredGames.length === 0 && <div className="studio-empty"><strong>No games on this shelf.</strong>Try a different title or switch the collection.</div>}
          </div>
        </section>

        <div className="studio-footer-note">
          <span><b>Aerodynamix</b> · an internet arcade with the door left open.</span>
          <span>Settings · Apps · Media Player · Connect</span>
        </div>
      </div>

      <aside className="studio-dock" aria-label="Media player">
        <div className="studio-dock-track">
          <img src={`${imageRoot}${playing.file}`} alt="" />
          <div className="studio-dock-meta"><strong>{playing.name}</strong><span>{isPlaying ? "Playing now" : "Media Player · ready"}</span></div>
        </div>
        <div className="studio-dock-controls">
          <button type="button" aria-label="Previous track" onClick={() => setPlaying(games[Math.max(0, games.findIndex((game) => game.name === playing.name) - 1)])}><ChevronLeft size={16} /></button>
          <button className="studio-dock-play" type="button" aria-label={isPlaying ? "Pause" : "Play"} onClick={() => setIsPlaying((current) => !current)}>{isPlaying ? <PanelTop size={14} /> : <Play size={14} fill="currentColor" />}</button>
          <button type="button" aria-label="Next track" onClick={() => setPlaying(games[Math.min(games.length - 1, games.findIndex((game) => game.name === playing.name) + 1)])}><ChevronRight size={16} /></button>
        </div>
        <div className="studio-dock-progress"><span>0:00</span><input type="range" min="0" max="100" defaultValue="28" aria-label="Track progress" /><span>3:42</span></div>
        <div className="studio-dock-volume"><Volume2 size={14} /><input type="range" min="0" max="100" defaultValue="72" aria-label="Volume" /></div>
        <button type="button" aria-label="Show media player details" onClick={() => notify("Media Player is keeping your place warm.")}><ArrowUpRight size={15} /></button>
      </aside>
      {toast && <div className="studio-toast" role="status">{toast}</div>}
    </main>
  );
}