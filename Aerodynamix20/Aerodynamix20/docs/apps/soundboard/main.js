import { sounds } from 'https://cdn.jsdelivr.net/gh/bubblfan/soundboard@main/sounds.js';

const AUDIO_ROOT = 'https://cdn.jsdelivr.net/gh/bubblfan/soundboard@main/';
const toggleButton = document.getElementById('toggleButton');
const stopButton = document.getElementById('stopButton');
const searchInput = document.getElementById('searchInput');
const favoriteButton = document.getElementById('toggleFavorites');
const soundBoard = document.getElementById('soundboard');
let allowOverlap = false;
let showFavorites = false;
let currentAudios = [];

function getFavorites() {
  try {
    const stored = JSON.parse(localStorage.getItem('favorites') || '[]');
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
}

function audioUrl(sound) {
  return `${AUDIO_ROOT}${String(sound.mp3 || '').replace(/^\/+/, '')}`;
}

function stopAllSounds() {
  currentAudios.forEach((audio) => {
    audio.pause();
    audio.removeAttribute('src');
    audio.load();
  });
  currentAudios = [];
}

function playSound(sound, image) {
  if (!allowOverlap) stopAllSounds();
  const audio = new Audio(audioUrl(sound));
  currentAudios.push(audio);
  const remove = () => { currentAudios = currentAudios.filter((item) => item !== audio); };
  audio.addEventListener('ended', remove, { once: true });
  audio.addEventListener('error', remove, { once: true });
  void audio.play().catch(remove);
  image.classList.add('pressed');
  window.setTimeout(() => image.classList.remove('pressed'), 150);
}

function renderSounds(query = '') {
  const normalizedQuery = query.trim().toLowerCase();
  const favoriteNames = new Set(getFavorites().map((sound) => sound.name));
  const visibleSounds = sounds.filter((sound) =>
    String(sound.name).toLowerCase().includes(normalizedQuery) &&
    (!showFavorites || favoriteNames.has(sound.name))
  );
  soundBoard.innerHTML = '';
  visibleSounds.forEach((sound) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'sound-wrapper';
    const button = document.createElement('button');
    button.className = 'sound-button-img';
    button.type = 'button';
    button.style.setProperty('--btn-color', sound.color || '#8a8a8a');
    const image = document.createElement('div');
    image.className = 'sound-image';
    button.appendChild(image);
    button.addEventListener('click', () => playSound(sound, image));
    const label = document.createElement('div');
    label.className = 'sound-label';
    label.textContent = sound.name;
    wrapper.append(button, label);
    wrapper.addEventListener('contextmenu', (event) => openSoundMenu(event, sound));
    soundBoard.appendChild(wrapper);
  });
}

function openSoundMenu(event, sound) {
  event.preventDefault();
  document.querySelectorAll('.right-click-panel').forEach((panel) => panel.remove());
  const panel = document.createElement('div');
  panel.className = 'right-click-panel';
  panel.style.left = `${event.pageX}px`;
  panel.style.top = `${event.pageY}px`;
  const favorites = getFavorites();
  const isFavorite = favorites.some((item) => item.name === sound.name);
  const favorite = document.createElement('button');
  favorite.className = 'right-click-panel-button';
  favorite.type = 'button';
  favorite.textContent = isFavorite ? '⭐ Unfavorite' : '🌟 Favorite';
  favorite.onclick = () => {
    localStorage.setItem('favorites', JSON.stringify(isFavorite
      ? favorites.filter((item) => item.name !== sound.name)
      : [...favorites, sound]));
    panel.remove();
    renderSounds(searchInput.value);
  };
  const download = document.createElement('button');
  download.className = 'right-click-panel-button';
  download.type = 'button';
  download.textContent = '💾 Download';
  download.onclick = () => {
    const link = document.createElement('a');
    link.href = audioUrl(sound);
    link.download = String(sound.mp3).split('/').pop() || 'sound.mp3';
    document.body.appendChild(link);
    link.click();
    link.remove();
    panel.remove();
  };
  panel.append(favorite, download);
  document.body.appendChild(panel);
}

toggleButton.onclick = () => {
  allowOverlap = !allowOverlap;
  toggleButton.textContent = allowOverlap ? '🔊 Overlap: ON' : '🔇 Overlap: OFF';
};
stopButton.onclick = stopAllSounds;
favoriteButton.onclick = () => {
  showFavorites = !showFavorites;
  favoriteButton.textContent = showFavorites ? '🌟 Favorites: ON' : '⭐ Favorites: OFF';
  renderSounds(searchInput.value);
};
searchInput.oninput = () => renderSounds(searchInput.value);
renderSounds();