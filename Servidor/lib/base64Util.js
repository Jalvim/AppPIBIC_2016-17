"use strict";

var _ = require('lodash');

var exports = module.exports = {};

var _canBeDecodedFromBase64 = function(str) {
    var base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
    return str.length == 0 || base64regex.test(str);
}

var _encodeBufferToBase64 = function(buffer) {
    var encodedBuffer = _.cloneDeep(buffer);
    if (encodedBuffer && _isBuffer(buffer))
        encodedBuffer = encodedBuffer.toString('base64');

    return encodedBuffer;
}

var _isBuffer = function(obj) {
    return typeof obj === 'Buffer' || obj instanceof Buffer;
}

exports.canBeDecodedFromBase64 = _canBeDecodedFromBase64;
exports.encodeBufferToBase64 = _encodeBufferToBase64;
