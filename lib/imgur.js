'use strict';

var Promise = require('bluebird');
var SuperError = require('super-error');
var request = require('superagent');

var CLIENT_ID = '1ea9b0e82f406cc';

var ClientError = SuperError.subclass(exports, 'ImgurClientError');

exports.MAXIMUM_PNG_LENGTH = 1000000;
exports.MAXIMUM_DATA_LENGTH = 997547;

var URL_REGEXP = new RegExp('^https?://i\\.imgur\\.com/([^.]+)\\.png$');

exports.idToURL = function(id) {
  if (URL_REGEXP.test(id)) return id;
  return 'https://i.imgur.com/' + id + '.png';
};

exports.urlToID = function(url) {
  var match = URL_REGEXP.exec(url);
  if (match) return match[1];
  else return url;
};

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
    request.get(exports.idToURL(id))
      .on('error', reject)
      .end(resolve);
  }).get('body');
};
