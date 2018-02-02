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
            $scope.saveBtnClick = false;
            $scope.saveValidation = {
                "containerType":"",
                "factory":"",
                "factoryLocation":"",
                "batteryInfo":"",
                "hardwareInfo":"",
                "manufactureTime":"",
                "RFIDInvalid":""
            };
            $scope.rfid = "";
            $scope.showAdd = !$scope.showAdd;
        };
        $scope.saveValidation = {};
        $scope.editValidation = {};

        $scope.validationCheck = function(){
             if(!$scope.saveBtnClick){
                 return;
             }
             var flag = false;
             for(var s in vm.newBasicInfoConfig){
                 if(vm.newBasicInfoConfig[s] == undefined || vm.newBasicInfoConfig[s] ==""){
                     $scope.saveValidation[s] = true;
                     $scope.rfid = "areaRequire";
                     flag = true;
                 }else{
                     $scope.saveValidation[s] = false;
                 }
             }
             if((vm.newBasicInfoConfig['RFID'] != '' && !constdata.validation.rfid.test(vm.newBasicInfoConfig['RFID']))){
                 $scope.rfid = "invalida-area"
                 $scope.saveValidation['RFIDInvalid'] = true;
                 flag = true;
             }else{
                 $scope.saveValidation['RFIDInvalid'] = false;
                 $scope.rfid = vm.newBasicInfoConfig['RFID'] =="" ? "areaRequire":"";
             }

            console.log("$scope.saveValidation= ",$scope.saveValidation);
            return flag;
        };

        $scope.editValidationCheck = function(){
            if(!$scope.editBtnClick){
                return;
            }
            var flag = false;
            for(var s in vm.editBasicInfoConfig){
                if(vm.editBasicInfoConfig[s] == undefined || vm.editBasicInfoConfig[s] ==""){
                    $scope.editValidation[s] = true;
                    $scope.editRfid = "areaRequire";
                    flag = true;
                }else{
                    $scope.editValidation[s] = false;
                }
            }
            if((vm.editBasicInfoConfig['tid'] != '' && !constdata.validation.rfid.test(vm.editBasicInfoConfig['tid']))){
                $scope.editRfid = "invalida-area"
                $scope.editValidation['RFIDInvalid'] = true;
                flag = true;
            }else{
                $scope.editValidation['RFIDInvalid'] = false;
                $scope.editRfid = vm.editBasicInfoConfig['tid'] =="" ? "areaRequire":"";
            }
            console.log("$scope.saveValidation= ",JSON.stringify($scope.editValidation))
            return flag;
        };

        $scope.basicUpdate = function (item) {
            $scope.editValidation = {
                "deviceid": "",
                "tid": "",
                "date_of_production": "",
                "box_type_name": "",
                "produce_area": "",
                "manufacturer": "",
                "battery_detail": "",
                "box_type_id": "",
                "produce_area_id": "",
                "manufacturer_id": "",
                "battery_id": "",
                "hardware_detail": "",
                "hardware_id": "",
                "RFIDInvalid": ""
            };
            $scope.eidtBtnClick = false;
            $scope.editRfid = "";
            vm.editBasicInfoConfig = _.clone(item);
            vm.editBasicInfoConfig.date_of_production = parseInt(vm.editBasicInfoConfig.date_of_production);
            vm.options = R.merge(vm.options, {
                title: "编辑云箱基础信息",
                is_insert: false
            });
            $scope.bbUpdate = !$scope.bbUpdate;
            $scope.$emit("scrollTop");
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
                            toastr.error(err.msg||"删除基础信息失败。");
                        }
                    })
                }
            };
            $scope.$emit('showDelMsg',opt);
        };



        vm.table = [
            {"name": "云箱ID", width: "13%"},
            {"name": "RFID", width: "13%"},
            {"name": "云箱型号", width: "8%"},
            {"name": "生产地", width: "12%"},
            {"name": "生产厂家", width: "18%"},
            {"name": "出厂日期", width: "8%"},
            {"name": "电源信息", width: "8%"},
            {"name": "操作", width: "20%"}
        ];
        //ie11 下不支持style="width：{{}}"写法 为了兼容它
        _.map(vm.table,function(item){
            item.style = {
                width:item['width']
            }
        });

        $scope.conf = {
            currentPage: 1,
            itemsPerPage: 10,
            totalItems: 0,
            pagesLength: 15,
            perPageOptions: [10, 20, 30, 40, 50],
            onChange: function () {
            }
        };

        vm.newBasicInfoConfig = {
            "RFID": "",
            "containerType": "",
            "factory": "",
            "factoryLocation": "",
            "batteryInfo": "",
            "hardwareInfo": "",
            "manufactureTime":""
        };
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
            vm.MaxDate = moment();
            console.log('moment = ',moment())
            vm.newSecurityConfig = {
                intervalTime: R.compose(R.prop("value"), R.head)(vm.options.intervalTime)
            };
            vm.newAlertConfig = {};
            vm.newIssueConfig = {};
        },true);

        getBasicInfo();

        function getBasicInfo() {
            vm.gettingData = true;
            var data = {
                container_id: 'all',
                container_type: 0,
                factory: 0,
                start_time: 0,
                end_time: 0,
                limit:$scope.conf.itemsPerPage,
                offset: ($scope.conf.currentPage - 1) * $scope.conf.itemsPerPage
            };
            ApiServer.getBasicInfo(data, function (response) {
                vm.basicInfoManage = response.data.data.results;
                $scope.conf.totalItems = response.data.data.count;
                vm.gettingData = false;
            }, function (err) {
                console.log("Get ContainerOverview Info Failed", err);
                vm.gettingData = false;
            });
        }

        function saveBasicInfoConfig(isUseForAdd) {
            if(isUseForAdd){
                newBasicInfoConfigPost(function(){
                        cancelBasicInfoConfig(isUseForAdd)
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


                vm.newBasicInfoConfig = {
                    "RFID": "请输入RFID...",
                    "containerType": "",
                    "factory": "",
                    "factoryLocation": "",
                    "batteryInfo": "",
                    "hardwareInfo": "",
                    "manufactureTime":""
                };
                $scope.saveValidation = {};
                //$scope.$digest();
                setTimeout(function(){
                    vm.newBasicInfoConfig['RFID'] = "";
                },1)
            } else {
                $scope.bbUpdate = false;
            }
        }

        function newBasicInfoConfigPost(callback) {
            $scope.saveBtnClick = true;
            if($scope.validationCheck()){
                return;
            }
             var data = {
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
                    toastr.error(err.msg || "新增基础信息失败。");
                }
            });
        }

        function editBasicInfoConfigPost(callback){
            $scope.editBtnClick = true;
            if($scope.editValidationCheck()){
                return;
            }
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
                    toastr.error(err.msg || "修改基础信息失败。");
                }
            })
        }

        function inputTransFunc(num) {
            return parseInt(num, 10)
        }

        $scope.$watchGroup(['conf.currentPage', 'conf.itemsPerPage'], getBasicInfo)
    }

})();
