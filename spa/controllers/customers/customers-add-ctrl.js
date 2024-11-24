window.angular.module('ERP').controller('CustomersAddCtrl', [
    '$scope', '$window', '$routeParams', '$document', '$location', '$timeout', 'Page', 'Ajax','Session',
    function ($scope, $window, $routeParams, $document, $location, $timeout, Page, Ajax, Session) {
        var angular = $window.angular, $ = angular.element;
        
        Page.title('Clientes - Nuevo');
        $scope.submitted = false;

        $scope.record = { // Para nuevo cliente
            type: 'PERSONA', // Por defecto se trata de una persona natural
            id_number: '',
            gender: '',
            born_date: '',
            name: '',
            last_name: '',
            address: '',
            city: '', // En realidad es departamento
            country: '',
            phone_number: '',
            mobile_phone_number: '',
            email: '',
            facebook: '',
            workplace: '',
            web: '',
            barcode_card2: '',
            nro_inticard: '',
            barcode_inticard: '',
            customer_id: '', // SOLO EN CASO de registrar una persona jurídica
            partner: {
                id_number: '',
                full_name: '',
                relationship: ''
            }
        };

        $scope.clear = function () {
            if ($scope.ngModel.id || $scope.ngModel.full_name) {
                $scope.ngModel.id           = '';
                $scope.ngModel.full_name    = '';
                $scope.ngModel.id_number    = '';
                $scope.ngModel.type         = '';
                $scope.ngModel.address      = '';
                $scope.ngModel.verified     = '';

                /*$scope.ngModel = '';
                $scope.label = '';
                $scope.barcode_inticard = '';
                $scope.barcode_card2 = '';
                $scope.verified = false;
                $scope.type = '';*/
                
                $scope.originalLabel = '';
            }
        };

        $scope.returnFocus = function () {
            $scope.saveMessage = '';
            
            $timeout(function () {
                $('[ng-view] form').find('input[type="search"]:visible, input[type="text"]:visible').first().focus();
            });
        };
        
        $scope.changeHavingPartner = function (value) {
            $timeout(function () {
                if (value) {
                    $('[name="having-partner-row"] input[type="text"]').first().focus();
                } else {
                    $scope.record.partner.id_number = '';
                    $scope.record.partner.full_name = '';
                    $scope.record.partner.relationship = '';
                }
            });
        };

        $scope.save = function () {
            $scope.saveLoading = true;

            Ajax.post($window.siteUrl('customers/save'), $scope.record).then(function (res) {
                //var data = res.data;
                Session.setMessage('Se guardó el registro correctamente');
                $location.path('customers');
            //    $scope.setValue(data);

            //    $element.find('.modal[name="add"]').modal('hide');
                
            //    $scope.saveLoading = false;
                
            }, function (error) {
                if (error.status === 400 && error.statusText) {
                    $scope.saveMessage = error.statusText;
                } else {
                    $scope.saveMessage = 'Ocurrió un error, por favor inténtelo más adelante';
                }
                
                $scope.saveLoading = false;
            });
        };

         $scope.searchPerson = function (e) {
            var modal = $window.bootbox.dialog({
                message: '\
                    <riot-table>\
                        <div class="row">\
                            <div class="col-lg-12">\
                                <searchbox input_class="form-control" placeholder="Buscar persona..."></searchbox>\
                            </div>\
                        </div>\
                        <div class="row m-t">\
                            <div class="col-lg-12">\
                                <div class="table-responsive">\
                                    <table class="table table-bordered table-hover">\
                                        <thead>\
                                            <tr>\
                                                <th>N° Documento</th>\
                                                <th>Nombres y apellidos</th>\
                                                <th>N° Tarjeta</th>\
                                            </tr>\
                                        </thead>\
                                        <tbody>\
                                            <tr each="{ data }" onclick="{ parent.opts.setCustomer }" style="cursor:pointer">\
                                                <td>{ type === "PERSONA" ? (id_number.length === 8 ? "DNI" : "N°") : "RUC" } { id_number }</td>\
                                                <td>{ full_name }</td>\
                                                <td>{ barcode_inticard ? barcode_inticard : "-" }</td>\
                                            </tr>\
                                            <tr if="{ !data.length }">\
                                                <td if="{ !loading }" class="text-center" colspan="3">\
                                                    No se encontraron registros\
                                                <td>\
                                                <td if="{ loading }" class="text-center" colspan="3">\
                                                    Obteniendo datos...\
                                                <td>\
                                            </tr>\
                                        </tbody>\
                                    </table>\
                               </div>\
                            </div>\
                        </div>\
                        <div class="row">\
                            <div class="col-lg-6">\
                                { total } registros\
                            </div>\
                            <div class="col-lg-6">\
                                <paginator button_class="btn btn-sm btn-default" active_button_class="btn btn-sm btn-primary"></paginator>\
                            </div>\
                        </div>\
                    </riot-table>\
                ',
                onEscape: true,
                backdrop: false,
                closeButton: false,
                size: 'large',
                show: false
            });
            
            $window.riot.mount(modal.find('riot-table').get(0), 'riot-table', {
                data: $window.siteUrl('customers/get_list_for_sale/PERSONA'),
                setCustomer: function (e) {
                    var data = e.item;

                    $scope.$apply(function () {
                        $scope.record.customer_id = data.id_number;
                    });
                    
                    modal.modal('hide');
                }
            });
            
            modal
                .on('shown.bs.modal', function () {
                    modal.find('searchbox input').focus();
                })
                .on('hidden.bs.modal', function () {
                    $(e.target).parent().prev().focus();
                })
                .modal('show');
        };

    }
]);
