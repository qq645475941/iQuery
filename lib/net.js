(function(window){

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

    function get( cfg ){
        cfg.method = 'GET';
        ajax(cfg);
    }
    window.net ={ajax:ajax, get:get}
}(window))