var helpers = require(__dirname + '/lib/helpers')
  , wrappers = require(__dirname + '/wrappers')
  , nconf = require('nconf');

// configuration options include:
//
// configuration = {
//   username: "username",
//   password: "password" 
// }
//
// configuration = {
//   authstring: "encoded auth string"  
// }

module.exports = function (configuration) {
  if (configuration.username && configuration.password) {
    configuration.authstring = "Basic " + new Buffer(configuration.username + ":" + configuration.password).toString('base64');
	} else if (!configuration.authstring) {
    throw new Error("Authentication not set")
	}

  if (!configuration.url) {
    throw new Error("API URL not set");
  }
  
  // load in the config file
  nconf.file('config.json', __dirname + '/config.json');
  // set up request headers to use throughout the JIRA API interactions
  nconf.set('headers:Authorization', configuration.authstring);
  // set the endpoint in config to be used elsewhere
  nconf.set('url', configuration.url);
  
  // return closure to store the configuration
  return {
    projects: wrappers.projects(),
    issues: wrappers.issues()
  };
}