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

        var setMsg = function(min,max,index,key,isOldThan0){
            var flag;
            if(min >= max){
                flag = false;
                vm.boxList[index][key] = "前者必须小于后者";
                vm.boxList[index][key.replace("msg","class")] = "invalida-area";
            }else{
                flag = true;
                vm.boxList[index][key] = "";
                vm.boxList[index][key.replace("msg","class")] = "";
            }
            return flag;
        };

        $scope.validationCheck = function(item,index){
            var flag = true;
            if(item.interval_time > 200 || item.interval_time < 0){
                vm.boxList[index].interval_time_msg = "只能输入0-200之间的整数";
                flag = false;
                vm.boxList[index].interval_time_class = "invalida-area";
            }else{
                vm.boxList[index].interval_time_msg = "";
                vm.boxList[index].interval_time_class = !(item.interval_time)&&(item.interval_time != 0) ? " areaRequire" : "";
            }
            if(item.operation_threshold_min < 0){
                vm.boxList[index].operation_min_little_than_0_msg = "最小开关门数必须大于0";
                flag = false;
                vm.boxList[index].operation_min_little_than_0_class = " invalida-area ";
            }else{
                vm.boxList[index].operation_min_little_than_0_msg = "";
                vm.boxList[index].operation_min_little_than_0_class = "";
            }
            if(item.collision_threshold_min < 0){
                vm.boxList[index].collision_min_little_than_0_msg = "最小碰撞次数必须大于0";
                flag = false;
                vm.boxList[index].collision_min_little_than_0_class = " invalida-area ";
            }else{
                vm.boxList[index].collision_min_little_than_0_msg = "";
                vm.boxList[index].collision_min_little_than_0_class = "";
            }
            var menu = [
                "temperature_threshold_min",
                "humidity_threshold_min",
                "operation_threshold_min",
                "collision_threshold_min",
                "battery_threshold_min"
            ];
            for(var s = 0,len = menu.length;s < len;s++){
                flag = setMsg(item[menu[s]],
                        item[menu[s].replace("min","max")],
                        index,menu[s].replace("min",'msg')) && flag;
            }
            var menu2 = menu.concat(_.map(menu,function(item){
                return item.replace('min','max')
            }));
            for(var s = 0,len = menu2.length;s < len;s++){
                if(!(item[menu2[s]]) && (item[menu2[s]] != 0)){
                    flag = false;
                    item[menu2[s] + '_class'] = " areaRequire";
                }else{
                    item[menu2[s] + '_class'] = " ";
                }
            }
            console.log("box = ",item);
            return flag;
        };

        ApiServer.getOptions(requiredOptions, function(options) {
            vm.options = options

            transformations = {
                intervalTime: optionsTransFunc(vm.options.intervalTime),
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

            vm.newNormalSecurityConfig = {
                intervalTime : R.compose(R.prop("value"),R.head)(vm.options.intervalTime)
            };

            vm.newUldSecurityConfig = {
                intervalTime : R.compose(R.prop("value"),R.head)(vm.options.intervalTime)
            };

            console.log(options);

            getAllSafeSetting();
        })

        var getAllSafeSetting = function(){
            ApiServer.getAllSafeSetting({
                params:{},
                success: function (res) {
                    console.log(res.data);
                    vm.boxList = res.data.box_types;
                    _.map(vm.boxList,function(item){
                        for(var s in item){
                            item[s] = parseFloat(item[s]);
                        }
                    })
                },
                error: function (err) {
                    console.log("获取所有安全测试设置失败", err);
                }
            });
        };

        vm.resetSafeSetting = function(box,index){
            console.log()

            if(!$scope.validationCheck(box,index)){
                console.log("校验失败",index);
                return;
            }
            ApiServer.resetSafeSetting({
                params:{
                    id:box.id,
                    data:box
                },
                success: function (res) {
                    if(res.data.status == "OK"){
                        toastr.success(res.data.msg);
                        getAllSafeSetting()
                    }else{
                        toastr.error(res.data.msg);
                    }
                },
                error: function (err) {
                    toastr.error("设置失败");
                }
            });
        }

        function inputTransFunc (num) {
            return parseInt(num, 10)
        }

    }

})();