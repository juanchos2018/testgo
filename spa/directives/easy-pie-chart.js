window.angular.module('ERP').directive('easyPieChart', [
	'$timeout',
	function ($timeout) {
		return {
			scope: {
				loop: '=?'
			},
			link: function (scope, element, attrs) {
				var inner = element.easyPieChart().css('position', 'relative').find('> div');

				inner.css({
					position: 'absolute',
					top: '0',
					left: '0',
					width: '100%',
					height: '100%',
					lineHeight: element.find('canvas').height() + 'px'
				});

				if (scope.loop) {
					element.data('easyPieChart').options.onStop = function (from, to) {
						if (element.data('easyPieChart')) {
							$timeout(function () {
								element.data('easyPieChart') && element.data('easyPieChart').update(to ? 0 : 100);
							}, 500);
						}
					};

					$timeout(function () {
						element.data('easyPieChart').update(100);
					}, 100);
				}
			}
		};
	}
]);
