window.angular.module('ERP').animation('.login-container', [
	'$window',
	function ($window) {
		var $ = $window.jQuery;

		return {
			enter: function (element, done) {
				$('body').fadeIn('slow', done);
			},
			leave: function (element, done) {
				$('body').hide();
				done.call(element);
			}
		};
	}
]);

window.angular.module('ERP').animation('.main-container', [
	'$window',
	function ($window) {
		var $ = $window.jQuery;

		return {
			enter: function (element, done) {
				$('body').fadeIn('slow', done);
			},
			leave: function (element, done) {
				$('body').hide();
				done.call(element);
			}
		};
	}
]);

window.angular.module('ERP').animation('.slidedown-anim', function() {
	var NG_HIDE_CLASS = 'ng-hide';

	return {
		beforeAddClass: function(element, className, done) {
			if(className === NG_HIDE_CLASS) {
				element.slideUp('fast', done);
			}
		},
		removeClass: function(element, className, done) {
			if(className === NG_HIDE_CLASS) {
				element.hide().slideDown('fast', done);
			}
		}
	}
});
