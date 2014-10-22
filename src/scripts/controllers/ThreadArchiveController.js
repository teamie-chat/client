angular.module('tChat').controller('ThreadArchiveController', [ '$scope',
  function($scope) {

    'use strict';

    $scope.threads = [
      {
        tid: 1,
        title: 'Physics Class',
        lastMessage: 'Bye guys'
      },
      {
        tid: 2,
        title: 'Ravi, Barack',
        lastMessage: 'See you. Lets catch up sometime.'
      }
    ];

  }

]);
