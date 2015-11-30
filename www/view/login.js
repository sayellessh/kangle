var loggedin = false;
var userLogin = {
	loginRequired : false,
	registrationSucessful : false,
    bStart : false,
    macAddress : null,
	init : function() {
        //alert("init");
        if(userLogin.bStart)
            return false;
        userLogin.bStart = true;
        //window.MacAddress.getMacAddress(function(macAddress) {
            //alert(macAddress);
            //userLogin.macAddress = macAddress ;
            //$('.loginPage').screenCenter();
            //$('.version').text(resource.application.version + "." + resource.application.release)
            var taskSpecifications = [
                {firstTask : userLogin.isUserLoggedIn, secondTask : userLogin.redirect}
            ];
            var taskUtil = new TaskUtil(taskSpecifications);
            taskUtil.execute(userLogin, {}, function(data){
            }, function(data){
            	hideLoading();
            });
        //});
	},
	

	isUserLoggedIn: function(context, data, success, failure){
		userLogin.invalid = false;
		showLoading('Loading...');
		userLocalDAO.get(function(user){
			if(user !=null && user.ssoId !=null){
				$('#index-baner').hide();
				showLoading('Loading...');
				eLearningAPP.currentUser = user;
                
				if(coreNET.isConnected()){
                         success(user);
				}else{
					success(user);
				}				
			}else{
				$('#index-baner').show();
                //userLogin.invalid = true;
				success(null);
			}
		}, failure);
	},
	
	redirect : function(context, data, success, failure) {
		if(data != null){
			userLogin.gotoHome(data);
		} else if (userLogin.invalid == true){
			$('#index-baner').show();
			hideLoading();
		} else {
			if(coreNET.isConnected()){
				hideLoading();
			} else {
				hideLoading();
				$('#index-baner').show();
				alert(resource.networkMessage.noNetwork);
			}
		}
		success();
	},
	
	login : function() {
		if(coreNET.isConnected()){
			var userName  = $('#first_name').val().trim().toLowerCase();
			var password = $('#input-password').val().trim();
			var url = $('#company_name').val().trim().toLowerCase();
			if(url != 'localhost') {
	            var keys = url.split('.');
	            if(keys.length < 3) {
	                $('#company_name').val(url + '.kangle.me');
	            } else {
	                $("#company_name").val(url);
	            }
	        } else {
	            $("#company_name").val(url);
	        }
			var url = $('#company_name').val().trim().toLowerCase();
			showLoading('Login is in progress...');
			
			finished = false;
			
			setTimeout(function(){
				if(!finished) {
					userLogin.redirectError();
				}
			}, 15000);
			
			setTimeout(function() {
				var logedIn = userRemoteDAO.login(userName, password, url);
				if (logedIn){
					window.localStorage.setItem("localUserInfo", "null")
					var user = userRemoteDAO.get(userName, url);
					
					//Is_HiDoctor_Customer;
//			        var HDresultvalue = user.isHidoctorCustomer;
//			        console.log('resultvalue' + HDresultvalue);
//			        window.localStorage.setItem('hidoctorcustomer',HDresultvalue);
					
					var userDivision =  userDivisionRemoteDAO.get(resource.correlationId, user.companyId, user.companyCode, user.userCode);
					finished = true;
	                if(userDivision != null && userDivision.length > 0){
						user.divisionCode = userDivision[0].divisionCode;
						user.divisionName = userDivision[0].divisionName;
					}
					user.userName = userName;
					user.password = password;
					user.url = url;
					var downloaded = false;
					var taskSpecifications = [
					                          {firstTask : userLogin.saveUserInfo },
					                          ];
					var taskUtil = new TaskUtil(taskSpecifications);
					taskUtil.execute(userLogin, user, function(data){
						
						var taskSpecifications = [
						                          {firstTask : logoDownloadService.getClientLogoURL, secondTask : logoDownloadService.downloadLogo}
						                         ];
						var taskUtil = new TaskUtil(taskSpecifications);
						var data = {
								correlationId : resource.correlationId,
								companyCode : user.companyCode,
								subdomainName : user.url
						};
						taskUtil.execute(null, data, function(data){
						//if(data) {
							//downloaded = true;
							console.log('success logo download');
								userLogin.gotoHome(user);
							//} else if(!data && !downloaded){
								userLogin.gotoHome(user);
							//}
						}, function(data){
							console.log('fail logo download');
							userLogin.gotoHome(user);
						});
						
					}, function(data){
						alert(resource.login.failed);
						hideLoading();
					});	
				}else{
					finished = true;
					if(logedIn == null) {
						alert(resource.login.failedNetwork);
					} else {
						alert(resource.login.failed);
					}	
					hideLoading();
				}
			}, 500);
		}else{
			alert(resource.networkMessage.noNetwork);
		}
	},
	
	registerSSO : function(context, data, success, failure) {
		var user = data;
		var deviceId = userLogin.macAddress;
		//deviceId = "device1";
		var isRegistered = SSORemoteDAO.registerSSO(0, user.companyCode, user.userCode, 0, deviceId, resource.ssoDetail.appSuiteId, resource.ssoDetail.appId);
		var ssoRegistrationId = null;
		if(isRegistered == true){
			if(CoreSOAP.outputMsg !=null){
				ssoRegistrationId = CoreSOAP.outputMsg;
			}
			user.ssoId = ssoRegistrationId;
			success(user);
		}else{
			failure({});
		}
	},
	
	saveUserInfo : function(context, data, success, failure){
		showLoading('Saving user Information...');
		userLocalDAO.insert(data, success, failure);
	},
	
    gotoHome: function(user) {
    	var _this = this;
    	eLearningAPP.currentUser = user;
        window.localStorage.setItem('userId', eLearningAPP.currentUser.userId);
        window.localStorage.setItem('user',JSON.stringify(eLearningAPP.currentUser));
        window.localStorage.setItem('domainName',eLearningAPP.currentUser.url);
        window.localStorage.setItem('companyId', eLearningAPP.currentUser.companyId);
        window.localStorage.setItem('supportPhone',eLearningAPP.currentUser.supportPhone);
        window.localStorage.setItem('supportEmail',eLearningAPP.currentUser.supportEmail);
        
        var  url = "file:///sdcard/"+resource.logoFolder+"/"+resource.logoFileName + "?_t=" + new Date().getTime();
        window.localStorage.setItem('companyLogoUrl',url);
        if(coreNET.isConnected()){
            if(user.pushRegId != null && user.pushRegId != '' && user.pushRegId.length > 0) {
            	_this.redirectToHome();
            } else {
            	var finished = false;
    			setTimeout(function(){
    				if(!finished) {
    					//alert(pushRegError);
    					_this.redirectToLogin();
    				}
    			}, 15000);
            	this.registerForPush(user, function(regid) {
            		showLoading('Registering...');
            		window.MacAddress.getMacAddress(function(macAddress) {
            			if(macAddress == "00:00:00:00:00:00" || macAddress == "20:00:00:00:00:00") {
            				//alert(pushRegError);
            				_this.redirectToLogin();
            			} else {
            				//alert(macAddress);
                			var context = ["PushNotificationApi", "InsertPushNotification", user.url];
                    		//var channelName = regid.substr(regid.length - 8);
                    		var pushDetails = {
                    			Company_Id: user.companyId,
                    			User_ID: user.userId,
                    			User_Name: user.userName,
                    			Reg_ID: regid,
                    			Channel_Name: macAddress,
                    			Channel_Type: "gcm"
                    		};
                    		CoreREST.post(null, context, pushDetails, function(data){
                    			user.pushRegId = regid;
                    			finished = true;
                            	userLocalDAO.update(user, function() {
                                	_this.redirectToHome();
                                }, function(e) {
									if(user.pushRegId != null && user.pushRegId != '' && user.pushRegId.length > 0) {
										_this.redirectToHome();	
									} 
									else 
									{
										alert(pushRegError);
										_this.redirectToLogin();
									}                                	
                                });
                			}, function(data){
                				if(user.pushRegId != null && user.pushRegId != '' && user.pushRegId.length > 0) {
            						_this.redirectToHome();
            					} else {
                					alert(pushRegError);
									_this.redirectToLogin();
                				}
                			});
            			}
            		}, function(e) {
            		if(user.pushRegId != null && user.pushRegId != '' && user.pushRegId.length > 0) {
            				_this.redirectToHome();
            		} 
        			else 
            		{
						alert(pushRegError);
						_this.redirectToLogin();
            		}
            		});
                }, function(e) {
					if(user.pushRegId != null && user.pushRegId != '' && user.pushRegId.length > 0) {
						_this.redirectToHome();
					}
					else
					{
						alert(pushRegError);
						_this.redirectToLogin();
					}
                });
            }
        } else {
        if(user.pushRegId != null && user.pushRegId != '' && user.pushRegId.length > 0) {
            	_this.redirectToHome();
            } else {
            	alert(pushRegError);
            	_this.redirectToLogin();
		   	}
        }
    },
    
    redirectToLogin: function() {
		formatDeviceService.deletePhysicalDirectory(function(e) {
			var user = JSON.parse(window.localStorage.getItem("user"));
			var pushNotification = window.plugins.pushNotification;
			pushNotification.unregister(function(success) {
				window.location.href = 'login.html';
				//alert("Kangle reset successfully, app will now exit.");
				navigator.app.exitApp();
			}, function(e) { alert('Unable to delete push notification settings.'); }, {
				"channelName": user.userName
			});
		}, function() {});
	},
	redirectToHome: function() {
    	window.location.href = 'homePage.html';
    },
	redirectError: function() {
		window.location.href="error.html";
	},
    registerForPush: function(jData, success, failure) {
        azureHandler.registerForPush(jData, success, failure);
        //success();
    }
};

