/// <reference path="CourseReport.js" />
var resultHeader = {
    defaults: { userId: '', courseId: '', publishId: ''},
    init: function(appTesting) {
		//course_test.getQuestionAndAnswers();
		var url = window.location.href;
		url = url.substr(url.lastIndexOf('?')+1, url.length-1);
		url = url.split('&');
		
		var courseId = url[0],
			publishId = url[1];
		courseId = parseInt(courseId.replace('cid=', ''));
		publishId = parseInt(publishId.replace('pid=', ''));
		/*Code in course_service for companylogo*/
		setCompanyLogo();
		/*Code in course_service for companylogo*/
		resultHeader.defaults.userId = window.localStorage.getItem('userId');
		resultHeader.defaults.courseId = courseId;
		resultHeader.defaults.publishId = publishId;
		
		resultHeader.getResultHeader();
    },
    getResultHeader: function () {
        var adAry = new Array();

        var publishparam = {};
        publishparam.name = 'publishId';
        publishparam.value = resultHeader.defaults.publishId;
        adAry.push(publishparam);

        var courseparam = {};
        courseparam.name = 'courseId';
        courseparam.value = resultHeader.defaults.courseId;
        adAry.push(courseparam);

        var dateParam = {};
        dateParam.name = 'offsetValue';
        dateParam.value = commonValues.getUTCOffset();
        adAry.push(dateParam);

        //DPAjax.requestInvoke('Course', 'GetUserResultHeader', adAry, 'GET', this.onGotResultHeader, this.onFail);
        app.showLoading();
        course_services.getUserResultHeader(resultHeader.defaults.userId, resultHeader.defaults.publishId, 
        		resultHeader.defaults.courseId, this.onGotResultHeader, function(){
        	app.hideLoading();
        	alert('error');
        });
    },

    onGotResultHeader: function (data) {
    	app.hideLoading();
        var panelDiv = $('#dvViewHeader');
        var panelHead = $('#dvCourseName');
        var panelName = $('#dvReportUserName');
        var table = $('<div class="table">');
        var tHead = $('<div class="row row-hdr">');
        tHead.append('<div class="col">SNo</div>');
        tHead.append('<div class="col">Exam Date and Time</div>');
        tHead.append('<div class="col" class="td-align-center">Result</div>');
//        tHead.append('<div class="col" class="td-align-center">View Result</div>');
        table.append(tHead);

        if (data != null && data.length > 0) {
            for (var i = 0; i <= data.length - 1; i++) {
                var rowElem = data[i];
                var tBody = $('<div class="row">');
                tBody.append('<div class="col">' + (i + 1) + '</div>');
                tBody.append('<div class="col">' + rowElem.Assessment_Start_DateTime + '</div>');
                tBody.append('<div class="col" class="td-align-center"><label>' + rowElem.Is_Qualified + '</label></div>');
                if (rowElem.Is_Qualified == 'Pass')
                    tBody.find('label').addClass('answer-correct');
                else
                    tBody.find('label').addClass('answer-wrong');
                table.append(tBody);
                table.append('<div class="row row-action"><a href="Result_Page.html?aid=' + rowElem.Assessment_ID + '&pid=' + rowElem.Publish_ID + '" class="a-btn">View</a></div>');
                if (i == 0) {
                    panelHead.html(rowElem.Category_Name + ' > ' + rowElem.Course_Name);
                    //panelName.html(rowElem.User_Name);
                    panelName.html(Services.defaults.displayName + ' (' + rowElem.User_Name + ')');
                }
            }
        } else {
            table.append('<div class="row"><div class="col" class="empty" >No Records found</div></div>');
        }
        table.append('<div class="row row-empty"><div class="col empty"><a href="course_home.html" class="a-btn go-home" style="border: none;" value="Done">Done</a></div></div>');
        panelDiv.html(table);
    },

    onFail: function (e) {

    },
//    getCourseCentification: function () {
//        var adAry = new Array();
//        var pubParam = {};
//        pubParam.name = 'publishId';
//        pubParam.value = publishID_g;
//        var assParam = {};
//        assParam.name = 'assementId';
//        assParam.value = assetID_g;
//        var dateParam = {};
//        dateParam.name = 'offsetValue';
//        dateParam.value = commonValues.getUTCOffset();
//
//        adAry.push(pubParam);
//        adAry.push(assParam);
//        adAry.push(dateParam);
//        DPAjax.requestInvoke('Course', 'GetCourseCertificate', adAry, 'GET', this.onGotCertificate, this.onFail);
//    },
//    onGotCertificate: function (result) {
//        $("#dvcertificate").html(result);
//        //$('.certificate-container').prepend('<div class="stamp stamp-pass"><img src="/Images/Certified.png" style="width: 200px;"></div>');
//    },
//
//    getCourseReportHeader: function () {
//        debugger;
//        var IsExcelExport = 0
//        var userCourseStatus = "";
//        var courseStatus = "";
//        if ($("input:checkbox[name=export]:checked").length > 0) {
//            IsExcelExport = 1;
//        }
//
//        if ($("input:checkbox[name=all]:checked").length > 0) {
//            userCourseStatus = $("input:checkbox[name=all]:checked").val();
//        }
//        else {
//            $('input:checkbox[name=CompStatus]').each(function () {
//                if ($(this).is(':checked')) {
//                    userCourseStatus += $(this).val() + ",";
//                }
//            });
//        }
//
//        if ($("input:checkbox[name=Courall]:checked").length > 0) {
//            courseStatus = $("input:checkbox[name=Courall]:checked").val();
//        }
//        else {
//            $('input:checkbox[name=course]').each(function () {
//                if ($(this).is(':checked')) {
//                    courseStatus += $(this).val() + ",";
//                }
//            });
//        }
//
//        if ($("#hdnUserCode").val() == "") {
//            fnMsgAlert('Info', 'Course Report', 'Select user atleast one user');
//            return false;
//        }
//
//        if (userCourseStatus == "") {
//            fnMsgAlert('Info', 'Course Report', 'Select course status');
//            return false;
//        }
//
//        if (courseStatus == "") {
//            fnMsgAlert('Info', 'Course Report', 'Select user course status');
//            return false;
//        }
//
//
//        var adAry = new Array();
//        var pubParam = {};
//        pubParam.name = 'UsercourseStatus';
//        pubParam.value = userCourseStatus;
//        var coursstatParam = {};
//        coursstatParam.name = 'courseStatus';
//        coursstatParam.value = courseStatus;
//        var exportParam = {};
//        exportParam.name = 'execlExport';
//        exportParam.value = IsExcelExport;
//        var userParam = {};
//        userParam.name = 'userCodes';
//        userParam.value = $("#hdnUserCode").val();
//        var dateParam = {};
//        dateParam.name = 'offsetValue';
//        dateParam.value = commonValues.getUTCOffset();
//
//        adAry.push(pubParam);
//        adAry.push(coursstatParam);
//        adAry.push(exportParam);
//        adAry.push(userParam);
//        adAry.push(dateParam);
//        DPAjax.requestInvoke('CourseReport', 'getCourseHeaderDetatils', adAry, 'GET', this.onBindReportHeader, this.onFail);
//    },
//    onBindReportHeader: function (result) {
//        $("#divReport").html(result);
//       $('#tblCourseReportHeaderReport').oneSimpleTablePagination({});
//    },
//    fnCourseReportDetails: function (courseId, publishId, userId, userCode) {
//      
//        var adAry = new Array();
//        var courseParam = {};
//        courseParam.name = 'courseID';
//        courseParam.value = courseId;
//        var publishParam = {};
//        publishParam.name = 'publishID';
//        publishParam.value = publishId;
//        var userParam = {};
//        userParam.name = 'userCode';
//        userParam.value = userCode;
//        var userIdParam = {};
//        userIdParam.name = 'userId';
//        userIdParam.value = userId;
//        var dateParam = {};
//        dateParam.name = 'offsetValue';
//        dateParam.value = commonValues.getUTCOffset();
//
//     
//        adAry.push(courseParam);
//        adAry.push(publishParam);
//        adAry.push(userParam);
//        adAry.push(userIdParam);
//        adAry.push(dateParam);
//        DPAjax.requestInvoke('CourseReport', 'getCourseReportDetails', adAry, 'GET', this.onBindReportDetails, this.onFail);
//    },
//    onBindReportDetails: function (result) {
//        $("#modalBodyContainer").html(result);      
//        $('#myModal').modal('show')
//    },
}