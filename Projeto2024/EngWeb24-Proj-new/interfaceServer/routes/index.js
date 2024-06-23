var express = require('express');
var router = express.Router();
var axios = require('axios');
var jwt = require('jsonwebtoken');
var bodyParser = require('body-parser');
var session = require('express-session');
const { token } = require('morgan');
const path = require('path');
const fs = require('fs');
var multer = require('multer');
var upload = multer({dest: 'uploads'})
const Ajv = require('ajv');

var permissions = require('./permissions.js')
var retrieve_user_data = require('./getUser.js')

// Coisas para upload de ficheiros
const ajv = new Ajv();

// Load the JSON schema
const schemaPath = path.join(__dirname, '../manifest.json');
const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
const validate = ajv.compile(schema);

//router.use(bodyParser.urlencoded({ extended: true }));

/* GET Página principal */
router.get('/home', function(req, res){
  var user = retrieve_user_data(req.cookies.cookie_user_data)
  let decoded = jwt.decode(req.cookies.cookie_user_data)
  console.log(decoded)
  console.log(req.cookies)
  console.log(req.cookies.cookie_user_data)
  console.log(user)
  var d = new Date().toISOString().substring(0, 16);

    res.status(200).render('home', {d: d, u: user});
});

/* GET Lista de registos, inclui os filtros e paginação */
router.get('/getInquiricoesList', function (req, res, next) {
  var user = retrieve_user_data(req.cookies.cookie_user_data)
  var d = new Date().toISOString().substring(0, 16);
  var page = parseInt(req.query.page) || 1;
  var limit = 250;

  if(req.query.filter){
    if(req.query.filter === 'fNome'){
      axios.get(`http://localhost:7777/getInquiricoesList?name=${req.query.name}&page=${page}&limit=${limit}`)
      .then(resp => {
        var inquiricoes = resp.data;
        res.status(200).render("inquiricoesList", {u: user, filterType : "name", value : req.query.name, lista: inquiricoes, date: d, page: page})
      })
      .catch(erro => {
        console.log('Erro na listagem de inquiricoes: ' + erro);
        res.status(500).render("error", {error: erro});
      });
    }else if(req.query.filter === 'fLocal'){
      axios.get(`http://localhost:7777/getInquiricoesList?local=${req.query.local}&page=${page}&limit=${limit}`)
      .then(resp => {
        var inquiricoes = resp.data;
        res.status(200).render("inquiricoesList", {u: user, filterType : "local", value : req.query.local, lista: inquiricoes, date: d, page: page})
      })
      .catch(erro => {
        console.log('Erro na listagem de inquiricoes: ' + erro);
        res.status(500).render("error", {error: erro});
      });
    }else if(req.query.filter === 'fData'){
      axios.get(`http://localhost:7777/getInquiricoesList?date=${req.query.date}&page=${page}&limit=${limit}`)
      .then(resp => {
        var inquiricoes = resp.data;
        res.status(200).render("inquiricoesList", {u: user, filterType : "date", value : req.query.date, lista: inquiricoes, date: d, page: page})
      })
      .catch(erro => {
        console.log('Erro na listagem de inquiricoes: ' + erro);
        res.status(500).render("error", {error: erro});
      });
    }
  }else{
    axios.get(`http://localhost:7777/getInquiricoesList?page=${page}&limit=${limit}`)
    .then(resp =>{
      var inquiricoes = resp.data;
      res.status(200).render("inquiricoesList", {u: user, filterType : "Not filtered", value : null, lista: inquiricoes, date: d, page: page})
    })
    .catch(erro => {
      console.log('Erro na listagem de inquiricoes: ' + erro);
      res.status(500).render("error", {error: erro});
    });
  }
});

router.get('/inquiricao/:id', function(req, res){
  var user = retrieve_user_data(req.cookies.cookie_user_data)
  var d = new Date().toISOString().substring(0, 16);
  axios.get(`http://localhost:7777/getInquiricao/${req.params.id}`)
  .then(resp => {
    var inquiricao = resp.data;
    res.status(200).render("inquiricao", {u : user, inquiricao: inquiricao, date: d})
  })
  .catch(erro => {
    console.log('Erro na obtenção da inquiricao: ' + erro);
    res.status(500).render("error", {error: erro});
  });
});

router.get('/addInquiricao',permissions.is_admin, function(req, res){
  var user = retrieve_user_data(req.cookies.cookie_user_data)
  var d = new Date().toISOString().substring(0, 16);
  axios.get('http://localhost:7777/getMaxId')
  .then(resp => {
    res.status(200).render('addInquiricao', {u : user, date: d, newId: parseInt(resp.data)+1})
  })
  .catch(erro => {
    console.log('Erro na obtenção do id da inquiricao: ' + erro);
    res.status(500).render("error", {error: erro});
  });
});

