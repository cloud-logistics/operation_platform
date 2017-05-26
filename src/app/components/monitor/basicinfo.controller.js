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
            var transformations = {
                startTime: R.compose(R.toString, Date.parse),
                endTime: R.compose(R.toString, Date.parse)
            };
            var queryParams = R.evolve(transformations)(vm.queryParams)

            console.log(queryParams);

            ApiServer.getBasicInfo(queryParams, function (response) {
                // console.log(Date.parse(vm.queryParams.startTime).toString());
                vm.containerlist = response.data.basicInfo
                console.log(vm.containerlist);
            },function (err) {
                console.log("Get ContainerOverview Info Failed", err);
            });
        }

    }

})();