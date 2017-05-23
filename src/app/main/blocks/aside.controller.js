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

        vm.messages = [];
        vm.roleType = "regularclient";
        vm.title = '智能云箱';

        function clearAllMessageAction() {
            vm.messages = [];
            for (var i = 0; i < vm.messages.length; i++){
                var msg = vm.messages[i];
                ApiServer.messageDelete(msg.messageid);
            }
        }
        
        ApiServer.messageGetByUserId(function (res) {
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
