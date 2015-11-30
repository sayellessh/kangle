var friends = {
    init: function () {
        friends.getFriends();
    },
    getFriends: function (onSuccess) {
        Services.getTopics(Services.defaults.userId, function (data) {
            friends.bindFriends(data);
        }, function (e) {
            //console.log('freinds retireve error'); 
        });
    },
    bindFriends: function (data) {
        var friendsList = $('.search-view ul');
        friendsList.empty();
        if (data != null && data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                var curFrnd = data[i];
                var friend = app.getCurrentUserFromSubscriptions(curFrnd.subscriptions);
                var subscriber = app.getFriendFromSubscriptions(curFrnd.subscriptions);
                if (subscriber != null && subscriber.isActive && !subscriber.isRemoved && friend != null && friend.isActive && !friend.isRemoved) {
                    var $li = $('<li></li>');
                    console.log(curFrnd);
                    var html = '<img src=" ' + (curFrnd.User_Profile_Pic!=null?curFrnd.User_Profile_Pic:Services.defaults.defaultThumbnail) + '" alt="">';
                    html += '<div>';
                    html += '<div class="friend-name">' + curFrnd.Display_Name + '</div>';
                    html += '<div class="friend-action"><a href="#" class="btn btn-profile">Profile</a>' +
        				'<a href="#" class="btn btn-chat">Chat</a>' +
        				'<a href="#" class="btn btn-unfriend">UnFriend</a></div>';
                    html += '</div>';
                    $li.data('friendObj', curFrnd);
                    $li.append(html);
                    friendsList.append($li);
                }
            }
        } else {
            friendsList.html('<li><div><span class="friend-name">No friends found</span></div></li>');
        }
        friends.bindActions();
    },
    bindActions: function () {
        $('.friend-detail ul li a.btn-profile').bind('click', function () {
            var fObj = $(this).parents('li').eq(0);
            fObj = fObj.data('friendObj');
            window.location.href = 'UserProfile.Mobile.html?userId=' + fObj.Subscription_User_Id;
        });
        $('.friend-detail ul li a.btn-chat').bind('click', function () {
            var fObj = $(this).parents('li').eq(0);
            fObj = fObj.data('friendObj');
            window.location.href = 'Messages.Mobile.html?topicId=' + fObj.Topic_Id;
        });
        $('.friend-detail ul li a.btn-unfriend').bind('click', function () {
            var fObj = $(this).parents('li').eq(0);
            fObj = fObj.data('friendObj');
            friends.removeFriend(fObj);
        });
    },
    removeFriend: function (fObj) {
        var friend = app.getCurrentUserFromSubscriptions(fObj.subscriptions);
        Services.removeTopic(Services.defaults.userId, fObj.Topic_Id, friend.userId, function (data) {
            friends.getFriends();
        }, function (e) { });
    }
};

