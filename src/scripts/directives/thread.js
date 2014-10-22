angular.module('tChat').directive('tChatThread', [ function() {

  'use strict';

  return {
    restrict: 'A',
    replace: true,
    scope: {
      thread: '='
    },
    templateUrl: 'src/partials/t-chat-thread.html',
    controller: 'ThreadController'
  };

}]);
