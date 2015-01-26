'use strict';

var assert = require('assert');

var R = require('ramda');
var Promise = require('bluebird');

var png = require('./png');
var imgur = require('./imgur');
var log = require('./log');

exports.upload = function(colorSpace, data) {
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
    .map(imgur.upload, { concurrency: 1 })
    .then(function(ids) {
      return [ R.last(chunks).length, ids ];
    });
};

exports.download = function(lastChunkLength, ids) {
  return Promise.resolve(ids)
    .map(imgur.download, { concurrency: 1 })
    .map(function(pngData, index) {
      var length = (index === ids.length - 1 ? lastChunkLength : imgur.MAXIMUM_DATA_LENGTH);
      return png.decode(length, pngData);
    })
    .then(Buffer.concat);
};
