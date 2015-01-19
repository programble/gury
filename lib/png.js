'use strict';

var Promise = require('bluebird');
var PNGEncoder = require('png-stream/encoder');
var PNGDecoder = require('png-stream/decoder');

var streamToBuffer = require('./stb');

exports.encode = function(colorSpace, data) {
  var size = Math.ceil(Math.sqrt(data.length / colorSpace.length));
  var padding = new Buffer(size * size * colorSpace.length - data.length);
  padding.fill(0);

  var encoder = new PNGEncoder(size, size, { colorSpace: colorSpace });
  encoder.write(data);
  encoder.end(padding);

  return streamToBuffer(encoder);
};

exports.decode = function(len, png) {
  var decoder = new PNGDecoder();
  decoder.end(png);
  return streamToBuffer(decoder);
};
