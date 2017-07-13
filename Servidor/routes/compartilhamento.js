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

router.route('/paciente/')
	.post(function(req, res) {
	
		mysql.getConnection(function(err, connection) {
	
			if (req.hasOwnProperty('body') &&
				req.body.hasOwnProperty('idPaciente') &&
				req.body.hasOwnProperty('idEquipeOrigem') &&
				req.body.hasOwnProperty('idMedicoDestino')){

				var queryValidacao = {
					sql: `SELECT EM.idEquipe FROM Equipe_Medico EM WHERE idMedico = ${connection.escape(req.body.idMedicoDestino)} AND idEquipe = ${connection.escape(req.body.idEquipeOrigem)}`,
					timeout: 1000

				}

				connection.query(queryValidacao, function(err, rows, fields) {
					console.log(err);
					console.log(rows);
					console.log(fields);
					console.log(queryValidacao);
					if(err == null && rows.length >= 1){
						var queryCompartilhar = {
							sql: `INSERT INTO Paciente_Medico (idMedico, idPaciente) VALUES (${connection.escape(req.body.idMedicoDestino)}, ${connection.escape(req.body.idPaciente)})`,
							timeout: 1000

						}
						connection.query(queryCompartilhar, function(err, rows, fields) {
							console.log(err);
							console.log(rows);
							console.log(fields);
							console.log(queryCompartilhar);
							if(err == null ){
								res.send("Paciente compartilhado com sucesso.");
							}
							else{
								res.send("Erro ao compartilhar paciente. Erro SQL.");
							}
						});
					}
					else{
						res.send("Erro ao compartilhar paciente. Erro SQL.");
					}

				});
			}
			else {
				res.send('Insira o paciente a ser compartilhado e o médico desejado. Erro.');
			}
		});
	});

router.route('/grupo/')
	.post(function(req, res) {
	
		mysql.getConnection(function(err, connection) {
	
			if (req.hasOwnProperty('body') &&
				req.body.hasOwnProperty('idGrupoPac') &&
				req.body.hasOwnProperty('idHospitalOrigem') &&
				req.body.hasOwnProperty('idMedicoDestino')){

				var queryValidacao = {
					sql: `SELECT HM.idHospital FROM Hospital_Medico HM WHERE idMedico = ${connection.escape(req.body.idMedicoDestino)} AND idHospital = ${connection.escape(req.body.idHospitalOrigem)}`,
					timeout: 1000

				}

				connection.query(queryValidacao, function(err, rows, fields) {
					console.log(err);
					console.log(rows);
					console.log(fields);
					console.log(queryValidacao);
					if(err == null && rows.length >= 1){
						var queryCompartilhar = {
							sql: `INSERT INTO GrupoPac_Medico (idMedico, idGrupoPac) VALUES (${connection.escape(req.body.idMedicoDestino)}, ${connection.escape(req.body.idGrupoPac)})`,
							timeout: 1000

						}
						connection.query(queryCompartilhar, function(err, rows, fields) {
							console.log(err);
							console.log(rows);
							console.log(fields);
							console.log(queryCompartilhar);
							if(err == null ){
								res.send("Grupo compartilhado com sucesso.");
							}
							else{
								res.send("Erro ao compartilhar Grupo. Erro SQL.");
							}
						});
					}
					else{
						res.send("Erro ao compartilhar Grupo. Erro SQL.");
					}

				});
			}
			else {
				res.send('Insira o Grupo a ser compartilhado e o médico desejado. Erro.');
			}
		});
	});
	
module.exports = router;
