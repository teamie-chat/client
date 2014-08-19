'use strict';

angular.module('tChat')
  .controller('ThreadManagerController', [ '$scope', function($scope) {
    
    $scope.threads = [
      { tid: '1'  },
      { tid: '2'  },
      { tid: '3'  }
    ];

  }]);