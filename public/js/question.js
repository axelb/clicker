var init = function () {
    };//Hook method for initilization code

angular.module('question', ['ngCookies']).
    config(function ($routeProvider, $httpProvider) {
        var questionTypes,
            questionType;
        questionTypes = window.questionTypes();
        // take all types from config
        for (questionType in questionTypes) {
            $routeProvider.when(window.NEW_URL_PREFIX + questionTypes[questionType].name, {controller: QuestionCtrl, templateUrl: 'partials/' + questionTypes[questionType].template});
            $routeProvider.when('/edit/' + questionTypes[questionType].name + '/:id', {controller: QuestionCtrl, templateUrl: 'partials/' + questionTypes[questionType].template});
        }
        $routeProvider.
            when('/', {controller: StartCtrl, templateUrl: 'partials/start.html'}).
            when('/list', {controller: ListCtrl, templateUrl: 'partials/list.html'}).
            // result pages
            when('/result/SC/:id', {controller: SCMCController, templateUrl: 'partials/scmcResults.html'}).
            when('/result/MC/:id', {controller: SCMCController, templateUrl: 'partials/scmcResults.html'}).
            when('/result/Cloze/:id', {controller: ClozeListCtrl, templateUrl: 'partials/clozeResults.html'}).
            when('/result/Point/:id', {controller: PointCtrl, templateUrl: 'partials/pointresults.html'}).
            otherwise({redirectTo: '/'});
    });

function StartCtrl($scope, $http, $window) {
    /* Forward to login page when not logged in
     */
    $http.get('/loggedInCheck').
        success(function (data, status) {
            if(!data.status) {
                $window.location.href = '/login.html';
            }
        });
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
                if(!(data instanceof Array)) {
                    $scope.questions = [];
                    return;
                }
                $scope.status = status;
                $scope.questions = data;
            }).
            error(function (data, status) {
                Notifier.error('An error occured (status ' + status + ')');
                $scope.status = status;
                $scope.questions = [];
            });
    };

    /**
     * The shortened version of (marked down text) is only the first line.
     * @param text Text to shorten.
     * @return {*} First line of text, or complete text if it is only one line long.
     */
    $scope.shorten = function (text) {
        if(!text) {
            return '';
        }
        if (text.indexOf('\n') === -1) {
            return text;
        }
        return text.split('\n', 1)[0];
    };

    /**
     * Helper function to determine the type of a given question.
     * @param question the question in question :-)
     * @return its type according to those defined in config.js
     */
    $scope.getQuestionType = function (question) {
        return question.type;
    };
}

/**
 * Controller for creation and editing SC and MC questions.
 * @param $scope
 * @param $http
 * @param $location
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
            question: '',
            type: 'none',
            alternatives: [
                {title: ''}
            ],
            imageId: ''
        };
        emptyQuestion.type = $location.url().substr(window.NEW_URL_PREFIX.length);//transported to here via config and URL.
        if ($routeParams.id) {
            $http({method: 'GET', url: '/question/json/' + $routeParams.id}).
                success(function (data, status, headers, config) {
                    $scope.question = data;
                    //set an image if one was attached.
                    if ($scope.question.imageId) {
                        document.getElementById('attachedImage').src = ("/image/" + $scope.question.imageId);
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
            $timeout(function () {
                var a = $('[id^=alternative]'),
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
        var img = document.getElementById('attachedImage'),
            reader = new FileReader();
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
        var formData = new FormData(),
            xhr = new XMLHttpRequest(),
            questionId = isExistingQuestion() ? $scope.question._id : "", // we add an empty string if nonexisting question
            httpMethod = isExistingQuestion() ? "PUT" : "POST";
        if ($scope.question.alternatives.length === 1) { //assumption: is Cloze
            delete $scope.question.alternatives;
        }
        if ($scope.imageFileToAttach) {
            formData.append("uploadedImage", $scope.imageFileToAttach);
        }
        formData.append("question", JSON.stringify($scope.question));
        xhr.addEventListener("load", function (event) {
            var id;
            if(event.target.status !== 200) {
                Notifier.error(event.target.statusText + '(' + event.target.status + ')');
                $window.location.href = '/login.html';
                return;
            }
            id = JSON.parse(event.target.response).id;
            Notifier.success($scope.question.question, "Uploaded question");
            $window.location.href = '#/list/';
        });
        xhr.addEventListener("error", function (event) {
            //TODO wie kommt man hierher?
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
    isExistingQuestion = function () {
        return $scope.question.id ? true : false;
    };
}

/**
 * Controller for displaying point-and-click-question results.
 * @param $scope
 * @param $http
 * @constructor
 */
function PointCtrl($scope, $http, $location) {
    var url = $location.url().split('/');
    $scope.qid = url[url.length - 1];
    $scope.pointsize = 20;//size of red point
    // get the image
    $http.get('/question/json/' + $scope.qid).
        success(function (question, status) {
            $scope.imageId = question.imageId;
        });
    $http.get('/results/Point/' + $scope.qid).
        success(function (data, status, headers, config) {
            $scope.coordinates = data.answers;
        });
    /**
     * Get correct y coordinate to position the red point.
     */
    $scope.getY = function (coord) {
        return coord.y - $scope.pointsize / 2;
    };
    /**
     * Get correct x coordinate to position the red point.
     */
    $scope.getX = function (coord) {
        return coord.x - $scope.pointsize / 2;
    };
}

/**
 * Controller used when displaying results of a cloze question.
 */
function ClozeListCtrl($scope, $http, $location) {
    var url = $location.url().split('/');
    $scope.qid = url[url.length - 1];
    $http.get('/results/cloze/' + $scope.qid).
        success(function (data, status, headers, config) {
            $scope.answers = data.answers;
        });

    // Handler for clicks in table to display completed text.
    $scope.handleTableClick = function(answer) {
        $('#completedCodeOverlay').modal({keyboard: true});
        $http.get('/question/json/' + $scope.qid).
            success(function (question, status) {
                var text,
                    converter = new Showdown.converter();
                $scope.questionhtml = question.question;
                for(text in answer[0]) {
                    $scope.questionhtml = $scope.questionhtml.replace(window.TEXTFIELD_INDICATOR, '<span class="insertedText">' + answer[0][text] + '</span>');
                }
                $scope.questionhtml = converter.makeHtml($scope.questionhtml);
            });
    };
}

/**
 * Controller class for result display of SC and MC questions.
 * @constructor
 */
function SCMCController($scope, $http, $location) {
    var url = $location.url().split('/');
    $scope.qid = url[url.length - 1];

    $http.get('/question/json/' + $scope.qid).
        success(function (question, status) {
            var converter = new Showdown.converter();
            $scope.questionhtml = converter.makeHtml(question.question);
            $scope.drawVisualization($scope.qid, question);
        });

    $scope.drawVisualization = function (id, question) {
        $.ajax('/results/mc/' + id).done(function (data) {
            if (data.length === 0) {
                $('#result').html("<h2>Vote not open!</h2>");
                return;
            }
            jQuery('#graph').tufteBar({
                data: data,
                barWidth: 0.5,

                axisLabel: function (index) {
                    return "";
                },

                color: function (index) {
                    return ['#0040D5', '#C82000', '#49BE00', '#8200B9', '#00C687'][index % 5];
                },

                legend: {
                    data: question.alternatives,
                    label: function (index) {
                        return question.alternatives[index].title;
                    },
                    color: function (index) {
                        return ['#0040D5', '#C82000', '#49BE00', '#8200B9', '#00C687'][index % 5];
                    }
                }

            });
        });
    };

}