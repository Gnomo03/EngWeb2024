var http = require('http')
var axios = require('axios')
const { parse } = require('querystring');

var templates = require('./templates')          // Necessario criar e colocar na mesma pasta
var static = require('./static.js')             // Colocar na mesma pasta

// Aux functions
function collectRequestBodyData(request, callback) {
    if(request.headers['content-type'] === 'application/x-www-form-urlencoded') {
        let body = '';
        request.on('data', chunk => {
            body += chunk.toString();
        });
        request.on('end', () => {
            callback(parse(body));
        });
    }
    else {
        callback(null);
    }
}

// Server creation

var composersServer = http.createServer((req, res) => {
    // Logger: what was requested and when it was requested
    var d = new Date().toISOString().substring(0, 16)
    console.log(req.method + " " + req.url + " " + d)

    // Handling request
    if(static.staticResource(req)){
        static.serveStaticResource(req, res)
    }
    else{
        switch(req.method){
            case "GET": 
                // GET /compositores --------------------------------------------------------------------
                if(req.url == '/' || req.url == '/compositores'){
                    axios.get("http://localhost:3000/compositores?_sort=nome")
                        .then(resp =>{
                            composers = resp.data
                            res.writeHead(200, {'Content-Type' : 'text/html; charset=utf-8'})
                            res.write(templates.composersListPage(composers, d))
                            res.end()
                        })
                        .catch(erro => {
                            res.writeHead(503, {'Content-Type' : 'text/html; charset=utf-8'})
                            res.write("<p>Não foi possível obter lista de compositores: " +erro+ "</p>")
                            res.end()
                        })
                }
                // GET /compositores/{id} --------------------------------------------------------------------
                else if(/\/compositores\/(C)[0-9]+$/i.test(req.url)){
                    id = req.url.split('/')[2]
                    axios.get("http://localhost:3000/compositores/" + id)
                    .then(resp =>{
                        composer = resp.data
                        res.writeHead(200, {'Content-Type' : 'text/html; charset=utf-8'})
                        res.write(templates.composersPage(composer, d))
                        res.end()
                    })
                    .catch(erro => {
                        res.writeHead(504, {'Content-Type' : 'text/html; charset=utf-8'})
                        res.write("<p>Não foi possível obter a informação do compositor " +id+ " : " +erro+ "</p>")
                        res.end()
                    })
                }
                // GET /compositores?periodo={periodo} --------------------------------------------------------------------
                else if(req.url.startsWith('/compositores?periodo=')){
                    const periodo = req.url.split('=')[1]; // Extracting the periodo value from the query string
                    axios.get(`http://localhost:3000/compositores?periodo=${periodo}`)
                        .then(resp => {
                            const composers = resp.data;
                            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                            res.write(templates.composersPeriodPage(composers, periodo, d)); // Assuming you have a template for this
                            res.end();
                        })
                        .catch(error => {
                            res.writeHead(503, {'Content-Type': 'text/html; charset=utf-8'});
                            res.write(`<p>Não foi possível obter a lista de compositores do período ${periodo}: ${error}</p>`);
                            res.end();
                        });
                }
                // GET /compositores/registo --------------------------------------------------------------------
                else if(req.url == '/compositores/registo'){
                    axios.get("http://localhost:3000/compositores")
                    .then(resp => {
                        let maxIdNum = 0; // Inicializa o maior número de ID como 0
                        resp.data.forEach(compositor => {
                            const idNum = parseInt(compositor.id.substring(1)); // Remove o prefixo "C" e converte para número
                            if (idNum > maxIdNum) {
                                maxIdNum = idNum; // Atualiza o maxIdNum se o idNum atual for maior
                            }
                        });
                        const newId = `C${maxIdNum + 1}`; // Formata o novo ID incrementando o maxIdNum
                        res.writeHead(200, {'Content-Type' : 'text/html; charset=utf-8'})
                        res.write(templates.composersFormPage(newId, d)) // Passa o novo ID para a página do formulário
                        res.end()                    
                    })
                    .catch(error => {
                        console.log("Erro ao obter compositores: ", error);
                        res.writeHead(500, {'Content-Type' : 'text/html; charset=utf-8'});
                        res.write("<p>Erro ao obter a lista de compositores.</p>");
                        res.end();
                    });
                }
                // GET /compositores/edit/:id --------------------------------------------------------------------
                else if(/\/compositores\/edit\/(C)[0-9]+$/i.test(req.url)){
                    id = req.url.split('/')[3]
                    axios.get("http://localhost:3000/compositores/" + id)
                    .then(resp =>{
                        composer = resp.data
                        res.writeHead(200, {'Content-Type' : 'text/html; charset=utf-8'})
                        res.write(templates.composerFormEditPage(composer,d))
                        res.end()
                    })
                    .catch(erro => {
                        res.writeHead(505, {'Content-Type' : 'text/html; charset=utf-8'})
                        res.write("<p>Não foi possível obter a informação do compositor " +id+ " : " +erro+ "</p>")
                        res.end()
                    })
                }
                // GET /compositores/delete/:id --------------------------------------------------------------------
                else if(/\/compositores\/delete\/(C)[0-9]+$/i.test(req.url)){
                    id = req.url.split('/')[3]
                    axios.delete("http://localhost:3000/compositores/" + id)
                    .then(resp =>{
                        composer = resp.data
                        res.writeHead(200, {'Content-Type' : 'text/html; charset=utf-8'})
                        res.write("<p>Registo Apagado: " +id+ "</p>")
                        res.end()
                    })
                    .catch(erro => {
                        res.writeHead(510, {'Content-Type' : 'text/html; charset=utf-8'})
                        res.write("<p>Não foi possível eliminar a informação do compositor " +id+ " : " +erro+ "</p>")
                        res.end()
                    })
                }
                // GET /periodos --------------------------------------------------------------------
                else if(req.url == '/' || req.url == '/periodos'){
                    axios.get("http://localhost:3000/periodos?_sort=id")
                        .then(resp =>{
                            p = resp.data
                            res.writeHead(200, {'Content-Type' : 'text/html; charset=utf-8'})
                            res.write(templates.periodsListPage(p, d))
                            res.end()
                        })
                        .catch(erro => {
                            res.writeHead(520, {'Content-Type' : 'text/html; charset=utf-8'})
                            res.write("<p>Não foi possível obter lista de compositores: " +erro+ "</p>")
                            res.end()
                        })
                }
                // GET /periodos/{id} --------------------------------------------------------------------
                else if(/\/periodos\/(P)[0-9]+$/i.test(req.url)){
                    id = req.url.split('/')[2]
                    axios.get("http://localhost:3000/periodos/" + id)
                    .then(resp =>{
                        period = resp.data
                        res.writeHead(200, {'Content-Type' : 'text/html; charset=utf-8'})
                        res.write(templates.periodsPage(period, d))
                        res.end()
                    })
                    .catch(erro => {
                        res.writeHead(504, {'Content-Type' : 'text/html; charset=utf-8'})
                        res.write("<p>Não foi possível obter a informação do compositor " +id+ " : " +erro+ "</p>")
                        res.end()
                    })
                }
                // GET /periodos/edit/:id --------------------------------------------------------------------
                else if(/\/periodos\/edit\/(P)[0-9]+$/i.test(req.url)){
                    id = req.url.split('/')[3]
                    axios.get("http://localhost:3000/periodos/" + id)
                    .then(resp =>{
                        period = resp.data
                        res.writeHead(200, {'Content-Type' : 'text/html; charset=utf-8'})
                        res.write(templates.periodFormEditPage(period,d))
                        res.end()
                    })
                    .catch(erro => {
                        res.writeHead(505, {'Content-Type' : 'text/html; charset=utf-8'})
                        res.write("<p>Não foi possível obter a informação do periodo " +id+ " : " +erro+ "</p>")
                        res.end()
                    })
                }
                // GET /periodos/registo --------------------------------------------------------------------
                else if(req.url == '/periodos/registo'){
                    axios.get("http://localhost:3000/periodos")
                    .then(resp => {
                        let maxIdNum = 0; // Inicializa o maior número de ID como 0
                        resp.data.forEach(periodo => {
                            const idNum = parseInt(periodo.id.substring(1)); // Remove o prefixo "C" e converte para número
                            if (idNum > maxIdNum) {
                                maxIdNum = idNum; // Atualiza o maxIdNum se o idNum atual for maior
                            }
                        });
                        const newId = `P${maxIdNum + 1}`; // Formata o novo ID incrementando o maxIdNum
                        res.writeHead(200, {'Content-Type' : 'text/html; charset=utf-8'})
                        res.write(templates.periodsFormPage(newId, d)) // Passa o novo ID para a página do formulário
                        res.end()                    
                    })
                    .catch(error => {
                        console.log("Erro ao obter periodos: ", error);
                        res.writeHead(500, {'Content-Type' : 'text/html; charset=utf-8'});
                        res.write("<p>Erro ao obter a lista de periodos.</p>");
                        res.end();
                    });
                }
                // GET /periodos/delete/:id --------------------------------------------------------------------
                else if(/\/periodos\/delete\/(P)[0-9]+$/i.test(req.url)){
                    id = req.url.split('/')[3]
                    axios.delete("http://localhost:3000/periodos/" + id)
                    .then(resp =>{
                        composer = resp.dataperiodosperiodos
                        res.writeHead(200, {'Content-Type' : 'text/html; charset=utf-8'})
                        res.write("<p>Registo Apagado: " +id+ "</p>")
                        res.end()
                    })
                    .catch(erro => {
                        res.writeHead(510, {'Content-Type' : 'text/html; charset=utf-8'})
                        res.write("<p>Não foi possível eliminar a informação do periodo " +id+ " : " +erro+ "</p>")
                        res.end()
                    })
                }
                // GET ? -> Lancar um erro
                else{
                    res.writeHead(502, {'Content-Type' : 'text/html; charset=utf-8'})
                    res.write("<p>GET Request não suportado: " +req.method+ "</p>")
                    res.end()
                }
                break
            case "POST":
                // POST /compositores/registo --------------------------------------------------------------------
                if(req.url == '/compositores/registo'){
                    collectRequestBodyData(req, result => {
                        if (result){
                            console.log(result)
                            axios.post("http://localhost:3000/compositores/", result)
                            .then(resp =>{
                                res.writeHead(200, {'Content-Type' : 'text/html; charset=utf-8'})
                                res.write("<p>Página inserido: " +JSON.stringify(resp.data)+ "</p>")
                                axios.get("http://localhost:3000/periodos", result)
                                res.end()
                            })
                            .catch(erro => {
                                res.writeHead(507, {'Content-Type' : 'text/html; charset=utf-8'})
                                res.write(templates.errorPage("Não foi possível editar...", d))
                                res.end()
                            })
                        }else{
                            res.writeHead(506, {'Content-Type' : 'text/html; charset=utf-8'})
                            res.write("<p>Não foi possível os dados do body</p>")
                            res.end()
                        }
                    })
                }
                // POST /compositores/edit/:id --------------------------------------------------------------------
                else if(/\/compositores\/edit\/(C)[0-9]+$/i.test(req.url)){
                    collectRequestBodyData(req, result => {
                        if (result){
                            console.log(result)
                            axios.put("http://localhost:3000/compositores/" + result.id, result)
                            .then(resp =>{
                                res.writeHead(200, {'Content-Type' : 'text/html; charset=utf-8'})
                                res.write("<p>Página alterada com sucesso: " +JSON.stringify(resp.data)+ "</p>")
                                res.end()
                            })
                            .catch(erro => {
                                res.writeHead(507, {'Content-Type' : 'text/html; charset=utf-8'})
                                res.write(templates.errorPage("Não foi possível editar os dados...", d))
                                res.end()
                            })
                        }else{
                            res.writeHead(506, {'Content-Type' : 'text/html; charset=utf-8'})
                            res.write("<p>Não foi possível os dados do body</p>")
                            res.end()
                        }
                    })
                }
                // POST /periodos/registo --------------------------------------------------------------------
                else if(req.url == '/periodos/registo'){
                    collectRequestBodyData(req, result => {
                        if (result){
                            console.log(result)
                            axios.post("http://localhost:3000/periodos/", result)
                            .then(resp =>{
                                res.writeHead(200, {'Content-Type' : 'text/html; charset=utf-8'})
                                res.write("<p>Página inserido: " +JSON.stringify(resp.data)+ "</p>")
                                res.end()
                            })
                            .catch(erro => {
                                res.writeHead(507, {'Content-Type' : 'text/html; charset=utf-8'})
                                res.write(templates.errorPage("Não foi possível editar...", d))
                                res.end()
                            })
                        }else{
                            res.writeHead(506, {'Content-Type' : 'text/html; charset=utf-8'})
                            res.write("<p>Não foi possível os dados do body</p>")
                            res.end()
                        }
                    })
                }
                // POST /periodos/edit/:id --------------------------------------------------------------------
                else if(/\/periodos\/edit\/(P)[0-9]+$/i.test(req.url)){
                    collectRequestBodyData(req, result => {
                        if (result){
                            console.log(result)
                            axios.put("http://localhost:3000/periodos/" + result.id, result)
                            .then(resp =>{
                                res.writeHead(200, {'Content-Type' : 'text/html; charset=utf-8'})
                                res.write("<p>Página alterada com sucesso: " +JSON.stringify(resp.data)+ "</p>")
                                res.end()
                            })
                            .catch(erro => {
                                res.writeHead(507, {'Content-Type' : 'text/html; charset=utf-8'})
                                res.write(templates.errorPage("Não foi possível editar os dados...", d))
                                res.end()
                            })
                        }else{
                            res.writeHead(506, {'Content-Type' : 'text/html; charset=utf-8'})
                            res.write("<p>Não foi possível os dados do body</p>")
                            res.end()
                        }
                    })
                }
                else{
                    res.writeHead(501, {'Content-Type' : 'text/html; charset=utf-8'})
                    res.write("<p>POST Request não suportado: " +req.method+ "</p>")
                    res.end()
                }
                break
                // POST ? -> Lancar um erro
            default: 
                // Outros metodos nao sao suportados
                res.writeHead(500, {'Content-Type' : 'text/html; charset=utf-8'})
                res.write("<p>Método não suportado: " +req.method+ "</p>")
                res.end()
                break
        }
    }
})

composersServer.listen(2000, ()=>{
    console.log("Servidor à escuta na porta 2000...")
})



