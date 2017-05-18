/**
 * Created by guankai on 17/05/2017.
 */
(function () {
    'use strict';

    angular.module('smart_container').controller('MonitorController', MonitorController);

    /** @ngInject */
    function MonitorController($stateParams,ApiServer,toastr,$state,$timeout,$interval) {
        /* jshint validthis: true */
        var vm = this;


        var info = ApiServer.info();
        var roleType = info.role;
        vm.title = '云箱监控';
        vm.containerlists = [];

    }

})();