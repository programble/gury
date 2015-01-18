'use strict';

var R = require('ramda');
var Promise = require('bluebird');
var crypto = require('crypto');
var PNGEncoder = require('png-stream/encoder');

var randomBytes = Promise.promisify(crypto.randomBytes);

var MB = 1000000;

function encodeRandomPNG(len) {
  return randomBytes(len)
    .then(function(bytes) {
      var size = Math.ceil(Math.sqrt(len / 4));
      var stream = new PNGEncoder(size, size, { colorSpace: 'rgba' });

      stream.write(bytes);
      stream.end();

      var bufs = [];
      stream.on('data', function(buf) { bufs.push(buf); });

      return new Promise(function(resolve, reject) {
        stream.on('end', function() { resolve(Buffer.concat(bufs)); });
      });
    });
}

function doThings(tries, len) {
  console.log('Encoding %d x %dB random PNGs...', tries, len);

  var pngs = R.times(R.lPartial(encodeRandomPNG, len), tries);

  return Promise.all(pngs)
    .then(R.map(R.prop('length')))
    .then(R.max)
    .then(function(max) {
      console.log('Maximum PNG size is %dB', max);
      if (max > MB) return doThings(tries, len - 1);
      return max;
    });
}

doThings(parseInt(process.argv[2]) || 100, MB);
