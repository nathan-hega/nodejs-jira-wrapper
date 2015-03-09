var helpers   = require('../lib/helpers')
  , nconf     = require('nconf')
  , request   = require('request')
  , _         = require('lodash');


module.exports = function () {

var config = nconf.get()

  return {
    // fetch JIRA issue data
    // options [must contain id]
    // callback function(error, data)
    get: function (options, callback) {
      var args = Array.prototype.slice.call(arguments);
      helpers.argumentsCheck(args);

      var path = 'issue';

      // handle options and build path
      if (options === null) {
        // we need at least an id
        return callback(helpers.errorFactory(400, 'required param missing: id '));
      } else if (options && options.id) {
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
      }));
    },
    // create JIRA issue
    // options represent a JSON jira issue
    // callback function(error, data)
    post: function (options, callback) {
      var args = Array.prototype.slice.call(arguments);
      helpers.argumentsCheck(args);

      var path = 'issue';

      // handle options
      if (!(options && options.id)) {
        return callback(helpers.errorFactory(400, 'required param missing: id '));
      }

      request({
        uri: config.url + path,
        json: true,
        headers: _.extend(config.headers, {'Content-Type': 'application/json'}),
        body: options,
        method: 'POST'
      }, helpers.errorHandler(function (error, response, body) {
        if (error) return callback(error);
        return callback(null, body)
      }));
    },
    delete: function (options, callback) {
      var args = Array.prototype.slice.call(arguments);
      helpers.argumentsCheck(args);

      // handle options
      if (!(options && options.id)) {
        return callback(helpers.errorFactory(400, 'required param missing: id '));
      }

      var path = 'issue/'
        , id = options.id;

      request({
        uri: config.url + path + id,
        json: true,
        headers: config.headers,
        qs: options,
        method: 'DELETE'
      }, helpers.errorHandler(function (error, response, body) {
        if (error) return callback(error);
        // special success case for a call that returns no body
        // NEED TO REVISE THIS
        body = body || {success: true};
        return callback(null, body);
      }));
    },
    put: function (options, callback) {
      var args = Array.prototype.slice.call(arguments);
      helpers.argumentsCheck(args);

      var path = 'issue';

      // handle options
      if (!(options && options.id)) {
        return callback(helpers.errorFactory(400, 'required param missing: id '));
      }

      request({
        uri: config.url + path,
        json: true,
        headers: _.extend(config.headers, {'Content-Type': 'application/json'}),
        body: options,
        method: 'PUT'
      }, helpers.errorHandler(function (error, response, body) {
        if (error) return callback(error);
        return callback(null, body)
      }));
    },
    // editmeta function helps users determine what
    // fields can be edited for a given issue
    // use this in conjunction with editing issues
    editmeta: function (options, callback) {
      var args = Array.prototype.slice.call(arguments);
      helpers.argumentsCheck(args);

      // handle options
      if (!(options && options.id)) {
        return callback(helpers.errorFactory(400, 'required param missing: id '));
      }

      var path = 'issue/'
        , id = options.id;

      request({
        uri: config.url + path + id + '/editmeta',
        json: true,
        headers: config.headers,
        method: 'GET'
      }, helpers.errorHandler(function (error, response, body) {
        if (error) return callback(error);
    
        return callback(null, body);
      }));
    }, 
    // createmeta function helps users determine what
    // fields are required/present for a given issue
    // use this in conjunction with creating issues
    createmeta: function (options, callback) {
      var args = Array.prototype.slice.call(arguments);
      helpers.argumentsCheck(args);

      var path = 'issue/createmeta';

      request({
        uri: config.url + path,
        json: true,
        qs: options,
        headers: config.headers,
        method: "GET"
      }, helpers.errorHandler(function (error, response, body) {
        if (error) return callback(error);
        return callback(null, body)
      }));
    }  
  };
}