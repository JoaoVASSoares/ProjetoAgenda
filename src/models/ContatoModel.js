// Inicializando o mongoose
const mongoose = require("mongoose");
// Importando o validator
const validator = require("validator");

// Criando schama (dados e regras para dados)
const ContatoSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true },
    sobrenome: { type: String, required: false, default: "" },
    email: { type: String, required: false, default: "" },
    telefone: { type: String, required: false, default: "" },
    idUser: { type: String, require: false },
    criadoEm: { type: Date, default: Date.now },
  },
  { colection: "contatos" }
);

// Criando o model;
const ContatoModel = mongoose.model("Contato", ContatoSchema);

// trativa de dados em arrow function
function Contato(body, idUser) {
  this.body = body;
  this.user = idUser;
  this.errors = [];
  this.contato = null;
}

// Método que valida e cadastra o contato e em async (por se tratar de gravação em bd)
Contato.prototype.register = async function () {
  this.valida();
  // Checka se há erros e não permite a gravação de dados no bd
  if (this.errors.length > 0) return;

  // Retorna para a chave contato, a criação do contato em await
  this.contato = await ContatoModel.create(this.body);
};

// método de 'contato'
Contato.prototype.valida = function () {
  // Chama o método que percorre cada chave e valida se todos os valores são strings
  this.cleanUp();

  // Validação
  // O e-mail precisa ser válido
  if (this.body.email && !validator.isEmail(this.body.email)) {
    this.errors.push("E-mail inválido");
  }

  // Nome precisa ser preenchido
  if (!this.body.nome) this.errors.push("Nome é um campo obrigatório.");

  // Precisa enviar pelo menos um
  if (!this.body.email && !this.body.telefone) {
    this.errors.push(
      "Pelo menos um contato precisa ser enviado: e-mail ou telefone."
    );
  }
};

// Método de 'contato'
Contato.prototype.cleanUp = function () {
  for (const key in this.body) {
    if (typeof this.body[key] !== "string") {
      this.body[key] = "";
    }
  }

  // Garantir que tenha somente os campos necessário para validação do model(Excluindo outros dados como csrf token)
  this.body = {
    nome: this.body.nome,
    sobrenome: this.body.sobrenome,
    email: this.body.email,
    telefone: this.body.telefone,
    idUser: this.user,
  };
};

// edição
Contato.prototype.edit = async function (id) {
  // verifica se o Id não for uma string não realiza a busca e edição
  if (typeof id !== "string") return;
  // realiza as validações
  this.valida();
  // checa se não há erros e não permite a gravação de dados no bd
  if (this.errors.length > 0) return;

  // retorna para a chave contato, o método que localiza o contato pelo id e edita-o, em await
  this.contato = await ContatoModel.findByIdAndUpdate(id, this.body, {
    new: true,
  });
};

// Métodos estaticos, não atrelado ao prototype
// Método que recebe o id do contatoController, localizando o contato por ele
Contato.buscaPorId = async function (id) {
  // verifica se o Id não for uma string não realiza a busca
  if (typeof id !== "string") return;

  // Localiza o id do usuário no bd e salva na chave "id"
  const contato = await ContatoModel.findById(id);
  return contato;
};

// lista contato ordenado por data
Contato.buscaContatos = async function (userEmail) {
  // localiza o usuarios criados por determinado email
  const contatos = await ContatoModel.find({ idUser: userEmail }).sort({
    criadoEm: -1,
  });
  return contatos;
};

Contato.delete = async function (id) {
  // verifica se o Id não for uma string não realiza a busca e edição
  if (typeof id !== "string") return;
  // Localiza o usuário pelo id e o deleta
  const contato = await ContatoModel.findOneAndDelete({ _id: id });
  return contato;
};

// exportando o model
module.exports = Contato;
