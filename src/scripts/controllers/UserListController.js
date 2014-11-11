angular.module('tChat').controller('UserListController', [ '$scope',
  'ThreadService',
  function($scope, ThreadService) {

    'use strict';

    $scope.data = {
      search: ''
    };

    $scope.users = [
      { uid: 1, name: 'Administrator' },
      { uid: 2, name: 'Alan Turing' }
    ];

    $scope.haveOpenThread = ThreadService.doesUserHaveThread;

    $scope.chat = function(user) {
      var threadId = $scope.haveOpenThread(user);
      if (!threadId) {
        ThreadService.openThread('direct', [ user ]);
      }
      else {
        ThreadService.hoistThread(threadId);
      }
    };
  }

]);
