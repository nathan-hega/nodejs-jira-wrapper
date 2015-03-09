#Node.js JIRA API Wrapper

This module was meant to wrap and simplify the JIRA API. The wrapper currently supports only a small fraction of the API calls available. A large number of the API calls are meant only to specify the data being returned. Not supporting some of these calls was intentional as it is an over complication. Read below for:

- [Usage](#usage)
- [Supported Calls](#supportedCalls)
  - [Projects](#projects)
  - [Issues](#issues)  
- [Development](#development)
  - [Submitting a Bug](#bugs)
  - [Requesting New Functionality](#featureRequest)
- [TODO](#todo) 

<a name="usage"></a>
## Usage
> NOTE: Code was developed against version 2 of the JIRA API. Eg:   /rest/api/2/

`npm install nodejs-jira-wrapper`

Users can provide a username and password or a base64 encoded authentication string.
### Initialization
``` javascript
// authenticate with username:password
jira = require('nodejs-jira-wrapper')({
  username: 'username',
  password: 'alligator1',
  url: 'https://jira.api.com/rest/api/2/'
});

// or with encoded string
jira = require('nodejs-jira-wrapper')({
  authorization: 'XBFUH8kKJBJdjb89KJNJnj9',
  url: 'https://jira.api.com/rest/api/2/'
});

```
Use callbacks to asynchronously communicate with the JIRA API.
### Example Usage
``` javascript
var _ = require('lodash');
var jira = require('nodejs-jira-wrapper')({
  username: 'username',
  password: 'alligator1',
  url: 'https://jira.api.com/rest/api/2/'
});

// get all JIRA project keys
jira.projects.get(null, function (error, body) {
  if (error) {
    // throw some error
    throw new 'jira api wrapper failed'
  } else {
    var keys = [];
    _.each(body, function (project) {
      keys.push(project.key);
    });
  }
});


```
> NOTE: Errors are always returned as:
> ``` javascript
> {
>  'statusCode': 401, // some digit
>  'message': 'Unauthorized' // some error string
>}
>```

<a name="supportedCalls"></a>
## Supported Calls

<a name="projects"></a>
### Projects
#### GET
`jira.projects.get`
https://docs.atlassian.com/software/jira/docs/api/REST/latest/#d2e3818
Retrieve information about a project(s).


| Parameter     | Description |
| ------------- |:-------------|
| options      | This value can be `null` or an `object`|
| callback     | Function that accepts an error and a body object|

``` javascript
// options object needs an id key that is either a string
var options  = {
  id: 'JIRAKEY'
}
jira.projects.get(options, function (error, body) {
  // ...
}


// or an arry
var options  = {
  id: ['JIRAKEY1', 'JIRAKEY2']
}
jira.projects.get(options, function (error, body) {
  // ...
}

// null returns all projects
jira.projects.get(null, function (error, body) {
  // ...
}
```

<a name="issues"></a>
### Issues

#### GET
`jira.issues.get`
https://docs.atlassian.com/software/jira/docs/api/REST/latest/#d2e296
Retrieve information about an issue.

| Parameter     | Description |
| ------------- |:-------------|
| options      | This value must be an `object` with the key `id` specified|
| callback     | Function that accepts an error and a body object|


#### POST
`jira.issues.post`
https://docs.atlassian.com/software/jira/docs/api/REST/latest/#d2e86
Create a new issue.
| Parameter     | Description |
| ------------- |:-------------|
| options      | Must be `object representing a JIRA issue - example below`|
| callback     | Function that accepts an error and a body object|

``` javascript
// set up the jira object
  var options = {
    "fields": {
      "project": {
        "id": "17412"
      },
      "summary": "api test issue.",
      "description": "Creating of an issue using ids for projects and issue types using the REST API",
      "issuetype": {
        "id": "19"
      }
    }
  };

  jira.issues.post(options, function (error, data) {
    // ...
  })
```


#### DELETE
`jira.issues.delete`
https://docs.atlassian.com/software/jira/docs/api/REST/latest/#d2e296
Remove an issue.

| Parameter     | Description |
| ------------- |:-------------|
| options      | This value must be an `object` with the key `id` specified|
| callback     | Function that accepts an error and a body object|

#### PUT
`jira.issues.put`
https://docs.atlassian.com/software/jira/docs/api/REST/latest/#d2e296
Edit/Update an issue.

| Parameter     | Description |
| ------------- |:-------------|
| options      | This value must be an `object` with the key `id` specified|
| callback     | Function that accepts an error and a body object|

#### EDITMETA
`jira.issues.editmeta`
https://docs.atlassian.com/software/jira/docs/api/REST/latest/#d2e586
Retrieve information about what fields you can edit for a particular issue. Use this in conjunction with the `PUT` call.

| Parameter     | Description |
| ------------- |:-------------|
| options      | This value must be an `object` with the key `id` specified|
| callback     | Function that accepts an error and a body object|

#### CREATEMETA
`jira.issues.createmeta`
https://docs.atlassian.com/software/jira/docs/api/REST/latest/#d2e550
Retrieve information about what fields you need to supply in order to create an issue. Use this is conjunction with the `POST` call.

| Parameter     | Description |
| ------------- |:-------------|
| options      | Options will represent the query string to send with the createmeta call. See JIRA documentation for appropriate key names and values|
| callback     | Function that accepts an error and a body object|

``` javascript
var options = {
    projectIds: 11111,
    projectKeys: 'TESTJS',
    //issuetypeIds: ['16', '17'], 
    //issuetypeNames: ['Milestone Marker', 'Prelaunch Subtask']
  };

  jira.issues.createmeta(options, function (error, data) {
    // ...
  });    
```

<a name="development"></a>
## Development
The JIRA API has a lot of functionality. While I don't think this module needs to wrap every single API endpoint, I think it is lacking some crucial functionality. See the [TODO](#todo) section for more details.

### Issues

<a name="bugs"></a>
**Bugs**
 When submitting a github issue for a bug, please be sure to provide the following:
- Explanation of the bug and any context
- Steps to reproduce
- Expected result
- Actual result

<a name="featureRequest"></a>
**New Features**
When submitting an issue for a new feature request, please be sure to provide the folllowing:
- Explanation of the new feature and any context
- If applicable, link to the JIRA API call (https://docs.atlassian.com/software/jira/docs/api/REST/latest/)

### PRs
**Thank you for helping!**

When submitting a PR, the following will be required:
- Adhere to the styles of the file you are working in
- Provide a clear description and testing instructions
- Update to the README.md file documenting your changes
- Test function written in `lib/tests.js`

-----

### Testing
There is a decent, but sparse, testing suite written for development. It supports running through the entire suite of test (for making global changes) or executing a specific set of tests. Below are some examples of using the test suite:

``` bash
# specify tests with a comma separated string
node lib/test.js --s "getprojects, createmeta" --un username --pw password! --url "https://jira.api.com/rest/api/2/"

# specify tests as a single string
node lib/test.js --s "getprojects" --un username --pw password! --url "https://jira.api.com/rest/api/2/"

# let the full suite run
node lib/test.js --un username --pw password! --url "https://jira.api.com/rest/api/2/"
```

Example Output:
```
» node lib/test.js --s "getprojects, createmeta" --un username --pw password --url "https://jira.api.com/rest/api/2/"
name: getprojects
success: false
reference: https://docs.atlassian.com/software/jira/docs/api/REST/latest/#d2e4611
description: validates the wrapper around the project GET call is functioning properly
result: {"error":{"statusCode":401,"message":"Unauthorized"},"body":null}
----------------------------------------------------------
name: createmeta
success: false
reference: https://docs.atlassian.com/software/jira/docs/api/REST/latest/#d2e550
description: validates the wrapper around the issue createmeta call is functioning properly
result: {"error":{"statusCode":401,"message":"Unauthorized"},"body":null}
----------------------------------------------------------
»
```

<a name="todo"></a> 
## TODO
In order of importance.
### Testing
Only two of the seven wrapper functions have tests written. Adding the rest of the tests is important because it helps enforce all new functionality requiring a test and it provides confidence while developing and reviewing pull requests. 

On top of writing the rest of the tests, support has to be added for a developer defined test configuration. This would remove the need for query parameters and allow for writing more complex tests (removing an issue, creating an issue, etc...). 

### New Functionality
As I mentioned above, there are plenty of API calls that should be wrapped. Below is my best-guess at what functionality developers would want:

- Bulk Creating Issues
  - This might already be supported by my `jira.issues.post` call, I just haven't explicitly tested for it.
  - https://docs.atlassian.com/software/jira/docs/api/REST/latest/#d2e516
- Search functionality
  - https://docs.atlassian.com/software/jira/docs/api/REST/latest/#d2e2450
- Users/Workflows/Schemes
  - https://docs.atlassian.com/software/jira/docs/api/REST/latest/#d2e5193
  - https://docs.atlassian.com/software/jira/docs/api/REST/latest/#d2e1799
  - https://docs.atlassian.com/software/jira/docs/api/REST/latest/#d2e4067
  - https://docs.atlassian.com/software/jira/docs/api/REST/latest/#d2e1292
- Administration/Configuration functionality
