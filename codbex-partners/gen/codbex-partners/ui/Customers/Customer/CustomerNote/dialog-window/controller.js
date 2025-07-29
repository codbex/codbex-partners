angular.module('page', ['blimpKit', 'platformView', 'platformLocale', 'EntityService'])
	.config(['EntityServiceProvider', (EntityServiceProvider) => {
		EntityServiceProvider.baseUrl = '/services/ts/codbex-partners/gen/codbex-partners/api/Customers/CustomerNoteService.ts';
	}])
	.controller('PageController', ($scope, $http, ViewParameters, LocaleService, EntityService) => {
		const Dialogs = new DialogHub();
		const Notifications = new NotificationHub();
		let description = 'Description';
		let propertySuccessfullyCreated = 'CustomerNote successfully created';
		let propertySuccessfullyUpdated = 'CustomerNote successfully updated';
		$scope.entity = {};
		$scope.forms = {
			details: {},
		};
		$scope.formHeaders = {
			select: 'CustomerNote Details',
			create: 'Create CustomerNote',
			update: 'Update CustomerNote'
		};
		$scope.action = 'select';

		LocaleService.onInit(() => {
			description = LocaleService.t('codbex-partners:defaults.description');
			$scope.formHeaders.select = LocaleService.t('codbex-partners:defaults.formHeadSelect', { name: '$t(codbex-partners:t.CUSTOMERNOTE)' });
			$scope.formHeaders.create = LocaleService.t('codbex-partners:defaults.formHeadCreate', { name: '$t(codbex-partners:t.CUSTOMERNOTE)' });
			$scope.formHeaders.update = LocaleService.t('codbex-partners:defaults.formHeadUpdate', { name: '$t(codbex-partners:t.CUSTOMERNOTE)' });
			propertySuccessfullyCreated = LocaleService.t('codbex-partners:messages.propertySuccessfullyCreated', { name: '$t(codbex-partners:t.CUSTOMERNOTE)' });
			propertySuccessfullyUpdated = LocaleService.t('codbex-partners:messages.propertySuccessfullyUpdated', { name: '$t(codbex-partners:t.CUSTOMERNOTE)' });
		});

		let params = ViewParameters.get();
		if (Object.keys(params).length) {
			$scope.action = params.action;
			$scope.entity = params.entity;
			$scope.selectedMainEntityKey = params.selectedMainEntityKey;
			$scope.selectedMainEntityId = params.selectedMainEntityId;
		}

		$scope.create = () => {
			let entity = $scope.entity;
			entity[$scope.selectedMainEntityKey] = $scope.selectedMainEntityId;
			EntityService.create(entity).then((response) => {
				Dialogs.postMessage({ topic: 'codbex-partners.Customers.CustomerNote.entityCreated', data: response.data });
				Notifications.show({
					title: LocaleService.t('codbex-partners:t.CUSTOMERNOTE'),
					description: propertySuccessfullyCreated,
					type: 'positive'
				});
				$scope.cancel();
			}, (error) => {
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: LocaleService.t('codbex-partners:t.CUSTOMERNOTE'),
					message: LocaleService.t('codbex-partners:messages.error.unableToCreate', { name: '$t(codbex-partners:t.CUSTOMERNOTE)', message: message }),
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
				Dialogs.postMessage({ topic: 'codbex-partners.Customers.CustomerNote.entityUpdated', data: response.data });
				Notifications.show({
					title: LocaleService.t('codbex-partners:t.CUSTOMERNOTE'),
					description: propertySuccessfullyUpdated,
					type: 'positive'
				});
				$scope.cancel();
			}, (error) => {
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: LocaleService.t('codbex-partners:t.CUSTOMERNOTE'),
					message: LocaleService.t('codbex-partners:messages.error.unableToUpdate', { name: '$t(codbex-partners:t.CUSTOMERNOTE)', message: message }),
					type: AlertTypes.Error
				});
				console.error('EntityService:', error);
			});
		};


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
			Dialogs.closeWindow({ id: 'CustomerNote-details' });
		};
	});