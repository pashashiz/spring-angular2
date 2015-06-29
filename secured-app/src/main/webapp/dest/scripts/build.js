angular.module('securedApp', ['ngRoute', 'securityServices'])
    .config(function($routeProvider, $httpProvider) {
        $routeProvider.when('/', {
            templateUrl : 'view/home.html',
            controller : 'HomeCtrl'
        }).when('/login', {
            templateUrl : 'view/login.html',
            controller : 'LoginCtrl'
        }).otherwise('/');
        // With the following header Spring Security responds to it by not sending a “WWW-Authenticate” header
        // in a 401 response, and thus the browser will not pop up an authentication dialog
        $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
    });
angular.module('securedApp')
    .controller('HomeCtrl', ['$location', '$rootScope', '$scope', 'AuthService',
        function($location, $rootScope, $scope, AuthService) {
            $rootScope.location = "home";
            if (!$rootScope.authenticated || !$rootScope.principal) {
                AuthService.getUser()
                    .success(function(data) {
                        $rootScope.principal = data;
                        $rootScope.authenticated = true;
                        $location.path("/");
                    }).error(function() {
                        $rootScope.authenticated = false;
                        $location.path("/login");
                    });
            }
        }
    ]);
angular.module('securedApp')
    .controller('LoginCtrl', ['$location', '$rootScope', '$scope', 'AuthService',
        function($location, $rootScope, $scope, AuthService) {
            $rootScope.location = "login";
            $scope.login = function() {
                AuthService.login($scope.credentials.username, $scope.credentials.password)
                    .success(function(data) {
                        $rootScope.principal = data;
                        $rootScope.authenticated = true;
                        $scope.error = false;
                        $location.path("/");
                    }).error(function() {
                        $rootScope.authenticated = false;
                        $scope.error = true;
                        $location.path("/login");
                    });
            }
        }
    ]);
angular.module('securedApp')
    .controller('NavigationCtrl', ['$location', '$rootScope', '$scope', 'AuthService',
        function($location, $rootScope, $scope, AuthService) {
            $scope.logout = function() {
                AuthService.logout().finally(
                    function () {
                        $rootScope.authenticated = false;
                        $location.path("/login");
                    })
            }
        }
    ]);
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