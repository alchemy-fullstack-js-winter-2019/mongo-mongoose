const { getRandomQuote } = require('../lib/services/ronSwansonApi');

describe('ronSwansonApi', () => {
  it('can get random quotes', () => {
    return getRandomQuote(10)
      .then(res => {
        expect(res).toHaveLength(10);
      });
  });
});
