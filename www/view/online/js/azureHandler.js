
//var MOBILE_SERVICE_URL = 'https://kangleapps.azure-mobile.net/';
//var MOBILE_SERVICE_APP_KEY = 'FmaNktRXNTgryirTEsvaYlatSXbqtU83';
//var AZURE_TABLE = 'TodoItem';

// Numeric part of the project ID assigned by the Google API console.
//var GCM_SENDER_ID = '954000034876';
//var GCM_SENDER_ID = "534024598733";
var GCM_SENDER_ID = "370162889748";
// Define the MobileServiceClient as a global variable.
var mobileClient;

var azureHandler = {
	registerFor: null,
	onRegisterSuccess: null,
	onRegisterFail: null,
	
	registerForPush: function(data, success, failure) {
		var _this = this;
		_this.onRegisterSuccess = success;
		_this.onRegisterFail = failure;
		_this.registerFor = data.userId;
		// Define the Mobile Services client.
        //mobileClient = new WindowsAzure.MobileServiceClient(MOBILE_SERVICE_URL, MOBILE_SERVICE_APP_KEY);
        //todoItemTable = mobileClient.getTable('TodoItem');
        // #region notification-registration			
        // Define the PushPlugin.
		var pushNotification = window.plugins.pushNotification;
		
		// Platform-specific registrations.
        /*if ( device.platform == 'android' || device.platform == 'Android' ){
			// Register with GCM for Android apps.
            pushNotification.register(
               _this.successHandler, _this.errorHandler,
               { 
				"senderID": GCM_SENDER_ID, 
				"ecb": "azureHandler.onNotificationGCM" 
				});
        } else if (device.platform === 'iOS') {
            // Register with APNS for iOS apps.			
            pushNotification.register(
                _this.tokenHandler,
                _this.errorHandler, { 
					"badge":"true",
					"sound":"true",
					"alert":"true",
                    "ecb": "azureHandler.onNotificationAPN"
                });
        }
		else if(device.platform === "Win32NT"){
			// Register with MPNS for WP8 apps.
			pushNotification.register(
				_this.channelHandler,
				_this.errorHandler,
				{
					"channelName": "MyPushChannel",
					"ecb": "azureHandler.onNotificationWP8",
					"uccb": "azureHandler.channelHandler",
					"errcb": "azureHandler.ErrorHandler"
			});
		}*/
        // #endregion notifications-registration
		
		// Register with GCM for Android apps.
        pushNotification.register(
           azureHandler.successHandler, azureHandler.errorHandler,
           { 
			"senderID": GCM_SENDER_ID, 
			"ecb": "azureHandler.onNotificationGCM"
			});
	},
	
	// #region notification-callbacks
    // Callbacks from PushPlugin
    onNotificationGCM: function (e) {
		var _this = this;
        switch (e.event) {
            case 'registered':
                // Handle the registration.
                if (e.regid.length > 0) {
                    //console.log("gcm id " + e.regid);
                    //if (mobileClient) {

                        // Create the integrated Notification Hub client.
                        //var hub = new NotificationHub(mobileClient);

                        // Template registration.
                        //var template = "{ \"data\" : {\"message\":\"$(message)\"}}";
						// Register for notifications.
                        // (gcmRegId, ["tag1","tag2"], templateName, templateBody)
                        //hub.gcm.register(e.regid, [_this.registerFor], "myTemplate", template).done(function () {
                            //alert("Registered with hub!");
							_this.onRegisterSuccess(e.regid);
                        //}).fail(function (error) {
                        //    alert("Failed registering with hub: " + error);
                        //        azureHandler.onRegisterFail();
                        //});
                    //}
                }
                break;

            case 'message':
			
				if (e.foreground)
				{
					// Handle the received notification when the app is running
					// and display the alert message. 
					//alert(e.payload.message);
					
					//window.plugin.notification.local.add({ message: 'Great app!' });
					navigator.notification.alert(e.payload.message, null, 'New Message');
					
					// Reload the items list.
					refreshTodoItems();
				}
                break;

            case 'error':
                alert('GCM error: ' + e.message);
                break;

            default:
                alert('An unknown GCM event has occurred');
                break;
        }
    },
    
	successHandler: function (result) {
        console.log("callback success, result = " + result);
    },

    errorHandler: function (error) {
        //_this.onRegisterSuccess();
        alert(error);
        azureHandler.onRegisterFail();
    },
};