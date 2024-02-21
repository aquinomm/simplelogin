const express = require('express');
const route = express.Router();
const homeController = require('./src/controllers/homeController');
const loginController = require('./src/controllers/loginController');
const registerController = require('./src/controllers/registerController');
const dashboardController = require('./src/controllers/dashboardController');
const { loginRequired } = require('./src/middlewares/middlewares');

// logic
// get routes to display the forms, post routes to get the data, the controllers must deal with the data using the models
// so next step after displaying the forms is getting the data
// now is the register

route.get('/home', homeController.index);

// login routes
route.get('/', loginController.index);
route.post('/login', loginController.login);
route.get('/logout', loginController.logout);

// register routes
route.get('/register', registerController.index);
route.post('/register/new', registerController.register);

// dashboard route
route.get('/dashboard', loginRequired, dashboardController.index);


module.exports = route;
