/// <reference path="domParser.js"/>
/// <reference path="fakeElementSelectors.js"/>
/// <reference path="../src/js/cssPath.js"/>

describe("cssPath.selector", function () {

    describe("with native web elements", function() {
        function selectorTest (elementDefinition) {
            var element = elementDefinition.getElement();
            var result = cssPath(element);
            expect(result.selector).toContain(elementDefinition.selector);
        }
        for (var index in fakeElementSelectors) {
            if (fakeElementSelectors.hasOwnProperty(index)) {
                var fakeElementSelector = fakeElementSelectors[index];
                it("get selector of " + fakeElementSelector.type, (function (fakeElementSelector) {
                    return function () {
                        selectorTest(fakeElementSelector);
                    }
                }(fakeElementSelector)));
            }
        }
    });

    describe("with fake elements", function() {
        it("return empty if node is null or undefined", function () {
            var result = cssPath(null);
            var result2 = cssPath(undefined);
            expect(result.selector).toBe("");
            expect(result2.selector).toBe("");
        });

        it("return empty if node nodeType is not element", function () {
            var result = cssPath({ nodeType: 2 });
            expect(result.selector).toBe("");
        });

        it("return empty if node siblings is not element", function () {
            var node = { nodeType: 1, parentNode: { children: [{ nodeType: 2, nodeName: "comment" }] }, getAttribute: jasmine.createSpy(), nodeName: "input" };
            var result = cssPath(node);
            expect(result.selector).toBe("input");
        });

        it("return id only if optmized enable", function () {
            var node = { nodeType: 1, getAttribute: function () { return "login" }, nodeName: "input" };
            var result = cssPath(node, true);
            expect(result.selector).toEqual("#login");
        });

        it("return tag body or html or head if optmized enable", function () {
            var node = { nodeType: 1, getAttribute: jasmine.createSpy(), nodeName: "body" };
            var node2 = { nodeType: 1, getAttribute: jasmine.createSpy(), nodeName: "html" };
            var node3 = { nodeType: 1, getAttribute: jasmine.createSpy(), nodeName: "head" };
            var result = cssPath(node, true);
            var result2 = cssPath(node2, true);
            var result3 = cssPath(node3, true);
            expect(result.selector).toEqual("body");
            expect(result2.selector).toEqual("html");
            expect(result3.selector).toEqual("head");
        });

        // ReSharper disable NativeTypePrototypeExtending
        it("call shims if native not supported", function() {

            var node = {
                nodeType: 1, className: "test test3", getAttribute: jasmine.createSpy(), nodeName: "input",
                parentNode: { children: [
                    { nodeType: 1, nodeName: "input", className: "test test2", getAttribute: jasmine.createSpy() }
                ]}
            };
            var map = Array.prototype.map;
            var reduce = Array.prototype.reduce;
            var filter = Array.prototype.filter;


            Array.prototype.map = null;
            Array.prototype.reduce = null;
            Array.prototype.filter = null;

            var result = cssPath(node);

            Array.prototype.map = map;
            Array.prototype.reduce = reduce;
            Array.prototype.filter = filter;

            expect(result.selector).toContain("input.test.test3");

        });

        it("get node.className if node.getAttribute('class') not working", function() {
            var node = {
                nodeType: 1, className: "test test3", getAttribute: jasmine.createSpy(), nodeName: "input",
                parentNode: {
                    children: [
                        { nodeType: 1, nodeName: "input", className: "test test2", getAttribute: jasmine.createSpy() }
                    ]
                }
            };
            var result = cssPath(node);
            expect(result.selector).toContain("input.test.test3");
        });
    });


});

describe("cssPath.path", function(){
    describe("with native web elements",function(){
        function pathTest (elementDefinition){
            var element = elementDefinition.getElement();
            var result = cssPath(element);
            expect(result.path).toEqual(elementDefinition.path);
        }

        for (var index in fakeElementSelectors) {
            if (fakeElementSelectors.hasOwnProperty(index) && fakeElementSelectors[index].path) {
                var fakeElementSelector = fakeElementSelectors[index];
                it("get path of " + fakeElementSelector.type, (function (fakeElementSelector) {
                    return function () {
                        pathTest(fakeElementSelector);
                    }
                }(fakeElementSelector)));
            }
        }
    });
});

