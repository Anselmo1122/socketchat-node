const validateFields = require("./validateFields");
const validateFiles = require("./validateFiles");
const validateJWT = require("./validateJWT");
const validateRole = require("./validateRole");
const validateElementCollection = require("./validateElementCollection");

module.exports = {
	validateFields,
	validateFiles,
	...validateJWT,
	...validateRole,
	validateElementCollection,
};
