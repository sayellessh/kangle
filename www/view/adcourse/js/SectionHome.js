var COURSE = {
    init: function(courseId, courseName) {
        COURSE.fnBindSectionDetails(courseId, courseName);
        $("#dvPageHeader").html("Section Home");
        $('#mnuAddCourse').addClass('cls_submenuActive');
        $('#mnuCourse').addClass('cls_active');
        $('#btnSaveCourse').click(function () {
            COURSE.fnUpdatDisplayOrder(courseId, courseName);
        });
        $('#btnAddCourse').click(function (e) {
            window.location.href = "/AdCourse/AssetMapping/?cid=" + courseId + "&cname=" + courseName;
        });
        $('#btnGoHome').click(function(e) {
            window.location.href = "/AdCourse/CreateCourse";
        });
    },
    fnBindSectionDetails: function (courseId, courseName) {
        var sno = 0;
        $('#dvCourseNameH').html("Course Name: " + courseName);
        $.ajax({
            type: "POST",
            url: '/AdCourse/GetSectionDetails',
            data: "courseId=" + courseId,
            success: function (jsData) {

                var content = "";
                content += "<table class='table table-striped' id='tblSectionHeader'>";
                content += "<thead>";

                content += "<tr><th>Sno</th>";
                content += "<th>Section Name</th>";
                content += "<th>No of Assets Mapped</th>";
                content += "<th>No of Questions</th>";
                content += "<th>Action</th>";
                content += "</tr></thead>";
                content += "<tbody>";
                console.log(jsData.length);
                if (jsData != null && eval(jsData).length > 0) {
                    jsData = eval(jsData);
                    for (var j = 0; j < jsData.length; j++) {
                        sno++;
                        content += "<tr>"
                        content += "<td>" + sno + "</td>";
                        content += "<td>" + jsData[j].Section_Name + "</td>";
                        content += "<td>" + jsData[j].No_Of_Assets_Mapped + "</td>";
                        content += "<td>" + jsData[j].No_Of_Questions_Mapped + "</td>";
                        content += "<td class='tdFirst'>";
                        content += "<input type='hidden' id='hdnSection_" + sno + "' value='" + jsData[j].Section_Id + "~" + jsData[j].Course_Id + "' />";
                        content += '<div class="col-lg-12 clsPaddingNone">';
                        content += '<div class="clsAddAns" onclick="COURSE.fnAddAnsRow(' + jsData[j].Course_Id + ', '
                            + jsData[j].Section_Id + ', \'' + courseName_g + '\', \'' + jsData[j].Section_Name + '\');"><i class="fa fa-pencil-square fa-lg"></i></div>';
                        content += '<div class="clsRemoveAns" onclick="COURSE.fnRemoveAnsRow(this);"><i class="fa fa-minus-square fa-lg"></i></div>';
                        content += '<div class="clsMoveUpAns" onclick="COURSE.fnMoveUpAnsRow(this);"><i class="fa fa-arrow-circle-up fa-lg"></i></div>';
                        content += '<div class="clsMoveDownAns" onclick="COURSE.fnMoveDownAnsRow(this);"><i class="fa fa-arrow-circle-down fa-lg"></i></div>';
                        content += '</div>';
                        content += "</td>";

                        content += "</tr>"}
                }
                else {
                    content += "<tr>"
                    content += "<td colspan='5'>Please click Add new section to create section.</td>";
                    content += "</td>";
                    content += "</tr>";
                    $('#btnSaveCourse').hide();
                    $('#btnGoHome').hide();
                }
                content += "</tbody></table>";
                $("#dvSectionHeader").html(content);
            }
        });
    },
    fnBindAnsAlphabets: function () {
        for (var i = 0; i < $('.clsAlpha').length ; i++) {
            $($('.clsAlpha')[i]).html(alphabets_g[i])
        }
    },
    fnMoveUpAnsRow: function (obj) {
        var row = $(obj).closest("tr");
        row.insertBefore(row.prev());
        COURSE.fnBindAnsAlphabets();
    },
    fnMoveDownAnsRow: function (obj) {
        var row = $(obj).closest("tr");
        // row.insertAfter(row.next());
        $(row).next().after($(row));
        COURSE.fnBindAnsAlphabets();
    },
    fnRemoveAnsRow: function (obj) {
        var row = $(obj).parents("tr:first");

        if ($('.clsAlpha').length != 2) {
            row.remove();
            COURSE.fnBindAnsAlphabets();
        }
        else {
            alert("You cannot delete the rows");
            return false;
        }
    },
    fnAddAnsRow: function (courseId, sectionId, courseName, sectionName) {
        window.location.href = "/AdCourse/AssetMapping/?cid=" + courseId + "&sid=" + sectionId + "&cname=" + courseName + "&sname=" + sectionName;
    },
    fnUpdatDisplayOrder: function (courseId, courseName) {

        $.blockUI();
        if ($('#tblSectionHeader tr').length > 0) {
            var arData = new Array();
            var questionOrder = 1;

            var secAr = new Array();
            for (var i = 1; i < $('#tblSectionHeader tr').length; i++) {
                var sec = {};

                var sectionValues = $('#tblSectionHeader tr')[i].getElementsByClassName('tdFirst')[0].getElementsByTagName('input')[0].value;
                sec.Section_Id = sectionValues.split('~')[0];
                sec.Display_Order = i;
                sec.Course_Id = sectionValues.split('~')[1];
                secAr.push(sec);
            }

            var sectionJson = new Array();
            sectionJson.name = "sectionJson";
            sectionJson.value = secAr;
            sectionJson.type = "JSON";

            arData.push(sectionJson);

            DPAjax.requestInvoke("AdCourse", "UpdateSectionDisplayOrder", arData, "POST",
                function (result) {
                    COURSE.fnBindSectionDetails(courseId, courseName);
                    $.unblockUI();
                },
                function (result) {
                    $.unblockUI();
                    alert(result)

                });

        }
        else {
            $.unblockUI();
            fnMsgAlert('info', 'dvAnsInfo', 'Saved successfully');
        }
    }
};