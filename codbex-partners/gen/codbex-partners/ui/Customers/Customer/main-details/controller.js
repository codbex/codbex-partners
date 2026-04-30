angular.module('page', ['blimpKit', 'platformView', 'platformLocale', 'EntityService'])
	.config(["EntityServiceProvider", (EntityServiceProvider) => {
		EntityServiceProvider.baseUrl = '/services/ts/codbex-partners/gen/codbex-partners/api/Customers/CustomerController.ts';
	}])
	.controller('PageController', ($scope, $http, Extensions, LocaleService, EntityService) => {
		const Dialogs = new DialogHub();
		const Notifications = new NotificationHub();
		let description = 'Description';
		let propertySuccessfullyCreated = 'Customer successfully created';
		let propertySuccessfullyUpdated = 'Customer successfully updated';
		$scope.entity = {};
		$scope.forms = {
			details: {},
		};
		$scope.formHeaders = {
			select: 'Customer Details',
			create: 'Create Customer',
			update: 'Update Customer'
		};
		$scope.action = 'select';

		LocaleService.onInit(() => {
			description = LocaleService.t('codbex-partners:codbex-partners-model.defaults.description');
			$scope.formHeaders.select = LocaleService.t('codbex-partners:codbex-partners-model.defaults.formHeadSelect', { name: '$t(codbex-partners:codbex-partners-model.t.CUSTOMER)' });
			$scope.formHeaders.create = LocaleService.t('codbex-partners:codbex-partners-model.defaults.formHeadCreate', { name: '$t(codbex-partners:codbex-partners-model.t.CUSTOMER)' });
			$scope.formHeaders.update = LocaleService.t('codbex-partners:codbex-partners-model.defaults.formHeadUpdate', { name: '$t(codbex-partners:codbex-partners-model.t.CUSTOMER)' });
			propertySuccessfullyCreated = LocaleService.t('codbex-partners:codbex-partners-model.messages.propertySuccessfullyCreated', { name: '$t(codbex-partners:codbex-partners-model.t.CUSTOMER)' });
			propertySuccessfullyUpdated = LocaleService.t('codbex-partners:codbex-partners-model.messages.propertySuccessfullyUpdated', { name: '$t(codbex-partners:codbex-partners-model.t.CUSTOMER)' });
		});

		//-----------------Custom Actions-------------------//
		Extensions.getWindows(['codbex-partners-custom-action']).then((response) => {
			$scope.entityActions = response.data.filter(e => e.perspective === 'Customers' && e.view === 'Customer' && e.type === 'entity');
		});

		$scope.triggerEntityAction = (action) => {
			Dialogs.showWindow({
				hasHeader: true,
        		title: LocaleService.t(action.translation.key, action.translation.options, action.label),
				path: action.path,
				params: {
					id: $scope.entity.Id
				},
				closeButton: true
			});
		};
		//-----------------Custom Actions-------------------//

		//-----------------Events-------------------//
		Dialogs.addMessageListener({ topic: 'codbex-partners.Customers.Customer.clearDetails', handler: () => {
			$scope.$evalAsync(() => {
				$scope.entity = {};
				$scope.optionsCountry = [];
				$scope.optionsCity = [];
				$scope.optionsResponsiblePerson = [];
				$scope.action = 'select';
			});
		}});
		Dialogs.addMessageListener({ topic: 'codbex-partners.Customers.Customer.entitySelected', handler: (data) => {
			$scope.$evalAsync(() => {
				if (data.entity.CreatedAt) {
					data.entity.CreatedAt = new Date(data.entity.CreatedAt);
				}
				if (data.entity.UpdatedAt) {
					data.entity.UpdatedAt = new Date(data.entity.UpdatedAt);
				}
				$scope.entity = data.entity;
				$scope.optionsCountry = data.optionsCountry;
				$scope.optionsCity = data.optionsCity;
				$scope.optionsResponsiblePerson = data.optionsResponsiblePerson;
				$scope.action = 'select';
			});
		}});
		Dialogs.addMessageListener({ topic: 'codbex-partners.Customers.Customer.createEntity', handler: (data) => {
			$scope.$evalAsync(() => {
				$scope.entity = {};
				$scope.optionsCountry = data.optionsCountry;
				$scope.optionsCity = data.optionsCity;
				$scope.optionsResponsiblePerson = data.optionsResponsiblePerson;
				$scope.action = 'create';
			});
		}});
		Dialogs.addMessageListener({ topic: 'codbex-partners.Customers.Customer.updateEntity', handler: (data) => {
			$scope.$evalAsync(() => {
				if (data.entity.CreatedAt) {
					data.entity.CreatedAt = new Date(data.entity.CreatedAt);
				}
				if (data.entity.UpdatedAt) {
					data.entity.UpdatedAt = new Date(data.entity.UpdatedAt);
				}
				$scope.entity = data.entity;
				$scope.optionsCountry = data.optionsCountry;
				$scope.optionsCity = data.optionsCity;
				$scope.optionsResponsiblePerson = data.optionsResponsiblePerson;
				$scope.action = 'update';
			});
		}});

		$scope.serviceCountry = '/services/ts/codbex-countries/gen/codbex-countries/api/Settings/CountryController.ts';
		$scope.serviceCity = '/services/ts/codbex-cities/gen/codbex-cities/api/Settings/CityController.ts';
		$scope.serviceResponsiblePerson = '/services/ts/codbex-employees/gen/codbex-employees/api/Employees/EmployeeController.ts';


		$scope.$watch('entity.Country', (newValue, oldValue) => {
			if (newValue !== undefined && newValue !== null) {
				$http.get($scope.serviceCountry + '/' + newValue).then((response) => {
					let valueFrom = response.data.Id;
					$http.post('/services/ts/codbex-cities/gen/codbex-cities/api/Settings/CityController.ts/search', {
						conditions: [
							{ propertyName: 'Country', operator: 'EQ', value: valueFrom }
						]
					}).then((response) => {
						$scope.optionsCity = response.data.map(e => ({
							value: e.Id,
							text: e.Name
						}));
						if ($scope.action !== 'select' && newValue !== oldValue) {
							if ($scope.optionsCity.length == 1) {
								$scope.entity.City = $scope.optionsCity[0].value;
							} else {
								$scope.entity.City = undefined;
							}
						}
					}, (error) => {
						console.error(error);
					});
				}, (error) => {
					console.error(error);
				});
			}
		});
		//-----------------Events-------------------//

		$scope.create = () => {
			EntityService.create($scope.entity).then((response) => {
				Dialogs.postMessage({ topic: 'codbex-partners.Customers.Customer.entityCreated', data: response.data });
				Dialogs.postMessage({ topic: 'codbex-partners.Customers.Customer.clearDetails' , data: response.data });
				Notifications.show({
					title: LocaleService.t('codbex-partners:codbex-partners-model.t.CUSTOMER'),
					description: propertySuccessfullyCreated,
					type: 'positive'
				});
			}, (error) => {
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: LocaleService.t('codbex-partners:codbex-partners-model.t.CUSTOMER'),
					message: LocaleService.t('codbex-partners:codbex-partners-model.messages.error.unableToCreate', { name: '$t(codbex-partners:codbex-partners-model.t.CUSTOMER)', message: message }),
					type: AlertTypes.Error
				});
				console.error('EntityService:', error);
			});
		};

		$scope.update = () => {
			EntityService.update($scope.entity.Id, $scope.entity).then((response) => {
				Dialogs.postMessage({ topic: 'codbex-partners.Customers.Customer.entityUpdated', data: response.data });
				Dialogs.postMessage({ topic: 'codbex-partners.Customers.Customer.clearDetails', data: response.data });
				Notifications.show({
					title: LocaleService.t('codbex-partners:codbex-partners-model.t.CUSTOMER'),
					description: propertySuccessfullyUpdated,
					type: 'positive'
				});
			}, (error) => {
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: LocaleService.t('codbex-partners:codbex-partners-model.t.CUSTOMER'),
					message: LocaleService.t('codbex-partners:codbex-partners-model.messages.error.unableToCreate', { name: '$t(codbex-partners:codbex-partners-model.t.CUSTOMER)', message: message }),
					type: AlertTypes.Error
				});
				console.error('EntityService:', error);
			});
		};

		$scope.cancel = () => {
			Dialogs.triggerEvent('codbex-partners.Customers.Customer.clearDetails');
		};
		
		//-----------------Dialogs-------------------//
		$scope.alert = (message) => {
			if (message) Dialogs.showAlert({
				title: description,
				message: message,
				type: AlertTypes.Information,
				preformatted: true,
			});
		};
		
		$scope.createCountry = () => {
			Dialogs.showWindow({
				id: 'Country-details',
				params: {
					action: 'create',
					entity: {},
				},
				closeButton: false
			});
		};
		$scope.createCity = () => {
			Dialogs.showWindow({
				id: 'City-details',
				params: {
					action: 'create',
					entity: {},
				},
				closeButton: false
			});
		};
		$scope.createResponsiblePerson = () => {
			Dialogs.showWindow({
				id: 'Employee-details',
				params: {
					action: 'create',
					entity: {},
				},
				closeButton: false
			});
		};

		//-----------------Dialogs-------------------//



		//----------------Dropdowns-----------------//

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

		$scope.refreshCountry = () => {
			$scope.optionsCountry = [];
			$http.get('/services/ts/codbex-countries/gen/codbex-countries/api/Settings/CountryController.ts').then((response) => {
				$scope.optionsCountry = response.data.map(e => ({
					value: e.Id,
					text: e.Name
				}));
				allValuesCountry.length === 0;
			}, (error) => {
				console.error(error);
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: 'Country',
					message: LocaleService.t('codbex-partners:codbex-partners-model.messages.error.unableToLoad', { message: message }),
					type: AlertTypes.Error
				});
			});
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

		$scope.refreshCity = () => {
			$scope.optionsCity = [];
			$http.get('/services/ts/codbex-cities/gen/codbex-cities/api/Settings/CityController.ts').then((response) => {
				$scope.optionsCity = response.data.map(e => ({
					value: e.Id,
					text: e.Name
				}));
				allValuesCity.length === 0;
			}, (error) => {
				console.error(error);
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: 'City',
					message: LocaleService.t('codbex-partners:codbex-partners-model.messages.error.unableToLoad', { message: message }),
					type: AlertTypes.Error
				});
			});
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

		$scope.refreshResponsiblePerson = () => {
			$scope.optionsResponsiblePerson = [];
			$http.get('/services/ts/codbex-employees/gen/codbex-employees/api/Employees/EmployeeController.ts').then((response) => {
				$scope.optionsResponsiblePerson = response.data.map(e => ({
					value: e.Id,
					text: e.Name
				}));
				allValuesResponsiblePerson.length === 0;
			}, (error) => {
				console.error(error);
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: 'ResponsiblePerson',
					message: LocaleService.t('codbex-partners:codbex-partners-model.messages.error.unableToLoad', { message: message }),
					type: AlertTypes.Error
				});
			});
		};

		function isText(keycode) {
			if ((keycode >= 48 && keycode <= 90) || (keycode >= 96 && keycode <= 111) || (keycode >= 186 && keycode <= 222) || [8, 46, 173].includes(keycode)) return true;
			return false;
		}

		//----------------Dropdowns-----------------//	
	});