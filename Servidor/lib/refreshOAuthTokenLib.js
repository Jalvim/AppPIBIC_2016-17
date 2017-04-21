/*
refreshOAuthToken é função genérica de refresh do token de acesso exigido pela API da FitBit para 
permitir chamadas à mesma. Pelo protocolo OAuth2, o token de acesso expira a cada 1 hora sem uso,
sendo então necessário o uso desta função.

*/

var mysql = require('./mysqlWraper.js'),
	senhas = require('../senhas.js'),
	request = require('request');

module.exports = function refreshOAuthToken(options, callback, auth) {

	var parentFunctionVariables = {};
	parentFunctionVariables.options = options;
	parentFunctionVariables.callback = callback;
	parentFunctionVariables.auth = auth;

	mysql.getConnection(refreshOAuthProcedure.bind(null, parentFunctionVariables));

}

function refreshOAuthProcedure(parentFunctionVariables, err,connection) {

	parentFunctionVariables.connection = connection;

	//Adicionado código de automação para refresh de token de acesso
	var tokenRefreshAuthorization = 'Basic ' + new Buffer(`${senhas.clientID}:${senhas.clientSecret}`).toString('base64');

	var	optionsRefreshToken = {
		method:'POST',
		url:'https://api.fitbit.com/oauth2/token',
		headers: {
			'Authorization': tokenRefreshAuthorization,
		},
		form:{ 
			grant_type:'refresh_token', 
			refresh_token: parentFunctionVariables.auth[0].refreshToken
		}
	};

	request(optionsRefreshToken, refreshRequestCallback.bind(null, parentFunctionVariables));
}

function refreshRequestCallback(parentFunctionVariables, err, response, body){
	console.log('Dando refresh no access token... DONE! ');
	console.log(body);
	parentFunctionVariables.temp = JSON.parse(body);
	if (parentFunctionVariables.temp.hasOwnProperty('errors')) {
		console.log('Error:Chamada refresh à API mal sucedida, algo deu errado');
	} else { 
		parentFunctionVariables.connection.query(
		  'UPDATE Autenticacao SET accessToken=?, refreshToken=? WHERE idPulseira=?',
		  [parentFunctionVariables.temp.access_token, parentFunctionVariables.temp.refresh_token, parentFunctionVariables.auth[0].idPulseira],
		  storeOAuthData.bind(null, parentFunctionVariables));
	}

}

function storeOAuthData(parentFunctionVariables, err){
	if (err) console.log('Erro ao armazenar dados refreshed na base de dados');
	else { 
		console.log('Sucesso no refresh dos dados.');
		parentFunctionVariables.options.headers['Authorization'] = 	`Bearer ${parentFunctionVariables.temp.access_token}`;
		request(parentFunctionVariables.options, parentFunctionVariables.callback); 
	} 
}