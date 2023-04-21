const { validationResult } = require("express-validator");

const validateFields = (req, res, next) => {
	// Información de validación de "express-validator"
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json(errors);
	}
	next();
};

module.exports = validateFields;
