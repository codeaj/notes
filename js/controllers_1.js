myApp.controller('ParentController', function($scope) {
    $scope.hello = "Hello World";
});

var SubjectController = ['$scope', '$http', '$timeout',
    '$upload', 'WebServiceHandler', 'Data', '$location',
    function($scope, $http, $timeout, $upload, WebServiceHandler, Data, $location) {

        var originalValue, lastIndex;

        $scope.makeEditable = function(index) {
            if (lastIndex !== index)
                $('li input').eq(lastIndex).val(originalValue);
            $('li input').prop('disabled', true);
            $('.sub-input').removeClass('sub-input-conditional');
            _.each($scope.inputChanged, function(state, currIndex) {
                $scope.inputChanged[currIndex] = false;
            });
            $('.sub-input').eq(index).addClass('sub-input-conditional');
            var selectInput = $('li input').eq(index);
            selectInput.prop('disabled', false);
            selectInput.focus();
            lastIndex = index;
            originalValue = selectInput.val();
        };

        $scope.change = function(index) {
            $scope.inputChanged[index] = true;
        };

        WebServiceHandler.callService(['GET', 'subject', {}]).then(function(response) {
            $scope.inputChanged = [];
            $scope.subjects = response.data.message;
            _.each($scope.subjects, function() {
                $scope.inputChanged.push(false)
            });
        }, function(failureReason) {
            alert(failureReason);
        });

        $scope.showNotes = function(index) {
            Data.subject = {"subjectId": $scope.subjects[index].id,
                "subjectName": $scope.subjects[index].name};
            $location.url('/list');
        };

        $scope.addSubject = function(newSubject) {
            var payload = ['POST', 'subject', JSON.stringify({"name": newSubject})];
            WebServiceHandler.callService(payload).then(function(response) {
                $scope.subjects.push(response.data.message);
            }, function(failureReason) {
                alert(failureReason);
            });
        };

        $scope.deleteSubject = function(index) {
            var payload = ['DELETE', 'subject/' + $scope.subjects[index].id, {}];
            WebServiceHandler.callService(payload).then(function() {
                $scope.subjects.splice(index, 1);
            }, function(failureReason) {
                alert(JSON.stringify(failureReason));
            });
        };

        $scope.updateSubject = function(index) {
            var subjectObj = {"name": $scope.subjects[index].name};
            var payload = ['PUT', 'subject/' + $scope.subjects[index].id, JSON.stringify(subjectObj)];
            WebServiceHandler.callService(payload).then(function() {
                $('li input').prop('disabled', true);
                $('.sub-input').removeClass('sub-input-conditional');
                _.each($scope.inputChanged, function(state, currIndex) {
                    $scope.inputChanged[currIndex] = false;
                });
                lastIndex = 'undefined';
                originalValue = 'undefined';
            }, function(failureReason) {
                alert(failureReason);
            });
        };

        $scope.getNotes = function(index) {

        };

        $scope.fileReaderSupported = window.FileReader != null;
        $scope.uploadRightAway = true;
        $scope.onFileSelect = function($files) {
            $scope.selectedFiles = [];
            $scope.progress = [];
            if ($scope.upload && $scope.upload.length > 0) {
                for (var i = 0; i < $scope.upload.length; i++) {
                    if ($scope.upload[i] != null) {
                        $scope.upload[i].abort();
                    }
                }
            }
            $scope.upload = [];
            $scope.uploadResult = [];
            $scope.selectedFiles = $files;
            $scope.dataUrl = [];
            for (var i = 0; i < $files.length; i++) {
                var $file = $files[i];
                if (window.FileReader && $file.type.indexOf('image') > -1) {
                    var fileReader = new FileReader();
                    fileReader.readAsDataURL($files[i]);
                    var loadFile = function(fileReader, index) {
                        fileReader.onload = function(e) {
                            $timeout(function() {
                                $scope.dataUrl = e.target.result;
                            });
                        }
                    }(fileReader, i);
                }
                $scope.progress[i] = -1;
                if ($scope.uploadRightAway) {
                    $scope.start(i);
                }
            }
        };

        $scope.start = function(index) {
            $scope.progress[index] = 0;
            $scope.errorMsg = null;
            $scope.upload[index] = $upload.upload({
                url: 'v0.1/uploadFile',
                method: 'POST',
                headers: {'my-header': 'my-header-value'},
                data: {
                    myModel: $scope.myModel
                },
                file: $scope.selectedFiles[index],
                fileFormDataName: 'myFile'
            }).then(function(response) {
                $scope.uploadResult.push(response.data);
            }, function(response) {
                if (response.status > 0)
                    $scope.errorMsg = response.status + ': ' + response.data;
            }, function(evt) {
                // Math.min is to fix IE which reports 200% sometimes
                $scope.progress[index] = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            });
        };
    }];

