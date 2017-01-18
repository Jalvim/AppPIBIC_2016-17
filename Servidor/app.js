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
	setupOptionsVariables = require('./setupVariables.js'),
	pacienteRouter = require('./routes/paciente.js'),
	medicoRouter = require('./routes/medico.js');
	
//Setup inicial de conecção com a base de dados 	
var connection = mysql.createConnection({
	host : '79.170.40.183',
	user : 'cl19-dbpipibic',
	password : 'KkXmnqC^D',
	database : 'cl19-dbpipibic'
});
connection.connect();

//setando todas as variáveis de options nos requests http de teste
setupOptionsVariables(app);

request(app.optionsPostTestRequestMedico, function(err, httpResponse, body) { 
	console.log(err);
	//console.log(httpResponse);
	console.log(body);
});

//Fazer request GET para puxar dados de HR meus da API da FitBit	

//info vai conter dados HR de chamada bem sucedida à API fitbit
var info = {};
//fitbitAccess contem dados sobre autenticação OAuth 2.0
var fitbitAccess = JSON.parse(fs.readFileSync('./fitbitAccess.json','utf8'));
var hrAuthorizationHeader = `Bearer ${fitbitAccess.access_token}`;

//Preparando parâmetros para executar o request de batimentos cardíacos da FitBit
var optionsGetHR = {
	url:'https://api.fitbit.com/1/user/4Z3ZH3/activities/heart/date/today/1d/1sec/time/00:00/00:01.json',
	headers: {
		'Authorization': hrAuthorizationHeader,
	}
};

//request(optionsGetHR, getHRCallback);
//getStaticHealthParams(0, 38);
//getStaticHealthParams(0, 18);
//console.log(getTodayDate());

/* 
getHRCallback é a função que trata a resposta advinda da chamada à API da FitBit com relação a
batimentos cardíacos.

TO DO:
	=>Caso o Heroku faça a request pra refresh o key token, perdemos acesso a este,
	pensar em uma maneira de armazenar esses dados de autenticação além de localmente
	=>Armazenar dados de batimento cardíaco recebidos na base de dados
	=>Implementar funcionalidade similar ao da função de parametros estáticos (puxar dados de autenticação da bd)
*/ 
function getHRCallback(errors, response, body) {
	console.log(response.statusCode);
	if (!errors && response.statusCode == 200) {
		info = JSON.parse(body);
		console.log(info);
		fs.writeFile('./test2.txt', body, function(err) {
			if (err) { console.log('Ocorreu um erro e dados de HR não foram escritos em test2.txt'); }
			else { console.log('Dados de HR foram escritos com sucesso em test2.txt'); }
		});
		
	} 
	//tokens em OAuth valem por 1 hora, caso tenham expirado, refresh
	else if (response.statusCode == 401) {
		refreshOAuthToken(optionsGetHR, getHRCallback);
	}
}

function getTodayDate() {
	var today = new Date(),
		dd = today.getDate(),
		mm = today.getMonth() + 1,
		yyyy = today.getFullYear();
		
	if (mm < 10) mm = '0' + mm;
	if (dd < 10) dd = '0' + dd;
		
	today = `${yyyy}-${mm}-${dd}`;
	return today;
}

