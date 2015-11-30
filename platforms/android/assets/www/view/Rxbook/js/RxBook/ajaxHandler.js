var sn = "/";
var RxBookAjax = {
    requestInvoke: function (ctn, actn, parms,method,successcallback, failurecallback) {
        var datapara = "";
        
        if (parms != null) {
            for (var j = 0; j < parms.length; j++) {
                var value = parms[j].value;
                if (parms[j].type == "JSON") {
                    value = JSON.stringify(value);
                }
                
                if (j == 0) {
                    datapara = parms[j].name + "=" + value;
                }
                else {
                    datapara += "&" + parms[j].name + "=" + value;
                }
            }
        }
        var aurl = sn + ctn + "/" + actn;
        $.ajax({
            type: method,
            url: aurl,
            data: datapara,
            async: true,
            success: function (response) {
                
                successcallback(response);
            },
            error: function (e) {
                failurecallback(e);
            }
        });
    }
}