router.post('/addInquiricao', permissions.is_logged, function(req, res){
  const {id, descLevel, unitId, repoCod, coutryCod, title, initDate, endDate, repo, scopeContent, cotaAtual, cotaAntiga, revised, publish, available, creator, created, creatorUsername} = req.body
  const newrevised = revised === "Sim" ? true : false;
  const newpublish = publish === "Sim" ? true : false;
  const newavailable = available === "Sim" ? true : false;
  axios.post('http://localhost:7777/addInquiricao', {_id: parseInt(id), DescriptionLevel: descLevel, CompleteUnitId: unitId, RepositoryCode: repoCod, CountryCode: coutryCod, UnitTitle: title, UnitDateInitial: initDate, UnitDateFinal: endDate, Repository: repo, ScopeContent: scopeContent, PhysLoc: cotaAtual, PreviousLoc: cotaAntiga, Revised: newrevised, Published: newpublish, Available: newavailable, Creator: creator, Created: created, Username: creatorUsername})
  .then(response => {
    console.log('Inquirição adicionada com sucesso');
    res.redirect('/getInquiricoesList');
  })
  .catch(error => {
    console.error('Erro ao adicionar inquirição:', error);
    res.status(500).render("error", {error: error});
  });
});

router.get('/deleteInquiricao/:id', permissions.is_admin, function(req, res){
  axios.delete(`http://localhost:7777/deleteInquiricao/${req.params.id}`)
  .then(response => {
    console.log('Inquirição eliminada com sucesso');
    res.redirect('/getInquiricoesList');
  })
  .catch(error => {
    console.error('Erro ao eliminar inquirição:', error);
    res.redirect('/getInquiricoesList');
  });
});

router.get('/editInquiricao/:id', permissions.is_admin, function(req, res){
  var user = retrieve_user_data(req.cookies.cookie_user_data)
  var d = new Date().toISOString().substring(0, 16);
  axios.get(`http://localhost:7777/getInquiricao/${req.params.id}`)
  .then(resp => {
    var inquiricao = resp.data;
    res.status(200).render("editInquiricao", {u : user, inquiricao: inquiricao, date: d})
  })
  .catch(erro => {
    console.log('Erro na obtenção da inquiricao: ' + erro);
    res.status(500).render("error", {error: erro});
  });
});

router.post('/editInquiricao/:id', permissions.is_admin, function(req, res){
  const {id, descLevel, unitId, repoCod, coutryCod, title, initDate, endDate, repo, scopeContent, cotaAtual, cataAntiga, revised, publish, available, creator, created, creatorUsername} = req.body;
  const newrevised = revised === "Sim" ? true : false;
  const newpublish = publish === "Sim" ? true : false;
  const newavailable = available === "Sim" ? true : false;

  axios.put(`http://localhost:7777/updateInquiricao/${req.params.id}`, {DescriptionLevel: descLevel, CompleteUnitId: unitId, RepositoryCode: repoCod, CountryCode: coutryCod, UnitTitle: title, UnitDateInitial: initDate, UnitDateFinal: endDate, Repository: repo, ScopeContent: scopeContent, PhysLoc: cotaAtual, PreviousLoc: cataAntiga, Revised: newrevised, Published: newpublish, Available: newavailable, Creator: creator, Created: created, Username: creatorUsername})
  .then(response => {
    console.log('Inquirição atualizada com sucesso');
    res.redirect(`/editInquiricao/${req.params.id}`);
  })
  .catch(error => {
    console.error('Erro ao atualizar inquirição:', error);
    res.redirect(`/editInquiricao/${req.params.id}`);
  });
});

