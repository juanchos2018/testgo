window.angular.module('ERP').filter('limitSimpleGrid', [
	'SimpleGrid',
	function (SimpleGrid) {
	    return function (input, id) {
	        return input.slice(SimpleGrid.startIndex(id), SimpleGrid.startIndex(id) + SimpleGrid.limitPerPage(id));
	    };
	}
]);

window.angular.module('ERP').filter('filteredSimpleGrid', [
	'SimpleGrid',
	function (SimpleGrid) {
	    return function (input, id) {
	        return (SimpleGrid.filteredData(id, input));
	    };
	}
]);
