/*
Código fonte Back end do PIBIC de Pulseiras Inteligentes
Faculdade de Tecnologia - UnB
*/

// ============================= Código ativo =====================================

//Setup de módulos necessários para a aplicação
var express = require('express'),
	app = express(),
	request = require('request'),
	fs = require('fs'),
	mysql = require('mysql'),
	bodyParser = require('body-parser'),
	setupOptionsVariables = require('./setupVariables.js');
	
//Setup inicial de conecção com a base de dados 	
var connection = mysql.createConnection({
	host : '79.170.40.183',
	user : 'cl19-dbpipibic',
	password : 'XXXXXXXXXXXX',
	database : 'cl19-dbpipibic'
});
connection.connect();

//setando todas as variáveis de options nos requests http de teste
setupOptionsVariables(app);

request(app.optionsPutTestRequestPaciente, function(err, httpResponse, body) { 
	//console.log(err);
	//console.log(httpResponse);
	//console.log(body);
});


//request(app.optionsPostTestRequestMedico, function(err, httpResponse, body) { 
	//console.log(err);
	//console.log(httpResponse);
	//console.log(body);
//});
	

//Fazer request GET para puxar dados de HR meus da API da FitBit	

//info vai conter dados HR de chamada bem sucedida à API fitbit
var info = {};
//fitbitAccess contem dados sobre autenticação OAuth 2.0
var fitbitAccess = JSON.parse(fs.readFileSync('./fitbitAccess.json','utf8'));
var hrAuthorizationHeader = `Bearer ${fitbitAccess.access_token}`;

//Preparando parâmetros para executar o request de batimentos cardíacos da FitBit
var optionsGetHR = {
	url:'https://api.fitbit.com/1/user/4Z3ZH3/activities/heart/date/today/1d/1sec/time/15:02/15:03.json',
	headers: {
		'Authorization': hrAuthorizationHeader,
	}
};

//request(optionsGetHR, getHRCallback);

/* TO DO:
	=>getHRCallback chamada multiplas vezes antes do refresh, debugar isso
	=>Caso o Heroku faça a request pra refresh o key token, perdemos acesso a este,
		pensar em uma maneira de armazenar esses dados de autenticação além de localmente
*/ 
function getHRCallback(errors, response, body) {
	console.log(response.statusCode);
	if (!errors && response.statusCode == 200) {
		info = JSON.parse(body);
		fs.writeFile('./test2.txt', body, function(err) {
			if (err) { console.log('Ocorreu um erro e dados de HR não foram escritos em test2.txt'); }
			else { console.log('Dados de HR foram escritos com sucesso em test2.txt'); }
		});
		
	} 
	//tokens em OAuth valem por 1 hora, caso tenham expirado, refresh
	else if (response.statusCode == 401) {
		//Adicionado código de automação para refresh de token de acesso
		var tokenRefreshAuthorization = 'Basic ' + new Buffer("XXXXXX:XXXXXXXXXXXXXXXXXXXXXXXX").toString('base64');
		console.log(tokenRefreshAuthorization);
		
		var	optionsRefreshToken = {
			method:'POST',
			url:'https://api.fitbit.com/oauth2/token',
			headers: {
				'Authorization': tokenRefreshAuthorization,
			},
			form:{ 
				grant_type:'refresh_token', 
				refresh_token: fitbitAccess.refresh_token
			}
		};
		
		request(optionsRefreshToken, function(err, response, body){
			console.log('Dando refresh no access token... DONE! ');
			console.log(body);
			if (!body.hasOwnProperty('errors')) {
				fs.writeFile('./fitbitAccess.json', body, function(err) {
					if (err) { console.log('Error:Não consegui escrever access token em fitbitAccess.json'); }
					else { 
						console.log('Novo fitbitAccess.json atualizado e pronto para uso!'); 
						fitbitAccess = JSON.parse(body);
						hrAuthorizationHeader = `Bearer ${fitbitAccess.access_token}`;
						optionsGetHR.headers['Authorization'] = hrAuthorizationHeader;
					}
				});
				request(optionsGetHR, getHRCallback);
			} else { console.log('Error:Chamada refresh à API mal sucedida, algo deu errado'); }
			
		});
	}
}


// ================================ código servidor	===================================

//Setup para uso do módulo body parser para possibilitar extração de parâmetros do corpo do request http
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// ROUTING DO SERVIDOR E API's nativas da aplicação
app.get('/', function(req, res) {
	res.json(info);
});

