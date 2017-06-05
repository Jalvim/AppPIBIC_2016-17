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
	.get(function(req, res){
		mysql.getConnection(function(err, connection) {
			var query = {
					sql: `SELECT * FROM Hospital`,
					timeout: 1000
				}

			connection.query(query, function(err, rows, fields) {
					console.log(err);
					console.log(rows);
					console.log(fields);
					if(err == null){
						res.json(rows);
					}
					else{
						res.send("Erro ao buscar o hospital selecionado. Erro SQL.");
					}
			});
		});
	}) 
	.post(function(req, res) {
		mysql.getConnection(function(err, connection){
	
			if (req.hasOwnProperty('body') &&
				req.body.hasOwnProperty('nome')){
				var query = {
					sql: `INSERT INTO Hospital (nome) VALUES (${connection.escape(req.body.nome)})`,
					timeout: 1000
				}

				connection.query(query, function(err, rows, fields) {
					console.log(err);
					console.log(rows);
					console.log(fields);
					if(err == null){
						res.send(rows[0]);
					}
					else{
						res.send("Erro ao criar o hospital. Erro SQL.");
					}

				});
			}
			else {
				res.send('Insira o nome do hospital a ser criado. Erro.');
			}
		});
	})
	.put(function(req, res) {
			
		mysql.getConnection(function(err, connection) {	
			if (req.hasOwnProperty('body') &&
				req.body.hasOwnProperty('idHospital') &&
				req.body.hasOwnProperty('nome')){
			
				var selector = {
					sql:`SELECT * FROM Hospital WHERE idHospital = ${connection.escape(req.body.idHospital)} LIMIT 1`,
					timeout: 10000
					}

				connection.query(selector, function(err, rows, fields) {
			
					if (err != null) console.log('Erro ao selecionar hospital a ser editado na base de dados.');
					else if (rows.length < 1) {
						console.log('Hospital nao encontrado.');
						res.send('Hospital nao encontrado.');
					}
					else {
						console.log(rows);
						var nome;
					
							nome = req.body.nome;
					
						queryString = {
							sql: `UPDATE Hospital SET nome= '${nome}' WHERE idHospital= ${connection.escape(req.body.idHospital)} LIMIT 1`,
							timeout: 100000
						}
						console.log(queryString.sql);
						connection.query(queryString, function(error, results){
							if (error != null) {
								console.log(error);
								console.log('Erro ao alterar o hospital na base de dados');
								res.send('Erro ao alterar o hospital de pacientes na base de dados');
							} else {
								console.log('Hospital editado com sucesso.');
							}

						});
					}
				});
			}
			else {
				res.send('Insira o nome do hospital a ser editado. Erro.');
			}
		});
	})
	.delete(function(req, res) {
		
		mysql.getConnection(function(err, connection) {
		
			console.log(req.body.hasOwnProperty('idHospital'));
			if (req.body.hasOwnProperty('idHospital')) {
				connection.query(
				  'DELETE FROM Hospital WHERE idHospital=? LIMIT 1',
				  [req.body.idHospital],
					function(err){
						if (err != null) {
							console.log('Erro ao remover hospital');
							return;
						}
						else{
							console.log('Hospital removido com sucesso');
						}
				  });
			} else {
				res.send('Indique o id único do hospital a ser removido da base.');			
			}
		});
	});

router.route('/medico/:idMedico')
	.get(function(req, res){ 

		mysql.getConnection(function (err, connection){

			var getHospitaisMedico = {
				sql: `SELECT Hospital.idHospital, Hospital.nome FROM Hospital INNER JOIN Hospital_Medico ON Hospital_Medico.idHospital = Hospital.idHospital WHERE Hospital_Medico.idMedico =${req.params.idMedico}`,
				timeout: 10000	
			}
			
			if (err) throw err;
			connection.query(getHospitaisMedico, function(err, rows, fields) {
				if(err == null) {
					res.json(rows);
				}
				else {
				//Enviar código de erro http
					res.send('Erro ao realizar a busca na base de dados, informe id do médico desejado');
				}
				console.log(err);
				console.log(rows);
				//console.log(fields);
			
			});
		});
	});

router.route('/relacoes/')
	.post(function(req, res) {

		mysql.getConnection(function(err, connection) {
			if (req.hasOwnProperty('body') &&
				req.body.hasOwnProperty('idMedico') &&
				req.body.hasOwnProperty('idHospital')){
				var query ={
					sql: `INSERT INTO Hospital_Medico (idMedico, idHospital) VALUES (${connection.escape(req.body.idMedico)}, ${connection.escape(req.body.idHospital)})`,
					timeout: 1000
				}

				connection.query(query, function(err, rows, fields) {
					console.log(err);
					console.log(rows);
					console.log(fields);
					if(err == null){
						res.send("Medico adicionado ao Hospital com sucesso.");
					}
					else{
						res.send("Erro ao adicionar o medico ao hospital. Erro SQL.");
					}

				});
			}
			else {
				res.send('Medico não foi adicionado ao Hospital. Erro.');
			}
		});
	})
	.delete(function(req, res) {

		mysql.getConnection(function(err, connection) {

			console.log(req.body.hasOwnProperty('idMedico'));
			if (req.hasOwnProperty('body') &&
				req.body.hasOwnProperty('idMedico') &&
				req.body.hasOwnProperty('idHospital') ) {
				connection.query(
				  'DELETE FROM Hospital_Medico WHERE idMedico=? AND idHospital=? LIMIT 1',
				  [req.body.idMedico, req.body.idGrupoPac],
					function(err){
						if (err != null) {
							console.log('Error ao remover medico do hospital');
							return;
						}
						else{
							console.log('Medico removido do hospital com sucesso');
						}
				  });
			} else {
				res.send('Indique o id único do hospital e do medico a ser removido.');			
			}
		});
	});

	module.exports = router;