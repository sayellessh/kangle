var COURSE = {
    checkedUser: new Array(),
    fnLoadCourseSummary: function (cId) {
        var offsetVal = commonValues.getUTCOffset();
        $.ajax({
            type: "POST",
            data: "courseId=" + cId + "&offsetValue=" + offsetVal,
            url: '/AdCourse/GetPublishCourseSummary',
            success: function (jsData) {
                if (jsData != null) {
                    //debugger;                    
                    jsData = eval(jsData);
                    //console.log(jsData);
                    var courseContent = "";
                    var sectionContent = "";
                    var assessmentContent = "";
                    var courseList = eval(jsData[0].lstCourseHeader);
                    var sectionList = eval(jsData[0].lstSectionHeader);

                    if (courseList.length > 0) {

                        courseContent += "<div class='col-lg-12 clearfix'>";
                        courseContent += "<div class='col-md-2' style='font-weight: bold;'>Course Name :</div>";
                        courseContent += "<div class='col-md-10'>" + courseList[0].Course_Name + "</div>";
                        courseContent += "<input type='hidden' id='hdnCourseID' value='" + courseList[0].Course_ID + "' />";
                        courseContent += "</div>";

                        courseContent += "<div class='col-lg-12 clearfix'>";
                        courseContent += "<div class='col-md-2' style='font-weight: bold;'>Description :</div>";
                        courseContent += "<div class='col-md-10' style='text-align: justify;'>" + courseList[0].Course_Description + "</div>";
                        courseContent += "</div>";

                        courseContent += "<div class='col-lg-12 clearfix'>";
                        courseContent += "<div class='col-md-2' style='font-weight: bold;'>Category :</div>";
                        courseContent += "<div class='col-md-10'>" + courseList[0].Category_Name + "</div>";
                        courseContent += "</div>";

                        courseContent += "<div class='col-lg-12 clearfix'>";
                        courseContent += "<div class='col-md-2'style='font-weight: bold;'>Tags :</div>";

                        if (courseList[0].Course_Tags != null) {
                            var tagFinal = courseList[0].Course_Tags.toString().split('^');
                            courseContent += "<div class='col-md-10'>";
                            if (tagFinal != null && tagFinal.length > 0) {
                                for (var i = 0; i <= tagFinal.length - 1; i++) {
                                    if (tagFinal[i] != null && tagFinal[i] != '') {
                                        courseContent += '<div class="tagClass">' + tagFinal[i] + '</div>';
                                    }
                                }
                            }
                            courseContent += "</div>";
                        }
                        courseContent += "</div>";

                        $('#dvCourseHead').append(courseContent);
                    }
                    if (sectionList.length > 0) {
                        var a = 1;
                        sectionContent += "<table class='table table-striped'>";
                        sectionContent += "<thead><tr><th>SNo.</th><th>Section Name</th><th>No of Assets Mapped</th><th>No of Questions</th></th></thead>";
                        sectionContent += "<tbody>";
                        for (var i = 0; i < sectionList.length; i++) {
                            var sectionDetail = sectionList[i];
                            sectionContent += "<tr>";
                            sectionContent += "<td>" + a + "</td>";
                            sectionContent += "<td>" + sectionList[i].Section_Name + "</td>";
                            sectionContent += "<td ><a href='#' onclick='return COURSE.fnSelectAssets(" + Services.defaults.companyId
                                + ", " + sectionDetail.Course_Id + ", " + sectionDetail.Section_Id + ", \"" + sectionDetail.Section_Name + "\");' >" + sectionList[i].No_Of_Assets_Mapped + "</a></td>";
                            sectionContent += "<td><a href='#' onclick='return COURSE.fnSelectQuestions(" + Services.defaults.companyId
                                + ", " + Services.defaults.userId + ", " + sectionDetail.Course_Id
                                + ", " + sectionDetail.Section_Id + ", " + sectionDetail.Publish_Id + ", \"" + sectionDetail.Section_Name + "\");' >" + sectionList[i].No_Of_Questions_Mapped + "</a></td>";
                            sectionContent += "</tr>";
                            a++;
                        }
                        sectionContent += "</tbody>";
                        sectionContent += "</table>";
                        $('#dvMappedAsset').append(sectionContent);
                        a = 1;
                        assessmentContent += "<table class='table table-striped' id='tblSection'>";
                        assessmentContent += "<thead><tr><th>SNo.</th><th>Section Name</th><th>No of Questions</th><th style='width: 30%;'>Pass Percentage<span class='spnMandat'>*</span></th></th></thead>";
                        assessmentContent += "<tbody>";
                        for (var i = 0; i < sectionList.length; i++) {

                            assessmentContent += "<tr>";
                            assessmentContent += "<td>" + a + "</td>";
                            assessmentContent += "<td>" + sectionList[i].Section_Name + "</td>";
                            assessmentContent += "<td>" + sectionList[i].No_Of_Questions_Mapped + "</td>";
                            assessmentContent += "<td style='width: 30%;'><input type='text' id='txtSection_" + a + "' maxlength='3' />"
                            assessmentContent += "<input type='hidden' id='hdnSectionId_" + a + "' value='" + sectionList[i].Course_Id + "~" + sectionList[i].Section_Id + "~" + sectionList[i].Section_Name + "' /><span class='spnError' id='spanMsg_" + a + "'></span> </td>";
                            assessmentContent += "</tr>";
                            a++;
                        }
                        assessmentContent += "</tbody>";
                        assessmentContent += "</table>";

                        $('#dvPublishSectionAssement').append(assessmentContent);
                    }


                }
                else {
                }
                COURSE.fnBindUserType();
                $('#cboUserDetails').html("Please select a user role to map the users");
                //COURSE.fnBindUserDetails();
            }

        });
    },
    fnBindUserType: function () {
        $.ajax({
            type: "POST",
            url: '/AssetUpload/GetUserTypeDetails',
            data: "D",
            success: function (jsData) {
                if (jsData != null) {
                    jsData = eval(jsData);
                    var content = "";
                    content += "<input type='checkbox' name='chkallusertype' value='0' onclick='COURSE.fnSelectAllUserType();' id='chkallUserType' title='All User Type' /> Select All <br/>"
                    for (var d = 0; d < jsData.length; d++) {
                        content += "<input type='checkbox' onclick='COURSE.fnGetUserList(this);' name='chkusertype' value='" + jsData[d].User_Type_Code + "' title='" + jsData[d].User_Type_Name + "' /> " + jsData[d].User_Type_Name + " <br/>"
                    }
                    $("#dvUserType").html(content);
                }
                else {
                    $("#spnSuccess").addClass('error');
                    $("#spnSuccess").html(jsData)
                }
            }
        });

    },
    //function to bind the user details
    fnBindUserDetails: function (userTypeCode) {
        $('#cboUserDetails').html("");
        $.ajax({
            type: "POST",
            url: '/Course/GetEmployeeDetails',
            data: "userTypeCode=" + userTypeCode,
            success: function (jsonData) {
                //debugger;
                var selectContent = "";
                var tmpCheckedUser = new Array();
                //content += "<input type='checkbox' name='usertype' value='0' onclick='fnSelectAll(\"usertype\",this)' id='chkallUserType' title='All User Type' /> Select All <br/>"
                if (jsonData != null && jsonData != undefined) {
                    selectContent += "<input type='checkbox' name='chkEmpDetails' value='0' onclick='COURSE.fnSelectEmpDetails();' id='chkallEmpDetails' title='All user details' /> Select All <br/>"
                    for (var i = 0; i < jsonData.length; i++) {
                        var isChecked = false;
                        var elemId = "userlist_" + jsonData[i].User_Id;
                        if (COURSE.checkedUser.indexOf(elemId) >= 0) {
                            isChecked = true;
                            tmpCheckedUser.push(elemId);
                        }
                        //selectContent += "<option value='" + jsonData[i].User_Id + "'>" + jsonData[i].user_details + "</option>";
                        selectContent += "<input type='checkbox' name='userlist' " + (isChecked ? "checked='checked'" : "") + " id='" + elemId + "' value='" + jsonData[i].User_Id + "' title='" + jsonData[i].user_details + "' onchange='COURSE.fnSelectUserDetail(this);' /> " + jsonData[i].user_details + " <br/>"
                    }
                    $('#cboUserDetails').html(selectContent);
                }
                else {
                    $("#spnSuccess").addClass('error');
                    $("#spnSuccess").html(jsonData);
                    $('#cboUserDetails').html("Please select a user role to map the users");
                }
                COURSE.checkedUser = tmpCheckedUser;
            }
        });
    },
    fnGetUserList: function (obj) {
        //COURSE.fnBindUserDetails($(obj).val());
        var utype = "";
        $("input:checkbox[name=chkusertype]").each(function () {
            if (this.checked) {
                //$(this).addClass("test");                
                utype += this.value + ",";
            }
            //else {
            //    $(this).removeClass("test");
            //}
        });
        COURSE.fnBindUserDetails(utype);
    },
    fnSelectAllUserType: function () {
        var utype = "";
        if ($("input:checkbox[name=chkallusertype]").attr("checked") == "checked") {
            $("input:checkbox[name=chkusertype]").each(function () {
                this.checked = true;
                utype += this.value + ",";
            });
        }
        else {
            $("input:checkbox[name=chkusertype]").each(function () {
                this.checked = false;
                utype = "";
            });
        }
        COURSE.fnBindUserDetails(utype);
    },

    fnSelectEmpDetails: function () {
        var utype = "";
        if ($("input:checkbox[name=chkEmpDetails]").attr("checked") == "checked") {
            $("input:checkbox[name=userlist]").each(function () {
                this.checked = true;
                COURSE.fnSelectUserDetail(this);
                utype += this.value + ",";
            });
        }
        else {
            $("input:checkbox[name=userlist]").each(function () {
                this.checked = false;
                COURSE.fnSelectUserDetail(this);
                utype = "";
            });
        }
    },
    fnSelectUserDetail: function (elem) {
        if (elem.checked) {
            if (COURSE.checkedUser.indexOf(elem.id) < 0) {
                COURSE.checkedUser.push(elem.id);
            }
        } else {
            var idx = COURSE.checkedUser.indexOf(elem.id);
            COURSE.checkedUser.splice(idx, 1);
        }
    },
    fnPublishCourseSubValidate: function () {

        if ($('#dvPublishInfo span.spnError').hasClass('spnError')) {
            $('#dvPublishInfo span.spnError').html('');
        }
        var flag = true;
        var publishName = $.trim($("#txtPubName").val());
        ////var validFrom = $.trim($("#txtValidFrom").val());
        ////var validTill = $.trim($("#txtValidTill").val());
        var validFrom = $("#txtValidFrom").datepicker("getDate");
        var validTill = $("#txtValidTill").datepicker("getDate");
        var currentDate = new Date();
        currentDate.setHours(0);
        currentDate.setMinutes(0);
        currentDate.setSeconds(0);
        currentDate.setMilliseconds(0);

        var $userIds = $('input[name=userlist]:checked');
        var userIds = new Array();

        if ($userIds.length <= 0) {
            //alert("Please select atleast one user");
            fnMsgAlert('info', 'COURSE', 'Please select atleast one user');
            flag = false;
           // return false;
        }

        if (publishName == "") {
            $('#spnPublishNameErr').html(publishNameValidation);
            flag = false;
        }
        else {
            var result = COURSE.fnCheckSpecialChar($('#txtPubName'));
            if (!result) {
                $('#spnPublishNameErr').html(publishNameSPlCharValid);
                flag = false;
            }
        }

        if (validFrom == "") {
            $('#spnValidFromErr').html(publishValidFrom);
            flag = false;
        }
        else {                           
            if ((validFrom.getTime() - currentDate.getTime()) < 0) {
                $('#spnValidFromErr').html(publishValidFromComparison);
                flag = false;
            }
        }
        if (validTill == "") {
            $('#spnValidTillErr').html(publishValidTill);
            flag = false;
        }
        else {
            if ((validTill.getTime() - validFrom.getTime()) < 0) {
                $('#spnValidTillErr').html(publishValidTillComparison);
                flag = false;
            }
        }
                
        var sectionVal = "";
        var sectionName = "";
        if ($('#tblSection tr').length > 0) {
            for (var i = 1; i < $('#tblSection tr').length; i++) {
                // var sectionValues = $('#tblSection tr')[i].getElementsByClassName('tdFirst')[0].getElementsByTagName('input')[0].value;
                sectionVal = $("#txtSection_" + i).val();
                sectionName = $("#hdnSectionId_" + i).val();
                $("#spanMsg_" + i + "").html('');
                if (sectionVal == "") {
                    $("#spanMsg_" + i + "").html("Please enter Pass percentage");
                    // alert("Please enter Pass percentage for '" + sectionName.split('~')[2] + "' section");
                    flag = false;
                    //  return false;
                }
                else if (isNaN(sectionVal)) {
                    $("#spanMsg_" + i + "").html("Please enter numbers alone");
                   // alert("Please enter numbers alone  for '" + sectionName.split('~')[2] + "' section");
                    flag = false;
                   // return false;
                }
                if (sectionVal > 100) {
                    $("#spanMsg_" + i + "").html("Pass percent should not exceed");
                  //  alert("Pass percent should not exceed 100 for '" + sectionName.split('~')[2] + "' section");
                    flag = false;
                   // return false;
                }
                if (sectionVal <= 0) {
                    $("#spanMsg_" + i + "").html("Pass enter greater than 0");
                   // alert("Pass enter greater than 0 ");
                    flag = false;
                   // return false;
                }
            }
        }
        else {

            alert("No section available for this course");
            flag = false;           
        }

        return flag;
    },
    fnPublishCourse: function (courseId_g) {
        var flag = COURSE.fnPublishCourseSubValidate();
        if (flag) {
            var courseId = courseId_g;
            var courseName = $("#txtPubName").val();
            // validFrom = $("#txtValidFrom").val();
            //var validTill = $("#txtValidTill").val();
            var $userIds = $('input[name=userlist]:checked');
            var userIds = new Array();

            if ($userIds != null && $userIds.length > 0) {
                $.each($userIds, function (index, obj) {
                    var uobj = {};
                    uobj.User_Id = $(obj).val();
                    uobj.Course_Id = courseId;
                    userIds.push(uobj);
                });
            }

            var secionArr = new Array();
            var sectionVal = "";
            for (var i = 1; i < $('#tblSection tr').length; i++) {
                var sectObj = {};
                sectObj.Course_Id = courseId
                sectObj.Section_Id = $("#hdnSectionId_" + i).val().split('~')[1];
                sectObj.Pass_Percentage = $("#txtSection_" + i).val();
                secionArr.push(sectObj);

            }

            var secUserArr = new Array();
            for (var i = 1; i < $('#tblSection tr').length; i++) {
                if ($userIds != null && $userIds.length > 0) {
                    $.each($userIds, function (index, obj) {
                        var sectObj = {};
                        sectObj.Course_Id = courseId
                        sectObj.User_Id = $(obj).val();
                        sectObj.Section_Id = $("#hdnSectionId_" + i).val().split('~')[1];
                        sectObj.Pass_Percentage = $("#txtSection_" + i).val();
                        secUserArr.push(sectObj);
                    });
                }
            }

            var validFrom = $("#txtValidFrom").datepicker("getDate");
            var validTill = $("#txtValidTill").datepicker("getDate");

            var validFromDate = '', validToDate = '';
            validFromDate = validFrom.getFullYear() + '/' + (validFrom.getMonth() + 1) + '/' + validFrom.getDate();
            validToDate = validTill.getFullYear() + '/' + (validTill.getMonth() + 1) + '/' + validTill.getDate();

            //validFrom = new Date($("#txtValidFrom").val().split('/')[2] + "-" + $("#txtValidFrom").val().split('/')[1] + "-" + $("#txtValidFrom").val().split('/')[0]);
            //validTill = new Date($("#txtValidTill").val().split('/')[2] + "-" + $("#txtValidTill").val().split('/')[1] + "-" + $("#txtValidTill").val().split('/')[0]);

            var arData = new Array();
            var course = {};
            course.Course_Id = courseId;
            course.Publish_Name = courseName;
            course.Valid_From = validFromDate;
            course.Valid_To = validToDate;
            var arCourse = new Array();
            arCourse.push(course);

            var courseJson = {};
            courseJson.name = "publishHeaderJson";
            courseJson.value = arCourse;
            courseJson.type = "JSON";

            var courses = {};
            courses.name = "PublishUsers";
            courses.value = userIds;
            courses.type = "JSON";

            var CourseSection = {}
            CourseSection.name = "SectionDetails";
            CourseSection.value = secionArr;
            CourseSection.type = "JSON";

            var CourseUseSection = {}
            CourseUseSection.name = "SectionUserList";
            CourseUseSection.value = secUserArr;
            CourseUseSection.type = "JSON";


            arData.push(courses);
            arData.push(courseJson);
            arData.push(CourseSection);
            arData.push(CourseUseSection);

            var btnSubmit = $('#btnCrPublish');
            btnSubmit.find('i').remove();
            btnSubmit.prepend('<i class="fa fa-spinner fa-spin"></i>&nbsp;');
            DPAjax.requestInvoke("AdCourse", "InsertPublishCourseDetails", arData, "POST",
                function (result) {
                    if (result != "" && result != null) {

                        alert("Course Published Successfully");
                        window.location.href = "/AdCourse/AdCourseList/";

                    }
                    else {
                        btnSubmit.find('i').remove();
                        alert("unable to publish the course");
                    }
                },
                function (e) {
                    alert(e);
                    btnSubmit.find('i').remove();
                });
        }
        else {
        }
    },
    fnCheckSpecialChar: function (id) {
        if ($(id).val() != "") {
            var specialCharregex = new RegExp("^[a-zA-Z0-9()' '\".+_\[\\]<>%#;:{}*-\/,=?&]+$");
            if (!specialCharregex.test($.trim($(id).val()))) {
                return false;
            }
            else {
                return true;
            }
        }
        return true
    },

    fnSelectAssets: function (companyId, courseId, sectionId, sectionName) {
        Services.getAdAssetsByCourseId(companyId, courseId, sectionId, function (data) {
            COURSE.onGotAssets(sectionName, data);
        }, COURSE.onFail);
        return false;
    },
    onGotAssets: function (sectionName, data) {
        if (data != null && data.length > 0) {
            ShowModalPopup('dvAssetsPopup');
            $('#dvAssetsTitle h3').html(sectionName);
            var assetDiv = $('#dvAssets');
            assetDiv.empty();
            for (var i = 0; i <= data.length - 1; i++) {
                var asset = $('<div class="asset">');
                var thumb = $('<div class="thumb">');
                thumb.append('<img src="' + data[i].DA_Thumbnail_URL + '" width="100px" height="100px" />');
                var desc = $('<div class="desc">');
                desc.append('<p>' + data[i].Asset_Name + '</p>');

                asset.append(thumb);
                asset.append(desc);
                assetDiv.append(asset);
            }
        } else {
            alert("No assets mapped for this section.");
        }
    },

    fnSelectQuestions: function (companyId, userId, courseId, sectionId, publishId, sectionName) {
        Services.getAdCourseQuestionAnswerDetails(companyId, userId, courseId, sectionId, publishId, function (data) {
            COURSE.onGotQuestions(sectionName, data);
        }, COURSE.onFail);
        return false;
    },
    onGotQuestions: function (sectionName, data) {
        if (data != null && data.length > 0) {
            var result = data[0];
            var courseList = result.lstCourse;
            var questionList = result.lstQuestion;
            var answerList = result.lstAnswer;
            var questionStatus = result.lstQuestionStatus;
            if (questionList != null && questionList.length > 0) {
                ShowModalPopup('dvAssetsPopup');
                $('#dvAssetsTitle h3').html(sectionName);
                var questionDiv = $('#dvAssets');
                questionDiv.empty();

                var ol = $('<ol>');
                for (var i = 0; i <= questionList.length - 1; i++) {
                    var question = $("<li class='question'>");
                    var questionP = $("<p><b>" + questionList[i].Question_Text + "</b></p>");
                    var questionDesc = $("<p>" + questionList[i].Question_Description + "</p>");
                    question.append(questionP);
                    question.append(questionDesc);
                    ol.append(question);
                }
                questionDiv.append(ol);
            } else {
                alert("No questions mapped for this section.");
            }
        } else {
            alert("No questions mapped for this section.");
        }
    },

    onFail: function (e) {

    },

    initPopups: function () {
        $('#dvAssetsPopup span.close a').unbind().bind('click', function (e) {
            HideModalPopup("dvAssetsPopup");
            return false;
        });
        $('#dvQuestionsPopup span.close a').unbind().bind('click', function (e) {
            HideModalPopup("dvQuestionsPopup");
            return false;
        });
    }
}