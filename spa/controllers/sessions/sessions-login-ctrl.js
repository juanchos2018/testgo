window.angular.module('ERP').controller('SessionsLoginCtrl', [
    '$rootScope', '$scope', '$window', '$document', '$http', '$location', '$timeout', 'Page', 'Auth', 'Settings', '$log',
    function ($rootScope, $scope, $window, $document, $http, $location, $timeout, Page, Auth, Settings, $log) {
    	Page.title('Acceder');

        //var branches = {};

    	$scope.credentials = {
    		login: '',
    		password: ''
    	};

    	$scope.user = {
    		id: '',
            name: '',
            lastName: '',
    		fullName: '',
            email: '',
            username: '', // No se repite en $scope.credentials.login porque este último puede ser correo o nombre de usuario indistintamente
            role: '',
            roles: [],
            customRoleId: '', // Sólo para desarrolladores
    		branchesGranted: '',
    		avatar: '',
            companyId: '',
            branchId: '',
            defaultBranchId: '',
            branch: '',
            companies: []
    	};

        // Initially this variable will be false, when the login is in second state its value will change
        $scope.hasAuthenticated = false;

        /*$scope.getBranches = function (companyId) {
            if (!(companyId in branches)) {
                branches[companyId] = [];

                for (var i = 0; i < $scope.branches.length; i++) {
                    if ($scope.branches[i].company_id == companyId) {
                        branches[companyId].push($scope.branches[i]);
                    }
                }
            }

            return branches[companyId];
        };*/

    	$scope.message = '';

        $scope.reset = function () {
            $('#btnSubmit').text('Acceder').attr('disabled', true);

            $scope.message = '';

            $scope.user.companyId = 0;
            $scope.user.branchId = 0;

            $scope.user.defaultBranchId = 0;

            //$scope.user.branch = $scope.getBranchName();
            $scope.user.branch = '';
            $scope.user.companies.length = 0;

            $scope.hasAuthenticated = false;
            $scope.user.roles.length = 0;

            $('#divContainer').slideUp(function () {
                $('#btnSubmit').attr('disabled', false);

                $scope.user.id = '';
                $scope.user.fullName = '';
                $scope.user.role = '';
                $scope.user.branchesGranted = '';
                $scope.user.avatar = '';

                $scope.user.customRoleId = '';
                
                $scope.credentials.login = '';
                $scope.credentials.password = '';

                $scope.$apply();

                $('#divContainer').slideDown(function () {
                    $('#txtLogin').focus();
                });
            });
        };

    	$scope.submit = function (event) {
            event.preventDefault();

            if (!$scope.hasAuthenticated) {
                $('#btnSubmit').text('Validando...').attr('disabled', true);

                $('#divContainer').slideUp(function () {
                    Auth.login($scope.credentials)
                        .then(function (res) {
                            var data = res.data;
                            console.log('data', data);
                            
                            if ('error' in data) {
                                $scope.showError(data.error);
                            } else {
                                $scope.user.id = data.id;
                                $scope.user.name = data.name;
                                $scope.user.lastName = data.last_name;
                                $scope.user.fullName = data.full_name;
                                $scope.user.email = data.email;
                                $scope.user.username = data.username;
                                $scope.user.roleId = data.role_id;
                                $scope.user.role = data.role;
                                $scope.user.branchesGranted = (data.branches_granted === 't');
                                $scope.user.avatar = data.avatar;

                                $scope.user.companyId = parseInt(data.company, 10);
                                $scope.user.defaultBranchId = parseInt(data.default_branch, 10);
                                $scope.user.branchId = parseInt(data.branch, 10);
                                
                                $scope.user.branch = Settings.branchAlias(
                                    $scope.user.defaultBranchId ||
                                    $scope.user.branchId
                                );

                                $scope.hasAuthenticated = true;
                                
                                if (data.roles && data.roles.length) {
                                    $scope.user.roles = data.roles;
                                    
                                    data.roles.forEach(function (role) {
                                        if (role.text === 'Desarrollador') {
                                            $scope.user.customRoleId = role.id;
                                        }
                                    });
                                }

                                var startPath = ($scope.user.role === 'Operador de Ventas' ? '/sales/settings' : '/');

                                if ( $scope.user.branchesGranted && !$scope.user.branch ) {
                                    $('#btnSubmit').text('Continuar').attr('disabled', false);

                                    $('#divContainer').slideDown(function () {
                                        $scope.animateAvatar(function () {
                                            $scope.user.branch = Settings.branchAlias($scope.user.branchId);
                                            $scope.user.companies = Settings.companiesOfBranch($scope.user.branchId);

                                            Auth.session(startPath, $scope.user);
                                        });
                                    });
                                } else {
                                    $('#btnSubmit').fadeOut('fast', function () {
                                        $('#divContainer').slideDown(function () {
                                            $scope.animateAvatar(function () {
                                                $scope.user.companies = Settings.companiesOfBranch($scope.user.branchId);

                                                Auth.session(startPath, $scope.user);
                                            });
                                            $('#divAvatar').data('easyPieChart').update(100);
                                        });
                                    });
                                }

                            }
                        }, function() {
                            $scope.showError('request');
                        });
                });
            } else { // No se tenía asignada una empresa
                $('#btnSubmit').text('Accediendo...').attr('disabled', true);
                $('#branch-picker, select[ng-model="user.customRoleId"]').attr('disabled', true);
                $('#recovery-container').fadeOut();

                $('#divAvatar').data('easyPieChart').update(100);
            }

    	};

        $scope.animateAvatar = function (callback) {
            console.log('animate avatar!!');
            var $ = $window.angular.element,
                $div = $('#divAvatar'),
                $data = $div.data(),
                $step = $div.find('.step'),
                $target_value = parseInt($($data.target).text()),
                $value = 0;

            $data.barColor || ( $data.barColor = function($percent) {
                $percent /= 100;
                return "rgb(" + Math.round(200 * $percent) + ", 200, " + Math.round(200 * (1 - $percent)) + ")";
            });
            $data.onStep =  function(from, to, current) {
                $value = current;
                $step.text(parseInt(current));
                $data.target && $($data.target).text(parseInt(current) + $target_value);
            }
            $data.onStop =  function() {
                $target_value = parseInt($($data.target).text());
                $data.update && setTimeout(function() {
                    $div.data('easyPieChart').update(100 - $value);
                }, $data.update);
                
                if ($value === 100 && callback !== undefined) {
                    callback.call(window.Users);
                }
            }

            $div.easyPieChart($data);
        };

    	$scope.showError = function (errorType) {
    		var errors = {
    			'login': ['No se encontró el usuario', '#txtLogin'],
    			'password': ['La contraseña no es correcta', '#txtPassword'],
    			'input': ['Ingrese los campos requeridos', '#txtLogin'],
    			'request': ['Ocurrió un error al intentar acceder', '#txtLogin']
    		};

    		$('#btnSubmit').text('Acceder').attr('disabled', false);

    		if (errorType in errors) {
    			var theError = errors[errorType];

    			$scope.message = theError[0];

    			if (theError.length > 1) {
    				Page.focus(theError[1]);
    			}
    		}

    		$('#divContainer').slideDown('fast');
    	};

    	$timeout(function () {
    		$('#txtLogin').focus();
    	});
    }
]);