//$(document).ready(function(){
//	$('#username').focus(function() {
//		$('.loginPage').css("top",50);
//	});
//	$( window ).resize(function() {
//		$('.loginPage').screenCenter();
//	});
//	
//	//userLogin.init();
//});

var logoDownloadService = {
		isComplete: false,
	metadata : {
		"service" : "ELInfrastructureService"
	},
		
	getClientLogoURL : function(context, data, success, failure){
		var result = CoreSOAP.invoke(logoDownloadService, "GetClientLogo", data, "text");
		success(result);
	},
	
	downloadLogo : function(context, logoURL, success, failure){
        //var logoURL = 'http://clientlogo.blob.core.windows.net/logo/kangle.swaas.net.png';
		var logoName = resource.logoFileName;
		var downloaderUtil = new Downloader();
		showLoading('Downloading logo...');
		setTimeout(function() {
			if(logoDownloadService.isComplete == false) {
				console.log("timeout logo download.");
				success(true);
			}
		}, 20000);
		downloaderUtil.downloadFile(logoURL, resource.logoFolder, logoName, {}, function(progressStatus){
            console.log(progressStatus);
			logoDownloadService.isComplete = true;
            if(progressStatus.progress >= 100){
				console.log("prog success");
				success(true);
			}else{
				console.log("prog fail");
				var progress = progressStatus.progress;
				if (isNaN(progress) == true){
					console.log("prog isNan");
					success(false);
				} else {
					success(true);
				}
			}
		});
	}
};