router.get('/downloadData', permissions.is_admin, function(req, res) {
  let inquiricoes = [];
  let posts = [];
  let users = [];

  const inquiricoesRequest = axios.get('http://localhost:7777/getAllInquiricoes')
    .then(response => {
      console.log('Dados de inquirições descarregados com sucesso');
      inquiricoes = response.data;
    })
    .catch(error => {
      console.error('Erro ao descarregar dados de inquirições:', error);
    });

  const postsRequest = axios.get('http://localhost:7777/posts/getAllPosts')
    .then(response => {
      console.log('Dados de posts descarregados com sucesso');
      posts = response.data;
    })
    .catch(error => {
      console.error('Erro ao descarregar dados de posts:', error);
    });

  const usersRequest = axios.get('http://localhost:7778/users/getAllUsers')
    .then(response => {
      console.log('Dados de usuários descarregados com sucesso');
      users = response.data;
    })
    .catch(error => {
      console.error('Erro ao descarregar dados de usuários:', error);
    });

  Promise.all([inquiricoesRequest, postsRequest, usersRequest])
    .then(() => {
      console.log('inquiricoes:', inquiricoes);
      console.log('posts:', posts);
      console.log('users:', users);

      const data = { inquiricoes: inquiricoes, posts: posts, users: users };
      const jsonString = JSON.stringify(data, null, 2);

      const filePath = path.join(__dirname, '/../data/data.json');
      fs.writeFile(filePath, jsonString, function(err) {
        if (err) {
          console.error('Error writing file:', err);
          res.status(500).send('Error generating data file');
        } else {
          res.download(filePath);
        }
      });
    })
    .catch(error => {
      console.error('Error waiting for promises:', error);
      res.status(500).send('Error generating data file');
    });
});

router.get('/uploadDataPage', permissions.is_admin, function(req, res) {
  var d = new Date().toISOString().substring(0, 16);
  var user = retrieve_user_data(req.cookies.cookie_user_data)
  res.status(200).render('uploadPage', {u : user, date: d});
});

router.post('/files', permissions.is_admin, upload.single('myFile'), (req, res) => {
  console.log('cdir: ' + __dirname)
  let oldPath = __dirname + '/../' + req.file.path;
  console.log("old: " + oldPath)
  let newPath = __dirname + '/../public/fileStore/' + req.file.originalname
  console.log("new: " + newPath)
  
  fs.rename(oldPath, newPath, function(error){
    if(error) throw error
  })

  // Read and validate the uploaded file
  fs.readFile(newPath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Error reading uploaded file');
      return;
    }

    try {
      const jsonData = JSON.parse(data);
      const valid = validate(jsonData);

      if (!valid) {
        console.log('Validation errors:', validate.errors);
        res.status(400).json({ errors: validate.errors });
      } else {
        console.log('Data is valid!');
        console.log(jsonData);
        //res.status(200).send('File uploaded and validated successfully');

        const deleteInquiricaoReq = axios.delete('http://localhost:7777/deleteAllInquiricoes')
        .then(response => console.log('Inquirições eliminadas com sucesso'))
        .catch(error => console.error('Erro ao eliminar inquirições:', error));

        const deletePostsReq = axios.delete('http://localhost:7777/posts/deleteAllPosts')
        .then(response => console.log('Posts eliminados com sucesso'))
        .catch(error => console.error('Erro ao eliminar posts:', error));

        const deleteusersReq = axios.delete('http://localhost:7778/users/deleteAllUsers')
        .then(response => console.log('Utilizadores eliminados com sucesso'))
        .catch(error => console.error('Erro ao eliminar utilizadores:', error));

        Promise.all([deleteInquiricaoReq, deletePostsReq, deleteusersReq])
        .then(() => {
          console.log('Inquirições, posts e utilizadores eliminados com sucesso');

          const addInquiricoesReq = axios.post('http://localhost:7777/addManyInquiricoes', jsonData.inquiricoes)
          .then(response => console.log('Inquirições adicionadas com sucesso'))
          .catch(error => console.error('Erro ao adicionar inquirições:', error));

          const addPostsReq = axios.post('http://localhost:7777/posts/addManyPosts', jsonData.posts)
          .then(response => console.log('Posts adicionados com sucesso'))
          .catch(error => console.error('Erro ao adicionar posts:', error));

          const addUsersReq = axios.post('http://localhost:7778/users/addManyUsers', jsonData.users)
          .then(response => console.log('Utilizadores adicionados com sucesso'))
          .catch(error => console.error('Erro ao adicionar utilizadores:', error));

          Promise.all([addInquiricoesReq, addPostsReq, addUsersReq])
          .then(() => {
            console.log('Inquirições, posts e utilizadores adicionados com sucesso');
            res.status(200).redirect('/getInquiricoesList');
          })
          .catch(error => {
            console.error('Error adding data:', error);
            res.status(500).send('Error adding data');
          });
        });

      }
    } catch (parseError) {
      res.status(400).send('Invalid JSON format in uploaded file');
    }
  });
});

