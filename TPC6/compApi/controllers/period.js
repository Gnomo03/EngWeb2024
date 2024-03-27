var Period = require('../models/period')

// Lista todos os periodos, ordenados por nome
module.exports.list = () => {
    return Period.find().sort({nome : 1}).exec();
}

// Encontra um periodo pelo ID
module.exports.findById = id => {
    return Period.findOne({id : id}).exec();
}

// Insere um novo periodo
module.exports.insert = period => {
    // Verifica se o periodo já existe antes de inserir
    return Period.find({id : period.id}).exec()
        .then(result => {
            if(result.length === 0){
                var newPeriod = new Period(period);
                return newPeriod.save();
            } else {
                throw new Error("Periodo já existe");
            }
        });
}

// Atualiza um periodo existente
module.exports.update = (id, period) => {
    return Period.findOneAndUpdate({id : id}, period, {new: true}).exec();
}

// Exclui um periodo
module.exports.delete = id => {
    return Period.findOneAndDelete({id : id}).exec();
}