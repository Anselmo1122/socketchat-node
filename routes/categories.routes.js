const categoriesRouter = require("express").Router();

const { check } = require("express-validator");

// ------ Controllers
const {
	createCategory,
	getCategories,
	getCategory,
	updateCategory,
	deleteCategory,
} = require("../controllers/categories.controller");

// ------ Middlewares
const { validateFields, validateJWT, hasRole } = require("../middlewares");

// ------ Helpers
const { existCategoryById } = require("../helpers/dbValidators");

// ------ Endpoints

// Obtener todas las categorías - Público
categoriesRouter.get("/", getCategories);

// Obtener una categoría por ID - Público
categoriesRouter.get(
	"/:id",
	[
		check("id", "No es un id válido.").isMongoId(),
		check("id").custom(existCategoryById), 
		validateFields,
	],
	getCategory
);

// Crear categoría - Privado - Cualquier persona con un token válido
categoriesRouter.post(
	"/",
	[
		validateJWT,
		check("name", "El nombre es obligatorio").not().isEmpty(),
		validateFields,
	],
	createCategory
);

// Actualizar categoría - Privado - Cualquier persona con un token válido
categoriesRouter.put(
	"/:id", 
	[
		validateJWT,
		check("id", "No es un id válido.").isMongoId(),
		check("id").custom(existCategoryById), 
		check("newName", "El nombre nuevo es obligatorio").not().isEmpty(),
		validateFields,
	],
	updateCategory
);

// Borrar una categoría - Administrador
categoriesRouter.delete(
	"/:id", 
	[
		validateJWT,
		hasRole("ADMIN_ROLE"),
		check("id", "No es un id válido.").isMongoId(),
		check("id").custom(existCategoryById),
		validateFields
	],
	deleteCategory
);

module.exports = categoriesRouter;
