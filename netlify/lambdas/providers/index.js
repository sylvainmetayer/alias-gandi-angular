"use strict";
var regex = /[a-z]*/i;
var fs = require("fs");
module.exports = {
    exists: function (provider) {
        if (provider == undefined) {
            return false;
        }
        if (!provider.match(regex)) {
            return false;
        }
        return fs.existsSync(__dirname + "/" + provider + "/index.js");
    },
    load: function (provider) {
        return require(__dirname + "/" + provider + "/index.js");
    }
};
//# sourceMappingURL=index.js.map