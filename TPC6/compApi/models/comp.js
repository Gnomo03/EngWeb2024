var mongoose = require("mongoose")

var compSchema = new mongoose.Schema({
    id : String,
    nome : String,
    bio : String,
    dataNasc : Date,
    dataObito : Date,
    periodo : String
}, {versionKey : false})

module.exports = mongoose.model('compositores', compSchema)