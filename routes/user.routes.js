const userRouter = require("express").Router();
const { check } = require("express-validator");

// ------ Controllers
const {
	userGet,
	userPost,
	userPut,
	userPatch,
	userDelete,
} = require("../controllers/user.controller");

// ------ Middlewares
const { validateFields, validateJWT, hasRole } = require("../middlewares");

// ------ Helpers
const {
	isRoleValid,
	existEmail,
	existUserById,
} = require("../helpers/dbValidators");

// ------ Endpoints
userRouter.get("/", userGet);

userRouter.post(
	"/",
	[
		check("name", "El nombre es obligatorio").not().isEmpty(),
		check("password", "El password debe tener más de 6 letras").isLength({
			min: 6,
		}),
		// check("email", "El correo no es válido").isEmail(),
		check("email", "El correo no es válido").custom(existEmail).isEmail(),
		// check('role', 'No es un rol válido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
		// Creamos una base de datos para los roles
		// Utilizamos un model de datos para registrar y validar el "role" del usuario
		check("role").custom(isRoleValid),
		validateFields,
	],
	userPost
);

userRouter.put(
	"/:id",
	[
		check("id", "No es un id válido.").isMongoId(),
		check("id").custom(existUserById),
		check("role").custom(isRoleValid),
		validateFields,
	],
	userPut
);

userRouter.patch("/", userPatch);

userRouter.delete(
	"/:id",
	[
		validateJWT,
		// validateRole,
		hasRole("ADMIN_ROLE"),
		check("id", "No es un id válido.").isMongoId(),
		check("id").custom(existUserById),
		validateFields,
	],
	userDelete
);

module.exports = userRouter;
