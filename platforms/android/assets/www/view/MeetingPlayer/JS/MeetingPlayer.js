var chat = {};

/* defaults */
chat.channel = null;
chat.name = null;
chat.uuid = null;
chat.pubnub = null;
chat.publish_key = common.defaults.publish_key;
chat.subscribe_key = common.defaults.subscribe_key;
chat.currentSlide = '';//slides[0];
chat.isOwner = false;
chat.id = null;
chat.curEl = null;
chat.isEnableDraw = true;
chat.moderatorId = '';
chat.ownerId = null;

/* Methods */
chat.init = function () {
    chat.cancelActions();
    var meetingId = '';

    var href = window.location.href;
    href = href.substr(href.indexOf('?') + 1, href.length);

    var nAry = href.split('&');
    meetingId = nAry[1].replace('meetingId=', '');
    var userId = nAry[0].replace('userId=', '');

    chat.channel = meetingId;

    Services.getMeetingDeatils(meetingId, function (data) {
        if (data && data !== undefined) {
            var meetingDetails = data.lstMeetingHeader[0];
            chat.channel = meetingDetails.Meeting_Id;
            chat.meetingName = meetingDetails.Meeting_Name;
            chat.slides = data.lstMeetingMatList;
            chat.owner = meetingDetails.Moderator_Name;
            chat.moderatorId = meetingDetails.Moderator_Name;
            chat.ownerId = meetingDetails.Moderator_Id;

            if (userId == meetingDetails.Moderator_Id) {
                chat.name = meetingDetails.Moderator_Name;
                chat.isOwner = true;
                chat.id = meetingDetails.Moderator_Id;
                chat.currentSlide = chat.slides[0].Material_Url;
                $('#reset-attend').show().css('left', $('.slider-container').offset().left);
            } else {
                chat.isOwner = false;
                chat.id = chat.getUserObject(data.lstMeetingParticipant, userId).Participant_UserID;
                chat.name = chat.getUserObject(data.lstMeetingParticipant, userId).Participant_FName;
                $('#reset-attend').hide();
            }

            chat.uuid = 'user_'+chat.id;
            chat.participants = data.lstMeetingParticipant;
            chat.resizeWindow();
            $(window).resize(function () {
                chat.resizeWindow();
            });
            chat.loadSlider(function () {
                chat.createParticipants();
                chat.initPubNub();
                chat.startChannel();
                chat.chatActions();
                if (meetingDetails.Participant_Can_Annotate == 0 || meetingDetails.Participant_Can_Annotate == false) {
                    if (chat.isOwner) {
                        canvas.init(chat.pubnub, chat.channel);
                    } else{
                    	canvas.getCanvas();
                    }
                } else {
                    canvas.init(chat.pubnub, chat.channel);
                }
                chat.joinMeeting();
            });
        }
    }, function () { });
};
chat.cancelActions = function () {
    $('#meeting-create, #meeting-lists, #meeting-upload').unbind('click').bind('click', function () {
        return false;
    });
    $('#meeting-create a, #meeting-lists a, #meeting-upload a').unbind('click').bind('click', function () {
    	if(chat.isOwner){
        var actn = window.confirm('Are you sure you want to leave, this action will close the meeting and end all session with all participants');
    	} else {
    		var actn = window.confirm('Are you sure you want to leave, this action will close your meeting..');
    	}
        if (actn == true)
            chat.logoutMeeting();
        else
            return false;
        
    });
};
chat.getUserObject = function (userArray, id) {
    if (id && userArray && userArray.length > 0) {
        for (var i = 0; i < userArray.length; i++) {
            if (userArray[i].Participant_UserID == id) {
                return userArray[i];
            }
        }
    }
    return null;
};
chat.chatActions = function () {
    $('#chat-container p span').text(chat.name);
    $('#chat-form').submit(function () {
        chat.createChat();
        return false;
    });
    $('a.open-chat').unbind('click').bind('click', function () {
        $('#chat-container').show();
        $(this).hide();
        return false;
    });
    $('#close-btn').unbind('click').bind('click', function () {
        $('#chat-container').hide();
        $('a.open-chat').show();
        $('.open-chat').removeAttr('id');
        $('#hold-canvas-draw').removeClass('chat-green');
        //$('.chat-in').remove();
        return false;
    });
    $('#chat-start').unbind('click').bind('click', function () {
        //chat.startChannel();
        return false;
    });
    $('#leave-chat').unbind('click').bind('click', function () {
        //chat.leaveChat();
        return false;
    });
    $('#player-leave a').unbind('click').bind('click', function () {
    	if (chat.isOwner) {
            var actn = window.confirm('Are you sure you want to leave, this action will close the meeting and end all session with all participants.');
        } else {
            var actn = window.confirm('Are you sure you want to leave, this action will close your meeting.');
        }
        if (actn == true) {
        	common.showLoader();
        	chat.logoutMeeting();
        }
        //window.location.href = 'start_meeting.html';
        return false;
    });
    $('#hold-canvas-draw').unbind('click').bind('click', function () {
        canvas.canDraw = !canvas.canDraw;
        if (!canvas.canDraw)
            $('#hold-canvas-draw').addClass('disable-draw');
        else
            $('#hold-canvas-draw').removeClass('disable-draw');
        return false;
    });
    $('#reset-attend').unbind('click').bind('click', function () {
        chat.pubnub.publish({
            channel: chat.channel,
            message: {
                url: chat.currentSlide
            }
        });
        return false;
    });
    $(window).resize(function () { 
        if(chat.isOwner == true || chat.isOwner == 'true')
            $('#reset-attend').show().css('left', $('.slider-container').offset().left);
    });
};
/*chat.logoutMeeting = function () {
    chat.leaveMeeting(chat.isOwner, function () {
        chat.pubnub.unsubscribe({
            channel: chat.channel,
            callback: function () {
                chat.onSlideChange(function () {
                	common.hideLoader();
                    window.location.href = 'MeetingHome.html';
                });
            }
        });
    }, false);
};*/
/*logout meeting new*/
chat.logoutMeeting = function () {
    common.showLoader();
    chat.leaveMeeting(chat.isOwner, function () {
        chat.pubnub.unsubscribe({
            channel: chat.channel,
            callback: function () {
                chat.onSlideChange(function () {
                	common.hideLoader();
                    window.location.href = 'MeetingHome.html';
                });
            }
        });
        setInterval(function() {
            var uuid = chat.uuid;
            chat.pubnub.here_now({
                channel: chat.channel,
                callback: function(e) {
                    if(e != null && e.uuids != null && e.uuids.length > 0) {
                        var isPresent = false;
                        for(var i=0;i<=e.uuids.length-1;i++) {
                            if(e.uuids[i] == uuid) {
                                isPresent = true;
                            }
                        }
                        if(!isPresent) {
                            chat.onSlideChange(function () {
                                common.hideLoader();
                                window.location.href = 'MeetingHome.html';
                            });
                        }
                    } else {
                        chat.onSlideChange(function () {
                            common.hideLoader();
                            window.location.href = 'MeetingHome.html';
                        });
                    }
                }
            });
        }, 2000);
    }, function(e) {
        alert(networkProblemError);
        common.hideLoader();
    });
};
/*logout meeting new*/
chat.createParticipants = function () {
    var participants = chat.participants;
    for (var i = 0; i < participants.length; i++) {
        var curParticipant = participants[i];
        var pName = curParticipant.Participant_FName.toLowerCase();
        if (chat.name.toLowerCase() != pName) {
        	var $new_user = $('<li class="logOut" id="user_' + curParticipant.Participant_UserID + '">' + pName + '</li>');
            $('.user-list').append($new_user);
        }
    }
};
chat.initPubNub = function () {
    chat.pubnub = PUBNUB.init({
        publish_key: chat.publish_key,
        subscribe_key: chat.subscribe_key,
        uuid: chat.uuid
    });
};
chat.startChannel = function () {
    chat.pubnub.subscribe({
        channel: chat.channel,
        message: function (data) {
            if (data.url == '') return;
            if (data.url)
                canvas.updateCanvas(data);
            else if (data.plots)
                canvas.drawFromStream(data);
            else
                chat.createMessageList(data);
        },
        presence: function (data) {
        	if (data.uuid == 'user_' + chat.ownerId && data.action == 'leave') {
                chat.pubnub.unsubscribe({
                    channel: chat.channel,
                    callback: function () {
                        alert('Admin has ended the session you are redirected to main page.');
                        window.location.href = 'MeetingHome.html';
                    }
                });
            } else {
                document.getElementById('occupancy').textContent = data.occupancy;
                chat.createUserPresence(data);
                if ($('#imgDiv').attr('src') == '' && chat.isOwner == true) {
                    var dt = { url: chat.currentSlide };
                    canvas.updateCanvas(dt);
                }
                if (data.action == 'join') {
                    chat.pubnub.publish({
                        channel: chat.channel,
                        message: {
                            url: chat.currentSlide
                        }
                    });
                }
            }
        }
    });
};

