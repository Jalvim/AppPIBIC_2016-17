"use strict";

var senhas = require('../senhas.js');
var express = require('express');
var mysql = require('../lib/mysqlWraper.js');
var request = require('request');
var router = express.Router();
var _ = require('lodash');
var lembreteService = require('../lib/lembreteService.js');
var pacienteService = require('../lib/pacienteService.js');
// feed/:idMedico?limit=20
// feed/:idMedico?offset=80&limit=40

router.get('/:idMedico', function(req, res) {
    // A - retrieve doctor's reminders
    // B - retrieve doctor's patients registered
    // transform each one(A,B) into a FeedItem and map results
    // sort results by descending date
    // take in account possible 'limit' and 'offset'
    var request = _.cloneDeep(req);
    if(!request.query.limit)
        request.query.limit = 0;
    if(!request.query.offset)
        request.query.offset = 0;

    var feedItemsArray = generateArrayWithFeedItemsOrderedByLastModification(request.params.idMedico, request.query.limit);

    return res.json(feedItemsArray);
});

function generateArrayWithFeedItemsOrderedByLastModification(idMedico, limit) {
    var doctorRemindersModifications;

    lembreteService.getAllByOrderedByLastModification(idMedico, limit)
    .then(function(reminders) {
        doctorRemindersModifications = reminders;
        return pacienteService.getAllByOrderedByLastModification(idMedico, limit);
    }).then(function(patients) {
        console.log(doctorRemindersModifications.length);
        console.log(patients.length);
    });

    // var doctorPatientsModifications = pacienteService.getAllByOrderedByLastModification(idMedico, limit);
}

module.exports = router;
