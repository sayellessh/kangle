var rxCommon = {
    lastStreamId: 0,
    lastCompanyStreamId: 0,
    maxMessageCnt: 10,
    friendRequestInterval: 5000,
    getFriendsInterval: 10000,
    activityStreamInterval: 180000,
    filesSelected: null,
    privateFriends_g: {},
    privateGroups_g: "",
    publicGroups_g: "",
    pvtSearchGroup_g: "",
    pubSearchGroup_g: "",
    start: 1,
    companystart: 1,
    bCreate: true,
    isResponded: [],
    init: function () {      
        rxCommon.initHeader();
        
        //rxCommon.alignRightPanel();
        //rxCommon.alignLeftPanel();
        //rxCommon.rightPanelScroll();

        //rxCommon.getActivityFeed();
        //rxCommon.getCompanyActivityStream();
        //rxCommon.getFriends();
        //rxCommon.getPrivateGroups();
        //rxCommon.getPublicGroups();
        //rxCommon.getNotifications();
        //rxCommon.getAlertTopic();
        //rxCommon.startCommonThread();

        //Code to search private group
        $("#txtPrivateSearch").keyup(function () {            
            rxCommon.searchPrivateGroup($(this).val());
        });
        //Code to search public group
        $("#txtPublicSearch").keyup(function () {            
            rxCommon.searchPublicGroup($(this).val());
        });

        var selector = '.nav li';
        $(selector).on('click', function () {           
            $(selector).removeClass('current-li');
            $(this).addClass('current-li');
        });
                
        //rxCommon.initFriendsSearch();
        //rxCommon.initPopupCloseBtn();
        
        var arrowPopup = new ArrowPopup($('#rxBookSettings'), {
            container: "body",
            offset: -58,
            bodyDiv: "settings",
            contents: [
                {
                    displaytitle: "Kangle",
                    iconclass: 'arrow-wire',
                    onclick: function () {
                        //RedirectWire();
                        window.location.href = '/AssetUpload/AssetWeb'
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
    },
    togglePostBtn: function (toShow) {
        if (toShow) {
            $('.form-fields').show();
            $('#create-post').height(80);
        } else {
            $('.form-fields').hide();
            $('#create-post').height(35);
        }
    },
    initHeader: function () {
        $('#pUserName').html('<a href="/User/UserProfile/' + Services.defaults.userId + '">' + Services.defaults.displayName + '</a>');
        $('#pCity').html('');
        $('#pProfilePic').attr('src', Services.defaults.myProfileURL);
    },
    rightPanelScroll: function () {
        $("#dvFriends").niceScroll();
        $("#dvActivityStream").niceScroll();
        $("#dvCompanyActivityStream").niceScroll();
    },
    alignLeftPanel: function () {
        var windowHeight = $(window).outerHeight();
        var headerHeight = $('.dp-header').outerHeight();
        var divLeftPanel = $('#div-leftPanel');
        divLeftPanel.height(windowHeight - headerHeight);
    },
    alignRightPanel: function () {
        var windowHeight = $(window).outerHeight();
        var headerHeight = $('.dp-header').outerHeight();

        var divRightPanel = $('#div-rightPanel');
        var divActivityStream = $('#div-activityStream');
        var headActivityStream = $('#head-activityStream');
        var activityStreamBody = $('#dvActivityStream');

        var divCompanyActivityStream = $('#div-companyActivityStream');
        var headCompanyActivityStream = $('#head-companyActivityStream');
        var companyActivityStreamBody = $('#dvCompanyActivityStream');

        var divFreindsList = $('#div-friendsList');
        var headFriendsList = $('#head-friendsList');
        var friendsListBody = $('#dvFriends');

        var divHeight = (windowHeight - headerHeight - 15) / 2;

        divActivityStream.height(divHeight);
        activityStreamBody.height(divActivityStream.outerHeight() - headActivityStream.outerHeight() - 5);

        divCompanyActivityStream.height(divHeight);
        companyActivityStreamBody.height(divCompanyActivityStream.outerHeight() - headCompanyActivityStream.outerHeight() - 5);

        divFreindsList.height(divHeight);
        friendsListBody.height(divFreindsList.outerHeight() - headFriendsList.outerHeight() - 5);
    },
    startCommonThread: function () {
        setInterval(function () {
            rxCommon.getNotifications();
            rxCommon.refreshMessagesCount();
            rxCommon.getAlertTopic();
        }, rxCommon.friendRequestInterval);

        setInterval(function () {
            rxCommon.getFriends();
        }, rxCommon.getFriendsInterval);

        setInterval(function () {
            rxCommon.getActivityFeed();
            rxCommon.getCompanyActivityStream();
        }, rxCommon.activityStreamInterval);

    },

    getAlertTopic: function() {
        Services.getAlertTopic(Services.defaults.userId, function (data) {
            rxCommon.bindAlertTopic(data);
        }, null);
    },
    bindAlertTopic: function(data) {
        var publicGroups = $('#dvAlerts');
        if (data != null && data.length > 0) {
            publicGroups.empty();
            var topicIds = {};
            $.each(data, function (index, value) {
                topicIds[value.Topic_Id] = 'alert-topic-' + value.Topic_Id;
                var main = $('<div class="col-md-12 cls_no_padding pub-pad bg-grey dvalert-container">');
                main.append('<span class="fa fa-warning pad-rgt5 pad-logo"></span>');
                main.append('<a href="/RxBook/Messages/' + value.Topic_Id + '" class="pad-msg">' + value.Topic_Name + '</a>');
                main.append('<span style="display: none; float: right; text-decoration: none; cursor:pointer;" class="pad-lt5 count" id="' + topicIds[value.Topic_Id] + '"></span>');
                publicGroups.append(main);
            });
            Services.getUnReadMessagesCount(Services.defaults.userId, function (counts) {              
                if (counts != null && counts.length > 0) {
                    $.each(counts, function (index, value) {
                        if (topicIds[value.Topic_Id] != null && topicIds[value.Topic_Id]) {
                            $('#' + topicIds[value.Topic_Id]).html(value.messageCount).show();
                        }
                    });
                }
            }, function (e) { });
        }
    },
    getActivityFeed: function () {
        Services.getActivityStream(Services.defaults.userId, rxCommon.lastStreamId, function (data) {
            rxCommon.bindActivityStream(data);
        }, null);
    },
    bindActivityStream: function (data) {
        $('#activityShowMore').hide();
        $("#dvActivityStream").find('.empty').remove();
        if (data.length > 0) {
            $('#activityShowMore').show();
            if (data.length > 0) { rxCommon.lastStreamId = data[data.length - 1].Id; }
            for (var i = data.length - 1; i >= 0; i--) {
                var value = data[i];
                var content = "";
                content = "<div style='display:none; border-bottom: 2px solid #FFFFFF; margin-bottom: 5px;' class='col-md-12 cls_no_padding cls_dv_ActivityStream'>";
                content += "<div class='a-user-profile'>";
                content += "<img class='a-user-profile-img' src='" + (value.Profile_Photo_BLOB_URL!=null?value.Profile_Photo_BLOB_URL:Services.defaults.defaultThumbnail) + "' /> </div>";
                content += "<div class='a-user-desc'>" + value.Message_HTML + "</div>";
                content += "</div>";
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
                                var html = '<div style="width: 150px; float: left; padding: 3px;"><a href="/User/UserProfile/' + member.userId + '"><img class="thumb" src="' + (member.profilePicURL != null ? member.profilePicURL : Services.defaults.defaultThumbnail) + '"/>'
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

                $("#dvActivityStream").prepend($content);
                $("#dvActivityStream").find('.cls_dv_ActivityStream:first').slideDown('fast');
            }
        } else if (rxCommon.start == 1) {
            $("#dvActivityStream").html('<div class="empty">No Activities</div>');
        }
        rxCommon.start = 0;
        $("#dvActivityStream").getNiceScroll().resize();
        //$("#dvActivityStream").html(content);
    },
    getCompanyActivityStream: function () {
        Services.getCompanyActivityStream(Services.defaults.userId, rxCommon.lastCompanyStreamId, function (data) {
            rxCommon.bindCompanyActivityStream(data);
        }, null);
    },
    bindCompanyActivityStream: function (data) {
        $('#companyActivityShowMore').hide();
        $("#dvCompanyActivityStream").find('.empty').remove();
        if (data.length > 0) {
            $('#companyActivityShowMore').show();
            if (data.length > 0) { rxCommon.lastCompanyStreamId = data[data.length - 1].Notification_Id; }
            for (var i = data.length - 1; i >= 0; i--) {
                var value = data[i];
                var content = $("<div style='display:none; border-bottom: 2px solid #FFFFFF; margin-bottom: 5px;' class='col-md-12 cls_no_padding cls_dv_ActivityStream'></div>");
                var link = $("<a href='" + value.Url + "'></a>");
                link.append("<div class='a-user-profile'><img class='a-user-profile-img' src='" + (value.Profile_Photo_BLOB_URL!=null?value.Profile_Photo_BLOB_URL:Services.defaults.defaultThumbnail) + "' /> </div>");
                link.append("<div class='a-user-desc'>" + value.Data + "</div>");
                link.bind('click', function (e) {
                    var _this = $(this);
                    var inputdata = new Array();
                    var input = {};
                    input.name = "companyId";
                    input.value = value.Company_Id;
                    inputdata.push(input)

                    DPAjax.requestInvoke('Alert', 'EnableCompanySession', inputdata, "POST", function (data) {
                        window.location.href = _this.attr('href');
                    }, function (error) { });
                    return false;
                });
                content.append(link);
                $("#dvCompanyActivityStream").prepend(content);
                $("#dvCompanyActivityStream").find('.cls_dv_ActivityStream:first').slideDown('fast');
            }
        } else if (rxCommon.companystart == 1) {
            $("#dvCompanyActivityStream").html('<div class="empty">No Activities</div>');
        }
        rxCommon.companystart = 0;
        $("#dvCompanyActivityStream").getNiceScroll().resize();
    },
    getFriends: function () {
        var inputdata = new Array();
        var input = {};

        input.name = "subdomainName";
        input.value = Services.defaults.subdomainName;
        inputdata.push(input)

        input = {};
        input.name = "userId";
        input.value = Services.defaults.userId;
        inputdata.push(input)

        Services.getTopics(Services.defaults.userId, function (data) {
            rxCommon.bindFriends(data);
        }, function (e) { });
    },
    bindFriends: function (data) {
        if (data.length > 0) {
            var isEmpty = true;
            $("#dvFriends").empty();
            $.each(data, function (index, value) {
                var curFrnd = value, isActive = false;
                var scrObj = curFrnd.subscriptions;
                var isRemoved = false;
                if (scrObj && scrObj.length > 0) {
                    var obj1 = scrObj[0], obj2 = scrObj[1];
                    isActive = (obj1.isActive && obj2.isActive ? true : false);
                    isRemoved = (obj1.isRemoved || obj2.isRemoved ? true : false);
                }
                if (!isRemoved) {
                    isEmpty = false;
                    var $row = $("<div class='col-md-12 cls_no_padding cls_dv_ActivityStream" + (!isActive ? " cls-disabled" : "") + "'></div>");
                    var $anchor = $('<div></div>');
                    if(isActive) $anchor = $("<a href='/RxBook/Messages/" + value.Topic_Id + "'></a>");
                    $anchor.append("<div class='a-user-profile'><img class='a-user-profile-img' src='" + (value.User_Profile_Pic != null ? value.User_Profile_Pic : Services.defaults.defaultThumbnail) + "' /></div>");
                    $anchor.append("<div class='a-user-desc'>" + value.Display_Name + ((!isActive) ? "<div class='suffix'>Pending Request</div>" : "") + "</div>");
                    $row.append($anchor);
                    $("#dvFriends").append($row);
                }
            });
            if (isEmpty)
                $("#dvFriends").html('<div class="empty">No Friends</div>');
            $("#dvFriends").getNiceScroll().resize();
        } else {
            $("#dvFriends").html('<div class="empty">No Friends</div>');
        }
    },
    createPrivateGroup: function (groupName) {
        var pvtMessageText = $("#txtPvtMessage").val();        
        var groupParams = {
            companyId: Services.defaults.companyId,
            topicName: groupName,
            topicCategory: 2,
            isPublic: false,
            isSubscriptionRequired: true,
            userId: Services.defaults.userId,
            subscriptions: [{
                companyId: Services.defaults.companyId,
                userId: Services.defaults.userId,
                isContributor: true,
                isActive: true,
                displayName: Services.defaults.displayName
            }],
            messages: [{
                Company_Id: Services.defaults.companyId,
                User_Id: Services.defaults.userId,
                TimeStamp: new Date().toLocaleString(),
                Message_Text: pvtMessageText,
                Priority: true,
                Delivery_Mode: 0,
                Attachment: "",
                Action_Required: 1
            }],
        };

        var selectedFriends = $('.selectedFriends:checked');
        $.each(selectedFriends, function (index, selectedFriend) {
            var obj = rxCommon.privateFriends_g[$(selectedFriend).val()];
            var f = {
                companyId: obj.Company_Id,
                userId: obj.Subscription_User_Id,
                isContributor: false,
                isActive: false,
                displayName: obj.Display_Name
            };
            groupParams.subscriptions.push(f);
        });

        Services.addTopic(Services.defaults.userId, groupParams, function (data) {
            if (data > 1) {
                HideModalPopup("dvPrivateOverlay");
                rxCommon.getPrivateGroups();
            }
        }, function (e) { });
    },
    getPrivateGroups: function () {
        Services.getPrivateGroups(Services.defaults.userId, function (data) {
            rxCommon.privateGroups_g = data;
            $('#privateGroupsSearch').hide();
            if (data.length > 0)
                rxCommon.bindPrivateGroups(data);
        }, function (e) { });
    },

    bindPrivateGroups: function (data) {
        if (data.length > 0) {
            var content = "";
            var isEmpty = true;
            $.each(data, function (index, value) {
                var subscriber = rxCommon.getCurrentUserFromSubscriptions(value.subscriptions);
                if (subscriber != null && subscriber.isActive && !subscriber.isRemoved) {
                    isEmpty = false;
                    content += "<div class='col-md-12 cls_no_padding pvt-pad bg-grey'>";
                    content += "<span class='fa fa-users pad-rgt5 grp-icon-custom'></span>";
                    content += "<a style='cursor:pointer; width: 124px; display: inline-block;' href='/RxBook/Messages/" + value.Topic_Id + "'>";
                    content += value.Topic_Name;
                    content += "</a>";
                    content += "</div>";
                }
            });
            if (isEmpty) {
                $("#dvPrivateGroups").html('No groups found');
            } else {
                $("#dvPrivateGroups").html(content);
                $('#privateGroupsSearch').show();
            }
        } else {
            $("#dvPrivateGroups").html('No groups found');
        }
    },
    createPublicGroup: function (groupName) {
        var groupParams = {
            companyId: Services.defaults.companyId,
            topicName: groupName,
            topicCategory: 2,
            isPublic: true,
            isActive: true,
            isSubscriptionRequired: true,
            userId: Services.defaults.userId,
            subscriptions: [{
                companyId: Services.defaults.companyId,
                userId: Services.defaults.userId,
                isContributor: true,
                isActive: true,
                displayName: Services.defaults.displayName
            }]
        };
        Services.addTopic(Services.defaults.userId, groupParams, function (data) {
            //alert(data);
            if (data > 1) {
                HideModalPopup("dvPublicOverlay");
                rxCommon.getPublicGroups();
            }
        }, function (e) { });
    },
    getPublicGroups: function () {
        Services.getPublicGroups(Services.defaults.userId, function (data) {
            rxCommon.publicGroups_g = data;
            $('#publicGroupsSearch').hide();
            if(data.length > 0)
                rxCommon.bindPublicGroups(data);
        }, function (e) { });
    },
    bindPublicGroups: function (data) {        
        if (data.length > 0) {
            var publicGroups = $("#dvPublicGroups");
            publicGroups.empty();
            $.each(data, function (index, value) {
                var subscriber = rxCommon.getCurrentUserFromSubscriptions(value.subscriptions);
                if (subscriber != null && subscriber.isActive && !subscriber.isRemoved) {
                    var main = $("<div class='col-md-12 cls_no_padding pub-pad bg-grey'></div>");
                    main.append("<span class='fa fa-users pad-rgt5 grp-icon-custom'></span>");
                    main.append('<a style="cursor:pointer; width: 124px; display: inline-block;" href="/RxBook/Messages/' + value.Topic_Id + '">' + value.Topic_Name + '</a>');
                    publicGroups.append(main);
                } else {
                    var main = $("<div class='col-md-12 cls_no_padding pub-pad bg-grey'></div>");
                    main.append("<span class='fa fa-users pad-rgt5'></span>");
                    main.append('<a href="#">' + value.Topic_Name + '</a>');
                    var addIcon = $("<a class='pad-lt5 fa fa-plus-circle' style='float: right; text-decoration: none; cursor:pointer;'></a>");
                    addIcon.data('publicGroup', value);
                    addIcon.bind('click', function (e) {
                        rxCommon.addToGroup($(this), $(this).data('publicGroup'), function (data) {
                            rxCommon.getPublicGroups();
                        }, function () { });
                    });
                    main.append(addIcon);
                    publicGroups.append(main);
                }
            });
            $('#publicGroupsSearch').show();
        } else {
            $("#dvPublicGroups").html('No groups found');
        }
    },
    initFriendsSearch: function () {
        $('#searchResults').niceScroll();
        $('#friendsSearch .sbtn').unbind().bind('click', function (e) {
            var expr = $('#searchBox').val();
            Services.getDPUsers(expr, Services.defaults.userId, 1, function (data) {
                userSearch.showFriends(data);
            }, function (e) { });
        });
        $('#friendsSearch form').on('submit', function (e) { $('#friendsSearch .sbtn').trigger('click'); });
        $('#addFriendsModal').unbind('click').bind('click', function (e) {
            ShowModalPopup("dvAddFriendsOverlay");
        });
    },
    initPopupCloseBtn: function () {
        $('.overlayclose').unbind('click').bind('click', function (e) {
            rxCommon.cancelPublicGroup();
            rxCommon.cancelPrivateGroup();
            rxCommon.cancelFriendSearch();
            rxCommon.cancelPost();
            rxCommon.cancelGroupMembers();
            $('.nicescroll-rails').css('opacity', 0);
        });
        $(document).bind('click', function (e) {
            var target = $(e.target);
            if (target.attr('id') != null && target.attr('id') != '' && target.attr('id').indexOf('backgroundPopup_') != -1 && target.attr('id').indexOf('backgroundPopup_') == 0) {
                $('.overlayclose').trigger('click');
            }
        });
        $(document).keyup(function (e) {
            if (e.keyCode == 27) { $('.overlayclose').trigger('click'); }   // esc
        });
    },
    openPublicGroupOverlay: function () {
        $("#txtPublicGroupName").val('');
        ShowModalPopup("dvPublicOverlay");        
        $("#dvPublicOverlay ul.nav li").removeClass("current-li");
        $("#dvPublicOverlay ul.nav li").first().addClass("current-li");
        rxCommon.showAddPublicGroup();
    },
    addPublicGroupName: function () {
        var publicGroupName = $("#txtPublicGroupName").val();
        if (publicGroupName == "") {
            alert("Please enter Group Name");
            return;
        } else {
            rxCommon.createPublicGroup(publicGroupName);
        }
    },
    cancelGroupMembers: function () {
        HideModalPopup("dvGroupMembersOverlay");
    },
    cancelPost: function () {
        HideModalPopup('dvPostOverlay');
    },
    cancelPublicGroup: function () {
        $("#txtPublicGroupName").val('');
        HideModalPopup("dvPublicOverlay");
    },
    cancelFriendSearch: function () {
        HideModalPopup("dvAddFriendsOverlay");
        $("#searchBox").val('');
        $('#searchResults ul').empty();
    },
    openPrivateGroupOverlay: function () {
        $("#txtPrivateGroupName").val('');
        $("#dvEditPvtMembers").html('');
        ShowModalPopup("dvPrivateOverlay");
        $("#dvPrivateOverlay ul.nav li").removeClass("current-li");
        $("#dvPrivateOverlay ul.nav li").first().addClass("current-li");
        rxCommon.showAddPrivateGroup();
        rxCommon.getFriendsForPrivateGroup();
        var currentUser = Services.defaults.displayName;
        $("#txtPrivateGroupName").keyup(function () {
            if ($("#txtPrivateGroupName").val() != "") {
                $("#txtPvtMessage").val(currentUser + ' ' + 'has created a new group' + ' ' + $("#txtPrivateGroupName").val());
            }
            else {
                $("#txtPvtMessage").val('');
            }
        });
    },
    addPrivateGroupName: function () {
        var privateGroupName = $("#txtPrivateGroupName").val();
        if (privateGroupName == "") {
            alert("Please enter Group Name");
            return;
        }
        else {
            rxCommon.createPrivateGroup(privateGroupName);
        }
    },
    cancelPrivateGroup: function () {
        $("#txtPrivateGroupName").val('');
        HideModalPopup("dvPrivateOverlay");
    },
    searchPrivateGroup: function () {
        var searchPrivateVal = $("#txtPrivateSearch").val();
        if (searchPrivateVal == "") {
            rxCommon.getPrivateGroups();
        }
        else {
            var results = [];
            $.each(rxCommon.privateGroups_g, function (index, value) {
                if (value.Topic_Name.toLowerCase().indexOf(searchPrivateVal) != -1) {
                    results.push(value);
                }
            });
            rxCommon.bindPrivateGroups(results);
        }
    },
    searchPublicGroup: function () {
        var searchPublicVal = $("#txtPublicSearch").val();
        if (searchPublicVal == "") {
            rxCommon.getPublicGroups();
        } else {
            var results = [];
            $.each(rxCommon.publicGroups_g, function (index, value) {
                if (value.Topic_Name.toLowerCase().indexOf(searchPublicVal) != -1) {
                    results.push(value);
                }
            });
            rxCommon.bindPublicGroups(results);
        }
    },
    getFriendsForPrivateGroup: function () {
        var inputdata = new Array();
        var input = {};

        input.name = "subdomainName";
        input.value = Services.defaults.subdomainName;
        inputdata.push(input)

        input = {};
        input.name = "userId";
        input.value = Services.defaults.userId;
        inputdata.push(input)

        Services.getTopics(Services.defaults.userId, function (data) {
            rxCommon.bindFriendsForPrivateGroup(data);
        }, function (e) { }); 
    },
    bindFriendsForPrivateGroup: function (data) {
        if (data != null && data.length > 0) {
            $.each(data, function (index, value) {
                rxCommon.privateFriends_g[value.Topic_Id] = value;
            });
            var content = "";
            var isEmpty = true;
            $.each(data, function (index, value) {

                var curFrnd = value, isActive = false;
                var scrObj = curFrnd.subscriptions;
                if (scrObj && scrObj.length > 0) {
                    var obj1 = scrObj[0], obj2 = scrObj[1];
                    isActive = (obj1.isActive && obj2.isActive ? true : false);
                    isRemoved = (obj1.isRemoved || obj2.isRemoved ? true : false);
                }

                if (value.Is_Active && isActive && !isRemoved) {
                    isEmpty = false;
                    content += "<div class='col-md-12 cls_no_padding bg-pvusr'>";
                    content += "<div class='col-md-1'></div>";
                    content += "<div class='col-md-1 cls_no_padding'>";
                    content += "<input type='checkbox' class='selectedFriends' style='margin-top: 15px;' name='chkSelectUser' value=" + value.Topic_Id + "  /></div>";
                    content += "<div class='col-md-2 cls_no_padding'>";
                    content += "<a href='/User/UserProfile/" + value.Subscription_User_Id + "'><img class='cls_img_user_profile' src='" + (value.User_Profile_Pic!=null?value.User_Profile_Pic:Services.defaults.defaultThumbnail) + "' /></a></div>";
                    content += "<div class='col-md-8 cls_dv_activityMsg'><a href='/User/UserProfile/" + value.Subscription_User_Id + "'>" + value.Display_Name + "</a></div>";
                    content += "</div>";
                }
            });
            content += "<div class='col-md-12 cls_no_padding'><input id='txtPvtMessage' value='' style='width:100%;'/></div>";
            if (isEmpty)
                $("#dvPrivateUser").html('You haven\'t added any friends');
            else
                $("#dvPrivateUser").html(content);
        } else {
            $("#dvPrivateUser").html('You haven\'t added any friends');
        }
    },
    getNotifications: function () {
        Services.getActionMsg(Services.defaults.userId, function (data) {
            rxCommon.createNotificationMenu(data);
        }, function () { });
    },
    createNotificationMenu: function (data) {
        rxCommon.isResponded = [];
        if (data && data.length > 0) {
            var notfEl = null;
            if ($('.notification-drop').length > 0) {
                notfEl = $('.notification-drop');
                notfEl.empty();
            } else {
                notfEl = $('<div class="notification-drop"></div>');
            }
            notfEl.append('<div class="header">Requests</div>');
            notfEl.append('<div class="notification-body"><ul></ul></div>');
            for (var i = 0; i < data.length; i++) {
                var curEl = $('<li class="notification-items clearfix"></li>');
                var notfObj = data[i];
                curEl.data('notfObj', notfObj);
                var html = '<div class="clearfix">';
                var prfImg = '<a class="prof-img clearfix" style="height: 60px; float: left;"><img style="width: 60px; height: 60px;" src="' + (notfObj.Profile_Photo_BLOB_URL!=null?notfObj.Profile_Photo_BLOB_URL:Services.defaults.defaultThumbnail) + '" alt="" style="width: 40px; height: 40px;"/></a>';
                var prfDesc = '<div class="prof-desc">' + notfObj.Message_Text + '</div>';

                var acceptButton = '<a class="accept-button" href="#">Accept</a>';
                var rejectButton = '<a class="reject-button" href="#">Reject</a>';

                html += prfImg + prfDesc + '<div class="actions-div">' + acceptButton + rejectButton + '</div>' + '</div>';

                curEl.html(html);
                var acceptBtn = curEl.find('.accept-button');
                var rejectBtn = curEl.find('.reject-button');
                rxCommon.requestActions(acceptBtn, rejectBtn);
                $('ul', notfEl).append(curEl);

                if (notfObj.Is_Responded == null || notfObj.Is_Responded == 0) {
                    rxCommon.isResponded.push(notfObj.Id);
                }
            }
            if (rxCommon.isResponded.length > 0) {
                $('#friendRequestsCount').show();
                $('#friendRequestsCount').html(rxCommon.isResponded.length);
            } else {
                $('#friendRequestsCount').show();
                $('#friendRequestsCount').html('*');
            }
            $('body').append(notfEl);
        } else {
            $('#friendRequestsCount').hide();
            $('#friendRequestsCount').html(0);
            $('.notification-drop').remove();
            var notfEl = $('<div class="notification-drop"></div>');
            notfEl.append('<div class="empty" style="width: 100%; padding: 15px;">No Requests</div>');
            $('body').append(notfEl);
        }
        rxCommon.dropMenu();
    },
    dropMenu: function () {
        $('#friendRequests').unbind('click').bind('click', function (e) {
            $('.notification-drop').toggle();
            if ($('.notification-drop').is(':visible')) {
                if (rxCommon.isResponded != null && rxCommon.isResponded.length > 0) {
                    var userFeedIds = {
                        feedId: rxCommon.isResponded
                    };
                    Services.updateIsRespond(userFeedIds, function (data) {
                        rxCommon.isResponded = [];
                        rxCommon.getNotifications();
                    }, function (e) { });
                }
            }
        });
    },
    requestActions: function (acceptBtn, rejectBtn) {
        acceptBtn.unbind('click').bind('click', function () {
           var _this = this;
           $(_this).hide();
            var pEl = $(this).parents('.notification-items').eq(0);
            var fObj = pEl.data('notfObj');
            Services.acceptInvite(Services.defaults.userId, fObj.Topic_Id, fObj.Message_Id, function (data) {
                pEl.remove();
                if ($('.notification-items').length == 0) {
                    $('.notification-drop').toggle();
                }
                rxCommon.refreshGroupsAndFriends();
                rxCommon.getNotifications();
                    }, function(){
                        $(_this).show();
                });
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
                rxCommon.refreshGroupsAndFriends();
                rxCommon.getNotifications();
            }, null);
            return false;
        });
    },
    refreshGroupsAndFriends: function () {
        rxCommon.getPublicGroups();
        rxCommon.getPrivateGroups();
        rxCommon.getFriends();
    },
    fileUpload: function () {
        var triggerEl = $('#add-image,#add-video');
        triggerEl.bind('click', function () {
            if ($(this).attr('id') == 'add-video')
                $('.file-upload input').attr('accept', 'video/*');
            else
                $('.file-upload input').attr('accept', 'image/*');
            $('.file-upload input').trigger('click');
            return false;
        });
        $('.post-uploaded-files').hide();
        $('.file-upload input').bind('change', function () {
            var fileInp = $("#post-file"), fileData = new FormData();
            rxCommon.bCreate = false;
            if (isImage(fileInp.val()))
                $('.post-uploaded-files').html('<div class="post-thumb"><img class="post-img" src="" alt=""/><img class="loader" src="images/RxBook/animation.gif" alt=""/><span class="post-thumb-delete fa fa-remove"></span></div>');
            if (isVideo(fileInp.val()))
                $('.post-uploaded-files').html('<div class="post-thumb"><img class="post-img" src="" alt="" /><img class="loader" src="images/RxBook/animation.gif" alt=""/><span class="post-thumb-delete fa fa-remove"></span></div>');
            $('.post-uploaded-files').show();
            rxCommon.filesSelected = null;
            fileData.append("companyId", 0);
            fileData.append("userId", 1);
            fileData.append("filename", fileInp[0].files[0]);
            var context = ['Attachment', 'FileUpload'];
            CoreREST.attach(context, fileData, function (data) {
                rxCommon.filesSelected = data.url;
                if (data.url != '') {
                    if (isImage(data.url))
                        $('.post-uploaded-files img.post-img').attr('src', data.url);
                    if (isVideo(data.url))
                        $('.post-uploaded-files img.post-img').attr('src', 'https://support.wright.edu/wrc/images/archive/e/e4/20090520125539!Video.png');
                    $('img.loader').hide();
                    $('.post-uploaded-files').show();
                }
                rxCommon.bCreate = true;
            }, function (err) {
                rxCommon.filesSelected = null;
                rxCommon.bCreate = true;
            });
            $('.post-thumb-delete').bind('click', function () {
                rxCommon.filesSelected = '';
                $('.post-thumb').remove();
                return false;
            });
        });
    },
    showAddPrivateGroup: function () {
        $("label[for='GpName']").html('');
        $("#dvEditPvtGroup").hide();
        $("#dvAddPvtGroup").show();
        $("#dvEditPvtGroupMembers").hide();
    },
    showEditPrivateGroup: function () {
        //$("#dvEditPvtMembers").hide();
        $("#dvAddPvtGroup").hide();
        $("#dvEditPvtGroup").show();
        $("#dvEditPvtGroupMembers").hide();
        rxCommon.getPrivateGroupsForEdit();
    },
    getPrivateGroupsForEdit: function () {
        Services.getPrivateGroups(Services.defaults.userId, function (data) {
            rxCommon.pvtSearchGroup_g = data;
            rxCommon.bindPrivateGroupsForEdit(data);
        }, function (e) { });
    },
    bindPrivateGroupsForEdit: function (data) {
        $("label[for='GpName']").empty();
        $('#dvEditPvtGroupMembers').empty();
        if (data.length > 0) {
            var content = null;
            $("#dvPvtGroups").empty();            
            var isEmpty = true;
            $.each(data, function (index, value) {
                var subscriber = rxCommon.getCurrentUserFromSubscriptions(value.subscriptions);
                if (value.Is_Active && subscriber != null && !subscriber.isRemoved && subscriber.isActive) {
                    isEmpty = false;
                    content = $("<div class='col-md-12 cls_no_padding bg-grp'></div>");
                    var topicName = "<div class='col-md-6'>";
                    topicName += "<span class='fa fa-users pad-rgt5'></span>";
                    topicName += value.Topic_Name;
                    topicName += "</div>";
                    content.append(topicName);
                    var isAdmin = (value.User_Id == Services.defaults.userId ? true : false);
                    var anchorTag = "";
                    var removeTag = "";
                    if (isAdmin) {
                        anchorTag = $("<a class='fa fa-pencil pull-right grp-edit'></a>");
                        removeTag = $("<a class='fa fa-remove pull-right grp-remove'></a>");
                    } else {
                        anchorTag = $("<div class='col-md-1'></div>");
                        removeTag = $("<a class='fa fa-remove pull-right grp-remove'></a>");
                    }
                    anchorTag.data('pvtData', value);                    
                    anchorTag.bind('click', function (e) {                        
                        rxCommon.retreivePrivateGroupMembers($(this).data('pvtData'));
                    });
                    removeTag.data('pvData', value);
                    removeTag.bind('click', function (e) {                        
                        rxCommon.removePrivateGroup($(this).data('pvData'));
                    });
                    content.append(removeTag);
                    content.append(anchorTag);
                    
                    
                    $("#dvPvtGroups").append(content);
                }
            });
            if (isEmpty) $("#dvPvtGroups").html('No groups found');
        } else {
            $("#dvPvtGroups").html('No groups found');
        }
    },
    retreivePrivateGroupMembers: function (pvData) {
        $("#dvEditPvtGroupMembers").show();
        rxCommon.getFriendsForPrivateGroupEdit(pvData);
    },
    getFriendsForPrivateGroupEdit: function (pvData) {
        var inputdata = new Array();
        var input = {};

        input.name = "subdomainName";
        input.value = Services.defaults.subdomainName;
        inputdata.push(input)

        input = {};
        input.name = "userId";
        input.value = Services.defaults.userId;
        inputdata.push(input)

        Services.getTopics(Services.defaults.userId, function (data) {
            rxCommon.bindFriendsForPrivateGroupEdit(data, pvData);
        }, function (e) { });
    },
    bindFriendsForPrivateGroupEdit: function (data, pvData) {
        $("#dvEditPvtGroupMembers").empty();
        var isEmpty = true;
        var uniqueTopics = {};
        $.each(data, function (index, value) {
            if (index == 0) {
                $("label[for='GpName']").html("GroupName : " + pvData.Topic_Name);
            }
            if (value.Is_Active && uniqueTopics[value.Subscription_User_Id] == null) {
                isEmpty = false;
                uniqueTopics[value.Subscription_User_Id] = value;
                var content = "<div class='col-md-12 bg-bindusr'>";
                content += "<div class='col-md-2' style='padding-top: 5px;'>";
                content += "<a href='/User/UserProfile/" + value.Subscription_User_Id + "'><img class='cls_img_user_profile' src='" + (value.User_Profile_Pic!=null?value.User_Profile_Pic:Services.defaults.defaultThumbnail) + "' /></a></div>";
                content += "<div class='col-md-6 cls_dv_activityMsg' style='padding-top:15px;'><a href='/User/UserProfile/" + value.Subscription_User_Id + "'>" + value.Display_Name + "</a></div>";
                content += "<div class='mg-top15' id='addOrRemoveDiv'>";
                content += "</div>";
                content += "</div>";
                var objContent = $(content);
                var isPvtGroup = rxCommon.isUserExistsInGroup(value, pvData);
                if (isPvtGroup) {
                    if (isPvtGroup == 'ACTIVE') {
                        var remove = $("<a class='btn-remove' style='cursor:pointer;'>Remove</a>");
                        remove.bind('click', function (e) {                            
                            rxCommon.removeUserFromPrivateGroup(value.Subscription_User_Id, pvData);
                        });
                        objContent.find('#addOrRemoveDiv').append(remove);
                    } else {
                        var pending = $("<span class='btn-request'>Pending Request</span>");
                        objContent.find('#addOrRemoveDiv').append(pending);
                    }
                } else {
                    var add = $("<a class='btn-add' style='cursor:pointer;'>Add</a>");
                    add.bind('click', function (e) {
                        rxCommon.addUserPrivateGroup(value.Subscription_User_Id, value.Display_Name, pvData);
                    });
                    objContent.find('#addOrRemoveDiv').append(add);
                }
                $("#dvEditPvtGroupMembers").append(objContent);
            }
        });
        /*$.each(pvData.subscriptions, function (index, value) {
            if(uniqueTopics[value.UserId] == null)
                console.log(value);
        });*/
        if (isEmpty) $("#dvEditPvtGroupMembers").html('No Members added to this group');
    },
    isUserExistsInGroup: function (user, pvGroup) {
        if (pvGroup.subscriptions.length > 0) {
            for (var i = 0; i <= pvGroup.subscriptions.length - 1; i++) {
                if (user.Subscription_User_Id == pvGroup.subscriptions[i].userId) {
                    if (pvGroup.subscriptions[i].isActive) {
                        return 'ACTIVE';
                    } else if (pvGroup.subscriptions[i].isRemoved) {
                        return false;
                    } else {
                        return 'INACTIVE';
                    }
                }
            }
            return false;
        } else
            return false;
    },
    removeUserFromPrivateGroup: function (userId, pvData) {
        var topicId = pvData.Topic_Id;        
        Services.removeTopic(Services.defaults.userId, topicId, userId, function (data) {
            if (data > 1) {
                rxCommon.refreshPvtGroups(pvData.Topic_Id);
            }
        }, function (e) { });
    },       
    refreshPvtGroups: function (topicId) {
        rxCommon.getPrivateGroupsForEdit();
        Services.getTopicById(Services.defaults.userId, topicId, function (data) {
            rxCommon.retreivePrivateGroupMembers(data);
        }, function (e) { });
    },
    
    searchPvtGroupForEdit: function () {
        var searchPvtGrpVal = $("#searchPvtGroup").val();
        if (searchPvtGrpVal == "") {
            rxCommon.getPrivateGroupsForEdit();
        } else {
            var results = [];
            $.each(rxCommon.pvtSearchGroup_g, function (index, value) {
                if (value.Topic_Name.toLowerCase().indexOf(searchPvtGrpVal.toLowerCase()) != -1) {
                    results.push(value);
                }
            });
            rxCommon.bindPrivateGroupsForEdit(results);
        }
    },
    addUserPrivateGroup: function (userIdVal, userDisplayName, pvData) {
        var topicIdVal = pvData.Topic_Id;
        var groupNameVal = pvData.Topic_Name;
        var displayNameVal = userDisplayName;
        
        var groupParams = {
            companyId: Services.defaults.companyId,
            topicName: groupNameVal,
            topicCategory: 2,
            isPublic: false,
            isSubscriptionRequired: true,
            userId: Services.defaults.userId,
            context: "",
            additionContext: "",
            subscriptions: [{
                topicId: topicIdVal,
                isContributor: true,
                isActive: false,
                displayName: displayNameVal,
                userId: userIdVal,
            }],
            messages: [{
                Company_Id: Services.defaults.companyId,
                User_Id: Services.defaults.userId,
                TimeStamp: new Date().toLocaleString(),
                Message_Text: Services.defaults.displayName + " " + "has invited " + displayNameVal + " to the Group" + " " + groupNameVal,
                Priority: true,
                Delivery_Mode: 0,
                Attachment: "",
                Action_Required: 1
            }],
            isActive: false,
            isCurrentUserActive: true,
            isRemoved: false,
            isContributor: false,
            isColleagueActive: false,
            isOwnerActive: true,
            isOwner: true,
            noOfActiveMembers: 1,
            displayName: Services.defaults.displayName,
        };

        Services.addSubscription(Services.defaults.userId, topicIdVal, groupParams, function (data) {
            if (data > 1) {
                rxCommon.refreshPvtGroups(pvData.Topic_Id);
            }
        }, function (e) { });
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
        if (subscriptions != null && subscriptions.length == 2) {
            for (var i = 0; i <= subscriptions.length - 1; i++) {
                var subscriber = subscriptions[i];
                if (Services.defaults.userId != subscriber.userId)
                    return subscriber;
            }
        }
        return null;
    },
    isFriendRemoved: function (subscriptions) {
        var subscriber = rxCommon.getCurrentUserFromSubscriptions(subscriptions);
        var friend = rxCommon.getFriendFromSubscriptions(subscriptions);
        if (subscriber.isRemoved || friend.isRemoved)
            return true;
        else
            return false;
    },
    removePrivateGroup: function (pvData) {
        var topicId = pvData.Topic_Id;
        var userIdVal = pvData.User_Id;
        Services.removeTopic(Services.defaults.userId, topicId, Services.defaults.userId, function (data) {
            if (data > 1) {               
                rxCommon.getPrivateGroupsForEdit();
                $("#dvEditPvtGroupMembers").hide();
            }
            rxCommon.getPrivateGroups();
        }, function (e) { });
    },
    addToGroup: function (obj, data, onSuccess, onFailure) {
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
            onSuccess(data);
        }, function (e) { onFailure(e); });
    },

    refreshMessagesCount: function () {
        Services.getUnReadMessagesCount(Services.defaults.userId, function (data) {
            var cnt = 0;           
            for (var i = 0; i <= data.length - 1; i++) {
                if (cnt >= rxCommon.maxMessageCnt) {
                    cnt = rxCommon.maxMessageCnt;
                    break;
                } else {
                    cnt += data[i].messageCount;
                }
            }
            if (cnt > 0) {
                $('#messagesCount').html(cnt + (cnt > rxCommon.maxMessageCnt ? (rxCommon.maxMessageCnt + '+') : '')).show();
            } else
                $('#messagesCount').hide();
        }, function (e) { $('#messagesCount').hide(); });
    },

    showAddPublicGroup: function () {        
        $("#dvEditPubGroup").hide();
        $("#dvAddPubGroup").show();        
    },
    showEditPublicGroup: function () {        
        $("#dvAddPubGroup").hide();
        $("#dvEditPubGroup").show();        
        rxCommon.getPublicGroupsForEdit();
    },
    getPublicGroupsForEdit: function () {
        Services.getPublicGroups(Services.defaults.userId, function (data) {
            rxCommon.pubSearchGroup_g = data;
            rxCommon.bindPublicGroupsForEdit(data);
        }, function (e) { });
    },
    bindPublicGroupsForEdit: function (data) {
        $('#dvPubGroups').empty();
        if (data.length > 0) {
            var publicGroups = $("#dvPubGroups");
            publicGroups.empty();
            var isEmpty = true;
            $.each(data, function (index, value) {
                var subscriber = rxCommon.getCurrentUserFromSubscriptions(value.subscriptions);
                if (subscriber != null && subscriber.isActive && !subscriber.isRemoved) {
                    isEmpty = false;
                    var main = $("<div class='col-md-12 cls_no_padding pub-pad bg-grey'></div>");
                    main.append("<span class='fa fa-users pad-rgt5'></span>");
                    main.append('<a style="cursor:pointer; width: 124px; display: inline-block;">' + value.Topic_Name + '</a>');
                    var removeIcon = $("<a class='pad-lt5 fa fa-remove' style='float: right; text-decoration: none; cursor:pointer;'></a>");
                    removeIcon.data('publicGroup', value);
                    removeIcon.bind('click', function (e) {
                        rxCommon.removePublicGroup($(this).data('publicGroup'), function (data) {
                            rxCommon.getPublicGroups();
                        }, function () { });
                    });
                    main.append(removeIcon);
                    publicGroups.append(main);
                }
            });
            if (isEmpty) $("#dvPubGroups").html('No groups found');
            $('#publicGroupsSearch').show();
        } else {
            $("#dvPubGroups").html('No groups found');
            //$('#publicGroupsSearch').hide();
        }
    },

    removePublicGroup: function (pvData) {
        var topicId = pvData.Topic_Id;
        Services.removeTopic(Services.defaults.userId, topicId, Services.defaults.userId, function (data) {
            rxCommon.getPublicGroupsForEdit();
            rxCommon.getPublicGroups();
        }, function (e) { });
    },
    searchPubGroupForEdit: function () {
        var searchPubGrpVal = $("#searchPubGroup").val();
        if (searchPubGrpVal == "") {
            rxCommon.getPublicGroupsForEdit();
        } else {
            var results = [];
            $.each(rxCommon.pubSearchGroup_g, function (index, value) {
                if (value.Topic_Name.toLowerCase().indexOf(searchPubGrpVal.toLowerCase()) != -1) {
                    results.push(value);
                }
            });
            rxCommon.bindPublicGroupsForEdit(results);
        }
    },

    bindPostPopup: function (postItem) {
        var postPopup = $('#postPopupContent');
        var postComments = $('#postPopupComments');
        if (postPopup.getNiceScroll().length > 0)
            postPopup.getNiceScroll().resize();
        else
            postPopup.niceScroll();
        if (postComments.getNiceScroll().length > 0)
            postComments.getNiceScroll().resize();
        else
            postComments.niceScroll();

        postPopup.empty();

        $('.popupPostUserPic').attr('src', postItem.Profile_Photo_BLOB_URL);
        $('#popupPostUserName').html('<a href="/User/UserProfile/' + postItem.User_Id + '">' + postItem.FirstName + '</a>');
        $('#popupPostTimestamp').html(postItem.timestampFormatted);

        var message = $('<p>' + postItem.Message_Text + '</p>');
        postPopup.append(message);

        if (postItem.Attachment != undefined && postItem.Attachment != null && postItem.Attachment != 'null' && postItem.Attachment != '') {
            var attachment = null;
            if (isImage(postItem.Attachment))
                attachment = $('<img src="' + postItem.Attachment + '" alt="" />');
            if (isVideo(postItem.Attachment))
                attachment = $('<video controls><source src="' + postItem.Attachment + '" type="video/mp4">Your browser does not support the video tag.</video>');
            attachment.bind('click', function (e) {
                return false;
            });
            postPopup.append(attachment);
        }

        var comments = rxCommon.addPopupComments(postItem);
        postComments.html(comments);

        var postPopupActn = $('#postPopupActn');
        postPopupActn.empty();
        var likeBtn = $('<a href="#" class="like" style="font-size: 12px;"><div class="fa fa-thumbs-up" style="color: #0054A5; font-size: 15px;"></div> Like (' + postItem.Likes + ') </a>');
        if (postItem.lstFeedAnalytics == null || postItem.lstFeedAnalytics.length <= 0 || !rxCommon.isUserLikes(postItem)) {
            likeBtn.bind('click', function (e) {
                //var postItem = $(this).parents('.posts-item').data('postItem');
                Services.updateFeedLikes(postItem.Feed_Master_Id, Services.defaults.userId, true, function (data) {
                    if (data) {
                        rxCommon.getUserFeedById(postItem);
                    }
                }, function (e) { });
                return false;
            });
        } else {
            likeBtn.css('color', '#A6A6A6');
            likeBtn.find('div').css('color', '#A6A6A6');
            likeBtn.bind('click', function (e) { return false; });
        }
        var replyBtn = $('<a href="#" class="reply" style="font-size: 12px;"><div class="fa fa-mail-reply" style="color: #0054A5; font-size: 15px;"></div> Reply</a>');
        replyBtn.bind('click', function (e) {
            $('#popupAddComment').focus();
            return false;
        });
        var cmntBtn = $('<a href="#" class="comments" style="font-size: 12px;"><div class="fa fa-comments" style="color: #0054A5; font-size: 15px;"></div> Comment (' + (postItem.lstFeedComments ? postItem.lstFeedComments.length : 0) + ')</a>');
        cmntBtn.bind('click', function (e) {
            $('#popupAddComment').focus();
            return false;
        });
        postPopupActn.append(likeBtn);
        //postPopupActn.append(replyBtn);
        postPopupActn.append(cmntBtn);

        $('#popupAddComment').val('');
        $('#popupImgComment').attr('src', Services.defaults.myProfileURL);
        rxCommon.insertPopupComment(postItem);
    },
    insertPopupComment: function (postItem) {
        $('#popupAddComment').unbind('keypress').bind('keypress', function (event) {
            var keycode = (event.keyCode ? event.keyCode : event.which);
            if (keycode == '13') {
                var curPost = $(this).parents('.posts-item').eq(0);
                var messageTxt = $(this).val();
                var feedCommentData = {}
                feedCommentData.UserId = Services.defaults.userId;
                feedCommentData.FeedId = postItem.Id;
                feedCommentData.FeedMasterId = postItem.Feed_Master_Id;
                feedCommentData.MessageText = messageTxt.autoLink();
                feedCommentData.Attachment = null;
                Services.insertUserComment(feedCommentData, function (data) {
                    if (data) {
                        rxCommon.getUserFeedById(postItem);
                    }
                }, function () { });
            }
        });
    },
    getUserFeedById: function(postItem) {
        Services.getUserFeedsById(postItem.Id, function (data) {
            if (data != null && data.length > 0) {
                rxCommon.bindPostPopup(data[0]);
                ShowModalPopup('dvPostOverlay');
            }
            return false;
        }, function (e) { alert('Unable to fetch data.'); });
    },
    addPopupComments: function (value) {
        var cmnt = '';
        if (value.lstFeedComments != null && value.lstFeedComments.length > 0) {
            $.each(value.lstFeedComments, function (ind, value1) {
                cmnt += '<div class="comment-item clearfix">';
                cmnt += '<div class="comment-prof"><a href="/User/UserProfile/' + value1.UserId + '"><img src="' + (value1.Profile_Photo_BLOB_URL != null ? value1.Profile_Photo_BLOB_URL : Services.defaults.defaultThumbnail) + '" alt="" /></a></div>';
                cmnt += '<div class="comment-desc"><span><label><a href="/User/UserProfile/' + value1.UserId + '">' + value1.Display_Name + '</a>&nbsp</label>' + value1.Message_Text + '</span><span class="suffix">' + value1.timestampFormatted + '</span></div>';
                cmnt += '</div>';
            });
        }
        return cmnt;
    },
    isUserLikes: function (postItem) {
        if (postItem.lstFeedAnalytics != null && postItem.lstFeedAnalytics.length > 0) {
            for (var i = 0; i <= postItem.lstFeedAnalytics.length - 1; i++) {
                var u = postItem.lstFeedAnalytics[i];
                if (u.UserId == Services.defaults.userId && u.Is_Liked == true)
                    return true;
            }
        }
        return false;
    }
};

Date.getDateString = function () {
    var dte = new Date();
    var hours = dte.getHours() > 12 ? dte.getHours() - 12 : dte.getHours();
    var zone = dte.getHours() > 12 ? 'PM' : 'AM';
    dte = (dte.getMonth() + 1) + '/' + dte.getDate() + '/' + dte.getFullYear() + ' ' + hours + ':' + dte.getMinutes() + ' ' +
     zone;
    return dte;
};

var getExtension = function (filename) {
    var parts = filename.split('.');
    return parts[parts.length - 1];
}

var isImage = function (filename) {
    var ext = getExtension(filename);
    switch (ext.toLowerCase()) {
        case 'jpg':
        case 'gif':
        case 'bmp':
        case 'png':
            //etc
            return true;
    }
    return false;
}

var isVideo = function (filename) {
    var ext = getExtension(filename);
    switch (ext.toLowerCase()) {
        case 'm4v':
        case 'avi':
        case 'mpg':
        case 'mp4':
            // etc
            return true;
    }
    return false;
}

var isPushStateAllowed = function () {
    if ($.browser.msie) {
        if ($.browser.version < 10)
            return false;
    }
    return true;
}

var logOff = function () {
    $.ajax({
        url: '../../Account/LogOff',
        async: true,
        crossDomain: true,
        success: function (response) {
            window.location.href =  response;
        },
        error: function (error) {
            //alert(error.message)
        }
    });
    
}