/**
 * Created by guankai on 07/06/2017.
 */
(function () {
    'use strict';

    angular.module('smart_container').controller('RobotsController', RobotsController);

    /** @ngInject */
    function RobotsController(constdata, NetworkService, $stateParams, ApiServer, toastr, $state, $timeout, $interval, $scope, optionsTransFunc) {
        /* jshint validthis: true */
        const phase = ['zzagv', 'wrcc', 'zjzb', 'jxb', 'xxagv', 'wrcys'];
        const robotDesc = ['重载AGV运载', '无人叉车运载', '直角坐标机器人操作', '机械臂操作', '小型AGV运载', '无人车运输'];
        const posi = ['0%', '16.333%', '32.333%', '48.999%', '64.666%', '81.332%'];
        $scope.show = [];
        var vm = this;
        arrowSet('wrcys');

        var timer = $interval(function () {
            arrowSet(phase[Math.floor(Math.random()*5 + 1)]);
        },2000);

        $scope.$on("$destroy", function(){
            $interval.cancel(timer);
        });

        function arrowInit() {
            $("#robotUl li").each(function (index) {
                $(this).find("p").text(robotDesc[index]);
            })

        }


        function arrowSet(_phaseName) {
            arrowInit();
            var _phase = phase.indexOf(_phaseName);
            $scope.show = [];
            $("#robotUl li").removeClass("actived");
            $("#robotUl li").eq(_phase).prevAll().addClass('actived');
            $("#robotUl li").eq(_phase).find('p').empty();
            //处理arrow
            $(".arrow").find("span").text(robotDesc[_phase]);
            $(".arrow").css('left', posi[_phase]);
            for (var i = 0; i < phase.length; i++) {
                if (_phase == i){
                    $scope.show.push(true);
                }else{
                    $scope.show.push(false)
                }
            }

        }

    }


})();