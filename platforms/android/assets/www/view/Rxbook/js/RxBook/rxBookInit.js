var rxBookInit = {
    defaults: {
        userId: 1
    },
    
    enableCurUserInfo: function (success, failure) {
        Services.defaults.userId = window.localStorage.getItem('userId');
        var localUserInfo = window.localStorage.getItem("localUserInfo");
        try {
        	if(localUserInfo == "null")
        		localUserInfo = null;
        	else
        		localUserInfo = JSON.parse(localUserInfo);
        } catch(e) {
        	localUserInfo = null;
        }
        /*if(localUserInfo != null && localUserInfo != "null" && Services.defaults.userId == localUserInfo.UserID) {
        	Services.defaults.userId = localUserInfo.UserID;
            Services.defaults.companyCode = localUserInfo.Company_Code;
                               
            if (localUserInfo.Profile_Photo_BLOB_URL != null && localUserInfo.Profile_Photo_BLOB_URL != '')
                    Services.defaults.myProfileURL = localUserInfo.Profile_Photo_BLOB_URL;
            Services.defaults.displayName = localUserInfo.Employee_Name;
            Services.defaults.companyId = localUserInfo.Company_Id;
            success(localUserInfo);
        } else {*/
        	Services.getKWUserInfo(Services.defaults.userId, function (data) {
                if (data.length > 0) {
                    Services.defaults.userId = data[0].UserID;
                    Services.defaults.companyCode = data[0].Company_Code;
                                       
                    if (data[0].Profile_Photo_BLOB_URL != null && data[0].Profile_Photo_BLOB_URL != '')
                            Services.defaults.myProfileURL = data[0].Profile_Photo_BLOB_URL;
                    Services.defaults.displayName = data[0].Employee_Name;
                    Services.defaults.companyId = data[0].Company_Id;
                    window.localStorage.setItem("localUserInfo", JSON.stringify(data[0]));
                }
                success(data);
            }, function (e) {
               failure(e)
            });
        //}
        
        Services.getNotificationHubCount(userId, function(data){
        var totalcount = 0;
        	for(i=0; i< data.length; i++){
        	var numbercount = data[i].Count;
        	totalcount = totalcount + numbercount; 
        	}
        	if(totalcount && totalcount > 0){
        		if(totalcount > 10){
					$('.notificationhub-count').show().html('10+');
        		} else {
        			$('.notificationhub-count').show().html(totalcount);
        		}
        	} else{
        		$('.notificationhub-count').hide();
        	}
        });
    },

    parse: function(val) {
        var result = null,
        tmp = [];
        location.search
        //.replace ( "?", "" )
        // this is better, there might be a question mark inside
        .substr(1)
        .split("&")
        .forEach(function (item) {
                 tmp = item.split("=");
                 if (tmp[0] === val) result = decodeURIComponent(tmp[1]);
                 });
        return result;
    },
}