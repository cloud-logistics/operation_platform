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
            info:info
        };
        return toast;

        function tpl(type,msg){
            var typeMenu = {
                "success":"success",
                "error":"error",
                "info":"info"
            };
            var html = '<div class="ngToast ngToast_' + typeMenu[type]  +' ngToast-bottom-left-' + toastsNum +'">'+
                            '<div class="ngToast-icon ngToast-icon-' + typeMenu[type] + '">'+
                                '<img src="images/icon_alert_' + typeMenu[type] +'.svg">'+
                            '</div>'+
                            '<div class="ngToast_text">'+ msg +
                            '</div>'+
                        '</div>';
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
    }
}());

