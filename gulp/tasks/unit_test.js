var gulp = require('gulp'),
    util = require('gulp-util'),
    jshint = require('gulp-jshint'),
    karma = require('gulp-karma'),
    istanbul = require('gulp-istanbul'),
    notify = require('gulp-notify'),
    prompt = require('gulp-prompt'),
    watch = require('gulp-watch'),
    _ = require('lodash'),
    recursiveReaddir = require("recursive-readdir"),
    browserify = require("gulp-browserify"),
    watchify = require("watchify"),
    Client = require('./client'),
    Args = require('../util/args'),
    glob = require("glob"),
    requireDir = require("requireDir"),
    remoteBrowsers = requireDir("../../config/karma/browsers/remote/"),
    karmaDir = requireDir("../../config/karma/browsers/");


/**
 * Unit tester
 * @param args {object} Command line arguments
 * @constructor
 */
var UnitTest = function(args, client){
    _.extend(this, args);
    this.client = client;
    this.in = this.in || "./client";
};

/**
 * Hint Javascript files
 */
UnitTest.prototype.hint = function(){
    return gulp.src(this.in + "/**/*.js")
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
};

/**
 * Run unit tests through Karma
 * @returns {*}
 */
UnitTest.prototype.unit_test = function(){
    if(!this.files){
        this.files = glob.sync("./client/**/*.test.js");
    }

    var browsers,
        customLaunchers = {};

    if(!this.browsers || this.browsers === true){
        browsers = ["PhantomJS"];
    } else if(this.browsers === 'remote'){
        _.forIn(remoteBrowsers, function(mod){
            var cl = mod && mod.customLaunchers;
            customLaunchers = _.extend(customLaunchers, cl);
        }, this);
        browsers = _.keys(customLaunchers);
    } else if(this.browsers.indexOf("remote")===0) {
        var modName = this.browsers.replace("remote/", "");
        customLaunchers = remoteBrowsers[modName].customLaunchers;
        browsers = _.keys(customLaunchers);
    } else {
        browsers = karmaDir[this.browsers];
    }

    (new Client(this)).compile(this.files, '.cache/test', 'test.js')
        .pipe(karma({
            frameworks: ["jasmine"],
            configFile: "config/karma/karma.conf",
            action: this.watch ? 'watch' : 'run',
            customLaunchers: customLaunchers,
            browsers: browsers
        }));
};

gulp.task("unit_test", function(){
    var args = new Args(util.env);
    var client = new Client(args);
    var unit_test = new UnitTest(args, client);
    unit_test.unit_test();
});

gulp.task("jshint", function(){
    var args = new Args(util.env);
    var unit_test = new UnitTest(args);
    unit_test.hint();
});

module.exports = UnitTest;
