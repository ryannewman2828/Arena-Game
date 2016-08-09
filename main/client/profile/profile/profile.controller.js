(function() {

    angular
        .module('meanApp')
        .controller('profileCtrl', profileCtrl);

    profileCtrl.$inject = ['$scope', '$routeParams','$route', '$uibModal', 'meanData', 'meanConfig'];
    function profileCtrl($scope, $routeParams, $route, $uibModal, meanData, meanConfig) {

        var id = $routeParams.id;
        $scope.user = {};
        $scope.displayFriends = true;
        $scope.indices = [];

        if(id){
            meanData.getProfileById(id)
                .success(function (data) {
                    $scope.user = data;

                })
                .error(function (err) {
                    console.log(err);
                })
                .then(function () {
                    meanData.getProfile()
                        .success(function (innerData) {
                            $scope.myUsername = innerData.username;
                            $scope.myProfile = innerData.username === data.username;
                        })
                        .error(function (err) {
                            console.log(err)
                        });
                })
                .then(function () {
                   meanConfig.getCollection($scope.user.username)
                        .success(function (data) {
                            $scope.collection = data.collection;
                        })
                       .error(function (err) {
                           console.log(err);
                       })
                       .then(function () {
                           for(var i = 0; i < $scope.collection.length; i += 4){
                               $scope.indices.push(i);
                           }
                       });
                });

        } else {
            meanData.getProfile()
                .success(function (data) {
                    $scope.user = data;
                    $scope.myProfile = true;
                })
                .error(function (e) {
                    console.log(e);
                })
                .then(function () {
                    meanConfig.getCollection($scope.user.username)
                        .success(function (data) {
                            $scope.collection = data.collection;
                        })
                        .error(function (err) {
                            console.log(err);
                        })
                        .then(function () {
                            for(var i = 0; i < $scope.collection.length; i += 4){
                                $scope.indices.push(i);
                            }
                        });
                });

        }
        
        $scope.open = function (size) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '/profile/profile/profile.message.modal.html',
                controller: 'ModalInstanceCtrl',
                size: size
            });

            modalInstance.result.then(function (message){
                meanData.sendMessage($scope.myUsername, $scope.user.username, message)
                    .error(function (err) {
                        console.log(err);
                    })
                    .then(function () {
                        console.log('Message sent correctly');
                    });
            });
        };
        
        $scope.addFriend = function () {
            meanData.addFriend($scope.myUsername, $scope.user.username)
                .error(function (err) {
                    console.log(err.error);
                    alert(err.error);
                })
                .then(function () {
                    alert('Friend request sent');
                    console.log('Friend Request sent');
                });
        };
        
        $scope.acceptFriend = function (friend) {
            meanData.acceptFriend(friend, $scope.user.username)
                .error(function (err) {
                    console.log(err);
                })
                .then(function () {
                    console.log('Friend request successfully accepted');
                    $route.reload();
                });
        };
        
        $scope.rejectFriend = function (friend) {
            meanData.rejectFriend(friend, $scope.user.username)
                .error(function (err) {
                    console.log(err);
                })
                .then(function () {
                    console.log('Friend request successfully rejected');
                    $route.reload();
                });
        };
        
        $scope.deleteFriend = function (friend) {
            meanData.deleteFriend(friend, $scope.user.username)
                .error(function (err) {
                    console.log(err);
                })
                .then(function () {
                    console.log('Friend successfully removed from list');
                    $route.reload();
                });
        }
    }

})();