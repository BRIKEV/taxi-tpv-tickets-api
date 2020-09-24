const expect = require('expect.js');

const { isValidPrice, isValidFormatDate } = require('../../lib/validator');

describe('isValidPrice', () => {
  it('should return false for not valid price', () => {
    const result = isValidPrice('no_valid_price');
    expect(result).to.eql(false);
  });

  it('should return false for not valid price pattern', () => {
    const result = isValidPrice('2,123,12');
    expect(result).to.eql(false);
  });

  it('should return true when it is a valid price', () => {
    const result = isValidPrice('2,123');
    expect(result).to.eql(true);
  });
});

describe('isValidFormatDate', () => {
  it('should return false for not valid date', () => {
    const result = isValidFormatDate('no_valid_date');
    expect(result).to.eql(false);
  });

  it('should return false for not valid date pattern', () => {
    const result = isValidFormatDate('12-12-1213321');
    expect(result).to.eql(false);
  });

  it('should return true when it is a valid date', () => {
    const result = isValidFormatDate('12-12-2020');
    expect(result).to.eql(true);
  });

  it('should return false when it is an invalid date', () => {
    const result = isValidFormatDate('20-20-2020');
    expect(result).to.eql(false);
  });
});
