var friends = {
    init: function () {
        $('#menu-friends').addClass('active');
        friends.getFriends();
    },

    getFriends: function () {
        Services.getTopics(Services.defaults.userId, function (data) {
            friends.bindFriends(data);
        }, function (e) { });
    },

    bindFriends: function (data) {
        var friendsList = $('#friendsList');
        friendsList.empty();
        var hasFriends = false;
        if (data != null && data.length > 0) {
            var isEmpty = true;
            $.each(data, function (index, value) {
                var subscriber = rxCommon.getCurrentUserFromSubscriptions(value.subscriptions);
                var friend = rxCommon.getFriendFromSubscriptions(value.subscriptions);
                if (friend != null && friend.isActive && !friend.isRemoved && subscriber != null && subscriber.isActive && !subscriber.isRemoved) {
                    isEmpty = false;
                    var content = $('<div class="friendsDetail"></div>');
                    var thumb = $('<div class="friendImg"><img class="cls_img_user_profile" alt="" src="' + (value.User_Profile_Pic!=null?value.User_Profile_Pic:Services.defaults.defaultThumbnail) + '"></div>');
                    var friendText = $('<div class="friendMsg"><p>' + value.Display_Name + '</p></div>');

                    var profileBtn = $('<input class="frnd-buttons" type="button" onclick="" value="Profile" />');
                    profileBtn.bind('click', function (e) {
                        window.location.href = '/RxBook/Profile/' + value.User_Id;
                    });
                    var messageBtn = $('<input class="frnd-buttons" type="button" onclick="" value="Chat" />');
                    messageBtn.bind('click', function (e) {
                        window.location.href = '/RxBook/Messages/' + value.Topic_Id;
                    });
                    var unFriendBtn = $('<input class="frnd-buttons" type="button" onclick="" value="Unfriend" />');
                    unFriendBtn.data('topic', value);
                    unFriendBtn.bind('click', function (e) {
                        friends.removeFriend($(this).data('topic'));
                    });
                    content.append(thumb);
                    content.append(friendText);
                    content.append('<div style="clear: both;"></div>');
                    var btnDiv = $('<div style="float: right;"></div>');
                    btnDiv.append(profileBtn);
                    btnDiv.append(messageBtn);
                    btnDiv.append(unFriendBtn);
                    content.append(btnDiv);
                    friendsList.append(content);
                }
            });
            if (isEmpty) {
                friendsList.html('<div class="empty" style="padding: 10px;">No Friends</div>');
            }
        } else {
            friendsList.html('<div class="empty" style="padding: 10px;">No Friends</div>');
        }
    },

    removeFriend: function (topic) {
        var friend = rxCommon.getFriendFromSubscriptions(topic.subscriptions);
        Services.removeTopic(Services.defaults.userId, topic.Topic_Id, friend.userId, function (data) {
            friends.getFriends();
        }, function (e) { });
    }
};