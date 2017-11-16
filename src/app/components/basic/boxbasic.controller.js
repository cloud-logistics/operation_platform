/**
 * Created by guankai on 02/06/2017.
 */
(function () {
    'use strict';

    angular.module('smart_container').controller('BoxBasicController', BoxBasicController);

    /** @ngInject */
    function BoxBasicController(constdata, NetworkService, ApiServer, toastr, $scope, optionsTransFunc) {
        /* jshint validthis: true */
        var vm = this;

        vm.title = '报警监控';
        vm.reports = [];
        vm.queryParams = {};
        $scope.showAdd = false;
        $scope.switchShowAdd = function () {
            $scope.showAdd = !$scope.showAdd;
        };
        $scope.basicUpdate = function (item) {
            vm.editBasicInfoConfig = _.clone(item);
            vm.editBasicInfoConfig.date_of_production = parseInt(vm.editBasicInfoConfig.date_of_production);
            vm.options = R.merge(vm.options, {
                title: "编辑云箱基础信息",
                is_insert: false
            });
            $scope.bbUpdate = !$scope.bbUpdate;

        };

        $scope.deleteBoxBasic = function(item){
            var opt = {
                okFn:function(){
                    ApiServer.deleteBasicInfoConfig({
                        container_id: item.deviceid,
                        success: function (response) {
                            if (response.data.status == "OK") {
                                toastr.success(response.data.msg);
                                getBasicInfo();
                            } else {
                                toastr.error(response.data.msg);
                            }
                        },
                        error: function (err) {
                            console.log("删除基础信息失败。", err);
                        }
                    })
                }
            };
            $scope.$emit('showDelMsg',opt);
        };

        $scope.conf = {
            currentPage: 1,
            itemsPerPage: 10,
            totalItems: 0,
            pagesLength: 15,
            perPageOptions: [10, 20, 30, 40, 50],
            onChange: function () {
            }
        };

        vm.newBasicInfoConfig = {};
        vm.basicInfoManage = {
            basicInfoConfig: {},
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

        ApiServer.getOptions(requiredOptions, function (options) {
            vm.options = options

            transformations = {
                intervalTime: optionsTransFunc(vm.options.intervalTime),
                carrier: optionsTransFunc(vm.options.carrier),
                factory: optionsTransFunc(vm.options.factory),
                factoryLocation: optionsTransFunc(vm.options.factoryLocation),
                batteryInfo: optionsTransFunc(vm.options.batteryInfo),
                hardwareInfo: optionsTransFunc(vm.options.hardwareInfo),
                manufactureTime: R.compose(R.toString, Date.parse),
                temperature: {
                    min: inputTransFunc,
                    max: inputTransFunc
                },
                humidity: {
                    min: inputTransFunc,
                    max: inputTransFunc
                },
                collision: {
                    min: inputTransFunc,
                    max: inputTransFunc
                },
                battery: {
                    min: inputTransFunc,
                    max: inputTransFunc
                },
                operation: {
                    min: inputTransFunc,
                    max: inputTransFunc
                }
            };

            vm.newBasicInfoConfig = {
                carrier: R.compose(R.prop("value"), R.head)(vm.options.carrier),
                containerType: R.compose(R.prop("value"), R.head)(vm.options.containerType),
                factory: R.compose(R.prop("value"), R.head)(vm.options.factory),
                factoryLocation: R.compose(R.prop("value"), R.head)(vm.options.factoryLocation),
                batteryInfo: R.compose(R.prop("value"), R.head)(vm.options.batteryInfo),
                hardwareInfo: R.compose(R.prop("value"), R.head)(vm.options.hardwareInfo),
                manufactureTime: moment(new Date())
            };
            vm.MaxDate = moment()
            vm.newSecurityConfig = {
                intervalTime: R.compose(R.prop("value"), R.head)(vm.options.intervalTime)
            };
            vm.newAlertConfig = {};
            vm.newIssueConfig = {};

            console.log(options);
        });

        getBasicInfo();

        function getBasicInfo() {
            console.log(vm.queryParams)
            var data = {
                container_id: 'all',
                container_type: 0,
                factory: 0,
                start_time: 0,
                end_time: 0
            }
            ApiServer.getBasicInfo(data, function (response) {
                vm.basicInfoManage = response.data.data.results;
                $scope.conf.totalItems = response.data.data.count;
                console.log(vm.basicInfoManage);
            }, function (err) {
                console.log("Get ContainerOverview Info Failed", err);
            });
        }

        function saveBasicInfoConfig(isUseForAdd) {
            if(isUseForAdd){
                newBasicInfoConfigPost(function(){
                        $scope.switchShowAdd();
                        getBasicInfo();
                });
            }else{
                editBasicInfoConfigPost(function(){
                    $scope.bbUpdate = false;
                    getBasicInfo();
                })
            }

        }

        function cancelBasicInfoConfig(isUseForAdd) {
            if (isUseForAdd) {
                $scope.switchShowAdd();
            } else {
                $scope.bbUpdate = false;
            }
        }

        function newBasicInfoConfigPost(callback) {
             var data = {
                 "containerId":vm.newBasicInfoConfig.deviceid,
                "rfid": vm.newBasicInfoConfig.RFID,
                "containerType": vm.newBasicInfoConfig.containerType,
                "factory": vm.newBasicInfoConfig.factory,
                "factoryLocation": vm.newBasicInfoConfig.factoryLocation,
                "batteryInfo": vm.newBasicInfoConfig.batteryInfo,
                "hardwareInfo": vm.newBasicInfoConfig.hardwareInfo,
                "manufactureTime": vm.newBasicInfoConfig.manufactureTime ? new Date(vm.newBasicInfoConfig.manufactureTime.format("YYYY-MM-DD")).getTime() : ""
            }
            ApiServer.newBasicInfoConfig({
                data: data,
                success: function (response) {
                    if(response.data.status == "OK"){
                        toastr.success(response.data.msg);
                        if(callback){
                            callback();
                        }
                    }else{
                        toastr.error(response.data.msg);
                    }
                },
                error: function (err) {
                    console.log("新增基础信息失败。", err);
                }
            });
        }

        function editBasicInfoConfigPost(callback){
            var data = {
                "containerId":vm.editBasicInfoConfig.deviceid,
                "rfid": vm.editBasicInfoConfig.tid,
                "containerType": vm.editBasicInfoConfig.box_type_id,
                "factory": vm.editBasicInfoConfig.manufacturer_id,
                "factoryLocation": vm.editBasicInfoConfig.produce_area_id,
                "batteryInfo": vm.editBasicInfoConfig.battery_id,
                "hardwareInfo": vm.editBasicInfoConfig.hardware_id,
                "manufactureTime": vm.editBasicInfoConfig.date_of_production ? new Date(vm.editBasicInfoConfig.date_of_production).getTime()+"" : ""
            };
            ApiServer.editBasicInfoConfigPost({
                data: data,
                success: function (response) {
                    if (response.data.status == "OK") {
                        toastr.success(response.data.msg);
                        if (callback) {
                            callback();
                        }
                    } else {
                        toastr.error(response.data.msg);
                    }
                },
                error: function (err) {
                    toastr.error("修改基础信息失败。");
                }
            })
        }

        function inputTransFunc(num) {
            return parseInt(num, 10)
        }
        $scope.$watchGroup(['conf.currentPage', 'conf.itemsPerPage'], getBasicInfo)
    }

})();
