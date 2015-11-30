var course_test = {
    totalCorrectAns: 0,
    defaults: { userId: 0, companyId: 1, courseId: 0, publishId: 0, sectionId: 0, courseUserAssignmentId: 1, courseUserSectionId: 1 },
    init: function () {
        console.log(course_test.defaults);        
        course_test.pageLoadCall(function () {
            course_test.getQuestionAndAnswers();
        });
    },
    pageLoadCall: function (success) {
        Services.insertAdCourseSectionUserExamHeader(course_test.defaults.courseId, course_test.defaults.courseUserAssignmentId,
            course_test.defaults.courseUserSectionId, course_test.defaults.publishId, course_test.defaults.userId, course_test.defaults.companyId,
            course_test.defaults.sectionId, function () {

            var examObj = {};
            examObj.Company_Id = '';
            examObj.Course_User_Assignment_Id = course_test.defaults.courseUserAssignmentId;
            examObj.Course_Id = course_test.defaults.courseId;
            examObj.Publish_Id = course_test.defaults.publishId;
            examObj.User_Id = course_test.defaults.userId;

            Services.insertCourseUserExam(examObj, function () {
                if (success) success();
            }, function () { });
        }, function(){});

    },
    getQuestionAndAnswers: function () {
        var _this = this;
        $('#question-block').html('Loading...');
        Services.getQuestionAnswerDetails(course_test.defaults.companyId, course_test.defaults.userId, course_test.defaults.courseId,
            course_test.defaults.sectionId, course_test.defaults.publishId, function (data) {
			if (data && data.length > 0) {
				course_test.bindQuestionAnswers(data);
			} else {
				alert('no questions found');
			}
		}, function () { });
    },
    bindQuestionAnswers: function (data) {
        var qAns = data[0];
        var courses = qAns.lstCourse,
			questions = qAns.lstQuestion,
			answers = qAns.lstAnswer,
            correctQues = qAns.lstQuestionStatus,
			response = qAns.lstRespose;

        $('#dvTotalQues').html('Total Questions: ' + courses[0].No_Of_Questions);
        $('#hdnPassPercentage').val(courses[0].Pass_Percentage);

        var cBlock = $('#question-block');
        cBlock.empty();
        if (questions && questions.length > 0) {
            for (var i = 0; i < questions.length; i++) {
                var curQues = questions[i], count = (i + 1);
                var $quesBlk = $('<div id="trQues_' + count + '" class="question"></div>');
                if (this.getCorrectQuestionById(correctQues, curQues.Question_Id) > 0) {
                    $quesBlk.addClass('question-alt');
                }
                var html = '';

                var hdrInp = '<input type="hidden" id="hdnSurQuesId_' + count + '" value ="' + curQues.Question_Id + '"/>' +
					'<input type="hidden" id="hdnSurQuesType_' + count + '" value="' + curQues.Question_Type + '"/>';
                html += '<h3><span>Question: ' + count + '</span>' + hdrInp + '</h3>';
                html += '<div class="question-text">' + curQues.Question_Text +
					(curQues.Is_Required == '1' ? '<span class="spnMand">*</span>' : '') + '</div>';
                html += '<div class="question-desc">' + curQues.Question_Description + '</div>';

                if (curQues.Question_Image_Url != null && curQues.Question_Image_Url != '' && curQues.Question_Image_Url != undefined) {
                    html += '<div class="question-desc"><img class="ques-thumb" src="' + curQues.Question_Image_Url + '"/></div>';
                }
                var ansHtml = '';
                answers = jsonPath(qAns.lstAnswer, "$[?(@.Question_Id=='" + curQues.Question_Id + "')]");
                if (answers && answers.length > 0) {
                    for (var j = 0; j < answers.length; j++) {
                        var answer = '';
                        var curAns = answers[j];                        
                        if (curQues.Question_Type == 1) {
                            ansHtml += '<div class="checkbox">';
                            ansHtml += '<label>';
                            if ($quesBlk.hasClass('question-alt') && curAns.Is_Correct_Answer == 1) {
                                ansHtml += '<input type="checkbox" checked name="chkAnswers_' + count + '" value="' + curAns.Course_Mapper_ID +
                                    '" data-correctanswerid="' + j + '"/><p style="padding-left: 33px;">' + curAns.Answer_Text + '</p></label>';
                            } else {
                                ansHtml += '<input type="checkbox" name="chkAnswers_' + count + '" value="' + curAns.Course_Mapper_ID +
                                    '" data-correctanswerid="' + j + '"/><p style="padding-left: 33px;">' + curAns.Answer_Text + '</p></label>';
                            }
                            ansHtml += '<input type="hidden" id="hdnCorrectAns_' + count + '_' + j + '"  value="' + curAns.Is_Correct_Answer + '"/>';
                            ansHtml += '<input type="hidden" id="hdnAnsweId_' + count + '_' + j + '" value="' + curAns.Answer_Id + '"/>';
                            ansHtml += '<input type="hidden" id="hdnQuestionType_' + count + '_' + j + '" value="' + curAns.Question_Type + '"/>';
                            ansHtml += '<input type="hidden" id="hdnCorrectAnswertext_' + count + '_' + j + '" value="' + curAns.Answer_Text + '"/>';
                            ansHtml += '</div>';
                        } else if (curQues.Question_Type == 2) {
                            ansHtml += '<div class="clearfix radio">';
                            ansHtml += '<label>';
                            if ($quesBlk.hasClass('question-alt') && curAns.Is_Correct_Answer == 1) {
                                ansHtml += '<input type="radio" checked name="rdAnswers_' + count + '" value="' + curAns.Course_Mapper_ID +
								'" data-correctanswerid="' + j + '"/><p style="padding-left: 33px;">' + curAns.Answer_Text + '</p></label>';
                            } else {
                                ansHtml += '<input type="radio" name="rdAnswers_' + count + '" value="' + curAns.Course_Mapper_ID +
								'" data-correctanswerid="' + j + '"/><p style="padding-left: 33px;">' + curAns.Answer_Text + '</p></label>';
                            }
                            ansHtml += '<input type="hidden" id="hdnCorrectAns_' + count + '_' + j + '" value="' + curAns.Is_Correct_Answer + '"/>';
                            ansHtml += '<input type="hidden" id="hdnAnsweId_' + count + '_' + j + '" value="' + curAns.Answer_Id + '"/>';
                            ansHtml += '<input type="hidden" id="hdnQuestionType_' + count + '_' + j + '" value="' + curAns.Question_Type + '"/>';
                            ansHtml += '<input type="hidden" id="hdnCorrectAnswertext_' + count + '_' + j + '" value="' + curAns.Answer_Text + '"/>';
                            ansHtml += '</div>';
                        } else {
                            if ($quesBlk.hasClass('question-alt')) {
                                ansHtml += '<textarea class="clstxtAnswers form-control" id="txtSurQuesAns_' + count + '">' + curAns.Answer_Text
                                    + '</textarea>';
                            } else {
                                ansHtml += '<textarea class="clstxtAnswers form-control" id="txtSurQuesAns_' + count + '"></textarea>';
                            }
                            ansHtml += '<input type="hidden" id="hdnAnsTextMapId_' + count + '" value="' + curAns.Course_Mapper_ID + '"/>';
                            ansHtml += '<input type="hidden" id="hdnCorrectAns_' + count + '" value="' + curAns.Is_Correct_Answer + '"/>';
                            ansHtml += '<input type="hidden" id="hdnAnsweId_' + count + '" value="' + curAns.Answer_Id + '"/>';
                            ansHtml += '<input type="hidden" id="hdnQuestionType_' + count + '" value="' + curAns.Question_Type + '"/>';
                            ansHtml += '<input type="hidden" id="hdnCorrectAnswertext_' + count + '" value="' + curAns.Answer_Text + '"/>';
                            ansHtml = ansHtml + answer;
                        }
                        ansHtml = ansHtml + answer;
                    }
                } 
                html += ansHtml;
                $quesBlk.append(html);
                //if (curQues.Is_Correct == 1) {
                //    alert(10);
                //    $quesBlk.addClass('ques-alt');
                //}
                cBlock.append($quesBlk);
            }
            if ($('.question').not('.question-alt').size() > 0) {
                $('#question-block').append('<input id="submit-course-test" type="submit" value="Submit"/>');
            }
        }
        this.bindActions();
    },
    getCorrectQuestionById: function (obj, id) {
        var cnt = 0;
        if (obj && obj.length > 0 && id !== undefined) {
            for (var i = 0; i < obj.length; i++) {
                var curObj = obj[i];
                console.log(curObj.Is_Correct);
                if (curObj.Question_Id == id && curObj.Is_Correct == true) {
                    cnt++;
                }
            }
        }
        return cnt;
    },
    bindActions: function () {
        var _this = this;
        $('#submit-course-test').unbind('click').bind('click', function () {
            _this.insertCourseResponse();
            return false;
        });
    },
    insertCourseResponse: function () {
        var inpArray = this.prepareAnswerObject();
        console.log(inpArray);
        this.totalCorrectAns = 0;
        if (inpArray) {
            Services.insertCourseResponse(inpArray, course_test.defaults.companyId, course_test.defaults.userId, function (data) {
                console.log(data);
                var data = data.split('~');
                if (data[0] == "COMPLETED") {
                    alert('Test completed successfully.');
                    window.location.href = 'ResultPage.html?examId=' + data[3] + '&publishId='+course_test.defaults.publishId +
                        '&cId=' + course_test.defaults.courseId + '&sId=' + course_test.defaults.sectionId + '&aId=' +
                        course_test.defaults.courseUserAssignmentId + '&secId=' + course_test.defaults.courseUserSectionId;
                } else {
                    alert(data[2]);
                }
            }, function () { });
        }
    },
    prepareAnswerObject: function () {
        var det = this.prepareDetailsObject();
        var hdr = this.prepereHeaderObject();
        if (hdr && hdr.length > 0 && det != undefined) {
            var courseObj = {};
            courseObj.lstCourseUserAssessHeader = JSON.stringify(hdr);
            courseObj.lstCourseUserAssessDet = JSON.stringify(det.detailObj);
            courseObj.lstCourseUserAnswers = JSON.stringify(det.quesObtj);
            console.log(courseObj);
            return courseObj;
        }
        return false;
    },
    prepereHeaderObject: function () {
        var totalQuestions = $('.question').length;
        console.log(this.totalCorrectAns);
        var achievedPercentage = (this.totalCorrectAns / totalQuestions) * 100;
        var result = 0;
        this.defaults.passPercentage = parseFloat($('#hdnPassPercentage').val());
        if (achievedPercentage >= this.defaults.passPercentage) {
            result = 1;
        }

        var assessmentHeaderJson = new Array();
        var assessmentHeader = {};
        assessmentHeader.Company_Id = course_test.defaults.companyId;
        assessmentHeader.User_Id = course_test.defaults.userId;
        assessmentHeader.Course_Section_User_Exam_Id = 1;
        assessmentHeader.Course_User_Assignment_Id = course_test.defaults.courseUserAssignmentId;
        assessmentHeader.Couse_User_Section_Mapping_Id = course_test.defaults.courseUserSectionId;
        assessmentHeader.Course_ID = course_test.defaults.courseId;
        assessmentHeader.Publish_ID = course_test.defaults.publishId;
        assessmentHeader.Section_ID = course_test.defaults.sectionId;
        assessmentHeader.Achieved_Percentage = achievedPercentage;
        assessmentHeader.Pass_Percentage = $('#hdnPassPercentage').val();
        assessmentHeader.Is_Qualified = result;
        assessmentHeaderJson.push(assessmentHeader);

        console.log(assessmentHeaderJson);
        return assessmentHeaderJson;
    },
    prepareDetailsObject: function () {
        var questions = $('#question-block .question');
        var headerArray = {};
        headerArray.detailObj = new Array();
        headerArray.quesObtj = new Array();
        for (var i = 1; i <= questions.length; i++) {
            var assessObj = {};
            var questionId = $('#hdnSurQuesId_' + i).val();
            var questionType = $('#hdnSurQuesType_' + i).val();
            assessObj = this.getByQuestionType(questionType, questionId, i);
            if (assessObj) {
                if (questionType == 1) {
                    var ques = assessObj.ansObj;
                    if (ques && ques.length > 0) {
                        for (var k = 0; k < ques.length; k++) {
                            headerArray.quesObtj.push(ques[k]);
                        }
                    }
                } else {
                    headerArray.quesObtj.push(assessObj.ansObj);
                }
            } else {
                return false;
            }
            headerArray.detailObj.push(assessObj.assetObj);
        }
        return headerArray;

    },
    getByQuestionType: function (questionType, questionId, index) {
        if (questionType == 2)
            return this.getByQuestionTypeTwo(index, questionId);
        else if (questionType == 1) {
            return this.getByQuestionTypeOne(index, questionId);
        } else
            return this.getByQuestionTypeDefault(index, questionId);

    },
    getByQuestionTypeTwo: function (i, questionId) {
        var mapperId = 0, ansObj = {}, assessmentDetailObj = {}, countOfUserCorrectAnswer = 0, userAnswerResult = false;
        var ansEl = $("input[type='radio'][name='rdAnswers_" + i + "']:checked");
        if (ansEl.length > 0) {
            mapperId = ansEl.val();
            var correctanswerid = ansEl.data('correctanswerid');
            var correctAnswer = $('#hdnCorrectAns_' + i + '_' + correctanswerid).val(),
                answerId = $('#hdnAnsweId_' + i + '_' + correctanswerid).val();

            if ($('#trQues_' + i + ' span').hasClass('spnMand')) {
                if (mapperId == 0) {
                    alert(course_test.constants.MANDATORY_ERROR_MSG);
                    return false;
                }
            }

            if (correctAnswer == 1) {
                userAnswerResult = true;
                countOfUserCorrectAnswer = 1;
                this.totalCorrectAns = parseInt(this.totalCorrectAns,10) + 1;
            }

            ansObj.Company_Id = course_test.defaults.companyId;
            ansObj.User_Id =  course_test.defaults.userId;
            ansObj.Question_Id = questionId;
            ansObj.Answer_Id = answerId;


            assessmentDetailObj.User_Id = course_test.defaults.userId;
            assessmentDetailObj.Company_Id = course_test.defaults.companyId;
            assessmentDetailObj.Course_ID = course_test.defaults.courseId;
            assessmentDetailObj.Publish_ID = course_test.defaults.publishId;
            assessmentDetailObj.Section_Id = course_test.defaults.sectionId;

            assessmentDetailObj.Question_ID = questionId;
            assessmentDetailObj.Question_Type = 2;
            assessmentDetailObj.User_Answer_Id = answerId;
            assessmentDetailObj.Count_of_User_Answers = 1;
            assessmentDetailObj.Course_User_Assignment_Id = course_test.defaults.courseUserAssignmentId;
            assessmentDetailObj.Couse_User_Section_Mapping_Id = course_test.defaults.courseUserSectionId;
            assessmentDetailObj.Count_Of_User_Correct_Answers = countOfUserCorrectAnswer;
            assessmentDetailObj.Is_Correct = userAnswerResult;

        } else {
            if ($('#trQues_' + i + ' span').hasClass('spnMand')) {
                if (mapperId == 0) {
                    alert(course_test.constants.MANDATORY_ERROR_MSG);
                    return false;
                }
            }
        }
        return { ansObj: ansObj, assetObj: assessmentDetailObj };
    },
    
    //new change
    getByQuestionTypeOne: function (i, questionId) {
        var arRes = new Array(), detailArray = new Array();
        var assessmentDetailObj = {};
        var ansObj = {};
        var mapperId = 0, answerId = 0, correctAnswer = 0, count = 0, userCorrectAnswerCount = 0, totalAnsCount = 0;

        var chkActive = $("input[type='checkbox'][name='chkAnswers_" + i + "']:checked"),
   el = $("input[type='checkbox'][name='chkAnswers_" + i + "']");
        if (chkActive.length > 0) {
            el.each(function (ind, obj) {
                var correctanswerid = $(this).data('correctanswerid');
                answerId = $('#hdnAnsweId_' + i + '_' + correctanswerid).val();
                correctAnswer = $('#hdnCorrectAns_' + i + '_' + correctanswerid).val();
                if (correctAnswer == 1) {
                    userCorrectAnswerCount++;
                }

                if (this.checked) {
                    if (correctAnswer == 1) {
                        count = parseInt(count) + 1;
                    }
                    ansObj.Company_Id = course_test.defaults.companyId;
                    ansObj.User_Id = course_test.defaults.userId;
                    ansObj.Question_ID = questionId;
                    ansObj.Answer_ID = answerId;
                    arRes.push(ansObj);
                }
            });

            //if ($('#trQues_' + i + ' span').hasClass('spnMand')) {
            //    if (count == 0) {
            //        alert(course_test.constants.MANDATORY_ERROR_MSG);
            //        return false;
            //    }
            //}

            assessmentDetailObj.User_Id = course_test.defaults.userId;
            assessmentDetailObj.Company_Id = course_test.defaults.companyId;
            assessmentDetailObj.Course_ID = course_test.defaults.courseId;
            assessmentDetailObj.Publish_ID = course_test.defaults.publishId;
            assessmentDetailObj.Section_Id = course_test.defaults.sectionId;

            assessmentDetailObj.Question_ID = questionId;
            assessmentDetailObj.Question_Type = 1;
            assessmentDetailObj.Count_of_User_Answers = count;
            assessmentDetailObj.Count_Of_User_Correct_Answers = userCorrectAnswerCount;
            assessmentDetailObj.Course_User_Assignment_Id = course_test.defaults.courseUserAssignmentId;
            assessmentDetailObj.Couse_User_Section_Mapping_Id = course_test.defaults.courseUserSectionId;
            assessmentDetailObj.Is_Correct = (userCorrectAnswerCount == count ? true : false);
            if (assessmentDetailObj.Is_Correct) {
                this.totalCorrectAns = parseInt(this.totalCorrectAns, 10) + 1;
            }
            detailArray.push(assessmentDetailObj);

        } else {
            if ($('#trQues_' + i + ' span').hasClass('spnMand')) {
                alert(course_test.constants.MANDATORY_ERROR_MSG);
                return false;
            }
        }

        return { ansObj: arRes, assetObj: assessmentDetailObj };
    },
    //new change
//    getByQuestionTypeOne: function (i, questionId) {
//        var arRes = new Array(), detailArray = new Array();
//        var assessmentDetailObj = {};
//        var ansObj = {};
//        var mapperId = 0, answerId = 0, correctAnswer = 0, count = 0, userCorrectAnswerCount = 0;
//
//        var chkActive = $("input[type='checkbox'][name='chkAnswers_" + i + "']:checked"),
//			el = $("input[type='checkbox'][name='chkAnswers_" + i + "']");
//        if (chkActive.length > 0) {
//            el.each(function (ind, obj) {
//                var correctanswerid = $(this).data('correctanswerid');
//                answerId = $('#hdnAnsweId_' + i + '_' + correctanswerid).val();
//                correctAnswer = $('#hdnCorrectAns_' + i + '_' + correctanswerid).val();
//
//                if (this.checked) {
//                    count = parseInt(count) + 1;
//                    if (correctAnswer == 1) {
//                        userCorrectAnswerCount++;
//                    }
//
//                    ansObj.Company_Id = course_test.defaults.companyId;
//                    ansObj.User_Id = course_test.defaults.userId;
//                    ansObj.Question_ID = questionId;
//                    ansObj.Answer_ID = answerId;
//                    arRes.push(ansObj);
//                }
//            });
//
//            if ($('#trQues_' + i + ' span').hasClass('spnMand')) {
//                if (count == 0) {
//                    alert(course_test.constants.MANDATORY_ERROR_MSG);
//                    return false;
//                }
//            }
//
//            assessmentDetailObj.User_Id = course_test.defaults.userId;
//            assessmentDetailObj.Company_Id = course_test.defaults.companyId;
//            assessmentDetailObj.Course_ID = course_test.defaults.courseId;
//            assessmentDetailObj.Publish_ID = course_test.defaults.publishId;
//            assessmentDetailObj.Section_Id = course_test.defaults.sectionId;
//
//            assessmentDetailObj.Question_ID = questionId;
//            assessmentDetailObj.Question_Type = 1;
//            assessmentDetailObj.Count_of_User_Answers = count;
//            assessmentDetailObj.Count_Of_User_Correct_Answers = userCorrectAnswerCount;
//            assessmentDetailObj.Course_User_Assignment_Id = course_test.defaults.courseUserAssignmentId;
//            assessmentDetailObj.Couse_User_Section_Mapping_Id = course_test.defaults.courseUserSectionId;
//            assessmentDetailObj.Is_Correct = (userCorrectAnswerCount == count ? true : false);
//            if (assessmentDetailObj.Is_Correct) {
//                this.totalCorrectAns = parseInt(this.totalCorrectAns, 10) + 1;
//            }
//            detailArray.push(assessmentDetailObj);
//
//        } else {
//            if ($('#trQues_' + i + ' span').hasClass('spnMand')) {
//                alert(course_test.constants.MANDATORY_ERROR_MSG);
//                return false;
//            }
//        }
//
//        return { ansObj: arRes, assetObj: assessmentDetailObj };
//    },
    getByQuestionTypeDefault: function (i, questionId) {
        var arRes = new Array(), detailArray = new Array();
        var assessmentDetailObj = {}, ansObj = {};
        var mapperId = 0, answerId = 0, correctAnswer = 0, userCorrectAnswerCount = 0, count = 0, answerText = '';

        answerText = $.trim($('#txtSurQuesAns_' + i).val());
        if ($('#trQues_' + i + ' span').hasClass('spnMand')) {
            if ($.trim(answerText) == '') {
                alert(course_test.constants.MANDATORY_ERROR_MSG);
                return false;
            }
        }
        if ($.trim(answerText) != '') {
            var result = this.fnCheckSpecialChar($('#txtSurQuesAns_' + i));
            if (!result) {
                alert('Please remove the special characters from the answer text');
                return false;
            }

            var correctAns = $.trim($('#hdnCorrectAnswertext_' + i).val());
            ansObj.Company_Id = course_test.defaults.companyId;
            ansObj.User_Id = course_test.defaults.userId;
            ansObj.Question_ID = questionId;
            ansObj.Answer_ID = answerId;


            if (correctAns.toLowerCase() == answerText.toLowerCase()) {
                userCorrectAnswerCount = 1;
                this.totalCorrectAns = parseInt(this.totalCorrectAns, 10) + 1;
            }


            assessmentDetailObj.User_Id = course_test.defaults.userId;
            assessmentDetailObj.Company_Id = course_test.defaults.companyId;
            assessmentDetailObj.Course_ID = course_test.defaults.courseId;
            assessmentDetailObj.Publish_ID = course_test.defaults.publishId;
            assessmentDetailObj.Section_Id = course_test.defaults.sectionId;

            assessmentDetailObj.Question_ID = questionId;
            assessmentDetailObj.Question_Type = 0;
            assessmentDetailObj.Count_of_User_Answers = 1;
            assessmentDetailObj.Count_of_User_Answers = 1;
            assessmentDetailObj.Course_User_Assignment_Id = course_test.defaults.courseUserAssignmentId;
            assessmentDetailObj.Couse_User_Section_Mapping_Id = course_test.defaults.courseUserSectionId;
            assessmentDetailObj.Count_Of_User_Correct_Answers = userCorrectAnswerCount;
            assessmentDetailObj.User_Answer_Text = answerText;
            assessmentDetailObj.Is_Correct = (userCorrectAnswerCount == 1 ? true : false);
            detailArray.push(assessmentDetailObj);
        }
        return { ansObj: ansObj, assetObj: assessmentDetailObj };
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
    }
};