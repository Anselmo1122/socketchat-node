const { UserModel, ProductModel } = require("../models");

const validateElementCollection = async (req, res, next) => {
  const { collection, id } = req.params;

  let model;

  switch (collection) {
    case "user":
      model = await UserModel.findById(id);
      if (!model) {
        return res.status(400).json({
          message: `No existe un usuario con el id especificado`,
        })
      }
      break;
    case "products":
      model = await ProductModel.findById(id);
      if (!model) {
        return res.status(400).json({
          message: `No existe un producto con el id especificado`,
        })
      }
      break;
    default:
      return res.status(500).json({
        message: "Se te ha olvidado hacer esta validación..."
      })
  }

  req.model = model;

  next()

}

module.exports = validateElementCollection;