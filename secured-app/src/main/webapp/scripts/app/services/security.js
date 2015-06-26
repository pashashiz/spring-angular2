angular.module('securityServices', []).factory('AuthService', ['$http',
    function($http) {
        return {
            login: function(username, password) {
                var headers = {'Authorization': "Basic " + btoa(username + ":" + password)};
                return $http.get('user', {headers : headers});
            },
            logout: function() {
                return $http.get('logout');
            },
            getUser: function() {
                return $http.get('user');
            }
        };
    }
]);