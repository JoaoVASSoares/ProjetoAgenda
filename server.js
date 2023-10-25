// Ciando o servidor express (API)
// Importando o express
const express = require("express");
// Importando o express
const app = express();
// Ocutando dados de conexão com o BD e outras variáveis de ambiente 
require("dotenv").config();
//Importando o mongoose que fará conexão com o banco e modelerá
const mongoose = require("mongoose");
// Armazenando link de conxãop pelo dotenv('.env' no '/') do projeto
// Conectar com o bd, emitando um sinal quando o bd estiver conexado(resolve) ou algum erro de conexão
mongoose
  .connect(process.env.CONNECTIONSTRING)
  .then(() => {
    app.emit("Pronto");
  })
  .catch((e) => console.log(e));

// Chmando session e a salvando
const session = require("express-session");
// Chamando o connect-mongo com a ssesion criada acima
const MongoStore = require("connect-mongo");
//
const flash = require("connect-flash");
const routes = require("./routes");
const path = require("path");
// const helmet = require("helmet");
const crsf = require("csurf");
const {
  middlewareGlobal,
  checkCSRFErro,
  crsfMiddleware,
} = require("./src/middleware/middleware");

// app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.resolve(__dirname, "public")));

const sessionOptions = session({
  secret: "Segredo (pode ser qualquer coisa)",
  // store: new MongoStore({ mongooseConnction: mongoose.connection }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
  },
  store: MongoStore.create({ mongoUrl: process.env.CONNECTIONSTRING }),
});

app.use(sessionOptions);
app.use(flash());

app.set("views", path.resolve(__dirname, "src", "views"));
app.set("view engine", "ejs");

app.use(crsf());
// Nossos proprios middleware
app.use(middlewareGlobal);
app.use(checkCSRFErro);
app.use(crsfMiddleware);
app.use(routes);

app.on("Pronto", () => {
  app.listen(3000, () => {
    console.log("Acessar http://localhost:3000");
    console.log("Servidor executado na porta 3000");
  });
});
