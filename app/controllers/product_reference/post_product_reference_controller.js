'use strict'

const index = require('./get_product_reference_controller')
const adhocPaymentCtrl = require('../adhoc_payment')
const { setSessionVariable } = require('../../utils/cookie')
const { isNaxsiSafe } = require('../../browsered/field-validation-checks')

module.exports = (req, res) => {
  const product = req.product
  if (product.referenceNumber) {
    req.referenceNumber = product.referenceNumber
    return adhocPaymentCtrl.index(req, res)
  }

  const referenceNumber = req.body['payment-reference']
  if (!referenceNumber) {
    req.errorMessage = `<h2 class="govuk-heading-m govuk-!-margin-bottom-0">${res.locals.__p('fieldValidation.generic').replace('%s', product.reference_label)}</h2>`
    return index(req, res)
  }
  if (referenceNumber.trim().length > 255) {
    req.errorMessage = `<h2 class="govuk-heading-m govuk-!-margin-bottom-0">${res.locals.__p('fieldValidation.isGreaterThanMaxLengthChars')}</h2>`
    return index(req, res)
  }
  const invalidCharactersError = isNaxsiSafe(referenceNumber, res.locals.__p('fieldValidation.invalidCharacters'))
  if (invalidCharactersError) {
    req.errorMessage = `<h2 class="govuk-heading-m govuk-!-margin-bottom-0">${invalidCharactersError}</h2>`
    return index(req, res)
  }
  setSessionVariable(req, 'referenceNumber', referenceNumber)
  return adhocPaymentCtrl.index(req, res)
}
