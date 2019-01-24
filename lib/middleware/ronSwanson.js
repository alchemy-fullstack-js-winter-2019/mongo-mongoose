const { getQuotes } = require('../services/ronSwansonApi');

module.exports = (req, res, next) => {
  console.log('fds');
  getQuotes(1)
    .then(([quotes]) => {
      req.quotes = quotes;
      next();
    })
    .catch(next);
};
