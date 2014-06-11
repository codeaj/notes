//var APP_ROOT = 'http://localhost/quotes/';
var APP_ROOT = 'http://jaagar.org/quotes/';
var SERVICE_ROOT = 'v1.2/';

var configs = {};
configs['REGISTER_VALIDATION_NAME'] = 'Name should be atleast 5 characters long.';
// App messages
configs['ACCOUNT_NOT_ACTIVE'] = 'The account is still not active, please check your email to activate.';
configs['LOGIN_FAIL'] = 'Login Failed, please try again.';
configs['RESET_EMAIL_SENT'] = 'The email is sent to the given email ID, provided it was found in our database.';
configs['REGISTER_SUCCESS'] = 'Registered Successfully. Please check your email to activate the account.';
configs['REGISTER_FAILURE'] = 'We are facing a technical issue in creating your account, please try again after some time.';
configs['USER_ALREADY_VERIFIED'] = 'User is already verified please login.';
configs['USER_VERIFIED'] = 'Verification complete please login.';
configs['USER_VERIFICATION_ERR'] = 'There was an error in email verification.';
configs['PASSWORD_RESET'] = 'Please enter your new password to reset.';
configs['PASSWORD_RESET_USED'] = 'The reset link is either used or a new link has been requested.';
configs['PASSWORD_CHANGED'] = 'The password has been changed please login with your new credentials.';
configs['PASSWORD_CHANGE_FAIL'] = 'The password change link seems to have expired.';
//validation messages
configs['REGISTER_VALIDATION_NAME'] = 'Name should be atleast 4 character long and without special characters.';
configs['REGISTER_VALIDATION_EMAIL'] = 'Invalid Email Id.';
configs['REGISTER_VALIDATION_PASSWORD'] = 'Use strong password that contains at least 6 characters, a special character, a number and a capital letter.';
configs['REGISTER_VALIDATION_CAPTCHA'] = 'Your entered captcha was wrong please re-enter.';
configs['REGISTER_LOGIN'] = 'Login to the application, if email verification is complete.';
configs['EMAIL_VERIFY_SENT'] = 'Verification email is sent to your email Id';
configs['EMAIL_VERIFY_SENT_FAIL'] = 'There was an error in sending out verification email, please try after some time';
configs['CTG_NAME_LENGTH_ERR'] = 'Category name should be atleast 5 character long.';
configs['CTG_DESC_LENGTH_ERR'] = 'Category description should be atleast 30 character long.';
configs['INVALID_EMAIL_ERR'] = 'Please Enter a valid email Id.';
configs['LOGIN_PSWD_REQUIRED'] = 'Password is required.';
configs['LOGOUT_MESSAGE'] = 'You are successfully logged out of the application.';
configs['QUOTE_LENGTH_ERR'] = 'Quote should be atleast atleast 30 character long.';
configs['PASSWORD_NO_MATCH'] = 'Password do not match.';
configs['DATA_NOT_FOUND'] = 'Error in fetching categories';
configs['DELETE_ERROR'] = 'Requested resource could not be deleted.';
configs['UPDATE_ERROR'] = 'Requested resource could not be updated.';
configs['CREATE_ERROR'] = 'Requested resource could not be created.';
configs['SERVICE_ERROR'] = 'A service error has occurred please try after some time.'

/*************************************************************************************/

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

/*************************************************************************************/

