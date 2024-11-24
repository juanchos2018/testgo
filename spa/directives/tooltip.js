window.angular.module('ERP').directive('tooltip', function () {
    return {
        link: function (scope, element, attrs) {
        	if (!element.data('placement')) {
        		element.data('placement', 'bottom');
        	}

            element.tooltip();
            //console.log('toggle', element.data('toggle'));
        }
    };
});