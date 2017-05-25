/**
 * Created by guankai on 22/05/2017.
 */
(function () {
    'use strict';

    angular.module('smart_container').controller('BasicinfoController', BasicinfoController);

    /** @ngInject */
    function BasicinfoController(constdata, NetworkService, $stateParams, ApiServer, toastr, $state, $timeout, $interval,$scope) {
        /* jshint validthis: true */
        var vm = this;

        vm.title = '报警监控';
        vm.containerlist = [];
        vm.queryParams = {}

        getBasicInfo();

        vm.getBasicInfo = getBasicInfo
        
        function getBasicInfo () {
            ApiServer.getBasicInfo(vm.queryParams, function (response) {
                console.log(vm.queryParams);
                vm.containerlist = response.data.basicInfo
                console.log(vm.containerlist);
            },function (err) {
                console.log("Get ContainerOverview Info Failed", err);
            });
        }

    }

})();