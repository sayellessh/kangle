// Set these global variables to the settings for your
// Azure Mobile Service.

//DOMAIN
//var DOMAIN = 'login.kangle.me'; //PRODUCTION site
var DOMAIN = 'loginqa.kangle.me';
//var DOMAIN = '192.168.0.163:8083';

//SERVERNAME
//var SERVERNAME = 'kangleprodapi.hidoctor.in'; //PRODUCTION server
var SERVERNAME = 'kangleqa.hidoctor.me';


//VERSION
var VERSION = '4.0';


var emailId = window.localStorage.getItem('supportEmail');
var phoneNo = window.localStorage.getItem('supportPhone');
var userId = window.localStorage.getItem('userId');
var companyId = window.localStorage.getItem('companyId');
var companyLogoUrl = '';

var pubnubSubKey = "sub-c-96949208-5419-11e4-9c6f-02ee2ddab7fe";
var pubnubPubKey = "pub-c-29e631ff-6f05-4fcd-8825-ce812cd6c33f";

var pushRegError = "Due to network issues, the system was not able to register for push notifications, please try restarting the app.";
var networkProblemError = "Problem connecting to network, please check your internet.";

var serverError = "Error occured while doing this operation, please try again.";
var wallPostError = "Error occured while doing this operation, please try again.";
var noNetworkconnection = "Your device is not connected to the internet. Please connect to the internet and retry the operation";

var kangleaccessrevoked = "Kangle Access has been revoked.Please contact your administrator.Now Kangle will reset";
//var rootPath = 'http://iavp.hidoctor.in/';
var  showChangePassword = false;

var footerdiv = function (divfooter){
    var footer = $('.footer');
    footer.remove();
    //var footerstyle = '<div class="footer"><p> &copy; Powered by <span> SwaaS</span> - v'+VERSION+'</p></div>';
    var footerstyle = '<div class="footer">';
    	footerstyle += '<p> &copy; Powered by <span> SwaaS</span> - v'+VERSION+'</p>';
    	if(emailId != null && emailId != '' && emailId != 'undefined' && phoneNo != null && phoneNo != '' && phoneNo != 'undefined') {
    		footerstyle += '<div id="support" class="fa fa-support">';
        	footerstyle += '<span>support</span>';
        	footerstyle += '</div>';
        	footerstyle += '<br />';
        	footerstyle += '<div class="fa fa-envelope-o" id="mail">&nbsp;  '+ emailId +'</div>';
        	footerstyle += '<div class="fa fa-phone" id="numbr">&nbsp;  '+ phoneNo +'</div>';
        	footerstyle += '</div>';
        divfooter.append(footerstyle);
        
        $('.footer').bind('click', function () {
            if ($('.footer').height() >= 55) {
                $('.footer').css("height", "20px"); 
            } else {
                $('.footer').css("height", "56px");
            }
        });
    	} else {
    		divfooter.append(footerstyle);
    	}  
};

String.prototype.toProperCase = function () {
    return this.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
};

var UploadImageResizer = {
	
	resizeImage: function(imageURI, storagePath, success, failure) {
		var currentFileName = new Date().getTime() + "." + ImageResizer.FORMAT_JPG;
		window.imageResizer.resizeImage(success, failure, imageURI, 501, 0, {
			format: ImageResizer.FORMAT_JPG,
			storeImage: true,
			imageDataType: ImageResizer.IMAGE_DATA_TYPE_BASE64,
			pixelDensity: true,
			directory: storagePath,
			filename: currentFileName.toString()
		});
	}
};

/***********************
 * common methods to execute on all page
 * included pubnub methods
 ***********************/
var includeJavascript = function(url, callback) {
	var se = document.createElement('script');
	se.setAttribute('src', url);
	// most browsers
	se.onload = callback;
	// IE 6 & 7
	se.onreadystatechange = function() {
		if (this.readyState == 'complete') {
			if(callback) callback();
		}
	}
	document.getElementsByTagName('head').item(0).appendChild(se);
}

