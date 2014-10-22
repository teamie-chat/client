angular.module('tChat').controller('UserListController', [ '$scope',
  'ThreadService',
  function($scope, ThreadService) {

    'use strict';

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

    $scope.chat = function(user) {
      ThreadService.openThread('direct', [ user ]);
    };
  }

]);
