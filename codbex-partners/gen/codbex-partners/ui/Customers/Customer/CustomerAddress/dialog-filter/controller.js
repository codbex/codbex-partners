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
		$scope.optionsAddressType = params.optionsAddressType;
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
		if (entity.Customer !== undefined) {
			filter.$filter.equals.Customer = entity.Customer;
		}
		if (entity.Country !== undefined) {
			filter.$filter.equals.Country = entity.Country;
		}
		if (entity.City !== undefined) {
			filter.$filter.equals.City = entity.City;
		}
		if (entity.AdressLine1) {
			filter.$filter.contains.AdressLine1 = entity.AdressLine1;
		}
		if (entity.AddressLine2) {
			filter.$filter.contains.AddressLine2 = entity.AddressLine2;
		}
		if (entity.PostalCode) {
			filter.$filter.contains.PostalCode = entity.PostalCode;
		}
		if (entity.AddressType !== undefined) {
			filter.$filter.equals.AddressType = entity.AddressType;
		}
		if (entity.IsActive !== undefined && entity.isIsActiveIndeterminate === false) {
			filter.$filter.equals.IsActive = entity.IsActive;
		}
		Dialogs.postMessage({ topic: 'codbex-partners.Customers.CustomerAddress.entitySearch', data: {
			entity: entity,
			filter: filter
		}});
		$scope.cancel();
	};

	$scope.resetFilter = () => {
		$scope.entity = {};
		$scope.filter();
	};

	$scope.cancel = () => {
		Dialogs.closeWindow({ id: 'CustomerAddress-filter' });
	};

	$scope.clearErrorMessage = () => {
		$scope.errorMessage = null;
	};
});