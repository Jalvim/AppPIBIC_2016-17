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
	password : 'XXXXXXXXXXX',
	database : 'cl19-dbpipibic'
});
connection.connect();

//setando todas as variáveis de options nos requests http de teste
setupOptionsVariables(app);

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
	url:'https://api.fitbit.com/1/user/4Z3ZH3/activities/heart/date/today/1d/1sec/time/00:00/00:01.json',
	headers: {
		'Authorization': hrAuthorizationHeader,
	}
};

//request(optionsGetHR, getHRCallback);
getStaticHealthParams(0);

/* 
getHRCallback é a função que trata a resposta advinda da chamada à API da FitBit com relação a
batimentos cardíacos.

TO DO:
	=>Caso o Heroku faça a request pra refresh o key token, perdemos acesso a este,
	pensar em uma maneira de armazenar esses dados de autenticação além de localmente
	=>Armazenar dados de batimento cardíaco recebidos na base de dados
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
		refreshOAuthToken(optionsGetHR, getHRCallback);
	}
}

/*
getStaticParams é uma função que puxa dados de saúde estáticos (não necessitam acompanhamento em tempo real)
da API da FitBit de maneira recursiva, a necessidade do uso da recursão veio da natureza assíncrona da função
request, que torna complexa a implementação usando for loop. Ao chamar, dê sempre um 0 como argumento para 
resgatar os dados corretamente.

TO DO:
	=>Armazenar dados de saúde estáticos puxados da internet na base de dados
*/
function getStaticHealthParams(i) {

	if (i == 4) return;

	var staticParamsArray = ['steps', 'calories', 'distance', 'floors'];
	
	var staticParam = staticParamsArray[i];
	var newStaticParamOption = {
		url: `https://api.fitbit.com/1/user/4Z3ZH3/activities/${staticParamsArray[i]}/date/today/1d.json`,
		headers: {
			'Authorization': hrAuthorizationHeader,
		}
	}
	request(newStaticParamOption, function(errors, response, body){
		//console.log(errors);
		//console.log(body['activities-steps']);//activities-calories activities-calories
		var dummy = JSON.parse(body);
		var property = 'activities-' + staticParamsArray[i];
		console.log(dummy[property][0]);
		console.log(staticParamsArray[i]);
		getStaticHealthParams(i+1);
	});
	
}

/*
refreshOAuthToken é função genérica de refresh do token de acesso exigido pela API da FitBit para 
permitir chamadas à mesma. Pelo protocolo OAuth2, o token de acesso expira a cada 1 hora sem uso,
sendo então necessário o uso desta função.

TO DO:
	=>refreshOAuthToken chamada multiplas vezes em getHRCallback antes do refresh, debugar isso
*/
function refreshOAuthToken(options, callback) {
	//Adicionado código de automação para refresh de token de acesso
	var tokenRefreshAuthorization = 'Basic ' + new Buffer("XXXXXXXX:XXXXXXXXXXXXXXXXXXXXX").toString('base64');
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
		if (body.hasOwnProperty('errors')) {
			console.log('Error:Chamada refresh à API mal sucedida, algo deu errado');
		} else { 
			fs.writeFile('./fitbitAccess.json', body, function(err) {
				if (err) { console.log('Error:Não consegui escrever access token em fitbitAccess.json'); }
				else { 
					console.log('Novo fitbitAccess.json atualizado e pronto para uso!'); 
					fitbitAccess = JSON.parse(body);
					hrAuthorizationHeader = `Bearer ${fitbitAccess.access_token}`;
					optionsGetHR.headers['Authorization'] = hrAuthorizationHeader;
				}
			});
			request(options, callback);
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
