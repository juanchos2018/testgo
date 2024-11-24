window.angular.module('ERP').controller('LogisticCtrl', [
    '$scope', '$routeParams', '$document', '$location', 'Page',
    function ($scope, $routeParams, $document, $location, Page) {
        Page.title('Logisistica');

    /*    $scope.generateBarData = function() {
            
            $scope.bar_example = Object();
            $scope.bar_example.data  = [[ [0, Math.random(1, 10)], [1, Math.random(1, 10)], [2, Math.random(1, 10)], [3, Math.random(1, 10)],
            [4, Math.random(1, 25)], [5, Math.random(1, 30)], [6, Math.random(1, 10)], [7, Math.random(1, 10)], [8, Math.random(1, 10)], [9, Math.random(1, 100)] ]];
            $scope.bar_example.options =
            {
            bars: { show: true }
            }

        };


        $scope.generatePieData = function() {
            $scope.pie_example = Object();
            $scope.pie_example.data =
            [
                { label: "Series1",  data: Math.random(1, 100)},
                { label: "Series2",  data: Math.random(1, 100)},
                { label: "Series3",  data: Math.random(1, 100)},
                { label: "Series4",  data: Math.random(1, 100)},
                { label: "Series5",  data: Math.random(1, 100)},
                { label: "Series6",  data: Math.random(1, 100)}
            ];
        };
    */
        $scope.gatos = [
                     {
                         "key": "Series 1",
                         "values": [ [ 1 , 0] , [ 2 , -6.3382185140371] , [ 3 , -5.9507873460847] , [ 4 , -11.569146943813] , [ 5 , -5.4767332317425] , [ 6 , 0.50794682203014] , [ 7 , -5.5310285460542] , [ 8 , -5.7838296963382] , [ 9 , -7.3249341615649] , [ 10 , -6.7078630712489] , [ 11 , 0.44227126150934] , [ 12 , 7.2481659343222] , [ 13 , 9.2512381306992] ]
                     },
                     {
                         "key": "Series 2",
                         "values": [ [ 1 , 0] , [ 2 , 0] , [ 3 , 0] , [ 4 , 0] , [ 5 , 0] , [ 6 , 0] , [ 7 , 0] , [ 8 , 0] , [ 9 , 0] , [ 10 , 0] , [ 11 , 0] , [ 12 , 0] , [ 13 , 0] , [ 14 , 0] , [ 16 , 0] , [ 15 , 0] , [ 17 , 0] , [ 18 , 0] , [ 19 , 0] , [ 20 , -0.049184266875945] ]
                     },
                     {
                         "key": "Series 3",
                         "values": [ [ 1 , 0] , [ 2 , -6.3382185140371] , [ 3 , -5.9507873460847] , [ 4 , -11.569146943813] , [ 5 , -5.4767332317425] , [ 6 , 0.50794682203014] , [ 7 , -5.5310285460542] , [ 8 , -5.7838296963382] , [ 9 , -7.3249341615649] , [ 10 , -6.7078630712489] , [ 11 , 0.44227126150934] , [ 12 , 7.2481659343222] , [ 13 , 9.2512381306992] ]
                     },
                     {
                        "key": "Series 4",
                         "values": [ [ 1 , -7.0674410638835] , [ 2 , -14.663359292964] , [ 3 , -14.104393060540] , [ 4 , -23.114477037218] , [ 5 , -16.774256687841] , [ 6 , -11.902028464000] , [ 7 , -16.883038668422] , [ 8 , -19.104223676831] , [ 9 , -20.420523282736] , [ 10 , -19.660555051587] , [ 11 , -13.106911231646] , [ 12 , -8.2448460302143] , [ 13 , -7.0313058730976] ]
                     }
                 ];

    }
]);
