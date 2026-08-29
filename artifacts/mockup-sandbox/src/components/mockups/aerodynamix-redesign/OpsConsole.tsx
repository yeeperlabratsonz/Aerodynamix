import { useMemo, useState } from "react";
import {
  Activity,
  Bookmark,
  Check,
  Command,
  Filter,
  Heart,
  LayoutGrid,
  ListFilter,
  Menu,
  Pause,
  Play,
  Search,
  Settings2,
  SkipBack,
  SkipForward,
  Star,
  Volume2,
  X,
  Zap,
} from "lucide-react";

const imageRoot = "/__mockup/images/aerodynamix/";

type Game = {
  file: string;
  name: string;
  genre: string;
  meta: string;
  status: "READY" | "RECENT" | "SAVED";
  tone: string;
};

const games: Game[] = [
  { file: "run-3.jpg", name: "Run 3", genre: "Runner", meta: "3.4 MB · 2014", status: "RECENT", tone: "cyan" },
  { file: "drive-mad.jpg", name: "Drive Mad", genre: "Driving", meta: "8.1 MB · 2021", status: "SAVED", tone: "orange" },
  { file: "retro-bowl.jpg", name: "Retro Bowl", genre: "Sports", meta: "12.7 MB · 2020", status: "READY", tone: "red" },
  { file: "slope.jpg", name: "Slope", genre: "Arcade", meta: "5.9 MB · 2019", status: "READY", tone: "violet" },
  { file: "mc.png", name: "Minecraft", genre: "Sandbox", meta: "42.0 MB · 2011", status: "SAVED", tone: "green" },
  { file: "supersmashflash.jpg", name: "Super Smash Flash", genre: "Fighter", meta: "24.6 MB · 2006", status: "READY", tone: "blue" },
  { file: "papaspizzeria.png", name: "Papa's Pizzeria", genre: "Simulation", meta: "15.3 MB · 2007", status: "READY", tone: "yellow" },
  { file: "papasfreezeria.png", name: "Papa's Freezeria", genre: "Simulation", meta: "16.2 MB · 2011", status: "READY", tone: "blue" },
  { file: "papas-pancakeria.png", name: "Papa's Pancakeria", genre: "Simulation", meta: "15.5 MB · 2012", status: "READY", tone: "orange" },
  { file: "papas-bakeria.png", name: "Papa's Bakeria", genre: "Simulation", meta: "18.5 MB · 2016", status: "READY", tone: "red" },
  { file: "meat-boy.png", name: "Meat Boy", genre: "Platformer", meta: "10.4 MB · 2010", status: "READY", tone: "red" },
  { file: "newgrounds-rumble.png", name: "Newgrounds Rumble", genre: "Fighter", meta: "29.8 MB · 2007", status: "READY", tone: "orange" },
  { file: "we-become-what-we-behold.png", name: "We Become What We Behold", genre: "Interactive", meta: "7.2 MB · 2016", status: "READY", tone: "violet" },
  { file: "bad-time-simulator.png", name: "Bad Time Simulator", genre: "Action", meta: "6.8 MB · 2015", status: "READY", tone: "red" },
  { file: "deltarune.png", name: "Deltarune", genre: "RPG", meta: "31.4 MB · 2018", status: "READY", tone: "blue" },
  { file: "adventure-capitalist.png", name: "Adventure Capitalist", genre: "Idle", meta: "9.4 MB · 2014", status: "READY", tone: "green" },
  { file: "fridaynightfunkin.png", name: "Friday Night Funkin'", genre: "Rhythm", meta: "21.2 MB · 2020", status: "SAVED", tone: "pink" },
  { file: "run-2.png", name: "Run 2", genre: "Runner", meta: "4.4 MB · 2010", status: "READY", tone: "cyan" },
  { file: "picoschool.png", name: "Pico's School", genre: "Adventure", meta: "14.1 MB · 1999", status: "READY", tone: "orange" },
  { file: "worldshardestgame.png", name: "World's Hardest Game", genre: "Puzzle", meta: "3.1 MB · 2007", status: "READY", tone: "red" },
  { file: "sandboxels.png", name: "Sandboxels", genre: "Sandbox", meta: "11.9 MB · 2022", status: "READY", tone: "green" },
  { file: "alien-hominid.png", name: "Alien Hominid", genre: "Action", meta: "18.4 MB · 2004", status: "READY", tone: "yellow" },
  { file: "subway-surfers-sf.jpg", name: "Subway Surfers San Francisco", genre: "Runner", meta: "34.2 MB · 2012", status: "READY", tone: "blue" },
  { file: "hobo-1.png", name: "Hobo 1", genre: "Action", meta: "13.8 MB · 2008", status: "READY", tone: "violet" },
  { file: "hobo-2.png", name: "Hobo 2", genre: "Action", meta: "14.2 MB · 2008", status: "READY", tone: "violet" },
  { file: "gladihoppers.jpg", name: "Gladihoppers", genre: "Action", meta: "16.1 MB · 2017", status: "READY", tone: "orange" },
  { file: "fruit-ninja.png", name: "Fruit Ninja", genre: "Arcade", meta: "12.4 MB · 2010", status: "READY", tone: "green" },
  { file: "binding-of-isaac.png", name: "Binding of Isaac", genre: "Roguelike", meta: "27.3 MB · 2011", status: "READY", tone: "red" },
  { file: "crossy-road.png", name: "Crossy Road", genre: "Arcade", meta: "19.5 MB · 2014", status: "READY", tone: "yellow" },
  { file: "cookie-clicker.png", name: "Cookie Clicker", genre: "Idle", meta: "2.3 MB · 2013", status: "READY", tone: "orange" },
  { file: "duck-life.png", name: "Duck Life", genre: "Adventure", meta: "8.6 MB · 2007", status: "READY", tone: "blue" },
  { file: "geometry-dash-lite.jpg", name: "Geometry Dash Lite", genre: "Rhythm", meta: "9.7 MB · 2013", status: "READY", tone: "cyan" },
  { file: "doom.png", name: "Doom", genre: "Shooter", meta: "22.6 MB · 1993", status: "READY", tone: "red" },
  { file: "doki-doki-literature-club.jpg", name: "Doki Doki Literature Club", genre: "Visual novel", meta: "18.8 MB · 2017", status: "READY", tone: "pink" },
  { file: "baldis-basics-classic-remastered.png", name: "Baldi's Basics Classic Remastered", genre: "Horror", meta: "26.7 MB · 2018", status: "READY", tone: "green" },
  { file: "stickmin-breaking-bank.jpg", name: "Breaking the Bank", genre: "Adventure", meta: "6.2 MB · 2008", status: "READY", tone: "yellow" },
  { file: "stickmin-escaping-prison.avif", name: "Escaping the Prison", genre: "Adventure", meta: "7.4 MB · 2009", status: "READY", tone: "blue" },
  { file: "stickmin-stealing-diamond.avif", name: "Stealing the Diamond", genre: "Adventure", meta: "8.2 MB · 2010", status: "READY", tone: "violet" },
  { file: "greatest-game-square.svg", name: "The Greatest Game of All Time", genre: "Special", meta: "4.8 MB · featured", status: "READY", tone: "cyan" },
  { file: "nubbys-number-factory.jpg", name: "Nubby's Number Factory", genre: "Puzzle", meta: "10.3 MB · 2023", status: "READY", tone: "orange" },
];

