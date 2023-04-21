const path = require("path");
const { v4: uuidv4 } = require("uuid");

const uploadFile = (files, validExtensions = ['png', 'jpg', 'jpeg', 'gif'], folder = "") => {
  return new Promise((resolve, reject) => {
    // The name of the uploaded file
    const { file } = files;

    const clippedName = file.name.split(".");
    const extension = clippedName[ clippedName.length - 1 ];

    // Validar extensión del archivo.
    if ( !validExtensions.includes(extension) ) {
      return reject(`Extensión '${extension}' no permitida, esta debe ser: ${validExtensions}`)
    }

    // Establecer un nombre al archivo.
    const nameTemp = uuidv4() + "." + extension;
    const uploadPath = path.join(__dirname, "../uploads/", folder, nameTemp)

    // Use the mv() method to place the file somewhere on your server
    file.mv(uploadPath, (err) => {
      if (err) reject(err);
      resolve(nameTemp);
    });
  })
}

module.exports = {
  uploadFile,
}