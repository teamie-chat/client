(function() {
  'use strict';

  var app = angular.module('tChat', [
    'ui.bootstrap'
  ]);

  app.run([ 'ThreadService', function(ThreadService) {

    // -- Demo content -- //

    var users;
    var groups;

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

angular.module('tChat').directive('tChatThreads', [ 'ThreadService',
  function(ThreadService) {

    'use strict';

    function postLink(scope) {
      scope.threads = ThreadService.getOpenedThreads;
    }

    return {
      restrict: 'A',
      replace: true,
      scope: {},
      templateUrl: '/src/partials/t-chat-threads.html',
      link: postLink
    };

  }
]);

angular.module('tChat').directive('tChatThread', [ function() {

  'use strict';

  return {
    restrict: 'A',
    replace: true,
    scope: {
      thread: '='
    },
    templateUrl: '/src/partials/t-chat-thread.html',
    controller: 'ThreadController'
  };

}]);

angular.module('tChat').directive('tChatWidget', function() {

  'use strict';

  return {
    restrict: 'A',
    replace: true,
    scope: {
      title: '@'
    },
    templateUrl: '/src/partials/t-chat-widget.html'
  };

});

angular.module('tChat').controller('ThreadController', [ '$scope', '$log',
  'ThreadService',
  function($scope, $log, ThreadService) {
    'use strict';

    // Model
    // $scope.thread (passed in by the t-chat-threads directive.)

    // The different UI states that the thread can be in.
    $scope.ui = {
      minimized: 0,
      highlighted: 0,
      users: []
    };

    $scope.close = function() {
      $log.log('close thread ' + $scope.thread.tid);
      ThreadService.closeThread($scope.thread.tid);
    };

    $scope.mute = function() {
      // -- Stub --
    };

    $scope.addUsers = function(users) {
      users = users || [];
      // -- Stub --
    };

    $scope.getMessages = function(messageId, count) {
      count = count || 25;
      // -- Stub --
    };

    $scope.removeUser = function() {
      // -- Stub --
    };

    $scope.$on('$destroy', function() {
      $log.log('thread ' + $scope.thread.tid + ' has been destroyed');
    });

  }

]);

angular.module('tChat').controller('UserListController', [ '$scope',
  'ThreadService',
  function($scope, ThreadService) {

    'use strict';

    $scope.data = {
      search: ''
    };

    $scope.users = [
      {
        uid: 1,
        name: 'Administrator'
      },
      {
        uid: 2,
        name: 'Alan Turing'
      }
    ];

    $scope.chat = function(user) {
      ThreadService.openThread('direct', [ user ]);
    };
  }

]);

angular.module('tChat').controller('GroupListController',
  [ '$scope', 'ThreadService',
    function($scope, ThreadService) {

      'use strict';

      $scope.data = {
        search: ''
      };

      $scope.groups = [
        {
          uid: 1,
          name: 'Physics Class'
        },
        {
          uid: 2,
          name: 'English Class'
        }
      ];

      $scope.chat = function(group) {
        ThreadService.openThread('group', [ group ]);
      };

    }
  ]
);

angular.module('tChat').controller('ArchiveController', [ '$scope',
  function($scope) {

    'use strict';

    $scope.threads = [
      {
        tid: 1,
        title: 'Physics Class',
        lastMessage: 'Bye guys'
      },
      {
        tid: 2,
        title: 'Ravi, Barack',
        lastMessage: 'See you. Lets catch up sometime.'
      }
    ];

  }

]);

angular.module('tChat').filter('reverse', function() {

  'use strict';

  // http://stackoverflow.com/questions/15266671/angular-ng-repeat-in-reverse
  return function(items) {
    return items.slice().reverse();
  };

});

angular.module('tChat').factory('ThreadService', [ '$log', function($log) {

  'use strict';

  var fakeTid = 0;
  var openThreads = [];

  function getTempTid() {
    return 'temp.' + (++fakeTid);
  }

  // function getOpenedThread(tid) {
  //   var _thread;
  //   _.every(openThreads, function(thread) {
  //     if (thread.tid === tid) {
  //       _thread = thread;
  //       return false;
  //     }
  //     return true;
  //   });
  //   return _thread;
  // }

  function getOpenedThreads() {
    return openThreads;
  }

  function generateDirectThreadTitle(user) {
    return user.name;
  }

  function generateMultiThreadTitle(users) {
    // Dick (when others have left)
    // Tom, Dick & you.
    // Tom, Dick, you & 4 others.
    if (users.length === 1) {
      return generateDirectThreadTitle(users[0]);
    }
    else if (users.length === 2) {
      return _.str.sprintf('%s, %s & you', users[0].name, users[1].name);
    }
    else if (users.length > 2) {
      return _.str.sprintf('%s, %s, you & %d others',
        users[0].name, users[1].name, users.length - 1);
    }
    else {
      $log.warn( 'multi-user thread has ' + users.length + ' users.' );
      return '';
    }
  }

  function generateGroupThreadTitle(group) {
    return group.name;
  }

  function createTempThread(type, entities) {
    var thread = {
      tid: getTempTid(),
      title: generateTitle(type, entities),
      type: type,
      _state: 'open'
    };
    switch (type) {
      case 'direct':
      case 'multi':
        thread.users = entities;
        break;

      case 'group':
        thread.group = entities[0];
        break;

      default:
        throw new Error( 'thread has unknown type: ' + type );
    }
    return thread;
  }

  /**
   * Generates a name for the thread based on its type and the people/group involved.
   */
  function generateTitle(type, entities) {
    if (!entities.length) {
      throw new Error( 'need at least one entity.' );
    }
    switch (type) {
      case 'direct':
        return generateDirectThreadTitle(entities[0]);

      case 'multi':
        return generateMultiThreadTitle(entities);

      case 'group':
        return generateGroupThreadTitle(entities[0]);

      default:
        throw new Error( 'thread has unknown type: ' + type );
    }
  }

  function openThread(type, entities) {
    openThreads.push(createTempThread(type, entities));
  }

  function closeThread(tid) {
    openThreads = _.filter(openThreads, function(thread) {
      return (thread.tid !== tid);
    });
    $log.log(openThreads.length + ' threads remain');
  }

  return {
    openThread: openThread,
    closeThread: closeThread,
    getOpenedThreads: getOpenedThreads
  };

}]);

angular.module("tChat").run(["$templateCache", function($templateCache) {$templateCache.put("/src/t-chat-thread.html","<div class=\"col-xs-4 panel-thread-container\" data-ng-class=\"{\n    \'panel-container-minimized\': ui.minimized == 1\n  }\">\n  <div class=\"panel panel-thread panel-thread-{{ thread.type }} panel-default\" data-ng-class=\"{\n      \'panel-success\': ui.highlighted,\n    }\" data-tid=\"{{ thread.tid }}\">\n    <div class=\"panel-heading\">\n      <div class=\"panel-heading-buttons pull-right\">\n        <div class=\"btn-group\" data-dropdown>\n          <button type=\"button\" class=\"btn btn-xs btn-default btn-actions dropdown-toggle\" id=\"t-chat-thread-settings-{{ thread.tid }}\" \n          data-toggle=\"dropdown\">\n            <i class=\"glyphicon glyphicon-cog\"></i>\n          </button>\n          <ul class=\"dropdown-menu\" role=\"menu\" aria-labelledby=\"t-chat-thread-settings-{{ thread.tid }}\">\n            <li role=\"presentation\">\n              <a role=\"menuitem\" tabindex=\"-1\" href=\"#\">\n                <i class=\"glyphicon glyphicon-user\"></i> Add more people\n              </a>\n            </li>\n            <li role=\"presentation\" data-ng-if=\"thread.type === \'multi\'\">\n              <a role=\"menuitem\" tabindex=\"-1\" href=\"#\">\n                <i class=\"glyphicon glyphicon-off\"></i> Leave\n              </a>\n            </li>\n          </ul>\n          <button type=\"button\" class=\"btn btn-xs btn-default btn-resize\" \n            data-ng-click=\"ui.minimized = !ui.minimized\">\n            <i class=\"glyphicon\" data-ng-class=\"{ \n              \'glyphicon-minus\': ui.minimized == 0,\n              \'glyphicon-plus\': ui.minimized == 1 }\">\n            </i>\n          </button>\n          <button type=\"button\" class=\"btn btn-xs btn-default btn-close\" data-ng-click=\"close()\">\n            <i class=\"glyphicon glyphicon-remove\"></i>\n          </button>\n        </div>\n      </div>  \n      <div class=\"panel-title\" data-ng-if=\"thread.title\">\n        {{ thread.title }} <span class=\"badge badge-danger\"> 2 </span>\n      </div>\n    </div>\n    <div class=\"panel-content\" data-ng-show=\"!ui.minimized\">\n      <div class=\"panel-body\"></div>\n      <div class=\"panel-footer\">\n        <input type=\"text\" class=\"form-control\" name=\"chat\" placeholder=\"Send a message.\">\n      </div>\n    </div>\n  </div>\n</div>");
$templateCache.put("/src/t-chat-threads.html","<div class=\"col-xs-8\">\n  <div class=\"container-threads row\">\n    <div data-t-chat-thread\n         data-ng-repeat=\"t in threads() | reverse | limitTo:3 track by t.tid \"\n         data-thread=\"t\"\n         data-tid=\"{{ t.tid }}\">\n    </div>\n  </div>\n</div>");
$templateCache.put("/src/t-chat-widget.html","<div class=\"col-xs-4 panel-chat-widget-container\">\n  <div class=\"panel panel-default panel-chat-widget\">\n    <div class=\"panel-heading\">\n      <div class=\"panel-title\">\n        Teamie Chat\n      </div>\n    </div>\n    <div class=\"panel-body\">\n      <tabset>\n        <tab ng-controller=\"UserListController\">\n          <tab-heading><i class=\"glyphicon glyphicon-user\"></i>&nbsp;&nbsp;People</tab-heading>\n          <div class=\"search-user-container input-group\">\n            <div class=\"input-group-addon\"><i class=\"glyphicon glyphicon-search\"></i></div>\n            <input type=\"search\" class=\"form-control input-sm search-user\" placeholder=\"Eg. John Doe\" \n            ng-model=\"data.search\"/>\n          </div>\n          <div class=\"list-people list-group\">\n            <a href=\"\" ng-click=\"chat(user)\" ng-repeat=\"user in users | filter:data.search\" class=\"list-group-item\" \n            data-uid=\"{{ user.uid }}\">\n              {{ user.name }}\n            </a>\n          </div>\n        </tab>\n        <tab ng-controller=\"GroupListController\">\n          <tab-heading><i class=\"glyphicon glyphicon-list-alt\"></i>&nbsp;&nbsp;Groups</tab-heading>\n          <div class=\"input-group search-group-container\">\n            <div class=\"input-group-addon\"><i class=\"glyphicon glyphicon-search\"></i></div>\n            <input type=\"search\" class=\"form-control input-sm\" placeholder=\"Eg. Some class\" \n            ng-model=\"data.search\"/>\n          </div>\n          <div class=\"list-user-groups list-group\">\n            <a href=\"\" ng-repeat=\"group in groups | filter:data.search\" class=\"list-group-item\" ng-click=\"chat(group)\"\n            data-uid=\"{{ group.gid }}\">\n              {{ group.name }}\n            </a>\n          </div>\n        </tab>\n        <tab ng-controller=\"ArchiveController\">\n          <tab-heading><i class=\"glyphicon glyphicon-hdd\"></i>&nbsp;&nbsp;Archive</tab-heading>\n          <div class=\"list-archived-threads list-group\">\n            <a href=\"\" ng-repeat=\"thread in threads | filter:data.search\" class=\"list-group-item\" \n            data-uid=\"{{ group.gid }}\">\n              <h4 class=\"list-group-item-heading\">{{ thread.title }}</h4>\n              <p class=\"text-muted list-group-item-text\">{{ thread.lastMessage }}</p>\n            </a>\n          </div>\n        </tab>\n        <!-- <tab heading=\"Notifications\" ng-controller=\"NotificationsController\"></tab> -->\n      </tabset>\n    </div>\n  </div>\n</div>");}]);