var gulp = require("gulp"),
    util = require("gulp-util"),
    rimraf = require("rimraf"),
    client_properties = require("../../client.properties"),
    build_properties = require("../../build.properties"),
    Assets = require("./assets"),
    Client = require("./client"),
    Server = require("../util/server"),
    Args = require("../util/args"),
    Source = require("../util/source"),
    test_cases = require("./test_cases");


gulp.task("default", function(){
    var args = new Args(util.env),
        src = new Source(args),
        assets = new Assets(args, src.srcPath),
        client = new Client(args, src.srcPath);


    rimraf.sync("./dist");
    assets.render_assets();
    client.compile_projects();

    if(args.watch){
        Server.start(args);
    }
});
