#!/usr/bin/env node

'use strict';

var fs = require('fs');
var path = require('path');

var R = require('ramda');
var Promise = require('bluebird');
var minimist = require('minimist');

var packageJSON = require('../package');
var gury = require('../lib');
var imgur = require('../lib/imgur');
var metadata = require('../lib/metadata');
var walk = require('../lib/walk');

var args = minimist(process.argv.slice(2), {
  alias: {
    u: 'upload',
    d: 'download',
    t: 'list',
    c: 'colorSpace',
    'color-space': 'colorSpace',
    h: 'help'
  },
  boolean: [ 'upload', 'download', 'list', 'help' ],
  default: { colorSpace: 'rgb' }
});

if (!args.upload && !args.download && !args.list) {
  if (args._.length === 0) args.help = true;
  else if (fs.existsSync(args._[0])) args.upload = true;
  else args.download = true;
}

if (args.version) {
  console.log(packageJSON.name, packageJSON.version);
  process.exit();
}

if (args.help) {
  console.log([
    'usage: gury [options] id | url | file...',
    '',
    'options:',
    '  -u, --upload                         Upload files',
    '  -d, --download                       Download files',
    '  -t, --list                           List contents of archive',
    '',
    '  -c SPACE, --color-space SPACE        Set color space of PNGs',
    '',
    '  --version                            Display version and exit',
    '  -h, --help                           Display help and exit'
  ].join('\n'));
  process.exit();
}

if (args.upload) {
  Promise.resolve(args._)
    .map(function(filename) {
      return fs.statAsync(filename)
        .then(function(stats) {
          if (stats.isDirectory()) return walk(filename);
          else return filename;
        });
    })
    .then(R.flatten)
    .then(R.lPartial(gury.upload, args.colorSpace))
    .then(imgur.idToURL)
    .then(console.log);

} else if (args.download) {
  gury.download(args._[0]);

} else if (args.list) {
  metadata.download(args._[0])
    .each(function(fileMetadata) {
      var filename = fileMetadata[0];
      var length = (fileMetadata[2].length - 1) * imgur.MAXIMUM_DATA_LENGTH + fileMetadata[1];
      var ids = fileMetadata[2].join(' ');
      console.log(filename, length, ids);
    });
}
