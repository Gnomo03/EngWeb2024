var express = require('express');
var router = express.Router();
var Pessoa = require('../controllers/pessoa')

router.get('/', function(req, res) {
  Pessoa.list()
  .then(data => res.jsonp(data))
  .catch(erro => res.status(521).jsonp(erro))
});

// Busca uma pessoa pelo ID
router.get('/:id', function(req, res){
  Pessoa.findById(req.params.id)
  .then(data => res.jsonp(data))
  .catch(erro => res.status(522).jsonp(erro));
});

// Adiciona uma nova pessoa
router.post('/', function(req, res){
  console.log(req.body);
  Pessoa.insert(req.body)
    .then(data => res.status(201).jsonp(data))
    .catch(erro => res.status(523).jsonp(erro));
});

// Atualiza uma pessoa existente
router.put('/:id', function(req, res) {
  Pessoa.update(req.params.id, req.body)
    .then(data => res.jsonp(data))
    .catch(erro => res.status(500).jsonp(erro));
});

// Exclui uma pessoa
router.delete('/:id', function(req, res) {
  Pessoa.delete(req.params.id)
    .then(data => res.status(204).send()) // 204 No Content
    .catch(erro => res.status(500).jsonp(erro));
});

module.exports = router;
