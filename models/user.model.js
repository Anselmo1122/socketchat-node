const { Schema, model } = require("mongoose");

const userSchema = new Schema({
	name: {
		type: String,
		required: [true, "El nombre es obligatorio"],
	},
	email: {
		type: String,
		required: [true, "El correo es obligatorio"],
		unique: true,
	},
	password: {
		type: String,
		required: [true, "La contraseña es obligatoria"],
	},
	img: {
		type: String,
	},
	role: {
		type: String,
		default: "USER_ROLE",
		required: true,
	},
	state: {
		type: Boolean,
		default: true,
	},
	facebook: {
		type: Boolean,
		default: false,
	},
});

// Podemos modificar los métodos de mongoose mediante "methods"
// en este caso.

userSchema.methods.toJSON = function () {
	const { __v, _id, password, ...user } = this.toObject();
	user.uid = _id;
	return user;
};

const UserModel = model("User", userSchema);

module.exports = UserModel;