myApp.factory('Data', function() {
    var data = {};
    return data;
});
myApp.factory('WebServiceHandler', function($q, $http) {

    var loginToServer = function(credentials) {
        var deferred = $q.defer();

        $http({
            method: "POST",
            url: SERVICE_ROOT + 'login',
            data: getStringData(credentials),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': '*/*',
                'X-Requested-With': 'XMLHttpRequest'
            }
        }).success(function(data, status, headers, config) {
            deferred.resolve({'status': status, 'data': data});
        }).error(function(data, status, headers, config) {
            deferred.reject({'status': status, 'data': data});
        });

        return deferred.promise;
    };
    var registerUser = function(credentials) {
        var deferred = $q.defer();
        $http({
            method: "POST",
            url: SERVICE_ROOT + 'register',
            data: getStringData(credentials),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': '*/*',
                'X-Requested-With': 'XMLHttpRequest'
            }
        }).success(function(data, status, headers, config) {
            deferred.resolve({'status': status, 'data': data});
        }).error(function(data, status, headers, config) {
            deferred.reject({'status': status, 'data': data});
        });
        return deferred.promise;
    };
    var sendResetLink = function(email) {
        var deferred = $q.defer();
        $http({
            method: "GET",
            url: SERVICE_ROOT + 'forgotPswd/' + email,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': '*/*',
                'X-Requested-With': 'XMLHttpRequest'
            }
        }).success(function(data, status, headers, config) {
            deferred.resolve({'status': status, 'data': data});
        }).error(function(data, status, headers, config) {
            deferred.reject({'status': status, 'data': data});
        });
        return deferred.promise;
    };

    var resetPassword = function(resetPswdObj) {
        var deferred = $q.defer();

        $http({
            method: "POST",
            url: SERVICE_ROOT + 'forgotPswd',
            data: getStringData(resetPswdObj),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': '*/*',
                'X-Requested-With': 'XMLHttpRequest'
            }
        }).success(function(data, status, headers, config) {
            deferred.resolve({'status': status, 'data': data});
        }).error(function(data, status, headers, config) {
            deferred.reject({'status': status, 'data': data});
        });

        return deferred.promise;
    };

    var resendVerificationInvite = function(email) {
        var deferred = $q.defer();

        $http({
            method: "GET",
            url: SERVICE_ROOT + 'resendEmailInvite/' + email,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': '*/*',
                'X-Requested-With': 'XMLHttpRequest'
            }
        }).success(function(data, status, headers, config) {
            deferred.resolve({'status': status, 'data': data});
        }).error(function(data, status, headers, config) {
            deferred.reject({'status': status, 'data': data});
        });

        return deferred.promise;
    };

    var createWrtNCtg = function(form_data) {
        var deferred = $q.defer();
        $http({
            method: "POST",
            url: SERVICE_ROOT + 'category',
            data: getStringData(form_data),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': '*/*',
                'X-Requested-With': 'XMLHttpRequest'
            }
        }).success(function(data, status, headers, config) {
            deferred.resolve({'status': status, 'data': data});
        }).error(function(data, status, headers, config) {
            deferred.reject({'status': status, 'data': data});
        });
        return deferred.promise;
    };
    var fetchWritersNCtgs = function() {
        var deferred = $q.defer();
        $http({
            method: "GET",
            url: SERVICE_ROOT + 'category',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': '*/*',
                'X-Requested-With': 'XMLHttpRequest'
            }
        }).success(function(data, status, headers, config) {
            deferred.resolve({'status': status, 'data': data});
        }).error(function(data, status, headers, config) {
            deferred.reject({'status': status, 'data': data});
        });
        return deferred.promise;
    };

    var updateWrtNCtg = function(form_data, id) {
        var deferred = $q.defer();
        $http({
            method: "PUT",
            url: SERVICE_ROOT + 'category/' + id,
            data: getStringData(form_data),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': '*/*',
                'X-Requested-With': 'XMLHttpRequest'
            }
        }).success(function(data, status, headers, config) {
            deferred.resolve({'status': status, 'data': data});
        }).error(function(data, status, headers, config) {
            deferred.reject({'status': status, 'data': data});
        });
        return deferred.promise;
    };

    var removeWritersNCtgs = function(idToDelete) {
        var deferred = $q.defer();
        $http({
            method: "DELETE",
            url: SERVICE_ROOT + 'category/' + idToDelete,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': '*/*',
                'X-Requested-With': 'XMLHttpRequest'
            }
        }).success(function(data, status, headers, config) {
            deferred.resolve({'status': status, 'data': data});
        }).error(function(data, status, headers, config) {
            deferred.reject({'status': status, 'data': data});
        });
        return deferred.promise;
    };
    var likeCtg = function(idToLike, flag, type) {
        var wsURL = '';
        if (type === 'ctg') {
            if (flag) {
                wsURL = 'category/like/' + idToLike;
            } else {
                wsURL = 'category/unlike/' + idToLike;
            }
        } else {
            if (flag) {
                wsURL = 'quote/like/' + idToLike;
            } else {
                wsURL = 'quote/unlike/' + idToLike;
            }
        }
        var deferred = $q.defer();
        $http({
            method: "PUT",
            url: SERVICE_ROOT + wsURL,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': '*/*',
                'X-Requested-With': 'XMLHttpRequest'
            }
        }).success(function(data, status, headers, config) {
            deferred.resolve({'status': status, 'data': data});
        }).error(function(data, status, headers, config) {
            deferred.reject({'status': status, 'data': data});
        });
        return deferred.promise;
    };
    var fetchQuotes = function(writerId) {
        var deferred = $q.defer();
        $http({
            method: "GET",
            url: SERVICE_ROOT + 'quote/' + writerId,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': '*/*',
                'X-Requested-With': 'XMLHttpRequest'
            }
        }).success(function(data, status, headers, config) {
            deferred.resolve({'status': status, 'data': data});
        }).error(function(data, status, headers, config) {
            deferred.reject({'status': status, 'data': data});
        });
        return deferred.promise;
    };

    var createNewQuote = function(form_data) {
        var deferred = $q.defer();
        $http({
            method: "POST",
            url: SERVICE_ROOT + 'quote',
            data: getStringData(form_data),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': '*/*',
                'X-Requested-With': 'XMLHttpRequest'
            }
        }).success(function(data, status, headers, config) {
            deferred.resolve({'status': status, 'data': data});
        }).error(function(data, status, headers, config) {
            deferred.reject({'status': status, 'data': data});
        });
        return deferred.promise;
    };
    var updateTheQuote = function(form_data, quoteId) {
        var deferred = $q.defer();
        $http({
            method: "PUT",
            url: SERVICE_ROOT + 'quote/' + quoteId,
            data: getStringData(form_data),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': '*/*',
                'X-Requested-With': 'XMLHttpRequest'
            }
        }).success(function(data, status, headers, config) {
            deferred.resolve({'status': status, 'data': data});
        }).error(function(data, status, headers, config) {
            deferred.reject({'status': status, 'data': data});
        });
        return deferred.promise;
    };
    var removeQuote = function(idToDelete) {
        var deferred = $q.defer();
        $http({
            method: "DELETE",
            url: SERVICE_ROOT + 'quote/' + idToDelete,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': '*/*',
                'X-Requested-With': 'XMLHttpRequest'
            }
        }).success(function(data, status, headers, config) {
            deferred.resolve({'status': status, 'data': data});
        }).error(function(data, status, headers, config) {
            deferred.reject({'status': status, 'data': data});
        });
        return deferred.promise;
    };

    var getReadCtgs = function(writerId) {
        var deferred = $q.defer();
        $http({
            method: "GET",
            url: SERVICE_ROOT + 'readCategory',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': '*/*',
                'X-Requested-With': 'XMLHttpRequest'
            }
        }).success(function(data, status, headers, config) {
            deferred.resolve({'status': status, 'data': data});
        }).error(function(data, status, headers, config) {
            deferred.reject({'status': status, 'data': data});
        });
        return deferred.promise;
    };

    var fetchReadQuotes = function(writerId) {
        var deferred = $q.defer();
        $http({
            method: "GET",
            url: SERVICE_ROOT + 'readQuote/' + writerId,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': '*/*',
                'X-Requested-With': 'XMLHttpRequest'
            }
        }).success(function(data, status, headers, config) {
            deferred.resolve({'status': status, 'data': data});
        }).error(function(data, status, headers, config) {
            deferred.reject({'status': status, 'data': data});
        });
        return deferred.promise;
    };

    return {
        register: registerUser,
        login: loginToServer,
        sendReset: sendResetLink,
        resetPswd: resetPassword,
        resendVerifyInvite: resendVerificationInvite,
        getCategories: fetchWritersNCtgs,
        createCategory: createWrtNCtg,
        deleteCategory: removeWritersNCtgs,
        updateCategory: updateWrtNCtg,
        likeQuoteOrCtg: likeCtg,
        getQuotes: fetchQuotes,
        createQuote: createNewQuote,
        updateQuote: updateTheQuote,
        deleteQuote: removeQuote,
        getReadCategories: getReadCtgs,
        getReadQuotes: fetchReadQuotes
    };
});

