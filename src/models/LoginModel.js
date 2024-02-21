const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');

const LoginSchema = new mongoose.Schema({
    name: {
        type: String, 
    },
    surname: {
        type: String, 
    },
    email: {
        type: String, 
    },
    password: {
        type: String,
    },
    dataConsent: {
        type: String,
    }
})

const LoginModel = mongoose.model('LoginModel', LoginSchema); 

class Login {
    constructor(body) {
        this.name = body.name;
        this.surname = body.surname;
        this.email = body.email;
        this.password = body.password;
        this.dataConsent = body.dataConsent;
        this.errors = [];
        this.user = null;
    }

    // using an external validator and not the one provided by mongoose within the schemas
    validate() {
        if(!this.name) this.errors.push('Veuillez entrer un prénom');
        if(!this.surname) this.errors.push('Veuillez entrer un nom de famille');
        if(this.password.length < 3 || this.password.length > 50) this.errors.push('Veuillez saisir un mot de passe contenant au moins 3 caractères');
        if(!validator.isEmail(this.email)) this.errors.push('Veulliez entrer un email valide');
        if(!this.dataConsent) this.errors.push('Vous devez agréer avec la politique de données avant de poursuivre');
    }

    async register() {
        this.validate();

        if(this.errors.length > 0) return;

        if(await LoginModel.findOne({email: this.email})) {
            this.errors.push('Veuillez entrer un email non utilisé');
            return;
        }

        // all good, let's hash
        const salt = bcryptjs.genSaltSync();
        this.password = bcryptjs.hashSync(this.password, salt);


        this.user = await LoginModel.create({
            name: this.name,
            surname: this.surname,
            email: this.email,
            password: this.password,
            dataConsent: this.dataConsent,      
        });
    }

    async login() {
        this.loginValidate();

        if(this.errors.length > 0) return;

        this.user = await LoginModel.findOne({email: this.email});

        if(!this.user) {
            this.user = null;
            this.errors.push('Email ou mot de passe invalide');
            return;
        }

        if(!bcryptjs.compareSync(this.password, this.user.password)) {
            this.user = null;
            this.errors.push('Email ou mot de passe invalide');
            return;
          }
    }

    loginValidate() {
        if(this.password.length < 3 || this.password.length > 50) this.errors.push('Veuillez saisir un mot de passe contenant au moins 3 caractères');
        if(!validator.isEmail(this.email)) this.errors.push('Veulliez entrer un email valide');
    }
}

module.exports = Login;