/*
Código fonte Back end do PIBIC de Pulseiras Inteligentes
Faculdade de Tecnologia - UnB

Este arquivo contém o módulo node com a API de chamadas relacionadas à pulseiras inteligentes

Log:
=> Criada tabela de pulseiras na base de dados
=> Mudança de chave estrangeira na tabela autenticação de idPaciente para idPulseira
=> API de pulseiras testada 
=> Adaptações feitas aos métodos OAuth2 de refresh(ainda não testado) e param estáticos

TO DO's:
=> Avaliar e adaptar se necessário API's de paciente e métodos OAuth2 de app.js	
*/

var senhas = require('../senhas');
var express = require('express');
var mysql = require('mysql');
var request = require('request');
var router = express.Router();

//Setup inicial de conecção com a base de dados 	
var connection = mysql.createConnection({
	host : '79.170.40.183',
	user : 'cl19-dbpipibic',
	password : senhas.senha_DB,
	database : 'cl19-dbpipibic'
});
connection.connect();

router.route('/')
// 	.post(function(req,res) {
// 		if (req.body.hasOwnProperty('codigoOAuth') &&
// 			req.body.hasOwnProperty('redirectUri')) {
// 			
// 			var tokenRefreshAuthorization = 'Basic ' + new Buffer(`${senhas.clientID}:${senhas.clientSecret}`).toString('base64');
// 				var oauthOptions = {
// 					method: 'POST',
// 					url: 'https://api.fitbit.com/oauth2/token',
// 					headers: {
// 						'Authorization': tokenRefreshAuthorization
// 					},
// 					form: {
// 						clientId:'227WRB',
// 						grant_type:'authorization_code',
// 						redirect_uri:req.body.redirectUri,
// 						code:req.body.codigoOAuth
// 					}
// 				}
// 				request(oauthOptions, function(error, response, body) {
// 					var temp = JSON.parse(body);
// 					if (temp.hasOwnProperty('errors')) {
// 						res.send('Falha no processo de autenticação ao tentar registrar a pulseira');
// 					} else {
// 						console.log('Pulseira autenticada com sucesso');
// 						connection.query('INSERT INTO Pulseira (disponivel) VALUE (1)',function(err, rows, fields){
// 							if (err) { res.send('Error: Falha ao inserir pulseira na base de dados tabela Pulseira'); }
// 							else {
// 								connection.query(
// 								  'INSERT INTO Autenticacao (idPulseira, userID, refreshToken, accessToken) VALUES (?, ?, ?, ?)',
// 								  [rows.insertId, temp.user_id, temp.refresh_token, temp.access_token],
// 								  function(err) {
// 									if (err) { 
// 										res.send('Error: Falha ao armazenar info na tabela de autenticação'); 
// 										connection.query(`DELETE FROM Pulseira WHERE idPulseira=${rows.insertId}`);
// 									} else {
// 										res.send('Pulseira adicionada com sucesso.');
// 									}
// 								  });
// 							}
// 						});
// 					}
// 				});
// 			
// 		}else {
// 			throw new Error('Parâmetros POST inválidos ou inexistentes para adicionar pulseira');
// 			res.send('Error: Parâmetros POST inválidos ou inexistentes para adicionar pulseira');
// 		}
// 	})
	.put(function(req,res) {
		if (req.body.hasOwnProperty('disponivel') && req.body.hasOwnProperty('idPulseira')) {
			
			connection.query(`SELECT * FROM Pulseira_Paciente WHERE idPulseira=${req.body.idPulseira}`,
			  function(err, rows, fields) {
				
				if (err) { return res.send('Erro: Select SQL não funcionou corretamente'); } 
				  
				if (req.body.hasOwnProperty('idPaciente') && req.body.disponivel == 0) {
					//relaciona paciente à pulseira especificada
					if (rows.length < 1) {
						//Inserir nova linha na tabela
						connection.query(`UPDATE Pulseira SET disponivel=0 WHERE idPulseira=${req.body.idPulseira}`,
						  function(error){
							
							if (error) { return res.send('Error: Não alocou a pulseira corretamente.'); }
							
							connection.query(`SELECT * FROM Paciente_Pulseira WHERE idPulseira=${req.body.idPulseira} AND idPaciente=${req.body.idPaciente}`, function(err, result){
								if (err) { console.log('Erro no select do Paciente_Pulseira'); }
								if (result.length < 1) {
									connection.query(`INSERT INTO Paciente_Pulseira (idPulseira, idPaciente) VALUES (${req.body.idPulseira},${req.body.idPaciente})`);
								}
							});
							
							connection.query(`INSERT INTO Pulseira_Paciente (idPulseira, pacienteAtual) VALUES (${req.body.idPulseira}, ${req.body.idPaciente})`,
							  function(erro){
								  if (erro) { 
								  	connection.query(`UPDATE Pulseira SET disponivel=1 WHERE idPulseira=${req.body.idPulseira}`);
								  	return res.send('Erro_tipo1: Falha no link pulseira paciente'); 
								  }
// 								  connection.query(`UPDATE Paciente SET idPulseira=${req.body.idPulseira} WHERE idtable1=${req.body.idPaciente}`);
								  res.send(`Pulseira de id ${req.body.idPulseira} alocada corretamente ao paciente de id ${req.body.idPaciente}`);
							});
						});
					} else {
						//Update a linha pré-existente na tabela
						connection.query(`UPDATE Pulseira_Paciente SET pacienteAtual= ${req.body.idPaciente}) WHERE idPulseira=${req.body.idPulseira}`,
						  function(erro){
							  if (erro) { return res.send('Error: Pulseira especificado encontra-se em uso! Dê alta ao atual paciente para alocá-la ao próximo.'); }
							  connection.query(`UPDATE Paciente SET idPulseira=${req.body.idPulseira} WHERE idtable1=${req.body.idPaciente}`);
							  res.send(	`Pulseira de id ${req.body.idPulseira} alocada corretamente ao paciente de id ${req.body.idPaciente}`);
						});
					}
				
				} else if (req.body.disponivel == 1){
					//libera pulseira de paciente na tabela Pulseira_Paciente
					if (rows.length < 1) {
						return res.send('Não há paciente a ser removido na pulseira especificada.');
					}
					
					connection.query(`DELETE FROM Pulseira_Paciente WHERE idPulseira=${req.body.idPulseira}`,
					  function(err) {
						if (err) {
							return res.send('Não foi possível remover paciente da pulseira.');
						}
						connection.query(`UPDATE Pulseira SET disponivel=1 WHERE idPulseira=${req.body.idPulseira}`,
						  function(err) {
							if (err) {
								connection.query(`INSERT INTO Pulseira_Paciente (idPulseira, pacienteAtual) VALUE (${req.body.idPulseira}, ${req.body.idPaciente})`);
								return res.send('Error: Não foi possível disponibilizar a pulseira novamente.');
							} 
							res.send('A pulseira foi liberada com sucesso e encontra-se pronta para receber um novo paciente.');						  
						});					
						
					});
				} else {
					res.send('Especificar id de paciente a usar a pulseira.');
				}
			});
		} else {
			res.send('Error: Parâmetros inválidos, inserir id da pulseira especificando disponibilidade e, se disponivel=0(false), indicar id do paciente que vai usar a pulseira.');
		} 
		
	})
	.delete(function(req,res) {
		if (req.body.hasOwnProperty('idPulseira')) {
			connection.query(`DELETE FROM Pulseira WHERE idPulseira=${req.body.idPulseira}`, function(err,rows,fields){
				if (err) return res.send(err);
				res.send('Pulseira deletada com sucesso');
			});
		} else {
			res.send('Não foi possível remover a pulseira, favor especificar id no corpo do pedido');
		}
	}); 
	
