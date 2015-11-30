var anotate = {
    init: function () {
        anotate.bindDatePicker();
        anotate.validateForm();
        anotate.getAllUsers();
        anotate.getAllModeratorMeetings();
    },
    bindDatePicker: function () {
        var dte = new Date(), defDate = new Date();
        $(".input-group.date").datetimepicker({
            format: "mm/dd/yyyy hh:ii", showMeridian: true, startDate: dte, autoclose: true, todayBtn: true
        });
    },
    getAllUsers: function () {
        var html = '';
        $('input.search').select2({
            minimumInputLength: 1,
            multiple: true,
            ajax: {
                url: function (term, page) {
                    return CoreREST._defaultServer +"/User/getAllUser/" + Services.subdomainName + "/" + Services.companyId + "/" + common.defaults.userId + '/' + term
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
    bindAllUsers: function (success, failure) {
        Services.getAllUsers(null, function (data) {
            success(data);
        }, function (err) {
            failure(err);
        });
    },
    saveMeeting: function (el) {
        var frm = $(el);
        common.showLoader();
        if (!anotate.checkDate($('input[name="meeting-date-from"]'), $('input[name="meeting-date-to"]'))) {
            alert('End date should be greater than selected date');
            common.hideLoader();
            return false;
        }
        var fromTime = anotate.checkOldTime($('input[name="meeting-date-from"]').val()),
        toTime = anotate.checkOldTime($('input[name="meeting-date-to"]').val());
	    if (!fromTime || !toTime) {
	        alert('Please choose date/time greater than current time');
	        common.hideLoader();
	        return false;
	    }
        //Create JSON
        var participantArray = new Array();
        var partSelectArray = $('input.search').select2('data');
        if (partSelectArray && partSelectArray.length > 0) {
            participantArray = new Array();
            for (var i = 0; i < partSelectArray.length; i++) {
                var obj = {};
                obj.UserName = partSelectArray[i].User_Name;
                obj.UserId = partSelectArray[i].User_Id;
                participantArray.push(obj);
            }
        } else {
            alert("Please select atleast one participant for a meeting");
            common.hideLoader();
        }

        var agendaVal = $('textarea[name="meeting-agenda"]').val();
        var bAnotate = $('input[type="checkbox"]').get(0).checked; //alert(bAnotate);
        var meetingObj = {
            Name: $('input[name="meeting-name"]').val(),
            UserID: common.defaults.userId,
            StartDateTime: common.parseDate($('input[name="meeting-date-from"]').val()),
            EndDateTime: common.parseDate($('input[name="meeting-date-to"]').val()),
            Description: $('textarea[name="meeting-desc"]').val(),
            Agenda: encodeURIComponent(agendaVal),
            Participants: participantArray,
            Participant_Can_Annotate: bAnotate ? 1 : 0
        };

        Services.saveMeeting(common.defaults.userId, meetingObj, function (data) {
            common.clearValues(frm);
            $('.row-submit').remove();
            common.hideLoader();
            frm.append('<div class="success">Meeting created successfully</div>');
            frm.append('<div class="upload-msg"><a href="UploadFiles.html?meetingId=' + data + '" class="">Click Here</a> to upload files</div>');
            $('input.search').val('').select2('val', '');
            anotate.getAllModeratorMeetings();
        }, function (err) {
            console.log(err);
        });
        return false;
    },
    validateForm: function () {
        var options = {
            rules: {
                'meeting-name': { required: true, maxlength: 50 },
                'meeting-date-from': { required: true },
                'meeting-date-to': { required: true },
                'meeting-desc': { required: true, maxlength: 500 },
                'meeting-agenda': { required: true, maxlength: 500 }
            },
            messages: {
                'meeting-name': "Enter name below 50 characters.",
                'meeting-date-from': "Meeting from-date required",
                'meeting-date-to': "Meeting to-date required",
                'meeting-desc': "Description should be min 1 and max 500 chars",
                'meeting-agenda': "Agenda should be min 1 and max 500 chars"
            },
            onValidateSuccess: anotate.saveMeeting
        };
        $.fn.validate = function (options) {
            $(this).bind('submit', function () {
                $('label.error').remove();
                var errors = validForm($(this), options);
                if (errors > 0)
                    return false;
                options.onValidateSuccess(this);
                return false;
            });

            function validForm(form, options) {
                var errors = 0;
                for(var el in options.rules) {
                    var ruleError = 0;
                    var frmEl = $('.' + el, form);
                    var val = frmEl.val();
                    var rules = options.rules[el];
                    if (rules.required) {
                        if (val == '') ruleError++;
                    }
                    if (rules.maxlength != undefined && rules.maxlength > 0) {
                        if (val != '' && val.length > rules.maxlength) ruleError++;
                    }
                    if (ruleError > 0) {
                        errors++;
                        $('<label class="error" for="' + el + '">' + options.messages[el] + '</label>').insertAfter(frmEl);
                    }
                }
                return errors;
            }
        };
        $('.meeting-form').validate(options);
    },
    checkDate: function (date1, date2) {
        var parseDate1 = new Date(date1.val()),
			parseDate2 = new Date(date2.val());
        var diff = parseDate2.getTime() - parseDate1.getTime();
        if (diff < 0)
            return false;
        return true;
    },
    checkOldTime: function (date1) {
        var parseDate1 = new Date(date1), parseDate2 = new Date();
        var diff = parseDate1.getTime() - parseDate2.getTime();
        if (diff < 0)
            return false;
        return true;
    },
    getAllModeratorMeetings: function () {
        Services.getModeratorMeetings(common.defaults.userId, function (data) {
            console.log(JSON.stringify(data));
            anotate.bindMeetings(data);
        }, function (err) {
            console.log(err);
        });
    },
    bindMeetings: function (meetings) {
        var el = $('.current-list');
        if (meetings && meetings.length > 0) {
            el.empty();
            for (var i = 0; i < meetings.length; i++) {
                var meeting = meetings[i];                
                var desc = (meeting.Meeting_Description == null ? '' : meeting.Meeting_Description);
                var li = $('<li></li>'); li.addClass('clearfix');
                li.append('<div class="meeting-name"><h2><span class="fa fa-circle"></span>' + meeting.Meeting_Name + '</h2>' +
                    '<p class="moder-desc">' + desc + '</p></div>');
                li.append('<div class="meeting-date"><div><span class="date-label"><span class="fa fa-calendar"></span> From : </span>' +
                    '<span class="date-label">' + meeting.Formatted_Start_DateTime + '</span></div><div><span class="date-label"><span class="fa fa-calendar"></span> To : </span><span class="date-label">' +
                    meeting.Formatted_End_DateTime + '</span></div></div>');
                if (meeting.Meeting_Status == 0 && meeting.Current_Status == true) {
                    li.append('<div class="meeting-status"><div style="display:block" class="join-div">' +
                        '<a href="Analytics.html?meetingId=' + meeting.Meeting_Id + '" class="stat-btn"></a><a href="#" class="join-btn">Start Meeting</a></div></div>');
                } else {
                    if (meeting.Meeting_Status == 1 && meeting.Current_Status == true) {
                        li.append('<div class="meeting-status"><div style="display:block" class="join-div">' +
                        '<a href="Analytics.html?meetingId=' + meeting.Meeting_Id + '" class="stat-btn"></a><a href="#" class="join-btn rejoin">Rejoin Meeting</a></div></div>');
                    } else {
                        li.append('<div class="meeting-status"><div style="display:block" class="join-div">' +
                            '<a href="Analytics.html?meetingId=' + meeting.Meeting_Id + '" class="stat-btn"></a></div></div>');
                    }
                }
                li.data('meetingobj', meeting);
                el.append(li);
            }
        } else {
            el.append('<li class="success-msg" >Currently No meetings found. Please create any meeting</li>');
        }
        anotate.bindActions();
    },
    bindActions: function () {
        $('.current-list').delegate('.join-btn', 'click', function () {

            var meeting = $(this).parents('li').eq(0).data('meetingobj');
            if($(this).hasClass('rejoin'))
                window.location.href = 'MeetingPlayer.html?userId=' + common.defaults.userId + '&meetingId=' + meeting.Meeting_Id;
            else
                window.location.href = 'UploadFiles.html?meetingId=' + meeting.Meeting_Id;
            return false;
        });
    }
};

var analytics = {
    init: function() {
        analytics.getMeetingAnalytics();
    },
    getMeetingAnalytics: function () {
        var url = window.location.href, meetingId = null;
        meetingId = url.substr(url.lastIndexOf('=') + 1, url.length);
        meetingId = parseInt(meetingId, 10);
        common.showLoader();
        Services.getMeetingAnalytics(meetingId, function (data) {
            console.log(data);
            if (data != undefined && data != null) {
                analytics.createMeetingTitle(data.lstMeetingMasterModel);
                analytics.createMeetingDesc(data.lstMeetingMasterModel);
                analytics.createParticipantBlock(data.lstMeetingParticipantModel);
                analytics.createSlidesBlock(data.lstMeetingMaterialStatus);
            }
            common.hideLoader();
        }, function () {
            console.log('error');
            common.hideLoader();
        });
    },
    createMeetingTitle: function (meeting) {
        if (meeting && meeting.length > 0) meeting = meeting[0];
        $('#analytics-title h2').text('Analytics Of Meeting : ' + meeting.Meeting_Name);
    },
    createMeetingDesc: function (meeting) {
        if (meeting && meeting.length > 0) meeting = meeting[0];
        var el = $('#analytics-report .meeting-desc');
        $('.name', el).html(meeting.Meeting_Name);
        var meetinStatus = '';
        
        if (meeting.Meeting_Status == 0) {
            meetinStatus = '<span class="meet-stat">Meeting Not Started</span>';
        } else if (meeting.Meeting_Status == 1) {
            meetinStatus = '<span class="meet-stat">Meeting in Progress</span>';
        } else if (meeting.Meeting_Status == 2) {
            meetinStatus = '<span class="meet-stat">Meeting Ended</span>';
        }
        $('.status', el).html(meetinStatus);
        var fStartDate = meeting.Formatted_Actual_Start_DateTime,
            fEndDate = meeting.Formatted_Actual_End_DateTime;
        if (fStartDate == null)
            fStartDate = 'NA';
        if (fEndDate == null)
            fEndDate = 'NA';

        $('.date', el).html('<b>Actual Meeting start date: </b>' + fStartDate + '<br/><b>Actual Meeting End date: </b>' + fEndDate);
        if (fStartDate != 'NA' && fEndDate != 'NA') {
            var endTime = parseInt(analytics.getDate(meeting.Actual_End_DateTime).getTime(), 10),
                startTime = parseInt(analytics.getDate(meeting.Actual_Start_DateTime).getTime(), 10);
            diff = endTime - startTime; diff = diff / 1000;
            $('.date', el).append('<div><b>Meeting Duration: </b> ' + analytics.timeParse(diff) + ' </div>');
        }
        $('.desc', el).html(meeting.Meeting_Description);
        $('.agenda pre', el).html(decodeURI(meeting.Meeting_Agenda));
    },
    createParticipantBlock: function (participants) {
        $('.actual-part').text(participants.length);
        var attendParticipants = 0;
        $('.meet-grid.grid-memb .meet-grid-row').remove();
        for (var i = 0; i < participants.length; i++) {
            var curPart = participants[i];
            var row = '<div class="meet-grid-row">';
            row += '<div class="meet-grid-col col-name">' + curPart.Participant_FName + '</div>';
            
            if (curPart.Participant_JoinedMeeting) {
                attendParticipants++;
                row += '<div class="meet-grid-col col-stat col-join">Attended</div>';
            } else {
                row += '<div class="meet-grid-col col-stat">Not attended</div>';
            }
            row += '<div class="meet-grid-col col-time">' + (curPart.Formatted_Join_DateTime == null ? '-' : curPart.Formatted_Join_DateTime) + '</div>';
            row += '</div>';
            $('.meet-grid.grid-memb').append(row);
        }
        $('.attend-part').text(attendParticipants);
    },
    createSlidesBlock: function (slides) {
        if (slides && slides.length > 0) {
            $('.meet-grid.grid-slides .meet-grid-row').remove();
            for (var i = 0; i < slides.length; i++) {
                var seconds = '-';
                var curPart = slides[i];
                seconds = analytics.timeParse(curPart.Seconds);
                var row = '<div class="meet-grid-row">';
                row += '<div class="meet-grid-col col-name">' + curPart.Material_Name + '</div>';
                row += '<div class="meet-grid-col col-stat">' + seconds + ' </div>';
                row += '</div>';
                $('.meet-grid.grid-slides').append(row);
            }
        } else {
            $('.meet-grid.grid-slides').append('No slides found');
        }
    },
    getDate: function (date) {
        var dte = new Date(date);
        return dte;
    },
    timeParse: function (time) {
        var seconds = 0;
        if (time < 60) {
            seconds = parseInt(time,10) + ' Seconds';
        } else {
            /*seconds = curPart.Seconds/60*/
            var min = parseInt(time / 60, 10);
            var sec = parseInt(time % 60, 10);
            if (min < 60) {
                seconds = min + ' min ' + sec + ' seconds';
            } else {
                var hour = 0;
                hour = parseInt(min / 60, 10);
                min = (min - (hour * 60));

                if (hour > 24) {
                    var days = parseInt(hour / 24, 10);
                    hour = (hour - (days * 24));
                    seconds = days + ' days ' + hour + 'hr ' + min + ' min ' + sec + ' seconds';
                } else {
                    seconds = hour + 'hr ' + min + ' min ' + sec + ' seconds';
                }
            }
        }
        return seconds;
    }
};