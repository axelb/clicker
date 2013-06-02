/**
 * casper include to perform login before a test is executed.
 * @param username
 */
casper.login = function login(username, password) {
    var that = this;
    this.echo("Hey, I'm executed before the suite. " + username);
    this.start('http://localhost:8888/login.html', function() {
        that.fill('form#loginForm', {
            'username': username,
            'password': password
        }, true);
    });
};