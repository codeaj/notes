var myApp = angular.module('myApp', ['ngRoute', 'ngAnimate']);
// configure our routes
myApp.config(function($routeProvider) {
    $routeProvider
            .when('/', {
                templateUrl: 'templates/home.html',
                controller: 'HomeController'
            })
            .when('/readQuotes', {
                templateUrl: 'templates/readQuotes.html',
                controller: 'HomeQuotesController'
            })
            .when('/login', {
                templateUrl: 'templates/login.html',
                controller: 'LoginController'
            })
            .when('/register', {
                templateUrl: 'templates/register.html',
                controller: 'RegisterController'
            })
            .when('/redirect', {
                templateUrl: 'templates/redirect.html',
                controller: 'ResetController'
            })
            .when('/categories', {
                templateUrl: 'templates/categories.html',
                controller: 'CategoryController'
            })
            .when('/logout', {
                templateUrl: 'templates/logout.html',
                controller: 'LogoutController'
            })
            .when('/quotes', {
                templateUrl: 'templates/quotes.html',
                controller: 'QuotesController'
            });
});
myApp.directive('checkSplChars', function() {
    return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            ctrl.$parsers.unshift(function(password) {
                if (!password.match(/[!,@,#,$,%,^,&,*,?,_,~,-,(,)]/)) {
                    ctrl.$setValidity('checkSplChars', true);
                    return password;
                } else {
                    ctrl.$setValidity('checkSplChars', false);
                    return password;
                }
            });
        }
    };
});
myApp.directive('minChars', function() {
    return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            ctrl.$parsers.unshift(function(value) {
                if (value.length >= 30) {
                    ctrl.$setValidity('minChars', true);
                    return value;
                } else {
                    ctrl.$setValidity('minChars', false);
                    return value;
                }
            });
        }
    };
});
myApp.directive('uniqueEmail', function($http) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs, ctrl) {
            var ctrlCache = ctrl;
            element.on('focus', function() {
                scope.$apply(function() {
                    scope.emailIdUnique = false;
                    scope.emailIdStatusReceived = '';
                });
            });
            element.on('focusout', function() {
                var EMAIL_REGEXP = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
                if (!EMAIL_REGEXP.test(element.val())) {
                    return;
                }
                $http({
                    method: "GET",
                    url: SERVICE_ROOT + 'userAvailable/' + element.val(),
                    crossDomain: true
                }).success(function(data, status, headers, config) {
                    scope.emailIdUnique = data.status;
                    scope.emailIdStatusReceived = data.message;
                }).error(function(data, status, headers, config) {
                    scope.emailIdUnique = data.status;
                    scope.emailIdStatusReceived = data.message;
                });
            });
            element.on('dblclick', function(evt) {
            });
            element.on('mousedown', function() {
            });
            element.on('click', function() {
            });
        }
    };
});

myApp.directive('checkStrongPswd', function() {
    return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            ctrl.$parsers.unshift(function(viewValue) {
                if (!isWeakPassword(viewValue)) {
                    ctrl.$setValidity('strongPswd', true);
                    return viewValue;
                } else {
                    ctrl.$setValidity('strongPswd', false);
                    return viewValue;
                }
            });
        }
    };
});

function showLoading($scope, showArray, hideArray) {
    for (var n = 0; n < showArray.length; n++) {
        $scope[showArray[n]] = true;
    }
    for (var n = 0; n < hideArray.length; n++) {
        $scope[hideArray[n]] = false;
    }
    var bodyElm = document.getElementsByTagName('body')[0];
    var bodyWidth = bodyElm.clientWidth;
    var bodyHeight = getDocHeight();
    var progressDiv = document.createElement('div');
    progressDiv.id = 'progress_div';
    progressDiv.className = 'ws-in-progress';
    var progressDivChild = document.createElement('span');
    progressDivChild.id = 'progress_div_child';
    progressDivChild.className = 'ajax-load';
    progressDivChild.innerHTML = 'Please Wait';
    progressDiv.appendChild(progressDivChild);
    bodyElm.appendChild(progressDiv);
    angular.element(document.getElementById('progress_div')).css(
            {'height': bodyHeight + 'px', 'width': bodyWidth + 'px'});
    var ajaxLoader = document.getElementById('progress_div_child');
    var loaderStyle = {
        'top': (bodyHeight / 2) - ajaxLoader.clientHeight + 'px',
        'left': (bodyWidth / 2) - ajaxLoader.clientWidth / 2 + 'px'
    };
    angular.element(ajaxLoader).css(loaderStyle);
}
function getDocHeight() {
    var D = document;
    return Math.max(
//        D.body.scrollHeight, D.documentElement.scrollHeight,
            D.body.offsetHeight, D.documentElement.offsetHeight,
            D.body.clientHeight, D.documentElement.clientHeight
            );
}

