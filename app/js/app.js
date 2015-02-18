'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', [
        'angular-md5',
        'ngRoute',
        'ngAnimate',
        'userServices',
        'mgcrea.ngStrap',
        'formServices',
        'myApp.services',
        'myApp.controllers',
        'reusableThings',
        'fileServices',
        'ngCookies'
    ]).
    config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/home', {templateUrl: 'partials/ngHome.html', controller: 'HomeCtrl'});
        $routeProvider.when('/login', {templateUrl: 'partials/ngLogin.html', controller: 'LoginCtrl'});
        $routeProvider.when('/events', {templateUrl: 'partials/ngEvents.html', controller: 'EventCtrl'});
        $routeProvider.when('/register', {templateUrl: 'partials/ngRegister.html', controller: 'RegCtrl'});
        $routeProvider.when('/formcreator', {templateUrl: 'partials/ngForm.html', controller: 'FormCtrl'});
        $routeProvider.when('/viewform', {templateUrl: 'partials/ngView.html', controller: 'FormGCtrl'});
        $routeProvider.when('/dash', {templateUrl: 'partials/ngDash.html', controller: 'DashCtrl'});
        $routeProvider.when('/thanks', {templateUrl: 'partials/ngThanks.html', controller: 'ThanksCtrl'});
        $routeProvider.when('/select', {templateUrl: 'partials/ngSelect.html', controller: 'SelectCtrl'});
        $routeProvider.when('/users', {templateUrl: 'partials/ngUsers.html', controller: 'UsersCtrl'});
        $routeProvider.when('/policy', {templateUrl: 'partials/ngPolicy.html', controller: 'ThanksCtrl'});
        $routeProvider.when('/upload', {templateUrl: 'partials/ngUpload.html', controller: 'UploadCtrl'});
        $routeProvider.otherwise({redirectTo: '/login'});

    }]);
