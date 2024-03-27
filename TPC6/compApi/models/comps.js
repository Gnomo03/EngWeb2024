var mongoose = require("mongoose")

var compSchema = new mongoose.Schema({
    id : {
        type: String,
        required: true
    }, 
    nome : String,
    bio : String,
    dataNasc : Date,
    dataObito : Date,
    periodo : String
}, { versionKey : false })

module.exports = mongoose.model('compositores', compSchema)