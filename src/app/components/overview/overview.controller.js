/**
 * Created by guankai on 17/05/2017.
 */
(function () {
    'use strict';

    angular.module('smart_container').controller('OverviewController', OverviewController);

    /** @ngInject */
    function OverviewController($stateParams,ApiServer,toastr,$state,$timeout,$interval) {
        /* jshint validthis: true */
        var vm = this;


        var info = ApiServer.info();
        var roleType = info.role;
        vm.title = '物流动态';
        vm.containerlists = [];

    }

})();