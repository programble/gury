'use strict';

module.exports = function() {
  if (module.exports.enabled) console.error.apply(null, arguments);
};
