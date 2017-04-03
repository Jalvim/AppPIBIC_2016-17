/*
Este módulo envelopa a funcionalidade do mailgun de envio de emails
*/
var senhas = require('../senhas.js');

module.exports = function(mail, callback) {

	var api_key = senhas.mailgunKey;
	var domain = 'julianop.com.br';
	var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
 
 	mail.from = 'Pulseiras Inteligentes <projetoPulseiras@julianop.com.br>';

	mailgun.messages().send(mail, callback);
	
}