angular.module('vote', []).
  config(function($routeProvider) {
    $routeProvider.
    when('/', {controller: StartCtrl, templateUrl: 'start.html'}).
    //when('/edit/:projectId', {controller:EditCtrl, templateUrl:'detail.html'}).
    when('/new', {controller: VoteCtrl, templateUrl: 'create.html'}).
    otherwise({redirectTo:'/'});
});

function StartCtrl($scope) {

}
 
function VoteCtrl($scope, $http) {
  $scope.question = {
    //title: "How much wood would a woodchuck chuck?",
    //alternatives: [{title: "One"}, {title: "Two"}, {title: "Three"}]
    title: "",
    alternatives: [{title: ""}]
  };

  $scope.save = function() {
    $http.put('/vote', $scope.question).success(function(){alert("SUCCESS")}).
          error(function(data, status, headers, config) {
            alert(data + " " + status);
          });
  }

  $scope.addAlternative = function() {
    var lastContent = $scope.question.alternatives[$scope.question.alternatives.length - 1].title;
    if(lastContent && lastContent !== "") {// do not allow empty strings
       $scope.question.alternatives.push({title: ""});
    }
  };

  $scope.removeAlternative = function(alternative) {
    var index = getIndexOf(alternative);
    $scope.question.alternatives.splice(index, 1);
  };

  $scope.pushDownAlternative = function(alternative) {
    var index = getIndexOf(alternative);
    if(index === $scope.question.alternatives.length - 1) {
      return;
    }
    $scope.question.alternatives[index] = $scope.question.alternatives[index + 1];
    $scope.question.alternatives[index + 1] = alternative;
  };

  $scope.pullUpAlternative = function(alternative) {
    var index = getIndexOf(alternative);
    if(index === 0) {
      return;
    }
    $scope.question.alternatives[index] = $scope.question.alternatives[index - 1];
    $scope.question.alternatives[index - 1] = alternative;
  };

  getIndexOf = function(alternative) {
    return $scope.question.alternatives.indexOf(alternative);
  }
}

// see http://ichwill.net
function addEvent(obj, evType, fn) { 
  if (obj.addEventListener) { 
    obj.addEventListener(evType, fn, false); 
    return true; 
  } else if (obj.attachEvent){ 
    var r = obj.attachEvent("on" + evType, fn); 
    return r;
  } else { 
    return false; 
  }
}

function init(){
  Mousetrap.bind('tab', function() {
    var element = $(document.activeElement);
    if(element.hasClass('alternative')) {
      alert("XXX");
    }
  });
}

