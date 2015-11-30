var userActivities = {
    lastStreamId: 0,
    start: 1,
    uniqueDatesData: {},
    init: function () {
    //alert("hai");
        userActivities.displayMoreActivities();
        $('#btn-show-more').hide();
        $('#btn-show-more').bind('click', function (e) {
            userActivities.getActivityStreamBeforeId();
        });
    },
    displayMoreActivities: function () {
        var userId = Services.defaults.userId;
        Services.getActivityStream(userId, userActivities.lastStreamId, function (data) {
            if (data.length > 0) {
                userActivities.lastStreamId = data[0].Id;
            }
            userActivities.sortByDate(data, function (uniqueDatesData) {
                userActivities.bindUserActivities(uniqueDatesData, false);
            }, function (e) { });
        }, null);
       // var list = $(".activityBody");
    },

    sortByDate: function (data, success, failure) {
        userActivities.uniqueDatesData = [];
        for (var i = 0; i < data.length; i++) {
            var curDate = new Date(Date.parse(data[i].Timestamp));
            var date = curDate.getDate();
            var month = curDate.getMonth();
            var year = curDate.getFullYear();
            if (date < 10)
                date = '0' + date;
            if (month < 10)
                month = '0' + month;
            var formattedDate = (date + '/' + month + '/' + year);

            if (userActivities.uniqueDatesData[formattedDate] != null) {
                userActivities.uniqueDatesData[formattedDate].push(data[i]);
            } else {
                userActivities.uniqueDatesData[formattedDate] = [];
                userActivities.uniqueDatesData[formattedDate].push(data[i]);
            }
        }
        success(userActivities.uniqueDatesData);
    },

    bindUserActivities: function (userDatesData) {
        var list = $(".activityBody");
        for (var data in userDatesData) {
            var $lastElement = list.find('.activityDay').last();
            var lastDate = $lastElement.data('activityDate');
            var arrayActivities = userDatesData[data];
            if (lastDate != null && lastDate == data) {
                for (var i = 0; i <= arrayActivities.length - 1; i++) {
                    var content = '<div class="activity">';
                    content += '<div class="activityImg"><img class="cls_img_user_profile" alt="" src="' + (arrayActivities[i].Profile_Photo_BLOB_URL!=null?arrayActivities[i].Profile_Photo_BLOB_URL:Services.defaults.defaultThumbnail) + '"></div> ';
                    content += '<div class="activityMsg"><p>' + arrayActivities[i].Message_HTML + '</p></div>';
                    content += '</div>';

                    var $content = $(content);
                    if ($content.find('.clsTopics').length > 0) {
                        $content.find('.clsTopics').bind('click', function (e) {
                            var _this = this;
                            Services.getTopicById(Services.defaults.userId, $(_this).data('topicid'), function (data) {
                                var topic = data;
                                ShowModalPopup("dvGroupMembersOverlay");
                                var membersOfGroup = $('#dvGroupMembers');
                                membersOfGroup.empty();
                                $('#dvGroupMembersHeader').html(topic.Topic_Name);
                                for (var i = 0; i <= topic.subscriptions.length - 1; i++) {
                                    var member = topic.subscriptions[i];
                                    var html = '<div style="width: 150px; float: left; padding: 3px;"><a href="/User/UserProfile/' + member.userId + '"><img class="thumb" src="' + (member.profilePicURL!=null?member.profilePicURL:Services.defaults.defaultThumbnail) + '"/>'
                                    html += '<div class="display-label"><label>' + member.displayName + '</label></div>';
                                    //html += '<div class="display-label"><label>' + member.displayName + '</label><span>' + (topic.User_Id == member.userId ? 'Group Admin' : 'Group Member') + '</span></div>';
                                    html += '</a></div>';
                                    membersOfGroup.append(html);
                                }
                            }, function (e) { alert('Unable to fetch data.'); });
                            return false;
                        });
                    }

                    if ($content.find('.clsFeeds').length > 0) {
                        $content.find('.clsFeeds').bind('click', function (e) {
                            var _this = this;
                            Services.getFeedByFeedMasterId(Services.defaults.userId, $(_this).data('feedid'), function (data) {
                                console.log(data);
                                if (data != null && data.length > 0) {
                                    rxCommon.bindPostPopup(data[0]);
                                    ShowModalPopup('dvPostOverlay');
                                }
                                return false;
                            }, function (e) { alert('Unable to fetch data.'); });
                            return false;
                        });
                    }
                    $lastElement.append($content);
                }
            } else {
                var $html = $('<div class="activityDay"><div class="activityDate"><span class="line_center">' + data + '</span></div></div>');
                for (var i = 0; i <= arrayActivities.length - 1; i++) {
                    var content = '<div class="activity">';
                    content += '<div class="activityImg"><img class="cls_img_user_profile" alt="" src="' + (arrayActivities[i].Profile_Photo_BLOB_URL!=null?arrayActivities[i].Profile_Photo_BLOB_URL:Services.defaults.defaultThumbnail) + '"></div> ';
                    content += '<div class="activityMsg"><p>' + arrayActivities[i].Message_HTML + '</p></div>';
                    content += '</div>';
                    var $content = $(content);
                    
                    var $content = $(content);
                    if ($content.find('.clsTopics').length > 0) {
                        $content.find('.clsTopics').bind('click', function (e) {
                            var _this = this;
                            Services.getTopicById(Services.defaults.userId, $(_this).data('topicid'), function (data) {
                                var topic = data;
                                var membersOfGroup = $('#dvGroupMembers');
                                membersOfGroup.empty();
                                $('#dvGroupMembersHeader').html(topic.Topic_Name);
                                if (topic != null && topic.subscriptions != null && topic.subscriptions.length > 0) {
                                    for (var i = 0; i <= topic.subscriptions.length - 1; i++) {
                                        var member = topic.subscriptions[i];
                                        var html = '<div style="width: 150px; float: left; padding: 3px;"><a href="/User/UserProfile/' + member.userId + '"><img class="thumb" src="' + (member.profilePicURL!=null?member.profilePicURL:Services.defaults.defaultThumbnail) + '"/>'
                                        html += '<div class="display-label"><label>' + member.displayName + '</label></div>';
                                        //html += '<div class="display-label"><label>' + member.displayName + '</label><span>' + (topic.User_Id == member.userId ? 'Group Admin' : 'Group Member') + '</span></div>';
                                        html += '</a></div>';
                                        membersOfGroup.append(html);
                                    }
                                    ShowModalPopup("dvGroupMembersOverlay");
                                } else {
                                    alert('No users subscribed to this group.');
                                }
                            }, function (e) { alert('Unable to fetch data.'); });
                            return false;
                        });
                    }

                    if ($content.find('.clsFeeds').length > 0) {
                        $content.find('.clsFeeds').bind('click', function (e) {
                            var _this = this;
                            Services.getFeedByFeedMasterId(Services.defaults.userId, $(_this).data('feedid'), function (data) {
                                console.log(data);
                                if (data != null && data.length > 0) {
                                    rxCommon.bindPostPopup(data[0]);
                                    ShowModalPopup('dvPostOverlay');
                                }
                                return false;
                            }, function (e) { alert('Unable to fetch data.'); });
                            return false;
                        });
                    }

                    $html.append($content);
                }
                $html.data('activityDate', data);
                list.append($html);
            }
            $('#btn-show-more').show();
        }
    },

    getActivityStreamBeforeId: function() {
        var userId = Services.defaults.userId;
        Services.getActivityStreamBeforeId(userId, userActivities.lastStreamId, function (data) {
            if (data.length > 0) {
                userActivities.lastStreamId = data[0].Id;
            } else
                $('#btn-show-more').hide();
            userActivities.sortByDate(data, function (uniqueDatesData) {
                userActivities.bindUserActivities(uniqueDatesData, false);
            }, function (e) { });
        }, null);
    }
};