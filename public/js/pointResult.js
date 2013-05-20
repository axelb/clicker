var init = function () {
};

/**
 * Controller used when displaying results of a point question.
 */
angular.module('pointresult', []).
    config(function ($routeProvider) {
        $routeProvider.
            when('/', {controller: PointCtrl, templateUrl: '/partials/pointResults.html'}).
            otherwise({redirectTo: '/'});
    });

function PointCtrl($scope, $http) {
    $scope.pointsize = 20;//size of red point
    $scope.qid = $('#qid').attr('name');
    // get the image
    $http.get('/question/json/' + $scope.qid).
        success(function(question, status) {
            $scope.imageId = question.imageId;
        });
    $http.get('/results/Point/' + $scope.qid).
        success(function (data, status, headers, config) {
            $scope.coordinates = data.answers;
        });
    /**
     * Get correct y coordinate to position the red point.
     */
    $scope.getY = function(coord) {
        return coord.y - $scope.pointsize / 2;
    };
    /**
     * Get correct x coordinate to position the red point.
     */
    $scope.getX = function(coord) {
        return coord.x - $scope.pointsize / 2;
    };
}

