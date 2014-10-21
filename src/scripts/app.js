(function() {
  'use strict';
  
  var app = angular.module('tChat', [
    'ui.bootstrap'
  ]);

  app.run([ 'ThreadService', function(ThreadService) {

    // -- Demo content -- //

    var users, groups;

    users = [
      { name: 'Tom' },
      { name: 'Dick' },
      { name: 'Harry' }
    ];
    groups = [ { name: 'Classroom' } ];

    ThreadService.openThread('direct', [ users[0] ]);
    ThreadService.openThread('multi', [ users[1], users[2] ]);
    ThreadService.openThread('group', [ groups[0] ]);

    // -- Demo content -- //

  }]);
  
})();