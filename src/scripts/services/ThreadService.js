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

    function openThread(type, entities) {
      var thread = createTempThread(type, entities);
      openThreads.push(thread);
      // We wait a tick as the thread scope has to be created, the
      // controller called and the event handler registered.
      $timeout(function() {
        setActiveThread(thread);
      });
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
