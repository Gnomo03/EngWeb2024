var Composer = require('../models/comp')

// Lista todos os compositores, ordenados por nome
module.exports.list = () => {
    return Composer.find().sort({nome : 1}).exec();
}

// Encontra um compositor pelo ID
module.exports.findById = id => {
    return Composer.findOne({id : id}).exec();
}

// Insere um novo compositor
module.exports.insert = comp => {
    // Verifica se o compositor já existe antes de inserir
    return Composer.find({id : comp.id}).exec()
        .then(result => {
            if(result.length === 0){
                var newComposer = new Composer(comp);
                return newComposer.save();
            } else {
                throw new Error("Compositor já existe");
            }
        });
}

// Atualiza um compositor existente
module.exports.update = (id, comp) => {
    return Composer.findOneAndUpdate({id : id}, comp, {new: true}).exec();
}

// Exclui um compositor
module.exports.delete = id => {
    return Composer.findOneAndDelete({id : id}).exec();
}