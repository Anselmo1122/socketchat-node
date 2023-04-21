const { request, response } = require("express")
const { isValidObjectId } = require("mongoose");

// ------ Models
const UserModel = require("../models/user.model");
const ProductModel = require("../models/product.model");
const CategoryModel = require("../models/category.model");

const collectionsAllowed = [
  "users",
  "products",
  "categories",
]

// ------ Búsqueda en colección de usuarios
const searchUsersCollection = async (term = "", res = response) => {
  const isMongoId = isValidObjectId(term); // boolean

  if (isMongoId) {
    const user = await UserModel.findById(term);

    return res.json({
      results: (user) ? [ user ] : [],
    })
  }

  const regex = new RegExp(term, "i");

  const users = await UserModel.find({ 
    $or: [{name: regex}, {email: regex}],
    $and: [{ state: true }]
  });

  return res.json({
    results: users,
  })
}

// ----- Búsqueda en colección de productos
const searchProductsCollection = async (term = "", res = response) => {
  const isMongoId = isValidObjectId(term); // boolean

  if (isMongoId) {
    const product = await ProductModel.findById(term).populate("category", "name");

    return res.json({
      results: (product) ? [ product ] : [],
    })
  }

  const regex = new RegExp(term, "i");

  const products = await ProductModel.find({name: regex, state: true}).populate("category", "name");

  return res.json({
    results: products,
  })
}

// ----- Búsqueda en colección de categorías
const searchCategoriesCollection = async (term = "", res = response) => {
  const isMongoId = isValidObjectId(term); // boolean

  if (isMongoId) {
    const category = await CategoryModel.findById(term).populate("user", "name");

    const products = await ProductModel.find({ category: term });

    const categorySearched = { category, products }

    return res.json({
      results: (category) ? [ categorySearched ] : [],
    })
  }

  const regex = new RegExp(term, "i");

  const categories = await CategoryModel.find({name: regex, state: true}).populate("user", "name");

  return res.json({
    results: categories,
  })
}

// ------ Controller
const search = async (req = request, res = response) => {

  const { collection, term } = req.params

  if ( !collectionsAllowed.includes( collection ) ) {
    return res.status(400).json({
      message: `Colección no permitida, esta debe ser alguna de las siguientes: ${collectionsAllowed}`,
    })
  }

  switch (collection) {
    case "users":
      return searchUsersCollection(term, res);
    case "products":
      return searchProductsCollection(term, res);
    case "categories":
      return searchCategoriesCollection(term, res);
    default:
      res.status(500).json({
        message: "Se te ha olvidado agregar la búsqueda a esta colección"
      })
      break;
  }

  res.json({
    collection,
    term
  })
}

module.exports = {
  search,
}