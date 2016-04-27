var app = angular.module('TicTacToeApp', ['ngRoute']);

app.config(function ($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
            controller: 'HomeController',
            title: 'Home',
            templateUrl: '/views/home.html'
        })
        .otherwise({
            redirectTo: '/'
        });

    $locationProvider.html5Mode(true).hashPrefix('!');
});