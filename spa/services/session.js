window.angular.module('ERP').service('Session', [
	'$window',
	function ($window) {
		var Session = this;
		var items = [
			'userId',
			'userName',
			'userLastName',
			'userLogin',
			'userEmail',
			'userCompany',
			'userBranch',
			'userBranchName',
			'userAvatar',
			'userSalePoint',
			'userGranted',
			'userCompanies',
			'userRole',
			'userRoleName'
		];

		Session.message = {
			text: '',
			type: '',
			queued: {
				text: '',
				type: '',
				timeout: 0
			}
		};

		Session.set = function (userKey) {
			Session.userKey = userKey;

			var data = atob(userKey).split('&');

			if (data.length === items.length) {
				items.forEach(function (item, index) {
					Session[item] = data[index];
				});

				Session.userCompanies = JSON.parse(Session.userCompanies);
			}
		};

		Session.destroy = function () {
			items.forEach(function (item) {
				Session[item] = null;
			});
		};

		Session.get = function (sessionKey) {
			if (sessionKey in Session) {
				return Session[sessionKey];
			} else {
				return false;
			}
		};

		Session.setMessage = function (text, type, show) {
			if (show) { // Se debe mostrar inmediatamente
				Session.message.text = text;
				Session.message.type = type || 'success';
			} else {
				Session.message.queued.text = text;
				Session.message.queued.type = type || 'success';
			}
		};
		
		Session.clearMessage = function () {
			Session.message.text = '';
			Session.message.type = '';
		};

		return Session;
	}
]);