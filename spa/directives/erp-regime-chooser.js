window.angular.module('ERP').directive('erpRegimeChooser', function () {
	return {
        restrict: 'E',
		replace: true,
        template: `
            <select>
                <option value="">- Seleccione -</option>
                <option value="General">General</option>
                <option value="ZOFRA">Zofra</option>
            </select>
        `
	};
});
