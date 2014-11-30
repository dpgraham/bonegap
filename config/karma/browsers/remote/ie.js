module.exports = {

    // define browsers
    customLaunchers: {
        ie8: {
            base: 'BrowserStack',
            browser: 'ie',
            browser_version: '8',
            os: 'Windows',
            os_version: 'XP'
        },
        ie9: {
            base: 'BrowserStack',
            browser: 'ie',
            browser_version: '9',
            os: 'Windows',
            os_version: '7'
        },
        ie10: {
            base: 'BrowserStack',
            browser: 'ie',
            browser_version: '10',
            os: 'Windows',
            os_version: '8'
        },
        ie11: {
            base: 'BrowserStack',
            browser: 'ie',
            browser_version: '11',
            os: 'Windows',
            os_version: '8.1'
        }
    }
}