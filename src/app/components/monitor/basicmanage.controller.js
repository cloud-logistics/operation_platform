/**
 * Created by guankai on 22/05/2017.
 */
(function () {
    'use strict';

    angular.module('smart_container').controller('basicManageController', basicManageController);

    /** @ngInject */
    function basicManageController(constdata, NetworkService, MapService, $stateParams, ApiServer, toastr, $state, $timeout, $interval,$scope, optionsTransFunc) {
        /* jshint validthis: true */
        var vm = this;
        $scope.modalInput = false;
        $scope.toggleModal = function() {
            $scope.modalInput = !$scope.modalInput;
        };
        $scope.modalUpdate = false;
        $scope.toggleUpdate = function(){
            $scope.modalUpdate = !$scope.modalUpdate;
        };
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

        vm.newBasicInfoConfigPost = newBasicInfoConfigPost;
        vm.updateNormalContainerSecurityConfigPost = updateNormalContainerSecurityConfigPost;
        vm.updateUldSecurityConfigPost = updateUldSecurityConfigPost;
        vm.newAlertConfigPost = newAlertConfigPost;
        vm.newIssueConfigPost = newIssueConfigPost;

        vm.options = {};
        var transformations = undefined;

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

            transformations = {
                intervalTime: optionsTransFunc(vm.options.intervalTime),
                carrier: optionsTransFunc(vm.options.carrier),
                factory: optionsTransFunc(vm.options.factory),
                factoryLocation: optionsTransFunc(vm.options.factoryLocation),
                batteryInfo: optionsTransFunc(vm.options.batteryInfo),
                hardwareInfo: optionsTransFunc(vm.options.hardwareInfo),
                manufactureTime: R.compose(R.toString, Date.parse),
                temperature : {
                    min: inputTransFunc,
                    max: inputTransFunc
                },
                humidity : {
                    min: inputTransFunc,
                    max: inputTransFunc
                },
                collision : {
                    min: inputTransFunc,
                    max: inputTransFunc
                },
                battery : {
                    min: inputTransFunc,
                    max: inputTransFunc
                },
                operation : {
                    min: inputTransFunc,
                    max: inputTransFunc
                }
            };

            vm.newBasicInfoConfig = {
                carrier : R.compose(R.prop("value"),R.head)(vm.options.carrier),
                factory : R.compose(R.prop("value"),R.head)(vm.options.factory),
                factoryLocation : R.compose(R.prop("value"),R.head)(vm.options.factoryLocation),
                batteryInfo : R.compose(R.prop("value"),R.head)(vm.options.batteryInfo),
                hardwareInfo : R.compose(R.prop("value"),R.head)(vm.options.hardwareInfo),
            };
            vm.newSecurityConfig = {
                intervalTime : R.compose(R.prop("value"),R.head)(vm.options.intervalTime)
            };
            vm.newAlertConfig = {};
            vm.newIssueConfig = {};

            console.log(options);
        })

        getBasicInfoManage();
        var timer = $interval(function(){
            getBasicInfoManage();
        },5000, 500);

        $scope.$on("$destroy", function(){
            $interval.cancel(timer);
        });

        function getBasicInfoManage () {
            ApiServer.getBasicInfoManage(function (response) {
                vm.basicInfoManage = response.data
                console.log(vm.basicInfoManage);
            },function (err) {
                console.log("Get ContainerOverview Info Failed", err);
            });
        }

        function newBasicInfoConfigPost () {
            var config = R.evolve(transformations)(vm.newBasicInfoConfig)
            console.log("new basicInfo params: ", config);
            ApiServer.newBasicInfoConfig(config, function (response) {
                console.log(response.data.code);
            },function (err) {
                console.log("Get ContainerOverview Info Failed", err);
            });
        }

        function inputTransFunc (num) {
            return parseInt(num, 10)
        }

        function updateNormalContainerSecurityConfigPost () {
            var config = R.merge(vm.newSecurityConfig, {
                containerType: 1
            })

            config = R.evolve(transformations)(config)

            console.log(config);

            ApiServer.updateSecurityConfig(config, function (response) {
                console.log(response.data);
            },function (err) {
                console.log("Get ContainerOverview Info Failed", err);
            });
        }

        function updateUldSecurityConfigPost () {
            var config = R.merge(vm.newSecurityConfig, {
                containerType: 2
            })

            config = R.evolve(transformations)(config)

            console.log(config);

            ApiServer.updateSecurityConfig(config, function (response) {
                console.log(response.data);
            },function (err) {
                console.log("Get ContainerOverview Info Failed", err);
            });
        }

        function newAlertConfigPost () {
            var config = R.evolve(transformations)(vm.newAlertConfig)
            console.log("new basicInfo params: ", config);

            ApiServer.newAlertConfig(config, function (response) {
                console.log(response.data);
            },function (err) {
                console.log("Get ContainerOverview Info Failed", err);
            });
        }

        function newIssueConfigPost () {
            var config = R.evolve(transformations)(vm.newIssueConfig)
            console.log("new basicInfo params: ", config);

            ApiServer.newIssueConfig(config, function (response) {
                console.log(response.data);
            },function (err) {
                console.log("Get ContainerOverview Info Failed", err);
            });
        }
    }

})();
