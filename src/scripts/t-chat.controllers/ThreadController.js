'use strict';

angular.module('tChat')
  .controller('ThreadController', [ '$scope', function($scope) {

    $scope.title = $scope.title || 'Kanika Jain';
    $scope.body = '';

    // Model
    $scope.thread = {
      tid: '0',
      type: 'direct'
    };

    // The different UI states that the thread can be in.
    $scope.ui = {
      close: 0,
      minimize: 0,
      highlight: 0
    };

    // For development, highlight a random thread every time.
    var randomNo = Math.floor(Math.random() * 10);
    $scope.ui.highlight = (randomNo > 5);
    $scope.ui.id = randomNo;

    $scope.$on('destroy', function() {
      // -- Stub -- //
    });

  }]);