var SSORemoteDAO = {
		
		metadata : {
		"service" : "WLSSO"
		},
		
		authenticateSSO : function(corrlId, companyCode, userCode, ssoId,
				deviceId, appSuiteId, appId) {
			var data = {
				corrlId : corrlId,
				companyCode : companyCode,
				userCode : userCode,
				ssoId : ssoId,
				deviceId : deviceId,
				appSuiteId : appSuiteId,
				appId : appId
			};
			//alert(JSON.stringify(data));
			var result = CoreSOAP.invoke(SSORemoteDAO, "AuthenticateSSO", data);
			//alert(result);
			return result;
			
		},
		registerSSO : function(corrlId, companyCode, userCode, ssoId,
				deviceId, appSuiteId, appId) {
			var data = {
				companyCode : companyCode,
				corrlId : corrlId,
				userCode : userCode,
				deviceId : deviceId,
				appSuiteId : appSuiteId,
				appId : appId
			};
			var result = CoreSOAP.invoke(SSORemoteDAO,"RegisterSSO", data);
			return result;
		},
		
		unRegisterUser : function(user, corrlId, deviceId, appSuiteId, appId, reasonId){
			var data = {
					companyCode : user.companyCode,
					corrlId : corrlId,
					userCode : user.userCode,
					ssoId : user.ssoId,
					deviceId : deviceId,
					appSuiteId : appSuiteId,
					appId : appId,
					reasonId : reasonId,
					userName :  user.userName,
					userTypeName : user.userTypeName,
					regionName : user.regionName,
					regionCode : user.regionCode,
					modfifiedBy : user.userCode
			};
			
			
			var result = CoreSOAP.invoke(SSORemoteDAO,"RevokeSuite", data);
			return result;
			
		}
	
	};