var pathUrl = window.location.pathname;
var wwwSPath = pathUrl.split('/www/');
var url = "";
if(wwwSPath != null && wwwSPath.length >= 2) {
	var wwwPath = wwwSPath[1];
	var splitSlash = wwwPath.split('/');
	if(splitSlash != null && splitSlash.length > 0) {
		for(var i=0;i<splitSlash.length-1;i++) {
			url += "../";
		}
	}
}

// pubnub start
var pubnub = {
	subscribed: null,
	channelPrefix: "user_",
	channel: "user_" + companyId + "_" + userId,
	subKey: "sub-c-96949208-5419-11e4-9c6f-02ee2ddab7fe",
	pubKey: "pub-c-29e631ff-6f05-4fcd-8825-ce812cd6c33f",
	stateDefaultKey: "TopicId",
	stateDefaultValue: "0",
	init: function() {
		//get/create/store UUID
		var UUID = PUBNUB.db.get('session') || (function(){ 
		    var uuid = PUBNUB.uuid(); 
		    PUBNUB.db.set('session', uuid); 
		    return uuid; 
		})();
		pubnub.UUID = UUID;
		pubnub.subscribed = PUBNUB.init({
			publish_key: pubnub.pubKey,
			subscribe_key: pubnub.subKey,
			uuid: UUID
		});
		pubnub.subscribe();
	},
	subscribe: function() {
		pubnub.subscribed.subscribe({
			channel: pubnub.channel,
			message: pubnub.onMessageReceived,
			presence: pubnub.onPresenceChanged
		});
		pubnub.triggerState(pubnub.stateDefaultKey, pubnub.stateDefaultValue);
		//pubnub.checkHerenow(pubnub.channel);
	},
	unsubscribe: function() {
		pubnub.subscribed.unsubscribe({
			channel: pubnub.channel
		});
		//pubnub.checkHerenow(pubnub.channel);
	},
	onMessageReceived: function(message) {
		if(message.type == "message") {
			pubnub.bindChat(message.message);
		} else if(message.type == "unread_msg_counts") {
			pubnub.bindUnreadMessages(message.message);
		}
	},
	onPresenceChanged: function(data) {
		//alert(JSON.stringify(data));
	},
	checkHerenow: function(channels) {
		pubnub.subscribed.here_now({
			channel: channels,
			callback: pubnub.onHerenowReceived
		})
	},
	onHerenowReceived: function(data) {
		//alert(JSON.stringify(data));
	},
	bindUnreadMessages: function(message) {
		console.log(message);
	},
	bindChat: function(message) {
		console.log(message);
	},
	triggerState: function(key, value) {
		var values = {};
		values[key] = value;
		pubnub.subscribed.state({
        	channel: pubnub.channel,
        	state: values,
        	callback: function(m) {
        		console.log("State Changed successfully.");
        	},
        	error: function(e) {
        		console.log("Unable to change state.");
        	}
        });
	}
};
includeJavascript(url + "pubnub/pubnub.min.js", pubnub.init);
// pubnub end

/*CompanyLogo for AdCourse*/
companyLogo_div = function() {
	
	var companyLogoUrl = window.localStorage.getItem("companyLogoUrl");
	var user = JSON.parse(window.localStorage.getItem("user"));
	var userName = user.userName;
	if(companyLogoUrl === undefined || companyLogoUrl === '' || companyLogoUrl === null)
		companyLogoUrl = '';
	$('header .logo a').css({'background-image': 'url(' + companyLogoUrl + ')',
		'background-position':'0% 50%',
		'background-repeat':'no-repeat',
		'background-size':'100%'});
	if(userName != undefined) {
		$('header nav li.profile-name a').html(user.userName).attr('href','#');
	}
};
/*CheckCurrentBuildVersion*/
var checkversionnumber = function(){
	//Services.CheckCurrentBuildVersion(VERSION,function(data) {	
	Services.CheckCurrentBuildVersion(VERSION,"ANDROID",function(data) {
		if(data == "YES"){
			$("#app_version").css("display","none");
			$("#pop_content").fadeOut();
		} else {
			$("#app_version").css("display","block");
			$("#pop_content").fadeIn();
		}
	},function(e){
			$("#app_version").css("display","none");
	});
};
/*CheckCurrentBuildVersion*/
/* homepage access */
var getCmpnyConfig = function(data) {
	Services.getLandingPageAccess(userId, function(data){
		var data;
        window.localStorage.setItem("companyConfig", JSON.stringify(data));
		bindLandingpageConfig(data);
	}, function(){
		var data = window.localStorage.getItem("companyConfig");
    	if(data != null && data != '') {
    		data = JSON.parse(data);
    		bindLandingpageConfig(data);
    	}
    	alert(networkProblemError);
	});
};

