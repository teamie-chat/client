angular.module('tChat').controller('ThreadController', [ '$scope', '$log',
  'ThreadService',
  function($scope, $log, ThreadService) {
    'use strict';

    // Model
    // $scope.thread (passed in by the t-chat-threads directive.)

    function onActiveThreadReset(activeThread) {
      $scope.ui.active =
        ( activeThread && (activeThread.tid === $scope.thread.tid) );
    }

    // The different UI states that the thread can be in.
    $scope.ui = {
      minimized: 0,
      highlighted: 0,
      users: []
    };

    $scope.activeThread = ThreadService.getActiveThread;

    $scope.focus = function() {
      $log.log( 'activating thread ' + $scope.thread.tid );
      if (!$scope.ui.active) {
        $scope.ui.active = true;
      }
      ThreadService.setActiveThread($scope.thread);
    };

    $scope.blur = function() {
      $scope.ui.active = false;
    };

    $scope.close = function() {
      $log.log( 'close thread ' + $scope.thread.tid );
      ThreadService.closeThread($scope.thread.tid);
    };

    $scope.mute = function() {
      // -- Stub --
    };

    $scope.addUsers = function(users) {
      users = users || [];
      // -- Stub --
    };

    $scope.getMessages = function(messageId, count) {
      count = count || 25;
      // -- Stub --
    };

    $scope.removeUser = function() {
      // -- Stub --
    };

    ThreadService.on('resetActiveThread', onActiveThreadReset);

    $scope.$on('$destroy', function() {
      ThreadService.off('activeThread', onActiveThreadReset);
    });

  }

]);
