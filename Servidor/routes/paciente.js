/*
Código fonte Back end do PIBIC de Pulseiras Inteligentes
Faculdade de Tecnologia - UnB

Este arquivo contém o módulo javascript de roteamento para as chamadas à API nativa para pacientes.

FUNCIONAMENTO:
1)API geral de pacientes "url/api/paciente/geral"
	GET -> Recebe em seu query string o número do id do médico responsável pelo perfil de paciente desejado e 
		retorna as informações do paciente ao cliente autor da requisição. 
		(ex query string "url/api/paciente/geral/[numero de prontuário]")
	POST -> Recebe todas as informações do perfil a serem colocadas no corpo/form da requisição http e 
		acrescenta o novo paciente à base de dados. Obrigatório preenchimento de todos os campos para que
		a adição à base de dados seja finalizada.
	PUT -> Recebe o id identificando o paciente a ser editado no header da requisição
		enquanto as novas informações de perfil devem estar no corpo/form. Chamada flexível aceita as 
		informações novas e mantém as que não estão citadas no corpo do POST.
		ADICIONAL PUT: Em caso de alta do paciente usuário da pulseira e o PUT for executado para mudança
		de pacientes, parâmetro adicional isNewPatient pode ser acrescentado com valor "true" para limpar
		dados de saúde do paciente antigo. <---- AINDA NÃO IMPLEMENTADO
	DELETE -> Remove o perfil de paciente cujo id bate com o presente no corpo/form 
		da requisição.
		
2)API saúde de pacientes "url/api/paciente/health"
	Ainda a implementar...

TO DO: 
	=> Discutir com o time como deve se comportar essa chamada (se é que ela deve existir) DELETE
	=> Atualmente não deleta paciente por razão da chave extrangeira da tabela PacienteMedico DELETE
	=> Tratar questão de multiplas pulseiras usadas por um paciente em PUT /geral. Abranger todos os 
		edge cases (paciente em tratamento e paciente que recebeu alta).
*/

var senhas = require('../senhas');
var express = require('express');
var mysql = require('mysql');
var request = require('request');
var router = express.Router();

//Setup inicial de conecção com a base de dados 	
var connection = mysql.createConnection({
	host : '79.170.40.183',
	user : 'cl19-dbpipibic',
	password : senhas.senha_DB,
	database : 'cl19-dbpipibic'
});
connection.connect();

//Ações para alterar tabela paciente na base de dados
router.route('/geral')
	.post(function(req, res) {
		if (req.hasOwnProperty('body') && 
			req.body.hasOwnProperty('nomePaciente') && 
			req.body.hasOwnProperty('causaDaInternacao') &&
			req.body.hasOwnProperty('numeroDoProntuario') &&
			req.body.hasOwnProperty('telefone') &&
			req.body.hasOwnProperty('foto') &&
			req.body.hasOwnProperty('dataDeNascimento') &&
			req.body.hasOwnProperty('idMedico')){	
			var query = {
 				sql:`INSERT INTO Paciente (nomePaciente, numeroDoProntuario, telefone, foto, causaDaInternacao, dataDeNascimento, ativo) VALUES (${connection.escape(req.body.nomePaciente)}, ${connection.escape(req.body.numeroDoProntuario)}, ${connection.escape(req.body.telefone)}, ${connection.escape(req.body.foto)}, ${connection.escape(req.body.causaDaInternacao)}, ${connection.escape(req.body.dataDeNascimento)}, 1)`,
				timeout: 10000
			}
			connection.query(query, function(err, rows, fields) {
				//console.log(err);
				if (err) {
					res.send('Não foi possível adicionar dados ao perfil do paciente.');
				} else {
					
					var queryRelacao = {
						sql:`INSERT INTO Paciente_Medico (idPaciente, idMedico) VALUES (${rows.insertId}, ${connection.escape(req.body.idMedico)})`,
						timeout: 10000
					}
					connection.query(queryRelacao, function(err, response, body) {
						if(err) {
							res.send('Erro ao adicionar relação entre medico e paciente.');
							connection.query(`DELETE FROM Paciente WHERE idtable1=${rows.insertId}`);
						} else {
							res.send('Paciente adicionado com sucesso.');
							console.log(err);
							console.log(rows);
							//console.log(fields);
						}
					});

				}
			});

		} else {
			throw new Error('Parâmetros POST inválidos ou inexistentes para adicionar paciente');
			res.send('Error: Parâmetros POST inválidos ou inexistentes para adicionar paciente');
		}
	
	})
	.put(function(req, res){
// 		Juntos na versão preliminar do app, as abstrações de paciente e pulseira agora estão separados
// 		Isso tira a necessidade de se acrescentar nesse midleware a funcionalidade "isNewPatient" comentada 
// 		Ao final da função
		var selector = {
			sql:`SELECT * FROM Paciente WHERE idtable1 = ${connection.escape(req.headers.idpaciente)} LIMIT 1`,
			timeout: 10000
		}
		
		connection.query(selector, function(err, rows, fields) {
			
			if (err != null) console.log('Erro ao selecionar perfil a ser editado na base de dados.');
			else if (rows.length < 1) {
				console.log('O id no header de sua requisição não existe na base de dados.');
				res.send('O id no header de sua requisição não existe na base de dados.');
			}
			else {
			
				var nomePacienteNovo,
					novoProntuario,
					novoTelefone,
					novaFoto,
					novaCausa,
					novaData,
					ativo;
									
				if (req.body.hasOwnProperty('nomePaciente')) {
					nomePacienteNovo = req.body.nomePaciente;
				} else { nomePacienteNovo = rows[0].nomePaciente; }
				if (req.body.hasOwnProperty('numeroDoProntuario')){
					novoProntuario = req.body.numeroDoProntuario;
				} else { novoProntuario = rows[0].numeroDoProntuario; }
				if (req.body.hasOwnProperty('telefone')){
					novoTelefone = req.body.telefone;
				} else { novoTelefone = rows[0].telefone; }
				if (req.body.hasOwnProperty('foto')){
					novaFoto = req.body.foto;
				} else { novaFoto = rows[0].foto; }
				if (req.body.hasOwnProperty('causaDaInternacao')){
					novaCausa = req.body.causaDaInternacao;
				} else { novaCausa = rows[0].causaDaInternacao; }
				if (req.body.hasOwnProperty('dataDeNascimento')){
					novaData = req.body.dataDeNascimento;
				} else { novaData = rows[0].dataDeNascimento; }
				if (req.body.hasOwnProperty('ativo')){
					ativo = req.body.ativo;
				} else { ativo = rows[0].ativo; }
				
				connection.query(
				'UPDATE Paciente SET nomePaciente=?, numeroDoProntuario=?, telefone=?, foto=?, causaDaInternacao=?, dataDeNascimento=?, ativo=? WHERE idtable1=?',
				[nomePacienteNovo,novoProntuario,novoTelefone,novaFoto,novaCausa,novaData,ativo,rows[0].idtable1], 
				function(error, results){
					if (error != null) {
						console.log('Erro ao alterar perfil de paciente na base de dados');
						res.send('Erro ao alterar perfil de paciente na base de dados');
					} else {
						
						console.log('Paciente editado com sucesso.');
					}
				});
			}
		});
		
	})
	.delete(function(req, res) {
		if (req.body.hasOwnProperty('idPaciente')) {
		
			var deletePatientQuery = {
				sql: `DELETE FROM Paciente WHERE idtable1 = ${connection.escape(req.body.idPaciente)} LIMIT 1`,
				timeout: 10000	
			}
			connection.query(deletePatientQuery, function(err, rows, fields) {
				if(err) {
					res.send('Houve um erro ao se tentar remover paciente da base de dados.');
				} else { res.send('O paciente de id especificado pôde ser removido com sucesso.'); }
			});
			
		} else {
			res.send('Indique o número de prontuário do paciente a ser removido da base.');			
		}
	});

