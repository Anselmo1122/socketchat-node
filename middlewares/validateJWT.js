const jwt = require("jsonwebtoken");
const { request, response } = require("express");

const UserModel = require("../models/user.model");

const validateJWT = async (req = request, res = response, next) => {
	const token = req.header("authorization");

	if (!token) {
		return res.status(401).json({
			message: "No hay token en la petición",
		});
	}

	try {
		const { uid } = jwt.verify(token, process.env.PRIVATE_KEY);

		const user = await UserModel.findById(uid);

		if (!user.state) {
			return res.status(401).json({
				message: "Token no válido: el usuario tiene un estado en false.",
			});
		}

		req.user = user;

		next();
	} catch (error) {
		return res.status(401).json({
			message: "Token no válido",
		});
	}
};

module.exports = {
	validateJWT,
};
