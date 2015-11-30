var usermeetings = {
    init: function () {
        usermeetings.getCurrentMeeting();
        usermeetings.getPastMeeting();
    },

    getCurrentMeeting: function () {
    	
    	common.showLoader();
        Services.getCurrentMeetings(common.defaults.userId, function (data) {
            usermeetings.bindcurrentMeetings(data);
        }, function () {
            common.hideLoader();
        });
    },

    getPastMeeting: function () {
        Services.getPastMeetings(common.defaults.userId, function (data) {
            usermeetings.bindpastMeetings(data);
        });
    },

    getMeetingStatus: function (meetingId, success) {
        Services.getMeetingStatus(meetingId, function (data) {
            console.log(data);
            if (success)
                success(data);
        }, function (e) {
            //console.log(e);
        });
    },

    acceptMeeting: function (meeting) {
        usermeetings.getMeetingStatus(meeting.Meeting_Id, function (data) {
            if (data == 0) {
                Services.changeMeetingStatus(meeting.Meeting_Id, common.defaults.userId, 1, function (data) {
                    usermeetings.getCurrentMeeting();
                }, function () { });
            } else if (data == 1) {
                Services.changeMeetingStatus(meeting.Meeting_Id, common.defaults.userId, 1, function (data) {
                    Services.joinMeetingParticipants(meeting.Meeting_Id, common.defaults.userId, function (data) {
                        window.location.href = 'MeetingPlayer.html?userId=' + common.defaults.userId + '&meetingId=' + meeting.Meeting_Id;
                    }, function (e) { });
                }, function () { });
            }
            else if (data == 2) {
                $('#' + meeting.MeetingID).remove();
                alert('Meeting time ended');
            }
        });
    },

    declineMeeting: function (meeting) {

        Services.changeMeetingStatus(meeting.Meeting_Id, common.defaults.userId, 2, function (data) {
            usermeetings.getCurrentMeeting();
            //console.log(data);
        }, function () { });
    },

    updatedmeeting: function(meeting){
        usermeetings.getMeetingStatus(meeting.Meeting_Id, function (data) {
            if (data == 0) {
                alert("Meeting not Started by the moderator");
                    usermeetings.getCurrentMeeting();
            } else if (data == 1) {
                    Services.joinMeetingParticipants(meeting.Meeting_Id, common.defaults.userId, function (data) {
                        window.location.href = 'MeetingPlayer.html?userId=' + common.defaults.userId + '&meetingId=' + meeting.Meeting_Id;
                    }, function (e) { });
            }
            else if (data == 2) {
                $('#' + meeting.MeetingID).remove();
                alert('Meeting time ended');
            }
        });
    },
    /*bindcurrentMeetings: function (meetings) {
        var el = $('#current-list');
        if (meetings && meetings.length > 0) {
            el.empty();
            for (var i = 0; i < meetings.length; i++) {
                var meeting = meetings[i];
                console.log(meeting);
                var dat = Date.now(); dat = common.dateFormat(dat);
                var meetingele = meeting.Meeting_Id;
                var desc = (meeting.Meeting_Description == null ? '' : meeting.Meeting_Description);
                var li = $('<li></li>'); li.addClass('clearfix').attr('id', meetingele);
                li.append('')
                li.append('<div class="meeting-name"><h2><span class="fa fa-circle"></span>' + meeting.Meeting_Name + '</h2>' +
                          '<p>' + desc + '</p></div>');
                li.append('<div class="meeting-date"><div><span class="fa fa-calendar date-label"></span><span> From : </span>' +
                          '<span>' + meeting.Formatted_Start_DateTime + '</span></div><div><span class="fa fa-calendar date-label"></span><span> To : </span><span>' +
                          meeting.Formatted_End_DateTime + '</span></div></div>');

                if (meeting.Meeting_Status != 2) {
                    if (meeting.Participant_MeetingAcceptStatus == 2) {
                        li.append('<div class="rejected-status" style="display:block">You have rejected the meeting at <span>' + meeting.Formatted_MeetingAcceptStatus_DateTime + '</span></div>');
                    } else {
                        if (meeting.Participant_MeetingAcceptStatus == 0) {
                            if (meeting.Meeting_Status == 1) {
                                li.append('<div class="meeting-status"><div class="join-div" style="display:block"><a class="join-btn" href="#">Join Meeting</a></div></div>');
                            } else if (meeting.Meeting_Status == 0) {
                                li.append('<div class="meeting-status"><div class="join-decline" style="display:block"><a class="decline-btn" href="#">Decline</a><a class="join-btn" href="#">Accept</a></div>'
                                 );
                            }
                        } else {
                            if (meeting.Meeting_Status == 1) {
                                li.append('<div class="meeting-status"><div class="join-div" style="display:block"><a class="joined-meeting" href="#">Join Meeting</a></div></div>');
                            } else if (meeting.Meeting_Status == 0) {
                                li.append('<div class="meeting-status"><div class="join-decline" style="display:block"><a class="decline-btn" href="#" style="display:block">Decline</a></div>');
                            }
                            li.append('<div class="accepted-status" style="display:block">You have accepted the meeting at <span>' + meeting.Formatted_MeetingAcceptStatus_DateTime + '</span></div>');
                        }
                    }
                } else {
                    if (meeting.Participant_MeetingAcceptStatus == 2) {
                        li.append('<div class="rejected-status" style="display:block">You have rejected the meeting at <span>' + meeting.Formatted_MeetingAcceptStatus_DateTime + '</span></div>');
                    } else if (meeting.Participant_MeetingAcceptStatus == 1) {
                        li.append('<div class="accepted-status" style="display:block">You have accepted the meeting at <span>' + meeting.Formatted_MeetingAcceptStatus_DateTime + '</span></div>');
                    }
                }
                li.data('meetingobj', meeting);
                el.append(li);
            }
            usermeetings.bindMeetingAction(el);
            usermeetings.acceptedmeetingstatus(el);
        } else {
            el.append('<li class="success-msg">Currently No meetings found for you. Please refresh to see meetings.</li>');
        }
    },*/
    
    bindcurrentMeetings: function (meetings) {
    	common.hideLoader();
        var el = $('#current-list');
        if (meetings && meetings.length > 0) {
            el.empty();
            for (var i = 0; i < meetings.length; i++) {
                var meeting = meetings[i];
                var dat = Date.now(); dat = common.dateFormat(dat);
                var meetingele = meeting.Meeting_Id;
                var desc = (meeting.Meeting_Description == null ? '' : meeting.Meeting_Description);

                var li = $('<li></li>'); li.addClass('clearfix').attr('id', meetingele);
                li.append('');

                var meetingDetail = '';
                /* Meeting Name and desc and date time details */
                if (meeting.Is_My_Meeting == true) {
                    meetingDetail = '<div class="meeting-name meet-admin">';
                    meetingName = '<h2><span></span>' + meeting.Meeting_Name + '</h2>';
                } else {
                    meetingDetail = '<div class="meeting-name">';
                    meetingName = '<h2>' + meeting.Meeting_Name + '</h2>';
                }

                meetingDesc = '<p>' + desc + '</p>';
                meetingDate = '<div class="meeting-date">';
                meetingDate += '<span class="fa fa-calendar date-label"></span><span> From : </span>';
                meetingDate += '<span>' + meeting.Formatted_Start_DateTime + '</span>';
                meetingDate += '<span class="fa fa-calendar date-label"></span><span> To : </span><span>';
                meetingDate += meeting.Formatted_End_DateTime + '</span></div>';
                meetingDetail += meetingName + meetingDesc + meetingDate + '</div>';
                li.append(meetingDetail);

                if (meeting.Is_My_Meeting == true) {
                    var html = '', anlyHtml = '', partHtml = '';
                    if (meeting.Meeting_Status == 2)
                        anlyHtml = '<a href="Analytics.html?meetingId=' + meeting.Meeting_Id + '" class="stat-btn"></a>';
                   
                    var time = meeting.Formatted_End_DateTime;
                    var dateary = time.split(' ');
                    var date = dateary[0], time = dateary[1], meridian = dateary[2];
                    var nDate = new Date();
                    
                    nDate.setDate(date.split('/')[0]);
                    nDate.setMonth(date.split('/')[1] - 1);
                    nDate.setFullYear(date.split('/')[2]);
                    
                    var hour = parseInt(time.split(':')[0],10);
                    nDate.setMinutes(parseInt(time.split(':')[1],10));
                    nDate.setSeconds(parseInt(time.split(':')[2],10));
                    
                    if(meridian == 'PM') {
                        hour = hour + 12;
                        nDate.setHours(hour);
                    } else {
                        nDate.setHours(hour);
                    }
                    
                    var edatetime = nDate.getTime();
                    var currentdatetime = new Date();
                    var cdatetime = currentdatetime.getTime();
                    var cmpr = edatetime - cdatetime;
                    
                    if (meeting.Meeting_Status == 0 && cmpr > 0)
                        partHtml = '<span class="add-link fa fa-user"></span>';

                    html += '<div class="owner-act">' + anlyHtml + partHtml + '</div>';
                    li.append(html);

                    if (meeting.Meeting_Status == 0 && meeting.Current_Status == true) {
                        li.append('<div class="meeting-status"><div style="display:block" class="join-div">' +
                            '<a href="#" class="join-btn moder-join">Start Meeting</a></div></div>');
                    } else {
                        if (meeting.Meeting_Status == 1 && meeting.Current_Status == true) {
                            li.append('<div class="meeting-status"><div style="display:block" class="join-div">' +
                            '<a href="#" class="join-btn rejoin moder-join">Rejoin Meeting</a></div></div>');
                        }
                    }
                } else {
                	if (meeting.Meeting_Status != 2) {
                        if (meeting.Participant_MeetingAcceptStatus == 2) {
                            li.append('<div class="rejected-status" style="display:block">You have rejected the meeting at <span>' + meeting.Formatted_MeetingAcceptStatus_DateTime + '</span></div>');
                        } else {
                            if (meeting.Participant_MeetingAcceptStatus == 0) {
                                if (meeting.Meeting_Status == 1) {
                                    li.append('<div class="meeting-status"><div class="join-div" style="display:block"><a class="join-btn partc-join" href="#">Join Meeting</a></div></div>');
                                } else if (meeting.Meeting_Status == 0) {
                                    li.append('<div class="meeting-status"><div class="join-decline" style="display:block"><a class="decline-btn" href="#">Decline</a><a class="join-btn partc-join" href="#">Accept</a></div>'
                                     );
                                }
                            } else {
                                if (meeting.Meeting_Status == 1) {
                                    li.append('<div class="meeting-status"><div class="join-div" style="display:block"><a class="joined-meeting" href="#">Join Meeting</a></div></div>');
                                } else if (meeting.Meeting_Status == 0) {
                                    li.append('<div class="meeting-status"><div class="join-decline" style="display:block"><a class="decline-btn" href="#" style="display:block">Decline</a></div>');
                                }
                                li.append('<div class="accepted-status" style="display:block">You have accepted the meeting at <span>' + meeting.Formatted_MeetingAcceptStatus_DateTime + '</span></div>');
                            }
                        }
                    } else {
                        if (meeting.Participant_MeetingAcceptStatus == 2) {
                            li.append('<div class="rejected-status" style="display:block">You have rejected the meeting at <span>' + meeting.Formatted_MeetingAcceptStatus_DateTime + '</span></div>');
                        } else if (meeting.Participant_MeetingAcceptStatus == 1) {
                            li.append('<div class="accepted-status" style="display:block">You have accepted the meeting at <span>' + meeting.Formatted_MeetingAcceptStatus_DateTime + '</span></div>');
                        }
                    }
                }

                li.data('meetingobj', meeting);
                el.append(li);
            }
            usermeetings.bindMeetingAction(el);
            usermeetings.acceptedmeetingstatus(el);
        } else {
            el.append('<li class="success-msg">Currently No meetings found for you. Please refresh to see meetings.</li>');
        }
        usermeetings.participantAddAction(el);
        common.hideLoader();
    },

    /*bindpastMeetings: function (meetings) {
        var el = $('#past-list');
        if (meetings && meetings.length > 0) {
            el.empty();
            for (var i = 0; i < meetings.length; i++) {
                var meeting = meetings[i];
                var desc = (meeting.Meeting_Description == null ? '' : meeting.Meeting_Description);
                var li = $('<li></li>'); li.addClass('clearfix');
                li.append('')
                li.append('<div class="meeting-name"><h2><span class="fa fa-circle"></span>' + meeting.Meeting_Name + '</h2>' +
                          '<p>' + desc + '</p></div>');
                li.append('<div class="meeting-date"><div><span class="fa fa-calendar date-label"></span><span> From : </span>' +
                          '<span>' + meeting.Formatted_Start_DateTime + '</span></div><div><span class="fa fa-calendar date-label"></span><span> To : </span><span>' +
                          meeting.Formatted_End_DateTime + '</span></div></div>');
                if (meeting.Participant_MeetingAcceptStatus == 1) {
                    li.append('<div class="accepted-status" style="display:block">You have accepted the meeting at <span>' + meeting.Formatted_MeetingAcceptStatus_DateTime + '</span></div>');
                } else if (meeting.Participant_MeetingAcceptStatus == 2) {
                    li.append('<div class="rejected-status" style="display:block">You have rejected the meeting at <span>' + meeting.Formatted_MeetingAcceptStatus_DateTime + '</span></div>');
                }
                li.data('meetingobj', meeting);
                el.append(li);
            }
        } else {
            el.append('<li class="success-msg">Currently No meetings found for you. Please refresh to see meetings.</li>');
        }
    },*/
    
    bindpastMeetings: function (meetings) {
        var el = $('#past-list');
        if (meetings && meetings.length > 0) {
            el.empty();
            for (var i = 0; i < meetings.length; i++) {
                var meeting = meetings[i];
                var desc = (meeting.Meeting_Description == null ? '' : meeting.Meeting_Description);
                var li = $('<li></li>'); li.addClass('clearfix');
                var html = '<div class="meeting-name"><h2>' + meeting.Meeting_Name + '</h2>' +
                    '<p>' + desc + '</p>';
                html += '<div class="meeting-date"><div><span class="fa fa-calendar date-label"></span><span> From : </span>' +
                    '<span>' + meeting.Formatted_Start_DateTime + '</span></div><div><span class="fa fa-calendar date-label"></span><span> To : </span><span>' +
                    meeting.Formatted_End_DateTime + '</span></div></div>';
                html += '</div>';
                li.append(html);
                if (meeting.Participant_MeetingAcceptStatus == 1) {
                    li.append('<div class="accepted-status" style="display:block">You have accepted the meeting at <span>' + meeting.Formatted_MeetingAcceptStatus_DateTime + '</span></div>');
                } else if (meeting.Participant_MeetingAcceptStatus == 2) {
                    li.append('<div class="rejected-status" style="display:block">You have rejected the meeting at <span>' + meeting.Formatted_MeetingAcceptStatus_DateTime + '</span></div>');
                }
                li.data('meetingobj', meeting);
                el.append(li);
            }
        } else {
            el.append('<li class="success-msg">Currently No meetings found for you. Please refresh to see meetings.</li>');
        }
    },

    /*bindMeetingAction: function (el) {
        el.delegate('li .join-btn', 'click', function () {
        	common.showLoader();
        	$(this).hide();
        	var meeting = $(this).parents('li').eq(0).data('meetingobj');
            usermeetings.acceptMeeting(meeting);
            return false;
        });
        el.delegate('li .decline-btn', 'click', function () {
        	common.showLoader();
            var meeting = $(this).parents('li').eq(0).data('meetingobj');
            usermeetings.declineMeeting(meeting);
            return false;
        });
        el.delegate('.join-btn', 'click', function () {
            var meeting = $(this).parents('li').eq(0).data('meetingobj');
            if ($(this).hasClass('rejoin'))
                window.location.href = 'MeetingPlayer.html?userId=' + common.defaults.userId + '&meetingId=' +
                    meeting.Meeting_Id;
            else
                window.location.href = 'UploadFiles.html?meetingId=' + meeting.Meeting_Id;
            return false;
        });
    },*/
    bindMeetingAction: function (el) {
        el.delegate('li .partc-join', 'click', function () {
            var meeting = $(this).parents('li').eq(0).data('meetingobj');
            usermeetings.acceptMeeting(meeting);
        });
        el.delegate('li .decline-btn', 'click', function () {
            var declineAction = window.confirm('Do you want to decline the meeting?');
            if (declineAction == false) {
                return false;
            }
            var meeting = $(this).parents('li').eq(0).data('meetingobj');
            usermeetings.declineMeeting(meeting);
        });
        el.delegate('li .moder-join', 'click', function () {
            var meeting = $(this).parents('li').eq(0).data('meetingobj');
            if ($(this).hasClass('rejoin'))
                window.location.href = 'MeetingPlayer.html?userId=' + common.defaults.userId + '&meetingId=' +
                    meeting.Meeting_Id;
            else
                window.location.href = 'UploadFiles.html?meetingId=' + meeting.Meeting_Id;
            return false;
        });
    },
    participantAddAction: function(){
        $('.add-link').not('.disabled').unbind('click').bind('click', function () {
            var meeting = $(this).parents('li').eq(0).data('meetingobj');
            var pEl = $(this).parents('li').eq(0);
            if ($('.show-part-block:visible', pEl).length > 0) {
                $('.show-part-block').remove();
                return false;
            }
            usermeetings.showParticipantBlock($(this).parents('li').eq(0), meeting);
        });
    },
    acceptedmeetingstatus: function(el){
        el.delegate('li .joined-meeting', 'click', function(){
            var meeting = $(this).parents('li').eq(0).data('meetingobj');
            usermeetings.updatedmeeting(meeting);
            return false;
        });
    },
    showParticipantBlock: function (el, meeting) {
        common.showLoader();
        var partHgt = 0;
        $('.show-part-block').remove();
        var html = '<div class="show-part-block">';
        html += '<div class="form-row"><label>Add New Participants</label><div class="form-control">' +
      '<input type="text" class="search" name="user-search"/></div>';
        html += '<span class="add-part">Add participant</span><span class="cancel-part">cancel</span>';
        html += '</div>';

        /* get meeting participants and show */
        Services.getMeetingDeatils(meeting.Meeting_Id, function (data) {
            if (data && data !== undefined) {
                html += '<div class="partc-block"><h3><span>Available Participants</span></h3>';
                var part = data.lstMeetingParticipant;
                if (part && part.length > 0) {
                    html += '<ul>';
                    for (var i = 0; i < part.length; i++) {
                        html += '<li>' + part[i].Participant_FName + '</li>';
                    }
                    html += '</ul>';
                }
                html += '</div>';
            }

            html += '</div>';
            el.append(html);
            common.hideLoader();
            partHgt = $('.partc-block').outerHeight();
            partHgt = partHgt + 115;
            window.setTimeout(function () {
                $('.show-part-block').css({ 'height': partHgt + 'px', 'padding': '10px' });
            }, 50);
            usermeetings.getAllUsers();
            $('.add-link').removeClass('disabled');
            $('.add-part').unbind('click').bind('click', function () {
                common.showLoader();
                usermeetings.saveParticipants(meeting);
                return false;
            });
            $('.cancel-part').unbind('click').bind('click', function () {
                $('.show-part-block').remove();
                $('.add-link').removeClass('disabled');
                return false;
            });
        }, function () {
            common.hideLoader();
        });
    },
    saveParticipants: function (meeting) {
        var partSelectArray = $('input.search').select2('data');
        if (partSelectArray && partSelectArray.length > 0) {
            participantArray = new Array();
            for (var i = 0; i < partSelectArray.length; i++) {
                var obj = {};
                obj.UserName = partSelectArray[i].User_Name;
                obj.UserId = partSelectArray[i].User_Id;
                obj.Meeting_Id = meeting.Meeting_Id;
                participantArray.push(obj);
            }
            Services.insertMeetingParticipants(participantArray, function (data) {
                alert('participants successfully updated');
                $('.show-part-block').remove();
                common.hideLoader();
            }, function () {
                common.hideLoader();
            });
        } else {
            alert("Please select atleast one participant for a meeting");
            common.hideLoader();
        }
    },
    getAllUsers: function () {
        var html = '';
        $('input.search').select2({
            minimumInputLength: 1,
            multiple: true,
            ajax: {
                url: function (term, page) {
                    return "/User/getAllUser/" + Services.subdomainName + "/" + Services.companyId + "/" + common.defaults.userId + '/' + term
                },
                dataType: 'json',
                type: 'GET',
                multiple: true,
                results: function (data, page) {
                    return {
                        results: data
                    };
                },
                cache: true
            },
            formatResult: function (item) { return item.User_Name; },
            formatSelection: function (item) { return item.User_Name; },
            escapeMarkup: function (m) { return m; }
        });
    }
};