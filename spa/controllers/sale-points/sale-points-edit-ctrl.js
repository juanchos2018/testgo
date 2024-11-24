window.angular.module('ERP').controller('SalePointsEditCtrl', [
    '$scope', '$window', '$location', 'Page', 'Session', 'Ajax',
    function ($scope, $window, $location, Page, Session, Ajax) {
        var $ = $window.angular.element;
        var angular = $window.angular;

        Page.title('Editar punto de venta');

        $scope.companies = [];

        $scope.newTicketPrinter = {
            company_id: '',
            company_name: '',
            printer_serial: '',
            printer_name: '',
            ticket_serie: '',
            ticket_serial: ''
        };

        $scope.getCompanyName = function (companyId) {
            var companyName = '';

            for (var i = 0; i < $scope.companies.length; i++) {
                if ($scope.companies[i].id == companyId) {
                    companyName = $scope.companies[i].text;
                    break;
                }
            }

            return companyName;
        };

        $scope.getCompanyIndex = function (companyId) {
            var companyIndex = -1;

            for (var i = 0; i < $scope.companies.length; i++) {
                if ($scope.companies[i].id == companyId) {
                    companyIndex = i;
                    break;
                }
            }

            return companyIndex;
        };

        $scope.addTicketPrinter = function () {
            if (!$scope.newTicketPrinter.company_id) {
                $('select[name="company_id"]').focus();
                return false;
            } else if (!$scope.newTicketPrinter.printer_serial.trim().length) {
                $('input[name="printer_serial"]').focus();
                return false;
            } else if (!$scope.newTicketPrinter.printer_name.trim().length) {
                $('input[name="printer_name"]').focus();
                return false;
            } else if (!$scope.newTicketPrinter.ticket_serie.trim().length) {
                $('input[name="ticket_serie"]').focus();
                return false;
            } else if (!$scope.newTicketPrinter.ticket_serial.trim().length) {
                $('input[name="ticket_serial"]').focus();
                return false;
            }

            $scope.newTicketPrinter.company_name = $scope.getCompanyName($scope.newTicketPrinter.company_id);
            $scope.newTicketPrinter.ticket_serie = parseInt($scope.newTicketPrinter.ticket_serie);
            $scope.newTicketPrinter.ticket_serial = parseInt($scope.newTicketPrinter.ticket_serial);
            $scope.record.printers.push(angular.copy($scope.newTicketPrinter));

            $scope.companies.splice($scope.getCompanyIndex($scope.newTicketPrinter.company_id), 1);

            $scope.newTicketPrinter.company_id = '';
            $scope.newTicketPrinter.company_name = '';
            $scope.newTicketPrinter.printer_serial = '';
            $scope.newTicketPrinter.printer_name = '';
            $scope.newTicketPrinter.ticket_serie = '';
            $scope.newTicketPrinter.ticket_serial = '';

            $('select[name="company_id"]').focus();
        };

        $scope.removeTicketPrinter = function (printerIndex) {
            var printer = $scope.record.printers[printerIndex];

            if (printer) {
                $scope.companies.push({
                    id: printer.company_id,
                    text: printer.company_name
                });

                $scope.record.printers.splice(printerIndex, 1);
            } else {
                console.error('Ticketera no encontrada (' + printerIndex + ')');
            }
        };

        $scope.updateTicketPrinters = function () {
            $scope.record.printers.forEach(function (printer) {
                var companyIndex = $scope.getCompanyIndex(printer.company_id);

                if (companyIndex >= 0) {
                    $scope.companies.splice(companyIndex, 1);
                }
            });
        };

        $scope.submit = function () {
            if (!$scope.record.printers.length) { // No se encontraron ticketeras pero sí se ingresaron en newTicketPrinter
                $scope.addTicketPrinter();
            }

            Ajax.post($window.siteUrl('sale_points/update'), angular.copy($scope.record)).then(function (res) {
                console.log('res', res);
                Session.setMessage('Se editó el registro correctamente');
                $location.path('sale_points');
            }, function (err) {
                var errorDetail = err.statusText || 'Ocurrió un error al intentar guardar el registro';

                Session.setMessage(errorDetail, 'danger', true);
            });
        };
    }
]);
