angular.module('page', ["ideUI", "ideView", "entityApi"])
	.config(["messageHubProvider", function (messageHubProvider) {
		messageHubProvider.eventIdPrefix = 'codbex-partners.partners.Partner';
	}])
	.config(["entityApiProvider", function (entityApiProvider) {
		entityApiProvider.baseUrl = "/services/js/codbex-partners/gen/api/partners/Partner.js";
	}])
	.controller('PageController', ['$scope', '$http', 'messageHub', 'entityApi', function ($scope, $http, messageHub, entityApi) {

		function resetPagination() {
			$scope.dataPage = 1;
			$scope.dataCount = 0;
			$scope.dataLimit = 20;
		}
		resetPagination();

		//-----------------Events-------------------//
		messageHub.onDidReceiveMessage("entityCreated", function (msg) {
			$scope.loadPage($scope.dataPage);
		});

		messageHub.onDidReceiveMessage("entityUpdated", function (msg) {
			$scope.loadPage($scope.dataPage);
		});
		//-----------------Events-------------------//

		$scope.loadPage = function (pageNumber) {
			$scope.dataPage = pageNumber;
			entityApi.count().then(function (response) {
				if (response.status != 200) {
					messageHub.showAlertError("Partner", `Unable to count Partner: '${response.message}'`);
					return;
				}
				$scope.dataCount = response.data;
				let offset = (pageNumber - 1) * $scope.dataLimit;
				let limit = $scope.dataLimit;
				entityApi.list(offset, limit).then(function (response) {
					if (response.status != 200) {
						messageHub.showAlertError("Partner", `Unable to list Partner: '${response.message}'`);
						return;
					}
					$scope.data = response.data;
				});
			});
		};
		$scope.loadPage($scope.dataPage);

		$scope.selectEntity = function (entity) {
			$scope.selectedEntity = entity;
		};

		$scope.openDetails = function (entity) {
			$scope.selectedEntity = entity;
			messageHub.showDialogWindow("Partner-details", {
				action: "select",
				entity: entity,
				optionsPartnerTypeId: $scope.optionsPartnerTypeId,
				optionsCountryId: $scope.optionsCountryId,
			});
		};

		$scope.createEntity = function () {
			$scope.selectedEntity = null;
			messageHub.showDialogWindow("Partner-details", {
				action: "create",
				entity: {},
				optionsPartnerTypeId: $scope.optionsPartnerTypeId,
				optionsCountryId: $scope.optionsCountryId,
			}, null, false);
		};

		$scope.updateEntity = function (entity) {
			messageHub.showDialogWindow("Partner-details", {
				action: "update",
				entity: entity,
				optionsPartnerTypeId: $scope.optionsPartnerTypeId,
				optionsCountryId: $scope.optionsCountryId,
			}, null, false);
		};

		$scope.deleteEntity = function (entity) {
			let id = entity.Id;
			messageHub.showDialogAsync(
				'Delete Partner?',
				`Are you sure you want to delete Partner? This action cannot be undone.`,
				[{
					id: "delete-btn-yes",
					type: "emphasized",
					label: "Yes",
				},
				{
					id: "delete-btn-no",
					type: "normal",
					label: "No",
				}],
			).then(function (msg) {
				if (msg.data === "delete-btn-yes") {
					entityApi.delete(id).then(function (response) {
						if (response.status != 204) {
							messageHub.showAlertError("Partner", `Unable to delete Partner: '${response.message}'`);
							return;
						}
						$scope.loadPage($scope.dataPage);
						messageHub.postMessage("clearDetails");
					});
				}
			});
		};

		//----------------Dropdowns-----------------//
		$scope.optionsPartnerTypeId = [];
		$scope.optionsCountryId = [];

		$http.get("/services/js/codbex-partners/gen/api/settings/PartnerType.js").then(function (response) {
			$scope.optionsPartnerTypeId = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Name
				}
			});
		});

		$http.get("/services/js/codbex-partners/gen/api/Entities/Country.js").then(function (response) {
			$scope.optionsCountryId = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Name
				}
			});
		});
		$scope.optionsPartnerTypeIdValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsPartnerTypeId.length; i++) {
				if ($scope.optionsPartnerTypeId[i].value === optionKey) {
					return $scope.optionsPartnerTypeId[i].text;
				}
			}
			return null;
		};
		$scope.optionsCountryIdValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsCountryId.length; i++) {
				if ($scope.optionsCountryId[i].value === optionKey) {
					return $scope.optionsCountryId[i].text;
				}
			}
			return null;
		};
		//----------------Dropdowns-----------------//

	}]);
