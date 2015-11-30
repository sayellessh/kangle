Date.getDateString = function () {
    var dte = new Date();
    var hours = dte.getHours() > 12 ? dte.getHours() - 12 : dte.getHours();
    var zone = dte.getHours() > 12 ? 'PM' : 'AM';
    dte = (dte.getMonth() + 1) + '/' + dte.getDate() + '/' + dte.getFullYear() + ' ' + hours + ':' + dte.getMinutes() + ' ' +
    	zone;
    return dte;
};

var app = {
    notificationObject: null,
    isResponded: [],
    chatList: [],
    init: function (bRxHome) {
        //alert(bRxHome);
        //app.sideMenu();
    	
        var companyLogoUrl = window.localStorage.getItem("companyLogoUrl");
        if(companyLogoUrl === undefined || companyLogoUrl === '' || companyLogoUrl === null)
            companyLogoUrl = '';
        $('header .logo a').css({'background-image':'url('+companyLogoUrl+')',
                                'background-position': '0% 50%',
                                'background-repeat': 'no-repeat',
                                'background-size': '100%'});
        $('#notf-count, #msg-count').hide().text('');
        app.dropMenu();
        app.resetTab();
        app.postShow();
        //$(window).load(function () {
            //app.updateFriends();
        	app.getUnreadCounts();
            app.getNotifications();
            window.setInterval(function () {
                app.getNotifications();
            }, 300000);
            //app.addPublicGroups();
            //app.addPrivateGroups();
            //app.addAlertTopic();
        
            pubnub.bindChat = app.onMessageReceived;
        //});
        
        //$('header .logo a').css('background', 'url("' + companyLogoUrl + '") no-repeat center left');
        pubnub.bindUnreadMessages = app.bindUnreadCounts;
        
        /*popup settings*/
        var hdcustomer = window.localStorage.getItem('hidoctorcustomer');
        if(hdcustomer == 0){
            showChangePassword = true;
        }
        var popSettingsAry = [
            {
                displaytitle: "My Profile",
                iconclass: 'arrow-profile',
                onclick: function () {
                //window.changeActivity.change();
                window.location.href = 'UserProfile.Mobile.html';
                },
                isVisible: true
            },{
                displaytitle: "Friends",
                iconclass: 'arrow-wire',
                onclick: function () {
                //window.changeActivity.change();
                window.location.href = 'Friends.Mobile.html';
                },
                isVisible: true
            },{
                displaytitle: "Activity Stream",
                iconclass: 'arrow-wire',
                onclick: function () {
                //window.changeActivity.change();
                window.location.href = 'ActivityStream.Mobile.html';
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
                    window.location.href='../changePassword.html';
                },
                isVisible: true
            };
        popSettingsAry.push(cpAry);
        }
        
        var arrowPopup = new ArrowPopup($('#pop-settings'), {
            container: "main",
            offset: 41,
            bodyDiv: "settings",
            contents : popSettingsAry
        });
        /*home settings*/
          var arrowPopuphome = new ArrowPopup ($('#pop-home'),{
                container: "main",
                bodyDiv: "home",
                contents: [
                    {
                        displaytitle: "Kangle Home",
                        iconclass: 'arrow-wire',
                        onclick: function () {
                            //window.changeActivity.change();
                              window.location.href = '../homePage.html';
                        },
                        isVisible: true
                    },{
                        displaytitle: "Enterprise Social",
                        iconclass: 'arrow-offline',
                        onclick: function () {
                            //window.changeActivity.change();
                               window.location.href="Index.Mobile.html";
                        },
                        isVisible: true
                           }
               ]
        });
        /*popup settings*/
          
        $(".header-menu li").bind("click", function(e) {
        	var href = $(this).find("a").attr("href");
        	if(href != null && href != "" && href != "#") {
        		window.location.href = href;
        	}
        });
    },

    postShow: function () {
        //alert("s");
        $(".form-btn").hide();
        $("#create-post").focus(function () {
            $("#create-post").css("min-height", "80px");
            $(".form-btn").show();
        });
    },
    resetTab: function () {
        if ($(window).width() > 959)
            $('body').addClass('rx-tab');
        $(window).resize(function () {
            if ($(window).width() < 960) $('body').removeClass('rx-tab');
            if ($(window).width() > 959) $('body').addClass('rx-tab');
        });
        if ($(window).width() < 960) $('body').removeClass('rx-tab');
    },
    dropMenu: function () {
        $('.fa.fa-user').bind('click', function () {
            var len = $('.notification-drop').length;
            if (len == 0) {
                app.createNotificationMenu(app.notificationObject);
                $('.notification-drop').show();
            } else {
                var isShown = $('.notification-drop').css('display');
                isShown = (isShown != 'none' ? true : false);
                if (!isShown) {
                    app.createNotificationMenu(app.notificationObject);
                    $('.notification-drop').show();
                } else {
                    $('.notification-drop').hide();
                }
            }
            if ($('.notification-items').length == 0) {
                $('.notification-drop').hide();
            }
        });
        $(document).bind('click', function (e) {
            if ($(e.target).attr('class') != 'fa fa-user') {
                $('.notification-drop').hide();
            }
        });
    },
    fixNotificationCount: function () {
        if (app.isResponded != null && app.isResponded.length > 0) {
            var userFeedIds = {
                feedId: app.isResponded
            };
            Services.updateIsRespond(userFeedIds, function (data) {
                app.isResponded = [];
                app.getNotifications();
            }, function (e) { });
        }
    },
    sideMenu: function () {
        $('.side-menu a').bind('click', function () {
            var bRight = $(this).parent().hasClass('right');
            if (bRight)
                app.showRightMenu();
            else
                app.showLeftMenu();
            return false;
        });
        $('#main').bind('click', function () {
            app.showRightMenu(true);
            app.showLeftMenu(true);
            //return false;
        });
        $('header .fa.fa-weixin').bind('click', function () {
            app.showRightMenu(false);
            app.getUnReadMessagesCount();
            return false;
        });
        
        $('.side.right .fa-chevron-right').unbind('click').bind('click', function(){
            app.showRightMenu(true);
            return false;
        });
        if(navigator.userAgent.indexOf('IEMobile') > -1)
            return false;
    },
    getUnreadCounts: function () {
        Services.getUnReadMessagesCount(Services.defaults.userId, app.bindUnreadCounts, function (topics) {});
    },
                                        
    /*new Changes*/
    onMessageReceived: function(messages) {
        for(var i=0;i<=messages.length-1;i++) {
            app.bindOtherNotification(messages[i]);
            console.log(messages[i]);
        }
    },
    bindOtherNotification: function(cMessage) {
    	// bind chat notification
    	var curTopic = cMessage;
    	var topicMsgCount = $('#topic_' + curTopic.Topic_Id + ' .topic-count');
    	var topicMsgCurCnt = topicMsgCount.text();
		if(topicMsgCurCnt != null && topicMsgCurCnt == "" || topicMsgCurCnt == 0) {
			topicMsgCurCnt = 1;
		} else if(topicMsgCurCnt < 10) {
			topicMsgCurCnt = parseInt(topicMsgCurCnt);
			topicMsgCurCnt += 1;
		} else {
			topicMsgCurCnt = "10+";
		}
		topicMsgCount.show().html(topicMsgCurCnt);
        
    	// bind top notification
        var msgCount = $('#msg-count');
    	var curCnt = msgCount.text();
		if(curCnt != null && curCnt == "" || curCnt == 0) {
			curCnt = 1;
		} else if(curCnt < 10) {
			curCnt = parseInt(curCnt);
			curCnt += 1;
		} else {
			curCnt = "10+";
		}
		msgCount.html(curCnt).show();
    },
    bindUnreadCounts: function(topics) {
    	if (topics && topics.length > 0) {
            var totCount = 0,unreadIds = [];
            for (var i = 0; i < topics.length; i++) {
                var curTopic = topics[i];
                unreadIds.push(curTopic.Topic_Id);
                totCount += curTopic.messageCount;
                if (curTopic.messageCount > 10)
                	$('#topic_' + curTopic.Topic_Id + ' .topic-count').show().html("10+");
                else if(curTopic.messageCount > 0)
                	$('#topic_' + curTopic.Topic_Id + ' .topic-count').show().html(curTopic.messageCount);
                else
                	$('#topic_' + curTopic.Topic_Id + ' .topic-count').hide();
            }
            if (totCount > 10)
            	$('#msg-count').show().html("10+");
            else if(totCount > 0)
                $('#msg-count').show().html(totCount);
            else
            	$('#msg-count').hide();
            if (unreadIds && unreadIds.length > 0) {
                var newMessagesList = new Array();
                for (var i = 0; i < unreadIds.length; i++) {
                    var el = $('#main #topic_' + unreadIds[i]);
                    newMessagesList.push({ topicId: unreadIds[i], userName: $('.friend-name', el).text() });
                }
                newMessagesList = newMessagesList.sort(function (a, b) {
                                                       if (a.userName < b.userName)
                                                       return -1;
                                                       if (a.userName > b.userName)
                                                       return 1;
                                                       return 0;
                                                       });
                
                for (var i = newMessagesList.length - 1; i >= 0; i--) {
                    var el = $('#main #topic_' + newMessagesList[i].topicId),
                    cloneEl = el.clone(),
                    data = el.data('topic');
                    
                    $('#main #topic_' + newMessagesList[i].topicId).remove();
                    if ($('#main .friend-list > li').length == 0) {
                        $('#main .friend-list').append(cloneEl);
                    } else {
                        cloneEl.insertBefore($('#main .friend-list > li').eq(0));
                    }
                }
            }
        } else $('#msg-count').hide();
    },
    /*new changes*/
                                        
    addAlertTopic: function () {
        Services.getAlertTopic(Services.defaults.userId, function (groups) {
            if (groups && groups.length > 0) {
                $('#menu-alerts .sub-menu').remove();
                var $subMenuEl = $('<ul class="sub-menu"></ul>');
                var idArys = {};
                for (var i = 0; i < groups.length; i++) {
                    var curGrp = groups[i];
                    idArys[curGrp.Topic_Id] = 'topic_' + curGrp.Topic_Id;
                    var el = $('<li><a href="Messages.Mobile.html?topicId=' + curGrp.Topic_Id + '" title="">' + curGrp.Topic_Name + '<span class="topic-count" style="margin-top: -28px;">0</span></a></li>');
                    el.attr('id', idArys[curGrp.Topic_Id]).data('grpObj', curGrp);
                    $subMenuEl.append(el);
                }
                $('#menu-alerts').append($subMenuEl);
            }
        }, function () { });
    },
    /*addPublicGroups: function () {
        Services.getPublicGroups(Services.defaults.userId, function (groups) {
            if (groups && groups.length > 0) {
                $('#menu-public-group .sub-menu').remove();
                var $subMenuEl = $('<ul class="sub-menu"></ul>');
                for (var i = 0; i < groups.length; i++) {
                    var curGrp = groups[i];
                    var subs = app.getCurrentUserFromSubscriptions(curGrp.subscriptions);
                    var isActive = false;
                    if (subs != null && subs.isActive && !subs.isRemoved) {
                        var el = $('<li><a href="../../RxBook/Messages/' + curGrp.Topic_Id + '" title="">' + curGrp.Topic_Name + '<span class="topic-count" style="margin-top: -28px;">0</span></a></li>');
                        el.attr('id', 'topic_' + curGrp.Topic_Id).data('grpObj', curGrp);
                        $subMenuEl.append(el);
                    }
                }
                $('#menu-public-group').append($subMenuEl);
            }
            app.showScroll();
            app.selectGroup();
            app.getUnreadCounts();
        }, function () { });
    },*/
    
    /*public groups*/
    addPublicGroups: function () {
        Services.getPublicGroups(Services.defaults.userId, function (groups) {
            var $subMenuEl = $('.list-public');
            if (groups && groups.length > 0) {
                $subMenuEl.empty();
                var isEmpty = true;
                for (var i = 0; i < groups.length; i++) {
                    var curGrp = groups[i];
                    var subs = app.getCurrentUserFromSubscriptions(curGrp.subscriptions);
                    var isActive = false;
                    if (subs != null && subs.isActive && !subs.isRemoved) {
                    	isEmpty = false;
                        var el = $('<li><a href="Messages.Mobile.html?topicId=' + curGrp.Topic_Id + '"><span class="friend-img"><img src="' + Services.defaults.defaultPubThumbnail +
                            '" alt="" /></span><span class="friend-name" >' + curGrp.Topic_Name + '</span><span class="topic-count">0</span></a></li>');
                        el.attr('id', 'topic_' + curGrp.Topic_Id).data('grpObj', curGrp);
                        $subMenuEl.append(el);
                    }
                }
                if(isEmpty) {
                	$subMenuEl.html("<li><span class=\"friend-name\">No public groups available.</span></li>");
                }
                //$('#menu-public-group').append($subMenuEl);
            } else {
            	$subMenuEl.html("<li><span class=\"friend-name\">No public groups available.</span></li>");
            }
            //app.showScroll($subMenuEl);
            app.getUnreadCounts();
            app.fitDefaultHeight($subMenuEl);
            //app.selectGroup();
        }, function () { 
        	app.bindUserErrorFeed($(".friend-list"), networkProblemError);
        });
    },
    /*end of public grouops*/
    
    /*private groups*/
    addPrivateGroups: function () {
        Services.getPrivateGroups(Services.defaults.userId, function (groups) {
            var $subMenuEl = $('.list-private');
            if (groups && groups.length > 0) {
                $subMenuEl.empty();
                var isEmpty = true;
                for (var i = 0; i < groups.length; i++) {
                    var curGrp = groups[i];
                    var subs = app.getCurrentUserFromSubscriptions(curGrp.subscriptions);
                    var isActive = false;
                    if (subs != null && subs.isActive && !subs.isRemoved) {
                    	isEmpty = false;
                        var el = $('<li><a href="Messages.Mobile.html?topicId=' + curGrp.Topic_Id + '"><span class="friend-img"><img src="' + Services.defaults.defaultPvtThumbnail +
                            '" alt="" /></span><span class="friend-name" >' + curGrp.Topic_Name + '</span><span class="topic-count">0</span></a></li>');
                        el.attr('id', 'topic_' + curGrp.Topic_Id).data('grpObj', curGrp);
                        $subMenuEl.append(el);
                    }
                }
                if(isEmpty) {
                	$subMenuEl.html("<li><span class=\"friend-name\">No private groups available.</span></li>");
                }
                //$('#menu-public-group').append($subMenuEl);
            } else {
            	$subMenuEl.html("<li><span class=\"friend-name\">No private groups available.</span></li>");
            }
            //app.showScroll($subMenuEl);
            app.getUnreadCounts();
            app.fitDefaultHeight($subMenuEl);
            //app.selectGroup();
        }, function () {
        	app.bindUserErrorFeed($(".friend-list"), networkProblemError);
        });
    },
    
    /*end of private groups*/
    /*addPrivateGroups: function () {
        Services.getPrivateGroups(Services.defaults.userId, function (groups) {
            if (groups && groups.length > 0) {
                $('#menu-private-group .sub-menu').remove();
                var $subMenuEl = $('<ul class="sub-menu"></ul>');
                for (var i = 0; i < groups.length; i++) {
                    var curGrp = groups[i];
                    var subs = app.getCurrentUserFromSubscriptions(curGrp.subscriptions);
                    var isActive = false;
                    if (subs != null && subs.isActive && !subs.isRemoved) {
                        var el = $('<li><a href="../../RxBook/Messages/' + curGrp.Topic_Id + '" title="">' + curGrp.Topic_Name + '<span class="topic-count" style="margin-top: -28px;">0</span></a></li>');
                        el.attr('id', 'topic_' + curGrp.Topic_Id).data('grpObj', curGrp);
                        $subMenuEl.append(el);
                    }
                }
                $('#menu-private-group').append($subMenuEl);
            }
            app.showScroll();
            app.selectGroup();
            app.getUnreadCounts();
        }, function () { });
    },*/
    
    
    selectGroup: function () {
        $('#menu-private-group .sub-menu li.disabled a').unbind('click').bind('click', function () {
            return false;
        });
        var el = $('#menu-private-group .sub-menu li').not('disabled');
        $('a', el).unbind('click').bind('click', function () {
            //return false;
        });
    },
    
    /*show scroll & destroy scroll*/
    showScroll: function (el) {
        var winHgt = $(window).height() - 93, reqHgt = parseInt(winHgt/3,10);
        if (el.height() > reqHgt) {
            el.height(reqHgt);
        }
        var nicescroll = el.getNiceScroll();
        if (nicescroll.length > 0) {
            el.getNiceScroll().resize();
        } else {
            el.niceScroll();
        }
    },
    destroyScroll: function (bDestroy) {
        if (bDestroy) {
            $('.list-friends').getNiceScroll().remove();
            $('.list-private').getNiceScroll().remove();
            $('.list-public').getNiceScroll().remove();
        } else {
            app.showScroll($('.list-friends'));
            app.showScroll($('.list-private'));
            app.showScroll($('.list-public'));
        }
    },
    /*end of scroll*/
    
    /*showScroll: function () {
        $('.sub-menu').each(function () {
            if ($(this).height() > 200) {
                $(this).height(200);
            }
        });
        $('.sub-menu').niceScroll();
    },*/
    showLeftMenu: function (bClose) {

        if ($(window).width() > 959) return false;
        var menu = $('.side.left'), isHide = menu.hasClass('hide');
        if (bClose || isHide == false) {
            menu.animate({ left: '-250px' }, 100, function () { $(this).addClass('hide'); $('#page').height('auto'); });
            $('#main').animate({ left: '0px' }, 100, null);
            return false;
        } else {

            app.fitHeight(menu);
            $(window).resize(function () {
                app.fitHeight(menu);
            });
            menu.animate({ left: '0px' }, 100, function () { $(this).removeClass('hide'); });
            $('#main').animate({ left: '250px' }, 100, null);
        }
    },
    
    /*showRightMenu: function (bClose) {
        var menu = $('.side.right'), isHide = menu.hasClass('hide');
        if (bClose || isHide == false) {
            menu.animate({ right: '-250px' }, 100, function () { $(this).addClass('hide'); $('#page').height('auto'); });
            $('#main').animate({ left: '0px' }, 100, null);
            return false;
        } else {
            app.fitHeight(menu);
            $(window).resize(function () {
                app.fitHeight(menu);
            });
            menu.animate({ right: '0px' }, 100, function () { $(this).removeClass('hide'); });
            $('#main').animate({ left: '-250px' }, 100, null);
        }
    },*/
    
    /*show right menu*/
    showRightMenu: function (bClose) {
        var menu = $('.side.right'), isHide = menu.hasClass('hide'), menuWidth = menu.outerWidth();
        if (bClose || isHide == false) {
            app.destroyScroll(true);
            menu.animate({ right: '-' + menuWidth + 'px' }, 100, function () {
                 $(this).addClass('hide'); $('#page').height('auto');
            });
            $('#main').animate({ left: '0px' }, 100, null);
            return false;
        } else {
            app.fitHeight(menu);
            $(window).resize(function () {
                app.fitHeight(menu);
            });
            menu.animate({ right: '0px' }, 100, function () {
                app.destroyScroll(false);  $(this).removeClass('hide');
            });
            $('#main').animate({ left: '-' + menuWidth + 'px' }, 100, null);
        }
    },
    /*show right menu end*/
    
    fitHeight: function (menu) {
        var hgt = $('.side.left ul').outerHeight();
        if (hgt < $(window).height()) { hgt = $(window).height(); }
        $('#page').height(hgt + 'px');
        menu.height(hgt + 'px');
    },
    updateFriends: function () {
        app.getFriends(app.createFriendList);
        //window.setInterval(function () {
        //    app.getFriends(app.createFriendList);
        //}, 1000 * 30);
    },
    
    fitTabWidth: function() {
    	var docWidth = $(window).width();
    	$(".side .tab-list ul li").width(docWidth/5.5);
    },
    /* getFriends: function (onSuccess) {
        //Services.getTopics(Services.defaults.userId, function (data) {
        //    onSuccess(data);
        //}, function (e) {
            //console.log('freinds retireve error'); 
        //});
        this.getAllChatList();
    },*/
    
    /*get friends*/
    getFriends: function (onSuccess) {
        Services.getTopics(Services.defaults.userId, function (data) {
            onSuccess(data);
        }, function (e) {
        	app.bindUserErrorFeed($(".friend-list"), networkProblemError);
        });
    },
    /*get friends end*/
    
    /*createFriendList*/
    createFriendList: function (data) {
        var frndDiv = $('.side .friend-list.list-friends');
        frndDiv.html('');
        var curFrndChannels = new Array();
        if (data && data.length > 0) {
            var html = '';
            for (var i = 0; i < data.length; i++) {
                var curFrnd = data[i];
                var isActive = false, isRemoved = false;
                var scrObj = curFrnd.subscriptions;
                if (scrObj && scrObj.length > 0) {
                    var obj1 = scrObj[0], obj2 = scrObj[1];
                    isActive = (obj1.isActive && obj2.isActive ? true : false);
                    isRemoved = (obj1.isRemoved || obj2.isRemoved ? true : false);
                }
                if (!isRemoved) {
                    curFrndChannels.push(curFrnd.Subscription_User_Id);
                    html += '<li id="topic_' + curFrnd.Topic_Id + '" data-friendId="' + curFrnd.Subscription_User_Id + '"><a href="' + (isActive ? 'Messages.Mobile.html?topicId=' + curFrnd.Topic_Id : '#') + '"><span class="friend-img"><img src="' +
						(curFrnd.User_Profile_Pic != null ? curFrnd.User_Profile_Pic : Services.defaults.defaultThumbnail) +
                        '" ' + (isActive ? '' : 'class="prof-link" data-identifier="prof-' + curFrnd.Subscription_User_Id + '"') + ' alt="" /></span><span class="friend-name ' + (isActive ? '' : 'name-disable') + '">'
                        + curFrnd.Display_Name + '</span><span class="topic-count">0</span></a></li>';
                }
            }
            frndDiv.html((html == '' ? '<li><span class="friend-name">No friends found</span></li>' : html));
            
        } else {
            frndDiv.html('<li><span class="friend-name">No friends found</span></li>');
        }
        //app.showScroll(frndDiv);
        //app.destroyScroll(false);
        app.getUnreadCounts();
        //app.fitDefaultHeight(frndDiv);
        if(curFrndChannels != null && curFrndChannels.length > 0) {
            pubnub.onHerenowReceived = app.onHerenowReceived;
            pubnub.checkHerenow(curFrndChannels);
        }
        app.hideLoading();
    },
    /*createFriendList end*/
    onHerenowReceived: function(){
        // to update online status
    },
    
    /*createFriendList: function (data) {
        var frndDiv = $('.side.right .friend-list');
        frndDiv.html('');
        if (data && data.length > 0) {
            var html = '';
            for (var i = 0; i < data.length; i++) {
                var curFrnd = data[i];
                var isActive = false, isRemoved = false;
                var scrObj = curFrnd.subscriptions;
                if (scrObj && scrObj.length > 0) {
                    var obj1 = scrObj[0], obj2 = scrObj[1];
                    isActive = (obj1.isActive && obj2.isActive ? true : false);
                    isRemoved = (obj1.isRemoved || obj2.isRemoved ? true : false);
                }
                if (!isRemoved) {
                    html += '<li id="topic_' + curFrnd.Topic_Id + '" data-friendId="' + curFrnd.Subscription_User_Id + '"><a href="' + (isActive ? '../../RxBook/Messages/' + curFrnd.Topic_Id : '') + '"><span class="friend-img"><img src="' +
						curFrnd.User_Profile_Pic + '" alt="" /></span><span class="friend-name ' + (isActive ? '' : 'name-disable') + '">' + curFrnd.Display_Name
						+ '</span><span class="topic-count">0</span></a></li>';
                }
            }
            frndDiv.html((html == '' ? '<li><span class="friend-name">No friends found</span></li>' : html));
            app.getUnreadCounts();
        } else {
            frndDiv.html('<li><span class="friend-name">No friends found</span></li>');
        }
    },*/
    getNotifications: function () {
        Services.getActionMsg(Services.defaults.userId, function (data) {
            //app.createNotificationMenu(data);
            app.isResponded = [];
            /*if (data.length > 0) {
                $('#notf-count').show().text(data.length);
            } else {
                $('#notf-count').hide();
            }*/
            app.notificationObject = data;
            for (var i = 0; i < data.length; i++) {
                var notfObj = data[i];
                if (notfObj.Is_Responded == null || notfObj.Is_Responded == 0) {
                    app.isResponded.push(notfObj.Id);
                }
            }
            if (app.isResponded.length > 0) {
                $('#notf-count').show().text(app.isResponded.length);
            } else {
                $('#notf-count').show().text('*');
            }
            if(data && data.length == 0){
                $('#notf-count').hide();
            }
        }, function () { });
    },

    /*createNotificationMenu: function (data) {
        if (data && data.length > 0) {
            $('.notification-drop').remove();
            var notfEl = $('<div class="notification-drop"></div>');
            notfEl.append('<ul></ul>');
            for (var i = 0; i < data.length; i++) {
                var curEl = $('<li class="notification-items clearfix"></li>');
                var notfObj = data[i];
                curEl.data('notfObj', notfObj);
                var prfImg = '<div class="prof-img"><img src="' + (notfObj.Profile_Photo_BLOB_URL != null ? notfObj.Profile_Photo_BLOB_URL : Services.defaults.defaultThumbnail) + '" alt=""/></div>';
                var prfDesc = '<div class="prof-desc"><div class="notf-title">' + notfObj.Message_Text + '</div>' +
					'<div class="notf-request-actions"><a href="#" class="btn accept-request" >Accept</a>' +
					'<a href="#" class="btn reject-request">Reject</a></div></div>';

                curEl.html(prfImg + prfDesc);
                $('ul', notfEl).append(curEl);
            }
            $('body').append(notfEl);
        }else{
             $('.notification-drop').remove();
            var notfEl = $('<div class="notification-drop"></div>');
            notfEl.append('<ul><li style="color: #f00;" class="notification-items clearfix">Nothing found</li></ul>');
        	$('body').append(notfEl);
        	window.setTimeout(function(){
        		$('.notification-drop').remove();
        	}, 3000);
        }
        //app.dropMenu();
        app.fixNotificationCount();
        app.requestActions();
    },*/
    /*create notification menu*/
    
    createNotificationMenu: function (data) {
        if (data && data.length > 0) {
            $('.notification-drop').remove();
            var notfEl = $('<div class="notification-drop"></div>');
            notfEl.append('<ul></ul>');
            for (var i = 0; i < data.length; i++) {
                var curEl = $('<li class="notification-items clearfix"></li>');
                var notfObj = data[i];
                curEl.data('notfObj', notfObj);
                var prfImg = '<div class="prof-img"><img src="' + (notfObj.Profile_Photo_BLOB_URL != null ? notfObj.Profile_Photo_BLOB_URL : Services.defaults.defaultThumbnail) + '" alt=""/></div>';
                var prfDesc = '<div class="prof-desc"><div class="notf-title">' + notfObj.Message_Text + '</div>' +
					'<div class="notf-request-actions"><a href="#" class="btn accept-request" >Accept</a>' +
					'<a href="#" class="btn reject-request">Reject</a></div></div>';

                curEl.html(prfImg + prfDesc);
                $('ul', notfEl).append(curEl);
            }
            $('body').append(notfEl);
        } else {
            $('.notification-drop').remove();
            var notfEl = $('<div style="top: 56px; border: 1px solid #efefef; border-width: 0px 1px 1px;" class="notification-drop"></div>');
            notfEl.append('<ul><li style="text-align: center;" class="notification-items clearfix">No new request</li></ul>');
        	$('body').append(notfEl);
        	window.setTimeout(function(){
        		$('.notification-drop').remove();
        	}, 3000);
        }
        //app.dropMenu();
        app.fixNotificationCount();
        app.requestActions();
    },
    /*end of create notification menu*/
    
    
    requestActions: function () {
        var acceptBtn = $('.accept-request'),
			rejectBtn = $('.reject-request');
        acceptBtn.unbind('click').bind('click', function () {
            var pEl = $(this).parents('.notification-items').eq(0);
            var fObj = pEl.data('notfObj');
            Services.acceptInvite(Services.defaults.userId, fObj.Topic_Id, fObj.Message_Id, function (data) {
                pEl.remove();
                if ($('.notification-items').length == 0) {
                    $('.notification-drop').toggle();
                }
                if(window.location.href.indexOf('RightPanel.Friends.html') >= 0) {
                    window.location.reload();
                } else {
                    app.getNotifications();
                }
            }, null);
            //rxHome.refreshPost(fObj);
            return false;
        });
        rejectBtn.unbind('click').bind('click', function () {
            var pEl = $(this).parents('.notification-items').eq(0);
            var fObj = pEl.data('notfObj');
            Services.rejectInvite(Services.defaults.userId, fObj.Topic_Id, fObj.Message_Id, function (data) {
                pEl.remove();
                if ($('.notification-items').length == 0) {
                    $('.notification-drop').toggle();
                }
                app.getNotifications();
            }, null);
            //rxHome.refreshPost(fObj);
            return false;
        });
    },
    getCurrentUserFromSubscriptions: function (subscriptions) {
        if (subscriptions != null && subscriptions.length > 0) {
            for (var i = 0; i <= subscriptions.length - 1; i++) {
                var subscriber = subscriptions[i];
                if (Services.defaults.userId == subscriber.userId)
                    return subscriber;
            }
        }
        return null;
    },
    getFriendFromSubscriptions: function (subscriptions) {
        if (subscriptions != null && subscriptions.length > 0) {
            for (var i = 0; i <= subscriptions.length - 1; i++) {
                var subscriber = subscriptions[i];
                if (Services.defaults.userId != subscriber.userId)
                    return subscriber;
            }
        }
        return null;
    },
    
    getAllChatList: function () {
        var _this = this;
        Services.getTopics(Services.defaults.userId, function (friends) {
            _this.chatList = _this.chatList.concat(friends);
            Services.getPublicGroups(Services.defaults.userId, function (publicGroups) {
                _this.chatList = _this.chatList.concat(publicGroups);
                Services.getPrivateGroups(Services.defaults.userId, function (privateGroups) {
                    _this.chatList = _this.chatList.concat(privateGroups);
                    Services.getAlertTopic(Services.defaults.userId, function (alertGroups) {
                        _this.chatList = _this.chatList.concat(alertGroups);
                        console.log(_this.chatList);
                        _this.bindAllChatList(_this.chatList);
                    }, function (e) { });
                }, function (e) { });
            }, function (e) { });
        });
    },

    bindAllChatList: function (data) {
        var _this = this;
        var frndDiv = $('.side.right .friend-list');
        frndDiv.html('');
        if (data && data.length > 0) {
            var html = '';
            for (var i = 0; i < data.length; i++) {
                var curFrnd = data[i];
                var isActive = false, isRemoved = false;
                var scrObj = curFrnd.subscriptions;
                
                if (curFrnd.Topic_Category == 1) {
                    if (scrObj && scrObj.length > 0) {
                        var obj1 = scrObj[0], obj2 = scrObj[1];
                        isActive = (obj1.isActive && obj2.isActive ? true : false);
                        isRemoved = (obj1.isRemoved || obj2.isRemoved ? true : false);
                    }
                } else if (curFrnd.Topic_Category == 3) {
                    isActive = true;
                    isRemoved = false;
                } else {
                    var subscriber = _this.getCurrentUserFromSubscriptions(curFrnd.subscriptions);
                    isActive = (subscriber != null && !subscriber.isRemoved && subscriber.isActive) ? true : false;
                    isRemoved = (subscriber != null ? subscriber.isRemoved : true);
                }

                if (!isRemoved) {
                    var displayName = (curFrnd.Topic_Category == 1 ? curFrnd.Display_Name : curFrnd.Topic_Name);
                    
                    var displayPic = '';
                    if (curFrnd.Topic_Category == 1) {
                        displayPic = curFrnd.User_Profile_Pic != null ? curFrnd.User_Profile_Pic : Services.defaults.defaultThumbnail;
                    } else if (curFrnd.Topic_Category == 2) {
                        if(curFrnd.Is_Public)
                            displayPic = Services.defaults.defaultPubThumbnail;
                        else
                            displayPic = Services.defaults.defaultPvtThumbnail;
                    } else if (curFrnd.Topic_Category == 3) {
                        displayPic = curFrnd.User_Profile_Pic != null ? curFrnd.User_Profile_Pic : Services.defaults.defaultThumbnail;
                    }

                    html += '<li id="topic_' + curFrnd.Topic_Id + '" data-friendId="' + curFrnd.Subscription_User_Id + '"><a href="' + (isActive ? '../../RxBook/Messages/' + curFrnd.Topic_Id : '') + '"><span class="friend-img">'
                        + (curFrnd.Topic_Category == 3 ? '<div style="font-size: 24px; float: left; color: #fad160" class="fa fa-warning" href=""></div>'
                                : '<img src="' + displayPic + '" alt="" />')
                        + '</span><span class="friend-name ' + (isActive ? '' : 'name-disable') + '" >' + displayName
						+ '</span><span class="topic-count" style="margin-top: -30px;">0</span></a></li>';
                }
            }
            frndDiv.html((html == '' ? '<li><span class="friend-name">No friends found</span></li>' : html));
            
        } else {
            frndDiv.html('<li><span class="friend-name">No friends found</span></li>');
        }
         app.getUnreadCounts();
    },

    getUnReadMessagesCount: function (onSuccess) {
        var _this = this;
        Services.getUnReadMessagesCount(Services.defaults.userId, function (data) {
            if (onSuccess) onSuccess(data);
            else _this.bindUnReadMessagesCount(data);
        }, function (e) { });
    },
    bindUnReadMessagesCount: function (data) {
        var unreadIds = [];
        if (data != null && data.length > 0) {
            for (var i = 0; i <= data.length - 1; i++) {
                unreadIds.push(data[i].Topic_Id);
                var topicCntId = $('#topic-count-' + data[i].Topic_Id);
                if (topicCntId.length > 0) {
                    topicCntId.html(data[i].messageCount);
                    topicCntId.show();
                }
            }
            var lstMessageId = {
                TopicId: unreadIds
            };
            /*Services.updateMarkAllRead(Services.defaults.userId, lstMessageId, function (data) {
                app.getUnreadCounts();
            }, function (e) { });*/
        }
    },
    
    showLoading: function() {
        $('.loading').show();
    },
    hideLoading: function() {
        $('.loading').hide();
    },
    fitDefaultHeight: function(el) {
        var winHgt = $(window).height() - 93, reqHgt = parseInt(winHgt/3,10);
        if (el.height() > reqHgt) {
            el.height(reqHgt);
        }
    },
    bindUserErrorFeed: function(el, message) {
    	app.hideLoading();
    	el.html("<div class=\"error empty\"><span class=\"fa fa-warning\"> </span><p>" + message + "</p></div>");
    },
    ajaxFailure: function(e) {
    	if(e != null && e.status != 0) {
    		alert(serverError);
    	} else {
    		alert(networkProblemError);
    	}
    }
};

