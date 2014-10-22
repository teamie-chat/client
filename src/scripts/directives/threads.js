angular.module('tChat').directive('tChatThreads', [ 'ThreadService',
  function(ThreadService) {

    'use strict';

    function postLink(scope) {
      scope.threads = ThreadService.getOpenedThreads;
    }

    return {
      restrict: 'A',
      replace: true,
      scope: {},
      templateUrl: '/src/partials/t-chat-threads.html',
      link: postLink
    };

  }
]);
