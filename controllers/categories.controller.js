const { request, response } = require("express");

const CategoryModel = require("../models/category.model");

// obtener categorías - paginado - total - populate {}
const getCategories = async (req = request, res = response) => {
	const { limit = 3, skip = 0 } = req.query;
	const query = { state: true };

	const [categories, total] = await Promise.all([
		CategoryModel
			.find(query)
			.skip(Number(skip))
			.limit(Number(limit))
			.populate('user', 'name'),
		CategoryModel.countDocuments(query),
	]);

	return res.json({
		total,
		categories
	});
}

// obtener categoría - populate {}
const getCategory = async (req = request, res = response) => {
	const { id } = req.params;

	const category = await CategoryModel.findById(id).populate("user", "name");

	res.json({
		category
	})
}

// Crear categoría
const createCategory = async (req = request, res = response) => {
	const name = req.body.name.toUpperCase();

	const categoryDB = await CategoryModel.findOne({ name });

	if (categoryDB) {
		return res.status(400).json({
			message: `La categoría ${categoryDB.name} ya existe`,
		});
	}

	// Generar la data a guardar.
	const data = {
		name,
		user: req.user._id,
	};

	const category = new CategoryModel(data);

	// Guardar en DB.
	await category.save();

	res.status(201).json({
		message: "Categoría creada",
		category,
	});
};

// actualizar categoría
const updateCategory = async (req = request, res = response) => {
	const { newName } = req.body;
	const { id } = req.params;

	const categoryDB = await CategoryModel.findOne({ name: newName.toUpperCase() });

	if (categoryDB) {
		return res.status(400).json({
			message: `La categoría ${categoryDB.name} ya existe`,
		});
	}

	const category = await CategoryModel.findByIdAndUpdate(id, {
		name: newName.toUpperCase()
	})

	return res.json({
		category
	})

}

// borrar categoría - estado: false
const deleteCategory = async (req = request, res = response) => {
	const { id } = req.params;

	// Categoría eliminada cambiando su "state" a "false"
	const category = await CategoryModel.findByIdAndUpdate(id, { state: false });

	const userAuthorized = req.user;

	res.json({
		category,
		userAuthorized,
	});
}

module.exports = {
	getCategories,
	getCategory,
	createCategory,
	updateCategory,
	deleteCategory,
};
