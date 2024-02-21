const mongoose = require('mongoose');

// mongodb: no sql, sem validacao
const HomeSchema = new mongoose.Schema({
    titulo: {type: String, required: true},
    descricao: String
});

const HomeModel = mongoose.model('HomeModel', HomeSchema);

class Home {

};

module.exports = Home;