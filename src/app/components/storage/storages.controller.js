/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('airs').controller('StoragesController', StoragesController);

    /** @ngInject */
    function StoragesController($state,$log,$uibModal,ApiServer) {
        /* jshint validthis: true */
        var vm = this;

        vm.titles = ['仓库编号','类型','最大重量','毛重','尺寸','位置','状态','操作'];

        vm.items = [
            {ContainerNo:'a20174013243342323',Type:'type',MaxWeight:0,TareWeight:0,Measurement:0,Location:'北京',status:true,date:'2017-04-17'},
            {ContainerNo:'a20174013243342323',Type:'type',MaxWeight:0,TareWeight:0,Measurement:0,Location:'北京',status:true,date:'2017-04-17'},
            {ContainerNo:'a20174013243342323',Type:'type',MaxWeight:0,TareWeight:0,Measurement:0,Location:'北京',status:true,date:'2017-04-17'}
        ];

        vm.displayedCollection = [].concat(vm.items);



        vm.gotoDetail = gotoDetail;

        function gotoDetail(type,index) {
            if (type === 'new'){
                $state.go('app.goodstorage',{storageId:'new'});
            } else if (type === 'detail'){
                $state.go('app.goodstorage',{storageId:vm.items[index].ContainerNo});
            }
        }
        function deleteAction(index) {
            ApiServer.vehicleDelete(vm.items[index].ContainerNo,function (res) {

            },function (err) {

            })
        }

        function getDatas() {
            
        }
        

        //Model
        vm.tipsInfo = {title:'删除',content:'确定删除吗？'};
        vm.openAlert = function (size,index) {
            var modalInstance = $uibModal.open({
                templateUrl: 'myModalContent.html',
                size: size,
                controller:'ModalInstanceCtrl',
                resolve: {
                    tipsInfo: function () {
                        return vm.tipsInfo;
                    }
                }
            });
            modalInstance.result.then(function (param) {
                deleteAction(index);
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };




    }

})();
