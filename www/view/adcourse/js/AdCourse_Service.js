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
//Services.context.user = 'User';
//Services.context.adCourse = 'WebApi';
//Services.context.adCourseApi = 'AdCourseApi';

var AdCourse_services = {
    context: {
        user: 'User',
        adCourse: 'WebApi',
        adCourseApi:  'AdCourseApi'
    },
    getAvailableAdCourses: function (companyId, userId, success, failure) {
        var _this = Services;
        var context = [_this.context.adCourse, 'GetAvailableCourses', _this.defaults.subdomainName, companyId, userId, _this.defaults.utcOffset];
        CoreREST.get(_this, context, null, success, failure);
    },
    getAdCourseSections: function (companyId, userId, courseId, publishId, success, failure) {
        var _this = Services;
        var context = [_this.context.adCourse, 'GetSectionDetailsOfCourse', _this.defaults.subdomainName, companyId, userId, courseId, publishId];
        CoreREST.get(_this, context, null, success, failure);
    },
    getQuestionAnswerDetails: function (companyId, userId, courseId, sectionId, publishId, success, failure) {
        var _this = Services;
        var context = [_this.context.adCourseApi, 'getAdQuestionAnswerDetails', _this.defaults.subdomainName, companyId, userId, courseId, sectionId, publishId];
        CoreREST.get(_this, context, null, success, failure);
    },
    // for admin module
    getAdCourseQuestionAnswerDetails: function (companyId, userId, courseId, sectionId, publishId, success, failure) {
        var _this = Services;
        var context = [_this.context.adCourseApi, 'getAdCourseQuestionAnswerDetails', _this.defaults.subdomainName, companyId, userId, courseId, sectionId, publishId];
        CoreREST.get(_this, context, null, success, failure);
    },
    insertCourseResponse: function (answerObj, companyId, userId, success, failure) {
        var _this = Services;
        var context = [_this.context.adCourseApi, 'insertAdCourseResponse', _this.defaults.subdomainName, companyId, userId];
        CoreREST.postArray(_this, context, answerObj, success, failure);
    },
    insertAdCourseSectionUserExamHeader: function (courseId, courseUserAssignMentId, couseUserSectionId, publishId,
        userId, companyId, sectionId, success, failure) {
        var _this = Services;
        var context = [_this.context.adCourseApi, 'insertAdCourseSectionUserExamHeader', _this.defaults.subdomainName, courseId, 
            courseUserAssignMentId, couseUserSectionId, publishId, userId, companyId, sectionId];
        CoreREST.post(_this, context, null, success, failure);
    },
    insertCourseUserExam: function (examObj, success, failure) {
        var _this = Services;
        var context = [_this.context.adCourseApi, 'insertCourseUserExam', _this.defaults.subdomainName];
        CoreREST.post(_this, context, examObj, success, failure);
    },
    getAdSectionQuestionDetails: function (examId, success, failure) {
        var _this = Services;
        var context = [_this.context.adCourseApi, 'getAdSectionQuestionDetails', _this.defaults.subdomainName, examId, _this.defaults.utcOffset, _this.defaults.companyId];
        CoreREST.get(_this, context, null, success, failure);
    },
    getAdSectionReportHeader: function(courseId, userId, publishId, success, failure) {
        var _this = Services;
        var context = [_this.context.adCourseApi, 'getAdSectionReportHeader', _this.defaults.subdomainName, courseId, userId, publishId];
        CoreREST.get(_this, context, null, success, failure);
    },
    getAdSectionAttemptDetails: function (courseId, sectionId, userId, publishId, success, failure) {
        var _this = Services;
        var context = [_this.context.adCourseApi, 'getAdSectionAttemptDetails', _this.defaults.subdomainName, _this.defaults.companyId, courseId, userId, publishId, sectionId, _this.defaults.utcOffset];
        CoreREST.get(_this, context, null, success, failure);
    },
    getAdAssetsByCourseId: function (companyId, courseId, sectionId, success, failure) {
        var _this = Services;
        var context = [_this.context.adCourse, 'GetAdAssetsByCourseId', _this.defaults.subdomainName, companyId, courseId, sectionId];
        CoreREST.get(_this, context, null, success, failure);
    },
    insertAdCourseViewAnalytics: function (data, success, failure) {
        var _this = Services;
        var context = [_this.context.adCourse, 'InsertAdCourseViewAnalytics', _this.defaults.subdomainName];
        CoreREST.post(_this, context, data, success, failure);
    },
    getAdCourseCertificate: function (companyId, courseUserAssignmentId, success, failure) {
        var _this = Services;
        var context = [_this.context.adCourse, 'GetAdCourseCertificate', _this.defaults.subdomainName, companyId, courseUserAssignmentId, _this.defaults.utcOffset];
        CoreREST.get(_this, context, null, success, failure);
    }
};
$.extend(true, Services, AdCourse_services);