//var getCmpnyConfig = function(data) {
//Services.getCompanyConfiguration(function(data) {
//  var i=0;
//  var data;
//  window.localStorage.setItem("companyConfig", JSON.stringify(data));
//  bindCompanyConfig(data);
//},function(){
//	var data = window.localStorage.getItem("companyConfig");
//	if(data != null && data != '') {
//		data = JSON.parse(data);
//		bindCompanyConfig(data);
//	}
//	alert(networkProblemError);
//});
//};

var bindLandingpageConfig = function (data) {
    var obj = {};
    if (data[0] !== undefined && data[0].Chat == 'Y') {    	
		$('.menu-social').css('display','block');
		$('.Notifications').css('display','block');
		$('#right').css('display','block');
    }
    else {
        if ($(window).width() >= 1024) {
        	$('.main-menu').css('margin-left','31%');
        	$('.k-logo').css('right','0px');
        }
    }
    if (data[0] !== undefined && data[0].Library == 'Y') {
    	$('.menu-asset').css('display', 'block');
    }

    if (data[0] !== undefined && data[0].Meeting == 'Y') {
    	$('.menu-online').css('display', 'block'); 
    }
    if (data[0]!== undefined && data[0].Course == 'A') {
    	$('.menu-Knowd1').css('display', 'block');
    }
    else if (data[0] !== undefined && data[0].Course == 'S') {
    	$('.menu-Knowd').css('display', 'block');
    }
    if (data[0] !== undefined && data[0].Sync > 0) {
        initAutoSync(data[0].Sync);
    }
    if(data[0] != undefined && data[0].Security > 0) {
        window.localStorage.setItem("SecurityCheckPeriodInDays",data[0].Security);
    }
};  
//    else {
//        $('.menu-Knowd1').css('display', 'none');
//        $('.menu-Knowd').css('display', 'none');
//    }
//    if (data[0] !== undefined && data[0].ControlPanel == 'Y') {
//        if (window.jscd.deviceType == 'PC') {
//            $('.control-panel').css('display', 'block');
//        } else {
//            $('.control-panel').css('display', 'none');
//        }
//    }
//    else {
//        $('.control-panel').css('display', 'none');
//    }

//var bindCompanyConfig = function(data) {
//    var obj = {};
//    obj['landingAccess'] = new Array();
//    obj['isAdvancedCourse'] = false;
//    //obj[''] = '';
//    //window.localStorage.setItem("accessdays",obj['']);
//    for(i=0; i <= data.length ; i++) {
//        if(data[i] !== undefined && data[i].Action == 'LANDING_PAGE_ACCESS') {
//            obj['landingAccess'] = data[i].Intent.split(',');
//        }
//        if(data[i] !== undefined && data[i].Action == 'IS_ADV_COURSE_ENABLED') {
//            obj['isAdvancedCourse'] = (data[i].Intent == 'YES' ? true : false);
//        }
//        if(data[i] != null && data[i].Action == 'KA_SYNC_CHECK_INTERVAL_IN_MINUTES') {
//        	initAutoSync(data[i].Intent);
//        }
//        if(data[i] != null && data[i].Action == 'SECURITYCHECKPERIODINDAYS') {
//        	window.localStorage.setItem("SecurityCheckPeriodInDays",data[i].Intent);
//        }
//    }
//    for(var access = 0; access < obj['landingAccess'].length; access++) {
//        if(obj['landingAccess'][access].indexOf('LIBRARY') > -1) {
//            $('.menu-asset').css('display','block');
//        } else if (obj['landingAccess'][access].indexOf('CHAT') > -1) {
//        	/*userwise Chat access*/
//            Services.checkChatAccess(userId, function(data) {
//            	if(data != null && data == 1){
//	            	$('.menu-social').css('display','block');
//		            $('.Notifications').css('display','block');
//		            $('#right').css('display','block');
//            	} else {
//            		if($(window).width() >= 1024) {
//	            		$('.main-menu').css('margin-left','31%');
//			            $('.k-logo').css('right','0px');
//            		}
//            	}
//            	},function(){
//            });
//            /*userwise Chat access*/
//        } else if (obj['landingAccess'][access].indexOf('MEETING') > -1) {
//            $('.menu-online').css('display','block');
//        } else if (obj['landingAccess'][access].indexOf('COURSE') > -1) {
//            $('.menu-Knowd1').css('display','none');
//            $('.menu-Knowd').css('display','none');
//            if(obj['isAdvancedCourse']) {
//                $('.menu-Knowd1').css('display','block');
//            } else {
//                $('.menu-Knowd').css('display','block');
//            }
//        }
//    }
//};
/* homepage access */

