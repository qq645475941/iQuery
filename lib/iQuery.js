(function (window) {
    var arr = [];

    var document = window.document;

    var getProto = Object.getPrototypeOf;

    var slice = arr.slice;

    var concat = arr.concat;

    var push = arr.push;

    var indexOf = arr.indexOf;

    var class2type = {};

    var toString = class2type.toString;

    var hasOwn = class2type.hasOwnProperty;

    var fnToString = hasOwn.toString;


    function $(selector, ctx) {
        return new $.fn.init(selector, ctx)
    }

    var iQuery = $;


    $.fn = $.prototype = {
        constructor: $,


        prepend: function (selector) {
            var ele = iQuery.getEle(selector);
            this[0].insertAdjacentElement('afterbegin', ele)
        },
        after: function (selector) {
            if (selector) {
                var ele = iQuery.getEle(selector);
                this[0].insertAdjacentElement('afterend', ele[0])
                return this;
            } else {
                ele = this[0].nextElementSibling ? iQuery.getEle(this[0].nextElementSibling) : [];
                return $(ele);
            }
        },
        remove: function () {
            forEach(this, function (ele, name) {
                name != 'length' && ele.parentElement.removeChild(ele);
            })
        },
        size: function () {
            return this.length;
        },
        isEmpty: function () {
            return this.size() == 0;
        }
    }


    $.fn.init = function (selector, ctx) {
        var tempDiv, tempCols;
        ctx || ( ctx = document );
        var eleCollections = iQuery.getEle(selector, ctx);
        iQuery.extend(this, eleCollections);
        this.length = eleCollections.length;

    }
    $.fn.init.prototype = $.fn;


    $.extend = $.fn.extend = function () {
        var options, name, src, copy, copyIsArray, clone,
            target = arguments[0] || {},
            i = 1,
            length = arguments.length,
            deep = false;

        // Handle a deep copy situation
        if (typeof target === "boolean") {
            deep = target;

            // Skip the boolean and the target
            target = arguments[i] || {};
            i++;
        }

        // Handle case when target is a string or something (possible in deep copy)
        if (typeof target !== "object" && !iQuery.isFunction(target)) {
            target = {};
        }

        // Extend iQuery itself if only one argument is passed
        if (i === length) {
            target = this;
            i--;
        }

        for (; i < length; i++) {

            // Only deal with non-null/undefined values
            if (( options = arguments[i] ) != null) {

                // Extend the base object
                for (name in options) {
                    src = target[name];
                    copy = options[name];

                    // Prevent never-ending loop
                    if (target === copy) {
                        continue;
                    }

                    // Recurse if we're merging plain objects or arrays
                    if (deep && copy && ( iQuery.isPlainObject(copy) ||
                        ( copyIsArray = iQuery.isArray(copy) ) )) {

                        if (copyIsArray) {
                            copyIsArray = false;
                            clone = src && iQuery.isArray(src) ? src : [];

                        } else {
                            clone = src && iQuery.isPlainObject(src) ? src : {};
                        }

                        // Never move original objects, clone them
                        target[name] = iQuery.extend(deep, clone, copy);

                        // Don't bring in undefined values
                    } else if (copy !== undefined) {
                        target[name] = copy;
                    }
                }
            }
        }

        // Return the modified object
        return target;
    }

    iQuery.extend({
        getEle: function (selector, ctx) {
            if (selector.nodeType == 1) {
                return [selector]
            }
            else if (typeof selector == 'string' && (new RegExp(RegHtmlEle)).test(selector)) {
                return domEval(selector)
            }
            else if (this.isArrayLike(selector)) {
                return selector;
            }
            else {
                return (ctx || document).querySelectorAll(selector);

            }
        },
        isFunction: function (obj) {
            return iQuery.type(obj) === "function";
        },
        isArrayLike: function (arr) {
            return typeof arr.length != 'undefined';
        },

        isArray: Array.isArray,
        isPlainObject: function (obj) {
            var proto, Ctor;

            // Detect obvious negatives
            // Use toString instead of iQuery.type to catch host objects
            if (!obj || toString.call(obj) !== "[object Object]") {
                return false;
            }

            proto = getProto(obj);

            // Objects with no prototype (e.g., `Object.create( null )`) are plain
            if (!proto) {
                return true;
            }

            // Objects with prototype are plain iff they were constructed by a global Object function
            Ctor = hasOwn.call(proto, "constructor") && proto.constructor;
            return typeof Ctor === "function" && fnToString.call(Ctor) === ObjectFunctionString;
        },
        merge: function (first, second) {
            var len = +second.length,
                j = 0,
                i = first.length;

            for (; j < len; j++) {
                first[i++] = second[j];
            }

            first.length = i;

            return first;
        }
    });

    var RegHtmlEle = '<([a-zA-Z]+).*?>.*?<\\/\\1>';

    function domEval(htmStr) {
        var tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmStr;
        return tempDiv.children;
    }

    function forEach(obj, callback) {
        for (var i in obj) {
            if (hasOwn.call(obj, i)) {
                if (callback(obj[i], i, obj)) {
                    break;
                }
            }

        }
    }

    window.forEach = forEach;

    window.$ = $;
    window.iQuery = iQuery;
}(window))