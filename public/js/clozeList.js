var init = function () {
};

/**
 * Controller used when displaying results of a cloze question.
 */
angular.module('clozeresult', []).
    config(function ($routeProvider) {
        $routeProvider.
            when('/', {controller: ClozeListCtrl, templateUrl: '/partials/clozeResults.html'}).
            otherwise({redirectTo: '/'});
    });

function ClozeListCtrl($scope, $http) {
    $scope.qid = $('#qid').attr('name');
    $http.get('/results/cloze/' + $scope.qid).
        success(function (data, status, headers, config) {
            $scope.answers = data.answers;
        });
}

