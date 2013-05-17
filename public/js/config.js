/**
 * Contains global configuration variables that can be used on client and on server.
 */

var root = (typeof(exports) === "undefined") ? window : exports;

/**
 * Here all types of questions are defined. The identifiers will be stored in the mongoDB.
 * @return {{MC: string, SC: string, CLOZE: string, POINT: string}}
 */
root.questionTypes = function() {
    var types = {
        MC: 'Mc',
        SC: 'sc',
        CLOZE: 'Cloze',
        POINT: 'point'
    };
    return types;
};
