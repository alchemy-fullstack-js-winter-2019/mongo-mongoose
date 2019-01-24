const { getRandomQuote } = require('../services/ronSwansonApi');

module.exports = (req, res, next) => {
  getRandomQuote(1)
    .then(res => {
      req.quote = res;
      next();
    });
};
