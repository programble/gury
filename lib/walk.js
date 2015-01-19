'use strict';

var fs = require('fs');
var path = require('path');

var R = require('ramda');
var Promise = require('bluebird');
Promise.promisifyAll(fs);

module.exports = function walk(directory) {
  return fs.readdirAsync(directory)
    .map(R.unary(R.lPartial(path.join, directory)))
    .map(function(filename) {
      return fs.statAsync(filename)
        .then(function(stats) {
          if (stats.isDirectory()) return walk(filename);
          else return filename;
        });
    })
    .then(R.flatten);
};
