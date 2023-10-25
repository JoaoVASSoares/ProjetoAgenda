import validator from "validator";

export default class Contato {
  constructor(formClass) {
    this.form = document.querySelector(formClass);
  }
  init() {
    this.events();
  }
  events() {
    if (!this.form) return;
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.validate(e);
    });
  }

  validate(e) {
    const erros = document.querySelectorAll(".erro");
      for (let p of erros) {
        p.remove();
      }

    const el = e.target;
    const nomeInput = el.querySelector('input[name="nome"]');
    const cellInput = el.querySelector('input[name="telefone"]');
    const emailInput = el.querySelector('input[name="email"]');

    let error = false;

    if (!nomeInput.value) {

      //Criar p depois do input para exibir os erros
      let p = document.createElement("p");
      let errorMsg = document.createTextNode("Nome precisa ser preenchido");

      p.appendChild(errorMsg);
      p.classList.add("erro");
      p.classList.add("alert-danger");
      nomeInput.after(p);
      error = true;
    }

    if (!emailInput.value && !cellInput.value) {
      //Criar p depois do input para exibir os erros
      let p = document.createElement("p");
      let errorMsg = document.createTextNode(
        "O email ou telefone precisa ser preenchido"
      );

      p.appendChild(errorMsg);
      p.classList.add("erro");
      p.classList.add("alert-danger");
      const genErr = el.querySelector('span[class="genErr"]');
      genErr.after(p);
      error = true;
      return;
    }

    if (!validator.isEmail(emailInput.value) && !cellInput.value) {
      //Criar p depois do input para exibir os erros
      let p = document.createElement("p");
      let errorMsg = document.createTextNode("O email inválido");

      p.appendChild(errorMsg);
      p.classList.add("erro");
      p.classList.add("alert-danger");
      emailInput.after(p);
      error = true;
      return;
    }

    // Se não houver erro, permite o envio do formulário
    if (!error) el.submit();
  }
}
