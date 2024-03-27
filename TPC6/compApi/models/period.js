var mongoose = require("mongoose")

var periodSchema = new mongoose.Schema({
    id : String,
    nome : String,
    numeroCompositores : Number
}, {versionKey : false})

module.exports = mongoose.model('periodos', periodSchema)