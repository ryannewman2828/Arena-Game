(function () {

    angular
        .module('plan')
        .service('authentication', authentication);

    authentication.$inject = ['$http', '$window'];
    function authentication ($http, $window) {

        var saveToken = function (token) {
            $window.localStorage['token'] = token;
        };

        var getToken = function () {
            return $window.localStorage['token'];
        };

        var isLoggedIn = function() {
            var token = getToken();
            var payload;

            if(token){
                payload = token.split('.')[1];
                payload = $window.atob(payload);
                payload = JSON.parse(payload);

                return payload.exp > Date.now() / 1000;
            } else {
                return false;
            }
        };

        var currentUser = function() {
            if(isLoggedIn()){
                var token = getToken();
                var payload = token.split('.')[1];
                payload = $window.atob(payload);
                payload = JSON.parse(payload);
                return {
                    name : payload.username
                };
            }
        };

        var register = function(user) {
            return $http.post('/api/register', user).success(function(data){
                saveToken(data.token);
                $window.localStorage['id'] = currentId().id;
            });
        };

        var login = function(user) {
            return $http.post('/api/login', user).success(function(data) {
                saveToken(data.token);
                $window.localStorage['id'] = currentId().id;
            });
        };

        var currentId = function () {
            if(isLoggedIn()){
                var token = getToken();
                var payload = token.split('.')[1];
                payload = $window.atob(payload);
                payload = JSON.parse(payload);
                return {
                    id : payload._id
                };
            }
        };

        var logout = function() {
            $window.localStorage.removeItem('token');
        };

        return {
            currentUser : currentUser,
            saveToken : saveToken,
            getToken : getToken,
            isLoggedIn : isLoggedIn,
            register : register,
            login : login,
            logout : logout
        };
    }

})();