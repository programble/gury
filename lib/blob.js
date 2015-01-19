'use strict';

var assert = require('assert');

var R = require('ramda');
var Promise = require('bluebird');

var png = require('./png');
var imgur = require('./imgur');
var log = require('./log');

exports.upload = function(colorSpace, filename, data) {
  var chunks = [];
  var offset = 0;
  while (offset < data.length) {
    chunks.push(data.slice(offset, offset += imgur.MAXIMUM_DATA_LENGTH));
  }

  return Promise.resolve(chunks)
    .map(R.lPartial(png.encode, colorSpace))
    .each(function(pngData) {
      assert(pngData.length < imgur.MAXIMUM_PNG_LENGTH);
    })
    .map(imgur.upload)
    .each(function(id, index) {
      log(filename, chunks[index].length, id);
    })
    .then(function(ids) {
      return [ R.last(chunks).length, ids ];
    });
};

exports.download = function(filename, lastChunkLength, ids) {
  return Promise.resolve(ids)
    .map(imgur.download)
    .map(function(pngData, index) {
      var length = (index === ids.length - 1 ? lastChunkLength : imgur.MAXIMUM_DATA_LENGTH);
      log(filename, length, ids[index]);
      return png.decode(length, pngData);
    })
    .then(Buffer.concat);
};
