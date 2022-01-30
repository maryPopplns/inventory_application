(function movesTypesSlider() {
  const movesSlider = document.getElementsByClassName('movesSlider')[0];
  const typesSlider = document.getElementsByClassName('typesSlider')[0];
  const moveHandler = (event) => {
    console.log(event);
  };
  const typeHandler = (event) => {
    console.log(event);
  };
  movesSlider.addEventListener('click', moveHandler);
  typesSlider.addEventListener('click', typeHandler);
  // console.log(movesSlider);
  // console.log(typesSlider);
})();
