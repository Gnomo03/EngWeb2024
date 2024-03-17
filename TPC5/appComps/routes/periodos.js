var express = require('express');
var axios = require('axios')
var router = express.Router();

/* GET composers listing. */
router.get('/', function(req, res, next) {
    var d = new Date().toISOString().substring(0, 16)
    axios.get("http://localhost:3000/periodos")
    .then(resp =>{
        periods = resp.data
        res.status(200).render("PeriodsListPage", {"lp": periods, "date": d})
    })
    .catch(erro => {
        res.status(502).render("error", {"error": erro})
    })
});

router.get('/registo', function(req, res, next) {
    var d = new Date().toISOString().substring(0, 16)
    axios.get("http://localhost:3000/periodos")
      .then(resp => {
        let maxIdNum = 0;
        resp.data.forEach(compositor => {
          const idNum = parseInt(compositor.id.substring(1));
          if (idNum > maxIdNum) {
            maxIdNum = idNum;
          }
        });
        const newId = `P${maxIdNum + 1}`;
        res.render("periodFormPage", { "nid": newId, "date": d});
      })
      .catch(erro => {
        next(erro);
      });
});

router.get('/:idPeriodo', function(req, res, next) {
    var d = new Date().toISOString().substring(0, 16);
    var id = req.params.idPeriodo;
    axios.get(`http://localhost:3000/periodos/${id}`)
        .then(respPeriodo => {
            var periodoNome = respPeriodo.data.nome;
            //console.log(periodoNome)
            axios.get('http://localhost:3000/compositores')
                .then(respCompositores => {
                    var allComposers = respCompositores.data;
                    //console.log(allComposers)
                    var composersInPeriod = allComposers.filter(composer => composer.periodo == periodoNome);
                    //console.log(composersInPeriod)
                    res.render("composersPeriodPage", { "lComp": composersInPeriod, "periodo": periodoNome, "date": d });
                })
                .catch(erro => {
                    res.status(503).render("error", {"error": erro});
                });
        })
        .catch(erro => {
            res.status(503).render("error", {"error": erro});
        });
});


router.get('/edit/:idPeriodo', function(req, res, next) {
    var d = new Date().toISOString().substring(0, 16)
    var id = req.params.idPeriodo
    axios.get(`http://localhost:3000/periodos/${id}`)
    .then(resp => {
        period = resp.data
        res.status(200).render("periodFormEditPage", {"periods": period, "date": d})
    })
    .catch(erro => {
        res.status(404).render("error", {"error": erro})
    })
});

router.get('/delete/:idPeriodo', function(req, res, next) {
    var d = new Date().toISOString().substring(0, 16)
    var id = req.params.idPeriodo
    axios.delete("http://localhost:3000/periodos/" +id)
    .then(resp =>{
        res.redirect("/periodos")
    })
    .catch(erro => {
        res.status(504).render("error", {"error": erro})
    })
});
//-------------------------------------------------------------------------------------

router.post('/registo', function(req, res, next) {
    var result = req.body;
    axios.post("http://localhost:3000/periodos/", result)
      .then(resp => {
          res.writeHead(200, {'Content-Type' : 'text/html; charset=utf-8'});
          res.write("<p>Página inserida: " + JSON.stringify(resp.data) + "</p>");
          res.end();
      })
      .catch(erro => {
          res.render("error", {"error": erro});
      });
  });

router.post('/edit/:idPeriodo', function(req, res, next) {
    var period = req.body
    axios.put(`http://localhost:3000/periodos/${period.id}`, period)
    .then(resp => {
        res.status(201).redirect("/periodos")
    })
    .catch(erro => {
       res.status(404).render("error", {"error": erro})
    })
  });
  

module.exports = router;