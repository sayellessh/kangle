var course_test = {
	defaults: { userId: '', courseId: '', pageSize: 5, publishId: '', passPercentage: 100 },
	constants: { PAGENUMBER: 1, ISALLRECORDS: true, CONTENT_ID: 1,
		MANDATORY_ERROR_MSG: 'Questions that are  marked * need to be answered. Please answer those questions and then try submitting again'},
	totalCorrectAns: 0,
	init: function(appTesting) {
		//course_test.getQuestionAndAnswers();
		var url = window.location.href;
		url = url.substr(url.lastIndexOf('?')+1, url.length-1);
		url = url.split('&');
		
		var courseId = url[0],
			publishId = url[1];
		courseId = parseInt(courseId.replace('ccode=', ''));
		publishId = parseInt(publishId.replace('bcode=', ''));
		/*Code in course_service for companylogo*/
		setCompanyLogo();
		/*Code in course_service for companylogo*/
		course_test.defaults.userId = window.localStorage.getItem('userId');
		course_test.defaults.courseId = courseId;
		course_test.defaults.publishId = publishId;
		
		course_test.getQuestionAndAnswers();
	},
	getQuestionAndAnswers: function() {
		var _this = this;
		app.showLoading();
		course_services.getQuestionAnswerDetails(_this.defaults.userId, _this.defaults.courseId, _this.constants.PAGENUMBER, 
				_this.defaults.pageSize, _this.constants.ISALLRECORDS, _this.constants.CONTENT_ID, _this.defaults.publishId, function(data){
			app.hideLoading();
			if(data && data.length > 0) {
				course_test.bindQuestionAnswers(data);
			} else {
				alert('no questions found');
			}
		}, function(){
			app.hideLoading();
		});
	},
	bindQuestionAnswers: function(data) {
		var qAns = data[0];
		var courses = qAns.lstCourse,
			questions = qAns.lstQuestion,
			answers = qAns.lstAnswer,
			response = qAns.lstRespose;
		
		$('#dvTotalQues').html('Total Questions: ' + courses[0].No_Of_Questions);
        $('#hdnPassPercentage').val(courses[0].Pass_Percentage);
        
		var cBlock = $('#question-block');
		cBlock.empty();
		if(questions && questions.length > 0) {
			for (var i = 0; i < questions.length; i++) {
				var curQues = questions[i], count = (i+1);
				var $quesBlk = $('<div id="trQues_' + count + '" class="question"></div>');
				var html = '';
				
				var hdrInp = '<input type="hidden" id="hdnSurQuesId_' + count + '" value ="' + curQues.Question_ID + '"/>'+
					'<input type="hidden" id="hdnSurQuesType_' + count + '" value="' + curQues.Question_Type + '"/>';
				html += '<h3><span>Question: ' + count + '</span>' + hdrInp + '</h3>';
				html += '<div class="question-text">' + curQues.Question_Text + 
					(curQues.Is_Required == '1' ? '<span class="spnMand">*</span>' : '') + '</div>';
				html += '<div class="question-desc">' + curQues.Question_Desc + '</div>';
				
				if (curQues.Question_Image_URL != null && curQues.Question_Image_URL != '' && curQues.Question_Image_URL != undefined) {
	                html += '<div class="question-desc"><img class="ques-thumb" src="'+ questionJson[i].Question_Image_URL + '"/></div>';
	            }
				var ansHtml = '';
				answers = jsonPath(qAns.lstAnswer, "$[?(@.Question_ID=='" + curQues.Question_ID + "')]");
				if(answers && answers.length > 0) {
					for(var j = 0; j < answers.length; j++) {
						var answer = '';
						var curAns = answers[j];
						if(curQues.Question_Type == 1) {
							ansHtml += '<div class="checkbox">';
							ansHtml += '<label>';
							ansHtml += '<input type="checkbox" name="chkAnswers_'+count+'" value="' + curAns.Course_Mapper_ID + 
								'" data-correctanswerid="'+j+'"/>' + curAns.Answer_Desc + '</label>';
							ansHtml += '<input type="hidden" id="hdnCorrectAns_' + count + '_'+ j + '"  value="' + curAns.Is_Correct_Answer + '"/>'; 
							ansHtml += '<input type="hidden" id="hdnAnsweId_' + count + '_' + j + '" value="' + curAns.Answer_ID + '"/>';
							ansHtml += '<input type="hidden" id="hdnQuestionType_' + count + '_' + j + '" value="' + curAns.Question_Type + '"/>';
							ansHtml += '<input type="hidden" id="hdnCorrectAnswertext_' + count + '_' + j + '" value="' + curAns.Answer_Text + '"/>';
							ansHtml += '</div>';
						} else if (curQues.Question_Type == 2) {
							ansHtml += '<div class="clearfix radio">';
							ansHtml += '<label>';
							ansHtml += '<input type="radio" name="rdAnswers_' + count + '" value="' + curAns.Course_Mapper_ID + 
								'" data-correctanswerid="'+j+'"/>' + curAns.Answer_Desc + '</label>';
							ansHtml += '<input type="hidden" id="hdnCorrectAns_' + count + '_' + j + '" value="' + curAns.Is_Correct_Answer + '"/>';
							ansHtml += '<input type="hidden" id="hdnAnsweId_' + count + '_' + j + '" value="' + curAns.Answer_ID + '"/>';
							ansHtml += 	'<input type="hidden" id="hdnQuestionType_' + count + '_' + j + '" value="' + curAns.Question_Type + '"/>';
							ansHtml += '<input type="hidden" id="hdnCorrectAnswertext_' + count + '_' + j + '" value="' + curAns.Answer_Text + '"/>';
							ansHtml += '</div>';
						} else {
							ansHtml += '<textarea class="clstxtAnswers form-control" id="txtSurQuesAns_'+ count + '"></textarea>';
							ansHtml += '<input type="hidden" id="hdnAnsTextMapId_' + count + '" value="' + curAns.Course_Mapper_ID + '"/>';
							ansHtml += '<input type="hidden" id="hdnCorrectAns_' + count + '" value="' + curAns.Is_Correct_Answer + '"/>';
							ansHtml += '<input type="hidden" id="hdnAnsweId_' + count + '" value="' + curAns.Answer_ID + '"/>';
							ansHtml += '<input type="hidden" id="hdnQuestionType_' + count + '" value="' + curAns.Question_Type + '"/>';
							ansHtml += '<input type="hidden" id="hdnCorrectAnswertext_' + count + '" value="' + curAns.Answer_Text + '"/>';
							ansHtml = ansHtml + answer;
						}
						ansHtml = ansHtml + answer;
					}
				} /*else {
					ansHtml += '<textarea class="clstxtAnswers form-control" id="txtSurQuesAns_'+ count + '"></textarea>';
					ansHtml += '<input type="hidden" id="hdnAnsTextMapId_' + count + '" value="' + curAns.Course_Mapper_ID + '"/>';
					ansHtml += '<input type="hidden" id="hdnCorrectAns_' + count + '" value="' + curAns.Is_Correct_Answer + '"/>';
					ansHtml += '<input type="hidden" id="hdnAnsweId_' + count + '" value="' + curAns.Answer_ID + '"/>';
					ansHtml += '<input type="hidden" id="hdnQuestionType_' + count + '" value="' + curAns.Question_Type + '"/>';
					ansHtml += '<input type="hidden" id="hdnCorrectAnswertext_' + count + '" value="' + curAns.Answer_Text + '"/>';
				}*/
				html += ansHtml;
				$quesBlk.append(html);
				cBlock.append($quesBlk);
			}
			
			$('#question-block').append('<input id="submit-course-test" type="submit" value="Submit"/>');
		}
		this.bindActions();
	},
	bindActions: function() {
		var _this = this;
		$('#submit-course-test').unbind('click').bind('click', function(){
			_this.insertCourseResponse();
			return false;
		});
	},
	insertCourseResponse: function() {
		var inpArray = this.prepareObject();
		app.showLoading();
		if(inpArray) {
			course_services.insertCourseResponse(course_test.defaults.userId, inpArray, function(data){
				app.hideLoading();
				if(data) {
					var ar = data.split('~');
					if (ar[0] == "COMPLETED") {
	                     $('#submit-course-test').hide();
	                     //window.location.href = '/Course/ResultPage/?aid=' + result.split(resultDelimiter)[3] + '&pid=' + publishID_g;
	                     courseFile.deleteFolder(course_test.defaults.courseId, function(){
	                    	console.log('folder deleted'); 
                    	    window.location.href = 'Result_Page.html?aid=' + ar[3] + '&pid=' + course_test.defaults.publishId;
	                     }, function(a){
	                    	 window.location.href = 'Result_Page.html?aid=' + ar[3] + '&pid=' + course_test.defaults.publishId;
	                     });
	                 } else {
	                	 $('#question-block').html(ar[1].split('~')[0]);
	                	 $('#dvResInfo').html(ar[2]);
	                 }
				}
			}, function(){
				app.hideLoading();
			});
		} else {
			return false;
		}
	},
	prepareObject: function() {
		var det = this.prepareDetailsObject();
		var hdr = this.prepereHeaderObject();
		
		if(hdr && hdr.length > 0 && det && det != undefined) {
			var courseObj = {};
			courseObj.lstCourseUserAssessHeader = JSON.stringify(hdr);
			courseObj.lstCourseUserAssessDet = JSON.stringify(det.detailObj);
			courseObj.lstCourseUserAnswers = JSON.stringify(det.quesObtj);
			console.log(courseObj);
			return courseObj;
		}
		return false;
	},
	prepereHeaderObject: function() {
        var totalQuestions = $('.question').length;
        var achievedPercentage = (this.totalCorrectAns / totalQuestions) * 100;
        var result = 0;
        this.defaults.passPercentage = parseFloat($('#hdnPassPercentage').val());
        if (achievedPercentage >= this.defaults.passPercentage) {
            result = 1;
        }

        var assessmentHeaderJson = new Array();
        var assessmentHeader = {};
        assessmentHeader.Course_ID = course_test.defaults.courseId;
        assessmentHeader.Publish_ID = course_test.defaults.publishId;
        assessmentHeader.Achieved_Percentage = achievedPercentage;
        assessmentHeader.Pass_Percentage = $('#hdnPassPercentage').val();
        assessmentHeader.Is_Qualified = result;
        assessmentHeaderJson.push(assessmentHeader);

		return assessmentHeaderJson;
	},
	prepareDetailsObject: function() {
		var questions = $('#question-block .question');
		var headerArray = {};
		headerArray.detailObj = new Array();
		headerArray.quesObtj = new Array();
		for (var i = 1; i <= questions.length; i++) {
			var assessObj = {};
            var questionId = $('#hdnSurQuesId_' + i).val();
            var questionType = $('#hdnSurQuesType_' + i).val();
            assessObj = this.getByQuestionType(questionType, questionId, i);
            if(assessObj) {
	            if(questionType == 1) {
	            	var ques = assessObj.quesObj;
	            	if(ques && ques.length > 0) {
	            		for(var k = 0; k < ques.length; k++) {
	            			headerArray.quesObtj.push(ques[k]);
	            		}
	            	}
	            } else {
	            	headerArray.quesObtj.push(assessObj.quesObj);
	            }
            } else {
            	return false;
            }
            headerArray.detailObj.push(assessObj.assetObj);
		}	
		return headerArray;
		
		/*if(assessObj) {
	    	headerArray.detailObj.push(assessObj.quesObj);
	    	headerArray.quesObtj.push(assessObj.assetObj);
	    	//headerArray.push(assessObj);
	    } else {
	    	return false;
	    }*/
	},
	getByQuestionType: function(questionType, questionId, index) {
		if(questionType == 2) 
			return this.getByQuestionTypeTwo(index, questionId);
		else if (questionType == 1) {
			return this.getByQuestionTypeOne(index, questionId);
		} else 
			return this.getByQuestionTypeDefault(index, questionId);
		
	},
	getByQuestionTypeTwo: function(i, questionId) {
		var arRes = new Array(), detailArray = new Array();
		var quesObj = {}, assessmentDetail = {};
		var mapperId = 0, answerId = 0, correctAnswer = 0, userAnswerResult = 0, count = 0;
        
		if ($("input[type='radio'][name='rdAnswers_" + i + "']:checked").length > 0) {
			var currentChecked = $("input[type='radio'][name='rdAnswers_" + i + "']:checked");
			mapperId = $("input[type='radio'][name='rdAnswers_" + i + "']:checked").val();
            var correctanswerid = currentChecked.data('correctanswerid');
            answerId = $('#hdnAnsweId_' + i + '_' + correctanswerid).val();
            correctAnswer = $('#hdnCorrectAns_' + i + '_' + correctanswerid).val();
            if ($('#trQues_' + i + ' span').hasClass('spnMand')) {
                if (mapperId == 0) {
                    alert(course_test.constants.MANDATORY_ERROR_MSG);
                    return false;
                }
            }
            
            if (correctAnswer == 1) {
                userAnswerResult = 1;
                this.totalCorrectAns = parseInt(this.totalCorrectAns) + 1;
            }
            
            quesObj.Course_Mapper_ID = mapperId;
            quesObj.Question_ID = questionId;
            quesObj.Course_ID = course_test.defaults.courseId;
            quesObj.Publish_ID = course_test.defaults.publishId;
            quesObj.Answer_ID = answerId;
            quesObj.Answer_Text = '';
            arRes.push(quesObj);


            assessmentDetail.Question_ID = questionId;
            assessmentDetail.Course_ID = course_test.defaults.courseId;
            assessmentDetail.Publish_ID = course_test.defaults.publishId;
            assessmentDetail.Question_Type = 2;
            assessmentDetail.User_Answered_correct = userAnswerResult;
            assessmentDetail.Count_of_User_Answers = 1;
            detailArray.push(assessmentDetail);
		} else {
			if ($('#trQues_' + i + ' span').hasClass('spnMand')) {
                if (mapperId == 0) {
                	alert(course_test.constants.MANDATORY_ERROR_MSG);
                    return false;
                }
            }
		}
		return { quesObj: quesObj, assetObj: assessmentDetail };
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
//	getByQuestionTypeOne: function(i, questionId) {
//		var arRes = new Array(), detailArray = new Array();
//		var assessmentDetail = {};
//        var mapperId = 0, answerId = 0, correctAnswer = 0, userAnswerResult = 0, count = 0;
//        
//		var chkActive = $("input[type='checkbox'][name='chkAnswers_" + i + "']:checked"),
//			el = $("input[type='checkbox'][name='chkAnswers_" + i + "']");
//		if(chkActive.length > 0) {
//			userAnswerResult = 1;
//			el.each(function(ind, obj){
//				var quesAns = {};
//				var correctanswerid = $(obj).data('correctanswerid');
//                answerId = $('#hdnAnsweId_' + i + '_' + correctanswerid).val();
//                correctAnswer = $('#hdnCorrectAns_' + i + '_' + correctanswerid).val();
//                if (userAnswerResult == 1 && obj.checked && correctAnswer == 1) {
//                    userAnswerResult = 1;
//                } else if (userAnswerResult == 1 && !obj.checked && correctAnswer == 0) {
//                    userAnswerResult = 1;
//                } else {
//                    userAnswerResult = 0;
//                }
//                
//                console.log(obj.value);
//                if (obj.checked) {
//                    count = parseInt(count) + 1;
//                    	
//                    mapperId = obj.value;
//                    quesAns.Course_Mapper_ID = mapperId;
//                    quesAns.Question_ID = questionId;
//                    quesAns.Course_ID = course_test.defaults.courseId;
//                    quesAns.Publish_ID = course_test.defaults.publishId;
//                    quesAns.Answer_ID = answerId;
//                    quesAns.Answer_Text = '';
//                    arRes.push(quesAns);
//                }
//			});
//
//            if ($('#trQues_' + i + ' span').hasClass('spnMand')) {
//                if (count == 0) {
//                	alert(course_test.constants.MANDATORY_ERROR_MSG);
//                	return false;
//                }
//            }
//            
//            if (userAnswerResult == 1) this.totalCorrectAns = parseInt(this.totalCorrectAns) + 1;
//            assessmentDetail.Question_ID = questionId;
//            assessmentDetail.Course_ID = course_test.defaults.courseId;
//            assessmentDetail.Publish_ID = course_test.defaults.publishId;
//            assessmentDetail.Question_Type = 1;
//            assessmentDetail.User_Answered_correct = userAnswerResult;
//            assessmentDetail.Count_of_User_Answers = count;
//            detailArray.push(assessmentDetail);
//            
//		} else {
//			if ($('#trQues_' + i + ' span').hasClass('spnMand')) {
//				alert(course_test.constants.MANDATORY_ERROR_MSG);
//				return false;
//            }
//		}
//		
//		return { quesObj: arRes, assetObj: assessmentDetail };
//	},
	getByQuestionTypeDefault: function(i, questionId) {
		var arRes = new Array(), detailArray = new Array();
		var assessmentDetail = {}, quesAns = {};
		var mapperId = 0, answerId = 0, correctAnswer = 0, userAnswerResult = 0, count = 0, answerText = '';
        
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
            quesAns.Course_Mapper_ID = $('#hdnAnsTextMapId_' + i).val();
            quesAns.Question_ID = questionId;
            quesAns.Course_ID = course_test.defaults.courseId;
            quesAns.Publish_ID = course_test.defaults.publishId;
            quesAns.Answer_ID = answerId;
            quesAns.Answer_Text = answerText;
            arRes.push(quesAns);

            if (correctAns.toLowerCase() == answerText.toLowerCase()) {
                userAnswerResult = 1;
                this.totalCorrectAns = parseInt(this.totalCorrectAns) + 1;
            }
            assessmentDetail.Question_ID = questionId;
            assessmentDetail.Course_ID = course_test.defaults.courseId;
            assessmentDetail.Publish_ID = course_test.defaults.publishId;
            assessmentDetail.Question_Type = 0;
            assessmentDetail.User_Answered_correct = userAnswerResult;
            assessmentDetail.Count_of_User_Answers = 1;
            detailArray.push(assessmentDetail);
        }
        return { quesObj: quesAns, assetObj: assessmentDetail };
	},
	fnCheckSpecialChar: function(id) {
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
	fnCheckSpecialCharForCourseDesc: function(id) {
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
}