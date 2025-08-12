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
		if (entity.FirstName) {
			filter.$filter.contains.FirstName = entity.FirstName;
		}
		if (entity.LastName) {
			filter.$filter.contains.LastName = entity.LastName;
		}
		if (entity.Name) {
			filter.$filter.contains.Name = entity.Name;
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
		if (entity.TIN) {
			filter.$filter.contains.TIN = entity.TIN;
		}
		if (entity.IBAN) {
			filter.$filter.contains.IBAN = entity.IBAN;
		}
		if (entity.Identifier) {
			filter.$filter.contains.Identifier = entity.Identifier;
		}
		if (entity.CreatedAtFrom) {
			filter.$filter.greaterThanOrEqual.CreatedAt = entity.CreatedAtFrom;
		}
		if (entity.CreatedAtTo) {
			filter.$filter.lessThanOrEqual.CreatedAt = entity.CreatedAtTo;
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