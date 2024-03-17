const http = require('http');
const fs = require('fs');
const url = require('url');

// Função para ler o arquivo JSON e retornar os dados dos alunos e cursos
function lerDados(callback) {
    fs.readFile('db.json', (err, data) => {
        if (err) throw err;
        callback(JSON.parse(data));
    });
}

// Cria o servidor HTTP
const server = http.createServer((req, res) => {
    const q = url.parse(req.url, true);
    const pathname = q.pathname;

    if (pathname === '/alunos') {
        // Mantém o índice dos alunos como está
        lerDados((db) => {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.write('<h1>Índice de Alunos</h1>');
            res.write('<ul>');
            db.alunos.forEach(aluno => {
                res.write(`<li><a href="/alunos/${aluno.id}">${aluno.nome}</a></li>`);
            });
            res.write('</ul>');
            res.end();
        });
    } else if (pathname.startsWith('/alunos/')) {
        // Perfil do aluno para incluir um link para o curso
        const id = pathname.split('/')[2];
        lerDados((db) => {
            const aluno = db.alunos.find(a => a.id === id);
            if (aluno) {
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                res.write(`<h1>${aluno.nome}</h1>`);
                res.write(`<p><b>Data de Nascimento:</b> ${aluno.dataNasc}</p>`);
                res.write(`<p><b>Curso:</b> <a href="/cursos/${aluno.curso}">${aluno.curso}</a></p>`);
                res.write(`<p><b>Ano do Curso:</b> ${aluno.anoCurso}</p>`);
                res.write(`<p><b>Instrumento:</b> ${aluno.instrumento}</p>`);
                res.write('<a href="/alunos">Voltar</a>');
                res.end();
            } else {
                res.writeHead(404);
                res.end('Aluno não encontrado');
            }
        });
    } else if (pathname.startsWith('/cursos/')) {
        // Perfil do curso
        const cursoId = pathname.split('/')[2];
        lerDados((db) => {
            const curso = db.cursos.find(c => c.id === cursoId);
            if (curso) {
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                res.write(`<h1>${curso.designacao}</h1>`);
                res.write(`<p><b>ID do Curso:</b> ${curso.id}</p>`);
                res.write(`<p><b>Duração:</b> ${curso.duracao} anos</p>`);
                res.write(`<p><b>Instrumento:</b> ${curso.instrumento['#text']} - ${curso.instrumento['id']}</p>`);
                res.write('<a href="javascript:history.back()">Voltar</a>');
                res.end();
            } else {
                res.writeHead(404);
                res.end('Curso não encontrado');
            }
        });
    } else {
        res.writeHead(404);
        res.end('Página não encontrada');
    }
});

// Define a porta e inicia o servidor
const port = 2000;
server.listen(port, () => {
    console.log(`Servidor na porta ${port}`);
});
