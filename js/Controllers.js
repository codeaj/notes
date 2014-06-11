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