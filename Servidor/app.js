/*
Código fonte Back end do PIBIC de Pulseiras Inteligentes
Faculdade de Tecnologia - UnB


*/

// ============================= Código ativo =====================================

//Setup de módulos necessários para a aplicação
var senhas = require('./senhas.js');
var express = require('express'),
	app = express(),
	request = require('request'),
	mysql = require('mysql'),
	bodyParser = require('body-parser'),
	setupOptionsVariables = require('./setupVariables.js'),
	pacienteRouter = require('./routes/paciente.js'),
	lembreteRouter = require('./routes/lembrete.js'),
	medicoRouter = require('./routes/medico.js'),
	loginRouter = require('./routes/login.js'),
	pulseiraRouter = require('./routes/pulseira.js'),
	grupoPacientesRouter = require('./routes/grupoPacientes.js'),
	mailSender = require('./mailgunWraper.js');
	hospitaisRouter = require('./routes/hospitais.js');
	compartilhamentoRouter = require('./routes/compartilhamento.js');
	
//Setup inicial de conecção com a base de dados 	
connection = mysql.createConnection({
	host : '79.170.40.183',
	user : 'cl19-dbpipibic',
	password : senhas.senha_DB,
	database : 'cl19-dbpipibic'
});
connection.connect();

//setando todas as variáveis de options nos requests http de teste
setupOptionsVariables(app);

// request(app.optionsPostTestRequestLoginMudaSenha, function(err, httpResponse, body) { 
// 	console.log(err);
// 	//console.log(httpResponse);
// 	console.log(body);
// });

//Loop e multiplexação das pulseiras em atividade para resgate de parâmetros estáticos
<<<<<<< HEAD
// setInterval(function(){
// 	connection.query('SELECT idPulseira FROM Pulseira_Paciente', function(err,rows) {
// 		if (err) console.log(err);
// 		for (var i = 0; i < rows.length; i++) {
// 			getStaticHealthParams(0, rows[i].idPulseira);
// 		}
// 	});
// }, 900000);
=======
//setInterval(function(){
//	connection.query('SELECT idPulseira FROM Pulseira_Paciente', function(err,rows) {
//		if (err) console.log(err);
//		for (var i = 0; i < rows.length; i++) {
//			getStaticHealthParams(0, rows[i].idPulseira);
//		}
//	});
//}, 900000);
>>>>>>> 2bea3c4633efeb51a09f38ab9671326fc4f3050f

// //Loop e multiplexação das pulseiras em atividade para resgate de parâmetros dinâmicos
// setInterval(function() {
// 	var data = new Date(),
// 		delay = 30;
// 	connection.query('SELECT idPulseira FROM Pulseira_Paciente', function(err,rows) {
// 		if (err) console.log(err);
// 		for (var i = 0; i < rows.length; i++) {
// 			getDynamicHealthParams(rows[i].idPulseira, data, delay);
// 		}
// 	});
// }, 60000);

//request(optionsGetHR, getHRCallback);
//getDynamicHealthParams(60, new Date(), 0);
// getStaticHealthParams(0, 60);
//getStaticHealthParams(0, 18);
//console.log(getTodayDate());

