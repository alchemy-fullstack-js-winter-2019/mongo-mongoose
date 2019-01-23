module.exports = (req, res, next) => {
  res.status(400).send({ error: 'Not Found' });
  next();
};
