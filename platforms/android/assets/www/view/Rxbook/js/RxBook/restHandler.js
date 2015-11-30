var checkStart = false;
var CoreREST = {
	//_defaultServer: "http://kangle.swaas.net/",
	_defaultServer : "http://" + DOMAIN + "/",
	//_defaultServer: "http://kangle.me/",
	xhr : null,
	intervalId : null,
	netwrkCnt : 0,

	_addContext : function(url, context) {
		if (context != null && context.length > 0) {
			for ( var key in context) {
				url += context[key] + '/';
			}
		}
		return url;
	},

	/*_raw: function (url, requestType, context, data, success, failure) {
	 
	 this._rawAjax(url, requestType, context, data, success, failure);
	 },*/

	_raw : function(url, requestType, context, data, success, failure) {
		/*CoreREST.netwrkCnt++;
		var isAjaxSend = false;
		CoreREST.showNetworkError = true;
		CoreREST.checkNetworkConnection(function() {
		
		}, function() {
			if(CoreREST.netwrkCnt == 1){
		        alert("Problem connecting to network.Please try again later!");
		        //CoreREST.showNetworkError = false;
		    }
		    if(failure) failure();
		});
		CoreREST.intervalId = setInterval(function(){
		  if(!isAjaxSend && !checkStart){
			  checkStart = true;
			  var res = CoreREST.checkNetworkConnection(function() {
				  checkStart = false;
			  }, function() {
				  checkStart = false;
				  CoreREST.xhr.abort();
				  clearInterval(CoreREST.intervalId);
			  });
		  }
		  }, 3000);*/
		$.support.cors = true;
		url = this._addContext(url, context);
		if (data == null) {
			data = {};
		}
		CoreREST.xhr = $.ajax({
			url : url,
			type : requestType,
			crossDomain : true,
			data : data,
			dataType : "json",
			timeout: 10000,
			async : true,
			cache : false,
			success : function(response) {
				//isAjaxSend = true;
				console.log('success response');
				//CoreREST.netwrkCnt = 0;
				if(success) success(response);
			},
			error : function(a, b, c) {
//				if(app) {
//					app.hideLoading();
//				}
				if (failure)
					failure(a);
			},
			complete : function(xhr, status) {
				/*clearInterval(CoreREST.intervalId);
				CoreREST.intervalId = null;
				if (status != 'success' && status != 'abort') {
					//alert("Problem connecting to network.Please try again later!");
					if (failure)
						failure();
				}*/
			}
		});
	},

	_rawAlt : function(url, requestType, context, data, success, failure) {
		/*var isAjaxSend = false;
		CoreREST.showNetworkError = true;
		CoreREST.checkNetworkConnection(function() {
		}, function() {
			if (CoreREST.netwrkCnt == 1) {
				alert("Problem connecting to network.Please try again later!");
				//CoreREST.showNetworkError = false;
			}
			if (failure)
				failure();
		});
		CoreREST.intervalId = setInterval(function() {
			if (!isAjaxSend && !checkStart) {
				checkStart = true;
				var res = CoreREST.checkNetworkConnection(function() {
					checkStart = false;
				}, function() {
					checkStart = false;
					CoreREST.xhr.abort();
					clearInterval(CoreREST.intervalId);
				});
			}
		}, 3000);*/
		$.support.cors = true;
		url = this._addContext(url, context);
		if (data == null) {
			data = {};
		}
		data = JSON.stringify(data);
		CoreREST.xhr = $.ajax({
			url : url,
			type : requestType,
			crossDomain : true,
			timeout: 10000,
			contentType : 'application/json',
			data : data,
			async : true,
			cache : false,
			beforeSend : function(jqXHR, settings) {

			},
			success : function(response) {
				//isAjaxSend = true;
				//CoreREST.netwrkCnt = 0;
				if(success) success(response);
			},
			error : function(a, b, c) {
				//isAjaxSend = true;
//				if(app) {
//					app.hideLoading();
//				}
				console.log('failure due to network connection');
				if (failure)
					failure(a);
			},
			complete : function(xhr, status) {
				/*console.log('the complete status ' + status);
				clearInterval(CoreREST.intervalId);
				CoreREST.intervalId = null;
				if (status != 'success' && status != 'abort') {
					//alert("Problem connecting to network.Please try again later!");
					if (failure)
						failure();
				}*/
			}
		});
	},
	
	_rawText: function (url, requestType, context, data, success, failure) {
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
            contentType: "text/plain",
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

	attach : function(context, data, success, failure) {
		$.support.cors = true;
		var url = this._addContext(this._defaultServer, context, true);
		if (data == null) {
			data = {};
		}
		$.ajax({
			url : url,
			type : "POST",
			data : data,
			dataType : "json",
			async : true,
			crossDomain : true,
			contentType : false,
			processData : false,
			success : function(response) {
				success(response);
			},
			error : function(a, b, c) {
				console.log(JSON.stringify(a) + " - " + JSON.stringify(b)
						+ " - " + JSON.stringify(c));
				if (failure)
					failure(a);
			}
		});
	},

	post : function(restClass, context, data, success, failure) {
		this._raw(this._defaultServer, 'POST', context, data, success, failure);
	},

	postArray : function(restClass, context, data, success, failure) {
		this._rawAlt(this._defaultServer, 'POST', context, data, success,
				failure);
	},

	postRawText :function(restClass, context, data, success, failure) {
        this._rawText(this._defaultServer, 'POST', context, data, success,
                     failure);
    
    },
	
	put : function(restClass, context, data, success, failure) {
		this._raw(this._defaultServer, 'POST', context, data, success, failure);
	},

	remove : function(restClass, context, data, success, failure) {
		this._raw(this._defaultServer, 'POST', context, data, success, failure);
	},

	get : function(restClass, context, data, success, failure) {
		this._raw(this._defaultServer, 'GET', context, data, success, failure);
	},

	attachFile : function(restClass, context, formId, beforeSubmit, success,
			failure) {
		var url = CoreREST._addContext(CoreREST._defaultServer, context);
		var options = {
			type : 'post',
			url : url,
			dataType : 'json',
			contentType : 'multipart/form-data',
			data : formId.fieldSerialize(),
			crossDomain : true,
			processData : false,
			beforeSubmit : function(formData, jqForm, options) {
				if (beforeSubmit)
					beforeSubmit(formData, jqForm, options);
			},
			uploadProgress : function(event, position, total, percent) {
				console.log(percent);
			},
			complete : function(data) {

			},
			success : function(data, statusText, xhr, $form) {
				if (xhr.status == 200 || xhr.status == 0) {
					if (success)
						success(data);
				} else if (failure)
					failure(xhr);
			}
		};
		formId.ajaxSubmit(options);
	},

	checkNetworkConnection : function(success, failure) {
		//var xhr = new XMLHttpRequest();
		var file = 'http://' + DOMAIN
				+ '/Images/Kangle/Knowledge_Evaluation.png';
		//var r = Math.round(Math.random() * 1000);
		$.ajax({
			url : file + '?timestamp=' + new Date().getTime(),
			method : "GET",
			timeout : 10000,
			complete : function(data, status) {
				if (status == 'success' || status == 'abort') {
					success();
				} else {
					failure();
				}
			}
		});
		/*xhr.open('GET', file + '?timestamp=' + new Date().getTime(), false);
		xhr.setCache
		try {
		    xhr.send();
		    console.log(xhr.status);
		    if(xhr.status >= 200 && xhr.status < 304) {
		        return true;
		    } else {
		        return false;
		    }
		} catch(e) {
		    return false;
		}*/
	}

};