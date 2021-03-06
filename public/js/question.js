'use strict';

var init = function () {
    },//Hook method for initilization code

module = angular.module('question', ['questionService', 'ngCookies', 'ui.bootstrap', 'monospaced.qrcode']).
    config(function ($routeProvider, $httpProvider) {
        var questionTypes,
            questionType;
        questionTypes = window.questionTypes();
        // take all types from config
        for (questionType in questionTypes) {
            $routeProvider.when(window.NEW_URL_PREFIX + questionTypes[questionType].name, {controller: QuestionCtrl, templateUrl: 'partials/' + questionTypes[questionType].template});
            $routeProvider.when('/edit/' + questionTypes[questionType].name + '/:id', {controller: QuestionCtrl, templateUrl: 'partials/' + questionTypes[questionType].template});
            $routeProvider.when('/voteqr/' + questionTypes[questionType].name + '/:id', {controller: QRCodeCtrl, templateUrl: 'partials/questionqr.html'});
        }
        $routeProvider.
            when('/', {controller: ListCtrl, templateUrl: 'partials/list.html'}).
            when('/howto', {controller: StartCtrl, templateUrl: 'partials/howto.html'}).
            when('/logout', {controller: StartCtrl, templateUrl: 'partials/login.html'}).
            when('/list', {controller: ListCtrl, templateUrl: 'partials/list.html'}).
            // result pages
            when('/result/SC/:id', {controller: SCMCController, templateUrl: 'partials/scmcResults.html'}).
            when('/result/MC/:id', {controller: SCMCController, templateUrl: 'partials/scmcResults.html'}).
            when('/result/Cloze/:id', {controller: ClozeListCtrl, templateUrl: 'partials/clozeResults.html'}).
            when('/result/Point/:id', {controller: PointCtrl, templateUrl: 'partials/pointresults.html'}).
            otherwise({redirectTo: '/'});
    });

// I don't really like to do that via rootScope
module.factory('userService', function($http, $window, $rootScope) {
    var userServiceInstance = {
        currentUser: {},
        getCurrentUser: function() {
            return this.currentUser;
        },
        logout: function() {
            $http.get('/logout').
                success(function(data, status){
                    $window.location.href = '/login.html';
                });
        }
    };
    $http.get('/loggedInCheck').
        success(function (data, status) {
            if(data.status) {
                userServiceInstance.currentUser = data;
                $rootScope.currentUser = data;
            } else {
                /* Forward to login page when not logged in
                 */
                $window.location.href = '/login.html';
            }
        });
    return userServiceInstance;
});

/**
 * Directive providing the showclicks-Attribute so that click positions can be loaded
 * ater the underlying image has loaded and it's position can be determined.
 */
module.directive('showclicks', function() {
        return {
            link: function(scope, element, attrs) {
                      element.bind("load" , function(e) {
                          scope.loadClicks();
                  });
            }
        };
});

function StartCtrl($scope, $http, $window, userService) {
    $scope.logout = function() {
        userService.logout();
    };
}

