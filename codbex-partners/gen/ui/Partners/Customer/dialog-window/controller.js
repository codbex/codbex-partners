angular.module('page', ["ideUI", "ideView", "entityApi"])
	.config(["messageHubProvider", function (messageHubProvider) {
		messageHubProvider.eventIdPrefix = 'codbex-partners.Partners.Customer';
	}])
	.config(["entityApiProvider", function (entityApiProvider) {
		entityApiProvider.baseUrl = "/services/js/codbex-partners/gen/api/Partners/Customer.js";
	}])
	.controller('PageController', ['$scope', 'messageHub', 'entityApi', function ($scope, messageHub, entityApi) {

		$scope.entity = {};
		$scope.formHeaders = {
			select: "Customer Details",
			create: "Create Customer",
			update: "Update Customer"
		};
		$scope.formErrors = {};
		$scope.action = 'select';

		if (window != null && window.frameElement != null && window.frameElement.hasAttribute("data-parameters")) {
			let dataParameters = window.frameElement.getAttribute("data-parameters");
			if (dataParameters) {
				let params = JSON.parse(dataParameters);
				$scope.action = params.action;
				if ($scope.action == "create") {
					$scope.formErrors = {
					};
				}
				$scope.entity = params.entity;
				$scope.selectedMainEntityKey = params.selectedMainEntityKey;
				$scope.selectedMainEntityId = params.selectedMainEntityId;
				$scope.optionsCountry = params.optionsCountry;
			}
		}

		$scope.isValid = function (isValid, property) {
			$scope.formErrors[property] = !isValid ? true : undefined;
			for (let next in $scope.formErrors) {
				if ($scope.formErrors[next] === true) {
					$scope.isFormValid = false;
					return;
				}
			}
			$scope.isFormValid = true;
		};

		$scope.create = function () {
			let entity = $scope.entity;
			entity[$scope.selectedMainEntityKey] = $scope.selectedMainEntityId;
			entityApi.create(entity).then(function (response) {
				if (response.status != 201) {
					$scope.errorMessage = `Unable to create Customer: '${response.message}'`;
					return;
				}
				messageHub.postMessage("entityCreated", response.data);
				$scope.cancel();
				messageHub.showAlertSuccess("Customer", "Customer successfully created");
			});
		};

		$scope.update = function () {
			let id = $scope.entity.Id;
			let entity = $scope.entity;
			entity[$scope.selectedMainEntityKey] = $scope.selectedMainEntityId;
			entityApi.update(id, entity).then(function (response) {
				if (response.status != 200) {
					$scope.errorMessage = `Unable to update Customer: '${response.message}'`;
					return;
				}
				messageHub.postMessage("entityUpdated", response.data);
				$scope.cancel();
				messageHub.showAlertSuccess("Customer", "Customer successfully updated");
			});
		};

		$scope.cancel = function () {
			$scope.entity = {};
			$scope.action = 'select';
			messageHub.closeDialogWindow("Customer-details");
		};

		$scope.clearErrorMessage = function () {
			$scope.errorMessage = null;
		};

	}]);