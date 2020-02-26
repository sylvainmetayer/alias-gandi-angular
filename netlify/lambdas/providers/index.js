const regex = /[a-z]*/i;
const fs = require("fs");

module.exports = {
  exists: function (provider) {
    if (provider == undefined) {
      return false;
    }
    if (!provider.match(regex)) {
      return false;
    }
    return fs.existsSync(`${__dirname}/${provider}/index.js`);
  },
  load: function (provider) {
    return require(`${__dirname}/${provider}/index.js`);
  }
};