/*Auto Sync*/
var constLastAutoSync = "LAST_AUTOSYNC";
var constSkipCount = "SKIP_COUNT";
var constMaxSkip = 3;
var initAutoSync = function(interval) {
	document.addEventListener("resume", function() {
		initAutoSync(interval);
	}, function() { });
	try {
		var lastAutosync = window.localStorage.getItem(constLastAutoSync);
		if(lastAutosync == null || lastAutosync == '') {
			window.localStorage.setItem(constLastAutoSync, new Date().getTime());
			lastAutosync = window.localStorage.getItem(constLastAutoSync);
		}
		var lastHappenedSync = lastAutosync;
		lastHappenedSync = (lastHappenedSync / (1000 * 60));
		var nowDateTime = (new Date().getTime() / (1000 * 60));
		var intervalDifference = nowDateTime - lastHappenedSync;
		if(intervalDifference >= interval) {
			eLearningAPP.getBrowseTags(null, null, function(data) {
				showConfirmDialog(function(buttonIndex) {
					if(buttonIndex == 2) {
						eLearningAPP.tagList = {
							settings: data
						};
						eLearningAPP.autoSync = true;
						eLearningAPP.sync();
						window.localStorage.setItem(constLastAutoSync, new Date().getTime());
						window.localStorage.setItem(constSkipCount, 0);
						checkUserActiveOrNot(); //checkuseraccess
						$(".confirmDialogBGWrapper").remove();
						$(".confirmDialogWrapper").remove();
					} else {
						window.localStorage.setItem(constLastAutoSync, new Date().getTime());
						var skipCount = getSkipCount();
						window.localStorage.setItem(constSkipCount, ++skipCount);
						var remSkip = (constMaxSkip - skipCount);
						if(remSkip > 0) {
							$(".confirmDialogContent").html("You can skip " + (constMaxSkip - skipCount) + " more time.");
						} else {
							$(".confirmDialogContent").html("Skipped data will be automatically synched next time..");
						}
						
						$(".confirmDialogButtons").remove();
						setTimeout(function() {
							$(".confirmDialogBGWrapper").remove();
							$(".confirmDialogWrapper").remove();
						}, 3000);
					}
				});
			}, function(e) { });
		}
	} catch(e) {
		window.localStorage.setItem(constLastAutoSync, new Date().getTime());
	}
};
var showConfirmDialog = function(onConfirm) {
	var skipCount = getSkipCount();
	if(skipCount < constMaxSkip) {
		var $bgWrapper = $("<div class=\"confirmDialogBGWrapper\">");
		var $cdWrapper = $("<div class=\"confirmDialogWrapper\">");
		var $confirmDialog = $("<div class=\"confirmDialog\">");
		$cdWrapper.append($confirmDialog);
		var $cdHeader = $("<div class=\"confirmDialogHeader\">Autosync</div>");
		$confirmDialog.append($cdHeader);
		var $cdContent = $("<div class=\"confirmDialogContent\">Synchronizing data...<br />Do you want to allow?</div>");
		$confirmDialog.append($cdContent);
		var $cdButtons = $("<div class=\"confirmDialogButtons\">");
		$confirmDialog.append($cdButtons);
		var $skipBtn = $("<span>Skip</span>");
		$skipBtn.bind("click", function(e) {
			onConfirm(1);
		});
		var $yesBtn = $("<span>Yes</span>");
		$yesBtn.bind("click", function(e) {
			onConfirm(2);
		});
		$cdButtons.append($skipBtn);
		$cdButtons.append($yesBtn);
		$cdWrapper.append($confirmDialog);
		$("body").append($bgWrapper);
		$("body").append($cdWrapper);
		var wHeight = $(window).height();
		var eHeight = $(".confirmDialog").height();
		var mHeight = (wHeight - eHeight) / 2;
		$(".confirmDialog").css("margin-top", mHeight);
		$(window).resize(function() {
			var wHeight = $(window).height();
			var eHeight = $(".confirmDialog").height();
			var mHeight = (wHeight - eHeight) / 2;
			$(".confirmDialog").css("margin-top", mHeight);
		});
	} else {
		onConfirm(2);
	}
};
var getSkipCount = function() {
	var skipCount = window.localStorage.getItem(constSkipCount);
	if(skipCount == null || skipCount == '' || skipCount <= 0) {
		skipCount = 0;
	}
	return skipCount;
}
/*Auto Sync*/