//Ações para alterar tabela paciente na base de dados
app.route('/api/paciente/geral')
	.post(function(req, res) {
		if (req.hasOwnProperty('body') && 
			req.body.hasOwnProperty('nomePaciente') && 
			req.body.hasOwnProperty('causaDaInternacao') &&
			req.body.hasOwnProperty('numeroDoProntuario') &&
			req.body.hasOwnProperty('telefone') &&
			req.body.hasOwnProperty('foto') &&
			req.body.hasOwnProperty('dataDeNascimento')){	
			var query = {
				sql:`INSERT INTO Paciente (nomePaciente, numeroDoProntuario, telefone, foto, causaDaInternacao, dataDeNascimento) VALUES (${connection.escape(req.body.nomePaciente)}, ${connection.escape(req.body.numeroDoProntuario)}, ${connection.escape(req.body.telefone)}, ${connection.escape(req.body.foto)}, ${connection.escape(req.body.causaDaInternacao)}, ${connection.escape(req.body.dataDeNascimento)})`,
				timeout: 10000
			}
			connection.query(query, function(err, rows, fields) {
				console.log(err);
				console.log(rows);
				console.log(fields);
			});
			res.send('Paciente adicionado com sucesso!');
		} else {
			throw new Error('Parâmetros POST inválidos ou inexistentes para adicionar paciente');
			res.send('Error: Parâmetros POST inválidos ou inexistentes para adicionar paciente');
		}
	
	})
	.put(function(req, res){
		//TO DO: editar paciente pré existente
		//		 separar edições corriqueiras a um perfil de paciente de troca de pacientes na pulseira
		var selector = {
			sql:`SELECT * FROM Paciente WHERE numeroDoProntuario = ${connection.escape(req.headers.numerodoprontuario)} LIMIT 1`,
			timeout: 10000
		}
		
		connection.query(selector, function(err, rows, fields) {
			
			if (err != null) console.log('Erro ao selecionar perfil a ser editado na base de dados.');
			else if (rows.length < 1) {
				console.log('O número de prontuário no header de sua requisição não existe na base de dados.');
				res.send('O número de prontuário no header de sua requisição não existe na base de dados.');
			}
			else {
			
				var nomePacienteNovo,
					novoProntuario,
					novoTelefone,
					novaFoto,
					novaCausa,
					novaData;
				
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
		
				connection.query(
				'UPDATE Paciente SET nomePaciente=?, numeroDoProntuario=?, telefone=?, foto=?, causaDaInternacao=?, dataDeNascimento=? WHERE idtable1=?',
				[nomePacienteNovo,novoProntuario,novoTelefone,novaFoto,novaCausa,novaData,rows[0].idtable1], 
				function(error, results){
					if (error != null) {
						console.log('Erro ao alterar perfil de paciente na base de dados');
					} else {
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
		console.log(req.body.hasOwnProperty('numeroDoProntuario'));
		if (req.body.hasOwnProperty('numeroDoProntuario')) {
			var deletePatientQuery = {
				sql: `DELETE FROM Paciente WHERE numeroDoProntuario = ${connection.escape(req.body.numeroDoProntuario)} LIMIT 1`,
				timeout: 10000	
			}
			connection.query(deletePatientQuery, function(err, rows, fields) {
				if(err) {
					res.send('Houve um erro ao se tentar remover paciente da base de dados.');
				}
			});
			res.send('Um paciente de numero de prontuário 0 removido');
		} else {
			res.send('Indique o número de prontuário do paciente a ser removido da base.');			
		}
	});
	
app.get('/api/paciente/geral/:numeroDoProntuario', function(req, res){
	console.log(req.params.hasOwnProperty('numeroDoProntuario'));
	if (req.params.hasOwnProperty('numeroDoProntuario')) {
		var getPatientQuery = {
			sql: `SELECT * FROM Paciente WHERE numeroDoProntuario = ${connection.escape(req.params.numeroDoProntuario)}`,
			timeout: 10000	
		}
		connection.query(getPatientQuery, function(err, rows, fields) {
			if(err) {
				res.send('Houve um erro ao se tentar puxar pacientes da base de dados.');
			}
			console.log(err);
			console.log(rows);
			//console.log(fields);
		});
		res.send('Um paciente de numero de prontuário especificado puxado');
	} else {
		res.send('Indique o número de prontuário do paciente a ser puxado da base.');			
	}
}); 

//Ações com tabelas de parâmetros de saúde dos pacientes
app.route('/api/paciente/health')
	.post(function(req, res) {
		//TO DO:
	})
	.put(function(req, res){
		//TO DO:
	})
	.delete(function(req, res) {
		//TO DO: 
	});
	
app.get('/api/paciente/health/:idPaciente/:data', function(req, res){
	//TO DO: 
});
	
//Ações para alterar tabela Médico na base de dados
app.route('/api/medico')
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

app.post('/', function(req, res) {
	res.json({ name:'John', surname: 'Doe' });
});

port = process.env.PORT || 3000

app.listen(port);
