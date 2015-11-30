var page = {
    subDomainName: '',
    init: function (userId, subDomainName) {
        page.subDomainName = subDomainName;
        activities.init(userId);
        page.bindHeader(userId);
        page.getUnreadCounts(userId);
        /*Services.checkKangleUserMenuAccess(userId, function(data) {
        	
        	if(data >= 1) {
        		$("#assetUpload").show();
        	}
        }, function() {});*/ //commented on 10 august for user access
        
        Services.getCustomerKangleModuleAccess(function(data){
            if(data >= 1){
                $("#assetUpload").show();
             }
         }, function(){
         });
        
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
        
        //page.getMeetingCount(userId);

        /*window.setInterval(function () {
            page.getUnreadCounts(userId);
        }, 300000);*/
        
        
        pubnub.bindChat = page.bindFeedsCountByMessages;
    },
    bindHeader: function (userId) {
    	var user = JSON.parse(window.localStorage.getItem('user'));
    	if(user != undefined){
    		$('header nav li.profile-name a').html(user.userName).attr('href', '#');
    	}
    	setTimeout(function(){
    		$('#logout').css('display','block');
    	}, 5000);
    	
    	Services.defaults.userId = userId;
    	rxBookInit.enableCurUserInfo(function (userInfo) {
    		page.getMeetingCount(Services.defaults.userId);
    		page.getActiveCourseCount(Services.defaults.userId);
            
            window.localStorage.setItem("userName", Services.defaults.displayName);
            var userName = Services.defaults.displayName.toProperCase();
            $('header nav li.profile-name a').html(userName).attr('href', 'Rxbook/UserProfile.Mobile.html');
            
            var userDetails = Services.defaults.myProfileURL;
            //alert(userDetails);
            $('#user_img').attr('onerror','page.defaultProfilePic(this, "online/images/profile_icon.png");');
            if (userDetails != null && userDetails != '' && userDetails != undefined) {
                $('#user_img').attr('src', userDetails);
            } else {
                $('#user_img').attr('src','online/images/profile_icon.png');
            }
            
    	 }, function(e) { });
	     //page.showPopup();
	     /*$('.icon-settings a').unbind('click').bind('click', function () {
	         page.showPopup();
	         return false;
	     });*/
	     var url = window.localStorage.getItem("companyLogoUrl");
	     $('header nav .company_logo .cmpnylogo').css({'background-image':'url('+url+')',
	                                       'background-position': '0% 50%',
	                                       'background-repeat': 'no-repeat',
	                                       'background-size': '100%'});
     },
    
     defaultProfilePic: function(element, imgPath) {
    	 $(element).attr("onerror", "");
    	 $(element).attr("src", imgPath);
     },
    getMeetingCount: function(userId){
        var context = ['Meeting', 'getCurrentMeetingCount', page.subDomainName, Services.defaults.companyId, userId];
        CoreREST.get(this, context, null, function (data) {
            if (data && data > 10)
            	$('.meet-count').show().html("10+");
            else if (data && data > 0) {
                $('.meet-count').show().html(data);
            } else {
                $('.meet-count').hide();
            }
        }, function () { });
    },
    /*CourseCount*/
    getActiveCourseCount: function(userId){
        var context = ['UserApi', 'getActiveCourseCount', page.subDomainName, Services.defaults.companyId, userId];
        CoreREST.get(this, context, null, function (data) {
            if (data && data > 0) {
                if(data > 10) {
                    $('.course-count').show().html('10+');
                } else {
                    $('.course-count').show().html(data);
                }
            } else {
                $('.course-count').hide();
            }
        }, function () { });
    },
    /*CourseCount*/
    getUnreadCounts: function (userId) {
        Services.getUnReadMessagesCount(userId, function (topics) {
            if (topics && topics.length > 0) {
                var totCount = 0;
                for (var i = 0; i < topics.length; i++) {
                    var curTopic = topics[i];
                    totCount += curTopic.messageCount;
                    
                    if(totCount > 10)
                    	$('.notf-count').show().html("10+");
                    else if (totCount > 0)
                    	$('.notf-count').show().html(totCount);
                    else
                    	$('.notf-count').hide();
                }
            } else {
                $('.notf-count').hide();
            }
        }, function () { });
    },
    bindFeedsCountByMessages: function(messages) {
    	var cnt = 0;
        for (var i = 0; i <= messages.length - 1; i++) {
            cnt += 1;
        }
        var msgCountSpan = $('.notf-count');
        var curCnt = msgCountSpan.text();
        if(curCnt != null && curCnt == "" || curCnt == 0) {
        	curCnt = cnt;
		} else if(curCnt < 10) {
			curCnt = parseInt(curCnt);
			curCnt += cnt;
		} else {
			curCnt = "10+";
		}
        msgCountSpan.show().html(curCnt);
    },
    /*showPopup: function () {
        var arrowPopup = new ArrowPopup($('.icon-settings a span'), {
            container: "hdr-wrap",
            bodyDiv: "settings",
            contents: [
                {
                    displaytitle: "Change Password",
                    iconclass: 'arrow-wire',
                    onclick: function () {
                        //RedirectWire();
                        window.location.href = '/ChangePassword/Index'
                    },
                    isVisible: true
                }, {
                    displaytitle: "Logout",
                    iconclass: 'arrow-exit',
                    onclick: function () {
                        //window.location.href = '/Home/LogOff';
                        $.ajax({
                            type: "POST",
                            url: '../Home/LogOff/',
                            data: "A",
                            success: function (returnURL) {
                                if (returnURL != null && returnURL != "" && returnURL.length > 0) {
                                    window.location.href = "http://" + returnURL;
                                }
                                else {
                                    window.location.href = "../Home/SessionExpiry/";
                                }
                            }
                        });
                    },
                    isVisible: true
                }
            ]
        });
    }*/
};

