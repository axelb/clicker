/**
 * Contains global configuration variables that can be used on client and on server.
 */

'use strict';

var root = (typeof(exports) === 'undefined') ? window : exports;

/**
 * Here all types of questions are defined (described). The identifiers will be stored in the mongoDB.
 * A type contains a name, a description and the name of the HTML template (partial) used
 * to create/edit questions of this type.
 * @return {{MC: {name: string, description: string}, SC: {name: string, description: string}, CLOZE: {name: string, description: string}, POINT: {name: string, description: string}}}
 */
root.questionTypes = function() {
    var types = {
        SC: {name: 'SC', description: 'Single Choice', template: 'scmcCreate.html'},
        MC: {name: 'MC', description: 'Multiple Choice', template: 'scmcCreate.html'},
        Cloze: {name: 'Cloze', description: 'Cloze (Freetext)', template: 'clozeCreate.html'},
        Point: {name: 'Point', description: 'Point and Click', template: 'pointCreate.html'}
    };
    return types;
};

root.NEW_URL_PREFIX = '/new';

root.TEXTFIELD_INDICATOR = '@@';
