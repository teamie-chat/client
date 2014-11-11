angular.module('tChat').directive('tChatMessages', [
  'THREAD_MESSAGE_BLOCK_WINDOW_MS',
  function(THREAD_MESSAGE_BLOCK_WINDOW_MS) {

    'use strict';

    function postLink(scope, iElement) {
      scope.thread = scope.thread || {};
      if (!scope.thread.messages) {
        throw new Error('Cannot find messages in scope to render.');
      }

      iElement.slimScroll({
        height: 'auto',
        allowPageScroll: false,
        start: 'bottom',
        alwaysVisible: false,
        position: 'right'
      });

      scope.$watchCollection('thread.messages', function(newValue) {
        if (angular.isUndefined(newValue)) {
          return;
        }
        iElement.slimScroll().slimScroll({
          scrollTo: iElement.prop('scrollHeight')
        });
      });

      scope.threadMessageBlockWindowMs = THREAD_MESSAGE_BLOCK_WINDOW_MS;
    }

    return {
      restrict: 'E',
      replace: true,
      templateUrl: '/src/partials/t-chat-messages.html',
      link: postLink
    };

  }
]);
