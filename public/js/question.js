var init = function () {
};//Hook method for initilization code

angular.module('question', ['ngCookies']).
    config(function ($routeProvider) {
        $routeProvider.
            when('/', {controller: StartCtrl, templateUrl: 'partials/start.html'}).
            when('/new' + window.questionTypes().MC, {controller: QuestionCtrl, templateUrl: 'partials/createMC.html'}).
            when('/newCloze', {controller: QuestionCtrl, templateUrl: 'partials/createCloze.html'}).
            when('/edit/:id', {controller: QuestionCtrl, templateUrl: 'partials/createMC.html'}).
            when('/list', {controller: ListCtrl, templateUrl: 'partials/list.html'}).
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

    /**
     * Helper function to determine the type of a given question.
     * @param question the question in question :-)
     * @return 'mc' or 'cloze'
     */
    $scope.getQuestionType = function(question) {
        if(!question.alternatives || question.alternatives.length === 0) {
           return 'cloze';
        }
        return 'mc';
    };
}

/**
 * Controller for creation and editing an MC question.
 * @param $scope
 * @param $http
 * @param $routeParams
 * @param $window
 * @param $timeout
 * @constructor
 */
function QuestionCtrl($scope, $http, $location, $routeParams, $window, $timeout) {
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
        alert($location.url());
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
            // awful hack to set focus on the newly created alternative:
            $timeout(function() {
                var a =  $('[id^=alternative]'),
                    last = a.last();
                last.focus();
            }, 30);// this value is somewhat arbirary
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
        if($scope.question.alternatives.length === 1) { //assumption: is Cloze
            delete $scope.question.alternatives;
        }
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
     * @return {boolean} If question was loaded for editing, i.e. it existed previously.
     */
    isExistingQuestion = function() {
        return $scope.question.id ? true : false;
    };
}
