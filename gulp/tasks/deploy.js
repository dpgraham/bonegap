var Deploy = {};

/**
 * Copy over the assets, build all the client projects
 */
Deploy.debug = function(prod){

};

module.exports = Deploy;

/**

test_local_debug :      build
test_local_prod :       build --prod
test_tag_debug :        build --remote <vcs_path>/<tag>
test_tag_prod :         build --prod --remote <vcs_path>/<tag>

 */
