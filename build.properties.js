var clientProperties = require("./client.properties");

module.exports = {

    global: "FSR",

    // Don't build these files as standalone JS assets
    exclude: [
        'common',
        'environment',
        clientProperties.enable_cxReplay && 'trigger_cxrecord'
    ],

    // Name of the folder to build assets to
    buildFolder: 'bonegap',

    local_server: {
        port: 8888
    },

    flo_server: {
        port: 6135
    },
};
