const getQuote = require('../services/ronSwansonApi');

module.exports = (req, res, next) => {
  getQuote(1)
    .then(res => {
      req.quote = res[0];
      next();
    })
    .catch(next);
};