var searchObject = {
    inputArray: null,
    outputArray: null,
    searchByField: null,
    afterSearch: null,
    init: function (val, afterSearch) {
        if (val == '' || val == undefined) {
            alert('Enter the search string');
            return false;
        }
        searchObject.afterSearch = afterSearch;
        searchObject.searchInit(val);
    },
    searchInit: function (val) {
        val = val.toLowerCase();
        if (searchObject.inputArray != null && searchObject.inputArray.length > 0) {
            searchObject.outputArray = new Array();
            for (var i = 0; i < searchObject.inputArray.length; i++) {
                var curObj = searchObject.inputArray[i];
                var toSearch = curObj[searchObject.searchByField];
                toSearch = toSearch.toLowerCase();
                console.log(toSearch + '-' + val);
                if (toSearch.indexOf(val) > -1) {
                    searchObject.outputArray.push(curObj);
                }
            }
        }
        if (searchObject.afterSearch != null)
            searchObject.afterSearch(searchObject.outputArray);
    }
};
/*help text*/
var assetHelp = {};
assetHelp.showHelpText = function() {
    var imageUrl = "../../images/help/helper-rxbook-1024.png";
    var helps = [{
        message: "Your wall, your feeds, anywhere, any time.",
        title: null
    }, {
        message: "Share your thoughts, update your status, here.",
        title: null
    }, {
        message: "Your friends list, Your discussion groups, Click to keep in touch.",
        title: null
    }, {
        message: "Your information hub.",
        title: null
    }, {
        message: "Get this help, any time.",
        title: null
    }];
    var isLandscape = false;
    if (window.innerHeight > window.innerWidth) {
        isLandscape = false;
    } else {
        isLandscape = true;
    }
    if ($(window).width() >= 1006) {
        imageUrl = "../../images/help/helper-rxbook-1024.png";
        helps[0].top = "80px";
        helps[0].right = "370px";
        helps[0].downArrow = true;
        helps[0].arrowLeft = "15px";

        helps[1].top = "150px";
        helps[1].right = "370px";
        helps[1].downArrow = false;
        helps[1].arrowLeft = "15px";

        helps[2].top = "60px";
        helps[2].right = "5px";
        helps[2].downArrow = false;
        helps[2].arrowLeft = "225px";

        helps[3].top = "60px";
        helps[3].right = "5px";
        helps[3].downArrow = false;
        helps[3].arrowLeft = "187px";

        helps[4].top = "60px";
        helps[4].right = "5px";
        helps[4].downArrow = false;
        helps[4].arrowLeft = "110px";
    } else if ($(window).width() >= 768 && $(window).width() < 1024) {
        imageUrl = "../../images/help/helper-rxbook-768.png";
        helps[0].top = "80px";
        helps[0].right = "370px";
        helps[0].downArrow = true;
        helps[0].arrowLeft = "15px";

        helps[1].top = "150px";
        helps[1].right = "370px";
        helps[1].downArrow = false;
        helps[1].arrowLeft = "15px";

        helps[2].top = "60px";
        helps[2].right = "5px";
        helps[2].downArrow = false;
        helps[2].arrowLeft = "225px";

        helps[3].top = "60px";
        helps[3].right = "5px";
        helps[3].downArrow = false;
        helps[3].arrowLeft = "187px";

        helps[4].top = "60px";
        helps[4].right = "5px";
        helps[4].downArrow = false;
        helps[4].arrowLeft = "110px";
    } else if ($(window).width() >= 640 && $(window).width() < 768) {
        imageUrl = "../../images/help/helper-rxbook-640.png";
        helps[0].top = "80px";
        helps[0].right = "250px";
        helps[0].downArrow = true;
        helps[0].arrowLeft = "15px";

        helps[1].top = "150px";
        helps[1].right = "250px";
        helps[1].downArrow = false;
        helps[1].arrowLeft = "15px";

        helps[2].top = "60px";
        helps[2].right = "5px";
        helps[2].downArrow = false;
        helps[2].arrowLeft = "225px";

        helps[3].top = "60px";
        helps[3].right = "5px";
        helps[3].downArrow = false;
        helps[3].arrowLeft = "187px";

        helps[4].top = "60px";
        helps[4].right = "5px";
        helps[4].downArrow = false;
        helps[4].arrowLeft = "110px";
    } /*else if ($(window).width() >= 480 && $(window).width() < 640) {
    imageUrl = "../../images/help/helper-480.png";
    helps[1].right = "5px";
    helps[1].arrowLeft = "110px";
    helps[2].right = "140px";
    helps[2].downArrow = true;
    helps[2].top = "60px";
    helps[3].right = "3px";
    helps[4].right = "10px";
    }*/ else if (($(window).width() == 600 || $(window).width() == 601 || $(window).width() == 960) && $(window).height() <= 1000) {
        imageUrl = "../../images/help/helper-rxbook-600.png";
        helps[0].top = "80px";
        helps[0].right = "250px";
        helps[0].downArrow = true;
        helps[0].arrowLeft = "15px";

        helps[1].top = "150px";
        helps[1].right = "250px";
        helps[1].downArrow = false;
        helps[1].arrowLeft = "15px";

        helps[2].top = "60px";
        helps[2].right = "5px";
        helps[2].downArrow = false;
        helps[2].arrowLeft = "225px";

        helps[3].top = "60px";
        helps[3].right = "5px";
        helps[3].downArrow = false;
        helps[3].arrowLeft = "187px";

        helps[4].top = "60px";
        helps[4].right = "5px";
        helps[4].downArrow = false;
        helps[4].arrowLeft = "110px";
    } else if (isLandscape) {
        imageUrl = "../../images/help/helper-rxbook-480.png";
        helps[0].top = "80px";
        helps[0].right = "100px";
        helps[0].downArrow = true;
        helps[0].arrowLeft = "15px";

        helps[1].top = "150px";
        helps[1].right = "100px";
        helps[1].downArrow = false;
        helps[1].arrowLeft = "15px";

        helps[2].top = "60px";
        helps[2].right = "5px";
        helps[2].downArrow = false;
        helps[2].arrowLeft = "225px";

        helps[3].top = "60px";
        helps[3].right = "5px";
        helps[3].downArrow = false;
        helps[3].arrowLeft = "187px";

        helps[4].top = "60px";
        helps[4].right = "5px";
        helps[4].downArrow = false;
        helps[4].arrowLeft = "110px";
    } else {
        imageUrl = "../../images/help/helper-rxbook-320.png";
        helps[0].top = "80px";
        helps[0].right = "10px";
        helps[0].downArrow = true;
        helps[0].arrowLeft = "15px";

        helps[1].top = "150px";
        helps[1].right = "10px";
        helps[1].downArrow = false;
        helps[1].arrowLeft = "15px";

        helps[2].top = "60px";
        helps[2].right = "5px";
        helps[2].downArrow = false;
        helps[2].arrowLeft = "225px";

        helps[3].top = "60px";
        helps[3].right = "5px";
        helps[3].downArrow = false;
        helps[3].arrowLeft = "187px";

        helps[4].top = "60px";
        helps[4].right = "5px";
        helps[4].downArrow = false;
        helps[4].arrowLeft = "110px";
    }
    var $img = $("<img>");
    $img.load(function() {
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
/*help text right*/
var assetHelpfriends = {};
assetHelpfriends.showHelpTextfriends = function() {
    var imageUrl = "../../images/help/helper-rxmessage-1024.png";
    var helps = [{
        message: "Connect with your friends, see their private messages.",
        title: null
    }, {
        message: "Private groups, Productive discussion hubs.",
        title: null
    }, {
        message: "Public groups, Express your thoughts with your organization.",
        title: null
    }, {
        message: "Add, Edit or manage friends and groups.",
        title: null
    }];
    var isLandscape = false;
    if (window.innerHeight > window.innerWidth) {
        isLandscape = false;
    } else {
        isLandscape = true;
    }
    if ($(window).width() >= 1006) {
        imageUrl = "../../images/help/helper-rxmessage-1024.png";
        helps[0].top = "110px";
        helps[0].right = "605px";
        helps[0].downArrow = false;
        helps[0].arrowLeft = "15px";

        helps[1].top = "110px";
        helps[1].right = "350px";
        helps[1].downArrow = false;
        helps[1].arrowLeft = "15px";

        helps[2].top = "110px";
        helps[2].right = "110px";
        helps[2].downArrow = false;
        helps[2].arrowLeft = "15px";

        helps[3].top = "110px";
        helps[3].right = "25px";
        helps[3].downArrow = false;
        helps[3].arrowLeft = "195px";
    } else if ($(window).width() >= 768 && $(window).width() < 1024) {
        imageUrl = "../../images/help/helper-rxmessage-768.png";
        helps[0].top = "110px";
        helps[0].right = "405px";
        helps[0].downArrow = false;
        helps[0].arrowLeft = "15px";

        helps[1].top = "110px";
        helps[1].right = "210px";
        helps[1].downArrow = false;
        helps[1].arrowLeft = "15px";

        helps[2].top = "110px";
        helps[2].right = "20px";
        helps[2].downArrow = false;
        helps[2].arrowLeft = "15px";

        helps[3].top = "110px";
        helps[3].right = "5px";
        helps[3].downArrow = false;
        helps[3].arrowLeft = "195px";
    } else if ($(window).width() >= 640 && $(window).width() < 768) {
        imageUrl = "../../images/help/helper-rxmessage-640.png";
        helps[0].top = "110px";
        helps[0].right = "290px";
        helps[0].downArrow = false;
        helps[0].arrowLeft = "15px";

        helps[1].top = "110px";
        helps[1].right = "130px";
        helps[1].downArrow = false;
        helps[1].arrowLeft = "15px";

        helps[2].top = "110px";
        helps[2].right = "5px";
        helps[2].downArrow = false;
        helps[2].arrowLeft = "50px";

        helps[3].top = "110px";
        helps[3].right = "5px";
        helps[3].downArrow = false;
        helps[3].arrowLeft = "215px";
    } /*else if ($(window).width() >= 480 && $(window).width() < 640) {
    imageUrl = "../../images/help/helper-480.png";
    helps[1].right = "5px";
    helps[1].arrowLeft = "110px";
    helps[2].right = "140px";
    helps[2].downArrow = true;
    helps[2].top = "60px";
    helps[3].right = "3px";
    helps[4].right = "10px";
    }*/ else if (($(window).width() == 600 || $(window).width() == 601 || $(window).width() == 960) && $(window).height() <= 1000) {
        imageUrl = "../../images/help/helper-rxmessage-600.png";
        helps[0].top = "110px";
        helps[0].right = "250px";
        helps[0].downArrow = false;
        helps[0].arrowLeft = "15px";

        helps[1].top = "110px";
        helps[1].right = "105px";
        helps[1].downArrow = false;
        helps[1].arrowLeft = "15px";

        helps[2].top = "110px";
        helps[2].right = "10px";
        helps[2].downArrow = false;
        helps[2].arrowLeft = "70px";

        helps[3].top = "110px";
        helps[3].right = "5px";
        helps[3].downArrow = false;
        helps[3].arrowLeft = "225px";
    } else if (isLandscape) {
        imageUrl = "../../images/help/helper-rxmessage-480.png";
        helps[0].top = "110px";
        helps[0].right = "150px";
        helps[0].downArrow = false;
        helps[0].arrowLeft = "10px";

        helps[1].top = "110px";
        helps[1].right = "30px";
        helps[1].downArrow = false;
        helps[1].arrowLeft = "15px";

        helps[2].top = "110px";
        helps[2].right = "5px";
        helps[2].downArrow = false;
        helps[2].arrowLeft = "110px";

        helps[3].top = "110px";
        helps[3].right = "5px";
        helps[3].downArrow = false;
        helps[3].arrowLeft = "230px";
    } else {
        imageUrl = "../../images/help/helper-rxmessage-320.png";
        helps[0].top = "110px";
        helps[0].right = "5px";
        helps[0].downArrow = false;
        helps[0].arrowLeft = "10px";

        helps[1].top = "110px";
        helps[1].right = "5px";
        helps[1].downArrow = false;
        helps[1].arrowLeft = "90px";

        helps[2].top = "110px";
        helps[2].right = "5px";
        helps[2].downArrow = false;
        helps[2].arrowLeft = "170px";

        helps[3].top = "110px";
        helps[3].right = "5px";
        helps[3].downArrow = false;
        helps[3].arrowLeft = "250px";
    }
    var $img = $("<img>");
    $img.load(function() {
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
/*help text right*/
