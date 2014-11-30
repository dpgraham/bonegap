var _ = require("lodash"),
    promise = require("promise"),
    client_properties = require("../../client.properties"),
    build_properties = require("../../build.properties");

var CACHE_DIR = "./.cache/";

var Source = function(args){
    _.extend(this, args);
    this.srcPath = "./";
};

module.exports = Source;
