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
