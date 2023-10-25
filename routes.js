const express = require("express");
const route = express.Router();

const homeController = require("./src/controllers/homeController");
const loginController = require("./src/controllers/loginController");
const contatoController = require("./src/controllers/contatoController");
const cadastroController = require("./src/controllers/cadastroController");

const { loginRequired } = require("./src/middleware/middleware");

// Rotas da home
route.get("/", homeController.index);

// Rotas de login
route.get("/login/index", loginController.index);
route.post("/login/login", loginController.login);
route.get("/login/logout", loginController.logout);

// Rota de Cadastro
route.get("/cadastro/index", cadastroController.index);
route.post("/login/register", cadastroController.register);


// Rotas de contato
route.get("/contato/index", loginRequired, contatoController.index);
route.post("/contato/register", loginRequired, contatoController.register);
route.get("/contato/index/:id", loginRequired, contatoController.editIndex);
route.post("/contato/edit/:id", loginRequired, contatoController.edit);
route.get("/contato/delete/:id", loginRequired, contatoController.delete);

module.exports = route;
