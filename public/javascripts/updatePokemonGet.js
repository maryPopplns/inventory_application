"use strict";

(function () {
  var updatePokeTypesSlider = document.getElementsByClassName('updatePokemonTypesSlider')[0];

  var updatePokeTypesHandler = function updatePokeTypesHandler() {
    var typesContent = document.getElementsByClassName('updatePokemonTypesContent')[0];
    typesContent.classList.toggle('open'); // TODO change the arrow button
  };

  updatePokeTypesSlider.addEventListener('click', updatePokeTypesHandler);
})();
//# sourceMappingURL=updatePokemonGet.js.map