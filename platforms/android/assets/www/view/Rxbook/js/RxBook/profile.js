var profile = {
    isAdmin: true,
    currentUser: null,
    educationDetails: null,
    workDetails: null,
    interests: null,
    events: null,
    init: function () {
        var companyLogoUrl = window.localStorage.getItem("companyLogoUrl");
        if(companyLogoUrl === undefined || companyLogoUrl === '' || companyLogoUrl === null)
            companyLogoUrl = '';
        
        //$('header .logo a').css('background', 'url(' + companyLogoUrl + ') no-repeat center left');
        $('header .logo a').css({'background-image':'url('+companyLogoUrl+')',
                                'background-position': '0% 50%',
                                'background-repeat': 'no-repeat',
                                });

        var _this = this;
        profile.getUserDetails();
        //profile.editSpeciality();
        if(profile.isAdmin)
            $('h3 .add-list, h3 .edit-list').show();
        else
            $('h3 .add-list, h3 .edit-list').hide();

        _this.getUserImportantDate(function () {
            _this.getUserEducationDetails();
            _this.getUserWorkDetails();
            _this.getUserInterestDetails();
            _this.getLifeEvents();
        });
        app.getUnreadCounts();
        pubnub.bindChat = app.onMessageReceived;
        /*Services.getUserEducation(curUserId, function (data) {
            profile.getEducationDetails(data);
        }, function (error) { console.log(error); });

        Services.getUserHospitals(curUserId, function (data) {
            profile.getHospitalDetails(data);
        }, function (error) { console.log(error); });

        Services.getUserMemberOfDetails(curUserId, function (data) {
            profile.getSubscribedDetails(data);
        }, function (error) { console.log(error); });

        Services.getUserPublishedDetails(curUserId, function (data) {
            profile.getPublishedDetails(data);
        }, function (error) { console.log(error); });

        Services.getUserAwards(curUserId, function (data) {
            profile.getAwardDetails(data);
        }, function (error) { console.log(error); });

        Services.getUserInterests(curUserId, function (data) {
            profile.getInterests(data);
        }, function (error) { console.log(error); });

        profile.getUserSpecialities();*/
        
        $(".header-menu li").bind("click", function(e) {
        	var href = $(this).find("a").attr("href");
        	if(href != null && href != "" && href != "#") {
        		window.location.href = href;
        	}
        });

        $('.doctor-profile .edit-list').unbind('click').bind('click', function () {
            var el = $(this).parents('h3').eq(0).next();
            if (el.hasClass('editProfile'))
                el.removeClass('editProfile');
            else
                el.addClass('editProfile');
            return false;
        });
        $('body').append('<div class="loader-div" style="display: none"><img class="loader" src="images/RxBook/loader_new.gif" alt=""/></div>');
    },

    getUserImportantDate: function(success) {
        var _this = this;
        Services.getUserImportantDate(curUserId, function (data) {
            _this.bindUserImportantDate(data, success);
        }, function (e) { 
        	app.bindUserErrorFeed($('#content'), networkProblemError);
        });
    },
    bindUserImportantDate: function (data, success) {
        var _this = this;
        $('#empDoa p').show();
        $('#empDob p').show();
        $('#empDob input').hide();
        $('#empDoa input').hide();
        if (data != null && data.length > 0) {
            var obj = data[0];
            _this.currentUser = obj;
            $('#empName p').html(obj.User_Name);

            if (obj.Designation != null && obj.Designation != '')
                $('#empDesig p').html(obj.Designation);
            else
                $('#empDesig p').html('N/A');

            $('#empRegion p').html(obj.Region_Name);

            if (obj.DOA != null && obj.DOA != '')
                $('#empDoa p').html(obj.DOA);
            else
                $('#empDoa p').html('N/A');
            if (obj.DOB != null && obj.DOB != '')
                $('#empDob p').html(obj.DOB);
            else
                $('#empDob p').html('N/A');

            $('#empDob input[name="emp-dob"],#empDoa input[name="emp-doa"]').pickadate({
                format: 'dd/mm/yyyy',
                formatSubmit: 'dd/mm/yyyy'
            });
            $('#aboutme-edit, #aboutme-edit .edit').unbind('click').bind('click', function (e) {
                $('.about-me .save-list').show();
                $('#empDob p').hide();
                $('#empDob input').show();
                $('#empDob input').val(obj.DOB);
                $('#empDoa p').hide();
                $('#empDoa input').show();
                $('#empDoa input').val(obj.DOA);
            });
            $('.about-me .save').unbind('click').bind('click', function (e) {
                var dobval = $('#empDob input[name="emp-dob"]').val();
                var doaval = $('#empDoa input[name="emp-doa"]').val();
                var arrayObj = new Array();
                var aboutObj = {
                    User_Id: curUserId,
                    DOB: dobval,
                    DOA: doaval
                };
                arrayObj.push(aboutObj);
                Services.saveUserImportantDate(arrayObj, function (data) {
                    profile.getUserImportantDate();
                });
                return false;
            });
            $('.about-me .cancel').unbind('click').bind('click', function (e) {
                profile.getUserImportantDate();
                return false;
            });

        }
        $('.about-me .save-list').hide();
        if (success) success();
    },

    getUserEducationDetails: function () {
        var _this = this;
        $('.add-educ').unbind().bind('click', function (e) {
            $('.education ul li.addLi').remove();
            $('.education ul li').find('.two-col-field').remove();
            $('.education ul li').find('.educationDisplayDiv').show();
            _this.editEducations();
            return false;
        });

        Services.getUserEducationDetails(curUserId, function (data) {
            _this.educationDetails = data;
            _this.bindUserEducationDetails(data);
        }, function (e) { });
    },
    bindUserEducationDetails: function (data) {
        var _this = this;
        var content = $('.contents.education');
        if (data && data.length > 0) {
            content.html('<ul></ul>').data('fEduObj', data);
            for (var i = 0; i < data.length; i++) {
                var $li = $('<li></li>'), curObj = data[i];
                var $div = $('<div class="educationDisplayDiv"></div>');
                var $innerDiv = $('<div class="inner-cont"></div>');
                $innerDiv.append('<span class="li-bulletin fa fa-circle"></span>');
                $innerDiv.append('<div class="title">' + curObj.Education_Name + '</div>');

                var $desc = $('<div class="desc"></div>');
                $desc.append('<span>' + curObj.Institution_Name + ', </span>');
                if (curObj.Is_Current_Education == '0') {
                    $desc.append('<span>' + curObj.Education_From + ' - ' + curObj.Education_To + ', </span>');
                } else {
                    $desc.append('<span>' + curObj.Education_From + ' - Present, </span>');
                }
                $desc.append('<span>' + curObj.City_Name + '</span>');

                $innerDiv.append($desc);

                var $actionsDiv = $('<div class="edit-actions"></div>');
                if (profile.isAdmin) {
                    var $editBtn = $('<a href="#" class="fa fa-pencil" title="edit"></a>');
                    $editBtn.bind('click', function (e) {
                        var obj = ($(this));
                        profile.editEducations(obj);
                        return false;
                    });
                    var $delBtn = $('<a href="#" class="fa fa-trash-o" title="delete"></a>');

                    $delBtn.bind('click', function (e) {
                        var obj = ($(this));
                        profile.showLoader();
                        var intObj = $('.contents.education').data('fEduObj'),
                                clickObj = $(this).parents('li').eq(0).data('edObj');
                        var interestObj = new Array();
                        for (var i = 0; i < intObj.length; i++) {
                            var curObj = intObj[i];
                            if (curObj.User_Education_Id == clickObj.User_Education_Id) {
                                Services.deleteUserEducation(curObj.User_Id, curObj.User_Education_Id, function (data) {
                                    profile.getUserEducationDetails();
                                    profile.hideLoader();
                                });
                            }

                        }
                        return false;
                    });
                    $actionsDiv.append($editBtn);
                    $actionsDiv.append($delBtn);
                }

                $div.append($innerDiv);
                $div.append($actionsDiv);

                $li.append($div);
                $li.data('edObj', curObj).addClass('list-item');
                $('ul', content).append($li);
            }
        } else {
            content.html('<ul><li class="addLi"><div class="empty">' +
                (profile.isAdmin ? 'No details found, please click on Add to add a detail' : _this.currentUser.User_Name + ' haven\'t mentioned about his education.') +
                '</div></li></ul>').data('fEduObj', new Array());
        }
       
    },

    editEducations: function (data) {
        var _this = this;
        var curData = {};

        if (data != null) {
            curData = data.parents('li').data('edObj');
            data.parents('ul').find('li').find('.two-col-field').remove();
            data.parents('ul').find('li').find('.educationDisplayDiv').show();
            data.parents('.educationDisplayDiv').hide();
        } else {
            if ($('.education ul').length > 0)
                $('.education ul').prepend('<li class="addLi"></li>');
            else {
                $('.education').html('<ul></ul>');
                $('.education ul').prepend('<li class="addLi"></li>');
            }
        }
        var currentYear = new Date().getFullYear();
        var html = '';
        html += '<div class="two-col-field">';
        html += '<div class="field" id="colgname"><b>College Name</b><input type="text" id="college_name" name="college_name" value="' + (curData.Institution_Name ? curData.Institution_Name : '') + '" /></div>';
        html += '<div class="field" id="eduname"><b>Degree Name</b><input type="text" id="education_name" name="education_name" value="' + (curData.Education_Name ? curData.Education_Name : '') + '" /></div>';
        html += '<div class="field" id="timeperiod"><b>From </b>';
        var fromDate = curData.Education_From?curData.Education_From:null;
        var toDate = curData.Education_To ? curData.Education_To : null;
        html += '<select id="eduFrom" name="eduFrom">';
        html += '<option value="0">Year</option>';
        for (var i = 1980; i <= currentYear; i++) {
            html += '<option value="' + i + '" ' + (i == fromDate?'selected':'') + '>' + i + '</option>';
        }       
        html += '</select>';
       
        html += '<span>&nbsp;To&nbsp;</span> ';
        html += '<select ' + (curData.Is_Current_Education == 1 ? 'disabled="disabled"' : '') + ' id="eduTo">';
        html += '<option value="0">Year</option>';
        for (var i = 1980; i <= currentYear; i++) {
           
            html += '<option value="' + i + '" ' + (i == toDate ? 'selected' : '') + '>' + i + '</option>';
        }
        html += '</select>';
        html += '</div>';
        html += '<div class="field" id="edu-present"><b>Present</b><input type="checkbox" name="present" value="present" id="check-present" ' + (curData.Is_Current_Education==1?'checked="checked"':'') + '></div>';
        html += '<div class="field" id="colgcity"><b>Education City</b><input type="text" value="' + (curData.City_Name?curData.City_Name:'') + '" /></div>';
        html +='<div style="" class="save-list"><a href="#" class="save" title="save">Save</a><a href="#" class="cancel" title="Cancel">Cancel</a></div>';
        html += '</div>';
        
        var $html = $(html);
        $('#check-present', $html).bind('click', function (e) {
            if ($(this).is(':checked')) {
                $('#timeperiod span, #eduTo', $html).hide();
            } else {
                $('#timeperiod span, #eduTo', $html).show();
            }
        });
        profile.autoCompleteEducation();
        var saveBtn = $html.find('.save-list').find('.save');
        saveBtn.click('click', function (e) {
            var eduAry = $('.education').data('fEduObj');
            if ($('#college_name').val() == '') {
                alert('Please enter college name');
                return false;
            }
            if ($('#education_name').val() == '') {
                alert('Please enter Degree Name');
                return false;
            }
            var eduFrom = $('#eduFrom');
            if (eduFrom.val() == '0') {
                alert('Please select from year');
                return false;
            }
            var eduTo = $('#eduTo');
            var presentCheck = $('#edu-present input');
            if (eduTo.val() == '0' && !presentCheck.is(':checked')) {
                alert('Please select to year or check present');
                return false;
            }
            if ($('#colgcity input').val() == '') {
                alert('Please enter Education City');
                return false;
            }
           
            var outAry = new Array();
            if (eduAry != null) {
                for (var i = 0; i <= eduAry.length - 1; i++) {
                    if (eduAry[i].User_Education_Id != curData.User_Education_Id)
                        outAry.push(eduAry[i]);
                }
            }
            var obj = {
                Institution_Name: $('#college_name').val(),
                Education_Name: $('#education_name').val(),
                Education_From: $('#eduFrom').val(),
                Education_To: $('#eduTo').val(),
                Is_Current_Education: $('#edu-present input').is(':checked') ? 1 : 0,
                City_Name: $('#colgcity input').val()
            };
            outAry.push(obj);
            console.log(outAry);
            Services.saveUserEducationDetails(outAry, function (data) {
                console.log(data);
                profile.getUserEducationDetails();
            });
            return false;
            // find the mode -> add or edit
                //  - if addLi mode = add
                //    else  mode = edit
            //  get the education array
            // if editMode
                // get the li object -> education Obj id
                // educationId
                // education array loop
                // var bPresent = check if degree already exist (seperate function)  ()
                // if education_id = loop eductaion_id
                    // bPresent true -> update whole object 
                    // bPresent false -> return
            // else 
                // eductaion array
                // var bPresent = check if degree already exist (seperate function)
                // bPresent true new obj create 
                    // education array push new obj
                // bpresent false 

        });
        var cancelBtn = $html.find('.save-list').find('.cancel');
        cancelBtn.click('click', function (e) {
            if (data != null) {
                data.parents('ul').find('li').find('.two-col-field').remove();
                data.parents('ul').find('li').find('.educationDisplayDiv').show();
            }
            $('.education ul li.addLi').remove();
            _this.bindUserEducationDetails(_this.educationDetails);
            return false;
        });
        if (data != null)
            data.parents('li').append($html);
        else
            $('.education ul li.addLi').append($html);
    },



    autoCompleteEducation: function () {
        Services.getAllEducation(function (data) {
           // alert(JSON.stringify(data))
           var collegeName = new Array();
           for (var i = 0; i < data.lstInstitution.length; i++) {
               collegeName.push(data.lstInstitution[i].Institution_Name);
            }
            $('input[name="college_name"]').typeahead(profile.autoCompleteOptions, {
                name: 'college_name', displayKey: 'value',
                source: profile.stringMatches(collegeName)
            });
            var educationName = new Array();
            for (var i = 0; i < data.lstEducation.length; i++) {
                educationName.push(data.lstEducation[i].Education_Name);
            }
            $('input[name="education_name"]').typeahead(profile.autoCompleteOptions, {
                name: 'education_name', displayKey: 'value',
                source: profile.stringMatches(educationName)
            });
        }, function () { });
    },

    getUserWorkDetails: function () {
        var _this = this;
        $('.add-work').unbind().bind('click', function (e) {
            $('.work ul li.addLi').remove();
            $('.work ul li').find('.two-col-field').remove();
            $('.work ul li').find('.workDisplayDiv').show();
            _this.editWork();
            return false;
        });
        Services.getUserWorkDetails(curUserId, function (data) {
            _this.workDetails = data;
            _this.bindUserWorkDetails(data);
        }, function (e) { });
    },
    bindUserWorkDetails: function (data) {
        var _this = this;
        var content = $('.contents.work');
        if (data && data.length > 0) {
            content.html('<ul></ul>').data('fWorkObj', data);
            for (var i = 0; i < data.length; i++) {
                var $li = $('<li></li>'), curObj = data[i];
                var $div = $('<div class="workDisplayDiv"></div>');
                var $innerDiv = $('<div class="inner-cont"></div>');
                $innerDiv.append('<span class="li-bulletin fa fa-circle"></span>');
                $innerDiv.append('<div class="title">' + curObj.Work_Name + '</div>');

                var $desc = $('<div class="desc"></div>');
                $desc.append('<span>' + curObj.Work_Position + ', </span>');
                if (curObj.Is_Current_Work == '0') {
                    $desc.append('<span>' + curObj.Work_From + ' - ' + curObj.Work_To + ', </span>');
                } else {
                    $desc.append('<span>' + curObj.Work_From + ' - Present, </span>');
                }
                $desc.append('<span>' + curObj.City_Name + '</span>');

                $innerDiv.append($desc);

                var $actionsDiv = $('<div class="edit-actions"></div>');
                if (profile.isAdmin) {
                    var $editBtn = $('<a href="#" class="fa fa-pencil" title="edit"></a>');
                    $editBtn.bind('click', function (e) {
                        var obj = ($(this));
                        profile.editWork(obj);
                        return false;
                    });
                    var $delBtn = $('<a href="#" class="fa fa-trash-o" title="delete"></a>');
                    $delBtn.bind('click', function (e) {
                        var obj = ($(this));
                        profile.showLoader();
                        var intObj = $('.contents.work').data('fWorkObj'),
                            clickObj = $(this).parents('li').eq(0).data('workObj');
                        var interestObj = new Array();
                        for (var i = 0; i < intObj.length; i++) {
                            var curObj = intObj[i];
                            if (curObj.User_Work_Id == clickObj.User_Work_Id) {
                                Services.deleteUserWork(curObj.User_Id, curObj.User_Work_Id, function (data) {
                                    profile.getUserWorkDetails();
                                    profile.hideLoader();

                                });
                            }
                        }
                        return false;
                    });
                    $actionsDiv.append($editBtn);
                    $actionsDiv.append($delBtn);
                }

                $div.append($innerDiv);
                $div.append($actionsDiv);

                $li.append($div);
                $li.data('workObj', curObj).addClass('list-item');
                $('ul', content).append($li);
                //alert(JSON.stringify(curObj));
                //profile.editEducations(curObj);
            }
        } else {
            content.html('<ul><li class="addLi"><div class="empty">' +
                (profile.isAdmin ? 'No details found, please click on Add to add a detail' : _this.currentUser.User_Name + ' haven\'t mentioned about his work.') +
                '</div></li></ul>').data('fWorkObj', new Array());
        }
    },

    editWork: function (data) {
        var _this = this;
        var curData = {};
        if (data != null) {
            curData = data.parents('li').data('workObj');
            data.parents('ul').find('li').find('.two-col-field').remove();
            data.parents('ul').find('li').find('.workDisplayDiv').show();
            data.parents('.workDisplayDiv').hide();
        } else {
            if ($('.work ul').length > 0)
                $('.work ul').prepend('<li class="addLi"></li>');
            else {
                $('.work').html('<ul></ul>');
                $('.work ul').prepend('<li class="addLi"></li>');
            }
        }
        var currentYear = new Date().getFullYear();
        var html = '';
        html += '<div class="two-col-field">';
        html += '<div class="field" id="workname"><b>Company Name</b><input type="text" id="work_name" name="work_name" value="' + (curData.Work_Name ? curData.Work_Name : '') + '" /></div>';
        html += '<div class="field" id="workperiod"><b>From </b>';
        var fromDate = curData.Work_From ? curData.Work_From : null;
        var toDate = curData.Work_To ? curData.Work_To : null;
        html += '<select id="workFrom">';
        html += '<option value="0">Year</option>';
        for (var i = 1980; i <= currentYear; i++) {
            html += '<option value="' + i + '" ' + (i == fromDate ? 'selected' : '') + '>' + i + '</option>';
        }
        html += '</select>';

        html += '<span>&nbsp;To&nbsp;</span> ';
        html += '<select ' + (curData.Is_Current_Work == 1 ? 'disabled="disabled"' : '') + ' id="workTo">';
        html += '<option value="0">Year</option>';
        for (var i = 1980; i <= currentYear; i++) {

            html += '<option value="' + i + '" ' + (i == toDate ? 'selected' : '') + '>' + i + '</option>';
        }
        html += '</select>';
        html += '</div>';
        html += '<div class="field" id="work-present"><b>Present</b><input type="checkbox" name="present" value="present" id="check-present" ' + (curData.Is_Current_Work == 1 ? 'checked="checked"' : '') + '></div>';
        html += '<div class="field" id="work-position"><b>Position</b><input type="text" value="' + (curData.Work_Position ? curData.Work_Position : '') + '" /></div>';
        html += '<div class="field" id="work-city"><b>City</b><input type="text" value="' + (curData.City_Name ? curData.City_Name : '') + '" /></div>';
        html += '<div style="" class="save-list"><a href="#" class="save" title="save">Save</a><a href="#" class="cancel" title="Cancel">Cancel</a></div>';
        html += '</div>';

        var $html = $(html);
        profile.autoCompleteWork();
        $('#check-present', $html).bind('click', function (e) {
            if ($(this).is(':checked')) {
                $('#workperiod span, #workTo', $html).hide();
            } else {
                $('#workperiod span, #workTo', $html).show();
            }
        });

        var saveBtn = $html.find('.save-list').find('.save');
        saveBtn.click('click', function (e) {
            var ary = ($('.work').data('fWorkObj'));

            if ($('#work_name').val() == '') {
                alert('Please enter company name');
                return false;
            }
            
            var workFrom = $('#workFrom');
            if (workFrom.val() == '0') {
                alert('Please select from year');
                return false;
            }
            var workTo = $('#workTo');
            var presentCheck = $('#work-present input');
            if (workTo.val() == '0' && !presentCheck.is(':checked')) {
                alert('Please select to year or check present');
                return false;
            }
            if ($('#work-position input').val() == '') {
                alert('Please enter position');
                return false;
            }
            if ($('#work-city input').val() == '') {
                alert('Please enter city');
                return false;
            }
            
            var outAry = new Array();
            if (ary != null) {
                for (var i = 0; i <= ary.length - 1; i++) {
                    if (ary[i].User_Work_Id != curData.User_Work_Id)
                        outAry.push(ary[i]);
                }
            }
            var obj = {
                Work_Name: $('#work_name').val(),
                Work_From: $('#workFrom').val(),
                Work_To: $('#workTo').val(),
                Is_Current_Work: $('#work-present input').is(':checked')?1:0,
                Work_Position: $('#work-position input').val(),
                City_Name: $('#work-city input').val()
            };
            outAry.push(obj);
            console.log(outAry);
            Services.saveUserWorkDetails(outAry, function (data) {
                //console.log(data);
                profile.getUserWorkDetails();
            }, function (e) { });
            return false;
        });
        var cancelBtn = $html.find('.save-list').find('.cancel');
        cancelBtn.click('click', function (e) {
            /*if (data != null) {
                data.parents('ul').find('li').find('.two-col-field').remove();
                data.parents('ul').find('li').find('.workDisplayDiv').show();
            }*/
            $('.work ul li.addLi').remove();
            _this.bindUserWorkDetails(_this.workDetails);
            return false;
        });
        if (data != null)
            data.parents('li').append($html);
        else
            $('.work ul li.addLi').append($html);

    },

    autoCompleteWork: function () {
        Services.getAllWorkName(function (data) {
            // alert(JSON.stringify(data))
            /* var collegeName = new Array();
             for (var i = 0; i < data.lstQualification.length; i++) {
                 collegeName.push(data.lstQualification[i].Qualification);
             }
             $('input[name="college_name"]').typeahead(profile.autoCompleteOptions, {
                 name: 'college_name', displayKey: 'value',
                 source: profile.stringMatches(collegeName)
             });*/
            var workName = new Array();
            for (var i = 0; i < data.length; i++) {
                workName.push(data[i].Work_Name);
            }
            $('input[name="work_name"]').typeahead(profile.autoCompleteOptions, {
                name: 'work_name', displayKey: 'value',
                source: profile.stringMatches(workName)
            });
        }, function () { });
    },

    getUserInterestDetails: function () {
        var _this = this;
        Services.getUserInterestDetails(curUserId, function (data) {
            _this.bindUserInterestDetails(data);
        }, function (e) { });
    },
    bindUserInterestDetails: function (data) {
        var _this = this;
        _this.interests = data;
        var content = $('.contents.intrest');
        
        if (profile.isAdmin)
            $('.add-interest, .edit-interest').show();
        else
            $('.add-interest, .edit-interest').hide();

        if (data && data.length > 0) {
            $('.edit-interest').show();
            
            content.html('<ul></ul>').data('interestObj', data);
            
            $('ul', content).append('<li class="addLi" style="display: none;"></li>');
            for (var i = 0; i < data.length; i++) {
                var $li = $('<li></li>'), curObj = data[i];
                var count = 0;
                if (curObj.doctorInterest !== undefined && curObj.doctorInterest !== null)
                    count = curObj.doctorInterest;
                $li.append('<div class="title">' + curObj.Interest_Name + '</div>');
                $li.append('<div class="delete"><span class="fa fa-remove"></span></div>');
                $li.data('iObj', curObj);
                $('ul', content).append($li);
            }
        } else {
            $('.edit-interest').hide();
            content.html('<ul><li class="addLi"><div class="empty">' +
                (profile.isAdmin ? 'No details found, please click on Add to add a detail' : _this.currentUser.User_Name + ' haven\'t mentioned about his interests.') +
                '</div></li></ul>').data('interestObj', new Array());
        }
        profile.editInterestDetails();
    },
    editInterestDetails: function () {
        var _this = this;
        var $list = $('.contents.intrest');
        $('.add-list.add-interest').unbind('click').bind('click', function () {
            //if ($(this).hasClass('active')) return false;
            $('.add-interest, .edit-interest').hide();
            $(this).addClass('active');
            
            $('.contents.intrest ul li.addLi').html('<div class="inner-edit add" style="padding: 5px 10px">' +
                '<form action="#"><div class="input col-one"><label>Interest Name</label>' +
                '<input type="text" name="interest_name" value=""/></div>' +
                '<div class="save-list"><a href="#" class="save" title="save">Save</a>' +
                '<a href="#" class="cancel" title="Cancel">Cancel</a></div></form></div>').show();
            profile.autoCompleteInterests();
            $('.inner-edit.add .save').unbind('click').bind('click', function () {
                profile.showLoader();
                
                var iname = $('.add input[name="interest_name"]').val();
                if (iname == '' || iname == undefined) {
                    alert('Please enter any name');
                    return false;
                }
                var interestAry = new Array();
                var newObj = {};
                var prevObj = $('.contents.intrest').data('interestObj');
                if (prevObj == undefined || prevObj == null || prevObj.length <= 0) {
                    //interestAry = new Array();
                    newObj.User_Id = Services.defaults.userId;
                    newObj.Interest_Name = iname;
                    newObj.Interest_Id = null;
                    interestAry.push(newObj);
                } else {
                    interestAry = new Array();
                    var uniqueInterests = {};
                    for (var i = 0; i < prevObj.length; i++) {
                        var cObj = prevObj[i];
                        //console.log(cObj.Interest_Name.toLowerCase().toString() + '!=' + iname.toLowerCase().toString() + ' = ' + cObj.Interest_Name.toLowerCase().toString() != iname.toLowerCase().toString());
                        if (uniqueInterests[cObj.Interest_Name.toLowerCase().toString()] == null) {
                            uniqueInterests[cObj.Interest_Name.toLowerCase().toString()] = cObj;
                        }
                    }

                    newObj.Interest_Name = iname;
                    newObj.Interest_Id = null;
                    uniqueInterests[iname.toLowerCase().toString()] = newObj;

                    for (var uniqueInterest in uniqueInterests) {
                        interestAry.push(uniqueInterests[uniqueInterest]);
                    }
                }
                
                Services.saveUserInterests(interestAry, function (rows) {
                    profile.getUserInterestDetails();
                    profile.hideLoader();
                    $('.add-list.add-interest').removeClass('active')
                }, function () { });
                return false;
            });

            $('.add .save-list .cancel').unbind('click').bind('click', function () {
                $('.inner-edit').remove();
                $('.add-list.add-interest').removeClass('active');
                $('.list-item').removeClass('editMode');
                _this.bindUserInterestDetails(_this.interests);
                return false;
            });
            return false;
        });
        if (profile.isAdmin) {
            $('.edit-list .edit').unbind('click').bind('click', function () {
                $('.add-interest, .edit-interest').hide();
                if ($('.contents.intrest li').hasClass('edit-interest'))
                    $('.contents.intrest li').removeClass('edit-interest');
                else
                    $('.contents.intrest li').addClass('edit-interest');

                $('.edit-interest .delete').unbind('click').bind('click', function () {
                    profile.showLoader();
                    var intObj = $('.contents.intrest').data('interestObj'),
                        clickObj = $(this).parents('li').eq(0).data('iObj');
                    var interestObj = new Array();
                    for (var i = 0; i < intObj.length; i++) {
                        var curObj = intObj[i];
                        if (curObj.User_Interest_Id == clickObj.User_Interest_Id) {
                            Services.deleteUserInterest(curObj.User_Id, curObj.User_Interest_Id, function (data) {
                                profile.getUserInterestDetails();
                                profile.hideLoader();


                            });

                        }

                    }
                    return false;
                });
                return false;
            });
        } else $('.edit-interest').hide();
    },

    getLifeEvents: function () {
        var _this = this;
        $('#lifeevent-add').bind('click', function (e) {
            $('.events ul li.addLi').remove();
            $('.events ul li').find('.two-col-field').remove();
            _this.editLifeEvent();
            return false;
        });
        Services.getUserLifeEvent(curUserId, function (data) {
            _this.events = data;
            _this.bindLifeEvents(data);
        }, function (e) { });
    },
    bindLifeEvents: function (data) {
        var _this = this;
        var content = $('.contents.events');
        if (data && data.length > 0) {
            content.html('<ul></ul>').data('feventsObj', data);
            for (var i = 0; i < data.length; i++) {
                var $li = $('<li></li>'), curObj = data[i];
                var html = '';
                html += '<div class="inner-cont"><span class="li-bulletin fa fa-calendar"></span>';
                html += '<div class="title">' + curObj.EventType_Name + '</div>';
                var month;
                if (curObj.Month == 1) {
                    month = 'Jan';
                } else if (curObj.Month == 2) {
                    month = 'Feb';
                } else if (curObj.Month == 3) {
                    month = 'Mar';
                } else if (curObj.Month == 4) {
                    month = 'Apr';
                } else if (curObj.Month == 5) {
                    month = 'May';
                } else if (curObj.Month == 6) {
                    month = 'Jun';
                } else if (curObj.Month == 7) {
                    month = 'Jul';
                } else if (curObj.Month == 8) {
                    month = 'Aug';
                } else if (curObj.Month == 9) {
                    month = 'Sep';
                } else if (curObj.Month == 10) {
                    month = 'Oct';
                } else if (curObj.Month == 11) {
                    month = 'Nov';
                } else if (curObj.Month == 12) {
                    month = 'Dec';
                }
                if (curObj.Mode == 2) {
                    html += '<div class="desc">' + curObj.Year + '</div></div>';
                } else if (curObj.Mode == 1) {
                    html += '<div class="desc">' + month + '/' + curObj.Year + '</div></div>';
                } else {
                    html += '<div class="desc">' + curObj.Day + '/' + month + '/' + curObj.Year + '</div></div>';
                }
                if (profile.isAdmin)
                    html += '<div class="edit-actions"><a href="#" class="fa fa-pencil edit" title="edit"></a><a href="#" class="fa fa-trash-o delete" title="delete"></a></div>';
                $li.html(html);
                $li.data('eObj', curObj).addClass('list-item');
                var editBtn = $li.find('.edit');
                editBtn.unbind('click').bind('click', function (e) {
                    _this.editLifeEvent($(this));
                    return false;
                });

                var deleteBtn = $li.find('.delete');
                deleteBtn.unbind('click').bind('click', function (e) {
                    profile.showLoader();
                    var intObj = $('.contents.events').data('feventsObj'),
                        clickObj = $(this).parents('li').eq(0).data('eObj');
                    var interestObj = new Array();
                    for (var i = 0; i < intObj.length; i++) {
                        var curObj = intObj[i];
                        if (curObj.User_Event_Id == clickObj.User_Event_Id) {
                            Services.deleteUserEvent(curObj.User_Id, curObj.User_Event_Id, function (data) {
                                profile.getLifeEvents();
                                profile.hideLoader();

                            });

                        }

                    }
                    return false;

                });
                $('ul', content).append($li);
            }
        } else {
            content.html('<ul><li class="addLi"><div class="empty">' +
                (profile.isAdmin ? 'No details found, please click on Add to add a detail' : _this.currentUser.User_Name + ' haven\'t added any events.') +
                '</div></li></ul>').data('feventsObj', new Array());
        }
    },

    editLifeEvent: function (data) {
        var _this = this;
        var lifeEvent = null;
        var aryObjs = $('.contents.events').data('feventsObj');
        if (aryObjs == null) {
            aryObjs = [];
        }
        var curObj = {};
        $('.events ul li').find('.inner-cont').show();
        $('.events ul li').find('.editor').remove();
        $('.events ul li.addLi').remove();
        if (data != null) {
            data.parents('li').find('.inner-cont').hide();
            data.parents('ul').find('li').find('.two-col-field').remove();
            data.parents('li').append('<div class="editor"></div>');
            lifeEvent = data.parents('li').find('.editor');
            curObj = data.parents('li').data('eObj');
            console.log(curObj);
        } else {
            if ($('.events ul').length <= 0)
                $('.events').html('<ul></ul>');
            $('.events ul li.addLi').remove();
            $('.events ul').prepend('<li class="addLi"></li>');
            lifeEvent = $('.events ul li.addLi');
        }

        var dySelectorDiv = $('<div class="date-year-selector"></div>');
        // for selection
        var yearSelector = $('<div class="year-selector dyselector"></div>');
        var monthSelector = $('<div class="month-selector dyselector" style="display: none;"></div>');
        var dateSelector = $('<div class="date-selector dyselector" style="display: none;"></div>');

        // for year button
        var addYearBtn = $('<a href="#">+ Add Year</a>');

        var selectTag = $('<select style="display: none;"><select>');
        selectTag.append('<option  value="">Year</option>');
        var currentYear = new Date().getFullYear();
        var showYear = false;
        for (var i = 1980; i <= currentYear; i++) {
            if (curObj.Year == i) {
                showYear = true;
                selectTag.append('<option value="' + i + '" selected>' + i + '</option>');
            } else {
                selectTag.append('<option value="' + i + '">' + i + '</option>');
            }
        }
        if (showYear) {
            selectTag.show();
            addYearBtn.hide();
        }

        addYearBtn.unbind('click').bind('click', function (e) {

            $(this).hide();
            selectTag.show();
            selectTag.click();
            return false;
        });
        selectTag.bind('change', function (e) {
            if ($(this).val() != null && $(this).val() != '')
                monthSelector.show();
            else {
                monthSelector.hide();
                dateSelector.hide();
            }
        });
        yearSelector.append(addYearBtn);
        yearSelector.append(selectTag);

        // for month button
        var addMonthBtn = $('<a href="#">Add Month</a>');
        var selectMonthTag = $('<select style="display: none;"><select>');
        selectMonthTag.append('<option value="">Month</option>');
        if (curObj.Month > 0) {
            var showMonth = false;
            // selectMonthTag = $('<select style="display: none;"><select>');
            //selectMonthTag.append('<option>--Month--</option>');
            var monthNames = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
            for (var i = 1; i <= monthNames.length; i++) {
                if (curObj.Month == i) {
                    showMonth = true;
                    selectMonthTag.append('<option value="' + i + '" selected>' + i + '</option>');
                } else {
                    selectMonthTag.append('<option value="' + i + '">' + i + '</option>');
                }
            }


            if (showMonth) {
                monthSelector.show();
                selectTag.show();
                addMonthBtn.hide();
                selectMonthTag.show();
            }
        }
        addMonthBtn.unbind('click').bind('click', function (e) {
            $(this).hide();
            var monthNames = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
            for (var i = 1; i <= monthNames.length; i++) {
                if (curObj.Month == i) {
                    showMonth = true;
                    selectMonthTag.append('<option value="' + i + '" selected>' + i + '</option>');
                } else {
                    selectMonthTag.append('<option value="' + i + '">' + i + '</option>');
                }
            }

            selectMonthTag.show();
            selectMonthTag.click();
            return false;
        });
        var selectDateTag = $('<select style="display: none;"><select>');
        if (selectMonthTag != null) {
            selectMonthTag.bind('change', function (e) {
                var y = selectTag.val(), m = $(this).val();
                var firstDay = new Date(y, m, 1).getDate();
                var lastDay = new Date(y, m + 1, 0).getDate();
                selectDateTag.html('');
                selectDateTag.append('<option  value="">Date</option>');
                var showDate = false;
                for (var i = firstDay; i <= lastDay; i++) {
                    if (curObj.Day == i) {
                        showDate = true;
                        selectDateTag.append('<option value="' + i + '" selected>' + i + '</option>');
                    } else {
                        selectDateTag.append('<option value="' + i + '">' + i + '</option>');
                    }
                }

                if ($(this).val() != null && $(this).val() != '')
                    dateSelector.show();
                else {
                    dateSelector.hide();
                }
            });
        }
        monthSelector.append(addMonthBtn);
        monthSelector.append(selectMonthTag);

        // for date button
        var addDateBtn = $('<a href="#">Add Date</a>');

        if (curObj.Day > 0) {
            var y = selectTag.val(), m = selectMonthTag.val();
            var firstDay = new Date(y, m, 1).getDate();
            var lastDay = new Date(y, m + 1, 0).getDate();
            selectDateTag.append('<option>Date</option>');
            var showDate = false;
            for (var i = firstDay; i <= lastDay; i++) {
                if (curObj.Day == i) {
                    showDate = true;
                    selectDateTag.append('<option value="' + i + '" selected>' + i + '</option>');
                } else {
                    selectDateTag.append('<option value="' + i + '">' + i + '</option>');
                }
            }
            if (showDate) {
                dateSelector.show();
                selectDateTag.show();
                selectTag.show();
                selectMonthTag.show();
                addMonthBtn.hide();
                addDateBtn.hide();
            }
        }

        addDateBtn.bind('click', function (e) {
            $(this).hide();
            selectDateTag.show();
            selectDateTag.click();
            return false;
        });
        dateSelector.append(addDateBtn);
        dateSelector.append(selectDateTag);

        dySelectorDiv.append(yearSelector);
        dySelectorDiv.append(monthSelector);
        dySelectorDiv.append(dateSelector);

        var tcField = $('<div class="two-col-field"></div>');
        tcField.append('<div class="field" id="eventName"><b>Event Name</b><input type="text" style="display: block;" id="event_name" name="event_name" value="' + (curObj.EventType_Name ? curObj.EventType_Name : '') + '" /></div>');
        tcField.append('<div class="field" id="eventDate"><b>Date</b></div>');
        tcField.find('#eventDate').append(dySelectorDiv);
        tcField.append('<div class="save-list"><a title="save" class="save" href="#">Save</a><a title="Cancel" class="cancel" href="#">Cancel</a></div>');
        lifeEvent.append(tcField);
        profile.autoCompleteEvents();
        var saveBtn = lifeEvent.find('.save-list').find('.save');
        saveBtn.click('click', function (e) {
            var mode = 2;
            
            var eventName = lifeEvent.find('#event_name').val();
            var selectedYear = lifeEvent.find('#eventDate .year-selector select').val();
            var selectedMonth = lifeEvent.find('#eventDate .month-selector select').val();
            var selectedDay = lifeEvent.find('#eventDate .date-selector select').val();
            if (eventName == '') {
                alert('Please enter event name');
                return false;
            }
            if (selectedYear == '') {
                alert('Please enter year');
                return false;
            }

            if (selectedDay) {
                mode = 0;
            } else if (!selectedDay && selectedMonth != '') {
                mode = 1;
            }
            var ary = ($('.events').data('feventsObj'));
            var outAry = new Array();
            if (ary != null) {
                for (var i = 0; i <= ary.length - 1; i++) {
                    if (ary[i].User_Event_Id != curObj.User_Event_Id)
                        outAry.push(ary[i]);
                }
            }
            var obj = {
                EventType_Name: eventName,
                Year: selectedYear,
                Month: selectedMonth,
                Day: selectedDay,
                Mode: mode
            };
            outAry.push(obj);
            console.log(outAry);
            Services.saveUserEventDetails(outAry, function (data) {
                profile.getLifeEvents();
            });

            return false;
        });
        var cancelBtn = lifeEvent.find('.save-list').find('.cancel');
        cancelBtn.click('click', function (e) {
            $('.events ul li').find('.inner-cont').show();
            $('.events ul li').find('.editor').remove();
            $('.events ul li.addLi').remove();
            _this.bindLifeEvents(_this.events);
            return false;
        });
        
    },
    autoCompleteEvents: function () {
        Services.getAllEvents(function (data) {
            // alert(JSON.stringify(data))
            var events = new Array();
            for (var i = 0; i < data.length; i++) {
                events.push(data[i].EventType_Name);
            }
            $('input[name="event_name"]').typeahead('destroy');
            $('input[name="event_name"]').typeahead(profile.autoCompleteOptions, {
                name: 'events', displayKey: 'value',
                source: profile.stringMatches(events)
            });
        }, function () { });
        /*Services.getAllEvents(function (data) {
            var events = new Array();
            for (var i = 0; i < data.length; i++) {
                events.push(data[i].EventType_Name);
            }
            $('input[name="event_name"]').typeahead(profile.autoCompleteOptions, {
                name: 'events', displayKey: 'value',
                source: profile.stringMatches(events)
            });
        }, function () { });*/
    },

    autoCompleteOptions: { hint: true, highlight: true, minLength: 1 },
    autoCompleteInterests: function () {
        Services.getAllInterests(function (data) {
            var interests = new Array();
            for (var i = 0; i < data.length; i++) {
                interests.push(data[i].Interest_Name);
            }
            $('input[name="interest_name"]').typeahead(profile.autoCompleteOptions, {
                name: 'interests', displayKey: 'value',
                source: profile.stringMatches(interests)
            });
        }, function () { 
        	
        });
    },

    stringMatches: function (strs) {
        return function findMatches(q, cb) {
            var matches, substrRegex;

            // an array that will be populated with substring matches
            matches = [];

            // regex used to determine if a string contains the substring `q`
            substrRegex = new RegExp(q, 'i');

            // iterate through the pool of strings and for any string that
            // contains the substring `q`, add it to the `matches` array
            $.each(strs, function (i, str) {
                if (substrRegex.test(str)) {
                    // the typeahead jQuery plugin expects suggestions to a
                    // JavaScript object, refer to typeahead docs for more info
                    matches.push({ value: str });
                }
            });
            cb(matches);
        };
    },

    showLoader: function () {
        $('.loader-div').show();
    },
    hideLoader: function() {
        $('.loader-div').hide();
    },
    getUserDetails: function() {
        Services.getKWUserInfo(curUserId, function (data) {
            //alert(JSON.stringify(data));
            if (data && data.length > 0) {
                var doctor = data[0];
                $('#doctor-name').text(doctor.FirstName + ' ' + doctor.LastName);
                //$('#doctor-designation').text("ENT");
                $('.user-location').text(doctor.Region_Name);
                if (doctor.Profile_Photo_BLOB_URL != null && doctor.Profile_Photo_BLOB_URL != '') {
                $('.doctor-img img').attr('src', doctor.Profile_Photo_BLOB_URL);
                } else {

                    $('.doctor-img img').attr('src', 'http://kangle.blob.core.windows.net/kangle-admin/default_profile_pic.jpg');
                }
                $('#doctor-email').text(doctor.Email_id);
                $('#doctor-mobile').text(doctor.Mobile_Number);
                //$('.doctor-img img').attr('src', doctor.Profile_Photo_BLOB_URL);
                //$('.user-location').append(doctor.Local_Area + ',' + doctor.City);
            }
        }, function(e) {
        	$('#doctor-name').text("Error");
            //$('#doctor-designation').text("ENT");
            $('.user-location').text("Error");
            if (doctor.Profile_Photo_BLOB_URL != null && doctor.Profile_Photo_BLOB_URL != '') {
            	$('.doctor-img img').attr('src', doctor.Profile_Photo_BLOB_URL);
            } else {
            	$('.doctor-img img').attr('src', 'http://kangle.blob.core.windows.net/kangle-admin/default_profile_pic.jpg');
            }
            $('#doctor-email').text("Error");
            $('#doctor-mobile').text("Error");
        });
    },
    getUserSpecialities: function() {
        Services.getUserSpecialityDetails(curUserId, function (data) {
            if (data && data.length > 0) {
                $('.doctor-speciality .speciality').data('specialityObj', data);
                var speciality = '';
                for (var i = 0; i < data.length; i++) {
                    speciality += data[i].Speciality_Name;
                    if (i < data.length - 1)
                        speciality += ',';
                }
                $('#doctor-designation, .doctor-speciality .speciality .value').text(speciality).data('specialityObj', data);
            }
        }, function() {
        	$('#doctor-designation, .doctor-speciality .speciality .value').text(networkProblemError);
        });
    },
};