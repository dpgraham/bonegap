/**
 * List the files that we want to be part of the template
 */
module.exports = [
    "assets/**/*.*", // All of the assets
    "client/**/config.js", // Any file called 'config.js'
    "*.*", // Anything in the top level
    "gulp/**/*.js", // All of the gulp tasks
    "config/**/*.*", // Anything in the config folder
    "lib/**/*.*" // Anything in the lib folder
];