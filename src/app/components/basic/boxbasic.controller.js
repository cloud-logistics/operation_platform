/**
 * Created by guankai on 02/06/2017.
 */
(function () {
    'use strict';

    angular.module('smart_container').controller('BoxBasicController', BoxBasicController);

    /** @ngInject */
    function BoxBasicController(constdata, NetworkService, $stateParams, ApiServer, toastr, $state, $timeout, $interval, $scope, optionsTransFunc) {
        /* jshint validthis: true */
        var vm = this;

        vm.title = '报警监控';
        vm.reports = [];
        vm.queryParams = {};
        $scope.showAdd = false;
        $scope.switchShowAdd = function(){
            $scope.showAdd = ! $scope.showAdd;
        }
        $scope.basicUpdate = function(){
            vm.options = R.merge(vm.options, {
                title: "编辑云箱基础信息",
                is_insert: false
            })

            $scope.bbUpdate = !$scope.bbUpdate;
            // $scope.modalUpdate = !$scope.modalUpdate;
        };

        vm.newBasicInfoConfig = {};
        vm.basicInfoManage = {
            basicInfoConfig : {},
            alertConfig: {},
            issueConfig: {}
        };

        vm.saveBasicInfoConfig = saveBasicInfoConfig;
        vm.cancelBasicInfoConfig = cancelBasicInfoConfig;
        $scope.saveBasicInfoConfig = saveBasicInfoConfig;
        $scope.cancelBasicInfoConfig = cancelBasicInfoConfig;
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
                containerType : R.compose(R.prop("value"),R.head)(vm.options.containerType),
                factory : R.compose(R.prop("value"),R.head)(vm.options.factory),
                factoryLocation : R.compose(R.prop("value"),R.head)(vm.options.factoryLocation),
                batteryInfo : R.compose(R.prop("value"),R.head)(vm.options.batteryInfo),
                hardwareInfo : R.compose(R.prop("value"),R.head)(vm.options.hardwareInfo),
                manufactureTime: moment(new Date())
            };
            vm.newSecurityConfig = {
                intervalTime : R.compose(R.prop("value"),R.head)(vm.options.intervalTime)
            };
            vm.newAlertConfig = {};
            vm.newIssueConfig = {};

            console.log(options);
        })

        getBasicInfo();
        var timer = $interval(function(){
            getBasicInfo();
        },constdata.refreshInterval, 500);

        $scope.$on("$destroy", function(){
            $interval.cancel(timer);
        });
                
        function getBasicInfo () {
            ApiServer.getBasicInfo({}, function (response) {
                // console.log(Date.parse(vm.queryParams.startTime).toString());
                vm.basicInfoManage = response.data.basicInfo
                console.log(vm.basicInfoManage);
            },function (err) {
                console.log("Get ContainerOverview Info Failed", err);
            });
        }

        function saveBasicInfoConfig(isUseForAdd) {
            newBasicInfoConfigPost();
            if(isUseForAdd){
                $scope.switchShowAdd();
            }else{
                $scope.bbUpdate = false;
            }
        }

        function cancelBasicInfoConfig(isUseForAdd) {
            if(isUseForAdd){
                $scope.switchShowAdd();
            }else{
                $scope.bbUpdate = false;
            }
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

    }

})();
