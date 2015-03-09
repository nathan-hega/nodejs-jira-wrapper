var helpers = require('../lib/helpers')
  , nconf = require('nconf')
  , request = require('request');


module.exports = function () {
var config = nconf.get()
  return {
    // options [null or {}]
    // callback function(error, data)
    get: function (options, callback) {
      var args = Array.prototype.slice.call(arguments);
      helpers.argumentsCheck(args);

      // path will default to show all projects if no id string, number, or array is provided
      var path = 'project';

      // handle options and build path
      if (options === null) {
        path += '/';
      } else if (options && options.id && Array.isArray(options.id)) {
        var ids = options.id.join(',');
        path += '/' + ids;
      } else if (options && (typeof options.id === "string" || typeof options.id === "number")) {
        path += '/' + options.id
      } else {
        return callback(helpers.errorFactory(400, 'could not build the requested path'));
      }

      request({
        uri: config.url + path,
        json: true,
        headers: config.headers
      }, helpers.errorHandler(function (error, response, body) {
        if (error) return callback(error);
          return callback(null, body)
        })
      );
    }
  };
}