/* 
getHRCallback é a função que trata a resposta advinda da chamada à API da FitBit com relação a
batimentos cardíacos.

TO DO:
	=> Melhorar algoritmo para pegar HR, atualmente ele é bem ineficiente em termos de espaço e talvez tempo
*/ 
function getDynamicHealthParams(idPulseira, currDate, delay) {

// 	var date = new Date(currDate);
// 	date.setSeconds(date.getSeconds() - 60);
// 	console.log(currDate);
// 	console.log(date);
	
	connection.query(`SELECT A.*, PulPac.pacienteAtual FROM Autenticacao A, Pulseira_Paciente PulPac WHERE A.idPulseira=${idPulseira} AND PulPac.idPulseira = A.idPulseira`, 
	  function(err, result, fields){
	  	//console.log(result);
		if (result.length < 1 || err) { return console.log('Erro ao puxar info de autenticação da base de dados para parâmetros dinâmicos.'); }
					
		var authorizationHeader = `Bearer ${result[0].accessToken}`;	
		var optionsGetHR = {
			url:`https://api.fitbit.com/1/user/${result[0].userID}/activities/heart/date/today/1d/1sec.json`, 
			headers: {
				'Authorization': authorizationHeader,
			}
		};

		request(optionsGetHR,function getHRCallback(errors, response, body) {
			console.log(response.statusCode);
			if (!errors && response.statusCode == 200) {
				info = JSON.parse(body);
				console.log(info);
				if (info.hasOwnProperty('activities-heart-intraday') &&
					info['activities-heart-intraday'].hasOwnProperty('dataset')){
					
					if (info['activities-heart-intraday'].dataset.length < 1) {
						console.log('Array vazio, a pulseira '+idPulseira+' ainda não sincronizou hoje');
					} else {
						formatDate(currDate);
						var len = info["activities-heart-intraday"].dataset.length;
						connection.query(`SELECT * FROM SaudeParamsDinamicos WHERE idPaciente=${result[0].pacienteAtual} AND hora='${info["activities-heart-intraday"].dataset[len-1].time}'`, function(err,rows) {
							if (err) { return console.log('Error: problema na base impediu armazenamento de dados HR'); }
							if (rows.length != 0) { return console.log('Erro:dado já armazenado! Sincronize novamente a pulseira '+idPulseira+' com o concentrador.'); }
							else {
								console.log(result[0].pacienteAtual +' '+ (len-1) + ' ' + info);//["activities-heart-intraday"].dataset[len-1]);
								connection.query(`INSERT INTO SaudeParamsDinamicos (idPaciente, data, hora, heartRate) VALUES (${result[0].pacienteAtual}, '${currDate.date}', '${info["activities-heart-intraday"].dataset[len-1].time}', ${info['activities-heart-intraday'].dataset[len-1].value})`);
								console.log('Dados de HR de pulseira '+idPulseira+' armazenados com sucesso!');						
							} 
						});
						console.log('útil');
					}
						
				} else {
					console.log('Erro: Algo deu errado, faltam componentes no json retornado.');
				}
				
			} 
			//tokens em OAuth valem por 1 hora, caso tenham expirado, refresh
			else if (response.statusCode == 401) {
				refreshOAuthToken(optionsGetHR, getHRCallback, result);
			}
		});
	
	})
		
}

//Função que formata e retorna data e hora
function formatDate(today) {

	dd = today.getDate(),
	MM = today.getMonth() + 1,
	yyyy = today.getFullYear();
	hh = today.getHours();
	mm = today.getMinutes();
	ss = today.getSeconds();
		
	if (MM < 10) MM = '0' + MM;
	if (dd < 10) dd = '0' + dd;
	if (hh < 10) hh = '0' + hh;
	if (mm < 10) mm = '0' + mm;
	if (ss < 10) ss = '0' + ss;
		
	today.date = `${yyyy}-${MM}-${dd}`;
	today.time = `${hh}:${mm}:${ss}`;
	return today;
}


