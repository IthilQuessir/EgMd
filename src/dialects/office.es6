/*jshint esversion: 6 */
import Dialect from "../lib/dialect";

import block from "../lib/syntax/block";
import atxHeader from "../lib/syntax/atx_header";
import setextHeader from "../lib/syntax/setext_header";
import paragraph from "../lib/syntax/paragraph";
import blockquote from "../lib/syntax/blockquote";
import table from "../lib/syntax/table";
import list from "../lib/syntax/list";
import code from "../lib/syntax/code";
import horizLine from "../lib/syntax/horiz_line";


import image from "../lib/syntax/image";
import autolink from "../lib/syntax/autolink";
import hyperlink from "../lib/syntax/hyperlink";
import escaped from "../lib/syntax/escaped";

import Md from "../lib/index";


Md.addDialect(new Dialect("office", [
    block,

    blockquote,
    atxHeader,
    setextHeader,
    table,
    list,
    code,
    horizLine,
    paragraph,

    escaped,
    image,
    hyperlink,
    autolink,

]), true);

module.exports = Md;
