/*
Código fonte Back end do PIBIC de Pulseiras Inteligentes
Faculdade de Tecnologia - UnB

Este arquivo contém o módulo javascript de roteamento para as chamadas à API nativa para lembretes.

FUNCIONAMENTO:


*/

var express = require('express');
var mysql = require('mysql');
var request = require('request');
var router = express.Router();

//Setup inicial de conecção com a base de dados 	
var connection = mysql.createConnection({
	host : '79.170.40.183',
	user : 'cl19-dbpipibic',
	password : 'XXXXXXXXX',
	database : 'cl19-dbpipibic'
});
connection.connect();

//Ações para alterar tabela Lembrete na base de dados
router.route('/')
	.post(function(req, res) {
		if (req.hasOwnProperty('body') && 
			req.body.hasOwnProperty('data') && 
			req.body.hasOwnProperty('mensagem') &&
			req.body.hasOwnProperty('idMedico')){	
			if (req.body.hasOwnProperty('tarefa') && req.body.tarefa == true) {
				var query = {
					sql:`INSERT INTO Lembrete (idMedico, mensagem, data, tarefa, dataLimite, tarefaConcluida) VALUES (${connection.escape(req.body.idMedico)}, ${connection.escape(req.body.mensagem)}, ${connection.escape(req.body.data)}, ${connection.escape(req.body.tarefa)}, '9999-12-12', 0)`,
					timeout: 10000
				}
				if (req.body.hasOwnProperty('dataLimite')) {
					query = {
						sql:`INSERT INTO Lembrete (idMedico, mensagem, data, tarefa, dataLimite, tarefaConcluida) VALUES (${connection.escape(req.body.idMedico)}, ${connection.escape(req.body.mensagem)}, ${connection.escape(req.body.data)}, ${connection.escape(req.body.tarefa)}, ${connection.escape(req.body.dataLimite)}, 0)`,
						timeout: 10000
					}
				}
			} else {
				var query = {
					sql:`INSERT INTO Lembrete (idMedico, mensagem, data, tarefa, dataLimite, tarefaConcluida) VALUES (${connection.escape(req.body.idMedico)}, ${connection.escape(req.body.mensagem)}, ${connection.escape(req.body.data)}, 0, '9999-12-12', 0)`,
					timeout: 10000
				}
			}
			connection.query(query, function(err, rows, fields) {
				//console.log(err);
				if (err) {
					res.send('Não foi possível adicionar lembrete à base de dados.');
				} else {
					res.send('Lembrete adicionado com sucesso.');
				}
			});
		} else {
			//throw new Error('Parâmetros POST inválidos ou inexistentes para adicionar paciente');
			res.send('Error: Parâmetros POST inválidos ou inexistentes para adicionar lembrete');
		}
	
	})
	.put(function(req, res){
		//TO DO: adicionar conclusão de tarefa caso seja uma tarefa
		var selector = {
			sql:`SELECT * FROM Lembrete WHERE id = ${connection.escape(req.body.idLembrete)} LIMIT 1`,
			timeout: 10000
		}
		console.log(req.body.idLembrete);
		
		connection.query(selector, function(err, rows, fields) {
			
			if (err != null) console.log('Erro ao selecionar lembrete a ser editado na base de dados.');
			else if (rows.length < 1) {
				res.send('O id no header de sua requisição não existe na base de dados.');
			}
			else {
				var mensagemNova,
					dataLimiteNova;
				
				if (req.body.hasOwnProperty('mensagem')) {
					mensagemNova = req.body.mensagem;
				} else { mensagemNova = rows[0].nomePaciente; }
				if (req.body.hasOwnProperty('dataLimite')){
					dataLimiteNova = req.body.dataLimite;
				} else { dataLimiteNova = rows[0].dataLimite; }
		
				connection.query(
				'UPDATE Lembrete SET mensagem=?, dataLimite=? WHERE id=?',
				[mensagemNova, dataLimiteNova, rows[0].id], 
				function(error, results){
				console.log(error);
					if (error != null) {
						res.send('Erro ao alterar lembrete na base de dados');
					} else {
						console.log('Lembrete editado com sucesso.');
					}
				});
			}
		});
		
	})
	.delete(function(req, res) {
		//console.log(req.body.hasOwnProperty('idPaciente'));
		if (req.body.hasOwnProperty('idLembrete')) {
			var deleteLembreteQuery = {
				sql: `DELETE FROM Lembrete WHERE id = ${connection.escape(req.body.idLembrete)} LIMIT 1`,
				timeout: 10000	
			}
			connection.query(deleteLembreteQuery, function(err, rows, fields) {
				if(err) {
					res.send('Houve um erro ao se tentar remover lembrete da base de dados.');
				} else { res.send('O lembrete de id especificado pôde ser removido com sucesso.'); }
			});
		} else {
			res.send('Indique o id do lembrete a ser removido da base.');			
		}
	});
	
router.get('/:idMedico', function(req, res){
	console.log(req.params.hasOwnProperty('idMedico'));
	if (req.params.hasOwnProperty('idMedico')) {
		var getPatientQuery = {
			sql: `SELECT * FROM Lembrete WHERE idMedico = ${connection.escape(req.params.idMedico)}`,
			timeout: 10000	
		}
		connection.query(getPatientQuery, function(err, rows, fields) {
			if(err) {
				res.send('Houve um erro ao se tentar puxar lembretes da base de dados.');
			} else {
				console.log(err);
				console.log(rows);
				//console.log(fields);
				res.json(rows);
			}
		});
	} else {
		res.send('Indique o id do medico cujos lembretes devem ser puxado da base.');			
	}
}); 

// router.get('/check/:idLembrete', function(req,res){
// 	
// });

module.exports = router;