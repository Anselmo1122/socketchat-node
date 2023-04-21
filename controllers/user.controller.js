const { request, response } = require("express");

const bcrypt = require("bcryptjs");
const UserModel = require("../models/user.model");

const userGet = async (req = request, res = response) => {
	const { limit = 5, skip = 0 } = req.query;
	const query = { state: true };

	// const users = await UserModel.find(query)
	// 	.skip(Number(skip))
	// 	.limit(Number(limit))

	// const total = await UserModel.countDocuments(query);

	// "Promise.all([])" ejecuta las promesas de forma simultánea

	const [users, total] = await Promise.all([
		UserModel.find(query).skip(Number(skip)).limit(Number(limit)),
		UserModel.countDocuments(query),
	]);

	res.json({
		total,
		users,
	});
};

const userPost = async (req = request, res = response) => {
	const { name, email, password, role } = req.body;
	const user = new UserModel({ name, email, password, role });

	// Encriptar la contraseña
	const salt = bcrypt.genSaltSync();
	user.password = bcrypt.hashSync(password, salt);

	// Guardar en BD
	await user.save();

	res.json({
		message: `The user ${name} created.`,
		user,
	});
};

const userPut = async (req = request, res = response) => {
	const { id } = req.params;
	const { password, email, ...rest } = req.body;

	if (password) {
		const salt = bcrypt.genSaltSync();
		rest.password = bcrypt.hashSync(password, salt);
	}

	const user = await UserModel.findByIdAndUpdate(id, rest);

	res.json({
		message: "PUT API - Controller",
		user,
	});
};

const userPatch = (req, res = response) => {
	res.json({
		message: "PATCH API - Controller",
	});
};

const userDelete = async (req, res = response) => {
	const { id } = req.params;

	// Usuario eliminado cambiando su "state" a "false"
	const user = await UserModel.findByIdAndUpdate(id, { state: false });

	// Usuario eliminado de de forma permanente
	const userAuthorized = req.user;

	res.json({
		message: "DELETE API - Controller",
		user,
		userAuthorized,
	});
};

module.exports = {
	userGet,
	userPost,
	userPut,
	userPatch,
	userDelete,
};
