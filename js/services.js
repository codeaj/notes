myApp.factory('Data', function() {
    var data = {};
    return data;
});
myApp.factory('WebServiceHandler', function($q, $http) {

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
        callService: executeService
    };
});
