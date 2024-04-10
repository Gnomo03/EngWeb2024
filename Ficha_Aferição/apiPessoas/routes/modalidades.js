var express = require('express');
var router = express.Router();
var ModalidadeController = require('../controllers/modalidade.js');

// Rota para listar todas as modalidades
router.get('/', function(req, res) {
  ModalidadeController.listDesportos() // Certifique-se de que este método exista no controlador
    .then(data => res.json(data))
    .catch(error => res.status(500).json({ error: error.message }));
});

// Nova rota para listar atletas por modalidade
router.get('/:modalidade', function(req, res) {
  ModalidadeController.findByDesporto(req.params.modalidade)
      .then(pessoas => res.json(pessoas))
      .catch(error => res.status(500).json({ error: error.message }));
});

module.exports = router;