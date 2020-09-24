const ibercajaTickets = require('./ibercajaTickets');

const types = {
  ibercaja: ibercajaTickets,
};

module.exports = type => types[type];
