var resultPage = {
	defaults: { userId: '', courseId: '', publishId: ''},
    init: function(appTesting) {
		//course_test.getQuestionAndAnswers();
    	app.hideLoading();
		var url = window.location.href;
		url = url.substr(url.lastIndexOf('?')+1, url.length-1);
		url = url.split('&');
		
		var courseId = url[0],
			publishId = url[1];
		courseId = parseInt(courseId.replace('aid=', ''));
		publishId = parseInt(publishId.replace('pid=', ''));
		/*Code in course_service for companylogo*/
		setCompanyLogo();
		/*Code in course_service for companylogo*/
		resultPage.defaults.userId = window.localStorage.getItem('userId');
		resultPage.defaults.courseId = courseId;
		resultPage.defaults.publishId = publishId;
		
		resultPage.getResultDetails();
	},
    getResultDetails: function () {
        var adAry = new Array();

        var pubParam = {};
        pubParam.name = 'publishId';
        pubParam.value = resultPage.defaults.publishId;
        var assParam = {};
        assParam.name = 'assementId';
        assParam.value = resultPage.defaults.courseId;
        var dateParam = {};
        dateParam.name = 'offsetValue';
        dateParam.value = commonValues.getUTCOffset(); 

        adAry.push(pubParam);
        adAry.push(assParam);
        adAry.push(dateParam);
        
        app.showLoading();
        course_services.getCourseResultPage(resultPage.defaults.userId, resultPage.defaults.publishId, resultPage.defaults.courseId, 
        		resultPage.onGotResultDetail,function(e){  app.hideLoading(); });
        //DPAjax.requestInvoke('Course', 'GetCourseResultPage', adAry, 'GET', this.onGotResultDetail, this.onFail);
    },

    onGotResultDetail: function (data) {
    	app.hideLoading();
        var panelHead = $('#dvCourseName');
        var panelExamDate = $('#dvExamDate');
        var panelName = $('#dvReportUserName');

        $('#dvCourseDetails').show();
        var headerContent = null;
        var questionDetails = null;
        if (data != null && data.length > 0) {
            if (data[0].lstHeader != null && data[0].lstHeader.length > 0)
                headerContent = data[0].lstHeader[0];
            questionDetails = data[0].lstDetails;
        }
        
        var totalNoAttempts = 0;
        var isPass = false;
        if (headerContent != null) {
            $('#printCertificate').hide();
            if (headerContent.Is_Qualified == 'Pass')
                isPass = true;
            panelHead.html(headerContent.Category_Name + ' > ' + headerContent.Course_Name);
            //panelName.html(headerContent.User_Name);
            panelName.html(Services.defaults.displayName + ' (' + headerContent.User_Name + ')');
            panelExamDate.html(headerContent.Assessment_Start_DateTime);

            $('#pScore').html(': ' + headerContent.Achieved_Percentage + '%');
            $('#pNoQuestions').html(': ' + headerContent.No_Of_Questions);
            $('#pNoQuestionsAttended').html(': ' + (questionDetails!=null?questionDetails.length:0));
            $('#pResult').html(': ' + headerContent.Is_Qualified);
            totalNoAttempts = headerContent.No_of_Attempts - headerContent.Attempt_Number;
            if(totalNoAttempts > 0)
                $('#pInfo').html('<b>Information: </b>You have ' + totalNoAttempts + ' more attempt(s) to clear this course.' + (headerContent.Is_Qualified != 'Pass'?' Please try again.':''));
            else
                $('#pInfo').html('<b>Information: </b>You don\'t have any more attempt(s) to this course.');

            if (isPass) {
                $('#printCertificate').show();
                $('#printCertificate').bind('click', function (e) {
                    window.location.href = '/Course/CourseCertificate/?aid=' + assetID_g + '&pid=' + publishID_g;
                });
            }
        }

        var panelDiv = $('#dvViewHeader');
        var table = $('<div class="table"></div>');
        var tHead = $('<div class="row row-hdr"></div>');
        tHead.append('<div class="col">SNo</div>');
        tHead.append('<div class="col">Questions</div>');
        tHead.append('<div class="col" class="td-align-center">Result</div>');
        table.append(tHead);

        var correctAnswers = 0;
        if (questionDetails != null) {
            if (questionDetails.length > 0) {
                for (var i = 0; i <= questionDetails.length - 1; i++) {
                    var rowElem = questionDetails[i];
                    var tBody = $('<div class="row"></div>');
                    tBody.append('<div class="col">' + (i + 1) + '</div>');
                    tBody.append('<div class="col">' + rowElem.Question_Text + '</div>');
                    tBody.append('<div class="col" class="td-align-center"><label>' + rowElem.User_Answered_Correct + '</label></div>');
                    if (rowElem.User_Answered_Correct == 'Correct') {
                        correctAnswers++;
                        tBody.find('label').addClass('answer-correct');
                    } else {
                        tBody.find('label').addClass('answer-wrong');
                    }
                    table.append(tBody);
                }
            } else {
                table.append('<div class="row"><div class="col" class="td-empty" colspan="3">No Questions attended</div></div>');
            }
        }
        $('#pTotalCorrect').html(': ' + correctAnswers);
        panelDiv.html(table);
    },

    onFail: function (e) {
        console.log(e);
    }
};