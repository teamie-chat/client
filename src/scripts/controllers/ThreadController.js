angular.module('tChat').controller('ThreadController', [ '$scope', '$log',
  'ThreadService',
  function($scope, $log, ThreadService) {
    'use strict';

    // Model
    // $scope.thread (passed in by the t-chat-threads directive.)

    $scope.messages = [];

    function sendMessage(text) {
      ThreadService.sendMessage($scope.thread.tid, {
        text: text,
        timestamp: new Date().getTime()
      });
    }

    function onActiveThreadReset(activeThread) {
      $scope.ui.active =
        ( activeThread && (activeThread.tid === $scope.thread.tid) );
    }

    function onMessageQueued(message) {
      $scope.messages.push(message);
    }

    // The different UI states that the thread can be in.
    $scope.ui = {
      minimized: 0,
      highlighted: 0,
      users: [],
      chat: null
    };

    $scope.activeThread = ThreadService.getActiveThread;

    $scope.focus = function() {
      if (!$scope.ui.active) {
        $log.log( 'activating thread ' + $scope.thread.tid );
        $scope.ui.active = true;
        ThreadService.setActiveThread($scope.thread);
      }
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

    $scope.onKeyup = function($event) {
      if (($event.keyCode === 13) && !!$scope.ui.chat) {
        sendMessage($scope.ui.chat);
        $scope.ui.chat = null;
      }
    };

    ThreadService.on('resetActiveThread', onActiveThreadReset);
    ThreadService.on('thread.' + $scope.thread.tid + '.message', onMessageQueued);

    $scope.$on('$destroy', function() {
      ThreadService.off('activeThread', onActiveThreadReset);
      ThreadService.off('thread.' + $scope.thread.tid + '.message');
    });

  }

]);
