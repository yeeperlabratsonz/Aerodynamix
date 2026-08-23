const input = document.querySelector('input');
const games = document.querySelectorAll('#games a[data-game-name], #games img');

if (input) {
  input.addEventListener('input', () => {
    const searchTerm = input.value.toLowerCase();
    games.forEach(game => {
      const gameName = (game.dataset.gameName || game.alt || '').toLowerCase();
      if (gameName.includes(searchTerm)) {
        game.style.display = 'block';
      } else {
        game.style.display = 'none';
      }
    });
  });
}