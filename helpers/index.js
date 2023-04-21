
const dbValidators = require("./dbValidators");
const generateJWT = require("./generateJWT");
const facebookVerify = require("./facebookVerify");
const uploadFile = require("./uploadFile");

module.exports = {
  ...dbValidators,
  generateJWT,
  facebookVerify,
  ...uploadFile
}