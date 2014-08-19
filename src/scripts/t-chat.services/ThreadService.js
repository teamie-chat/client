'use strict';

angular.module('tChat')
  .factory('ThreadService', [ function() {

    return {

      fetchThread: function(tid) {
        var threads = [
          {
            tid: '1',
            title: 'Tom',
            type: 'direct'
          },
          {
            tid: '2',
            title: 'Dick, Harry',
            type: 'multi'
          },
          {
            tid: '3',
            title: 'Classroom',
            type: 'group'
          }
        ];
        return _.find(threads, function(thread) { return (thread.tid === tid); });
      }

    };

  }]);