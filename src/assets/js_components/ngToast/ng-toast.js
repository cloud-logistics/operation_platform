/**
 * Created by xianZJ on 2017/12/5.
 */
(function(){
    angular.module('toastr',[])
        .factory('toastr',toastr);

    toastr.$inject = ['$animate', '$rootScope','$q'];
    function toastr($animate,$rootScope,$q){
        var containerDefer = $q.defer();
        var toastsNum = "0";
        var toast = {
            error:error,
            success:success,
            info:info,
            noDataFound:noDataFound
        };
        return toast;

        function tpl(type,msg){
            var typeMenu = {
                "success":"success",
                "error":"error",
                "info":"info",
                "noDataFound":"noDataFound"
            };
            if(type == "noDataFound"){
                var html = '<div class="ngToast ngToast_noDataFound">'+
                    '<div class="ngToast_noDataFound_icon">'+
                        '<img src="images/img_other_nothing_01.png">'+
                    '</div>'+
                    '<div class="ngToast_noDataFound_text">'+
                        '<span class="ngToast_noDataFound_text1">抱歉,没有找到...</span>'+
                        '<span class="ngToast_noDataFound_text2">换个关键词试试吧</span>'+
                    '</div>'+
                '</div>';
            }else{
                var html = '<div class="ngToast ngToast_' + typeMenu[type]  +' ngToast-bottom-left-' + toastsNum +'">'+
                                '<div class="ngToast-icon ngToast-icon-' + typeMenu[type] + '">'+
                                '<img src="images/icon_alert_' + typeMenu[type] +'.svg">'+
                                '</div>'+
                                '<div class="ngToast_text">'+ msg +
                                '</div>'+
                            '</div>';     
            }
           
            toastsNum++;
            console.log(html)
            return html;
        }
        function remove(id){
            var child = document.getElementById(id) ;
            if(child){
                toastsNum--;
                child.parentNode.removeChild(child);
            }
        }

        function success(msg){
            container = angular.element(tpl('success',msg));
            var id = "ngToastSuccess" + new Date().getTime();
            container.attr('id', id);
            var target = angular.element(document.querySelector("body"));
            if ( ! target || ! target.length) {
                throw 'Target for toasts doesn\'t exist';
            }

            $animate.enter(container, target).then(function() {
                setTimeout(function(){
                    $animate.leave(document.getElementById(id))
                    remove(id);
                },3000)
            });
        }
        function error(msg){
            container = angular.element(tpl('error',msg));
            var id = "ngToastError" + new Date().getTime();
            container.attr('id', id);
            var target = angular.element(document.querySelector("body"));
            if ( ! target || ! target.length) {
                throw 'Target for toasts doesn\'t exist';
            }
            $animate.enter(container, target).then(function() {
                var hidden =function(){
                    $animate.leave(document.getElementById(id))
                    remove(id);
                };
                setTimeout(hidden,3000)
            });
        }
        function info(msg){
            container = angular.element(tpl('info',msg));
            var id = "ngToastInfo" + new Date().getTime();
            container.attr('id', id);
            var target = angular.element(document.querySelector("body"));

            if ( ! target || ! target.length) {
                throw 'Target for toasts doesn\'t exist';
            }

            $animate.enter(container, target).then(function() {
                //var hidden =  ;
                setTimeout(function(){
                    console.log("info---")
                    $animate.leave(document.getElementById(id));
                    remove(id);
                },3000)
            });
        }
        function noDataFound(msg){
            container = angular.element(tpl('noDataFound',msg));
            var id = "ngToastNoDataFound" + new Date().getTime();
            container.attr('id', id);
            var target = angular.element(document.querySelector("body"));

            if ( ! target || ! target.length) {
                throw 'Target for toasts doesn\'t exist';
            }

            $animate.enter(container, target).then(function() {
                //var hidden =  ;
                setTimeout(function(){
                    console.log("info---")
                    $animate.leave(document.getElementById(id));
                    remove(id);
                },3000)
            });
        }
    }
}());

