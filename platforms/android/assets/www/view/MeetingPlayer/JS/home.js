var dateFormat = function (date) {
    var dateStr = '', curDate = new Date();
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 
        'December'];
    var weeks = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    if (date.getDate() == curDate.getDate() && date.getMonth() == curDate.getMonth() && date.getFullYear() == curDate.getFullYear())
        dateStr += 'Today ';
    dateStr +=  date.getDate() + ' ' + months[date.getMonth()] + ', ' + date.getFullYear() + ' - ' + weeks[date.getDay()];
    return dateStr;
};
//new change
var utcDateFormat = function (date) {
    var dateStr = '', curDate = new Date();
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November',
        'December'];
    var weeks = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    if (date.getUTCDate() == curDate.getUTCDate() && date.getUTCMonth() == curDate.getUTCMonth() &&
        date.getFullYear() == curDate.getFullYear())
        dateStr += 'Today ';
    dateStr += date.getUTCDate() + ' ' + months[date.getUTCMonth()] + ', ' + date.getFullYear() + ' - ' + weeks[date.getUTCDay()];
    return dateStr;
};
//new change
var listSwipe = {
    init: function () {
        var mEl = $('.meeting-overview').not('.meeting-desktop'),
            lEl = $('.meeting-list .meeting-section ul li', mEl).not('.no-swipe'),
            el = $('.meeting-cont', lEl);
        var wWid = $(window).width(), bLeft = parseInt(wWid - ((wWid * 30) / 100)),
            dLeft = parseInt(wWid - ((wWid * 60) / 100));
        var prevLeftPos = new Array();
        if (navigator.userAgent.indexOf('IEMobile') > -1) {
            el.swipeleft(function (a) {
                el.css('left', 0);
                var elm = $(event.target);
                if (!elm.hasClass('meeting-cont')) {
                    elm = elm.parents('.meeting-cont').eq(0);
                }
                elm.addClass('animate');
                elm.css('left', -(bLeft));

                window.setTimeout(function () {
                    elm.addClass('animate');
                    elm.css('left', 0);
                }, 10000);
            });
            el.swiperight(function (a) {
                var elm = $(event.target);
                if (!elm.hasClass('meeting-cont')) {
                    elm = elm.parents('.meeting-cont').eq(0);
                }
                elm.addClass('animate');
                elm.css('left', -(bLeft));
                elm.css('left', 0);

                window.setTimeout(function () {
                    elm.addClass('animate');
                    elm.css('left', 0);
                }, 10000);
            });
        } else {
            el.swipe({
                allowPageScroll: 'vertical',
                tap: function (event, target) {

                },
                swipeStatus: function (event, phase, direction, distance, duration) {
                    var elm = $(event.target);
                    if (!elm.hasClass('meeting-cont')) {
                        elm = elm.parents('.meeting-cont').eq(0);
                    }

                    if (phase == 'start') {
                        el.not(elm).css('left', '0px');
                    }

                    if (phase == "move" && direction == 'left') {
                        elm.removeClass('animate');
                        var clientX = 0, clientY = 0;
                        if (event.touches !== undefined) {
                            clientX = event.touches[0].clientX;
                            clientY = event.touches[0].clientY;
                        } else {
                            clientX = event.clientX; clientX = event.clientY;
                        }

                        var left = distance;
                        var lastVal = prevLeftPos[prevLeftPos.length - 1];
                        if (lastVal === undefined || lastVal < left) {
                            if (left < bLeft) {
                                prevLeftPos.push(left);
                                elm.css('left', -(left));
                            }
                        }
                    }

                    if (phase == 'move' && direction == 'right') {
                        if (elm.position().left < 0) {
                            elm.removeClass('animate');
                            var left = elm.position().left + distance
                            if (left < 0)
                                elm.css('left', left);
                            else if (left > -50)
                                elm.css('left', 0);
                        }
                    }

                    if (phase == "end") {
                        if (direction == 'left') {
                            elm.addClass('animate');
                            var lastVal = prevLeftPos[prevLeftPos.length - 1];
                            if (lastVal < parseInt((wWid / 3) + 40, 10)) {
                                elm.css('left', 0);
                            } else {
                                elm.css('left', -(bLeft));
                            }
                            prevLeftPos = new Array();
                        } else if (direction == 'right') {
                            elm.addClass('animate');
                            //if (distance > (wWid * (25 / 100))) {
                            elm.css('left', 0);
                            //}
                        }
                        window.setTimeout(function () {
                            elm.addClass('animate');
                            elm.css('left', 0);
                        }, 10000);
                    }
                },
                //triggerOnTouchLeave:true,
                threshold: 10
            });
        }
    }
};

