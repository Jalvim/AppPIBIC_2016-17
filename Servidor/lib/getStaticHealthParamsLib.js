/*
getStaticParams é uma função que puxa dados de saúde estáticos (não necessitam acompanhamento em tempo real)
da API da FitBit de maneira recursiva, a necessidade do uso da recursão veio da natureza assíncrona da função
request, que torna complexa a implementação usando for loop. Ao chamar, dê sempre um 0 como argumento i para 
resgatar os dados corretamente para a pulseira de id especificado.

*/

var mysql = require('./mysqlWraper.js'),
	senhas = require('../senhas.js'),
	request = require('request');
	
var refreshOAuthToken = require('./refreshOAuthTokenLib.js');
var formatDate = require('./formatDateLib.js');

module.exports = function getStaticHealthParams(idPulseira) {

	mysql.getConnection(getStaticHealthParamsProcedure.bind(null, idPulseira));
		
}

function getStaticHealthParamsProcedure(idPulseira, err, connection) {

	connection.query('SELECT pacienteAtual FROM Pulseira_Paciente WHERE idPulseira=?',
		[idPulseira],
		getPacienteAtualCallback.bind(null, idPulseira, connection)
	);

}

function getPacienteAtualCallback(idPulseira, connection, error, res, fields){
	console.log(res[0].pacienteAtual);
	connection.query('SELECT * FROM Autenticacao WHERE idPulseira=?', 
		[idPulseira],
	  	getAuthPulseiraCallback.bind(null, connection, res)
	);
}

function getAuthPulseiraCallback(connection, res, erro, result, fields){
	console.log(result);
	if (result == null || result.length < 1 || erro) { 
		return console.log('Erro ao puxar info de autenticação da base de dados para parâmetros estáticos.'); 
	}

	var authorizationHeader = `Bearer ${result[0].accessToken}`;	

	var novaData = new Date();
	formatDate(novaData);
	var newStaticParamOption = {
		url:`https://api.fitbit.com/1/user/${result[0].userID}/activities/date/${novaData.date}.json`,
		headers: {
			'Authorization': authorizationHeader,
		}
	}
	request(newStaticParamOption, getStaticHealthParamsCallback.bind(null, novaData, connection, newStaticParamOption, result, res));
}

function getStaticHealthParamsCallback(novaData, connection,newStaticParamOption, result, res, errors, response, body){
	console.log(response.statusCode);
	if (response.statusCode == 401) {
		refreshOAuthToken(newStaticParamOption, getStaticHealthParamsCallback, result);
	} else if (!errors && response.statusCode == 200) {
	
		var activity = JSON.parse(body);

		newStaticQuery = {
			sql: `SELECT * FROM SaudeParamsEstaticos WHERE idPaciente=${res[0].pacienteAtual} AND data='${novaData.date}'`, 
			timeout: 10000
		}
		connection.query(newStaticQuery, storeStaticParams.bind(null, connection, res, novaData, activity));
	
	
		console.log(activity);
		console.log(activity.summary.distances);
		console.log(activity.summary.steps +'  '+activity.summary.floors+'  '+activity.summary.distances[0].distance +'  '+activity.summary.caloriesOut);
	}
}

function storeStaticParams(connection, res, novaData, activity, err, rows, fields) {

	var steps = activity.summary.steps,
		floors = activity.summary.floors,
		distance = activity.summary.distances[0].distance,
		calories = activity.summary.caloriesOut,
		data = novaData.date;

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
}