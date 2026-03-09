angular.module('page', ['blimpKit', 'platformView', 'platformLocale', 'EntityService'])
	.config(["EntityServiceProvider", (EntityServiceProvider) => {
		EntityServiceProvider.baseUrl = '/services/ts/codbex-partners/gen/codbex-partners/api/Manufacturers/ManufacturerController.ts';
	}])
	.controller('PageController', ($scope, $http, Extensions, LocaleService, EntityService) => {
		const Dialogs = new DialogHub();
		const Notifications = new NotificationHub();
		let description = 'Description';
		let propertySuccessfullyCreated = 'Manufacturer successfully created';
		let propertySuccessfullyUpdated = 'Manufacturer successfully updated';
		$scope.entity = {};
		$scope.forms = {
			details: {},
		};
		$scope.formHeaders = {
			select: 'Manufacturer Details',
			create: 'Create Manufacturer',
			update: 'Update Manufacturer'
		};
		$scope.action = 'select';

		LocaleService.onInit(() => {
			description = LocaleService.t('codbex-partners:codbex-partners-model.defaults.description');
			$scope.formHeaders.select = LocaleService.t('codbex-partners:codbex-partners-model.defaults.formHeadSelect', { name: '$t(codbex-partners:codbex-partners-model.t.MANUFACTURER)' });
			$scope.formHeaders.create = LocaleService.t('codbex-partners:codbex-partners-model.defaults.formHeadCreate', { name: '$t(codbex-partners:codbex-partners-model.t.MANUFACTURER)' });
			$scope.formHeaders.update = LocaleService.t('codbex-partners:codbex-partners-model.defaults.formHeadUpdate', { name: '$t(codbex-partners:codbex-partners-model.t.MANUFACTURER)' });
			propertySuccessfullyCreated = LocaleService.t('codbex-partners:codbex-partners-model.messages.propertySuccessfullyCreated', { name: '$t(codbex-partners:codbex-partners-model.t.MANUFACTURER)' });
			propertySuccessfullyUpdated = LocaleService.t('codbex-partners:codbex-partners-model.messages.propertySuccessfullyUpdated', { name: '$t(codbex-partners:codbex-partners-model.t.MANUFACTURER)' });
		});

		//-----------------Custom Actions-------------------//
		Extensions.getWindows(['codbex-partners-custom-action']).then((response) => {
			$scope.entityActions = response.data.filter(e => e.perspective === 'Manufacturers' && e.view === 'Manufacturer' && e.type === 'entity');
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
		Dialogs.addMessageListener({ topic: 'codbex-partners.Manufacturers.Manufacturer.clearDetails', handler: () => {
			$scope.$evalAsync(() => {
				$scope.entity = {};
				$scope.action = 'select';
			});
		}});
		Dialogs.addMessageListener({ topic: 'codbex-partners.Manufacturers.Manufacturer.entitySelected', handler: (data) => {
			$scope.$evalAsync(() => {
				if (data.entity.CreatedAt) {
					data.entity.CreatedAt = new Date(data.entity.CreatedAt);
				}
				$scope.entity = data.entity;
				$scope.action = 'select';
			});
		}});
		Dialogs.addMessageListener({ topic: 'codbex-partners.Manufacturers.Manufacturer.createEntity', handler: (data) => {
			$scope.$evalAsync(() => {
				$scope.entity = {};
				$scope.action = 'create';
			});
		}});
		Dialogs.addMessageListener({ topic: 'codbex-partners.Manufacturers.Manufacturer.updateEntity', handler: (data) => {
			$scope.$evalAsync(() => {
				if (data.entity.CreatedAt) {
					data.entity.CreatedAt = new Date(data.entity.CreatedAt);
				}
				$scope.entity = data.entity;
				$scope.action = 'update';
			});
		}});


		//-----------------Events-------------------//

		$scope.create = () => {
			EntityService.create($scope.entity).then((response) => {
				Dialogs.postMessage({ topic: 'codbex-partners.Manufacturers.Manufacturer.entityCreated', data: response.data });
				Dialogs.postMessage({ topic: 'codbex-partners.Manufacturers.Manufacturer.clearDetails' , data: response.data });
				Notifications.show({
					title: LocaleService.t('codbex-partners:codbex-partners-model.t.MANUFACTURER'),
					description: propertySuccessfullyCreated,
					type: 'positive'
				});
			}, (error) => {
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: LocaleService.t('codbex-partners:codbex-partners-model.t.MANUFACTURER'),
					message: LocaleService.t('codbex-partners:codbex-partners-model.messages.error.unableToCreate', { name: '$t(codbex-partners:codbex-partners-model.t.MANUFACTURER)', message: message }),
					type: AlertTypes.Error
				});
				console.error('EntityService:', error);
			});
		};

		$scope.update = () => {
			EntityService.update($scope.entity.Id, $scope.entity).then((response) => {
				Dialogs.postMessage({ topic: 'codbex-partners.Manufacturers.Manufacturer.entityUpdated', data: response.data });
				Dialogs.postMessage({ topic: 'codbex-partners.Manufacturers.Manufacturer.clearDetails', data: response.data });
				Notifications.show({
					title: LocaleService.t('codbex-partners:codbex-partners-model.t.MANUFACTURER'),
					description: propertySuccessfullyUpdated,
					type: 'positive'
				});
			}, (error) => {
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: LocaleService.t('codbex-partners:codbex-partners-model.t.MANUFACTURER'),
					message: LocaleService.t('codbex-partners:codbex-partners-model.messages.error.unableToCreate', { name: '$t(codbex-partners:codbex-partners-model.t.MANUFACTURER)', message: message }),
					type: AlertTypes.Error
				});
				console.error('EntityService:', error);
			});
		};

		$scope.cancel = () => {
			Dialogs.triggerEvent('codbex-partners.Manufacturers.Manufacturer.clearDetails');
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
		

		//-----------------Dialogs-------------------//



		//----------------Dropdowns-----------------//


		//----------------Dropdowns-----------------//	
	});