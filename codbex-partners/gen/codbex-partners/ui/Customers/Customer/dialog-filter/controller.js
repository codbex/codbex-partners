angular.module('page', ['blimpKit', 'platformView', 'platformLocale']).controller('PageController', ($scope, ViewParameters) => {
	const Dialogs = new DialogHub();
	$scope.entity = {};
	$scope.forms = {
		details: {},
	};

	let params = ViewParameters.get();
	if (Object.keys(params).length) {
		if (params?.entity?.CreatedAtFrom) {
			params.entity.CreatedAtFrom = new Date(params.entity.CreatedAtFrom);
		}
		if (params?.entity?.CreatedAtTo) {
			params.entity.CreatedAtTo = new Date(params.entity.CreatedAtTo);
		}
		$scope.entity = params.entity ?? {};
		$scope.selectedMainEntityKey = params.selectedMainEntityKey;
		$scope.selectedMainEntityId = params.selectedMainEntityId;
		$scope.optionsCountry = params.optionsCountry;
		$scope.optionsCity = params.optionsCity;
		$scope.optionsResponsiblePerson = params.optionsResponsiblePerson;
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
		if (entity.FirstName) {
			const condition = { propertyName: 'FirstName', operator: 'LIKE', value: `%${entity.FirstName}%` };
			filter.$filter.conditions.push(condition);
		}
		if (entity.LastName) {
			const condition = { propertyName: 'LastName', operator: 'LIKE', value: `%${entity.LastName}%` };
			filter.$filter.conditions.push(condition);
		}
		if (entity.LegalEntityName) {
			const condition = { propertyName: 'LegalEntityName', operator: 'LIKE', value: `%${entity.LegalEntityName}%` };
			filter.$filter.conditions.push(condition);
		}
		if (entity.Name) {
			const condition = { propertyName: 'Name', operator: 'LIKE', value: `%${entity.Name}%` };
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
		if (entity.Address) {
			const condition = { propertyName: 'Address', operator: 'LIKE', value: `%${entity.Address}%` };
			filter.$filter.conditions.push(condition);
		}
		if (entity.PostalCode) {
			const condition = { propertyName: 'PostalCode', operator: 'LIKE', value: `%${entity.PostalCode}%` };
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
		if (entity.ResponsiblePerson !== undefined) {
			const condition = { propertyName: 'ResponsiblePerson', operator: 'EQ', value: entity.ResponsiblePerson };
			filter.$filter.conditions.push(condition);
		}
		if (entity.Identifier) {
			const condition = { propertyName: 'Identifier', operator: 'LIKE', value: `%${entity.Identifier}%` };
			filter.$filter.conditions.push(condition);
		}
		if (entity.CreatedAtFrom) {
			const condition = { propertyName: 'CreatedAt', operator: 'GE', value: entity.CreatedAtFrom };
			filter.$filter.conditions.push(condition);
		}
		if (entity.CreatedAtTo) {
			const condition = { propertyName: 'CreatedAt', operator: 'LE', value: entity.CreatedAtTo };
			filter.$filter.conditions.push(condition);
		}
		Dialogs.postMessage({ topic: 'codbex-partners.Customers.Customer.entitySearch', data: {
			entity: entity,
			filter: filter
		}});
		Dialogs.triggerEvent('codbex-partners.Customers.Customer.clearDetails');
		$scope.cancel();
	};

	$scope.resetFilter = () => {
		$scope.entity = {};
		$scope.filter();
	};

	$scope.cancel = () => {
		Dialogs.closeWindow({ id: 'Customer-filter' });
	};

	$scope.clearErrorMessage = () => {
		$scope.errorMessage = null;
	};
});