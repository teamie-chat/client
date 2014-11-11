angular.module('tChat').directive('tChatMessages', [
  function() {

    'use strict';

    function postLink(scope, iElement) {
      if (!scope.messages) {
        throw new Error('Cannot find messages in scope to render.');
      }

      iElement.slimScroll({
        height: 'auto',
        allowPageScroll: false,
        start: 'bottom',
        alwaysVisible: false,
        position: 'right'
      });

      scope.$watchCollection('messages', function(newValue) {
        if (angular.isUndefined(newValue)) {
          return;
        }
        iElement.slimScroll().slimScroll({
          scrollTo: iElement.prop('scrollHeight')
        });
      });

    }

    return {
      restrict: 'E',
      replace: true,
      templateUrl: '/src/partials/t-chat-messages.html',
      link: postLink
    };

  }
]);
