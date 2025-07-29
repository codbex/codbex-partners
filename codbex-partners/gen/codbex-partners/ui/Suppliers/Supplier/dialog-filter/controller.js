angular.module('page', ['blimpKit', 'platformView', 'platformLocale']).controller('PageController', ($scope, ViewParameters) => {
	const Dialogs = new DialogHub();
	$scope.entity = {};
	$scope.forms = {
		details: {},
	};

	let params = ViewParameters.get();
	if (Object.keys(params).length) {
		$scope.entity = params.entity ?? {};
		$scope.selectedMainEntityKey = params.selectedMainEntityKey;
		$scope.selectedMainEntityId = params.selectedMainEntityId;
		$scope.optionsCountry = params.optionsCountry;
		$scope.optionsCity = params.optionsCity;
	}

	$scope.filter = () => {
		let entity = $scope.entity;
		const filter = {
			$filter: {
				equals: {
				},
				notEquals: {
				},
				contains: {
				},
				greaterThan: {
				},
				greaterThanOrEqual: {
				},
				lessThan: {
				},
				lessThanOrEqual: {
				}
			},
		};
		if (entity.Id !== undefined) {
			filter.$filter.equals.Id = entity.Id;
		}
		if (entity.Name) {
			filter.$filter.contains.Name = entity.Name;
		}
		if (entity.Address) {
			filter.$filter.contains.Address = entity.Address;
		}
		if (entity.PostalCode) {
			filter.$filter.contains.PostalCode = entity.PostalCode;
		}
		if (entity.Email) {
			filter.$filter.contains.Email = entity.Email;
		}
		if (entity.Phone) {
			filter.$filter.contains.Phone = entity.Phone;
		}
		if (entity.Fax) {
			filter.$filter.contains.Fax = entity.Fax;
		}
		if (entity.Country !== undefined) {
			filter.$filter.equals.Country = entity.Country;
		}
		if (entity.City !== undefined) {
			filter.$filter.equals.City = entity.City;
		}
		if (entity.TIN) {
			filter.$filter.contains.TIN = entity.TIN;
		}
		if (entity.IBAN) {
			filter.$filter.contains.IBAN = entity.IBAN;
		}
		Dialogs.postMessage({ topic: 'codbex-partners.Suppliers.Supplier.entitySearch', data: {
			entity: entity,
			filter: filter
		}});
		Dialogs.triggerEvent('codbex-partners.Suppliers.Supplier.clearDetails');
		$scope.cancel();
	};

	$scope.resetFilter = () => {
		$scope.entity = {};
		$scope.filter();
	};

	$scope.cancel = () => {
		Dialogs.closeWindow({ id: 'Supplier-filter' });
	};

	$scope.clearErrorMessage = () => {
		$scope.errorMessage = null;
	};
});