chat.createChat = function () {
    var $input = $('#chat-input');
    if ($input.val() != '') {
        chat.pubnub.publish({
            channel: chat.channel,
            message: {
                text: $input.val(),
                username: chat.name
            }
        });
    } else {
        alert('Enter any text');
        return false;
    }
    $input.val('');
};
chat.createMessageList = function (data) {
    $('.open-chat').removeAttr('id');
    $('#hold-canvas-draw').removeClass('chat-green');
    if (data.username != chat.name) {
        $('.open-chat').attr('id', 'chat-in');
        $('#hold-canvas-draw').addClass('chat-green');
    }
    chat.output = $('#chat-output');
    var $line = $('<li class="list-group-item "><strong>' + data.username + ':</strong> </span>');
    var $message = $('<span class="text" />').text(data.text).html();
    $line.append($message);
    chat.output.append($line);
    $('#chat-output').scrollTop($('#chat-output')[0].scrollHeight);
};
/*chat.createUserPresence = function (data) {
    if (data.action == "join") {
        $('#' + data.uuid.toLowerCase()).removeClass('logOut').addClass('logIn');
    } else if (data.action == "leave" || data.action == "timeout") {
        $('#' + data.uuid.toLowerCase()).removeClass('logIn').addClass('logOut');
    }
};*/

