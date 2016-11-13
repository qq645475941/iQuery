(function (win) {
        var navsSliders = document.querySelector('.navs-sliders');
        var tabReg = document.querySelector('.tab-reg');
        var tabLogin = document.querySelector('.tab-login');
        var signupFlow = document.querySelector('.signup-flow');
        var signinFlow = document.querySelector('.signin-flow');


        navsSliders.addEventListener('click', function (e) {
            var target = e.target;
            var className = target.getAttribute('class');

            if (/tab-reg/.test(className)) {
                signupFlow.style.display = 'block';
                addCls.call(tabReg, 'active');
                removeCls.call(tabLogin, 'active');
                signinFlow.style.display = 'none';
            }

            else if (/tab-login/.test(className)) {

                signinFlow.style.display = 'block';
                addCls.call(tabLogin, 'active');
                removeCls.call(tabReg, 'active');
                signupFlow.style.display = 'none';
            }
            console.log(e.target);
        })

        /****************************************************************************************
         *
         *公用代码
         *
         *****************************************************************************************/



        function addCls(className) {
            if (hasCls.call(this, className)) {
                return;
            }
            var clsName = this.getAttribute('class');
            clsName += ' ' + className;
            this.setAttribute('class', clsName);
        }

        function hasCls(className) {
            var clsName = this.getAttribute('class');
            var regStr = '\\b' + className + '\\b';
            var clsReg = new RegExp(regStr, 'i');

            return clsReg.test(clsName);
        }

        function toggleCls(clsName) {
            hasCls(clsName) ? removeCls(clsName) : addCls(clsName);
        }


        function removeCls(clsName) {
            var _clsName = this.getAttribute('class');
            var regStr = '\\b' + clsName + '\\b';
            var clsReg = new RegExp(regStr, 'i');
            _clsName = _clsName.replace(clsReg, '');
            this.setAttribute('class', _clsName);
        }


        //register
        function ajax(cfg) {
            var xhr = new XMLHttpRequest();
            var name;

            xhr.open(cfg.method, cfg.url)
            if (cfg.headers) {
                for (name in cfg.headers) {
                    var header = cfg.headers[name];
                    xhr.setRequestHeader(name, header)
                }
            }
            xhr.send(cfg.data);
            xhr.onreadystatechange = function () {
                if (xhr.readyState == xhr.DONE) {
                    try {
                        var json = JSON.parse(xhr.response);
                        cfg.callback(json);
                    } catch (e) {
                        cfg.callback(xhr.response);
                    }
                }
            }
        }


        function param(json) {
            var name, paramArr = [];
            for (name in json) {
                paramArr.push(name + '=' + json[name]);
            }

            return paramArr.join('&')
        }

        function getByDId(did, parent) {
            parent = parent ? document.querySelector('[data-id=' + parent + ']') : document;
            return parent.querySelector('[data-id=' + did + ']');
        }


        

        function eleHasSelector(ele, selector) {
            var parent = ele.parentElement;
            var children = parent.querySelectorAll(selector);
            var result = false;
            children.length && forEach(children, function (child, i) {
                result = child.isEqualNode(ele)
                return true;
            })
            return result;
        }

        function on(eventCfg) {
            var ele, proxy,
                type = eventCfg.type,
                did = eventCfg.did,
                callback = eventCfg.callback;

            if (eventCfg.proxy) {
                proxy = getByDId(eventCfg.proxy);
                proxy.addEventListener(type, function (e) {
                    var target = e.target;
                    if (eleHasSelector(target, did)) {
                        callback.call(target, e);
                    }
                });
            } else {
                ele = getByDId(did);

                ele.addEventListener(type, callback, false);
            }
        }

        function ready(callback) {
            document.onreadystatechange = function () {
                if (document.readyState == 'complete') {
                    callback();
                }
            }
        }

        /****************************************************************************************
         *
         *逻辑代码
         *
         *****************************************************************************************/


        function reg() {

            var name = getByDId('name', 'signup');
            var email = getByDId('email', 'signup');
            var pwd = getByDId('pwd', 'signup');
            var verifyCode = getByDId('verifyCode', 'signup');

            var data = {name: name.value, email: email.value, pwd: pwd.value, verifyCode: verifyCode.value};
            ajax({
                method: 'post',
                url: '/signup',
                headers: {'content-type': 'application/x-www-form-urlencoded'},
                data: param(data),
                callback: function (res) {
                    switch (+res.code) {
                        case 0:

                            ;
                            break;
                    }
                    console.log(res);
                }
            });


        }


        function verifyForm(opts) {
            var isVerifyed = true;
            forEach(opts, function (opt, i) {
                // opt.dom = getByDId(opt.id);
                var val = opt.dom.value;

                forEach(opt.verifies, function (verify) {
                    var reg = new RegExp(verify.source, verify.wildCard || "");
                    if (reg.test(val)) {
                        opt.callback(verify.msg);
                        return true;
                    }
                })
            })
        }

        function markErrorLabel( dom, msg ){
            $(dom).after().isEmpty()&& $(dom).after('<label class="error msg">' + msg + '</label>')
        }

        function login() {
            var email = getByDId('email', 'signin');
            var pwd = getByDId('pwd', 'signin');
            var data = {email: email.value, pwd: pwd.value};

            var verifyOptions = [
                    {
                        dom: email,
                        verifies: [
                            {
                                source: '^\\s*$', msg: '请填写邮箱'
                            },
                            {
                                source: '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}$', msg: '请填写正确的邮箱'
                            }
                        ],
                        callback: function (verifyResult) {
                            $(this.dom).after().isEmpty() && $(this.dom).after('<label class="error msg">' + verifyResult + '</label>')
                            console.log(verifyResult);
                        }
                    },
                    {
                        dom: pwd,
                        verifies: [
                            {
                                source: '^\\s*$', msg: '请填写密码'
                            },
                            {
                                source: '^\\w{6}$', msg: '请填写正确的密码'
                            }
                        ],
                        callback: function (verifyResult) {
                            markErrorLabel(this.dom, verifyResult)
                            console.log(verifyResult);
                        }
                    }
                ]
                ;
            verifyForm(verifyOptions);


            ajax({
                method: 'post',
                url: '/signin',
                headers: {'content-type': 'application/x-www-form-urlencoded'},
                data: param(data),
                callback: function (res) {
                    //res = JSON.parse(res);
                    if (res.code == 200) {
                        location.href = res.refer || '/';
                    }
                    if(+res.code == 2){
                        markErrorLabel( pwd, res.msg)
                    }
                    if(+res.code == 4){
                        markErrorLabel( email, res.msg)
                    }
                    console.log(res);
                }
            })
        }


        ready(function () {

            //注册
            on({
                did: 'signBtn', type: 'click', callback: function (e) {
                    reg();
                    e.preventDefault();
                }
            })

            //登陆
            on({
                did: 'signinBtn', type: 'click', callback: function (e) {
                    login();
                    e.preventDefault();
                }
            })

            on({
                did:'input',
                type:'click',
                proxy:'sign-view',
                callback:function( e ){
                    $(this).after().isEmpty() || $(this).after().remove();
                }
            })

            var img = document.querySelector('[data-src]');
            var src = img.getAttribute('data-src');

            function setVCode() {
                ajax({
                    url: src, method: 'get', callback: function (res) {
                        img.src = res;
                    }
                })
            }

            setVCode();

            on({
                did: 'vCode', type: 'click', callback: function () {
                    setVCode();
                }
            })

        })



        


    }
    (window)
)