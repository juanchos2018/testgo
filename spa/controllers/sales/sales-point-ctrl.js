window.angular.module('ERP').controller('SalesPointCtrl', [
	'$scope', '$rootScope', '$window', '$document', '_$', '_angular', '_riot', '$route', '$timeout', '$location', '$filter', 'Page', 'Sales', 'Settings', 'Session', 'Ajax', 'HotKeys', 'Auth',
	function ($scope, $rootScope, $window, $document, $, angular, riot, $route, $timeout, $location, $filter, Page, Sales, Settings, Session, Ajax, HotKeys, Auth) {
		Page.title('Caja');
    
		$scope.salePointStates = {
			'EN_ESPERA': 0,
			'SIN_REGISTROS': 1,
			'NO_ENCONTRADO': 2,
			'LISTO': 3
		}
    
		$scope.formStates = {
			'ENTRADA': 0,
			'INICIANDO_PAGO': 1,
			'PAGO': 2
		};
    
    $scope.config = {
      type: '',
      company: '',
      regime: '',
      reference: {
        type: 'TICKET',
        serie: ''
      }
    };

    $scope.typeOpts = [
      { value: Sales.BOLETA, text: 'Boleta' },
      { value: Sales.FACTURA, text: 'Factura' },
      { value: Sales.NOTA_DE_CREDITO, text: 'Nota de crédito' }
    ];
    
		$scope.saleman = { // Para <erp-saleman-chooser>
			list: [],
			selected: {}
		};
    
		$scope.customer = {}; // Para <erp-customer-chooser>
		
		$scope.salePoints = [];
		$scope.salePointSate = $scope.salePointStates.EN_ESPERA;
    
		$scope.saleDetails = [];
    $scope.packs = [];
		$scope.payments = {};
    
    $scope.availablePacks = new Map();
    $scope.productsInPacks = new Map();
    $scope.campaignPacks = [];
    
		$scope.formState = $scope.formStates.ENTRADA;
    
		$scope.isSaving = false;
    
    $scope.saleDate = '';
    
		$scope.initCurrentSalePoint = function () {
			$scope.currentSalePoint = $window.localStorage.currentSalePoint || '';
			
			if (!$scope.salePoints.length) {
				// Debe crear/asignar puntos de venta
				$scope.salePointState = $scope.salePointStates.SIN_REGISTROS;
			} else if (!$scope.currentSalePoint.length) {
				// Debe asignar punto de venta actual
				$scope.salePointState = $scope.salePointStates.NO_ENCONTRADO;
			} else {
				// Verificar si el punto de venta actual es válido
				var salePointIndex = -1;
				var salePointItems = [];
        
				$scope.salePoints.forEach(function (salePoint, index) {
					if (salePoint.id === $scope.currentSalePoint) {
						salePointIndex = index;
						salePointItems.push({ text: salePoint.description, checked: true });
					} else {
						salePointItems.push({ text: salePoint.description, action: (function (id) {
							return function () {
								$window.localStorage.currentSalePoint = id;
								$route.reload();
							};
						})(salePoint.id) });
					}
				});
        
				if (salePointIndex < 0) {
					$scope.currentSalePoint = $window.localStorage.currentSalePoint = '';
          
					$scope.salePointState = $scope.salePointStates.NO_ENCONTRADO;
				} else {
					$scope.salePointState = $scope.salePointStates.LISTO;
					console.log($scope.currentSalePoint);
					/* Agregar el dropdown */
					salePointItems.push({ type: 'separator' });
					salePointItems.push({ text: 'Consulta',action: (function () {
						return function () {
							companies = $scope.Settings.branches[Auth.value('userBranchName')].companies;
							//alert(companies[1].company_id);
              
							bootbox.prompt("Eliga Fecha del Reporte", function(result) { 
                console.log("input fecha", result);
								$scope.saleDate = moment(result, "DD/MM/YYYY").format('YYYY-MM-DD');
								//moment(this.contrato.dFecFin, "DD/MM/YYYY").format("YYYY-MM-DD")
								console.log($scope.saleDate);
								console.log(Auth.value('userCompanies'));
								companies.forEach(function (company) {
                  Ajax.get($window.siteUrl('sales/cashout/0/' + $scope.currentSalePoint + '/' + company.company_id + '/' + $scope.saleDate))
                  .then(function (res) {
                    //$scope.saleReport = res.data;
                    var report_date = result;
                    var data_t = res.data['sales_t'];
                    var data_f = res.data['sales_f'];
                    var data_b = res.data['sales_b'];
                    var data_n = res.data['sales_n'];
                    var cards = res.data['cards'];
                    var category = res.data['categories'];
                    var info = res.data['info'];
                    var tickets = res.data['reg_tickets'];
                    Sales.printCashout(null, company.company_id, data_t, data_b, data_n, cards, info, tickets, category, data_f, 'CONSULTA DE CAJA', report_date);
                  }, function (err) {
                    console.log('err', err);
                  });
  							});
              });
						};
					})()  });
					salePointItems.push({ text: 'Cerrar caja',action: (function () {
						return function () {
							companies = $scope.Settings.branches[Auth.value('userBranchName')].companies;
							//alert(companies[1].company_id);
							var f = new Date();
							
							$scope.saleDate = f.getFullYear() + "-" + (f.getMonth() +1) + "-" + f.getDate();
							console.log($scope.saleDate);
							console.log(Auth.value('userCompanies'));
							companies.forEach(function (company) {
                Ajax.get($window.siteUrl('sales/cashout/1/' + $scope.currentSalePoint + '/' + company.company_id  + '/' + $scope.saleDate))
                .then(function (res) {
                  //$scope.saleReport = res.data;
                  
                  var data_t = res.data['sales_t'];
                  var data_f = res.data['sales_f'];
                  var data_b = res.data['sales_b'];
                  var data_n = res.data['sales_n'];
                  var cards = res.data['cards'];
                  var category = res.data['categories'];
                  var info = res.data['info'];
                  var tickets = res.data['reg_tickets'];
                  Sales.printCashout(null, company.company_id, data_t, data_b, data_n, cards, info, tickets, category, data_f, 'CIERRE DE CAJA(X)', false);
                }, function (err) {
                  console.log('err', err);
                });
              });
              
						};
					})()  });
					salePointItems.push({ text: 'Cerrar dia',action: (function () {
						return function () {
							companies = $scope.Settings.branches[Auth.value('userBranchName')].companies;
							//alert(companies['cards'].company_id);
							var f = new Date();
							
							$scope.saleDate = f.getFullYear() + "-" + (f.getMonth() +1) + "-" + f.getDate();
							console.log($scope.saleDate);
							console.log(Auth.value('userCompanies'));
							companies.forEach(function (company) {
                Ajax.get($window.siteUrl('sales/cashout/2/' + $scope.currentSalePoint + '/' + company.company_id  + '/' + $scope.saleDate))
                .then(function (res) {
                  //$scope.saleReport = res.data;
                  var data_t = res.data['sales_t'];
                  var data_f = res.data['sales_f'];
                  var data_b = res.data['sales_b'];
                  var data_n = res.data['sales_n'];
                  var cards = res.data['cards'];
                  var category = res.data['categories'];
                  var info = res.data['info'];
                  var tickets = res.data['reg_tickets'];
                  Sales.printCashout(null, company.company_id, data_t, data_b, data_n, cards, info, tickets, category, data_f, 'CIERRE FIN DE CAJA(Z)', false);
                }, function (err) {
                  console.log('err', err);
                });
              });
						};
					})()  });
          
					$window.riot.mount('riot-dropdown', {
            label: $scope.salePoints[salePointIndex].description,
            items: salePointItems
          });
				}
			}
      
			var panels = [];
      
			$scope.exchangeRates.forEach(function (rate) {
				var abbrev = rate.money_abbrev;
        
				panels.push({
					icon: (abbrev === 'USD' ? 'flag us' : 'flag cl'),
					text: rate.unit + ' ' + (abbrev === 'USD' ? 'dólar americano' : 'pesos chilenos') + ': S/ ' + rate.purchase_value
				});
			});
      
			$window.riot.mount('riot-bottom-panel', { panels: panels });
      
			if ($scope.salePointState === $scope.salePointStates.SIN_REGISTROS) {
				Session.setMessage('No se encontraron puntos de venta vinculados a esta sucursal', 'danger', true);
			} else if ($scope.salePointState === $scope.salePointStates.NO_ENCONTRADO) {
				Session.setMessage('Necesita establecer el punto de venta en el que se encuentra', 'warning', true);
			}
    };
    
    $scope.hasDetailsWithoutPacks = function () {
      return $scope.saleDetails.find(function (saleDetail) {
        return !saleDetail.pack_list_id;
      }) !== undefined;
    };
    
		$scope.setCurrentSalePoint = function () {
			if ($scope.currentSalePoint) {
				$window.localStorage.currentSalePoint = $scope.currentSalePoint;
				$route.reload();
			}
		};
    
		$scope.removeDetail = function (index) {
			if ($scope.customer.verified) {
        $scope.saleDetails[index].trigger('remove-from-packs');
			}
			
			$scope.saleDetails.splice(index, 1);
    };
    
    $scope.removePack = function (index) {
      $scope.packs[index].details.forEach(function (saleDetail) {
        $scope.saleDetails.splice($scope.saleDetails.indexOf(saleDetail), 1);
        delete saleDetail;
      });
      
      $scope.packs[index].details.length = 0;
      $scope.packs.splice(index, 1);
    };
    
		$scope.unitPrice = function (detail) {
			if ($scope.customer.verified) {
				return parseFloat(detail.offer_price);
			} else {
				return parseFloat(detail.price);
			}
		};
    
		$scope.subTotal = function (detail) {
			return $window.checkPrecision(parseInt(detail.qty) * $scope.unitPrice(detail));
		};
    
		$scope.total = function () {
			var total = 0;
      
			$scope.saleDetails.forEach(function (detail) {
				total = $window.checkPrecision(total + $scope.subTotal(detail));
			});
      
			return total;
		};
    
		$scope.clearAll = function () {
			if ($scope.saleDetails.length) {
				$window.bootbox.confirm({
					title: '¿Está seguro?',
          message: 'Está a punto de borrar el detalle de venta ingresado.',
          buttons: {
            cancel: {
              label: 'Cancelar',
              className: 'btn-default'
            },
            confirm: {
              label: 'Continuar',
              className: 'btn-danger'
            }
          },
          callback: function (yes) {
            if (yes) {
              $scope.$apply(function () {
								$scope.reset();
              });
            }
          }
				});
			} else {
				$scope.reset();
			}
		};
    
		$scope.reset = function () {
			$scope.saleman.selected = {
				id: '',
				full_name: '',
				code: ''
			};
			$scope.customer = {
				id: '',
				full_name: '',
				id_number: '',
				type: '',
				address: '',
				verified: ''
			};
      
      $scope.saleDetails.forEach(function (saleDetail) {
        if (!saleDetail.pack_list_id) {
          saleDetail.trigger('remove-from-packs');
        }
        
        delete saleDetail;
      });
      
      $scope.saleDetails.length = 0;
      $scope.packs.length = 0;
      
			Object.keys($scope.payments).forEach(function (company) {
				$scope.payments[company].length = 0;
        
				delete $scope.payments[company];
			});
      
			$timeout(function () {
				console.log('focus', $('[erp-focus]:first'));
				$('[erp-focus]:first').focus();
			});
		};
    
		$scope.detailKeyPressed = function (e, detail) {
      if (e.keyCode === 107 || e.keyCode === 171) { // Se incrementa
				if (Number(e.target.value) < Number(e.target.max)) {
					//e.target.value++;
					detail.qty++;
				}
				
				e.preventDefault();
			} else if (e.keyCode === 109 || e.keyCode === 173) { // Se decrementa
				if (Number(e.target.value) > 1) {
					//e.target.value--;
					detail.qty--;
				}
        
				e.preventDefault();
			} else if (e.keyCode === 38) { // Arriba
				var prevInput = $(e.target)
        .parent() // TD
        .parent() // TR
        .prev()
        .find('input[type="number"]');
        
				if (prevInput.length) {
					prevInput.focus();
				}
        
				e.preventDefault();
			} else if (e.keyCode === 40) { // Abajo
				var nextInput = $(e.target)
        .parent() // TD
        .parent() // TR
        .next()
        .find('input[type="number"], input[type="text"]');
        
				if (nextInput.length) {
					nextInput.focus();
				}
        
				e.preventDefault();
			}
		};
    
		$scope.detailBlur = function (e, detail) {
			if ($scope.customer.verified && e.target.checkValidity()) {
        $scope.searchInPacks(detail);
			}
		};
      
    $scope.pay = function () {
      if ($scope.formState === $scope.formStates.ENTRADA) {
        $scope.formState = $scope.formStates.INICIANDO_PAGO;
        
        $timeout(function () {
          $scope.formState = $scope.formStates.PAGO;
        });
      }
    };
      
    $scope.cancelPayment = function () {
      if (Object.keys($scope.payments).length) {
        $window.bootbox.confirm({
          title: '¿Está seguro?',
          message: 'Está a punto de borrar ' + ($scope.payments.length === 1 ? 'el pago ingresado' : 'los pagos ingresados') + '.',
          buttons: {
            cancel: {
              label: 'Cancelar',
              className: 'btn-default'
            },
            confirm: {
              label: 'Continuar',
              className: 'btn-danger'
            }
          },
          callback: function (yes) {
            if (yes) {
              $scope.$apply(function () {
                $scope.payments = {};
                $scope.formState = $scope.formStates.ENTRADA;
              });
            }
          }
        });
      } else {
        $scope.formState = $scope.formStates.ENTRADA;
      }
    };
      
    $scope.saveAndPrint = function (modal) {
      if (!$scope.isSaving) {
        $scope.isSaving = true;
        modal.find('.btn-success').attr('disabled', true);
        
        var data = Sales.getRecords(
          $scope.config.type,
          $scope.customer,
          $scope.saleman.selected,
          $scope.saleDetails,
          $scope.payments
        );
        
        Ajax.post($window.siteUrl('sales/save'), { sales: data }).then(function (saleResponse) {
          var saleInfo = saleResponse.data;
          
          if (saleInfo.length === data.length) { // Se guardaron todas las ventas
            data.forEach(function (sale, saleIndex) {
              sale.serie = saleInfo[saleIndex].serie;
              sale.serial_number = saleInfo[saleIndex].serial;
              sale.printer_name = saleInfo[saleIndex].printer;
              sale.printer_serial = saleInfo[saleIndex].printer_serial;
              sale.cashier = Auth.value('userName') + ' ' + Auth.value('userLastName');
              sale.date = $filter('date')(new Date(), 'dd/MM/yyyy');
              sale.time = $filter('date')(new Date(), 'HH:mm');
            });
            
            //var saleCompany = Settings.getCompanyOfBranch(sale.company_id, Auth.value('userBranch'));
            modal.one('hidden.bs.modal', function () {
              $scope.$apply(function () {
                Sales.printTicket(
                  $scope.config.type,
                  //'#' + saleCompany.company_name + '-' + sale.regime,
                  false,
                  data,
                  $scope.customer,
                  $scope.saleman.selected,
                  $scope.saleDetails,
                  $scope.cardTypes,
                  $scope.packs
                );
                
                $scope.reset();
                $scope.formState = $scope.formStates.ENTRADA;
                $scope.isSaving = false;
              });
            }).modal('hide');

            //asignación sunat data
            var sunatData = data;
            var cuyito;
            var sale_details= [];
            sunatData.forEach(function (sale, saleIndex) {
              sale.operation_type = '0101';
              sale.date = $filter('date')(new Date(), 'yyyy-MM-dd');
              sale.time = $filter('date')(new Date(), 'HH:mm:ss');
              sale.sucursal_id = '000' + Auth.value('userBranch');
              sale.userDocType = (($scope.customer.doc_type) ? $scope.customer.doc_type : ($scope.docType == 'EMPRESA') ? "6" : "0"  );
              sale.idNumber = (($scope.customer.id_number) ? $scope.customer.id_number : "0000");
              sale.bussinessName = (($scope.customer.full_name) ? $scope.customer.full_name : "CLIENTES VARIOS");
              sale.igve = sale.igv.toFixed(2);
              sale.docType = $scope.customer.type;
              sale.sumTotValVenta = (sale.regime == 'ZOFRA') ? sale.total_amount.toFixed(2) : $window.checkPrecision(sale.total_amount / 1.18).toFixed(2);
              sale.letras = $window.numeroALetras(sale.total_amount, {
                plural: 'SOLES',
                singular: 'SOL',
                centPlural: 'centimos',
                centSingular: 'céntimo'
              });
              sale.sale_details.forEach(function (saleDetail){
                cuyito = $scope.saleDetails.find(function (detail) {
                  return detail.id === saleDetail.product_barcode_id && !detail.pack_list_id;
                });
                saleDetail.code = cuyito.code;
                saleDetail.des = cuyito.description,
                saleDetail.regime = cuyito.regime,
                saleDetail.igv = ((cuyito.regime == 'ZOFRA') ? 0 : $window.checkPrecision((saleDetail.price/1.18)*0.18).toFixed(2) )
                console.log()
              });
            });

            
            console.log("data cuyewsssss:", data);
            console.log("data sunat:", sunatData);

            Ajax.post($window.siteUrl('sales/sunat'), {invoices: sunatData}).then(function (sunatResponse) {
            }, function (err) {
            //  console.log('sunatResponse', sunatResponse);
              Session.setMessage(err, 'danger', true);
            });
          } else {
            console.log('saleInfo', saleInfo, '<length>', 'data', data);
            
            Session.setMessage('Ocurrió un error, no se puede imprimir el voucher.', 'danger', true);
            
            $scope.isSaving = false;
            modal.modal('hide');
          }
          
        }, function (err) {
          Session.setMessage(err, 'danger', true);
          
          $scope.isSaving = false;
          modal.modal('hide');
        });

        
      }
    };
      
    /*$scope.showPreview = function () {
      Sales.showPreview(Sales.TICKET, $scope.customer, $scope.sale$scope.saleD $scope.payments, function (modal) {
        modal.find('.btn-success').attr('disabled', true);
        
        
      });
    };*/
      
    $scope.clearOrCancel = function () {
      if ($scope.formState === $scope.formStates.ENTRADA) {
        $scope.clearAll();
      } else {
        $scope.cancelPayment();
      }
    };
    
    $scope.payOrFinish = function () {
      if ($scope.formState === $scope.formStates.ENTRADA) {
        $scope.pay();
      } else {
        $('erp-payment').find('[name="pay-button"]').trigger('click');
      }
    };
      
    $scope.searchInPacks = function (saleDetail) {
      if ($scope.customer.verified && !saleDetail.pack_list_id && $scope.productsInPacks.has(saleDetail.product_detail_id)) {
        for (var pack_id of $scope.productsInPacks.get(saleDetail.product_detail_id)) {
          //console.log('%c Se evalúa pack_id', 'background:red;color:yellow;font-size:1.5em', pack_id);
          var packLists = $scope.availablePacks.get(pack_id);
          
          if (findPack(saleDetail, packLists)) {
            //console.log('%c SE FORMO UN PAQUETE CON EL DETALLE DE VENTA', 'background:purple;color:white;font-size:2em', saleDetail);
            break;
          } /*else {
            console.log('%c NOOO SE FORMO UN PAQUETE CON EL DETALLE', 'background:pink;color:darkred;font-size:1.8em', saleDetail);
          }*/
        }
      } /*else {
        console.log('No se encontró productDetailId', saleDetail.product_detail_id, 'o el cliente no es verificado', $scope.customer.verified);
        console.log('O puede ser que ya esté en un paquete', saleDetail.pack_list_id);
      }*/
    };
      
    $scope.removeSaleDetailFromPack = function (packList) {
      return function () {
        var idx = packList.sale_details.indexOf(this);
        
        if (idx > -1) {
          //console.log('Se removerá saleDetail', this, 'de packList', packList);
          packList.sale_details.splice(idx, 1);
        }/* else {
          console.log('Se querìa remover saleDetail de pack, pero ya no está', this, packList);
        }*/
      };
    };
      
    $scope.$watch('customer.verified', function (newVal, oldVal) {
      if ($scope.saleDetails.length) { // Si se tienen registros de detalle de productos
        for (var saleDetail of $scope.saleDetails) {
          if (newVal) {
            $scope.searchInPacks(saleDetail);
          } else {
            if (!saleDetail.pack_list_id) {
              saleDetail.trigger('remove-from-packs');
            } else {
              var saleDetailFound = $scope.saleDetails.find(function (item) {
                return item.id === saleDetail.id && !item.pack_list_id;
              });
              
              if (saleDetailFound !== undefined) {
                saleDetailFound.qty += saleDetail.qty;
              } else {
                saleDetail.offer_price = saleDetail.original_offer_price;
                delete saleDetail.pack_list_id;
                delete saleDetail.original_offer_price;
              }
            }
          }
        }
        
        if (!newVal && $scope.packs.length) {
          for (var pack of $scope.packs) {
            pack.details.length = 0;
            
            delete pack;
          }
          
          $scope.packs.length = 0;
          
          var newSaleDetails = $scope.saleDetails.filter(function (saleDetail) {
            return !saleDetail.pack_list_id;
          });
          
          $scope.saleDetails.length = 0;
          $scope.saleDetails = newSaleDetails;
          
          newSaleDetails = null;
          
          //console.log('Se debería haber destruido todos los paquetes', $scope.packs);
        }
      }
    });
      
    HotKeys.add('Ctrl + SPACE', function (e) {
      if ($('[ng-view] [name="submit"]').is(':enabled')) {
        $scope.payOrFinish();
      }
      
      e.preventDefault();
    });

    function addDetailInPack(saleDetail, packList) {
      if (packList.sale_details.indexOf(saleDetail) < 0) {
        packList.sale_details.push(saleDetail);

        saleDetail.one('remove-from-packs', $scope.removeSaleDetailFromPack(packList));

        return true;
      } else {
        return false;
      }
    }
    
    function findPack(saleDetail, packLists) {
      var packCompleted = true;
      var saleDetailAdded = false;
      var saleDetailMax = 0;
      
      for (var packList of packLists) {
        if (!saleDetail.pack_list_id) {
          if (packList.product_details.indexOf(saleDetail.product_detail_id) > -1) { // && packList.sale_details.indexOf(saleDetail) < 0
            //packList.sale_details.push(saleDetail);
            if (addDetailInPack(saleDetail, packList)) {
              saleDetailAdded = true;
            }
            
            //saleDetail.one('remove-from-packs', $scope.removeSaleDetailFromPack(packList));
          }
          
          const packSaleDetailsQty = packList.sale_details.sumBy('qty');
          
          if (packSaleDetailsQty > saleDetailMax) {
            saleDetailMax = packSaleDetailsQty;
          }
          
          if (packSaleDetailsQty < packList.quantity) {
            //console.log('El pack no está completo!', packLists);
            packCompleted = false;
            
            if (saleDetailAdded) {
              //console.log('Se rompe e for...of');
              break;
            }
          }
        } else {
          //console.log('%c Ya se encuentra en al lista!', 'background:orange;color:red;font-size:1.5em');
          //console.log('saleDetail.pack_list_id', saleDetail.pack_list_id, 'pack.quantity', packList.quantity);
          packCompleted = false;
        }
      }
      
      //console.log('%c saleDetailMax', 'background:blue;color:yellow;font-size:2em', saleDetailMax);
      
      if (packCompleted) {
        //console.log('El pack está completo!!!!!!', packLists);
        var totalPacks = packLists.reduce(function (accum, pack) {
          var packCount = Math.floor(pack.sale_details.sumBy('qty') / pack.quantity);
          
          return packCount < accum ? packCount : accum;
        }, saleDetailMax);

        var firstPackList = packLists[0];
        var remainingSaleDetails = [];
        
        //console.log('%c cantidad de paquetes de este tipo encontrados', 'background:purple;color:white;font-size:2em', totalPacks);
        
        Array.apply(null, Array(totalPacks)).forEach(function () {
          var newPack = {
            description: firstPackList.description,
            price: parseFloat(firstPackList.price),
            company_id: firstPackList.company_id,
            regime: firstPackList.regime,
            details: []
          };
          
          for (var packList of packLists) {
            var packSaleDetails = [], qtySum = 0;
            
            for (var saleDetail of packList.sale_details) {
              qtySum += saleDetail.qty;
              
              if (qtySum >= packList.quantity) {
                if (qtySum > packList.quantity) {
                  var lastPackDetail = riot.observable(angular.copy(saleDetail));

                  saleDetail.qty = qtySum - packList.quantity;
                  lastPackDetail.qty -= saleDetail.qty;
                  
                  $scope.saleDetails.push(lastPackDetail);
                  packSaleDetails.push(lastPackDetail);

                  remainingSaleDetails.push(saleDetail);
                } else {
                  packSaleDetails.push(saleDetail);
                }
                
                break;
              } else {
                packSaleDetails.push(saleDetail);
              }
            }
            
            packSaleDetails.forEach(function (packSaleDetail) {
              packSaleDetail.trigger('remove-from-packs');
              
              packSaleDetail.pack_list_id = packList.id;
              packSaleDetail.original_offer_price = packSaleDetail.offer_price;
              packSaleDetail.offer_price = parseFloat(packList.unit_price);
            });
            
            //console.log('%c packSaleDetails', 'background:red;color:white;font-size:2em', packSaleDetails);
            
            Array.prototype.push.apply(newPack.details, packSaleDetails);
            packSaleDetails.length = 0;
          }
          
          //console.log('%c newPack', 'background:purple;color:white;font-size:2em', newPack);
          
          $scope.packs.push(newPack);
          
          newPack = null;
        });

        if (remainingSaleDetails.length > 0) {
          //console.log('%c === Se han detectado detalles de venta NUEVOS', 'background:purple;color:white;font-size:3em', remainingSaleDetails);
          remainingSaleDetails.forEach(function (saleDetail) {
            $scope.searchInPacks(saleDetail);
          });
        }

        firstPackList = null;
      }
      
      return packCompleted;
    }
  }
]);