/*************************************************************************************/

myApp.controller('ParentController', function($scope, $location) {
    $scope.headerTitle = "Inspirational Quotes";
    $scope.singleQuote = '“There are only two ways to live your life. One is as though nothing is a miracle. The other is as though everything is a miracle.”';
    $scope.singleQuoteAuthor = '― Albert Einstein';

    if (!keySet.notSet) {
        $location.url('/redirect');
    } else {
        resetActivationKeys();
    }
});

myApp.controller('RegisterController', function($scope, WebServiceHandler, $http, $location) {
    logoutIfAuthSet($http, $location);
    hideAppMessage($scope);
    showHideGame($scope, ['registerFormDisp'], ['appMessageDisp', 'register_success', 'emailIdUnique']);

    _.extend($scope, configs);
    $scope.emailIdStatusReceived = '';

    if (typeof Recaptcha === 'undefined') {
        var captcha_script = document.createElement('script');
        captcha_script.setAttribute('src', 'http://www.google.com/recaptcha/api/js/recaptcha_ajax.js');
        document.head.appendChild(captcha_script);
        captcha_script.onload = function() {
            Recaptcha.create("6LcyZfMSAAAAAHxXTKjVqC2G6qike2rUDjQhj5rC", "captcha-container", {
                theme: "white",
                callback: Recaptcha.focus_response_field
            });
        };
    } else {
        Recaptcha.create("6LcyZfMSAAAAAHxXTKjVqC2G6qike2rUDjQhj5rC", "captcha-container", {
            theme: "white",
            callback: Recaptcha.focus_response_field
        });
    }
    $scope.loginRedirect = function() {
        loginRedirect($http, $location);
    };
    $scope.loginRedirect = function() {
        $location.url('/login');
    };

    $scope.register = function(user) {
        hideAppMessage($scope);
        showLoading($scope, [], ['appMessageDisp']);
        WebServiceHandler.register({
            'name': user.name,
            'email': user.emailId,
            'password': pidCrypt.MD5(user.password),
            'recaptcha_challenge_field': Recaptcha.get_challenge(),
            'recaptcha_response_field': Recaptcha.get_response()
        }).then(function(response) {
            if (response.status === 201) {
                showAppMessage($scope, $scope.REGISTER_SUCCESS, true);
                showHideGame($scope, ['register_success'], ['captchaError', 'registerFormDisp']);
            } else {
                showAppMessage($scope, $scope.REGISTER_FAILURE, false);
                showHideGame($scope, ['register_success'], ['captchaError', 'registerFormDisp']);
            }
            hideLoading();
        }, function(failureReason) {
            if (failureReason.status === 400 && (failureReason.data.message === 'captcha is not valid' || failureReason.data.message === 'Required field(s) recaptcha_response_field is missing or empty')) {
                Recaptcha.reload();
                $scope.captchaError = true;
            } else {
                showAppMessage($scope, $scope.REGISTER_FAILURE, false);
                showHideGame($scope, ['registerFormDisp'], ['captchaError']);
                $scope.loginForm.$setPristine(true);
                $scope.user = resetObjectKeysToEmpty(user);
            }
            hideLoading();
        });
    };
});

