var commonValues = {
    defaults: {
        timeZoneOffSet: new Date().getTimezoneOffset()
    },
    getUTCOffset: function () {
        var offset = (new Date()).getTimezoneOffset();
        if (offset < 0) {
            offset = 10000 + Math.abs(offset);
        }
        return offset;
    },
};
var Services = {
    subdomainName: common.defaults.sudDomainName,
    utcOffset: commonValues.getUTCOffset(),
    myProfileURL: 'http://kangle.blob.core.windows.net/kangle-admin/default_profile_pic.jpg',
    companyId: common.defaults.companyId,
    context: {
        user: 'user',
        meeting: 'Meeting',
        topic: 'json',
        cloud: 'CloudConvert',
        profile: 'UserApi'
    },
    offset: commonValues.getUTCOffset(),
    getKWUserInfo: function (userId, success, failure) {
        var _this = Services;
        var context = [_this.context.user, 'getKWUserInfo', _this.subdomainName, userId, common.defaults.companyId];
        CoreREST.get(_this, context, null, success, failure);
    },
    getAllUsers: function (userName, data, success, failure) {
        var _this = Services, context = '';
        context = [_this.context.user, 'getAllUsers', _this.subdomainName, _this.companyId, common.defaults.userId, userName];
        CoreREST.get(_this, context, data, success, failure);
    },
    getNotificationHubCountView: function (userId, success, failure) {
        var _this = Services;
        var context = ["NotifyHubApi", 'getNotificationHubCount', _this.subdomainName, _this.companyId, userId];
        CoreREST.get(_this, context, null, success, failure);
    },
    /*Meeting Access*/
    createMeetingAccess: function (userId, success, failure) {
        var _this = Services, context = '';
        context = [_this.context.user, 'createMeetingAccess', _this.subdomainName, userId, _this.companyId];
        CoreREST.get(_this, context, null, success, failure);
    },
    /*Meeting Access End*/
    saveMeeting: function (moderatorId, data, success, failure) {
        var _this = Services, context = '';
        context = [_this.context.meeting, 'InsertMeeting', _this.subdomainName, _this.companyId];
        CoreREST.post(_this, context, data, success, failure);
    },
    getModeratorMeetings: function (moderatorId, success, failure) {
        var _this = Services, context = '';
        context = [_this.context.meeting, 'getModeratoeMeeting', _this.subdomainName, _this.companyId, moderatorId,
            _this.offset];
        CoreREST.get(_this, context, null, success, failure);
    },
    startMeeting: function (meetingId, success, failure) {
        var _this = Services, context = '';
        context = [_this.context.meeting, 'startMeeting', _this.subdomainName, meetingId];
        CoreREST.post(_this, context, null, success, failure);
    },
    getAllMeetings: function(userId, success, failure) {
    	var _this= Services, context = '';
    	context = [_this.context.meeting, 'getMyCurrentMeeting', _this.subdomainName, _this.companyId, userId, _this.offset];
    	CoreREST.get(_this, context, null, success, failure);
    },

    /* File API */
    getUploadedSlides: function (success, failure) {
        var _this = Services, context = '';
        /*if (App.testing == false) {
            context = [_this.context.topic, 'uploaded_slides.json'];
        } else {
            context = [_this.context.topic, 'uploaded_slides.json'];
        }
        CoreREST.get(_this, context, null, success, failure);*/
    },
    getSlidesByMeetingId: function (meetingId, success, failure) {
        var _this = Services, context = '';
        /*if (App.testing == false) {
            context = [_this.context.topic, 'GetSlidesByMeetingById', meetingId];
        } else {
            context = [_this.context.topic, 'slides_by_id.json'];
        }
        CoreREST.get(_this, context, null, success, failure);*/
    },
    updateMeeting: function (meetingId, data, success, failure) {
        /*var _this = Services, context = '';
        if (App.testing == false) {
            context = [_this.context.topic, 'UpdateMeeting', meetingId];
        } else {
            context = [_this.context.topic, 'update_meeting_slides.json'];
        }
        CoreREST.post(_this, context, data, success, failure);*/
    },

    /* Player Section - Vinoth Kannah MP */
    saveOrUpdateMaterialStatus: function (meetingId, materialId, data, success, failure) {
        /*var _this = Services, context = '';
        if (App.testing == false) {
            context = [_this.context.topic, 'saveOrUpdateMaterial.json', meetingId, materialId];
        } else {
            context = [_this.context.topic, 'saveOrUpdateMaterial.json'];
        }
        CoreREST.postArray(_this, context, data, success, failure);*/
    },
    saveOrUpdateMeeting: function (data, success, failure) {
        /*var _this = Services, context = '';
        if (App.testing == false) {
            context = [_this.context.topic, 'saveOrUpdateMeeting.json', meetingId, materialId];
        } else {
            context = [_this.context.topic, 'saveOrUpdateMeeting.json'];
        }
        CoreREST.post(_this, context, data, success, failure);*/
    },
    /* End Vinoth Kannah MP */

    /*Current Meetings and Past Meetings*/
    getCurrentMeetings: function (participantId, success, failure) {
        var _this = Services, context = '';
        var data = {
            participantId: participantId,
            utcOffset: _this.offset
        };
        context = [_this.context.meeting, 'getCurrentMeetings', _this.subdomainName, _this.companyId];
        CoreREST.post(_this, context, data, success, failure);
    },

    getPastMeetings: function (participantId, success, failure) {
        var _this = Services, context = '';
        var data = {
            participantId: participantId,
            utcOffset: _this.offset
        };
        context = [_this.context.meeting, 'getPastMeetings', _this.subdomainName, _this.companyId];
        CoreREST.post(_this, context, data, success, failure);
    },

    getMeetingStatus: function (meetingId, success, failure) {
        var _this = Services, context = '';
        context = [_this.context.meeting, 'getMeetingStatus', _this.subdomainName, meetingId];
        CoreREST.get(_this, context, null, success, failure);
    },
    changeMeetingStatus: function (meetingId, participantId, status, success, failure) {
        var _this = Services, context = '';
        context = [_this.context.meeting, 'changeMeetingStatus', _this.subdomainName, meetingId, participantId, status];
        CoreREST.post(_this, context, null, success, failure);
    },
    joinMeetingParticipants: function (meetingId, participantId, success, failure) {
        var _this = Services, context = '';
        context = [_this.context.meeting, 'joinMeetingParticipants', _this.subdomainName, meetingId, participantId];
        CoreREST.post(_this, context, null, success, failure);
    },
    leaveMeetingParticipants: function (meetingId, participantId, success, failure) {
        var _this = Services, context = '';
        context = [_this.context.meeting, 'leaveMeetingParticipants', _this.subdomainName, meetingId, participantId];
        CoreREST.post(_this, context, null, success, failure);
    },
    insertMeetingParticipants: function(inputObj, success, failure) {
        var _this = Services, context = '';
        context = [_this.context.meeting, 'insertMeetingParticipants', _this.subdomainName, _this.companyId];
        CoreREST.postArray(_this, context, inputObj, success, failure);
    },

    /*End OfCurrent Meetings and Past Meetings*/
    
    /* Upload files */
    getProcessUrl: function (extension, success, failure) {
        var _this = Services, context = '';
        context = [_this.context.cloud, 'getProcessUrl', extension];
        CoreREST.get(_this, context, null, success, failure);
    },
    insertMeetingMaterial: function (data, success, failure) {
        var _this = Services, context = '';
        context = [_this.context.meeting, 'insertMeetingMaterial', _this.subdomainName];
        CoreREST.post(_this, context, data, success, failure);
    },
    refreshMeetingMaterial: function (meetingId, success, failure) {
        var _this = Services, context = '';
        context = [_this.context.meeting, 'refreshMeetingMaterial', _this.subdomainName, meetingId];
        CoreREST.get(_this, context, null, success, failure);
    },
    getActualMeetingMaterial: function (meetingId, success, failure) {
        var _this = Services, context = '';
        context = [_this.context.meeting, 'getActualMeetingMaterial', _this.subdomainName, meetingId];
        CoreREST.get(_this, context, null, success, failure);
    },
    insertActualMeetingMaterial: function (data, success, failure) {
        var _this = Services, context = '';
        context = [_this.context.meeting, 'insertActualMeetingMaterial', _this.subdomainName];
        CoreREST.postArray(_this, context, data, success, failure);
    },

    /** Meeting player **/
    getMeetingDeatils: function (meetingId, success, failure) {
        var _this = Services, context = '';
        context = [_this.context.meeting, 'getMeetingDeatils', _this.subdomainName, meetingId];
        CoreREST.get(_this, context, null, success, failure);
    },
    leaveMeetingParticipants: function (meetingId, participantUserId, success, failure) {
        var _this = Services, context = '';
        context = [_this.context.meeting, 'leaveMeetingParticipants', _this.subdomainName, meetingId, participantUserId];
        CoreREST.post(_this, context, null, success, failure);
    },
    leaveMeetingModerator: function (meetingId, success, failure) {
        var _this = Services, context = '';
        context = [_this.context.meeting, 'leaveMeetingModerator', _this.subdomainName, meetingId];
        CoreREST.post(_this, context, null, success, failure);
    },
    createOrUpdateMaterialStatus: function (data, success, failure) {
        var _this = Services, context = '';
        context = [_this.context.meeting, 'createOrUpdateMaterialStatus', _this.subdomainName];
        CoreREST.post(_this, context, data, success, failure);
    },
    checkMeetingMaterial: function (meetingId, success, failure) {
        var _this = Services, context = '';
        context = [_this.context.meeting, 'checkMeetingMaterial', _this.subdomainName, meetingId];
        CoreREST.get(_this, context, null, success, failure);
    },
    checkMeetingTime: function(meetingId, success, failure) {
        var _this = Services, context = '';
        context = [_this.context.meeting, 'checkMeetingTime', _this.subdomainName, _this.companyId, meetingId];
        CoreREST.get(_this, context, null, success, failure);
    },
    /** Analytics **/
    getMeetingAnalytics:function (meetingId, success, failure) {
        var _this = Services, context = '';
        context = [_this.context.meeting, 'getMeetingAnalytics', _this.subdomainName, meetingId, _this.companyId, _this.offset];
        CoreREST.get(_this, context, null, success, failure);
    },
    getAvailableMeetingforMonth: function (userId, month, year, success, failure) {
        var _this = Services, context = '';
        context = [_this.context.meeting, 'GetAvailableMeetingsForMonth', _this.subdomainName, _this.companyId, userId, month, year, _this.utcOffset];
        CoreREST.get(_this, context, null, success, failure);
    },
    GetAvailableMeetingsForDay: function (userId, date, success, failure) {
        var _this = Services, context = '';
        context = [_this.context.meeting, 'GetAvailableMeetingsForDay', _this.subdomainName, _this.companyId, userId, date, _this.offset];
        CoreREST.get(_this, context, null, success, failure);
    },
    cancelMeeting: function(meetingId, success, failure) {
        var _this = Services, context = '';
        context = [_this.context.meeting, 'CancelMeeting', _this.subdomainName, _this.companyId, meetingId];
        CoreREST.get(_this, context, null, success, failure);
    },
    removeParticipants: function(meetingId, participantId, success, failure) {
        var _this = Services, context = '';
        context = [_this.context.meeting, 'RemoveParticipants', _this.subdomainName, _this.companyId, meetingId, participantId];
        CoreREST.get(_this, context, null, success, failure);
    },
    addPresenter: function (meetingId, presenterUserId, success, failure) {
        var _this = Services, context = '';
        context = [_this.context.meeting, 'AddPresenter', _this.subdomainName, _this.companyId, meetingId, presenterUserId];
        CoreREST.get(_this, context, null, success, failure);
    },
    removePresenter: function (meetingId, presenterUserId, success, failure) {
        var _this = Services, context = '';
        context = [_this.context.meeting, 'RemovePresenter', _this.subdomainName, _this.companyId, meetingId, presenterUserId];
        CoreREST.get(_this, context, null, success, failure);
    },
    getActionMsg: function (userId, success, failure) {
        var _this = Services;
        var context = ['Message', 'getActionMsg', _this.subdomainName, _this.companyId, _this.utcOffset, userId];
        CoreREST.get(_this, context, null, success, failure);
    },
    getUnReadMessagesCount: function (userId, success, failure) {
        var _this = Services;
        var context = ['Message', 'getUnReadMessagesCount', _this.subdomainName, _this.companyId, userId];
        CoreREST.get(_this, context, null, success, failure);
    },
    
    insertUserTracker: function(data, success, failure) {
        var _this = Services;
        var context = [_this.context.profile, 'insertUserTracker', _this.defaults.sudDomainName];
        CoreREST.postArray(_this, context, data, success, failure);
    }
};