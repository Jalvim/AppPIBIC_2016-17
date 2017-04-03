/*
Código fonte Back end do PIBIC de Pulseiras Inteligentes
Faculdade de Tecnologia - UnB

Este arquivo contém o módulo javascript de roteamento para as chamadas à API nativa para grupos de pacientes.

*/

var senhas = require('../senhas');
var express = require('express');
var mysql = require('../lib/mysqlWraper.js');
// var mysql = require('mysql');
var router = express.Router();

router.route('/')
	.post(function(req, res) {
	
		mysql.getConnection(function(err,connection) {
			if (req.hasOwnProperty('body') &&
				req.body.hasOwnProperty('nome') && 
				req.body.hasOwnProperty('idMedico') ){
				var query = {
					sql: `INSERT INTO GrupoPacientes (nome) VALUES (${connection.escape(req.body.nome)})`,
					timeout: 1000
				}

				connection.query(query, function(err, rows, fields) {
					console.log(err);
					console.log(rows);
					console.log(fields);
					if(err == null){
						var queryRelacao = {
							sql:`INSERT INTO GrupoPac_Medico (idGrupoPac, idMedico) VALUES (${rows.insertId}, ${connection.escape(req.body.idMedico)})`,
							timeout: 10000
						}
						connection.query(queryRelacao, function(err, response, body) {
							if(err) {
								res.send('Erro ao adicionar relação entre medico e grupo.');
								connection.query(`DELETE FROM GrupoPacientes WHERE idGrupoPac=${rows.insertId}`);
							} else {
								res.json(rows);
								console.log(err);
								console.log(rows);
								//console.log(fields);
							}
						});
					}
					else{
						res.send("Erro ao criar o grupo. Erro SQL.");
					}

				});
			}
			else {
				res.send('Insira o nome do grupo a ser criado. Erro.');
			}
		});
	})
	.put(function(req, res) {
	
		mysql.getConnection(function(err, connection) {
			if (req.hasOwnProperty('body') &&
				req.body.hasOwnProperty('idGrupoPac') &&
				req.body.hasOwnProperty('nome')){
			
				var selector = {
					sql:`SELECT * FROM GrupoPacientes WHERE idGrupoPac = ${connection.escape(req.body.idGrupoPac)} LIMIT 1`,
					timeout: 10000
					}

				connection.query(selector, function(err, rows, fields) {
			
					if (err != null) console.log('Erro ao selecionar grupo a ser editado na base de dados.');
					else if (rows.length < 1) {
						console.log('Grupo nao encontrado.');
						res.send('Grupo nao encontrado.');
					}
					else {
						console.log(rows);
						var nome;
					
							nome = req.body.nome;
					
						queryString = {
							sql: `UPDATE GrupoPacientes SET nome= '${nome}' WHERE idGrupoPac= ${connection.escape(req.body.idGrupoPac)} LIMIT 1`,
							timeout: 100000
						}
						console.log(queryString.sql);
						connection.query(queryString, function(error, results){
							if (error != null) {
								console.log(error);
								console.log('Erro ao alterar o grupo de pacientes na base de dados');
								res.send('Erro ao alterar o grupo de pacientes na base de dados');
							} else {
								console.log('Grupo de Pacientes editado com sucesso.');
							}

						});
					}
				});
			}
			else {
				res.send('Insira o nome do grupo a ser editado. Erro.');
			}
		});
	})
	.delete(function(req, res) {
	
		mysql.getConnection(function(err, connection) {

			console.log(req.body.hasOwnProperty('idGrupoPac'));
			if (req.body.hasOwnProperty('idGrupoPac')) {
				connection.query(
				  'DELETE FROM GrupoPacientes WHERE idGrupoPac=? LIMIT 1',
				  [req.body.idGrupoPac],
					function(err){
						if (err != null) {
							console.log('Error ao remover Grupo de Pacientes');
							return;
						}
						else{
							console.log('Grupo de pacientes removido com sucesso');
						}
				  });
			} else {
				res.send('Indique o id único do grupo a ser removido da base.');			
			}
		});
	});

