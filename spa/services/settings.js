window.angular.module('ERP').service('Settings', [
	'Auth', 
	function (Auth) {
		var Settings = this;

		// Attributes
		Settings.branches = {};
		Settings.regimes = [];
		Settings.voucherTypes = ['BOLETA', 'FACTURA', 'NOTA DE CREDITO', 'TICKET'];
		Settings.items = [];
		
		// Methods
		Settings.branchAlias = function (id) {
			var alias = '';

			if ( id ) {
				Object.keys(Settings.branches).forEach(function (key) {
					var branch = Settings.branches[key];

					if (branch.branch_id == id) {
                        alias = branch.branch_alias;
                    }
				});
			}

			return alias;
		};

		Settings.companiesOfBranch = function (id) {
			var companies = [];

			if ( id ) {
				Object.keys(Settings.branches).forEach(function (key) {
					var branch = Settings.branches[key];

					if (branch.branch_id == id) {
                        companies = branch.companies;
                    }
				});
			}

			return companies;
		};

		Settings.getCompaniesOfBranch = function (branchName) {
			branchName = branchName || Auth.value('userBranchName');

			if (branchName in Settings.branches) {
				return Settings.branches[branchName].companies;
			} else {
				return [];
			}
		};

		Settings.getCompanyOfBranch = function (companyId, branchId) {
			var company = null;

			if ( branchId ) {
				Object.keys(Settings.branches).forEach(function (key) {
					var branch = Settings.branches[key];

					if (branch.branch_id == branchId) {
                        var companies = branch.companies;

                        for (var i = 0; i < companies.length; i++) {
                        	if (companies[i].company_id == companyId) {
                        		company = companies[i];
                        		
                        		break;
                        	}
                        }
                    }
				});
			}

			return company;
		};

		Settings.getBranchDetail = function (companyId, branchId) {
			var branchDetailId = null;

			if (companyId && branchId) {
				Object.keys(Settings.branches).forEach(function (key) {
					var branch = Settings.branches[key];

					if (branch.branch_id == branchId) {
						var company = branch.companies.find(function (c) {
							return c.company_id == companyId;
						});

						if (company) {
							branchDetailId = company.branch_detail_id;
						}
                    }
				});
			}

			return branchDetailId;
		};

		Settings.getTaxFor = function (regimeName) {
			var tax = 0;

			Settings.regimes.forEach(function (regime) {
				if (regime.regime === regimeName) {
					tax = parseFloat(regime.tax);
				}
			});

			return tax;
		};
		
		Settings.setItems = function (items) {
			Settings.items = items;
		};
		
		Settings.setItem = function (description, value) {
			var found = null;
			
			if (description.indexOf(':') > -1) {
				var nameAndType = description.split(':');
				
				found = Settings.items.find(function (item) {
					return item.description === nameAndType[0];
				});
				
				if (!found) return;
				
				switch (nameAndType[1]) {
					case 'numeric':
						found.numeric_value = value;
						break;
					case 'boolean':
						found.boolean_value = value;
						break;
					default:
						found.text_value = value;
				}
			} else if (value.length === 3) {
				found = Settings.items.find(function (item) {
					return item.description === description;
				});
				
				if (!found) return;
				
				found.text_value = value[0];
				found.numeric_value = value[1];
				found.boolean_value = value[2];
			}
		};
		
		Settings.getItem = function (description, type) {
			var found = Settings.items.find(function (item) {
				return item.description === description;
			});
			
			if (found) {
				switch (type) {
					case 'text':
						found = found.text_value;
						break;
					case 'numeric':
						found = found.numeric_value;
						break;
					case 'boolean':
						found = found.boolean_value;
						break;
				}
				
				return found;
			} else {
				return null;
			}
		};

		return Settings;
	}

]);