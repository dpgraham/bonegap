module.exports = function(config){
    config.set({
        frameworks: ['jasmine', 'browserify'],

        // global config of your BrowserStack account
        browserStack: {
            username: 'foresee.account',
            accessKey: 'CPX3XrGW2r3974P6OoW4'
        }
    });
};
