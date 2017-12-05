/**
 * Created by guankai on 02/06/2017.
 */
(function () {
    'use strict';

    angular.module('smart_container').controller('BoxParamController', BoxParamController);

    /** @ngInject */
    function BoxParamController(constdata, NetworkService, ApiServer, toastr, $state, $timeout, $interval, $scope, optionsTransFunc) {
        /* jshint validthis: true */
        var vm = this;

        vm.options = {};
        var transformations = undefined;

        var requiredOptions = [
            "intervalTime"
        ];

        var setMsg = function (min, max, index, key, isOldThan0) {
            var flag;
            if (min >= max) {
                flag = false;
                vm.boxList[index][key] = "前者必须小于后者";
                vm.boxList[index][key.replace("msg", "class")] = "invalida-area";
            } else {
                flag = true;
                vm.boxList[index][key] = "";
                vm.boxList[index][key.replace("msg", "class")] = "";
            }
            return flag;
        };

        $scope.validationLength = function(value,len){
            if((value+"").length > len && event.keyCode!=8 && value != null){
                event.preventDefault();
            }
        };

        $scope.validationCheck = function (item, index) {
            var flag = true;
            //GPS [0,200]
            if (item.interval_time > 200 || item.interval_time < 0) {
                vm.boxList[index].interval_time_msg = "只能输入0-200之间的整数";
                flag = false;
                vm.boxList[index].interval_time_class = "invalida-area";
            } else {
                vm.boxList[index].interval_time_msg = "";
                vm.boxList[index].interval_time_class = !(item.interval_time) && (item.interval_time != 0) ? " areaRequire" : "";
            }
            //温度[-55,85]
            if ((!/^-[1-4][0-9]{0,1}$|^-5[0-5]{0,1}$|^[-]{0,1}[0-9]$|^[1-7][0-9]{0,1}$|^8[0-5]{0,1}$/.test(item.temperature_threshold_min) && item.temperature_threshold_min != null))
            {
                vm.boxList[index].temperature_threshold_min_msg = "温度应为(-55,85)的整数";
                flag = false;
                vm.boxList[index].temperature_threshold_min_class = " invalida-area ";
            } else {
                vm.boxList[index].temperature_threshold_min_msg = "";
                vm.boxList[index].temperature_threshold_min_class = "";
            }
            //温度[-55,85]
            if ((!/^-[1-4][0-9]{0,1}$|^-5[0-5]{0,1}$|^[1-7][0-9]{0,1}$|^8[0-5]{0,1}$|^[-]{0,1}[0-9]$/.test(item.temperature_threshold_max) && item.temperature_threshold_max != null))
            {
                vm.boxList[index].temperature_threshold_max_msg = "温度应为(-55,85)的整数";
                flag = false;
                vm.boxList[index].temperature_threshold_max_class = " invalida-area ";
            } else {
                vm.boxList[index].temperature_threshold_max_msg = "";
                vm.boxList[index].temperature_threshold_max_class = "";
            }

            //湿度
            if ((!/^[1-9][0-9]{0,1}$|^100$|^[0-9]$/.test(item.humidity_threshold_min) && item.humidity_threshold_min != null))
            {
                vm.boxList[index].humidity_threshold_min_msg = "湿度应[0,100]的整数";
                flag = false;
                vm.boxList[index].humidity_threshold_min_class = " invalida-area ";
                console.log(vm.boxList[index].humidity_threshold_min_class)
            } else {
                vm.boxList[index].humidity_threshold_min_msg = "";
                vm.boxList[index].humidity_threshold_min_class = "";
            }
            //湿度
            if ((!/^[1-9][0-9]{0,1}$|^100$|^[0-9]$/.test(item.humidity_threshold_max) && item.humidity_threshold_max != null))
            {
                vm.boxList[index].humidity_threshold_max_msg = "湿度应为[0,100]的整数";
                flag = false;
                vm.boxList[index].humidity_threshold_max_class = " invalida-area ";
            } else {
                vm.boxList[index].humidity_threshold_max_msg = "";
                vm.boxList[index].humidity_threshold_max_class = "";
            }
            //开关门次数 (0,1000)
            if (!/^[1-9][0-9]{0,2}$/.test(item.operation_threshold_max) && item.operation_threshold_max != null) {
                vm.boxList[index].operation_min_little_than_0_msg = "开关门数应为(0,1000)的整数";
                flag = false;
                vm.boxList[index].operation_min_little_than_0_class = " invalida-area ";
            } else {
                vm.boxList[index].operation_min_little_than_0_msg = "";
                vm.boxList[index].operation_min_little_than_0_class = "";
            }
            //碰撞次数 (0,1000)
            if (!/^[1-9][0-9]{0,2}$/.test(item.collision_threshold_max) &&item.collision_threshold_max != null) {
                vm.boxList[index].collision_min_little_than_0_msg = "碰撞次数应为(0,1000)的整数";
                flag = false;
                vm.boxList[index].collision_min_little_than_0_class = " invalida-area ";
            } else {
                vm.boxList[index].collision_min_little_than_0_msg = "";
                vm.boxList[index].collision_min_little_than_0_class = "";
            }
            //电池余量 (0,99)
            if ((!/^[1-8][0-9]{0,1}$|^9[0-8]{0,1}$/.test(item.battery_threshold_min) && item.battery_threshold_min != null))
            {
                vm.boxList[index].battery_min_little_than_0_msg = "电池余量应为(0,99)的整数";
                flag = false;
                vm.boxList[index].battery_min_little_than_0_class = " invalida-area ";
            } else {
                vm.boxList[index].battery_min_little_than_0_msg = "";
                vm.boxList[index].battery_min_little_than_0_class = "";
            }


            var menu = [
                "temperature_threshold_min",
                "humidity_threshold_min",
                "operation_threshold_min",
                "collision_threshold_min",
                "battery_threshold_min"
            ];
            for (var s = 0; s < 2; s++) {
                flag = setMsg(item[menu[s]],
                        item[menu[s].replace("min", "max")],
                        index, menu[s].replace("min", 'msg')) && flag;
            }
            var menu2 = menu.concat(_.map(menu, function (item) {
                return item.replace('min', 'max')
            }));
            for (var s = 0, len = menu2.length; s < len; s++) {
                if (!(item[menu2[s]]) && (item[menu2[s]] != 0)) {
                    flag = false;
                    item[menu2[s] + '___class'] = " areaRequire";
                } else {
                    item[menu2[s] + '___class'] = " ";
                }
            }
            //console.log("box = ", item);
            return flag;
        };

        ApiServer.getOptions(requiredOptions, function (options) {
            vm.options = options

            transformations = {
                intervalTime: optionsTransFunc(vm.options.intervalTime),
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

            vm.newNormalSecurityConfig = {
                intervalTime: R.compose(R.prop("value"), R.head)(vm.options.intervalTime)
            };

            vm.newUldSecurityConfig = {
                intervalTime: R.compose(R.prop("value"), R.head)(vm.options.intervalTime)
            };

            console.log(options);

            getAllSafeSetting();
        })

        var getAllSafeSetting = function () {
            ApiServer.getAllSafeSetting({
                params: {},
                success: function (res) {
                    console.log(res.data);
                    vm.boxList = res.data.box_types;
                },
                error: function (err) {
                    toastr.error(err.msg || "获取所有安全测试设置失败");
                }
            });
        };

        vm.resetSafeSetting = function (box, index) {
            if (!$scope.validationCheck(box, index)) {
                console.log("校验失败", index);
                return;
            }
            box.operation_threshold_min = 0;
            box.collision_threshold_min = 0;
            box.battery_threshold_max = 100;
            ApiServer.resetSafeSetting({
                params: {
                    id: box.id,
                    data: box
                },
                success: function (res) {
                    if (res.data.status == "OK") {
                        toastr.success(res.data.msg);
                        getAllSafeSetting()
                    } else {
                        toastr.error(res.data.msg);
                    }
                },
                error: function (err) {
                    toastr.error(err.msg ||"设置失败.");
                }
            });
        }

        function inputTransFunc(num) {
            return parseInt(num, 10)
        }

    }

})();
