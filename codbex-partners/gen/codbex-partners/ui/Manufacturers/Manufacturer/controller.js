angular.module('page', ['blimpKit', 'platformView', 'platformLocale', 'EntityService'])
	.config(['EntityServiceProvider', (EntityServiceProvider) => {
		EntityServiceProvider.baseUrl = '/services/ts/codbex-partners/gen/codbex-partners/api/Manufacturers/ManufacturerService.ts';
	}])
	.controller('PageController', ($scope, $http, EntityService, Extensions, LocaleService, ButtonStates) => {
		const Dialogs = new DialogHub();
		let translated = {
			yes: 'Yes',
			no: 'No',
			deleteConfirm: 'Are you sure you want to delete Manufacturer? This action cannot be undone.',
			deleteTitle: 'Delete Manufacturer?'
		};

		LocaleService.onInit(() => {
			translated.yes = LocaleService.t('codbex-partners:codbex-partners-model.defaults.yes');
			translated.no = LocaleService.t('codbex-partners:codbex-partners-model.defaults.no');
			translated.deleteTitle = LocaleService.t('codbex-partners:codbex-partners-model.defaults.deleteTitle', { name: '$t(codbex-partners:codbex-partners-model.t.MANUFACTURER)' });
			translated.deleteConfirm = LocaleService.t('codbex-partners:codbex-partners-model.messages.deleteConfirm', { name: '$t(codbex-partners:codbex-partners-model.t.MANUFACTURER)' });
		});
		$scope.dataPage = 1;
		$scope.dataCount = 0;
		$scope.dataOffset = 0;
		$scope.dataLimit = 10;
		$scope.action = 'select';

		//-----------------Custom Actions-------------------//
		Extensions.getWindows(['codbex-partners-custom-action']).then((response) => {
			$scope.pageActions = response.data.filter(e => e.perspective === 'Manufacturers' && e.view === 'Manufacturer' && (e.type === 'page' || e.type === undefined));
		});

		$scope.triggerPageAction = (action) => {
			Dialogs.showWindow({
				hasHeader: true,
        		title: LocaleService.t(action.translation.key, action.translation.options, action.label),
				path: action.path,
				maxWidth: action.maxWidth,
				maxHeight: action.maxHeight,
				closeButton: true
			});
		};
		//-----------------Custom Actions-------------------//

		function refreshData() {
			$scope.dataReset = true;
			$scope.dataPage--;
		}

		function resetPagination() {
			$scope.dataReset = true;
			$scope.dataPage = 1;
			$scope.dataCount = 0;
			$scope.dataLimit = 10;
		}

		//-----------------Events-------------------//
		Dialogs.addMessageListener({ topic: 'codbex-partners.Manufacturers.Manufacturer.clearDetails', handler: () => {
			$scope.$evalAsync(() => {
				$scope.selectedEntity = null;
				$scope.action = 'select';
			});
		}});
		Dialogs.addMessageListener({ topic: 'codbex-partners.Manufacturers.Manufacturer.entityCreated', handler: () => {
			refreshData();
			$scope.loadPage($scope.dataPage, $scope.filter);
		}});
		Dialogs.addMessageListener({ topic: 'codbex-partners.Manufacturers.Manufacturer.entityUpdated', handler: () => {
			refreshData();
			$scope.loadPage($scope.dataPage, $scope.filter);
		}});
		Dialogs.addMessageListener({ topic: 'codbex-partners.Manufacturers.Manufacturer.entitySearch', handler: (data) => {
			resetPagination();
			$scope.filter = data.filter;
			$scope.filterEntity = data.entity;
			$scope.loadPage($scope.dataPage, $scope.filter);
		}});
		//-----------------Events-------------------//

		$scope.loadPage = (pageNumber, filter) => {
			if (!filter && $scope.filter) {
				filter = $scope.filter;
			}
			if (!filter) {
				filter = {};
			}
			$scope.selectedEntity = null;
			EntityService.count(filter).then((resp) => {
				if (resp.data) {
					$scope.dataCount = resp.data.count;
				}
				$scope.dataPages = Math.ceil($scope.dataCount / $scope.dataLimit);
				filter.$offset = ($scope.dataPage - 1) * $scope.dataLimit;
				filter.$limit = $scope.dataLimit;
				if ($scope.dataReset) {
					filter.$offset = 0;
					filter.$limit = $scope.dataPage * $scope.dataLimit;
				}

				EntityService.search(filter).then((response) => {
					if ($scope.data == null || $scope.dataReset) {
						$scope.data = [];
						$scope.dataReset = false;
					}
					$scope.data = $scope.data.concat(response.data);
					$scope.dataPage++;
				}, (error) => {
					const message = error.data ? error.data.message : '';
					Dialogs.showAlert({
						title: LocaleService.t('codbex-partners:codbex-partners-model.t.MANUFACTURER'),
						message: LocaleService.t('codbex-partners:codbex-partners-model.messages.error.unableToLF', { name: '$t(codbex-partners:codbex-partners-model.t.MANUFACTURER)', message: message }),
						type: AlertTypes.Error
					});
					console.error('EntityService:', error);
				});
			}, (error) => {
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: LocaleService.t('codbex-partners:codbex-partners-model.t.MANUFACTURER'),
					message: LocaleService.t('codbex-partners:codbex-partners-model.messages.error.unableToCount', { name: '$t(codbex-partners:codbex-partners-model.t.MANUFACTURER)', message: message }),
					type: AlertTypes.Error
				});
				console.error('EntityService:', error);
			});
		};
		$scope.loadPage($scope.dataPage, $scope.filter);

		$scope.selectEntity = (entity) => {
			$scope.selectedEntity = entity;
			Dialogs.postMessage({ topic: 'codbex-partners.Manufacturers.Manufacturer.entitySelected', data: {
				entity: entity,
				selectedMainEntityId: entity.Id,
				optionsCountry: $scope.optionsCountry,
				optionsCity: $scope.optionsCity,
			}});
		};

		$scope.createEntity = () => {
			$scope.selectedEntity = null;
			$scope.action = 'create';

			Dialogs.postMessage({ topic: 'codbex-partners.Manufacturers.Manufacturer.createEntity', data: {
				entity: {},
				optionsCountry: $scope.optionsCountry,
				optionsCity: $scope.optionsCity,
			}});
		};

		$scope.updateEntity = () => {
			$scope.action = 'update';
			Dialogs.postMessage({ topic: 'codbex-partners.Manufacturers.Manufacturer.updateEntity', data: {
				entity: $scope.selectedEntity,
				optionsCountry: $scope.optionsCountry,
				optionsCity: $scope.optionsCity,
			}});
		};

		$scope.deleteEntity = () => {
			let id = $scope.selectedEntity.Id;
			Dialogs.showDialog({
				title: translated.deleteTitle,
				message: translated.deleteConfirm,
				buttons: [{
					id: 'delete-btn-yes',
					state: ButtonStates.Emphasized,
					label: translated.yes,
				}, {
					id: 'delete-btn-no',
					label: translated.no,
				}],
				closeButton: false
			}).then((buttonId) => {
				if (buttonId === 'delete-btn-yes') {
					EntityService.delete(id).then(() => {
						refreshData();
						$scope.loadPage($scope.dataPage, $scope.filter);
						Dialogs.triggerEvent('codbex-partners.Manufacturers.Manufacturer.clearDetails');
					}, (error) => {
						const message = error.data ? error.data.message : '';
						Dialogs.showAlert({
							title: LocaleService.t('codbex-partners:codbex-partners-model.t.MANUFACTURER'),
							message: LocaleService.t('codbex-partners:codbex-partners-model.messages.error.unableToDelete', { name: '$t(codbex-partners:codbex-partners-model.t.MANUFACTURER)', message: message }),
							type: AlertTypes.Error
						});
						console.error('EntityService:', error);
					});
				}
			});
		};

		$scope.openFilter = () => {
			Dialogs.showWindow({
				id: 'Manufacturer-filter',
				params: {
					entity: $scope.filterEntity,
					optionsCountry: $scope.optionsCountry,
					optionsCity: $scope.optionsCity,
				},
			});
		};

		//----------------Dropdowns-----------------//
		$scope.optionsCountry = [];
		$scope.optionsCity = [];


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

		$scope.optionsCountryValue = (optionKey) => {
			for (let i = 0; i < $scope.optionsCountry.length; i++) {
				if ($scope.optionsCountry[i].value === optionKey) {
					return $scope.optionsCountry[i].text;
				}
			}
			return null;
		};
		$scope.optionsCityValue = (optionKey) => {
			for (let i = 0; i < $scope.optionsCity.length; i++) {
				if ($scope.optionsCity[i].value === optionKey) {
					return $scope.optionsCity[i].text;
				}
			}
			return null;
		};
		//----------------Dropdowns-----------------//
	});
