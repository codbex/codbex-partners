angular.module('page', ['blimpKit', 'platformView', 'platformLocale']).controller('PageController', ($scope, $http, ViewParameters) => {
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
		if (params?.entity?.UpdatedAtFrom) {
			params.entity.UpdatedAtFrom = new Date(params.entity.UpdatedAtFrom);
		}
		if (params?.entity?.UpdatedAtTo) {
			params.entity.UpdatedAtTo = new Date(params.entity.UpdatedAtTo);
		}
		$scope.entity = params.entity ?? {};
		$scope.selectedMainEntityKey = params.selectedMainEntityKey;
		$scope.selectedMainEntityId = params.selectedMainEntityId;
		const optionsCountryMap = new Map();
		params.optionsCountry.forEach(e => optionsCountryMap.set(e.value, e));
		$scope.optionsCountry = Array.from(optionsCountryMap.values());
		const optionsCityMap = new Map();
		params.optionsCity.forEach(e => optionsCityMap.set(e.value, e));
		$scope.optionsCity = Array.from(optionsCityMap.values());
		const optionsResponsiblePersonMap = new Map();
		params.optionsResponsiblePerson.forEach(e => optionsResponsiblePersonMap.set(e.value, e));
		$scope.optionsResponsiblePerson = Array.from(optionsResponsiblePersonMap.values());
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
		if (entity.CreatedBy) {
			const condition = { propertyName: 'CreatedBy', operator: 'LIKE', value: `%${entity.CreatedBy}%` };
			filter.$filter.conditions.push(condition);
		}
		if (entity.UpdatedAtFrom) {
			const condition = { propertyName: 'UpdatedAt', operator: 'GE', value: entity.UpdatedAtFrom };
			filter.$filter.conditions.push(condition);
		}
		if (entity.UpdatedAtTo) {
			const condition = { propertyName: 'UpdatedAt', operator: 'LE', value: entity.UpdatedAtTo };
			filter.$filter.conditions.push(condition);
		}
		if (entity.UpdatedBy) {
			const condition = { propertyName: 'UpdatedBy', operator: 'LIKE', value: `%${entity.UpdatedBy}%` };
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
		lastSearchValuesCountry.clear();
		allValuesCountry.length = 0;
		lastSearchValuesCity.clear();
		allValuesCity.length = 0;
		lastSearchValuesResponsiblePerson.clear();
		allValuesResponsiblePerson.length = 0;
	};

	$scope.cancel = () => {
		Dialogs.closeWindow({ id: 'Customer-filter' });
	};

	$scope.clearErrorMessage = () => {
		$scope.errorMessage = null;
	};

	const lastSearchValuesCountry = new Set();
	const allValuesCountry = [];
	let loadMoreOptionsCountryCounter = 0;
	$scope.optionsCountryLoading = false;
	$scope.optionsCountryHasMore = true;

	$scope.loadMoreOptionsCountry = () => {
		const limit = 20;
		$scope.optionsCountryLoading = true;
		$http.get(`/services/ts/codbex-countries/gen/codbex-countries/api/Settings/CountryController.ts?$limit=${limit}&$offset=${++loadMoreOptionsCountryCounter * limit}`)
		.then((response) => {
			const optionValues = allValuesCountry.map(e => e.value);
			const resultValues = response.data.map(e => ({
				value: e.Id,
				text: e.Name
			}));
			const newValues = [];
			resultValues.forEach(e => {
				if (!optionValues.includes(e.value)) {
					allValuesCountry.push(e);
					newValues.push(e);
				}
			});
			newValues.forEach(e => {
				if (!$scope.optionsCountry.find(o => o.value === e.value)) {
					$scope.optionsCountry.push(e);
				}
			})
			$scope.optionsCountryHasMore = resultValues.length > 0;
			$scope.optionsCountryLoading = false;
		}, (error) => {
			$scope.optionsCountryLoading = false;
			console.error(error);
			const message = error.data ? error.data.message : '';
			Dialogs.showAlert({
				title: 'Country',
				message: LocaleService.t('codbex-partners:codbex-partners-model.messages.error.unableToLoad', { message: message }),
				type: AlertTypes.Error
			});
		});
	};

	$scope.onOptionsCountryChange = (event) => {
		if (allValuesCountry.length === 0) {
			allValuesCountry.push(...$scope.optionsCountry);
		}
		if (event.originalEvent.target.value === '') {
			allValuesCountry.sort((a, b) => a.text.localeCompare(b.text));
			$scope.optionsCountry = allValuesCountry;
			$scope.optionsCountryHasMore = true;
		} else if (isText(event.which)) {
			$scope.optionsCountryHasMore = false;
			let cacheHit = false;
			Array.from(lastSearchValuesCountry).forEach(e => {
				if (event.originalEvent.target.value.startsWith(e)) {
					cacheHit = true;
				}
			})
			if (!cacheHit) {
				$http.post('/services/ts/codbex-countries/gen/codbex-countries/api/Settings/CountryController.ts/search', {
					conditions: [
						{ propertyName: 'Name', operator: 'LIKE', value: `${event.originalEvent.target.value}%` }
					]
				}).then((response) => {
					const optionValues = allValuesCountry.map(e => e.value);
					const searchResult = response.data.map(e => ({
						value: e.Id,
						text: e.Name
					}));
					searchResult.forEach(e => {
						if (!optionValues.includes(e.value)) {
							allValuesCountry.push(e);
						}
					});
					$scope.optionsCountry = allValuesCountry.filter(e => e.text.toLowerCase().startsWith(event.originalEvent.target.value.toLowerCase()));
				}, (error) => {
					console.error(error);
					const message = error.data ? error.data.message : '';
					Dialogs.showAlert({
						title: 'Country',
						message: LocaleService.t('codbex-partners:codbex-partners-model.messages.error.unableToLoad', { message: message }),
						type: AlertTypes.Error
					});
				});
				lastSearchValuesCountry.add(event.originalEvent.target.value);
			}
		}
	};

	const lastSearchValuesCity = new Set();
	const allValuesCity = [];
	let loadMoreOptionsCityCounter = 0;
	$scope.optionsCityLoading = false;
	$scope.optionsCityHasMore = true;

	$scope.loadMoreOptionsCity = () => {
		const limit = 20;
		$scope.optionsCityLoading = true;
		$http.get(`/services/ts/codbex-cities/gen/codbex-cities/api/Settings/CityController.ts?$limit=${limit}&$offset=${++loadMoreOptionsCityCounter * limit}`)
		.then((response) => {
			const optionValues = allValuesCity.map(e => e.value);
			const resultValues = response.data.map(e => ({
				value: e.Id,
				text: e.Name
			}));
			const newValues = [];
			resultValues.forEach(e => {
				if (!optionValues.includes(e.value)) {
					allValuesCity.push(e);
					newValues.push(e);
				}
			});
			newValues.forEach(e => {
				if (!$scope.optionsCity.find(o => o.value === e.value)) {
					$scope.optionsCity.push(e);
				}
			})
			$scope.optionsCityHasMore = resultValues.length > 0;
			$scope.optionsCityLoading = false;
		}, (error) => {
			$scope.optionsCityLoading = false;
			console.error(error);
			const message = error.data ? error.data.message : '';
			Dialogs.showAlert({
				title: 'City',
				message: LocaleService.t('codbex-partners:codbex-partners-model.messages.error.unableToLoad', { message: message }),
				type: AlertTypes.Error
			});
		});
	};

	$scope.onOptionsCityChange = (event) => {
		if (allValuesCity.length === 0) {
			allValuesCity.push(...$scope.optionsCity);
		}
		if (event.originalEvent.target.value === '') {
			allValuesCity.sort((a, b) => a.text.localeCompare(b.text));
			$scope.optionsCity = allValuesCity;
			$scope.optionsCityHasMore = true;
		} else if (isText(event.which)) {
			$scope.optionsCityHasMore = false;
			let cacheHit = false;
			Array.from(lastSearchValuesCity).forEach(e => {
				if (event.originalEvent.target.value.startsWith(e)) {
					cacheHit = true;
				}
			})
			if (!cacheHit) {
				$http.post('/services/ts/codbex-cities/gen/codbex-cities/api/Settings/CityController.ts/search', {
					conditions: [
						{ propertyName: 'Name', operator: 'LIKE', value: `${event.originalEvent.target.value}%` }
					]
				}).then((response) => {
					const optionValues = allValuesCity.map(e => e.value);
					const searchResult = response.data.map(e => ({
						value: e.Id,
						text: e.Name
					}));
					searchResult.forEach(e => {
						if (!optionValues.includes(e.value)) {
							allValuesCity.push(e);
						}
					});
					$scope.optionsCity = allValuesCity.filter(e => e.text.toLowerCase().startsWith(event.originalEvent.target.value.toLowerCase()));
				}, (error) => {
					console.error(error);
					const message = error.data ? error.data.message : '';
					Dialogs.showAlert({
						title: 'City',
						message: LocaleService.t('codbex-partners:codbex-partners-model.messages.error.unableToLoad', { message: message }),
						type: AlertTypes.Error
					});
				});
				lastSearchValuesCity.add(event.originalEvent.target.value);
			}
		}
	};

	const lastSearchValuesResponsiblePerson = new Set();
	const allValuesResponsiblePerson = [];
	let loadMoreOptionsResponsiblePersonCounter = 0;
	$scope.optionsResponsiblePersonLoading = false;
	$scope.optionsResponsiblePersonHasMore = true;

	$scope.loadMoreOptionsResponsiblePerson = () => {
		const limit = 20;
		$scope.optionsResponsiblePersonLoading = true;
		$http.get(`/services/ts/codbex-employees/gen/codbex-employees/api/Employees/EmployeeController.ts?$limit=${limit}&$offset=${++loadMoreOptionsResponsiblePersonCounter * limit}`)
		.then((response) => {
			const optionValues = allValuesResponsiblePerson.map(e => e.value);
			const resultValues = response.data.map(e => ({
				value: e.Id,
				text: e.Name
			}));
			const newValues = [];
			resultValues.forEach(e => {
				if (!optionValues.includes(e.value)) {
					allValuesResponsiblePerson.push(e);
					newValues.push(e);
				}
			});
			newValues.forEach(e => {
				if (!$scope.optionsResponsiblePerson.find(o => o.value === e.value)) {
					$scope.optionsResponsiblePerson.push(e);
				}
			})
			$scope.optionsResponsiblePersonHasMore = resultValues.length > 0;
			$scope.optionsResponsiblePersonLoading = false;
		}, (error) => {
			$scope.optionsResponsiblePersonLoading = false;
			console.error(error);
			const message = error.data ? error.data.message : '';
			Dialogs.showAlert({
				title: 'ResponsiblePerson',
				message: LocaleService.t('codbex-partners:codbex-partners-model.messages.error.unableToLoad', { message: message }),
				type: AlertTypes.Error
			});
		});
	};

	$scope.onOptionsResponsiblePersonChange = (event) => {
		if (allValuesResponsiblePerson.length === 0) {
			allValuesResponsiblePerson.push(...$scope.optionsResponsiblePerson);
		}
		if (event.originalEvent.target.value === '') {
			allValuesResponsiblePerson.sort((a, b) => a.text.localeCompare(b.text));
			$scope.optionsResponsiblePerson = allValuesResponsiblePerson;
			$scope.optionsResponsiblePersonHasMore = true;
		} else if (isText(event.which)) {
			$scope.optionsResponsiblePersonHasMore = false;
			let cacheHit = false;
			Array.from(lastSearchValuesResponsiblePerson).forEach(e => {
				if (event.originalEvent.target.value.startsWith(e)) {
					cacheHit = true;
				}
			})
			if (!cacheHit) {
				$http.post('/services/ts/codbex-employees/gen/codbex-employees/api/Employees/EmployeeController.ts/search', {
					conditions: [
						{ propertyName: 'Name', operator: 'LIKE', value: `${event.originalEvent.target.value}%` }
					]
				}).then((response) => {
					const optionValues = allValuesResponsiblePerson.map(e => e.value);
					const searchResult = response.data.map(e => ({
						value: e.Id,
						text: e.Name
					}));
					searchResult.forEach(e => {
						if (!optionValues.includes(e.value)) {
							allValuesResponsiblePerson.push(e);
						}
					});
					$scope.optionsResponsiblePerson = allValuesResponsiblePerson.filter(e => e.text.toLowerCase().startsWith(event.originalEvent.target.value.toLowerCase()));
				}, (error) => {
					console.error(error);
					const message = error.data ? error.data.message : '';
					Dialogs.showAlert({
						title: 'ResponsiblePerson',
						message: LocaleService.t('codbex-partners:codbex-partners-model.messages.error.unableToLoad', { message: message }),
						type: AlertTypes.Error
					});
				});
				lastSearchValuesResponsiblePerson.add(event.originalEvent.target.value);
			}
		}
	};

	function isText(keycode) {
		if ((keycode >= 48 && keycode <= 90) || (keycode >= 96 && keycode <= 111) || (keycode >= 186 && keycode <= 222) || [8, 46, 173].includes(keycode)) return true;
		return false;
	}

});