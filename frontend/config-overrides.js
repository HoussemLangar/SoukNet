const path = require('path');

module.exports = function override(config) {
  config.resolve.extensions = ['.js', '.jsx'];
  return config;
};