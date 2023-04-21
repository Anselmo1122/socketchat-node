const searchRouter = require("express").Router();

// ------ Controllers
const { search } = require("../controllers/search.controller");

searchRouter.get("/:collection/:term", search);

module.exports = searchRouter;