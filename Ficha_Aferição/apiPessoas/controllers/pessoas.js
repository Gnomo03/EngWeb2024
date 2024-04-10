var mongoose = require("mongoose")
const {modelName} = require("../models/pessoas")
var Pessoa = require("../models/pessoas")

module.exports.list = () => {
    return Pessoa
        .find()
        .sort({nome:1})
        .exec()
}