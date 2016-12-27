/**
 * casper include to perform login before a test is executed.
 * @param username Username to use for login (must exist in db)
 * @param password Password to use for login (must exist in db)
 */
casper.login = function login(username, password) {
    casper.start('http://localhost:8888/login.html', function() {
        casper.fill('form#loginForm', {
            'username': username,
            'password': password
        }, true);
    });
};