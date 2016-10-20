(function(global, undefined) {
    'use strict';

    var modules = {};

    function require(url) {

        var path = url.split("/"),
            i = 0,
            len = path.length,
            target = modules;

        for (; i < len; i++) {

            if (path[i] in target) {
                target = target[path[i]];
            } else {
                throw new Error("[Md require] Cannot find the module;\nThe url is " + url);
            }

        }


        if (path in modules) {
            return modules[name];
        } else {
            throw new Error("CANNOT ");
        }

    }

    function extend(url, cb) {

        var path = url.split("/"),
            i = 0,
            len = path.length - 1,
            target = modules,
            theModule = null;

        for (; i < len; i++) {
            if (!(path[i] in target)) {
                target[path[i]] = {};
            }

            target = target[path[i]];
        }

        if (path[i] in target) {
            throw new Error("[Md extend] Module had existed;\nThe Url is " + url);
        }

        theModule = cb.call(target, require);

        if (theModule) {
            target[path[i]] = theModule;
        } else {
            throw new Error("[Md extend] the module \"" + path[i] + "\"" + "had existed");
        }
    }

    function Md(str, options) {

        var dialect = new Dialect(),
            nodeTree = dialect.parse(str),
            domTree = nodeTree.toHtml();

        this.options = options;

        return domTree;

    }

    Md.prototype.extend = extend;

    global.Md = Md;

}(this));
