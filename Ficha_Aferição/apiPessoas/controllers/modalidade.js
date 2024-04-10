var Pessoa = require('../models/pessoa.js');

// Método para listar todas as modalidades desportivas únicas
module.exports.listDesportos = () => {
    return Pessoa
        .distinct('desportos') // Busca valores únicos para o campo 'desportos'
        .then(desportos => desportos.sort()) // Ordena os desportos alfabeticamente
        .catch(erro => {
            throw new Error(erro); // Lança um erro em caso de falha na consulta
        });
};

// Método no ModalidadeController para encontrar atletas por modalidade
exports.findByDesporto = function(desporto) {
    return Pessoa.find({ desportos: desporto }) // Busca pessoas que têm o desporto especificado na lista 'desportos'
        .sort('nome') // Ordena os resultados pelo nome
        .select('nome -_id') // Seleciona apenas o campo 'nome' para retornar, excluindo o ID
        .exec(); // Executa a consulta
};
