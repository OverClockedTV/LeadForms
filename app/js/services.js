'use strict';

/* Services */


angular.module('myApp.services', []).
    value('version', '1.1_beta');


var userServices = angular.module('userServices', ['ngResource']);

userServices.factory('User', ['$resource', function ($resource) {
    return $resource('api/api.php?action=:action', {}, {
        create: {method: 'POST', params: {action: 'register'}},
        get: {method: 'POST', params: {action: 'auth'}},
        list: {method: 'POST', isArray: true, params: {action: 'listusers'}},
        delete: {method: 'POST', params: {action: 'deluser'}},
        change: {method: 'POST', params: {action: 'changepass'}}

    });


}]);


var formServices = angular.module('formServices', ['ngResource']);

formServices.factory('Form', ['$resource', function ($resource) {
    return $resource('api/api.php?action=:action', {}, {
        create: {method: 'POST', params: {action: 'createform'}},
        get: {method: 'POST', params: {action: 'retrieveform'}},
        submit: {method: 'POST', params: {action: 'submitform'}},
        list: {method: 'POST', isArray: true, params: {action: 'listforms'}},
        archive: {method: 'POST', params: {action: 'archive'}},
        delete: {method: 'POST', params: {action: 'delform'}}


    });


}]);

var dashServices = angular.module('dashServices', ['ngResource']);
dashServices.factory('Dash', ['$resource', function ($resource) {
    return $resource('api/api.php?action=:action', {}, {
        create: {method: 'POST', params: {action: 'createform'}},
        get: {method: 'GET', params: {action: 'retrieveform'}},
        submit: {method: 'POST', params: {action: 'submitform'}}


    });


}]);

var fileServices = angular.module('fileServices', ['ngResource']);
fileServices.factory('File', ['$resource', function ($resource) {
    return $resource('api/api.php?action=:action', {}, {
        upload: {method: 'POST', params: {action: 'upload'}},
        download: {method: 'POST', params: {action: 'download'}}

    });


}]);