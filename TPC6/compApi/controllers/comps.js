var mongoose = require("mongoose")
const {modelName} = require("../models/comps")
var Composer = require("../models/comps")

module.exports.list = () => {
    return Composer
        .find()
        .sort({nome:1})
        .exec()
}