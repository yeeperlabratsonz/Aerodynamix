import { useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Gamepad2,
  Grid2X2,
  Heart,
  Menu,
  Music2,
  Pause,
  Play,
  Radio,
  Search,
  Settings,
  Sparkles,
  Volume2,
  X,
} from "lucide-react";

const imageRoot = "/__mockup/images/aerodynamix/";

type Game = {
  file: string;
  name: string;
  genre: string;
  tag: string;
};

const gameSeed: [string, string, string, string][] = [
  ["run-3.jpg", "Run 3", "Action", "fast"],
  ["drive-mad.jpg", "Drive Mad", "Action", "new"],
  ["retro-bowl.jpg", "Retro Bowl", "Classic", "hot"],
  ["slope.jpg", "Slope", "Action", "fast"],
  ["mc.png", "Minecraft", "Chill", "sandbox"],
  ["supersmashflash.jpg", "Super Smash Flash", "Action", "hot"],
  ["papaspizzeria.png", "Papa's Pizzeria", "Chill", "cozy"],
  ["papasfreezeria.png", "Papa's Freezeria", "Chill", "cozy"],
  ["papas-pancakeria.png", "Papa's Pancakeria", "Chill", "cozy"],
  ["papas-bakeria.png", "Papa's Bakeria", "Chill", "cozy"],
  ["meat-boy.png", "Meat Boy", "Action", "hard"],
  ["newgrounds-rumble.png", "Newgrounds Rumble", "Action", "arcade"],
  ["we-become-what-we-behold.png", "We Become What We Behold", "Story", "odd"],
  ["bad-time-simulator.png", "Bad Time Simulator", "Action", "hard"],
  ["deltarune.png", "Deltarune", "Story", "story"],
  ["adventure-capitalist.png", "Adventure Capitalist", "Chill", "idle"],
  ["fridaynightfunkin.png", "Friday Night Funkin'", "Action", "rhythm"],
  ["run-2.png", "Run 2", "Classic", "fast"],
  ["picoschool.png", "Pico's School", "Story", "odd"],
  ["worldshardestgame.png", "World's Hardest Game", "Classic", "hard"],
  ["sandboxels.png", "Sandboxels", "Chill", "sandbox"],
  ["alien-hominid.png", "Alien Hominid", "Action", "arcade"],
  ["subway-surfers-sf.jpg", "Subway Surfers San Francisco", "Action", "fast"],
  ["hobo-1.png", "Hobo 1", "Classic", "arcade"],
  ["hobo-2.png", "Hobo 2", "Classic", "arcade"],
  ["hobo-3.png", "Hobo 3", "Classic", "arcade"],
  ["hobo-4.png", "Hobo 4", "Classic", "arcade"],
  ["hobo-5.png", "Hobo 5", "Classic", "arcade"],
  ["hobo-6.png", "Hobo 6", "Classic", "arcade"],
  ["hobo-7.png", "Hobo 7", "Classic", "arcade"],
  ["gladihoppers.jpg", "Gladihoppers", "Action", "arcade"],
  ["fruit-ninja.png", "Fruit Ninja", "Action", "fast"],
  ["binding-of-isaac.png", "Binding of Isaac", "Story", "dark"],
  ["crossy-road.png", "Crossy Road", "Classic", "fast"],
  ["cookie-clicker.png", "Cookie Clicker", "Chill", "idle"],
  ["duck-life.png", "Duck Life", "Chill", "cozy"],
  ["geometry-dash-lite.jpg", "Geometry Dash Lite", "Action", "rhythm"],
  ["doom.png", "Doom", "Action", "classic"],
  ["doki-doki-literature-club.jpg", "Doki Doki Literature Club", "Story", "story"],
  ["baldis-basics-classic-remastered.png", "Baldi's Basics", "Story", "odd"],
  ["stickmin-breaking-bank.jpg", "Breaking the Bank", "Story", "odd"],
  ["stickmin-escaping-prison.avif", "Escaping the Prison", "Story", "story"],
  ["stickmin-stealing-diamond.avif", "Stealing the Diamond", "Story", "story"],
  ["stickmin-infiltrating-airship.avif", "Infiltrating the Airship", "Story", "story"],
  ["stickmin-fleeing-complex.avif", "Fleeing the Complex", "Story", "story"],
  ["greatest-game-square.svg", "The Greatest Game", "Classic", "wild"],
  ["nubbys-number-factory.jpg", "Nubby's Number Factory", "Chill", "odd"],
];
const games: Game[] = gameSeed.map(([file, name, genre, tag]) => ({ file, name, genre, tag }));

