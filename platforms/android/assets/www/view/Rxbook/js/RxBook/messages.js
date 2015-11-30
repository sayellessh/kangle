var messages = {
    topicId: 0,
    selectedTopic: 0,
    intervalId: null,
    chatList: [],
    messageInterval: 5000,
    bCreate: true,
    filesSelected: null,
    init: function () {
        isPushStateAllowed();
        $('body').css('background-color', 'white');
        $('.form-fields').show();
        messages.bindSearchEvent();
        messages.leftPanelScroll();

        $(".chat-container").niceScroll();
        
        messages.topicId = topicId;

        var cScroll = $('.chat-container').getNiceScroll().eq(0);
        /*$('.chat-container').bind('scroll', function(){
         if($('.chat-container').scrollTop() <= 0) {
          chat.getChatsBeforeId();
         }
        });
        console.log(cScroll);*/
        cScroll.onscrollend = function (e) {
            if (e.end.y <= 0) {
                messages.getChatsBeforeId(cScroll);
            }
        };

        messages.getAllChatList();
        messages.createChat();
    },

    bindSearchEvent: function() {
        var txtFriendsSearch = $('#txtFriendsSearch');
        txtFriendsSearch.unbind().bind('change', function (e) {
            if ($(this).val() == '') {
                messages.bindAllChatList(messages.chatList);
            } else {
                var f = [];
                for (var i = 0; i <= messages.chatList.length - 1; i++) {
                    var val = messages.chatList[i];
                    if (val.Topic_Category == 1 && val.Display_Name != null && val.Display_Name.toLowerCase().indexOf($(this).val().toLowerCase()) != -1) {
                        f.push(val);
                    }
                    if (val.Topic_Category == 2 && val.Topic_Name != null && val.Topic_Name.toLowerCase().indexOf($(this).val().toLowerCase()) != -1) {
                        f.push(val);
                    }
                }
                messages.bindAllChatList(f);
            }
        });
    },
    leftPanelScroll: function() {
        var windowHeight = $(window).outerHeight();
        var headerHeight = $('.dp-header').outerHeight();
        var chatFormHeight = ($('.chat-form').is(':visible')?$('.chat-form').outerHeight():0);

        var friendsList = $('#friendsList');
        var topicsHeight = (windowHeight - headerHeight);

        friendsList.height(topicsHeight);
        
        var topics = $('.topics .list');
        var topicsHeader = $('.topics .chat-header');

        topics.height(topicsHeight - topicsHeader.outerHeight());
        topics.niceScroll();
    },

    getAllChatList: function () {
        Services.getTopics(Services.defaults.userId, function (friends) {
            messages.chatList = messages.chatList.concat(friends);
            Services.getPublicGroups(Services.defaults.userId, function (publicGroups) {
                messages.chatList = messages.chatList.concat(publicGroups);
                Services.getPrivateGroups(Services.defaults.userId, function (privateGroups) {
                    messages.chatList = messages.chatList.concat(privateGroups);
                    Services.getAlertTopic(Services.defaults.userId, function (alertGroups) {
                        messages.chatList = messages.chatList.concat(alertGroups);
                        console.log(messages.chatList);
                        messages.bindAllChatList(messages.chatList);
                    }, function (e) { });
                }, function (e) { });
            }, function (e) { });
        });
    },
    bindAllChatList: function (data) {
        if (data.length > 0) {
            var content = "";
            var list = $("#friendsList .list");
            list.empty();
            var isFirst = true;
            for (var i = 0; i <= data.length - 1; i++) {
                var value = data[i];
                var elem = "";
                
                if (value.Topic_Category == 1) {
                    var subscriber = rxCommon.getCurrentUserFromSubscriptions(value.subscriptions);
                    var friends = rxCommon.getFriendFromSubscriptions(value.subscriptions);
                    var isActive = (subscriber != null && !subscriber.isRemoved && subscriber.isActive && friends != null && friends.isActive && !friends.isRemoved) ? true : false;
                    if (value.Is_Active && isActive) {
                        if (messages.topicId == 0 && isFirst)
                            messages.topicId = value.Topic_Id;
                        isFirst = false;
                    }
                } else if (value.Topic_Category == 3) {
                    isActive = true;
                    isFirst = false;
                } else {
                    var subscriber = rxCommon.getCurrentUserFromSubscriptions(value.subscriptions);
                    var isActive = (subscriber != null && !subscriber.isRemoved && subscriber.isActive) ? true : false;
                    if (isActive) {
                        if (messages.topicId == 0 && isFirst)
                            messages.topicId = value.Topic_Id;
                        isFirst = false;
                    }
                }

                if (messages.topicId == value.Topic_Id) {
                    messages.selectedTopic = value;
                    elem += '<div class="topic no-padding no-margin active">';
                    messages.getChats(false, 0);
                } else {
                    elem += '<div class="topic no-padding no-margin">';
                }
                elem += '<div class="profilepic">';
                if(value.Topic_Category == 1)
                    elem += '<img src="' + (value.User_Profile_Pic!=null?value.User_Profile_Pic:Services.defaults.defaultThumbnail) + '" alt="">';
                else if (value.Topic_Category == 3)
                    elem += '<a style="font-size: 52px; color: #fad160" class="fa fa-warning" href=""></a>';
                else if (value.Is_Public)
                    elem += '<img src="' + Services.defaults.defaultPubThumbnail + '" alt="">';
                else
                    elem += '<img src="' + Services.defaults.defaultPvtThumbnail + '" alt="">';
                elem += '</div>';
                if (value.Topic_Category == 1) {
                    elem += '<div class="profiledesc">' + value.Display_Name + '</div>';
                } else {
                    elem += '<div class="profiledesc">' + value.Topic_Name + '</div>';
                }
                
                elem += '</div>';

                var elObj = $(elem);
                elObj.data('topic', value);
                elObj.append('<span class="topic-count" id="topic-count-' + value.Topic_Id + '"></span>');
                elObj.bind('click', function (e) {
                    messages.populateMessages(this, $(this).data('topic'));
                });

                if (value.Topic_Category == 1) {
                    var subscriber = rxCommon.getCurrentUserFromSubscriptions(value.subscriptions);
                    var friends = rxCommon.getFriendFromSubscriptions(value.subscriptions);
                    var isActive = (subscriber != null && !subscriber.isRemoved && subscriber.isActive && friends != null && friends.isActive && !friends.isRemoved) ? true : false;
                    if (value.Is_Active && isActive) {
                        if (i == 0 && messages.topicId == 0)
                            messages.topicId = value.Topic_Id;
                        list.append(elObj);
                    }
                } else if (value.Topic_Category == 3) {
                    list.append(elObj);
                } else {
                    var subscriber = rxCommon.getCurrentUserFromSubscriptions(value.subscriptions);
                    var isActive = (subscriber != null && !subscriber.isRemoved && subscriber.isActive) ? true : false;
                    if (isActive) {
                        list.append(elObj);
                    }
                }
            }
            //$("#friendsList .list").append(list);
            //$("#friendsList").html(content);
            list.getNiceScroll().resize();

            // get unread messages count
            messages.getUnReadMessagesCount();
        } else {
            $("#friendsList .list").html('<div class="empty">No Friends/groups found</div>');
        }
    },
    getChatsBeforeId: function (cScroll) {
        var chatCont = $('.chat-items');
        var chatItems = $('.chat-items li'), firstMessageId = 0;
        if (chatItems && chatItems.length > 0)
            firstMessageId = chatItems.first().data('messageid');

        Services.getMessageBeforeId(Services.defaults.userId, messages.topicId, firstMessageId, 0, function (messages) {
            if (messages && messages.length > 0) {
                var html = '';
                for (var i = messages.length - 1; i >= 0; i--) {
                    var curMsg = messages[i];
                    //console.log(curMsg.timestampFormatted);
                    var cMessage = messages[i];
                    var isMe = (cMessage.User_Id == Services.defaults.userId ? true : false);
                    var hasAttachements = false;

                    if (cMessage.Attachment != undefined && cMessage.Attachment != null && cMessage.Attachment != 'null' && cMessage.Attachment != '')
                        hasAttachements = true;
                    html += '<li data-messageid="' + cMessage.Message_Id + '" class="clearfix ' + (isMe ? 'chat-right' : '') + '">' +
                     '<div class="chat-prof"><a href="/User/UserProfile/' + cMessage.User_Id + '"><img src="' + (isMe ? Services.defaults.myProfileURL : (cMessage.Profile_Photo_BLOB_URL != null ? cMessage.Profile_Photo_BLOB_URL : Services.defaults.defaultThumbnail)) + '" alt=""/></a></div>' +
                     '<div class="chat-box"><p><a href="/User/UserProfile/' + cMessage.User_Id + '"><label>' + cMessage.FirstName + ' ' + cMessage.LastName
                     + '</label></a><br />' + (hasAttachements ? '<img src="' + cMessage.Attachment + '" alt="" height="100%" width="100%"/> ' : '')
                     + cMessage.Message_Text + '</p><span>' + cMessage.timestampFormatted + '</span></div></li>';
                }
                chatCont.prepend(html);
            }
        }, function (e) { });
    },
    /*getFriends: function () {
        Services.getTopics(Services.defaults.userId, function (data) {
            messages.friends = data;
            messages.bindFriends(data);
        }, function (e) { });

    },
    bindFriends: function (data) {
        if (data.length > 0) {
            var content = "";
            var list = $("#friendsList .list");
            for (var i = 0; i <= data.length - 1; i++) {
                var value = data[i];
                var elem = "";

                if (messages.topicId == value.Topic_Id) {
                    messages.selectedTopic = value;
                    elem += '<div class="topic no-padding no-margin active">';
                    messages.getChats(false, 0);
                } else {
                    elem += '<div class="topic no-padding no-margin">';
                }
                elem += '<div class="profilepic">';
                elem += '<img src="' + value.User_Profile_Pic + '" alt="">';
                elem += '</div>';
                elem += '<div class="profiledesc">' + value.Display_Name + '</div>';

                elem += '<span class="topic-count" id="topic-count-' + value.Topic_Id + '"></span>';
                elem += '</div>';
                var elObj = $(elem);
                if (!value.Is_Active) {
                    elObj.addClass('topic-disabled');
                }
                elObj.data('topic', value);
                elObj.bind('click', function (e) {
                    messages.populateMessages(this, $(this).data('topic'));
                });
                list.append(elObj);
            }
            //$("#friendsList .list").append(list);
            //$("#friendsList").html(content);
            list.getNiceScroll().resize();

            // get unread messages count
            messages.getUnReadMessagesCount();
        } else {
            $("#friendsList .list").html('<div class="empty">No Friends</div>');
        }
    },*/
    getUnReadMessagesCount: function (onSuccess) {
        Services.getUnReadMessagesCount(Services.defaults.userId, function (data) {
            if (onSuccess) onSuccess(data);
            else messages.bindUnReadMessagesCount(data);
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
            Services.updateMarkAllRead(Services.defaults.userId, lstMessageId, function (data) {
                
            }, function (e) { });
        }
    },
    /*getPublicGroups: function() {
        Services.getPublicGroups(Services.defaults.userId, function (data) {
            messages.bindPublicGroups(data);
        }, function (e) { });
    },
    bindPublicGroups: function(data) {
        if (data.length > 0) {
            var content = "";
            var list = $("#friendsList .list");
            //list.empty();
            //var list = $("#publicGroupsList .list");
            //list.empty();
            //$("#friendsList").append('<div class="chat-header">Friends</div>');
            //var list = $('<div class="list"></div>');
            for (var i = 0; i <= data.length - 1; i++) {
                var value = data[i];
                var subscriber = rxCommon.getCurrentUserFromSubscriptions(value.subscriptions);
                var isActive = (subscriber!=null && !subscriber.isRemoved && subscriber.isActive) ? true : false;

                var elem = "";

                if (messages.topicId == value.Topic_Id) {
                    messages.selectedTopic = value;
                    elem += '<div class="topic no-padding no-margin active">';
                    messages.getChats(false, 0);
                } else {
                    elem += '<div class="topic no-padding no-margin">';
                }
                elem += '<div class="profilepic">';
                //elem += '<img src="' + value.User_Profile_Pic + '" alt="">';
                elem += '<img src="' + Services.defaults.defaultPubThumbnail + '" alt="">';
                elem += '</div>';
                elem += '<div class="profiledesc has-suffix">' + value.Topic_Name + '<div class="suffix">' + value.subscriptions.length + ' members</div></div>';
                if(!isActive)
                    elem += '<span style="postition: absolute; float: right; margin-top: 15px; font-size: 20px; cursor: pointer;" class="fa fa-plus"></span>';
                else
                    elem += '<span class="topic-count" id="topic-count-' + value.Topic_Id + '"></span>';
                elem += '</div>';
                var elObj = $(elem);
                if (!isActive) {
                    elObj.addClass('topic-disabled');
                }
                elObj.data('topic', value);
                if (isActive) {
                    elObj.bind('click', function (e) {
                        messages.populateMessages(this, $(this).data('topic'));
                    });
                } else {
                    elObj.bind('click', function (e) {
                        messages.addToGroup(this, $(this).data('topic'));
                    });
                }
                list.append(elObj);
            }
            //$("#friendsList .list").append(list);
            //$("#friendsList").html(content);
            list.getNiceScroll().resize();
        } else {
            $("#publicGroupsList .list").html('<div class="empty">No Groups Found</div>');
        }
    },*/
    addToGroup: function (obj, data) {
        console.log(data);
        var param = {
            topicId: data.Topic_Id,
            companyId: Services.defaults.companyId,
            topicName: data.Topic_Name,
            topicCategory: 2,
            isPublic: true,
            isSubscriptionRequired: data.Is_Subscription_Required,
            userId: Services.defaults.userId,
            context: "",
            additionContext: "",
            subscriptions: [{
                topicId: data.Topic_Id,
                isContributor: true,
                isActive: true,
                displayName: Services.defaults.displayName,
                userId: Services.defaults.userId
            }],
            messages: [{
                Company_Id: Services.defaults.companyId,
                User_Id: Services.defaults.userId,
                Timestamp: Date.getDateString(),
                Message_Text: Services.defaults.displayName + ' joined the group ' + data.Topic_Name,
                Priority: true,
                Delivery_Mode: 0,
                Attachment: null,
                Action_Required: 1
            }],
            isActive: true,
            isCurrentUserActive: true,
            isRemoved: false,
            isContributor: true,
            isColleagueActive: false,
            isOwnerActive: true,
            isOwner: true,
            noOfActiveMembers: 1,
            displayName: data.Display_Name
        };
        Services.addSubscription(Services.defaults.userId, data.Topic_Id, param, function (data) {
            //messages.getPublicGroups();
            messages.bindAllChatList();
        }, function (e) { });
    },
    /*getPrivateGroups: function() {
        Services.getPrivateGroups(Services.defaults.userId, function (data) {
            messages.bindPrivateGroups(data);
        }, function (e) { });
    },
    bindPrivateGroups: function (data) {
        if (data.length > 0) {
            var content = "";
            var list = $("#friendsList .list");
            for (var i = 0; i <= data.length - 1; i++) {
                var value = data[i];
                var subscriber = rxCommon.getCurrentUserFromSubscriptions(value.subscriptions);
                var isActive = (subscriber!=null && !subscriber.isRemoved && subscriber.isActive) ? true : false;

                var elem = "";
                if (messages.topicId == value.Topic_Id) {
                    messages.selectedTopic = value;
                    elem += '<div class="topic no-padding no-margin active">';
                    messages.getChats(false, 0);
                } else {
                    elem += '<div class="topic no-padding no-margin">';
                }
                elem += '<div class="profilepic">';
                //elem += '<img src="' + value.User_Profile_Pic + '" alt="">';
                elem += '<img src="' + Services.defaults.defaultPvtThumbnail + '" alt="">';
                elem += '</div>';
                elem += '<div class="profiledesc has-suffix">' + value.Topic_Name + '<div class="suffix">' + value.subscriptions.length + ' members</div>';
                elem += '</div>';

                elem += '<span class="topic-count" id="topic-count-' + value.Topic_Id + '"></span>';

                var elObj = $(elem);
                if (!isActive) {
                    elObj.addClass('topic-disabled');
                }
                elObj.data('topic', value);
                if (isActive) {
                    elObj.bind('click', function (e) {
                        messages.populateMessages(this, $(this).data('topic'));
                    });
                } else {
                    elObj.bind('click', function (e) {
                        alert('Pending Request');
                    });
                }
                list.append(elObj);
            }
            //$("#friendsList .list").append(list);
            //$("#friendsList").html(content);
            list.getNiceScroll().resize();
        } else {
            $("#privateGroupsList .list").html('<div class="empty">No Groups Found</div>');
        }
    },*/

    populateMessages: function (obj, topic) {
        if (topic.Topic_Category == 2 || topic.Topic_Category == 3) {
            $('.topic').removeClass('active');
            $(obj).addClass('active');
            messages.topicId = topic.Topic_Id;
            messages.selectedTopic = topic;
            //messages.initChats(topic);
            if (isPushStateAllowed())
                window.history.pushState("", topic.Topic_Name, "/RxBook/Messages/" + topic.Topic_Id);
            else
                window.location.href = "/RxBook/Messages/" + topic.Topic_Id;
            messages.getChats(false, 0);
            messages.createChat(topic.Topic_Id);
            $(obj).find('.topic-count').hide();
        } else if (topic.Topic_Category == 1 && topic.Is_Active) {
            $('.topic').removeClass('active');
            $(obj).addClass('active');
            messages.topicId = topic.Topic_Id;
            messages.selectedTopic = topic;
            //messages.initChats(topic);
            if (isPushStateAllowed())
                window.history.pushState("", topic.Display_Name, "/RxBook/Messages/" + topic.Topic_Id);
            else
                window.location.href = "/RxBook/Messages/" + topic.Topic_Id;
            messages.getChats(false, 0);
            messages.createChat(topic.Topic_Id);
            $(obj).find('.topic-count').hide();
        } else {
            alert('Pending Request');
        }
    },
    refreshChatsInterval: function () {
        messages.intervalId = window.setInterval(function () {
            var chatItems = $('.chat-items li'), lastMessageId = 0;
            if (chatItems && chatItems.length > 0)
                lastMessageId = chatItems.last().data('messageid');
            messages.getChats(true, lastMessageId);
        }, messages.messageInterval);
    },
    getChats: function (bNewChats, messageId) {
        var topic = messages.selectedTopic;
        var groupMembers = $('.chat-container-header .group-members');
        if (topic.Topic_Category == 1) {
            $('.chat-container-header a').html(messages.selectedTopic.Display_Name);
            groupMembers.empty();
        } else if (topic.Topic_Category == 3) {
            $('.chat-container-header a').html(messages.selectedTopic.Topic_Name);
            groupMembers.empty();
        } else {
            $('.chat-container-header a').html(messages.selectedTopic.Topic_Name);
            groupMembers.empty();
            var groupMembersBtn = $('<a href="#">View Members</a>');
            groupMembers.append(groupMembersBtn);
            groupMembersBtn.unbind().bind('click', function (e) {
                ShowModalPopup("dvGroupMembersOverlay");
                var membersOfGroup = $('#dvGroupMembers');
                membersOfGroup.empty();
                $('#dvGroupMembersHeader').html(topic.Topic_Name);
                for (var i = 0; i <= topic.subscriptions.length - 1; i++) {
                    var member = topic.subscriptions[i];
                    var html = '<div style="width: 150px; float: left; padding: 3px;"><a href="/User/UserProfile/' + member.userId + '"><img class="thumb" src="' + (member.profilePicURL != null ? member.profilePicURL : Services.defaults.defaultThumbnail) + '"/>'
                    html += '<div class="display-label"><label>' + member.displayName + '</label></div>';
                    html += '</a></div>';
                    membersOfGroup.append(html);
                }
            });
        }

        messages.fitChatLayout();

        Services.getMessage(Services.defaults.userId, messages.topicId, messageId, 0, function (data) {
            if (bNewChats) {
                messages.refreshChats(data);
            } else {
                messages.createChats(data);
            }
        }, function () {
            
        });
    },
    createChats: function (aMessages) {
        var _this = this;
        var chatCont = $('.chat-items');
        chatCont.empty();

        if (messages.selectedTopic.Topic_Category == 3)
            $('.chat-form').hide();
        else
            $('.chat-form').show();
        if (aMessages && aMessages.length > 0) {
            var html = '';
            for (var i = aMessages.length - 1; i >= 0; i--) {
                var cMessage = aMessages[i];
                var hasAttachment = false;
                var isMe = (cMessage.User_Id == Services.defaults.userId ? true : false);
                html += '<li data-messageid="' + cMessage.Message_Id + '" class="clearfix ' + (isMe ? 'chat-right' : '') + '">' +
					'<div class="chat-prof"><a href="/User/UserProfile/' + cMessage.User_Id + '"><img src="' + (isMe ? Services.defaults.myProfileURL : (cMessage.Profile_Photo_BLOB_URL!=null?cMessage.Profile_Photo_BLOB_URL:Services.defaults.defaultThumbnail)) + '" alt=""/></a></div>' +
					'<div class="chat-box">';
                if (cMessage.Attachment != undefined && cMessage.Attachment != null && cMessage.Attachment != 'null' && cMessage.Attachment != '')
                    hasAttachment = true;

                html += '<p>';
                html += '<a href="/User/UserProfile/' + cMessage.User_Id + '"><label>' + cMessage.FirstName + ' ' + cMessage.LastName + '</label></a><br />';
                html += ((hasAttachment && isImage(cMessage.Attachment)) ? '<img src="' + cMessage.Attachment + '" alt="" style="width: 100%; height: 100%;" />' : '');
                html += ((hasAttachment && isVideo(cMessage.Attachment)) ? '<video preload controls><source src="' + cMessage.Attachment + '" type="video/mp4">Your browser does not support the video tag.</video><br/>' : '');

                html += cMessage.Message_Text + '</p><span>' + cMessage.timestampFormatted + '</span>' +
                    '</div></li>';
                
                if (!isMe && !cMessage.Is_Read) {
                    Services.markIsRead(Services.defaults.userId, cMessage.Message_Id, function (data) {
                        console.log(data);
                    }, function () { });
                }
            }
            chatCont.html(html);
            //$("html, body").animate({ scrollTop: $("#myID").scrollTop() }, 1000);
        }
        //$(".chat-container").getNiceScroll().resize();
        messages.fitChatLayout();
        $(".chat-container").animate({ scrollTop: $('.chat-container')[0].scrollHeight }, 500);
        this.refreshChatsInterval();
    },
    createChat: function (tId) {
        messages.fileUpload();
        if (tId != null) messages.topicId = tId;
        else messages.topicId = topicId;
        $('#send-text').unbind('click').bind('click', function () {
            clearInterval(messages.intervalId);
            var chatText = $('#message-text').val(),
                attachment = messages.filesSelected;
            if (chatText == '' && (attachment == null || attachment == '')) { alert('Please type a message'); return false; }
            if (!messages.bCreate) { alert('please wait until file uplaoded'); return false; }
            var msgObj = {};
            msgObj.TimeStamp = 0;
            msgObj.Message_Text = chatText.autoLink();
            msgObj.Priority = true;
            msgObj.Delivery_Mode = "N";
            msgObj.Attachment = attachment;

            var _this = this;
            Services.sendMessage(Services.defaults.userId, messages.topicId, msgObj, function (data) {
                var chatItems = $('.chat-items li');
                var lastMessageId = 0;
                if (chatItems && chatItems.length > 0)
                    lastMessageId = chatItems.last().data('messageid');
                $('#message-text').val('');
                messages.getChats(true, lastMessageId);
                messages.refreshChatsInterval();
                $('.post-thumb-delete').trigger('click');
            }, function () { });
            return false;
        });
        $('#message-text').unbind().keyup(function (event) {
            event.preventDefault();
            if (event.keyCode == 13 && event.shiftKey) {
                var content = this.value;
                var caret = getCaret(this);
                this.value = content.substring(0, caret) +
                              "\n" + content.substring(caret, content.length);
                event.stopPropagation();
            } else if (event.keyCode == 13) {
                $('#send-text').trigger('click');
            }
        });
    },
    refreshChats: function (tmessages) {
        var chatCont = $('.chat-items');
        if (tmessages && tmessages.length > 0) {
            var html = '';
            for (var i = tmessages.length - 1; i >= 0; i--) {
                /*var cMessage = tmessages[i];
                var isMe = (cMessage.User_Id == Services.defaults.userId ? true : false);
                html += '<li data-messageid="' + cMessage.Message_Id + '" class="clearfix ' + (isMe ? 'chat-right' : '') + '">' +
					'<div class="chat-prof"><img src="' + (isMe ? Services.defaults.myProfileURL : cMessage.Profile_Photo_BLOB_URL) + '" alt=""/></div>' +
					'<div class="chat-box"><p>' + cMessage.Message_Text + '</p><span>' + cMessage.timestampFormatted + '</span></div></li>';*/
                var cMessage = tmessages[i];
                var hasAttachment = false;
                var isMe = (cMessage.User_Id == Services.defaults.userId ? true : false);
                html += '<li data-messageid="' + cMessage.Message_Id + '" class="clearfix ' + (isMe ? 'chat-right' : '') + '">' +
					'<div class="chat-prof"><a href="/User/UserProfile/' + cMessage.User_Id + '"><img src="' + (isMe ? Services.defaults.myProfileURL : (cMessage.Profile_Photo_BLOB_URL != null ? cMessage.Profile_Photo_BLOB_URL : Services.defaults.defaultThumbnail)) + '" alt=""/></a></div>' +
					'<div class="chat-box">';
                if (cMessage.Attachment != undefined && cMessage.Attachment != null && cMessage.Attachment != 'null' && cMessage.Attachment != '')
                    hasAttachment = true;
                
                html += '<p>';
                html += '<a href="/User/UserProfile/' + cMessage.User_Id + '"><label>' + cMessage.FirstName + ' ' + cMessage.LastName + '</label></a><br />';
                html += ((hasAttachment && isImage(cMessage.Attachment)) ? '<img src="' + cMessage.Attachment + '" alt="" style="width: 100%; height: 100%;" />' : '');
                html += ((hasAttachment && isVideo(cMessage.Attachment)) ? '<video preload controls><source src="' + cMessage.Attachment + '" type="video/mp4">Your browser does not support the video tag.</video><br/>' : '');

                html += cMessage.Message_Text + '</p><span>' + cMessage.timestampFormatted + '</span>' +
                    '</div></li>';

                if (!isMe && !cMessage.Is_Read) {
                    Services.markIsRead(Services.defaults.userId, cMessage.Message_Id, function (data) {
                        console.log(data);
                    }, function () { });
                }
            }
            $(".chat-container").getNiceScroll().resize();
            $(".chat-container").animate({ scrollTop: $('.chat-container')[0].scrollHeight }, 500);
            chatCont.append(html);
        }
        $(".chat-container").getNiceScroll().resize();
        messages.fitChatLayout();
    },
    fitChatLayout: function () {
        var windowHeight = $(window).height();
        var headerHeight = $('.dp-header').height();
        var chatFormHeight = ($('.chat-form').is(':visible')?$('.chat-form').height():0);
        var chatHeaderHeight = $('.chat-container-header').height();
        var chatContainer = $('.chat-container');
        
        chatContainer.height(windowHeight - (headerHeight + chatFormHeight + chatHeaderHeight) - 25);
    },
    fileUpload: function () {
        /*var triggerEl = $('#add-image,#add-video');
        triggerEl.bind('click', function () {
            if ($(this).attr('id') == 'add-video')
                $('.file-upload input').attr('accept', 'video/*');
            else
                $('.file-upload input').attr('accept', 'image/*');
            $('.file-upload input').trigger('click');
            return false;
        });*/
        $('input[name="companyId"]').val(Services.defaults.companyId);
        $('input[name="userId"]').val(Services.defaults.userId);
        $('.post-uploaded-files').hide();
        $('.file-upload input').bind('change', function () {
            var fileInp = $(this);
            var formFields = $(this).parents('form.file-upload-form');
            messages.bCreate = false;
            if (isImage(fileInp.val()))
                $('.post-uploaded-files').html('<div class="post-thumb"><img class="post-img" src="" alt=""/><img class="loader" src="/Images/RxBook/animation.gif" alt=""/><span class="post-thumb-delete fa fa-remove"></span></div>');
            if (isVideo(fileInp.val()))
                $('.post-uploaded-files').html('<div class="post-thumb"><img class="post-img" src="" alt="" /><img class="loader" src="/Images/RxBook/animation.gif" alt=""/><span class="post-thumb-delete fa fa-remove"></span></div>');
            $('.post-uploaded-files').show();
            messages.filesSelected = null;
            messages.fitChatLayout();
            
            Services.attachFile(formFields, function (formData, jqForm, options) {
                console.log('Before submit');
            }, function (data) {
                messages.filesSelected = data.url;
                if (isImage(data.url))
                    $('.post-uploaded-files img.post-img').attr('src', data.url);
                if (isVideo(data.url))
                    $('.post-uploaded-files img.post-img').attr('src', 'https://support.wright.edu/wrc/images/archive/e/e4/20090520125539!Video.png');
                $('img.loader').hide();
                $('.post-uploaded-files').show();
                messages.bCreate = true;
            }, function (e) {
                messages.bCreate = true;
            });

            $('.post-thumb-delete').bind('click', function () {
                messages.filesSelected = null;
                $('.post-thumb').remove();
                messages.fitChatLayout();
                $('.post-uploaded-files').hide();
                return false;
            });
        });
    }
};