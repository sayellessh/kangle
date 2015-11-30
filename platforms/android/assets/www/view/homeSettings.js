
var setting = {
	init: function() {
		/*popup settings*/
        var hdcustomer = window.localStorage.getItem('hidoctorcustomer');
        if(hdcustomer == 0){
            showChangePassword = true;
        }
        var popSettingsAry = [
            {
                displaytitle: "logout",
                iconclass: 'arrow-exit',
                onclick: function () {
                	arrowPopup.hide();
            		formatDeviceService.startFormat(function(data){
                        setTimeout(function(){}, 3000);
                        var user = JSON.parse(window.localStorage.getItem("user"));
                        var pushNotification = window.plugins.pushNotification;
                        pushNotification.unregister(function(success) {
                        	window.location.href = 'login.html';
                        	alert("Kangle reset successfully, app will now exit.");
                        	navigator.app.exitApp();
                        }, function(e) { alert('Unable to delete push notification settings.'); }, {
                            "channelName": user.userName
                        });
                  }, function(data){});
                },
                isVisible: true
            }
        ];
        if(showChangePassword) {
            var cpAry = {
                    displaytitle: "Change password",
                    iconclass: 'arrow-offline',
                    onclick: function () {
                    //window.changeActivity.change();
                    if(coreNET.isConnected()){
                    	window.location.href='changePassword.html';
                    } else {
                    	alert(resource.networkMessage.noNetwork);
                    }
                },
                isVisible: true
            };
        popSettingsAry.push(cpAry);
        }
        
        var arrowPopup = new ArrowPopup($('#pop-settings'), {
            container: "body",
            offset: 41,
            bodyDiv: "settings",
            contents : popSettingsAry
            
        });
        /*popup settings*/
        
        //assetupload pop setting
        var popSettingsupload = new ArrowPopup ($('#assetUpload'),{
    	    container: "body",
    	    offset: 41,
    	    bodyDiv: "accesssettings",
    	    contents: [
    	        {
    	            displaytitle: "Add Customer",
    	            iconclass: 'arrow-profile',
    	            onclick: function () {
    	                //window.changeActivity.change();
    	               window.location.href = 'Mycustomer.html';
    	            },
    	            isVisible: true
    	        }/*,{
    	            displaytitle: "Upload Assets",
    	            iconclass: 'arrow-wire',
    	            onclick: function () {
    	                //window.changeActivity.change();
    	               window.location.href='Assetupload/UserUpload.Mobile.html';
    	            },
    	            isVisible: true
    	               }*/ //commented on 10 august for user
    	   ]
    	});
        /*Services.getCustomerKangleModuleAccess(function(data){
            if(data == 0){
                $('.arrow-profile').hide();
             }
         }, function(){
         });*/ //commented on 10 august for user
	}
};