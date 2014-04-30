'use strict';

angular.module('lwaAdminApp')
.controller('MainCtrl', function ($scope) {
	$scope.$emit('tabChange','demand');
});
