const { request, response } = require("express");

const ProductModel = require("../models/product.model");
const CategoryModel = require("../models/category.model");

// Obtener productos - paginado - total - populate {}
const getProducts = async (req = request, res = response) => {
  const { limit = 3, skip = 0 } = req.query;
	const query = { state: true };

	const [products, total] = await Promise.all([
		ProductModel
			.find(query)
			.skip(Number(skip))
			.limit(Number(limit))
			.populate('user', 'name')
      .populate('category', 'name'),
		ProductModel.countDocuments(query),
	]);

	return res.json({
		total,
		products
	});
}

// Obtener producto - populate {}
const getProduct = async (req = request, res = response) => {
  const { id } = req.params;

	const product = await ProductModel.findById(id)
    .populate("user", "name")
    .populate("category","name");

	res.json({
		product
	})
}

// Crear producto
const createProduct = async (req = request, res = response) => {
  const {name, price, category, description} = req.body

  const categoryAssigned = await CategoryModel.findOne({ name: category.toUpperCase() });

	if(!categoryAssigned) {
		return res.status(400).json({
			message: `La categoría ${category} no existe`,
		})
	}

  const productDB = await ProductModel.findOne({ name });

	if (productDB) {
		return res.status(400).json({
			message: `El producto ${productDB.name} ya existe`,
		});
	}

  const data = {
    name,
    state: true,
    user: req.user._id,
    price,
    category: categoryAssigned._id,
    description,
  }

  const product = new ProductModel(data)

  await product.save()

  return res.json({
    message: "Producto creado correctamente",
    product,
  })
};

// Actualizar producto
// const updateProduct = async (req = request, res = response) => {}
const updateProduct = async (req = request, res = response) => {
	const { name, price, category, description } = req.body;
	const { id } = req.params;

	// const productDB = await ProductModel.findOne({ name });

	// if (productDB) {
	// 	return res.status(400).json({
	// 		message: `El producto ${productDB.name} ya existe`,
	// 	});
	// }

  const oldProduct = await ProductModel.findById(id);

	const product = await ProductModel.findByIdAndUpdate(id, {
		name,
    price: price || oldProduct.price,
    category: category || oldProduct.category,
    description: description || oldProduct.description,
    user: req.user._id
	})

	return res.json({
    product
	})

}

// Borrar producto - estado: false
const deleteProduct = async (req = request, res = response) => {
  const { id } = req.params;

	// Producto eliminado cambiando su "state" a "false"
	const product = await ProductModel.findByIdAndUpdate(id, { state: false });

	const userAuthorized = req.user;

	res.json({
		product,
		userAuthorized,
	});
}

module.exports = {
  getProducts,
  getProduct,
	createProduct,
  updateProduct,
  deleteProduct
};
