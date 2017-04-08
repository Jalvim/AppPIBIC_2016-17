/* 
getHRCallback é a função que trata a resposta advinda da chamada à API da FitBit com relação a
batimentos cardíacos.

TO DO:
	=> Melhorar algoritmo para pegar HR, atualmente ele é bem ineficiente em termos de espaço e talvez tempo
	=> Compartimentarizar callbacks aninhadas
*/ 

var mysql = require('./mysqlWraper.js'),
	senhas = require('../senhas.js'),
	request = require('request');
	
var refreshOAuthToken = require('./refreshOAuthTokenLib.js');
var formatDate = require('./formatDateLib.js');

module.exports = function getDynamicHealthParams(idPulseira, currDate, delay) {

// 	var date = new Date(currDate);
// 	date.setSeconds(date.getSeconds() - 60);
// 	console.log(currDate);
// 	console.log(date);

	mysql.getConnection(function(err, connection) {
	
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
	
		});
	});
		
}