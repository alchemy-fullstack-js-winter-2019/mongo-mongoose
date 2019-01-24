const { getRandomQuote } = require('../../lib/services/ronSwansonApi');

describe('ronSwansonApi service', () => {
  it('gets a number of quotes and returns in array', () => {
    return getRandomQuote(3)
      .then(quote => {
        expect(quote).toHaveLength(3);
      });
  });
});
