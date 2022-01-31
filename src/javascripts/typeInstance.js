// [ SLIDER ]
(function typeInstance() {
  const ddfSlider = document.getElementsByClassName('ddfSlider')[0];
  const ddtSlider = document.getElementsByClassName('ddtSlider')[0];
  const hdfSlider = document.getElementsByClassName('hdfSlider')[0];
  const hdtSlider = document.getElementsByClassName('hdtSlider')[0];
  const ndfSlider = document.getElementsByClassName('ndfSlider')[0];
  const ndtSlider = document.getElementsByClassName('ndtSlider')[0];

  const ddfHandler = () => {
    const ddfContent = document.getElementsByClassName('ddfContent')[0];
    ddfContent.classList.toggle('open');
    // TODO change the arrow button
  };
  const ddtHandler = () => {
    const ddtContent = document.getElementsByClassName('ddtContent')[0];
    ddtContent.classList.toggle('open');
    // TODO change the arrow button
  };
  const hdfHandler = () => {
    const hdfContent = document.getElementsByClassName('hdfContent')[0];
    hdfContent.classList.toggle('open');
    // TODO change the arrow button
  };
  const hdtHandler = () => {
    const hdtContent = document.getElementsByClassName('hdtContent')[0];
    hdtContent.classList.toggle('open');
    // TODO change the arrow button
  };
  const ndfHandler = () => {
    const ndfContent = document.getElementsByClassName('ndfContent')[0];
    ndfContent.classList.toggle('open');
    // TODO change the arrow button
  };
  const ndtHandler = () => {
    const ndtContent = document.getElementsByClassName('ndtContent')[0];
    ndtContent.classList.toggle('open');
    // TODO change the arrow button
  };

  ddfSlider.addEventListener('click', ddfHandler);
  ddtSlider.addEventListener('click', ddtHandler);
  hdfSlider.addEventListener('click', hdfHandler);
  hdtSlider.addEventListener('click', hdtHandler);
  ndfSlider.addEventListener('click', ndfHandler);
  ndtSlider.addEventListener('click', ndtHandler);
})();
