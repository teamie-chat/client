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

angular.module('tChat').directive('tChatThreads', [ 'ThreadService',
  'VISIBLE_THREAD_COUNT',
  function(ThreadService, VISIBLE_THREAD_COUNT) {

    'use strict';

    function postLink(scope) {
      scope.threads = ThreadService.getOpenedThreads;
      scope.visibleThreadCount = VISIBLE_THREAD_COUNT;
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

    function onActiveThreadReset(activeThread) {
      $scope.ui.active =
        ( activeThread && (activeThread.tid === $scope.thread.tid) );
    }

    // The different UI states that the thread can be in.
    $scope.ui = {
      minimized: 0,
      highlighted: 0,
      users: []
    };

    $scope.activeThread = ThreadService.getActiveThread;

    $scope.focus = function() {
      if (!$scope.ui.active) {
        $log.log( 'activating thread ' + $scope.thread.tid );
        $scope.ui.active = true;
        ThreadService.setActiveThread($scope.thread);
      }
    };

    $scope.blur = function() {
      $scope.ui.active = false;
    };

    $scope.close = function() {
      $log.log( 'close thread ' + $scope.thread.tid );
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

    ThreadService.on('resetActiveThread', onActiveThreadReset);

    $scope.$on('$destroy', function() {
      ThreadService.off('activeThread', onActiveThreadReset);
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
      { uid: 1, name: 'Administrator' },
      { uid: 2, name: 'Alan Turing' }
    ];

    $scope.haveOpenThread = ThreadService.doesUserHaveThread;

    $scope.chat = function(user) {
      var threadId = $scope.haveOpenThread(user);
      if (!threadId) {
        ThreadService.openThread('direct', [ user ]);
      }
      else {
        ThreadService.hoistThread(threadId);
      }
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
        { gid: 1, name: 'Physics Class' },
        { gid: 2, name: 'English Class' }
      ];

      $scope.haveOpenThread = ThreadService.doesGroupHaveThread;

      $scope.chat = function(group) {
        var threadId = $scope.haveOpenThread(group);
        if (!threadId) {
          ThreadService.openThread('group', [ group ]);
        }
        else {
          ThreadService.hoistThread(threadId);
        }
      };

    }
  ]
);

angular.module('tChat').controller('ThreadArchiveController', [ '$scope',
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

angular.module('tChat').factory('ThreadService', [ '$log',
  '$timeout', 'VISIBLE_THREAD_COUNT', 'eventEmitter',
  function($log, $timeout, VISIBLE_THREAD_COUNT, eventEmitter) {

    'use strict';

    var fakeTid = 0;
    var threadService;
    var openThreads = [];
    var activeThread;
    // Users with whom I have an open thread with.
    var threadUsers = {};
    // Groups that have an open thread.
    var threadGroups = {};

    function getTempTid() {
      return 'temp.' + (++fakeTid);
    }

    function getOpenedThread(tid) {
      var _thread;
      _.every(openThreads, function(thread) {
        if (thread.tid === tid) {
          _thread = thread;
          return false;
        }
        return true;
      });
      return _thread;
    }

    function getOpenedThreads() {
      return openThreads;
    }

    function setActiveThread(thread) {
      activeThread = thread;
      threadService.emit('resetActiveThread', activeThread);
    }

    function generateDirectThreadTitle(user) {
      return user.name;
    }

    function generateMultiThreadTitle(users) {
      // Dick (when others have left)
      // Tom and Dick
      // Tom, Dick & 4 others.
      if (users.length === 1) {
        return generateDirectThreadTitle(users[0]);
      }
      else if (users.length === 2) {
        return _.str.sprintf('%s & %s', users[0].name, users[1].name);
      }
      else if (users.length > 2) {
        return _.str.sprintf('%s, %s & %d others',
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
          thread.users = entities;
          addThreadUsers(thread.users, thread.tid);
          break;

        case 'group':
          thread.group = entities[0];
          addThreadGroup(thread.group, thread.tid);
          break;

        case 'multi':
          thread.users = entities;
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

        case 'group':
          return generateGroupThreadTitle(entities[0]);

        case 'multi':
          return generateMultiThreadTitle(entities);

        default:
          throw new Error( 'thread has unknown type: ' + type );
      }
    }

    function doesGroupHaveThread(targetGroup) {
      if (angular.isUndefined(targetGroup)) {
        throw new Error();
      }
      return doesEntityHaveThread(targetGroup, 'group', 'gid');
    }

    function doesUserHaveThread(targetUser) {
      return doesEntityHaveThread(targetUser, 'user', 'uid');
    }

    function doesEntityHaveThread(targetEntity, entityType, entityKey) {
      entityKey = entityKey || 'id';
      if ([ 'user', 'group' ].indexOf(entityType) === -1) {
        throw new Error( 'unknown entity: ' + entityType );
      }
      var entityMap;
      switch (entityType) {
        case 'user':
          entityMap = threadUsers;
          break;

        case 'group':
          entityMap = threadGroups;
          break;
      }
      if (entityMap[targetEntity[entityKey]]) {
        return entityMap[targetEntity[entityKey]];
      }
      return false;
    }

    function addThreadUsers(users, tid) {
      _.each(users, function(user) {
        if (!doesUserHaveThread(user)) {
          threadUsers[user.uid] = tid;
        }
      });
    }

    function removeThreadUsers(users) {
      _.each(users, function(user) {
        if (threadUsers[user.uid]) {
          delete threadUsers[user.uid];
        }
      });
    }

    function addThreadGroup(group, tid) {
      if (!doesGroupHaveThread(group)) {
        threadGroups[group.gid] = tid;
      }
    }

    function removeThreadGroup(group) {
      if (threadGroups[group.gid]) {
        delete threadGroups[group.gid];
      }
    }

    function openThread(type, entities, setActive) {
      if (angular.isUndefined(setActive)) {
        setActive = true;
      }
      var thread = createTempThread(type, entities);
      openThreads.push(thread);
      // We wait a tick as the thread scope has to be created, the
      // controller called and the event handler registered.
      if (setActive) {
        $timeout(function() {
          setActiveThread(thread);
        });
      }
    }

    function closeThread(tid) {
      var thread = getOpenedThread(tid);
      if (thread.users) {
        removeThreadUsers(thread.users);
      }
      if (thread.group) {
        removeThreadGroup(thread.group);
      }
      openThreads = _.filter(openThreads, function(thread) {
        return (thread.tid !== tid);
      });
      $log.log(openThreads.length + ' threads remain');
    }

    function hoistThread(tid) {
      // Hoist means push to the end.
      // Hoisting happens only if the thread in question is beyond the
      // visible range. Otherwise, the thread will simply be activated.
      var pos = false;
      for (var i = 0; i < openThreads.length; i++) {
        if (tid === openThreads[i].tid) {
          pos =  i;
          break;
        }
      }
      if (!_.isBoolean(pos)) {
        var max = openThreads.length - 1;
        var min = max - VISIBLE_THREAD_COUNT + 1;
        var thread = openThreads[pos];
        if ( (pos >= min) && (pos <= max) ) {
          $log.log( 'not hoisting, activating thread ' + thread.tid );
          setActiveThread(thread);
        }
        else {
          openThreads.splice(pos, 1);
          openThreads.push(thread);
          $timeout(function() {
            setActiveThread(thread);
          });
        }
      }
    }

    // -- Debugging -- //
    if (Object.observe) {
      Object.observe(openThreads, function() {
        $log.log( 'there are ' + openThreads.length + ' open threads' );
      });
    }
    // -- Debugging -- //

    function ThreadService() {}

    ThreadService.prototype.openThread = openThread;
    ThreadService.prototype.closeThread = closeThread;
    ThreadService.prototype.hoistThread = hoistThread;
    ThreadService.prototype.setActiveThread = setActiveThread;
    ThreadService.prototype.getOpenedThreads = getOpenedThreads;
    ThreadService.prototype.doesUserHaveThread = doesUserHaveThread;
    ThreadService.prototype.doesGroupHaveThread = doesGroupHaveThread;

    threadService = new ThreadService();
    eventEmitter.inject(ThreadService);
    return threadService;
  }
]);

angular.module("tChat").run(["$templateCache", function($templateCache) {$templateCache.put("/src/partials/t-chat-thread.html","<div class=\"col-xs-4 panel-thread-container\" data-ng-class=\"{\n    \'panel-container-minimized\': ui.minimized == 1\n  }\">\n  <div class=\"panel panel-thread panel-thread-{{ thread.type }} panel-default\" data-ng-class=\"{\n      \'panel-success\': ui.highlighted,\n    }\" data-tid=\"{{ thread.tid }}\">\n    <div class=\"panel-heading\">\n      <div class=\"panel-heading-buttons pull-right\">\n        <div class=\"btn-group\" data-dropdown>\n          <button type=\"button\" class=\"btn btn-xs btn-default btn-actions dropdown-toggle\" id=\"t-chat-thread-settings-{{ thread.tid }}\" \n          data-toggle=\"dropdown\">\n            <i class=\"fa fa-cog\"></i>\n          </button>\n          <ul class=\"dropdown-menu\" role=\"menu\" aria-labelledby=\"t-chat-thread-settings-{{ thread.tid }}\">\n            <li role=\"presentation\">\n              <a role=\"menuitem\" tabindex=\"-1\" href=\"#\">\n                <i class=\"fa fa-fw fa-user\"></i> Add more people\n              </a>\n            </li>\n            <li role=\"presentation\" data-ng-if=\"thread.type === \'multi\'\">\n              <a role=\"menuitem\" tabindex=\"-1\" href=\"#\">\n                <i class=\"fa fa-fw fa-power-off\"></i> Leave\n              </a>\n            </li>\n          </ul>\n<!--           <button type=\"button\" class=\"btn btn-xs btn-default btn-resize\" \n            data-ng-click=\"ui.minimized = !ui.minimized\">\n            <i class=\"fa\" data-ng-class=\"{ \n              \'fa-minus\': ui.minimized == 0,\n              \'fa-plus\': ui.minimized == 1 }\">\n            </i>\n          </button> -->\n          <button type=\"button\" class=\"btn btn-xs btn-default btn-close\" data-ng-click=\"close()\">\n            <i class=\"fa fa-remove\"></i>\n          </button>\n        </div>\n      </div>  \n      <div class=\"panel-title\" data-ng-if=\"thread.title\" ng-click=\"ui.minimized = !ui.minimized\">\n        <i class=\"fa fa-circle t-chat-color-green\"></i>&nbsp;&nbsp;{{ thread.title }}\n      </div>\n    </div>\n    <div class=\"panel-content\" data-ng-show=\"!ui.minimized\">\n      <div class=\"panel-body\"></div>\n      <div class=\"panel-footer\">\n        <input type=\"text\" class=\"form-control\" name=\"chat\" placeholder=\"Send a message.\" link-focus=\"ui.active\" ng-focus=\"focus()\" ng-blur=\"blur()\">\n      </div>\n    </div>\n  </div>\n</div>");
$templateCache.put("/src/partials/t-chat-threads.html","<div class=\"col-xs-8\">\n  <div class=\"container-threads row\">\n    <div data-t-chat-thread\n         data-ng-repeat=\"t in threads() | reverse | limitTo:visibleThreadCount | reverse track by t.tid \"\n         data-thread=\"t\"\n         data-tid=\"{{ t.tid }}\">\n    </div>\n  </div>\n</div>");
$templateCache.put("/src/partials/t-chat-widget.html","<div class=\"col-xs-4 panel-chat-widget-container\">\n  <div class=\"panel panel-default panel-chat-widget\">\n    <div class=\"panel-heading\">\n      <div class=\"panel-title\">\n        Teamie Chat <i class=\"fa fa-circle t-chat-color-green\"></i>\n      </div>\n    </div>\n    <div class=\"panel-body\">\n      <tabset justified=\"true\">\n        <tab ng-controller=\"UserListController\">\n          <tab-heading><i class=\"fa fa-user\"></i>&nbsp;&nbsp;People</tab-heading>\n          <div class=\"search-user-container input-group\">\n            <div class=\"input-group-addon\"><i class=\"fa fa-search\"></i></div>\n            <input type=\"search\" class=\"form-control input-sm search-user\" placeholder=\"Eg. John Doe\" \n            ng-model=\"data.search\"/>\n          </div>\n          <div class=\"list-people list-group\">\n            <a href=\"\" ng-click=\"chat(user)\" ng-repeat=\"user in users | filter:data.search\" class=\"list-group-item\" \n            data-uid=\"{{ user.uid }}\">\n              <i class=\"fa fa-circle t-chat-color-green\"></i>&nbsp;&nbsp;{{ user.name }} <i class=\"fa fa-comment\" ng-if=\"haveOpenThread(user)\"></i>\n            </a>\n          </div>\n        </tab>\n        <tab ng-controller=\"GroupListController\">\n          <tab-heading><i class=\"fa fa-group\"></i>&nbsp;&nbsp;Groups</tab-heading>\n          <div class=\"input-group search-group-container\">\n            <div class=\"input-group-addon\"><i class=\"fa fa-search\"></i></div>\n            <input type=\"search\" class=\"form-control input-sm\" placeholder=\"Eg. Some class\" \n            ng-model=\"data.search\"/>\n          </div>\n          <div class=\"list-user-groups list-group\">\n            <a href=\"\" ng-repeat=\"group in groups | filter:data.search\" class=\"list-group-item\" ng-click=\"chat(group)\"\n            data-uid=\"{{ group.gid }}\">\n              <i class=\"fa fa-circle t-chat-color-grey\"></i>&nbsp;&nbsp;{{ group.name }} <i class=\"fa fa-comment\" ng-if=\"haveOpenThread(group)\"></i>\n            </a>\n          </div>\n        </tab>\n<!--    <tab ng-controller=\"ThreadArchiveController\">\n          <tab-heading><i class=\"fa fa-hdd-o\"></i>&nbsp;&nbsp;Archive</tab-heading>\n          <div class=\"list-archived-threads list-group\">\n            <a href=\"\" ng-repeat=\"thread in threads | filter:data.search\" class=\"list-group-item\" \n            data-uid=\"{{ group.gid }}\">\n              <h4 class=\"list-group-item-heading\">{{ thread.title }}</h4>\n              <p class=\"text-muted list-group-item-text\">{{ thread.lastMessage }}</p>\n            </a>\n          </div>\n        </tab> -->\n        <!-- <tab heading=\"Notifications\" ng-controller=\"NotificationsController\"></tab> -->\n      </tabset>\n    </div>\n  </div>\n</div>");}]);