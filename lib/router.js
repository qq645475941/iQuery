/**
 * Created by qingyun on 16/7/18.
 */
(function(win) {


    var lastComponent = null;
    win.onpopstate = function (state) {
        var pathname = location.pathname;
        var Cfgs = Router.cfg||{};
        var componentName = Cfgs[pathname];

        var component = framework.component.get( componentName );

        if( component ){
            lastComponent&&lastComponent.destory();
            component.compile(Router.container);
            lastComponent = component;
            //framework.compile(Router.container,cfg.templateUrl,cfg.scope);
        }
    }

    var Router = win.Router = {};
    Router.initCfg = function(){

    }

    Router.go = function(url,title,params){
        history.pushState( params||{}, title||'', url);
        win.onpopstate();
    }

    util.event.ready(function(){
        win.onpopstate();
    })
    win.Router = Router;
}(window))
