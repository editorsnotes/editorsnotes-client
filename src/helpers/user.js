"use strict";

var validator = require('validator')
  , not = require('../utils/not')

const userValidation = [
  [
    {
      field: 'username',
      passFn: not(validator.isNull),
      message: 'username is required'
    },
    {
      field: 'username',
      passFn: validator.isAscii,
      message: 'username must be ascii'
    }
  ],
  [
    {
      field: 'email',
      passFn: validator.isEmail,
      message: 'email must be valid'
    }
  ],
  [
    {
      field: 'password',
      passFn: field => validator.isLength(field, 8),
      message: 'password must be at least 8 characters'
    }
  ],
  [
    {
      field: 'confirm',
      passFn: (field, record) => validator.equals(field, record.password),
      message: 'passwords do not match'
    }
  ]
]

function validateUser(user) {
  var { validate } = require('../utils/validate');
  return validate(user, userValidation);
}

module.exports = { validateUser }