myApp.controller('LoginController', function($scope, WebServiceHandler, $http, $location) {
    _.extend($scope, configs);
    logoutIfAuthSet($http, $location);
    hideAppMessage($scope);
    showHideGame($scope, ['loginFormDisp'], ['resetSendEmailDisp']);

    $scope.login = function(user) {
        hideAppMessage($scope);
        var emailId = user.emailId;
        showLoading($scope, [], ['appMessageDisp']);
        WebServiceHandler.login({
            'email': user.emailId,
            'password': pidCrypt.MD5(user.password)
        }).then(function(response) {
            if (response.status === 200) {
                $http.defaults.headers.common['Authorization'] = response.data.api_key;
                $location.url('/categories');
                //present Logged in page
            } else if (response.status === 202) {
                showAppMessage($scope, $scope.ACCOUNT_NOT_ACTIVE, false);
                $scope.loginForm.$setPristine(true);
                $scope.user = resetObjectKeysToEmpty(user);
                $scope.resendVerifyInviteDisp = true;
                $scope.resetEmailId = emailId;
            }
            hideLoading();
        }, function() {
            showAppMessage($scope, $scope.LOGIN_FAIL, false);
            $scope.loginForm.$setPristine(true);
            $scope.user = resetObjectKeysToEmpty(user);
            hideLoading();
        });
    };

    $scope.showForgotPswd = function() {
        hideAppMessage($scope);
        showHideGame($scope, ['resetSendEmailDisp'], ['appMessageDisp', 'loginFormDisp']);
    };

    $scope.resetSendEmail = function(email) {
        hideAppMessage($scope);
        showLoading($scope, [], ['appMessageDisp']);
        WebServiceHandler.sendReset(email).then(function() {
            showAppMessage($scope, $scope.RESET_EMAIL_SENT, true);
            showHideGame($scope, ['loginFormDisp'], ['resetSendEmailDisp']);
            $scope.resetSendEmailForm.$setPristine(true);
            $scope.resetEmail = '';
            hideLoading();
        }, function() {
            showAppMessage($scope, $scope.RESET_EMAIL_SENT, true);
            showHideGame($scope, ['loginFormDisp'], ['resetSendEmailDisp']);
            $scope.resetSendEmailForm.$setPristine(true);
            $scope.resetEmail = '';
            hideLoading();
        });
    };

    $scope.resendVerifyInvite = function() {
        hideAppMessage($scope);
        var email = $scope.resetEmailId;
        showLoading($scope, [], ['appMessageDisp']);
        WebServiceHandler.resendVerifyInvite(email).then(function(response) {
            console.log(response);
            showAppMessage($scope, $scope.EMAIL_VERIFY_SENT, true);
            showHideGame($scope, ['resendVerifyInviteResponseDisp'], ['resendVerifyInviteDisp']);
            hideLoading();
        }, function(response) {
            console.log(response);
            showAppMessage($scope, $scope.EMAIL_VERIFY_SENT_FAIL, false);
            showHideGame($scope, ['resendVerifyInviteResponseDisp'], ['resendVerifyInviteDisp']);
            hideLoading();
        });
    };
});

