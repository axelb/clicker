'use strict';

/**
 *  Angular Services
 */

angular.module('questionService', ['ngResource']).
    factory('Question', function($resource) {
  return $resource('/list', {}, {
    query: {method:'GET', isArray: true}
  });
});