angular.module('tChat').directive('tChatWidget', function() {

  'use strict';

  return {
    restrict: 'A',
    replace: true,
    scope: {
      title: '@'
    },
    templateUrl: 'src/partials/t-chat-widget.html'
  };

});