/*
getStaticParams é uma função que puxa dados de saúde estáticos (não necessitam acompanhamento em tempo real)
da API da FitBit de maneira recursiva, a necessidade do uso da recursão veio da natureza assíncrona da função
request, que torna complexa a implementação usando for loop. Ao chamar, dê sempre um 0 como argumento i para 
resgatar os dados corretamente para o paciente de id especificado.

TO DO:
	=> Otimizar velocidade da função, eliminando dados IntraDay da chamada à API da Fitbit.(Entrar em contato com a Fitbit).

*/
function getStaticHealthParams(i, id) {

	if (i == 4) return;

	connection.query('SELECT * FROM Autenticacao WHERE idPaciente=?', [id],
	  function(erro, result, fields){
	  	console.log(result);
	  	if (result.length < 1 || erro) { console.log('Erro ao puxar info de autenticação da base de dados.'); return; }
	  
	  	var authorizationHeader = `Bearer ${result[0].accessToken}`;
	  	
		var staticParamsArray = ['steps', 'calories', 'distance', 'floors'];
	
		var newStaticParamOption = {
			url: `https://api.fitbit.com/1/user/${result[0].userID}/activities/${staticParamsArray[i]}/date/today/1d.json`,
			headers: {
				'Authorization': authorizationHeader,
			}
		}
		request(newStaticParamOption, function getStaticHealthParamsCallback(errors, response, body){
			console.log(response.statusCode);
			if (response.statusCode == 401) {
				refreshOAuthToken(newStaticParamOption, getStaticHealthParamsCallback, result);
			} else if (!errors && response.statusCode == 200) {
				var activity = JSON.parse(body);
				var property = 'activities-' + staticParamsArray[i];
				if (staticParamsArray[i] == 'steps') {
					newStaticQuery = {
						sql: `SELECT * FROM SaudeParamsEstaticos WHERE idPaciente=${id} AND data='${activity[property][0].dateTime}'`, 
						timeout: 10000
					}
					connection.query(newStaticQuery, function(err, rows, fields) {
						if(rows.length < 1) {
							newStaticQuery = {
								sql: `INSERT INTO SaudeParamsEstaticos (idPaciente, data, steps) VALUES (${id}, '${activity[property][0].dateTime}', ${activity[property][0].value})`,
								timeout: 10000
							}
						}
						else if (rows.length == 1){
							newStaticQuery = {
								sql: `UPDATE SaudeParamsEstaticos SET steps=${activity[property][0].value} WHERE data='${activity[property][0].dateTime}' AND idPaciente=${id}`,
								timeout: 10000
							}
						} else throw new Error("Ambiguidades com id e/ou data de pacientes na base de dados");
						connection.query(newStaticQuery);
					});
				} else {
					staticQuery = {
						sql: `UPDATE SaudeParamsEstaticos SET ${staticParamsArray[i]}=${activity[property][0].value} WHERE data='${activity[property][0].dateTime}'`,
						timeout: 10000
					}
					connection.query(staticQuery, function(err, rows, fields) {
					});
				}
				getStaticHealthParams(i+1, id);
			}
		});
	});
}

/*
refreshOAuthToken é função genérica de refresh do token de acesso exigido pela API da FitBit para 
permitir chamadas à mesma. Pelo protocolo OAuth2, o token de acesso expira a cada 1 hora sem uso,
sendo então necessário o uso desta função.

TO DO:
*/
function refreshOAuthToken(options, callback, auth) {
	//Adicionado código de automação para refresh de token de acesso
	var tokenRefreshAuthorization = 'Basic ' + new Buffer("XXXXXXXXX:XXXXXXXXXXXXXXXXXXXXXXXX").toString('base64');
	console.log(tokenRefreshAuthorization);	
	console.log(auth[0].refreshToken);
	
	var	optionsRefreshToken = {
		method:'POST',
		url:'https://api.fitbit.com/oauth2/token',
		headers: {
			'Authorization': tokenRefreshAuthorization,
		},
		form:{ 
			grant_type:'refresh_token', 
			refresh_token: auth[0].refreshToken
		}
	};
	
	request(optionsRefreshToken, function(err, response, body){
		console.log('Dando refresh no access token... DONE! ');
		console.log(body);
		var temp = JSON.parse(body);
		if (temp.hasOwnProperty('errors')) {
			console.log('Error:Chamada refresh à API mal sucedida, algo deu errado');
		} else { 
			connection.query(
			  'UPDATE Autenticacao SET accessToken=?, refreshToken=? WHERE idPaciente=?',
			  [temp.access_token, temp.refresh_token, auth[0].idPaciente],
			  function(err){
				if (err) console.log('Erro ao armazenar dados refreshed na base de dados');
				else { 
					console.log('Sucesso no refresh dos dados.');
					options.headers['Authorization'] = 	`Bearer ${temp.access_token}`;
					request(options, callback); 
				} 
			});
		}
		
	});
}


// ================================ código servidor	===================================

//Setup para uso do módulo body parser para possibilitar extração de parâmetros do corpo do request http
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ROUTING DO SERVIDOR E API's nativas da aplicação
app.get('/', function(req, res) {
	res.json(info);
});

//Ações para alterar tabela paciente na base de dados, usar módulo local ./router/paciente.js
app.use('/api/paciente', pacienteRouter);
	
//Ações para alterar tabela Médico na base de dados, usar módulo local ./router/medico.js
app.use('/api/medico', medicoRouter);

port = process.env.PORT || 3000

app.listen(port);