router.route('/pacientes/')
	.post(function(req, res) {
	
		mysql.getConnection(function(err, connection){
	
			if (req.hasOwnProperty('body') &&
				req.body.hasOwnProperty('idPaciente') &&
				req.body.hasOwnProperty('idGrupoPac')){
				var query ={
					sql: `INSERT INTO GrupoPac_Paciente (idPaciente, idGrupoPac) VALUES (${connection.escape(req.body.idPaciente)}, ${connection.escape(req.body.idGrupoPac)})`,
					timeout: 1000
				}

				connection.query(query, function(err, rows, fields) {
					console.log(err);
					console.log(rows);
					console.log(fields);
					if(err == null){
						res.send("Paciente adicionado ao grupo com sucesso.");
					}
					else{
						res.send("Erro ao adicionar o paciente ao grupo. Erro SQL.");
					}

				});
			}
			else {
				res.send('Paciente não foi adicionado ao grupo. Erro.');
			}
		});
	})
	.delete(function(req, res) {

		mysql.getConnection(function(err, connection){

			console.log(req.body.hasOwnProperty('idPaciente'));
			if (req,hasOwnProperty('body') &&
				req.body.hasOwnProperty('idPaciente') &&
				req.body.hasOwnProperty('idGrupoPac') ) {
				connection.query(
				  'DELETE FROM GrupoPac_Paciente WHERE idPaciente=? AND idGrupoPac=? LIMIT 1',
				  [req.body.idPaciente, req.body.idGrupoPac],
					function(err){
						if (err != null) {
							console.log('Error ao remover paciente do grupo');
							return;
						}
						else{
							console.log('Paciente removido do grupo com sucesso');
						}
				  });
			} else {
				res.send('Indique o id único do paciente e do grupo a ser removido.');			
			}
		});
	});

	router.route('/pacientes/multiplos')
	.post(function(req, res) {
		
		mysql.getConnection(function(err, connection) {
	
			if (req.hasOwnProperty('body') &&
				req.body.hasOwnProperty('idPaciente') &&
				req.body.hasOwnProperty('idGrupoPac')){

				var values, start_row, new_row;
			
				start_row = `(`+ req.body.idPaciente[0] +` ,`+ req.body.idGrupoPac +` )`;
				values = start_row;

				for (var i = 1; i < req.body.idPaciente.length; i++) {
					values += `, (`+ req.body.idPaciente[i] +` ,`+ req.body.idGrupoPac +` )`;
				}

				var query ={
					sql: `INSERT INTO GrupoPac_Paciente (idPaciente, idGrupoPac) VALUES ` + values,
					timeout: 1000
				}

				connection.query(query, function(err, rows, fields) {
					console.log(err);
					console.log(rows);
					console.log(fields);
					if(err == null){
						res.send("Paciente adicionado ao grupo com sucesso.");
					}
					else{
						res.send("Erro ao adicionar o paciente ao grupo. Erro SQL.");
					}

				});
			}
			else {
				res.send('Paciente não foi adicionado ao grupo. Erro.');
			}
		});
	})

