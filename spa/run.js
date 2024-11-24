window.angular.module('ERP').run([
	'$window', '$rootScope', '$location', '$compile', '$route', '$routeParams', '$timeout', '$templateCache', '$filter', 'Settings', 'Auth', 'Ajax', 'Session', 'Page', 'PgData', 'SunatTables', 'FileHandler', '$log', '_$', '_is',
	function ($window, $rootScope, $location, $compile, $route, $routeParams, $timeout, $templateCache, $filter, Settings, Auth, Ajax, Session, Page, PgData, SunatTables, FileHandler, $log, $, is) {
		$rootScope.angular = $window.angular;

		$rootScope.Auth = Auth;
		$rootScope.Session = Session;
		$rootScope.Page = Page;
		$rootScope.Settings = Settings;

		var dependencies = {
			'$window': $window,
			'$rootScope': $rootScope,
			'$location': $location,
			'$compile': $compile,
			'$route': $route,
			'$routeParams': $routeParams,
			'$timeout': $timeout,
			'$templateCache': $templateCache,
			'$log': $log,
			'$filter': $filter,
			'Settings': Settings,
			'Auth': Auth,
			'Ajax': Ajax,
			'Session': Session,
			'Page': Page,
			'PgData': PgData,
      'SunatTables': SunatTables,
      'FileHandler': FileHandler
		};

		$window.angularScope = function (args) {
			$timeout(function () {
				dependencies['$scope'] = $('[ng-view]').scope();

				if (is.array(args) && is.function(args[args.length - 1])) { // Se le pasó el nombre de los argumentos y una función
					var callback = args.pop();

					callback.apply(dependencies['$scope'], args.map(function (prop) {
						return dependencies[prop];
					}));
				} else if (is.function(args)) { // Se le pasó una función
					args.call(dependencies['$scope'], dependencies['$scope'], $rootScope);
				}
			});
		};

		$rootScope.breadcrumb = {
			icon: '',
			path: [],
			submenu: false
		};

		$rootScope.showBottomPanel = false;

		$rootScope.reloadPage = function () {
			/*$templateCache.removeAll();
			$location.search({ t: new Date() .getTime() }).replace();*/
			$route.reload();
		};

		$rootScope.currentDate = function () {
			return new Date();
		};

		$rootScope.datatable = {};

		$rootScope.datatable.rowClick = function (event, data, selected) {
			if (event.target.tagName === 'TD') {
				data.selected = !data.selected;
				selected && $rootScope.datatable.changeSel(data, selected);
			}
		};

		$rootScope.datatable.isAllSel = function ($scope, data) {
			for (var i = 0; i < data.length; i++) {
				if (!data[i].selected) {
					$scope.allSelected = false;
					return false;
				}
			}

			$scope.allSelected = true;
			return true;
		};

		$rootScope.datatable.selAll = function ($scope, data, selected) {
			var value = !$scope.allSelected;
			selected && (selected.length = 0);

			for (var i = 0; i < data.length; i++) {
				data[i].selected = value;
				value && selected && selected.push(data[i]);
			}
		};

		$rootScope.datatable.changeSel = function (data, selected) {
			if (data.selected) {
				selected.push(data);
			} else {
				for (var i = 0; i < selected.length; i++) {
					if (selected[i] === data) {
						selected.splice(i, 1);
						break;
					}
				}
			}
		};

		// Cierre de Caja

		$rootScope.countingUp = function(){
			//direccion = $window.siteUrl("sales/print_tickets2");
			direccion = "cierre2.html";
			//var iframe = document.getElementById('cierre-caja');
			//iframe.src = direccion;
			//consulta para cambiar de estado sales de DONE a SOLD
			//$scope.gato = "miau";


			Ajax.get($window.siteUrl('sales/cashOut')).then(function (res) {

				var company = res.data.company;
				var salePoint = res.data.sale_point;
				var header = res.data;
				var creditCards = res.data.credit_cards;
				var data = res.data.data;
				var boleta_data = res.data.boleta_data;
				var refoundData = res.data.refunds_data

	            console.log(res);
	            if(data != false){
	            	var iframe = document.getElementById('cierre-caja');
					iframe.src = direccion;
	            }else{
	            	alert('No transacciones para Cerrar');
	            }


				var serie = ("00" + data.serie).slice (-3);
				var min = ("0000" + data.min).slice (-7);
				var max = ("0000" + data.max).slice (-7);

				var bserie = ("00" + boleta_data.serie).slice (-3);
				var bmin = ("0000" + boleta_data.min).slice (-7);
				var bmax = ("0000" + boleta_data.max).slice (-7);

				var rSerie = ("00" + refoundData.serie).slice (-3);
				var rMin = ("0000" + refoundData.min).slice (-7);
				var rMax = ("0000" + refoundData.max).slice (-7);

				window.company = company.company_name;
				window.ruc = company.ruc;
				window.printerSerial = salePoint.printer_serial;
				window.cashierName = header.cashier_name;

				window.transaccions = data.transaccions;
				window.minTicket = serie + '-' + min;
				window.maxTicket = serie + '-' + max;

				window.btransaccions = boleta_data.transaccions;
				window.bminTicket = bserie + '-' + bmin;
				window.bmaxTicket = bserie + '-' + bmax;

				window.rTransaccions = refoundData.transaccions;
				window.rMinTicket = rSerie + '-' + rMin;
				window.rMaxTicket = rSerie + '-' + rMax;

				window.totalCash = data.total_cash;
				window.totalCreditCard = data.total_credit_card;
				window.total = formatNumber.new(data.total, "S/");
				window.btotal = formatNumber.new(boleta_data.total, "S/");

				window.igv = data.igv.toLocaleString();
				window.bigv = boleta_data.igv.toLocaleString();

				window.totalRefunded = formatNumber.new(refoundData.total, "S/");
				window.creditCards = creditCards;


			}, function () {
				alert('No se pudo conectar a servidor');
			});

		};

		$rootScope.endDay = function(){
			var frame = document.getElementById('ticket-end-day');
			frame.contentDocument.write('<script>document.write("Resumen de Tarjetas");window.print();<\/script>');
		}

		// Puntos de Venta

		/*$rootScope.checkAllowedSalePoint = function () {
			if (!parseInt(Auth.value('userSalePoint'))) {
				var address = $window.document.body.dataset.localAddress;

				$rootScope.globalMessage.title = 'Punto de venta no registrado'

				if (!address) {
					$rootScope.globalMessage.message = 'El sistema no pudo detectar su dirección IP. Por favor verifique si la extensión de Firefox se encuentra instalada correctamente.';
				} else {
					$rootScope.globalMessage.message = 'La máquina que está usando (con dirección MAC ' + atob(address) + ') no se encuentra registrada como punto de venta o no está habilitada para emitir tickets.';
				}

				$rootScope.globalMessage.buttons = [{
					label: 'Aceptar',
					'class': 'btn-danger'
				}];

				$rootScope.globalMessage.show();
			}
		};*/

		$rootScope.Notifications = {
			_messages: [],
			count: function () {
				return this._messages.length;
			},
			add: function (message, link, icon, time) {
				switch (icon) {
					case 'email':
						icon = 'fa fa-envelope-o fa-2x text-success';
						break;
				}

				icon = icon || '';
				link = link || '#';

				if (typeof time === 'string') {
					time = new Date(time);
				} else if (!time) {
					time = new Date();
				}

				this._messages.push({
					message: message,
					link: link,
					icon: icon,
					time: time
				});
			}
		};

	    $rootScope.$on('$locationChangeStart', function (event, next, current) {
	    	var goTo = $location.$$path;

            if (goTo.length === 0 && $window.location.hash.length > 0) {
                event.preventDefault(); // It finally works!! =)
            }
	    });

	    $rootScope.$on('$routeChangeStart', function (event, current) {
	    	var route = current.$$route;
	    	var path = $location.$$path;

	    	/*if (Auth.isLoggedIn()) {
	    		console.log('%cNO SE DEBERIA CARGAR LA VISTA', 'background:red;color:white;font-size:2em', path, $route.routes);
	    		delete $route.routes[path].templateUrl;
	    	}*/

	    	//Page.isPublic = (route.public === true);

	    	if ( (path.length || !$window.location.hash.length) && route ) {
	    		var menu, submenu, item;

	    		if ('menu' in route && route.menu.length) {
	    			$timeout(function () {
		    			menu = angular.element('.nav.nav-main > li').children('[name="' + route.menu[0] + '"]').first();
		    			current = menu;

		    			if (menu.length && route.menu.length > 1) {
		    				submenu = menu.parent().find('ul > li').children('[name="' + route.menu[1] + '"]').first();
		    				current = submenu;

		    				if (submenu.length && route.menu.length > 2) {
		    					item = submenu.parent().find('ul > li').children('[name="' + route.menu[2] + '"]').first();
		    					current = item;
		    				}
		    			}

	    				var displayMenu = function (elem, callback) {
	    					(elem.parent().hasClass('active') && elem.next().slideUp(200, callback)) || elem.next().slideDown(200, callback);
      						elem.parent().addClass('active');
	    				};

	    				if (!current.parent().hasClass('active')) {
	    					displayMenu(menu, function () {
                                if (submenu) {
                                    if (!item) {
                                        submenu.parent().addClass('active');
                                    } else {
                                        displayMenu(submenu, function () {
                                            item.parent().addClass('active');
                                        });
                                    }
                                }
	    					});
	    				}
	    			});
	    		}

		    	if ('breadcrumb' in route) {
		    		if (angular.isArray(route.breadcrumb)) {
		    			$rootScope.breadcrumb.path = route.breadcrumb.slice(0);
		    			menu && ($rootScope.breadcrumb.icon = menu.children('i').attr('class'));
		    		} else {
		    			$rootScope.breadcrumb.path = route.breadcrumb.path.slice(0);
		    			('icon' in route.breadcrumb) && ($rootScope.breadcrumb.icon = route.breadcrumb.icon);
		    		}

		    		if ('dropdown' in route.breadcrumb) {
		    			$rootScope.breadcrumb.dropdown = true;
		    		} else {
		    			$rootScope.breadcrumb.dropdown = false;
		    		}
		    	} else {
		    		$rootScope.breadcrumb.path.length = 0;
		    	}

		    	$rootScope.showBottomPanel = ('bottomPanel' in route && route.bottomPanel === true);
	    	}
	    });

		/*$rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
			var route = current.$$route;

			$timeout(function () {
				if (route.templateUrl && typeof route.templateUrl === 'string') {
					// OJO PIOJO: si no se cambió la templateUrl NO se debe hacer nada, ya que se refescaría por las puras

					$rootScope.$broadcast('$setAppPageSrc', route, function () {

						if (route.viewUrl) {
							var url;

							if (typeof route.viewUrl === 'function') {
								url = route.viewUrl.call(route, $routeParams);
							} else {
								url = route.viewUrl;
							}
console.log('VIEW', url);
							$rootScope.$broadcast('$setAppViewSrc', url);
						}

					});
				}

			});
		});*/


		/*****$rootScope.$on('$routeChangeError', function (event, current, previous, rejection) {
			if (rejection === 'Unauthorized') {
				Auth.logout();
			}
		});*****/


		/*$rootScope.$on('$appPageContentError', function (event, err) {
			console.error('Page error', err);

			if (err.statusText === 'Unauthorized') {
				Auth.logout();
			}
		});

		$rootScope.$on('$appViewContentError', function (event, err) {
			if (err.statusText === 'Unauthorized') {
				Auth.logout();
			}
		});

		$rootScope.$on('$setAppPageSrc', function (event, route, callback) {
			var container = $('[app-page-container]');

			if (container.length) {
				var page = container.find('[app-page]');

				if (!page.length || page.attr('src') !== route.templateUrl) { // Si aún no existe una app-page o si la URL no es la misma de la que ya está cargada
					container
						.empty()
						.append($compile('<app-page ctrl="' + route.controller + '" src="' + route.templateUrl + '" style="height:100%"></app-page>')($rootScope));
					$rootScope.$apply();
				}
				// ERROR OJO: ESTA CALLBACK NO SE DEBE EJECUTAR SINO HASTA CARGAR LA PAGINA :S
				console.log('callback', callback);
				if (typeof callback === 'function') {
					callback.call($rootScope);
				}
			}
		});*/

		$rootScope.$on('$viewContentLoaded', function() {
			// No guardar la vistas en caché
			$templateCache.removeAll();

			if (Session.message.queued.timeout) {
				$timeout.cancel(Session.message.queued.timeout);
				Session.message.queued.timeout = 0;
			}

			if (Session.message.queued.text.length) {
				Session.message.text = Session.message.queued.text;
				Session.message.type = Session.message.queued.type;

				Session.message.queued.timeout = $timeout(function () {
					Session.message.queued.text = '';
					Session.message.queued.type = '';
				}, 600);
			} else if (Session.message.text.length) {
				Session.message.text = '';
				Session.message.type = '';
			}
		});
	}
]);