// Busca na API por pacientes pelo ID do médico
router.get('/geral/idMedico/:idMedico', function(req, res){
	console.log(req.params.hasOwnProperty('idMedico'));
		//Primeiramente, o id do Médico é buscado na tabela de Pacientes para obter os seus poacientes
		if (req.params.hasOwnProperty('idMedico')) {
			var getMedicoQuery = {
			sql: `SELECT * FROM Paciente_Medico PM, Paciente P WHERE PM.idMedico = ${connection.escape(req.params.idMedico)} AND PM.idPaciente = P.idtable1 AND P.ativo<>0`,
			timeout: 10000	
		}
		
		connection.query(getMedicoQuery, function(err, rows, fields) {
			if(err) {
				console.log(err);
				res.send('Houve um erro ao se tentar encontrar o médico com o ID desejado.');
			}
			if(rows.length < 1)	{
				res.send('Não existe paciente associado a este médico com esta ID na base de dados');
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

router.get('/geral/inativo/idMedico/:idMedico', function(req, res){
	console.log(req.params.hasOwnProperty('idMedico'));
		//Primeiramente, o id do Médico é buscado na tabela de Pacientes para obter os seus poacientes
		if (req.params.hasOwnProperty('idMedico')) {
			var getMedicoQuery = {
			sql: `SELECT * FROM Paciente_Medico PM, Paciente P WHERE PM.idMedico = ${connection.escape(req.params.idMedico)} AND PM.idPaciente = P.idtable1 AND P.ativo=0`,
			timeout: 10000	
		}
		
		connection.query(getMedicoQuery, function(err, rows, fields) {
			if(err) {
				console.log(err);
				res.send('Houve um erro ao se tentar encontrar o médico com o ID desejado.');
			}
			if(rows.length < 1)	{
				res.send('Não existe paciente associado a este médico com esta ID na base de dados');
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
	
router.get('/health/static/:idPaciente/:data', function(req, res){
	
	connection.query(
	  'SELECT * FROM SaudeParamsEstaticos where idPaciente=? AND data=?',
	  [req.params.idPaciente, req.params.data],
	  function(err, rows, fields) {
		if (err) res.send('Error: não foi possível puxar dados do paciente especificado na data especificada.');
		else {
			if(rows.length < 1){
				res.send('Id ou data Inválidos');
			} else {
				dados = rows[0];
				res.json(dados);
			}
		}
	});
	
});
router.get('/health/static/:idPaciente', function(req, res){
	
	connection.query(
	  'SELECT * FROM SaudeParamsEstaticos where idPaciente=?',
	  [req.params.idPaciente],
	  function(err, rows, fields) {
		if (err) res.send('Error: não foi possível puxar dados do paciente especificado.');
		else {
			if(rows.length < 1){
				res.send('Id Inválido');
			} else {
				res.json(rows);
			}
		}
	});
	
});

router.get('/health/dynamic/:idPaciente/:data', function(req, res){
	
	connection.query(
	  'SELECT * FROM SaudeParamsDinamicos where idPaciente=? AND data=?',
	  [req.params.idPaciente, req.params.data],
	  function(err, rows, fields) {
		if (err) res.send('Error: não foi possível puxar dados do paciente especificado na data especificada.');
		else {
			if(rows.length < 1){
				res.send('Id ou data Inválidos');
			} else {
				res.json(rows);
			}
		}
	});
	
});

module.exports = router;