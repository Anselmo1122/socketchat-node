const { request, response } = require("express");

const bcrypt = require("bcryptjs");

const UserModel = require("../models/user.model");
const generateJWT = require("../helpers/generateJWT");
const facebookVerify = require("../helpers/facebookVerify");

const authPost = async (req = request, res = response) => {
	const { email, password } = req.body;
	const user = await UserModel.findOne({ email });

	try {
		// Verificar la contraseña.
		const isValidPassword = bcrypt.compareSync(password, user.password);
		if (!isValidPassword)
			return res.status(400).json({
				message: "La contraseña es incorrecta",
			});

		// Generar JWT.
		const token = await generateJWT(user.id);

		res.json({
			msg: "Login ok",
			user,
			token,
		});
	} catch (error) {
		console.log(error);
		res.json({
			message: "Ha ocurrido un error, comuníquese con el administrador",
		});
	}
};

const authFacebook = async (req, res) => {
	const { fb_token } = req.body;

	try {
		const { name, email, picture } = await facebookVerify(fb_token);

		let user = await UserModel.findOne({ email });

		if (!user) {
			// Si no existe lo creamos.
			const data = {
				name,
				email,
				img: picture.data.url,
				password: ":P",
				facebook: true,
			};

			user = new UserModel(data);
			await user.save();
		}

		if (!user.state) {
			return res.status(401).json({
				message: "Hable con el administrador, usuario bloqueado.",
			});
		}

		// Generar JWT.
		const token = await generateJWT(user.id);

		return res.status(200).json({
			user,
			token,
		});
	} catch (error) {
		return res.status(400).json({
			message: "Token no verificado",
			error,
		});
	}
};

const authValidToken = async (req = request, res = response) => {

	const user = req.user;

	// Generar JWT.
	const token = await generateJWT(user.id);

	res.json({
		user,
		token
	})

}

module.exports = {
	authPost,
	authFacebook,
	authValidToken
};
