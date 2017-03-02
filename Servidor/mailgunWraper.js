/*
Este módulo envelopa a funcionalidade do mailgun de envio de emails
*/

module.exports = function(mail, callback) {

	var api_key = 'key-a2dd99a346672914f2ad5072cd96bc83';
	var domain = 'sandbox5bf4838706e24e158b9da06c0117db2f.mailgun.org';
	var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
 
 	mail.from = 'Pulseiras Inteligentes <postmaster@sandbox5bf4838706e24e158b9da06c0117db2f.mailgun.org>';

	mailgun.messages().send(mail, callback);
	
}