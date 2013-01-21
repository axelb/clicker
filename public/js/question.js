var init = function(){
};//Hook method for initilization code

angular.module('question', ['ngCookies']).
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
  $scope.count = 0;
 
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
 
function QuestionCtrl($scope, $http, $cookies, $location) {
  $scope.question = {
    question: "",
    alternatives: [{title: ""}],
    imageId: ""
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

  $scope.setImage = function(element) {
    var auswahl_div = document.getElementById('attachedImage')
      , img = document.createElement('img')
      , reader = new FileReader();
    img.height = 110;
    img.file = $scope.imageFileToAttach;
    img.name = 'pic_';
    //img.classList.add("obj");
    $scope.imageFileToAttach = element.files[0];//only one file!
  
    reader.onload = (function(aImg) { 
      return function(e) { 
        aImg.src = e.target.result; 
      };})(img);
    reader.readAsDataURL($scope.imageFileToAttach);
    auswahl_div.appendChild(img);  
  };

  // see http://jsfiddle.net/danielzen/utp7j/
  $scope.save = function() {
    var fd = new FormData()
      , xhr = new XMLHttpRequest();
    if($scope.imageFileToAttach) {
         fd.append("uploadedImage", $scope.imageFileToAttach);
    }
    fd.append("question", JSON.stringify($scope.question));
    //xhr.upload.addEventListener("progress", uploadProgress, false)
    xhr.addEventListener("load", function(event) {
      Notifier.success("Uploaded question", $scope.question.title);
      $location.path( "/" );
    });
    //xhr.addEventListener("error", uploadFailed, false);
    //xhr.addEventListener("abort", uploadCanceled, false);
    xhr.open("POST", "/question");
    //$scope.progressVisible = true;
    xhr.send(fd);
};


  getIndexOf = function(alternative) {
    return $scope.question.alternatives.indexOf(alternative);
  };
}