const spotlight = [
  games[0],
  games[1],
  games[5],
  games[6],
  games[2],
  games[36],
];

const categories = ["All", "Action", "Chill", "Classic", "Story"];
const navItems = [
  { label: "Games", icon: Gamepad2 },
  { label: "Apps", icon: Grid2X2 },
  { label: "Media Player", icon: Music2 },
  { label: "Connect", icon: Radio },
  { label: "Settings", icon: Settings },
];

export function ReferenceArcade() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [activeNav, setActiveNav] = useState("Games");
  const [menuOpen, setMenuOpen] = useState(false);
  const [savedOnly, setSavedOnly] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(["Run 3", "Retro Bowl"]);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [currentTrack, setCurrentTrack] = useState<Game>(games[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playerOpen, setPlayerOpen] = useState(true);
  const [volume, setVolume] = useState(72);

  const shownGames = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return games.filter((game) => {
      const matchesQuery =
        !normalized ||
        game.name.toLowerCase().includes(normalized) ||
        game.genre.toLowerCase().includes(normalized);
      const matchesCategory = category === "All" || game.genre === category;
      const matchesSaved = !savedOnly || favorites.includes(game.name);
      return matchesQuery && matchesCategory && matchesSaved;
    });
  }, [category, favorites, query, savedOnly]);

  const toggleFavorite = (name: string) => {
    setFavorites((current) =>
      current.includes(name)
        ? current.filter((favorite) => favorite !== name)
        : [...current, name],
    );
  };

  const launchGame = (game: Game) => {
    setCurrentTrack(game);
    setSelectedGame(game);
    setIsPlaying(true);
  };

  const stepTrack = (direction: number) => {
    const currentIndex = games.findIndex((game) => game.name === currentTrack.name);
    const nextIndex = (currentIndex + direction + games.length) % games.length;
    setCurrentTrack(games[nextIndex]);
  };

  return (
    <main className="reference-arcade">
      <style>{`
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
      `}</style>

      <header className="arcade-topbar">
        <button className="arcade-brand" type="button" onClick={() => setActiveNav("Games")} aria-label="Aerodynamix home">
          <img src={`${imageRoot}logo.gif`} alt="Aerodynamix" />
        </button>
        <nav className={`arcade-nav ${menuOpen ? "open" : ""}`} aria-label="Aerodynamix navigation">
          {navItems.map(({ label, icon: Icon }) => (
            <button
              className={activeNav === label ? "active" : ""}
              key={label}
              type="button"
              onClick={() => {
                setActiveNav(label);
                setMenuOpen(false);
              }}
              aria-label={label}
              aria-pressed={activeNav === label}
            >
              <Icon size={17} strokeWidth={2.2} />
              <span className="arcade-nav-label">{label}</span>
            </button>
          ))}
        </nav>
        <button
          className="arcade-menu-button"
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </header>

      <section className="arcade-heading" aria-labelledby="arcade-title">
        <h1 id="arcade-title">{activeNav.toLowerCase()}</h1>
        <p><strong>●</strong> loaded {games.length} games · local collection</p>
      </section>

      <section className="spotlight" aria-label="Quick picks">
        {spotlight.map((game) => (
          <button className="spotlight-card" key={game.name} type="button" onClick={() => launchGame(game)} aria-label={`Launch ${game.name}`}>
            <img src={`${imageRoot}${game.file}`} alt={game.name} />
          </button>
        ))}
      </section>

      <section className="arcade-controls" aria-label="Find a game">
        <label className="arcade-search">
          <Search size={15} aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="find what you want…"
            aria-label="Find a game"
          />
          {query && (
            <button type="button" onClick={() => setQuery("")} aria-label="Clear search">
              <X size={14} />
            </button>
          )}
        </label>
        <button
          className={`saved-toggle ${savedOnly ? "active" : ""}`}
          type="button"
          onClick={() => setSavedOnly((saved) => !saved)}
          aria-pressed={savedOnly}
        >
          <Heart size={13} fill={savedOnly ? "currentColor" : "none"} />
          saved {favorites.length}
        </button>
      </section>

      <div className="category-row" aria-label="Game categories">
        {categories.map((item) => (
          <button
            className={`category-button ${category === item ? "active" : ""}`}
            type="button"
            key={item}
            onClick={() => setCategory(item)}
            aria-pressed={category === item}
          >
            {item}
          </button>
        ))}
      </div>

      <section className="library" aria-labelledby="library-title">
        <div className="library-meta">
          <span id="library-title"><strong>{shownGames.length}</strong> results</span>
          <span><Sparkles size={10} aria-hidden="true" /> picks for you</span>
        </div>
        <div className="game-grid">
          {shownGames.length ? shownGames.map((game) => {
            const isFavorite = favorites.includes(game.name);
            return (
              <article className="game-card" key={game.name}>
                <img src={`${imageRoot}${game.file}`} alt={`${game.name} game artwork`} loading="lazy" />
                <button
                  className={`favorite-button ${isFavorite ? "is-favorite" : ""}`}
                  type="button"
                  onClick={() => toggleFavorite(game.name)}
                  aria-label={isFavorite ? `Remove ${game.name} from saved games` : `Save ${game.name}`}
                  aria-pressed={isFavorite}
                >
                  <Heart size={12} fill={isFavorite ? "currentColor" : "none"} />
                </button>
                <button className="game-launch" type="button" onClick={() => launchGame(game)} aria-label={`Launch ${game.name}`}>
                  <span className="game-play"><Play size={11} fill="currentColor" /></span>
                  <span className="game-name">{game.name}</span>
                  <span className="game-genre">{game.genre} · {game.tag}</span>
                </button>
              </article>
            );
          }) : (
            <div className="empty-library">
              <strong>nothing in this orbit</strong>
              Try another search or clear the saved filter.
            </div>
          )}
        </div>
      </section>

      {playerOpen ? (
        <aside className="arcade-player" aria-label="Persistent media player">
          <div className="track-meta">
            <img className="track-art" src={`${imageRoot}${currentTrack.file}`} alt="" />
            <div className="track-copy">
              <div className="track-title">{currentTrack.name}</div>
              <div className="track-subtitle">{isPlaying ? "now playing locally" : "media player · ready"}</div>
            </div>
          </div>
          <div className="player-controls">
            <button type="button" onClick={() => stepTrack(-1)} aria-label="Previous track"><ChevronLeft size={17} /></button>
            <button className="play-toggle" type="button" onClick={() => setIsPlaying((playing) => !playing)} aria-label={isPlaying ? "Pause" : "Play"}>
              {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
            </button>
            <button type="button" onClick={() => stepTrack(1)} aria-label="Next track"><ChevronRight size={17} /></button>
          </div>
          <div className="player-tools">
            <span className="player-time">{isPlaying ? "0:18" : "0:00"} / 2:47</span>
            <Volume2 size={14} aria-hidden="true" />
            <input type="range" min="0" max="100" value={volume} onChange={(event) => setVolume(Number(event.target.value))} aria-label="Volume" />
            <button className="player-close" type="button" onClick={() => setPlayerOpen(false)} aria-label="Close media player"><X size={15} /></button>
          </div>
        </aside>
      ) : (
        <button className="reopen-player" type="button" onClick={() => setPlayerOpen(true)} aria-label="Open media player">
          <Music2 size={18} />
        </button>
      )}

      {selectedGame && (
        <div className="launch-modal-backdrop" role="presentation" onClick={() => setSelectedGame(null)}>
          <section className="launch-modal" role="dialog" aria-modal="true" aria-labelledby="launch-title" onClick={(event) => event.stopPropagation()}>
            <img src={`${imageRoot}${selectedGame.file}`} alt="" />
            <div className="launch-modal-copy">
              <small>local launch ready</small>
              <h2 id="launch-title">{selectedGame.name}</h2>
              <p>{selectedGame.genre} · {selectedGame.tag}<br />No account. No waiting. Just play.</p>
              <button className="modal-launch" type="button" onClick={() => setSelectedGame(null)}>
                <Play size={13} fill="currentColor" /> enter game
              </button>
            </div>
            <button className="modal-close" type="button" onClick={() => setSelectedGame(null)} aria-label="Close launch dialog"><X size={14} /></button>
          </section>
        </div>
      )}
    </main>
  );
}