router.get('/disponivel', function(req, res){
	connection.query('SELECT idPulseira FROM Pulseira WHERE disponivel=1', function(err, rows) {
		if (err) { return res.send('Erro ao selecionar pulseiras disponiveis na base de dados. '); }
		res.json(rows);
	});
});

router.get('/idPaciente/:pacienteAtual', function(req, res) {
	connection.query('SELECT idPulseira FROM  `Pulseira_Paciente` WHERE pacienteAtual =?', [req.params.pacienteAtual], function(err, rows){
		if (err) { return res.send('Erro ao puxar id de pulseira.'); }
		res.json(rows);
	});
});



/*
Novo método para cadastro de pulseiras na aplicação, acessado pela propria fitbit após autorização
de uso da conta da pulseira pelo usuário.
*/
router.get('/codigo', function(req, res) {

	var tokenRefreshAuthorization = 'Basic ' + new Buffer(`${senhas.clientID}:${senhas.clientSecret}`).toString('base64');
	var oauthOptions = {
		method: 'POST',
		url: 'https://api.fitbit.com/oauth2/token',
		headers: {
			'Authorization': tokenRefreshAuthorization
		},
		form: {
			clientId:'227WRB',
			grant_type:'authorization_code',
			redirect_uri:'http://julianop.com.br:3000/api/pulseira/codigo',
			code:req.query.code
		},
		timeout: 3000
	}
	//request de informações essenciais para puxar dados da fitbit
	request(oauthOptions, function(error, response, body) {
		var temp = JSON.parse(body);
		console.log(temp);
		if (temp.hasOwnProperty('errors')) {
			
			return res.send('Falha no processo de autenticação ao tentar registrar a pulseira');
		}
		console.log('Pulseira autenticada com sucesso');
		
		//verificar se pulseira ja foi cadastrada anteriormente
		connection.query('SELECT * FROM Autenticacao WHERE userID=? LIMIT 1',[temp.user_id], function(err, result, fields){
			
			if (result.length > 0) {
				//atualizar informações de autenticação caso sim
				connection.query('UPDATE Autenticacao SET refreshToken=?, accessToken=? WHERE userID=?',
					[temp.refresh_token, temp.access_token, temp.user_id], function(err){
					
					if (err) { return res.send('Erro: Falha no armazenamento das informações de autenticação.'); }
						
				});
				return;
			}
			
			//adicionar nova pulseira normalmente caso não
			connection.query('INSERT INTO Pulseira (disponivel) VALUE (1)',function(err, rows, fields){
				if (err) { return res.send('Error: Falha ao inserir pulseira na base de dados tabela Pulseira'); }
		
				connection.query(
				  'INSERT INTO Autenticacao (idPulseira, userID, refreshToken, accessToken) VALUES (?, ?, ?, ?)',
				  [rows.insertId, temp.user_id, temp.refresh_token, temp.access_token],
				  function(err) {
					if (err) { 
						res.send('Error: Falha ao armazenar info na tabela de autenticação'); 
						connection.query(`DELETE FROM Pulseira WHERE idPulseira=${rows.insertId}`);
					} else {
						res.send('Pulseira adicionada com sucesso.');
					}
				});
			});
		});
	});
});

module.exports = router;