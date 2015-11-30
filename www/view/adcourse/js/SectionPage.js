var sectionPage = {
    defaults: { courseId: 1, publishId: 1, userId: 1 },
    init: function () {
        sectionPage.getSectionDetails();
    },
    getSectionDetails: function () {
        Services.getAdSectionReportHeader(sectionPage.defaults.courseId, sectionPage.defaults.userId,
            sectionPage.defaults.publishId, this.onGetSectionDetails, function () { });
    },
    onGetSectionDetails: function(data) {
        if (data && data.length > 0) {
            var panelHead = $('#dvCourseName');
            var panelExamDate = $('#dvExamDate');
            var panelName = $('#dvReportUserName');            
            panelHead.html('<div style="padding: 0 5px 5px 0;"><span style="font-weight: bold;">Course Name: </span>' + data[0].Course_Name + '</div><div><span style="font-weight: bold;">Section Name: </span>' + 'N/A' + '</div>');

            $('#dvCourseDetails').show();

            /** Section results **/
            var table = $('<table class="table table-bordered"></table>');
            var tHead = $('<tr>');
            tHead.append('<th>SNo</th>');
            tHead.append('<th>Section Name</th>');
            tHead.append('<th>Result</th>');
            tHead.append('<th class="td-align-center">Action</th>');
            table.append(tHead);

            for (var i = 0; i < data.length; i++) {
                var curSec = data[i];

                var tBody = $('<tr>');
                tBody.append('<td>' + (i + 1) + '</td>');
                tBody.append('<td>' + curSec.Section_Name + '</td>');
                tBody.append('<td><label>' + (curSec.Is_Qualified ? 'Pass' : 'Fail') + '</label></td>');
                tBody.append('<td class="td-align-center"><a href="SectionAttempts.html?cId=' +
                    curSec.Course_Id + '&sId=' + curSec.Section_Id + '&pId=' + sectionPage.defaults.publishId
                    + '" class="col-action" title="View">View</a></td>');
                if (curSec.Is_Qualified) {
                    tBody.find('label').addClass('answer-correct');
                } else {
                    tBody.find('label').addClass('answer-wrong');
                }
                table.append(tBody);
            }

            $('#dvCourseDetails').append(table);
        }
    }
};


var sectionAttempts = {
    defaults: { courseId: 1, publishId: 1, userId: 1, sectionId: 1 },
    init: function () {
        this.getSectionAttemptDetails();
    },
    getSectionAttemptDetails: function () {
        Services.getAdSectionAttemptDetails(sectionAttempts.defaults.courseId, sectionAttempts.defaults.sectionId,
            sectionAttempts.defaults.userId, sectionAttempts.defaults.publishId, this.onGetSectionDetails, function () { });
    },
    onGetSectionDetails: function (data) {
        if (data && data.length > 0) {
            var panelHead = $('#dvCourseName');
            var panelExamDate = $('#dvExamDate');
            var panelName = $('#dvReportUserName');
            panelHead.html('<div style="padding: 0 5px 5px 0;"><span style="font-weight: bold;">Course Name: </span>' + data[0].Course_Name + '</div><div><span style="font-weight: bold;">Section Name: </span>' + data[0].Section_Name + '</div>');
            
            $('#dvCourseDetails').show();

            /** Section results **/
            var table = $('<table class="table"></table>');
            var tHead = $('<tr>');
            tHead.append('<th>#</th>');
            tHead.append('<th>Attempt Date</th>');
            tHead.append('<th>Result</th>');
            tHead.append('<th class="td-align-center">Action</th>');
            table.append(tHead);

            for (var i = 0; i < data.length; i++) {
                var curSec = data[i];

                var tBody = $('<tr>');
                tBody.append('<td>' + curSec.Attempt_Number + '</td>');
                tBody.append('<td>' + curSec.Formatted_Section_Exam_Start_Time + '</td>');
                tBody.append('<td><label>' + (curSec.Is_Qualified ? 'Pass' : 'Fail') + '</label></td>');
                tBody.append('<td class="td-align-center"><a href="ResultPage.html?examId=' +
                    curSec.Course_Section_User_Exam_Id + '&publishId=' + sectionAttempts.defaults.publishId +
                    '&publishId=' + publishId + '&cId=' + courseId + '&sId=' + sectionId +
                    '" class="a-btn" title="View">View</a></td>');
                if (curSec.Is_Qualified) {
                    tBody.find('label').addClass('answer-correct');
                } else {
                    tBody.find('label').addClass('answer-wrong');
                }
                table.append(tBody);
            }

            $('#dvCourseDetails').append(table);
        }
    }
};