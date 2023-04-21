const { Schema, model } = require("mongoose");

const productSchema = new Schema({
	name: {
		type: String,
		required: [true, "El nombre es obligatorio"],
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
	price: {
		type: Number,
		default: 0,
	},
	category: {
		type: Schema.Types.ObjectId,
		ref: "Category",
		required: true,
	},
	description: { type: String },
	img: { type: String },
	available: { type: Boolean, default: true },
});

// Podemos modificar los métodos de mongoose mediante "methods"
// en este caso.

productSchema.methods.toJSON = function () {
	const { __v, state, ...data } = this.toObject();
	return data;
};

const ProductModel = model("Product", productSchema);

module.exports = ProductModel;
