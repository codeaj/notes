var myApp = angular.module('myApp', ['ngRoute', 'ngAnimate', 'angularFileUpload']);
// configure our routes
myApp.config(function($routeProvider) {
    $routeProvider
            .when('/', {
                templateUrl: 'templates/notes.html',
                controller: 'NoteController'
            });
});
myApp.directive('onSelect', function($http) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs, ctrl) {
            element.on('click', function() {
                $('.selected').removeClass('selected');
                element.addClass('selected');
            });
        }
    };
});
function showButtons($scope, showArr) {
    var buttons = ['showAddNote', 'showForm', 'showAddTopic', 'showAddSubTopic',
        'showEdit', 'showDelete'];
    for (var n = 0; n < buttons.length; n++) {
        $scope[buttons[n]] = false;
    }
    for (var n = 0; n < showArr.length; n++) {
        $scope[showArr[n]] = true;
    }
}
var pushNoteAtAppropriate = function(notesData, s, parentType, pushObj) {
    switch (parentType) {
        case 'subject' :
            notesData.notes.push(pushObj);
            break;
        case 'topic' :
            notesData.topics[s[1]].notes.push(pushObj);
            break;
        case 'subtopic':
            notesData.topics[s[1]].subtopics[s[2]].notes.push(pushObj);
            break;
    }
}