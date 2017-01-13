/*
Código fonte Back end do PIBIC de Pulseiras Inteligentes
Faculdade de Tecnologia - UnB

Este arquivo contém o módulo javascript de roteamento para as chamadas à API nativa para medicos.

TO DO:
	=>Completar a endpoint para dados dos perfis de médico GET, PUT e DELETE.

*/

var express = require('express');
var mysql = require('mysql');
var router = express.Router();

//Setup inicial de conecção com a base de dados 	
var connection = mysql.createConnection({
	host : '79.170.40.183',
	user : 'cl19-dbpipibic',
	password : 'XXXXXXXXXXXX',
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
	.get(function(req, res){
		//TO DO: selecionar perfis médicos
	}) 
	.post(function(req, res) {
		//TO DO: adicionar novo médico
		if (req.hasOwnProperty('body') && 
			req.body.hasOwnProperty('idMedico') &&
			req.body.hasOwnProperty('nome') && 
			req.body.hasOwnProperty('especialidade') &&
			req.body.hasOwnProperty('CRM') &&
			req.body.hasOwnProperty('telefone')){	
			var query = {
				sql:`INSERT INTO Medico (idMedico, nome, especialidade, CRM, telefone) VALUES (${connection.escape(req.body.idMedico)}, ${connection.escape(req.body.nome)}, ${connection.escape(req.body.especialidade)}, ${connection.escape(req.body.CRM)}, ${connection.escape(req.body.telefone)})`,
				timeout: 10000
			}
			connection.query(query, function(err, rows, fields) {
				console.log(err);
				console.log(rows);
				console.log(fields);
			});
			res.send('Novo perfil médico adicionado com sucesso!');
		} else {
			throw new Error('Parâmetros POST inválidos ou inexistentes para tabela Medico');
			res.send('Error: Parâmetros POST inválidos ou inexistentes para adicionar perfil médico');
		}
	})
	.put(function(req, res){
		//TO DO: editar perfil médico pré existente
	})
	.delete(function(req, res) {
		//TO DO: remover perfil médico da base de dados
		console.log(req.body.hasOwnProperty('idMedico'));
		if (req.body.hasOwnProperty('idMedico')) {
			connection.query(
			  'DELETE FROM Medico WHERE idMedico=?',
			  [req.body.idMedico],
			  function(err){
			  	if (err) {
			  		console.log('Error ao remover perfil de Medico');
			  		return;
			  	}
			  	var deleteMedicoQuery = {
					sql: `DELETE FROM Medico WHERE idMedico = ${connection.escape(req.body.idMedico)} LIMIT 1`,
					timeout: 10000	
				}
				connection.query(deleteMedicoQuery, function(err, rows, fields) {
					if(err) {
						res.send('Houve um erro ao se tentar remover Medico da base de dados.');
					} else { res.send('O Medico de id especificado pôde ser removido com sucesso.'); }
				});
			  });
		} else {
			res.send('Indique o id únicod e medico a ser removido da base.');			
		}
	});
	
	router.route('/busca/CRM/:crmMedico')
	.get(function(req, res){
		if (req.params.hasOwnProperty('nomeMedico')) {
		var getPatientQuery = {
			sql: `SELECT * FROM Medico WHERE CRM = ${connection.escape(req.params.crMedico)}`,
			timeout: 10000	
		}
		connection.query(getPatientQuery, function(err, rows, fields) {
			if(err) {
				res.send('Houve um erro ao se tentar encontrar o medico da base de dados.');
			}
			console.log(err);
			console.log(rows);
			//console.log(fields);
			res.json(rows);
		});
	} else {
		//Enviar código de erro http
		res.send('Médico não encontrado.');			
	}
	}) 


module.exports = router