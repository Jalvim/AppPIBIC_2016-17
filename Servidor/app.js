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
	bodyParser = require('body-parser');
	
//Setup inicial de conecção com a base de dados 	
var connection = mysql.createConnection({
	host : '79.170.40.183',
	user : 'cl19-dbpipibic',
	password : 'XXXXXXXXXXXXX',
	database : 'cl19-dbpipibic'
});
connection.connect();

//POST request teste para comunicação com API nativa no código do servidor
//PARA PACIENTE
var	optionsPostTestRequestPaciente = {
	method:'POST',
	url:'http://127.0.0.1:3000/api/paciente',
	form:{ 
		nomePaciente: 'Alcides Guimarães',
		causaDaInternacao: 'Dor de cabeça',
		numeroDoProntuario: 133545,
		telefone: 33449369,
		foto: 000100010101,
		dataDeNascimento: '1993-07-03'
	}
};
request(optionsPostTestRequestPaciente, function(err, httpResponse, body) { 
	//console.log(err);
	//console.log(httpResponse);
	//console.log(body);
});
//PARA MÉDICO
var	optionsPostTestRequestMedico = {
	method:'POST',
	url:'http://127.0.0.1:3000/api/medico',
	form:{ 
		nomeMedico: 'Alcides Guimarães',
		especialidade: 'Anestesista',
		CRM: 133545,
		telefone: 33449369
	}
};
request(optionsPostTestRequestMedico, function(err, httpResponse, body) { 
	//console.log(err);
	//console.log(httpResponse);
	//console.log(body);
});
	

//Fazer request GET para puxar dados de HR meus da API da FitBit	

//info vai conter dados HR de chamada bem sucedida à API fitbit
var info = {};
//fitbitAccess contem dados sobre autenticação OAuth 2.0
var fitbitAccess = JSON.parse(fs.readFileSync('./fitbitAccess.json','utf8'));
var hrAuthorizationHeader = `Bearer ${fitbitAccess.access_token}`;

//Preparando parâmetros para executar o request de batimentos cardíacos da FitBit
var optionsGetHR = {
	url:'https://api.fitbit.com/1/user/4Z3ZH3/activities/heart/date/today/1d.json',
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

app.get('/api/:nome', function(req, res) {
	var query = { 
		sql:`SELECT * FROM Paciente WHERE nomePaciente = ${connection.escape(req.params.nome)}`,
		timeout: 10000
	};
	connection.query(query, function(err, rows) {
		if (err && err.code == 'PROTOCOL_SEQUENCE_TIMEOUT') {
			throw new Error('Conecção com BD demorou demais');
		} else if (err) {
			throw err;
		}
		
		console.log(rows);
		res.json(rows);
		
	});
});

//Ações para alterar tabela pacientes na base de dados
app.route('/api/paciente')
	.get(function(req, res){
		//TO DO: selecionar pacientes
	}) 
	.post(function(req, res) {
		//TO DO: adicionar novo paciente
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
	})
	.delete(function(req, res) {
		//TO DO: remover paciente da base de dados
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
