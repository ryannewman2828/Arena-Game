(function () {

    angular
        .module('meanApp')
        .controller('sidebarCtrl', sidebarCtrl);

    sidebarCtrl.$inject = ['$scope','$window','meanData','authentication'];
    function sidebarCtrl($scope, $window, meanData, authentication) {

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