/*
getStaticParams é uma função que puxa dados de saúde estáticos (não necessitam acompanhamento em tempo real)
da API da FitBit de maneira recursiva, a necessidade do uso da recursão veio da natureza assíncrona da função
request, que torna complexa a implementação usando for loop. Ao chamar, dê sempre um 0 como argumento i para 
resgatar os dados corretamente para a pulseira de id especificado.

TO DO:
	=> Otimizar velocidade da função, eliminando dados IntraDay da chamada à API da Fitbit.(Entrar em contato com a Fitbit).
*/
function getStaticHealthParams(i, idPulseira) {

	if (i == 4) return;

	connection.query('SELECT pacienteAtual FROM Pulseira_Paciente WHERE idPulseira=?',[idPulseira],function(error, res, fields){
		console.log(res[0].pacienteAtual);
		connection.query('SELECT * FROM Autenticacao WHERE idPulseira=?', [idPulseira],
		  function(erro, result, fields){
			console.log(result);
			if (result.length < 1 || erro) { return console.log('Erro ao puxar info de autenticação da base de dados para parâmetros estáticos.'); }
	  
			var authorizationHeader = `Bearer ${result[0].accessToken}`;
		
// 			var staticParamsArray = ['steps', 'calories', 'distance', 'floors'];
	
	
			var novaData = new Date();
			formatDate(novaData);
			var newStaticParamOption = {
// 				url: `https://api.fitbit.com/1/user/${result[0].userID}/activities/${staticParamsArray[i]}/date/today/1d.json`,
				url:`https://api.fitbit.com/1/user/${result[0].userID}/activities/date/${novaData.date}.json`,
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
					console.log('teste');
					
					var steps = activity.summary.steps,
						floors = activity.summary.floors,
						distance = activity.summary.distances[0].distance,
						calories = activity.summary.caloriesOut,
						data = novaData.date;

					newStaticQuery = {
						sql: `SELECT * FROM SaudeParamsEstaticos WHERE idPaciente=${res[0].pacienteAtual} AND data='${data}'`, 
						timeout: 10000
					}
					connection.query(newStaticQuery, function(err, rows, fields) {
						if(rows.length < 1) {
							newStaticQuery = {
								sql: `INSERT INTO SaudeParamsEstaticos (idPaciente, data, steps,calories, distance, floors) VALUES (${res[0].pacienteAtual}, '${data}', ${steps}, ${calories}, ${distance}, ${floors})`,
								timeout: 10000
							}
						}
						else if (rows.length == 1){
							newStaticQuery = {
								sql: `UPDATE SaudeParamsEstaticos SET steps=${steps},calories=${calories}, distance=${distance},floors=${floors} WHERE data='${data}' AND idPaciente=${res[0].pacienteAtual}`,
								timeout: 10000
							}
						} else throw new Error("Ambiguidades com id e/ou data de pacientes na base de dados");
						connection.query(newStaticQuery);
					});
					
					
					console.log(activity);
					console.log(activity.summary.distances);
					console.log(activity.summary.steps +'  '+activity.summary.floors+'  '+activity.summary.distances[0].distance +'  '+activity.summary.caloriesOut);					
// 					var activity = JSON.parse(body);
// 					var property = 'activities-' + staticParamsArray[i];
// 					if (staticParamsArray[i] == 'steps') {
// 						newStaticQuery = {
// 							sql: `SELECT * FROM SaudeParamsEstaticos WHERE idPaciente=${res[0].pacienteAtual} AND data='${activity[property][0].dateTime}'`, 
// 							timeout: 10000
// 						}
// 						connection.query(newStaticQuery, function(err, rows, fields) {
// 							if(rows.length < 1) {
// 								newStaticQuery = {
// 									sql: `INSERT INTO SaudeParamsEstaticos (idPaciente, data, steps) VALUES (${res[0].pacienteAtual}, '${activity[property][0].dateTime}', ${activity[property][0].value})`,
// 									timeout: 10000
// 								}
// 							}
// 							else if (rows.length == 1){
// 								newStaticQuery = {
// 									sql: `UPDATE SaudeParamsEstaticos SET steps=${activity[property][0].value} WHERE data='${activity[property][0].dateTime}' AND idPaciente=${res[0].pacienteAtual}`,
// 									timeout: 10000
// 								}
// 							} else throw new Error("Ambiguidades com id e/ou data de pacientes na base de dados");
// 							connection.query(newStaticQuery);
// 						});
// 					} else {
// 						staticQuery = {
// 							sql: `UPDATE SaudeParamsEstaticos SET ${staticParamsArray[i]}=${activity[property][0].value} WHERE data='${activity[property][0].dateTime}' AND idPaciente=${res[0].pacienteAtual}`,
// 							timeout: 10000
// 						}
// 						connection.query(staticQuery, function(err, rows, fields) {
// 						});
// 					}
// 					getStaticHealthParams(i+1, idPulseira);
				}
			});
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
	var tokenRefreshAuthorization = 'Basic ' + new Buffer(`${senhas.clientID}:${senhas.clientSecret}`).toString('base64');
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
			  'UPDATE Autenticacao SET accessToken=?, refreshToken=? WHERE idPulseira=?',
			  [temp.access_token, temp.refresh_token, auth[0].idPulseira],
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

//Tentativa de corrigir CORS para interação com front end
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//Setup da template engine escolhida para renderizar emails e páginas web
app.set('view engine', 'pug');
app.set('views','./views');

// ROUTING DO SERVIDOR E API's nativas da aplicação
app.get('/', function(req, res) {
	res.render('index');
});

//Ações para alterar tabela paciente na base de dados, usar módulo local ./router/paciente.js
app.use('/api/paciente', pacienteRouter);
	
//Ações para alterar tabela Médico na base de dados, usar módulo local ./router/medico.js
app.use('/api/medico', medicoRouter);

//Ações para alterar tabela Lembrete na base de dados, usar módulo local ./router/lembrete.js
app.use('/api/lembrete', lembreteRouter);

//Ações para alterar tabela Login na base de dados, usar módulo local ./router/login.js
app.use('/api/login', loginRouter);

//Ações para alterar tabela Login na base de dados, usar módulo local ./router/pulseira.js
app.use('/api/pulseira', pulseiraRouter);

app.use('/api/grupoPacientes', grupoPacientesRouter);

app.use('/api/hospitais', hospitaisRouter);

app.use('/api/compartilhamento', compartilhamentoRouter);

port = process.env.PORT || 3000;

app.listen(port);
