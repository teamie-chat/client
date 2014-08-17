'use strict';

angular.module('tChat')
  .controller('UserListController', [ '$scope', function($scope) {
    $scope.data = {
      search: ''
    };
    $scope.users = [
      {
        uid: 1,
        name: 'Administrator'
      },
      {
        uid: 2,
        name: 'Alan Turing'
      }
    ];
    
  }]);