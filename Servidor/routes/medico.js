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
	password : 'XXXXXXXXX',
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
			req.body.hasOwnProperty('nomeMedico') && 
			req.body.hasOwnProperty('especialidade') &&
			req.body.hasOwnProperty('CRM') &&
			req.body.hasOwnProperty('telefone')){	
			var query = {
				sql:`INSERT INTO Medico (idMedico, nome, especialidade, CRM, telefone) VALUES (${connection.escape(req.body.idMedico)}, ${connection.escape(req.body.nomeMedico)}, ${connection.escape(req.body.especialidade)}, ${connection.escape(req.body.CRM)}, ${connection.escape(req.body.telefone)})`,
				timeout: 10000

			}
			console.log(query);
			connection.query(query, function(err, rows, fields) {
				console.log(err);
				console.log(rows);
				console.log(fields);
				if(err == null)
					res.send('Novo perfil médico adicionado com sucesso!');
				else
					res.send('Erro ao adicionar o médico');
			});
			
		} else {
			throw new Error('Parâmetros POST inválidos ou inexistentes para tabela Medico');
			res.send('Error: Parâmetros POST inválidos ou inexistentes para adicionar perfil médico');
		}
	})
	.put(function(req, res){
		//TO DO: editar perfil médico pré existente
		if (req.hasOwnProperty('body') && 
			req.body.hasOwnProperty('CRM')){
			var selector = {
				sql:`SELECT * FROM Medico WHERE CRM = ${connection.escape(req.body.CRM)} LIMIT 1`,
				timeout: 10000
				}
			connection.query(selector, function(err, rows, fields) {
			
			if (err != null) console.log('Erro ao selecionar perfil a ser editado na base de dados.');
			else if (rows.length < 1) {
				console.log('Medico nao encontrado.');
				res.send('Medico nao encontrado.');
			}
			else {
				console.log(rows);
				var idMedico,
					nome,
					especialidade,
					telefone;
				
				if (req.body.hasOwnProperty('idMedico')) {
					idMedico = req.body.idMedico;
				} else { idMedico = rows[0].idMedico; }
				if (req.body.hasOwnProperty('nome')){
					nome = req.body.nome;
				} else { nome = rows[0].nome; }
				if (req.body.hasOwnProperty('especialidade')){
					especialidade = req.body.especialidade;
				} else { especialidade = rows[0].especialidade; }
				if (req.body.hasOwnProperty('telefone')){
					telefone = req.body.telefone;
				} else { telefone = rows[0].telefone; }
				
		
				connection.query(
				'UPDATE Medico SET nome=? especialidade=?, telefone=? WHERE CRM=? LIMIT 1',
				[nome, especialidade, telefone, req.body.CRM], 
				function(error, results){
					if (error != null) {
						console.log(error);
						console.log('Erro ao alterar perfil de medico na base de dados');
						res.send('Erro ao alterar perfil de medico na base de dados');
					} else {
						console.log('Medico editado com sucesso.');
						//Log: bug aparentemente resolvido, permanecer alerta neste ponto mesmo assim
						if (req.body.isNewPatient == 'true') {
							//TO DO: chamar put em api/paciente/health para deletar dados do paciente anterior
							console.log('Novo medico, deletar dados antigos de saúde');
						}
					}
				});
			}
		});


		}
		else{
			res.send('Error: Parâmetros PUT inválidos, escolha perfil pelo CRM do médico a ser alterado');
		}
	})
	.delete(function(req, res) {
		//TO DO: Tratar remoção de médicos não existentes.
		console.log(req.body.hasOwnProperty('idMedico'));
		if (req.body.hasOwnProperty('idMedico')) {
			connection.query(
			  'DELETE FROM Medico WHERE idMedico=? LIMIT 1',
			  [req.body.idMedico],
			  	function(err){
				  	if (err != null) {
				  		console.log('Error ao remover perfil de Medico');
				  		return;
				  	}
				 	else{
				 		console.log('Médico removido com sucesso');
				 	}
			  });
		} else {
			res.send('Indique o id únicod e medico a ser removido da base.');			
		}
	});
	
	router.route('/busca/CRM/:crmMedico')
	.get(function(req, res){
		
		var getPatientQuery = {
			sql: `SELECT * FROM Medico WHERE CRM = ${connection.escape(req.params.crmMedico)}`,
			timeout: 10000	
		}
		connection.query(getPatientQuery, function(err, rows, fields) {
			if(err == null) {
				res.json(rows);
			}
			else {
			//Enviar código de erro http
				res.send('Erro ao realizar a busca na base de dados por CRM');
			}
			console.log(err);
			console.log(rows);
			//console.log(fields);
			
		});
	} else {
		//Enviar código de erro http
		res.send('Médico não encontrado.');			
	}
	});


module.exports = router;