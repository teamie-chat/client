'use strict';

angular.module('tChat')
  .controller('ThreadController', [ '$scope', 'ThreadService', function($scope, ThreadService) {

    // Model
    $scope.thread = ThreadService.fetchThread($scope.tid);

    // The different UI states that the thread can be in.
    $scope.ui = {
      close: 0,
      minimize: 0,
      highlight: 0
    };

    // For development, highlight a random thread every time.
    $scope.ui.highlight = (Math.floor(Math.random() * 10) > 5);

    $scope.$on('destroy', function() {
      // -- Stub -- //
    });

  }]);