var mongoose = require("mongoose");

var modalidadeSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true, // torna o campo obrigatório
        unique: true // garante que cada modalidade tenha um nome único
    },
}, { versionKey: false });

module.exports = mongoose.model('modalidades', modalidadeSchema);
