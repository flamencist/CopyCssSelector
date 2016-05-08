/**
 * get unique selector, path of node
 * @param {HTMLElement} node html element
 * @param {function} querySelectorAll function for search element via selector
 * @param {boolean?} optimized get short selector
 * @returns {Object} {selector:String,path:String,element:HTMLElement}
 */
var cssPath = function (node, querySelectorAll, optimized) {

    //region shim for ie < 9
    //noinspection JSUnresolvedVariable
    var call = Function.call;

    /**
     * wrap function and use first argument as context (this) in returned function
     * @param f {Function} function for call
     * @returns {Function}
     */
    function uncurryThis(f) {
        return function () {
            return call.apply(f, arguments);
        };
    }

    /**
     * check function is native
     * @param f {Function} function
     * @returns {boolean}
     */
    var isFuncNative = function (f) {
        return !!f && (typeof f).toLowerCase() === "function"
            && (f === Function.prototype
            || /^\s*function\s*(\b[a-z$_][a-z0-9$_]*\b)*\s*\((|([a-z$_][a-z0-9$_]*)(\s*,[a-z$_][a-z0-9$_]*)*)\)\s*\{\s*\[native code\]\s*\}\s*$/i.test(String(f)));
    };


    var array_reduce = uncurryThis(
        Array.prototype.reduce && isFuncNative(Array.prototype.reduce) ? Array.prototype.reduce : function (callback, basis) {
            var index = 0,
                length = this.length;
            // concerning the initial value, if one is not provided
            if (arguments.length === 1) {
                // seek to the first value in the array, accounting
                // for the possibility that is is a sparse array
                do {
                    if (index in this) {
                        basis = this[index++];
                        break;
                    }
                    if (++index >= length) {
                        throw new TypeError();
                    }
                } while (1);
            }
            // reduce
            for (; index < length; index++) {
                // account for the possibility that the array is sparse
                if (index in this) {
                    basis = callback(basis, this[index], index);
                }
            }
            return basis;
        }
    );

    var array_map = uncurryThis(
        Array.prototype.map && isFuncNative(Array.prototype.map) ? Array.prototype.map : function (callback, thisp) {
            var self = this;
            var collect = [];
            array_reduce(self, function (undefined, value, index) {
                collect.push(callback.call(thisp, value, index, self));
            }, void 0);
            return collect;
        }
    );

    var array_filter = uncurryThis(
        Array.prototype.filter && isFuncNative(Array.prototype.filter) ? Array.prototype.filter :
            function (predicate, that) {
                var other = [], v;
                for (var i = 0, n = this.length; i < n; i++)
                    if (i in this && predicate.call(that, v = this[i], i, this))
                        other.push(v);
                return other;
            }
    );
    //endregion

    /**
     * get full path of node
     * @param {HTMLElement} node
     * @return {string}
     */
    function getPath(node) {
        if (!node || node.nodeType !== 1)
            return "";
        var steps = [];
        var contextNode = node;
        while (contextNode) {
            var step = cssPathStep(contextNode, false, contextNode === node, true);
            if (!step)
                break; // Error - bail out early.
            steps.push(step);
            contextNode = contextNode.parentNode;
        }

        steps.reverse();
        return steps.join(" ");
    }


    /**
     * @param {HTMLElement} node
     * @param {boolean?} optimized
     * @return {string}
     */
    function getSelector(node, optimized) {
        if (!node || node.nodeType !== 1)
            return "";

        var steps = [];
        var contextNode = node;
        while (contextNode) {
            var step = cssPathStep(contextNode, !!optimized, contextNode === node, false);
            if (!step)
                break; // Error - bail out early.
            steps.push(step);
            if (step.optimized) {
                if (isUniqueSelector(buildSelector(steps)))
                    break;
            }
            contextNode = contextNode.parentNode;
        }

        var simplifiedSteps = simplifySelector(steps);
        return buildSelector(simplifiedSteps);
    }

    /**
     * @constructor
     * @param {string} value
     * @param {boolean} optimized
     */
    var DomNodePathStep = function (value, optimized) {
        this.value = value;
        this.optimized = optimized || false;
    };

    DomNodePathStep.prototype = {
        /**
         * @return {string}
         */
        toString: function () {
            return this.value;
        }
    };

    /**
     * @param {HTMLElement} node
     * @param {boolean?} optimized
     * @param {boolean?} isTargetNode
     * @param {boolean?} withoutNthChild
     * @return {DomNodePathStep} selector for current node
     */
    function cssPathStep(node, optimized, isTargetNode, withoutNthChild) {
        if (node.nodeType !== 1)
            return null;

        var id = node.getAttribute("id");
        if (optimized) {
            if (id)
                return new DomNodePathStep(idSelector(id), true);
            var nodeNameLower = node.nodeName.toLowerCase();
            if (nodeNameLower === "body" || nodeNameLower === "head" || nodeNameLower === "html")
                return new DomNodePathStep(node.nodeName.toLowerCase(), true);
        }
        var nodeName = node.nodeName.toLowerCase();
        var parent = node.parentNode;
        var siblings = parent.children || [];

        if (id && hasSiblingsWithId(siblings, id, nodeName))
            return new DomNodePathStep(nodeName + idSelector(id), true);

        if (!parent || parent.nodeType === 9) // document node
            return new DomNodePathStep(nodeName, true);

        var prefixedOwnClassNamesArray = prefixedElementClassNames(node);
        var needsClassNames = false;
        var needsNthChild = false;
        var ownIndex = -1;
        var elementIndex = -1;

        var attributeName = node.getAttribute("name");
        var attributeNameNeeded = false;
        if (isSimpleInput(node, isTargetNode) && attributeName) {
            attributeNameNeeded = true;
        }

        for (var i = 0;
             (ownIndex === -1 || !needsNthChild) && i < siblings.length; ++i) {
            var sibling = siblings[i];
            if (sibling.nodeType !== 1)
                continue;
            elementIndex += 1;
            if (sibling === node) {
                ownIndex = elementIndex;
                continue;
            }
            if (needsNthChild)
                continue;
            if (sibling.nodeName.toLowerCase() !== nodeName)
                continue;

            needsClassNames = true;
            var ownClassNames = keySet(prefixedOwnClassNamesArray);
            var ownClassNameCount = 0;
            var siblingAttributeName = sibling.getAttribute("name");
            if (siblingAttributeName === attributeName) {
                attributeNameNeeded = false;
            }

            for (var name in ownClassNames)
                if (ownClassNames.hasOwnProperty(name))++ownClassNameCount;
            if (ownClassNameCount === 0 && !attributeNameNeeded) {
                needsNthChild = !withoutNthChild;
                continue;
            }
            var siblingClassNamesArray = prefixedElementClassNames(sibling);

            for (var j = 0; j < siblingClassNamesArray.length; ++j) {
                var siblingClass = siblingClassNamesArray[j];
                if (!ownClassNames.hasOwnProperty(siblingClass))
                    continue;
                delete ownClassNames[siblingClass];
                if (!--ownClassNameCount && !attributeNameNeeded) {
                    needsNthChild = !withoutNthChild;
                    break;
                }
            }
        }

        var result = nodeName;
        if (isSimpleInput(node, isTargetNode)) {
            if (attributeNameNeeded) {
                result += "[name=\"" + escapeIdentifierIfNeeded(attributeName) + "\"]";
            } else {
                if (node.getAttribute("type")) {
                    result += "[type=\"" + node.getAttribute("type") + "\"]";
                }
            }
        }

        if (needsNthChild) {
            result += ":nth-child(" + (ownIndex + 1) + ")";
        } else if (needsClassNames) {
            for (var prefixedName in keySet(prefixedOwnClassNamesArray)) {
                result += "." + escapeIdentifierIfNeeded(prefixedName.substr(1));
            }
        }

        return new DomNodePathStep(result, false);
    }

    /**
     * simplify selector
     * @param {Array} steps parts of selector
     * @return {Array} steps
     */
    function simplifySelector(steps) {
        var minLength = 2;
        //if count of selectors is little that not modify selector
        if (steps.length <= minLength) return steps;
        var sliced = steps.slice(0, minLength);
        while (sliced.length < steps.length) {
            var selector = buildSelector(sliced);
            if (isUniqueSelector(selector)) {
                break;
            }
            sliced = steps.slice(0, sliced.length + 1);
        }
        return sliced;
    }

    function isSimpleInput(node, isTargetNode) {
        return isTargetNode && node.nodeName.toLowerCase() === "input" && !node.getAttribute("id") && !getClassName(node);
    }

    /**
     * create selector string from steps array
     * @function buildSelector
     * @param {Array} steps Array of string
     * @return {string} selector string
     */
    function buildSelector(steps) {
        var stepsCopy = steps.slice();
        stepsCopy.reverse();
        return stepsCopy.join(" > ");
    }

    /**
     * element has siblings with same id and same tag
     * @function hasSiblingsWithId
     * @param {Array} siblings Array of elements , parent.children
     * @param {String} id
     * @param {String} nodeName
     * @return {boolean}
     */
    function hasSiblingsWithId(siblings, id, nodeName) {
        return array_filter(siblings, function (el) {
                return el.nodeType === 1 && el.getAttribute("id") === id && el.nodeName.toLowerCase() === nodeName;
            }).length == 1;
    }

    /**
     * @param {HTMLElement} node
     * @return {!Array.<string>}
     */
    function prefixedElementClassNames(node) {
        var classAttribute = getClassName(node);
        if (!classAttribute)
            return [];

        var classes = classAttribute.split(/\s+/g);
        var existClasses = array_filter(classes, Boolean);
        return array_map(existClasses, function (name) {
            // The prefix is required to store "__proto__" in a object-based map.
            return "$" + name;
        });
    }

    /**
     * @param {string} id
     * @return {string}
     */
    function idSelector(id) {
        return "#" + escapeIdentifierIfNeeded(id);
    }

    /**
     * @param {string} ident identifier
     * @return {string}
     */
    function escapeIdentifierIfNeeded(ident) {
        if (isCssIdentifier(ident))
            return ident;
        var shouldEscapeFirst = /^(?:[0-9]|-[0-9-]?)/.test(ident);
        var lastIndex = ident.length - 1;
        return ident.replace(/./g, function (c, i) {
            return ((shouldEscapeFirst && i === 0) || !isCssIdentChar(c)) ? escapeAsciiChar(c, i === lastIndex) : c;
        });
    }

    /**
     * @param {string} c
     * @param {boolean} isLast
     * @return {string}
     */
    function escapeAsciiChar(c, isLast) {
        return "\\" + toHexByte(c) + (isLast ? "" : " ");
    }

    /**
     * @param {string} c character
     */
    function toHexByte(c) {
        var hexByte = c.charCodeAt(0).toString(16);
        if (hexByte.length === 1)
            hexByte = "0" + hexByte;
        return hexByte;
    }

    /**
     * @param {string} c character
     * @return {boolean}
     */
    function isCssIdentChar(c) {
        if (/[a-zA-Z0-9_-]/.test(c))
            return true;
        return c.charCodeAt(0) >= 0xA0;
    }

    /**
     * @param {string} value
     * @return {boolean}
     */
    function isCssIdentifier(value) {
        return /^-?[a-zA-Z_][a-zA-Z0-9_-]*$/.test(value);
    }

    /**
     * get css class of element
     * @param {HTMLElement} node Web element
     * @return {string}
     */
    function getClassName(node) {
        return node.getAttribute("class") || node.className;
    }

    /**
     * detect selector is unique
     * @param {String} selector
     * @return {boolean} is unique selector
     */
    function isUniqueSelector(selector) {
        if (!querySelectorAll) {
            return true;
        }
        return querySelectorAll(selector).length < 2;
    }

    /**
     *
     * @param {Array} array of keys
     * @return {Object}
     */
    function keySet(array) {
        var keys = {};
        for (var i = 0; i < array.length; ++i)
            keys[array[i]] = true;
        return keys;
    }

    return Object.create(null, {
        selector: {value: getSelector(node, optimized), writable: true},
        path: {value: getPath(node)},
        element: {value: node, writable: true}
    });
};