var userSearch = {
    topicCategoryId: 1,
    selectedPrivateGroup: null,
    init: function () {
        //userSearch.searchFriends();
        userSearch.tabs(function (el, bFrnd) {
            if (bFrnd) {
                userSearch.searchFriends(el);
            } else {
                userSearch.toggleGroupContent(true);
                userSearch.createGroup(el);
            }
        });
    },
    toggleGroupContent: function (bGrpShow) {
        if (bGrpShow) {
            $('#tab-group .search-form').show();
            $('.group-friend-list').hide();
        } else {
            $('#tab-group .search-form').hide();
            $('.group-friend-list').show();
        }
    },
    searchFriends: function (mEl) {
        $(mEl + ' .search-field a').bind('click', function () {
            var val = $(mEl + ' #friend-string').val();
            if (val == undefined || val == '') {
                userSearch.showFriends([], mEl);
                return false;
            }
            Services.getDPUsers(val, Services.defaults.userId, userSearch.topicCategoryId, function (data) {
                userSearch.showFriends(data, mEl);
            }, function (e) {
                alert(e);
            });
            return false;
        });
    },
    showFriends: function (friends, mEl) {
        var friendDiv = $(mEl + ' .search-view ul');
        friendDiv.html('');
        if (friends && friends.length > 0) {
            for (var i = 0; i < friends.length; i++) {
                var curFrnd = friends[i];
                var isFriend = (curFrnd.Is_Friend == true || curFrnd.Is_Friend == "true");
                var $el = $('<li><img src="' + (curFrnd.Profile_Photo_BLOB_URL!=null?curFrnd.Profile_Photo_BLOB_URL:Services.defaults.defaultThumbnail) + '" alt="" />' + '<div><span class="friend-name">' + curFrnd.FirstName + '</span><span class="friend-desc">' + (isFriend ? 'Friend/Pending request' : '') + '</span></div>' + (isFriend ? '' : '<a href="#" title="Send request" class="btn">Send Request</a></li>'));
                $el.data('friendObj', curFrnd);
                friendDiv.append($el);
            }
            //friendDiv.html(html);
        } else {
            friendDiv.html('<li style="text-align: center; height: auto;">No friends found with the given name</li>');
        }
        userSearch.requestAction(mEl);
    },
    requestAction: function (mEl) {
        var el = $(mEl + ' .search-view ul li');
        $('.btn', el).bind('click', function (e) {
            var pEl = $(e.currentTarget).parents('li').eq(0);
            $('.btn', pEl).hide();
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

            //var _this = this;
            Services.addTopic(Services.defaults.userId, requestObj, function (data) {
                $('.btn', pEl).hide();
                //$(_this).remove();
            }, function (e) {
                alert(e);
                $('.btn', pEl).show();
            });
            return false;
        });
    },
    tabs: function (onTabChange) {
        $('.tabs li a').bind('click', function () {
            userSearch.changeTab($(this), onTabChange);

            $('.tabs li').removeClass('active');
            $(this).parent().addClass('active');
            return false;
        });
        var actEl = $('.tabs li.active a');
        userSearch.changeTab(actEl, onTabChange);
    },
    changeTab: function (curEl, onTabChange) {
        var tEl = curEl.attr('href');
        var bFrnd = (tEl == '#tab-friend' ? true : false);

        $('.tabs-cont .tabs-item').hide();
        $(tEl).show();

        if (onTabChange)
            onTabChange(tEl, bFrnd);
    },
    accordance: function () {
        $('.group-accordance h2').bind('click', function () {
            if ($(this).next().css('display') == 'block') {
                return false;
            }
            $('.group-accordance h2').removeClass('active');
            $(this).addClass('active');
            $('.group-accordance .accord-cont').hide();
            $(this).next().slideDown();
            return false;
        });
        userSearch.getPrivateGroups();
        userSearch.getPublicGroups();
    },

    /** Group Functions **/
    createGroup: function (el) {
        //userSearch.groupFriendList();
        $(el + ' .search-field a').unbind('click').bind('click', function () {
            var inp = $('input', $(this).parent());
            //create group
            var val = null;
            var isPub = false;

            if (inp.attr('id') == 'private-group') {
                val = $('#private-group').val();
                isPub = false;
            } else {
                val = $('#public-group').val();
                isPub = true;
            }

            var requestObj = {};
            requestObj.companyId = Services.defaults.companyId;
            requestObj.topicName = val;
            requestObj.topicCategory = 2;
            requestObj.isPublic = isPub;
            requestObj.isSubscriptionRequired = true;
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
            requestObj.subscriptions = subsrc;

            Services.addTopic(Services.defaults.userId, requestObj, function (data) {
                $('#private-group, #public-group').val('');
                if (isPub)
                    userSearch.getPublicGroups();
                else
                    userSearch.getPrivateGroups();
            }, function (e) {
                alert(e);
            });

            return false;
        });
        userSearch.accordance();
    },
    getPrivateGroups: function () {
        Services.getPrivateGroups(Services.defaults.userId, function (groups) {
            var el = $('#private-groups');
            el.html('');
            window.setTimeout(function () {
                $('.green-info', el.parent()).css('visibility', 'hidden');
            }, 2000);
            if (groups && groups.length > 0) {
                for (var i = 0; i < groups.length; i++) {
                    var curGrp = groups[i];
                    var subUser = userSearch.isGroupRemoved(curGrp);
                    console.log('the gorup anme ' + curGrp.Topic_Name);
                    console.log(subUser);
                    if (subUser != null && subUser.isActive && !subUser.isRemoved) {
                        var length = userSearch.parseSubscriptionLength(curGrp.subscriptions);
                        var isAdmin = (curGrp.User_Id == Services.defaults.userId ? true : false);
                        var $el = $('<li><div><span class="friend-name">' + curGrp.Topic_Name + '</span><span class="friend-desc">' + (length) +
							' Members</span></div>' +
							(!isAdmin ? '<a href="#" class="btn btn-del fa fa-remove"  title=""></a>' : '') +
							(isAdmin ? '<a href="#" class="btn btn-edit fa fa-pencil"  title=""></a>' : '') + '</li>');
                        $el.data('grpObj', curGrp);
                        el.append($el);
                    }
                }
            } else {
                el.html('<li>No groups found</li>');
            }
            //el.niceScroll();
            userSearch.privateGroupListActions(el);
        }, function () { });
    },
    parseSubscriptionLength: function (members) {
        var cnt = 0;
        for (var i = 0; i < members.length; i++) {
            //if(Services.defaults.userId != members[i].userId) {
            if (members[i].isActive)
                cnt++;
            //}
        }
        return cnt;
    },
    isGroupRemoved: function (curGrp) {
        var grpSub = curGrp.subscriptions;
        for (var i = 0; i < grpSub.length; i++) {
            if (Services.defaults.userId == grpSub[i].userId) {
                return grpSub[i];
            }
        }
        return false;
    },
    getPublicGroups: function () {
        Services.getPublicGroups(Services.defaults.userId, function (groups) {
            var el = $('#public-groups');
            el.html('');
            window.setTimeout(function () {
                $('.green-info', el.parent()).css('visibility', 'hidden');
            }, 2000);
            if (groups && groups.length > 0) {
                for (var i = 0; i < groups.length; i++) {
                    var curGrp = groups[i], length = userSearch.parseSubscriptionLength(curGrp.subscriptions);
                    var isActive = userSearch.isActiveInGroup(curGrp);
                    var $el = $('<li><div><span class="friend-name">' + curGrp.Topic_Name + '</span><span class="friend-desc">' +
						(length) + ' Members</span></div>' +
						(isActive ? '<a href="#" class="btn btn-del fa fa-remove"  title=""></a>' : '<a href="#" class="btn fa fa-plus-square"  title=""></a>') + '</li>');
                    $el.data('grpObj', curGrp);
                    el.append($el);
                }
            } else {
                el.html('<li>No groups found</li>');
            }
            //el.niceScroll();
            userSearch.publicGroupListActions(el);
        }, function () { });
    },
    isActiveInGroup: function (curGrp) {
        var grpSub = curGrp.subscriptions;
        for (var i = 0; i < grpSub.length; i++) {
            if (Services.defaults.userId == grpSub[i].userId && grpSub[i].isActive) {
                return true;
            }
        }
        return false;
    },
    privateGroupListActions: function (el) {
        $('li .btn-edit', el).unbind('click').bind('click', function () {
            var grpObj = $(this).parent().data('grpObj');
            $('.group-friend-header').html(grpObj.Topic_Name + '<span class="fa fa-remove"></span>');
            userSearch.selectedPrivateGroup = grpObj;
            userSearch.getFriendsForPrivateGroup(grpObj);
            userSearch.toggleGroupContent(false);
            return false;
        });
        $('li .btn-del', el).unbind('click').bind('click', function () {
            var r = confirm("Press Ok to unsubscribe from this group");
            if (r == true) {
                var grpObj = $(this).parent().data('grpObj');
                if (grpObj.User_Id != Services.defaults.userId) {
                    Services.removeTopic(Services.defaults.userId, grpObj.Topic_Id, Services.defaults.userId, function (data) {
                        //$('#private-groups').insertBefore('<div class="green-info">group deleted successfully</div>');
                        var $el = $('#private-groups').parent();
                        $('.green-info', $el).css('visibility', 'visible');
                        userSearch.getPrivateGroups();
                    }, function () {

                    });
                }
            }
            return false;
        });
    },
    publicGroupListActions: function (el) {
        $('li .fa-plus-square', el).unbind('click').bind('click', function () {
            var grpObj = $(this).parent().data('grpObj');
            userSearch.selectedPrivateGroup = grpObj;
            var memberObj = {};
            memberObj.Topic_Id = grpObj.Topic_Id;
            memberObj.Display_Name = Services.defaults.displayName;
            memberObj.Subscription_User_Id = Services.defaults.userId;
            var subscrObj = userSearch.groupMemberObject(memberObj, true);
            Services.addSubscription(Services.defaults.userId, grpObj.Topic_Id, subscrObj,
				function (data) {
				    userSearch.getPublicGroups();
				}, function () {
				    console.log('erro');
				});
            return false;
        });
        $('li .btn-del', el).unbind('click').bind('click', function () {
            var r = confirm("Press Ok to unsubscribe from this group");
            if (r == true) {
                var grpObj = $(this).parent().data('grpObj');
                Services.removeTopic(Services.defaults.userId, grpObj.Topic_Id, Services.defaults.userId, function (data) {
                    var $el = $('#public-groups').parent();
                    $('.green-info', $el).css('visibility', 'visible');
                    userSearch.getPublicGroups();
                }, function () { });
            }
            return false;
        });
    },
    getFriendsForPrivateGroup: function (grpObj) {
        $('.group-friend-header').unbind('click').bind('click', function () {
            userSearch.toggleGroupContent(true);
            userSearch.getPrivateGroups();
            userSearch.getPublicGroups();
            $('.group-friend-list .search-view').html('');
            return false;
        });
        Services.getTopics(Services.defaults.userId, function (friends) {
            $('.group-friend-list .search-view').html('');
            $('.group-friend-list .search-view').append('<span class="group-delete">Leave Group</span><ul></ul>');
            for (var i = 0; i < friends.length; i++) {
                var curFrnd = friends[i];
                if (curFrnd.Is_Active) {
                    var existingUser = userSearch.checkIfUserSubscribed(curFrnd, grpObj.subscriptions);
                    var $el = $('<li></li>');
                    $el.append('<img alt="" src="' + curFrnd.User_Profile_Pic + '">');
                    $el.append('<div><span class="friend-name">' + curFrnd.Display_Name + '</span><span class="friend-desc"></span></div>');
                    $el.append('<a class="btn btn-add" title="Send request" href="#">Add</a><a class="btn btn-remove" title="Send request" href="#">Remove</a>');
                    if (existingUser) {
                        if (existingUser == 'ACTIVE') {
                            $('.friend-desc', $el).text('');
                            $el.addClass('rem-mem');
                        } else {
                            $('.friend-desc', $el).text('Request is pending');
                            $el.addClass('pen-mem');
                        }
                    } else {
                        $('.friend-desc', $el).text('');
                        $el.addClass('add-mem');
                    }
                    $el.data('frndObj', curFrnd);
                    $('.group-friend-list .search-view ul').append($el);

                }
            }
            userSearch.groupRequestActions();
        }, function (e) { });
    },
    checkIfUserSubscribed: function (user, existUsers) {
        for (var i = 0; i <= existUsers.length - 1; i++) {
            if (user.Subscription_User_Id == existUsers[i].userId) {
                if (existUsers[i].isActive == true) {
                    return 'ACTIVE';
                } else {
                    return 'INACTIVE';
                }
            }
        }
        return false;
    },
    groupRequestActions: function () {
        var li = $('.group-friend-list .search-view ul li');
        $('.btn-add', li).unbind('click').bind('click', function (evt) {
            evt.preventDefault();
            $(this).hide();
            var $el = $(this).parent(), tEl = $(this);
            var memObj = $el.data('frndObj');
            $('.friend-desc', $el).text('Request Sending...');
            var subscrObj = userSearch.groupMemberObject(memObj);
            Services.addSubscription(Services.defaults.userId, userSearch.selectedPrivateGroup.Topic_Id, subscrObj,
				function (data) {
				    $el.removeClass('add-mem').addClass('pen-mem');
				    $('.friend-desc', $el).text('Request is pending');
				}, function () {
				    console.log('erro');
                     $('.friend-desc', $el).text('Error Occured');
                    $(this).show();
				});
        });
        $('.btn-remove', li).unbind('click').bind('click', function (evt) {
            evt.preventDefault();
            var $el = $(this).parent();
            var memObj = $el.data('frndObj');
            /*Services.unsubscribeMember(memObj.Subscription_User_Id, userSearch.selectedPrivateGroup.Topic_Id, function(data){
				$el.removeClass('rem-mem').addClass('add-mem');
			}, function(){});*/
            Services.removeTopic(Services.defaults.userId, userSearch.selectedPrivateGroup.Topic_Id, memObj.Subscription_User_Id,
				function (data) { $el.removeClass('rem-mem').addClass('add-mem'); }, function () { });
        });
        $('.group-delete').unbind('click').bind('click', function () {
            Services.removeTopic(Services.defaults.userId, userSearch.selectedPrivateGroup.Topic_Id, Services.defaults.userId,
				function (data) {
				    userSearch.toggleGroupContent(true);
				    userSearch.getPrivateGroups();
				}, function () { });
            return false;
        });
    },
    groupMemberObject: function (memberObj, isPublic) {
        var grpObj = {};
        grpObj.topicId = userSearch.selectedPrivateGroup.Topic_Id;
        grpObj.companyId = userSearch.selectedPrivateGroup.Company_Id;
        grpObj.topicName = userSearch.selectedPrivateGroup.Topic_Name;
        grpObj.topicCategory = 2;
        grpObj.isPublic = (isPublic && isPublic == true ? true : false);
        grpObj.isSubscriptionRequired = userSearch.selectedPrivateGroup.Is_Subscription_Required;
        grpObj.userId = Services.defaults.userId;
        grpObj.context = '';
        grpObj.additionContext = '';
        grpObj.subscriptions = new Array();
        var subMem = {};
        subMem.topicId = memberObj.Topic_Id;
        subMem.isContributor = true;
        subMem.isActive = (isPublic && isPublic == true ? true : false);
        subMem.displayName = memberObj.Display_Name;
        subMem.userId = memberObj.Subscription_User_Id;
        grpObj.subscriptions.push(subMem);

        grpObj.messages = new Array();
        var msgObj = {};
        msgObj.Company_Id = userSearch.selectedPrivateGroup.Company_Id;
        msgObj.User_Id = Services.defaults.userId;
        msgObj.Timestamp = Date.getDateString();
        msgObj.Message_Text = Services.defaults.displayName + ' invites to group ' + userSearch.selectedPrivateGroup.Topic_Name + ' Group';
        msgObj.Priority = true;
        msgObj.Delivery_Mode = 0;
        msgObj.Attachment = null;
        msgObj.Action_Required = 1;
        grpObj.messages.push(msgObj);

        grpObj.isActive = false;
        grpObj.isCurrentUserActive = true;
        grpObj.isRemoved = false;
        grpObj.isContributor = false;
        grpObj.isColleagueActive = false;
        grpObj.isOwnerActive = true;
        grpObj.isOnwer = true;
        grpObj.noOfActiveMembers = 1;
        grpObj.displayName = userSearch.selectedPrivateGroup.Display_Name;
        return grpObj;
    },
    groupMembers: function () {
        var el = $('#content .search-view ul');
        var topicId = rxBookInit.parse('topicId');
        //var topicId = window.location.href;
        //topicId = parseInt(topicId.substr(topicId.lastIndexOf('/') + 1, topicId.length));

        Services.getTopicById(Services.defaults.userId, topicId, function (data) {
            if (data !== undefined && data != null) {
                for (var i = 0; i < data.subscriptions.length; i++) {
                  var curMem = data.subscriptions[i];
                  if(curMem.isActive) {
                              el.append('<li><img src="' + (curMem.profilePicURL != null?curMem.profilePicURL :Services.defaults.defaultThumbnail) + '" alt="" />' + '<div><span class="friend-name">' +
		            curMem.displayName + '</span><span class="friend-desc">' + (data.User_Id == curMem.userId ? 'Group Admin' : 'Group Member') + '</span></div></li>');
                    }
                }
            }
        });
    },
    friends: friends
};