/**
 * Created by guankai on 02/06/2017.
 */
(function () {
    'use strict';

    angular.module('smart_container').controller('BoxParamController', BoxParamController);

    /** @ngInject */
    function BoxParamController(constdata, NetworkService, $stateParams, ApiServer, toastr, $state, $timeout, $interval, $scope, optionsTransFunc) {
        /* jshint validthis: true */
        var vm = this;

        vm.title = '报警监控';
        vm.reports = [];
        vm.queryParams = {}


        vm.newSecurityConfig = {};
        vm.newNormalSecurityConfig = {};
        vm.newUldSecurityConfig = {};

        vm.updateNormalContainerSecurityConfigPost = updateNormalContainerSecurityConfigPost;
        vm.updateUldSecurityConfigPost = updateUldSecurityConfigPost;

        vm.options = {};
        var transformations = undefined;

        var requiredOptions = [
                "intervalTime"
            ];

        ApiServer.getOptions(requiredOptions, function(options) {
            vm.options = options

            transformations = {
                intervalTime: optionsTransFunc(vm.options.intervalTime),
                temperature : {
                    min: inputTransFunc,
                    max: inputTransFunc
                },
                humidity : {
                    min: inputTransFunc,
                    max: inputTransFunc
                },
                collision : {
                    min: inputTransFunc,
                    max: inputTransFunc
                },
                battery : {
                    min: inputTransFunc,
                    max: inputTransFunc
                },
                operation : {
                    min: inputTransFunc,
                    max: inputTransFunc
                }
            };

            vm.newNormalSecurityConfig = {
                intervalTime : R.compose(R.prop("value"),R.head)(vm.options.intervalTime)
            };

            vm.newUldSecurityConfig = {
                intervalTime : R.compose(R.prop("value"),R.head)(vm.options.intervalTime)
            };

            console.log(options);
        })


        function updateNormalContainerSecurityConfigPost () {
            var config = R.evolve(transformations)(vm.newNormalSecurityConfig)

            console.log(config);

            ApiServer.updateSecurityConfig(config, function (response) {
                console.log(response.data);
            },function (err) {
                console.log("Get ContainerOverview Info Failed", err);
            });
        }

        function updateUldSecurityConfigPost () {
            var config = R.evolve(transformations)(vm.newUldSecurityConfig)

            console.log(config);

            ApiServer.updateSecurityConfig(config, function (response) {
                console.log(response.data);
            },function (err) {
                console.log("Get ContainerOverview Info Failed", err);
            });
        }

        function inputTransFunc (num) {
            return parseInt(num, 10)
        }

    }

})();