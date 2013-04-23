/**
 * Mocha based test.
 */
var assert = require('assert'),
    question = require('./question'),
    testString = "> for(int i = 0; i <= 100; i++) {\n> \n> ##\n> \n> }",
    log4js = require('log4js'),
    logger = log4js.getLogger('server');


describe('Test the ##-replacement in cloze question strings', function () {
    logger.setLevel('OFF');
    it('should get a single ## straight', function () {
        assert.equal("> for(int i = 0; i <= 100; i++) {\n> \n> <input id='text1' type='text'></input>\n> \n> }", question.mangleTextfield(testString));
    });

});