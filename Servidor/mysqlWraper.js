var mysql = require('mysql');
var senhas = require('./senhas.js');

module.exports = mysql.createConnection({
	host : '79.170.40.183',
	user : 'cl19-dbpipibic',
	password : senhas.senha_DB,
	database : 'cl19-dbpipibic'
});