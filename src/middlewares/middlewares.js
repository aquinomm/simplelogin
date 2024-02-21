exports.middlewareGlobal = (req, res, next) => {
    res.locals.user = req.session.user;
    res.locals.errors = req.flash('errors');
    res.locals.success = req.flash('sucess');
    next();
};

exports.csrfMiddleware = (req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    next();
}

exports.checkCsrfError = (err, req, res, next) => {
    if(err && 'EBADCSRFTOKEN' === err.code) {
      return res.render('404');
    }
    next();
  };

exports.loginRequired = (req, res, next) => {
  if(!req.session.user) {
    req.flash('errors', 'Vous devez vous connecter pour accéder à cette page.');
    req.session.save(() => res.redirect('/'));
    return;
  }
  next();
}