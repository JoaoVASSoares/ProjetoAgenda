// Importa o model de cadastro
// Tambem pode importa de seguinte forma: import Cadastro from "../models/LoginModel";

const Cadastro = require("../models/LoginModel");

exports.index = (req, res) => {
  return res.render("cadastro", { title: "Cadastro" });
};

exports.register = async function (req, res) {
  try {
    // Cria instancia de "Cadastro" passando o body;
    const cadastro = new Cadastro(req.body);
    // Chama o método de validação de dados
    await cadastro.register();

    // Exibe as mensagem de erro no formulário(view) caso ocorra.
    if (cadastro.errors.length > 0) {
      // Salva as mensgem de erro no flash massages com a tag "erro"
      req.flash("errors", cadastro.errors);
      req.session.save(function () {
        // Volta a página de cadastro e exibe os erros, salvando a sessão
        return res.redirect("back");
      });
      return;
    }
    req.flash("success", "Seu usuário foi criado com sucesso.");
    req.session.save(function () {
      return res.redirect("back");
    });
    return;
  } catch (e) {
    console.log(e);
    return res.render("404", { title: "Erro" });
  }
};
