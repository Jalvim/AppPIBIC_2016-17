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
	password : 'XXXXXXXXXX',
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
	.post(function(req, res){
		if (req.hasOwnProperty('body') &&
			req.body.hasOwnProperty('email') && 
			req.body.hasOwnProperty('senha')){
			getPatientQuery = {
				sql: `SELECT idMedico FROM logins WHERE (email= ${connection.escape(req.body.email)} AND senha= ${connection.escape(req.body.senha)}) `,
				timeout: 10000	
			}
			connection.query(getPatientQuery, function(err, rows, fields) {
			
				if (rows.length != 1) {res.send('Email ou senha incorretos ou algo a mais deu errado.');}
				else {
					res.json(rows[0]);
					console.log(err);
					console.log(rows);
					//console.log(fields);
				}
			
			});
		} 
	});


module.exports = router;