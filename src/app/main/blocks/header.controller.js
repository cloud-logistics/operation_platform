/**
 * app main controller
 */

(function () {
    'use strict';

    angular.module('smart_container').controller('HeaderController', AsideController);

    /** @ngInject */
    function AsideController($state, ApiServer,$scope, toastr, $interval, constdata) {
        /* jshint validthis: true */
        var vm = this;

        vm.logoutAction = logoutAction;

        vm.messages = [];
        vm.title = '智能云箱';

        vm.jumpTo = function(url){
            $state.go(url);
        };

        var getMessage = function(){
            ApiServer.messageGetByUserId({
                success: function (res) {
                    console.log(res.data);
                    var dict = {
                        "alarm_count":"告警信息",
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
                    console.log("获取消息失败.",err);
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
            ApiServer.logoutAction();
        }
    }
})();