describe("List Controller", function(){
    var $scope = {},
        lc = new ListCtrl($scope);
    it("should shorten question text correctly", function() {
        expect($scope.shorten('#a\nb\n')).toEqual('#a');
    });
});


//describe("Testing Controllers", function() {
//    beforeEach(angular.mock.module('question'));
//
//    it('should have a ListCtrl controller', function() {
//        expect(true).toBe(true);
//        //expect(question.ListCtrl).not.to.equal(null);
//    });
//});

//describe("List Controller", function () {
//    var ctrl,
//        scope;
//
//    beforeEach(angular.module('question'));
//
//    beforeEach(inject(function ($rootScope, $controller) {
//        scope = $rootScope.$new();
//        ctrl = $controller('ListCtrl', {$scope: scope});
//    }));
//
//    it('should ....', inject(function() {
//        expect(true).toBe(false);
//    }));
//
//    it("....", function () {
//        expect(scope.shorten('#a\nb\n')).toBe('a');
//    });
//});