function hideLoading() {
    angular.element(document.querySelectorAll('#progress_div')).remove();
}
function isWeakPassword(password) {
    var desc = ['Very Weak', 'Weak', 'Better', 'Medium', 'Strong', 'Strongest'];
    var score = 0;
    if (typeof password === 'undefined')
        return false;
    if (password.length > 5)
        score++;
    if ((password.match(/[a-z]/)) && (password.match(/[A-Z]/)))
        score++;
    if (password.match(/\d+/))
        score++;
    if (password.match(/.[!,@,#,$,%,^,&,*,?,_,~,-,(,)]/))
        score++;
    if (password.length > 12)
        score++;
    return (score > 3) ? false : true;
}
function showHideGame($scope, showArray, hideArray) {
    for (var n = 0; n < showArray.length; n++) {
        $scope[showArray[n]] = true;
    }
    for (var n = 0; n < hideArray.length; n++) {
        $scope[hideArray[n]] = false;
    }
}
function resetObjectKeysToEmpty(obj) {
    _.each(_.keys(obj), function(key) {
        obj[key] = '';
    });
    return obj;
}
function getStringData(obj) {
    var str = '';
    _.each(_.keys(obj), function(key) {
        str = str + key + '=' + obj[key] + '&';
    });
    return str;
}
function showAppMessage($scope, message, actionSuccess) {
    $scope.appMessageDisp = true;
    $scope.appMessage = message;
    $scope.appMessageErr = !actionSuccess;
    $scope.appMessageSuccess = actionSuccess;
}
function hideAppMessage($scope) {
    $scope.appMessageDisp = false;
    $scope.appMessage = '';
}
function resetActivationKeys() {
    keySet = {resetKey: false, activateUser: false, notSet: false};
    key = false;
}
function logoutIfAuthSet($http, $location) {
    if ($http.defaults.headers.common['Authorization']) {
        $http.defaults.headers.common['Authorization'] = '';
        $location.url('/logout');
    } else {
        return;
    }
}
function loginIfAuthNotSet($http, $location) {
    var auth = $http.defaults.headers.common['Authorization'];
    if (typeof auth === 'undefined' || auth === '') {
        $http.defaults.headers.common['Authorization'] = '';
        $location.url('/login');
    } else {
        return;
    }
}
function disableButtons($scope, index, flag) {
    if (flag) {
        $scope.actions[index].delete = true;
        for (var n = 0; n < $scope.actions.length; n++) {
            $scope.actions[n].disabled = true;
        }
        $scope.actionAddDisabled = true;
        $scope.deleteDialogDisp = true;
    } else {
        $scope.actions[index].delete = false;
        for (var n = 0; n < $scope.actions.length; n++) {
            $scope.actions[n].disabled = false;
        }
        $scope.actionAddDisabled = false;
        $scope.deleteDialogDisp = false;
    }

}
function logout($http, $location) {
    $http.defaults.headers.common['Authorization'] = '';
    $location.url('/logout');
}
function loginRedirect($http, $location) {
    $http.defaults.headers.common['Authorization'] = '';
    $location.url('/login');
}
function HtmlEncode(str)
{
    return str.replace(/&/g, "and").replace(/>/g, "").replace(/</g, "");
}