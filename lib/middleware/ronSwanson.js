const getQuotes = require('../services/ronSwansonApi');

module.exports = (req, res, next) => {
  getQuotes(1)
    .then(quotes => {
      req.quote = quotes[0];
      next();
    })
    .catch(next);
};
