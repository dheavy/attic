exports.index = function(req, res) {
  res.render('index', { title: 'Hello', content: 'Hello, world' });
};