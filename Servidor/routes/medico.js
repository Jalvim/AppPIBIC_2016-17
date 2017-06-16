/*
Código fonte Back end do PIBIC de Pulseiras Inteligentes
Faculdade de Tecnologia - UnB

Este arquivo contém o módulo javascript de roteamento para as chamadas à API nativa para medicos.

TO DO:
	=>Completar a endpoint para dados dos perfis de médico GET, PUT e DELETE.
	=> COMENTAR CHAMADAS

*/
var senhas = require('../senhas.js');
var express = require('express');
var mysql = require('../lib/mysqlWraper.js');
// var mysql = require('mysql');
var router = express.Router();	
var mailSender = require('../lib/mailgunWraper.js');


//Atributos médicos: 	
/*
idMedico
nome
especialidade
CRM
telefone
*/
router.route('/')
	.post(function(req, res) {
	
		mysql.getConnection(function(err,connection){
			//TO DO: adicionar novo médico
			if (req.hasOwnProperty('body') &&
				req.body.hasOwnProperty('nomeMedico') && 
				req.body.hasOwnProperty('especialidade') &&
				req.body.hasOwnProperty('CRM') &&
				req.body.hasOwnProperty('telefone') &&
				req.body.hasOwnProperty('email') &&
				req.body.hasOwnProperty('senha') &&
				req.body.hasOwnProperty('CPF')){	
				var query = {
					sql:`INSERT INTO Medico (nome, especialidade, CRM, telefone, CPF) VALUES (${connection.escape(req.body.nomeMedico)}, ${connection.escape(req.body.especialidade)}, ${connection.escape(req.body.CRM)}, ${connection.escape(req.body.telefone)}, ${connection.escape(req.body.CPF)} )`,
					timeout: 10000

				}
				console.log(query.sql);
				connection.query(query, function(err, rows, fields) {
					console.log(err);
					console.log(rows);
					console.log(fields);
					idMedico = rows.insertId;
					if(err == null){
						var query = {
							sql:`INSERT INTO logins (email, senha, idMedico, emailConfirmado) VALUES (${connection.escape(req.body.email)}, ${connection.escape(req.body.senha)}, ${connection.escape(idMedico)}, 0)`,
							timeout: 10000
							}
							connection.query(query, function(err) {
								console.log(err);
								if (err == null){
									res.send("Novo login e médico criado com sucesso.");

									var url = `http://julianop.com.br:3000/api/medico/confirm/${idMedico}`;
									var verificationEmail = {
										to: req.body.email,
										subject: 'Confirmação de Email',
										text: `Este endereço de email foi usado no cadastro de uma nova conta no aplicativo das pulseiras inteligentes.\n\n` +
												`Por favor confirmar seu endereço de email clicando no link abaixo.\n\n` +
												`Caso você seja o proprietário deste email e não tenha realizado o cadastro ignore esta mensagem.`,
										html: `Link para confirmação de email: <a>${url}</a>` 
									}
									mailSender(verificationEmail);
								
								
								}
								else {
									res.send("Médico criado com sucesso, mas erro ao criar login");

									connection.query(`DELETE FROM Medico WHERE idMedico =${connection.escape(idMedico)}`, function(err, rows, fields){

									});
								}

							});
						}
					else{
					
						res.send('Erro ao adicionar o médico');

					}
				});

			
			} else {
				throw new Error('Parâmetros POST inválidos ou inexistentes para tabela Medico');
				res.send('Error: Parâmetros POST inválidos ou inexistentes para adicionar perfil médico');
			}
		});
	})
	.put(function(req, res){
	
		mysql.getConnection(function(err, connection){

			//TO DO: editar perfil médico pré existente
			if (req.hasOwnProperty('body') && 
				req.body.hasOwnProperty('idMedico')){
				var selector = {
					sql:`SELECT M.*, L.email FROM Medico M, logins L WHERE M.idMedico = ${connection.escape(req.body.idMedico)} AND L.idMedico = M.idMedico LIMIT 1`,
					timeout: 10000
					}
				connection.query(selector, function(err, rows, fields) {
			
				if (err != null) console.log('Erro ao selecionar perfil a ser editado na base de dados.');
				else if (rows.length < 1) {
					console.log('Medico nao encontrado.');
					res.send('Medico nao encontrado.');
				}
				else {
					console.log(rows);
					var idMedico,
						nome,
						especialidade,
						CRM,
						telefone,
						CPF,
						email;
				
					if (req.body.hasOwnProperty('idMedico')) {
						idMedico = req.body.idMedico;
					} else { idMedico = rows[0].idMedico; }
					if (req.body.hasOwnProperty('nomeMedico')){
						nome = req.body.nomeMedico;
					} else { nome = rows[0].nome; }
					if (req.body.hasOwnProperty('especialidade')){
						especialidade = req.body.especialidade;
					} else { especialidade = rows[0].especialidade; }
					if (req.body.hasOwnProperty('telefone')){
						telefone = req.body.telefone;
					} else { telefone = rows[0].telefone; }
					if (req.body.hasOwnProperty('CPF')){
						CPF = req.body.CPF;
					} else { CPF = rows[0].CPF; }
					if (req.body.hasOwnProperty('CRM')){
						CRM = req.body.CRM;
					} else { CRM = rows[0].CRM; }
				

					connection.query(
					'UPDATE Medico SET nome=?, especialidade=?, telefone=?, CPF=?, CRM=? WHERE idMedico=? LIMIT 1',
					[nome, especialidade, telefone, CPF, CRM, req.body.idMedico], 
					function(error, results){
						if (error != null) {
							console.log(error);
							console.log('Erro ao alterar perfil de medico na base de dados');
							res.send('Erro ao alterar perfil de medico na base de dados');
						} else {
							connection.query('UPDATE logins SET email=?, emailConfirmado=0 WHERE idMedico=?', 
							[email, req.body.idMedico], function(err) {
							
								if (err) {
									return res.send("Informações de perfil editadas porém houve um problema ao editar email.");
								}
							
								res.send('Medico editado com sucesso.');
						
							});
						}
					});				
				
					if (req.body.hasOwnProperty('email')){
						var url = `http://julianop.com.br:3000/api/medico/confirm/${idMedico}`;
						var verificationEmail = {
							to: req.body.email,
							subject: 'Confirmação de mudança de Email',
							text: `Este endereço de email foi usado no cadastro de uma nova conta no aplicativo das pulseiras inteligentes.\n\n` +
									`Por favor confirmar seu endereço de email clicando no link abaixo.\n\n` +
									`Caso você seja o proprietário deste email e não tenha realizado o cadastro ignore esta mensagem.`,
							html: `Link para confirmação de email: <a>${url}</a>` 
						}
						mailSender(verificationEmail, function(error, body){
							console.log(body);
						});
					
					
						email = req.body.email;
					} else { email = rows[0].email; }

				}
			});


			}
			else{
				res.send('Error: Parâmetros PUT inválidos, escolha perfil pelo id do médico a ser alterado');
			}
		});
	})
	.delete(function(req, res) {
		mysql.getConnection(function(err, connection) {
			//TO DO: Tratar remoção de médicos não existentes.
			console.log(req.body.hasOwnProperty('idMedico'));
			if (req.body.hasOwnProperty('idMedico')) {
				connection.query(
				  'DELETE FROM Medico WHERE idMedico=? LIMIT 1',
				  [req.body.idMedico],
					function(err){
						if (err != null) {
							console.log('Error ao remover perfil de Medico');
							return;
						}
						else{
							console.log('Médico removido com sucesso');
						}
				  });
			} else {
				res.send('Indique o id único de medico a ser removido da base.');			
			}
		});
	});
	
