var courseSections = {

    userId: null,
    companyId: null,
    courseId: null,
    publishId: null,

    init: function (userId, companyId, courseId, publishId) {
        this.userId = userId;
        this.companyId = companyId;
        this.courseId = courseId;
        this.publishId = publishId;
        this.getCourseSections();
    },

    getCourseSections: function () {
        var _this = this;
        Services.getAdCourseSections(_this.companyId, _this.userId, _this.courseId, _this.publishId, _this.bindAdCourseSections, _this.bindErrorAdCourseSections);
    },

    bindAdCourseSections: function(data) {
        var _this = this;
        var courseSectionsTable = $('#courseSectionsTable');
        $('#courseSectionsTable .division').remove();
        $('.dvCourseSectionsStatus').show();
        if (data != null && data.length > 0) {
            for (var i = 0; i <= data.length - 1; i++) {
                var adCourseData = data[i];
                var $row = $('<tr>');

                var $slNo = $('<td>' + (i + 1) + '</td>');
                var $sectionName = $('<td>' + adCourseData.Section_Name + '</td>');
                var $noOfAssets = $('<td>' + adCourseData.No_Of_Assets_Mapped + '</td>');
                var $passPercentage = $('<td>' + adCourseData.Pass_Percentage + '</td>');
                var $status = $('<td style="min-width: 100px;"><span class="' + (adCourseData.Section_Status?'answer-correct':'answer-wrong') + '">' + adCourseData.Section_Status_String + '</span></td>');

                var $action = $('<td>&nbsp</td>');
                if (adCourseData.Section_Status_String.toLowerCase() == 'fail' || adCourseData.Section_Status_String.toLowerCase() == 'pass') {
                    $action = $('<td><a href="SectionAttempts.html?pId=' + adCourseData.Publish_Id
                    + '&cId=' + adCourseData.Course_Id + '&sId=' + adCourseData.Section_Id + '" class="a-btn">Report</a></td>');
                }
                var $test = $('<td>&nbsp;</td>');
                var testUrl = 'QuestionAnswers.html?cId=' + adCourseData.Course_Id
                        + '&sId=' + adCourseData.Section_Id + '&pId=' + adCourseData.Publish_Id
                        + '&aId=' + adCourseData.Course_User_Assignment_Id + '&secId=' + adCourseData.Couse_User_Section_Mapping_Id;

                if (adCourseData.Show_Test_Button) {
                    if (adCourseData.Section_Status_String.toLowerCase() == 'yet to start') {
                        var $test = $('<td style="min-width: 150px;"><a href="' + testUrl + '" class="a-btn">Take Test</a></td>');
                    } else if (adCourseData.Section_Status_String.toLowerCase() == 'fail') {
                        var $test = $('<td style="min-width: 150px;"><a href="' + testUrl + '" class="a-btn">Retake Test</a></td>');
                    }
                }
                var $view = $('<td style="text-align: center;">' + (!adCourseData.Is_Section_Qualified ? '<a href="#openPlayer" class="fa fa-play a-btn"></a>' : '&nbsp;') + '</td>');
                $view.data('adCourseData', adCourseData);
                $view.bind('click', function (e) {
                    var courseData = $(this).data('adCourseData');
                    var vBtn = this;
                    if (vBtn.hasAttribute('disabled'))
                        return;
                    $(vBtn).attr('disabled', 'disabled');
                    $('a', vBtn).html("&nbsp;Loading...");
                    courseSections.getAdCourseAssets(courseData, function (data) {
                        courseSections.bindPlayerAssets(courseData, data);
                        $('a', vBtn).html("");
                        $(vBtn).removeAttr('disabled');
                    }, function (e) {
                        courseSections.onFailAdCourseAssets(e);
                        $('a', vBtn).html("");
                        $(vBtn).removeAttr('disabled');
                    });
                    return false;
                });

                $row.append($slNo);
                $row.append($sectionName);
                $row.append($noOfAssets);
                $row.append($passPercentage);
                $row.append($status);
                $row.append($action);
                $row.append($test);
                $row.append($view);

                courseSectionsTable.append($row);

                if (i == 0) {
                    $('.dvCourseName .dvCourseHeader').html('<div style="padding: 0 5px 5px 0;"><span style="font-weight: bold;">Course Name: </span>' + adCourseData.Course_Name + '</div>');

                    $('#courseStatus').html(adCourseData.Course_Status_String);
                    if (adCourseData.Show_Print_Certificate) {
                        $('#printCertificate').show();
                        $('#printCertificate').data('course', adCourseData);
                        $('#printCertificate').bind('click', function (e) {
                            var course = $(this).data('course');
                            window.location.href = "CourseCertificate.html?cid=" + Services.defaults.companyId + "&cuaid=" + course.Course_User_Assignment_Id;
                            return false;
                        });
                    } else {
                        $('#printCertificate').hide();
                    }
                }
            }
        } else {
            $('.dvCourseSectionsStatus').hide();
            $('.dvCourseName h3').html('Invalid Section or course');
            courseSectionsTable.append('<tr class="empty division"><td colspan="8">No Sections available for the moment.</td></tr>');
        }
    },

    bindErrorAdCourseSections: function (e) {
        var courseSectionsTable = $('#courseSectionsTable');
        $('#courseSectionsTable .division').remove();
        $('.dvCourseSectionsStatus').hide();
        $('.dvCourseName h3').html('Invalid Section or course');
        courseSectionsTable.append('<tr class="empty division"><td colspan="8">Unable to get sections for current course, please try again.</td></tr>');
    },

    getAdCourseAssets: function (courseData, success, failure) {
        var _this = this;
        Services.getAdAssetsByCourseId(_this.companyId, courseData.Course_Id, courseData.Section_Id, success, failure);
    },

    bindPlayerAssets: function(courseData, data) {
        var _this = this;
        if (data != null && data.length > 0) {
        	courseSections.openSelectedAsset(data, courseData);
//            var pl = new Player({
//                assets: data,
//                course: courseData,
//                onSlideChange: function (e) {
//                    var course = e.options.course;
//                    var analytics = {};
//                    analytics.Company_Id = Services.defaults.companyId;
//                    analytics.Course_Id = course.Course_Id;
//                    analytics.Section_Id = course.Section_Id;
//                    analytics.Publish_Id = course.Publish_Id;
//                    analytics.DA_Code = e.selectedAsset.DA_Code;
//                    analytics.User_Id = Services.defaults.userId;
//                    analytics.User_Name = course.User_Name;
//                    analytics.Region_Name = course.Region_Name;
//                    analytics.Region_Code = course.Region_Code;
//                    analytics.Offline_Play = 0;
//                    analytics.Online_Play = 1;
//                    analytics.Play_Time = new Date().getTime() - e.selectedAssetStartTime;
//                    analytics.Is_Preview = false;
//                    
//                    var postData = {};
//                    postData.objCourseAnalytics = analytics;
//                    
//                    Services.insertAdCourseViewAnalytics(analytics, function (data) {
//                        if ($('.container.player_container').length <= 0) {
//                            window.location.reload();
//                        }
//                    }, function (e) {
//
//                    });
//                }
//            });
//            pl.show();
        } else {
            alert("No Assets mapped for this course.");
        }
    },
    
    openSelectedAsset: function(inputs, course) {
    	app.showLoading();
    	Player.CoreREST._defaultServer = CoreREST._defaultServer;
        Player.Services.defaults.subdomainName = Services.defaults.subdomainName;
    	Player.getAssetImages(inputs, "DA_Code", function(assets) {
    		var ply = new Player({
    			defaultServer: CoreREST._defaultServer,
                subdomainName: Services.defaults.subdomainName,
                headerLogo: window.localStorage.getItem("companyLogoUrl"), //player company logo 
                assets: assets,
                course: course,
                videoUrlProperty: "lstEncodedUrls",
                assetIdProperty: "DA_Code",
                assetThumbnailProperty: "DA_Thumbnail_URL",
                assetURLProperty: "File_Path",
                assetDescriptionProperty: "Asset_Name",
                encodedDoc: { encodedProperty: "lstAssetImageModel", encodedUrlProperty: "Image_Url", encodedId: "DA_Code" },
                scrolltype: Player.defaultScrolltype,
                beforeShow: function () {
                    //$(".container").hide();
                },
                beforeSlideChange: function ($element, $previousElement) {
                    if ($previousElement != null && $previousElement.length > 0) {
                        var prevStartTime = $previousElement.data("startTime");
                        var currTime = new Date().getTime();
                        var timeLapsed = currTime - prevStartTime;
                        console.log("Previous Element Time Lapsed: " + timeLapsed);
                    }
                    if($element != null)
                        $element.data("startTime", new Date().getTime());
                },
                afterSlideChange: function ($element) {
                   
                },
                onAssetChange: function (asset, previousAsset) {
                    var _this = this;
                    if (previousAsset != null) {
                        var startTime = previousAsset.startTime;
                        var endTime = new Date().getTime();
                        var timeLapsed = endTime - startTime;
                        console.log("Previous Asset Time Lapsed: " + timeLapsed);

                        console.log(previousAsset);
                        courseSections.insertAnalytics(_this, timeLapsed, previousAsset);
                    }

                    asset.startTime = new Date().getTime();
                },
                onPlayerClose: function (asset, previousAsset) {
                    var _this = this;
                    //$(".container").show();
                    if (asset != null) {
                        var startTime = asset.startTime;
                        var endTime = new Date().getTime();
                        var timeLapsed = endTime - startTime;
                        console.log("Previous Asset Time Lapsed: " + timeLapsed);
                        
                        courseSections.insertAnalytics(_this, timeLapsed, asset, function() {
                        	window.location.reload();
                        });
                    }
                }
            });
            ply.show();
            app.hideLoading();
    	}, function(e) {
    		app.hideLoading();
    		alert(networkProblemError);
    	});
    },
    
    insertAnalytics: function(player, timeLapsed, asset, oncomplete) {
    	var _this = player;
    	var analytics = {};
    	analytics.Company_Id = Services.defaults.companyId;
		analytics.Course_Id = _this.options.course.Course_Id;
		analytics.Section_Id = _this.options.course.Section_Id;
		analytics.Publish_Id = _this.options.course.Publish_Id;
		analytics.DA_Code = asset.DA_Code;
		analytics.User_Id = Services.defaults.userId;
		analytics.User_Name = _this.options.course.User_Name;
		analytics.Region_Name = _this.options.course.Region_Name;
		analytics.Region_Code = _this.options.course.Region_Code;
		analytics.Offline_Play = 0;
		analytics.Online_Play = 1;
		analytics.Play_Time = timeLapsed;
		analytics.Is_Preview = false;   
        
        Services.insertAdCourseViewAnalytics(analytics, oncomplete, oncomplete);
    },

    onFailAdCourseAssets: function (e) {

    }
};