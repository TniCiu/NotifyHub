const AUTH = require("./auth.message");
const USER = require("./user.message");
const ERROR = require("./error.message");

const MESSAGES = {
  AUTH,
  USER,
  ERROR,
};

module.exports = {
  MESSAGES,
  AUTH_MESSAGES: AUTH,
  USER_MESSAGES: USER,
  ERROR_MESSAGES: ERROR,
};
