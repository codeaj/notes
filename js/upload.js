"use strict";

angular.module('fileUpload', ['angularFileUpload']);

var MyCtrl = ['$scope', '$http', '$timeout', '$upload', function($scope, $http, $timeout, $upload) {
        $scope.fileReaderSupported = window.FileReader != null;
        $scope.uploadRightAway = true;
        $scope.hasUploader = function(index) {
            return $scope.upload[index] != null;
        };
        $scope.abort = function(index) {
            $scope.upload[index].abort();
            $scope.upload[index] = null;
        };
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
            $scope.dataUrls = [];
            for (var i = 0; i < $files.length; i++) {
                var $file = $files[i];
                if (window.FileReader && $file.type.indexOf('image') > -1) {
                    var fileReader = new FileReader();
                    fileReader.readAsDataURL($files[i]);
                    var loadFile = function(fileReader, index) {
                        fileReader.onload = function(e) {
                            $timeout(function() {
                                $scope.dataUrls[index] = e.target.result;
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
                console.log(response);
                if (response.status > 0)
                    $scope.errorMsg = response.status + ': ' + response.data;
            }, function(evt) {
                // Math.min is to fix IE which reports 200% sometimes
                $scope.progress[index] = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            }).xhr(function(xhr) {
                xhr.upload.addEventListener('abort', function() {
                    console.log('abort complete')
                }, false);
            });
        };
    }];
