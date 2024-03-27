var express = require('express');
var router = express.Router();
var Period = require('../controllers/period');
//var Composer = require('../controllers/comps');

// Lista todos os períodosm 
router.get('/periodos', function(req, res) {
  Period.list()
      .then(data => res.jsonp(data))
      .catch(erro => res.status(500).jsonp(erro));
});

// Busca um periodo pelo ID
router.get('/periodos/:id', function(req, res){
  Period.findById(req.params.id)
  .then(data => res.jsonp(data))
  .catch(erro => res.status(522).jsonp(erro));
});

// Adiciona um novo periodo
router.post('/periodos', function(req, res){
  console.log(req.body);
  Period.insert(req.body)
    .then(data => res.status(201).jsonp(data))
    .catch(erro => res.status(523).jsonp(erro));
});

// Atualiza um periodo existente
router.put('/periodos/:id', function(req, res) {
    Period.update(req.params.id, req.body)
    .then(data => res.jsonp(data))
    .catch(erro => res.status(500).jsonp(erro));
});

// Exclui um periodo
router.delete('/periodos/:id', function(req, res) {
    Period.delete(req.params.id)
    .then(data => res.status(204).send()) // 204 No Content
    .catch(erro => res.status(500).jsonp(erro));
});

module.exports = router;
