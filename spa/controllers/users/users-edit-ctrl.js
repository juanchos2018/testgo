window.angular.module('ERP').controller('UsersEditCtrl', [
	'$scope', '$rootScope', 'Page', '$timeout',
	function ($scope, $rootScope, Page, $timeout) {
		var $ = angular.element, branches = {};

		Page.title('Editar Usuario');

		$scope.employees = [];
		$scope.roles = [];
	    $scope.companies = [];
		$scope.branches = [];
		$scope.unavailable_usernames = [];

		$scope.employee = {
			name: '',
			last_name: ''
		};

		$scope.user = {
			id: 0,
			username: '',
			email: '',
			avatar_mode: 1,
			avatar_file: '',
			avatar: '', // URI
	        company_id: '',
			branch_id: '',
			employee_id: '',
			role_id: ''
		};

	    $scope.getBranches = function (companyId) {
	        if (!(companyId in branches)) {
	            branches[companyId] = [];

	            for (var i = 0; i < $scope.branches.length; i++) {
	                if ($scope.branches[i].company_id == companyId) {
	                    branches[companyId].push($scope.branches[i]);
	                }
	            }
	        }

	        if (!branches[companyId].length) {
	            delete branches[companyId];
	            return [];
	        } else {
	            return branches[companyId];
	        }
	    };

		$scope.setUserData = function (data) {
			console.log(data);
			
			$scope.user.id = data.id;
			$scope.user.username = data.username;
			$scope.user.email = data.email;
	        $scope.user.company_id = data.company_id;
			$scope.user.branch_id = data.branch_id;
			$scope.user.role_id = data.role_id;
			$scope.user.employee_id = data.employee_id;
			$scope.user.avatar_mode = data.avatar_mode;
			$scope.user.avatar = data.avatar;
		};

		$scope.saveEmployee = function () {
			/*Ajax.post($window.siteUrl('employees/add'), $scope.employee).then(function (res) {
				$scope.employees.push(res.data);
				$scope.user.employee_id = +res.data.id;
				$scope.employee.name = '';
				$scope.employee.last_name = '';

				$templateCache.remove($window.siteUrl('users/add'));

				$('#new-employee-modal').modal('hide');
			});*/
		};

		$scope.save = function () {
			$timeout(function () {
				if (typeof $scope.user.employee_id === 'string' && !$scope.user.employee_id.length) {
					$('#new-employee').trigger('chosen:activate');
				} else if ($scope.unavailable_usernames.indexOf($scope.user.username) > -1) {
					$('#new-username').select().focus();
				} else {
					/*var data = new FormData();

					$scope.user.password = btoa($scope.credentials.password);
					$scope.user.company_id = ($scope.user.company_id ? $scope.user.company_id : '');

					data.set($scope.user);

					Ajax.post($window.siteUrl('users/add'), data).then(function (res) {
						console.log(res.data);
						$templateCache.remove($window.siteUrl('users/'));
						$location.path('users');
					});*/
				}
			});
		};

		$('[ng-view] [data-toggle="modal"]').length && $('[ng-view] [data-toggle="modal"]').modal();

		$('[ng-view] [data-modal]').each(function (index, btn) {
			$(btn).click(function (e) {
				$($(this).data('modal'))
					.modal('show')
					.on('shown.bs.modal', function () {
						$(this).find('input[type="text"]:first').focus();
					});

				e.preventDefault();
			});
		});

		$('[ng-view ][data-toggle="tooltip"]').tooltip();
	}
]);
