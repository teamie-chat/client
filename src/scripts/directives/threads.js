angular.module('tChat').directive('tChatThreads', [ 'ThreadService',
  'VISIBLE_THREAD_COUNT',
  function(ThreadService, VISIBLE_THREAD_COUNT) {

    'use strict';

    function postLink(scope) {
      scope.threads = ThreadService.getOpenedThreads;
      scope.visibleThreadCount = VISIBLE_THREAD_COUNT;
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
