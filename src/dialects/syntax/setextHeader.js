(function() {

    function setextHeader() {}

    setextHeader.prototype.parse = function(str, queue) {

        var pattern = /^(.*)\n([-=])\2\2+(?:\n|$)/,
            reg = null,
            level = "",
            header = null;

        if (!pattern.test(str)) {
            return null;
        }

        reg = str.match(pattern);

        level = (reg[2] === "=") ? "h1" : "h2";
        header = new Node(level);

        header.addChild(new TextNode(reg[1]));

        // 字符串尾部还有其余内容，则将其放回队列头部
        if( reg[0].length < str.length ) {
            queue.push( str.substr(reg[0].length) );
        }

        return header;
    };

    Block.expend(setextHeader);

}());
