'use strict';

angular.module('tChat')
  .directive('tChatWidget', function() {
    return {
      restrict: 'A',
      replace: true,
      scope: {
        title: '@'
      },
      templateUrl: 'src/partials/directives/t-chat-widget.html'
    }
  });