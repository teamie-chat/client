'use strict';

angular.module('tChat')
  .controller('ArchiveController', [ '$scope', function($scope) {
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
    
  }]);