router.get('/deleteRelation/:inquiricaoId/:relationNome', permissions.is_admin, function(req, res){
  axios.delete(`http://localhost:7777/deleteRelation/${req.params.inquiricaoId}/${req.params.relationNome}`)
  .then(response => {
    console.log('Relação eliminada com sucesso');
    res.redirect(`/editInquiricao/${req.params.inquiricaoId}`);
  })
  .catch(error => {
    console.error('Erro ao eliminar relação:', error);
    res.redirect(`/editInquiricao/${req.params.inquiricaoId}`);
  });
});

router.get('/posts/:id', function(req, res){
  var user = retrieve_user_data(req.cookies.cookie_user_data)
  var d = new Date().toISOString().substring(0, 16);
  var page = parseInt(req.query.page) || 1;
  var limit = 250;

  axios.get(`http://localhost:7777/posts/getPostsList?inquiricaoId=${req.params.id}&page=${page}&limit=${limit}`)
  .then(resp => {
    var post = resp.data;
    res.status(200).render("post", {u : user, posts: post, i: req.params.id, date: d, page: page})
  })
  .catch(erro => {
    console.log('Erro na obtenção do post: ' + erro);
    res.status(500).render("error", {error: erro});
  });
});

router.get('/addPost/:id',permissions.is_logged, function(req, res){
  var user = retrieve_user_data(req.cookies.cookie_user_data)
  var date = new Date().toISOString().substring(0, 16);
  console.log(req.params.id);
  axios.get(`http://localhost:7777/posts/getMaxId`)
  .then(resp => {
    console.log(resp.data);
    newId = parseInt(resp.data)+1;
    console.log(newId);
    res.status(200).render('addPost', {u : user, d: date, inquiricaoId: req.params.id, post_id: newId})
  })
    .catch(erro => {
    console.log('Erro na obtenção do id do post: ' + erro);
    res.status(500).render("error", {error: erro});
  });
});

router.post('/addPost/:id', permissions.is_logged, function(req, res){
  const post_id = req.body.post_id; 
  const title = req.body.Title;
  const content = req.body.Description;
  const inquiricaoId = req.params.id;
  const date = req.body.d; 
  
  axios.post(`http://localhost:7777/posts/addPost/${req.params.id}`, {
    _id: post_id,
    inquiricaoId: inquiricaoId,
    Author: 'jmns',
    Date: date,
    Title: title,
    Description: content,
    Comments: []
  })
  .then(resp => {
    res.status(200).redirect(`/posts/${req.params.id}`);
  })
  .catch(erro => {
    console.log('Erro na adição do post: ' + erro);
    res.status(500).render("error", { error: erro });
  });
});

router.get('/posts/deletePost/:post_id/:inquiricaoId', permissions.is_admin, function(req, res){
  axios.delete(`http://localhost:7777/posts/removePost/${req.params.post_id}/${req.params.inquiricaoId}`)
  .then(resp => {
    res.status(200).redirect(`/posts/${req.params.inquiricaoId}`);
  })
  .catch(erro => {
    console.log('Erro na eliminação do post: ' + erro);
    res.status(500).render("error", {error: erro});
  });
});

router.get('/posts/getComments/:post_id/:inquiricaoId', function(req, res){
  var user = retrieve_user_data(req.cookies.cookie_user_data)
  var d = new Date().toISOString().substring(0, 16);

  axios.get(`http://localhost:7777/posts/getComments/${req.params.post_id}`)
  .then(resp => {
    var comments = resp.data;
    res.status(200).render("comments", {u : user, lista: comments, inquiricaoId : req.params.inquiricaoId, post_id: req.params.post_id, date: d})
  })
  .catch(erro => {
    console.log('Erro na obtenção dos comentários: ' + erro);
    res.status(500).render("error", {error: erro});
  });
});

router.post('/posts/addComments/:post_id/:inquiricaoId', permissions.is_logged,function(req, res){
  const author = req.body.Autor;
  const titulo = req.body.Title;
  const desc = req.body.Description;
  const data = req.body.Date;

  axios.post(`http://localhost:7777/posts/addComment/${req.params.post_id}`, {
    Autor: author,
    Date: data,
    Title: titulo,
    Description: desc
  })
  .then(resp => {
    res.status(200).redirect(`/posts/getComments/${req.params.post_id}/${req.params.inquiricaoId}`);
  })
  .catch(erro => {
    console.log('Erro na adição do comentário: ' + erro);
    res.status(500).render("error", {error: erro});
  });
});

/* GET Página de opções para o Admin */
router.get('/moreOptions', permissions.is_admin, function(req, res){
  var user = retrieve_user_data(req.cookies.cookie_user_data)
  var d = new Date().toISOString().substring(0, 16);
  res.status(200).render('moreOptions', {d: d, u: user, token: false});
});

