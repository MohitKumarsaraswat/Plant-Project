/**
 * @typedef {'en' | 'hi' | 'mr' | 'gu'} Language
 */

/**
 * @typedef {'mild' | 'moderate' | 'severe'} Severity
 */

/**
 * @typedef {Object} Translation
 * @property {string} home
 * @property {string} upload
 * @property {string} result
 * @property {string} shops
 * @property {string} history
 * @property {string} welcome
 * @property {string} welcomeMsg
 * @property {string} getStarted
 * @property {string} uploadTitle
 * @property {string} dragDrop
 * @property {string} analyze
 * @property {string} diagnosisTitle
 * @property {string} disease
 * @property {string} severity
 * @property {string} mild
 * @property {string} moderate
 * @property {string} severe
 * @property {string} scientific
 * @property {string} farmerFriendly
 * @property {string} shopsTitle
 * @property {string} getLocation
 * @property {string} distance
 * @property {string} directions
 * @property {string} historyTitle
 * @property {string} search
 * @property {string} date
 * @property {string} noHistory
 * @property {string} uploadFirst
 */

/**
 * @typedef {Object} DiagnosisData
 * @property {string} disease
 * @property {Severity} severity
 * @property {Object} scientific
 * @property {string} scientific.medicine
 * @property {string} scientific.dosage
 * @property {string} scientific.frequency
 * @property {string[]} farmerSteps
 * @property {string} image
 * @property {string} date
 */

/**
 * @typedef {Object} Shop
 * @property {number} [id]
 * @property {string} name
 * @property {string} address
 * @property {string} distance
 * @property {string} phone
 * @property {number} rating
 * @property {Object} [location]
 * @property {number} location.latitude
 * @property {number} location.longitude
 * @property {string[]} [services]
 * @property {string} [placeId]
 */

export const Languages = ['en', 'hi', 'mr', 'gu'];
export const Severities = ['mild', 'moderate', 'severe'];

