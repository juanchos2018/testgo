window.angular.module('ERP').controller('UsersAddCtrl', [
    '$scope', '$rootScope', '$window', '$timeout', '$templateCache', '$location', 'Page', 'Auth', 'Ajax',
    function ($scope, $rootScope, $window, $timeout, $templateCache, $location,  Page, Auth, Ajax) {
        var $ = $window.jQuery, branches = {};

        Page.title('Nuevo Usuario');

        $scope.changeShowPwd = function () {
            if ($scope.showPassword) {
                $('#new-password').attr('type', 'text');
            } else {
                $('#new-password').attr('type', 'password');
            }
        };

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
            username: '',
            email: '',
            password: '',
            avatar_mode: 1,
            avatar_file: '',
            avatar: '', // URI
            company_id: Auth.value('userCompany'),
            branch_id: Auth.value('userBranch'),
            employee_id: '',
            role_id: ''
        };

        $scope.credentials = {
            password: '',
            repassword: ''
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

        $scope.saveEmployee = function () {
            Ajax.post($window.siteUrl('employees/add'), $scope.employee).then(function (res) {
                $scope.employees.push(res.data);
                $scope.user.employee_id = +res.data.id;
                $scope.employee.name = '';
                $scope.employee.last_name = '';

                $templateCache.remove($window.siteUrl('users/add'));

                $('#new-employee-modal').modal('hide');
            });
        };

        $scope.saveRole = function () {
            Ajax.post($window.siteUrl('roles/add'), $scope.role).then(function (res) {
                $scope.roles.push(res.data);
                $scope.user.role_id = +res.data.id;
                $scope.role.description = '';

                $templateCache.remove($window.siteUrl('roles/add'));

                $('#new-role-modal').modal('hide');
            });
        };

        $scope.save = function () {
            $timeout(function () {
                if (typeof $scope.user.employee_id === 'string' && !$scope.user.employee_id.length) {
                    $('#new-employee').trigger('chosen:activate');
                } else if ($scope.unavailable_usernames.indexOf($scope.user.username) > -1) {
                    $('#new-username').select().focus();
                } else if ($scope.credentials.password.length && $scope.credentials.repassword.length && $scope.credentials.password !== $scope.credentials.repassword) {
                    $('#re-password').select().focus();
                } else {
                    var data = new FormData();

                    $scope.user.password = btoa($scope.credentials.password);
                    $scope.user.company_id = ($scope.user.company_id ? $scope.user.company_id : '');
                    $scope.user.branch_id = ($scope.user.branch_id ? $scope.user.branch_id : '');

                    data.set($scope.user);

                    Ajax.post($window.siteUrl('users/add'), data).then(function (res) {
                        console.log(res.data);
                        $templateCache.remove($window.siteUrl('users/'));
                        $location.path('users');
                    });
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

        $('[ng-view] [data-toggle="tooltip"]').tooltip();

    }
]);
