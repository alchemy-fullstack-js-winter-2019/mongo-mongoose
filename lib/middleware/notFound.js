module.exports = (req, res, next) => {
  res.statusCode = 404;
  res.setHeader('Content-Type', 'text/html');
  res.end('Sorry, "' + req.url + '" was not found!<br><a href="/">Home</a>');
  next();
};
