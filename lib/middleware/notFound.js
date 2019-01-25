module.exports = (req, res, next) => {
  res.status(404)({ error: 'NOT FOUND' });
  next();
};
