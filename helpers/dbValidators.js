const RoleModel = require("../models/role.model");
const UserModel = require("../models/user.model");
const CategoryModel = require("../models/category.model");
const ProductModel = require("../models/product.model");

const isRoleValid = async (role = "") => {
	const existRole = await RoleModel.findOne({ role });
	if (!existRole) throw new Error(`El role ${role} no está registrado en la base de datos`);
};

const existEmail = async (email = "") => {
	const emailExist = await UserModel.findOne({ email });
	if (emailExist) throw new Error(`El email ${email} ya está registrado`);
};
const existEmailLogin = async (email = "") => {
	const emailExist = await UserModel.findOne({ email });
	if (!emailExist) throw new Error(`El email ${email} no está registrado`);
};

const isUserActive = async (email) => {
	const isActive = await UserModel.findOne({ email, state: true });
	if (!isActive) throw new Error(`El usuario está inactivo.`);
};

const existUserById = async (id) => {
	const existUser = await UserModel.findById(id);
	if (!existUser) throw new Error(`El usuario con el id ${id} no existe`);
};

const existCategoryById = async (id) => {
	const existCategory = await CategoryModel.findById(id);
	if (!existCategory) throw new Error(`La categoría con el id ${id} no existe`);
};

const existProductById = async (id) => {
	const existProduct = await ProductModel.findById(id);
	if (!existProduct) throw new Error(`El producto con el id ${id} no existe`);
};

const isCollectionValid = (collection = "", validCollections = []) => {
	const includes = validCollections.includes(collection);
	if ( !includes ) throw new Error(`Colección no permitida, esta debe ser: ${validCollections}`);
	return true;
}

module.exports = {
	isRoleValid,
	existEmail,
	existEmailLogin,
	isUserActive,
	existUserById,
	existCategoryById,
	existProductById,
	isCollectionValid
};
