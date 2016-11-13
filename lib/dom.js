(function(window){
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
            ele = typeof did =='string'? getByDId(did):did;

            ele.addEventListener(type, callback, false);
        }
    }

    function getByDId(did, parent) {
        parent = parent ? document.querySelector('[data-id=' + parent + ']') : document;
        return parent.querySelector('[data-id=' + did + ']');
    }

    function html(str){
        var div = document.createElement('div');
        div.innerHTML = str;
        return div.children[0];
    }
    window.dom ={on:on, getByDId:getByDId, html:html}
}(window))