/**/
var checkUserActiveOrNot = function() {
	userLocalDAO.get(function(data){
		var result = userRemoteDAO.login(data.userName, data.password, data.url);
		if(result == false){
			alert(kangleaccessrevoked);
			eLearningUpsyncService.startUpsync(function(isUploadSuccess){
				trainingRequestUpsyncService.startTrainingRequestUpsyncProcess(eLearningAPP, {}, function(data){
					trainingRequestLocalDAO.remove();
					formatDeviceService.deletePhysicalDirectory(function(e) {
						var user = JSON.parse(window.localStorage.getItem("user"));
						var pushNotification = window.plugins.pushNotification;
						pushNotification.unregister(function(success) {
							window.location.href = 'login.html';
							alert("Kangle reset successfully, app will now exit.");
							navigator.app.exitApp();
						}, function(e) { alert('Unable to delete push notification settings.'); }, {
							"channelName": user.userName
						});
					}, function() {});
				}, function() {});
				//	after data uploaded overall progress will be 25%		
			});  
		} else {
			//window.location.href = "homePage.html";
		}
	},function(){});
};
/**/

/* user track javascript */
var PAGE_NAMES = {
    home: "Landing",
    asset: "Bookshelf",
    social: "RxBook",
    meeting: "Meeting",
    course: "Course",
    advancedCourse: "Advanced Course"
};
var geoLocStart = false;
var insertUserTrack = function(pageName, success, failure) {
    try {
    	geoLocStart = true;
        navigator.geolocation.getCurrentPosition(function(position) {
        	geoLocStart = false;
            sendUserTrack(pageName, position, success, failure);
        }, function() {
        	geoLocStart = false;
            var position = {};
            position.coords = {};
            position.coords.latitude = 0;
            position.coords.longitude = 0;
            sendUserTrack(pageName, position, success, failure);
        });
        setTimeout(function() {
        	if(geoLocStart) {
        		var position = {};
                position.coords = {};
                position.coords.latitude = 0;
                position.coords.longitude = 0;
                sendUserTrack(pageName, position, success, failure);
        	}
        }, 1000);
    } catch(e) {
        failure(e);
    }
};

var sendUserTrack = function(pageName, position, success, failure) {
    try {
        var currentUser = window.localStorage.getItem("user");
        currentUser = JSON.parse(currentUser);
        var getBrowPlatform = $.pgwBrowser();
        //alert(JSON.stringify(getBrowPlatform));
        var data = {};
        data.CompanyId = currentUser.companyId;
        data.UserId = currentUser.userId;
        data.RegionCode = currentUser.regionCode;
        data.Module = pageName;
        data.Devicetype = window.jscd.deviceType;
        data.DeviceModel = device.model;
        data.AppVersion = VERSION;
        data.Device_OS_Type = getBrowPlatform.os.name;
        data.Browser = getBrowPlatform.browser.name;
        data.OSBrowserVersion = window.jscd.browserVersion;
        data.OSVersion = window.jscd.osVersion;
        data.UserAnonymous = "";
        data.OtherData1 = "";
        data.OtherData2 = "";
        data.lattitude = position.coords.latitude;
        data.longitude = position.coords.longitude;
        data.Address = "";
        //console.log(data);
        //alert(JSON.stringify(data));
        Services.insertUserTracker(data, success, failure);
    } catch(e) {
        failure(e);
    }
};


