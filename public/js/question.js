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
     * Here we discriminate on initialization if a new question is to be created or an existing to be edited.
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
                    //set an image if one was attached.
                    if($scope.question.imageId) {
                        document.getElementById('attachedImage').src=("/image/" + $scope.question.imageId);
                    }
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

    /**
     * To be called to set an attached image via a fileinput control.
     * @param element an "input type='file'"-Element carrying a list of attached files.
     * We only use the first of these anyhow.
     */
    $scope.setAttachedImage = function (element) {
        var img = document.getElementById('attachedImage')
            , reader = new FileReader();
        $scope.imageFileToAttach = element.files[0];//only one image file!
        reader.onload = (function (aImg) {
            return function (e) {
                aImg.src = e.target.result;
            };
        })(img);
        reader.readAsDataURL($scope.imageFileToAttach);
    };

    /**
     * Save a question to the server.
     * Usable after creation of a new and when updating an existing question.
     */
    $scope.save = function () {
        var formData = new FormData()
            , xhr = new XMLHttpRequest()
            , questionId = isExistingQuestion() ? $scope.question._id : "" // we add an empty string if nonexisting question
            , httpMethod = isExistingQuestion() ? "PUT" : "POST";
        if ($scope.imageFileToAttach) {
            formData.append("uploadedImage", $scope.imageFileToAttach);
        }
        formData.append("question", JSON.stringify($scope.question));
        xhr.addEventListener("load", function (event) {
            var id = JSON.parse(event.target.response).id;
            Notifier.success($scope.question.question, "Uploaded question");
            $window.location.href = '#/list/';
        });
        xhr.open(httpMethod, "/question/" + questionId);
        xhr.send(formData);
    };

    getIndexOf = function (alternative) {
        return $scope.question.alternatives.indexOf(alternative);
    };

    /**
     * Helper function to determine if we are editing an existing or a new question.
     * @return {boolean} If question was loaded fo rediting, i.e. it existed previously.
     */
    isExistingQuestion = function() {
        return $scope.question.id ? true : false;
    };
}

