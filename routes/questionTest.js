/**
 * Mocha based test.
 */
var assert = require('assert'),
    question = require('./question'),
    testString1 = "> for(int i = 0; i <= 100; i++) {\n> \n> ##\n> \n> }",
    testString2 = " ## ##";
    log4js = require('log4js'),
    logger = log4js.getLogger('server');


describe('Test the ##-replacement in cloze question strings', function () {
    logger.setLevel('OFF');
    it('should get a single ## straight', function () {
        assert.equal("> for(int i = 0; i <= 100; i++) {\n> \n> <input class='clozetext' id='text0' type='text'></input>\n> \n> }", question.mangleTextfield(testString1));
    });

    it('should get double ## straight', function () {
        assert.equal(" <input class='clozetext' id='text0' type='text'></input> <input class='clozetext' id='text1' type='text'></input>", question.mangleTextfield(testString2));
    });

});