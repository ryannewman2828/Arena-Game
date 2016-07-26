(function () {

    angular
        .module('meanApp')
        .controller('profileViewCtrl', profileViewCtrl);

    profileViewCtrl.$inject = ['$scope','$window','meanData','authentication'];
    function profileViewCtrl($scope, $window, meanData, authentication) {

        $scope.userSidebar = {};

        $scope.isLoggedIn = authentication.isLoggedIn();

        $scope.logOut = function () {
            console.log('logout');
            authentication.logout()
            $window.location.href = '/';
        }
        
        if($scope.isLoggedIn) {
            meanData.getProfile()
                .success(function (data) {
                    $scope.userSidebar = data;
                })
                .error(function (e) {
                    console.log(e);
                });
        }
    }

})();