const featured = games.slice(0, 4);
const navItems = ["Games", "Apps", "Media Player", "Connect"];
const filters = ["ALL", "RECENT", "SAVED"];

function ToneMark({ tone }: { tone: string }) {
  return <span className={`ops-tone ops-tone-${tone}`} aria-hidden="true" />;
}

export function OpsConsole() {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [selected, setSelected] = useState<Game>(games[0]);
  const [favorites, setFavorites] = useState<string[]>(["Drive Mad", "Minecraft", "Friday Night Funkin'"]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [queue, setQueue] = useState<Game[]>([games[1], games[2], games[3]]);
  const [playing, setPlaying] = useState(false);
  const [playerOpen, setPlayerOpen] = useState(true);
  const [volume, setVolume] = useState(72);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [toast, setToast] = useState("");

  const shownGames = useMemo(() => games.filter((game) => {
    const matchesQuery = game.name.toLowerCase().includes(query.toLowerCase()) || game.genre.toLowerCase().includes(query.toLowerCase());
    const matchesFilter = activeFilter === "ALL" || (activeFilter === "SAVED" ? favorites.includes(game.name) : game.status === activeFilter);
    return matchesQuery && matchesFilter;
  }), [activeFilter, favorites, query]);

  const announce = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 1800);
  };

  const chooseGame = (game: Game) => {
    setSelected(game);
    announce(`${game.name} selected`);
  };

  const toggleFavorite = (game: Game) => {
    setFavorites((current) => current.includes(game.name) ? current.filter((name) => name !== game.name) : [...current, game.name]);
    announce(favorites.includes(game.name) ? "Removed from saved" : "Saved for later");
  };

  const launchGame = (game: Game) => {
    setSelected(game);
    setQueue((current) => [game, ...current.filter((item) => item.name !== game.name)].slice(0, 4));
    announce(`${game.name} is ready to launch`);
  };

  const removeFromQueue = (name: string) => {
    setQueue((current) => current.filter((game) => game.name !== name));
    announce("Removed from launch queue");
  };

  return (
    <main className="ops-console">
      <style>{`
        .ops-console {
          --ops-ink: #17243a;
          --ops-subtle: #637187;
          --ops-muted: #92a0b3;
          --ops-line: #d9e1eb;
          --ops-panel: #f8fafc;
          --ops-blue: #2266e2;
          --ops-blue-dark: #194db0;
          --ops-cyan: #1db3bf;
          min-height: 100dvh;
          color: var(--ops-ink);
          background: #edf2f7;
          font-family: "DM Sans", "Trebuchet MS", sans-serif;
          overflow-x: hidden;
          padding-bottom: ${playerOpen ? "74px" : "20px"};
        }
        .ops-console *, .ops-console *::before, .ops-console *::after { box-sizing: border-box; }
        .ops-console button, .ops-console input { font: inherit; }
        .ops-console button { cursor: pointer; }
        .ops-topbar {
          position: sticky; top: 0; z-index: 20; display: flex; align-items: center; gap: 16px;
          min-height: 64px; padding: 10px 20px; color: #edf5ff; background: #17283e;
          border-bottom: 1px solid rgba(200, 222, 247, .15); box-shadow: 0 5px 20px rgba(22, 39, 63, .14);
        }
        .ops-brand { display: flex; align-items: center; gap: 10px; min-width: max-content; }
        .ops-brand-mark { width: 34px; height: 34px; padding: 3px; border: 1px solid rgba(255,255,255,.25); border-radius: 9px; background: #071323; object-fit: contain; }
        .ops-brand-copy { line-height: 1; }
        .ops-brand-title { margin: 0; font: 800 15px/1 "Space Mono", monospace; letter-spacing: .09em; }
        .ops-brand-kicker { margin-top: 5px; color: #8fa9c7; font: 600 8px/1 "Space Mono", monospace; letter-spacing: .16em; text-transform: uppercase; }
        .ops-primary-nav { display: flex; align-items: center; gap: 3px; margin-left: auto; }
        .ops-nav-button, .ops-menu-button { border: 0; border-radius: 7px; color: #afc0d4; background: transparent; transition: color .2s, background .2s, transform .2s; }
        .ops-nav-button { padding: 9px 11px; font-size: 12px; font-weight: 700; }
        .ops-nav-button:hover, .ops-nav-button.is-active { color: #fff; background: rgba(86, 160, 255, .2); }
        .ops-nav-button.is-active { box-shadow: inset 0 -2px 0 #4f9cff; }
        .ops-top-actions { display: flex; align-items: center; gap: 8px; }
        .ops-system-pill { display: flex; align-items: center; gap: 7px; padding: 7px 10px; color: #a9c4dc; border: 1px solid rgba(155, 191, 222, .2); border-radius: 7px; font: 700 9px "Space Mono", monospace; letter-spacing: .08em; }
        .ops-system-dot { width: 7px; height: 7px; border-radius: 50%; background: #58cf9c; box-shadow: 0 0 0 3px rgba(88, 207, 156, .14); }
        .ops-menu-button { display: none; padding: 7px; }
        .ops-layout { display: grid; grid-template-columns: 180px minmax(0, 1fr); max-width: 1360px; margin: 0 auto; }
        .ops-rail { min-height: calc(100dvh - 64px); padding: 23px 14px; background: #e5ebf2; border-right: 1px solid var(--ops-line); }
        .ops-rail-label, .ops-eyebrow, .ops-table-label { color: #77879b; font: 700 9px "Space Mono", monospace; letter-spacing: .14em; text-transform: uppercase; }
        .ops-rail-label { padding: 0 9px 10px; }
        .ops-rail-link { display: flex; align-items: center; gap: 10px; width: 100%; margin: 2px 0; padding: 10px 9px; color: #607087; border: 0; border-radius: 8px; background: transparent; text-align: left; font-size: 12px; font-weight: 700; transition: color .2s, background .2s, transform .2s; }
        .ops-rail-link:hover, .ops-rail-link.is-active { color: var(--ops-blue-dark); background: #f6f9fd; }
        .ops-rail-link.is-active { box-shadow: inset 3px 0 var(--ops-blue); }
        .ops-rail-link svg { width: 15px; height: 15px; }
        .ops-rail-rule { height: 1px; margin: 19px 9px; background: var(--ops-line); }
        .ops-rail-note { margin: 0 8px; padding: 12px 10px; border: 1px solid #ccd7e4; border-radius: 9px; background: rgba(248,250,252,.7); }
        .ops-rail-note strong { display: block; color: var(--ops-ink); font: 700 11px "Space Mono", monospace; }
        .ops-rail-note p { margin: 7px 0 0; color: var(--ops-subtle); font-size: 10px; line-height: 1.45; }
        .ops-workspace { min-width: 0; padding: 26px 26px 32px; }
        .ops-workspace-head { display: flex; align-items: end; justify-content: space-between; gap: 18px; margin-bottom: 20px; }
        .ops-page-title { margin: 7px 0 0; color: #1a2a41; font: 800 clamp(25px, 3.1vw, 39px)/1 "Bricolage Grotesque", sans-serif; letter-spacing: -.045em; }
        .ops-page-subtitle { margin: 7px 0 0; color: var(--ops-subtle); font-size: 12px; }
        .ops-clock { color: #697c93; font: 700 10px "Space Mono", monospace; text-align: right; letter-spacing: .04em; }
        .ops-clock b { display: block; margin-top: 5px; color: #253a56; font-size: 12px; }
        .ops-selection { display: grid; grid-template-columns: minmax(0, 1fr) 190px; gap: 16px; margin-bottom: 22px; }
        .ops-hero { position: relative; display: grid; grid-template-columns: minmax(150px, 34%) minmax(0, 1fr); min-height: 226px; overflow: hidden; border: 1px solid #1e3859; border-radius: 13px; background: #17283e; box-shadow: 0 12px 26px rgba(36, 57, 85, .13); }
        .ops-hero-art { min-height: 226px; background: #0b1729; overflow: hidden; }
        .ops-hero-art img { width: 100%; height: 100%; display: block; object-fit: cover; opacity: .9; transition: transform .45s; }
        .ops-hero:hover .ops-hero-art img { transform: scale(1.035); }
        .ops-hero-copy { display: flex; flex-direction: column; justify-content: space-between; min-width: 0; padding: 21px 22px 18px; color: #f4f8fc; }
        .ops-hero-meta { display: flex; align-items: center; justify-content: space-between; gap: 10px; color: #90afd0; font: 700 9px "Space Mono", monospace; letter-spacing: .1em; text-transform: uppercase; }
        .ops-ready { display: inline-flex; align-items: center; gap: 5px; color: #77dfb1; }
        .ops-ready i { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
        .ops-hero-name { margin: 11px 0 4px; font: 800 clamp(24px, 3.5vw, 41px)/.95 "Bricolage Grotesque", sans-serif; letter-spacing: -.055em; }
        .ops-hero-genre { color: #9eb5ce; font-size: 12px; }
        .ops-hero-foot { display: flex; align-items: end; justify-content: space-between; gap: 10px; }
        .ops-hero-stats { display: flex; gap: 13px; color: #8ea8c3; font: 9px "Space Mono", monospace; }
        .ops-hero-stats strong { display: block; margin-bottom: 4px; color: #eff6ff; font-size: 11px; }
        .ops-launch-button { display: inline-flex; align-items: center; gap: 8px; border: 0; border-radius: 7px; padding: 10px 14px; color: #13233a; background: #bde8ff; font-size: 11px; font-weight: 800; transition: transform .2s, background .2s; }
        .ops-launch-button:hover { transform: translateY(-2px); background: #e0f5ff; }
        .ops-launch-button svg { width: 14px; height: 14px; }
        .ops-inspector { border: 1px solid #d5dfe9; border-radius: 13px; background: #f9fbfd; box-shadow: 0 8px 22px rgba(44, 64, 88, .06); }
        .ops-inspector-head { display: flex; justify-content: space-between; align-items: center; padding: 13px 13px 10px; border-bottom: 1px solid #e2e8ef; }
        .ops-inspector-title { color: #63748b; font: 700 9px "Space Mono", monospace; letter-spacing: .13em; text-transform: uppercase; }
        .ops-inspector-head svg { color: #8594a6; width: 14px; }
        .ops-inspector-body { padding: 13px; }
        .ops-inspector-row { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 7px 0; color: #76869a; font: 10px "Space Mono", monospace; border-bottom: 1px solid #edf1f5; }
        .ops-inspector-row:last-child { border-bottom: 0; }
        .ops-inspector-row b { color: #203652; font-weight: 700; text-align: right; }
        .ops-check { color: #1f9a71; }
        .ops-queue-panel { padding: 14px; border: 1px solid #d5dfe9; border-radius: 13px; background: #f9fbfd; }
        .ops-queue-heading { display: flex; align-items: center; justify-content: space-between; margin-bottom: 11px; }
        .ops-queue-heading h2 { margin: 0; font: 800 13px "Bricolage Grotesque", sans-serif; letter-spacing: -.02em; }
        .ops-queue-heading span { color: #8291a3; font: 9px "Space Mono", monospace; }
        .ops-queue-list { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
        .ops-queue-item { display: flex; align-items: center; gap: 9px; min-width: 0; padding: 8px; border: 1px solid #e0e6ed; border-radius: 9px; background: #fff; transition: border-color .2s, transform .2s; }
        .ops-queue-item:hover { border-color: #a6c3e9; transform: translateY(-1px); }
        .ops-queue-item img { flex: 0 0 34px; width: 34px; height: 34px; object-fit: cover; border-radius: 6px; }
        .ops-queue-copy { min-width: 0; }
        .ops-queue-copy strong { display: block; overflow: hidden; color: #30435c; font-size: 10px; text-overflow: ellipsis; white-space: nowrap; }
        .ops-queue-copy span { display: block; margin-top: 3px; color: #91a0b1; font: 8px "Space Mono", monospace; }
        .ops-remove { display: inline-grid; place-items: center; flex: 0 0 19px; width: 19px; height: 19px; margin-left: auto; border: 0; border-radius: 5px; color: #9aa8b6; background: transparent; }
        .ops-remove:hover { color: #c4525e; background: #fff0f1; }
        .ops-library-head { display: flex; align-items: center; justify-content: space-between; gap: 13px; margin: 28px 0 12px; }
        .ops-library-title { display: flex; align-items: baseline; gap: 9px; }
        .ops-library-title h2 { margin: 0; font: 800 20px "Bricolage Grotesque", sans-serif; letter-spacing: -.04em; }
        .ops-library-title span { color: #8b99a9; font: 9px "Space Mono", monospace; }
        .ops-view-toggle { display: flex; gap: 3px; padding: 3px; border: 1px solid #d4dee9; border-radius: 7px; background: #e7edf4; }
        .ops-view-toggle button { display: grid; place-items: center; width: 27px; height: 25px; border: 0; border-radius: 5px; color: #7f8da0; background: transparent; }
        .ops-view-toggle button.is-active { color: var(--ops-blue-dark); background: #fff; box-shadow: 0 1px 3px rgba(47,65,88,.1); }
        .ops-controls { display: flex; align-items: center; gap: 8px; margin-bottom: 14px; }
        .ops-search { position: relative; flex: 1; min-width: 130px; }
        .ops-search svg { position: absolute; left: 11px; top: 50%; width: 15px; color: #8391a3; transform: translateY(-50%); pointer-events: none; }
        .ops-search input { width: 100%; padding: 10px 12px 10px 34px; outline: 0; border: 1px solid #d6e0ea; border-radius: 7px; color: var(--ops-ink); background: #f9fbfd; font-size: 11px; transition: border-color .2s, box-shadow .2s; }
        .ops-search input:focus { border-color: #6e9de2; box-shadow: 0 0 0 3px rgba(53,117,220,.12); }
        .ops-filter-row { display: flex; gap: 4px; }
        .ops-filter { padding: 8px 9px; border: 1px solid transparent; border-radius: 6px; color: #7b8a9d; background: transparent; font: 700 9px "Space Mono", monospace; }
        .ops-filter:hover, .ops-filter.is-active { color: var(--ops-blue-dark); border-color: #c5d8f1; background: #f6faff; }
        .ops-filter.is-active { box-shadow: inset 0 -2px var(--ops-blue); }
        .ops-game-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 10px; }
        .ops-game-card { position: relative; min-width: 0; overflow: hidden; border: 1px solid #d6e0ea; border-radius: 9px; background: #f9fbfd; transition: transform .2s, border-color .2s, box-shadow .2s; }
        .ops-game-card:hover, .ops-game-card.is-selected { transform: translateY(-2px); border-color: #8fb4e4; box-shadow: 0 7px 18px rgba(48, 83, 128, .12); }
        .ops-game-card.is-selected { box-shadow: 0 0 0 2px rgba(44, 111, 218, .18); }
        .ops-card-image { position: relative; aspect-ratio: 1.2; overflow: hidden; background: #dce5ef; }
        .ops-card-image img { width: 100%; height: 100%; display: block; object-fit: cover; transition: transform .3s, filter .3s; }
        .ops-game-card:hover .ops-card-image img { transform: scale(1.05); filter: saturate(1.08); }
        .ops-card-image::after { content: ""; position: absolute; inset: 0; background: linear-gradient(180deg, rgba(15,32,57,.02) 55%, rgba(15,32,57,.38)); pointer-events: none; }
        .ops-card-status { position: absolute; z-index: 1; left: 7px; top: 7px; padding: 4px 5px; color: #fff; border-radius: 4px; background: rgba(22,38,61,.75); font: 700 7px "Space Mono", monospace; letter-spacing: .06em; }
        .ops-card-action { position: absolute; z-index: 2; right: 7px; top: 7px; display: grid; place-items: center; width: 25px; height: 25px; border: 1px solid rgba(255,255,255,.45); border-radius: 6px; color: #fff; background: rgba(22,38,61,.56); }
        .ops-card-action.is-saved { color: #ffd67b; }
        .ops-card-action:hover { background: rgba(22,38,61,.85); }
        .ops-card-body { padding: 10px 10px 11px; }
        .ops-card-name { overflow: hidden; margin: 0; color: #263b56; font-size: 11px; font-weight: 800; text-overflow: ellipsis; white-space: nowrap; }
        .ops-card-meta { display: flex; align-items: center; justify-content: space-between; gap: 5px; margin-top: 6px; color: #8291a2; font: 8px "Space Mono", monospace; }
        .ops-card-meta span:first-child { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .ops-card-launch { display: flex; align-items: center; justify-content: center; gap: 5px; width: 100%; margin-top: 9px; padding: 7px 6px; border: 1px solid #c5d8ef; border-radius: 5px; color: var(--ops-blue-dark); background: #f0f6ff; font: 800 9px "Space Mono", monospace; transition: background .2s, color .2s; }
        .ops-card-launch:hover { color: #fff; background: var(--ops-blue); }
        .ops-card-launch svg { width: 11px; height: 11px; }
        .ops-empty { grid-column: 1 / -1; padding: 42px 20px; border: 1px dashed #bfccda; border-radius: 10px; color: #718095; background: rgba(248,250,252,.72); text-align: center; }
        .ops-empty svg { color: #82a5d7; }
        .ops-empty strong { display: block; margin-top: 9px; color: #344a67; font-size: 14px; }
        .ops-empty p { margin: 6px 0 0; font-size: 11px; }
        .ops-player { position: fixed; z-index: 30; right: 0; bottom: 0; left: 0; padding: 9px 20px; color: #eaf2fc; border-top: 1px solid #2f4967; background: #17283e; box-shadow: 0 -7px 24px rgba(25,42,65,.15); }
        .ops-player-inner { display: flex; align-items: center; gap: 18px; max-width: 1360px; margin: 0 auto; }
        .ops-player-track { display: flex; align-items: center; gap: 10px; min-width: 190px; }
        .ops-player-track img { width: 40px; height: 40px; object-fit: cover; border-radius: 6px; }
        .ops-player-copy { min-width: 0; }
        .ops-player-copy strong { display: block; overflow: hidden; color: #f5f8fc; font-size: 11px; text-overflow: ellipsis; white-space: nowrap; }
        .ops-player-copy span { display: block; margin-top: 3px; color: #91a6be; font: 8px "Space Mono", monospace; }
        .ops-player-controls { display: flex; align-items: center; gap: 7px; }
        .ops-player-controls button, .ops-player-close { display: grid; place-items: center; width: 28px; height: 28px; border: 0; border-radius: 6px; color: #b8c8d9; background: transparent; }
        .ops-player-controls button:hover, .ops-player-close:hover { color: #fff; background: rgba(116,167,220,.16); }
        .ops-player-controls .ops-player-play { width: 34px; height: 34px; color: #162a43; background: #c0e9ff; }
        .ops-player-progress { display: flex; align-items: center; gap: 9px; flex: 1; color: #94a9bf; font: 8px "Space Mono", monospace; }
        .ops-player-progress input { flex: 1; min-width: 50px; accent-color: #67c6e8; }
        .ops-player-volume { display: flex; align-items: center; gap: 7px; min-width: 120px; }
        .ops-player-volume input { width: 78px; accent-color: #67c6e8; }
        .ops-player-close { margin-left: auto; }
        .ops-toast { position: fixed; z-index: 40; right: 18px; bottom: ${playerOpen ? "84px" : "20px"}; padding: 10px 13px; color: #e9f4ff; border: 1px solid #456789; border-radius: 7px; background: #1b3554; box-shadow: 0 9px 22px rgba(24,42,67,.25); font: 700 10px "Space Mono", monospace; animation: ops-toast-in .22s ease both; }
        @keyframes ops-toast-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @media (max-width: 780px) {
          .ops-topbar { gap: 10px; padding: 9px 13px; }
          .ops-primary-nav { display: none; position: absolute; top: 59px; right: 12px; left: 12px; flex-direction: column; align-items: stretch; padding: 5px; border: 1px solid #355170; border-radius: 8px; background: #17283e; box-shadow: 0 13px 25px rgba(21,39,62,.3); }
          .ops-primary-nav.is-open { display: flex; }
          .ops-nav-button { text-align: left; }
          .ops-menu-button { display: grid; place-items: center; margin-left: auto; color: #c8d7e8; }
          .ops-system-pill { display: none; }
          .ops-layout { display: block; }
          .ops-rail { display: none; }
          .ops-workspace { padding: 20px 14px 26px; }
          .ops-workspace-head { align-items: start; }
          .ops-clock { display: none; }
          .ops-selection { grid-template-columns: 1fr; }
          .ops-inspector { display: grid; grid-template-columns: 125px 1fr; }
          .ops-inspector-head { border-right: 1px solid #e2e8ef; border-bottom: 0; align-items: start; }
          .ops-queue-list { grid-template-columns: 1fr; }
          .ops-game-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
          .ops-player-inner { gap: 10px; }
          .ops-player-track { min-width: 150px; }
          .ops-player-progress { display: none; }
          .ops-player-volume { min-width: 90px; }
        }
        @media (max-width: 500px) {
          .ops-brand-title { font-size: 13px; }
          .ops-brand-kicker { font-size: 7px; }
          .ops-page-title { font-size: 29px; }
          .ops-hero { grid-template-columns: 42% minmax(0,1fr); min-height: 190px; }
          .ops-hero-art { min-height: 190px; }
          .ops-hero-copy { padding: 15px 14px 13px; }
          .ops-hero-name { font-size: 26px; }
          .ops-hero-stats { display: none; }
          .ops-launch-button { width: 100%; justify-content: center; padding: 9px 8px; }
          .ops-library-head { align-items: start; }
          .ops-controls { flex-wrap: wrap; }
          .ops-search { flex-basis: 100%; order: 0; }
          .ops-filter-row { order: 1; }
          .ops-view-toggle { margin-left: auto; }
          .ops-game-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
          .ops-card-body { padding: 8px; }
          .ops-player { padding: 8px 11px; }
          .ops-player-track { min-width: 0; flex: 1; }
          .ops-player-volume { min-width: 0; }
          .ops-player-volume input { width: 47px; }
          .ops-player-close { display: none; }
        }
      `}</style>

      <header className="ops-topbar">
        <div className="ops-brand">
          <img className="ops-brand-mark" src={`${imageRoot}logo.gif`} alt="Aerodynamix" />
          <div className="ops-brand-copy">
            <p className="ops-brand-title">AERODYNAMIX</p>
            <div className="ops-brand-kicker">private arcade / ops console</div>
          </div>
        </div>
        <nav className={`ops-primary-nav ${menuOpen ? "is-open" : ""}`} aria-label="Main navigation">
          {navItems.map((item) => (
            <button className={`ops-nav-button ${item === "Games" ? "is-active" : ""}`} key={item} type="button" onClick={() => announce(`${item} module selected`)}>
              {item}
            </button>
          ))}
          <button className="ops-nav-button" type="button" onClick={() => announce("Settings module selected")}>Settings</button>
        </nav>
        <div className="ops-top-actions">
          <div className="ops-system-pill"><i className="ops-system-dot" />LOCAL LIBRARY / ONLINE</div>
          <button className="ops-menu-button" type="button" aria-label="Toggle navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      <div className="ops-layout">
        <aside className="ops-rail">
          <div className="ops-rail-label">Workspace</div>
          <button className="ops-rail-link is-active" type="button" onClick={() => announce("Library overview selected")}><LayoutGrid />Library overview</button>
          <button className="ops-rail-link" type="button" onClick={() => setActiveFilter("RECENT")}><Activity />Recently played</button>
          <button className="ops-rail-link" type="button" onClick={() => setActiveFilter("SAVED")}><Bookmark />Saved games <span style={{ marginLeft: "auto", fontSize: 9 }}>{favorites.length}</span></button>
          <div className="ops-rail-rule" />
          <div className="ops-rail-label">Quick access</div>
          <button className="ops-rail-link" type="button" onClick={() => chooseGame(games[0])}><Zap />Fast launch</button>
          <button className="ops-rail-link" type="button" onClick={() => announce("Keyboard shortcut list opened")}><Command />Shortcuts</button>
          <button className="ops-rail-link" type="button" onClick={() => announce("Preferences opened")}><Settings2 />Preferences</button>
          <div className="ops-rail-note">
            <strong>READY STATE</strong>
            <p><span className="ops-check">●</span> Browser runtime healthy<br />39 titles indexed<br />Last sync 2m ago</p>
          </div>
        </aside>

        <section className="ops-workspace">
          <div className="ops-workspace-head">
            <div>
              <div className="ops-eyebrow">Games / Command center</div>
              <h1 className="ops-page-title">Launch deck</h1>
              <p className="ops-page-subtitle">Pick a title, queue the next move, and get straight into play.</p>
            </div>
            <div className="ops-clock">SESSION STATUS<b>WED · 14:32:08</b></div>
          </div>

          <div className="ops-selection">
            <section className="ops-hero" aria-label="Current selection">
              <div className="ops-hero-art"><img src={`${imageRoot}${selected.file}`} alt={selected.name} /></div>
              <div className="ops-hero-copy">
                <div>
                  <div className="ops-hero-meta"><span>Current selection / 001</span><span className="ops-ready"><i /> READY</span></div>
                  <h2 className="ops-hero-name">{selected.name}</h2>
                  <div className="ops-hero-genre">{selected.genre} · {selected.meta}</div>
                </div>
                <div className="ops-hero-foot">
                  <div className="ops-hero-stats">
                    <span><strong>INSTANT</strong>launch mode</span>
                    <span><strong>LOCAL</strong>save state</span>
                  </div>
                  <button className="ops-launch-button" type="button" onClick={() => launchGame(selected)}><Play size={14} fill="currentColor" /> Launch game</button>
                </div>
              </div>
            </section>

            <aside className="ops-inspector" aria-label="Selected game details">
              <div className="ops-inspector-head"><span className="ops-inspector-title">Inspector</span><Settings2 /></div>
              <div className="ops-inspector-body">
                <div className="ops-inspector-row"><span>STATUS</span><b className="ops-check">● {selected.status === "RECENT" ? "RECENT" : "READY"}</b></div>
                <div className="ops-inspector-row"><span>FORMAT</span><b>HTML / WASM</b></div>
                <div className="ops-inspector-row"><span>INPUT</span><b>KEYBOARD</b></div>
                <div className="ops-inspector-row"><span>SAVED</span><b>{favorites.includes(selected.name) ? "YES" : "NO"}</b></div>
              </div>
            </aside>
          </div>

          <section className="ops-queue-panel" aria-label="Next launches">
            <div className="ops-queue-heading"><h2>Next launches</h2><span>{queue.length.toString().padStart(2, "0")} IN QUEUE</span></div>
            <div className="ops-queue-list">
              {queue.map((game) => (
                <div className="ops-queue-item" key={game.name}>
                  <img src={`${imageRoot}${game.file}`} alt="" />
                  <button className="ops-queue-copy" type="button" onClick={() => chooseGame(game)} style={{ border: 0, padding: 0, background: "transparent", textAlign: "left" }}>
                    <strong>{game.name}</strong><span>{game.genre} · queued</span>
                  </button>
                  <button className="ops-remove" type="button" aria-label={`Remove ${game.name} from queue`} onClick={() => removeFromQueue(game.name)}><X size={12} /></button>
                </div>
              ))}
              {queue.length === 0 && <div className="ops-empty">Queue is clear. Launch a title to stage it here.</div>}
            </div>
          </section>

          <div className="ops-library-head">
            <div className="ops-library-title"><h2>Complete library</h2><span>{shownGames.length.toString().padStart(2, "0")} / {games.length.toString().padStart(2, "0")} TITLES</span></div>
            <div className="ops-view-toggle" aria-label="Library view">
              <button className={view === "grid" ? "is-active" : ""} type="button" aria-label="Grid view" onClick={() => setView("grid")}><LayoutGrid size={14} /></button>
              <button className={view === "list" ? "is-active" : ""} type="button" aria-label="List view" onClick={() => setView("list")}><ListFilter size={14} /></button>
            </div>
          </div>
          <div className="ops-controls">
            <label className="ops-search"><Search size={15} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search titles or genres" aria-label="Search games" /></label>
            <div className="ops-filter-row">
              {filters.map((filter) => <button className={`ops-filter ${activeFilter === filter ? "is-active" : ""}`} key={filter} type="button" onClick={() => setActiveFilter(filter)}>{filter}</button>)}
            </div>
            <button className="ops-filter" type="button" onClick={() => announce("Filters are synced to your library")}><Filter size={13} /></button>
          </div>

          <div className="ops-game-grid" style={view === "list" ? { gridTemplateColumns: "1fr" } : undefined}>
            {shownGames.map((game) => (
              <article className={`ops-game-card ${selected.name === game.name ? "is-selected" : ""}`} key={game.file}>
                <button type="button" onClick={() => chooseGame(game)} style={{ display: "block", width: "100%", padding: 0, border: 0, background: "transparent", textAlign: "left" }}>
                  <div className="ops-card-image"><img src={`${imageRoot}${game.file}`} alt={game.name} loading="lazy" /><span className="ops-card-status">{game.status}</span></div>
                </button>
                <button className={`ops-card-action ${favorites.includes(game.name) ? "is-saved" : ""}`} type="button" aria-label={`${favorites.includes(game.name) ? "Remove" : "Save"} ${game.name}`} onClick={() => toggleFavorite(game)}>
                  {favorites.includes(game.name) ? <Star size={12} fill="currentColor" /> : <Heart size={12} />}
                </button>
                <div className="ops-card-body">
                  <h3 className="ops-card-name" title={game.name}>{game.name}</h3>
                  <div className="ops-card-meta"><span>{game.genre}</span><span>{game.meta.split(" · ")[0]}</span></div>
                  <button className="ops-card-launch" type="button" onClick={() => launchGame(game)}><Play size={11} fill="currentColor" /> Launch</button>
                </div>
              </article>
            ))}
            {shownGames.length === 0 && <div className="ops-empty"><Search size={22} /><strong>No titles match that search</strong><p>Try a different title, genre, or clear the active filter.</p></div>}
          </div>
        </section>
      </div>

      {playerOpen && (
        <aside className="ops-player" aria-label="Media player">
          <div className="ops-player-inner">
            <div className="ops-player-track"><img src={`${imageRoot}logo.gif`} alt="" /><div className="ops-player-copy"><strong>—</strong><span>MEDIA PLAYER / IDLE</span></div></div>
            <div className="ops-player-controls">
              <button type="button" aria-label="Previous track" onClick={() => announce("No previous track")}><SkipBack size={14} /></button>
              <button className="ops-player-play" type="button" aria-label={playing ? "Pause" : "Play"} onClick={() => setPlaying((value) => !value)}>{playing ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}</button>
              <button type="button" aria-label="Next track" onClick={() => announce("No next track")}><SkipForward size={14} /></button>
            </div>
            <div className="ops-player-progress"><span>0:00</span><input type="range" min="0" max="100" defaultValue="0" aria-label="Track progress" /><span>0:00</span></div>
            <div className="ops-player-volume"><Volume2 size={14} /><input type="range" min="0" max="100" value={volume} onChange={(event) => setVolume(Number(event.target.value))} aria-label="Volume" /></div>
            <button className="ops-player-close" type="button" aria-label="Close media player" onClick={() => setPlayerOpen(false)}><X size={15} /></button>
          </div>
        </aside>
      )}
      {!playerOpen && <button className="ops-player-reopen" type="button" onClick={() => setPlayerOpen(true)} style={{ position: "fixed", right: 15, bottom: 15, zIndex: 30, display: "grid", placeItems: "center", width: 38, height: 38, border: "1px solid #47617d", borderRadius: 8, color: "#dff2ff", background: "#17283e" }} aria-label="Open media player"><Volume2 size={16} /></button>}
      {toast && <div className="ops-toast" role="status"><Check size={12} style={{ verticalAlign: "middle", marginRight: 6 }} />{toast}</div>}
    </main>
  );
}