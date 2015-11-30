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
}
var Services = {

    defaults: {
        //subdomainName: 'kangle.swaas.net',
        subdomainName:window.localStorage.getItem('domainName'),
        //subdomainName: window.location.hostname,
        userId: null,
        //Hard Code for Image URL..Retreive from Blob/Images Folder
        defaultThumbnail: 'http://kangle.blob.core.windows.net/kangle-admin/default_profile_pic.jpg',
        myProfileURL: 'http://kangle.blob.core.windows.net/kangle-admin/default_profile_pic.jpg',
        displayName: null,
        userPrefix: 'Dr. ',
        companyId: 0,
        userMood: 'cool',
        activityStreamInterval: 3000,
        utcOffset: commonValues.getUTCOffset(),
        userMood: 'Hi!',
        defaultPubThumbnail: 'http://rxbook.blob.core.windows.net/images/avatar-group.jpg.png',
        defaultPvtThumbnail: 'http://rxbook.blob.core.windows.net/images/group_Icon.png',
        timeStamp: 1010101010,
    },

    context: {
        message: 'Message',
        topic: 'RxTopic',
        subscription: 'Subscription',
        user: 'User',
        profile: 'UserApi',
        notificationHub: 'NotifyHubApi',
        customerapi: 'CustomerApi',
        customerentityapi: 'CustomerEntityApi'
    },

    // topics section
    getTopics: function (userId, success, failure) {
        var _this = Services;
        var context = [_this.context.topic, 'getTopics', _this.defaults.subdomainName, _this.defaults.companyId, userId];
        CoreREST.get(_this, context, null, success, failure);
    },
    getTopicById: function (userId, topicId, success, failure) {
        var _this = Services;
        var context = [_this.context.topic, 'getTopicById', _this.defaults.subdomainName, _this.defaults.companyId, userId, topicId];
        CoreREST.get(_this, context, null, success, failure);
    },
    getPrivateGroups: function (userId, success, failure) {
        var _this = Services;
        var context = [_this.context.topic, 'getPrivateGroups', _this.defaults.subdomainName, _this.defaults.companyId, userId];
        CoreREST.get(_this, context, null, success, failure);
    },
    getPublicGroups: function (userId, success, failure) {
        var _this = Services;
        var context = [_this.context.topic, 'getPublicGroups', _this.defaults.subdomainName, _this.defaults.companyId, userId];
        CoreREST.get(_this, context, null, success, failure);
    },
    getAlerts: function (success, failure) {
        var _this = Services;
        var context = [_this.context.topic, 'getAlerts', _this.defaults.subdomainName, _this.defaults.companyId];
        CoreREST.get(_this, context, null, success, failure);
    },
    addTopic: function (userId, param, success, failure) {
        var _this = Services;
        var context = [_this.context.topic, 'addTopic', _this.defaults.subdomainName, _this.defaults.companyId, userId];
        CoreREST.post(_this, context, param, success, failure);
    },
    addTopicHD: function (userId, param, success, failure) {
        var _this = Services;
        var context = [_this.context.topic, 'addTopicHD', _this.defaults.subdomainName, _this.defaults.companyId, userId];
        CoreREST.post(_this, context, param, success, failure);
    },
    removeTopic: function (userId, topicId, removeUserId, success, failure) {
        var _this = Services;
        var context = [_this.context.topic, 'removeTopic', _this.defaults.subdomainName, _this.defaults.companyId, userId, topicId, removeUserId];
        CoreREST.post(_this, context, null, success, failure);
    },

    // subscription section
    addSubscription: function (userId, topicId, param, success, failure) {
        var _this = Services;
        var context = [_this.context.subscription, 'addSubscription', _this.defaults.subdomainName, _this.defaults.companyId, userId, topicId];
        CoreREST.post(_this, context, param, success, failure);
    },
    addSubscriptionHD: function (companyId, userId, topicId, param, success, failure) {
        var _this = Services;
        var context = [_this.context.subscription, 'addSubscription', _this.defaults.subdomainName, companyId, userId, topicId];
        CoreREST.post(_this, context, param, success, failure);
    },
    acceptInvite: function (userId, topicId, messageId, success, failure) {
        var _this = Services;
        var context = [_this.context.subscription, 'acceptInvite', _this.defaults.subdomainName, _this.defaults.companyId, userId, topicId, messageId];
        CoreREST.post(_this, context, null, success, failure);
    },
    rejectInvite: function (userId, topicId, messageId, success, failure) {
        var _this = Services;
        var context = [_this.context.subscription, 'rejectInvite', _this.defaults.subdomainName, _this.defaults.companyId, userId, topicId, messageId];
        CoreREST.post(_this, context, null, success, failure);
    },
    unsubscribeMember: function (userId, topicId, success, failure) {
        var _this = Services;
        var context = [_this.context.subscription, 'unsubscribeMember', _this.defaults.subdomainName, _this.defaults.companyId, userId, topicId];
        CoreREST.post(_this, context, null, success, failure);
    },
    makeContributor: function (userId, topicId, success, failure) {
        var _this = Services;
        var context = [_this.context.subscription, 'makeContributor', _this.defaults.subdomainName, _this.defaults.companyId, userId, topicId];
        CoreREST.get(_this, context, null, success, failure);
    },

    // user section
    getDPUserInfo: function (userId, success, failure) {
        var _this = Services;
        var context = [_this.context.user, 'getDPUserInfo', _this.defaults.subdomainName, userId];
        CoreREST.get(_this, context, null, success, failure);
    },
    getKWUserInfo: function (userId, success, failure) {
        var _this = Services;
        var context = [_this.context.user, 'getKWUserInfo', _this.defaults.subdomainName, userId, window.localStorage.getItem('companyId')];
        CoreREST.get(_this, context, null, success, failure);
    },
    getuserProfileInfo: function (userId, success, failure) {
        var _this = Services;
        var context = [_this.context.user, 'getuserProfileInfo', _this.defaults.subdomainName, userId];
        CoreREST.get(_this, context, null, success, failure);
    },
    updateUserProfile: function (param, success, failure) {
        var _this = Services;
        var context = [_this.context.user, 'updateUserProfile', _this.defaults.subdomainName];
        CoreREST.post(_this, context, param, success, failure);
    },
    updateMood: function (userId, param, success, failure) {
        var _this = Services;
        var context = [_this.context.user, 'updateMood', _this.defaults.subdomainName, _this.defaults.companyId, userId];
        CoreREST.post(_this, context, param, success, failure);
    },
    getHDUserInfo: function (userId, success, failure) {
        var _this = Services;
        var context = [_this.context.user, 'getHDUserInfo', _this.defaults.subdomainName, userId];
        CoreREST.get(_this, context, null, success, failure);
    },
    getHDUserProfile: function (userId, success, failure) {
        var _this = Services;
        var context = [_this.context.user, 'getHDUserProfile', _this.defaults.subdomainName, userId];
        CoreREST.get(_this, context, null, success, failure);
    },
    updateHDUserProfile: function (param, success, failure) {
        var _this = Services;
        var context = [_this.context.user, 'updateHDUserProfile', _this.defaults.subdomainName];
        CoreREST.post(_this, context, param, success, failure);
    },
    hdUpdateMood: function (companyId, userId, param, success, failure) {
        var _this = Services;
        var context = [_this.context.user, 'hdUpdateMood', _this.defaults.subdomainName, companyId, userId];
        CoreREST.post(_this, context, param, success, failure);
    },
    createOrUpdateUser: function (param, success, failure) {
        var _this = Services;
        var context = [_this.context.user, 'createOrUpdateUser', _this.defaults.subdomainName];
        CoreREST.post(_this, context, param, success, failure);
    },
    insertUserFeed: function (param, success, failure) {
        var _this = Services;
        var context = [_this.context.user, 'insertUserFeed', _this.defaults.subdomainName];
        CoreREST.post(_this, context, param, success, failure);
    },
    getDPUsers: function (firstName, userId, topicId, success, failure) {
        var _this = Services;
        var context = [_this.context.user, 'getDPUsers', _this.defaults.subdomainName, _this.defaults.companyId, firstName, userId, topicId];
        CoreREST.get(_this, context, null, success, failure);
    },

    // message section
    getUserFeeds: function (userId, feedId, success, failure) {
        var _this = Services;
        var context = [_this.context.message, 'getUserFeeds', _this.defaults.subdomainName, _this.defaults.companyId, userId, _this.defaults.utcOffset, feedId];
        CoreREST.get(_this, context, null, success, failure);
    },
    updateFeedLikes: function (feedMasterId, userId, isLiked, success, failure) {
        var _this = Services;
        var context = [_this.context.message, 'updateFeedLikes', _this.defaults.subdomainName, _this.defaults.companyId, feedMasterId, userId, isLiked];
        CoreREST.post(_this, context, null, success, failure);
    },
    getUserFeedAfterId: function (userId, feedId, success, failure) {
        var _this = Services;
        var context = [_this.context.message, 'getUserFeedAfterId', _this.defaults.subdomainName, _this.defaults.companyId, userId, _this.defaults.utcOffset, feedId];
        CoreREST.get(_this, context, null, success, failure);
    },
    getUserFeedsById: function (feedId, success, failure) {
        var _this = Services;
        var context = [_this.context.message, 'getUserFeedsById', _this.defaults.subdomainName, _this.defaults.companyId, _this.defaults.utcOffset, feedId];
        CoreREST.get(_this, context, null, success, failure);
    },
    getFeedByFeedMasterId: function (userId, feedMasterId, success, failure) {
        var _this = Services;
        var context = [_this.context.message, 'getFeedByFeedMasterId', _this.defaults.subdomainName, _this.defaults.companyId, _this.defaults.utcOffset, feedMasterId, userId];
        CoreREST.get(_this, context, null, success, failure);
    },
    getTopicByIdForStream: function (userId, topicId, success, failure) {
        var _this = Services;
        var context = [_this.context.topic, 'getTopicByIdForStream', _this.defaults.subdomainName, _this.defaults.companyId, userId, topicId];
        CoreREST.get(_this, context, null, success, failure);
    },
    getActivityStream: function (userId, feedId, success, failure) {
        var _this = Services;
        var context = [_this.context.message, 'getActivityStream', _this.defaults.subdomainName, _this.defaults.companyId, userId, _this.defaults.utcOffset, feedId];
        CoreREST.get(_this, context, null, success, failure);
    },
    getActivityStreamBeforeId: function (userId, feedId, success, failure) {
        var _this = Services;
        var context = [_this.context.message, 'getActivityStreamBeforeId', _this.defaults.subdomainName, _this.defaults.companyId, userId, _this.defaults.utcOffset, feedId];
        CoreREST.get(_this, context, null, success, failure);
    },
    getCompanyActivityStream: function (userId, feedId, success, failure) {
        var _this = Services;
        var context = [_this.context.message, 'getSocialNotification', _this.defaults.subdomainName, userId, _this.defaults.utcOffset, feedId];
        CoreREST.get(_this, context, null, success, failure);
    },
    getCompanyActivityStreamBeforeId: function (userId, feedId, success, failure) {
        var _this = Services;
        var context = [_this.context.message, 'getSocialNotificationBeforeId', _this.defaults.subdomainName, userId, _this.defaults.utcOffset, feedId];
        CoreREST.get(_this, context, null, success, failure);
    },
    sendMessage: function (userId, topicId, param, success, failure) {
        var _this = Services;
        var context = [_this.context.message, 'sendMessage', _this.defaults.subdomainName, _this.defaults.companyId, userId, topicId];
        CoreREST.post(_this, context, param, success, failure);
    },
    getMessage: function (userId, topicId, messageId, messageCount, success, failure) {
        var _this = Services;
        var context = [_this.context.message, 'getMessage', _this.defaults.subdomainName, _this.defaults.companyId, userId, topicId, messageId, _this.defaults.utcOffset, messageCount];
        CoreREST.get(_this, context, null, success, failure);
    },
    getMessageBeforeId: function (userId, topicId, messageId, messageCount, success, failure) {
        var _this = Services;
        var context = [_this.context.message, 'getMessageBeforeId', _this.defaults.subdomainName, _this.defaults.companyId, userId, topicId, messageId, _this.defaults.utcOffset, messageCount];
        CoreREST.get(_this, context, null, success, failure);
    },
    insertUserComment: function (param, success, failure) {
        var _this = Services;
        var context = [_this.context.message, 'insertUserComment', _this.defaults.subdomainName, _this.defaults.companyId];
        CoreREST.post(_this, context, param, success, failure);
    },
    getActionMsg: function (userId, success, failure) {
        var _this = Services;
        var context = [_this.context.message, 'getActionMsg', _this.defaults.subdomainName, _this.defaults.companyId, _this.defaults.utcOffset, userId];
        CoreREST.get(_this, context, null, success, failure);
    },
    markIsRead: function (userId, messageId, success, failure) {
        var _this = Services;
        var context = [_this.context.message, 'markIsRead', _this.defaults.subdomainName, _this.defaults.companyId, userId, messageId];
        CoreREST.post(_this, context, null, success, failure);
    },
    getUnReadMessagesCount: function (userId, success, failure) {
        var _this = Services;
        var context = [_this.context.message, 'getUnReadMessagesCount', _this.defaults.subdomainName, _this.defaults.companyId, userId];
        CoreREST.get(_this, context, null, success, failure);
    },
    updateIsRespond: function (params, success, failure) {
        var _this = Services;
        var context = [_this.context.message, 'updateIsRespond', _this.defaults.subdomainName];
        CoreREST.post(_this, context, params, success, failure);
    },
    updateMarkAllRead: function (userId, params, success, failure) {
        var _this = Services;
        var context = [_this.context.message, 'updateMarkAllRead', _this.defaults.subdomainName, userId];
        CoreREST.post(_this, context, params, success, failure);
    },
    getAlertTopic: function (userId, success, failure) {
        var _this = Services;
        var context = [_this.context.message, 'getAlertTopic', _this.defaults.subdomainName, _this.defaults.companyId, userId];
        CoreREST.get(_this, context, null, success, failure);
    },

    /*** Profile services ***/
    getUserDetails: function (userId, success, failure) {
        var _this = Services;
        var context = [_this.context.profile, 'getUserDetails', _this.defaults.subdomainName, userId];
        CoreREST.get(_this, context, null, success, failure);
    },
    getUserEducation: function (userId, success, failure) {
        var _this = Services;
        var context = [_this.context.profile, 'getUserEducation', _this.defaults.subdomainName, userId];
        CoreREST.get(_this, context, null, success, failure);
    },
    getUserHospitals: function (userId, success, failure) {
        var _this = Services;
        var context = [_this.context.profile, 'getUserHospitals', _this.defaults.subdomainName, userId];
        CoreREST.get(_this, context, null, success, failure);
    },
    getUserPublishedDetails: function (userId, success, failure) {
        var _this = Services;
        var context = [_this.context.profile, 'getUserPublishedDetails', _this.defaults.subdomainName, userId];
        CoreREST.get(_this, context, null, success, failure);
    },
    getUserAwards: function (userId, success, failure) {
        var _this = Services;
        var context = [_this.context.profile, 'getUserAwards', _this.defaults.subdomainName, userId];
        CoreREST.get(_this, context, null, success, failure);
    },
    getUserInterests: function (userId, success, failure) {
        var _this = Services;
        var context = [_this.context.profile, 'getUserInterests', _this.defaults.subdomainName, userId];
        CoreREST.get(_this, context, null, success, failure);
    },
    getUserMemberOfDetails: function (userId, success, failure) {
        var _this = Services;
        var context = [_this.context.profile, 'getUserMemberOfDetails', _this.defaults.subdomainName, userId];
        CoreREST.get(_this, context, null, success, failure);
    },
    getUserImportantDate: function (userId, success, failure) {
        var _this = Services;
        var context = [_this.context.profile, 'getUserImportantDate', _this.defaults.subdomainName, userId, _this.defaults.companyId];
        CoreREST.get(_this, context, null, success, failure);
    },
    getUserEducationDetails: function (userId, success, failure) {
        var _this = Services;
        var context = [_this.context.profile, 'getUserEducationDetails', _this.defaults.subdomainName, userId, _this.defaults.companyId];
        CoreREST.get(_this, context, null, success, failure);
    },
    getUserWorkDetails: function (userId, success, failure) {
        var _this = Services;
        var context = [_this.context.profile, 'getUserWorkDetails', _this.defaults.subdomainName, userId, _this.defaults.companyId];
        CoreREST.get(_this, context, null, success, failure);
    },
    getUserInterestDetails: function (userId, success, failure) {
        var _this = Services;
        var context = [_this.context.profile, 'getUserInterestDetails', _this.defaults.subdomainName, userId, _this.defaults.companyId];
        CoreREST.get(_this, context, null, success, failure);
    },
    getUserLifeEvent: function (userId, success, failure) {
        var _this = Services;
        var context = [_this.context.profile, 'getUserLifeEvent', _this.defaults.subdomainName, userId, _this.defaults.companyId];
        CoreREST.get(_this, context, null, success, failure);
    },
    checkKangleUserMenuAccess: function (userId, success, failure) {
        var _this = Services;
        var context = [_this.context.profile, 'CheckKangleUserMenuAccess', _this.defaults.subdomainName, _this.defaults.companyId, userId];
        CoreREST.get(_this, context, null, success, failure);
    },
    
    /** Delete Profile **/

    deleteUserEducation: function (userId, educationId, success, failure) {
        var _this = Services;
        var context = [_this.context.profile, 'deleteUserEducation', _this.defaults.subdomainName, userId, educationId];
        CoreREST.post(_this, context, null, success, failure);
    },
    deleteUserWork: function (userId, workId, success, failure) {
        var _this = Services;
        var context = [_this.context.profile, 'deleteUserWork', _this.defaults.subdomainName, userId, workId];
        CoreREST.post(_this, context, null, success, failure);
    },
    deleteUserInterest: function (userId, workId, success, failure) {
        var _this = Services;
        var context = [_this.context.profile, 'deleteUserInterest', _this.defaults.subdomainName, userId, workId];
        CoreREST.post(_this, context, null, success, failure);
    },
    deleteUserEvent: function (userId, workId, success, failure) {
        var _this = Services;
        var context = [_this.context.profile, 'deleteUserEvent', _this.defaults.subdomainName, userId, workId];
        CoreREST.post(_this, context, null, success, failure);
    },

    /** Edit Profile **/
    saveUserImportantDate: function (param, success, failure) {
        var _this = Services;
        var context = [_this.context.profile, 'saveUserImportantDate', _this.defaults.subdomainName, _this.defaults.userId, _this.defaults.companyId];
        CoreREST.postArray(_this, context, param, success, failure);
    },
    saveUserEducationDetails: function (param, success, failure) {
        var _this = Services;
        var context = [_this.context.profile, 'saveUserEducationDetails', _this.defaults.subdomainName, _this.defaults.userId, _this.defaults.companyId];
        CoreREST.postArray(_this, context, param, success, failure);
    },
    saveUserWorkDetails: function (param, success, failure) {
        var _this = Services;
        var context = [_this.context.profile, 'saveUserWorkDetails', _this.defaults.subdomainName, _this.defaults.userId, _this.defaults.companyId];
        CoreREST.postArray(_this, context, param, success, failure);
    },
    saveUserEventDetails: function (param, success, failure) {
        var _this = Services;
        var context = [_this.context.profile, 'saveUserEventDetails', _this.defaults.subdomainName, _this.defaults.userId, _this.defaults.companyId];
        CoreREST.postArray(_this, context, param, success, failure);
    },
    saveUserHospitals: function (param, success, failure) {
        var _this = Services;
        var context = [_this.context.profile, 'saveUserHospitals', _this.defaults.subdomainName, _this.defaults.userId];
        CoreREST.postArray(_this, context, param, success, failure);
    },
    saveUserMembersOfDetails: function (param, success, failure) {
        var _this = Services;
        var context = [_this.context.profile, 'saveUserMembersOfDetails', _this.defaults.subdomainName, _this.defaults.userId];
        CoreREST.postArray(_this, context, param, success, failure);
    },
    saveUserPublish: function (param, success, failure) {
        var _this = Services;
        var context = [_this.context.profile, 'saveUserPublish', _this.defaults.subdomainName, _this.defaults.userId];
        CoreREST.postArray(_this, context, param, success, failure);
    },
    saveUserAwards: function (param, success, failure) {
        var _this = Services;
        var context = [_this.context.profile, 'saveUserAwards', _this.defaults.subdomainName, _this.defaults.userId];
        CoreREST.postArray(_this, context, param, success, failure);
    },
    saveUserInterests: function (param, success, failure) {
        var _this = Services;
        var context = [_this.context.profile, 'saveUserInterests', _this.defaults.subdomainName, _this.defaults.userId, _this.defaults.companyId];
        CoreREST.postArray(_this, context, param, success, failure);
    },
    saveUserSpecialityDetails: function (param, success, failure) {
        var _this = Services;
        var context = [_this.context.profile, 'saveUserSpecialityDetails', _this.defaults.subdomainName, _this.defaults.userId];
        CoreREST.postArray(_this, context, param, success, failure);
    },
    updateProfileImage: function (param, success, failure) {
        var _this = Services;
        var context = [_this.context.profile, 'updateProfileImage', _this.defaults.subdomainName];
        CoreREST.post(_this, context, param, success, failure);
    },

    /* FileUpload Attachment */
    attachFile: function (formId, beforeSubmit, success, failure) {
        var _this = Services;
        var context = ['Attachment', 'FileUpload'];
        CoreREST.attachFile(_this, context, formId, beforeSubmit, success, failure);
    },
    cropFile: function (formId, beforeSubmit, success, failure) {
        var _this = Services;
        var context = ['Attachment', 'CropImage'];
        CoreREST.attachFile(_this, context, formId, beforeSubmit, success, failure);
    },


    /* Hospital API */
    getAllHospitalNews: function (newsId, success, failure) {
        var _this = Services;
        var context = ['HospitalApi', 'getAllHospitalNews', _this.defaults.subdomainName, _this.defaults.companyId, _this.defaults.utcOffset, newsId];
        CoreREST.get(_this, context, null, success, failure);
    },
    getHospitalEventDetails: function (success, failure) {
        var _this = Services;
        var context = ['HospitalApi', 'getHospitalEventDetails', _this.defaults.subdomainName, _this.defaults.companyId, _this.defaults.utcOffset];
        CoreREST.get(_this, context, null, success, failure);
    },
    getHospitalAwardDetails: function (success, failure) {
        var _this = Services;
        var context = ['HospitalApi', 'getHospitalAwardDetails', _this.defaults.subdomainName, _this.defaults.companyId];
        CoreREST.get(_this, context, null, success, failure);
    },

    //Autocomplete services
    getAllEducation: function (success, failure) {
        var _this = Services;
        var context = [_this.context.profile, 'getAllEducation', _this.defaults.subdomainName];
        CoreREST.get(_this, context, null, success, failure);
    },
    getAllWorkName: function (success, failure) {
        var _this = Services;
        var context = [_this.context.profile, 'GetAllWorkName', _this.defaults.subdomainName];
        CoreREST.get(_this, context, null, success, failure);
    },
    getAllEvents: function (success, failure) {
        var _this = Services;
        var context = [_this.context.profile, 'getAllEvent', _this.defaults.subdomainName];
        CoreREST.get(_this, context, null, success, failure);
    },
    getAllHospital: function (success, failure) {
        var _this = Services;
        var context = [_this.context.profile, 'getAllHospital', _this.defaults.subdomainName];
        CoreREST.get(_this, context, null, success, failure);
    },
    getAllAwards: function (success, failure) {
        var _this = Services;
        var context = [_this.context.profile, 'getAllAwards', _this.defaults.subdomainName];
        CoreREST.get(_this, context, null, success, failure);
    },
    getAllInterests: function (success, failure) {
        var _this = Services;
        var context = [_this.context.profile, 'getAllInterests', _this.defaults.subdomainName];
        CoreREST.get(_this, context, null, success, failure);
    },
    getAllMembers: function (success, failure) {
        var _this = Services;
        var context = [_this.context.profile, 'getAllMembers', _this.defaults.subdomainName];
        CoreREST.get(_this, context, null, success, failure);
    },
    getAllPublishTitle: function (success, failure) {
        var _this = Services;
        var context = [_this.context.profile, 'getAllPublishTitle', _this.defaults.subdomainName];
        CoreREST.get(_this, context, null, success, failure);
    },
    getUserSpecialityDetails: function (userId, success, failure) {
        var _this = Services;
        var context = [_this.context.profile, 'getUserSpecialityDetails', _this.defaults.subdomainName, userId];
        CoreREST.get(_this, context, null, success, failure);
    },
    getAllSpeciality: function (success, failure) {
        var _this = Services;
        var context = [_this.context.profile, 'getAllSpeciality', _this.defaults.subdomainName];
        CoreREST.get(_this, context, null, success, failure);
    },

    //Company Service js
    getUserCompanies: function (userId, type, success, failure) {
        var _this = Services;
        var context = [_this.context.profile, 'getUserCompanies', _this.defaults.subdomainName, userId, type];
        CoreREST.get(_this, context, null, success, failure);
    },
    activateUserPin: function (userId, pinNumber, success, failure) {
        var _this = Services;
        var context = [_this.context.profile, 'activateUserPin', _this.defaults.subdomainName, pinNumber, userId];
        CoreREST.post(_this, context, null, success, failure);
    },
    //user tracking
    insertUserTracker: function(data, success, failure) {
        var _this = Services;
        var context = [_this.context.profile, 'insertUserTracker', _this.defaults.subdomainName];
        CoreREST.postArray(_this, context, data, success, failure);
    },
    //share
    getKADocumentTypeMaster: function (success, failure) {
        var _this = Services;
        var context = [_this.context.message, 'getKADocumentTypeMaster', this.defaults.subdomainName, this.defaults.companyId];
        CoreREST.get(_this, context, null, success, failure);
    },
    getSharedFiles: function(topicId, success, failure) {
        var _this = Services;
        var context = [_this.context.message, 'GetSharedFiles', this.defaults.subdomainName, this.defaults.companyId,
            topicId, _this.defaults.utcOffset];
        CoreREST.get(_this, context, null, success, failure);
    },
    /*configuration company*/
//getCompanyConfiguration: function(success, failure) {
//  var _this = Services;
//  var context = [_this.context.profile, 'GetCompanyConfiguration', _this.defaults.subdomainName, _this.defaults.companyId];
//  CoreREST.get(_this, context, null, success, failure);
//},
    getLandingPageAccess: function(userId, success, failure){
    	var _this = Services;
        var context = [_this.context.profile, 'GetLandingPageAccess', _this.defaults.subdomainName, _this.defaults.companyId, userId];
        CoreREST.get(_this, context, null, success, failure);
    },
    /*configuration company*/
    /* ChangePassword  */
    appUpdatePassword: function(data, success, failure) {
        var _this = Services;
        var context = [_this.context.profile, 'appUpdatePassword', _this.defaults.subdomainName, _this.defaults.companyId];
        console.log(context);
        CoreREST.postArray(_this, context, data, success, failure);
    },
    /* ChangePassword  */
    
    /*Discussion forum service*/
    getUnReadAssetDiscussionCount: function (userId, success, failure) {
        var _this = Services;
        var context = [_this.context.notificationHub, 'getUnReadAssetDiscussionCount', this.defaults.subdomainName, this.defaults.companyId, userId];
        CoreREST.get(_this, context, null, success, failure);
    },
    getUnReadAssetDiscussionDetails: function (userId, success, failure) {
        var _this = Services;
        var context = [_this.context.notificationHub, 'getUnReadAssetDiscussionDetails', this.defaults.subdomainName, this.defaults.companyId, userId];
        CoreREST.get(_this, context, null, success, failure);
    },
    updateIsHubReadForAssetDiscussion: function (userId, daCode, success, failure) {
        var _this = Services;
        var context = [_this.context.notificationHub, 'updateIsHubReadForAssetDiscussion', this.defaults.subdomainName, this.defaults.companyId, userId, daCode];
        CoreREST.post(_this, context, null, success, failure);
    },
    /*Discussion forum service*/
    /*userwise Chat access*/
    checkChatAccess: function (userId, success, failure) {
        var _this = Services;
        var context = [_this.context.profile, 'CheckChatAccess', _this.defaults.subdomainName, userId, _this.defaults.companyId];
        CoreREST.get(_this, context, null, success, failure);
    },
    /*userwise Chat access*/
    
    /*share booksherlf screen services*/
    getTopEmailIds: function (success, failure) {
        var _this = Services;
        var context = [_this.context.customerapi, 'GetTopEmailIds', _this.defaults.subdomainName, _this.defaults.companyId, _this.defaults.userId];
        CoreREST.get(_this, context, null, success, failure);
    },
    getCustomerSpecialityByCompany: function (success, failure) {
        var _this = Services;
        var context = [_this.context.customerapi, 'GetCustomerSpecialityByCompany', _this.defaults.subdomainName, _this.defaults.companyId];
        CoreREST.get(_this, context, null, success, failure);
    },
    
    //new Category change
    getCustomerEntity: function (success, failure) {
        var _this = Services;
        var context = [_this.context.customerapi, 'GetCustomerEntity', _this.defaults.subdomainName, _this.defaults.companyId];
        CoreREST.get(_this, context, null, success, failure);
    },
    //new Category change
    //share for template
    getTemplateList: function (success, failure) {
        var _this = Services;
        var context = [_this.context.customerentityapi, 'GetTemplateList', _this.defaults.subdomainName, _this.defaults.companyId];
        CoreREST.get(_this, context, null, success, failure);
    },
    //share for template
    //global email access
    checkGlobalEmailAccess: function (success, failure) {
        var _this = Services;
        var context = [_this.context.customerapi, 'CheckGlobalEmailAccess', _this.defaults.subdomainName, _this.defaults.companyId, _this.defaults.userId];
        CoreREST.get(_this, context, null, success, failure);
    },
    //global email access
    //customer list get insert update
    getMyCustomerList: function (success, failure) {
        var _this = Services;
        var context = [_this.context.customerapi, 'GetMyCustomerList', _this.defaults.subdomainName, _this.defaults.companyId, _this.defaults.userId];
        CoreREST.get(_this, context, null, success, failure);
    },
    getExcludeMyCustomerList: function (success, failure) {
        var _this = Services;
        var context = [_this.context.customerapi, 'GetExcludeMyCustomerList', _this.defaults.subdomainName, _this.defaults.companyId, _this.defaults.userId];
        CoreREST.get(_this, context, null, success, failure);
    },
    //forv391
    insertCustomerMaster: function (data, success, failure) {
        var _this = Services;
        var context = [_this.context.customerapi, 'InsertCustomerMasterForV391', _this.defaults.subdomainName, _this.defaults.companyId];
        CoreREST.postArray(_this, context, data, success, failure);
    },
    //forv391
    getCustomerLocations: function(data, success, failure){
        var _this = Services;
        var context = [_this.context.customerapi, 'GetCustomerLocations', _this.defaults.subdomainName, _this.defaults.companyId];

        CoreREST.postRawText(_this, context, data, success, failure);

    },
    //forv391
    updateCustomerProfileInfo: function(data, success, failure){
        var _this = Services;
        var context = [_this.context.customerapi, 'UpdateCustomerProfileInfoForV391', _this.defaults.subdomainName];
        CoreREST.postArray(_this, context, data, success, failure);
    },
    //forv391
    //customer list get insert update
    insertCustomerAssetSharing: function (isAutosave, data, success, failure) {
        var _this = Services;
        var context = [_this.context.customerapi, 'InsertCustomerAssetSharing', _this.defaults.subdomainName, _this.defaults.companyId, isAutosave];
        CoreREST.postArray(_this, context, data, success, failure);
    },
    getCustomerKangleModuleAccess: function (success, failure) {
        var _this = Services;
        var context =[_this.context.customerapi , 'GetCustomerKangleModuleAccess' ,_this.defaults.subdomainName, _this.defaults.companyId, _this.defaults.userId ,"CUSTOMER"];
        CoreREST.get(_this, context, null, success, failure);
    },
    /*service for speciality hiding nonpharma*/
    getCustDomain: function(success, failure){
    	var _this = Services;
        var context =[_this.context.customerapi , 'GetCustDomain' ,_this.defaults.subdomainName, _this.defaults.companyId];
        CoreREST.get(_this, context, null, success, failure);
    },
    /* CheckCurrentBuildVersion */
    CheckCurrentBuildVersion:function(version_no,OsType,success,failure){
        var _this = Services;
        //var context =[_this.context.profile , 'CheckCurrentBuildVersion' , _this.defaults.subdomainName, version_no];
        var context =[_this.context.profile , 'CheckCurrentBuildVersion' , _this.defaults.subdomainName, version_no, OsType];
        CoreREST.get(_this, context, null, success, failure);
    },
    /* CheckCurrentBuildVersion */
};

