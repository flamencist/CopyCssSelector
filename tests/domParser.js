/*global document, DOMParser*/
(function (DOMParser) {
    "use strict";

    var
        DOMParser_proto = DOMParser.prototype,
        real_parseFromString = DOMParser_proto.parseFromString
        ;

    // Firefox/Opera/IE throw errors on unsupported types
    try {
        // WebKit returns null on unsupported types
        if ((new DOMParser).parseFromString("", "text/html")) {
            // text/html parsing is natively supported
            return;
        }
    } catch (ex) { }

    var createDocumentForOldBrowser = function(markup) {
        var doc = document.implementation.createHTMLDocument("");
        if (markup.toLowerCase().indexOf("<!doctype") > -1) {
            doc.documentElement.innerHTML = markup;
        }
        else {
            doc.body.innerHTML = markup;
        }
        return doc;
    };

    /** @const */
    var _Function_apply_ = Function.prototype.apply

        , _Array_slice_ = Array.prototype.slice

    /** @const */
        , _Function_call_ = Function.prototype.call

    /** Use native or unsafe but fast 'bind' for service and performance needs
     * @const
     * @param {Object} object
     * @param {...} var_args
     * @return {Function} */
        , _fastUnsafe_Function_bind_ = Function.prototype.bind || function(object, var_args) {
            var __method = this
                , args
                ;

            if( arguments.length > 1 ) {
                args = _Array_slice_.call(arguments, 1);
                return function () {
                    return _Function_apply_.call(__method, object, args.concat(_Array_slice_.call(arguments)));
                };
            }

            return function () {
                return _Function_apply_.call(__method, object, arguments);
            };
        }

    function prepareTextForIFrame(text) {
        return text
            .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')//remove script tags from HTML text
            //TODO:: not remove all <script (.*?)>, just <script>, <script type="text/javascript">, <script type="">, <script type="text/vbscript">. Due <script> can contains a template
            .replace(/"/g, '\\"')
            ;
    }

    var createDocumentForOldIeBrowser = function (markup, type) {
        if (!type || type == "text/html" || /xml$/.test(type)) {
            markup = prepareTextForIFrame(markup);

            var iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.src = 'javascript:document.write("' + markup + '")';
            document.body.appendChild(iframe);
            var newHTMLDocument =  iframe.contentDocument || iframe.contentWindow.document;
            /* if (iframe.contentWindow) {
             newHTMLDocument["contentWindow"] = {};
             newHTMLDocument["contentWindow"]["document"] = newHTMLDocument;
             for (var k in iframe.contentWindow) {
             if (!newHTMLDocument["contentWindow"][k])
             newHTMLDocument["contentWindow"][k] = iframe.contentWindow[k];
             }
             //                newHTMLDocument["contentWindow"]["document"]["documentElement"] = newHTMLDocument;
             }*/
            newHTMLDocument["__destroy__"] = _fastUnsafe_Function_bind_.call(function () {
                var _doc = this.contentWindow.document;
                _doc.documentElement.innerHTML = "";
                _doc["_"] = _doc.documentElement["_"] = null;
                /*TODO:: filter build-in properties suche as "URL", "location", etc
                 Object.keys(_doc).forEach(function(key){
                 try{
                 _doc[key] = null;
                 }
                 catch(e){}
                 })
                 */
                document.body.removeChild(this);
            }, iframe);

            markup = iframe = null;

            //TODO::
            //shimDocument(newHTMLDocument);
            newHTMLDocument.getElementsByClassName = newHTMLDocument.getElementsByClassName || document.getElementsByClassName;
            newHTMLDocument.getElementsByTagName = newHTMLDocument.getElementsByTagName || document.getElementsByTagName;
            newHTMLDocument.getElementsByName = newHTMLDocument.getElementsByName || document.getElementsByName;
            newHTMLDocument.getElementById =newHTMLDocument.getElementById || document.getElementById;
            newHTMLDocument.querySelector = newHTMLDocument.querySelector || document.querySelector;
            newHTMLDocument.querySelectorAll = newHTMLDocument.querySelectorAll || document.querySelectorAll;

            if (document["find"]) newHTMLDocument["find"] = document["find"];
            if (document["findAll"]) newHTMLDocument["findAll"] = document["findAll"];

            return newHTMLDocument;
        }
        else {
            //Not supported
            return null;
        }
    };

    DOMParser_proto.parseFromString = function (markup, type) {
        if (/^\s*text\/html\s*(?:;|$)/i.test(type)) {
            if (document.implementation && document.implementation.createHTMLDocument) {
                return createDocumentForOldBrowser(markup);
            } else {
                return createDocumentForOldIeBrowser(markup,type);
            }
        } else {
            return real_parseFromString.apply(this, arguments);
        }
    };
}(window.DOMParser || (window.DOMParser = function() {})));