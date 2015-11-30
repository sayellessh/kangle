var CoreSOAP = {
		//server: "http://hdqaapi.hidoctor.in/", 
		//server: "http://hdprodapi.hidoctor.in/",
		//server: "http://hdsalesapi.hidoctor.in/",
		//server: "http://168.63.233.71:8081/",
		//server :"http://wlqaapi.hidoctor.in/",
        server:"http://kangleqaapi.hidoctor.in/",
		//server :"http://wlprodapi.hidoctor.in/",
		//server :"http://192.168.0.3:2223/",
        //server :"http://192.168.0.122:2223/",
		errorHandler: null,
		invoke: function(daoClass, operation, params, returnType){
			//alert("invoke");
			
			var _this = CoreSOAP;
			if (returnType == null || returnType == 'undefined'){
				returnType = 'json';
			}
		    var bhRequest = "<s:Envelope xmlns:s=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:ns1=\"http://tempuri.org/\" xmlns:ns2=\"http://schemas.microsoft.com/2003/10/Serialization/Arrays\"> " +
            "<s:Body>" +
            "<ns1:" + operation + ">";
		    var paramString = "";
		    for (var key in params) {
	    	  if (params.hasOwnProperty(key)) {
	    		  if (params[key] instanceof Array){
	    			  paramString += ("<ns1:" + key + ">");
	    			  var arrayValues = params[key];
	    			  for (var index = 0; index < arrayValues.length; index++){
			    		  paramString += ("<ns2:string>" + $('<div/>').text(arrayValues[index]).html() + "</ns2:string>");
	    			  }
	    			  paramString += ("</ns1:" + key + ">");
	    		  } else {
		    		  paramString += ("<ns1:" + key + ">" + $('<div/>').text(params[key]).html() + "</ns1:" + key + ">");
	    		  }
	    	  }
	    	}
		    
		    bhRequest += paramString;
		    bhRequest += "</ns1:" + operation + ">" +
            "</s:Body>" +
        "</s:Envelope>";
		    console.log(bhRequest);
			var result = null;
			var server = CoreSOAP.server;
			if (daoClass.metadata.server != null){
				server = daoClass.metadata.server;
			}
			var url = server + daoClass.metadata.service + ".svc";
			var soapAction = "http://tempuri.org/I" + daoClass.metadata.service +"/" + operation;
			var responseTag = operation + "Response";
			var resultTag = operation + "Result";
			
            console.log('url is');
            console.log(url);
            $.ajax({
	                type: "POST",
	                url: url,
	                data: bhRequest,
	                timeout: 30000,
	                contentType: "text/xml",
					async: false,
					cache: false,
	                dataType: "xml",
	                beforeSend: function (xhr) {
	                    xhr.setRequestHeader("SOAPAction", soapAction);
	                },
	                success: function (data) {
                        console.log('sso calls ');
                        console.log(data);
	                	//alert(JSON.stringify(data));
	                	$(data).find(responseTag).each(function () {
	                		if (returnType == 'json'){
	                			var value = $(this).find(resultTag).text();
	                			if (value ==  null || value == ''){
	                				result = null;
	                			} else {
		                			result = JSON.parse(value);
	                			}
	                		} else if (returnType == 'text'){
	                			result = $(this).find(resultTag).text();
	                		} else {
	                			result = $(this).find(resultTag);
	                		}
	                    });
	                	CoreSOAP.outputMsg = null;
	                	$(data).find("outputMsg").each(function(){
	                		CoreSOAP.outputMsg = $(this).text();
	                	});
	                },
	                error: function (xhr, status, error) {
	                	var arguments = {
	                			url: url,
	                			data: bhRequest,
	                			status: status,
	                			xhr: xhr
	                	};
	                	eLearningAPP.logError(CoreSOAP, error, arguments, "invoke");
	                }
	            });
			 return result;
		},
		
		invokeGet: function(daoClass, operation, params, returnType, rootElement){
			if (returnType == null || returnType == 'undefined'){
				returnType = 'json';
			}
			var result = this.invoke(daoClass, operation, params, returnType);
			if (returnType == 'json'){
				if (result != null && result != ''){
				 if (result.hasOwnProperty("Tables")) {
					 var table = this._getFirstElement(result.Tables);
					 if (table.hasOwnProperty("Rows")){
						 return this.unmarshallJSON(daoClass, table.Rows);
					 }
				 }
				} else {
					result = [];
				}
			} else if (returnType == 'xml'){
				return this.unmarshallXML(daoClass, result, rootElement); 
			}
			return result;
		},
		
		_getFirstElement: function(array){
			if (array instanceof Array){
				if (array.length > 0){
					return array[0];
				} else {
					return null;
				}
			} else {
				return array;
			}
		},
		
		unmarshallXML: function(daoClass, result, rootElement){
			var marshlledRecords = [];
			if (rootElement != null && result != null && result != ""){
				result.find(rootElement).each(function(){
					var unmashalledRecord = $(this);
					var marshallRecord = {};
					var noOfColumns = daoClass.metadata.properties.length;
					var value = null;
					for (var i = 0; i < noOfColumns; i++){
						var paramName = daoClass.metadata.properties[i].outProperty;
						if (paramName != null){
							value = unmashalledRecord.find(paramName).text();
							if (value != null){
								if (daoClass.metadata.properties[i].isDate != null && daoClass.metadata.properties[i].isDate == true){
									value = new Date(value);
								}
								marshallRecord[daoClass.metadata.properties[i].name] = value;							
							}
						}
					}
					marshlledRecords.push(marshallRecord);
				});
			}
			return marshlledRecords;
		},
		
		unmarshallJSON: function(daoClass, result){
			if(typeof result == 'object'){
				
				var records = [];
				if(result instanceof Array){
					records = result;
				}else {
					records.push(result);
				}
				
				var marshlledRecords = [];
				$.each(records, function(index, record){
					var marshallRecord = {};
					var noOfColumns = daoClass.metadata.properties.length;
					var value = null;
					for (var i = 0; i < noOfColumns; i++){
						var paramName = daoClass.metadata.properties[i].outProperty;
						if (paramName != null && record[paramName] != null){
							value = record[paramName];
							if (daoClass.metadata.properties[i].isDate != null && daoClass.metadata.properties[i].isDate == true){
								value = new Date(value);
							}
							marshallRecord[daoClass.metadata.properties[i].name] = value;
						}
					}
					marshlledRecords.push(marshallRecord);
					
				});	
				return marshlledRecords;	
			} else {
				return result;
			}
		},
		
		invokeGetSingle: function(daoClass, operation, params){
			var resultArray = this.invokeGet(daoClass, operation, params);
			if (resultArray instanceof Array){
				if (resultArray.length > 0){
					return resultArray[0];
				} else {
					return null;
				}
			} else {
				return resultArray;
			}
		}
};