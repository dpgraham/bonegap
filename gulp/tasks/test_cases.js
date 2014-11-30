var gulp = require("gulp"),
    util = require("gulp-util"),
    fs = require("fs"),
    client_properties = require("../../client.properties"),
    Assets = require("./assets"),
    Client = require("./client"),
    Args = require("../util/args"),
    server = require("../util/server"),
    glob = require('glob'),
    Path = require('path');


var TestCase = function(args, srcPath){
    // Extend the main class
    _.extend(this, args);

    this.basePath = srcPath + "test_cases";
    this.buildFolder = this.out + "/" + build_properties.buildFolder;
    this.client = new Client(args, srcPath);
    this.assets = new Assets(args, srcPath);

    // Start a server if 'watch' was specified
    if(this.watch){
        server.start(args);
    }
};

TestCase.prototype.test_cases = function(){
    var dirIn = this.basePath,
        that = this;

    glob(this.basePath + "/**/*.*", function(err, files){
        files.forEach(function(path){
            var dirPath = Path.dirname(path),
                baseName = Path.basename(path),
                extName = Path.extname(path);

            if(extName==='.js')
                that.client.compile(path, "./dist/" + dirPath, baseName);
            else
                gulp.src(path).pipe(gulp.dest("./dist/" + dirPath, baseName));
        });
    });
};

gulp.task("test_cases", function(){
    var args = new Args(util.env),
        src = new Source(args),
        test_cases = new TestCase(args, src.srcPath);

    return test_cases.test_cases();
});

module.exports = TestCase;
