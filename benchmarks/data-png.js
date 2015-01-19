'use strict';

var crypto = require('crypto');

var R = require('ramda');
var Promise = require('bluebird');
var randomBytes = Promise.promisify(crypto.randomBytes);

var png = require('../lib/png');

function benchmark(colorSpace, iterations, target, len) {
  var pngs = R.times(function() {
    return randomBytes(len).then(R.lPartial(png.encode, colorSpace));
  }, iterations);

  return Promise.all(pngs)
    .then(R.map(R.prop('length')))
    .then(R.max)
    .then(function(max) {
      console.log(len, max);
      if (max <= target) return len;
      return benchmark(colorSpace, iterations, target, len - 1);
    });
}

var colorSpace = process.argv[2] || 'rgb';
var iterations = parseInt(process.argv[3]) || 50;
var target = parseInt(process.argv[4]) || 1000000;
var init = parseInt(process.argv[5]) || target;

benchmark(colorSpace, iterations, target, init).then(console.log);
