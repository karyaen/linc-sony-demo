'use strict';

angular.module('lwaAdminApp')
.controller('DemandCtrl', function ($scope,$modal) {
	$scope.$emit('tabChange','demand');
  $scope.open = function( user ) {
  	$scope.user = user;
    var modalInstance = $modal.open({
      templateUrl: 'myModalContent.html',
      controller: ModalInstanceCtrl,
      resolve: {
        user: function () {
          return $scope.user;
        }
      }
    });

    modalInstance.result.then(function () {
    }, function () {
    });
  };
});

var ModalInstanceCtrl = function ($scope, $modalInstance, user) {
  $scope.user = user;
  $scope.perksMode = false;

  $scope.sendPerk = function() {
    $scope.perksMode = true;
  }

  $scope.ok = function () {
    $modalInstance.close();
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
};