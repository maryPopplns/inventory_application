'use strict';

(function movesTypesSlider() {
  var movesSlider = document.getElementsByClassName('movesSlider')[0];
  var typesSlider = document.getElementsByClassName('typesSlider')[0];

  var moveHandler = function moveHandler() {
    var movesContent = document.getElementsByClassName('movesContent')[0];
    movesContent.classList.toggle('open'); // TODO change the arrow button
  };

  var typeHandler = function typeHandler() {
    var typesContent = document.getElementsByClassName('typesContent')[0];
    typesContent.classList.toggle('open'); // TODO change the arrow button
  };

  movesSlider.addEventListener('click', moveHandler);
  typesSlider.addEventListener('click', typeHandler);
})();
//# sourceMappingURL=index.js.map
