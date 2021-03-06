/// <reference path="../../../typings/main.d.ts" />
import index = require("../../index");
import assert = require("assert");
import ramlWrapper = require("../artifacts/raml10parser");
import jsyaml = require("../jsyaml/jsyaml2lowLevel");
import hlimpl = require("../highLevelImpl");
import util = require("./test-utils");

describe('AST Reuse Test Set',function() {
    this.timeout(15000);
    describe('Basic Tests', function () {

        it("Space in the method description", function () {
            test("ASTReuseTests/BasicTests/api.raml", "ASTReuseTests/BasicTests/api01.raml");
        });

        it("Changing response code in the main tree", function () {
            test("ASTReuseTests/BasicTests/api.raml", "ASTReuseTests/BasicTests/api02.raml");
        });

        it("Response body type switch", function () {
            test("ASTReuseTests/BasicTests/api.raml", "ASTReuseTests/BasicTests/api03.raml");
        });

        it("Root media type switch", function () {
            test("ASTReuseTests/BasicTests/api.raml", "ASTReuseTests/BasicTests/api04.raml");
        });

        it("Resource type switch", function () {
            test("ASTReuseTests/test01/api.raml", "ASTReuseTests/test01/api01.raml");
        });

        it("Trait switch", function () {
            test("ASTReuseTests/test01/api.raml", "ASTReuseTests/test01/api02.raml");
        });

        it("Additional trait", function () {
            test("ASTReuseTests/test01/api.raml", "ASTReuseTests/test01/api03.raml");
        });

        it("Super type switch", function () {
            test("ASTReuseTests/test02/api.raml", "ASTReuseTests/test02/api01.raml", false);
        });

        it("Additional properties for a response mime type", function () {
            test("ASTReuseTests/test03/api.raml", "ASTReuseTests/test03/api01.raml");
        });

        it("Uri parameter facet value change", function () {
            test("ASTReuseTests/test04/api.raml", "ASTReuseTests/test04/api01.raml");
        });

        it("Resource description change", function () {
            test("ASTReuseTests/test05/api.raml", "ASTReuseTests/test05/api01.raml");
        });

        it("Header name change in the method", function () {
            test("ASTReuseTests/test06/api.raml", "ASTReuseTests/test06/api01.raml");
        });

        it("Trait parameter value change", function () {
            test("ASTReuseTests/test07/api.raml", "ASTReuseTests/test07/api01.raml", false);
        });

        it("Method securedBy value change", function () {
            test("ASTReuseTests/test08/api.raml", "ASTReuseTests/test08/api01.raml");
        });

        it("Resource annotation change", function () {
            test("ASTReuseTests/test09/api.raml", "ASTReuseTests/test09/api01.raml");
        });

        it("Method annotation change", function () {
            test("ASTReuseTests/test09/api.raml", "ASTReuseTests/test09/api02.raml");
        });

        it("Resource annotation string value change", function () {
            test("ASTReuseTests/test09/api.raml", "ASTReuseTests/test09/api03.raml");
        });

        it("Resource annotation object value change", function () {
            test("ASTReuseTests/test09/api.raml", "ASTReuseTests/test09/api04.raml");
        });

        it("Method annotation value change", function () {
            test("ASTReuseTests/test09/api.raml", "ASTReuseTests/test09/api05.raml");
        });
        it("Resource object annotation property value change", function () {
            test("ASTReuseTests/test09/api.raml", "ASTReuseTests/test09/api06.raml");
        });

        it("Resource type annotation for a resource with the same annotation", function () {
            test("ASTReuseTests/test10/api.raml", "ASTReuseTests/test10/api01.raml");
        });

        it("Resource type annotation for a resource", function () {
            test("ASTReuseTests/test10/api.raml", "ASTReuseTests/test10/api02.raml");
        });

        it("Resource type: change method response change 1", function () {
            test("ASTReuseTests/test11/api.raml", "ASTReuseTests/test11/api01.raml", false);
        });

        it("Resource type: change method response change 2", function () {
            test("ASTReuseTests/test11/api.raml", "ASTReuseTests/test11/api02.raml", false);
        });

        it("Inherited method change 1", function () {
            test("ASTReuseTests/test12/api.raml", "ASTReuseTests/test12/api01.raml", false);
        });

        it("Inherited method change 2", function () {
            test("ASTReuseTests/test12/api.raml", "ASTReuseTests/test12/api02.raml", false);
        });

        it("Resource type method trait content change 1", function () {
            test("ASTReuseTests/test13/api.raml", "ASTReuseTests/test13/api01.raml", false);
        });

        it("Resource type method trait content change 2", function () {
            test("ASTReuseTests/test13/api.raml", "ASTReuseTests/test13/api03.raml", false);
        });

        it("Resource type method trait value change", function () {
            test("ASTReuseTests/test13/api.raml", "ASTReuseTests/test13/api02.raml", false);
        });

        it("Resource type method trait name change", function () {
            test("ASTReuseTests/test13/api.raml", "ASTReuseTests/test13/api04.raml", false);
        });

        it("Resource type parameter name change", function () {
            test("ASTReuseTests/test14/api.raml", "ASTReuseTests/test14/api01.raml", false);
        });

        it("Resource type parameter value change", function () {
            test("ASTReuseTests/test14/api.raml", "ASTReuseTests/test14/api02.raml", false);
        });

        it("Resource type parameter function change", function () {
            test("ASTReuseTests/test14/api.raml", "ASTReuseTests/test14/api03.raml", false);
        });

        it("Object annotation adding", function () {
            test("ASTReuseTests/test15/api.raml", "ASTReuseTests/test15/api01.raml", false);
        });

        it("Parent object annotation adding ", function () {
            test("ASTReuseTests/test15/api.raml", "ASTReuseTests/test15/api02.raml", false);
        });

        it("Object property annotation adding ", function () {
            test("ASTReuseTests/test15/api.raml", "ASTReuseTests/test15/api03.raml", false);
        });

        it("Change property declaration type", function () {
            test("ASTReuseTests/test16/api.raml", "ASTReuseTests/test16/api01.raml", false);
        });

        it("Change property declaration type", function () {
            test("ASTReuseTests/test16/api.raml", "ASTReuseTests/test16/api02.raml", false);
        });

        it("Change property declaration type 2", function () {
            test("ASTReuseTests/test17/api.raml", "ASTReuseTests/test17/api01.raml", false);
        });

        it("Change property declaration type 3", function () {
            test("ASTReuseTests/test17/api.raml", "ASTReuseTests/test17/api02.raml", false);
        });

        it("Resource type: change supertype", function () {
            test("ASTReuseTests/test18/api.raml", "ASTReuseTests/test18/api01.raml", false);
        });

        it("Resource type: modify supertype trait", function () {
            test("ASTReuseTests/test18/api.raml", "ASTReuseTests/test18/api02.raml", false);
        });

        it("Resource type: modify response body", function () {
            test("ASTReuseTests/test18/api.raml", "ASTReuseTests/test18/api03.raml", false);
        });

        it("Resource type sypertype: change method name", function () {
            test("ASTReuseTests/test18/api.raml", "ASTReuseTests/test18/api04.raml", false);
        });

        it("Resource type sypertype: change response code", function () {
            test("ASTReuseTests/test18/api.raml", "ASTReuseTests/test18/api05.raml", false);
        });

        it("Resource type sypertype: modify trait", function () {
            test("ASTReuseTests/test18/api.raml", "ASTReuseTests/test18/api06.raml", false);
        });

        it("Resource type value change", function () {
            test("ASTReuseTests/test18/api.raml", "ASTReuseTests/test18/api07.raml");
        });
    });
});

