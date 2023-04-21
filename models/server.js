const express = require("express");
const { createServer } = require("http")
const { socketsController } = require("../sockets/sockets.controller");

const cors = require("cors");
const fileUpload = require("express-fileupload");

const { dbConnection } = require("../database/config");

class Server {
	constructor() {
		this.app = express();
		this.port = process.env.PORT;
		this.server = createServer( this.app )
		this.io = require("socket.io")( this.server )

		// Routes paths
		this.paths = {
			auth: "/api/auth",
			categories: "/api/categories",
			products: "/api/products",
			user: "/api/user",
			search: "/api/search",
			uploads: "/api/uploads"
		};

		// Conectar a base de datos
		this.conectarDB();

		// Middlewares
		this.middlewares();

		// Rutas de mi aplicación
		this.routes();

		// Conección a Sockets
		this.sockets();

	}

	async conectarDB() {
		await dbConnection();
	}

	middlewares() {
		// CORS
		this.app.use(cors());

		// Lectura y parseo del body
		this.app.use(express.json());

		// Directorio público
		this.app.use(express.static("public"));

		// File uploads - Carga de archivos
		this.app.use(fileUpload({
			useTempFiles : true,
			tempFileDir : '/tmp/',
			createParentPath : true
		}));
	}

	routes() {
		this.app.use(this.paths.user, require("../routes/user.routes"));
		this.app.use(this.paths.categories, require("../routes/categories.routes"));
		this.app.use(this.paths.auth, require("../routes/auth.routes"));
		this.app.use(this.paths.products, require("../routes/products.routes"));
		this.app.use(this.paths.search, require("../routes/search.routes"));
		this.app.use(this.paths.uploads, require("../routes/uploads.routes"));
	}

	sockets() {
		this.io.on("connection", (socket) => socketsController(socket, this.io))
	}

	listen() {
		this.server.listen(this.port, () => {
			console.log("Servidor escuchando en el puerto", this.port);
		});
	}
}

module.exports = Server;
