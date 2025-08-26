angular.module('page', ['blimpKit', 'platformView', 'platformLocale', 'EntityService'])
	.config(["EntityServiceProvider", (EntityServiceProvider) => {
		EntityServiceProvider.baseUrl = '/services/ts/codbex-partners/gen/codbex-partners/api/Suppliers/SupplierService.ts';
	}])
	.controller('PageController', ($scope, $http, Extensions, LocaleService, EntityService) => {
		const Dialogs = new DialogHub();
		const Notifications = new NotificationHub();
		let description = 'Description';
		let propertySuccessfullyCreated = 'Supplier successfully created';
		let propertySuccessfullyUpdated = 'Supplier successfully updated';
		$scope.entity = {};
		$scope.forms = {
			details: {},
		};
		$scope.formHeaders = {
			select: 'Supplier Details',
			create: 'Create Supplier',
			update: 'Update Supplier'
		};
		$scope.action = 'select';

		LocaleService.onInit(() => {
			description = LocaleService.t('codbex-partners:codbex-partners-model.defaults.description');
			$scope.formHeaders.select = LocaleService.t('codbex-partners:codbex-partners-model.defaults.formHeadSelect', { name: '$t(codbex-partners:codbex-partners-model.t.SUPPLIER)' });
			$scope.formHeaders.create = LocaleService.t('codbex-partners:codbex-partners-model.defaults.formHeadCreate', { name: '$t(codbex-partners:codbex-partners-model.t.SUPPLIER)' });
			$scope.formHeaders.update = LocaleService.t('codbex-partners:codbex-partners-model.defaults.formHeadUpdate', { name: '$t(codbex-partners:codbex-partners-model.t.SUPPLIER)' });
			propertySuccessfullyCreated = LocaleService.t('codbex-partners:codbex-partners-model.messages.propertySuccessfullyCreated', { name: '$t(codbex-partners:codbex-partners-model.t.SUPPLIER)' });
			propertySuccessfullyUpdated = LocaleService.t('codbex-partners:codbex-partners-model.messages.propertySuccessfullyUpdated', { name: '$t(codbex-partners:codbex-partners-model.t.SUPPLIER)' });
		});

		//-----------------Custom Actions-------------------//
		Extensions.getWindows(['codbex-partners-custom-action']).then((response) => {
			$scope.entityActions = response.data.filter(e => e.perspective === 'Suppliers' && e.view === 'Supplier' && e.type === 'entity');
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
		Dialogs.addMessageListener({ topic: 'codbex-partners.Suppliers.Supplier.clearDetails', handler: () => {
			$scope.$evalAsync(() => {
				$scope.entity = {};
				$scope.optionsCountry = [];
				$scope.optionsCity = [];
				$scope.action = 'select';
			});
		}});
		Dialogs.addMessageListener({ topic: 'codbex-partners.Suppliers.Supplier.entitySelected', handler: (data) => {
			$scope.$evalAsync(() => {
				$scope.entity = data.entity;
				$scope.optionsCountry = data.optionsCountry;
				$scope.optionsCity = data.optionsCity;
				$scope.action = 'select';
			});
		}});
		Dialogs.addMessageListener({ topic: 'codbex-partners.Suppliers.Supplier.createEntity', handler: (data) => {
			$scope.$evalAsync(() => {
				$scope.entity = {};
				$scope.optionsCountry = data.optionsCountry;
				$scope.optionsCity = data.optionsCity;
				$scope.action = 'create';
			});
		}});
		Dialogs.addMessageListener({ topic: 'codbex-partners.Suppliers.Supplier.updateEntity', handler: (data) => {
			$scope.$evalAsync(() => {
				$scope.entity = data.entity;
				$scope.optionsCountry = data.optionsCountry;
				$scope.optionsCity = data.optionsCity;
				$scope.action = 'update';
			});
		}});

		$scope.serviceCountry = '/services/ts/codbex-countries/gen/codbex-countries/api/Settings/CountryService.ts';
		$scope.serviceCity = '/services/ts/codbex-cities/gen/codbex-cities/api/Settings/CityService.ts';


		$scope.$watch('entity.Country', (newValue, oldValue) => {
			if (newValue !== undefined && newValue !== null) {
				$http.get($scope.serviceCountry + '/' + newValue).then((response) => {
					let valueFrom = response.data.Id;
					$http.post('/services/ts/codbex-cities/gen/codbex-cities/api/Settings/CityService.ts/search', {
						$filter: {
							equals: {
								Country: valueFrom
							}
						}
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
				Dialogs.postMessage({ topic: 'codbex-partners.Suppliers.Supplier.entityCreated', data: response.data });
				Dialogs.postMessage({ topic: 'codbex-partners.Suppliers.Supplier.clearDetails' , data: response.data });
				Notifications.show({
					title: LocaleService.t('codbex-partners:codbex-partners-model.t.SUPPLIER'),
					description: propertySuccessfullyCreated,
					type: 'positive'
				});
			}, (error) => {
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: LocaleService.t('codbex-partners:codbex-partners-model.t.SUPPLIER'),
					message: LocaleService.t('codbex-partners:codbex-partners-model.messages.error.unableToCreate', { name: '$t(codbex-partners:codbex-partners-model.t.SUPPLIER)', message: message }),
					type: AlertTypes.Error
				});
				console.error('EntityService:', error);
			});
		};

		$scope.update = () => {
			EntityService.update($scope.entity.Id, $scope.entity).then((response) => {
				Dialogs.postMessage({ topic: 'codbex-partners.Suppliers.Supplier.entityUpdated', data: response.data });
				Dialogs.postMessage({ topic: 'codbex-partners.Suppliers.Supplier.clearDetails', data: response.data });
				Notifications.show({
					title: LocaleService.t('codbex-partners:codbex-partners-model.t.SUPPLIER'),
					description: propertySuccessfullyUpdated,
					type: 'positive'
				});
			}, (error) => {
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: LocaleService.t('codbex-partners:codbex-partners-model.t.SUPPLIER'),
					message: LocaleService.t('codbex-partners:codbex-partners-model.messages.error.unableToCreate', { name: '$t(codbex-partners:codbex-partners-model.t.SUPPLIER)', message: message }),
					type: AlertTypes.Error
				});
				console.error('EntityService:', error);
			});
		};

		$scope.cancel = () => {
			Dialogs.triggerEvent('codbex-partners.Suppliers.Supplier.clearDetails');
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

		//-----------------Dialogs-------------------//



		//----------------Dropdowns-----------------//

		$scope.refreshCountry = () => {
			$scope.optionsCountry = [];
			$http.get('/services/ts/codbex-countries/gen/codbex-countries/api/Settings/CountryService.ts').then((response) => {
				$scope.optionsCountry = response.data.map(e => ({
					value: e.Id,
					text: e.Name
				}));
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
		$scope.refreshCity = () => {
			$scope.optionsCity = [];
			$http.get('/services/ts/codbex-cities/gen/codbex-cities/api/Settings/CityService.ts').then((response) => {
				$scope.optionsCity = response.data.map(e => ({
					value: e.Id,
					text: e.Name
				}));
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

		//----------------Dropdowns-----------------//	
	});