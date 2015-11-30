var resultDelimiter = "~";
var CourseList = {
    /* All Course Details */
    getAllCourseList: function (courseName, source) {

        var a = {};
        a.name = "courseName";
        a.value = courseName;
        var arData = new Array();

        var curPageno = "1";
        if (source === undefined || source == "") {
            curPageno = "1";
        }
        else if (source == "n") {
            curPageno = $('#spncurClPgno').html().length == 0 ? "1" : parseInt($('#spncurClPgno').html()) + 1;
        }
        else if (source == "p") {
            curPageno = $('#spncurClPgno').html().length == 0 ? "1" : parseInt($('#spncurClPgno').html()) - 1;
        }
        else if (source == "c") {
            curPageno = $('#spncurClPgno').html().length == 0 ? "1" : parseInt($('#spncurClPgno').html());
        }
        else {
            curPageno = source;
        }
        var pg = {};
        pg.name = "pageNum";
        pg.value = curPageno;

        var dateParam = {};
        dateParam.name = 'offsetValue';
        dateParam.value = commonValues.getUTCOffset();

        arData.push(pg);
        arData.push(a);
        arData.push(dateParam);

        DPAjax.requestInvoke('AdCourse', 'GetPublishedCourseDetails', arData, "POST", function (result) {         

            var contentDiv = result.split('$')[0];
            var pgDetail = result.split('$')[1];

            if (result != null) {             
                $('#dvCourseDetail').html(contentDiv);
            }
            else {
                $('#dvCourseDetail').html("No Course found");
            }

            var totalPageSize = pgDetail.split('-')[0];
            var curPgNo = pgDetail.split('-')[1];
            $('#spncurClPgno').html(curPgNo);
            $('#spnTotClpgno').html(totalPageSize);
            CourseList.SetClPaging(totalPageSize, curPgNo);

        }, function (e) {
            CourseList.getCourseListFailure(e)
        });
    },
    getActiveCourseListSuccess: function (data) {
        if (data != null) {          
            $('#dvCourseDetail').html(data);
        }
        else {
            $('#dvCourseDetail').html("No Course found");
        }
    },
    getCourseListFailure: function (e) {       
        fnMsgAlert('ERROR', '', e.responseText);
    },
    SetClPaging: function (totPages, curPagno) {
        var options = "";
        for (var i = 1; i <= totPages; i++) {
            options += "<option value='" + i + "' onclick='CourseList.fnClPageChange(" + i + ")'>" + i + "</option>";
        }
        $('#drpClPages').html(options);
        $('#drpClPages').val(curPagno);
        if (curPagno == totPages) {
            $('#btnClEditNxt').attr('disabled', true);
        }
        else {
            $('#btnClEditNxt').attr('disabled', false);
        }
        if (curPagno == 1) {
            $('#btnClEditPre').attr('disabled', true);
        }
        else {
            $('#btnClEditPre').attr('disabled', false);
        }
    },
    fnClPageChange: function (no) {
        $('#spncurClPgno').html(no);
        CourseList.getAllCourseList('', no);
    },
    fnGetSearchResult: function () {
        var searchVal = $("#txtCourseSearch").val();
        CourseList.getAllCourseList(searchVal, '');
    },
    /* All Course Details */

    /* Active Publish Details */
    getActivePublish: function (courseName, source) {
        var curPageno = "1";
        if (source === undefined || source == "") {
            curPageno = "1";
        }
        else if (source == "n") {
            curPageno = $('#spncurActPgno').html().length == 0 ? "1" : parseInt($('#spncurActPgno').html()) + 1;
        }
        else if (source == "p") {
            curPageno = $('#spncurActPgno').html().length == 0 ? "1" : parseInt($('#spncurActPgno').html()) - 1;
        }
        else if (source == "c") {
            curPageno = $('#spncurActPgno').html().length == 0 ? "1" : parseInt($('#spncurActPgno').html());
        }
        else {
            curPageno = source;
        }

        var a = {};
        a.name = "courseName";
        a.value = courseName;

        var dateParam = {};
        dateParam.name = 'offsetValue';
        dateParam.value = commonValues.getUTCOffset();

        var pg = {};
        pg.name = "pageNum";
        pg.value = curPageno;

        var arData = new Array();

        arData.push(pg);
        arData.push(a);
        arData.push(dateParam);

        DPAjax.requestInvoke('AdCourse', 'GetActivePublishDetails', arData, "POST", function (result) {
            $('#dvActiveList').html('');
            var contentDiv = result.split('$')[0];
            var pgDetail = result.split('$')[1];

            if (result != null) {
                $('#dvActiveList').html(contentDiv);
            }

            var totalPageSize = pgDetail.split('-')[0];
            var curPgNo = pgDetail.split('-')[1];
            $('#spncurActPgno').html(curPgNo);
            $('#spnTotActpgno').html(totalPageSize);
            CourseList.SetActClPaging(totalPageSize, curPgNo);
        },
        function (e) {
            CourseList.getCourseListFailure(e)
        });
    },
    SetActClPaging: function (totPages, curPagno) {
        var options = "";
        for (var i = 1; i <= totPages; i++) {
            options += "<option value='" + i + "' onclick='CourseList.fnActPageChange(" + i + ")'>" + i + "</option>";
        }
        $('#drpActPages').html(options);
        $('#drpActPages').val(curPagno);
        if (curPagno == totPages) {
            $('#btnActEditNxt').attr('disabled', true);
        }
        else {
            $('#btnActEditNxt').attr('disabled', false);
        }
        if (curPagno == 1) {
            $('#btnActEditPre').attr('disabled', true);
        }
        else {
            $('#btnActEditPre').attr('disabled', false);
        }
    },
    fnActPageChange: function (no) {
        $('#spncurActPgno').html(no);
        CourseList.getActivePublish('', no);
    },
    fnGetActiveCourseSearch: function () {
        var searchVal = $("#txtActiveCourseSearch").val();
        CourseList.getActivePublish(searchVal,'');
    },
    /* Active Publish Details */
    /* Expired Publish Details */
    fngetExpiredPublish: function (courseName, source) {

        var curPageno = "1";
        if (source === undefined || source == "") {
            curPageno = "1";
        }
        else if (source == "n") {
            curPageno = $('#spncurActPgno').html().length == 0 ? "1" : parseInt($('#spncurActPgno').html()) + 1;
        }
        else if (source == "p") {
            curPageno = $('#spncurActPgno').html().length == 0 ? "1" : parseInt($('#spncurActPgno').html()) - 1;
        }
        else if (source == "c") {
            curPageno = $('#spncurActPgno').html().length == 0 ? "1" : parseInt($('#spncurActPgno').html());
        }
        else {
            curPageno = source;
        }

        var a = {};
        a.name = "courseName";
        a.value = courseName;

        var b = {};
        b.name = "utcOffset";
        b.value = commonValues.getUTCOffset();

        var pg = {};
        pg.name = "pageNum";
        pg.value = curPageno;

        var arData = new Array();
        arData.push(pg);
        arData.push(a);
        arData.push(b);

        DPAjax.requestInvoke('AdCourse', 'GetExpiredPublishDetails', arData, "POST", function (result) {
            $('#dvExpiredCourse').html('');
            var contentDiv = result.split('$')[0];
            var pgDetail = result.split('$')[1];

            if (result != null) {
                $('#dvExpiredCourse').html(contentDiv);
            }

            var totalPageSize = pgDetail.split('-')[0];
            var curPgNo = pgDetail.split('-')[1];
            $('#spncurExpPgno').html(curPgNo);
            $('#spnTotExppgno').html(totalPageSize);
            CourseList.SetExpClPaging(totalPageSize, curPgNo);
        },
        function (e) {
            CourseList.getCourseListFailure(e)
        });
    },
    SetExpClPaging: function (totPages, curPagno) {
        var options = "";
        for (var i = 1; i <= totPages; i++) {
            options += "<option value='" + i + "' onclick='CourseList.fnExpPageChange(" + i + ")'>" + i + "</option>";
        }
        $('#drpExpPages').html(options);
        $('#drpActPages').val(curPagno);
        if (curPagno == totPages) {
            $('#btnExpEditNxt').attr('disabled', true);
        }
        else {
            $('#btnExpEditNxt').attr('disabled', false);
        }
        if (curPagno == 1) {
            $('#btnExpEditPre').attr('disabled', true);
        }
        else {
            $('#btnExpEditPre').attr('disabled', false);
        }
    },
    fnActPageChange: function (no) {
        $('#spncurExpPgno').html(no);
        CourseList.getActivePublish('', no);
    },
    fnGetExpiredCourseSearch: function () {
        var expSearchVal = $("#txtExpireCourseSearch").val();
        CourseList.fngetExpiredPublish(expSearchVal,'');
    },
    /* Expired Publish Details */
    //Function to Delete the Published Course
    fnDeletePublish: function (courseId) {
        var a = {};
        a.name = "courseId";
        a.value = courseId;
        var arData = new Array();
        arData.push(a);

        if (confirm("Are you sure you want to unpublish the course? The course would be unpublished and all the scores will be lost. You will not be able to republish the course again. Click “OK” to continue")) {
            DPAjax.requestInvoke('AdCourse', 'DeletePublish', arData, "POST", function (result) {

                if (result.split('~')[0] == "SUCCESS") {
                    alert(result.split(resultDelimiter)[1]);
                    CourseList.getActivePublish('','');
                }
                else if (result.split(resultDelimiter)[0] == "ERROR") {
                    alert(result.split(resultDelimiter)[1]);
                }
            },
            function (e) {
            });
        }
    },
    fnLoadPublish: function (courseId) {      
        window.location.href = "/AdCourse/AdCoursePublish/" + courseId;
    },

    fnPublishUserDetails: function (courseName, publishName, courseId, publishId) {
        $('#dvCoursePublishViews .close').unbind().bind('click', function (e) {
            HideModalPopup('dvCoursePublishViews');
        });
        var arData = new Array();

        var courseParam = {};
        courseParam.name = "courseId";
        courseParam.value = courseId;

        var publishParam = {};
        publishParam.name = "publishId";
        publishParam.value = publishId;

        arData.push(courseParam);
        arData.push(publishParam);
        ShowModalPopup('dvCoursePublishViews');
        var tablePublishViews = $('#tablePublishViews');
        tablePublishViews.find('.row-table').remove();
        tablePublishViews.append('<tr class="row-table"><td colspan="5">Loading...</td></tr>');

        $('#dvAssetsTitle h3').html("Course Name: " + courseName + ", Exam Name: " + publishName);

        DPAjax.requestInvoke('AdCourse', 'GetActivePublishViews', arData, "GET", function (data) {
            if (data != null && data.length > 0) {
                tablePublishViews.find('.row-table').remove();
                for (var i = 0; i <= data.length - 1; i++) {
                    var tableRow = $('<tr class="row-table">');
                    tableRow.append('<td>' + (i + 1) + '</td>');
                    tableRow.append('<td>' + data[i].User_Name + '</td>');
                    tableRow.append('<td>' + data[i].Employee_Name + '</td>');
                    tableRow.append('<td>' + data[i].Region_Name + '</td>');
                    tableRow.append('<td>' + data[i].Result + '</td>');
                    tablePublishViews.append(tableRow);
                }
            } else {
                tablePublishViews.find('.row-table').remove();
                tablePublishViews.append('<tr class="row-table"><td colspan="5">No records found</td></tr>');
            }
        }, function (e) {
            tablePublishViews.find('.row-table').remove();
            tablePublishViews.append('<tr class="row-table"><td colspan="5">No records found</td></tr>');
        });
    }
}