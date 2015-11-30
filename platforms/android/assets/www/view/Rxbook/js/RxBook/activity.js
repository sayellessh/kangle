var activity = {
    el: $('#activity-content .posts-view'),
    lastStreamId: 0,
    start: 1,
    uniqueDatesData: {},
    init: function () {
        //alert("hai");
        activity.displayMoreActivities();
        $('#btn-show-more').hide();
        $('#btn-show-more').bind('click', function (e) {
            activity.getActivityStreamBeforeId();
            return false;
        });
    },
    displayMoreActivities: function () {
        var userId = Services.defaults.userId;
        Services.getActivityStream(userId, activity.lastStreamId, function (data) {
            if (data.length > 0) {
                activity.lastStreamId = data[0].Id;
            }
            activity.sortByDate(data, function (uniqueDatesData) {                
                activity.bindUserActivities(uniqueDatesData, false);
            }, function (e) { });
        }, function() {
        	app.bindUserErrorFeed(activity.el, networkProblemError);
        });
    },

    sortByDate: function (data, success, failure) {
        activity.uniqueDatesData = {};
        for (var i = 0; i < data.length; i++) {
            var curDate = new Date(Date.parse(data[i].Timestamp));
            var date = curDate.getDate();
            var month = curDate.getMonth()+1;
            var year = curDate.getFullYear();
            if (date < 10)
                date = '0' + date;
            if (month < 10)
                month = '0' + month;
            var formattedDate = (date + '/' + month + '/' + year);

            if (activity.uniqueDatesData[formattedDate] != null) {
                activity.uniqueDatesData[formattedDate].push(data[i]);
            } else {
                activity.uniqueDatesData[formattedDate] = [];
                activity.uniqueDatesData[formattedDate].push(data[i]);
            }
        }
        success(activity.uniqueDatesData);
    },

    bindUserActivities: function (userDatesData) {
        //alert(JSON.stringify(userDatesData));
        var list = activity.el;
        for (var data in userDatesData) {
            var $lastElement = list.find('.activityDay').last();
            var lastDate = $lastElement.data('activityDate');
            var arrayActivities = userDatesData[data];
            if (lastDate != null && lastDate == data) {
                for (var i = 0; i <= arrayActivities.length - 1; i++) {
                    /*var content = '<div class="activity">';
                    content += '<div class="activityImg"><img class="cls_img_user_profile" alt="" src="' + (arrayActivities[i].Profile_Photo_BLOB_URL!=null?arrayActivities[i].Profile_Photo_BLOB_URL:Services.defaults.defaultThumbnail) + '"></div> ';
                    content += '<div class="activityMsg"><p>' + arrayActivities[i].Message_HTML + '</p></div>';
                    content += '</div>';*/
                    var content = '<div class="posts-item clearfix">';
                    content += '<div class="posts-prof"><img src="' + (arrayActivities[i].Profile_Photo_BLOB_URL!=null?arrayActivities[i].Profile_Photo_BLOB_URL:Services.defaults.defaultThumbnail) + '" alt=""/></div>';
                    content += '<div class="posts-desc">' + arrayActivities[i].Message_HTML + '</div>';
                    content += '</div>';

                    var $content = $(content);
                    
                    var anchorProfiles = $content.find('.posts-desc a.clsFriends');
                    for(var j=0;j<=anchorProfiles.length - 1; j++) {
                        var anchorProfile = $(anchorProfiles.get(j));
                        anchorProfileHref = anchorProfile.attr('href');
                        
                        if(anchorProfileHref != null){
                            var splittedHref = anchorProfileHref.split('/');
                            if(splittedHref.length > 0)
                                anchorProfile.attr('href', 'UserProfile.Mobile.html?userId=' + splittedHref[splittedHref.length-1]);
                        }
                    }
                    
                    if ($content.find('.clsTopics').length > 0) {
                        $content.find('.clsTopics').bind('click', function (e) {
                            var _this = this;
                            Services.getTopicById(Services.defaults.userId, $(_this).data('topicid'), function (data) {
                                var topic = data;
                                  if(topic != null && topic.subscriptions != null && topic.subscriptions.length > 0) {
                                  window.location.href = 'GroupMembers.Mobile.html?topicId=' + topic.Topic_Id;
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
                                   window.location.href = 'FeedDetails.Mobile.html?feedId=' + (data[0].Id);

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
                    /*var content = '<div class="activity">';
                    content += '<div class="activityImg"><img class="cls_img_user_profile" alt="" src="' + (arrayActivities[i].Profile_Photo_BLOB_URL!=null?arrayActivities[i].Profile_Photo_BLOB_URL:Services.defaults.defaultThumbnail) + '"></div> ';
                    content += '<div class="activityMsg"><p>' + arrayActivities[i].Message_HTML + '</p></div>';
                    content += '</div>';*/
                    
                    var content = '<div class="posts-item clearfix">';
                    content += '<div class="posts-prof"><img src="' + (arrayActivities[i].Profile_Photo_BLOB_URL!=null?arrayActivities[i].Profile_Photo_BLOB_URL:Services.defaults.defaultThumbnail) + '" alt=""/></div>';
                    content += '<div class="posts-desc">' + arrayActivities[i].Message_HTML + '</div>';
                    content += '</div>';
                    
                    var $content = $(content);
                    
                    var anchorProfiles = $content.find('.posts-desc a.clsFriends');
                    for(var j=0;j<=anchorProfiles.length - 1; j++) {
                        var anchorProfile = $(anchorProfiles.get(j));
                        anchorProfileHref = anchorProfile.attr('href');
                        
                        if(anchorProfileHref != null){
                            var splittedHref = anchorProfileHref.split('/');
                            if(splittedHref.length > 0)
                                anchorProfile.attr('href', 'UserProfile.Mobile.html?userId=' + splittedHref[splittedHref.length-1]);
                        }
                    }
                    //alert($content.html());
                    if ($content.find('.clsTopics').length > 0) {
                        $content.find('.clsTopics').bind('click', function (e) {
                            var _this = this;
                            Services.getTopicById(Services.defaults.userId, $(_this).data('topicid'), function (data) {
                                var topic = data;
                                  if(topic != null && topic.subscriptions != null && topic.subscriptions.length > 0) {
                                  window.location.href = 'GroupMembers.Mobile.html?topicId=' + topic.Topic_Id;
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
                                    window.location.href = 'FeedDetails.Mobile.html?feedId=' + (data[0].Id);
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

    getActivityStreamBeforeId: function () {
        var userId = Services.defaults.userId;
        Services.getActivityStreamBeforeId(userId, activity.lastStreamId, function (data) {
            if (data.length > 0) {
                activity.lastStreamId = data[0].Id;
            } else
                $('#btn-show-more').hide();
            activity.sortByDate(data, function (uniqueDatesData) {
                activity.bindUserActivities(uniqueDatesData, false);
            }, function (e) { });
        }, null);
    }
};

var companyActivities = {
    el: $('#activity-content .posts-view'),
    lastStreamId: 0,
    start: 1,
    uniqueDatesData: {},
    init: function () {
        //alert("hai");
        companyActivities.displayMoreActivities();
        $('#btn-show-more').hide();
        $('#btn-show-more').bind('click', function (e) {
            companyActivities.getActivityStreamBeforeId();
            return false;
        });
    },
    displayMoreActivities: function () {
        var userId = Services.defaults.userId;
        Services.getCompanyActivityStream(userId, companyActivities.lastStreamId, function (data) {
            if (data.length > 0) {
                companyActivities.lastStreamId = data[0].Notification_Id;
            }
            companyActivities.sortByDate(data, function (uniqueDatesData) {
                companyActivities.bindcompanyActivities(uniqueDatesData, false);
            }, function (e) { });
        }, null);
        // var list = $(".activityBody");
    },

    sortByDate: function (data, success, failure) {
        companyActivities.uniqueDatesData = {};
        for (var i = 0; i < data.length; i++) {
            var curDate = new Date(Date.parse(data[i].Notification_DateTime));
            var date = curDate.getDate();
            var month = curDate.getMonth();
            var year = curDate.getFullYear();
            if (date < 10)
                date = '0' + date;
            if (month < 10)
                month = '0' + month;
            var formattedDate = (date + '/' + month + '/' + year);

            if (companyActivities.uniqueDatesData[formattedDate] != null) {
                companyActivities.uniqueDatesData[formattedDate].push(data[i]);
            } else {
                companyActivities.uniqueDatesData[formattedDate] = [];
                companyActivities.uniqueDatesData[formattedDate].push(data[i]);
            }
        }
        success(companyActivities.uniqueDatesData);
    },

    bindcompanyActivities: function (userDatesData) {
        var list = companyActivities.el;
        for (var data in userDatesData) {
            var $lastElement = list.find('.activityDay').last();
            var lastDate = $lastElement.data('activityDate');
            var arrayActivities = userDatesData[data];
            if (lastDate != null && lastDate == data) {
                var html = '';
                for (var i = 0; i <= arrayActivities.length - 1; i++) {
                    html += '<div class="posts-item clearfix">';
                    html += '<a class="clearfix" href="' + arrayActivities[i].Url + '" style="display:block">';
                    html += '<div class="posts-prof"><img src="' + arrayActivities[i].Profile_Photo_BLOB_URL + '" alt=""/></div>';
                    html += '<div class="posts-desc">' + arrayActivities[i].Data + '</div>';
                    html += '</a></div>';
                }
                $lastElement.append(html);
            } else {
                var html = '';
                html += '<div class="activityDay">';
                html += '<div class="activityDate"><span class="line_center">' + data + '</span></div>';
                for (var i = 0; i <= arrayActivities.length - 1; i++) {
                    html += '<div class="posts-item clearfix">';
                    html += '<a class="clearfix" href="' + arrayActivities[i].Url + '" style="display:block">';
                    html += '<div class="posts-prof"><img src="' + arrayActivities[i].Profile_Photo_BLOB_URL + '" alt=""/></div>';
                    html += '<div class="posts-desc">' + arrayActivities[i].Data + '</div>';
                    html += '</a></div>';
                }
                html += '</div>';
                var $html = $(html);
                $html.data('activityDate', data);
                list.append($html);
            }
            $('#btn-show-more').show();
        }
    },

    getActivityStreamBeforeId: function () {
        var userId = Services.defaults.userId;
        Services.getCompanyActivityStreamBeforeId(userId, companyActivities.lastStreamId, function (data) {
            if (data.length > 0) {
                companyActivities.lastStreamId = data[0].Notification_Id;
            } else
                $('#btn-show-more').hide();
            companyActivities.sortByDate(data, function (uniqueDatesData) {
                companyActivities.bindcompanyActivities(uniqueDatesData, false);
            }, function (e) { });
        }, null);
    }
};