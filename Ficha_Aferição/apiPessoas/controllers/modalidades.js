var mongoose = require("mongoose")
var Pessoa = require("../models/pessoas.js")

module.exports.listDesportos = () => {
    return Pessoa
        .distinct('desportos') // Busca valores únicos para o campo 'desportos'
        .then(desportos => desportos.sort()) // Ordena os desportos alfabeticamente
        .catch(erro => {
            throw new Error(erro); // Lança um erro em caso de falha na consulta
        });
};

// Método no ModalidadeController para encontrar atletas por modalidade
module.exports.findByModalidade = modalidade => {
    return Pessoa
        .find({'desportos': modalidade}) // Encontra atletas que praticam a modalidade específica
        .sort('nome') // Ordena os resultados pelo nome do atleta
        .exec();
};
