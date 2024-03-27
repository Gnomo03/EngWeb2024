var http = require('http')
var url = require('url')
var axios = require('axios')
var fs = require('fs')

const porta = 2000

//Dicionário de Atores
function construirDicionarioAtores(callback) {
    lerDados((db) => {
        const filmes = db.filmes;
        let dicionarioAtores = {};
        const regexValidaNome = /^([ \u00c0-\u01ffa-zA-Z'\-]+)\s([ \u00c0-\u01ffa-zA-Z'\-]+)$/;

        filmes.forEach(filme => {
            filme.cast.forEach(ator => {
                if (regexValidaNome.test(ator)) {
                    if (!dicionarioAtores[ator]) {
                        dicionarioAtores[ator] = [];
                    }
                    dicionarioAtores[ator].push({ title: filme.title, id: filme._id.$oid });
                }
            });
        });

        callback(dicionarioAtores);
    });
}

//Dicionário de Géneros
function construirDicionarioGeneros(callback) {
    lerDados((db) => {
        const filmes = db.filmes;
        let dicionarioGeneros = {};

        filmes.forEach(filme => {
            (filme.genres ?? []).forEach(genero => {
                if (!dicionarioGeneros[genero]) {
                    dicionarioGeneros[genero] = [];
                }
                dicionarioGeneros[genero].push({ title: filme.title, id: filme._id.$oid });
            });
        });

        callback(dicionarioGeneros);
    });
}


function lerDados(callback) {
    fs.readFile('filmes_corrigido.json', (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                console.error('Arquivo "filmes_corrigido.json" não encontrado. Por favor, execute o programa json_fixer.py primeiro.');
            } else {
                console.error('Erro ao ler o arquivo:', err.message);
            }
            return;
        }
        callback(JSON.parse(data));
    });
}

const server = http.createServer((req,res) => {
    console.log(req.method + " " + req.url);
    const { pathname } = url.parse(req.url, true);
    // GET todos os filmes
    if (req.url == '/filmes') {
        axios.get("http://localhost:3000/filmes")
            .then(resp => {
                var data = resp.data;
                res.writeHead(200, {'Content-Type' : 'text/html;charset=utf-8'});
                res.write('<h1>Filmes</h1><ul>');
                for (let i in data) {
                    res.write("<li><a href='/filmes/" + data[i]._id.$oid + "'>" + data[i].title + "</a></li>");
                }
                res.write('</ul>');
                res.end();
            })
            .catch(erro => {
                res.writeHead(500, {'Content-Type' : 'text/html;charset=utf-8'});
                res.write("<p>Erro: Pedido não suportado</p>");
                res.end();
            });
    }
    // GET informações de um filme em específico
    else if (pathname.startsWith('/filmes/')) {
        const filmeId = pathname.split("/")[2];
        lerDados((db) => {
            const filme = db.filmes.find(f => f._id.$oid === filmeId);
            if (filme) {
                res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' });
                res.write(`<h1>${filme.title}</h1>`);
                res.write(`<p>Ano: ${filme.year}</p>`);
                const elencoLinks = filme.cast.map(ator =>
                    `<a href='/atores/${encodeURI(ator)}'>${ator}</a>`
                ).join(', ');
                res.write(`<p>Elenco: ${elencoLinks}</p>`);
                const generosLinks = filme.genres.map(genero =>
                    `<a href='/generos/${encodeURI(genero)}'>${genero}</a>`
                ).join(', ');
                res.write(`<p>Gêneros: ${generosLinks}</p>`);
    
                res.write('<a href="javascript:history.back()">Voltar</a>');
                res.end();
            } else {
                res.writeHead(404);
                res.end('Filme não encontrado');
            }
        });
    }
    // GET todos os atores
    else if (pathname == '/atores') {
        construirDicionarioAtores((atores) => {
            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
            res.write('<h1>Atores</h1><ul>');
            Object.keys(atores).forEach(ator => {
                res.write(`<li><a href='/atores/${encodeURI(ator)}'>${ator}</a></li>`);
            });
            res.write('</ul>');
            res.end();
        });
    } 
    // GET filmes de um ator específico
    else if (pathname.startsWith('/atores/')) {
        const nomeAtor = decodeURI(pathname.split("/")[2]);
        construirDicionarioAtores((atores) => {
            const filmesAtor = atores[nomeAtor] || [];

            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
            res.write(`<h1>Filmes de ${nomeAtor}</h1><ul>`);
            filmesAtor.forEach(({ title, id }) => {
                res.write(`<li><a href='/filmes/${id}'>${title}</a></li>`);
            });
            res.write('</ul>');
            res.write('<a href="javascript:history.back()">Voltar</a>');
            res.end();
        });
    }
    // GET todos os gêneros
    else if (pathname == '/generos') {
        construirDicionarioGeneros((generos) => {
            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
            res.write('<h1>Gêneros</h1><ul>');
            Object.keys(generos).forEach(genero => {
                res.write(`<li><a href='/generos/${encodeURI(genero)}'>${genero}</a></li>`);
            });
            res.write('</ul>');
            res.end();
        });
    }
    // GET filmes de um gênero específico
    else if (pathname.startsWith('/generos/')) {
        const nomeGenero = decodeURI(pathname.split("/")[2]);
        construirDicionarioGeneros((generos) => {
            const filmesGenero = generos[nomeGenero] || [];

            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
            res.write(`<h1>Filmes de Gênero: ${nomeGenero}</h1><ul>`);
            filmesGenero.forEach(({ title, id }) => {
                res.write(`<li><a href='/filmes/${id}'>${title}</a></li>`);
            });
            res.write('</ul>');
            res.write('<a href="javascript:history.back()">Voltar</a>');
            res.end();
        });
    } else {
        res.writeHead(404);
        res.end('Página não encontrada');
    }
});

const port = 2000;
server.listen(port, () => {
    console.log(`Servidor à escuta na porta ${port}`);
});