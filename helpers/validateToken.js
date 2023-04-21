const jwt = require("jsonwebtoken");
const { UserModel } = require("../models");

const validateToken = async (token) => {
	try {
		const { uid } = jwt.verify(token, process.env.PRIVATE_KEY);

		if (token.length < 10) return null;

		const user = await UserModel.findById(uid);

		if (!user && !user.state) return null

		return user;
	} catch (error) {
		return null;
	}
}

module.exports = validateToken;