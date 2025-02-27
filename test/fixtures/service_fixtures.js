'use strict'

// Local dependencies
const pactBase = require('./pact_base')
const random = require('../unit/utils/random')

// Global setup
const pactServices = pactBase({ array: ['service_ids'] })

module.exports = {
  validServiceResponse: (serviceData = {}) => {
    const defaultCustomBranding = { cssUrl: 'css url', imageUrl: 'image url' }

    const data = {
      external_id: serviceData.external_id || random.randomUuid(),
      service_name: serviceData.service_name || { en: 'Super GOV service' },
      name: serviceData.name || 'Super Duper service',
      gateway_account_ids: serviceData.gateway_account_ids || [random.randomInt(1, 9999999)],
      custom_branding: serviceData.custom_branding || defaultCustomBranding
    }

    return {
      getPactified: () => {
        return pactServices.pactify(data)
      },
      getPlain: () => {
        return data
      }
    }
  }
}