var activities = {
    init: function (userId) {
        activities.getUserActivities(userId);
    },
    getUserActivities: function (userId) {
        Services.getActivityStream(userId, 0, function (data) {
            console.log(data);
            activities.bindUserActivities(data);
        }, null);
    },
    bindUserActivities: function (data) {
        var el = $('#activity-ilst');
        el.empty();
        if (data && data.length > 0) {
            var activityLength = data.length;
            activityLength = activityLength > 10 ? 10 : activityLength;
            var content = '';
            for (var i = 0; i < activityLength; i++) {
            	content = '<div class="activity">';
                content += '<div class="activityImg"><img class="cls_img_user_profile" alt="" src="' + (data[i].Profile_Photo_BLOB_URL != null ? data[i].Profile_Photo_BLOB_URL : Services.defaults.defaultThumbnail) + '"></div> ';
                content += '<div class="activityMsg"><p>' + data[i].Message_HTML + '</p><p>' + data[i].timestampFormatted + '</p></div>';
                content += '</div>';
                
                var $content = $(content);
                
                var anchorProfiles = $content.find('.activityMsg a.clsFriends');
                for(var j=0;j<=anchorProfiles.length - 1; j++) {
                	var anchorProfile = $(anchorProfiles.get(j));
                	anchorProfileHref = anchorProfile.attr('href');
                    
                    if(anchorProfileHref != null){
                        var splittedHref = anchorProfileHref.split('/');
                        if(splittedHref.length > 0)
                        	anchorProfile.attr('href', 'Rxbook/UserProfile.Mobile.html?userId=' + splittedHref[splittedHref.length-1]);
                    }
                }
                
                if ($content.find('.clsTopics').length > 0) {
                    $content.find('.clsTopics').bind('click', function (e) {
                        var _this = this;
                        Services.getTopicById(Services.defaults.userId, $(_this).data('topicid'), function (data) {
                            var topic = data;
                              if(topic != null && topic.subscriptions != null && topic.subscriptions.length > 0) {
                              window.location.href = 'Rxbook/GroupMembers.Mobile.html?topicId=' + topic.Topic_Id;
                              }else{
                                  alert("No users subscribed to this group");
                              }
                        }, function (e) { alert('Unable to fetch data.'); });
                        return false;
                    });
                }

                if ($content.find('.clsFeeds').length > 0) {
                    $content.find('.clsFeeds').bind('click', function (e) {
                        var _this = this;
                        Services.getFeedByFeedMasterId(Services.defaults.userId, $(_this).data('feedid'), function (data) {
                            if (data != null && data.length > 0) {
                                //rxCommon.bindPostPopup(data[0]);
                                //ShowModalPopup('dvPostOverlay');
                               window.location.href = 'Rxbook/FeedDetails.Mobile.html?feedId=' + (data[0].Id);

                            }
                            return false;
                        }, function (e) { alert('Unable to fetch data.'); });
                        return false;
                    });
                }
                el.append($content);
            }
        } else {
            el.html('<p>No activities found</p>');
        }
    }
};

