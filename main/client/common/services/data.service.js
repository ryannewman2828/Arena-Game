(function() {

    angular
        .module('plan')
        .service('planData', planData);

    planData.$inject = ['$http', 'authentication'];
    function planData ($http, authentication) {

        var getProfile = function (username) {
            if (username) {
                return $http.get('/api/profile?user=' + username, {
                    headers: {
                        Authorization: 'Bearer ' + authentication.getToken()
                    }
                });
            } else {
                return $http.get('/api/profile', {
                    headers: {
                        Authorization: 'Bearer ' + authentication.getToken()
                    }
                });
            }
        };

        var getOnlineUsers = function () {
            return $http.get('/api/profile/online', {
                headers: {
                    Authorization: 'Bearer '+ authentication.getToken()
                }
            });
        };

        var getOnlineFriends = function () {
            return $http.get('/api/friends/online', {
                headers: {
                    Authorization: 'Bearer '+ authentication.getToken()
                }
            });
        };

        return {
            getProfile : getProfile,
            getOnlineUsers : getOnlineUsers,
            getOnlineFriends: getOnlineFriends
        };
    }

})();