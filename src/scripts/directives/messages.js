angular.module('tChat').directive('tChatMessages', [
  function() {

    'use strict';

    function postLink(scope, iElement, iAttrs) {
      if (!scope.messages) {
        throw new Error('Cannot find messages in scope to render them.');
      }
    }

    return {
      restrict: 'E',
      replace: true,
      templateUrl: '/src/partials/t-chat-messages.html',
      link: postLink
    };

  }
]);
