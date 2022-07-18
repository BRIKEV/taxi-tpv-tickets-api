const {
  errorFactory,
  CustomErrorTypes,
} = require('error-handler-module');
const parse = require('date-fns/parse');

const {
  mapDate,
  mapPrice,
  dateIsIncluded,
  priceIsIncluded,
} = require('../../lib/imageOCR');
const token = require('../../lib/token');

const wrongInput = errorFactory(CustomErrorTypes.WRONG_INPUT);
const forbiddenError = errorFactory(CustomErrorTypes.FORBIDDEN);
const notFoundError = errorFactory(CustomErrorTypes.NOT_FOUND);

module.exports = () => {
  const start = async ({
    logger, filePDF, store, config, ocr,
  }) => {
    const jwt = token(config.tokenSecret);

    const isVerified = authorization => jwt.verifyToken(authorization);

    const updateTicket = pdfName => async ticket => {
      const dbTicket = await store.getTicket(ticket);
      const ticketExists = !!dbTicket;
      let query = {
        formattedDate: ticket.formattedDate,
        price: ticket.price,
      };
      query = ticketExists ? { ...query, pdfName: config.registerPdfName } : { ...query, hour: ticket.hour };
      await store.upsertTickets(query, {
        ...ticket,
        pdfName,
        validated: ticketExists,
        date: parse(ticket.formattedDate, 'dd-MM-yyyy', new Date()),
      });
    };

    const savePDFInfo = async (file, userId, type = 'ibercaja') => {
      if (!file) throw wrongInput('File is required');
      const wasRecorded = await store.alreadyRecorded(file.name);
      if (wasRecorded) throw wrongInput('This File was already recorded');
      const pdfParser = filePDF.pdfParser(type);
      logger.info(`Parsing ${file.name} of ${type} type`);
      const { data: tickets, name: parsedFileName } = await pdfParser(file.data);
      const fileName = `userdni_${parsedFileName}`;
      const ticketsPromises = tickets.map(updateTicket(fileName));
      await Promise.all(ticketsPromises);
      return tickets;
    };

    const getTickets = async () => {
      logger.info('Geting tickets');
      const tickets = await store.getTickets();
      return tickets;
    };

    const registerTicket = async (date, price) => {
      logger.info(`Registering ticket with date ${date} and price ${price}`);
      const dbTicket = await store.getTicket({ formattedDate: date, price });
      const ticketExists = !!dbTicket;
      if (ticketExists) {
        logger.info('Registering when exists');
        return store.registerTicket(date, price);
      }
      const query = {
        formattedDate: date,
        price,
        pdfName: config.registerPdfName,
        validated: false,
      };
      logger.info('Registering when it is new ticket');
      return store.upsertTickets(query, {
        ...query,
        date: parse(query.formattedDate, 'dd-MM-yyyy', new Date()),
        validated: false,
      });
    };

    const login = async (email, password) => {
      logger.info(`Requesting loging for user ${email}`);
      const user = await store.getUserByEmail(email);
      if (password !== user.password) {
        throw forbiddenError('User or password incorrect');
      }
      return {
        jwt: jwt.signToken({ id: user._id }),
        email: user.email,
      };
    };

    const deleteTicket = async id => {
      logger.info(`Requesting delete ticket with id ${id}`);
      const { value: ticket } = await store.deleteTicketById(id);
      if (!ticket) {
        throw notFoundError('Ticket not found');
      }
      return {
        id: ticket._id,
        formattedDate: ticket.formattedDate,
        pdfName: ticket.pdfName,
        price: ticket.price,
        validated: ticket.validated,
        date: ticket.date,
      };
    };

    const ocrImage = async file => {
      logger.info(`OCR file ${file.name}`);
      const texts = await ocr.textDetection(file.data);
      logger.info('Text detected');
      const [date] = texts.filter(dateIsIncluded).map(mapDate);
      const [price] = texts.filter(priceIsIncluded).map(mapPrice);
      logger.info(`Returning date ${date} and price ${price}`);
      const [day, month, year] = date.split('.');
      // we append 20 to the year
      // so this code won't work on 2100s
      const formattedDate = `${day}-${month}-20${year}`;
      return { date: formattedDate, price };
    };

    return {
      savePDFInfo,
      getTickets,
      registerTicket,
      login,
      isVerified,
      deleteTicket,
      ocrImage,
    };
  };

  return { start };
};
