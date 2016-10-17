Md.extend("dialect-builder", function (require) {

    function Dialect() {

    }

    function dialectBuilder() {
        this.list = [];
    }

    dialectBuilder.prototype.addSyntax = function (name) {
        this.list.push(name);
    };

    dialectBuilder.prototype.build = function () {

    };

});
