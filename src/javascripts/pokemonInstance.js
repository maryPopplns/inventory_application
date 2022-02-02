// [ SLIDER ]
(function pokemonInstance() {
  const movesSlider = document.getElementsByClassName('movesSlider')[0];
  const typesSlider = document.getElementsByClassName('typesSlider')[0];
  const moveHandler = () => {
    const movesContent = document.getElementsByClassName('movesContent')[0];
    movesContent.classList.toggle('open');
    // TODO change the arrow button
  };
  const typeHandler = () => {
    const typesContent = document.getElementsByClassName('typesContent')[0];
    typesContent.classList.toggle('open');
    // TODO change the arrow button
  };
  movesSlider.addEventListener('click', moveHandler);
  typesSlider.addEventListener('click', typeHandler);
})();
