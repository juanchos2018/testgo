window.angular.module('ERP').directive('erpPayment', [
    '$window', '$filter', '$timeout', 'HotKeys', 'Settings', 'Auth',
    function ($window, $filter, $timeout, HotKeys, Settings, Auth) {
        var angular = $window.angular,
            $ = angular.element;

        return {
    		scope: {
                customerVerified: '=', // Booleano
                exchangeRates: '=', // Arreglo
                details: '=', // Arreglo de detalle de venta
                taxes: '=', // Arreglo
                cards: '=', // Arreglo
                ngModel: '=', // Arreglo de pagos
                successLabel: '@', // Arreglo de pagos
                onsuccess: '=' // Función que se ejecutará al completar con éxito los pagos
    		},
            controller: ['$scope', '$element', '$transclude', function ($scope, $element, $transclude) {
                $scope.tabOptions = {
                    'RESUMEN': 0,
                    'EFECTIVO': 1,
                    'TARJETA': 2,
                    'EMPRESA': 3
                };

                $scope.tabs = {
                    EFECTIVO: {
                        opts: {
                            'MONEDA': 0,
                            'MONTO': 1
                        },
                        selected: 0, // opts.MONEDA (toma valores de opts)
                        MONEDA: {
                            abbrev: 'PEN', // Seleccionado SOLES por defecto
                            unit: 1,
                            value: 1
                        },
                        MONTO: {
                            amount: 0,
                            label: '0'
                        }
                    },
                    TARJETA: {
                        opts: {
                            'EMPRESA': 0,
                            'TIPO': 1,
                            'VERIFICACION': 2,
                            'OPERACION': 3,
                            'MONTO': 4
                        },
                        selected: 0, // opts.TIPO (valores de tabs.TARJETA.opts)
                        EMPRESA: '',
                        TIPO: '',
                        VERIFICACION: '',
                        OPERACION: '',
                        MONTO: {
                            amount: 0,
                            label: '0'
                        }
                    },
                    EMPRESA: ''
                }

                $scope.totalSaleAmount = 0;
                $scope.saleAmountsPerCompany = [];

                $scope.companies = {};
                $scope.companyList = [];

                if (Auth.value('userBranchName') in Settings.branches) {
                    // La lista de empresas en Settings está por orden alfabético

                    Settings.branches[Auth.value('userBranchName')].companies.forEach(function (company) {
                        $scope.companyList.push($scope.companies[company.company_name] = {
                            company_id: company.company_id,
                            company_name: company.company_name,
                            inSale: false,
                            amount: 0,
                            debt: 0
                        });
                    });
                }

                $scope.details.forEach(function (item) {
                    if (item.company_name in $scope.companies) {
                        var company = $scope.companies[item.company_name];
                        var saleTotal = $window.checkPrecision(item.qty * parseFloat('unit_price' in item ? item.unit_price : ($scope.customerVerified ? item.offer_price : item.price)));

                        $scope.totalSaleAmount = $window.checkPrecision($scope.totalSaleAmount + saleTotal);
                        
                        company.amount = $window.checkPrecision(company.amount + saleTotal);
                        company.debt = company.amount;
                        
                        if (!company.inSale) {
                            company.inSale = true;
                        }
                    } else {
                        console.error('Empresa ' + item.company_name + ' no encontrada', $scope.companies);
                    }
                });

                // Ordenamos la lista de empresas por la deuda (orden ascendente)
                $scope.companyList.sort(function (a, b) {
                    if (a.debt > b.debt) return 1;
                    if (a.debt < b.debt) return -1;

                    return 0;
                });

                $scope.amountToPay = false; // Indica el monto que se debe mostrar en el título del modal, si es false quiere decir que no se debe mostrar nada

                $scope.getCurrentCompanyName = function () {
                    if ($scope.tabs.TARJETA.EMPRESA) {
                        for (var i = 0; i < $scope.companyList.length; i++) {
                            if ($scope.companyList[i].company_id == $scope.tabs.TARJETA.EMPRESA) {
                                return $scope.companyList[i].company_name;
                            }
                        }
                    }

                    return '';
                };

                $scope.isTab = function (mode) {
                    return $scope.tab === $scope.tabOptions[mode];
                };

                $scope.setTab = function (mode) {
                    // Si ya no debe y quiere ir a la pestaña de EFECTIVO o TARJETA
                    if (!$scope.stillOwe() && (mode === 'EFECTIVO' || mode === 'TARJETA')) {
                        return;
                    }

                    $scope.tab = $scope.tabOptions[mode];

                    switch (mode) {
                        case 'RESUMEN':
                            $scope.amountToPay = false;
                            break;
                        case 'EFECTIVO':
                            $scope.amountToPay = -$scope.getChange();
                            break;
                        case 'TARJETA':
                            if ($scope.tabs.TARJETA.EMPRESA) {
                                for (var i = 0; i < $scope.companyList.length; i++) {
                                    if ($scope.companyList[i].company_id == $scope.tabs.TARJETA.EMPRESA) {
                                        $scope.amountToPay = $scope.companyList[i].debt;
                                        break;
                                    }
                                }
                            } else {
                                $scope.amountToPay = false;
                            }
                            break;
                    }

                    $timeout(function () { // Se debe demorar porque se está cambiando de pestaña
                        $element.find('.nav-tabs a[data-action="' + mode + '"]').focus();
                    });
                };

                $scope.resetInputTabs = function () { // Restablece los valores para las pestañas de EFECTIVO y TARJETA
                    $scope.setTab('RESUMEN');

                    $scope.tabs.EFECTIVO.selected = $scope.tabs.EFECTIVO.opts.MONEDA;

                    $scope.tabs.EFECTIVO.MONEDA.abbrev = 'PEN';
                    $scope.tabs.EFECTIVO.MONEDA.unit = 1;
                    $scope.tabs.EFECTIVO.MONEDA.value = 1;

                    $scope.tabs.EFECTIVO.MONTO.label = '0';
                    $scope.tabs.EFECTIVO.MONTO.amount = 0;

                    $scope.tabs.TARJETA.selected = $scope.tabs.TARJETA.opts.EMPRESA;

                    $scope.tabs.TARJETA.EMPRESA = '';
                    $scope.tabs.TARJETA.TIPO = '';
                    $scope.tabs.TARJETA.VERIFICACION = '';
                    $scope.tabs.TARJETA.OPERACION = '';

                    $scope.tabs.TARJETA.MONTO.label = '0';
                    $scope.tabs.TARJETA.MONTO.amount = 0;
                };

                $scope.setStep = function (tab, step) {
                    if ((tab === 'TARJETA' && $scope.isAllowedCardStep(step)) || tab === 'EFECTIVO') {
                        $scope.tabs[tab].selected = $scope.tabs[tab].opts[step];

                        $element.find('.nav-tabs .active > a').focus();
                    }
                };

                $scope.inStep = function (tab, step) {
                    if ($scope.tab === $scope.tabOptions[tab]) {
                        return $scope.tabs[tab].selected === $scope.tabs[tab].opts[step];
                    } else {
                        return false;
                    }
                };

                $scope.setOption = function (name, value) {
                    switch (name) {
                        case 'EFECTIVO.MONEDA':
                            if (value === 'PEN') {
                                $scope.tabs.EFECTIVO.MONEDA.abbrev = 'PEN';
                                $scope.tabs.EFECTIVO.MONEDA.unit = 1;
                                $scope.tabs.EFECTIVO.MONEDA.value = 1;
                            } else if (value.constructor.name === 'Array' && value.length === 3) {
                                $scope.tabs.EFECTIVO.MONEDA.abbrev = value[0];
                                $scope.tabs.EFECTIVO.MONEDA.unit = value[1];
                                $scope.tabs.EFECTIVO.MONEDA.value = value[2];
                            }
                            break;
                        case 'TARJETA.EMPRESA':
                            if (value[1]) { // inSale = true
                                $scope.tabs.TARJETA.EMPRESA = value[0];
                                $scope.amountToPay = value[2];
                            }
                            break;
                        case 'TARJETA.TIPO':
                            $scope.tabs.TARJETA.TIPO = value;
                            break;
                    }
                };

                $scope.isOkDisabled = function () {
                    if ($scope.tab === $scope.tabOptions.RESUMEN) {
                        return $scope.stillOwe();
                    } else {
                        if ($scope.inStep('EFECTIVO', 'MONTO')) {
                            return !$scope.tabs.EFECTIVO.MONTO.amount;
                        } else if ($scope.inStep('TARJETA', 'EMPRESA')) {
                            return !$scope.tabs.TARJETA.EMPRESA;
                        } else if ($scope.inStep('TARJETA', 'TIPO')) {
                            return !$scope.tabs.TARJETA.TIPO;
                        } else if ($scope.inStep('TARJETA', 'OPERACION')) {
                            return !$scope.tabs.TARJETA.OPERACION.length;
                        } else if ($scope.inStep('TARJETA', 'VERIFICACION')) {
                            return !$scope.tabs.TARJETA.VERIFICACION.length;
                        } else if ($scope.inStep('TARJETA', 'MONTO')) {
                            return !$scope.tabs.TARJETA.MONTO.amount || $scope.tabs.TARJETA.MONTO.amount > $scope.amountToPay;
                        }
                    }

                    return false;
                };

                $scope.ok = function () {
                    if (!$scope.isOkDisabled()) {
                        switch ($scope.tab) {
                            case $scope.tabOptions.EFECTIVO:
                                if ($scope.tabs.EFECTIVO.selected === $scope.tabs.EFECTIVO.opts.MONEDA) {
                                    $scope.setStep('EFECTIVO', 'MONTO');
                                } else { // EFECTIVO.MONTO
                                    if ($scope.tabs.EFECTIVO.MONTO.amount) {
                                        // Si es efectivo, se debe recorrer companyList e ir buscando las deudas menores y cancelándolas, hasta completar, si se llega al final y queda saldo se asigna al efectivo de la última empresa
                                        var money = $scope.tabs.EFECTIVO.MONEDA.abbrev;
                                        var rate = (money !== 'PEN' ? $window.checkPrecision($scope.tabs.EFECTIVO.MONEDA.value / $scope.tabs.EFECTIVO.MONEDA.unit) : 1);
                                        var origAmount = $scope.tabs.EFECTIVO.MONTO.amount;
                                        var amount = (money !== 'PEN' ? $window.checkPrecision(origAmount * rate) : origAmount);

                                        for (var i = 0; i < $scope.companyList.length; i++) {
                                            var company = $scope.companyList[i];

                                            if (company.debt > 0) {
                                                if ( !(company.company_name in $scope.ngModel) ) {
                                                    $scope.ngModel[company.company_name] = [];
                                                }

                                                if (amount > company.debt) { // Queda excedente
                                                    // Si aún no existe un array en ngModel de esa empresa
                                                    var debtOrigAmount = $window.checkPrecision(company.debt / rate);

                                                    if (!$scope.existsAmountType(company.company_name, 'EFECTIVO', money, debtOrigAmount, company.debt)) {
                                                        $scope.ngModel[company.company_name].push({
                                                            companyId: company.company_id,
                                                            method: 'EFECTIVO',
                                                            money: money,
                                                            origAmount: debtOrigAmount,
                                                            amount: company.debt
                                                        });
                                                    }

                                                    // Aún queda saldo para cancelar más empresas
                                                    amount = $window.checkPrecision(amount - company.debt);
                                                    origAmount = $window.checkPrecision(origAmount - debtOrigAmount);
                                                    company.debt = 0;
                                                } else {
                                                    if (!$scope.existsAmountType(company.company_name, 'EFECTIVO', money, origAmount, amount)) {
                                                        $scope.ngModel[company.company_name].push({
                                                            companyId: company.company_id,
                                                            method: 'EFECTIVO',
                                                            money: money,
                                                            origAmount: origAmount,
                                                            amount: amount
                                                        });
                                                    }

                                                    // La cantidad pagada es menor o igual al monto de empresa a cancelar
                                                    company.debt = $window.checkPrecision(company.debt - amount);
                                                    amount = 0;
                                                    origAmount = 0;

                                                    break;
                                                }
                                            }
                                        }

                                        if (amount > 0) {
                                            // Se pagaron todas las empresas con efectivo, pero aún queda vuelto

                                            var company = $scope.companyList[$scope.companyList.length - 1];

                                            if (!$scope.existsAmountType(company.company_name, 'EFECTIVO', money, origAmount, amount)) {
                                                $scope.ngModel[company.company_name].push({
                                                    companyId: company.company_id,
                                                    method: 'EFECTIVO',
                                                    money: money,
                                                    origAmount: origAmount,
                                                    amount: amount
                                                });
                                            }

                                            company.debt = $window.checkPrecision(company.debt - amount);
                                        }

                                        $scope.resetInputTabs();
                                    }
                                }
                                break;
                            case $scope.tabOptions.TARJETA:
                                if ($scope.inStep('TARJETA', 'EMPRESA')) {
                                    $scope.setStep('TARJETA', 'TIPO');
                                } else if ($scope.inStep('TARJETA', 'TIPO')) {
                                    $scope.setStep('TARJETA', 'VERIFICACION');
                                } else if ($scope.inStep('TARJETA', 'VERIFICACION')) {
                                    $scope.setStep('TARJETA', 'OPERACION');
                                } else if ($scope.inStep('TARJETA', 'OPERACION')) {
                                    $scope.setStep('TARJETA', 'MONTO');
                                } else if ($scope.inStep('TARJETA', 'MONTO')) {
                                    if ($scope.tabs.TARJETA.EMPRESA) {
                                        var company = $scope.getCurrentCompanyName();

                                        if ( !(company in $scope.ngModel) ) {
                                            $scope.ngModel[company] = [];
                                        }

                                        $scope.ngModel[company].push({
                                            companyId: $scope.tabs.TARJETA.EMPRESA,
                                            method: 'TARJETA',
                                            type: $scope.tabs.TARJETA.TIPO,
                                            security: $scope.tabs.TARJETA.VERIFICACION,
                                            operation: $scope.tabs.TARJETA.OPERACION,
                                            amount: $scope.tabs.TARJETA.MONTO.amount
                                        });

                                        if (company in $scope.companies) {
                                            $scope.companies[company].debt = $window.checkPrecision($scope.companies[company].debt - $scope.tabs.TARJETA.MONTO.amount);
                                        }

                                        $scope.resetInputTabs();
                                    }
                                }
                                break;
                            case $scope.tabOptions.RESUMEN:
                                $scope.onsuccess($element.find('[name="modal"]'));
                                break;
                        }
                        
                    }
                };

                $scope.setInput = function (key) {
                    if (typeof key === 'number') {
                        if ($scope.inStep('EFECTIVO', 'MONTO') || $scope.inStep('TARJETA', 'MONTO')) {
                            var tab = ($scope.inStep('EFECTIVO', 'MONTO') ? 'EFECTIVO' : 'TARJETA');

                            if ($scope.tabs[tab].MONTO.label === '0') {
                                $scope.tabs[tab].MONTO.label = key.toString();
                            } else {
                                $scope.tabs[tab].MONTO.label += key.toString();
                            }
                            
                            $scope.tabs[tab].MONTO.amount = parseFloat($scope.tabs[tab].MONTO.label);
                        } else if ($scope.inStep('TARJETA', 'VERIFICACION') || $scope.inStep('TARJETA', 'OPERACION')) {
                            var step = ($scope.inStep('TARJETA', 'VERIFICACION') ? 'VERIFICACION' : 'OPERACION');

                            $scope.tabs.TARJETA[step] += key.toString();
                        }
                    } else if (key === '.') { // Es un punto (.)
                        if ($scope.inStep('EFECTIVO', 'MONTO') || $scope.inStep('TARJETA', 'MONTO')) {
                            var tab = ($scope.inStep('EFECTIVO', 'MONTO') ? 'EFECTIVO' : 'TARJETA');

                            if ($scope.tabs[tab].MONTO.label.indexOf('.') < 0) {
                                $scope.tabs[tab].MONTO.label += '.';
                            }
                        }
                    } else if (key === '*') {
                        if ($scope.inStep('EFECTIVO', 'MONTO')) {
                            if ($scope.tabs.EFECTIVO.MONEDA.abbrev === 'PEN') { // Soles
                                $scope.tabs.EFECTIVO.MONTO.amount = $scope.amountToPay;
                            } else { // Usar tipo de cambio
                                $scope.tabs.EFECTIVO.MONTO.amount = $window.checkPrecision($scope.amountToPay * $scope.tabs.EFECTIVO.MONEDA.unit / $scope.tabs.EFECTIVO.MONEDA.value);
                            }
                            
                            $scope.tabs.EFECTIVO.MONTO.label = $scope.tabs.EFECTIVO.MONTO.amount.toFixed(2);
                        } else if ($scope.inStep('TARJETA', 'MONTO')) {
                            $scope.tabs.TARJETA.MONTO.amount = $scope.amountToPay;
                            $scope.tabs.TARJETA.MONTO.label = $scope.tabs.TARJETA.MONTO.amount.toFixed(2);
                        }
                    }
                };

                $scope.clearLastInput = function () {
                    if ($scope.inStep('EFECTIVO', 'MONTO') || $scope.inStep('TARJETA', 'MONTO')) {
                        var tab = ($scope.inStep('EFECTIVO', 'MONTO') ? 'EFECTIVO' : 'TARJETA');

                        if ($scope.tabs[tab].MONTO.label.length > 1) {
                            $scope.tabs[tab].MONTO.label = $scope.tabs[tab].MONTO.label.substring(0, $scope.tabs[tab].MONTO.label.length - 1);
                        } else {
                            $scope.tabs[tab].MONTO.label = '0';
                        }
                        
                        $scope.tabs[tab].MONTO.amount = parseFloat($scope.tabs[tab].MONTO.label);
                    } else if ($scope.inStep('TARJETA', 'VERIFICACION') || $scope.inStep('TARJETA', 'OPERACION')) {
                        var step = ($scope.inStep('TARJETA', 'VERIFICACION') ? 'VERIFICACION' : 'OPERACION');

                        if ($scope.tabs.TARJETA[step].length > 1) {
                            $scope.tabs.TARJETA[step] = $scope.tabs.TARJETA[step].substring(0, $scope.tabs.TARJETA[step].length - 1);
                        } else {
                            $scope.tabs.TARJETA[step] = '';
                        }
                    }
                };

                $scope.clearAllInput = function () {
                    if ($scope.inStep('EFECTIVO', 'MONTO') || $scope.inStep('TARJETA', 'MONTO')) {
                        var tab = ($scope.inStep('EFECTIVO', 'MONTO') ? 'EFECTIVO' : 'TARJETA');

                        $scope.tabs[tab].MONTO.label = '0';
                        $scope.tabs[tab].MONTO.amount = 0;
                    } else if ($scope.inStep('TARJETA', 'VERIFICACION') || $scope.inStep('TARJETA', 'OPERACION')) {
                        var step = ($scope.inStep('TARJETA', 'VERIFICACION') ? 'VERIFICACION' : 'OPERACION');

                        $scope.tabs.TARJETA[step] = '';
                    }
                };

                $scope.existsAmountType = function (company, method, money, origAmount, amount) {
                    if (company in $scope.ngModel) {
                        for (var i = 0; i < $scope.ngModel[company].length; i++) {
                            if (money !== undefined) {
                                if ($scope.ngModel[company][i].method === method && $scope.ngModel[company][i].money === money) {
                                    if (typeof origAmount === 'number' && typeof amount === 'number') {
                                        $scope.ngModel[company][i].origAmount = $window.checkPrecision($scope.ngModel[company][i].origAmount + origAmount);
                                        $scope.ngModel[company][i].amount = $window.checkPrecision($scope.ngModel[company][i].amount + amount);
                                    }

                                    return true;
                                }
                            } else {
                                if ($scope.ngModel[company][i].method === method) {
                                    return true;
                                }
                            }
                        }
                    }

                    return false;
                };

                $scope.getAmountPaid = function (companyName) {
                    var returned = 0;

                    (companyName in $scope.ngModel) && $scope.ngModel[companyName].forEach(function (payment) {
                        returned = $window.checkPrecision(returned + payment.amount);
                    });

                    return returned;
                };

                $scope.getTotalPaid = function () {
                    var returned = 0;

                    Object.keys($scope.ngModel).forEach(function (companyName) {
                        returned = $window.checkPrecision(returned + $scope.getAmountPaid(companyName));
                    });

                    return returned;
                };

                $scope.getChange = function () {
                    return $window.checkPrecision($scope.getTotalPaid() - $scope.totalSaleAmount);
                };

                $scope.stillOwe = function () { // Indica si aún se debe alguna cantidad
                    return $scope.getTotalPaid() < $scope.totalSaleAmount;
                };

                $scope.isAllowedCardStep = function (step) { // Solo para TARJETA
                    switch (step) {
                        case 'TIPO':
                            return $scope.tabs.TARJETA.EMPRESA > 0; // Es el primer paso, así que siempre puede ser accedido
                        case 'VERIFICACION':
                            return $scope.tabs.TARJETA.EMPRESA > 0 && $scope.tabs.TARJETA.TIPO > 0;
                        case 'OPERACION':
                            return $scope.tabs.TARJETA.EMPRESA > 0 && $scope.tabs.TARJETA.TIPO > 0 && $scope.tabs.TARJETA.VERIFICACION.length;
                        case 'MONTO':
                            return $scope.tabs.TARJETA.EMPRESA > 0 && $scope.tabs.TARJETA.TIPO > 0 && $scope.tabs.TARJETA.VERIFICACION.length && $scope.tabs.TARJETA.OPERACION.length;
                    }

                    return true;
                };

                $scope.getCardAlias = function (cardId) {
                    var returned = '';

                    for (var i = 0; i < $scope.cards.length; i++) {
                        if ($scope.cards[i].id == cardId) {
                            returned = $scope.cards[i].abbrev;
                            break;
                        }
                    }

                    return returned;
                };

                $scope.removePayment = function (company, index) {
                    var item = $scope.ngModel[company].splice(index, 1);

                    if (item.length === 1 && company in $scope.companies) {
                        $scope.companies[company].debt = $window.checkPrecision($scope.companies[company].debt + item[0].amount);
                    }

                    item.length = 0;
                };

                // Por defecto muestra inicialmente la pestaña EFECTIVO
                $scope.setTab('EFECTIVO');

                HotKeys.add(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '*'], $element, function (e, key) {
                    if ($scope.inStep('EFECTIVO', 'MONTO') || $scope.inStep('TARJETA', 'MONTO')) {
                        $scope.$apply(function () {
                            if (key !== '.' && key !== '*') {
                                $scope.setInput(parseInt(key, 10));
                            } else {
                                $scope.setInput(key);
                            }
                        });

                        e.preventDefault();
                    } else if ($scope.inStep('TARJETA', 'VERIFICACION') || $scope.inStep('TARJETA', 'OPERACION')) {
                        $scope.$apply(function () {
                            if (key !== '.' && key !== '*') {
                                $scope.setInput(parseInt(key, 10));
                            }
                        });

                        e.preventDefault();
                    } else if (!$scope.isTab('RESUMEN')) {
                        $element.find('.tab-pane.active [data-key="' + key + '"]').trigger('click').focus();
                    }
                });

                HotKeys.add('DEL', $element, function (e, key) {
                    $scope.$apply(function () {
                        $scope.clearLastInput();
                    });
                    
                    e.preventDefault();
                });

                HotKeys.add('SUPR', $element, function (e, key) {
                    $scope.$apply(function () {
                        $scope.clearAllInput();
                    });
                    
                    e.preventDefault();
                });

                HotKeys.add('INTRO', $element, function (e, key) {
                    $element.find('button.btn-primary:last, button.btn-success:last').trigger('click'); // Aún se dispara cuando está en disabled

                    e.preventDefault();
                });

                HotKeys.add('LEFT', $element, function (e, key) {
                    if ($scope.isTab('TARJETA')) {
                        $scope.setTab('EFECTIVO');
                    } else if ($scope.isTab('EFECTIVO')) {
                        $scope.setTab('RESUMEN');
                    }

                    e.preventDefault();
                });

                HotKeys.add('RIGHT', $element, function (e, key) {
                    if ($scope.isTab('RESUMEN')) {
                        $scope.setTab('EFECTIVO');
                    } else if ($scope.isTab('EFECTIVO')) {
                        $scope.setTab('TARJETA');
                    }

                    e.preventDefault();
                });

                HotKeys.add('UP', $element, function (e, key) {
                    if ($scope.inStep('EFECTIVO', 'MONTO')) {
                        $scope.setStep('EFECTIVO', 'MONEDA');
                        e.preventDefault();
                    } else if ($scope.inStep('TARJETA', 'TIPO')) {
                        $scope.setStep('TARJETA', 'EMPRESA');
                        e.preventDefault();
                    } else if ($scope.inStep('TARJETA', 'VERIFICACION')) {
                        $scope.setStep('TARJETA', 'TIPO');
                        e.preventDefault();
                    } else if ($scope.inStep('TARJETA', 'OPERACION')) {
                        $scope.setStep('TARJETA', 'VERIFICACION');
                        e.preventDefault();
                    } else if ($scope.inStep('TARJETA', 'MONTO')) {
                        $scope.setStep('TARJETA', 'OPERACION');
                        e.preventDefault();
                    }

                    $scope.$apply(); // Porque los cuadros se muestran con angular, a diferencia de las pestañas
                });

                HotKeys.add('DOWN', $element, function (e, key) {
                    if ($scope.inStep('EFECTIVO', 'MONEDA')) {
                        $scope.setStep('EFECTIVO', 'MONTO');
                        e.preventDefault();
                    } else if ($scope.inStep('TARJETA', 'EMPRESA')) {
                        $scope.setStep('TARJETA', 'TIPO');
                        e.preventDefault();
                    } else if ($scope.inStep('TARJETA', 'TIPO')) {
                        $scope.setStep('TARJETA', 'VERIFICACION');
                        e.preventDefault();
                    } else if ($scope.inStep('TARJETA', 'VERIFICACION')) {
                        $scope.setStep('TARJETA', 'OPERACION');
                        e.preventDefault();
                    } else if ($scope.inStep('TARJETA', 'OPERACION')) {
                        $scope.setStep('TARJETA', 'MONTO');
                        e.preventDefault();
                    }

                    $scope.$apply(); // Porque los cuadros se muestran con angular, a diferencia de las pestañas
                });
            }],
            link: function (scope, element, attrs, ctrl) {
                element.find('[name="modal"]')
                    .on('shown.bs.modal', function () {
                        $(this).find('.nav-tabs .active > a').focus();
                    })
                    .on('click', function (e) {
                        if (e.target.tagName !== 'A' && e.target.tagName !== 'BUTTON' && e.target.name !== 'modal') {
                            $(this).find('.nav-tabs .active > a').focus();
                        }
                    });

                element.find('[name="pay-button"]').click(function () {
                    element.find('[name="modal"]').modal('show');
                }).trigger('click');
            },
            template: `
                <button type="button" name="pay-button" class="btn btn-success hide"></button>
                <div name="modal" class="modal fade">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <div class="row">
                                    <div class="col-sm-8 col-xs-6">
                                        <h4 class="modal-title" ng-switch="amountToPay !== false && isTab('TARJETA') && !inStep('TARJETA', 'EMPRESA')">
                                            <span ng-switch-when="true">Cobrar para {{ getCurrentCompanyName() }}</span>
                                            <span ng-switch-when="false">Cobrar venta</span>
                                        </h4>
                                    </div>
                                    <div class="col-sm-4 col-xs-6">
                                        <h4 class="modal-title text-primary text-right" ng-if="amountToPay !== false && !inStep('TARJETA', 'EMPRESA')">
                                            S/ {{ amountToPay | number : 2 }}
                                        </h4>
                                    </div>
                                </div>
                            </div>
                            <div class="modal-body">
                                <section class="panel panel-default m-b-none">
                                    <header class="panel-heading bg-light">
                                        <ul class="nav nav-tabs nav-justified">
                                            <li ng-class="{ active: isTab('RESUMEN') }">
                                                <a ng-click="setTab('RESUMEN')" data-action="RESUMEN" href="#">Resumen</a>
                                            </li>
                                            <li ng-class="{ active: isTab('EFECTIVO'), disabled: !stillOwe() }">
                                                <a ng-click="setTab('EFECTIVO')" href="#" data-action="EFECTIVO">Efectivo</a>
                                            </li>
                                            <li ng-class="{ active: isTab('TARJETA'), disabled: !stillOwe() }">
                                                <a ng-click="setTab('TARJETA')" href="#" data-action="TARJETA">Tarjeta</a>
                                            </li>
                                        </ul>
                                    </header>
                                    <div class="panel-body">
                                        <div class="tab-content">
                                            <div class="tab-pane" ng-class="{ active: isTab('RESUMEN') }">
                                                <table ng-repeat="company in companyList" ng-if="company.inSale" class="table table-bordered">
                                                    <tbody>
                                                        <tr ng-repeat="pay in ngModel[company.company_name]">
                                                            <td width="80" ng-if="!$index" rowspan="{{ 2 + $parent.ngModel[company.company_name].length }}" class="v-middle">
                                                                {{ company.company_name }}
                                                            </td>
                                                            <td colspan="{{ pay.method === 'TARJETA' || pay.money === 'PEN' ? '2' : '' }}">
                                                                Pago con {{ pay.method | lowercase }}
                                                                {{ pay.method === 'TARJETA' ? getCardAlias(pay.type) + ' ' + pay.security : '' }}
                                                            </td>
                                                            <td class="text-right" ng-if="pay.method === 'EFECTIVO' && pay.money !== 'PEN'">
                                                                {{ pay.money }} {{ pay.origAmount | number : 2 }}
                                                            </td>
                                                            <td class="text-right">
                                                                {{ pay.amount | number : 2 }}
                                                            </td>
                                                            <td class="text-center" width="50">
                                                                <a href="#" ng-click="removePayment(company.company_name, $index)" class="text-danger" title="Remover" data-tooltip>
                                                                    <i class="fa fa-times" />
                                                                </a>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td width="80" rowspan="2" class="v-middle" ng-if="!ngModel[company.company_name].length">
                                                                {{ company.company_name }}
                                                            </td>
                                                            <td colspan="2" class="text-right">
                                                                Subtotal pagado
                                                            </td>
                                                            <td width="100" class="text-right">
                                                                {{ getAmountPaid(company.company_name) | number : 2 }}
                                                            </td>
                                                            <td width="50">
                                                                &nbsp;
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td colspan="2" class="text-right">
                                                                Subtotal a pagar
                                                            </td>
                                                            <td width="100" class="text-right text-primary">
                                                                {{ company.amount | number : 2 }}
                                                            </td>
                                                            <td width="50">
                                                                &nbsp;
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                
                                                <table class="table m-b-none">
                                                    <tbody>
                                                        <tr>
                                                            <td class="text-right" style="border-top:none">
                                                                Total pagado
                                                            </td>
                                                            <td width="100" class="text-right" style="border-top:none">
                                                                {{ getTotalPaid() | number : 2 }}
                                                            </td>
                                                            <td width="50" style="border-top:none">
                                                                &nbsp;
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td class="text-right">
                                                                Total a pagar
                                                            </td>
                                                            <td width="100" class="text-right">
                                                                {{ totalSaleAmount | number : 2 }}
                                                            </td>
                                                            <td width="50">
                                                                &nbsp;
                                                            </td>
                                                        </tr>
                                                        <tr ng-if="getChange() < 0">
                                                            <td class="text-right">
                                                                Debe
                                                            </td>
                                                            <td class="text-right text-danger">
                                                                {{ -getChange() | number : 2 }}
                                                            </td>
                                                            <td width="50">
                                                                &nbsp;
                                                            </td>
                                                        </tr>
                                                        <tr ng-if="getChange() >= 0">
                                                            <td class="text-right">
                                                                Vuelto
                                                            </td>
                                                            <td class="text-right text-success">
                                                                {{ getChange() | number : 2 }}
                                                            </td>
                                                            <td width="50">
                                                                &nbsp;
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div class="tab-pane" ng-class="{ active: isTab('EFECTIVO') }">
                                                <div class="row">
                                                    <div class="col-sm-4">
                                                        <div class="row">
                                                            <div class="col-lg-12 m-t-sm">
                                                                <button type="button" class="btn btn-default btn-rounded btn-block btn-lg text-left" ng-class="{ active: tabs.EFECTIVO.selected === tabs.EFECTIVO.opts.MONEDA }" ng-click="setStep('EFECTIVO', 'MONEDA')">
                                                                    Moneda
                                                                </button>
                                                            </div>
                                                            <div class="col-lg-12 m-t-sm">
                                                                <button type="button" class="btn btn-default btn-rounded btn-block btn-lg text-left" ng-class="{ active: tabs.EFECTIVO.selected === tabs.EFECTIVO.opts.MONTO }" ng-click="setStep('EFECTIVO', 'MONTO')">
                                                                    Monto
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="col-sm-8">
                                                        <div class="row" ng-if="tabs.EFECTIVO.selected === tabs.EFECTIVO.opts.MONEDA">
                                                            <div class="col-lg-12 m-t-sm">
                                                                <button type="button" class="btn btn-default btn-block btn-lg text-left" ng-class="{ active: tabs.EFECTIVO.MONEDA.abbrev == 'PEN' }" ng-click="setOption('EFECTIVO.MONEDA', 'PEN')" data-key="1">
                                                                    1. Soles (PEN)
                                                                </button>
                                                            </div>
                                                            <div ng-repeat="rate in exchangeRates" class="col-lg-12 m-t-sm">
                                                                <button type="button" class="btn btn-default btn-block btn-lg text-left" ng-class="{ active: tabs.EFECTIVO.MONEDA.abbrev == rate.money_abbrev }" ng-click="setOption('EFECTIVO.MONEDA', [rate.money_abbrev, rate.unit, rate.purchase_value])" data-key="{{ $index + 2 }}">
                                                                    {{ $index + 2 }}. {{ rate.money_abbrev === 'USD' ? 'Dólares americanos' : 'Pesos chilenos' }} ({{ rate.money_abbrev }})
                                                                </button>
                                                            </div>
                                                        </div>
                                                        <div class="row" ng-if="tabs.EFECTIVO.selected === tabs.EFECTIVO.opts.MONTO">
                                                            <div class="col-xs-4">
                                                                <h3 class="m-t-sm">{{ tabs.EFECTIVO.MONEDA.abbrev === 'PEN' ? 'S/' : tabs.EFECTIVO.MONEDA.abbrev }}</h3>
                                                            </div>
                                                            <div class="col-xs-8">
                                                                <h3 class="text-right m-t-sm">{{ tabs.EFECTIVO.MONTO.label }}</h3>
                                                            </div>
                                                            <div class="col-xs-4" ng-if="tabs.EFECTIVO.MONEDA.abbrev !== 'PEN'">
                                                                <h4 class="m-t-sm">S/</h4>
                                                            </div>
                                                            <div class=" col-xs-8" ng-if="tabs.EFECTIVO.MONEDA.abbrev !== 'PEN'">
                                                                <h4 class="text-right m-t-sm">{{ tabs.EFECTIVO.MONTO.amount * tabs.EFECTIVO.MONEDA.value / tabs.EFECTIVO.MONEDA.unit | number : 2 }}</h4>
                                                            </div>
                                                        </div>
                                                        <div class="row" ng-if="tabs.EFECTIVO.selected === tabs.EFECTIVO.opts.MONTO">
                                                            <div class="col-xs-4 m-t-sm" ng-repeat="number in (9 | range)">
                                                                <button type="button" class="btn btn-default btn-block btn-lg" ng-click="setInput(number + 1)" data-key="{{ number + 1 }}">
                                                                    {{ number + 1 }}
                                                                </button>
                                                            </div>
                                                            <div class="col-xs-4 m-t-sm">
                                                                <button type="button" class="btn btn-danger btn-block btn-lg" ng-click="clearAllInput()" data-key="c">
                                                                    Supr
                                                                </button>
                                                            </div>
                                                            <div class="col-xs-4 m-t-sm">
                                                                <button type="button" class="btn btn-default btn-block btn-lg" ng-click="setInput(0)" data-key="0">
                                                                    0
                                                                </button>
                                                            </div>
                                                            <div class="col-xs-4 m-t-sm">
                                                                <button type="button" class="btn btn-default btn-block btn-lg" ng-click="setInput('.')" data-key=".">
                                                                    &middot;
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="tab-pane" ng-class="{ active: isTab('TARJETA') }">
                                                <div class="row">
                                                    <div class="col-sm-4">
                                                        <div class="row">
                                                            <div class="col-lg-12 m-t-sm">
                                                                <button type="button" class="btn btn-default btn-rounded btn-block btn-lg text-left" ng-class="{ active: inStep('TARJETA', 'EMPRESA') }" ng-click="setStep('TARJETA', 'EMPRESA')">
                                                                    Empresa
                                                                </button>
                                                            </div>
                                                            <div class="col-lg-12 m-t-sm">
                                                                <button type="button" class="btn btn-default btn-rounded btn-block btn-lg text-left" ng-class="{ active: inStep('TARJETA', 'TIPO') }" ng-click="setStep('TARJETA', 'TIPO')" ng-disabled="!isAllowedCardStep('TIPO')">
                                                                    Tipo
                                                                </button>
                                                            </div>
                                                            <div class="col-lg-12 m-t-sm">
                                                                <button type="button" class="btn btn-default btn-rounded btn-block btn-lg text-left" ng-class="{ active: inStep('TARJETA', 'VERIFICACION') }" ng-click="setStep('TARJETA', 'VERIFICACION')" ng-disabled="!isAllowedCardStep('VERIFICACION')">
                                                                    Verificación
                                                                </button>
                                                            </div>
                                                            <div class="col-lg-12 m-t-sm">
                                                                <button type="button" class="btn btn-default btn-rounded btn-block btn-lg text-left" ng-class="{ active: inStep('TARJETA', 'OPERACION') }" ng-click="setStep('TARJETA', 'OPERACION')" ng-disabled="!isAllowedCardStep('OPERACION')">
                                                                    Operación
                                                                </button>
                                                            </div>
                                                            <div class="col-lg-12 m-t-sm">
                                                                <button type="button" class="btn btn-default btn-rounded btn-block btn-lg text-left" ng-class="{ active: inStep('TARJETA', 'MONTO') }" ng-click="setStep('TARJETA', 'MONTO')" ng-disabled="!isAllowedCardStep('MONTO')">
                                                                    Monto
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="col-sm-8">
                                                        <div class="row" ng-if="inStep('TARJETA', 'EMPRESA')">
                                                            <div ng-repeat="company in companyList" class="col-lg-12 m-t-sm">
                                                                <button ng-click="setOption('TARJETA.EMPRESA', [company.company_id, company.inSale, company.debt])" ng-disabled="company.debt <= 0" type="button" class="btn btn-default btn-block" ng-class="{ active: ($parent.tabs.TARJETA.EMPRESA == company.company_id) }" data-key="{{ $index + 1 }}">
                                                                    <h4 class="pull-left">{{ $index + 1 }}. {{ company.company_name }}</h4>
                                                                    <h4 class="pull-right" ng-if="company.inSale">S/ {{ company.debt | number : 2 }}</h4>
                                                                </button>
                                                            </div>
                                                        </div>
                                                        <div class="row" ng-if="inStep('TARJETA', 'TIPO')">
                                                            <div ng-repeat="card in cards" class="col-lg-12 m-t-sm">
                                                                <button type="button" class="btn btn-default btn-block btn-lg text-left" ng-class="{ active: tabs.TARJETA.TIPO == card.id }" ng-click="setOption('TARJETA.TIPO', card.id)" data-key="{{ $index + 1 }}">
                                                                    {{ $index + 1 }}. {{ card.description }}
                                                                </button>
                                                            </div>
                                                        </div>
                                                        <div class="row" ng-if="inStep('TARJETA', 'VERIFICACION') || inStep('TARJETA', 'OPERACION') || inStep('TARJETA', 'MONTO')">
                                                            <div class="col-xs-12">
                                                                <h3 class="text-right m-t-sm" ng-class="{ 'text-danger': (inStep('TARJETA', 'MONTO') && tabs.TARJETA.MONTO.amount > amountToPay) }">
                                                                    {{ inStep('TARJETA', 'MONTO') ? tabs.TARJETA.MONTO.label : ( inStep('TARJETA', 'OPERACION') ? tabs.TARJETA.OPERACION : tabs.TARJETA.VERIFICACION ) || '- Ingrese -' }}
                                                                </h3>
                                                            </div>
                                                        </div>
                                                        <div class="row" ng-if="inStep('TARJETA', 'VERIFICACION') || inStep('TARJETA', 'OPERACION') || inStep('TARJETA', 'MONTO')">
                                                            <div class="col-xs-4 m-t-sm" ng-repeat="number in (9 | range)">
                                                                <button type="button" class="btn btn-default btn-block btn-lg" ng-click="setInput(number + 1)" data-key="{{ number + 1 }}">
                                                                    {{ number + 1 }}
                                                                </button>
                                                            </div>
                                                            <div class="col-xs-4 m-t-sm">
                                                                <button type="button" class="btn btn-danger btn-block btn-lg" ng-click="clearAllInput()" data-key="c">
                                                                    Supr
                                                                </button>
                                                            </div>
                                                            <div class="m-t-sm" ng-class="{ 'col-xs-4' : inStep('TARJETA', 'MONTO'), 'col-xs-8': !inStep('TARJETA', 'MONTO') }">
                                                                <button type="button" class="btn btn-default btn-block btn-lg" ng-click="setInput(0)" data-key="0">
                                                                    0
                                                                </button>
                                                            </div>
                                                            <div class="col-xs-4 m-t-sm" ng-if="inStep('TARJETA', 'MONTO')">
                                                                <button type="button" class="btn btn-default btn-block btn-lg" ng-click="setInput('.')" data-key=".">
                                                                    &middot;
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </div>
                            <div class="modal-footer m-t-none">
                                <button type="button" class="btn btn-default" data-dismiss="modal">Cancelar</button>
                                <button type="button" class="btn btn-primary" ng-class="{ 'btn-primary': !isTab('RESUMEN'), 'btn-success': isTab('RESUMEN') }" ng-disabled="isOkDisabled()" ng-click="ok()" ng-bind="isTab('RESUMEN') ? successLabel || 'Guardar e imprimir' : 'Aceptar'"></button>
                            </div>
                        </div>
                    </div>
                </div>
            `
        };
    }
]);
