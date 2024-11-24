/*
** Esta directiva crea un checkbox en forma de botón
**
** @class [OPCIONAL]     la clase del botón (además de btn, por ejemplo "btn-success")
** @label [REQUERIDO]    el texto del botón
** @ng-model [REQUERIDO] el modelo en Angular
**
*/

window.angular.module('ERP').directive('erpCheckbutton', function () {
	return {
		restrict: 'E',
		replace: true,
		scope: {
			class: '@?',
			label: '@',
			ngModel: '='
		},
		link: function (scope, element, attrs) {
			scope.class = scope.class || '';
		},
		template: '\
            <label class="btn {{ class }}" ng-class="{ active: ngModel }">\
                {{ label }}\
                <input type="checkbox" ng-model="ngModel" class="hide">\
              </label>\
        '
	};
});