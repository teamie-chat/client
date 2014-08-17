'use strict';

angular.module('tChat')
  .directive('tChatThread', function() {
    return {
      restrict: 'A',
      replace: true,
      scope: {
        title: '@'
      },
      templateUrl: 'src/partials/directives/t-chat-thread.html',
      controller: 'ThreadController'
    }
  });