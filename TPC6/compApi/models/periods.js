var mongoose = require("mongoose")

var periodSchema = new mongoose.Schema({
    id : {
        type: String,
        required: true
    }, 
    nome : String,
    numeroCompositores : Number
}, { versionKey : false })

module.exports = mongoose.model('periodos', periodSchema)