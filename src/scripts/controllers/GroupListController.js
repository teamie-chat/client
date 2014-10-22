angular.module('tChat').controller('GroupListController',
  [ '$scope', 'ThreadService',
    function($scope, ThreadService) {

      'use strict';

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

      $scope.chat = function(group) {
        ThreadService.openThread('group', [ group ]);
      };

    }
  ]
);
