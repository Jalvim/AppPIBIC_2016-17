/*
refreshOAuthToken é função genérica de refresh do token de acesso exigido pela API da FitBit para 
permitir chamadas à mesma. Pelo protocolo OAuth2, o token de acesso expira a cada 1 hora sem uso,
sendo então necessário o uso desta função.

*/

var mysql = require('./mysqlWraper.js'),
	senhas = require('../senhas.js'),
	request = require('request');

module.exports = function refreshOAuthToken(options, callback, auth) {

	mysql.getConnection(refreshOAuthProcedure.bind(null, auth, callback, options));

}

function refreshOAuthProcedure(auth, callback, options, err,connection) {

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
			refresh_token: auth[0].refreshToken
		}
	};

	request(optionsRefreshToken, refreshRequestCallback.bind(null, auth, callback, options));
}

function refreshRequestCallback(auth, callback, options, err, response, body){
	console.log('Dando refresh no access token... DONE! ');
	console.log(body);
	var temp = JSON.parse(body);
	if (temp.hasOwnProperty('errors')) {
		console.log('Error:Chamada refresh à API mal sucedida, algo deu errado');
	} else { 
		connection.query(
		  'UPDATE Autenticacao SET accessToken=?, refreshToken=? WHERE idPulseira=?',
		  [temp.access_token, temp.refresh_token, auth[0].idPulseira],
		  storeOAuthData.bind(null, auth, callback, options));
	}

}

function storeOAuthData(auth, callback, options, err){
	if (err) console.log('Erro ao armazenar dados refreshed na base de dados');
	else { 
		console.log('Sucesso no refresh dos dados.');
		options.headers['Authorization'] = 	`Bearer ${temp.access_token}`;
		request(options, callback); 
	} 
}