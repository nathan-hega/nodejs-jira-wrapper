module.exports = function (wrapper) {
  
  return {
    getprojects: function (callback) {
      var results = {
        name: 'getprojects',
        description: 'validates the wrapper around the project GET call is functioning properly',
        reference: 'https://docs.atlassian.com/software/jira/docs/api/REST/latest/#d2e4611',
        success: undefined,
        result: undefined
      };
      
      wrapper.projects.get(null, function (error, body) {
        results.result = JSON.stringify({
          error: error,
          body: null // returning null due to size of successful body
        });

        // success: body of project(s)
        results.success = body ? true : false;
        return callback(null, results);
      });
    },

    createmeta: function (callback) {
      var results = {
        name: 'createmeta',
        description: 'validates the wrapper around the issue createmeta call is functioning properly',
        reference: 'https://docs.atlassian.com/software/jira/docs/api/REST/latest/#d2e550',
        success: undefined,
        result: undefined
      };

      wrapper.issues.createmeta(null, function (error, body) {
        results.result = JSON.stringify({
          error: error,
          body: null // returning null due to size of successful body
        });

        // success: createmeta object
        results.success = body ? true : false;
        return callback(null, results);
      });
    },
  }
}