/**
 * @typedef Tickets
 * @property {string} formattedDate.required
 * @property {string} hour.required
 * @property {string} price.required
 * @property {boolean} validated
 */

/**
 * @typedef TicketsResponse
 * @property {string} formattedDate.required
 * @property {string} date.required
 * @property {string} hour.required
 * @property {string} price.required
 * @property {boolean} validated
 */

/**
 * @typedef SuccessPDFResponse
 * @property {boolean} success.required
 * @property {Array.<Tickets>} processedInfo.required
 */

/**
 * @typedef SuccessTicketRegistered
 * @property {boolean} success.required
 */

/**
 * @typedef RegisterTicketRequest
 * @property {string} date.required
 * @property {string} price.required
 */

/**
 * @typedef Error
 * @property {number} statusCode -  <span style="color: gray;font-style: italic">404</span>
 * @property {string} error -  <span style="color: gray;font-style: italic">example: Error description message</span>
 */