var NoteController = ['$scope', '$http', '$timeout', '$upload', 'WebServiceHandler', 'Data',
    '$location', function($scope, $http, $timeout, $upload, WebServiceHandler, Data, $location) {
//        if (!Data.subject) {
//            $location.url('/subject');
//            return;
//        }
//
//        var selectedSubject = Data.subject.subjectId;
//        $scope.subjectName = Data.subject.subjectName;
        var selectedSubject = 15;
        $scope.subjectName = "Political Science";
        $scope.showCreateEdit = false;

        WebServiceHandler.callService(['GET', 'notes/' + selectedSubject, {}]).then(function(response) {
            $scope.noteData = response.data.message;
            console.log(response.data.message);
        }, function(failureReason) {
            alert(failureReason);
        });

        $scope.editSubjectNote = function(index) {
            console.log(index);
        };

        $scope.makeSelection = function(selectionArray) {
            $scope.selection = [];
            $scope.noteParent = {};
            _.each(selectionArray, function(value) {
                $scope.selection.push(value);
            });
            var s = $scope.selection;
            showButtons($scope, []);
            $('.subjectNote').removeClass('item-selected');
            $('.topicElement').removeClass('item-selected');
            $('.topicNote').removeClass('item-selected');
            $('.subtopicElement').removeClass('item-selected');
            $('.subtopicNote').removeClass('item-selected');
            $('.subject-name').removeClass('item-selected');
            switch (s[0]) {
                case 'subject':
                    $('.subject-name').addClass('item-selected');
                    $scope.noteParent = {'parentId': selectedSubject, 'parentType': 'subject'};
                    showButtons($scope, ['showAddNote', 'showAddTopic']);
                    break;
                case 'subjectNote':
                    $('.subjectNote').eq(s[1]).addClass('item-selected');
                    $scope.editTextValue = $scope.noteData.notes[$scope.selection[1]].text;
                    showButtons($scope, ['showEdit', 'showDelete']);
                    break;
                case 'topicElement' :
                    $('.topicElement').eq(s[1]).addClass('item-selected');
                    $scope.noteParent = {'parentId': $scope.noteData.topics[s[1]].topic.id,
                        'parentType': 'topic'};
                    $scope.editTextValue = $scope.noteData.topics[s[1]].topic.text;
                    showButtons($scope, ['showEdit', 'showDelete', 'showAddNote', 'showAddSubTopic']);
                    break;
                case 'topicNote':
                    $('.topic').eq(s[1]).find('.topicNote')
                            .eq(s[2]).addClass('item-selected');
                    $scope.editTextValue
                            = $scope.noteData.topics[s[1]].notes[s[2]].text;
                    showButtons($scope, ['showEdit', 'showDelete']);
                    break;
                case 'subtopicElement' :
                    $('.topic').eq(s[1]).find('.subtopicElement')
                            .eq(s[2]).addClass('item-selected');
                    $scope.noteParent = {
                        'parentId': $scope.noteData.topics[s[1]].subtopics[s[2]].subtopic.id,
                        'parentType': 'subtopic'};
                    $scope.editTextValue
                            = $scope.noteData.topics[s[1]].subtopics[s[2]].subtopic.text;
                    showButtons($scope, ['showEdit', 'showDelete', 'showAddNote']);
                    break;
                case 'subtopicNote':
                    $('.topic').eq(s[1]).find('.subtopic')
                            .eq(s[2]).find('.subtopicNote').eq(s[3]).addClass('item-selected');
                    $scope.editTextValue
                            = $scope.noteData.topics[s[1]].subtopics[s[2]].notes[s[3]].text;
                    showButtons($scope, ['showEdit', 'showDelete']);
                    break;
            }
        };

        function imageId(sImg, b) {
            if (sImg) {
                return  sImg;
            } else {
                return  b;
            }
        }

        $scope.update = function() {
            var s = $scope.selection;
            var sImg = false;
            switch (s[0]) {
                case 'subjectNote':
                    var img_id = imageId(sImg, $scope.noteData.notes[s[1]].img_ref)
                    var input = {"text": $scope.editTextValue,
                        "parent_type": "subject",
                        "parent_id": $scope.noteData.notes[s[1]].parent_id,
                        "img_id": img_id};
                    var url = 'note/' + selectedSubject + '/' + $scope.noteData.notes[s[1]].id;
                    var payload = ['PUT', url, JSON.stringify(input)];
                    WebServiceHandler.callService(payload).then(function(response) {
                        $scope.noteData.notes[s[1]].text = $scope.editTextValue;
                        $scope.showCreateEdit = !$scope.showCreateEdit;
                    }, function(failureReason) {
                        alert(failureReason);
                    });
                    break;
                case 'topicElement' :
                    var img_id = imageId(sImg, $scope.noteData.topics[s[1]].topic.img_ref);
                    var input = {"text": $scope.editTextValue, "img_id": img_id};
                    var url = 'topic/' + selectedSubject + '/'
                            + $scope.noteData.topics[s[1]].topic.id;
                    var payload = ['PUT', url, JSON.stringify(input)];
                    WebServiceHandler.callService(payload).then(function(response) {
                        $scope.noteData.topics[s[1]].topic.text = $scope.editTextValue;
                        $scope.showCreateEdit = !$scope.showCreateEdit;
                    }, function(failureReason) {
                        alert(failureReason);
                    });
                    break;
                case 'topicNote':
                    var img_id = imageId(sImg, $scope.noteData.topics[s[1]].notes[s[2]].img_ref);
                    var input = {"text": $scope.editTextValue,
                        "parent_type": "topic",
                        "parent_id": $scope.noteData.topics[s[1]].notes[s[2]].parent_id,
                        "img_id": img_id};
                    var url = 'note/' + selectedSubject + '/'
                            + $scope.noteData.topics[s[1]].notes[s[2]].id;
                    var payload = ['PUT', url, JSON.stringify(input)];
                    WebServiceHandler.callService(payload).then(function(response) {
                        $scope.noteData.topics[s[1]].notes[s[2]].text = $scope.editTextValue;
                        $scope.showCreateEdit = !$scope.showCreateEdit;
                    }, function(failureReason) {
                        alert(failureReason);
                    });
                    break;
                case 'subtopicElement' :
                    var img_id =
                            imageId(sImg, $scope.noteData.topics[s[1]].subtopics[s[2]].subtopic.img_ref);
                    var input = {"text": $scope.editTextValue, "img_id": img_id};
                    var url = 'subtopic/' + selectedSubject + '/'
                            + $scope.noteData.topics[s[1]].subtopics[s[2]].subtopic.topic_ref + '/'
                            + $scope.noteData.topics[s[1]].subtopics[s[2]].subtopic.id;
                    var payload = ['PUT', url, JSON.stringify(input)];
                    WebServiceHandler.callService(payload).then(function(response) {
                        $scope.noteData.topics[s[1]].subtopics[s[2]].subtopic.text
                                = $scope.editTextValue;
                        $scope.showCreateEdit = !$scope.showCreateEdit;
                    }, function(failureReason) {
                        alert(failureReason);
                    });
                    break;
                case 'subtopicNote':
                    var img_id = imageId(sImg,
                            $scope.noteData.topics[s[1]].subtopics[s[2]].notes[s[3]].img_ref);
                    var input = {"text": $scope.editTextValue,
                        "parent_type": "subtopic",
                        "parent_id": $scope.noteData.topics[s[1]].subtopics[s[2]].notes[s[3]].parent_id,
                        "img_id": img_id};
                    var url = 'note/' + selectedSubject + '/'
                            + $scope.noteData.topics[s[1]].subtopics[s[2]].notes[s[3]].id;
                    var payload = ['PUT', url, JSON.stringify(input)];
                    WebServiceHandler.callService(payload).then(function(response) {
                        $scope.noteData.topics[s[1]].subtopics[s[2]].notes[s[3]].text
                                = $scope.editTextValue;
                        $scope.showCreateEdit = !$scope.showCreateEdit;
                    }, function(failureReason) {
                        alert(failureReason);
                    });
                    break;
            }
        };
        $scope.deleteSelection = function() {
            var s = $scope.selection;
            switch (s[0]) {
                case 'subjectNote':
                    var url = 'note/' + selectedSubject + '/'
                            + $scope.noteData.notes[s[1]].parent_id + '/'
                            + $scope.noteData.notes[s[1]].id;
                    var payload = ['DELETE', url, JSON.stringify({})];
                    WebServiceHandler.callService(payload).then(function(response) {
                        $scope.noteData.notes.splice(s[1], 1);
                        $scope.selection = [];
                        $scope.deleteForm = !$scope.deleteForm;
                        showButtons($scope, []);
                    }, function(failureReason) {
                        alert(failureReason);
                    });
                    break;
                case 'topicElement' :
                    var url = 'topic/' + selectedSubject + '/' + $scope.noteData.topics[s[1]].topic.id;
                    var payload = ['DELETE', url, JSON.stringify({})];
                    WebServiceHandler.callService(payload).then(function(response) {
                        $scope.noteData.topics.splice(s[1], 1);
                        $scope.selection = [];
                        $scope.deleteForm = !$scope.deleteForm;
                        showButtons($scope, []);
                    }, function(failureReason) {
                        alert(failureReason);
                    });
                    break;
                case 'topicNote':
                    var url = 'note/' + selectedSubject + '/'
                            + $scope.noteData.topics[s[1]].notes[s[2]].parent_id + '/'
                            + $scope.noteData.topics[s[1]].notes[s[2]].id;
                    var payload = ['DELETE', url, JSON.stringify({})];
                    WebServiceHandler.callService(payload).then(function(response) {
                        $scope.noteData.topics[s[1]].notes.splice(s[2], 1);
                        $scope.selection = [];
                        $scope.deleteForm = !$scope.deleteForm;
                        showButtons($scope, []);
                    }, function(failureReason) {
                        alert(failureReason);
                    });
                    break;
                case 'subtopicElement' :
                    var url = 'subtopic/' + selectedSubject + '/'
                            + $scope.noteData.topics[s[1]].subtopics[s[2]].subtopic.topic_ref + '/'
                            + $scope.noteData.topics[s[1]].subtopics[s[2]].subtopic.id;
                    var payload = ['DELETE', url, JSON.stringify({})];
                    WebServiceHandler.callService(payload).then(function(response) {
                        $scope.noteData.topics[s[1]].subtopics.splice(s[2], 1);
                        $scope.selection = [];
                        $scope.deleteForm = !$scope.deleteForm;
                        showButtons($scope, []);
                    }, function(failureReason) {
                        alert(failureReason);
                    });
                    break;
                case 'subtopicNote':
                    var url = 'note/' + selectedSubject + '/'
                            + $scope.noteData.topics[s[1]].subtopics[s[2]].notes[s[3]].parent_id + '/'
                            + $scope.noteData.topics[s[1]].subtopics[s[2]].notes[s[3]].id;
                    var payload = ['DELETE', url, JSON.stringify({})];
                    WebServiceHandler.callService(payload).then(function(response) {
                        $scope.noteData.topics[s[1]].subtopics[s[2]].notes.splice(s[3], 1);
                        $scope.selection = [];
                        $scope.deleteForm = !$scope.deleteForm;
                        $scope.showCreateEdit = !$scope.showCreateEdit;
                        showButtons($scope, []);
                    }, function(failureReason) {
                        alert(failureReason);
                    });
                    break;
            }
        };

        $scope.showFormCreateEdit = function(selection) {
            $scope.selectionResource = selection;
            switch (selection) {
                case 'Note' :
                    $scope.editInputName = 'Please Enter a note';
                    $scope.editTextValue = '';
                    $scope.showCreateBtn = true;
                    break;
                case 'Topic' :
                    $scope.editInputName = 'Please Provide details for the topic';
                    $scope.editTextValue = '';
                    $scope.showCreateBtn = true;
                    break;
                case 'Subtopic' :
                    $scope.editInputName = 'Please Provide details for the subtopic';
                    $scope.editTextValue = '';
                    $scope.showCreateBtn = true;
                    break;
                case 'Edit' :
                    $scope.editInputName = 'you can update below details';
                    $scope.showCreateBtn = false;
                    break;
            }
            $scope.showCreateEdit = !$scope.showCreateEdit;
        };

        $scope.create = function() {
            switch ($scope.selectionResource) {
                case 'Note' :
                    var img_id = 57;
                    var input = {"text": $scope.editTextValue,
                        "parent_type": $scope.noteParent.parentType,
                        "parent_id": $scope.noteParent.parentId,
                        "img_id": img_id};
                    var url = 'note/' + selectedSubject;
                    var payload = ['POST', url, JSON.stringify(input)];
                    WebServiceHandler.callService(payload).then(function(response) {
                        pushNoteAtAppropriate($scope.noteData, $scope.selection,
                                $scope.noteParent.parentType, response.data.message);
                        $scope.selection = [];
                        $scope.showCreateEdit = !$scope.showCreateEdit;
                    }, function(failureReason) {
                        alert(failureReason);
                    });
                    break;
                case 'Topic' :
                    var img_id = 57;
                    var input = {"text": $scope.editTextValue,
                        "img_id": img_id};
                    var url = 'topic/' + selectedSubject;
                    var payload = ['POST', url, JSON.stringify(input)];
                    WebServiceHandler.callService(payload).then(function(response) {
                        $scope.noteData.topics.push({topic: response.data.message});
                        $scope.selection = [];
                        $scope.showCreateEdit = !$scope.showCreateEdit;
                    }, function(failureReason) {
                        alert(failureReason);
                    });
                    break;
                case 'Subtopic' :
                    var img_id = 57;
                    var input = {"text": $scope.editTextValue,
                        "img_id": img_id};
                    var url = 'subtopic/' + selectedSubject + '/' + $scope.noteParent.parentId;
                    var payload = ['POST', url, JSON.stringify(input)];
                    WebServiceHandler.callService(payload).then(function(response) {
                        $scope.noteData.topics[$scope.selection[1]].subtopics.push({subtopic: response.data.message});
                        $scope.selection = [];
                        $scope.showCreateEdit = !$scope.showCreateEdit;
                    }, function(failureReason) {
                        alert(failureReason);
                    });
                    break;
            }
        };
    }];
