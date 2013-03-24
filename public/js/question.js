var init = function () {
};//Hook method for initilization code

angular.module('question', ['ngCookies']).
    config(function ($routeProvider) {
        $routeProvider.
            when('/', {controller: StartCtrl, templateUrl: 'start.html'}).
            when('/new', {controller: QuestionCtrl, templateUrl: 'create.html'}).
            when('/edit/:id', {controller: QuestionCtrl, templateUrl: 'create.html'}).
            when('/list', {controller: ListCtrl, templateUrl: 'list.html'}).
            otherwise({redirectTo: '/'});
    });

function StartCtrl($scope) {

}

function ListCtrl($scope, $http, $location, $templateCache) {
    $scope.method = 'GET';
    $scope.listUrl = '/list';
    $scope.count = 0;

    $scope.fetch = function () {
        $scope.code = null;
        $scope.response = null;

        $http({method: $scope.method, url: $scope.listUrl, cache: $templateCache}).
            success(function (data, status) {
                $scope.status = status;
                $scope.questions = data;
            }).
            error(function (data, status) {
                alert('error');
                $scope.questions = data || "Request failed";
                $scope.status = status;
            });
    };

    /**
     * The shortened version of (marked down text) is only the first line.
     * @param text Text to shorten.
     * @return {*} First line of text, or complete text if it is only one line long.
     */
    $scope.shorten = function (text) {
        if (text.indexOf('\n') === -1) {
            return text;
        }
        return text.split('\n', 1)[0];
    };
}

function QuestionCtrl($scope, $http, $routeParams, $cookies, $window) {

    /**
     * Here we discriminate if a new question is to be created or an existing to be edited.
     * Depends on whether an id is provided as part of routeParams.
     */
    $scope.init = function () {
        var emptyQuestion = {
            question: "",
            alternatives: [
                {title: ""}
            ],
            imageId: ""
        };
        if ($routeParams.id) {
            $http({method: 'GET', url: '/question/json/' + $routeParams.id}).
                success(function (data, status, headers, config) {
                    $scope.question = data;
                }).
                error(function (data, status, headers, config) {
                    Notifier.error(data + ' (status ' + status + ')');
                });
        } else {
            $scope.question = emptyQuestion;
        }
    };

    $scope.addAlternative = function () {
        var lastContent = $scope.question.alternatives[$scope.question.alternatives.length - 1].title;
        if (lastContent && lastContent !== "") {// do not allow empty strings
            $scope.question.alternatives.push({title: ""});
        }
    };

    $scope.removeAlternative = function (alternative) {
        var index = getIndexOf(alternative);
        $scope.question.alternatives.splice(index, 1);
    };

    $scope.pushDownAlternative = function (alternative) {
        var index = getIndexOf(alternative);
        if (index === $scope.question.alternatives.length - 1) {
            return;
        }
        $scope.question.alternatives[index] = $scope.question.alternatives[index + 1];
        $scope.question.alternatives[index + 1] = alternative;
    };

    $scope.pullUpAlternative = function (alternative) {
        var index = getIndexOf(alternative);
        if (index === 0) {
            return;
        }
        $scope.question.alternatives[index] = $scope.question.alternatives[index - 1];
        $scope.question.alternatives[index - 1] = alternative;
    };

    $scope.setImage = function (element) {
        var auswahl_div = document.getElementById('attachedImage')
            , img = document.createElement('img')
            , reader = new FileReader();
        img.height = 110;
        img.file = $scope.imageFileToAttach;
        img.name = 'pic_';
        $scope.imageFileToAttach = element.files[0];//only one file!

        reader.onload = (function (aImg) {
            return function (e) {
                aImg.src = e.target.result;
            };
        })(img);
        reader.readAsDataURL($scope.imageFileToAttach);
        auswahl_div.appendChild(img);
    };

    /**
     * usable for create and update of question.
     */
    $scope.save = function () {
        var formData = new FormData()
            , xhr = new XMLHttpRequest()
            , questionId = $scope.question._id ? $scope.question._id : ""
            , httpMethod = $scope.question._id ? "PUT" : "POST";
        if ($scope.imageFileToAttach) {
            formData.append("uploadedImage", $scope.imageFileToAttach);
        }
        formData.append("question", JSON.stringify($scope.question));
        xhr.addEventListener("load", function (event) {
            var id = JSON.parse(event.target.response).id;
            Notifier.success($scope.question.question, "Uploaded question");
            $window.location.href = '#/edit/' + id;
        });
        xhr.open(httpMethod, "/question/" + questionId);
        xhr.send(formData);
    };

    getIndexOf = function (alternative) {
        return $scope.question.alternatives.indexOf(alternative);
    };
}