chat.createUserPresence = function (data) {
	if (data.action == "join") {
        $('#' + data.uuid.toLowerCase()).removeClass('logOut').addClass('logIn');
    } else if (data.action == "leave" || data.action == "timeout") {
        $('#' + data.uuid.toLowerCase()).removeClass('logIn').addClass('logOut');
    }
};
chat.loadSlider = function (callback) {
    if (chat.isOwner) {
        var sliderDiv = '';
        sliderDiv += '<ul class="img_carousel">';
        var storyList = chat.slides;
        chat.curEl = storyList[0].Material_Id + '#' + storyList[0].Material_LIst_Id;
        for (var i = 0; i < storyList.length; i++) {
            var curSlide = storyList[i];
            sliderDiv += '<li id="' + curSlide.Material_Id + '#' + curSlide.Material_LIst_Id + '"><img src="' + curSlide.Material_Url + '" />';
            sliderDiv += '</li>';
        }
        sliderDiv += '</ul>';
        $('#slider-container').html(sliderDiv);

        $('.img_carousel').bxSlider({
            minSlides: 1, maxSlides: 4,
            slideWidth: 100, slideMargin: 20, pager: false,
            infiniteLoop: false, moveSlides: 1,
            onSliderLoad: function () {
                //callback();
                chat.onFinishSliderLoad(callback);
            }
        });
    } else {
        callback();
    }
};


/*chat.onSlideChange = function (callback) {
    if (callback) callback();

    var saveOrUpdateData = new Array();
    var currentDate = new Date();
    var material =null;
    if(chat.curEl != null || chat.curEl != undefined)
    material = chat.splitSlidesId(chat.curEl);

    if (chat.toUpdateSlides != null) {
        //for (var i = 0; i <= chat.toUpdateSlides.length - 1; i++) {
        var obj1 = {
            Material_Status_Id: chat.toUpdateSlides,
            Meeting_Id: chat.channel,
            Material_Id: material.materialId,
            Material_List_Id: material.slideId,
            UserId: chat.id,
            Close_DateTime: currentDate
        };

        Services.createOrUpdateMaterialStatus(obj1, function (data) {
            var obj = {
                Material_Status_Id: 0,
                Meeting_Id: chat.channel,
                Material_Id: material.materialId,
                Material_List_Id: material.slideId,
                UserId: chat.id,
                Open_DateTime: currentDate
            };
            Services.createOrUpdateMaterialStatus(obj, function (data) {
                chat.toUpdateSlides = data;
                if (callback) callback();
            }, function () { });
        }, function () { });
        //saveOrUpdateData.push(obj);
        //}
    } else {
    	if(material !== null){
    		var obj = {
    	            Material_Status_Id: 0,
    	            Meeting_Id: chat.channel,
    	            Material_Id: material.materialId,
    	            Material_List_Id: material.slideId,
    	            UserId: chat.id,
    	            Open_DateTime: currentDate
    	        };
    	        Services.createOrUpdateMaterialStatus(obj, function (data) {
    	            //alert(data);
    	            chat.toUpdateSlides = data;
    	            if (callback) callback();
    	        }, function () { });
    	}
    }
};*/

