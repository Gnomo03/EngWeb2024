var express = require('express');
var axios = require('axios')
var router = express.Router();

/* GET composers listing. */
router.get('/', function(req, res, next) {
  var d = new Date().toISOString().substring(0, 16)
  axios.get("http://localhost:3000/compositores?_sort=nome")
  .then(resp =>{
      composers = resp.data
      res.status(200).render("ComposersListPage", {"lComp": composers, "date": d})
  })
  .catch(erro => {
      res.status(502).render("error", {"error": erro})
  })
});

router.get('/registo', function(req, res, next) {
  var d = new Date().toISOString().substring(0, 16)
  axios.get("http://localhost:3000/compositores")
    .then(resp => {
      let maxIdNum = 0;
      resp.data.forEach(compositor => {
        const idNum = parseInt(compositor.id.substring(1));
        if (idNum > maxIdNum) {
          maxIdNum = idNum;
        }
      });
      const newId = `C${maxIdNum + 1}`;
      res.render("composerFormPage", { "nid": newId, "date": d});
    })
    .catch(erro => {
      next(erro);
    });
});

router.get('/:idCompositor', function(req, res, next) {
  var d = new Date().toISOString().substring(0, 16)
  var id = req.params.idCompositor
  axios.get("http://localhost:3000/compositores/" +id)
  .then(resp =>{
    composer = resp.data
      res.status(200).render("composerPage", {"composer": composer, "date": d})
  })
  .catch(erro => {
      res.status(503).render("error", {"error": erro})
  })
});

router.get('/edit/:idCompositor', function(req, res, next) {
  var d = new Date().toISOString().substring(0, 16)
  var id = req.params.idCompositor
  axios.get(`http://localhost:3000/compositores/${id}`)
  .then(resp => {
      composer = resp.data
      res.status(200).render("composerFormEditPage", {"composers": composer, "date": d})
  })
  .catch(erro => {
      res.status(404).render("error", {"error": erro})
  })
});

router.get('/delete/:idCompositor', function(req, res, next) {
  var d = new Date().toISOString().substring(0, 16)
  var id = req.params.idCompositor
  axios.delete("http://localhost:3000/compositores/" +id)
  .then(resp =>{
      res.redirect("/compositores?_sort=nome")
  })
  .catch(erro => {
      res.status(504).render("error", {"error": erro})
  })
});

// --------------------------------------------------------------------------------------------

router.post('/registo', function(req, res, next) {
  var result = req.body;
  axios.post("http://localhost:3000/compositores/", result)
    .then(resp => {
        res.writeHead(200, {'Content-Type' : 'text/html; charset=utf-8'});
        res.write("<p>Página inserida: " + JSON.stringify(resp.data) + "</p>");
        res.end();
    })
    .catch(erro => {
        res.render("error", {"error": erro});
    });
});

router.post('/edit/:idCompositor', function(req, res, next) {
  var d = new Date().toISOString().substring(0, 16)
  var composer = req.body
  console.log(composer)
  axios.put(`http://localhost:3000/compositores/${composer.id}`, composer)
  .then(resp => {
      res.status(201).redirect("/compositores?_sort=nome")
  })
  .catch(erro => {
     res.status(404).render("error", {"error": erro})
  })
});


module.exports = router;