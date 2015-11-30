var kaHeader = {
    friendRequestInterval: 300000,
    notificationDatas: null,
    feedDatas: null,
    isResponded: [],
    init: function () {
        var _this = this;
        var imgUrl = 'online/images/profile_icon.png';
        if(coreNET.isConnected()){
			imgUrl = Services.defaults.myProfileURL;
		}
        $('#li-dvUserName').css('background', 'url("' + imgUrl + '") no-repeat top left');
        $('#li-dvUserName').css('background-size', '35px 35px');
        $('#li-dvUserName').html(Services.defaults.displayName.toProperCase());
        $('#li-dvUserName').bind('click', function(e) {
        	window.location.href = 'Rxbook/UserProfile.Mobile.html';
        });
        this.startCommonThread();
    },
    startCommonThread: function() {
        var _this = this;
        _this.getFeeds();
        _this.getNotifications();
        setInterval(function () {
            _this.getNotifications();
            //_this.getFeeds();
        }, _this.friendRequestInterval);
        pubnub.bindChat = _this.bindFeedsCountByMessages;
    },
    getNotifications: function () {
        var _this = this;
        Services.getActionMsg(Services.defaults.userId, function (data) {
            _this.createNotificationMenu(data);
        }, function () { });
    },
    createNotificationMenu: function (data) {
        var _this = this;
        var el = $('#pop-requests').parents('li').eq(0);
        if(data && data.length == 0) {
        	$('span', el).html('').hide();
        	_this.arrowPopup(data);
        	return;
        } else {
	        if (_this.notificationDatas == null || (JSON.stringify(_this.notificationDatas) != JSON.stringify(data))) {
	            _this.notificationDatas = data;
	            var cnt = 0;
	            for (var i = 0; i <= data.length - 1; i++) {
	                if (data[i].Is_Responded == 0) {
	                    cnt += 1;
	                    _this.isResponded.push(data[i].Id);
	                }
	            }
	            if(cnt > 10) 
	            	$('span', el).html("10+").show();
	            else if(cnt > 0)
	                $('span', el).html(cnt).show();
	            else
	                $('span', el).html('*').show();
	            _this.arrowPopup(data);
	        } 
        }
    },
    arrowPopup: function(data) {
    	var _this = this;
    	var requestsPopup = new ArrowPopup($('#pop-requests'), {
            container: "headersection",
            title: 'Friend Requests',
            offset: -125,
            width: 350,
            bodyDiv: "requests",
            type: 'ap-actions',
            backgroundCss: '#1F1F1F',
            contents: data,
            onAccept: function (topic) {
                Services.acceptInvite(Services.defaults.userId, topic.Topic_Id, topic.Message_Id, function (data) {
                    _this.getNotifications();
                }, null);
                return false;
            },
            onReject: function (topic) {
                Services.rejectInvite(Services.defaults.userId, topic.Topic_Id, topic.Message_Id, function (data) {
                    _this.getNotifications();
                }, null);
                return false;
            },
            onSuccess: function () {
                if (_this.isResponded != null && _this.isResponded.length > 0) {
                    var userFeedIds = {
                        feedId: _this.isResponded
                    };
                    Services.updateIsRespond(userFeedIds, function (data) {
                        _this.isResponded = [];
                        //_this.getNotifications();
                    }, function (e) { });
                }
            }
        });
    },
    getFeeds: function () {
        var _this = this;
        Services.getUnReadMessagesCount(Services.defaults.userId, function (data) {
            var cnt = 0;
            for (var i = 0; i <= data.length - 1; i++) {
                cnt += data[i].messageCount;
            }
            var el = $('#pop-feeds').parents('li').eq(0);
            if(cnt > 10)
            	$('#messagesCount').html('10+').show();
            else if(cnt > 0)
                $('#messagesCount').html(cnt).show();
            else
                $('#messagesCount').html(0).hide();
        }, function (e) { });
        /*Services.getActionMsg(Services.defaults.userId, function (data) {
            _this.createFeedsMenu(data);
        }, function () { });*/
    },
    bindFeedsCountByMessages: function(messages) {
    	var cnt = 0;
        for (var i = 0; i <= messages.length - 1; i++) {
            cnt += 1;
        }
        var msgCountSpan = $('#messagesCount');
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
    createFeedsMenu: function (data) {
        var _this = this;
        if (_this.feedDatas == null || (JSON.stringify(_this.feedDatas) != JSON.stringify(data))) {
            _this.feedDatas = data;
            var notifPopup = new ArrowPopup($('#pop-feeds'), {
                container: "headersection",
                title: 'Notifications',
                offset: 80,
                width: 350,
                bodyDiv: "feeds",
                type: 'ap-notification',
                backgroundCss: '#1F1F1F',
                contents: [{
                    Profile_Photo_BLOB_URL: '/Images/dp/km.jpg',
                    Message_Text: '<b>Kamaraj029</b> likes your comment: \'Good E-Learning Material...\'',
                }, {
                    Profile_Photo_BLOB_URL: '/Images/dp/km.jpg',
                    Message_Text: '<b>Kamaraj029</b> updated his status',
                    Suffix: 'Chennai'
                }],
                onAccept: function (topic) {
                    Services.acceptInvite(Services.defaults.userId, topic.Topic_Id, topic.Message_Id, function (data) {
                        console.log(data);
                        _this.getNotifications();
                    }, null);
                    return false;
                }
            });
        }
    }
};