/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('airs').controller('orderGoodCarController', orderGoodCarController);

    /** @ngInject */
    function orderGoodCarController($log,toastr,$state,ApiServer,$stateParams,$timeout) {
        /* jshint validthis: true */
        var vm = this;

        var info = ApiServer.info();
        var orderId = $stateParams.orderId;
        vm.companys = [];
        vm.orderInfo = {ownerid:info.id,carrierid:'',orderid:orderId,cargoagentid:info.id,startat:''};

        vm.submitAction = submitAction;


        function submitAction(type) {
            if (type === 'confirm'){
                console.log(vm.orderInfo);
                ApiServer.goodOrderCar(vm.orderInfo,function (res) {
                    toastr.success('操作成功');
                    $timeout(function () {
                        $state.go('app.goodorderadd',{orderId:orderId});
                    },2000);
                },function (err) {
                    var errInfo = '操作失败：' + err.statusText + ' (' + err.status +')';
                    toastr.error(errInfo);
                })
            }else{
                history.back();
            }
        }

        function getCompanyDatas() {
            ApiServer.userGetByRoleType('carrier',function (res) {
                vm.companys = res.data;
                console.log(vm.companys);
                vm.orderInfo.carrierid = vm.companys[0].id;
            },function (err) {
                var errInfo = '获取数据失败：' + err.statusText + ' (' + err.status +')';
                toastr.error(errInfo);
            })
        }

        getCompanyDatas();


    }

})();
