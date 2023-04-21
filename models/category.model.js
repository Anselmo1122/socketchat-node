const { Schema, model } = require("mongoose");

const categorySchema = new Schema({
	name: {
		type: String,
		required: [true, "El nombre es obligatorio"],
		unique: true,
	},
	state: {
		type: Boolean,
		default: true,
		required: true,
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
});

categorySchema.methods.toJSON = function () {
	const { __v, ...category } = this.toObject();
	return category;
};

const CategoryModel = model("Category", categorySchema);

module.exports = CategoryModel;
