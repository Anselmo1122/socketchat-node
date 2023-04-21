const { Schema, model } = require("mongoose");

const roleSchema = new Schema({
	role: {
		type: String,
		required: [true, "El rol es obligatorio"],
	},
});

const RoleModel = model("Role", roleSchema);

module.exports = RoleModel;