myApp.controller('ResetController', function($scope, WebServiceHandler, $http, $location) {
    _.extend($scope, configs);
    logoutIfAuthSet($http, $location);
    if (keySet.resetKey) {
        if (key !== 'false') {
            showAppMessage($scope, $scope.PASSWORD_RESET, true);
            $scope.resetPswdObj = {'resetKey': key.split('***')[0], 'email': key.split('***')[1]};
            showHideGame($scope, ['resetFormDisp'], ['reset_success']);
            $scope.password_changed = $scope.PASSWORD_CHANGED;
        } else {
            showAppMessage($scope, $scope.PASSWORD_RESET_USED, false);
            showHideGame($scope, ['reset_success'], ['resetFormDisp']);
            $scope.password_changed = 'Reset link seems expired. Please request it again.';
        }
    } else if (keySet.activateUser) {
        if (key === '200') {
            showAppMessage($scope, $scope.USER_VERIFIED, true);
        } else if (key === '203') {
            showAppMessage($scope, $scope.USER_ALREADY_VERIFIED, true);
        } else {
            showAppMessage($scope, $scope.USER_VERIFICATION_ERR, false);
        }
        showHideGame($scope, ['reset_success'], ['resetFormDisp']);
        $scope.password_changed = 'Please login.';
    } else {
        hideAppMessage($scope);
        showHideGame($scope, ['reset_success'], ['resetFormDisp']);
        $scope.password_changed = 'Please login.';
    }
    $scope.loginRedirect = function() {
        loginRedirect($http, $location);
    };
    $scope.resetPswd = function(resetPswdObj) {
        hideAppMessage($scope.$parent, true);
        showLoading($scope, [], ['appMessageDisp']);
        var pswd = resetPswdObj.newPassword;
        resetPswdObj.newPassword = pidCrypt.MD5(pswd);
        resetPswdObj.repeatPassword = pidCrypt.MD5(pswd);
        WebServiceHandler.resetPswd(resetPswdObj).then(function() {
            showHideGame($scope, ['reset_success'], ['resetFormDisp']);
            showAppMessage($scope, $scope.PASSWORD_CHANGED, true);
            $scope.resetForm.$setPristine(true);
            $scope.user = resetObjectKeysToEmpty(resetPswdObj);
            hideLoading();
        }, function() {
            showHideGame($scope, ['reset_success'], ['resetFormDisp']);
            showAppMessage($scope, $scope.PASSWORD_CHANGE_FAIL, false);
            $scope.password_changed = 'Login to the application.';
            $scope.resetForm.$setPristine(true);
            $scope.user = resetObjectKeysToEmpty(resetPswdObj);
            hideLoading();
        });
    };
});

myApp.controller('LogoutController', function($scope, $http, $location) {
    $scope.loginRedirect = function() {
        loginRedirect($http, $location);
    };
    _.extend($scope, configs);
    logoutIfAuthSet($http, $location);
});

