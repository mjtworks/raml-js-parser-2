/* global RAML, describe, it */

'use strict';


if (typeof window === 'undefined') {
  var raml           = require('../raml-parser-2');
  var chai           = require('chai');
  var expect         = chai.expect;
  var should         = chai.should();
  var chaiAsPromised = require('chai-as-promised');
  var q              = require('q');
  chai.use(chaiAsPromised);
} else {
  var raml           = RAML.Parser;
  chai.should();
}

describe('Regressions', function () {

  //FIXTEST changed a message to an equivalent
  it('should fail unsupported raml version:RT-180', function (done) {
    var definition = [
      '#%RAML 0.1',
      'title: test'
    ].join('\n');

    raml.load(definition).should.be.rejectedWith(/Unknown version of RAML expected to see one of \'#%RAML 0.8\' or \'#%RAML 1.0\'/).and.notify(done);
  });

  //it('should fail with correct error message on hex values', function (done) {
  //  var definition = [
  //    '#%RAML 0.8',
  //    'some_key: "some value \\x0t"'
  //  ].join('\n');
  //
  //  raml.load(definition).should.be.rejectedWith(/expected escape sequence of 2 hexadecimal numbers, but found t/).and.notify(done);
  //});

  //it('should fail with correct error message on hex values', function (done) {
  //  var definition = [
  //    '#%RAML 0.8',
  //    'some_key: ? something : something'
  //  ].join('\n');
  //
  //  raml.load(definition).should.be.rejectedWith(/mapping keys are not allowed here/).and.notify(done);
  //});

  //it('should fail with correct error message on hex values', function (done) {
  //  var definition = [
  //    '#%RAML 0.8',
  //    'some_key: "',
  //    '...',
  //    '---'
  //  ].join('\n');
  //
  //  raml.load(definition).should.be.rejectedWith(/found unexpected document separator/).and.notify(done);
  //});

  //FIXTEST added /{company} to the URL as otherwise current parser returns 2 errors: one regarding company parameter being a scalar,
  // (which the test expects) and another one for company parameter being unused.
  //Also changed error message to an equivalent one
  it('should fail if baseUriParameter is not a map', function (done) {
    var definition = [
      '#%RAML 0.8',
      'title: Test',
      'baseUri: http://www.api.com/{version}/{company}',
      'version: v1.1',
      '/jobs/{company}:',
      '  baseUriParameters:',
      '    company:',
      '      description'
    ].join('\n');

    raml.load(definition).should.be.rejectedWith(/Node 'company' can not be a scalar/).and.notify(done);
  });
  //

  //FIXTEST we do have a general policy of not blaming users for empty values of a list/map properties.
  //Thus invalidating the test and adding its positive counterpart below.
  //Also,it looks like a "-" is missed before "otherTrait".
  //it('should not fail to parse an empty trait', function (done) {
  //  var definition = [
  //    '#%RAML 0.8',
  //    'title: MyApi',
  //    'traits:',
  //    '  - emptyTrait:',
  //    '    otherTrait:',
  //    '      description: Some description',
  //  ].join('\n');
  //  raml.load(definition).should.be.rejectedWith(/invalid trait definition, it must be a map/).and.notify(done);
  //});

  //Positive counterpart of the test above, actually matching the test name. It accepts empty trait.
  it('should not fail to parse an empty trait', function (done) {
    var definition = [
      '#%RAML 0.8',
      'title: MyApi',
      'traits:',
      '  - emptyTrait:',
      '  - otherTrait:',
      '      description: Some description',
    ].join('\n');
    raml.load(definition).should.be.fulfilled.and.notify(done);
  });

  //FIXTEST we do have a general policy of not blaming users for empty values of a list/map properties.
  //Thus invalidating the test.
  //it('should not fail to parse an empty trait list', function (done) {
  //  var definition = [
  //    '#%RAML 0.8',
  //    '---',
  //    'title: Test',
  //    'baseUri: http://www.api.com/{version}/{company}',
  //    'version: v1.1',
  //    'traits:'
  //  ].join('\n');
  //  raml.load(definition).should.be.rejectedWith(/invalid traits definition, it must be an array/).and.notify(done);
  //});
  //

  //Positive counterpart of the test above, actually matching the test name. It accepts empty traits.
  it('should not fail to parse an empty trait list', function (done) {
    var definition = [
      '#%RAML 0.8',
      '---',
      'title: Test',
      'baseUri: http://www.api.com/{version}/{company}',
      'version: v1.1',
      'traits:'
    ].join('\n');
    raml.load(definition).should.be.fulfilled.and.notify(done);
  });

  //FIXTEST we are actually missing a required property "title" here, so fixing the message.
  it('should fail to parse a RAML header ', function (done) {
    var noop = function () {};
    var definition = [
      '#%RAML 0.8'
    ].join('\n');

    raml.load(definition).then(noop, function (error) {
      setTimeout(function () {
        error.message.should.match(/Missing required property 'title'/);
        done();
      }, 0);
    });
  });
  //

  //FIXTEST we are missing a required property "title" here, so fixing the message.
  it('should not fail to parse a RAML file only with headers', function (done) {
    var definition = [
      '#%RAML 0.8',
      '---'
    ].join('\n');
    raml.load(definition).should.be.rejectedWith(/Missing required property 'title'/).and.notify(done);
  });
  //
  it('should not fail to parse a RAML null uriParameters. RT-178', function (done) {
    var definition = [
      '#%RAML 0.8',
      '---',
      'title: hola',
      'version: v0.1',
      'baseUri: http://server/api/{version}',
      'baseUriParameters:'
    ].join('\n');
    var expected = {
      title: 'hola',
      version: 'v0.1',
      baseUri: 'http://server/api/{version}',
      baseUriParameters: {
        version: {
          type: 'string',
          required: true,
          displayName: 'version',
          enum: [ 'v0.1' ]
        }
      },
      protocols: [
        'HTTP'
      ]
    };
    raml.load(definition).should.become(expected).and.notify(done);
  });
  //
  it('should fail if baseUriParamters has a version parameter. RT-199', function (done) {
    var definition = [
      '#%RAML 0.8',
      '---',
      'title: hola',
      'version: v0.1',
      'baseUri: http://server/api/{version}',
      'baseUriParameters:',
      ' version:'
    ].join('\n');
    raml.load(definition).should.be.rejectedWith(/'version' parameter not allowed here/).and.notify(done);
  });
  //
  //FIXTEST changed error message for an equivalent (actually, to a better one).
  it('should fail if resource URI is invalid', function (done) {
    var definition = [
      '#%RAML 0.8',
      '---',
      'title: hola',
      'version: v0.1',
      '/resourceName{}:'
    ].join('\n');
    raml.load(definition).should.be.rejectedWith(/URI parameter must have name specified/).and.notify(done);
  });
  //

  //FIXTEST changed error message for an equivalent. Looks like a duplicated of the previous test.
  it('should fail if resource URI is invalid', function (done) {
    var definition = [
      '#%RAML 0.8',
      '---',
      'title: hola',
      'version: v0.1',
      '/resourceName{}:'
    ].join('\n');
    raml.load(definition).should.be.rejectedWith(/URI parameter must have name specified/).and.notify(done);
  });
  //
  //FIXTEST changed error message to an equivalent. Also upgraded mechanism to finally being able to deal with several error messages
  //as I cant modify a test to only produce a single error message
  it('should reject RAML with more than one YAML document', function (done) {
    var definition = [
      '#%RAML 0.8',
      '---',
      'title: hola',
      'version: v0.1',
      '---'
    ].join('\n');
    raml.load(definition).should.be.rejectedWith(/end of the stream or a document separator is expected/).and.notify(done);
  });
  //

  //FIXTEST Both a message expected in the old test and the messages produced in this case by our YAML 3rd party library look meaningless to me.
  //So instead of replacing one meaningless message with another one of that kind, I just removed the message template alltogether, we simply expect a error
  it('should inject exception coontext into message when message is null', function (done) {
    var definition = [
      '#%RAML 0.8',
      '---',
      'title: hola',
      'version: v0.1',
      '...',
      'somepropertyName'
    ].join('\n');
    raml.load(definition).should.be.rejected.and.notify(done);
  });
  //
  //FIXTEST changed a error message to an equivalent one
  it('should fail if baseUriParameters is a string - RT-274', function (done) {
    var definition = [
      '#%RAML 0.8',
      '---',
      'title: hola',
      'version: v0.1',
      'baseUri: http://example.com',
      'baseUriParameters:',
      '  someparam'
    ].join('\n');
    raml.load(definition).should.be.rejectedWith(/Property 'baseUriParameters' can not have scalar value/).and.notify(done);
  });
  //

  //FIXTEST changed line 6 to line 5 as we report issues to property keys
  it('should fail if baseUriParameters is a string - RT-274 - with proper line numbering', function (done) {
    var noop       = function () {};
    var definition = [
      '#%RAML 0.8',
      '---',
      'title: hola',
      'version: v0.1',
      'baseUri: http://example.com',
      'baseUriParameters:',
      '  someparam'
    ].join('\n');
    raml.load(definition).then(noop, function (error) {
      setTimeout(function () {
        error.message.should.be.equal("Property 'baseUriParameters' can not have scalar value");
        error.problem_mark.should.exist;
        error.problem_mark.line.should.be.equal(5);
        error.problem_mark.column.should.be.equal(0);
        done();
      }, 0);
    });
  });
  //

  //FIXTEST Replaced error message with an equivalent
  it('should fail if baseUriParameters in a resource is a string - RT-274', function (done) {
    var definition = [
      '#%RAML 0.8',
      '---',
      'title: hola',
      'version: v0.1',
      'baseUri: http://localhost',
      '/resource:',
      '  baseUriParameters:',
      '    someparam'
    ].join('\n');
    raml.load(definition).should.be.rejectedWith(/Property 'baseUriParameters' can not have scalar value/).and.notify(done);
  });

  //
  //FIXTEST Replaced error message with an equivalent
  it('should fail if baseUriParameters in a resource is a string - RT-274', function (done) {
    var definition = [
      '#%RAML 0.8',
      '---',
      'title: hola',
      'version: v0.1',
      'baseUri: http://localhost',
      '/resource:',
      '  uriParameters:',
      '    someparam'
    ].join('\n');
    raml.load(definition).should.be.rejectedWith(/Property 'uriParameters' can not have scalar value/).and.notify(done);
  });
  //
  //it('should report correct line (RT-244)', function (done) {
  //  var noop       = function () {};
  //  var definition = [
  //    '',
  //    ''
  //  ].join('\n');
  //
  //  raml.load(definition).then(noop, function (error) {
  //    setTimeout(function () {
  //      error.problem_mark.should.exist;
  //      error.problem_mark.column.should.be.equal(0);
  //      error.problem_mark.line.should.be.equal(0);
  //      done();
  //    }, 0);
  //  });
  //});
  //

  //FIXTEST added title property to API, changed schema to valid {}, changed to regexp, fixed line numbers
  it('should report correct line for null media type in implicit mode', function (done) {
    var noop       = function () {};
    var definition = [
      '#%RAML 0.8',
      'title: test',
      '/resource:',
      '  post:',
      '    body:',
      '      schema: {}',
    ].join('\n');

    raml.load(definition).then(noop, function (error) {
      setTimeout(function () {
        error.message.should.be.match(/invalid media type/);
        error.problem_mark.should.exist;
        error.problem_mark.column.should.be.equal(6);
        error.problem_mark.line.should.be.equal(5);
        done();
      }, 0);
    });
  });
  //

  //FIXTEST we report BOTH second uri and first uri, because we can (parser support several errors).
  //Changed message, changed matching to regexp to pick a single error, changed linings to point to the first error
  it('should report repeated URI\'s in the second uri\'s line - RT-279', function (done) {
    var noop       = function () {};
    var definition = [
      '#%RAML 0.8',
      '---',
      'title: "muse:"',
      'baseUri: http://ces.com/muse',
      '/r1/r2:',
      '/r1:',
      '  /r2:'
    ].join('\n');
    raml.load(definition).then(noop, function (error) {
      setTimeout(function () {
        error.message.should.be.match(/Resources share same URI/);
        error.problem_mark.should.exist;
        error.problem_mark.column.should.be.equal(0);
        error.problem_mark.line.should.be.equal(4);
        done();
      }, 0);
    });
  });
  //
  it('should allow a trait parameter with an integer value - RT-279', function (done) {
    var definition = [
      '#%RAML 0.8',
      '---',
      'traits:',
      '  - getMethod:',
      '     description: <<description>>',
      'title: title',
      '/test:',
      ' is: [ getMethod: { description: 1 }]'
    ].join('\n');
    raml.load(definition).should.be.fulfilled.and.notify(done);
  });
  //
  it('should allow a resource type parameter with an integer value - RT-279', function (done) {
    var definition = [
      '#%RAML 0.8',
      '---',
      'resourceTypes:',
      '  - someType:',
      '     description: <<description>>',
      'title: title',
      '/test:',
      ' type: { someType: { description: 1 }}'
    ].join('\n');
    raml.load(definition).should.be.fulfilled.and.notify(done);
  });
  //
  it('should apply a resourceType that inherits from another type that uses parameters', function (done) {
    var definition = [
      '#%RAML 0.8',
      '---',
      'title: My API',
      'resourceTypes:',
      '  - base:',
      '      get:',
      '         description: <<description>>',
      '  - collection:',
      '      type: { base: { description: hola } }',
      '      get:',
      '  - typedCollection:',
      '      type: collection',
      '      get:',
      '         description: <<description>>',
      '/presentations:',
      '  type: { typedCollection: { description: description } }'
    ].join('\n');

    var expected = {
      'title': 'My API',
      'resourceTypes': [
        {
          'base': {
            'get': {
              'description': '<<description>>'
            }
          }
        },
        {
          'collection': {
            'type': {
              'base': {
                'description': 'hola'
              }
            },
            'get': null
          }
        },
        {
          'typedCollection': {
            'type': 'collection',
            'get': {
              'description': '<<description>>'
            }
          }
        }
      ],
      'resources': [
        {
          'type': {
            'typedCollection': {
              'description': 'description'
            }
          },
          'relativeUri': '/presentations',
          'methods': [
            {
              'method': 'get',
              'description': 'description'
            }
          ],
          relativeUriPathSegments: [ 'presentations' ]
        }
      ]
    };
    raml.load(definition).should.become(expected).and.notify(done);
  });
  //

  //TESTFIX we do have a general policy of not blaming users for empty values of a list/map properties.
  //it('should report correct line for resourceType not map error - RT-283', function (done) {
  //  var noop       = function () {};
  //  var definition = [
  //    '#%RAML 0.8',
  //    '---',
  //    'title: "muse:"',
  //    'resourceTypes:',
  //    '  - type1: {}',
  //    '    type:'
  //  ].join('\n');
  //  raml.load(definition).then(noop, function (error) {
  //    setTimeout(function () {
  //      error.message.should.be.equal('invalid resourceType definition, it must be a map');
  //      error.problem_mark.should.exist;
  //      error.problem_mark.column.should.be.equal(9);
  //      error.problem_mark.line.should.be.equal(5);
  //      done();
  //    }, 0);
  //  });
  //});
  //

  //FIXTEST error message, line
  it('should report correct line for resourceType circular reference - RT-257', function (done) {
    var noop       = function () {};
    var definition = [
      '#%RAML 0.8',
      '---',
      'title: "muse:"',
      'resourceTypes:',
      '  - rt1:',
      '      type: rt2',
      '  - rt2:',
      '      type: rt1',
      '/resource:',
      '  type: rt1'
    ].join('\n');
    raml.load(definition).then(noop, function (error) {
      setTimeout(function () {
        error.message.should.be.equal('Resource type definition contains cycle: rt1 -> rt2 -> rt1');
        error.problem_mark.should.exist;
        error.problem_mark.column.should.be.equal(4);
        error.problem_mark.line.should.be.equal(4);
        done();
      }, 0);
    });
  });
  //
  it('should apply a trait to a method that has been applied a resource type with a matching null method', function (done) {
    var definition = [
      '#%RAML 0.8',
      '---',
      'title: User Management',
      'traits:',
      '  - paged:',
      '      queryParameters:',
      '        start:',
      'resourceTypes:',
      '  - collection:',
      '      get:',
      '/users:',
      '  type: collection',
      '  get:',
      '    is: [ paged ]'
    ].join('\n');

    var expected = {
      'title': 'User Management',
      'traits': [
        {
          'paged': {
            'queryParameters': {
              'start': {
                'displayName': 'start',
                'type': 'string'
              }
            }
          }
        }
      ],
      'resourceTypes': [
        {
          'collection': {
            'get': null
          }
        }
      ],
      'resources': [
        {
          'type': 'collection',
          'relativeUri': '/users',
          relativeUriPathSegments: [ 'users' ],
          'methods': [
            {
              'queryParameters': {
                'start': {
                  'displayName': 'start',
                  'type': 'string'
                }
              },
              'is': [
                'paged'
              ],
              'method': 'get'
            }
          ]
        }
      ]
    };
    raml.load(definition).should.become(expected).and.notify(done);
  });
  //
  it('should clone references instead of using reference', function (done) {
    var definition = [
      '#%RAML 0.8',
      'title: My api',
      'version: v1',
      '/res1: &res1',
      '  description: this is res1 description',
      '  displayName: resource 1',
      '  get:',
      '    description: get into resource 1',
      '/res2: *res1'
    ].join('\n');

    var expected =  {
      "title": "My api",
      "version": "v1",
      "resources": [
        {
          "description": "this is res1 description",
          "displayName": "resource 1",
          "relativeUri": "/res1",
          "methods": [
            {
              "description": "get into resource 1",
              "method": "get"
            }
          ],
          "relativeUriPathSegments": [
            "res1"
          ]
        },
        {
          "description": "this is res1 description",
          "displayName": "resource 1",
          "relativeUri": "/res2",
          "methods": [
            {
              "description": "get into resource 1",
              "method": "get"
            }
          ],
          "relativeUriPathSegments": [
            "res2"
          ]
        }
      ]
    };
    raml.load(definition).should.become(expected).and.notify(done);
  });
  //
  it('should handle a resource and sub-resource named /protocols', function (done) {
    var definition = [
      '#%RAML 0.8',
      'title: My api',
      '/protocols:',
      '  /protocols:'
    ].join('\n');
    var expected = {
      title: "My api",
      resources: [
        {
          relativeUri: "/protocols",
          relativeUriPathSegments: [
            "protocols"
          ],
          resources:[
            {
              relativeUri: "/protocols",
              relativeUriPathSegments: [
                "protocols"
              ]
            }
          ]
        }
      ]
    };
    raml.load(definition).should.become(expected).and.notify(done);
  });
  //
  it('should handle a resource and sub-resource named /type.*', function (done) {
    var definition = [
      '#%RAML 0.8',
      'title: My api',
      'resourceTypes:',
      '    - ref: {}',
      '/type_:',
      '  /type_someword:',
      '    get:'
    ].join('\n');
    var expected = {
      title: "My api",
      resourceTypes: [
          {
              ref: {}
          }
      ],
      resources: [
        {
          relativeUri: "/type_",
          resources:[
            {
              relativeUri: "/type_someword",
              methods:[
                {
                  method: "get"
                }
              ],
              relativeUriPathSegments: [
                "type_someword"
              ]
            }
          ],
          relativeUriPathSegments: [
            "type_"
          ]
        }
      ]
    };
    raml.load(definition).should.become(expected).and.notify(done);
  });
  //

  //FIXTEST changed error message
  it('should not download a null named file. RT-259', function (done) {
    var definition = [
      '#%RAML 0.8',
      '---',
      'title: !include'
    ].join('\n');

    raml.load(definition).should.be.rejectedWith(/!include without value/).and.notify(done);
  });
  //FIXTEST changed error message
  it('should not download a file named with blanks. RT-259', function (done) {
    var definition = [
      '#%RAML 0.8',
      '---',
      'title: !include             '
    ].join('\n');

    raml.load(definition).should.be.rejectedWith(/!include without value/).and.notify(done);
  });
  //
  it('should not fail with null responses', function (done) {
    var definition = [
      '#%RAML 0.8',
      'title: GitHub API',
      '/res:',
      '  get:',
      '    responses:'
    ].join('\n');
    raml.load(definition).should.be.fulfilled.and.notify(done);
  });
  //
  //it('add a regression test for a complex RAML file', function (done) {
  //  var definition = [
  //    '#%RAML 0.8',
  //    '---',
  //    '!include http://localhost:9001/test/raml-files/regression.yml'
  //  ].join('\n');
  //
  //  raml.load(definition).should.be.fulfilled.and.notify(done);
  //});
  //
  //it('add a regression test for a big RAML file', function (done) {
  //  var definition = [
  //    '#%RAML 0.8',
  //    '---',
  //    '!include http://localhost:9001/test/raml-files/large-raml.yml'
  //  ].join('\n');
  //
  //  raml.load(definition).should.be.fulfilled.and.notify(done);
  //});
  //
  //it('add a regression test that composeFile does not fail', function (done) {
  //  var definition = [
  //    '#%RAML 0.8',
  //    '---',
  //    '!include http://localhost:9001/test/raml-files/large-raml.yml'
  //  ].join('\n');
  //
  //  raml.load(definition).should.be.fulfilled.and.notify(done);
  //});
  //
  it('should handle optional parameters onto optional parameters merge correctly', function (done){
    var definition = [
      '#%RAML 0.8',
      'title: Title',
      'resourceTypes:',
      '  - common:',
      '      get?:',
      '  - base:',
      '      type: common',
      '      get?:',
      '/files:',
      '  type: base',
      '  post:'
    ].join('\n');
    var expected = {
      "title":"Title",
      "resourceTypes":[
        {
          "common": {
            "get?":null
          }
        },
        {
          "base": {
            "type":"common",
            "get?":null
          }
        }
      ],
      "resources": [
       {
        "type":"base",
        "relativeUri":"/files",
        "methods": [
          {
            "method":"post"
          }
        ],
        "relativeUriPathSegments": ["files"]
      }
      ]
    };

    raml.load(definition).should.become(expected).and.notify(done);
  });
  //
  it('should handle optional parameters onto optional parameters merge correctly', function (done){
    var definition = [
      '#%RAML 0.8',
      'title: Title',
      'resourceTypes:',
      '  - common: {}',
      '  - base:',
      '      type: common',
      '      get?:',
      '/files:',
      '  type: base',
      '  post:'
    ].join('\n');
    var expected = {
      "title":"Title",
      "resourceTypes":[
        {
          "common": {}
        },
        {
          "base": {
            "type":"common",
            "get?":null
          }
        }
      ],
      "resources": [
       {
        "type":"base",
        "relativeUri":"/files",
        "methods": [
          {
            "method":"post"
          }
        ],
        "relativeUriPathSegments": ["files"]
      }
      ]
    };

    raml.load(definition).should.become(expected).and.notify(done);
  });
  //
  it('should handle optional parameters onto optional parameters merge correctly', function (done){
    var definition = [
      '#%RAML 0.8',
      'title: Title',
      'resourceTypes:',
      '  - common:',
      '      get?:',
      '  - base:',
      '      type: common',
      '/files:',
      '  type: base',
      '  post:'
    ].join('\n');
    var expected = {
      "title":"Title",
      "resourceTypes":[
        {
          "common": {
            "get?":null
          }
        },
        {
          "base": {
            "type":"common"
          }
        }
      ],
      "resources": [
       {
        "type":"base",
        "relativeUri":"/files",
        "methods": [
          {
            "method":"post"
          }
        ],
        "relativeUriPathSegments": ["files"]
      }
      ]
    };

    raml.load(definition).should.become(expected).and.notify(done);
  });
  //

  //FIXTEST added "widgetName" to description as the resource does have a path
  it('should parse multiple parameters in the same line', function (done){
    var definition = [
      '#%RAML 0.8',
      'title: Example',
      'resourceTypes:',
      '  - readOnlyCollectionItem:',
      '      description: Retrieve <<resourcePathName|!singularize>> where <<key>> equals **{<<key>>}**',
      '/{widgetName}:',
      '  type:',
      '    readOnlyCollectionItem:',
      '      key: widgetName'
    ].join('\n');
    var expected = {
         "title": "Example",
         "resourceTypes": [
           {
             "readOnlyCollectionItem": {
               "description": "Retrieve <<resourcePathName|!singularize>> where <<key>> equals **{<<key>>}**"
             }
           }
         ],
         "resources": [
           {
             "description": "Retrieve  where widgetName equals **{widgetName}**",
             "type": {
               "readOnlyCollectionItem": {
                 "key": "widgetName"
               }
             },
             "relativeUri": "/{widgetName}",
             "relativeUriPathSegments": [
               "{widgetName}"
             ],
             "uriParameters": {
               "widgetName": {
                 "type": "string",
                 "required": true,
                 "displayName": "widgetName"
               }
             }
           }
         ]
      };

    raml.load(definition).should.become(expected).and.notify(done);
  });
  //
  it('should singularize words properly', function(done) {
    var definition = [
      '#%RAML 0.8',
      '---',
      'title: Example',
      'schemas:',
      ' - wave: "{}"',
      'mediaType: application/json',
      'resourceTypes:',
      '  - collection:',
      '      get:',
      '        responses:',
      '          200:',
      '            body:',
      '              schema: <<resourcePathName | !singularize>>',
      '/waves:',
      '  type: collection'
    ].join('\n');

    var expected = {
      title: 'Example',
      mediaType: 'application/json',
      schemas:[ {wave:"{}"}],
      resourceTypes: [
        {
          collection: {
            get: {
              responses: {
                200: {
                  body: {
                    schema: '<<resourcePathName | !singularize>>'
                  }
                }
              }
            }
          }
        }
      ],
      resources: [
        {
          type: 'collection',
          relativeUri: '/waves',
          methods: [
            {
              responses: {
                200: {
                  body: {
                    'application/json': {
                      schema: "{}"
                    }
                  }
                }
              },
              method: 'get'
            }
          ],
          relativeUriPathSegments: [
            'waves'
          ]
        }
      ]
    };

    raml.load(definition).should.eventually.deep.equal(expected).and.notify(done);
  });
  //

  //FIXTEST transformed the test to use new parser's API
  it('should resolve keys in the correct order', function (done) {
    var definition = [
      '#%RAML 0.8',
      '---',
      'title: Example',
      '/foo: !include foo.yaml',
      '/bar: !include bar.yaml',
      '/qux: !include qux.yaml'
    ].join('\n');

    var ROOT_FILE = 'root.raml';

    return raml.loadFile(ROOT_FILE, {
          fsResolver : {
            contentAsync: function (filePath) {
              if (filePath.indexOf(ROOT_FILE) != -1) {
                return q(definition);
              }

              var deferred = q.defer();

              // Resolve randomly.
              setTimeout(function () {
                deferred.resolve('get:\n');
              }, Math.random() * 100);

              return deferred.promise;
            },
            content: function (path){
              return null;
            },
            list: function () {
              return [];
            }
          }
        }
    ).then(function (result) {
          result.resources.map(function (resource) {
            return resource.relativeUri;
          }).should.deep.equal(['/foo', '/bar', '/qux']);
        })
        .should.notify(done);
  });
  //

  //FIXTEST transformed the test to use new parser's API
  it('should resolve nested includes in the correct order', function (done) {
    var files = {
      'root.raml': [
        '#%RAML 0.8',
        '---',
        'title: Example',
        '/users: !include users.raml',
        '/articles: !include articles.raml'
      ].join('\n'),
      'users.raml': [
        'get: !include users-get.raml',
        'post: !include users-post.raml',
        '/{userId}: !include user.raml'
      ].join('\n'),
      'users-get.raml': [
        'responses:',
        '  200:'
      ].join('\n'),
      'users-post.raml': [
        'responses:',
        '  200:'
      ].join('\n'),
      'user.raml': [
        '/articles: !include user-articles.raml',
        '/comments: !include user-comments.raml'
      ].join('\n'),
      'user-articles.raml': [
        'get:'
      ].join('\n'),
      'user-comments.raml': [
        'get:'
      ].join('\n'),
      'articles.raml': [
        'get:'
      ].join('\n')
    };

    var reader = new raml.FileReader(function (path) {
      var deferred = q.defer();

      // Resolve randomly.
      setTimeout(function () {
        deferred.resolve(files[path]);
      }, Math.random() * 100);

      return deferred.promise;
    });

    var resolver = {
      contentAsync: function (filePath) {
        var deferred = q.defer();

        // Resolve randomly.
        setTimeout(function () {
          var content = null;
          Object.keys(files).forEach(function(currentFilePath){
            if (filePath.indexOf(currentFilePath) != -1) {
              content = files[currentFilePath];
            }
          })
          deferred.resolve(content);
        }, Math.random() * 100);

        return deferred.promise;
      },
      content: function (path){
        return null;
      },
      list: function () {
        return [];
      }
    }

    function getResouces (resource) {
      return resource.resources.map(function (resource) {
        return resource.relativeUri;
      });
    }

    function getMethods (resource) {
      return resource.methods ? resource.methods.map(function (method) {
        return method.method;
      }) : [];
    }

    return raml.loadFile('root.raml', { fsResolver: resolver })
        .then(function (result) {
          getResouces(result).should.deep.equal(['/users', '/articles'])
          getResouces(result.resources[0]).should.deep.equal(['/{userId}'])
          getResouces(result.resources[0].resources[0]).should.deep.equal(['/articles', '/comments'])

          getMethods(result).should.deep.equal([])
          getMethods(result.resources[0]).should.deep.equal(['get', 'post'])
          getMethods(result.resources[0].resources[0]).should.deep.equal([])

        })
        .should.notify(done);
  });
  //

  //FIXTEST added new line to the description sa there is no new node after description, and description is multiline,so
  //its logical that the last line break is going into the description mutiline
  it('should accept description in responses', function (done) {
    var definition = [
      '#%RAML 0.8',
      'title: Title',
      '/example:',
      '  get:',
      '    responses:',
      '      200:',
      '        body:',
      '          "*/*":',
      '            description: |',
      '              This is an example.'
    ].join('\n');

    var expected = {
      title: 'Title',
      resources: [
        {
          relativeUri: '/example',
          methods: [
            {
              method: 'get',
              responses: {
                '200': {
                  body: {
                    '*/*': {
                      description: 'This is an example.\n'
                    }
                  }
                }
              }
            }
          ],
          relativeUriPathSegments: ['example']
        }
      ]
    };

    raml.load(definition).should.become(expected).and.notify(done);
  });
  //
  it('should json parse unicode encoding', function (done) {
    var definition = [
      '#%RAML 0.8',
      'title: Title',
      '/:',
      '  post:',
      '    body:',
      '      application/json:',
      '        schema: |',
      '          {',
      '            "type": "string",',
      '            "pattern": "^[A-Z\u017D\\u017E]*$"',
      '          }'
    ].join('\n');

    var expected = {
      title: 'Title',
      resources: [
        {
          relativeUri: '/',
          methods: [
            {
              body: {
                'application/json': {
                  schema: '{\n  \"type\": \"string\",\n  \"pattern\": \"^[A-ZŽ\\u017E]*$\"\n}'
                }
              },
              method: 'post'
            }
          ],
          relativeUriPathSegments: []
        }
      ]
    };


    raml.load(definition).should.become(expected).and.notify(done);
  })
});