var showLoading = function(message) {
	$('#loadingProgress').show();
	$('#index-banner').hide();
	if(message != null && message != '') {
		//$('#loadingProgress span').html(message);
		$('#loadingProgress').html(message);
	}
};
var hideLoading = function() {
	$('#loadingProgress').hide();
	$('#index-banner').show();
};

var newLogin = {
	    init : function() {
	        var userName = $("#first_name").val();
	        var password = $("#input-password").val();
	        var url = $("#company_name").val();
	    },
	    fnSubmit: function () {
	        if(coreNET.isConnected()) {
	            $("#btnsubmit").hide();
	            $("#dvload").show();
	            if ($.trim($("#first_name").val()) == "") {
	                $("#first_name").addClass('invalid');
	                $('.name-input').addBack('active');
	                $('.name-input').attr('data-error', 'Please enter username or email Id');
	                $("#first_name").focus();
	                $("#btnsubmit").show();
	                $("#dvload").hide();
	                return false;
	            }
	            
	            if ($.trim($("#company_name").val()) == "") {
	                $("#company_name").addClass('invalid');
	                $('.company-input').addBack('active');
	                $('.company-input').attr('data-error', 'Please enter your Company Name');
	                $("#company_name").focus();
	                $("#btnsubmit").show();
	                $("#dvload").hide();
	                return false;
	            }
	            if ($.trim($("#input-password").val()) == "") {
	                $("#input-password").addClass('invalid');
	                $('.password-input').addBack('active');
	                $('.password-input').attr('data-error', 'Please enter Password');
	                $("#input-password").focus();
	                $("#btnsubmit").show();
	                $("#dvload").hide();
	                return false;
	            }
	            
	            var EmailId = $.trim($("#first_name").val());
	            var sdVal = $("#company_name").val().trim().toLowerCase();
	            if (sdVal != 'localhost') {
	                //var keys = sdVal.split('.');
	                //if (keys.length < 3) {
	                //    $("#company_name").val(sdVal + '.kangle.me');
	                //} else {
	                //    $("#company_name").val(sdVal);
	                //}
	            } else {
	                $("#company_name").val(sdVal);
	            }
	            var subDomainName_g = $("#company_name").val();
	            var password = $.trim($("#input-password").val());
	            
	            //var APIURL = "http://"+ DOMAIN +"/";
	            var APIURL = "http://"+ DOMAIN +"/";
	            
	            var context = ['SelfSignOnApi', 'CheckUserAuthenticationLite', subDomainName_g, EmailId]
	            var postData = password;
	            CoreREST.post(APIURL, context, postData, this.bindPaging, this.onFail);
	            
	            setInterval(function(){
	                if(!loggedin) {
	                    //userLogin.redirectError();
	                	//window.location.href = 'login.html';
	                	window.location.reload();
	                }
	            }, 30000);
	        } else {
	            $("#btnsubmit").show();
	            $("#dvload").hide();
	            alert(resource.networkMessage.noNetwork);
	        }
	    },

	    bindPaging: function(result) {
	        if (result.Transaction_Status == true) {
	            loggedin = true;
	            window.localStorage.setItem("myCustomers",'');
	            userLogin.login();
	            return false;
	        }
	        else {
	            $("#btnsubmit").show();
	            $("#dvload").hide();
	            if (result.Additional_Context_More == "USER_NAME") {
	                $("#first_name").addClass('invalid');
	                $('.name-input').addBack('active');
	                $('.name-input').attr('data-error', result.Message_To_Display);
	                $("#first_name").focus();
	            }
	            else if (result.Additional_Context_More == "COMPANY_NAME") {
	                $("#company_name").addClass('invalid');
	                $('.company-input').addBack('active');
	                $('.company-input').attr('data-error', result.Message_To_Display);
	                $("#company_name").focus();
	            }
	            else if (result.Additional_Context_More == "PASSWORD") {
	                $("#input-password").addClass('invalid');
	                $('.password-input').addBack('active');
	                $('.password-input').attr('data-error', result.Message_To_Display);
	                $("#input-password").focus();
	            }
	            else {
	                $('.modal-content').html('');
	                $('.modal-content').append('<div><i class="material-icons dp48">warning</i><b class="Text-model">Alert</b></div><br><p>Dear Kangle user,</p><p>' + result.Message_To_Display + '</p>');
	                
	                $('#modal1').openModal();
	                
	            }
	        }
	        
	    },
	    onfail: function(){
	        alert("failed");
	    },
	};