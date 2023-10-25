// Contoller seta Model (bd) e Views
// Iportando o modelContato
const Contato = require("../models/ContatoModel");

exports.index = async (req, res) => {
  if (req.session.user) {
    // Ira buscar apnas os contatos que foram criado pelo email de login
    const contatos = await Contato.buscaContatos(req.session.user.email);
    res.render("index", { contatos, title: "Agenda" });
    return;
  }

  res.render("login", { title: "Login" });
};
