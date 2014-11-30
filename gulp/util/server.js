var gulp = require('gulp'),
    util = require('gulp-util'),
    express = require('express'),
    app = express(),
    errorHandler = require('errorhandler'),
    methodOverride = require('method-override'),
    buildProperties = require('../../build.properties'),
    port = parseInt(process.env.PORT, 10) || 4567;
    http = require('http'),
    path = require('path'),
    logger = require('logger'),
    liveServer = require('live-server'),
    beefy = require('beefy');

var Server = function(){

};

/**
 * Start a static server at the project root
 * @param reload {boolean} Do we want a server that automatically reloads the browser?
 */
Server.prototype.start = function(args){

    var reload = args.reload,
        port = buildProperties.local_server.port,
        root = "./dist";

    // Don't do anything if it was already started
    if(this.started){
        return;
    }

    // Reload code here
    if(true /*reload*/) {
        console.log("Starting reload server at " + port);
        liveServer.start(port, root, true);
    } else {

        // Start a static express app that points at the dist folder
        var app = express();

        var publicDir = path.join(__dirname, root);

        app.configure(function() {
            app.set('port', port);
            app.use(express.logger('dev'));
            app.use(express.bodyParser()); //parses json, multi-part (file), url-encoded
            app.use(app.router); //need to be explicit, (automatically adds it if you forget)
            app.use(express.static(publicDir)); //should cache static assets
        });

        var server = http.createServer(app);

        server.listen(app.get('port'), function(){
            console.log("Web server listening on port " + app.get('port'));
        });
    }

    // Mark that this was started
    this.started = true;
};

// Export the server as a singleton
module.exports = new Server();