'use strict';

/**
 * Generic function to add events to objects. (see http://ichwill.net)
 */
/*eslint no-unused-vars: ["error", { "varsIgnorePattern": "addEvent" }]*/
function addEvent(obj, evType, fn) {
    if (obj.addEventListener) { 
        obj.addEventListener(evType, fn, false); 
        return true; 
    } else if (obj.attachEvent) { 
        var r = obj.attachEvent('on' + evType, fn); 
        return r;
    } else { 
        return false; 
    }
}
