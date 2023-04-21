const uploadsRouter = require("express").Router();

// ------ Controllers
const {
	uploadsFiles,
	updateImages,
	obtainImage,
	updateImagesCloudinary,
} = require("../controllers/uploads.controller.js");

// ------ Validators
const { check } = require("express-validator");

// ------ Middlewares
const { validateFields, validateFiles, validateElementCollection } = require("../middlewares");

// ------ Helpers
const { isCollectionValid } = require("../helpers");

uploadsRouter.post("/", validateFiles, uploadsFiles);

uploadsRouter.put(
	"/:collection/:id",
	[
		validateFiles,
		check("id", "No es un id de mongo válido").isMongoId(),
		check("collection").custom((c) => isCollectionValid(c, ["user", "products"])),
		validateElementCollection,
		validateFields,
	],
	// updateImagesCloudinary
	updateImages
);

uploadsRouter.get(
	"/:collection/:id",
	[
		check("id", "No es un id de mongo válido").isMongoId(),
		check("collection").custom((c) => isCollectionValid(c, ["user", "products"])),
		validateElementCollection,
		validateFields,
	],
	obtainImage
);

module.exports = uploadsRouter;