myApp.controller('CategoryController', function($scope, WebServiceHandler, Data, $location, $http) {
    _.extend($scope, configs);
    loginIfAuthNotSet($http, $location);
    $scope.categories = [];
    $scope.actions = [];
//    showLoading($scope, [], ['appMessageDisp']);
    WebServiceHandler.getCategories().then(function(response) {
        var responseCtgs = response.data.message;
        $scope.categories = responseCtgs;
        Data.categories = $scope.categories;
        for (var n = 0; n < $scope.categories.length; n++) {
            $scope.actions.push({'delete': false, 'disabled': false});
        }
        hideLoading();
    }, function(response) {
        showAppMessage($scope, $scope.DATA_NOT_FOUND, false);
        console.log(response);
        hideLoading();
    });
    $scope.actionAddDisabled = false;
    $scope.editModel = {'ctgId': '', 'name': '', 'description': ''};
    $scope.deleteIndex = -1;
    $scope.editIndex = -1;
    showHideGame($scope, ['ctgDisp'], ['editCtgDisp', 'createCtgDisp']);

    $scope.logout = function() {
        logout($http, $location);
    };
    $scope.likeCategory = function(index) {
        hideAppMessage($scope);
        var flag = false;
        if (!$scope.categories[index].liked) {
            flag = true;
        }
        showLoading($scope, [], ['appMessageDisp']);
        WebServiceHandler.likeQuoteOrCtg($scope.categories[index].id, flag, 'ctg')
                .then(function(response) {
                    if (response.data.message) {
                        $scope.categories[index].liked = !$scope.categories[index].liked;
                        $scope.categories[index].likes = response.data.message.count;
                        Data.categories = $scope.categories;
                    }
                    hideLoading();
                }, function() {
                    showAppMessage($scope, $scope.SERVICE_ERROR, false);
                    hideLoading();
                });
    };
    $scope.editCategory = function(index) {
        hideAppMessage($scope);
        $scope.editModel = {
            'id': $scope.categories[index].id,
            'name': $scope.categories[index].name,
            'description': $scope.categories[index].description};
        $scope.editIndex = index;
        showHideGame($scope, ['editCtgDisp'], ['ctgDisp', 'createCtgDisp']);
    };
    $scope.cancelCategoryEdit = function() {
        showHideGame($scope, ['ctgDisp'], ['editCtgDisp', 'createCtgDisp']);
        $scope.editForm.$setPristine(true);
    };
    $scope.updateCategory = function(editModel) {
        hideAppMessage($scope);
        showLoading($scope, [], ['appMessageDisp']);
        WebServiceHandler.updateCategory(
                {'name': HtmlEncode(editModel.name), 'description': HtmlEncode(editModel.description)},
        editModel.id).then(function(response) {
            var responseCtg = response.data.message;
            if (responseCtg) {
                $scope.categories[$scope.editIndex] = responseCtg;
                Data.categories = $scope.categories;
            }
            $scope.createForm.$setPristine(true);
            showHideGame($scope, ['ctgDisp'], ['editCtgDisp', 'createCtgDisp']);
            hideLoading();
        }, function() {
            showAppMessage($scope, $scope.UPDATE_ERROR, false);
            hideLoading();
            $scope.editForm.$setPristine(true);
            showHideGame($scope, ['ctgDisp'], ['editCtgDisp', 'createCtgDisp']);
        });
    };
    $scope.deleteCategoryDialog = function(index) {
        hideAppMessage($scope);
        disableButtons($scope, index, true);
        $scope.deleteIndex = index;
    };
    $scope.deleteCtg = function() {
        hideAppMessage($scope);
        var deleteId = $scope.categories[$scope.deleteIndex].id;
        showLoading($scope, [], ['appMessageDisp']);
        WebServiceHandler.deleteCategory(deleteId).then(function(response) {
            var responseCtg = response.data.message;
            if (responseCtg) {
                $scope.categories.splice($scope.deleteIndex, 1);
                Data.categories = $scope.categories;
            }
            $scope.deleteDialogDisp = false;
            disableButtons($scope, $scope.deleteIndex, false);
            $scope.deleteIndex = -1;
            hideLoading();
        }, function() {
            showAppMessage($scope, $scope.DELETE_ERROR, false);
            hideLoading();
        });
    };
    $scope.cancelDeleteCtg = function() {
        hideAppMessage($scope);
        $scope.deleteDialogDisp = false;
        disableButtons($scope, $scope.deleteIndex, false);
        $scope.deleteIndex = -1;
    };
    $scope.addCategoryDialog = function() {
        hideAppMessage($scope);
        showHideGame($scope, ['createCtgDisp'], ['ctgDisp', 'editCtgDisp']);
    };
    $scope.cancelCategoryCreate = function() {
        hideAppMessage($scope);
        $scope.createForm.$setPristine(true);
        showHideGame($scope, ['ctgDisp'], ['editCtgDisp', 'createCtgDisp']);
    };
    $scope.createCategory = function(createModel) {
        hideAppMessage($scope);
        var ctg = {
            'name': HtmlEncode(createModel.name),
            'description': HtmlEncode(createModel.description)
        };
        showLoading($scope, [], ['appMessageDisp']);
        WebServiceHandler.createCategory(ctg).then(function(response) {
            var responseCtg = response.data.message;
            console.log(responseCtg);
            $scope.categories.unshift(responseCtg);
            Data.categories = $scope.categories;
            $scope.actions.push({'delete': false, 'disabled': false});
            $scope.createForm.$setPristine(true);
            showHideGame($scope, ['ctgDisp'], ['editCtgDisp', 'createCtgDisp']);
            hideLoading();
        }, function() {
            showAppMessage($scope, $scope.CREATE_ERROR, false);
            $scope.createForm.$setPristine(true);
            showHideGame($scope, ['ctgDisp'], ['editCtgDisp', 'createCtgDisp']);
            hideLoading();
        });
    };
    $scope.displayQuotes = function(index) {
        hideAppMessage($scope);
        Data.categorySelected = {'id': $scope.categories[index].id, 'index': index};
        Data.categories = $scope.categories;
        $location.url('/quotes');
    };

});
myApp.controller('QuotesController', function($scope, WebServiceHandler, Data, $location, $http) {
    _.extend($scope, configs);
    loginIfAuthNotSet($http, $location);
    if (typeof Data.categorySelected == 'undefined') {
        $location.url('/categories');
        Data.categorySelected = undefined;
        return;
    }
    var ctgSelected = Data.categorySelected.id;
    $scope.headerTitle = Data.categories[Data.categorySelected.index].name;
    $scope.quotes = [];
    $scope.actions = [];
    showLoading($scope, [], ['appMessageDisp']);
    WebServiceHandler.getQuotes(ctgSelected).then(function(response) {
        $scope.quotes = response.data.message;
        Data.quotes = $scope.quotes;
        for (var n = 0; n < $scope.quotes.length; n++) {
            $scope.actions.push({'delete': false, 'disabled': false});
        }
        hideLoading();
    }, function(response) {
        console.log(response);
        hideLoading();
    });

    $scope.actionAddDisabled = false;
    $scope.editModel = {'id': '', 'description': ''};
    $scope.deleteIndex = -1;
    $scope.editIndex = -1;
    $scope.editModel = resetObjectKeysToEmpty($scope.editModel);
    showHideGame($scope, ['quotesDisp'], ['createQuotesDisp', 'editQuotesDisp']);
    $scope.backToCtg = function() {
        $location.url('/categories');
    };
    $scope.logout = function() {
        logout($http, $location);
    };
    $scope.likeQuote = function(index) {
        hideAppMessage($scope);
        var flag = false;
        if (!$scope.quotes[index].liked) {
            flag = true;
        }
        showLoading($scope, [], ['appMessageDisp']);
        WebServiceHandler.likeQuoteOrCtg(
                $scope.quotes[index].id, flag, 'quote').then(function(response) {
            if (response.data.message) {
                $scope.quotes[index].liked = !$scope.quotes[index].liked;
                $scope.quotes[index].likes = response.data.message.count;
                Data.quotes = $scope.quotes;
            }
            hideLoading();
        }, function() {
            showAppMessage($scope, $scope.SERVICE_ERROR, false);
            hideLoading();
        });
    };
    $scope.addQuoteDialog = function() {
        hideAppMessage($scope);
        showHideGame($scope, ['createQuotesDisp'], ['quotesDisp', 'editQuotesDisp']);
    };
    $scope.cancelQuoteCreate = function(createModel) {
        hideAppMessage($scope);
        $scope.createModel = resetObjectKeysToEmpty(createModel);
        $scope.createForm.$setPristine(true);
        showHideGame($scope, ['quotesDisp'], ['createQuotesDisp', 'editQuotesDisp']);
    };
    $scope.createQuote = function(createModel) {
        hideAppMessage($scope);
        var quote = {
            'quote': HtmlEncode(createModel.quote),
            'wrNctg_ref': ctgSelected
        };
        showLoading($scope, [], ['appMessageDisp']);
        WebServiceHandler.createQuote(quote).then(function(response) {
            var responseQuote = response.data.message;
            console.log(responseQuote);
            $scope.quotes.unshift(responseQuote);
            Data.quotes = $scope.quotes;
            $scope.actions.push({'delete': false, 'disabled': false});
            $scope.createModel = resetObjectKeysToEmpty(createModel);
            $scope.createForm.$setPristine(true);
            showHideGame($scope, ['quotesDisp'], ['createQuotesDisp', 'editQuotesDisp']);
            hideLoading();
        }, function() {
            showAppMessage($scope, $scope.CREATE_ERROR, false);
            showHideGame($scope, ['quotesDisp'], ['createQuotesDisp', 'editQuotesDisp']);
            hideLoading();
        });
    };
    $scope.editQuote = function(index) {
        hideAppMessage($scope);
        $scope.editModel = {
            'quoteId': $scope.quotes[index].id,
            'quote': $scope.quotes[index].text
        };
        $scope.editIndex = index;
        showHideGame($scope, ['editQuotesDisp'], ['quotesDisp', 'createQuotesDisp']);
    };
    $scope.updateQuote = function(editModel) {
        hideAppMessage($scope);
        showLoading($scope, [], ['appMessageDisp']);
        WebServiceHandler.updateQuote({'quote': HtmlEncode(editModel.quote)},
        editModel.quoteId).then(function(response) {
            var responseQuote = response.data.message;
            if (responseQuote) {
                $scope.quotes[$scope.editIndex] = responseQuote;
                Data.quotes = $scope.quotes;
            }
            $scope.createForm.$setPristine(true);
            showHideGame($scope, ['quotesDisp'], ['createQuotesDisp', 'editQuotesDisp']);
            hideLoading();
        }, function() {
            showAppMessage($scope, $scope.UPDATE_ERROR, false);
            hideLoading();
            $scope.editForm.$setPristine(true);
            showHideGame($scope, ['quotesDisp'], ['createQuotesDisp', 'editQuotesDisp']);
        });
    };
    $scope.cancelQuoteEdit = function() {
        hideAppMessage($scope);
        $scope.editForm.$setPristine(true);
        showHideGame($scope, ['quotesDisp'], ['editQuotesDisp', 'createQuotesDisp']);
    };
    $scope.deleteQuoteDialog = function(index) {
        hideAppMessage($scope);
        disableButtons($scope, index, true);
        $scope.deleteIndex = index;
    };
    $scope.deleteQuote = function() {
        hideAppMessage($scope);
        var deleteId = $scope.quotes[$scope.deleteIndex].id;
        showLoading($scope, [], ['appMessageDisp']);
        WebServiceHandler.deleteQuote(deleteId).then(function(response) {
            var responseDel = response.data.message;
            if (responseDel) {
                $scope.quotes.splice($scope.deleteIndex, 1);
                Data.quotes = $scope.quotes;
            }
            disableButtons($scope, $scope.deleteIndex, false);
            $scope.deleteIndex = -1;
            hideLoading();
        }, function() {
            showAppMessage($scope, $scope.DELETE_ERROR, false);
            disableButtons($scope, $scope.deleteIndex, false);
            $scope.deleteIndex = -1;
            hideLoading();
        });
    };
    $scope.cancelDeleteQuote = function() {
        hideAppMessage($scope);
        disableButtons($scope, $scope.deleteIndex, false);
        $scope.deleteIndex = -1;
    };
});
myApp.controller('HomeController', function($scope, WebServiceHandler, $http, $location, Data) {
    logoutIfAuthSet($http, $location);
    $scope.readCategories = [];
    showLoading($scope, [], []);
    WebServiceHandler.getReadCategories().then(function(response) {
        if (response.data) {
            $scope.readCategories = response.data;
        }
        hideLoading();
    }, function() {
        hideLoading();
    });
    $scope.displayQuotes = function(index) {
        Data.readCategorySelected = {'id': $scope.readCategories[index].id, 'index': index};
        Data.readCategories = $scope.readCategories;
        $location.url('/readQuotes');
    };
    $scope.loginRedirect = function() {
        loginRedirect($http, $location);
    };
});
myApp.controller('HomeQuotesController', function($scope, WebServiceHandler, $http, $location, Data) {
    logoutIfAuthSet($http, $location);
    $scope.readQuotes = [];
    if (typeof Data.readCategorySelected == 'undefined') {
        $location.url('/');
        Data.readCategorySelected = undefined;
        return;
    }
    var ctgSelected = Data.readCategorySelected.id;
    $scope.headerTitle = Data.readCategories[Data.readCategorySelected.index].name;
    $scope.quotes = [];
    showLoading($scope, [], []);
    WebServiceHandler.getReadQuotes(ctgSelected).then(function(response) {
        $scope.readQuotes = response.data;
        Data.quotes = $scope.readQuotes;
        hideLoading();
    }, function() {
        hideLoading();
    });
    $scope.loginRedirect = function() {
        loginRedirect($http, $location);
    };
    $scope.backToReadCtgs = function() {
        $location.url('/');
    };
});