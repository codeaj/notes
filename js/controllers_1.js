myApp.controller('ParentController', function($scope) {
    $scope.hello = "Hello World";
});

var NoteController = ['$scope', '$http', '$timeout', '$upload', 'WebServiceHandler', 'Data',
    '$location', function($scope, $http, $timeout, $upload, WebServiceHandler, Data, $location) {

        $scope.atHome = true;
        $scope.selectedSubject = "Political Science is a fairly new subject to me.";
        $scope.selectedTopic = "Democracy";
        $scope.selectedSubtopic = "Freedom of speech";
        $scope.breadCrumbIndex = 0;
        $scope.selection = [];

        $scope.editPlaceholder = "Please enter text";
        $scope.breadCrumbContext = "";

        WebServiceHandler.callService(['GET', 'subject', {}]).then(function(response) {
            $scope.inputChanged = [];
            $scope.subjects = response.data.message;
            _.each($scope.subjects, function() {
                $scope.inputChanged.push(false)
            });
        }, function(failureReason) {
            alert(failureReason);
        });

        $scope.makeSelection = function(selection) {
            $scope.selection = selection;
            console.log($scope.selection);
        }

        var setForCreate = function() {
            $scope.editText = '';
            $scope.showCreateEdit = !$scope.showCreateEdit;
            $scope.createClick = !$scope.createClick;
            $scope.createInProgress = true;
        };
        $scope.createClicked = function() {
            if ($scope.showCreateEdit)
                return;
            $scope.createClick = !$scope.createClick;

        };

        $scope.addSubject = function() {
            $scope.editPlaceholder = 'Please enter the subject name.';
            $scope.subjectCreate = true;
            setForCreate();
        };

        $scope.addNote = function() {
            $scope.editPlaceholder = 'Please enter the note text.';
            setForCreate();
        };

        $scope.addTopic = function() {
            setForCreate();
        };

        $scope.addSubtopic = function() {
            setForCreate();
        };

        $scope.updateCurrent = function() {
            if ($('.selected').length === 0 || $scope.showCreateEdit)
                return;
            switch ($scope.breadCrumbIndex) {
                case 0 :
                    $scope.editText = $scope.subjects[$scope.selection[1]].name;
                    $scope.showCreateEdit = true;
                    $scope.createInProgress = false;
                    break;
                case 'topic':
                    break;
                case 'note':
                    break;
            }
        };

        $scope.create = function() {
            switch ($scope.breadCrumbIndex) {
                case 0 :
                    var payload = ['POST', 'subject', JSON.stringify({"name": $scope.editText})];
                    WebServiceHandler.callService(payload).then(function(response) {
                        $scope.subjects.push(response.data.message);
                        $scope.subjectCreate = false;
                        $scope.showCreateEdit = !$scope.showCreateEdit;
                    }, function(failureReason) {
                        alert(failureReason);
                    });
                    break;
                case 'topic':
                    break;
                case 'note':
                    break;
            }

        };

        $scope.delete = function(index) {
            index = $scope.selection[1];
            switch ($scope.breadCrumbIndex) {
                case 0 :
                    var payload = ['DELETE', 'subject/' + $scope.subjects[index].id, {}];
                    WebServiceHandler.callService(payload).then(function() {
                        $scope.subjects.splice(index, 1);
                        $scope.deleteForm = !$scope.deleteForm
                    }, function(failureReason) {
                        alert(JSON.stringify(failureReason));
                    });
                    break;
                case 'topic':
                    break;
                case 'note':
                    break;
            }

        };

        $scope.update = function() {
            index = $scope.selection[1];
            switch ($scope.breadCrumbIndex) {
                case 0 :
                    var subjectObj = {"name": $scope.editText};
                    var payload = ['PUT', 'subject/' + $scope.subjects[index].id, JSON.stringify(subjectObj)];
                    WebServiceHandler.callService(payload).then(function() {
                        $scope.subjects[index].name = $scope.editText;
                        $scope.showCreateEdit = false;
                    }, function(failureReason) {
                        alert(failureReason);
                    });
                    break;
                case 'topic':
                    break;
                case 'note':
                    break;
            }
        };
    }];
