//var AjaxGlobalHandler = {
//    Initiate: function (options) {
//      $.ajaxSetup({ cache: false });

//        // Ajax events fire in following order
//      $(document).ajaxError(function (e, xhr, opts) {
//            if (options.SessionOut.StatusCode == xhr.status) {
//               document.location.replace(options.SessionOut.RedirectUrl);
//                return;
//            }
//        })
//    }
//};

var AjaxGlobalHandler = {
    Initiate: function (options) {
        $.ajaxSetup({ cache: false });

        // Ajax events fire in following order
        $(document).ajaxStart(function () {
            
        }).ajaxSend(function (e, xhr, opts) {
        }).ajaxError(function (e, xhr, opts) {
            if ("590"== xhr.status) {
                window.location.href = "../Home/SessionExpiry/"
                return;
            }

        }).ajaxSuccess(function (e, xhr, opts) {
        }).ajaxComplete(function (e, xhr, opts) {
        }).ajaxStop(function () {
        });
    }
};