/*
Código fonte Back end do PIBIC de Pulseiras Inteligentes
Faculdade de Tecnologia - UnB

Este arquivo contém o módulo javascript de roteamento para as chamadas à API nativa para grupos de pacientes.

*/

var senhas = require('../senhas');
var express = require('express');
var mysql = require('../lib/mysqlWraper.js');
var base64Util = require('../lib/base64Util.js');
var router = express.Router();

router.route('/')
	.get(function(req, res){
		mysql.getConnection(function(err, connection) {
			var query = {
					sql: `SELECT * FROM Equipe`,
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
						res.send("Erro ao buscar a Equipe selecionado. Erro SQL.");
					}
			});
		});
	})
	//Criação de Equipes
	.post(function(req, res) {
		mysql.getConnection(function(err, connection){

			if (req.hasOwnProperty('body') &&
				req.body.hasOwnProperty('nome')){
				var query = {
					sql: `INSERT INTO Equipe (nome) VALUES (${connection.escape(req.body.nome)})`,
					timeout: 1000
				}

				connection.query(query, function(err, rows, fields) {
					console.log(err);
					console.log(rows);
					console.log(fields);
					if(err == null) {
                        // evitando fazer outra query no banco.
                        var createdEquipe = {
                            "nome": req.body.nome,
                            "idEquipe": rows.insertId
                        }
						res.json(createdEquipe);
					}
					else{
						res.send("Erro ao criar o Equipe. Erro SQL.");
					}

				});
			}
			else {
				res.send('Insira o nome do Equipe a ser criado. Erro.');
			}
		});
	})
	//Editar o Nome da Equipe
	.put(function(req, res) {

		mysql.getConnection(function(err, connection) {
			if (req.hasOwnProperty('body') &&
				req.body.hasOwnProperty('idEquipe') &&
				req.body.hasOwnProperty('nome')){

				var selector = {
					sql:`SELECT * FROM Equipe WHERE idEquipe = ${connection.escape(req.body.idEquipe)} LIMIT 1`,
					timeout: 10000
					}

				connection.query(selector, function(err, rows, fields) {

					if (err != null) {
						console.log('Erro ao selecionar Equipe a ser editado na base de dados.');
						res.send('Erro ao selecionar Equipe a ser editado na base de dados.');
					}
					else if (rows.length < 1) {
						console.log('Equipe nao encontrado.');
						res.send('Equipe nao encontrado.');
					}
					else {
						console.log(rows);
						var nome;

							nome = req.body.nome;

						queryString = {
							sql: `UPDATE Equipe SET nome= ${connection.escape(req.body.nome)} WHERE idEquipe= ${connection.escape(req.body.idEquipe)} LIMIT 1`,
							timeout: 100000
						}
						console.log(queryString.sql);
						connection.query(queryString, function(error, results){
							if (error != null) {
								console.log(error);
								console.log('Erro ao alterar o Equipe na base de dados');
								res.send('Erro ao alterar o Equipe de pacientes na base de dados');
							} else {
								console.log('Equipe editado com sucesso.');
								res.send('Equipe editado com sucesso.');
							}

						});
					}
				});
			}
			else {
				res.send('Insira o nome do Equipe a ser editado. Erro.');
			}
		});
	})
	//Remover Equipe
	.delete(function(req, res) {

		mysql.getConnection(function(err, connection) {

			console.log(req.body.hasOwnProperty('idEquipe'));
			if (req.body.hasOwnProperty('idEquipe')) {
				connection.query(
				  'DELETE FROM Equipe WHERE idEquipe=? LIMIT 1',
				  [req.body.idEquipe],
					function(err){
						if (err != null) {
							res.send('Erro ao remover Equipe');
							return;
						}
						else{
							res.send('Equipe removido com sucesso');
						}
				  });
			} else {
				res.send('Indique o id único do Equipe a ser removido da base.');
			}
		});
	});

