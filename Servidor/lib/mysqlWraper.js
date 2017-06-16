var mysql = require('mysql');
var settings = require('../senhas.js');
// Servidor Heroku
var pool = mysql.createPool({
	connectionLimit:100,
	host : '79.170.40.183',
	user : 'cl19-dbpipibic',
	password : settings.senha_DB,
	database : 'cl19-dbpipibic'
});


/* Servidor Digital Ocean
var pool = mysql.createPool({
	connectionLimit:100,
	host : 'julianop.com.br',
	user : 'root',
	password : 'pibicfitbit',
	database : 'dbpibic'

});
*/

pool.on('acquire', function(connection){
	console.log('Acquired');
});

pool.on('release', function(connection) {
	console.log('conexão foi liberada após call!');
});

module.exports.getConnection = function(callback) {
  pool.getConnection(function(err, conn) {
    if(err) {
      return callback(err);
    }
    callback(err, conn);
    conn.release();
  });
};
