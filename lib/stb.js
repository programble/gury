var Promise = require('bluebird');

module.exports = function streamToBuffer(stream) {
  return new Promise(function(resolve, reject) {
    var bufs = [];
    stream.on('data', function(buf) { bufs.push(buf); });
    stream.on('end', function() { resolve(Buffer.concat(bufs)); });
    stream.on('error', reject);
  });
};