router.route('/medicos/')
	.post(function(req, res) {
	
		mysql.getConnection(function(err, connection) {
	
			if (req.hasOwnProperty('body') &&
				req.body.hasOwnProperty('idMedico') &&
				req.body.hasOwnProperty('idGrupoPac')){
				var query ={
					sql: `INSERT INTO GrupoPac_Medico (idMedico, idGrupoPac) VALUES (${connection.escape(req.body.idMedico)}, ${connection.escape(req.body.idGrupoPac)})`,
					timeout: 1000
				}

				connection.query(query, function(err, rows, fields) {
					console.log(err);
					console.log(rows);
					console.log(fields);
					if(err == null){
						res.send("Paciente adicionado ao grupo com sucesso.");
					}
					else{
						res.send("Erro ao adicionar o paciente ao grupo. Erro SQL.");
					}

				});
			}
			else {
				res.send('Paciente não foi adicionado ao grupo. Erro.');
			}
		});
	})
	.delete(function(req, res) {

		mysql.getConnection(function(err, connection) {

			console.log(req.body.hasOwnProperty('idMedico'));
			if (req,hasOwnProperty('body') &&
				req.body.hasOwnProperty('idMedico') &&
				req.body.hasOwnProperty('idGrupoPac') ) {
				connection.query(
				  'DELETE FROM GrupoPac_Medico WHERE idMedico=? AND idGrupoPac=? LIMIT 1',
				  [req.body.idPaciente, req.body.idGrupoPac],
					function(err){
						if (err != null) {
							console.log('Error ao remover medico responsavel pelo grupo');
							return;
						}
						else{
							console.log('Medico responsavel removido do grupo com sucesso');
						}
				  });
			} else {
				res.send('Indique o id único do Medico responsavel e do grupo a serem desrelacionados.');			
			}
		});
	});
	//Busca de todos os pacientes pertencentes ao grupo desejado
	router.route('/buscarGrupo/paciente/:idGrupoPac/:idMedico')
	.get(function(req, res){
		mysql.getConnection(function(err, connection) {
			if (req.params.hasOwnProperty('idGrupoPac')) {
				var query = {
					sql: `SELECT P.*, M.nome FROM  Paciente P, GrupoPac_Paciente GP, GrupoPac_Medico GM, Medico M WHERE GP.idPaciente	 = P.idtable1 AND GP.idGrupoPac = ${connection.escape(req.params.idGrupoPac)} AND M.idMedico = ${connection.escape(req.params.idMedico)} AND GP.idGrupoPac=GM.idGrupoPac`,//SELECT P.* FROM  Paciente P, GrupoPac_Paciente GP WHERE GP.idPaciente	 = P.idtable1 AND GP.idGrupoPac = ${connection.escape(req.params.idGrupoPac)}`,
					timeout: 10000	
				}
				connection.query(query, function(err, rows, fields) {
					if(err) {
						console.log(err);
						res.send('Não foi possível recuperar os pacientes pertencentes ao grupo. Erro SQL.');
					} else {
						console.log(err);
						console.log(rows);
						//console.log(fields);
						res.json(rows);
					}
				});
			} else {
				res.send('Indique o grupo desejado. Erro');			
			}
		});
	});
router.route('/buscarGrupo/grupo/:nome')
	.get(function(req, res){
		mysql.getConnection(function(err, connection) {

			if (req.params.hasOwnProperty('nome')) {
				var query = {
					sql: `SELECT * FROM  GrupoPacientes WHERE nome LIKE '${connection.escape(req.params.nome)}'`,
					timeout: 10000	
				}
				connection.query(query, function(err, rows, fields) {
					if(err) {
						console.log(err);
						res.send('Não foi possível recuperar o grupo. Erro SQL.');
					} else {
						console.log(err);
						console.log(rows);
						//console.log(fields);
						res.json(rows);
					}
				});
			} else {
				res.send('Indique o grupo desejado. Erro');			
			}
		});
	});

router.get('/buscarGrupo/idMedico/:idMedico', function(req, res){

	mysql.getConnection(function(err, connection){

		console.log(req.params.hasOwnProperty('idMedico'));
		//Primeiramente, o id do Médico é buscado na tabela de GrupoPac_Medicos para obter os seus grupos de pacientes
		if (req.params.hasOwnProperty('idMedico')) {
			var getMedicoQuery = {
				sql: `SELECT GP.idGrupoPac idGrupoPac, GP.nome nomeGrupo, M.nome MedicoResp FROM GrupoPac_Medico GM, GrupoPacientes GP, Medico M WHERE GM.idMedico = ${connection.escape(req.params.idMedico)} AND GM.idGrupoPac = GP.idGrupoPac AND GM.idMedico=M.idMedico`,
				timeout: 10000	
			}
	
			connection.query(getMedicoQuery, function(err, rows, fields) {
				if(err) {
					console.log(err);
					res.send('Houve um erro ao se tentar encontrar o médico com o ID desejado.');
				}
				if(rows.length < 1)	{
					res.send('Não existe grupo associado a este médico com esta ID na base de dados');
				}
				else{
					res.json(rows);
				}
				console.log(err);
				console.log(rows);
				//console.log(fields);
				//Utilizamos o primeiro médico encontrado com o ID único para a próxima etapa
		
			});
		} else {
			res.send('Indique o ID único do médico a ser puxado da base.');			
		}
	});
});

module.exports = router;