router.route('/busca/email/:emailMedico')
	.get(function(req, res){
	
		mysql.getConnection(function(err, connection) {
		
			var getPatientQuery = {
				sql: `SELECT idMedico FROM logins WHERE email = ${connection.escape(req.params.emailMedico)}`,
				timeout: 10000	
			}
			connection.query(getPatientQuery, function(err, rows, fields) {
				if(err == null) {
					res.json(rows);
				}
				else {
				//Enviar código de erro http
					res.send('Erro ao realizar a busca na base de dados por CRM');
				}
				console.log(err);
				console.log(rows);
				//console.log(fields);
			
			});
		});
	});
	
router.route('/confirm/:idMedico')
	.get(function(req, res){
		
		mysql.getConnection(function(err, connection) {
		
			var getPatientQuery = {
				sql: `UPDATE logins SET emailConfirmado=1 WHERE idMedico=${req.params.idMedico}`,
				timeout: 10000	
			}
			connection.query(getPatientQuery, function(err, rows, fields) {
				if(err == null) {
					res.json('Parabéns! Sua conta foi confirmada com sucesso!');
				}
				else {
				//Enviar código de erro http
					res.send('Erro ao realizar a busca na base de dados por CRM');
				}
				console.log(err);
				console.log(rows);
				//console.log(fields);
			
			});
		});
	});
	
router.route('/busca/ID/:idMedico')
	.get(function(req, res){
	
		mysql.getConnection(function(err, connection) {
	
			if (req.params.idMedico < 0) { res.send('Ids de medicos são estritamente positivos.'); }
			else {
				//Request para encontrar médico na tabela
				var getMedicQuery = {
					sql: `SELECT * FROM Medico WHERE idMedico = ${connection.escape(req.params.idMedico)}`,
					timeout: 10000	
				}
				var response;
				connection.query(getMedicQuery, function(err, rows, fields) {
					if(err == null) {
						response = rows;
					}
					else {
					//Enviar código de erro http
						res.send('Erro ao realizar a busca na base de dados por id do medico');
					}
					console.log(err);
					//console.log(rows);
					//console.log(fields);
			
				});

				var getEmailQuery = {
					sql: `SELECT email FROM logins WHERE idMedico = ${connection.escape(req.params.idMedico)} LIMIT 1`,
					timeout: 1000
				}
				// Query final que envia a resposta dos dados do medico e email
				connection.query(getEmailQuery, function(err, rows, fields) {
					if(err == null) {
						response[0].email = rows[0].email;
						console.log(response);
						res.json(response);
					}
					else {
					//Enviar código de erro http
						res.send('Erro ao realizar a busca na base de dados por id do medico');
					}
					console.log(err);
					console.log(rows[0].email);
					//console.log(fields);
			
				});
			
			
			}
		});
	});


module.exports = router;