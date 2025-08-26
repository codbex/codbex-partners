angular.module('page', ['blimpKit', 'platformView', 'platformLocale', 'EntityService'])
	.config(['EntityServiceProvider', (EntityServiceProvider) => {
		EntityServiceProvider.baseUrl = '/services/ts/codbex-partners/gen/codbex-partners/api/Customers/CustomerAddressService.ts';
	}])
	.controller('PageController', ($scope, $http, ViewParameters, LocaleService, EntityService) => {
		const Dialogs = new DialogHub();
		const Notifications = new NotificationHub();
		let description = 'Description';
		let propertySuccessfullyCreated = 'CustomerAddress successfully created';
		let propertySuccessfullyUpdated = 'CustomerAddress successfully updated';
		$scope.entity = {};
		$scope.forms = {
			details: {},
		};
		$scope.formHeaders = {
			select: 'CustomerAddress Details',
			create: 'Create CustomerAddress',
			update: 'Update CustomerAddress'
		};
		$scope.action = 'select';

		LocaleService.onInit(() => {
			description = LocaleService.t('codbex-partners:codbex-partners-model.defaults.description');
			$scope.formHeaders.select = LocaleService.t('codbex-partners:codbex-partners-model.defaults.formHeadSelect', { name: '$t(codbex-partners:codbex-partners-model.t.CUSTOMERADDRESS)' });
			$scope.formHeaders.create = LocaleService.t('codbex-partners:codbex-partners-model.defaults.formHeadCreate', { name: '$t(codbex-partners:codbex-partners-model.t.CUSTOMERADDRESS)' });
			$scope.formHeaders.update = LocaleService.t('codbex-partners:codbex-partners-model.defaults.formHeadUpdate', { name: '$t(codbex-partners:codbex-partners-model.t.CUSTOMERADDRESS)' });
			propertySuccessfullyCreated = LocaleService.t('codbex-partners:codbex-partners-model.messages.propertySuccessfullyCreated', { name: '$t(codbex-partners:codbex-partners-model.t.CUSTOMERADDRESS)' });
			propertySuccessfullyUpdated = LocaleService.t('codbex-partners:codbex-partners-model.messages.propertySuccessfullyUpdated', { name: '$t(codbex-partners:codbex-partners-model.t.CUSTOMERADDRESS)' });
		});

		let params = ViewParameters.get();
		if (Object.keys(params).length) {
			$scope.action = params.action;
			$scope.entity = params.entity;
			$scope.selectedMainEntityKey = params.selectedMainEntityKey;
			$scope.selectedMainEntityId = params.selectedMainEntityId;
			$scope.optionsCountry = params.optionsCountry;
			$scope.optionsCity = params.optionsCity;
			$scope.optionsAddressType = params.optionsAddressType;
		}

		$scope.create = () => {
			let entity = $scope.entity;
			entity[$scope.selectedMainEntityKey] = $scope.selectedMainEntityId;
			EntityService.create(entity).then((response) => {
				Dialogs.postMessage({ topic: 'codbex-partners.Customers.CustomerAddress.entityCreated', data: response.data });
				Notifications.show({
					title: LocaleService.t('codbex-partners:codbex-partners-model.t.CUSTOMERADDRESS'),
					description: propertySuccessfullyCreated,
					type: 'positive'
				});
				$scope.cancel();
			}, (error) => {
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: LocaleService.t('codbex-partners:codbex-partners-model.t.CUSTOMERADDRESS'),
					message: LocaleService.t('codbex-partners:codbex-partners-model.messages.error.unableToCreate', { name: '$t(codbex-partners:codbex-partners-model.t.CUSTOMERADDRESS)', message: message }),
					type: AlertTypes.Error
				});
				console.error('EntityService:', error);
			});
		};

		$scope.update = () => {
			let id = $scope.entity.Id;
			let entity = $scope.entity;
			entity[$scope.selectedMainEntityKey] = $scope.selectedMainEntityId;
			EntityService.update(id, entity).then((response) => {
				Dialogs.postMessage({ topic: 'codbex-partners.Customers.CustomerAddress.entityUpdated', data: response.data });
				Notifications.show({
					title: LocaleService.t('codbex-partners:codbex-partners-model.t.CUSTOMERADDRESS'),
					description: propertySuccessfullyUpdated,
					type: 'positive'
				});
				$scope.cancel();
			}, (error) => {
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: LocaleService.t('codbex-partners:codbex-partners-model.t.CUSTOMERADDRESS'),
					message: LocaleService.t('codbex-partners:codbex-partners-model.messages.error.unableToUpdate', { name: '$t(codbex-partners:codbex-partners-model.t.CUSTOMERADDRESS)', message: message }),
					type: AlertTypes.Error
				});
				console.error('EntityService:', error);
			});
		};

		$scope.serviceCountry = '/services/ts/codbex-countries/gen/codbex-countries/api/Settings/CountryService.ts';
		$scope.serviceCity = '/services/ts/codbex-cities/gen/codbex-cities/api/Settings/CityService.ts';
		$scope.serviceAddressType = '/services/ts/codbex-partners/gen/codbex-partners/api/Settings/CustomerAddressTypeService.ts';

		$scope.alert = (message) => {
			if (message) Dialogs.showAlert({
				title: description,
				message: message,
				type: AlertTypes.Information,
				preformatted: true,
			});
		};

		$scope.cancel = () => {
			$scope.entity = {};
			$scope.action = 'select';
			Dialogs.closeWindow({ id: 'CustomerAddress-details' });
		};
	});