const { getQuotes } = require('../services/ronSwansonApi');

module.exports = (req, res, next) => {
  getQuotes(1)
    .then(([quotes]) => {
      req.quotes = quotes;
      next();
    })
    .catch(next);
};
