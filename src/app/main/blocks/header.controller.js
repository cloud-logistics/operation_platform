/**
 * app main controller
 */

(function () {
    'use strict';

    angular.module('smart_container').controller('HeaderController', AsideController);

    /** @ngInject */
    function AsideController($state, ApiServer,$scope, toastr, $interval,StorageService, constdata,$timeout) {
        /* jshint validthis: true */
        var vm = this;

        vm.logoutAction = logoutAction;

        vm.infomation = {
            username : "管理员"
        };

        vm.messages = [];
        vm.title = '智能云箱';

        vm.jumpTo = function(url){
            $state.go(url);
        };
        $scope.switchNav = function(flag){
            setTimeout(function(){
                $(".nav").find("li").removeClass("active")
            },10);
            $scope.$emit("mapResize");
        };
        var getMessage = function(){
            ApiServer.messageGetByUserId({
                success: function (res) {
                    console.log(res.data);
                    var dict = {
                        "alarm_count":"警告信息",
                        "undispach_count":"调度信息"
                    };
                    var obj = [
                        {
                            name:dict['alarm_count'],
                            count:res.data['alarm_count'],
                            url:"app.alert"
                        },
                        {
                            name:dict['undispach_count'],
                            count:res.data['undispach_count'],
                            url:"app.prediction"
                        }
                    ];
                    vm.totalMessage = res.data.message_count;
                    vm.messages = obj;
                },
                error: function (err) {
                    toastr.error(err.msg ||"获取消息失败.",err);
                }
            });
        };

        getMessage();
        var timer = $interval(function(){
            getMessage();
        },constdata.refreshInterval);

        $scope.$on("$destroy", function(){
            $interval.cancel(timer);
        });

        function logoutAction() {
            var authorizationKey = constdata.token;
            var userInfo = constdata.informationKey;

            StorageService.clear(authorizationKey);
            StorageService.clear(userInfo);
            StorageService.clear(constdata.token);
            $state.go('access.signin');
        }
    }
})();
