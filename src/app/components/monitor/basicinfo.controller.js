/**
 * Created by guankai on 22/05/2017.
 */
(function () {
    'use strict';

    angular.module('smart_container').controller('BasicinfoController', BasicinfoController);

    /** @ngInject */
    function BasicinfoController(constdata, NetworkService, $stateParams, ApiServer, toastr, $state, $timeout, $interval,$scope, optionsTransFunc) {
        /* jshint validthis: true */
        var vm = this;

        vm.title = '报警监控';
        vm.containerlist = [];
        vm.queryParams = $stateParams

        var transformations = undefined;


        var timer = $interval(function(){
            getBasicInfo();
        },5000, 500);

        $scope.$on("$destroy", function(){
            $interval.cancel(timer);
        });

        var requiredOptions = [
                    "containerType",
                    "carrier",
                    "factory",
                    "factoryLocation"
                ]

        ApiServer.getOptions(requiredOptions, function(options) {
            vm.options = options

            transformations = {
                containerType: optionsTransFunc(vm.options.containerType),
                carrier: optionsTransFunc(vm.options.carrier),
                factory: optionsTransFunc(vm.options.factory),
                factoryLocation: optionsTransFunc(vm.options.factoryLocation),
                startTime: R.compose(R.toString, Date.parse),
                endTime: R.compose(R.toString, Date.parse)
            }

            vm.queryParams = {
                containerType : R.compose(R.prop("value"),R.head)(vm.options.containerType),
                carrier : R.compose(R.prop("value"),R.head)(vm.options.carrier),
                factory : R.compose(R.prop("value"),R.head)(vm.options.factory),
                factoryLocation : R.compose(R.prop("value"),R.head)(vm.options.factoryLocation),
                startTime: moment(new Date()),
                endTime: moment(new Date())
            }

            getBasicInfo();
        })

        vm.getBasicInfo = getBasicInfo
        
        function getBasicInfo () {
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