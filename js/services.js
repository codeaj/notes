myApp.factory('Data', function() {
    var data = {};
    return data;
});
myApp.factory('WebServiceHandler', function($q, $http) {

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
    var fetchSubjects = function() {
        var deferred = $q.defer();
        $http({
            method: "GET",
            url: SERVICE_ROOT + 'subject',
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

    var createSubject = function(subject) {
        var deferred = $q.defer();
        $http({
            method: "POST",
            url: SERVICE_ROOT + 'subject',
            data: subject,
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

    var editSubject = function(subject, id) {
        var deferred = $q.defer();
        $http({
            method: "PUT",
            url: SERVICE_ROOT + 'subject/' + id,
            data: subject,
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

    var editSubject = function(subject, id) {
        var deferred = $q.defer();
        $http({
            method: "PUT",
            url: SERVICE_ROOT + 'subject/' + id,
            data: subject,
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

    var executeService = function(payload) {
        var deferred = $q.defer();
        $http({
            method: payload[0],
            url: SERVICE_ROOT + payload[1],
            data: payload[2],
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
        createQuote: createNewQuote,
        updateQuote: updateTheQuote,
        deleteQuote: removeQuote,
        getReadCategories: getReadCtgs,
        getSubjects: fetchSubjects,
        addSubject: createSubject,
        updateSubject: editSubject,
        callService: executeService
    };
});
