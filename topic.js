/**
 * Created by qingyun on 16/9/7.
 */
var main=dom.getByDId('main');
var routerCfg={
    'topic':{
        templateUrl:'res/template/topic.html',
        dataUrl:'api/topic',
        fn:function () {
            console.log("topic");
            net.get({
                url:this.templateUrl,callback:function (res) {
                    main.innerHTML=res;
                    var item=dom.getByDId('item');
                    item.remove();
                    var _this=this;
                    net.get({
                        url:this.dataUrl,callback:function (res) {
                            console.log(res);
                           var resArr=JSON.parse(res);
                            resArr.forEach(function (ele,i) {
                                var itemtemplate=item.cloneNode(true);
                                itemtemplate.innerHTML=itemtemplate.innerHTML.replace(/\{(.*)\}/g,function (a,b) {
                                    if(ele[b]){
                                        return ele[b];
                                    }
                                    console.log([a,b]);

                                });
                                main.appendChild(itemtemplate);
                            })
                        }
                    })
                }.bind(this)
            })
        }
    },
    'userInfo':{
        templateUrl:'res/template/crop.html',
        dataUrl:'api/topic',
        fn:function () {
            console.log("userInfo");
            net.get({
                url:this.templateUrl,callback:function (res) {
                    main.innerHTML=res;
                    // var item=dom.getByDId('item');
                    // item.remove();
                }.bind(this)
            })
        }
    }
};

window.onhashchange=function (e) {
    var result=/#(.*)/.exec(e.newURL);
    var hash=result[1];
    hash&&routerCfg[hash]&&routerCfg[hash].fn();
};

