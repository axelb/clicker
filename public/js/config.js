/**
 * Contains global configuration variables that can be used on client and on server.
 */

var root = exports ? exports : window;

/**
 * Here all types of questions are defined. The identifiers will be stored in the mongoDB.
 * @return {{MC: string, SC: string, CLOZE: string, POINT: string}}
 */
root.questionTypes = function() {
    var types = {
        MC: 'mc',
        SC: 'sc',
        CLOZE: 'cloze',
        POINT: 'point'
    };
    return types;
};
