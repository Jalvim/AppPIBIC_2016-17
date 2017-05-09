"use strict";

var senhas = require('../senhas.js');
var express = require('express');
var mysql = require('../lib/mysqlWraper.js');
var request = require('request');
var router = express.Router();
var _ = require('lodash');
var lembreteService = require('../lib/lembreteService.js');
var pacienteService = require('../lib/pacienteService.js');
var feedService = require('../lib/feedService.js');

// feed/:idMedico?limit=20
// feed/:idMedico?offset=80&limit=40

router.get('/:idMedico', function(req, res) {
    var _req = _.cloneDeep(req);
    if(!_req.query.limit)
        _req.query.limit = 0;
    else if(_req.query.limit <= 0)
        res.send("O parâmetro 'limit' deve ser maior que 0.");

    if(!_req.query.offset)
        _req.query.offset = 0;
    else if(_req.query.offset < 0)
        res.send("O parâmetro 'offset' deve ser maior ou igual a 0.");

    generateArrayWithFeedItemsOrderedByLastModification(_req.params.idMedico)
    .then(function(feedItems) {
        var feedItemsSliced = feedService.sliceFeedItemsConsideringOffsetAndLimit(feedItems, _req.query.offset, _req.query.limit);
        return res.json(feedItemsSliced);
    });

});

function generateArrayWithFeedItemsOrderedByLastModification(idMedico) {
    return new Promise(function(resolve, reject) {
        var doctorRemindersModifications;
        lembreteService.getAllByOrderedByLastModification(idMedico)
        .then(function(reminders) {
            doctorRemindersModifications = reminders;
            return pacienteService.getAllByOrderedByLastModification(idMedico);
        }).then(function(patients) {
            var feedItems = feedService.generateFeedItemFromReminders(doctorRemindersModifications).concat(feedService.generateFeedItemFromPatients(patients));

            resolve(feedService.orderFeedItemsByDescendingTimestamp(feedItems));
        });
    });
}

module.exports = router;
