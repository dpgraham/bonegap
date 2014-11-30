var gulp = require('gulp'),
    util = require('gulp-util'),
    rename = require('gulp-rename'),
    notify = require('gulp-notify'),
    uglify = require('gulp-uglify'),
    jshint = require('gulp-jshint'),
    watchify = require('watchify'),
    browserify = require('browserify'),
    coverify = require('coverify'),
    browserifyHandlebars = require('browserify-handlebars'),
    workerify = require('workerify'),
    stringify = require('stringify'),
    minifyify = require('minifyify'),
    rimraf = require("rimraf"),
    _ = require("lodash"),
    server = require("../util/server"),
    Args = require("../util/args"),
    Source = require("../util/source"),
    build_properties = require("../../build.properties"),
    fs = require('fs'),
    source = require('vinyl-source-stream'),
    path = require('path');


/**
 * Class that runs Javascript creation tasks
 * @param args {object} Command line arguments
 * @constructor
 */
var Client = function(args, srcPath){

    // Make the parameters into class values
    _.extend(this, args);
    this.basePath = srcPath + "client";
    this.buildFolder = this.out + "/" + build_properties.buildFolder;

    // Start a server if 'watch' was specified
    console.log(this.watch);
    if(this.watch){
        console.log('starting the server');
        server.start(args);
    }

};

/**
 * Build a project using Browserify
 * @param fileIn {string|array} Path to entry point javascript(s)
 * @param quiet {boolean} Show logging?
 * @returns {Function}
 */
Client.prototype.compile = function(fileIn, dirOut, fileName, build){

    // Coerce fileIn as an array
    if(!fileIn.length){
        fileIn = [fileIn];
    }

    // Set the browserify/watchify bundler
    var bundler = (this.watch ? watchify : browserify)({
        entries: fileIn,
        transform: [browserifyHandlebars, workerify],
        debug: true
    });

    // Bundler function
    var doBundle = _.bind(function(){
        var new_filename = fileName;
        var bundle_pipe = bundler.bundle()
            .pipe(source("bundle.js"))
            .pipe(rename("/" + new_filename))
            .pipe(jshint())
            .pipe(notify("Done compiling " + fileName));

        if(dirOut)
            bundle_pipe.pipe(gulp.dest(dirOut));

        return bundle_pipe;

    }, this);


    // If we're watching, re-bundle everytime the source is updated
    if(this.watch){
        bundler.on('update', doBundle);
    }

    // Do a bundle
    return doBundle();

};

/**
 * Compile all projects in the client folder
 */
Client.prototype.compile_projects = function(){
    // Do a recursive search through the input directory
    var that = this;
    fs.readdir(that.basePath, function(err, files){
        files.forEach(function(path){

            // Get the name of this project, the path to the entry point and the folder to build to
            var project_name = path,
                path_to_entry_js = that.basePath + "/" + project_name + "/" + project_name + ".js",
                build_folder = that.out + "/" + build_properties.buildFolder;

            // Don't build it if it's in the exclude list
            if(_.indexOf(build_properties.exclude, project_name) >= 0){
                return;
            }

            // Don't build if the folder starts with a decimal
            if(project_name.indexOf(".") === 0){
                return;
            }

            // Build the modern build
            that.compile(path_to_entry_js, build_folder, that.prefix + project_name + ".js");
        });
    });
};

// Build tasks
gulp.task('client', function(){
    rimraf.sync('./dist');
    var args = new Args(util.env);
    var src = new Source(args);
    var client = new Client(args, src.srcPath);
    client.compile_projects();
});

module.exports = Client;
