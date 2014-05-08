'use strict';

angular.module('lwaAdminApp')
.controller('DemandCtrl', function ($scope,$modal) {
	$scope.$emit('tabChange','demand');

  $scope.sendBulkPerk = function() {
    var modalInstance = $modal.open({
      templateUrl: 'offerDalog.html',
      controller: OfferInstanceCtrl,
      resolve: {
        data: function() {
          return {
            low: $scope.price_low,
            high: $scope.price_high,
            count: $scope.user_count,
            discount: 100
          };
        }
      }
    });

    modalInstance.result.then(function () {
    }, function () {
    });
  };
});
