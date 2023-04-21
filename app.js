// ----- Inicialmente creamos nuestro servidor de esta forma.

// const express = require("express");
// require("dotenv").config();

// const app = express();
// const port = process.env.PORT;

// app.get("/", (req, res) => {
//     res.send("Hola Mundo");
// });

// app.listen(port, () => {
//     console.log("Servidor desplegado en el puerto", port);
// });

// ----- Ahora lo crearemos basado en clases.

require("dotenv").config();

const Server = require("./models/server");

const server = new Server();

server.listen();
