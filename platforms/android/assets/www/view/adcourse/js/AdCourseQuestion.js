var autoQuestions_g = "";
var autoAnswers_g = "";
var ansRowNum = 1;
var alphabets_g = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
var quesRowNum = 1;
var viewPageNo_g = 1;
var resultDelimiter = "~";

var QUESTIONS = {
    maxImageSize: 524288,
    checkedUser: new Array(),
    imageSizeExceed: function (size) {
        return 'Please upload file size less than ' + (size / 1024) + ' KB'
    },   
    fnInitializeEvents: function () {
        $('#dvQuestionTitle').html('Section Name: ' + sectionName_g);
        $('#btnAddQuestion').click(function () { QUESTIONS.fnShowAddQuestion(); });
        $('#btnQuestionNext').click(function () { QUESTIONS.fnUpdateQuestionOrder(); });
        $('#btnBackQuestion').click(function () {
            //QUESTIONS.fnShowAssetMappingPage();             
            var courseId = $('#hdnCourseId').val();
            var sectionId = $('#hdnSectionId').val();            
            var cName = $('#hdnCourseName').val();
            var sname = sectionName_g;
            window.location.href = '/AdCourse/AssetMapping/?cid=' + courseId + "&sid=" + sectionId + "&cname=" + cName + "&sname=" + sname;
        });
    },    
    getAddQuestionContents: function () { 
        var addQuesContent = "";        
        addQuesContent += '<div class="dvNewQuestAdd" id="dvAddNewQues">';

        addQuesContent += '<div class="col-lg-12 form-group">';
        addQuesContent += ' <div class="col-md-2" id="dvQuestText">' + dvQuestText + '</div>';
        addQuesContent += '<div class="col-md-10">';
        addQuesContent += '<div class="col-xs-11 clsPaddingNone">';
        addQuesContent += ' <textarea id="txtQuestion" class="form-control autoQuestions" maxlength="200"></textarea>';
        addQuesContent += ' <input type="hidden" id="hdnQuestionId" /><input type="hidden" id="hdnQuestMode" value="INSERT"/>';
        addQuesContent += '</div>';
        addQuesContent += '<div class="col-xs-1 clsPaddingNone clsMarginNone" id="dvtxtQuestionValid"></div>';
        addQuesContent += '</div>';
        addQuesContent += '</div>';

        addQuesContent += '<div class="col-lg-12 form-group"><div class="col-md-2"></div><div class="col-md-10">';
        addQuesContent += '<span id="spnQuestTxtErr" class="spnError"></span></div></div>';

        addQuesContent += '<div class="col-lg-12 form-group">';
        addQuesContent += '<div class="col-md-2" id="dvQuestTypeText">' + dvQuestTypeText + '</div>';
        addQuesContent += '<div class="col-md-10">';
        addQuesContent += '<input type="radio" name="rdQuestType" value="2" checked="checked" onchange="QUESTIONS.fnGetAnsByQuestionType();" />';
        addQuesContent += ' <span id="spnSingleChoice">' + spnSingleChoice + '</span></br>';
        addQuesContent += ' <input type="radio" name="rdQuestType" value="1" onchange="QUESTIONS.fnGetAnsByQuestionType();"/>';
        addQuesContent += '<span id="spnMultiChoice"> ' + spnMultiChoice + '</span></br>';
        addQuesContent += '<input type="radio" name="rdQuestType" value="0" onchange="QUESTIONS.fnGetAnsByQuestionType();"/>';
        addQuesContent += '<span id="spnSingleText"> ' + spnSingleText + '</span>';
        addQuesContent += '</div>';
        addQuesContent += ' <div class="clearfix"></div>';
        addQuesContent += '</div>';

        addQuesContent += ' <div class="col-lg-12 form-group">';
        addQuesContent += '<div class="col-md-2" id="dvQuesDescText">' + dvQuesDescText + '</div>';
        addQuesContent += '<div class="col-md-10"><div class="col-xs-11 clsPaddingNone">';
        addQuesContent += '<textarea class="clsQuesDesc form-control" maxlength="500" id="txtQuesDesc"></textarea>';
        addQuesContent += '</div>';
        addQuesContent += '<div class="col-xs-1 clsPaddingNone clsMarginNone" id="dvtxtQuesDescValid"></div>';
        addQuesContent += '</div> </div>';

        addQuesContent += '<div class="col-lg-12 form-group">';
        addQuesContent += '<div class="col-md-2"></div><div class="col-md-10">';
        addQuesContent += '<span id="spnQuestDescErr" class="spnError"></span></div></div>';

        addQuesContent += '<div class="col-lg-12 form-group">';
        addQuesContent += '<div class="col-md-2" id="dvQuestImageText">' + dvQuestImageText + '</div>';
        
        addQuesContent += '<div class="input-group col-md-9 clsQImg" >';

        addQuesContent += '<form onsubmit="return false;" id="question-form" method="post" enctype="multipart/form-data">';
        addQuesContent += '<input type="file" class="cls_display_none" name="postedFile" id="txtQuesImage" />';
        addQuesContent += '</form>';

        addQuesContent += '<input type="text" class="form-control clsReadOnlyText" id="txtSurQuesImg" readonly="readonly" />';
        addQuesContent += '<span class="input-group-btn">';
        addQuesContent += "<button class='btn btn-default btn-admin-file' id='btnQuesImg'";
        addQuesContent += 'type="button">';
        addQuesContent += uploadButtonText;
        addQuesContent += '</button>';
        addQuesContent += '</span>';

        addQuesContent += '</div></div>';

        addQuesContent += '<div class="col-lg-12 form-group">';
        addQuesContent += '<div class="col-md-2"></div>';
        addQuesContent += '<div class="clearfix col-md-8"><a id="lnkQuestImg" style="display:none;" onclick="QUESTIONS.fnShowQuesImagePreview();">Preview</a><input type="hidden" id="hdnQuesImgUrl"/></div>';
        addQuesContent += ' </div>';

        addQuesContent += '<div class="col-lg-12 form-group">';
        addQuesContent += '<div class="col-md-2"></div><div class="col-md-10">';
        addQuesContent += '<span id="spnQuestImgErr" class="spnError"></span></div></div>';

        addQuesContent += '<div class="col-lg-12 form-group" id="dvMainChoice" style="overflow: hidden;">';
        addQuesContent += '<div class="col-xs-2" id="dvChoiceText">' + dvChoiceText + '</div>';
        addQuesContent += '<div class="col-xs-10 table-responsive" id="dvChoices" style="overflow: auto;"><table class="table" id="tblAnswers" cellspacing="0" cellpadding="0"><tbody></tbody></table>';
        addQuesContent += ' </div>';
        addQuesContent += ' <div class="clearfix"></div>';
        addQuesContent += ' </div>';

        addQuesContent += '<div class="col-lg-12 form-group" id="dvSingle">';
        addQuesContent += '<div class="col-md-2" id="dvSingleText">Correct Answer</div>';
        addQuesContent += '<div class="col-md-10"><div class="col-xs-11 clsPaddingNone"><textarea class="clsQuesDesc form-control" maxlength="500" id="txtShortAnswer"></textarea>';
        addQuesContent += ' </div><div class="clearfix"></div>';
        addQuesContent += '<div class="col-xs-12 clsPaddingNone spnError" id="dvtxtShortAnsValid"></div>';
        addQuesContent += '</div> </div>';

        addQuesContent += '<div class="col-lg-12 form-group" style="display:none;">';
        addQuesContent += '<div class="col-md-2" id="dvQuesReqText">' + dvQuesReqText + '</div>';
        addQuesContent += '<div class="col-md-8">';
        addQuesContent += ' <input type="radio" name="rdQuestReq" value="1" checked="checked" />';
        addQuesContent += ' <span id="spnQuesReq">' + spnQuesReq + '</span></br>';
        addQuesContent += ' <input type="radio" name="rdQuestReq" value="0" />';
        addQuesContent += ' <span id="spnQuesNotReq">' + spnQuesNotReq + '</span>';
        addQuesContent += '</div>';
        addQuesContent += '<div class="clearfix"></div>';
        addQuesContent += ' </div>';
                
        addQuesContent += '<div class="col-lg-12 form-group">';
        addQuesContent += ' <div class="col-md-2"></div>';
        addQuesContent += '<div class="col-md-8">';
        addQuesContent += '<a class="btn btn-primary" href="#" id="btnQuestSubmit"></a>';
        addQuesContent += '&nbsp;&nbsp;<a class="btn btn-primary" href="#" id="btnQuestCancel" value=' + btnQuestCancel + ' ></a>';
        addQuesContent += '</div>';
        addQuesContent += '<div class="clearfix"></div>';
        addQuesContent += '<div class="col-lg-12 form-group" id="dvQuesSuccessInfo"></div>';
        addQuesContent += '</div>';
        addQuesContent += "</div>";
        return addQuesContent;
    },
    fnGetAnsByQuestionType: function () {
        var questionType = $("input[type='radio'][name='rdQuestType']:checked").val();
        $('#tblAnswers tr').remove();
        $('#dvMainChoice').show();
        $('#dvSingle').hide();
        if (questionType == "1" || questionType == "2") {
            var ansRowStr = QUESTIONS.getAnsRowContent();
            for (var i = 1; i <= 4; i++) {
                var currentStr = ansRowStr;
                $('#tblAnswers > tbody:last').append("<tr>" + currentStr.replace(/ANSNUM/g, ansRowNum) + "</tr>");
                ansRowNum = parseInt(ansRowNum) + 1;
            }            
            QUESTIONS.fnBindAnsAlphabets();
        }
        else {           
            $('#dvMainChoice').hide();
            $('#dvSingle').show();
        }
    },
    fnGetCourseQuestionAnswers: function () {        
        var arData = new Array();
        var courseId = {};
        courseId.name = "courseId";
        courseId.value = $('#hdnCourseId').val();

        var sectionId = {};
        sectionId.name = "sectionId";
        sectionId.value = $('#hdnSectionId').val();

        arData.push(courseId);
        arData.push(sectionId);

        DPAjax.requestInvoke("AdCourse", "GetCourseQuestionAnswers", arData, "POST",
            function (result) {                
                $('#dvQuestionContent').show();
                if (result != "NO_DATA") {
                    $('#dvAllQuestions').html(result);
                    quesRowNum = $('#dvAllQuestions table tr').length;
                    $('#tblCourseQuestions tr').mouseover(function () {
                        var curId = this.id;
                        $('#' + curId.replace("trQues", "dvMainQuesAction")).show();                        
                    }).mouseout(function () {
                        var curId = this.id;
                        $('#' + curId.replace("trQues", "dvMainQuesAction")).hide();                        
                    })
                    $('.clsbtnAddQuestion').show();                    
                }
                else {
                    QUESTIONS.fnShowAddQuestion();
                    $('#tblCourseQuestions tr').remove();                    
                    $('#btnAddQuestion').hide();
                    $('#btnBackQuestion').show();                    
                }
                QUESTIONS.fnShowAddQuestion();
                if ($('.dvNewQuestAdd').length == 0)
                    $('#btnAddQuestion').trigger('click');
            },
            function (result) {
                QUESTIONS.courseSubmitFailure(e)
            });
    },
    fnEditSurQuestion: function (courseId, questionId, rNo) {

        $('html, body').animate({
            'scrollTop': $("#dvMainAddQuestion_" + rNo).position().top
        });

        if ($('.dvNewQuestAdd').length == 0) {
            var courseIdArray = new Array();
            var s = {};
            s.name = "courseId";
            s.value = courseId;

            var q = {};
            q.name = "questionId";
            q.value = questionId;

            courseIdArray.push(s);
            courseIdArray.push(q);

            DPAjax.requestInvoke("AdCourse", "GeCourseQuestionDetails", courseIdArray, "POST",
                function (jsonData) {
                    QUESTIONS.fnFillEditedSurQuestDetails(rNo, jsonData);
                },
                function () {
                });
        }
        else {
            alert(courseQuesEditSingleMsg);
        }

    },
    fnFillEditedSurQuestDetails: function (rNo, jsonData) {
        var curId = this.id;
        $('#dvMainAddQuestion_' + rNo).html(QUESTIONS.getAddQuestionContents());
        if (jsonData.length > 0) {
            var questionJson = jsonData[0].lstQuestion;
            $('#txtQuestion').val(questionJson[0].Question_Text);
            $('#hdnQuestionId').val(questionJson[0].Question_Id);
            $('#hdnQuestMode').val('EDIT');
            $('#txtQuesDesc').val(questionJson[0].Question_Description);           
            if (questionJson[0].Question_Image_Url != null && questionJson[0].Question_Image_Url != undefined && questionJson[0].Question_Image_Url != "") {
                $('#dvQuesPreview').removeAttr("src");
                $('#dvQuesPreview').attr("src", questionJson[0].Question_Image_Url);
                $('#dvQuesPreview').show();                
            }
            $("input[type='radio'][name='rdQuestReq'][value=" + questionJson[0].Is_Required + "]").attr("checked", true);
            var questionType = questionJson[0].Question_Type;
            if (jsonData[0].lstAnswer.length > 0) {
                $("input[type='radio'][name='rdQuestType'][value=" + questionType + "]").attr("checked", true);
                if (questionType == "1" || questionType == "2") {
                    var ansRowStr = QUESTIONS.getAnsRowContent();
                    if (questionType == "1") {
                        for (var i = 1; i <= jsonData[0].lstAnswer.length; i++) {
                            var currentStr = ansRowStr
                            $('#tblAnswers > tbody:last').append("<tr>" + currentStr.replace(/ANSNUM/g, ansRowNum) + "</tr>");
                            $('#txtAnswerText_' + ansRowNum).val(jsonData[0].lstAnswer[parseInt(i) - 1].Answer_Text);
                            if (jsonData[0].lstAnswer[parseInt(i) - 1].Is_Correct_Answer) {
                                $("input[type=checkbox][id=ckBoxChecked_" + ansRowNum + "]").attr("checked", true);
                            }
                            ansRowNum = parseInt(ansRowNum) + 1;
                        }
                    }
                    else {
                        for (var i = 1; i <= jsonData[0].lstAnswer.length; i++) {
                            var currentStr = ansRowStr
                            $('#tblAnswers > tbody:last').append("<tr>" + currentStr.replace(/ANSNUM/g, ansRowNum) + "</tr>");
                            $('#txtAnswerText_' + ansRowNum).val(jsonData[0].lstAnswer[parseInt(i) - 1].Answer_Text);
                            if (jsonData[0].lstAnswer[parseInt(i) - 1].Is_Correct_Answer) {
                                $("input[type=radio][id=radioChecked_" + ansRowNum + "]").attr("checked", true);
                            }
                            ansRowNum = parseInt(ansRowNum) + 1;
                        }
                    }
                    // autoComplete(autoAnswers_g, "txtAnswerText", "hdnAnswerId", "autoAnswers");
                    QUESTIONS.fnBindAnsAlphabets();
                    $('#dvMainChoice').show();
                    $('#dvSingle').hide();
                }
                else {
                    $('#dvChoices').html('');
                    $('#dvMainChoice').hide();
                    $('#dvSingle').show();
                    $('#txtShortAnswer').val(jsonData[0].lstAnswer[0].Answer_Text);
                }
            }
            else {
                var ansRowStr = QUESTIONS.getAnsRowContent();
                for (var i = 1; i <= 4; i++) {
                    var currentStr = ansRowStr
                    $('#tblAnswers > tbody:last').append("<tr>" + currentStr.replace(/ANSNUM/g, ansRowNum) + "</tr>");
                    ansRowNum = parseInt(ansRowNum) + 1;
                }                
                QUESTIONS.fnBindAnsAlphabets();
                $('#dvMainChoice').show();
                $('#dvSingle').hide();
            }
           
            QUESTIONS.fnRegisQuestionEvents();
            $('#dvMainQuestion_' + rNo).hide();
            $('#dvMainAddQuestion_' + rNo).show();
        }
    },
    fnShowQuestionPage: function () {
        //$('#dvStep1').removeClass('active-full-circle');
        //$('#dvStep2').removeClass('active-full-circle');
        //$('#dvStep3').removeClass('active-full-circle');
        //$('#dvStep2').removeClass('inactive-full-circle');
        //$('#dvStep1').addClass('inactive-full-circle');
        //$('#dvStep2').addClass('active-full-circle');
        //$('#dvStep3').addClass('inactive-full-circle');
        
        $('#dvCourseContent').hide();
        $('#dvCourseAssetMapping').hide();
        $('#dvQuestionContent').show();
        $('#dvCoursePubContent').hide();
    },
    fnBindAnsAlphabets: function () {
        for (var i = 0; i < $('.clsAlpha').length ; i++) {
            $($('.clsAlpha')[i]).html(alphabets_g[i])
        }
    },
    getAnsRowContent: function () {        
        var answerRowContent = "";
        var questionType = $("input[type='radio'][name='rdQuestType']:checked").val();
        answerRowContent += '<td><div class="clsAlpha"></div></td>';
        answerRowContent += '<td class="tdAnswer"><div class="col-lg-12 clsPaddingNone"><input type="text" maxlength="200" class="clsAnswer autoAnswers form-control" id="txtAnswerText_ANSNUM" />';
        answerRowContent += '<input type="hidden" id="hdnAnswerId_ANSNUM"/></div><div class="col-lg-12 clsPaddingNone"><span id="spnAnsTxtErr_ANSNUM" class="spnError"></span></div> </td>';
        if (questionType == 2) {
            answerRowContent += '<td><input type="radio" name="radioChecked" class="clsRadio" value="" id="radioChecked_ANSNUM">&nbsp;Correct Answer</td>';            
        } else if (questionType == 1) {
            answerRowContent += '<td><input type="checkbox" name="ckBoxChecked" class="clsCheckBox" value="" id="ckBoxChecked_ANSNUM">&nbsp;Correct Answer</td>';           
        }
        answerRowContent += '<td >';
        answerRowContent += '<div class="col-lg-12 clsPaddingNone">';
        answerRowContent += '<div class="clsAddAns" onclick="QUESTIONS.fnAddAnsRow(this);"><i class="fa fa-plus-circle fa-lg"></i></div>';
        answerRowContent += '<div class="clsRemoveAns" onclick="QUESTIONS.fnRemoveAnsRow(this);"><i class="fa fa-minus-circle fa-lg"></i></div>';
        answerRowContent += '<div class="clsMoveUpAns" onclick="QUESTIONS.fnMoveUpAnsRow(this);"><i class="fa fa-arrow-circle-up fa-lg"></i></div>';
        answerRowContent += '<div class="clsMoveDownAns" onclick="QUESTIONS.fnMoveDownAnsRow(this);"><i class="fa fa-arrow-circle-down fa-lg"></i></div>';
        answerRowContent += '</div>';
        answerRowContent += '</td>';        
        return answerRowContent;
    },
    fnRemoveAnsRow: function (obj) {
        var row = $(obj).parents("tr:first");

        if ($('.clsAlpha').length != 2) {
            row.remove();
            QUESTIONS.fnBindAnsAlphabets();
        }
        else {
            alert("You cannot delete the rows");
            return false;
        }
    },
    fnMoveUpAnsRow: function (obj) {
        var row = $(obj).closest("tr");
        row.insertBefore(row.prev());
        QUESTIONS.fnBindAnsAlphabets();
    },
    fnMoveDownAnsRow: function (obj) {
        var row = $(obj).closest("tr");        
        $(row).next().after($(row));
        QUESTIONS.fnBindAnsAlphabets();
    },
    fnAddAnsRow: function (obj) {
        var id = obj.id;
        var index = $(obj).closest("tr").index();
        var row = document.getElementById("tblAnswers").insertRow(parseInt(index) + 1);
        row.innerHTML = QUESTIONS.getAnsRowContent().replace(/ANSNUM/g, ansRowNum);
        ansRowNum = parseInt(ansRowNum) + 1;
        QUESTIONS.fnBindAnsAlphabets();
    },
    fnShowAddQuestion: function () {        
        if ($('.dvNewQuestAdd').length == 0) {
            var content = QUESTIONS.getAddQuestionContents();            
            $('#dvAllQuestions').append(content);
            var questionType = $("input[type='radio'][name='rdQuestType']:checked").val();
            if (questionType == "1" || questionType == "2") {
                var ansRowStr = QUESTIONS.getAnsRowContent();
                for (var i = 1; i <= 4; i++) {
                    var currentStr = ansRowStr;
                    $('#tblAnswers > tbody:last').append("<tr>" + currentStr.replace(/ANSNUM/g, ansRowNum) + "</tr>");
                    ansRowNum = parseInt(ansRowNum) + 1;
                }
                QUESTIONS.fnBindAnsAlphabets();
                $('#dvMainChoice').show();
                $('#dvSingle').hide();
                $('#txtQuesImage').change(function () { QUESTIONS.fnShowSurQuesImagePreview(this); });
            }
            else {
                $('#dvChoices').html('');
                $('#dvMainChoice').hide();
                $('#dvSingle').show();
            }
            $('html, body').animate({
                'scrollTop': $("#dvAddNewQues").position().top
            });
            QUESTIONS.fnRegisQuestionEvents();
        }

        else {
            alert(courseQuesEditSingleMsg);
        }
    },
    fnRegisQuestionEvents: function () {        
        $('#btnQuesImg').click(function () { $('input[id=txtQuesImage]').click(); });
        $('#btnQuestSubmit').click(function () {
            $('#btnQuestSubmit').html('<i class="fa fa-spinner fa-spin"></i>');            
            $.blockUI();
            setTimeout(function () { QUESTIONS.courseQuestionAnswerSubmit(); }, 1000);
        })
        $('#btnQuestSubmit').html('<i class="fa fa-floppy-o"></i> ' + btnQuestSubmit);
        $('#btnQuestCancel').html('<i class="fa fa-times"></i> ' + btnQuestCancel);
        $('#txtQuestion').blur(function () { QUESTIONS.fnValidateSpecialChar("txtQuestion", "dvtxtQuestionValid", true); });
        $('#txtQuesDesc').blur(function () { QUESTIONS.fnValidateSpecialChar("txtQuesDesc", "dvtxtQuesDescValid", false); });
        $('#txtQuestion').keypress(function () { $('#spnQuestTxtErr').html(''); });        
        $('#txtQuesDesc').keypress(function () { $('#spnQuestDescErr').html(''); });
        $('#btnAddQuestion').hide();
        if ($('#hdnQuestMode').val() == "EDIT") {
            $('#btnQuestCancel').click(function () {
                var rNo = $($('#btnQuestCancel').closest("tr"))[0].id.split('_')[1];
                $('.dvNewQuestAdd').remove();
                $('#dvMainQuestion_' + rNo).show();
                $('#dvMainAddQuestion_' + rNo).hide();
                $('#btnAddQuestion').show();               
            });
        }
        else {
            $('#btnQuestCancel').click(function () {
                $('.dvNewQuestAdd').remove();
                $('#btnAddQuestion').show();
                $("html, body").animate({ scrollTop: $(document).height() - $(window).height() });
            });
        }

        $('#txtQuesImage').change(function () { QUESTIONS.fnShowSurQuesImagePreview(this); });
    },
    fnValidateSurQuestionAnswer: function () {        
        if ($('.tdAnswer span.spnError').hasClass('spnError')) {
            $('.tdAnswer span.spnError').html('');
        }
        var flag = true;
        var courseQuestion = $('#txtQuestion').val();
        var courseQuestionDesc = $('#txtQuesDesc').val();
        var courseQuestionImage = $('#txtQuesImage').val();
        var courseQuestionType = $("input[type='radio'][name='rdQuestType']:checked").val();
        var courseQuestionReq = $("input[type='radio'][name='rdQuestReq']:checked").val();
        var questionOrder = 1;

        if ($('#txtQuestion').closest("tr").length > 0) {
            questionOrder = $($('#txtQuestion').closest("tr"))[0].id.split("_")[1];
        }
        else {
            questionOrder = parseInt($('#tblCourseQuestions tr').length) + 1;
        }
        if ($.trim(courseQuestion) == '') {
            $('#spnQuestTxtErr').html(surQuesTxtEmptyMsg);
            flag = false;
        }
        else {
            var result = fnCheckSpecialChar($('#txtQuestion'));
            if (!result) {
                $('#spnQuestTxtErr').html(surQuesTxtSplErrMsg);
                flag = false;
            }
        }
        if ($.trim(courseQuestionDesc) != '') {
            var result = fnCheckSpecialCharForCourseDesc($('#txtQuesDesc'));
            if (!result) {
                $('#spnQuestDescErr').html(surQuesDescEmptyMsg);
                flag = false;
            }
        }

        var allAnswers = new Array();
        var isQuestionEntered = false;
        if (courseQuestionType != "0") {
            for (var i = 0; i < $('#tblAnswers tr').length; i++) {               
                var j = parseInt(i) + 1;
                var answerTextId = $('.clsAnswer')[i].id;
                if ($.trim($('#' + answerTextId).val()) != "") {
                    isQuestionEntered = true;
                    var result = fnCheckSpecialChar($('#' + answerTextId));
                    if (!result) {
                        $('#' + answerTextId.replace("txtAnswerText", "spnAnsTxtErr")).html(surQuestAnsSplErrMsg);
                        flag = false;
                    }
                }
                else {                    
                    $('#' + answerTextId.replace("txtAnswerText", "spnAnsTxtErr")).html("Please enter the answer");
                    flag = false;
                }
            }
            if (!isQuestionEntered) {
                alert('Please enter atleast one answer');
                flag = false;
            }
            if (isQuestionEntered && courseQuestionType == "2") {
                if ($("input[type='radio'][name='radioChecked']:checked").length == "") {
                    alert("Please choose atleast one option ")
                    flag = false;
                }
            }
            if (isQuestionEntered && courseQuestionType == "1") {
                if ($("input[type='checkbox'][name='ckBoxChecked']:checked").length == 0) {
                    alert("Please choose atleast one option ")
                    flag = false;
                }
            }
        }
        else {            
            if ($.trim($('#txtShortAnswer').val()) != "") {
                var result = fnCheckSpecialChar($('#txtShortAnswer'));
                if (!result) {
                    $('#dvtxtShortAnsValid').html(surQuestAnsSplErrMsg);
                    flag = false;
                }
            } else {
                $('#dvtxtShortAnsValid').html("Please enter text");
                flag = false;
            }
        }
        $.unblockUI();
        return flag;
    },
    courseQuestionAnswerSubmit: function () {        
        $('html, body').animate({
            'scrollTop': $("#dvAddNewQues").position().top
        });
        $.blockUI();
        $('#btnQuestSubmit').html('<i class="fa fa-spinner fa-spin"></i>');       
        var flag = QUESTIONS.fnValidateSurQuestionAnswer();
        if (flag) {           
            var courseQuestion = $.trim($('#txtQuestion').val());            
            var courseQuestionDesc = $.trim(escape($('#txtQuesDesc').val()));
            var courseQuestionImage = $.trim($('#txtQuesImage').val());
            var courseQuestionType = $("input[type='radio'][name='rdQuestType']:checked").val();
            var courseQuestionReq = $("input[type='radio'][name='rdQuestReq']:checked").val();
            //var courseQuestionHint = $.trim($('#txtQuesHint').val());
            var courseQuestionHint = "";
            var courseShortAnswer = "";
                      
            var questionOrder = 1;
            if ($('#txtQuestion').closest("tr").length > 0) {
                questionOrder = $($('#txtQuestion').closest("tr"))[0].id.split("_")[1];
            }
            else {
                questionOrder = parseInt($('#tblCourseQuestions tr').length) + 1;
            }

            var arData = new Array();
            var question = {};
            question.Question_Text = courseQuestion;
            question.Question_Description = encodeURIComponent(courseQuestionDesc);
            //question.Hint = courseQuestionHint;
            question.Question_Hint = "";
            question.No_Of_Correct_Answers = 1;

            if (courseQuestionHint != "" || courseQuestionHint != null) {
                question.Is_Hint_Available = 1;
            }
            else {
                question.Is_Hint_Available = 0;
            }
            // question.Question_Image_URL = courseQuestionImage;
            var fileName = "";
            if ($.browser.msie) {
                if ($('#txtQuesImage').val() != '') {
                    question.Question_Image_Url = $('#txtQuesImage').val().replace(/C:\\fakepath\\/i, '').split('\\').pop();
                    fileName = $('#txtQuesImage').val().replace(/C:\\fakepath\\/i, '').split('\\').pop();
                }
                else {
                    question.Question_Image_Url = '';
                }
            }
            else {
                if ($('#txtQuesImage').val() != '') {
                    if ($('#txtQuesImage').prop("files").length > 0) {
                        question.Question_Image_Url = $('#txtQuesImage').prop("files")[0].name;
                        fileName = $('#txtQuesImage').prop("files")[0].name;
                    }
                }
                else {
                    question.Question_Image_Url = '';
                }
            }

            question.Question_Type = courseQuestionType;
            //question.Is_Required = courseQuestionReq;
            question.Display_Order = questionOrder;
            
            var q = new Array();
            q.push(question);

            var allAnswers = new Array();
            if (courseQuestionType != "0") {
                for (var i = 0; i < $('#tblAnswers tr').length; i++) {                   
                    var answers = {};
                    var j = parseInt(i) + 1;
                    var answerTextId = $('.clsAnswer ')[i].id;
                    var answerSelected = "";
                    var answerChecked = "";
                    answers.Is_Correct_Answer = 0;
                    if (courseQuestionType == "2") {
                        answerSelected = $('.clsRadio')[i].id;                        
                        if ($('#' + answerSelected + '').is(':checked')) {
                            answers.Is_Correct_Answer = 1;
                        }
                    } else {
                        answerChecked = $('.clsCheckBox')[i].id;
                        if ($('#' + answerChecked + '').is(':checked')) {
                            answers.Is_Correct_Answer = 1;
                        }
                    }
                    if ($.trim($('#' + answerTextId).val()) != "") {

                        var result = fnCheckSpecialChar($('#' + answerTextId));
                        if (!result) {
                            $('#' + answerTextId.replace("txtAnswerText", "spnQuestDescErr")).html(surQuestAnsSplErrMsg);
                            flag = false;
                        }
                        else {
                            answers.Answer_Text = $.trim($('#' + answerTextId).val());                    
                        }
                        answers.Display_Order = j;
                        if ($('#' + answerTextId.replace("txtAnswerText", "hdnAnswerId")).length > 0 &&
                            $('#' + answerTextId.replace("txtAnswerText", "hdnAnswerId")) != null) {
                            if ($('#' + answerTextId.replace("txtAnswerText", "hdnAnswerId")).val() != '') {
                                answers.Answer_Id = $('#' + answerTextId.replace("txtAnswerText", "hdnAnswerId")).val();
                            }
                            else {
                                answers.Answer_Id = 0;
                            }
                        }
                        else {
                            answers.Answer_Id = 0;
                        }
                        allAnswers.push(answers);
                    }
                }                
            }
            else {
                var answers = {};
                //answers.Answer_Desc = "";
                answers.Display_Order = 1;
                answers.Answer_Id = 0;
                answers.Answer_Text = $.trim($('#txtShortAnswer').val());
                allAnswers.push(answers);
            }

            var questionJson = {};
            questionJson.name = "questionJson";
            questionJson.value = q;
            questionJson.type = "JSON";

            var answersJson = {};
            answersJson.name = "answersJson";
            answersJson.value = allAnswers;
            answersJson.type = "JSON";

            var courseId = {};
            courseId.name = "courseId";
            courseId.value = $('#hdnCourseId').val();
           
            var sectionId = {};
            sectionId.name = "sectionId";
            sectionId.value = $('#hdnSectionId').val();            

            var questionMode = {};
            questionMode.name = "questionMode";
            questionMode.value = $('#hdnQuestMode').val();

            var questionId = {};
            questionId.name = "questionId";
            if ($('#hdnQuestionId').val() == "") {
                questionId.value = 0;
            }
            else {
                questionId.value = $('#hdnQuestionId').val();
            }
                   
            
            arData.push(answersJson);
            arData.push(questionJson);
            arData.push(courseId);
            arData.push(questionMode);
            arData.push(questionId);
            arData.push(sectionId);
            
            DPAjax.requestInvoke("AdCourse", "InsertCourseQuestions", arData, "POST",
                 function (result) {
                     var arResult = result.split(resultDelimiter);
                     if (result.split(resultDelimiter)[0] == "SUCCESS") {                         
                         if (fileName != '' && fileName != null && fileName != undefined) {
                             var fileExt = fileName.split('.')[1];                             
                             $.blockUI();
                             BeginFileUpload($('#question-form'), "txtQuesImage", fileName, "FileUpload", "ChunkFileUpload",                             
                                 function (data) {
                                     QUESTIONS.fncourseQuesImgUpoadSuccess(data, result)
                                 },
                                 function (e) {
                                     QUESTIONS.fncourseQuesImgUpoadFailure(e)
                                 });
                         }
                         else {
                             $('#btnQuestSubmit').show();
                             QUESTIONS.courseSubmitSuccess(result, 'Question');
                         }
                         if ($('.dvNewQuestAdd').length == 0)
                             $('#btnAddQuestion').trigger('click');
                     }
                     else {
                         fnMsgAlert('ERROR', 'Course', arResult[2]);
                         $.unblockUI();
                     }
                 },
                 function (result) {
                     $.unblockUI();
                     $('#btnQuestSubmit').show();
                     fnMsgAlert('ERROR', 'Course', "Unable to save question, please try again.");
                 });
        }
        else {
            $('#btnQuestSubmit').show();            
            $('#btnQuestSubmit').html('<i class="fa fa-floppy-o"></i> ' + btnQuestSubmit);
            $.unblockUI();
        }
    },
    fncourseQuesImgUpoadSuccess: function (data, result) {
        $('#btnQuestSubmit').show();
        $('#btnQuestSubmit').html('<i class="fa fa-floppy-o"></i> ' + btnQuestSubmit);        
        QUESTIONS.courseSubmitSuccess(result, 'Question');
    },
    fncourseQuesImgUpoadFailure: function () {
        $('#btnQuestSubmit').show();
        $('#btnQuestSubmit').html('<i class="fa fa-floppy-o"></i> ' + btnQuestSubmit);
        fnMsgAlert('error', 'Course', surQuesImgUploadFailed);
    },
    courseSubmitSuccess: function (result, mode) {        
        var ar = result.split(resultDelimiter);
        if (mode == '') {                        
            $('#dvQuestionTitle').html('Section Name: ' + sectionName_g);
            $("#dvCreatedCourseName").show();
        }
        else {
            $('#btnQuestSubmit').html('<i class="fa fa-floppy-o"></i> ' + btnQuestSubmit);
        }
        $('#hdnCourseId').val(ar[1]);
        $('#btnCreateCourse').html("<i class='fa fa-floppy-o'></i> " + surSubmitText);        
        $('#dvAllQuestions').html('');
        if (mode == 'Question')
            QUESTIONS.fnGetCourseQuestionAnswers();
        else
            QUESTIONS.fnGetCourseAssetMappings();
        $('#btnAddQuestion').show();        
        $.unblockUI();
    },    
    fnMoveUpSurQuestion: function (courseId, questionId, rNo) {
        var row = $('#trQues_' + rNo);
        row.insertBefore(row.prev());
        QUESTIONS.fnBindQuestionNo();
    },
    fnMoveDownSurQuestion: function (courseId, questionId, rNo) {
        var row = $('#trQues_' + rNo);
        $(row).next().after($(row));
        QUESTIONS.fnBindQuestionNo();
    },
    fnBindQuestionNo: function () {
        for (var i = 0; i < $('.clsQuestionNo').length; i++) {
            $($('.clsQuestionNo')[i]).html(parseInt(i) + 1);
        }
    },
    fnDeleteSurQuestion: function (courseId, questionId, rNo) {
        var arData = new Array();
        var a = {};
        a.name = "courseId";
        a.value = courseId;

        var b = {};
        b.name = "questionId";
        b.value = questionId;

        arData.push(a);
        arData.push(b);

        DPAjax.requestInvoke("AdCourse", "DeleteCourseQuestion", arData, "POST",
            function (result) {
                if (result.split(resultDelimiter)[0] == "SUCCESS") {
                    alert(result.split(resultDelimiter)[1]);
                }
                else if (result.split(resultDelimiter)[0] == "ERROR") {
                    alert(result.split(resultDelimiter)[1]);
                }
                QUESTIONS.fnGetCourseQuestionAnswers();
            },
            function (e) { alert(e) });
    },
    fnUpdateQuestionOrder: function () {
        
        var courseId = $("#hdnCourseId").val();
        var sId = $("#hdnSectionId").val();
        var courseName = $("#hdnCourseName").val();
        $('#btnQuestionNext').html('<i class="fa fa-spinner fa-spin"></i>  ' + Course_Question_Next);        
        $.blockUI();
        if ($('#tblCourseQuestions tr').length > 0) {
            var arData = new Array();
            var questionOrder = 1;
            var quesAr = new Array();
            for (var i = 1; i <= $('#tblCourseQuestions tr').length; i++) {
                var ques = {};
                ques.Question_ID = $('#tblCourseQuestions tr')[parseInt(i) - 1].getElementsByClassName('tdQuesFirst')[0].getElementsByTagName('input')[0].value;                
                ques.Display_Order = i;
                ques.Course_Id = $('#hdnCourseId').val();
                quesAr.push(ques);
            }

            var questionJson = new Array();
            questionJson.name = "crQuestionJson";
            questionJson.value = quesAr;
            questionJson.type = "JSON";

            arData.push(questionJson);

            DPAjax.requestInvoke("AdCourse", "UpdateQuestionDisplayOrder", arData, "POST",
                function (result) {                    
                    $('#btnQuestionNext').html('<i class="fa fa-arrow-circle-right"></i> ' + Course_Question_Next);
                    if (result > 0) {
                        $.unblockUI();
                        window.location.href = '/AdCourse/SectionHome/?cid=' + courseId + '&cname=' + courseName;
                    }
                },
                function (result) { alert(result) });           
        }
        else {            
            $.unblockUI();
            $('#btnQuestionNext').html('<i class="fa fa-arrow-circle-right"></i> ' + Course_Question_Next);
            fnMsgAlert('info', 'dvAnsInfo', Course_Question_Mandatory);
        }       
    },
    fnGetCourseDetails: function (source) {       
        var curPageno = "1";
        if (source === undefined) {
            curPageno = "1";
        }
        else if (source == "n") {
            curPageno = $('#spncurPgno').html().length == 0 ? "1" : parseInt($('#spncurPgno').html()) + 1;
        }
        else if (source == "p") {
            curPageno = $('#spncurPgno').html().length == 0 ? "1" : parseInt($('#spncurPgno').html()) - 1;
        }
        else if (source == "c") {
            curPageno = $('#spncurPgno').html().length == 0 ? "1" : parseInt($('#spncurPgno').html());
        }
        else {
            curPageno = source;
        }
        var pg = {};
        pg.name = "pageNum";
        pg.value = curPageno;

        var dp = {};
        dp.name = 'utcOffset';
        dp.value = commonValues.getUTCOffset();

        var arData = new Array();
        var s = {};
        s.name = "courseName";
        s.value = $('#txtCourseName').val();
              
        if (s.value == "" || s.value === undefined) {
            s.value = "";
        }
               
        arData.push(pg);
        arData.push(s);
        arData.push(dp);

        DPAjax.requestInvoke("AdCourse", "GetCourseDetails", arData, "POST",
        function (result) {            
            var contentDiv = result.split('$')[0];
            var pgDetail = result.split('$')[1];
            $('#dvCrDetails').html(contentDiv);

            var totalPageSize = pgDetail.split('-')[0];
            var curPgNo = pgDetail.split('-')[1];
            $('#spncurPgno').html(curPgNo);
            $('#spnTotpgno').html(totalPageSize);
            QUESTIONS.SetPaging(totalPageSize, curPgNo);
        },
        function (result) { alert(result) });
    },
    SetPaging: function (totPages, curPagno) {       
        var options = "";
        for (var i = 1; i <= totPages; i++) {
            options += "<option value='" + i + "' onclick='QUESTIONS.PageChange(" + i + ")'>" + i + "</option>";
        }
        $('#drpPages').html(options);
        $('#drpPages').val(curPagno);
        if (curPagno == totPages) {
            $('#btnEditNxt').attr('disabled', true);
        }
        else {
            $('#btnEditNxt').attr('disabled', false);
        }
        if (curPagno == 1) {
            $('#btnEditPre').attr('disabled', true);
        }
        else {
            $('#btnEditPre').attr('disabled', false);
        }
    },
    PageChange: function (no) {
        $('#spncurPgno').html(no);
        QUESTIONS.fnGetCourseDetails(no);
    },
    fnEditCourse: function (courseId) {
        //var pgId = COURSE.fnGetParameterByName('pageId');
        //var a = {};
        //a.name = "courseId";
        //a.value = courseId;
        //var arData = new Array();
        //arData.push(a);
        window.location.href = '/AdCourse/CreateCourse/' + courseId;        
    },
    fnShowSurQuesImagePreview: function (input) {        
        var imgUrl = $('#txtQuesImage').val();
        if ($.trim(imgUrl) != '') {            
            if ($.browser.msie) {
                var imgUrl = $('#txtQuesImage').val().replace(/C:\\fakepath\\/i, '');
                var fileName = $('#txtQuesImage').val().replace(/C:\\fakepath\\/i, '').split('\\').pop();
                var arFileName = $('#txtQuesImage').val().replace(/C:\\fakepath\\/i, '').split('\\').pop().split('.');
                arFileName.reverse();
                if (arFileName[0].toUpperCase() == "JPG" || arFileName[0].toUpperCase() == "PNG" || arFileName[0].toUpperCase() == "JPEG" ||
                     arFileName[0].toUpperCase() == "BMP" || arFileName[0].toUpperCase() == "GIF") {                    
                    if (input.files[0].size <= QUESTIONS.maxImageSize) {
                        $('#txtSurQuesImg').val(fileName);
                        $('#spnQuestImgErr').html('');
                    } else {
                        $('#spnQuestImgErr').html(COURSE.imageSizeExceed(QUESTIONS.maxImageSize));
                        input.value = null;
                    }
                }
                else {
                    $('#spnQuestImgErr').html(surImgValid);
                    input.value = null;
                }
            }
            else {
                //var input = $('#txtSurImg');
                if (input.files && input.files[0]) {
                    var fileName = $('#txtQuesImage').prop("files")[0].name;
                    var arFileName = $('#txtQuesImage').prop("files")[0].name.split('.');
                    var fileNameAlone = arFileName[0];
                    arFileName.reverse();
                    if (arFileName[0].toUpperCase() == "JPG" || arFileName[0].toUpperCase() == "PNG" || arFileName[0].toUpperCase() == "JPEG" ||
                       arFileName[0].toUpperCase() == "BMP" || arFileName[0].toUpperCase() == "GIF") {
                        if (input.files[0].size <= QUESTIONS.maxImageSize) {
                            var filerdr = new FileReader();
                            filerdr.onload = function (e) {
                                $('#dvQuesPreview').attr('src', e.target.result);
                            }
                            filerdr.readAsDataURL(input.files[0]);
                            $('#txtSurQuesImg').val(fileNameAlone);
                            $('#dvQuesPreview').show();
                            $('#lnkQuestImg').show();
                            $('#spnQuestImgErr').html('');
                        } else {
                            $('#spnQuestImgErr').html(QUESTIONS.imageSizeExceed(QUESTIONS.maxImageSize));
                            console.log(input.value);
                            input.value = null;
                        }
                    }
                    else {
                        $('#spnQuestImgErr').html(surImgValid);
                        input.value = null;
                    }
                }
            }
        }
        else {
            $('#lnkQuestImg').hide();
        }
    },
    fnShowQuesImagePreview: function () {
        var input = $('#txtQuesImage');
        var imgUrl = $('#txtQuesImage').val();
        if ($('#hdnQuestMode').val() == "EDIT") {
            $("#dvImgModal").dialog({
                title: "Preview",
                buttons: {
                    Close: function () {
                        $(this).dialog('close');
                    }
                }
            });
        }
        else {
            if ($.trim(imgUrl) != '') {
               
                $("#dvImgModal").dialog({
                    title: "Preview",
                    buttons: {
                        Close: function () {
                            $(this).dialog('close');
                        }
                    }
                });                
            }
            else {
                $('#lnkQuestImg').hide();
            }
        }
    },
    fnValidateSpecialChar: function (controlName, msgDivName, isMandatory) {
        if ($('#' + controlName).val() != '') {
            if (controlName == "txtQuesDesc" || controlName == "txtCourseDesc") {
                var result = fnCheckSpecialCharForCourseDesc($('#' + controlName));
            }
            else {
                var result = fnCheckSpecialChar($('#' + controlName));
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
}

function fnCheckSpecialChar(id) {
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
}

function fnCheckSpecialCharForCourseDesc(id) {
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
}