router.get('/addAdmin', permissions.is_admin, function(req, res){
  var d = new Date().toISOString().substring(0, 16);
  res.status(200).render('addAdmin', {date: d});
});

router.get('/gerirContas', permissions.is_admin, function(req, res){
  var user = retrieve_user_data(req.cookies.cookie_user_data)
  var d = new Date().toISOString().substring(0, 16);
  axios.get('http://localhost:7778/users/get')
  .then(users => {
    console.log(users.data);
    res.status(200).render('usersList', {u : user, lista : users.data, date: d});
  })
  .catch(erro => {
    console.log('Erro na obtenção dos utilizadores: ' + erro);
    res.status(500).render("error", {error: erro});
  });
});

router.get('/editUser/:username', permissions.is_admin, function(req, res){
  var current_user = retrieve_user_data(req.cookies.cookie_user_data)
  var d = new Date().toISOString().substring(0, 16);
  axios.get(`http://localhost:7778/users/get/${req.params.username}`)
  .then(user =>
    res.status(200).render('editUser', {u : current_user, user: user.data, date: d})
  )
  .catch(erro => {
    console.log('Erro na obtenção do utilizador: ' + erro);
    res.status(500).render("error", {error: erro});
  });
});

router.post('/editUser/:username', permissions.is_admin, function(req, res){
  const {id, name, username, password, level, dateCreated, lastAccess} = req.body;
  console.log(req.body);
  axios.put(`http://localhost:7778/users/edit/user/${req.params.username}`, {_id: id, name: name, username: username, password: password, level: level, dateCreated: dateCreated, lastAccess: lastAccess})
  .then(response => {
    console.log('Utilizador atualizado com sucesso');
    res.redirect(`/editUser/${username}`);
  })
  .catch(error => {
    console.error('Erro ao atualizar utilizador:', error);
    res.redirect(`/editUser/${username}`);
  });
});

router.get('/login', function (req, res) {
  var data = new Date().toISOString().substring(0, 16);
  const cookie_user_data = req.cookies.cookie_user_data
  if(cookie_user_data){
      res.redirect('/')
  }else{
      res.render('login', { d: data })
  }
});

router.post('/login', function (req, res) {
  const { username, password } = req.body;

  axios.post(`http://localhost:7778/users/login`, {params: {username: username, password: password}})
  .then(response => {
    if(response.status == 200){
      console.log(`resp: ${response.data}`)
      axios.defaults.headers.common['Authorization'] = response.data.token
      res.cookie('cookie_user_data', response.data)
      res.redirect('/getInquiricoesList')
    }else{
      req.session.error = 'Username ou password incorretos.';
      res.redirect('/login');
    }
    if(response.status == 500){
      req.session.error = 'Username ou password incorretos.';
      res.redirect('/login');
    }
  })
  .catch(error => {
    console.error('Erro ao verificar credenciais:', error);
    res.redirect('/login');
  });
});


/*router.post('/login', function (req, res) {
  const { username, password } = req.body;

  axios.get(`http://localhost:7778/users/get/${username}`)
    .then(response => {
      const user = response.data;
      if (user && user.password === password) { // Simplificação, use hashing para passwords na prática
        // Criar token e definir cookie
        const token = jwt.sign({ username: user }, 'EW2024');
        res.cookie('token', token);
        res.redirect('/getInquiricoesList');
      } else {
        req.session.error = 'Username ou password incorretos.';
        res.redirect('/login');
      }
    })
    .catch(error => {
      console.error('Erro ao verificar credenciais:', error);
      req.session.error = 'Ocorreu um erro. Por favor, tente novamente.';
      res.redirect('/login');
    });
});*/

router.get('/register', function(req, res){
  var data = new Date().toISOString().substring(0,16) 
  const cookie_user_data = req.cookies.cookie_user_data
  if(cookie_user_data){
      res.redirect('/')
  }else{
      res.render('registo', {d: data})
  }
})

router.post('/register', function(req, res){
  console.log(req.body);
  const {name, username, password} = req.body;
  axios.post('http://localhost:7778/users/register', {name: name, username: username, password: password})
  .then(response => {
    if(response.status == 200){
      axios.defaults.headers.common['Authorization'] = response.data.token
      res.cookie('cookie_user_data', response.data)
      res.redirect('/home')
    }else{
      res.render('error', {message: response.message})
    }
  })
  .catch(error => {
    console.error('Erro ao registar utilizador:', error);
    res.redirect('/register');
  });
});

router.get('/logout', function(req, res){
  res.clearCookie('cookie_user_data')
  res.redirect('/home')
});

module.exports = router;



