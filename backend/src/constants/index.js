const { HTTP_STATUS, HTTP_STATUS_TEXT } = require("./http/httpStatus");
const AUTH = require("./messages/auth/auth.message");
const USER = require("./messages/user/user.message");
const ERROR = require("./messages/error/error.message");

const MESSAGES = {
  AUTH,
  USER,
  ERROR,
};

module.exports = {
  HTTP_STATUS,
  HTTP_STATUS_TEXT,
  MESSAGES,
};
