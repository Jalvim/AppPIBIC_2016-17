/*
Código fonte Back end do PIBIC de Pulseiras Inteligentes
Faculdade de Tecnologia - UnB

Este arquivo contém o módulo javascript de roteamento para as chamadas à API nativa para medicos.

TO DO:
	=>Completar a endpoint para dados dos perfis de médico GET, PUT e DELETE.

*/

var senhas = require('../senhas.js');
var express = require('express');
var mysql = require('mysql');	
var pug = require('pug');
var mailSender = require('../mailgunWraper.js');
var router = express.Router();

//Setup inicial de conecção com a base de dados 	
var connection = mysql.createConnection({
	host : '79.170.40.183',
	user : 'cl19-dbpipibic',
	password : senhas.senha_DB,
	database : 'cl19-dbpipibic'
});
connection.connect();
//Atributos médicos: 	
/*
idMedico
nome
especialidade
CRM
telefone
*/
router.route('/')
	.post(function(req, res){
		if (req.hasOwnProperty('body') &&
			req.body.hasOwnProperty('email') && 
			req.body.hasOwnProperty('senha')){
			getPatientQuery = {
				sql: `SELECT idMedico FROM logins WHERE (email= ${connection.escape(req.body.email)} AND senha= ${connection.escape(req.body.senha)}) `,
				timeout: 10000	
			}
			connection.query(getPatientQuery, function(err, rows, fields) {
			
				if (rows.length != 1) {res.send('Email ou senha incorretos ou algo a mais deu errado.');}
				else {
					res.json(rows[0]);
					console.log(err);
					console.log(rows);
					//console.log(fields);
				}
			
			});
		} 
	})
	.put(function(req, res) {
		if (req.hasOwnProperty('body') && 
			req.body.hasOwnProperty('email')){
			
			connection.query('SELECT idMedico FROM logins WHERE email=?',[req.body.email], function(err, rows) {
				console.log(rows);
				if (rows.length < 1) {
					return res.send(`O email ${req.body.email} não pertence a nenhuma conta cadastrada.`);
				}
				
				if (rows[0].emailConfirmado != 0) {

					var url = `http://julianop.com.br:3000/api/login/senha/change/${rows[0].idMedico}`;

					var verificationEmail = {
						to: req.body.email,
						subject: 'Mudança de Senha',
						html: `Segue o link para mudança de senha: ${url}`
					}
					mailSender(verificationEmail, function(err, body) {
						if(err){ return res.send('Erro ao enviar email'); }
						res.send('O email solicitado entrou na fila e chegará em breve.');
						console.log(body);
					});
				} else {
					res.send(`Confirme o endereço de email ${req.body.email} para habilitar a mudança de senha.`);
				}
				
			});
				
		} else {
			res.send('Parâmetros inválidos');
		}
	});
	
router.get('/senha/change/:idMedico', function(req, res) {
	connection.query('SELECT * FROM logins WHERE idMedico=?',[req.params.idMedico], function(err,rows){
		if (rows[0].emailConfirmado != 0) {
			res.render('emailMudancaSenha');
		} else {
			res.send('Confirme o email da conta.');
		}
	});
});

router.get('/senha/change/email/:email', function(req, res) {
	connection.query('SELECT * FROM logins WHERE email=?',[req.params.email], function(err,rows){
		if (rows[0].emailConfirmado != 0) {
			res.render('emailMudancaSenha');
		} else {
			res.send('Confirme o email da conta.');
		}
	});
});

router.post('/mudarSenha',function(req,res){
	connection.query('UPDATE logins SET senha=? WHERE senha=? AND email=?',[req.body.novaSenha,req.body.velhaSenha, req.body.email],
		function(err, rows){
		
		if (err) { return res.send('Erro no armazenamento da nova senha.'); }
		
		res.send('Operação efetuada, caso as informações previas de email e senha estejam corretas a senha foi modificada.');
		
	});
});


module.exports = router;







