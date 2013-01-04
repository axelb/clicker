var init = function(){
};//Hook method for initilization code

angular.module('question', []).
  config(function($routeProvider) {
    $routeProvider.
    when('/', {controller: StartCtrl, templateUrl: 'start.html'}).
    //when('/edit/:projectId', {controller:EditCtrl, templateUrl:'detail.html'}).
    when('/new', {controller: QuestionCtrl, templateUrl: 'create.html'}).
    when('/list', {controller: ListCtrl, templateUrl: 'list.html'}).
    when('/edit/:id', {controller: ListCtrl, templateUrl: 'create.html'}).
    otherwise({redirectTo:'/'});
});

function StartCtrl($scope) {

}
 
function ListCtrl($scope, $http, $templateCache) {
  
  $scope.method = 'GET';
  $scope.listUrl = '/list';
   
  $scope.fetch = function() {
    $scope.code = null;
    $scope.response = null;
     
    $http({method: $scope.method, url: $scope.listUrl, cache: $templateCache}).
    success(function(data, status) {
      $scope.status = status;
      $scope.questions = data;
    }).
    error(function(data, status) {
      alert('error');
      $scope.questions = data || "Request failed";
      $scope.status = status;
    });
  };

}
 
function QuestionCtrl($scope, $http) {
  $scope.imageFileToAttach = {};
  
  $scope.question = {
    question: "",
    alternatives: [{title: ""}]
  };

  $scope.save = function() {
    $http.put('/question', $scope.question).success(function(){}).
          error(function(data, status, headers, config) {
            alert(data + " " + status);
          });
  };

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

  $scope.setFile = function(element) {
    $scope.imageFileToAttach = element.files[0];//only one file!
  };

// see http://jsfiddle.net/danielzen/utp7j/
  $scope.attachFile = function() {
    var fd = new FormData()
    fd.append("uploadedFile", $scope.imageFileToAttach);
    var xhr = new XMLHttpRequest();
    //xhr.upload.addEventListener("progress", uploadProgress, false)
    //xhr.addEventListener("load", uploadComplete, false);
    //xhr.addEventListener("error", uploadFailed, false);
    //xhr.addEventListener("abort", uploadCanceled, false);
    xhr.open("POST", "/fileupload");
    $scope.progressVisible = true;
    xhr.send(fd);
};


  getIndexOf = function(alternative) {
    return $scope.question.alternatives.indexOf(alternative);
  };
}

