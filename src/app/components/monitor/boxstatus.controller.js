/**
 * Created by guankai on 22/05/2017.
 */
(function () {
    'use strict';

    angular.module('smart_container').controller('BoxstatusController', BoxstatusController);

    /** @ngInject */
    function BoxstatusController(constdata, NetworkService, MapService, $stateParams, ApiServer, toastr, $state, $timeout, $interval,$scope, optionsTransFunc) {
        /* jshint validthis: true */
        var vm = this;

        vm.title = '云箱状态汇总';
        vm.containerlist = [];
        vm.queryParams = $stateParams
        vm.getBoxStatus = getBoxStatus

        var transformations = undefined;

        var requiredOptions = [
                    "containerType",
                    "location",
                    "alertLevel",
                    "alertType",
                    "alertCode",
                    "carrier"
                ]

        ApiServer.getOptions(requiredOptions, function(options) {
            vm.options = options

            vm.options.alertCode = R.map(function(alertCode){
                return {
                    id: alertCode.id,
                    value: alertCode.value.toString()
                }
            })(vm.options.alertCode)
            console.log(vm.options);

            transformations = {
                containerType: optionsTransFunc(vm.options.containerType),
                location: optionsTransFunc(vm.options.location),
                alertLevel: optionsTransFunc(vm.options.alertLevel),
                alertType: optionsTransFunc(vm.options.alertType),
                alertCode: optionsTransFunc(vm.options.alertCode, 10),
                carrier: optionsTransFunc(vm.options.carrier)
            }

            vm.queryParams = {
                containerType : R.compose(R.prop("value"),R.head)(vm.options.containerType),
                location : R.compose(R.prop("value"),R.head)(vm.options.location),
                alertLevel : R.compose(R.prop("value"),R.head)(vm.options.alertLevel),
                alertType : R.compose(R.prop("value"),R.head)(vm.options.alertType),
                alertCode : R.compose(R.prop("value"),R.head)(vm.options.alertCode),
                carrier : R.compose(R.prop("value"),R.head)(vm.options.carrier),
            }

            console.log(vm.queryParams);

            getBoxStatus();
        })

        function getBoxStatus () {
            var queryParams = R.evolve(transformations)(vm.queryParams)
            console.log(queryParams);
            ApiServer.getBoxStatus(queryParams, function (response) {
                vm.containerlist = response.data.boxStatus
            },function (err) {
                console.log("Get ContainerOverview Info Failed", err);
            });
        }
    }

})();
