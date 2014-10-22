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
