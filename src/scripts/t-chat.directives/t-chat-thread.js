'use strict';

angular.module('tChat')
  .directive('tChatThread', function() {
    return {
      restrict: 'A',
      replace: false,
      scope: {
        tid: '@'
      },
      templateUrl: 'src/partials/directives/t-chat-thread.html',
      controller: 'ThreadController'
    }
  });