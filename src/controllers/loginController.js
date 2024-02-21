const Login = require('../models/LoginModel');

exports.index = (req, res) => {
    return res.render('index');
}

exports.login = async (req, res) => {
    const login = new Login(req.body);
    await login.login();

    if(!login.user) {
        req.session.save(() => {
            console.log(login.errors);
            req.flash('errors', login.errors);
            return res.redirect('/');
        });
        return;
    }

    req.session.user = login.user;
    req.session.save(() => {
        req.flash('sucess', 'Vous avez créé une nouvelle compte');
        console.log('hello, ', req.session.user.name);
        return res.redirect('/dashboard');
    });

}

exports.logout = async(req, res) => {
    req.session.destroy();
    return res.redirect('/');
}