var meetingHome = {
    today: true,
    selectedDate: '',
    events: [
		{
		    id: 'availableForMeeting',
		    start: '2015-12-28T10:00:00',
		    end: '2016-01-02T16:00:00'
		},
		{
		    id: 'availableForMeeting',
		    start: '2015-03-28T10:00:00',
		    end: '2015-04-02T16:00:00'
		}
    ],
    init: function () {
        meetingHome.renderCalendar();
        meetingHome.scrollSpy();
        meetingHome.swipeActions();
        meetingHome.fitMeetingHome();
        $(window).resize(function () {
            meetingHome.fitMeetingHome();
        });
        common.showLoader();
        
        Services.getNotificationHubCountView(userId, function(data){
        var totalcount = 0;
        	for(i=0; i< data.length; i++){
        	var numbercount = data[i].Count;
        	totalcount = totalcount + numbercount; 
        	}
        	if(totalcount && totalcount > 0){
        		if(totalcount > 10){
					$('.notificationhub-count').show().html('10+');
        		} else {
        			$('.notificationhub-count').show().html(totalcount);
        		}
        	} else{
        		$('.notificationhub-count').hide();
        	}
        });
    },
    renderCalendar: function () {
        $('.meeting-calendar').fullCalendar({
            events: function (start, end, timezone, callback) {
                common.showLoader();
                var month = $('.fc-day-number').not('.fc-other-month').eq(0).data('date');
                month = parseInt(month.split('-')[1],10);
                Services.getAvailableMeetingforMonth(userId, month, start._d.getFullYear(), function (data) {
                    for (var i = 0 ; i < data.length; i++) {
                        data[i].allDay = true;
                    }
                    if (callback) callback(data);
                }, null);
            },
            eventRender: function (event, element) {
                if (event !== undefined) {
                    var startDateObj = null, endDateObj = null;
                    if (event.start !== null) { startDateObj = event.start._d; endDateObj = startDateObj; }
                    if (event.end !== null) endDateObj = event.end._d;
                    
                    var dates = new Array();
                    dates = meetingHome.getDates(startDateObj, endDateObj);
                    
                    for (var i = 0; i < dates.length; i++) {
                        var dateStr = '';
                        dateStr = meetingHome.getEventDate(dates[i]);
                        $('td[data-date="' + dateStr + '"]').addClass('hasEvent');
                    }
                }
            },
            dayClick: function (date, jsEvent, view) {
                common.showLoader();
                var dte = new Date(date);
                $('.fc-day-number').removeClass('select');
                $(jsEvent.target).addClass('select');
                $('.meeting-section h3,.event-left h3').text(utcDateFormat(dte));//new change
                //$('.meeting-section h3,.event-left h3').text(dateFormat(dte));

                meetingHome.selectedDate = meetingHome.getEventDate(dte);
                meetingHome.getEventsByDate(userId, meetingHome.selectedDate);
            },
            eventAfterAllRender: function (view) {
                var monthEvents = view.dayGrid.segs;
                common.hideLoader();
                if (meetingHome.today) {
                	$('.meeting-section h3,.event-left h3').text(utcDateFormat(view.calendar.getDate()._d));//new change
                	//$('.meeting-section h3,.event-left h3').text(dateFormat(view.calendar.getDate()._d));
                    var date = meetingHome.getEventDate(new Date());
                    meetingHome.selectedDate = date;
                    common.showLoader();
                    meetingHome.getEventsByDate(userId, date);
                    meetingHome.today = false;
                }
            }
        });
    },
    getEventsByDate: function (userId, date) {
        //alert(date);
        Services.GetAvailableMeetingsForDay(userId, date, function (monthEvents) {
            if($('.meeting-desktop').length > 0)
                meetingHome.bindMeetingsDesktop(monthEvents);
            else
                meetingHome.bindMeetings(monthEvents);
            common.hideLoader();
        }, function () { common.hideLoader(); });
    },
    
    bindMeetings: function (monthEvents) {
        $('.list-cont').empty();
        if (monthEvents && monthEvents.length > 0) {
            for (var i = 0; i < monthEvents.length; i++) {
                var event = monthEvents[i], swipeHtml = '', meetingDetailHtml = '';
                var $el = $('<li class="clear-row list-meets"></li>');
                if (event.IS_My_Meeting) {
                    $el.addClass('is-admin');
                    if (event.Meeting_Status == 2) {
                        $el.addClass('meeting-close');
                        swipeHtml += '<ul class="swipe-action">';
                        swipeHtml += '<li><a href="Analytics.html?meetingId=' + event.Meeting_Id + '" title="View"><span class="fa fa-bar-chart"></span></a></li>';
                        swipeHtml += '</ul>';
                    } else if (event.Meeting_Status == 0) {
                        if (event.IS_Current_Meeting == true)
                            $el.addClass('meeting-cur');
                        else
                            $el.addClass('meeting-fut');
                        swipeHtml += '<ul class="swipe-action">';
                        if (meetingHome.checkMeetingBeforeEndTime(event.Formatted_End_DateTime1)) {
                            swipeHtml += '<li class="cancel-part"><a href="#" title="View"><span class="fa fa-trash"></span></a></li>';
                        }
                        if(userId != event.Organiser_UserId) {
                        	swipeHtml += '<li><a href="UploadFiles.html?meetingId=' + event.Meeting_Id + '" title="View"><span class="fa fa-play-circle"></span></a></li>';
                        } else {
                        	if(userId == event.Presenter_UserID){
                        		swipeHtml += '<li><a href="UploadFiles.html?meetingId=' + event.Meeting_Id + '" title="View"><span class="fa fa-play-circle"></span></a></li>';
                        	}
                        }
                        swipeHtml += '</ul>';
                    } else if (event.Meeting_Status == 1) {
                        $el.addClass('meeting-cur');
                        swipeHtml += '<ul class="swipe-action">';
                        swipeHtml += '<li><a href="MeetingPlayer.html?userId=' + userId + '&meetingId=' + event.Meeting_Id + '" title="View"><span class="fa fa-play-circle"></span></a></li>';
                        swipeHtml += '</ul>';
                    }
                    meetingDetailHtml += '<span class="meeting-from"><b>From:</b> ' + event.Formatted_Start_DateTime + '</span>';
                    meetingDetailHtml += '<span class="meeting-to"><b>To:</b> ' + event.Formatted_End_DateTime + '</span>';
                } else {
                    if (event.Meeting_Status == 2) {
                        $el.addClass('meeting-close').addClass('no-swipe');
                        if (event.Participant_MeetingAcceptStatus == 1) {
                            meetingDetailHtml = '<span class="accept-status">Meeting accepted by you</span>';
                            $el.addClass('meeting-accept');
                        } else if (event.Participant_MeetingAcceptStatus == 2) {
                            meetingDetailHtml = '<span class="reject-status">Meeting declined by you</span>';
                            $el.addClass('meeting-reject');
                        }
                    } else if (event.Meeting_Status == 1) {
                        $el.addClass('meeting-cur');
                        if (event.Participant_MeetingAcceptStatus == 0) {
                            swipeHtml += '<ul class="swipe-action">';
                            swipeHtml += '<li><a href="#" title="Accept"><span class="fa fa-check accept-meet"></span></a></li>';
                            swipeHtml += '</ul>';
                        } else if (event.Participant_MeetingAcceptStatus == 1) {
                            swipeHtml += '<ul class="swipe-action">';
                            swipeHtml += '<li><a href="MeetingPlayer.html?userId=' + userId + '&meetingId=' + event.Meeting_Id + '" title="View"><span class="fa fa-play-circle"></span>Join Meeting</a></li>';
                            swipeHtml += '</ul>';

                            meetingDetailHtml = '<span class="accept-status">Meeting accepted by you</span>';
                            $el.addClass('meeting-accept');
                        } else if (event.Participant_MeetingAcceptStatus == 2) {
                            meetingDetailHtml = '<span class="reject-status">Meeting declined by you</span>';
                            $el.addClass('meeting-reject');
                        }
                    } else if (event.Meeting_Status == 0) {
                        if (event.IS_Current_Meeting == true)
                            $el.addClass('meeting-cur');
                        else 
                            $el.addClass('meeting-fut');
                        if (event.Participant_MeetingAcceptStatus == 0) {
                            swipeHtml += '<ul class="swipe-action">';
                            swipeHtml += '<li><a href="#" title="Accept"><span class="fa fa-check accept-meet"></span></a></li>';
                            swipeHtml += '<li><a href="#" title="Decline"><span class="fa fa-times decline-meet"></span></a></li>';
                            swipeHtml += '</ul>';
                        } else if (event.Participant_MeetingAcceptStatus == 1) {
                            $el.addClass('meeting-accept');
                            swipeHtml += '<ul class="swipe-action">';
                            swipeHtml += '<li><a href="#" title="Decline"><span class="fa fa-times decline-meet"></span></a></li>';
                            swipeHtml += '</ul>';

                            meetingDetailHtml = '<span class="accept-status">Meeting accepted by you</span>';
                        } else if (event.Participant_MeetingAcceptStatus == 2) {
                            $el.addClass('no-swipe').addClass('meeting-reject');
                            meetingDetailHtml = '<span class="reject-status">Meeting declined by you</span>';
                        }
                    }

                    meetingDetailHtml += '<span class="meeting-from"><b>From:</b> ' + event.Formatted_Start_DateTime + '</span>';
                    meetingDetailHtml += '<span class="meeting-to"><b>To:</b> ' + event.Formatted_End_DateTime + '</span>';
                }

                var html = '<div class="meeting-cont">';
                html += '<span class="meeting-time">';
                html += '<b>' + meetingHome.getTimeWithFormat(event.Formatted_Start_DateTime1) + '</b></span>';
                html += '</span>';
                html += '<span class="meeting-desc">';
                html += '<span class="meeting-title">' + event.Meeting_Name + '</span>';
                html += '<span class="meeting-participants">';
                html = html + meetingDetailHtml;
                html += '</span>';
                html += '</span>';
                html += '</div>';
                html += '<div class="swipe-first">';
                html = html + swipeHtml;
                html += '</div>';

                $el.data('eventObj', event).attr('id', 'Meeting_' + event.Meeting_Id);
                $el.html(html);
                $('.list-cont').append($el);
            }
            $('.list-cont').append('<li class="last-meet">No more meetings</li>');
        } else {
            $('.list-cont').html('<li class="no-record">No Meetings found for this day.</li>');
        }
        listSwipe.init();
        meetingHome.bindActions();
        meetingHome.bindListActions(false);
    },
    
    bindMeetingsDesktop: function (monthEvents) {
        $('.list-cont').empty();
        if (monthEvents && monthEvents.length > 0) {
            for (var i = 0; i < monthEvents.length; i++) {
                var event = monthEvents[i], swipeHtml = '', meetingDetailHtml = '';
                var $el = $('<li class="clear-row list-meets"></li>');
                if (event.IS_My_Meeting) {
                    $el.addClass('is-admin');
                    if (event.Meeting_Status == 2) {
                        $el.addClass('meeting-close');
                        swipeHtml += '<ul class="swipe-action">';
                        swipeHtml += '<li><a href="Analytics.html?meetingId=' + event.Meeting_Id + '" title="View"><span class="fa fa-bar-chart"></span>Analytics</a></li>';
                        swipeHtml += '</ul>';
                    } else if (event.Meeting_Status == 0) {
                        if (event.IS_Current_Meeting == true)
                            $el.addClass('meeting-cur');
                        else
                            $el.addClass('meeting-fut');
                        swipeHtml += '<ul class="swipe-action">';
                        if(userId != event.Organiser_UserId) {
                        	swipeHtml += '<li><a href="UploadFiles.html?meetingId=' + event.Meeting_Id + '" title="View"><span class="fa fa-play-circle"></span>Start Meeting</a></li>';
                        } else {
                        	if (userId == event.Presenter_UserID) {
                        		swipeHtml += '<li><a href="UploadFiles.html?meetingId=' + event.Meeting_Id + '" title="View"><span class="fa fa-play-circle"></span>Start Meeting</a></li>';
                        	}
                        }
                      //new change
                        if (meetingHome.checkMeetingBeforeEndTime(event.Formatted_End_DateTime1)) {
                            swipeHtml += '<li class="cancel-part"><a href="#" title="View"><span class="fa fa-trash"></span>Cancel Meeting</a></li>';
                        }
                        //new change
                        swipeHtml += '<li class="add-part"><a href="#" title="View"><span class="fa fa-user"></span>Add Participant</a></li>';
                        swipeHtml += '</ul>';
                    } else if (event.Meeting_Status == 1) {
                        $el.addClass('meeting-cur');
                        swipeHtml += '<ul class="swipe-action">';
	                    if(userId != event.Organiser_UserId){
	                    	swipeHtml += '<li><a href="MeetingPlayer.html?userId=' + userId + '&meetingId=' + event.Meeting_Id + '" title="View"><span class="fa fa-play-circle"></span>Start Meeting</a></li>';
	                    } else {
	                    	if (userId == event.Presenter_UserID) {
	                    		swipeHtml += '<li><a href="MeetingPlayer.html?userId=' + userId + '&meetingId=' + event.Meeting_Id + '" title="View"><span class="fa fa-play-circle"></span>Start Meeting</a></li>';
                        }
                    }
                        swipeHtml += '</ul>';
                    }
                    meetingDetailHtml += '<span class="meeting-from"><b>From:</b> ' + event.Formatted_Start_DateTime + '</span>';
                    meetingDetailHtml += '<span class="meeting-to"><b>To:</b> ' + event.Formatted_End_DateTime + '</span>';
                } else {
                    if (event.Meeting_Status == 2) {
                        $el.addClass('meeting-close').addClass('no-swipe');
                        if (event.Participant_MeetingAcceptStatus == 1) {
                            meetingDetailHtml = '<span class="accept-status">Meeting accepted by you</span>';
                            $el.addClass('meeting-accept');
                        } else if (event.Participant_MeetingAcceptStatus == 2) {
                            meetingDetailHtml = '<span class="reject-status">Meeting declined by you</span>';
                            $el.addClass('meeting-reject');
                        }
                    } else if (event.Meeting_Status == 1) {
                        $el.addClass('meeting-cur');
                        if (event.Participant_MeetingAcceptStatus == 0) {
                            swipeHtml += '<ul class="swipe-action">';
                            swipeHtml += '<li class="accept-meet"><a href="#" title="Accept"><span class="fa fa-play-circle"></span>Join Meeting</a></li>'; //new change
                            //swipeHtml += '<li class="accept-meet"><a href="#" title="Accept"><span class="fa fa-check"></span>Accept</a></li>';
                            swipeHtml += '</ul>';
                        } else if (event.Participant_MeetingAcceptStatus == 1) {
                            swipeHtml += '<ul class="swipe-action">';
                            //swipeHtml += '<li class="accept-meet"><a href="#" title="Accept"><span class="fa fa-check"></span>Accept</a></li>';
                            swipeHtml += '<li><a href="MeetingPlayer.html?userId=' + userId + '&meetingId=' + event.Meeting_Id + '" title="View"><span class="fa fa-play-circle"></span>Join Meeting</a></li>';
                            swipeHtml += '</ul>';

                            meetingDetailHtml = '<span class="accept-status">Meeting accepted by you</span>';
                            $el.addClass('meeting-accept');
                        } else if (event.Participant_MeetingAcceptStatus == 2) {
                            meetingDetailHtml = '<span class="reject-status">Meeting declined by you</span>';
                            $el.addClass('meeting-reject');
                        }
                    } else {
                        if (event.IS_Current_Meeting == true)
                            $el.addClass('meeting-cur');
                        else
                            $el.addClass('meeting-fut');
                        if (event.Participant_MeetingAcceptStatus == 0) {
                            
                            swipeHtml += '<ul class="swipe-action">';
                            swipeHtml += '<li class="accept-meet"><a href="#" title="Accept"><span class="fa fa-check"></span>Accept</a></li>';
                            swipeHtml += '<li class="list-decline decline-meet"><a href="#" title="Decline"><span class="fa fa-times"></span>Decline</a></li>';
                            swipeHtml += '</ul>';
                        } else if (event.Participant_MeetingAcceptStatus == 1) {
                            
                            $el.addClass('no-swipe').addClass('meeting-accept');
                            swipeHtml += '<ul class="swipe-action">';
                            swipeHtml += '<li class="list-decline decline-meet"><a href="#" title="Decline"><span class="fa fa-times"></span>Decline</a></li>';
                            swipeHtml += '</ul>';
                            meetingDetailHtml = '<span class="accept-status">Meeting accepted by you</span>';
                        } else if (event.Participant_MeetingAcceptStatus == 2) {
                            $el.addClass('no-swipe').addClass('meeting-reject');
                            meetingDetailHtml = '<span class="reject-status">Meeting declined by you</span>';
                        }
                    }

                    meetingDetailHtml += '<span class="meeting-from"><b>From:</b> ' + event.Formatted_Start_DateTime + '</span>';
                    meetingDetailHtml += '<span class="meeting-to"><b>To:</b> ' + event.Formatted_End_DateTime + '</span>';
                }

                var html = '<div class="clear-row meeting-cont">';
                html += '<span class="meeting-time">';
                html += '<b>' + meetingHome.getTimeWithFormat(event.Formatted_Start_DateTime1) + '</b></span>';
                html += '</span>';
                html += '<span class="meeting-desc">';
                html += '<span class="meeting-title">' + event.Meeting_Name + '</span>';
                html += '<span class="meeting-participants">';
                html = html + meetingDetailHtml;
                html += '</span>';
                html += '</span>';
                html += '<span class="meeting-agenda"></span>';
                html += meetingHome.getParticipantsHtml(event);
                if (event.IS_My_Meeting) {
                    html += '<span class="meet-part-blok">';
                    html += '<span class="meet-selct">Add participant <input type="text" class="search" name="user-search"/></span>';
                    html += '<span class="btn-act"><span class="add-part-btn">Save</span><span class="cancel-btn">Cancel</span></span>';
                    html += '</span>';
                }
                html += swipeHtml;
                html += '</div>';

                $el.data('eventObj', event).attr('id', 'Meeting_' + event.Meeting_Id);
                $el.html(html);
                $('.add-part-btn', $el).unbind('click').bind('click', function () {
                    var partObj = $('input.search', $el).select2('data');
                    console.log(partObj);
                    meetingHome.updateParticipantsForMeeting(partObj, event.Meeting_Id);
                    return false;
                });

                $('.cancel-btn', $el).unbind('click').bind('click', function (e) {
                    e.stopPropagation();
                    $('.meet-part-blok', $el).css('display','none');
                    return false;
                });
                $('.list-cont').append($el);
            }
        } else {
            $('.list-cont').html('<li class="no-record">No Meetings found for this day.</li>');
        }
        common.hideLoader();
        meetingHome.bindActions();
        meetingHome.bindListActions(true);
        meetingHome.bindSelect2();
        $('.meeting-desktop ul.list-cont').niceScroll();
    },
    getParticipantsHtml: function (event, isMobile) {
        var participantHtml = '';
        var participants = event.Participants, meetingOwnerModel = event.lstPresenterModel;
        if (meetingOwnerModel && meetingOwnerModel.length > 0)
            meetingOwnerModel = meetingOwnerModel[0];
        participantHtml += '<span class="participant-block">';
        if (meetingOwnerModel.Organiser_UserId == meetingOwnerModel.Presenter_UserId) {
        participantHtml += '<span class="participant clear-row participant-present">';
            //participantHtml += '<span class="profile-img"><img src="' + (meetingOwnerModel.Organiser_Profile_Photo_Url ? meetingOwnerModel.Organiser_Profile_Photo_Url : Services.myProfileURL) + '" alt="' + meetingOwnerModel.Organiser_UserName + '"/></span>';
        	participantHtml += '<span class="profile-img"><img src="' + (meetingOwnerModel.Organiser_Profile_Pic ? meetingOwnerModel.Organiser_Profile_Pic : Services.myProfileURL) + '" alt="' + meetingOwnerModel.Organiser_UserName + '"/></span>';
            participantHtml += '<span class="participant-detl"><span class="participant-name">' + meetingOwnerModel.Organiser_UserName + '</span>' +
                '<span class="participant-status">Organiser/Presenter</span></span>';
            if (event.Meeting_Status == 0 && event.IS_My_Meeting == true) {
                participantHtml += '<span class="add-presnt-block">';
                participantHtml += '<a href="#" title="Add Presenter" class="add-pres">Add Presenter</a>';
        participantHtml += '</span>';
            }
            participantHtml += '</span>';

        } else {
            participantHtml += '<span class="participant clear-row participant-present">';
            participantHtml += '<span class="profile-img"><img src="' + (meetingOwnerModel.Organiser_Profile_Pic ? meetingOwnerModel.Organiser_Profile_Pic : Services.myProfileURL) + '" alt="' + meetingOwnerModel.Organiser_UserName + '"/></span>';
            participantHtml += '<span class="participant-detl"><span class="participant-name">' + meetingOwnerModel.Organiser_UserName + '</span>' +
                '<span class="participant-status">Organizer</span></span>';
            participantHtml += '</span>';
            participantHtml += '<span id="meet_part_' + event.Meeting_Id + '_' + meetingOwnerModel.Presenter_UserId + '" class="participant clear-row">';
            participantHtml += '<span class="profile-img"><img src="' + (meetingOwnerModel.Presenter_Profile_Pic ? meetingOwnerModel.Presenter_Profile_Pic : Services.myProfileURL) + '" alt="' + event.Presenter_UserName + '"/></span>';
            participantHtml += '<span class="participant-detl"><span class="participant-name presenter-name">' + meetingOwnerModel.Presenter_UserName + '</span>' +
                '<span class="participant-status">Presenter</span>';
            //if (event.Meeting_Status == 0 && event.IS_My_Meeting == true)
            //participantHtml += '<span class="rem-icon is_presenter"><span class="fa fa-remove"></span></span>';
            //new change
            if (event.Meeting_Status == 0 && event.IS_My_Meeting == true) {
                if (meetingOwnerModel.Presenter_UserId != userId) {
                participantHtml += '<span class="rem-icon is_presenter"><span class="fa fa-remove"></span></span>';
                }
            }
            //new change
            participantHtml += '</span></span><br/>';
        }
        if (participants && participants.length > 0) {
            var pLeng = participants.length;
            if(!isMobile)
                pLeng = (participants.length > 3 ? 3 : participants.length);
            for (var i = 0 ; i < pLeng; i++) {
                var curPart = participants[i];
                participantHtml += meetingHome.participantHtml(curPart, false, event);
                if ((i+1) > 1 && ((i+1) % 2) == 0)
                    participantHtml += '<br/>';
            }
            
            if (!isMobile && participants.length > 3) {
                participantHtml += '<span class="participant pshow-more">';
                participantHtml += '<span class="profile-img"><span>...</span></span>';
                participantHtml += '<span class="participant-detl"><span class="participant-name">Show More</span></span>';
                participantHtml += '</span>';
            }
        }
        participantHtml += '</span>';
        return participantHtml;
    },
    participantHtml: function (curPart, bNew, meeting) {
        function getStatus(statusNum) {
            var status = 'Request Pending';
            if (statusNum == 1)
                status = 'Accepted';
            else if (statusNum == 2)
                status = 'Declined';
            return status;
        }
        var participantHtml = '', meetingId = meeting.Meeting_Id;
        participantHtml += '<span id="meet_part_'+ meetingId +'_' + curPart.UserId + '" class="participant ' + (bNew ? 'new-part' : '') + ' meet_' + meetingId + '">';
        participantHtml += '<span class="profile-img"><img src="' + (curPart.Profile_Photo_BLOB_URL ? curPart.Profile_Photo_BLOB_URL : Services.myProfileURL) +
            '" alt="' + curPart.UserName + '"/></span>';
        participantHtml += '<span class="participant-detl"><span class="participant-name">' + curPart.UserName + '</span>' +
            '<span class="participant-status">' + getStatus(curPart.Participant_MeetingAcceptStatus) + '</span>'+
            (meeting.Meeting_Status == 0 && meeting.IS_My_Meeting ? '<span class="rem-icon"><span class="fa fa-remove"></span></span>' : '') +
            '</span>';
        participantHtml += '</span>';
        return participantHtml;
    },
    
    bindBlockActions: function() {
        console.log($('input.pres-search'));
        $('.cancel-btn').unbind('click').bind('click', function (e) {
            e.stopPropagation();
            $('.pres-part-blok').css('display', 'none');
            $('.add-presnt-block').show();
            return false;
        });
        $('.pres-part-blok .add-part-btn').unbind('click').bind('click', function () {
            var el = $(this).parents('.list-meets').eq(0),
                meeting = el.data('eventObj'),
                partObj = $('.pres-search').select2('data');
            common.showLoader();
            Services.addPresenter(meeting.Meeting_Id, partObj.User_Id, function (data) {
                var isMobile = $('.meeting-mobile').length > 0 ? true : false;
                if (!isMobile)
                    meetingHome.getEventsByDate(userId, meetingHome.selectedDate);
                else
                    window.location.reload();
                //common.hideLoader();
            }, function () {
                common.hideLoader();
            });
            return false;
        });
    },
    
    bindActions: function(){
        $('ul.swipe-action li').unbind('click').bind('click', function (evt) {
            evt.stopPropagation();
        });
        $('.cancel-btn').unbind('click').bind('click', function (e) {
            e.stopPropagation();
            $('.meet-part-blok').css('display', 'none');
            return false;
        });
        $('.accept-meet').unbind('click').bind('click', function (evt) {
            evt.stopPropagation();
            var el = $(this).parents('.list-meets').eq(0), meeting = el.data('eventObj');
            meetingHome.acceptMeeting(el, meeting);
            return false;
        });
        $('.decline-meet').unbind('click').bind('click', function (evt) {
            evt.stopPropagation();
            var el = $(this).parents('.list-meets').eq(0), meeting = el.data('eventObj');
            console.log(meeting);
            meetingHome.declineMeeting(el, meeting);
            return false;
        });
        $('.add-part').unbind('click').bind('click', function (evt) {
            evt.stopPropagation();
            var el = $(this).parents('.list-meets').eq(0), meeting = el.data('eventObj');
            $('.meet-part-blok', el).css('display','block');
            meetingHome.bindSelectParticipants(el, meeting);
            return false;
        });
        $('.cancel-part').unbind('click').bind('click', function (evt) {
            evt.stopPropagation();
            var res = window.confirm('Do you want to delete the meeting');
            if (res == false)
            return false;
            var self = this, el = $(this).parents('.list-meets').eq(0), meeting = el.data('eventObj');
            common.showLoader();
            Services.cancelMeeting(meeting.Meeting_Id, function (data) {
                  common.hideLoader();
                  if (data == false)
                      alert('The meeting you are trying to do cancel is already cancelled');
                      el.remove();
                  if($(self).hasClass('gohome'))
                      window.location.href = 'MeetingHome.html';
                  else
                      window.location.reload();
                  }, function () {
                  common.hideLoader();
              });
            return false;
        });
        $('.rem-icon').unbind('click').bind('click', function (evt) {
            evt.stopPropagation(); evt.preventDefault();
            common.showLoader();
            var el = $(this).parents('.participant').eq(0), idStr = '';
            idStr = el.attr('id').replace('meet_part_', '');
            var meetingId = idStr.split('_')[0], participantUserId = idStr.split('_')[1];
            if ($(this).hasClass('is_presenter')) {
            meetingHome.removePresenter(el, meetingId, participantUserId);
            } else {
            meetingHome.removeParticipants(el, meetingId, participantUserId);
            }
            return false;
        });
        $('.add-presnt-block').unbind('click').bind('click', function () {
            $(this).hide();
            var el = $(this).parents('.list-meets').eq(0), meeting = el.data('eventObj');
            $('.pres-part-blok', el).remove();
            var partPresBlock = meetingHome.createPresenterBlock();
            partPresBlock.insertAfter($('.participant-present', el));
            $('.pres-part-blok', el).css('display', 'block');
            meetingHome.bindSelect2($('input.pres-search'));
            meetingHome.bindBlockActions();
            return false;
        });
    },
    removeParticipants: function(el, meetingId, participantUserId) {
        var participants = el.parents('.list-meets').eq(0).data('eventObj').Participants;
        var cnfrMsg = window.confirm('Do you want to remove the participant from this meeting?');
        if (cnfrMsg == true) {
            if (participants && participants.length > 1) {
                Services.removeParticipants(meetingId, participantUserId, function (data) {
                    var isMobile = $('.meeting-mobile').length > 0 ? true : false;
                    if (data) {
                        el.remove();
                        if (!isMobile)
                            meetingHome.getEventsByDate(userId, meetingHome.selectedDate);
                        else
                            window.location.reload();
                    } else {
                        common.hideLoader();
                    }
                }, function () { common.hideLoader(); });
            } else {
                common.hideLoader();
                alert('Cannot remove participant. Atleast one participant should present for a meeting!');
            }
        } else {
            common.hideLoader();
        }
    },
    removePresenter: function (el, meetingId, presenterId) {
        var isMobile = $('.meeting-mobile').length > 0 ? true : false;
        var participants = el.parents('.list-meets').eq(0).data('eventObj').Participants;
        var cnfrMsg = window.confirm('Do you want to remove current presenter for this meeting?');
        if (cnfrMsg == true) {
            Services.removePresenter(meetingId, presenterId, function (data) {
                if (data) {
                    el.remove();
                    if (!isMobile)
                        meetingHome.getEventsByDate(userId, meetingHome.selectedDate);
                    else
                        window.location.reload();
                } else {
                    common.hideLoader();
                }
            }, function () { common.hideLoader(); });
        } else {
            common.hideLoader();
        }
    },
    bindListActions: function (bDesktop) {
        $('li.list-meets .meeting-cont').unbind('click').bind('click', function () {
            if (navigator.userAgent.indexOf('IEMobile') > -1) {
                $(this).addClass('animate');
                $(this).css('left', 0);
            }
        });
        $('li.list-meets').unbind('click').bind('click', function () {
            var meeting = $(this).data('eventObj');
            if (bDesktop) {
                var self = this;
                if ($(this).hasClass('on-click'))
                    return false;
                $(this).addClass('on-click');
                var agnBlock = $('.meeting-agenda', $(this));
                var html = '<span class="list-label">Meeting Description</span>';
                html += '<span class="list-value">' + meeting.Meeting_Description + '</span>';
                html += '<span class="list-label">Agenda</span>';
                html += '<span class="list-value">' + decodeURIComponent(meeting.Meeting_Agenda) + '</span>';
                agnBlock.html(html);

                var participantsHtml = '', participants = meeting.Participants;
                for (var i = 3; i < participants.length; i++) {
                    var curPart = participants[i];
                    //participantsHtml += meetingHome.participantHtml(curPart, true, meeting);
                    participantsHtml += meetingHome.participantHtml(curPart, true);
                }
                var pBlock = $('.participant-block', $(this));
                pBlock.append(participantsHtml);

                if ($('.swipe-action', $(this)).length == 0) {
                    $('.meeting-cont', $(this)).append('<ul class="swipe-action"><li class="onBack">Less</li></ul>');
                } else {
                    $('.swipe-action', $(this)).append('<li class="onBack">Less</li>');
                }
                $('.onBack').unbind('click').bind('click', function (evt) {
                    evt.preventDefault();
                    evt.stopPropagation();
                    $('li.list-meets').show();
                    $('.pres-part-blok, .meet-part-blok').hide();
                    $('li.list-meets').removeClass('on-click');
                    $('li .new-part').remove();
                    $('.pshow-more', $(self)).show();
                    $('.add-presnt-block', $(self)).hide();
                    $(this).remove();
                });
                $('.add-presnt-block', $(this)).show();
                $('.pshow-more', $(this)).hide();
                $('li.list-meets').not($(this)).hide();
            } else {
                window.location.href = 'MeetingDetails.html?id=' + meeting.Meeting_Id + '&date='+meetingHome.selectedDate;
            }
            return false;
        });
    },
    
    updateParticipantsForMeeting: function (partSelectArray, meetingId) {
        common.showLoader();
        if (partSelectArray && partSelectArray.length > 0) {
            participantArray = new Array();
            for (var i = 0; i < partSelectArray.length; i++) {
                var obj = {};
                obj.Participant_FName = partSelectArray[i].User_Name;
                obj.Participant_UserID = partSelectArray[i].User_Id;
                obj.Meeting_Id = meetingId;
                participantArray.push(obj);
            }
            Services.insertMeetingParticipants(participantArray, function (data) {
                alert('participants successfully updated');
                if ($('.meeting-mobile').length > 0) {
                    window.location.reload();
                } else {
                    meetingHome.getEventsByDate(userId, meetingHome.selectedDate);
                }
                //common.hideLoader();
            }, function () {
                common.hideLoader();
            });
        } else {
            alert("Please select atleast one participant for a meeting");
            common.hideLoader();
        }
        return false;
    },
    
    bindSelect2: function(el){
        var multiple = true, inpEl = el;
        if (inpEl === undefined || inpEl.length == 0) {
            inpEl = $('input.search');
        } else {
            inpEl = el;
            multiple = false;
        }
        inpEl.select2({
            minimumInputLength: 1,
            multiple: multiple,
            ajax: {
                url: function (term, page) {
                    return CoreREST._defaultServer +"/User/getAllUser/" + Services.subdomainName + "/" + Services.companyId + "/" + userId + '/' + term
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
    },
    
    bindSelectParticipants: function (el, meeting) {

    },
    
    createPresenterBlock: function() {
        var html = $('<span class="pres-part-blok"></span>');
        html.append('<span class="pres-selct">Chose Presenter<input type="text" class="pres-search" name="chose-pres"/></span>');
        html.append('<span class="btn-act"><span class="add-part-btn">Save</span><span class="cancel-btn">Cancel</span></span>');
        return html;
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
    
    acceptMeeting: function (el, meeting) {
        common.showLoader();
        meetingHome.getMeetingStatus(meeting.Meeting_Id, function (data) {
            if (data == 0) {
                Services.changeMeetingStatus(meeting.Meeting_Id, userId, 1, function (data) {
                	if(window.location.href.indexOf('MeetingDetails.html') >= 0){
                    	window.location.reload();
                    } else {
                    	meetingHome.getEventsByDate(userId, meetingHome.selectedDate);
                    }
                }, function () { });
            } else if (data == 1) {
                Services.changeMeetingStatus(meeting.Meeting_Id, userId, 1, function (data) {
                    Services.joinMeetingParticipants(meeting.Meeting_Id, userId, function (data) {
                        window.location.href = 'MeetingPlayer.html?userId=' + userId + '&meetingId=' + meeting.Meeting_Id;
                    }, function (e) { });
                }, function () { });
            }
            else if (data == 2) {
            	if(window.location.href.indexOf('MeetingDetails.html') >= 0){
                	window.location.reload();
                } else {
                	meetingHome.getEventsByDate(userId, meetingHome.selectedDate);
                }
            }
        });
    },
    
    declineMeeting: function (el, meeting) {
        Services.changeMeetingStatus(meeting.Meeting_Id, userId, 2, function (data) {
        	if(window.location.href.indexOf('MeetingDetails.html') >= 0){
            	window.location.reload();
            } else {
            	meetingHome.getEventsByDate(userId, meetingHome.selectedDate);
            }
        }, function () { });
    },
    mobileInit: function (meetingId, date) {
        var el = $('.list-cont');
        
        Services.getNotificationHubCountView(userId, function(data){
        var totalcount = 0;
        	for(i=0; i< data.length; i++){
        	var numbercount = data[i].Count;
        	totalcount = totalcount + numbercount; 
        	}
        	if(totalcount && totalcount > 0){
        		if(totalcount > 10){
					$('.notificationhub-count').show().html('10+');
        		} else {
        			$('.notificationhub-count').show().html(totalcount);
        		}
        	} else{
        		$('.notificationhub-count').hide();
        	}
        });
        
        meetingHome.selectedDate = date;
        common.showLoader();
        //alert(date);
        Services.GetAvailableMeetingsForDay(userId, date, function (monthEvents) {
            meetingHome.bindMobileView(monthEvents, meetingId);
            common.hideLoader();
        }, function () {
            common.hideLoader();
        });
    },
    bindMobileView: function(monthEvents, meetingId) {
        if (monthEvents && monthEvents.length > 0) {
            var event = null;
            console.log(meetingId);
            for (var i = 0; i < monthEvents.length; i++) {
                var curEvt = monthEvents[i];
                if (curEvt.Meeting_Id == meetingId) {
                    event = curEvt;
                    break;
                }
            }
            
            var swipeHtml = '', meetingDetailHtml = '';
            var $el = $('<li class="clear-row list-meets"></li>');
            if (event.IS_My_Meeting) {
                $el.addClass('is-admin');
                if (event.Meeting_Status == 2) {
                    $el.addClass('meeting-close');
                    swipeHtml += '<ul class="swipe-action">';
                    swipeHtml += '<li><a href="Analytics.html?meetingId=' + event.Meeting_Id + '" title="View"><span class="fa fa-bar-chart"></span>Analytics</a></li>';
                    swipeHtml += '<li class="onBack">Back</li>';
                    swipeHtml += '</ul>';
                } else if (event.Meeting_Status == 0) {
                    if (event.IS_Current_Meeting == true)
                        $el.addClass('meeting-cur');
                    else
                        $el.addClass('meeting-fut');
                    swipeHtml += '<ul class="swipe-action">';
                    if (userId != event.Organiser_UserId) {
                    	swipeHtml += '<li><a href="UploadFiles.html?meetingId=' + event.Meeting_Id + '" title="View"><span class="fa fa-play-circle"></span>Start Meeting</a></li>';
                    } else {
                    	if (userId == event.Presenter_UserID) {
                    		swipeHtml += '<li><a href="UploadFiles.html?meetingId=' + event.Meeting_Id + '" title="View"><span class="fa fa-play-circle"></span>Start Meeting</a></li>';
                    	}
                    }
                    if (meetingHome.checkMeetingBeforeEndTime(event.Formatted_End_DateTime1)) {
                        swipeHtml += '<li class="cancel-part gohome"><a href="#" title="View"><span class="fa fa-trash"></span>Cancel Meeting</a></li>';
                    }
                    swipeHtml += '<li class="add-part"><a href="#" title="View"><span class="fa fa-user"></span>Add Participant</a></li>';
                    swipeHtml += '<li class="onBack">Back</li>';
                    swipeHtml += '</ul>';
                } else if (event.Meeting_Status == 1) {
                    $el.addClass('meeting-cur');
                    swipeHtml += '<ul class="swipe-action">';
                    if(userId != event.Organiser_UserId){
                    	swipeHtml += '<li><a href="MeetingPlayer.html?userId=' + userId + '&meetingId=' + event.Meeting_Id + '" title="View"><span class="fa fa-play-circle"></span>Start Meeting</a></li>';
                    } else {
                    	if(userId == event.Presenter_UserID) {
                    	swipeHtml += '<li><a href="MeetingPlayer.html?userId=' + userId + '&meetingId=' + event.Meeting_Id + '" title="View"><span class="fa fa-play-circle"></span>Start Meeting</a></li>';
                    	}
                    } 
                    swipeHtml += '<li class="onBack">Back</li>';
                    swipeHtml += '</ul>';
                }
                meetingDetailHtml += '<span class="meeting-from"><b>From:</b> ' + event.Formatted_Start_DateTime + '</span>';
                meetingDetailHtml += '<span class="meeting-to"><b>To:</b> ' + event.Formatted_End_DateTime + '</span>';
            } else {
                if (event.Meeting_Status == 2) {
                    $el.addClass('meeting-close').addClass('no-swipe');
                    if (event.Participant_MeetingAcceptStatus == 1) {
                        meetingDetailHtml = '<span class="accept-status">Meeting accepted by you</span>';
                        $el.addClass('meeting-accept');
                    } else if (event.Participant_MeetingAcceptStatus == 2) {
                        meetingDetailHtml = '<span class="reject-status">Meeting declined by you</span>';
                        $el.addClass('meeting-reject');
                    }
                    swipeHtml += '<ul class="swipe-action">';
                    swipeHtml += '<li class="onBack">Back</li>';
                    swipeHtml += '</ul>';

                } else if (event.Meeting_Status == 1) {
                    $el.addClass('meeting-cur');
                    if (event.Participant_MeetingAcceptStatus == 0) {
                        swipeHtml += '<ul class="swipe-action">';
                        swipeHtml += '<li class="accept-meet"><a href="#" title="Accept"><span class="fa fa-check"></span>Join Meeting</a></li>';
                        swipeHtml += '<li class="onBack">Back</li>';
                        swipeHtml += '</ul>';
                    } else if (event.Participant_MeetingAcceptStatus == 1) {
                        swipeHtml += '<ul class="swipe-action">';
                        swipeHtml += '<li class="accept-meet"><a href="#" title="Accept"><span class="fa fa-check"></span>Join Meeting</a></li>'; //new change
                        //swipeHtml += '<li class="accept-meet"><a href="#" title="Accept"><span class="fa fa-check"></span>Join Meeting</a></li>';
                        swipeHtml += '<li class="onBack">Back</li>';
                        swipeHtml += '</ul>';

                        meetingDetailHtml = '<span class="accept-status">Meeting accepted by you</span>';
                        $el.addClass('meeting-accept');
                    } else if (event.Participant_MeetingAcceptStatus == 2) {
                        meetingDetailHtml = '<span class="reject-status">Meeting declined by you</span>';
                        swipeHtml += '<ul class="swipe-action">';
                        swipeHtml += '<li class="onBack">Back</li>';
                        swipeHtml += '</ul>';

                        $el.addClass('meeting-reject');
                    }
                } else {
                    if (event.IS_Current_Meeting == true)
                        $el.addClass('meeting-cur');
                    else
                        $el.addClass('meeting-fut');
                    if (event.Participant_MeetingAcceptStatus == 0) {
                        swipeHtml += '<ul class="swipe-action">';
                        swipeHtml += '<li class="accept-meet"><a href="#" title="Accept"><span class="fa fa-check"></span>Accept</a></li>';
                        swipeHtml += '<li class="list-decline decline-meet"><a href="#" title="Decline"><span class="fa fa-times"></span>Decline</a></li>';
                        swipeHtml += '<li class="onBack">Back</li>';
                        swipeHtml += '</ul>';
                    } else if (event.Participant_MeetingAcceptStatus == 1) {
                        $el.addClass('no-swipe').addClass('meeting-accept');
                        swipeHtml += '<ul class="swipe-action">';
                        swipeHtml += '<li class="list-decline decline-meet"><a href="#" title="Decline"><span class="fa fa-times"></span>Decline</a></li>';
                        swipeHtml += '<li class="onBack">Back</li>';
                        swipeHtml += '</ul>';
                        meetingDetailHtml = '<span class="accept-status">Meeting accepted by you</span>';
                    } else if (event.Participant_MeetingAcceptStatus == 2) {
                        $el.addClass('no-swipe').addClass('meeting-reject');
                        swipeHtml += '<ul class="swipe-action">';
                        swipeHtml += '<li class="onBack">Back</li>';
                        swipeHtml += '</ul>';
                        meetingDetailHtml = '<span class="reject-status">Meeting declined by you</span>';
                    }
                }

                meetingDetailHtml += '<span class="meeting-from"><b>From:</b> ' + event.Formatted_Start_DateTime + '</span>';
                meetingDetailHtml += '<span class="meeting-to"><b>To:</b> ' + event.Formatted_End_DateTime + '</span>';
            }

            var html = '<div class="clear-row meeting-cont">';
            html += '<span class="meeting-time">';
            html += '<b>' + meetingHome.getTimeWithFormat(event.Formatted_Start_DateTime1) + '</b></span>';
            html += '</span>';
            html += '<span class="meeting-desc">';
            html += '<span class="meeting-title">' + event.Meeting_Name + '</span>';
            html += '<span class="meeting-participants">';
            html = html + meetingDetailHtml;
            html += '</span>';
            html += '</span>';
            html += '<span class="meeting-agenda">';
            html += '<span class="list-label">Meeting Description</span>';
            html += '<span class="list-value">' + event.Meeting_Description + '</span>';
            html += '<span class="list-label">Agenda</span>';
            html += '<span class="list-value">' + decodeURIComponent(event.Meeting_Agenda) + '</span>';
            html += '</span>';
            html += meetingHome.getParticipantsHtml(event, true);
            if (event.IS_My_Meeting) {
                html += '<span class="meet-part-blok">';
                html += '<span class="meet-selct">Add participant <input type="text" class="search" name="user-search"/></span>';
                html += '<span class="btn-act"><span class="add-part-btn">Save</span><span class="cancel-btn">Cancel</span></span>';
                html += '</span>';
            }
            //if (swipeHtml == '')
            //    swipeHtml = '<ul class="swipe-action"><li class="onBack">Back</li></ul>';
            html += swipeHtml;
            html += '</div>';

            $el.data('eventObj', event).attr('id', 'Meeting_' + event.Meeting_Id);
            $el.html(html);

            console.log($('.onBack', $el));
            $('.list-cont').append($el);
        }
        $('.add-part-btn').unbind('click').bind('click', function () {
            var el = $(this).parents('.list-meets').eq(0);
            var partObj = $('input.search', el).select2('data');
            meetingHome.updateParticipantsForMeeting(partObj, el.data('eventObj').Meeting_Id);
            return false;
        });
        meetingHome.bindActions();
        meetingHome.bindSelect2();
        $('.onBack').unbind('click').bind('click', function (evt) {
            evt.stopPropagation();
            window.location.href = 'MeetingHome.html';
            return false;
        });
    },
    
    scrollSpy: function() {
        var el = $('.meeting-section h3');
        if (el.length > 0) {
            el.scrollspy({
                min: el.offset().top - 55,
                max: $('body').height(),
                onEnter: function (element, position) {
                    $('.meeting-section').addClass('fixed');
                },
                onLeave: function (element, position) {
                    $('.meeting-section').removeClass('fixed');
                }
            });
        }
    },
    
    swipeActions: function() {
        $('.swipe-action li a').bind('click', function (e) { e.preventDefault(); });
        $('.swipe-action li').bind('click', function (e) {
                //alert('1');
           });
    },
    
    getEventDate: function (dateobj) {
        if (dateobj == null) return false;
        var month = (dateobj.getUTCMonth() + 1) < 10 ? '0' + (dateobj.getUTCMonth() + 1) : (dateobj.getUTCMonth() + 1); //new change
        var day = dateobj.getUTCDate() < 10 ? '0' + dateobj.getUTCDate() : dateobj.getUTCDate(); //new change
        //var month = (dateobj.getMonth() + 1) < 10 ? '0' + (dateobj.getMonth() + 1) : (dateobj.getMonth() + 1);
        //var day = dateobj.getDate() < 10 ? '0' + dateobj.getDate() : dateobj.getDate();
        date = dateobj.getFullYear() + '-' + month + '-' + day;
        return date;
    },
    
    addDays: function (dte, days) {
        var dat = new Date(dte);
        dat.setDate(dat.getDate() + days);
        return dat;
    },
    
    getDates: function (startDate, stopDate) {
        var dateArray = new Array();
        var currentDate = startDate;
        while (currentDate <= stopDate) {
            dateArray.push(currentDate)
            currentDate = meetingHome.addDays(currentDate, 1);
        }
        return dateArray;
    },
    
    getTimeWithFormat: function(dateStr) {
        var timeStr = dateStr.split(' ');
        timeStr.shift();
        str = timeStr[0].split(':')[0] + ':' + timeStr[0].split(':')[1] + ' ' + timeStr[1];
        return str;
    },
    
    fitMeetingHome: function () {
        if ($(window).width() > 766) {
            var hgt = ($(window).height() - 100), topSecHgt = 260;
            $('.meeting-desktop').css('height', hgt);
            $('.meeting-desktop .meeting-list .meeting-section ul.list-cont').css('height', (hgt - 62));
        } 
    },
    
    checkMeetingBeforeEndTime: function (meetingEndTime) {
        var dateary = meetingEndTime.split(' ');
        var date = dateary[0], time = dateary[1], meridian = dateary[2];
        var nDate = new Date();

        nDate.setDate(date.split('/')[0]);
        nDate.setMonth(date.split('/')[1] - 1);
        nDate.setFullYear(date.split('/')[2]);

        var hour = parseInt(time.split(':')[0], 10);
        nDate.setMinutes(parseInt(time.split(':')[1], 10));
        nDate.setSeconds(parseInt(time.split(':')[2], 10));

        if (meridian == 'PM') {
            hour = hour + 12;
            nDate.setHours(hour);
        } else {
            nDate.setHours(hour);
        }

        var edatetime = nDate.getTime(), cDate = new Date().getTime();
        if (cDate < edatetime)
            return true;

        return false;
    }
};

/*help text*/
var assetHelp = {};
assetHelp.showHelpText = function () {
    var imageUrl = "../../images/help/helper-meeting-1024.png";
    var helps = [{
        message: "Your daily schedule, shows your meetings.",
        title: null
    }, {
        message: "Your meetings and participants list.",
        title: null
    }, {
        message: "Your information hub.",
        title: null
    }, {
        message: "Get this help, any time.",
        title: null
    }];
    var isLandscape = false;
    if (window.innerHeight > window.innerWidth) {
        isLandscape = false;
    } else {
        isLandscape = true;
    }
    if ($(window).width() >= 1006) {
        imageUrl = "../../images/help/helper-meeting-1024.png";
        helps[0].top = "80px";
        helps[0].right = "370px";
        helps[0].downArrow = true;
        helps[0].arrowLeft = "15px";

        helps[1].top = "350px";
        helps[1].right = "370px";
        helps[1].downArrow = false;
        helps[1].arrowLeft = "15px";

        helps[2].top = "50px";
        helps[2].right = "5px";
        helps[2].downArrow = false;
        helps[2].arrowLeft = "243px";

        helps[3].top = "50px";
        helps[3].right = "5px";
        helps[3].downArrow = false;
        helps[3].arrowLeft = "175px";
    } else if ($(window).width() >= 768 && $(window).width() < 1024) {
        imageUrl = "../../images/help/helper-meeting-768.png";
        helps[0].top = "80px";
        helps[0].right = "370px";
        helps[0].downArrow = true;
        helps[0].arrowLeft = "15px";

        helps[1].top = "350px";
        helps[1].right = "370px";
        helps[1].downArrow = false;
        helps[1].arrowLeft = "15px";

        helps[2].top = "50px";
        helps[2].right = "5px";
        helps[2].downArrow = false;
        helps[2].arrowLeft = "243px";

        helps[3].top = "50px";
        helps[3].right = "5px";
        helps[3].downArrow = false;
        helps[3].arrowLeft = "175px";
    } else if ($(window).width() >= 640 && $(window).width() < 768) {
        imageUrl = "../../images/help/helper-meeting-640.png";
        helps[0].top = "80px";
        helps[0].right = "250px";
        helps[0].downArrow = true;
        helps[0].arrowLeft = "15px";

        helps[1].top = "180px";
        helps[1].right = "250px";
        helps[1].downArrow = true;
        helps[1].arrowLeft = "15px";

        helps[2].top = "50px";
        helps[2].right = "5px";
        helps[2].downArrow = false;
        helps[2].arrowLeft = "242px";

        helps[3].top = "50px";
        helps[3].right = "5px";
        helps[3].downArrow = false;
        helps[3].arrowLeft = "173px";
    } /*else if ($(window).width() >= 480 && $(window).width() < 640) {
    imageUrl = "../../images/help/helper-480.png";
    helps[1].right = "5px";
    helps[1].arrowLeft = "110px";
    helps[2].right = "140px";
    helps[2].downArrow = true;
    helps[2].top = "60px";
    helps[3].right = "3px";
    helps[4].right = "10px";
    }*/ else if (($(window).width() == 600 || $(window).width() == 601 || $(window).width() == 960) && $(window).height() <= 1000) {
        imageUrl = "../../images/help/helper-meeting-600.png";
        helps[0].top = "80px";
        helps[0].right = "250px";
        helps[0].downArrow = true;
        helps[0].arrowLeft = "15px";

        helps[1].top = "150px";
        helps[1].right = "250px";
        helps[1].downArrow = true;
        helps[1].arrowLeft = "15px";

        helps[2].top = "50px";
        helps[2].right = "5px";
        helps[2].downArrow = false;
        helps[2].arrowLeft = "225px";

        helps[3].top = "50px";
        helps[3].right = "5px";
        helps[3].downArrow = false;
        helps[3].arrowLeft = "145px";
    } else if (isLandscape) {
        imageUrl = "../../images/help/helper-meeting-480.png";
        helps[0].top = "80px";
        helps[0].right = "100px";
        helps[0].downArrow = true;
        helps[0].arrowLeft = "15px";

        helps[1].top = "175px";
        helps[1].right = "100px";
        helps[1].downArrow = true;
        helps[1].arrowLeft = "15px";

        helps[2].top = "50px";
        helps[2].right = "5px";
        helps[2].downArrow = false;
        helps[2].arrowLeft = "242px";

        helps[3].top = "50px";
        helps[3].right = "5px";
        helps[3].downArrow = false;
        helps[3].arrowLeft = "173px";
    } else {
        imageUrl = "../../images/help/helper-meeting-320.png";
        helps[0].top = "80px";
        helps[0].right = "5px";
        helps[0].downArrow = true;
        helps[0].arrowLeft = "15px";

        helps[1].top = "150px";
        helps[1].right = "5px";
        helps[1].downArrow = true;
        helps[1].arrowLeft = "15px";

        helps[2].top = "50px";
        helps[2].right = "5px";
        helps[2].downArrow = false;
        helps[2].arrowLeft = "242px";

        helps[3].top = "50px";
        helps[3].right = "5px";
        helps[3].downArrow = false;
        helps[3].arrowLeft = "173px";
    }
    var $img = $("<img>");
    $img.load(function() {
        webHelper.loadHelpPopup(imageUrl, helps, assetHelp.beforeShow, assetHelp.afterClose);
    }).attr("src", imageUrl);
};
assetHelp.afterClose = function () {
    $("#headersection").show();
    //$(".helper-wrapper-main").remove();
    //$('body').removeClass("helperlowerheight").css("overflow", "auto");
};
assetHelp.beforeShow = function () {
    $("#headersection").hide();
    //$('body').addClass("helperlowerheight").css("overflow", "hidden");
};
/*help text*/