router.route('/medico/:idMedico')
	.get(function(req, res){

		mysql.getConnection(function (err, connection){

			var getHospitaisMedico = {
				sql: `SELECT Equipe.idEquipe, Equipe.nome FROM Equipe INNER JOIN Equipe_Medico ON Equipe_Medico.idEquipe = Equipe.idEquipe WHERE Equipe_Medico.idMedico =${req.params.idMedico}`,
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

//Operações sobre a tabela Equipe_Paciente, adicionando médicos à equipe.
router.route('/relacoes/medicos')
	.post(function(req, res) {

		mysql.getConnection(function(err, connection) {
			if (req.hasOwnProperty('body') &&
				req.body.hasOwnProperty('idMedico') &&
				req.body.hasOwnProperty('idEquipe')){
				var query ={
					sql: `INSERT INTO Equipe_Medico (idMedico, idEquipe) VALUES (${connection.escape(req.body.idMedico)}, ${connection.escape(req.body.idEquipe)})`,
					timeout: 1000
				}

				connection.query(query, function(err, rows, fields) {
					console.log(err);
					console.log(rows);
					console.log(fields);
					if(err == null){
						res.send("Medico adicionado ao Equipe com sucesso.");
					}
					else{
						res.send("Erro ao adicionar o medico ao Equipe. Erro SQL.");
					}

				});
			}
			else {
				res.send('Medico não foi adicionado ao Equipe. Erro.');
			}
		});
	})
	.delete(function(req, res) {

		mysql.getConnection(function(err, connection) {

			if (req.hasOwnProperty('body') &&
				req.body.hasOwnProperty('idMedico') &&
				req.body.hasOwnProperty('idEquipe') ) {
				connection.query(
				  'DELETE FROM Equipe_medico WHERE idMedico=? AND idEquipe=?',
				  [req.body.idMedico, req.body.idEquipe],
					function(err) {
						if (err != null) {
							console.log('Error ao remover medico do Equipe');
							return res.send('Error ao remover medico do Equipe');
						}
						else {
							console.log('Medico removido do Equipe com sucesso');
							return res.send('Medico removido do Equipe com sucesso');
						}
				  });
			} else {
				return res.send('Indique o id único do Equipe e do medico a ser removido.');
			}
		});
	});

//Operações sobre a tabela Equipe_Paciente, adicionando pacientes à equipe.
	router.route('/relacoes/pacientes')
	.post(function(req, res) {

		mysql.getConnection(function(err, connection) {
			if (req.hasOwnProperty('body') &&
				req.body.hasOwnProperty('idPaciente') &&
				req.body.hasOwnProperty('idEquipe')){
				var query ={
					sql: `INSERT INTO Equipe_Paciente (idMedico, idEquipe) VALUES (${connection.escape(req.body.idPaciente)}, ${connection.escape(req.body.idEquipe)})`,
					timeout: 1000
				}

				connection.query(query, function(err, rows, fields) {
					console.log(err);
					console.log(rows);
					console.log(fields);
					if(err == null){
						res.send("Paciente adicionado ao Equipe com sucesso.");
					}
					else{
						res.send("Erro ao adicionar o paciente ao Equipe. Erro SQL.");
					}

				});
			}
			else {
				res.send('Paciente não foi adicionado ao Equipe. Erro.');
			}
		});
	})
	.delete(function(req, res) {

		mysql.getConnection(function(err, connection) {

			if (req.hasOwnProperty('body') &&
				req.body.hasOwnProperty('idPaciente') &&
				req.body.hasOwnProperty('idEquipe') ) {
				connection.query(
				  'DELETE FROM Equipe_Paciente WHERE idPaciente=? AND idEquipe=?',
				  [req.body.idMedico, req.body.idEquipe],
					function(err) {
						if (err != null) {
							console.log('Error ao remover Paciente do Equipe');
							return res.send('Error ao remover Paciente do Equipe');
						}
						else {
							console.log('Medico removido do Equipe com sucesso');
							return res.send('Medico removido do Equipe com sucesso');
						}
				  });
			} else {
				return res.send('Indique o id único do Equipe e do Paciente a ser removido.');
			}
		});
	});

//Operações sobre a tabela Equipe_Pulseiras, adicionando puleiras à equipe. Ainda não implementado
router.route('/relacoes/pulseiras')
	.post(function(req, res) {

		mysql.getConnection(function(err, connection) {
			if (req.hasOwnProperty('body') &&
				req.body.hasOwnProperty('idPulseira') &&
				req.body.hasOwnProperty('idEquipe')){
				var query ={
					sql: `INSERT INTO Equipe_Pulseira (idPulseira, idEquipe) VALUES (${connection.escape(req.body.idPulseira)}, ${connection.escape(req.body.idEquipe)})`,
					timeout: 1000
				}

				connection.query(query, function(err, rows, fields) {
					console.log(err);
					console.log(rows);
					console.log(fields);
					if(err == null){
						res.send("Pulseira adicionado ao equipe com sucesso.");
					}
					else{
						res.send("Erro ao adicionar o pulseira à equipe. Erro SQL.");
					}

				});
			}
			else {
				res.send('Pulseira não foi adicionado à equipe. Erro.');
			}
		});
	})
	.delete(function(req, res) {

		mysql.getConnection(function(err, connection) {

			if (req.hasOwnProperty('body') &&
				req.body.hasOwnProperty('idPulseira') &&
				req.body.hasOwnProperty('idEquipe') ) {
				connection.query(
				  'DELETE FROM Equipe_Pulseira WHERE Pulseira=? AND idEquipe=?',
				  [req.body.idMedico, req.body.idEquipe],
					function(err) {
						if (err != null) {
							console.log('Error ao remover pulseira da equipe');
							return res.send('Error ao remover pulseira da equipe');
						}
						else {
							console.log('Pulseira removido da equipe com sucesso');
							return res.send('Pulseira removido da equipe com sucesso');
						}
				  });
			} else {
				return res.send('Indique o id único da equipe e da pulseira a ser removido.');
			}
		});
	});


	
router.route('/:idEquipe/medicos')
	.get(function(req, res) {
		mysql.getConnection(function(err, connection) {

			var query = {
				sql: `SELECT * FROM Medico med WHERE med.idMedico IN (SELECT hm.idMedico FROM Equipe_Medico as hm WHERE hm.idEquipe = ${req.params.idEquipe})`,
				timeout: 1000
			}

			connection.query(query, function(error, rows) {
				if (error != null) {
					console.log(error);
					console.log('Erro ao recuperar médicos de um Equipe.');
					res.send('Erro ao recuperar médicos do Equipe.');
				} else {
                    var doctorEmails = rows.map(function(doctor) {
                        return retrieveDoctorEmail(doctor.idMedico);
                    });
                    Promise.all(doctorEmails)
                    .then(emails => {
                        rows.forEach(function(doctor, i) {
                            doctor.email = emails[i];
                            doctor.foto = base64Util.encodeBufferToBase64(doctor.foto);
                        });
                        res.json(rows);
                    });
				}
			});

		});

	});

    retrieveDoctorEmail = function(doctorId) {
        return new Promise(function(resolve, reject) {
            mysql.getConnection(function(err,connection) {
                connection.query('SELECT l.email FROM logins l WHERE l.idMedico = ?',
                    [doctorId], function(error, results) {
                        if(error) reject();
                        resolve(results[0].email);
                    });
            });
        });
    }

	module.exports = router;
