const Login = require('../models/LoginModel');

exports.index = (req, res) => {
    return res.render('register');
};

exports.register = async (req, res) => {
    const login = new Login(req.body);
    await login.register();

    if (login.errors.length > 0) { // validation failed
        console.log(login.errors);
        req.flash('errors', login.errors);
        req.session.save(() => res.redirect('/register'));
        return
    }

    req.session.user = login.user;
    req.session.save(() => {
        req.flash('success', 'Vous avez entré')
        console.log('welcome, ', login.name);
        return res.redirect('/dashboard');
    });
    

}