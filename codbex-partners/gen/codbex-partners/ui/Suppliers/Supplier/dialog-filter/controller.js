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
		if (entity.Name) {
			const condition = { propertyName: 'Name', operator: 'LIKE', value: `%${entity.Name}%` };
			filter.$filter.conditions.push(condition);
		}
		if (entity.Address) {
			const condition = { propertyName: 'Address', operator: 'LIKE', value: `%${entity.Address}%` };
			filter.$filter.conditions.push(condition);
		}
		if (entity.PostalCode) {
			const condition = { propertyName: 'PostalCode', operator: 'LIKE', value: `%${entity.PostalCode}%` };
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
		if (entity.Fax) {
			const condition = { propertyName: 'Fax', operator: 'LIKE', value: `%${entity.Fax}%` };
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
		if (entity.TIN) {
			const condition = { propertyName: 'TIN', operator: 'LIKE', value: `%${entity.TIN}%` };
			filter.$filter.conditions.push(condition);
		}
		if (entity.IBAN) {
			const condition = { propertyName: 'IBAN', operator: 'LIKE', value: `%${entity.IBAN}%` };
			filter.$filter.conditions.push(condition);
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