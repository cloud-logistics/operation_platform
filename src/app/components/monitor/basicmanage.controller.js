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

        vm.newBasicInfoConfig = {};
        vm.newSecurityConfig = {};
        vm.newAlertConfig = {};
        vm.newIssueConfig = {};
        vm.basicInfoManage = {
            basicInfoConfig : {},
            alertConfig: {},
            issueConfig: {}
        };

        vm.newBasicInfoConfigPost = newBasicInfoConfigPost;
        vm.updateSecurityConfigPost = updateSecurityConfigPost;
        vm.newAlertConfigPost = newAlertConfigPost;
        vm.newIssueConfigPost = newIssueConfigPost;

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

        function newBasicInfoConfigPost () {
            console.log("new basicInfo params: ", vm.newBasicInfoConfig);
            ApiServer.newBasicInfoConfig(vm.newBasicInfoConfig, function (response) {
                console.log(response.data.code);
            },function (err) {
                console.log("Get ContainerOverview Info Failed", err);
            });
        }

        function updateSecurityConfigPost () {
            ApiServer.getAlerts(vm.updateSecurityConfig, function (response) {
                console.log(response.data);
            },function (err) {
                console.log("Get ContainerOverview Info Failed", err);
            });
        }

        function newAlertConfigPost () {
            ApiServer.getAlerts(vm.newAlertConfig, function (response) {
                console.log(response.data);
            },function (err) {
                console.log("Get ContainerOverview Info Failed", err);
            });
        }

        function newIssueConfigPost () {
            ApiServer.getAlerts(vm.newIssueConfig, function (response) {
                console.log(response.data);
            },function (err) {
                console.log("Get ContainerOverview Info Failed", err);
            });
        }
    }


})();
