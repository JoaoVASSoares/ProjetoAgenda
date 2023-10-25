// Iniciando o mongoose
const mongoose = require("mongoose");
// Inportando o validator
const validator = require("validator");
// inportando o bcrypet
const bcryptjs = require("bcryptjs");

// Criando o schema (dados e regas para os dados)
const LoginSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
  },
  { collection: "users" }
);

const LoginModel = mongoose.model("Login", LoginSchema);

class Login {
  constructor(body) {
    this.body = body;
    // flag de erros
    this.errors = [];
    // salva a sessao
    this.user = null;
  }

  // Toda operação em bd trabalhamos com promises (async await)
  // Método de login
  async login() {
    // Chama o método que limpa e valida os dados
    this.validaLogin();
    // checa se não há erros e não permite a gravação de dados no bd
    if (this.errors.length > 0) return;
    this.user = await LoginModel.findOne({ email: this.body.email });

    // se o usuario não existir, adicionar o erro
    if (!this.user) {
      this.errors.push("Usuário não existe.");
      return;
    }

    // Validar a senha decriptando e comprado com a senha armazenada no bd
    if (!bcryptjs.compareSync(this.body.password, this.user.password)) {
      this.errors.push("Senha inválida");
      this.user = null;
      return;
    }
  }

  async register() {
    // Chama o método que limpa e valida os dados
    this.valida();

    // checa se não há erros e não permite a gravação de dados no bd
    if (this.errors.length > 0) return;

    // Exclui a chave de repetir senha, já que nn é necessaria
    delete this.body.rpass;

    // Checha para ver se o usuario existe
    await this.userExists();

    // checa se não há erros e não permite a gravação de dados no bd
    if (this.errors.length > 0) return;

    // Adicionando o hash a senha
    //Criando o salt
    const salt = bcryptjs.genSaltSync();
    // adicionando o salt a senha
    this.body.password = bcryptjs.hashSync(this.body.password, salt);

    // armazena os dados => Chama o model passando o body já validado
    this.user = await LoginModel.create(this.body);
  }

  async userExists() {
    // Verifica se existe um email de mesmo valor que a key do body
    this.user = await LoginModel.findOne({ email: this.body.email });
    if (this.user) this.errors.push("Usuário já existe.");
  }

  validaLogin() {
    // Chama o metodo que percorre cada chave e valida se todos os valores são string
    this.cleanUp();

    // Validação
    // O e-mail precisa ser válido
    if (!validator.isEmail(this.body.email)) {
      this.errors.push("E-mail inválido");
    }
  }

  valida() {
    // Chama o metodo que percorre cada chave e valida se todos os valores são string
    this.cleanUp();

    // Validação
    // O e-mail precisa ser válido
    if (!validator.isEmail(this.body.email)) {
      this.errors.push("E-mail inválido");
    }

    // A senha precisa ter entre 3 e 50
    if (this.body.password.length < 3 || this.body.password.length > 50) {
      this.errors.push("A senha precisa ter entre 3 e 50 caracteres.");
    }

    // Valida o campo repetir senha
    if (this.body.rpass.length < 3 || this.body.rpass.length > 50) {
      this.errors.push(
        `O campo "Repetir senha" precisa ter entre 3 e 50 caracteres.`
      );
    }
    if (this.body.password !== this.body.rpass) {
      this.errors.push("As senhas devem ser iguais");
    }
  }

  cleanUp() {
    for (const key in this.body) {
      if (typeof this.body[key] !== "string") {
        this.body[key] = "";
      }
    }

    // Garantir que tenhamoes somentes os campos necessario para validação do model (excluindo outros dados como o csrf token)
    this.body = {
      email: this.body.email,
      password: this.body.password,
      rpass: this.body.rpass,
    };
  }
}

// Exportando o model
module.exports = Login;
