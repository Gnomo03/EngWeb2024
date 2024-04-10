var Pessoa = require('../models/pessoa.js')

module.exports.list = () => {
    return Pessoa
        .find()
        .sort({nome : 1})
        .exec()
}

module.exports.findById = id => {
    return Pessoa
        .findOne({_id : id})
        .exec()
}

module.exports.insert = pessoa =>{
    var newPessoa = new Pessoa(pessoa)
    return newPessoa.save()
}

// Atualiza uma pessoa existente
module.exports.update = (id, p) => {
    return Pessoa.findOneAndUpdate({_id : id}, p, {new: true}).exec();
}

// Exclui uma pessoa
module.exports.delete = id => {
    return Pessoa.findOneAndDelete({_id : id}).exec();
}