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
				conditions: [],
				sorts: [],
				limit: 20,
				offset: 0
			}
		};
		if (entity.Id !== undefined) {
			const condition = { propertyName: 'Id', operator: 'EQ', value: entity.Id };
			filter.$filter.conditions.push(condition);
		}
		if (entity.Customer !== undefined) {
			const condition = { propertyName: 'Customer', operator: 'EQ', value: entity.Customer };
			filter.$filter.conditions.push(condition);
		}
		if (entity.FirstName) {
			const condition = { propertyName: 'FirstName', operator: 'LIKE', value: `%${entity.FirstName}%` };
			filter.$filter.conditions.push(condition);
		}
		if (entity.LastName) {
			const condition = { propertyName: 'LastName', operator: 'LIKE', value: `%${entity.LastName}%` };
			filter.$filter.conditions.push(condition);
		}
		if (entity.Email) {
			const condition = { propertyName: 'Email', operator: 'LIKE', value: `%${entity.Email}%` };
			filter.$filter.conditions.push(condition);
		}
		if (entity.Phone) {
			const condition = { propertyName: 'Phone', operator: 'LIKE', value: `%${entity.Phone}%` };
			filter.$filter.conditions.push(condition);
		}
		if (entity.Country !== undefined) {
			const condition = { propertyName: 'Country', operator: 'EQ', value: entity.Country };
			filter.$filter.conditions.push(condition);
		}
		if (entity.City !== undefined) {
			const condition = { propertyName: 'City', operator: 'EQ', value: entity.City };
			filter.$filter.conditions.push(condition);
		}
		if (entity.AddressLine1) {
			const condition = { propertyName: 'AddressLine1', operator: 'LIKE', value: `%${entity.AddressLine1}%` };
			filter.$filter.conditions.push(condition);
		}
		if (entity.AddressLine2) {
			const condition = { propertyName: 'AddressLine2', operator: 'LIKE', value: `%${entity.AddressLine2}%` };
			filter.$filter.conditions.push(condition);
		}
		if (entity.PostalCode) {
			const condition = { propertyName: 'PostalCode', operator: 'LIKE', value: `%${entity.PostalCode}%` };
			filter.$filter.conditions.push(condition);
		}
		if (entity.AddressType !== undefined) {
			const condition = { propertyName: 'AddressType', operator: 'EQ', value: entity.AddressType };
			filter.$filter.conditions.push(condition);
		}
		if (entity.IsActive !== undefined && entity.isIsActiveIndeterminate === false) {
			const condition = { propertyName: 'IsActive', operator: 'EQ', value: entity.IsActive };
			filter.$filter.conditions.push(condition);
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