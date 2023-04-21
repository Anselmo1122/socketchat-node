const productsRouter = require("express").Router();

const { check } = require("express-validator");

// ------ Controllers
const {
	createProduct,
	getProducts,
	getProduct,
	updateProduct,
	deleteProduct,
} = require("../controllers/products.controller");

// ------ Middlewares
const { validateFields, validateJWT, hasRole } = require("../middlewares");

// ------ Helpers
const { existProductById } = require("../helpers/dbValidators");

// ------ Endpoints

// Obtener todos los productos - Público
productsRouter.get("/", getProducts);

// Obtener un producto por ID - Público
productsRouter.get(
	"/:id",
	[
		check("id", "No es un id válido.").isMongoId(),
		check("id").custom(existProductById),
		validateFields,
	],
	getProduct
);

// Crear producto - Privado - Cualquier persona con un token válido
productsRouter.post(
	"/",
	[
		validateJWT,
		check("name", "El nombre es obligatorio").not().isEmpty(),
		// check("description", "La descripción es obligatoria").not().isEmpty,
		validateFields,
	],
	createProduct
);

// Actualizar producto - Privado - Cualquier persona con un token válido
// productsRouter.put("/:id");
productsRouter.put(
	"/:id",
	[
		validateJWT,
		check("id", "No es un id válido.").isMongoId(),
		check("id").custom(existProductById),
		check("name", "El nombre nuevo es obligatorio").not().isEmpty(),
		validateFields,
	],
	updateProduct
);

// Borrar una producto - Administrador
productsRouter.delete(
	"/:id",
	[
		validateJWT,
		hasRole("ADMIN_ROLE"),
		check("id", "No es un id válido.").isMongoId(),
		check("id").custom(existProductById),
		validateFields,
	],
	deleteProduct
);

module.exports = productsRouter;
