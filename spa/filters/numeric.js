window.angular.module('ERP').filter('range', function() {
    return function(input, total) {
    	if (total) {
	        total = parseInt(total);
	        
	        for (var i=0; i<total; i++)
	            input.push(i);
	        
	        return input;
    	} else {
    		var result = [];

    		for (var i = 0; i < input; i++) {
    			result.push(i);
    		}

    		return result;
    	}
    };
});

window.angular.module('ERP').filter('lpad', function () {
    return function (input, count, fill) {
        input = input || '';
        fill = fill || '0';

        return (fill.repeat(count) + input).slice(-count);
    };
});

window.angular.module('ERP').filter('max', [
    '$window',
    function ($window) {
        return function (num1, num2) {
            num2 = num2 || 0;

            if (typeof num1 !== 'number') {
                num1 = parseInt(num1);
            }

            if (typeof num2 !== 'number') {
                num2 = parseInt(num2);
            }

            return $window.Math.max(num1, num2);
        };
    }
]);
