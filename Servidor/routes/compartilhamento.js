/*
Código fonte Back end do PIBIC de Pulseiras Inteligentes
Faculdade de Tecnologia - UnB

Este arquivo contém o módulo javascript de roteamento para as chamadas à API nativa para grupos de pacientes.

*/

var senhas = require('../senhas');
var express = require('express');
var mysql = require('mysql');
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
	.post(function(req, res) {
		if (req.hasOwnProperty('body') &&
			req.body.hasOwnProperty('idPaciente') &&
			req.body.hasOwnProperty('idHospitalOrigem') &&
			req.body.hasOwnProperty('idMedicoDestino')){

			var queryValidacao = {
				sql: `SELECT idHospital FROM Hospital_Medico WHERE idMedico = ${connection.escape(req.body.idMedicoDestino)} AND idHospital = ${connection.escape(req.body.idHospitalOrigem)}`,
				timeout: 1000

			}

			connection.query(queryValidacao, function(err, rows, fields) {
				console.log(err);
				console.log(rows);
				console.log(fields);
				if(err == null && rows.length >= 1){
					var queryCompartilhar = {
						sql: `INSERT INTO Paciente_Medico (idMedico, idPaciente) VALUES (${connection.escape(req.body.idMedicoDestino)}, idHospital = ${connection.escape(req.body.idHospitalOrigem)})`,
						timeout: 1000

					}
					connection.query(queryCompartilhar, function(err, rows, fields) {
						console.log(err);
						console.log(rows);
						console.log(fields);
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

	module.exports = router;
