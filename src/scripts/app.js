(function() {
  'use strict';

  var app = angular.module('tChat', [
    'ui.bootstrap',
    'angular-link-focus',
    'rt.eventemitter'
  ]);

  app.constant('VISIBLE_THREAD_COUNT', 3);

  app.run([ 'ThreadService', function(ThreadService) {

    // -- Demo content -- //

    var users;
    var groups;

    users = [
      { uid: 4, name: 'Tom' },
      { uid: 50, name: 'Dick' },
      { uid: 75, name: 'Harry' }
    ];
    groups = [ { gid: 7, name: 'Classroom' } ];

    ThreadService.openThread('direct', [ users[0] ], false);
    ThreadService.openThread('multi', [ users[1], users[2] ], false);
    ThreadService.openThread('group', [ groups[0] ], false);

    // -- Demo content -- //

  }]);

})();
