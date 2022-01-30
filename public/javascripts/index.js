"use strict";

(function movesTypesSlider() {
  var movesSlider = document.getElementsByClassName('movesSlider')[0];
  var typesSlider = document.getElementsByClassName('typesSlider')[0];

  var moveHandler = function moveHandler(event) {
    console.log(event);
  };

  var typeHandler = function typeHandler(event) {
    console.log(event);
  };

  movesSlider.addEventListener('click', moveHandler);
  typesSlider.addEventListener('click', typeHandler); // console.log(movesSlider);
  // console.log(typesSlider);
})();
//# sourceMappingURL=index.js.map