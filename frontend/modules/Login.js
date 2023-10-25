import validator from "validator";

export default class Login {
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
    const emailInput = el.querySelector('input[name="email"]');
    const passwordInput = el.querySelector("input[name='password']");
    let error = false;

    if (!validator.isEmail(emailInput.value)) {
      //Criar p depois do input para exibir os erros
      let p = document.createElement("p");
      let errorMsg = document.createTextNode("Email inválido");

      p.appendChild(errorMsg);
      p.classList.add("erro");
      p.classList.add("alert-danger");
      emailInput.after(p);
      error = true;
    }

    if (passwordInput.value.length < 3 || passwordInput.value.length > 50) {
      //Criar p depois do input para exibir os erros
      let p = document.createElement("p");
      let errorMsg = document.createTextNode(
        "A senha precisa ter de 3 a 50 caracteres"
      );

      p.appendChild(errorMsg);
      p.classList.add("erro");
      p.classList.add("alert-danger");
      passwordInput.after(p);
      error = true;
    }

    if (!error) el.submit();
  }
}
