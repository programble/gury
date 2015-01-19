'use strict';

var fs = require('fs');
var path = require('path');

var R = require('ramda');
var Promise = require('bluebird');
Promise.promisifyAll(fs);

var blob = require('./blob');
var metadata = require('./metadata');
var log = require('./log');

exports.upload = function(colorSpace, filenames) {
  return Promise.resolve(filenames)
    .map(function(filename) {
      return fs.readFileAsync(filename)
        .then(R.lPartial(blob.upload, colorSpace, filename))
        .then(R.prepend(filename))
    })
    .then(R.lPartial(metadata.upload, colorSpace));
};

exports.download = function(id) {
  return metadata.download(id)
    .map(function(fileMetadata) {
      var filename = fileMetadata[0];
      var lastChunkLength = fileMetadata[1];
      var ids = fileMetadata[2];

      return blob.download(filename, lastChunkLength, ids)
        .then(function(data) {
          return fs.writeFileAsync(filename, data);
        });
    });
};
