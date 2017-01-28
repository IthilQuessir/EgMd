/*jshint esversion: 6 */
module.exports = {
    isDebug: true,
    log: function(fn) {
        if (this.isDebug) {

            if (typeof fn === "function") {
                console.log(fn());
            } else {
                console.log.apply(null, arguments);
            }

        }
    },
    warn: function(fn) {
        if (this.isDebug) {

            if (typeof fn === "function") {
                console.warn(fn());
            } else {
                console.warn.apply(null, arguments);
            }

        }
    }

};
