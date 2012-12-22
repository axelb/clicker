angular.module('vote', []).
  config(function($routeProvider) {
    $routeProvider.
    when('/', {controller: VoteCtrl, templateUrl: 'create.html'}).
    //when('/edit/:projectId', {controller:EditCtrl, templateUrl:'detail.html'}).
    //when('/new', {controller:CreateCtrl, templateUrl:'detail.html'}).
    otherwise({redirectTo:'/'});
});
 
function VoteCtrl($scope) {
  $scope.question = {
    title: "How much wood would a woodchuck chuck?",
    alternatives: ["One", "Two", "Three"]
  };

  $scope.addAlternative = function() {
      if($scope.question.alternatives[$scope.question.alternatives.length - 1] === "") {// do not allow empty strings
        return;
      }
     $scope.question.alternatives.push("");
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

