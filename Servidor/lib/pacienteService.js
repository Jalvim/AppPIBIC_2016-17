"use strict";

var mysql = require('./mysqlWraper.js');
var base64Util = require('../lib/base64Util.js');

var exports = module.exports = {};

exports.getAllByOrderedByLastModification = function(idMedico) {
    return new Promise(function(resolve, reject) {
        mysql.getConnection(function(err,connection) {
            var query = {
                sql: `SELECT P.* FROM Paciente_Medico PM INNER JOIN Paciente P ON PM.idPaciente = P.idtable1 WHERE PM.idMedico = ${connection.escape(idMedico)}  ORDER BY P.timestamp DESC`,
                timeout: 10000
            }

            connection.query(query, function(err, rows, fields) {
                if(!err)
                    resolve(_encodePatientsPhotosAsBase64(rows));
                resolve([]);
            });
        });
    });
}

var _encodePatientsPhotosAsBase64 = function(rows) {
	var rowsWithPhotosEncodedInBase64 = rows.slice();
	// package mysql autocast BLOB to Buffer
	for (var row of rowsWithPhotosEncodedInBase64) {
		row.foto = base64Util.encodeBufferToBase64(row.foto);
	}
	return rowsWithPhotosEncodedInBase64;
}

exports.encodePatientsPhotosAsBase64 = _encodePatientsPhotosAsBase64;
