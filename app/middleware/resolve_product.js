'use strict'

// NPM dependencies
const logger = require('winston')

// Custom dependencies
const {renderErrorView} = require('../utils/response')
const {getProduct} = require('../services/product_service')

module.exports = function (req, res, next) {
  const externalProductId = req.params.externalProductId
  const correlationId = req.correlationId
  getProduct(externalProductId, correlationId)
    .then(product => {
      req.product = product
      next()
    })
    .catch(err => {
      logger.warn(`Attempted to create a payment for non-existent product id ${externalProductId}, err = ${err}`)
      renderErrorView(req, res, 'Sorry, we are unable to process your request', 404)
    })
}
