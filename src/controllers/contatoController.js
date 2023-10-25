// Importantando o contatoModel
const Contato = require("../models/ContatoModel");

exports.index = (req, res) => {
  // Criado um contato fake apenas para a criação de um objeto vazio
  res.render("contato", {
    title: "Criar contato",
    contato: {},
  });
};

/* 
A criação de um contato vem de uma função async, então ela retorna uma promise, por isso
precisamos utilizar o async e o await aqui.
*/
exports.register = async (req, res) => {
  try {
    const contato = new Contato(req.body, req.session.user.email);

    // Chama a função de validação la no model
    await contato.register();

    // Exibe as mensagem de erro no formulário(view) caso ocorra.
    if (contato.errors.length > 0) {
      // Salva as mensgem de erro no flash massages com a tag "erro"
      req.flash("errors", contato.errors);
      // Volta a página de cadastro e exibe os erros, salvando a sessão
      req.session.save(() => res.redirect("back"));
      return;
    }
    req.flash("success", "Contato registrado com sucesso");
    // Volta e a página de cadastro e exibe os erros, salvando a sessão
    idUser = contato.contato._id;
    req.session.save(() =>
      res.redirect(`/contato/index/${contato.contato.id}`)
    );
    return idUser;
  } catch (e) {
    console.log(e);
    res.render("404", { title: "Erro" });
  }
};

exports.editIndex = async function (req, res) {
  try {
    // Somente se o usuário estiver logado
    if (req.session.user) {
      //Se não existir o id ele retorna a pagina de erro
      if (!req.params.id) return res.render("404", { title: "Erro" });

      // Localiza os dados do contato pelo id
      const contato = await Contato.buscaPorId(req.params.id);

      // Se não exister ele renderia a pagina erro
      if (!contato) return res.render("404", { title: "Erro" });

      idUser = contato._id;

      req.session.contato = {
        _id: idUser || " ",
        nome: contato.nome,
        sobrenome: contato.sobrenome,
        telefone: contato.telefone,
        email: contato.email,
        idUser: contato.idUser,
      };

      return res.render("contato", { title: "Editar Contato", contato });
    }
    return res.render("login", { title: "Login" });
  } catch (e) {
    console.log(e);
    return res.render("404", { title: "Erro" });
  }
};

exports.edit = async function (req, res) {
  try {
    // Somente se o usuário estiver logado
    if (req.session.user) {
      //Se não existir o id ele retorna a pagina de erro
      if (!req.params.id) return res.render("404", { title: "Erro" });

      // Cria a instancia do contato com o body coletado no post
      const contato = new Contato(req.body);
      // Chama o metodo edit do model que atualizará os dados
      await contato.edit(req.params.id);
      idUser = req.params.id;

      // Exibe as mensagem de erro no formulário(view) caso ocorra.
      if (contato.errors.length > 0) {
        // Salva as mensgem de erro no flash massages com a tag "erro"
        req.flash("errors", contato.errors);

        // Volta a página de cadastro e exibe os erros, salvando a sessão
        req.session.contato = {
          _id: idUser || " ",
          nome: contato.nome,
          sobrenome: contato.sobrenome,
          telefone: contato.telefone,
          email: contato.email,
          idUser: contato.idUser,
        };

        req.session.save(() =>
          res.redner("../views/contato", {
            body: req.session.contato,
            errors: contato.errors,
          })
        );
        return;
      }

      req.flash("success", "Contato editado com sucesso");
      // volta a página de cadastro, salvando a sessão
      req.session.save(() =>
        res.redirect(`/contato/index/${contato.contato.id}`)
      );
      return;
    }
    return res.render("Login", { title: "Login" });
  } catch (e) {
    console.log(e);
    res.render("404", { title: "Error" });
  }
};

exports.delete = async function (req, res) {
  try {
    // Somente se o usuário estiver logado
    if (req.session.user) {
      //Se não existir o id ele retorna a pagina de erro
      if (!req.params.id) return res.render("404", { title: "Erro" });

      // faz o delet do contato pelo id.
      const contato = await Contato.delete(req.params.id);

      // Se não existe o contato renderia a pagina de erro
      if (!contato) return res.render("404", { title: "Erro" });
      req.flash("success", "Contato deletado com sucesso");
      // volta a página index, salvando a sessão
      req.session.save(() => res.redirect("back"));
      return;
    }
    return res.render("Login", { title: "Login" });
  } catch (e) {
    console.log(e);
    res.render("404", { title: "Error" });
  }
};
