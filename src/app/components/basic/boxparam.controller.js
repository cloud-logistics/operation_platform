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
                },
                error: function (err) {
                    console.log("获取所有安全测试设置失败", err);
                }
            });
        };

        vm.resetSafeSetting = function(box){
            console.log()
            ApiServer.resetSafeSetting({
                params:{
                    id:box.id,
                    data:box
                },
                success: function (res) {
                    if(res.data.status == "OK"){
                        toastr.success(res.data.msg);
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