/*help text*/
var assetHelp = {};
assetHelp.showHelpText = function () {
    var imageUrl = "../images/help/helper-landing-1024.png";
    var helps = [{
                     right: "5px",
                     top: "65px",
                     arrowLeft: "265px",
                     message: "Access your settings and controls.",
                     title: null
                 }, {
                     right: "75px",
                     top: "65px",
                     arrowLeft: "53px",
                     message: "Your information hub.",
                     title: null
                 },{
                     left: "5px",
                     top: "515px",
                     downArrow: true,
                     arrowLeft: "15px",
                     message: "Contact our support.",
                     title: null
                 },{
                     right: "65px",
                     top: "65px",
                     arrowLeft: "15px",
                     message: "Get this help any time.",
                     title: null
                 }];
    var isLandscape = false;
    if (window.innerHeight > window.innerWidth) {
        isLandscape = false;
    } else {
        isLandscape = true;
    }
    if ($(window).width() >= 1006) {
        imageUrl = "../images/help/helper-landing-1024.png";
    } else if ($(window).width() >= 768 && $(window).width() < 1024) {
        imageUrl = "../images/help/helper-landing-768.png";
        helps[0].right = "15px";
        helps[0].top = "55px";
        helps[1].right = "25px";
        helps[1].top = "55px";
        helps[1].arrowLeft = "100px";
        helps[2].top = "475px";
        helps[3].right = "15px";
        helps[3].top = "55px";
        helps[3].arrowLeft= "55px";
        
    } else if ($(window).width() >= 640 && $(window).width() < 768) {
        imageUrl = "../images/help/helper-landing-600.png";
        helps[0].right = "60px";
        helps[1].arrowLeft = "50px";
        helps[2].top = "485px";
        helps[3].right = "25px";
    } else if (($(window).width() == 600 || $(window).width() == 601 || $(window).width() == 960) && $(window).height() <= 1000) {
       imageUrl = "../images/help/helper-landing-600.png";
       helps[0].right = "65px";
       helps[1].arrowLeft = "100px";
       helps[2].top = "485px";
       helps[3].right = "25px";
   } else if (isLandscape) {
       imageUrl = "../images/help/helper-landing-480.png";
       helps[0].arrowLeft = "248px";
       helps[0].right = "0px"
       helps[1].arrowLeft = "130px";
       helps[1].right = "57px";
       helps[2].top = "205px";
       helps[3].right = "15px";
       helps[3].arrowLeft = "58px";      
   } else {
       imageUrl = "../images/help/helper-landing-320.png";
       helps[0].arrowLeft = "248px";
       helps[1].arrowLeft = "75px";
       helps[1].right = "5px";
       helps[2].top = "365px";
       helps[3].right = "3px";
       helps[3].arrowLeft = "45px";
   }
    var $img = $("<img>");
    $img.load(function () {
              webHelper.loadHelpPopup(imageUrl, helps, assetHelp.beforeShow, assetHelp.afterClose);
    }).attr("src", imageUrl);
};
assetHelp.afterClose = function () {
    //$(".page").show();
    //$(".helper-wrapper-main").remove();
    //$('body').removeClass("helperlowerheight").css("overflow", "auto");
};
assetHelp.beforeShow = function () {
    //$(".page").hide();
    //$('body').addClass("helperlowerheight").css("overflow", "hidden");
};
var assetHelpadmin = {};
assetHelpadmin.showHelpText = function () {
    var imageUrl = "../images/help/helper-admin-landing-1024.png";
    var helps = [{
                     right: "5px",
                     top: "65px",
                     arrowLeft: "265px",
                     message: "Access your settings and controls.",
                     title: null
                 }, {
                     right: "75px",
                     top: "65px",
                     arrowLeft: "53px",
                     message: "Your information hub.",
                     title: null
                 },{
                     left: "5px",
                     top: "515px",
                     downArrow: true,
                     arrowLeft: "15px",
                     message: "Contact our support.",
                     title: null
                 },{
                     //left: "5px",
                	 rigth:"95",
                     top: "65px",
                     arrowLeft: "15px",
                     message: "Add/Upload files.",
                     title: null
                 },{
                     //left: "5px",
                	 right:"85",
                     top: "65px",
                     arrowLeft: "15px",
                     message: "Get this help any time.",
                     title: null
                 }];
    
    var isLandscape = false;
    if (window.innerHeight > window.innerWidth) {
        isLandscape = false;
    } else {
        isLandscape = true;
    }
    if ($(window).width() >= 1006) {
        imageUrl = "../images/help/helper-admin-landing-1024.png";
    } else if ($(window).width() >= 768 && $(window).width() < 1024) {
        imageUrl = "../images/help/helper-admin-landing-768.png";
        helps[0].right = "15px";
        helps[0].top = "55px";
        helps[1].right = "25px";
        helps[1].top = "55px";
        helps[1].arrowLeft = "100px";
        helps[2].top = "475px";
        helps[3].right = "7px";
        helps[3].arrowLeft = "15px";
        helps[3].top = "55px";
        helps[4].top = "55px";
        helps[4].right = "15px";
        helps[4].arrowLeft = "55px";
        
    } else if ($(window).width() >= 640 && $(window).width() < 768) {
        imageUrl = "../images/help/helper-admin-landing-600.png";
        helps[0].right = "60px";
        helps[1].arrowLeft = "50px";
        helps[2].top = "485px";
        helps[3].right = "44px";
        helps[3].arrowLeft = "3px";
        helps[4].right = "25px";
        
    } else if (($(window).width() == 600 || $(window).width() == 601 || $(window).width() == 960) && $(window).height() <= 1000) {
        imageUrl = "../images/help/helper-admin-landing-600.png";
        helps[0].right = "65px";
        helps[1].arrowLeft = "100px";
        helps[2].top = "485px";
        helps[3].right = "44px";
        helps[3].arrowLeft = "3px";
        helps[4].right = "25px";     
    } else if (isLandscape) {
        imageUrl = "../images/help/helper-admin-landing-480.png";
        helps[0].arrowLeft = "248px";
        helps[0].right = "1px"
        helps[1].arrowLeft = "75px";
        helps[1].right = "2px";
        helps[2].top = "205px";
        helps[3].right = "35px";
        helps[3].arrowLeft = "45px";
        helps[4].right = "15px";
        helps[4].arrowLeft = "58px";
    } else {
        imageUrl = "../images/help/helper-admin-landing-320.png";
        helps[0].arrowLeft = "248px";
        helps[1].arrowLeft = "75px";
        helps[1].right = "5px";
        helps[2].top = "365px";
        helps[3].right = "15px";
        helps[3].arrowLeft = "22px";
        helps[4].right = "15px";
        helps[4].arrowLeft = "55px"; 
    }
    var $img = $("<img>");
    $img.load(function () {
        webHelper.loadHelpPopup(imageUrl, helps, assetHelp.beforeShow, assetHelp.afterClose);
    }).attr("src", imageUrl);
};
assetHelp.afterClose = function () {
    //$(".page").show();
    //$(".helper-wrapper-main").remove();
    //$('body').removeClass("helperlowerheight").css("overflow", "auto");
};
assetHelp.beforeShow = function () {
    //$(".page").hide();
    //$('body').addClass("helperlowerheight").css("overflow", "hidden");
};
/*help text*/

heightWindow = function (){
		var wheight = $(window).height();
		var pheight = $("#app_version .pop_text").height();
		var ptop_con = wheight-pheight;
		var ptop = ptop_con/2;
		
		$("#app_version .pop_text").css("top",ptop);
};