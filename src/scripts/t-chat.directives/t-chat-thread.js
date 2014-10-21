angular.module('tChat').directive('tChatThread', [ '$log', function($log) {

  'use strict';

  return {
    restrict: 'A',
    replace: true,
    scope: {
      thread: '='
    },
    templateUrl: 'src/partials/directives/t-chat-thread.html',
    controller: 'ThreadController'
  };

}]);