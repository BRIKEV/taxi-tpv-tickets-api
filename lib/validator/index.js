const parse = require('date-fns/parse');
const isValid = require('date-fns/isValid');

const isValidPrice = price => {
  const pricePattern = /[0-9]+,[0-9]+/;
  if (price.match(pricePattern) === null) return false;
  const [match] = price.match(pricePattern);
  const { input } = price.match(pricePattern);
  if (match !== input) {
    return false;
  }
  return true;
};

const isValidFormatDate = date => {
  const datePattern = /([0-9]{2}-){2}[0-9]{4}$/;
  if (date.match(datePattern) === null) return false;
  const [match] = date.match(datePattern);
  const { input } = date.match(datePattern);
  if (match !== input) return false;
  const formattedDate = parse(match, 'dd-MM-yyyy', new Date());
  if (!isValid(formattedDate)) return false;
  return true;
};

module.exports = {
  isValidPrice,
  isValidFormatDate,
};
