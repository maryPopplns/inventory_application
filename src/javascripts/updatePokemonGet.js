(() => {
  const updatePokeTypesSlider = document.getElementsByClassName(
    'updatePokemonTypesSlider'
  )[0];

  const updatePokeTypesHandler = () => {
    const typesContent = document.getElementsByClassName(
      'updatePokemonTypesContent'
    )[0];
    typesContent.classList.toggle('open');
    // TODO change the arrow button
  };

  updatePokeTypesSlider.addEventListener('click', updatePokeTypesHandler);
})();
