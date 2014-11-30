var _ = require("lodash"),
    promise = require("promise"),
    client_properties = require("../../client.properties"),
    build_properties = require("../../build.properties");

var CACHE_DIR = "./.cache/";

/**
 * Super class for other gulp classes
 * @param env {object} Command line arguments
 * @constructor
 */
var Args = function(env){

    // Add the command line arguments provided as variables in this class
    _.extend(this, {
        files: env.files || env.file || env.f, // TODO: I don't think we need this
        in: env.in || env.i, // Path of the input
        out: env.out || env.o || "./dist", // Path of the output
        watch: env.watch || env.w || env.reload || env.r, // Rebuild when code changes?
        reload: env.reload || env.r, // Automatically reload the browser on changes
        prod: env.prod || env.p, // Minify the CSS/HTML/JS ?
        prefix: env.pre || client_properties.filename_prefix, // Prefix of all output files
        template: env.template, // Are we building from a template
        remote: env.remote, // Are we building from a remote codebase/template?
        tag: env.tag,
        browsers: env.browsers || env.b
    });
};


module.exports = Args;
