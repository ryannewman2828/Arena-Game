(function () {

    angular
        .module('meanApp')
        .controller('loginCtrl', loginCtrl);

    loginCtrl.$inject = ['$location', '$scope', 'authentication'];
    function loginCtrl($location, $scope, authentication) {

        $scope.credentials = {
            email : "",
            password : ""
        };

        $scope.onSubmit = function () {
            authentication
                .login($scope.credentials)
                .error(function(err){
                    alert(err);
                })
                .then(function(){
                    $location.path('profile');
                });
        };

    }

})();