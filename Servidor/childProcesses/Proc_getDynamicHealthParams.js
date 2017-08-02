var mysql = require('../lib/mysqlWraper.js');
var refreshOAuthToken = require('../lib/refreshOAuthTokenLib.js');
var getDynamicHealthParams = require('../lib/getDynamicHealthParamsLib.js');
var getStaticHealthParams = require('../lib/getStaticHealthParamsLib.js');
// var getStaticHealthParams = require('../lib/formatDateLib.js');

//Loop e multiplexação das pulseiras em atividade para resgate de parâmetros estáticos
// setInterval(function(){
// 	mysql.getConnection(function(err,connection) {
// 		connection.query('SELECT idPulseira FROM Pulseira_Paciente', function(err,rows) {
// 			if (err) console.log(err);
// 			for (var i = 0; i < rows.length; i++) {
// 				getStaticHealthParams(rows[i].idPulseira);
// 			}
// 		});
// 	});
// }, 900000);

//Loop e multiplexação das pulseiras em atividade para resgate de parâmetros dinâmicos
setInterval(function() {

	mysql.getConnection(function(err,connection) {

		var data = new Date(),
		delay = 30;
		connection.query('SELECT idPulseira FROM Pulseira_Paciente', function(err,rows) {
			if (err) console.log(err);
			for (var i = 0; i < rows.length; i++) {
					getDynamicHealthParams(rows[i].idPulseira, data, delay);
			}
		});
	});
}, 30000);

//request(optionsGetHR, getHRCallback);
//getDynamicHealthParams(60, new Date(), 0);
// getStaticHealthParams(0, 60);
//getStaticHealthParams(0, 18);
//console.log(getTodayDate());

// Listen for incoming data:
// process.stdin.on('data', function (data) {
// //     console.log('Received data: ' + data);
//     if (data == 'Hi there'){
//     	throw new Error("Algo deu errado!");
//     }
// });
