/**
 * Created by guankai on 22/05/2017.
 */
(function () {
    'use strict';

    angular.module('smart_container').controller('basicManageController', basicManageController);

    /** @ngInject */
    function basicManageController(constdata, NetworkService, MapService, $stateParams, ApiServer, toastr, $state, $timeout, $interval,$scope) {
        /* jshint validthis: true */
        var vm = this;
        $scope.modalInput = false;
        $scope.toggleModal = function() {
            $scope.modalInput = !$scope.modalInput;
        };
        $scope.modalUpdate = false;
        $scope.toggleUpdate = function(){
            $scope.modalUpdate = !$scope.modalUpdate;
        }
        $scope.alertInput = false;
        $scope.toggleAlertInput = function() {
            $scope.alertInput = !$scope.alertInput;
        };

        vm.newBasicInfoConfig = {};
        vm.newSecurityConfig = {};
        vm.newAlertConfig = {};
        vm.newIssueConfig = {};
        vm.basicInfoManage = {
            basicInfoConfig : {},
            alertConfig: {},
            issueConfig: {}
        };

        var requiredOptions = [
                    "carrier",
                    "factory",
                    "factoryLocation",
                    "batteryInfo",
                    "hardwareInfo",
                    "intervalTime",
                    "maintenanceLocation",
                    "containerType",
                    "alertCode",
                    "alertType",
                    "alertLevel"
                ];

        ApiServer.getOptions(requiredOptions, function(options) {
            vm.options = options
            console.log(options);
        })

        getBasicInfoManage();

        function getBasicInfoManage () {
            ApiServer.getBasicInfoManage(function (response) {
                vm.basicInfoManage = response.data
                console.log(vm.basicInfoManage);
            },function (err) {
                console.log("Get ContainerOverview Info Failed", err);
            });
        }
    }


})();
