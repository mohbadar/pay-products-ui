'use strict'

// Node.js core dependencies
const logger = require('winston')
const currencyFormatter = require('currency-formatter')

// Custom dependencies
const { response } = require('../../utils/response')
const productReferenceCtrl = require('../product_reference')
const { getSessionVariable } = require('../../utils/cookie')

function asGBP (amountInPence) {
  return currencyFormatter.format((amountInPence / 100).toFixed(2), { code: 'GBP' })
}

module.exports = (req, res) => {
  const product = req.product
  const correlationId = req.correlationId
  const data = {
    productExternalId: product.externalId,
    productName: product.name,
    productDescription: product.description,
    productReferenceEnabled: product.reference_enabled
  }
  if (product.reference_enabled) {
    const sessionReferenceNumber = getSessionVariable(req, 'referenceNumber')
    if (!sessionReferenceNumber) {
      return productReferenceCtrl.index(req, res)
    }
  }

  if (product.price) {
    data.price = asGBP(product.price)
  }
  if (req.errorMessage) {
    data.flash = {
      genericError: req.errorMessage
    }
  }

  logger.info(`[${correlationId}] initiating product payment for ${product.externalId}`)
  response(req, res, 'adhoc-payment/index', data)
}
