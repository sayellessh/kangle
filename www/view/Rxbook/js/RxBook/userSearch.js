var userSearch = {
    init: function () {
        userSearch.searchFriends();
    },
    searchFriends: function () {
        $('.search-field a').bind('click', function () {
            var val = $('#friend-string').val();
            if (val == undefined || val == '')
                return false;

            Services.getDPUsers(val, function (data) {
                userSearch.showFriends(data);
            }, function (e) { alert(e); });
            return false;
        });
    },
    showFriends: function (friends) {
        var friendDiv = $('.search-view ul');
        friendDiv.html('');
        if (friends && friends.length > 0) {
            for (var i = 0; i < friends.length; i++) {
                var curFrnd = friends[i];
                var isFriend = (curFrnd.Is_Friend == true || curFrnd.Is_Friend == "true");
                
                var $el = $('<li><a href="/User/UserProfile/' + curFrnd.UserID + '"><img src="' + (curFrnd.Profile_Photo_BLOB_URL != null ? curFrnd.Profile_Photo_BLOB_URL : Services.defaults.defaultThumbnail) + '" alt="" /></a>' +
                 '<div><span class="friend-name"><a href="/User/UserProfile/' + curFrnd.UserID + '">' + curFrnd.FirstName + '</a>' + ' - ' + curFrnd.Region_Name + '</span>' +
                 '<span class="friend-desc">' + (isFriend ? 'Friends/Pending Request' : '') + '</span>' +                 
                 '</div>' +
                 (isFriend ? '' : '<a href="#" title="Send request" class="btn">Send Request</a></li>'));
                $el.data('friendObj', curFrnd);
                friendDiv.append($el);
                $("#searchResults").getNiceScroll().resize();
            }
            //friendDiv.html(html);
        } else {
            friendDiv.html('<li style="text-align: center; height: auto;">No Friends found with the given name</li>');
        }
        userSearch.requestAction();
    },
    requestAction: function () {
        var el = $('.search-view ul li');
        $('.btn', el).bind('click', function () {
            var obj = $(this).parent().data('friendObj');
            var requestObj = {};
            requestObj.companyId = Services.defaults.companyId;
            requestObj.topicName = Services.defaults.displayName + '&' + obj.FirstName;
            requestObj.topicCategory = 1;
            requestObj.isPublic = "false";
            requestObj.isSubscriptionRequired = "true";
            requestObj.userId = Services.defaults.userId;
            requestObj.context = "";
            requestObj.additionContext = "";

            var subsrc = new Array();
            var myObj = {};
            myObj.companyId = Services.defaults.companyId;
            myObj.userId = Services.defaults.userId;
            myObj.isContributor = "true";
            myObj.isActive = "true";
            myObj.displayName = Services.defaults.displayName;
            myObj.userMood = '';
            subsrc.push(myObj);

            var frdObj = {};
            frdObj.companyId = Services.defaults.companyId;
            frdObj.userId = obj.UserID;
            frdObj.isContributor = "false";
            frdObj.isActive = "false";
            frdObj.displayName = obj.FirstName;
            subsrc.push(frdObj);
            requestObj.subscriptions = subsrc;

            var mess = new Array();
            var msgObj = {};
            msgObj.Company_Id = Services.defaults.companyId;
            msgObj.User_Id = Services.defaults.userId;
            msgObj.TimeStamp = Services.defaults.timeStamp;
            msgObj.Message_Text = Services.defaults.displayName + ' sent you a invite';
            msgObj.Delivery_Mode = 0;
            msgObj.Attachment = "";
            msgObj.Action_Required = 1;
            mess.push(msgObj);
            requestObj.messages = mess;

            console.log(JSON.stringify(requestObj));
            var _this = this;
            Services.addTopic(Services.defaults.userId, requestObj, function (data) {
                $(_this).parent().find('.friend-desc').html('Request Sent');
                $(_this).remove();
            }, function (e) { alert(e); });

            return false;
        });
    }
};
