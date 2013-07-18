/**
 * karma / phantom tests for List controller (more to follow ...)
 */

describe('Question controllers', function() {

    beforeEach(angular.mock.module('questionService'));

    describe('ListCtrl', function(){
        var scope,
            ctrl,
            $httpBackend;

        beforeEach(inject(function(_$httpBackend_, $rootScope, $controller) {
            $httpBackend = _$httpBackend_;
            $httpBackend.expectGET('/list').
                respond([{question: '@@', type: 'Cloze', imageId: null, _id: '51e826197de0366c2e000002', __v: 0, alternatives:[]}]);

            scope = $rootScope.$new();
            ctrl = $controller(ListCtrl, {$scope: scope});
        }));

        it("should shorten question text correctly", function() {
            expect(scope.shorten('#a\nb\n')).toEqual('#a');
        });

        it("should not shorten question text without newline", function() {
            expect(scope.shorten('The quick brown fox jumps over the lazy dog!')).toEqual('The quick brown fox jumps over the lazy dog!');
        });

        it("should have exactly one question", function() {
            $httpBackend.flush();
            expect(scope.questions.length).toEqual(1);
        });

        it("should determine correct question type", function() {
            $httpBackend.flush();
            expect(scope.getQuestionType(scope.questions[0])).toEqual('Cloze');
        });
    });
});
