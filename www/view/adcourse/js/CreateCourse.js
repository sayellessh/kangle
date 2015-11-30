var eLearningAPP = {};
var autoQuestions_g = "";
var autoAnswers_g = "";
var ansRowNum = 1;
var alphabets_g = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
var quesRowNum = 1;
var viewPageNo_g = 1;
var resultDelimiter = "~";
var COURSE = {
    maxImageSize: 524288,
    checkedUser: new Array(),
    imageSizeExceed: function (size) {
        return 'Please upload file size less than ' + (size / 1024) + ' KB'
    },
    selectedAssets: {},
    metaTagDataAssets: null,
    fnInitializeEvents: function () {
        $('#txtCourseName').blur(function () {
            COURSE.fnValidateSpecialChar("txtCourseName", "dvCourseNameValid", true);
        });
        $('#txtCourseDesc').blur(function () { COURSE.fnValidateSpecialChar("txtCourseDesc", "dvCourseDescValid", false); });
        $('#txtCoursePoint').blur(function () { COURSE.fnValidateSpecialChar("txtCoursePoint", "dvCoursePointValid", false); });

        $('input[id=txtCourseImage]').change(function () {
            COURSE.fnShowCourseImagePreview(this);
        });
        $('#btnCreateCourse').click(function () {
            //$.blockUI();
            $('#btnCreateCourse').html('<i class="fa fa-spinner fa-spin"></i>');
            setTimeout(function () { COURSE.fnCourseSubmit(); }, 1000);
            //$.unblockUI();
        });

    },
    fnValidateSpecialChar: function (controlName, msgDivName, isMandatory) {
        if ($('#' + controlName).val() != '') {

            if (controlName == "txtQuesDesc" || controlName == "txtCourseDesc") {
                var result = COURSE.fnCheckSpecialCharForCourseDesc($('#' + controlName));
            }
            else {
                var result = COURSE.fnCheckSpecialChar($('#' + controlName));
            }
            if (!result) {
                $('#' + msgDivName).html('<i class="fa fa-times" ></i>');
                $('#' + msgDivName).removeClass('clsValid');
                $('#' + msgDivName).addClass('clsInvalid');
            }
            else {
                $('#' + msgDivName).html('<i class="fa fa-check"></i>');
                $('#' + msgDivName).removeClass('clsInvalid');
                $('#' + msgDivName).addClass('clsValid');
            }
        }
        else {
            if (isMandatory) {
                $('#' + msgDivName).html('<i class="fa fa-times"></i>');
                $('#' + msgDivName).removeClass('clsValid');
                $('#' + msgDivName).addClass('clsInvalid');
            }
            else {
                $('#' + msgDivName).removeClass('clsValid');
                $('#' + msgDivName).removeClass('clsInvalid');
            }
        }

    },
    fnShowCourseImagePreview: function (input) {
        $('#spnCourseImageErr').html('');
        if ($.browser.msie) {
            var imgUrl = $('#txtCourseImage').val().replace(/C:\\fakepath\\/i, '');
            if (imgUrl != '') {
                var fileName = $('#txtCourseImage').val().replace(/C:\\fakepath\\/i, '').split('\\').pop();
                var arFileName = $('#txtCourseImage').val().replace(/C:\\fakepath\\/i, '').split('\\').pop().split('.');
                arFileName.reverse();
                if (arFileName[0].toUpperCase() == "JPG" || arFileName[0].toUpperCase() == "PNG" || arFileName[0].toUpperCase() == "JPEG" ||
                     arFileName[0].toUpperCase() == "BMP" || arFileName[0].toUpperCase() == "GIF") {
                    // $('#dvSurImagePreview').removeAttr("src");
                    // $('#dvSurImagePreview').attr("src", imgUrl);
                    // $('#dvSurImagePreview').empty().append('<img alt="" class="preview-thumb thumbnail img-responsive" src="' + imgUrl + '"/>');


                    // $('#dvSurImagePreview').show();
                    if (input.files[0].size <= COURSE.maxImageSize) {
                        $('#txtSurImg').val(fileName);
                        $('#dvSurImagePreview').html('');
                    } else {
                        $('#spnCourseImageErr').html(COURSE.imageSizeExceed(COURSE.maxImageSize));
                        $('#txtSurImg').val('');
                        $('#dvSurImagePreview').html('');
                        input.value = null;
                    }
                }
                else {
                    $('#txtSurImg').val('');
                    $('#dvSurImagePreview').html('');
                    input.value = null;
                }
            }
            else {
                $('#spnCourseImageErr').html(surImgValid);
                $('#txtSurImg').val('');
                $('#dvSurImagePreview').html('');
                input.value = null;
            }
        }
        else {
            //var input = $('#txtSurImg');
            if (input.files && input.files[0]) {
                var arFileName = $('#txtCourseImage').prop("files")[0].name.split('.');
                var fileNameAlone = arFileName[0];
                arFileName.reverse();
                if (arFileName[0].toUpperCase() == "JPG" || arFileName[0].toUpperCase() == "PNG" || arFileName[0].toUpperCase() == "JPEG" ||
                   arFileName[0].toUpperCase() == "BMP" || arFileName[0].toUpperCase() == "GIF") {
                    if (input.files[0].size <= COURSE.maxImageSize) {
                        var filerdr = new FileReader();
                        filerdr.onload = function (e) {
                            //   $('#dvSurImagePreview').attr('src', e.target.result);
                            $('#dvSurImagePreview').html("<img alt='' class='thumbnail img-responsive' src='" + e.target.result + "'/>");
                            //   $('#dvSurImagePreview').html("<a href='#'><img alt='' class='thumbnail' src='" + imgUrl + "'/></a>");
                        }
                        filerdr.readAsDataURL(input.files[0]);
                        $('#txtSurImg').val(fileNameAlone);
                        //$('#dvSurImagePreview').html('');
                        $('#dvSurImagePreview').show();

                        //$('#dvSurImagePreview').show();
                    } else {
                        $('#spnCourseImageErr').html(COURSE.imageSizeExceed(COURSE.maxImageSize));
                        //$('#txtSurImg').val('');
                        //$('#dvSurImagePreview').html('');
                    }
                }
                else {
                    $('#spnCourseImageErr').html(surImgValid);
                }
            }
            else {
                $('#txtSurImg').val('');
                $('#dvSurImagePreview').html('');
            }
        }
    },
    fnCourseSubmit: function () {
        //$.blockUI();
        $('#btnCreateCourse').html('<i class="fa fa-spinner fa-spin"></i>');
        //fnMsgAlert('info', 'Course', coursesubmitValidate);        
        var flag = COURSE.fnCourseSubValidate();

        //$.unblockUI();
        if (flag) {

            //fnMsgAlert('info', 'Course', courseSubmitValidSuccess);
            var courseName = $.trim($('#txtCourseName').val());
            var courseDesc = $.trim(escape($('#txtCourseDesc').val()));

            var courseImage = $.trim($('#txtCourseImage').val());
            //var courseCategory = $.trim($('#txtCourseCategory').val());
            var courseCategory = $.trim($("#ddCourseCategory").val());

            // var courseTags = $.trim($('#txtCourseTags').val());
            //   var courseType = $("input[type='radio'][name='rdCourseType']:checked").val();
            var coursePoints = $('#txtCoursePoint').val();
            //  var courseInst = $.trim($('#txtCourseInstruct').val());
            var courseId = $('#hdnCourseId').val();
            var arData = new Array();
            var course = {};

            course.Course_Name = courseName;
            //  course.Course_Type = courseType;
            course.Course_Category_Id = courseCategory;
            course.Course_Description = courseDesc;
            //  course.Course_Instruction = courseInst;
            //course.Course_Tags = courseTags;

            var crTags = "";
            var courseTags = $("#txtCourseTags").tokenInput('get');
            for (var a = 0; a < courseTags.length; a++) {
                crTags += courseTags[a].name + "^";
            }

            //crTags = crTags.slice(0, -1);
            course.Course_Tags = crTags;

            var fileName = "";
            if ($.browser.msie) {
                if ($('#txtCourseImage').val() != '') {
                    course.Course_Image_URL = $('#txtCourseImage').val().replace(/C:\\fakepath\\/i, '').split('\\').pop();
                    fileName = $('#txtCourseImage').val().replace(/C:\\fakepath\\/i, '').split('\\').pop();
                }

                else {
                    course.Course_Image_URL = '';
                }
            }
            else {
                if ($('#txtCourseImage').val() != '') {
                    if ($('#txtCourseImage').prop("files").length > 0) {
                        course.Course_Image_URL = $('#txtCourseImage').prop("files")[0].name;
                        fileName = $('#txtCourseImage').prop("files")[0].name;
                    }
                }
                else {
                    course.Course_Image_URL = '';
                }
            }

            if (coursePoints == '') {
                course.Course_Point = 0;
            }
            else {
                course.Course_Point = parseInt(coursePoints).toFixed(0);
            }
            course.Course_Reward_Mode = 0;
            course.Course_ID = courseId;
            var arCourse = new Array();
            arCourse.push(course);

            var courseJson = {};
            courseJson.name = "courseJson";
            courseJson.value = arCourse;
            courseJson.type = "JSON";

            var courseMode = {};
            courseMode.name = "mode";
            courseMode.value = $('#hdnCourseMode').val();

            var courseOldId = {};
            courseOldId.name = "courseOldId";
            courseOldId.value = courseId;

            arData.push(courseJson);
            arData.push(courseMode);
            arData.push(courseOldId);
            COURSE.fnCourseSubmitAction(arData, fileName);
        }
        else {
            // $('#dvCreateCourseInfo').html('');            
            $('#btnCreateCourse').html('<i class="fa fa-floppy-o"></i> ' + surSubmitText);
            $('#btnCreateCourse').show();
            $('#dvCreateCourseInfo').hide();

        }
    },
    fnCourseSubmitAction: function (arData, fileName) {
        //$.blockUI();
        // fnMsgAlert('info', 'dvCreateCourseInfo', courseSubmitLoadMsg);

        DPAjax.requestInvoke("AdCourse", "InsertCourse", arData, "POST",
            function (result) {

                var arResult = result.split(resultDelimiter);
                if (arResult[0] == "SUCCESS") {
                    if (fileName != '' && fileName != null && fileName != undefined) {
                        BeginFileUpload($('#course-form'), "txtCourseImage", fileName, "FileUpload", "ChunkFileUpload",
                            function (data) {

                                COURSE.fncourseImgUpoadSuccess(data, result);
                            },
                            function (e) {
                                COURSE.fncourseImgUpoadFailure(e);
                            });
                    }
                    else {
                        $('#btnCreateCourse').show();
                        COURSE.courseSubmitSuccess(result, '');
                        $.unblockUI();
                    }
                }
                else {
                    COURSE.courseSubmitSuccess(result, '');
                    $.unblockUI();
                }
            },
            function (e) {
                $('#btnCreateCourse').show();
                COURSE.courseSubmitFailure(e)
            });
    },
    fncourseImgUpoadSuccess: function (data, result) {
        //$.blockUI();
        $('#btnCreateCourse').show();
        //fnMsgAlert('SUCCESS', 'dvCreateCourseImgInfo', surImgUploadSuccessMsg);
        COURSE.courseSubmitSuccess(result, '');
    },
    fncourseImgUpoadFailure: function () {
        var ar = result.split(resultDelimiter);
        $('#hdnCourseId').val(ar[1]);
        $('#btnCreateCourse').html("<i class='fa fa-floppy-o'></i> " + surSubmitText);
        fnMsgAlert('ERROR', 'dvCreateCourseImgInfo', surImgUploadErrorMsg);
        $.unblockUI();
    },
    courseSubmitSuccess: function (result, mode) {        
        var ar = result.split(resultDelimiter);
        $.unblockUI();
        if (result != null) {
            var spl = result.split('~');
            if (spl.length >= 3) {
                var courseId = spl[1];
                var courseName = $('#txtCourseName').val();
                window.location.href = '/AdCourse/SectionHome/?cid=' + courseId + '&cname=' + courseName;
            } else {
                alert('Error occured');
            }
        } else {
            alert('Error occured');
        }
    },
    courseSubmitFailure: function (e) {
        fnMsgAlert("Error", "Course", e.responseText);
        $('#btnQuestSubmit').html('<i class="fa fa-floppy-o"></i> ' + btnQuestSubmit);
        $.unblockUI();
    },
    fnCourseSubValidate: function () {
        //$.blockUI();       
        $('#btnCreateCourse').html('<i class="fa fa-spinner fa-spin"></i>');
        if ($('#dvCourseContent span.spnError').hasClass('spnError')) {
            $('#dvCourseContent span.spnError').html('');
        }
        var flag = true;
        var courseDesc = $.trim($('#txtCourseDesc').val());
        var courseInst = $.trim($('#txtCourseInstruct').val());
        var courseName = $.trim($('#txtCourseName').val());
        var coursePoints = $.trim($('#txtCoursePoint').val());
        //var courseCategory = $.trim($('#txtCourseCategory').val());
        var courseCategory = $.trim($('#ddCourseCategory').val());

        //var courseTags = $.trim($('#txtCourseTags').val());

        if (courseName == "") {
            $('#spnCourseNameErr').html(courseNameValidation);
            flag = false;
        }
        else {
            var result = COURSE.fnCheckSpecialChar($('#txtCourseName'));
            if (!result) {
                $('#spnCourseNameErr').html(surNameSPlCharValid);
                flag = false;
            }
        }
        if (courseCategory == 0) {
            $('#spnCourseCatErr').html("Please select Course category");
            flag = false;
        }

        /* Course Tage Validation*/
        var courseTags = $("#txtCourseTags").tokenInput('get');
        if (courseTags.length == 0) {
            //fnMsgAlert('info', 'Tags', 'Please enter / select one tag');
            //return false;
            $('#spnCourseTagsErr').html("Please enter / select one tag");
            flag = false;
        }
        else {
            var udTags = courseTags[0].id;
            if (udTags.length > 25) {
                //fnMsgAlert('info', 'Tags', 'Please enter "Tag" with in 25 characters');
                //return false;
                $('#spnCourseTagsErr').html("Please enter 'Tag' with in 25 characters");
                flag = false;
            }

            var letters = /^[a-zA-Z0-9 ]+$/;
            var result = letters.test(udTags);
            if (!result) {
                //fnMsgAlert('info', 'Tags', '"Tag" only accept [a-z 0-9] ');
                //return false;
                $('#spnCourseTagsErr').html("'Tag' only accept [a-z 0-9]");
                flag = false;
            }
        }
        /* Course Tage Validation*/

        if (coursePoints != "") {
            if (isNaN($.trim($('#txtCoursePoint').val()))) {
                $('#spnCoursePointErr').html(coursePointValidation);
                flag = false;
            }
            else {
                if ($('#txtCoursePoint').val() < 0) {
                    $('#spnCoursePointErr').html(coursePointValidation);
                    flag = false;
                }
                else {
                    if (parseInt($('#txtCoursePoint').val()) > 32767) {
                        $('#spnCoursePointErr').html(Course_Point_Valid);
                        flag = false;
                    }
                }
            }
        }
        if (courseDesc != '') {
            var result = COURSE.fnCheckSpecialCharForCourseDesc($('#txtCourseDesc'));
            if (!result) {
                $('#spnCourseDescErr').html(surDescSplCharValid);
                flag = false;
            }
        }
        if (courseInst != '') {
            var result = COURSE.fnCheckSpecialChar($('#txtCourseInstruct'));
            if (!result) {
                $('#spnCourseInstructErr').html(surInstSplChar);
                flag = false;
            }
        }
        return flag;
    },

    fnCheckSpecialChar: function (id) {
        if ($(id).val() != "") {
            //var specialCharregex = new RegExp("^[a-zA-Z0-9()' '\".+_\[<>%#;:{}*-\/,=?&]+$");
            var specialCharregex = new RegExp("^[a-zA-Z0-9()' '\".+_\[%#;:{}*-\/,=?]+$");
            if (!specialCharregex.test($.trim($(id).val()))) {
                return false;
            }
            else {
                return true;
            }
        }
        return true
    },
    fnCheckSpecialCharForCourseDesc: function (id) {
        if ($(id).val() != "") {
            var specialCharregex = new RegExp("^[a-zA-Z0-9()' '\".+_\[\\]<>%#;:{}*-\/,=?&]+$");
            //var specialCharregex = new RegExp(/^[a-zA-Z0-9()' '\".+_\[%#;:{}*\/,=?&]-+$/);

            if (!specialCharregex.test($.trim($(id).val()))) {
                return false;
            }
            else {
                return true;
            }
        }
        return true
    },

    fnClearTag: function () {
        $("#txtCourseTags").tokenInput("clear");
    },
    fnGetCourseTags: function (onSuccess) {
        $.ajax({
            type: "POST",
            url: '/AdCourse/GetCourseTags',
            data: "D",
            success: function (jsData) {
                if (jsData != null) {
                    jsData = eval(jsData);
                    var content = "";
                    var data = new Array();
                    content = "[";
                    for (var i = 0; i < jsData.length; i++) {
                        content += "{id:\"" + jsData[i].Tag_Id + "\",name:\"" + jsData[i].Tag_Name + "\"},";
                    }
                    content = content.slice(0, -1) + "]";

                    if (jsData.length == 0) {
                        content = "[]";
                    }

                    data = eval('(' + content + ')');
                    $("#txtCourseTags").tokenInput([data], {
                        theme: "facebook",
                        noResultsText: 'No Results, Press Enter to commit tag.',
                        allowFreeTagging: true,
                        preventDuplicates: true,
                        //tokenLimit: 1,
                        searchingText: 'Please press enter to accept the tag...',
                    });
                    if (onSuccess) onSuccess();
                }
            }
        });
    },
    fnBindCourseCategory: function (success) {
        $.ajax({
            type: "POST",
            data: "D",
            url: '/AdCourse/GetCourseCategory',
            success: function (jsData) {
                if (jsData != null) {
                    jsData = eval(jsData);
                    $('#ddCourseCategory').append("<option value='0'>Select Category</option>");
                    for (var j = 0; j < jsData.length; j++) {
                        $('#ddCourseCategory').append("<option value='" + jsData[j].Category_Id + "'>" + jsData[j].Category_Name + "</option>");
                    }
                }
                if (success) success(jsData);
            }
        });
    },
    fnFillCourseHeader: function (courseId) {
        $('#hdnCourseMode').val("EDIT");
        var courseIdArray = new Array();
        var s = {};
        s.name = "courseId";
        s.value = courseId;
        courseIdArray.push(s);
        DPAjax.requestInvoke("AdCourse", "GetSelectedCourse", courseIdArray, "POST", function (jsonData) {
            if (jsonData != null && jsonData != undefined) {
                if (jsonData.length > 0) {                                 
                    $('#txtCourseName').val(jsonData[0].Course_Name);
                    $('#txtCourseDesc').val(jsonData[0].Course_Description);
                    $('#txtCourseTags').val(jsonData[0].Course_Tags);


                    var tagName = jsonData[0].Course_Tags.split('^');
                    for (var i = 0; i < tagName.length; i++) {
                        if (tagName[i] != "") {
                            $("#txtCourseTags").tokenInput("add", { id: tagName[i], name: tagName[i] });
                        }
                    }

                    var selTag = document.getElementById('ddCourseCategory');
                    var opt = selTag.options;
                    for (var i = 0; i <= opt.length - 1; i++) {                     
                        if (parseInt(opt[i].value) == parseInt(jsonData[0].Course_Category_Id)) {                         
                            selTag.selectedIndex = i;
                        }
                    }                 

                  //  $('#txtCourseInstruct').val(jsonData[0].Course_Instruction);
                    if (jsonData[0].Course_Image_URL != null && jsonData[0].Course_Image_URL != '' && jsonData[0].Course_Image_URL != undefined) {                       
                        $('#dvSurImagePreview').empty().append('<img alt="" class="preview-thumb thumbnail img-responsive" src=""/>');
                        $('.preview-thumb').load(function () {
                        }).error(function () {
                        }).attr('src', jsonData[0].Course_Image_URL);
                        $('#dvSurImagePreview').show();
                    }
                    $('#hdnSurImageUrl').val(jsonData[0].Course_Image_URL);                 
                  //  $("input[name=rdCourseType][value=" + jsonData[0].Course_Type + "]").attr('checked', 'checked');
                 //   $('#txtCoursePoint').val(jsonData[0].Course_Point);
                    $('#hdnCourseId').val(jsonData[0].Course_Id);
                    $('#txtCourseImage').change(function () { COURSE.fnShowCourseImagePreview(this); });
                }
            }
        },
       function (result) { alert(result) });
    },
}