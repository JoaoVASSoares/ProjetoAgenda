// Importa o model de login
const Login = require("../models/LoginModel");

exports.index = (req, res) => {
  if (req.session.user) {
    return res.render("login-logado", { title: "Usúario logado" });
  }
  return res.render("login", { title: "Login" });
};

exports.login = async function (req, res) {
  try {
    // Criando istancia de "Login" enviado o body
    const login = new Login(req.body);
    // Chama o métode de validação de dados
    await login.login();

    // Exibe as mensagem de erro no formulário(view) caso ocorra.
    if (login.errors.length > 0) {
      // Salva as mensgem de erro no flash massages com a tag "erro"
      req.flash("errors", login.errors);
      // Volta a página de cadastro e exibe os erros, salvando a sessão
      req.session.save(function () {
        return res.redirect("back");
      });
      return;
    }

    req.flash("success", "Você entrou no sistema.");
    // Salva o usuario logado na sessão session
    req.session.user = login.user;
    // Volta a página de cadastro e exibe os erros,salvando a sessão
    req.session.save(function () {
      return res.redirect("back");
    });
    return;
  } catch (e) {
    console.log(e);
    return res.render("404", { title: "Erro" });
  }
};

exports.logout = function (req, res) {
  req.session.destroy();
  res.redirect("/");
};
