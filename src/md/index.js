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
                throw new Error("[Md require] Cannot find module: " + url);
            }

        }

        return target;

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
            throw new Error("[Md extend] Unexpected return of the module \"" + path[i] + "\"");
        }
    }

    function Md(str, options) {

        var dialects = require("dialects"),
            dialect = null,
            key;

        options = options || {};

        /**
         * 若配置的解析器不存在或者未配置
         * 则随意选择一个解析器作为默认解析器进行解析
         */
        if (options.dialect && options.dialect in dialects) {
            dialect = dialects[options.dialect];
        } else {
            for (key in dialects) {
                dialect = dialects[key];
                break;
            }
        }

        if (!dialect) {
            throw new Error("[Md] Plese use full_version or include dialect module\n" +
                "请使用完整版或者 Md-seed.js + dialect模块配合使用。" +
                "仅单独使用Md-seed.js是无法运行的");
        }

        str = str
            .replace(/^\s*\n/, "")
            .replace(/\s*$/, "");

        return dialect.parse(str).toHtml();

    }

    Md.extend = extend;

    global.Md = Md;

}(this));
