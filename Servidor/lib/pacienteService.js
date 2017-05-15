"use strict";

var mysql = require('./mysqlWraper.js');

var exports = module.exports = {};

exports.getAllByOrderedByLastModification = function(idMedico) {
    return new Promise(function(resolve, reject) {
        mysql.getConnection(function(err,connection) {
            var query = {
                sql: `SELECT P.* FROM Paciente_Medico PM, Paciente P WHERE PM.idMedico = ${connection.escape(idMedico)} AND PM.idPaciente = P.idtable1 ORDER BY p.timestamp DESC`,
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
		var photoBuffer = row.foto;
		if (typeof photoBuffer === 'Buffer' || photoBuffer instanceof Buffer) {
			var bufferBase64 = photoBuffer.toString('base64');
			row.foto = bufferBase64;
		}
	}
	return rowsWithPhotosEncodedInBase64;
}

exports.encodePatientsPhotosAsBase64 = _encodePatientsPhotosAsBase64;