chat.onSlideChange = function (callback) {
	if (callback) callback();
	
	var saveOrUpdateData = new Array();
	var currentDate = new Date();
	//var material = null;
	//if (chat.curEl !== null || chat.curEl !== undefined)
	var  material = chat.splitSlidesId(chat.curEl);
	
	if (chat.toUpdateSlides != null) {
	    //for (var i = 0; i <= chat.toUpdateSlides.length - 1; i++) {
	    var obj1 = {
	        Material_Status_Id: chat.toUpdateSlides,
	        Meeting_Id: chat.channel,
	        Material_Id: material.materialId,
	        Material_List_Id: material.slideId,
	        UserId: chat.id,
	        Close_DateTime: currentDate
	    };
	
	    Services.createOrUpdateMaterialStatus(obj1, function (data) {
	        var obj = {
	            Material_Status_Id: 0,
	            Meeting_Id: chat.channel,
	            Material_Id: material.materialId,
	            Material_List_Id: material.slideId,
	            UserId: chat.id,
	            Open_DateTime: currentDate
	        };
	        Services.createOrUpdateMaterialStatus(obj, function (data) {
	            chat.toUpdateSlides = data;
	            if (callback) callback();
	        }, function () { });
	    }, function () { });
	} else {
	        var obj = {
	            Material_Status_Id: 0,
	            Meeting_Id: chat.channel,
	            Material_Id: material.materialId,
	            Material_List_Id: material.slideId,
	            UserId: chat.id,
	            Open_DateTime: currentDate
	        };
	        Services.createOrUpdateMaterialStatus(obj, function (data) {
	            //alert(data);
	            chat.toUpdateSlides = data;
	            if (callback) callback();
	        }, function () { });
	}
};
chat.onFinishSliderLoad = function (callback) {
    chat.onSlideChange(false);
    //alert(callback);
    if (callback) callback();
    $('.img_carousel li').unbind('click').bind('click', function () {
        chat.curEl = $(this).attr('id');
        chat.currentSlide = $('img', $(this)).attr('src');
        //canvas.clearCanvas();
        chat.onSlideChange(function () {
            canvas.clearCanvas();
            chat.pubnub.publish({
                channel: chat.channel,
                message: {
                    url: chat.currentSlide
                }
            });
        });
        return false;
    });
};

chat.joinMeeting = function () {
    /*var participant = {
        Id: null,
        MeetingId: chat.meetingId,
        ParticipantId: chat.userId,
        JoinDateTime: new Date(),
        LeftDateTime: null
    };
    Services.saveOrUpdateMeeting(participant, function (data) {
        chat.joinDetailId = data;
    }, false);*/
};

chat.leaveMeeting = function (isOwner, callback) {
    if (isOwner) {
        var currentDate = new Date();
        var material = chat.splitSlidesId(chat.curEl);
        var obj1 = {
            Material_Status_Id: chat.toUpdateSlides,
            Meeting_Id: chat.channel,
            Material_Id: material.materialId,
            Material_List_Id: material.slideId,
            UserId: chat.id,
            Close_DateTime: currentDate
        };

        Services.createOrUpdateMaterialStatus(obj1, function (data) {
            Services.leaveMeetingModerator(chat.channel, function (data) {
                if (callback) callback();
            }, function () { });
        });
    } else {
        Services.leaveMeetingParticipants(chat.channel, chat.id, function (data) {
        	if (callback) callback();
        }, function () { });
    }
};
chat.resizeWindow = function () {
    var hgt = $(window).height() - 40;
    $('#meeting-block').height(hgt);
    $('.col-content').height($('#meeting-block').height());
    //fix slider
    var contentHgt = $('.col-content').height();
    var sliderHgt = $('#slider-container').height();
    var canvasHgt = contentHgt - sliderHgt;
    if (chat.isOwner == 'false' || chat.isOwner == false) {
        $('#canvas-container,#chat-container').css('height', contentHgt);
        $('#slider-container').remove();
    } else {
        $('#canvas-container,#chat-container').css('height', canvasHgt);
    }
};
chat.splitSlidesId = function (id) {
    var obj = {};
    var objAry = id.split('#');
    obj.materialId = objAry[0];
    obj.slideId = objAry[1];
    return obj;
}
$(document).ready(function () {
    chat.init();
});