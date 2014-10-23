angular.module('tChat').controller('GroupListController',
  [ '$scope', 'ThreadService',
    function($scope, ThreadService) {

      'use strict';

      $scope.data = {
        search: ''
      };

      $scope.groups = [
        { gid: 1, name: 'Physics Class' },
        { gid: 2, name: 'English Class' }
      ];

      $scope.haveOpenThread = ThreadService.doesGroupHaveThread;

      $scope.chat = function(group) {
        var threadId = $scope.haveOpenThread(group);
        if (!threadId) {
          ThreadService.openThread('group', [ group ]);
        }
        else {
          ThreadService.hoistThread(threadId);
        }
      };

    }
  ]
);