/*
 * Date Format 1.2.3
 * (c) 2007-2009 Steven Levithan <stevenlevithan.com>
 * MIT license
 *
 * Includes enhancements by Scott Trenda <scott.trenda.net>
 * and Kris Kowal <cixar.com/~kris.kowal/>
 *
 * Accepts a date, a mask, or a date and a mask.
 * Returns a formatted version of the given date.
 * The date defaults to the current date/time.
 * The mask defaults to dateFormat.masks.default.
 */

var dateFormat = function () {
    var token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
        timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
        timezoneClip = /[^-+\dA-Z]/g,
        pad = function (val, len) {
            val = String(val);
            len = len || 2;
            while (val.length < len) val = "0" + val;
            return val;
        };

    // Regexes and supporting functions are cached through closure
    return function (date, mask, utc) {
        var dF = dateFormat;

        // You can't provide utc if you skip other args (use the "UTC:" mask prefix)
        if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
            mask = date;
            date = undefined;
        }

        // Passing date through Date applies Date.parse, if necessary
        date = date ? new Date(date) : new Date;
        if (isNaN(date)) throw SyntaxError("invalid date");

        mask = String(dF.masks[mask] || mask || dF.masks["default"]);

        // Allow setting the utc argument via the mask
        if (mask.slice(0, 4) == "UTC:") {
            mask = mask.slice(4);
            utc = true;
        }

        var _ = utc ? "getUTC" : "get",
            d = date[_ + "Date"](),
            D = date[_ + "Day"](),
            m = date[_ + "Month"](),
            y = date[_ + "FullYear"](),
            H = date[_ + "Hours"](),
            M = date[_ + "Minutes"](),
            s = date[_ + "Seconds"](),
            L = date[_ + "Milliseconds"](),
            o = utc ? 0 : date.getTimezoneOffset(),
            flags = {
                d: d,
                dd: pad(d),
                ddd: dF.i18n.dayNames[D],
                dddd: dF.i18n.dayNames[D + 7],
                m: m + 1,
                mm: pad(m + 1),
                mmm: dF.i18n.monthNames[m],
                mmmm: dF.i18n.monthNames[m + 12],
                yy: String(y).slice(2),
                yyyy: y,
                h: H % 12 || 12,
                hh: pad(H % 12 || 12),
                H: H,
                HH: pad(H),
                M: M,
                MM: pad(M),
                s: s,
                ss: pad(s),
                l: pad(L, 3),
                L: pad(L > 99 ? Math.round(L / 10) : L),
                t: H < 12 ? "a" : "p",
                tt: H < 12 ? "am" : "pm",
                T: H < 12 ? "A" : "P",
                TT: H < 12 ? "AM" : "PM",
                Z: utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
                o: (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
                S: ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
            };

        return mask.replace(token, function ($0) {
            return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
        });
    };
}();

// Some common format strings
dateFormat.masks = {
    "default": "ddd mmm dd yyyy HH:MM:ss",
    shortDate: "m/d/yy",
    mediumDate: "mmm d, yyyy",
    longDate: "mmmm d, yyyy",
    fullDate: "dddd, mmmm d, yyyy",
    shortTime: "h:MM TT",
    mediumTime: "h:MM:ss TT",
    longTime: "h:MM:ss TT Z",
    isoDate: "yyyy-mm-dd",
    isoTime: "HH:MM:ss",
    isoDateTime: "yyyy-mm-dd'T'HH:MM:ss",
    isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
};

// Internationalization strings
dateFormat.i18n = {
    dayNames: [
        "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
        "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ],
    monthNames: [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
        "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
    ]
};

// For convenience...
Date.prototype.format = function (mask, utc) {
    return dateFormat(this, mask, utc);
};