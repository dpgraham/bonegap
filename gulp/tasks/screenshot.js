var SaucelabsConfig = require("../../config/saucelabs/all_browsers.js");

var Screenshot = {};

Screenshot.screenshots = function(config){
    browser = config || SaucelabsConfig;
};

module.exports = Screenshot;
