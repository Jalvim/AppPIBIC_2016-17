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

router.route('/')
	.get(function(req, res){
		//TO DO: selecionar perfis médicos
	}) 
	.post(function(req, res) {
		//TO DO: adicionar novo médico
		if (req.hasOwnProperty('body') && 
			req.body.hasOwnProperty('nomeMedico') && 
			req.body.hasOwnProperty('especialidade') &&
			req.body.hasOwnProperty('CRM') &&
			req.body.hasOwnProperty('telefone')){	
			var query = {
				sql:`INSERT INTO Medico (nome, especialidade, CRM, telefone) VALUES (${connection.escape(req.body.nomeMedico)}, ${connection.escape(req.body.especialidade)}, ${connection.escape(req.body.CRM)}, ${connection.escape(req.body.telefone)})`,
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
	});
	
module.exports = router