function ListCtrl($scope, $http, $location, $templateCache, $window, Question) {
    $scope.questions = Question.query();

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
     * Open confirm dialog and store question id in scope.
     * @param id
     */
    $scope.confirmDeleteQuestion = function(id) {
        $scope.questionIdToDelete = id;
        $('#deleteConfirmDialog').modal({keyboard: true});
    };

    /**
     * Finish deletion process (called by an ok or by cancel seen in param really).
     * @param really Delete iff true. removed the stored id anyway.
     */
    $scope.finishDeleteQuestion = function(really) {
        if(really) {
            $http({method: 'GET', url: '/delete/' + $scope.questionIdToDelete}).
                success(function (data, status, headers, config) {
                    Notifier.success('Question deleted!');
                    $window.location.href = '/';
                }).
                error(function (data, status, headers, config) {
                    Notifier.error('could not delete question (status: ' + status + ')');
                });
        }
        $scope.questionIdToDelete = null;
    };

    /**
     * returns the title of the currently selected question (to show in alert box).
     * @returns title of selected question.
     */
    $scope.getTitleOfSelectedQuestion = function() {
        var index;
        for(index = 0; index < $scope.questions.length; index++) {
             if($scope.questions[index]._id == $scope.questionIdToDelete) {
                 return $scope.questions[index].question;
             }
        }
        return "";//this should not happen
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
            ]
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
        $scope.loadHelpTexts();
    };

    /**
     * Helper method to load help texts for popovers.
     */
    // TODO improve (is really ugly)
    $scope.loadHelpTexts = function() {
        var types = window.questionTypes();
        Object.keys(types).forEach(function(type) {
            $http({method: 'GET', url: '/help/' + type + 'Format.html'}).
                success(function(data) {
                    var expression  =  '$scope.' + type + 'FormatHelpText = data';
                    eval(expression);
                }).
                error(function(){eval('$scope.' + type + 'FormatHelpText = "Could not load help text!"');});

        });
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
            }, 30);// this value is somewhat arbitrary
        }
    };

    $scope.removeAlternative = function (alternative) {
        var index = $scope.getIndexOf(alternative);
        // the last one cannot be removed
        if($scope.question.alternatives.length == 1) {
            return;
        }
        $scope.question.alternatives.splice(index, 1);
    };

    $scope.pushDownAlternative = function (alternative) {
        var index = $scope.getIndexOf(alternative);
        if (index === $scope.question.alternatives.length - 1) {
            return;
        }
        $scope.question.alternatives[index] = $scope.question.alternatives[index + 1];
        $scope.question.alternatives[index + 1] = alternative;
    };

    $scope.pullUpAlternative = function (alternative) {
        var index = $scope.getIndexOf(alternative);
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
        var data,
            img,
            xhr = new XMLHttpRequest(),
            questionId = $scope.isExistingQuestion() ? $scope.question._id : "", // we add an empty string if nonexisting question
            httpMethod = $scope.isExistingQuestion() ? "PUT" : "POST";
        if ($scope.question.alternatives.length === 1) { //assumption: is Cloze
            delete $scope.question.alternatives;
        }
        if ($scope.imageFileToAttach) {
            img = document.getElementById('attachedImage');
            $scope.question.attachedImage = img.src.substring("data:image/png;base64,".length);
            $scope.question.imageId = null; // new image - must be saved
        }
        data = JSON.stringify($scope.question);
        xhr.addEventListener("load", function (event) {
            var id;
            if(event.target.status !== 200) {
                Notifier.error(event.target.statusText + '(' + event.target.status + ')');
                return;
            }
            id = JSON.parse(event.target.response).id;
            Notifier.success($scope.question.question, "Uploaded question");
            $window.location.href = '#/list/';
        });
        xhr.addEventListener("error", function (event) {
            //TODO wie kommt man hierher?
            Notifier.error(event.target.statusText + '(' + event.target.status + ')');
        });
        xhr.open(httpMethod, "/question/" + questionId);
        xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
        xhr.send(data);
    };

    $scope.getIndexOf = function (alternative) {
        return $scope.question.alternatives.indexOf(alternative);
    };

    /**
     * Helper function to determine if we are editing an existing or a new question.
     * @return {boolean} If question was loaded for editing, i.e. it existed previously.
     */
    $scope.isExistingQuestion = function () {
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
    /**
     * Two methods to get correct x- and y- coordinate to position the red point.
     * Also calculates absolute coordinates from the relative ones.
     */
    $scope.getX = function (coord) {
        var image = $('#clickImage')[0];
        return (coord.x * image.width) - $scope.pointsize / 2;
    };
    $scope.getY = function (coord) {
        var image = $('#clickImage')[0];
        return (coord.y * image.height) - $scope.pointsize / 2;
    };
    /**
     * This is a callback function to load the click positions. Since relative positions are recorded
     * the points must be loaded after the underlying image has loaded and it's size is known.
     * Was designed to work together with the showclicks directive.
     */
    $scope.loadClicks = function() {
        $scope.$apply(function() { // not sure why this is needed
            $http.get('/results/Point/' + $scope.qid).
                error(function(error){
                    Notifier.error(error);
                }).
                success(function (data, status, headers, config) {
                    $scope.coordinates = data.answers;
                });
        });
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
                $scope.questionhtml = converter.makeHtml(question.question);
                for(text in answer) {
                    $scope.questionhtml = $scope.questionhtml.replace(window.TEXTFIELD_INDICATOR, '<span class="insertedText" id="theAnswer">' + answer[text] + '</span>');
                }
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

    $http.get('/question/json/' + $scope.qid).success(function (question, status) {
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
            var labels = question.alternatives.map(function(alt) {
                return alt.title;
            });
            var total = 0;
            data = data.map(function(elem) {
                total += elem[0];
                return elem[0];
            });
            var ctx = document.getElementById("graph");
            var graph = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'total: ' + total,
                        data: data,
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)'
                        ],
                        borderColor: [
                            'rgba(255,99,132,1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    }
                }
            });
        });

    }
}

function QRCodeCtrl($scope, $http, $location, $window, $routeParams) {
    $scope.QRCodeSize = "800";
    $scope.path = $location.path();
    // Open a  vote for the question. Path is identical to angular rout without hash (#)
    $http.get($scope.path).
        success(function (data, status, headers, config) {
            Notifier.success("Vote opened");
        }).
        error(function (data, status, headers, config) {
            Notifier.error('could not open vote (status: ' + status + ')');
        });

    /**
     * Helper to request question id from route
     * Todo: replace baseUrl with some kind of environment-variable
     */
    $scope.getVoteUrl = function() {
        //return "http://" + $location.host() + ":" + $location.port() + "/q/" + $routeParams.id;
        return "http://onlineresponse.org/q/" + $routeParams.id;
    };

    /**
     * Show results in a new tab to avoid problems with browser back button.
     */
    $scope.showResult = function() {
        var resultPath = "/#" + $scope.path.replace(/voteqr/, "result");
        $window.open(resultPath);
    }

}
