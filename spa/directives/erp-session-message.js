window.angular.module('ERP').directive('erpSessionMessage', [
	'Session',
	function (Session) {
		return {
			restrict: 'E',
			scope: {},
			replace: true,
			controller: ['$scope', function ($scope) {
				$scope.Session = Session;

				$scope.getTypeClass = function () {
					return 'alert-' + Session.message.type;
				};

				$scope.hide = function () {
					Session.message.text = '';
					Session.message.type = '';
				};
			}],
			/*link: function (scope, element, attrs) {

			},*/
			template: '\
				<div class="wrapper" ng-show="Session.message.text">\
					<div class="alert success m-b-none {{ getTypeClass() }}" role="alert">\
						<button ng-click="hide()" class="close" aria-label="Close"><span aria-hidden="true">&times;</span></button>\
						{{ Session.message.text }}\
					</div>\
				</div>\
			'
		};
	}
]);
