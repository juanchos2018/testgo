window.angular.module('ERP').directive('erpTriggerClick', function () {
	var $ = angular.element;

    return {
    	scope: {
    		erpTriggerClick: '@'
    	},
        link: function (scope, element, attrs) {
            element.keydown(function (e) {
            	if (e.keyCode === 13) {
            		$(scope.erpTriggerClick).click();
            		e.preventDefault();
            	}
            });
        }
    };
});