var _       = require('lodash')
  , colors  = require('colors');

// extending the string class when helpers is required
(function () {
  String.prototype.fullTrim = function () {
    return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
  }
})();

module.exports  = {
  // function to check the arguments passed into the wrapper functions
  argumentsCheck: function (args) {
      // capture this
      var self = this;

      // make sure arguments are supplied
      if (!(args && args.length)) {
        throw new Error('Invalid arguments');
      }

      // make sure last argumnt is a valid callback
      if (typeof args[args.length - 1] !== 'function') {
        throw new Error('Invalid callback argument');
      }

      // ensure user passed in 2 parameters
      if (args.length !== 2) {
        throw new Error('Invalid arguments');
      }
  },

  // function to generalize errors from the API and other sources
  errorHandler: function (callback) {
    // capture this
    var self = this;
    
    return function (error, response, body) {
      if (error) {
        return callback(error);
      } else if (!(response.statusCode >= 200 || response.statusCode <= 299)) {
        // ignore the stack trace since it's useless and confusing
        // default some values incase they don't exist in some JIRA responses
        error = self.errorFactory(body["status-code"] || 500, body.errorMessages || body.message || 'unknown JIRA API error');
      } else if (response.statusCode === 401) {
        error = self.errorFactory(401, 'Unauthorized');
      } else if (typeof body === "string" && body !== null && typeof body !== "object") {
        error = self.errorFactory(500, 'Body returned is not valid JSON');
      }
      return callback(error, response, body);
    }
  },

  // function that takes in status/message and returns error object
  errorFactory: function (status, message) {
    return {
      statusCode: status,
      message: message
    }
  },

  // outputs the results of running tests
  finish: function (results) {
    _.each(results, function (result) {
      var success = result.success ? (result.success + '').green : (result.success + '').red;

      console.log('name: '.bold + result.name + '\n' + 
                  'success: '.bold + success + '\n' +
                  'reference: '.bold + result.reference + '\n' +
                  'description: '.bold + result.description + '\n' +
                  'result: '.bold + result.result + '\n' +
                  '----------------------------------------------------------'.bold.yellow);
    });
  }
}