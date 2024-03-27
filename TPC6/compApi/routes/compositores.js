var express = require('express');
var router = express.Router();
var Composer = require('../controllers/comp');

// Lista todos os compositores
router.get('/compositores', function(req, res) {
  Composer.list()
  .then(data => {
    //console.log(data);
    res.jsonp(data);
  })
  .catch(erro => res.status(521).jsonp(erro));
});

// Busca um compositor pelo ID
router.get('/compositores/:id', function(req, res){
  Composer.findById(req.params.id)
  .then(data => res.jsonp(data))
  .catch(erro => res.status(522).jsonp(erro));
});

// Adiciona um novo compositor
router.post('/compositores', function(req, res){
  console.log(req.body);
  Composer.insert(req.body)
    .then(data => res.status(201).jsonp(data))
    .catch(erro => res.status(523).jsonp(erro));
});

// Atualiza um compositor existente
router.put('/compositores/:id', function(req, res) {
  Composer.update(req.params.id, req.body)
    .then(data => res.jsonp(data))
    .catch(erro => res.status(500).jsonp(erro));
});

// Exclui um compositor
router.delete('/compositores/:id', function(req, res) {
  Composer.delete(req.params.id)
    .then(data => res.status(204).send()) // 204 No Content
    .catch(erro => res.status(500).jsonp(erro));
});

module.exports = router;
