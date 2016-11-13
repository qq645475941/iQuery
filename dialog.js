(function (window) {

    /***
     * js写的自己的组件
     * @param cfg
     * @constructor
     */
    function Dialog(cfg) {

        this.init(cfg);

    }

    /***
     * 定义一些全局常量
     * @type {number}
     */
    
    Dialog.NONE = 1;
    Dialog.CREATED = 2;//dom 请求创建好了
    Dialog.OPENED = 3;//打开状态
    Dialog.CLOSED = 4;//dom 请求创建好了
    Dialog.DESTORYED = 5;//dom 请求创建好了

    Dialog.prototype = {
        init: function (cfg) {
            var _this = this;

            //如果cfg没穿,生成一个空对象。
            cfg || (cfg = {});
            cfg.templateUrl || (cfg.templateUrl = 'res/template/dialog.html')
            cfg.okFn = cfg.okFn || (function (e) {
                    console.log(['确定 默认处理函数'])

                })
            cfg.noFn = cfg.noFn || (function (e) {
                    console.log(['取消 默认处理函数'])
                    _this.close();

                })
            this.cfg = cfg;


            this.readyState = '1';
            //绑定事件
            this.bindEvent();

        },

        bindEvent: function () {
            var _this = this;
            this.dom && dom.on({
                did: this.dom, type:'click',callback: function (e) {
                    var target = e.target;
                    var did = target.getAttribute('data-id');
                    if (did == 'ok') {
                        _this.cfg.okFn.call(null, _this);
                    }
                    if (did == 'no') {
                        _this.cfg.noFn.call(null, _this);
                    }
                    e.stopPropagation();
                }
            })
        },
        create: function () {
            var _this = this;
            net.get({
                url: _this.cfg.templateUrl, callback: function (res) {
                    var resEle = dom.html(res);
                    _this.dom = resEle;
                    document.body.appendChild(resEle);
                    (_this.readyState == Dialog.OPENED) && (
                        _this.bindEvent(),
                            _this.open()
                    );
                }
            });
        },
        open: function () {
            this.readyState = Dialog.OPENED;
            this.dom && (this.dom.style.display = 'block');
        },
        close: function () {
            this.dom.style.display = 'none';
        },
        destory: function () {
        }

    }

    window.Dialog = Dialog;

}(window))