function setCompanyLogo() {
	var companyLogoUrl = window.localStorage.getItem("companyLogoUrl");
    if(companyLogoUrl === undefined || companyLogoUrl === '' || companyLogoUrl === null)
    	companyLogoUrl = '';
    $('header .logo a').css({'background-image': 'url(' + companyLogoUrl + ')',
    		'background-position':'0% 50%',
    		'background-repeat':'no-repeat',
    		'background-size':'100%'});
}
setCompanyLogo();
var course_services = {
    context: {
        course: 'CourseApi'
    },
    getKWUserInfo: function (userId, success, failure) {
        var _this = Services;
        var context = [_this.context.user, 'getKWUserInfo', _this.defaults.subdomainName, userId, window.localStorage.getItem('companyId')];
        CoreREST.get(_this, context, null, success, failure);
    },
    getUserCourseDetails: function(userId, success, failure) {
    	var _this = Services;
        var context = [_this.context.course, 'getUserCourseDetails', _this.defaults.subdomainName, _this.defaults.companyId, userId, 
               _this.defaults.utcOffset];
        CoreREST.get(_this, context, null, success, failure);
    },
    getAssetsByCourseId: function(courseId, inputObj, success, failure) {
    	var _this = Services;
        var context = [_this.context.course, 'getAssetsByCourseId', _this.defaults.subdomainName, _this.defaults.companyId, courseId];
        CoreREST.get(_this, context, inputObj, success, failure);
    },
    insertCourseViewAnalytics: function(inputObj, success, failure) {
    	var _this = Services;
        var context = [_this.context.course, 'insertCourseViewAnalytics', _this.defaults.subdomainName];
        CoreREST.post(_this, context, inputObj, success, failure);
    },
    getQuestionAnswerDetails: function(userId, courseId, pagenum, pageSize,isallrecords, contentId, publishId, success, failure){
    	var _this = Services;
        var context = [_this.context.course, 'getQuestionAnswerDetails', _this.defaults.subdomainName, _this.defaults.companyId,
               userId, courseId, pagenum, pageSize,isallrecords, contentId, publishId];
        CoreREST.get(_this, context, null, success, failure);
    },
    insertCourseResponse: function(userId, inputObj, success, failure){
    	var _this = Services;
        var context = [_this.context.course, 'insertCourseResponse', _this.defaults.subdomainName, _this.defaults.companyId, userId];
        CoreREST.post(_this, context, inputObj, success, failure);
    },
    getCourseResultPage: function(userId, publishId, assementId, success, failure) {
    	var _this = Services;
    	var context = [_this.context.course, 'getCourseResultPage', _this.defaults.subdomainName, _this.defaults.companyId,
    	               userId, publishId, assementId, _this.defaults.utcOffset];
    	CoreREST.get(_this, context, null, success, failure);
    },
    getUserResultHeader: function(userId, publishId, courseId, success, failure) {
    	var _this = Services;
    	var context = [_this.context.course, 'getUserResultHeader', _this.defaults.subdomainName, _this.defaults.companyId,
    	               userId, publishId, courseId, _this.defaults.utcOffset];
    	CoreREST.get(_this, context, null, success, failure);
    }
};
$.extend(true, Services, course_services);