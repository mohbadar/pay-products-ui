'use strict'
// NPM dependencies
const lodash = require('lodash')
const logger = require('winston')

// Custom dependencies
const response = require('../utils/response')
const { renderErrorView } = response

// Local dependencies
const { demoPayment, pay } = require('../paths')
const paymentStatus = require('./payment_status_controller')

// Constants
const errorMessagePath = 'error.internal' // This is the object notation to string in en.json

module.exports = (req, res) => {
  const payment = req.payment
  const product = req.product
  const correlationId = req.correlationId
  logger.info(`[${correlationId}] routing payment complete based on product type ${product.type}`)
  switch (product.type) {
    case ('DEMO'):
      res.redirect(lodash.get(payment, 'govukStatus', '').toLowerCase() === 'success' ? demoPayment.success : demoPayment.failure)
      break
    case ('PROTOTYPE'):
      res.redirect(product.returnUrl)
      break
    case ('ADHOC'):
      lodash.get(payment, 'govukStatus', '').toLowerCase() === 'success' ? paymentStatus(req, res) : res.redirect(pay.product.replace(':productExternalId', product.externalId))
      break
    default:
      logger.error(`[${correlationId}] error routing payment complete based on product type ${product.type}`)
      return renderErrorView(req, res, errorMessagePath, 500)
  }
}
