
const DATE_PATTERN = /[0-9]{0,2}\.[0-9]{0,2}\.[0-9]{0,2}/;
const PRICE_PATTERN = /[0-9]{0,2},[0-9]{0,2}/;

const mapByPattern = pattern => ({ description }) => {
  const match = description.match(pattern);
  return match ? match[0] : '';
};

const isIncluded = pattern => ({ description }) => pattern.test(description);

const mapDate = mapByPattern(DATE_PATTERN);
const mapPrice = mapByPattern(PRICE_PATTERN);
const dateIsIncluded = isIncluded(DATE_PATTERN);
const priceIsIncluded = isIncluded(PRICE_PATTERN);

module.exports = {
  mapDate,
  mapPrice,
  dateIsIncluded,
  priceIsIncluded,
};
