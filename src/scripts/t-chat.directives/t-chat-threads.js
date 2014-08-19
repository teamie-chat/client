'use strict';

angular.module('tChat')
  .directive('tChatThreads', function() {
    return {
      restrict: 'A',
      replace: false,
      templateUrl: 'src/partials/directives/t-chat-threads.html',
      controller: 'ThreadManagerController'
    }
  });