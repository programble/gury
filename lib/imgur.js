'use strict';

var Promise = require('bluebird');
var SuperError = require('super-error');
var request = require('superagent');

var streamToBuffer = require('./stb');

var CLIENT_ID = '1ea9b0e82f406cc';

var ClientError = SuperError.subclass(exports, 'ImgurClientError');

exports.upload = function(image) {
  return new Promise(function(resolve, reject) {
    request.post('https://api.imgur.com/3/image')
      .set('Authorization', 'Client-ID ' + CLIENT_ID)
      .type('form')
      .send({ type: 'base64', image: image.toString('base64') })
      .on('error', reject)
      .end(resolve);
  }).then(function(res) {
    if (res.error) throw res.error;
    if (res.body.data && res.body.data.id) return res.body.data.id;
    throw new ClientError('No ID returned');
  });
};

exports.download = function(id) {
  return new Promise(function(resolve, reject) {
    request.get('https://i.imgur.com/' + id + '.png')
      .on('error', reject)
      .end(resolve);
  }).then(streamToBuffer);
};
