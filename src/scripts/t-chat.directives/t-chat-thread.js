'use strict';

angular.module('tChat')
	.directive('tChatThread', function() {
		return {
			restrict: 'E',
			replace: true,
			scope: {
				title: '@'
			},
			templateUrl: 'src/partials/directives/t-chat-thread.js',
			controller: 'ThreadController'
		}
	});