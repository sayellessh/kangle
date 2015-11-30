var CoreREST = {
    _defaultServer: "http://" + DOMAIN + "/",

    _addContext: function (url, context) {
        if (context != null && context.length > 0) {
            for (var key in context) {
                url += context[key] + '/';
            }
        }

        //if (context != null && context.length > 0) {
        //    for (var i = 0; i < context.length; i++) {
        //        url += context[i] + '/';
        //    }
        //}

        return url;
    },

    _raw: function (url, requestType, context, data, success, failure) {
        $.support.cors = true;
        url = this._addContext(url, context);
        if (data == null) {
            data = {};
        }
        //console.log(url);
        //console.log(JSON.stringify(data));
        $.ajax({
            url: url,
            type: requestType,
            crossDomain: true,
            data: data,
            dataType: "json",
            async: true,
            cache: false,
            //timeout: 15000, //timeout commented
            success: function (response) {
                success(response);
            },
            error: function (a, b, c) {
                if (failure) failure(a);
            }
        });
    },

    _rawPostFile: function (url, requestType, context, data, showProgress, success, failure) {
        $.support.cors = true;
        url = this._addContext(url, context);
        if (data == null) {
            data = {};
        }
        $.ajax({
            url: url,
            type: requestType,
            crossDomain: true,
            contentType: false,
            processData: false,
            dataType: 'json',
            data: data,
            async: true,
            cache: false,
            beforeSend: function (xhr) {
                console.log(xhr);
            },
            error: function (a, b, c) {
                if (failure) failure(a);
            },
            success: function (response) {
                if (success) success(response);
            },
        });
    },

    _rawAlt: function (url, requestType, context, data, success, failure) {
        $.support.cors = true;
        url = this._addContext(url, context);
        if (data == null) {
            data = {};
        }
        //console.log(url);
        //console.log(JSON.stringify(data));
        data = JSON.stringify(data);
        $.ajax({
            url: url,
            type: requestType,
            crossDomain: true,
            contentType : 'application/json',
            data: data,
            async: true,
            cache: false,
            success: function (response) {
                success(response);
            },
            error: function (a, b, c) {
                if (failure) failure(a);
            }
        });
    },

    attach: function (context, data, success, failure) {
        $.support.cors = true;
        var url = this._addContext(this._defaultServer, context, true);
        if (data == null) {
            data = {};
        }
        $.ajax({
            url: url,
            type: "POST",
            data: data,
            dataType: "json",
            async: true,
            crossDomain: true,
            contentType: false,
            processData: false,
            success: function (response) {
                success(response);
            },
            error: function (a, b, c) {
                console.log(JSON.stringify(a) + " - " + JSON.stringify(b) + " - " + JSON.stringify(c));
                if (failure) failure(a);
            }
        });
    },

    post: function (restClass, context, data, success, failure) {
        this._raw(this._defaultServer, 'POST', context, data, success, failure);
    },

    postFile: function (restClass, context, data, success, failure) {
        this._rawPostFile(this._defaultServer, 'POST', context, data, success, failure);
    },

    postArray: function (restClass, context, data, success, failure) {
        this._rawAlt(this._defaultServer, 'POST', context, data, success, failure);
    },

    put: function (restClass, context, data, success, failure) {
        this._raw(this._defaultServer, 'POST', context, data, success, failure);
    },

    remove: function (restClass, context, data, success, failure) {
        this._raw(this._defaultServer, 'POST', context, data, success, failure);
    },

    get: function (restClass, context, data, success, failure) {
        this._raw(this._defaultServer, 'GET', context, data, success, failure);
    },

    attachFile: function (restClass, context, formId, beforeSubmit, success, failure) {
        var url = CoreREST._addContext(CoreREST._defaultServer, context);
        var options = {
            type: 'post',
            url: url,
            dataType: 'json',
            contentType: 'multipart/form-data',
            data: formId.fieldSerialize(),
            crossDomain: true,
            processData: false,
            beforeSubmit: function (formData, jqForm, options) {
                if(beforeSubmit) beforeSubmit(formData, jqForm, options);
            },
            uploadProgress: function (event, position, total, percent) {
                console.log(percent);
            },
            complete: function(data) {
                
            },
            success: function (data, statusText, xhr, $form) {
                if (xhr.status == 200 || xhr.status == 0) {
                    if (success) success(data);
                } else if (failure) failure(xhr);
            }
        };
        formId.ajaxSubmit(options);
    }

};