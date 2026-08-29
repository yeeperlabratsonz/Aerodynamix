import { useState, type MouseEvent } from "react";
import { ChevronLeft, ChevronRight, Play, Search, Volume2, X } from "lucide-react";
import "./_group.css";

const imageRoot = "/__mockup/images/aerodynamix/";
const featured = [
  ["run-3.jpg", "Run 3"], ["drive-mad.jpg", "Drive Mad"],
  ["papaspizzeria.png", "Papa's Pizzeria"], ["supersmashflash.jpg", "Super Smash Flash"],
];
const games = [
  ["run-3.jpg","Run 3"],["drive-mad.jpg","Drive Mad"],["retro-bowl.jpg","Retro Bowl"],["slope.jpg","Slope"],
  ["mc.png","Minecraft"],["supersmashflash.jpg","Super Smash Flash"],["papaspizzeria.png","Papa's Pizzeria"],["papasfreezeria.png","Papa's Freezeria"],
  ["papas-pancakeria.png","Papa's Pancakeria"],["papas-bakeria.png","Papa's Bakeria"],["meat-boy.png","Meat Boy"],["newgrounds-rumble.png","Newgrounds Rumble"],
  ["we-become-what-we-behold.png","We Become What We Behold"],["bad-time-simulator.png","Bad Time Simulator"],["deltarune.png","Deltarune"],["adventure-capitalist.png","Adventure Capitalist"],
  ["fridaynightfunkin.png","Friday Night Funkin'"],["run-2.png","Run 2"],["picoschool.png","Pico's School"],["worldshardestgame.png","World's Hardest Game"],
  ["sandboxels.png","Sandboxels"],["alien-hominid.png","Alien Hominid"],["subway-surfers-sf.jpg","Subway Surfers San Francisco"],["hobo-1.png","Hobo 1"],
  ["hobo-2.png","Hobo 2"],["hobo-3.png","Hobo 3"],["hobo-4.png","Hobo 4"],["hobo-5.png","Hobo 5"],["hobo-6.png","Hobo 6"],["hobo-7.png","Hobo 7"],
  ["gladihoppers.jpg","Gladihoppers"],["fruit-ninja.png","Fruit Ninja"],["binding-of-isaac.png","Binding of Isaac"],["crossy-road.png","Crossy Road"],
  ["cookie-clicker.png","Cookie Clicker"],["duck-life.png","Duck Life"],["geometry-dash-lite.jpg","Geometry Dash Lite"],["doom.png","Doom"],
  ["doki-doki-literature-club.jpg","Doki Doki Literature Club"],["baldis-basics-classic-remastered.png","Baldi's Basics Classic Remastered"],
  ["stickmin-breaking-bank.jpg","Breaking the Bank"],["stickmin-escaping-prison.avif","Escaping the Prison"],["stickmin-stealing-diamond.avif","Stealing the Diamond"],
  ["stickmin-infiltrating-airship.avif","Infiltrating the Airship"],["stickmin-fleeing-complex.avif","Fleeing the Complex"],
  ["greatest-game-square.svg","THE GREATEST GAME OF ALL TIME"],["nubbys-number-factory.jpg","Nubby's Number Factory"],
];
const navItems = ["Games", "Apps", "Media Player", "Connect"];

export function Current() {
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const shownGames = games.filter(([, name]) => name.toLowerCase().includes(query.toLowerCase()));
  const localAction = (event: MouseEvent<HTMLAnchorElement>) => event.preventDefault();

  return (
    <main className="aero-page min-h-screen">
      <nav className="aero-nav" aria-label="Aerodynamix navigation">
        <a href="#" onClick={localAction}><img className="aero-logo" src={`${imageRoot}logo.gif`} alt="Aerodynamix logo" /></a>
        <h1 className="aero-brand"><span className="logo-a">A</span>ERODYNAMIX</h1>
        <div className={`aero-nav-links ${menuOpen ? "open" : ""}`}>
          {navItems.map((item, index) => <a key={item} className={index === 0 ? "active" : ""} href="#" onClick={localAction}>{item}</a>)}
        </div>
        <a className="aero-settings" href="#" onClick={localAction}>Settings</a>
        <button className="aero-menu" type="button" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen}>
          {menuOpen ? "× Close" : "☰ Menu"}
        </button>
      </nav>

      <section className="aero-featured" aria-labelledby="best-games">
        <h1 id="best-games">Best Games</h1>
        <div className="aero-featured-row">
          {featured.map(([file, name]) => <a className="aero-featured-card" href="#" onClick={localAction} key={file}>
            <img src={`${imageRoot}${file}`} alt={name} /><span className="aero-play"><Play fill="currentColor" /></span>
          </a>)}
        </div>
      </section>

      <section className="aero-content">
        <hr />
        <div className="aero-search">
          <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search..." aria-label="Search games" />
          <button type="button" aria-label="Search"><Search size={22} /></button>
        </div>
        <div className="aero-games">
          {shownGames.map(([file, name]) => <a className="aero-game" href="#" onClick={localAction} key={file}>
            <img src={`${imageRoot}${file}`} alt={name} loading="lazy" />
          </a>)}
        </div>
        {shownGames.length === 0 && <p style={{ textAlign: "center", width: "100%" }}>If there's no games then try refreshing the page</p>}
      </section>

      <aside className="aero-player" aria-label="Media player">
        <div className="aero-player-inner">
          <div className="aero-track">
            <img className="aero-track-art" src={`${imageRoot}logo.gif`} alt="" />
            <div className="aero-track-meta"><div className="aero-track-title">—</div><div className="aero-track-album">Media Player</div></div>
          </div>
          <div className="aero-player-controls">
            <button type="button" aria-label="Previous track"><ChevronLeft /></button>
            <button className="aero-pause" type="button" aria-label="Play"><Play size={17} fill="currentColor" /></button>
            <button type="button" aria-label="Next track"><ChevronRight /></button>
          </div>
          <div className="aero-player-progress">
            <span>0:00 / 0:00</span><input type="range" min="0" max="100" defaultValue="0" aria-label="Track progress" />
            <Volume2 size={15} /><input type="range" min="0" max="100" defaultValue="100" aria-label="Volume" /><button type="button" aria-label="Close player"><X size={16} /></button>
          </div>
        </div>
      </aside>
    </main>
  );
}