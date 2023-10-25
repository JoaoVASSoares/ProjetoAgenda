// PARA BROWSERS ANTIGOS -> importando o core e o regenarator para aplicações que precisam rodar em navegadores antigos
import "regenerator-runtime/runtime";
import "core-js/stable";

// Validando o front
// Login de usuários -> Validando formulário de login
import Login from "./modules/Login";
const login = new Login(".form-login");
login.init();

// Cadastro de usuários -> Validando formulário de cadastro
// O login também valida o cadastro
const cadastro = new Login(".form-cadastro");
cadastro.init();

// Cadastro de contato -> Validando formulário de contato
import Contato from "./modules/Contato";
const contato = new Contato(".contato");
contato.init();

// import "./assets/css/style.css";
