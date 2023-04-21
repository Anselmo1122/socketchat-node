const jwt = require("jsonwebtoken");
const { UserModel } = require("../models");

// Función para generar token de sesión
const generateJWT = (uid = "") => {
	return new Promise((resolve, reject) => {
		jwt.sign(
			{ uid },
			process.env.PRIVATE_KEY,
			{
				expiresIn: "4h",
				algorithm: "HS256",
			},
			(err, token) => {
				if (err) reject(err);
				else resolve(token);
			}
		);
	});
};

module.exports = generateJWT;