function test(path1:string,path2:string,doReuse=true) {

    var path1Res = util.data(path1).replace(/\\/g,'/');
    var path2Res = util.data(path2).replace(/\\/g,'/');
    let api1 = (<ramlWrapper.ApiImpl>index.loadRAMLSync(path1Res, [])).expand();

    var resolver = new jsyaml.FSResolverImpl();
    var fsResolver = {
        content: (path) => {
            if (path == path1Res) {
                return resolver.content(path2Res)
            }
            return resolver.content(path);
        },
        contentAsync: (path) => {
            return Promise.resolve("");
        }
    };

    let api2 = (<ramlWrapper.ApiImpl>index.loadRAMLSync(path1Res, [], {
        reusedNode: api1.highLevel(),
        fsResolver: fsResolver
    })).expand();
    var payload1 = api2.toJSON({rootNodeDetails: true});

    let api3 = (<ramlWrapper.ApiImpl>index.loadRAMLSync(path1Res, [], {
        fsResolver: fsResolver
    })).expand();
    var payload2 = api3.toJSON({rootNodeDetails: true});

    var diff = util.compare(payload1,payload2);


    if(diff.length!=0){
        console.warn("DIFFERENCE DETECTED FOR " + path2Res);
        console.warn(diff.map(x=>x.message("actual","expected")).join("\n\n"));
        assert(false);
    }
    if(doReuse){
        assert((<hlimpl.ASTNodeImpl>api2.highLevel()).reusedNode()!=null,"Reuse is expected");
    }
    else {
        assert((<hlimpl.ASTNodeImpl>api2.highLevel()).reusedNode()==null,"Reuse is not expected");
    }

}
