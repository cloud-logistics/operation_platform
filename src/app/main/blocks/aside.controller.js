/**
 * app main controller
 */

(function () {
    'use strict';

    angular.module('smart_container').controller('AsideController', AsideController);

    /** @ngInject */
    function AsideController(ApiServer,$state) {
        /* jshint validthis: true */
        var vm = this;
        var info = ApiServer.info();

        var height = document.body.clientHeight + 'px';
        vm.navStyle = {'height':height};
        
        vm.clearAllMessageAction = clearAllMessageAction;
        vm.logoutAction = logoutAction;

        vm.title = 'IntelligenceContainerBlock';
        vm.messages = [];
        vm.roleType = ApiServer.roleType();
        if (vm.roleType === 'regularclient'){
            vm.title = '智能云箱';
        }else if (vm.roleType === 'cargoagent'){
            vm.title = '智能云箱';
        }else if (vm.roleType === 'carrier'){
            vm.title = '智能云箱';
        }else if (vm.roleType === 'shipper'){
            vm.title = '智能云箱';
        }

        vm.infomation = ApiServer.info();
        
        function clearAllMessageAction() {
            vm.messages = [];
            for (var i = 0; i < vm.messages.length; i++){
                var msg = vm.messages[i];
                ApiServer.messageDelete(msg.messageid);
            }
        }
        
        ApiServer.messageGetByUserId(info.id,function (res) {
            vm.messages = res.data;
            if (vm.messages.length > 5){
                vm.messages = vm.messages.slice(0,5);
            }
        },function (err) {

        })
        
        function logoutAction() {
            ApiServer.logoutAction();
        }
        
        


    }
})();
