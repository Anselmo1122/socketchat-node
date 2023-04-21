const { request, response } = require("express");
const { uploadFile } = require("../helpers");

const path = require("path");
const fs = require("fs");
const cloudinary = require('cloudinary').v2;

// Cloudinary configuration
cloudinary.config({
  cloud_name: "dcpokakgh",
  api_key: "561448218362281",
  api_secret: "RQ839hIPQYdOCzSoPDNcg7TD8lQ",
});

const uploadsFiles = async (req = request, res = response) => {

  try {
    // const file = await uploadFile(req.files);
    // const file = await uploadFile(req.files, ["txt", "md", "pdf"], "documents");
    const file = await uploadFile(req.files, undefined, "images");
    res.json({ file })
  } catch (message) {
    res.status(400).json({ message })
  }

}

const updateImages = async (req = request, res = response) => {

  let model = req.model;

  // Eliminar imágenes previas
  if (model.img) {
    const pathImage = path.join(__dirname, "../uploads/", req.params.collection, model.img);
    if ( fs.existsSync(pathImage) ) fs.unlinkSync(pathImage);
  }

  const file = await uploadFile(req.files, undefined, req.params.collection);

  model.img = file;
  model.save();

  res.json( model );

}


const updateImagesCloudinary = async (req = request, res = response) => {

  let model = req.model;

  // Eliminar imágenes previas
  if (model.img) {
    const nombreArr = model.img.split("/");
    const nombre = nombreArr[nombreArr - 1];
    const [ public_id ] = nombre.split(".");
    cloudinary.uploader.destroy( public_id );
  }

  const { tempFilePath } = req.files.file;
  const { secure_url } = await cloudinary.uploader.upload( tempFilePath, { useTempFile: true } )

  model.img = secure_url;

  await model.save();

  res.json( model );

}


const obtainImage = async (req = request, res = response) => {

  let model = req.model;

  // Eliminar imágenes previas
  if (model.img) {
    const pathImage = path.join(__dirname, "../uploads/", req.params.collection, model.img);
    if ( fs.existsSync(pathImage) ) {
      return res.sendFile(pathImage);
    };
  }

  const pathNoImage = path.join(__dirname, "../assets/no-image.png");
  return res.status(404).sendFile(pathNoImage);

}


module.exports = {
  uploadsFiles,
  updateImages,
  updateImagesCloudinary,
  obtainImage
}