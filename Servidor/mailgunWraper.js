/*
Este módulo envelopa a funcionalidade do mailgun de envio de emails
*/

module.exports = function(mail, callback) {

	var api_key = 'key-a2dd99a346672914f2ad5072cd96bc83';
	var domain = 'julianop.com.br';
	var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
 
 	mail.from = 'Pulseiras Inteligentes <projetoPulseiras@julianop.com.br>';

	mailgun.messages().send(mail, callback);
	
}