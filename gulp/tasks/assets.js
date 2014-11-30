var gulp = require('gulp'),
    util = require('gulp-util'),
    watch = require("gulp-watch"),
    rename = require("gulp-rename"),
    notify = require("gulp-notify"),
    handlebars = require("gulp-compile-handlebars"),
    less = require("gulp-less"),
    cssMinify = require("gulp-minify-css"),
    concat = require("gulp-concat");
    rimraf = require('rimraf'),
    _ = require("lodash"),
    glob = require("glob"),
    fs = require("fs"),
    path = require("path"),
    promise = require("promise"),
    client_properties = require("../../client.properties"),
    build_properties = require("../../build.properties"),
    Args = require('../util/args'),
    Source = require('../util/source'),
    server = require("../util/server");

/**
 * Class that runs asset rendering tasks
 * @param args {object} Command line arguments
 * @constructor
 */
var Assets = function(args, srcPath){

    // Extend the main class
    _.extend(this, args);

    this.basePath = srcPath + "assets";
    this.buildFolder = this.out + "/" + build_properties.buildFolder;

    // Start a server if 'watch' was specified
    if(this.watch){
        server.start(args);
    }
};

/**
 * Render/copy all of the assets (CSS, HTML, images)
 */
Assets.prototype.render_assets = function(){

    // Render the CSS assets, if there are any
    fs.exists(this.basePath + "/css", _.bind(function(){
        this.render_css_assets(this.basePath + "/css");
    }, this));

    // Render the HTML assets, if there are any
    fs.exists(this.basePath + "/html", _.bind(function(){
        this.render_html_assets(this.basePath + "/html");
    }, this));

    // Render the images, if there are any
    fs.exists(this.basePath + "/images", _.bind(function(){
        this.render_images(this.basePath + "/images");
    }, this));

};


/**
 * Renders the CSS assets using LESS preprocessor.
 * @param path_to_images {string} Path to CSS folder
 */
Assets.prototype.render_css_assets = function(path_to_css_dir){

    // Crawl through the css folder and render the assets to the dist folder
    var that = this;
    fs.readdir(path_to_css_dir, function(err, files){
        if(files){
            files.forEach(function(name){

                // Get a path to the file/directory we're currently in
                var curr_file_path = path_to_css_dir + "/" + name,
                    out_css_filename,
                    less_files_path;

                // If it's path to a directory, get all the files inside the directory and render them all as one
                if(fs.lstatSync(curr_file_path).isDirectory()) {
                    less_files_path = curr_file_path + "/**/*.*";
                    out_css_filename = that.prefix + name + ".css";
                }

                // If it's a file, render that one file
                else {
                    less_files_path = curr_file_path;
                    out_css_filename = that.prefix + (name.replace(path.extname(name), "")) + ".css";
                }

                // Render the CSS file
                that.render_css_file(less_files_path, out_css_filename);
            });
        }
    });
};

Assets.prototype.render_html_assets = function(path_to_html){
    var fn = _.bind(function(){
        var files = glob.sync(path_to_html + "/*.html");
        files.forEach(_.bind(function(file){
            gulp.src(file)
                .pipe(handlebars(client_properties))
                .pipe(rename(_.bind(function(name){
                    new_file_name = this.prefix + name.basename;
                    name.basename = new_file_name;
                }, this)))
                .pipe(gulp.dest(this.buildFolder))
        }, this));

    }, this);

    if(this.watch){
        watch({glob: path_to_html + "/*.html"}, fn);
    }
    fn();

};

/**
 * Copies over the images to distribution folder.
 * @param path_to_images
 */
Assets.prototype.render_images = function(path_to_images){
    gulp.src(path_to_images + "/**.*")
        .pipe(rename(_.bind(function(name){
            new_image_name = this.prefix + name.basename;
            name.basename = new_image_name;
        }, this)))
        .pipe( notify("Copied over HTML files"))
        .pipe( gulp.dest(this.buildFolder) );
};

/**
 * Render a css file from less file(s)
 * @param less_files_path {string} Path to less file(s)
 * @param out_filename {string} Name of the file we're creating
 */
Assets.prototype.render_css_file = function(less_files_path, out_filename){

    // Function that renders the less files
    var fn = _.bind(function(){

        // Do the less compilations
        var stream = gulp.src(less_files_path)
            /*.pipe(less({
                paths: [path.join(__dirname, 'less', 'includes', 'css')]
            }));*/

        // If it's prod, minify it
        if(this.prod)
            stream.pipe(cssMinify());

        // Concatenate it and build it to the outfile
        return stream.pipe(concat(out_filename))
            .pipe(notify("Rendered: " + out_filename))
            .pipe(gulp.dest(this.buildFolder));

    }, this);

    // If it's on a watcher, watch for changes and render the changes
    if(this.watch){
        watch({glob: less_files_path}, fn);
    }

    // Do the rendering immediately
    return fn();
};

// Render all of the assets
gulp.task('assets', function(){
    rimraf.sync("./dist");
    var args = new Args(util.env);
    var src = new Source(args);
    var assets = new Assets(args, src.srcPath);
    assets.render_assets();
});

module.exports = Assets;
