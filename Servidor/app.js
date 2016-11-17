var express = require('express'),
	app = express(),
	request = require('request'),
	fs = require('fs'),
	mysql = require('mysql');
	
var connection = mysql.createConnection({
	host : '79.170.40.183',
	user : 'cl19-dbpipibic',
	password : 'XXXXXXXXXXX',
	database : 'cl19-dbpipibic'
});

connection.connect();

connection.query('INSERT INTO Paciente (nomePaciente) VALUES ("José Júnior")', 
function(error, result, fields){
	console.log(error);
	console.log(result);
	console.log(fields);
});
	

//Fazer request GET para puxar dados de HR meus da API da FitBit	

//info vai conter dados HR de chamada bem sucedida à API fitbit
var info = {};
//fitbitAccess contem dados sobre autenticação OAuth 2.0
var fitbitAccess = JSON.parse(fs.readFileSync('./fitbitAccess.json','utf8'));
var hrAuthorizationHeader = `Bearer ${fitbitAccess.access_token}`;

var optionsGetHR = {
	url:'https://api.fitbit.com/1/user/4Z3ZH3/activities/heart/date/today/1d.json',
	headers: {
		'Authorization': hrAuthorizationHeader,
	}
};

request(optionsGetHR, getHRCallback);

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
		//adicionar código de automação de refresh access token
		//Adicionado código de automação para refresh de token de acesso
		//TO DO: 
		var tokenRefreshAuthorization = 'Basic ' + new Buffer("XXXXXX:XXXXXXXXXXXXXXXXXXXXXX").toString('base64');
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


//código servidor	
app.get('/', function(req, res) {
	res.json(info);
});

app.post('/', function(req, res) {
	res.json({ name:'John', surname: 'Doe' });
});

port = process.env.PORT || 3000

app.listen(port);
