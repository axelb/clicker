/**
 * Mocha based test to test the @@ replacement in cloze questions.
 */
'use strict';

var assert = require('assert'),
    log4js = require('log4js'),
    question = require('./question'),
    testString1 = "> for(int i = 0; i <= 100; i++) {\n> \n> @@\n> \n> }",
    testString2 = " @@ @@",
    logger = log4js.getLogger('server');


describe('Test the @@-replacement in cloze question strings', function () {
    logger.setLevel('OFF');
    it('should get a single @@ straight', function () {
        assert.equal("<blockquote>\n  <p>for(int i = 0; i &lt;= 100; i++) {</p>\n  \n  <p><input class='clozetext' id='text0' type='text'></input></p>\n  \n  <p>}</p>\n</blockquote>", question.mangleTextfield(testString1));
    });

    it('should get double @@ straight', function () {
        assert.equal("<p><input class='clozetext' id='text0' type='text'></input> <input class='clozetext' id='text1' type='text'></input></p>", question.mangleTextfield(testString2));
    });

});