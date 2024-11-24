window.angular.module('ERP').factory('Page', [
	'$window', '$document',
	function ($window, $document) {
	    var Page = {
	    	isPublic: true
	    };

	    var theTitle = '';

		Page.title = function(title, sufix) {
			if (title) {
				sufix = sufix || '';

		        if (sufix) {
		            theTitle = title + sufix;
		        } else {
		        	theTitle = title;
		        }
		            
		        $document.prop('title', theTitle);

		        return Page;
			} else {
				return theTitle;
			}
	    };

		Page.focus = function (element) {
	        $window.setTimeout(function () {
	            $window.angular.element(element).focus().select();
	        }, 0);
	    };
	    
	    Page.isMobile = function () {
	    	return $document[0].body.classList.contains('mobile-screen');	
	    };
	    
	    Page.isTablet = function () {
	    	return $document[0].body.classList.contains('tablet-screen');	
	    };
	    
	    Page.isDesktop = function () {
	    	return $document[0].body.classList.contains('desktop-screen');	
	    };

	    return Page;
	}
]);