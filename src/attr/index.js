Md.extend("attr", function (require) {

        function Attr() {
            this.list = {};
        }

        /**
         * 将属性名为name的属性值添加/修改为value
         *
         * @param {String} name  属性名
         * @param {String} value 属性值
         */
        Attr.prototype.add = function(name, value) {
            this.list[name] = value;
        };

        /**
         * 上属性名为name的属性移除
         *
         * @param {String} name 属性名
         */
        Attr.prototype.rm = function(name) {
            delete this.list[name];
        };

        Attr.prototype.get = function(name) {
            return this.list[name] || null;
        };

        Attr.prototype.forEach = function(cb) {
            var key,
                list = this.list;
            for (key in list) {
                if (list.hasOwnProperty(key)) {
                    cb.call(this, key, list[key]);
                }
            }
        };

        Attr.prototype.clone = function() {
            // TODO 深复制代码
        };

        return Attr;
});
