'use strict';

var assert = require('assert');

var R = require('ramda');
var Promise = require('bluebird');
var msgpack = require('msgpack');

var png = require('./png');
var imgur = require('./imgur');

exports.upload = function(colorSpace, metadata) {
  return Promise.resolve(msgpack.pack(metadata))
    .then(R.lPartial(png.encode, colorSpace))
    .tap(function(pngData) {
      assert(pngData.length < imgur.MAXIMUM_PNG_LENGTH);
    })
    .then(imgur.upload);
};

exports.download = function(id) {
  return imgur.download(id)
    .then(R.lPartial(png.decode, imgur.MAXIMUM_DATA_LENGTH))
    .then(msgpack.unpack);
};
