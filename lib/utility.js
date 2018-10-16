'use strict'

function isFunction(value) {
  return typeof value === 'function'
}

function isInteger(value) {
 return Number.isSafeInteger(value)
}

function isStrictPositiveInteger(value) {
  return isInteger(value) && value > 0
}

module.exports = {
  isFunction,
  isInteger,
  isStrictPositiveInteger
}
