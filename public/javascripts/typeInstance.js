"use strict";

// [ SLIDER ]
(function typeInstance() {
  var ddfSlider = document.getElementsByClassName('ddfSlider')[0];
  var ddtSlider = document.getElementsByClassName('ddtSlider')[0];
  var hdfSlider = document.getElementsByClassName('hdfSlider')[0];
  var hdtSlider = document.getElementsByClassName('hdtSlider')[0];
  var ndfSlider = document.getElementsByClassName('ndfSlider')[0];
  var ndtSlider = document.getElementsByClassName('ndtSlider')[0];

  var ddfHandler = function ddfHandler() {
    var ddfContent = document.getElementsByClassName('ddfContent')[0];
    ddfContent.classList.toggle('open'); // TODO change the arrow button
  };

  var ddtHandler = function ddtHandler() {
    var ddtContent = document.getElementsByClassName('ddtContent')[0];
    ddtContent.classList.toggle('open'); // TODO change the arrow button
  };

  var hdfHandler = function hdfHandler() {
    var hdfContent = document.getElementsByClassName('hdfContent')[0];
    hdfContent.classList.toggle('open'); // TODO change the arrow button
  };

  var hdtHandler = function hdtHandler() {
    var hdtContent = document.getElementsByClassName('hdtContent')[0];
    hdtContent.classList.toggle('open'); // TODO change the arrow button
  };

  var ndfHandler = function ndfHandler() {
    var ndfContent = document.getElementsByClassName('ndfContent')[0];
    ndfContent.classList.toggle('open'); // TODO change the arrow button
  };

  var ndtHandler = function ndtHandler() {
    var ndtContent = document.getElementsByClassName('ndtContent')[0];
    ndtContent.classList.toggle('open'); // TODO change the arrow button
  };

  ddfSlider.addEventListener('click', ddfHandler);
  ddtSlider.addEventListener('click', ddtHandler);
  hdfSlider.addEventListener('click', hdfHandler);
  hdtSlider.addEventListener('click', hdtHandler);
  ndfSlider.addEventListener('click', ndfHandler);
  ndtSlider.addEventListener('click', ndtHandler);
})();
//# sourceMappingURL=typeInstance.js.map