var myApp = angular.module('myApp', ['ngRoute', 'ngAnimate']);
// configure our routes
myApp.config(function($routeProvider) {
    $routeProvider
            .when('/', {
                templateUrl: 'templates/home.html',
                controller: 'HomeController'
            });
});