/*
Código fonte Back end do PIBIC de Pulseiras Inteligentes
Faculdade de Tecnologia - UnB

Este arquivo contém o módulo javascript de roteamento para as chamadas à API nativa para pacientes.

FUNCIONAMENTO:
1)API geral de pacientes "url/api/paciente/geral"
	GET -> Recebe em seu query string o número do crm do médico responsável pelo perfil de paciente desejado e 
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
	=>Implementar api paciente focada em health
	=>Terminar PUT da parte genérica implementando isNewPatient
	=>Implementar api paciente voltada para dados de authenticação

*/

var express = require('express');
var mysql = require('mysql');
var request = require('request');
var router = express.Router();

//Setup inicial de conecção com a base de dados 	
var connection = mysql.createConnection({
	host : '79.170.40.183',
	user : 'cl19-dbpipibic',
	password : 'XXXXXXXXXX',
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
			req.body.hasOwnProperty('crmMedicoResponsavel') &&
			req.body.hasOwnProperty('dataDeNascimento') &&
			req.body.hasOwnProperty('codigoOAuth') &&
			req.body.hasOwnProperty('redirectUri')){	
			var query = {
				sql:`INSERT INTO Paciente (nomePaciente, numeroDoProntuario, telefone, foto, causaDaInternacao, dataDeNascimento, crmMedicoResponsavel) VALUES (${connection.escape(req.body.nomePaciente)}, ${connection.escape(req.body.numeroDoProntuario)}, ${connection.escape(req.body.telefone)}, ${connection.escape(req.body.foto)}, ${connection.escape(req.body.causaDaInternacao)}, ${connection.escape(req.body.dataDeNascimento)}, ${connection.escape(req.body.crmMedicoResponsavel)})`,
				timeout: 10000
			}
			connection.query(query, function(err, rows, fields) {
				//console.log(err);
				if (err) {
					res.send('Não foi possível adicionar dados ao perfil do paciente.');
				} else {
					var tokenRefreshAuthorization = 'Basic ' + new Buffer("XXXXXXXXX:XXXXXXXXXXXXXXXXXXXXXXXX").toString('base64');
					var oauthOptions = {
						method: 'POST',
						url: 'https://api.fitbit.com/oauth2/token',
						headers: {
							'Authorization': tokenRefreshAuthorization
						},
						form: {
							clientId:'227WRB',
							grant_type:'authorization_code',
							redirect_uri:req.body.redirectUri,
							code:req.body.codigoOAuth
						}
					}
					request(oauthOptions, function(error, response, body) {
						var temp = JSON.parse(body);
						if (temp.hasOwnProperty('errors')) {
							res.send('Falha no processo de autenticação ao tentar registrar o paciente');
							connection.query(`DELETE FROM Paciente WHERE idtable1=${rows.insertId}`);
						} else {
							console.log('passou na autenticação');
							connection.query(
							  'INSERT INTO Autenticacao (idPaciente, userID, refreshToken, accessToken) VALUES (?, ?, ?, ?)',
							  [rows.insertId, temp.user_id, temp.refresh_token, temp.access_token],
							  function(err) {
							  	res.send('Paciente adicionado com sucesso.');
							  }
							);
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
		//TO DO: editar paciente pré existente
		//		 separar edições corriqueiras a um perfil de paciente de troca de pacientes na pulseira
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
					novoCrmMedicoResponsável;
				
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
				if (req.body.hasOwnProperty('crmMedicoResponsavel')) {
					novoCrmMedicoResponsável = req.body.crmMedicoResponsavel;
				} else { novoCrmMedicoResponsável = rows[0].crmMedicoResponsavel; }
		
				connection.query(
				'UPDATE Paciente SET nomePaciente=?, numeroDoProntuario=?, telefone=?, foto=?, causaDaInternacao=?, dataDeNascimento=?, crmMedicoResponsavel=? WHERE idtable1=?',
				[nomePacienteNovo,novoProntuario,novoTelefone,novaFoto,novaCausa,novaData,  novoCrmMedicoResponsável,rows[0].idtable1], 
				function(error, results){
					if (error != null) {
						console.log('Erro ao alterar perfil de paciente na base de dados');
						res.send('Erro ao alterar perfil de paciente na base de dados');
					} else {
						console.log('Paciente editado com sucesso.');
						//Log: bug aparentemente resolvido, permanecer alerta neste ponto mesmo assim
						if (req.body.isNewPatient == 'true') {
							//TO DO: chamar put em api/paciente/health para deletar dados do paciente anterior
							console.log('Novo paciente, deletar dados antigos de saúde');
						}
					}
				});
			}
		});
		
	})
	.delete(function(req, res) {
		console.log(req.body.hasOwnProperty('idPaciente'));
		if (req.body.hasOwnProperty('idPaciente')) {
			connection.query(
			  'DELETE FROM Autenticacao WHERE idPaciente=?',
			  [req.body.idPaciente],
			  function(err){
			  	if (err) {
			  		console.log('Error ao remover dados de autenticação tentando deletar perfil de paciente');
			  		return;
			  	}
			  	var deletePatientQuery = {
					sql: `DELETE FROM Paciente WHERE idtable1 = ${connection.escape(req.body.idPaciente)} LIMIT 1`,
					timeout: 10000	
				}
				connection.query(deletePatientQuery, function(err, rows, fields) {
					if(err) {
						res.send('Houve um erro ao se tentar remover paciente da base de dados.');
					} else { res.send('O paciente de id especificado pôde ser removido com sucesso.'); }
				});
			  });
		} else {
			res.send('Indique o número de prontuário do paciente a ser removido da base.');			
		}
	});
	
router.get('/geral/:crmMedicoResponsavel', function(req, res){
	console.log(req.params.hasOwnProperty('crmMedicoResponsavel'));
	if (req.params.hasOwnProperty('crmMedicoResponsavel')) {
		var getPatientQuery = {
			sql: `SELECT * FROM Paciente WHERE crmMedicoResponsavel = ${connection.escape(req.params.crmMedicoResponsavel)}`,
			timeout: 10000	
		}
		connection.query(getPatientQuery, function(err, rows, fields) {
			if(err) {
				res.send('Houve um erro ao se tentar puxar pacientes da base de dados.');
			}
			console.log(err);
			console.log(rows);
			//console.log(fields);
			res.json(rows);
		});
	} else {
		res.send('Indique o número de prontuário do paciente a ser puxado da base.');			
	}
}); 

//Ações com tabelas de parâmetros de saúde dos pacientes
router.route('/health/static')
	.post(function(req, res) {
		//TO DO:
	})
	.put(function(req, res){
		//TO DO:
	})
	.delete(function(req, res) {
		//TO DO: 
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

module.exports = router;