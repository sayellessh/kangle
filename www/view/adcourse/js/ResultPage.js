var resultPage = {
    defaults: { userId: 1, companyId: 1, examId: 1, publishId: 1 },
    init: function () {
        resultPage.getQuestionAnswerDetails();
    },
    getQuestionAnswerDetails: function () {
        Services.getAdSectionQuestionDetails(resultPage.defaults.examId, resultPage.onGotResultDetail, function () { });
    },
    onGotResultDetail: function (data) {
        var panelHead = $('#dvCourseName');
        var panelExamDate = $('#dvExamDate');
        var panelName = $('#dvReportUserName');
        var panelDiv = $('#dvViewHeader');
        var correctAnswers = 0, isQualified = false;

        if (data && data.length > 0) {
            $('#dvCourseDetails').show();

            /** Question based results **/
            var table = $('<table class="table table-bordered">');
            var tHead = $('<tr>');
            tHead.append('<th style="width: 1%;">SNo</th>');
            tHead.append('<th>Questions</th>');
            tHead.append('<th class="td-align-center" style="width: 5%;">Result</th>');
            table.append(tHead);
            
            var employeeName = '', userName = '', sectionName = '', courseName = '', acheivedPerc = 0 ;
            for (var i = 0; i <= data.length - 1; i++) {
                var rowElem = data[i];
                employeeName = rowElem.Employee_Name;
                userName = rowElem.User_Name;
                sectionName = rowElem.Section_Name;
                courseName = rowElem.Course_Name;
                acheivedPerc = rowElem.Achieved_Percentage;
                isQualified = rowElem.Is_Qualified;

                var tBody = $('<tr>');
                tBody.append('<td>' + (i + 1) + '</td>');
                tBody.append('<td>' + rowElem.Question_Text + '</td>');
                tBody.append('<td class="td-align-center"><label>' + (rowElem.Is_Correct ? 'correct' : 'wrong')+ '</label></td>');
                if (rowElem.Is_Correct) {
                    correctAnswers++;
                    tBody.find('label').addClass('answer-correct');
                } else {
                    tBody.find('label').addClass('answer-wrong');
                }
                table.append(tBody);
            }
            panelDiv.html(table);


            /** Overall results **/
            panelHead.html('<div style="padding: 0 5px 5px 0;"><span style="font-weight: bold;">Course Name: </span>' + courseName + '</div><div><span style="font-weight: bold;">Section Name: </span>' + sectionName + '</div>');
            panelName.html(userName + ' (' + employeeName + ')');
            panelExamDate.html(data[0].Formatted_Section_Exam_Start_Time);

            $('#pScore').html(': ' + acheivedPerc + '%');
            $('#pNoQuestions').html(': ' + data.length);
            $('#pNoQuestionsAttended').html(': ' + data.length);
            $('#pTotalCorrect').html(': ' + correctAnswers);
            $('#pResult').html(': ' + (isQualified == true ? 'Pass' : 'fail'));

            if (isQualified) {
                /*$('#printCertificate').show();
                $('#printCertificate').bind('click', function (e) {
                    window.location.href = '/AdCourse/CourseCertificate/?aid=' + resultPage.defaults.examId +
                        '&pid=' + resultPage.defaults.publishId;
                });*/
                $('#printCertificate').hide();
            } else {
                $('#printCertificate').hide();
            }
            
        } else {
            var table = $('<div class="table"><div class="row"><div class="col">No questions found</div></div></div>');
            panelDiv.html(table);
            alert("Invalid entry, Please contact administrator.");
            window.location.href = "/AdCourse/UserAdCourseDetails";
        }

        if (resultPage.defaults.bRetakeTest == false || isQualified == true) {
            $('#retake-test').hide();
        } else {
            $('#retake-test').show();
        }
        $('#retake-test').bind('click', function (e) {
            window.location.href = '/AdCourse/QuestionAnswers/?cId=' + resultPage.defaults.courseId + '&sId=' +
                resultPage.defaults.sectionId + '&pId=' + resultPage.defaults.publishId + '&aId=' +
                resultPage.defaults.courseUserAssignmentId + '&secId=' + resultPage.defaults.courseUserSectionId;
            return false;
        });
    },

    onFail: function (e) {
        console.log(e);
    }
};