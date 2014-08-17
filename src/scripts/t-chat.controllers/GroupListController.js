'use strict';

angular.module('tChat')
  .controller('GroupListController', [ '$scope', function($scope) {
    $scope.data = {
      search: ''
    };
    $scope.groups = [
      {
        uid: 1,
        name: 'Physics Class'
      },
      {
        uid: 2,
        name: 'English Class'
      }
    ];
    
  }]);