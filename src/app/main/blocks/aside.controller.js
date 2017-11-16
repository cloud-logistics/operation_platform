/**
 * app main controller
 */

(function () {
    'use strict';

    angular.module('smart_container').controller('AsideController', AsideController);

    /** @ngInject */
    function AsideController($state, ApiServer,$scope, toastr, StorageService, constdata) {
        /* jshint validthis: true */
        var vm = this;
        var height = document.body.clientHeight + 'px';
        vm.navStyle = {'height': height};

        $scope.switchNav = function(flag){

            toastr.success(flag);
            setTimeout(function(){
                $(".nav").find("li").removeClass("active")
            },10)
        };

        vm.logoutAction = logoutAction;

        vm.messages = [];
        vm.title = '智能云箱';

        vm.role = "carrier" || StorageService.get(constdata.informationKey).role;

        vm.jumpTo = function(url){
            $state.go(url);
        };

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

        function logoutAction() {
            ApiServer.logoutAction();
        }
    }
})();
