exports.home_get = function (req, res, next) {
  // TODO query pokemon
  // TODO pull name/animations
  res.render('home', { title: 'my Express' });
};
