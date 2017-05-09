"use strict";

var _ = require('lodash');

var exports = module.exports = {};

exports.generateFeedItemFromReminders = function(remindersOrderedByLastModification) {
    return remindersOrderedByLastModification.map(transformReminder);
}

function transformReminder(reminder) {
    var result = {
        type: 'Lembrete',
        timestamp: reminder.timestamp,
        reminder: _.cloneDeep(reminder)
    }
    return result;
}

exports.generateFeedItemFromPatients = function(patientsOrderedByLastModification) {
    return patientsOrderedByLastModification.map(transformPatient);
}

function transformPatient(patient) {
    var result = {
        type: 'Paciente',
        timestamp: patient.timestamp,
        patient: _.cloneDeep(patient)
    }
    return result;
}

exports.orderFeedItemsByDescendingTimestamp = function(feedItems) {
    var feedItemsByAscTimeStamp = _.sortBy(feedItems, function(feedItem) { return feedItem.timestamp });
    return _.reverse(feedItemsByAscTimeStamp);
}

exports.sliceFeedItemsConsideringOffsetAndLimit = function(feedItems, offset, limit) {
    // copying to not modify original feedItems
    var sliced = feedItems.slice();
    if (offset > 0)
        sliced = feedItems.slice(offset);

    var takeCount = limit;
    if (takeCount == 0)
        takeCount = feedItems.length;

    return _.take(sliced, takeCount);
}
