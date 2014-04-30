'use strict';

angular.module('lwaAdminApp')
.controller('HomeCtrl', function($scope) {
	$scope.$emit('tabChange','overview');
});
