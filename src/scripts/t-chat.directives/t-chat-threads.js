angular.module('tChat').directive('tChatThreads', [ 'ThreadService', function(ThreadService) {

  'use strict';

  function postLink(scope, iElement, iAttrs) {
      scope.threads = ThreadService.getOpenedThreads;
  }

  return {
    restrict: 'A',
    replace: true,
    scope: {},
    templateUrl: 'src/partials/directives/t-chat-threads.html',
    link: postLink
  };

}]);