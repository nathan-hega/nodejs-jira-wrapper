var wrapper = require("../index")
  , nconf   = require('nconf')
  , async   = require('async')
  , fs      = require('fs')
  , helpers = require('./helpers')
  , _       = require('lodash');

// configure nconf to read from command line
nconf.argv();

var username = nconf.get('username') || nconf.get('un')
  , password = nconf.get('password') || nconf.get('pw')
  , help = nconf.get('help') || nconf.get('h')
  , suite = nconf.get('suite') || nconf.get('s')
  , url = nconf.get('url');

// dump out the help menu
if (help) {
  var helpText = fs.readFileSync(__dirname + '/help.txt', 'utf-8');
  console.log(helpText);
} else if ((!username && username !== '') || (!password && password !== '')) {
  console.log('must provide username and password for testing purposes');
} else if (!url) {
  console.log('must provide the url to JIRA API');
} else {  
  
  // initialize the wrapper and the test
  var wrapper = require('../index.js')({
    username: username,
    password: password,
    url: url
  });
  
  var tests = require('./tests')(wrapper)
    , currentTests = tests;

  // run user specified tests 
  if (suite) {
    try {
      currentTests = [];
      suite = suite.split(',');
      if (!Array.isArray(suite)) {
        throw 'supplied argument is not an array';
      }

      // iterate through user-defined tests and build a new array of tests
      _.each(suite, function (testName, index) {
        currentTests.push(tests[testName.fullTrim()]);
      });
    } catch (e) {
      console.log('failed to parse specified test suite: ' + e);
      console.log('running full regression');
      currentTests = tests;
    }
  }

  async.parallel(currentTests, function (error, results) {
    if (error) {
      console.log('error occurred: ', error);
    }
    helpers.finish(results);
  });
}