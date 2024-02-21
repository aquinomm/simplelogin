require('dotenv').config();

const express = require('express');
const app = express();

// connecting database
const mongoose = require('mongoose');
mongoose.connect(process.env.CONNECTIONSTRING)
    .then(() => {
        console.log('Database conectada');
        app.emit('pronto');
    })
    .catch((e) => console.log(e));
const MongoStore = require('connect-mongo');

const session = require('express-session');
const flash = require('connect-flash');

const routes = require('./routes');
const path = require('path');
const helmet = require('helmet');
const csrf = require('csurf');
const { middlewareGlobal, csrfMiddleware, checkCsrfError } = require('./src/middlewares/middlewares');

// app.use(helmet());
app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'public')));

const sessionOptions = session({
    secret: '2348375902',
    store: MongoStore.create({ mongoUrl: process.env.CONNECTIONSTRING }),
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 24,
    }
});


app.use(sessionOptions),
app.use(flash());

app.set('views', path.resolve(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');

app.use(csrf());

app.use(middlewareGlobal);
app.use(checkCsrfError);
app.use(csrfMiddleware);
app.use(routes);

app.on('pronto', () => {
    app.listen(3000, () => {
        console.log('Servidor executando na porta 3000');
        console.log('Acessar http://localhost:3000');
    });
})

