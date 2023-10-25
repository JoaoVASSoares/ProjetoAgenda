exports.middlewareGlobal = (req, res, next) => {
  // Slava as msg no logacals.erros e locals.success das flash messages
  res.locals.errors = req.flash("errors");
  res.locals.success = req.flash("success");
  // salva a sessão atual
  res.locals.user = req.session.user;
  res.locals.contato = req.session.contato;
  next();
};

// Verifica o token csrf;
exports.checkCSRFErro = function (erro, req, res, next) {
  if (erro) {
    return res.render("404");
  }
  next();
};

// Envia o token a todas as rotas;
exports.crsfMiddleware = (req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
};

exports.loginRequired = (req, res, next) => {
  if (!req.session.user) {
    req.flash("errors", "Você precisa fazer login.");
    req.session.save(() => res.redirect("/"));
    return;
  }
  next();
};
