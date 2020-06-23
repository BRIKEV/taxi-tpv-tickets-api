/**
 * @typedef {object} Tickets
 * @property {string} formattedDate.required
 * @property {string} hour.required
 * @property {string} price.required
 * @property {boolean} validated
 */

/**
 * @typedef {object} File
 * @property {string} file.required - pdf file upload - binary
 */

/**
 * @typedef {object} TicketsResponse
 * @property {string} id.required
 * @property {string} formattedDate.required
 * @property {object} date.required
 * @property {string} hour
 * @property {string} price.required
 * @property {string} pdfName.required
 * @property {boolean} validated
 */

/**
 * @typedef {object} SuccessPDFResponse
 * @property {boolean} success.required
 * @property {array<Tickets>} processedInfo.required
 */

/**
 * @typedef {object} SuccessTicketRegistered
 * @property {boolean} success.required
 */

/**
 * @typedef {object} RegisterTicketRequest
 * @property {string} date.required
 * @property {string} price.required
 */

/**
 * @typedef {object} LoginRequest
 * @property {string} email.required
 * @property {string} password.required
 */

/**
 * @typedef {object} LoginResponse
 * @property {string} jwt.required
 * @property {string} email.required
 */

/**
 * @typedef {object} Error
 * @property {number} statusCode -  <span style="color: gray;font-style: italic">404</span>
 * @property {string} error -  <span style="color: gray;font-style: italic">example: Error description message</span>
 */