/**
 * JavaScript Client Detection
 * (C) viazenetti GmbH (Christian Ludwig)
 */
(function (window) {
    {
        var unknown = '-';

        // screen
        var screenSize = '';
        if (screen.width) {
            width = (screen.width) ? screen.width : '';
            height = (screen.height) ? screen.height : '';
            screenSize += '' + width + " x " + height;
        }

        //browser
        var nVer = navigator.appVersion;
        var nAgt = navigator.userAgent;
        var browser = navigator.appName;
        var version = '' + parseFloat(navigator.appVersion);
        var majorVersion = parseInt(navigator.appVersion, 10);
        var nameOffset, verOffset, ix;

        // Opera
        if ((verOffset = nAgt.indexOf('Opera')) != -1) {
            browser = 'Opera';
            version = nAgt.substring(verOffset + 6);
            if ((verOffset = nAgt.indexOf('Version')) != -1) {
                version = nAgt.substring(verOffset + 8);
            }
        }
        // MSIE
        else if ((verOffset = nAgt.indexOf('MSIE')) != -1) {
            browser = 'Microsoft Internet Explorer';
            version = nAgt.substring(verOffset + 5);
        }
        // Chrome
        else if ((verOffset = nAgt.indexOf('Chrome')) != -1) {
            browser = 'Chrome';
            version = nAgt.substring(verOffset + 7);
        }
        // Safari
        else if ((verOffset = nAgt.indexOf('Safari')) != -1) {
            browser = 'Safari';
            version = nAgt.substring(verOffset + 7);
            if ((verOffset = nAgt.indexOf('Version')) != -1) {
                version = nAgt.substring(verOffset + 8);
            }
        }
        // Firefox
        else if ((verOffset = nAgt.indexOf('Firefox')) != -1) {
            browser = 'Firefox';
            version = nAgt.substring(verOffset + 8);
        }
        // MSIE 11+
        else if (nAgt.indexOf('Trident/') != -1) {
            browser = 'Microsoft Internet Explorer';
            version = nAgt.substring(nAgt.indexOf('rv:') + 3);
        }
        // Other browsers
        else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) < (verOffset = nAgt.lastIndexOf('/'))) {
            browser = nAgt.substring(nameOffset, verOffset);
            version = nAgt.substring(verOffset + 1);
            if (browser.toLowerCase() == browser.toUpperCase()) {
                browser = navigator.appName;
            }
        }
        // trim the version string
        if ((ix = version.indexOf(';')) != -1) version = version.substring(0, ix);
        if ((ix = version.indexOf(' ')) != -1) version = version.substring(0, ix);
        if ((ix = version.indexOf(')')) != -1) version = version.substring(0, ix);

        majorVersion = parseInt('' + version, 10);
        if (isNaN(majorVersion)) {
            version = '' + parseFloat(navigator.appVersion);
            majorVersion = parseInt(navigator.appVersion, 10);
        }

        // mobile version
        var mobile = /Mobile|mini|Fennec|Android|iP(ad|od|hone)/.test(nVer);

        // cookie
        var cookieEnabled = (navigator.cookieEnabled) ? true : false;

        if (typeof navigator.cookieEnabled == 'undefined' && !cookieEnabled) {
            document.cookie = 'testcookie';
            cookieEnabled = (document.cookie.indexOf('testcookie') != -1) ? true : false;
        }

        // system
        var os = unknown;
        var clientStrings = [
            {s:'Windows 3.11', r:/Win16/},
            {s:'Windows 95', r:/(Windows 95|Win95|Windows_95)/},
            {s:'Windows ME', r:/(Win 9x 4.90|Windows ME)/},
            {s:'Windows 98', r:/(Windows 98|Win98)/},
            {s:'Windows CE', r:/Windows CE/},
            {s:'Windows 2000', r:/(Windows NT 5.0|Windows 2000)/},
            {s:'Windows XP', r:/(Windows NT 5.1|Windows XP)/},
            {s:'Windows Server 2003', r:/Windows NT 5.2/},
            {s:'Windows Vista', r:/Windows NT 6.0/},
            {s:'Windows 7', r:/(Windows 7|Windows NT 6.1)/},
            {s:'Windows 8.1', r:/(Windows 8.1|Windows NT 6.3)/},
            {s:'Windows 8', r:/(Windows 8|Windows NT 6.2)/},
            {s:'Windows NT 4.0', r:/(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/},
            {s:'Windows ME', r:/Windows ME/},
            {s:'Android', r:/Android/},
            {s:'Open BSD', r:/OpenBSD/},
            {s:'Sun OS', r:/SunOS/},
            {s:'Linux', r:/(Linux|X11)/},
            {s:'iOS', r:/(iPhone|iPad|iPod)/},
            {s:'Mac OS X', r:/Mac OS X/},
            {s:'Mac OS', r:/(MacPPC|MacIntel|Mac_PowerPC|Macintosh)/},
            {s:'QNX', r:/QNX/},
            {s:'UNIX', r:/UNIX/},
            {s:'BeOS', r:/BeOS/},
            {s:'OS/2', r:/OS\/2/},
            {s:'Search Bot', r:/(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/}
        ];
        for (var id in clientStrings) {
            var cs = clientStrings[id];
            if (cs.r.test(nAgt)) {
                os = cs.s;
                break;
            }
        }

        var osVersion = unknown;

        if (/Windows/.test(os)) {
            osVersion = /Windows (.*)/.exec(os)[1];
            os = 'Windows';
        }

        switch (os) {
            case 'Mac OS X':
                osVersion = /Mac OS X (10[\.\_\d]+)/.exec(nAgt)[1];
                break;

            case 'Android':
                osVersion = /Android ([\.\_\d]+)/.exec(nAgt)[1];
                break;

            case 'iOS':
                osVersion = /OS (\d+)_(\d+)_?(\d+)?/.exec(nVer);
                osVersion = osVersion[1] + '.' + osVersion[2] + '.' + (osVersion[3] | 0);
                break;
        }

        // flash (you'll need to include swfobject)
        /* script src="//ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js" */
        var flashVersion = 'no check';
        if (typeof swfobject != 'undefined') {
            var fv = swfobject.getFlashPlayerVersion();
            if (fv.major > 0) {
                flashVersion = fv.major + '.' + fv.minor + ' r' + fv.release;
            }
            else  {
                flashVersion = unknown;
            }
        }
    }
 
    var splitSize = screenSize.split("x");
    var xSize = 0;
    var ySize = 0;
    if(splitSize != null && splitSize.length == 2) {
        xSize = splitSize[0];
        ySize = splitSize[1];
    }
 
    var deviceType = "PC";
    if(mobile) {
        deviceType = "Mobile";
        if(xSize >= 480) {
            deviceType = "Tablet";
        }
    }
 
    window.jscd = {
        screen: screenSize,
        screenX: xSize,
        screenY: ySize,
        browser: browser,
        browserVersion: version,
        mobile: mobile,
        deviceType: deviceType,
        os: os,
        osVersion: osVersion,
        cookies: cookieEnabled,
        flashVersion: flashVersion
    };
}(this));

/*network connection check*/
var checkNetworkConnection = function(success, failure) {
        var file = 'http://' + DOMAIN
				+ '/Images/Kangle/Knowledge_Evaluation.png';
		
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
};
/*network connection check*/

/*user access change*/
document.addEventListener("online", online, false);

function online() {
	var lastonline = new Date();
	var onlinedate = window.localStorage.getItem("lastonlinedate");
	var lastonlinedate = lastonline.getTime();
	//alert(lastonlinedate +'onlinedate'+ onlinedate);
	if(lastonline == '' || lastonline == null) {
		var lastonlinedate = window.localStorage.setItem("lastonlinedate",lastonlinedate);	
	} else {
		var lastonlinedate = window.localStorage.setItem("lastonlinedate",lastonlinedate);
	}
};

