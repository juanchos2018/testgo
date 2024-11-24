window.angular.module('ERP').controller('TestingDatepickerCtrl', [
    '$scope', '$window', 'Page',
    function ($scope, $window, Page) {
        Page.title('Prueba de Datepicker');
        
        $scope.date = '';
        $scope.datePickerOpts = {
            clearBtn: true
        };
        
        $scope.dateRange = ['2016-01-05', '2016-02-06'];
        $scope.onChangeRange = function (start, end) {
            console.log('start', start, 'end', end);  
        };
        $scope.dateRangeOpts = { 'minDate': '03/01, 2016' };
    }
]);
