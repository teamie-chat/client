angular.module('tChat').filter('reverse', function() {
  'use strict';

  // http://stackoverflow.com/questions/15266671/angular-ng-repeat-in-reverse
  return function(items) {
    return items.slice().reverse();
  };

});