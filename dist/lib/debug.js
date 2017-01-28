"use strict";

/*jshint esversion: 6 */
module.exports = {
    isDebug: true,
    log: function log(fn) {
        if (this.isDebug) {

            if (typeof fn === "function") {
                console.log(fn());
            } else {
                console.log.apply(null, arguments);
            }
        }
    },
    warn: function warn(fn) {
        if (this.isDebug) {

            if (typeof fn === "function") {
                console.warn(fn());
            } else {
                console.warn.apply(null, arguments);
            }
        }
    }

};