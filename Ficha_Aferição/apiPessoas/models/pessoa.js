var mongoose = require("mongoose")

var pessoaSchema = new mongoose.Schema({
    nome : String,
    idade : Number,
    sexo: String,
    morada:{
        cidade: String,
        distrito: String,
    },
    descrição: String,
    CC: String,
    BI: String,
    profissão: String,
    religião: String,
    partido_politico:{
        party_abbr: String,
        party_name: String,
    },
    desportos:[String],
    animais:[String],
    figura_publica_pt:[String],
    marca_carro: String,
    destinos_favoritos:[String],
    atributos:{
        fumador: Boolean,
        gosta_cinema: Boolean,
        gosta_viajar: Boolean,
        acorda_cedo: Boolean,
        gosta_ler: Boolean,
        gosta_musica: Boolean,
        gosta_comer: Boolean,
        gosta_animais_estimacao: Boolean,
        gosta_dancar: Boolean,
        comida_favorita: String
    }
}, { versionKey : false })

module.exports = mongoose.model('pessoas', pessoaSchema)