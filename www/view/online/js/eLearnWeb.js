if (eLearningAPP == null) {
    var eLearningAPP = {};
}

eLearningAPP.downloadSuccess = "Asset downloaded successfully.";
eLearningAPP.defaultScrolltype = [
  {
      type: "slide",
      extensions: ["ppt", "pptx"]
  },
  {
      type: "document",
      extensions: ["xls", "xlsx", "doc", "docx", "pdf"]
  }
];
eLearningAPP.FullAssets = [];
eLearningAPP.init = function () {
    /*if (window.addEventListener) {
        window.addEventListener("orientationchange", eLearningAPP.refresh, false);
    }*/
    //alert($(window).width());
    $(".showAssets").hide();
    var taskSpecifications = [
		{ task: eLearningAPP.getUserInfo },
        //{ firstTask: eLearningAPP.getUserInfo, secondTask: eLearningAPP.showHeader },
        { firstTask: eLearningAPP.getBrowseTags, secondTask: eLearningAPP.showBrowseTags },
        { firstTask: eLearningAPP.getAssetsWithAnalytics, secondTask: eLearningAPP.showAssets },
    ];
    var taskUtil = new TaskUtil(taskSpecifications);
    taskUtil.execute(eLearningAPP, {}, function (data) { 
    	var helpdiv = window.localStorage.getItem("assethelp");
    	if(helpdiv == null || helpdiv == ''){
    		eLearningAPP.showHelpText();
    		window.localStorage.setItem("assethelp",1);
    	}
    }, function (data) { });
};
eLearningAPP.refresh = function () {
    $(".showAssets").hide();
    var taskSpecifications = [
        //{task: eLearningAPP.initTestData},
        { firstTask: eLearningAPP.getBrowseTags, secondTask: eLearningAPP.showBrowseTags },
        { firstTask: eLearningAPP.getAssetsWithAnalytics, secondTask: eLearningAPP.showAssets },
    ];
    var taskUtil = new TaskUtil(taskSpecifications);
    taskUtil.execute(eLearningAPP, {}, function (data) { }, function (data) { });
};
eLearningAPP.getUserInfo = function (context, data, success, failure) {

    eLearningAPP.currentUser = JSON.parse(getParameter('currentUser'));
    
    if (eLearningAPP.currentUser == null) {
        var context = ['AssetUpload', 'GetUserInfo'];
        CoreREST.get(this, context, null, function (data) {
                     //alert(JSON.stringify(data));
            eLearningAPP.currentUser = {
                companyCode: data[0].Company_Code,
                userName: data[0].User_Name,
                password: data[0].User_Pass,
                userImg:  data[0].Blog_URL,
                url: subDominWeb_g,
                userCode: data[0].User_Code,
                regionCode: data[0].Region_Code,
                regionName: data[0].Region_Name,
                userTypeCode: data[0].User_Type_Code,
                userTypeName: data[0].User_Type_Name,
                divisionCode: data[0].Division_Code,
                divisionName: data[0].Division_Name,
                regionHierarchy: data[0].User_Hierarchy,
                lastSyncDate: ""
            };
             var userDetails = eLearningAPP.currentUser;
             if (userDetails.blobUrl != null && userDetails.blobUrl != '' && userDetails.blobUrl != undefined) {
             $('#user_img').attr('src', userDetails.blobUrl);
             } else {
             $('#user_img').attr('src','online/images/profile_icon.png');
             }
             $('#user_name').text(window.localStorage.getItem('userName').toProperCase());
            success(eLearningAPP.currentUser);
        }, failure);

    } else {
        var userDetails = eLearningAPP.currentUser;
        if (userDetails.blobUrl != null && userDetails.blobUrl != '' && userDetails.blobUrl != undefined) {
            $('#user_img').attr('src', userDetails.blobUrl);
        } else {
            $('#user_img').attr('src','online/images/profile_icon.png');
        }
        $('#user_name').text(window.localStorage.getItem('userName').toProperCase());
        success(eLearningAPP.currentUser);
    }
};
eLearningAPP.showHeader = function (context, data, success, failure) {
    var header = $(".header");
    header.empty();
    var logobar = $("<div class='logobar' />");
    header.append(logobar);
    logobar.append("<div class='customerLogo'><img src=" + clientLogoURL_g + " /></div>");
    var userInfo = $("<div class='userInfo' />");
    logobar.append(userInfo);
    var userInfoText = $("<div class='userInfoText' />");
    userInfo.append(userInfoText);
    userInfoText.append("<div class='userName'>" + data.userName + "</div>");
    userInfoText.append("<div class='userType'>" + data.userTypeName + "</div>");
    userInfoText.append("<div class='userRegion'>" + data.regionName + "</div>");

    var userLogo = $("<div class='userLogo' />");
    userInfo.append(userLogo);
    userLogo.click(function () {
        eLearningAPP.toggleSettingsMenu();
    });

    var customerLogo = $("<div class='logo' />");
    userInfo.append(customerLogo);
    success();
};

eLearningAPP.toggleSettingsMenu = function () {
    $('#settingsMenuContainer').toggle();
};

/*new change utcoffset*/
var common = {
    defaults: {
        timeZoneOffSet: new Date().getTimezoneOffset()
    },
    getUTCOffset: function () {
        var offset = (new Date()).getTimezoneOffset();
        if (offset < 0) {
            offset = 10000 + Math.abs(offset);
        }
        return offset;
    },
}
/*new change utcoffset*/
eLearningAPP.getBrowseTags = function (context, data, success, failure) {
    //alert("getbrowsertags");
    //success(eLearningAPP.metaTags);
    if (navigator.userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i)) {
        var mViewer = localStorage.getItem("mviewer");
        if (mViewer == true || mViewer == 'true') {
            fnGetPlayTimeAndUpdate(localStorage.getItem("daCode"), localStorage.getItem("startTime"));
            localStorage.setItem("daCode", undefined);
            localStorage.setItem("startTime", undefined);
            localStorage.setItem("mviewer", false);
        }
    }
    var context = ['WebAPI', 'getAssetsForBrowse', eLearningAPP.currentUser.companyCode, eLearningAPP.currentUser.userCode, eLearningAPP.currentUser.regionCode, eLearningAPP.currentUser.userTypeCode,eLearningAPP.currentUser.companyId, common.getUTCOffset()];
    var requestJSON ={
        userCode:eLearningAPP.currentUser.userCode,
        companyCode:eLearningAPP.currentUser.companyCode,
        regionCode:eLearningAPP.currentUser.regionCode,
        userTypeCode:eLearningAPP.currentUser.userTypeCode
    };
    CoreREST.get(this, context, null, function (data) {
                 //alert(JSON.stringify(data));
        AssetBrowse.generateMetaData(data, function (data1) {
                                     console.log("metadata");
            console.log(JSON.stringify(data1));
            AssetBrowse.searchByTags('', function (result) {
                AssetBrowse.removeDuplicates(0, result, {}, [], function (assets) {
                    var assetDatas = {};
                    assetDatas['coreAssets'] = assets;
                    AssetBrowse.getByTags(0, assets, {}, function (taggedAssets) {
                        assetDatas['metaTags'] = data1;
                        assetDatas['taggedAssets'] = taggedAssets;
                        success(assetDatas);
                    }, function (e) { })
                }, function (e) { });
            }, function (e) { });

        }, failure);

    }, failure);
};
/*filter assets*/
eLearningAPP.filterHtmlLoad = function () {
    $('li.sort-type').unbind('click').bind('click', function (evt) {
        $('.date-slider').hide();
        if ($('.type-slider').size() == 0) {
            var html = '<div class="type-slider">';
            html += '<ul>';
            html += '<li class="active"><span class="type-text">Document</span><span class="type-btn"><input checked type="checkbox" value="D" name="file_type"/></span></li>';
            html += '<li class="active"><span class="type-text">Image</span><span class="type-btn"><input checked type="checkbox" value="I" name="file_type"/></span></li>';
            html += '<li class="active"><span class="type-text">Audio</span><span class="type-btn"><input checked type="checkbox" value="A" name="file_type"/></span></li>';
            html += '<li class="active"><span class="type-text">Video</span><span class="type-btn"><input checked type="checkbox" value="V" name="file_type"/></span></li>';
            html += '</ul>';
            html += '</div>';

            $('.filter-cont.filter-type').append(html);
        } else {
            $('.type-slider').toggle();
        }

        $('.type-slider ul li').unbind('click').bind('click', function () {
            var el = $('input', $(this)).get(0);
            el.checked = !el.checked;
            if (el.checked)
                $(this).addClass('active');
            else
                $(this).removeClass('active');
            return false;
        });
        return false;
    });
    $('li.sort-date').unbind('click').bind('click', function (evt) {
        evt.stopPropagation();
        $('.type-slider').hide();
        var actEl = $('.sort-inn-cont', $(this));
        if ($('.date-slider') != null && $('.date-slider').size() > 0) {
            //actEl.removeClass('fa-color');
            $('.date-slider').remove();
        } else {
            //actEl.addClass('fa-color');
            var html = '<div class="date-slider">';
            html += '<ul class="date-slid-text"><li>Today</li><li style="padding-left: 5px">This week</li>';
            html += '<li>2 Weeks</li><li>All</li></ul>';
            html += '<ul class="date-slid-rang">';
            html += '<li class="btn-day1"><input type="radio" value="1" name="date-range"/></li>';
            html += '<li class="btn-week1"><input type="radio" value="7" name="date-range"/></li>';
            html += '<li class="btn-week2"><input type="radio" value="14" name="date-range"/></li>';
            html += '<li class="btn-all slide-curr"><input type="radio" value="all" name="date-range" checked/></li>';
            html += '</ul></div>';

            $('.filter-cont.filter-type').append(html);
            $('.date-slid-rang li').unbind('click').bind('click', function () {
                var el = $(this), inp = $('input', el), index = el.index();
                $('.sort-date .sort-size').html($('.date-slid-text li').eq(index).text() + (index == 3 ? ' Time' : ''));
                inp.trigger('click');
                $('.date-slid-rang li input').each(function (i, elm) {
                    if (index != i) {
                        elm.checked = false;
                        $('.date-slid-rang li').removeClass('slide-curr');
                    }
                });
                if (inp.get(0).checked == true)
                    el.addClass('slide-curr');
                else
                    el.removeClass('slide-curr');
                return false;
            });
            $('.date-slid-rang li input').unbind('click').bind('click', function (evt) {
                evt.stopImmediatePropagation();
            });
        }
    });
    $('li.sort-size').unbind('click').bind('click', function () {
        var el = $('.sort-inn-cont', $(this));
        $('li.sort-alph .sort-inn-cont').removeClass('fa-color');
        el.addClass('fa-color');
        eLearningAPP.resetElements('sort-alph');

        var ascEl = $('input[name="sort-size"][value="A"]').get(0),
            descEl = $('input[name="sort-size"][value="D"]').get(0);

        var isCheckAny = $('input[name="sort-size"]:checked').size();
        if(isCheckAny == 0 || $('input[name="sort-size"]').get(0).checked == true) {
            ascEl.checked = true;
        } else if (ascEl.checked == true) {
            ascEl.checked = false;
            descEl.checked = true;
            $('.fa', el).addClass('fa-sort-amount-desc');
        } else if (descEl.checked == true) {
            $('.fa', el).removeClass('fa-sort-amount-desc');
            descEl.checked = false;
            ascEl.checked = true;
        }
    });
    $('li.sort-down').unbind('click').bind('click', function () {
    	var el = $('.sort-inn-cont', $(this));
    	var checkEl = $('input[name="sort-down"]:checked').val();
    	
    	if(checkEl == 'A') {
    		el.addClass('fa-color');
    		$('input[name="sort-down"][value="D"]').get(0).checked = true;
    		$('li.sort-down .sort-size').html('Downloaded');
    	} else if (checkEl == 'D') {
    		$('input[name="sort-down"][value="N"]').get(0).checked = true;
    		$('.fa', el).addClass('fa-globe');
    		$('li.sort-down .sort-size').html('Online');
    	} else if (checkEl == 'N') {
    		el.removeClass('fa-color');
    		$('.fa', el).removeClass('fa-globe');
    		$('input[name="sort-down"][value="A"]').get(0).checked = true;
    		$('li.sort-down .sort-size').html('Online/<br/>Downloaded');
    	}
    });

    $('li.sort-alph').unbind('click').bind('click', function () {
        var el = $('.sort-inn-cont', $(this));
        $('li.sort-size .sort-inn-cont').removeClass('fa-color');
        el.addClass('fa-color');
        eLearningAPP.resetElements('sort-size');

        var ascEl = $('input[name="sort-alph"][value="A"]').get(0),
            descEl = $('input[name="sort-alph"][value="D"]').get(0);

        var isCheckAny = $('input[name="sort-alph"]:checked').size();
        if (isCheckAny == 0 || $('input[name="sort-alph"]').get(0).checked == true) {
            ascEl.checked = true;
        } else if (ascEl.checked == true) {
            ascEl.checked = false;
            descEl.checked = true;
            $('.fa', el).addClass('fa-sort-alpha-desc');
            $('.sort-alph .sort-size').html('Alphabet - <br/>Desc');
        } else if (descEl.checked == true) {
            $('.fa', el).removeClass('fa-sort-alpha-desc');
            $('.sort-alph .sort-size').html('Alphabet - <br/>Asc');
            descEl.checked = false;
            ascEl.checked = true;
        }

    });
    $('li.sort-read').unbind('click').bind('click', function () {
        var inpEl = $('li.sort-read input');
        inpEl.each(function (i, el) {
            el.checked = false;
        });

        var stateQue = ['fa-check-square-o', 'fa-eye', 'fa-eye-slash'];
        var faEl = $('.fa', $(this)), cls = faEl.attr('class').split(' ')[1];

        var stateQueInd = stateQue.indexOf(cls);
        if (stateQueInd == (stateQue.length - 1)) {
            faEl.removeClass(stateQue[stateQueInd]);
            faEl.addClass(stateQue[0]);
            inpEl.eq(0).trigger('click');
            $('.sort-read .sort-size').html('Read/<br>Unread');
        } else {
            faEl.removeClass(stateQue[stateQueInd]);
            faEl.addClass(stateQue[stateQueInd + 1]);
            inpEl.removeAttr('checked');
            inpEl.eq(stateQueInd + 1).trigger('click');
            $('.sort-read .sort-size').html((stateQueInd == 1 ? 'Unread' : 'Read'));
        }
    });
    $('li.sort input').unbind('click').bind('click', function (e) {
        e.stopImmediatePropagation();
    });
    $('.filter-button').unbind('click').bind('click', function (e) {
        var loader = $('#BulkTaskLoader');
        loader.show();
        eLearningAPP.filterAssets();
        $('.search-filter').hide();
        return false;
    });
    //$('li.sort-date').click();
};
eLearningAPP.resetElements = function (elementName) {
    console.log(elementName);
    $('input[name="' + elementName + '"]').each(function (i, el) {
        el.checked = false;
    });
    if (elementName == 'sort-alph') {
        $('li.sort-alph .sort-inn-cont .fa').removeClass('fa-sort-alpha-desc');
        $('li.sort-alph .sort-size').html('Alphabet - <br/>Asc');
    } else {
        $('li.sort-size .sort-inn-cont .fa').removeClass('fa-sort-amount-desc');
    }
};
eLearningAPP.filterAssets = function () {
    var assets = eLearningAPP.FullAssets;
    $(".bread-crum").removeClass('right');
    $('.bread-crum').html('<li>Filtered by User</li><li style="width: 30px !important;"><a href="#" class="fa fa-close" onclick="window.location.reload(); return false;"><a></li>');
    var val = $('.product_search').val(); 
    //if ($(window).width() <= 1280) { //input value changes
        val = $('.search-text input').val(); //input value 
    //}
    if(val != null && val.trim().length > 0) {
    	$(".bread-crum").removeClass('right');
    	$('.bread-crum').html('<li><label>Filtered by "' + val + '"</label></li><li style="width: 30px !important;"><a href="#" class="fa fa-close" onclick="window.location.reload(); return false;"><a></li>');
    	if($(window).width() < 480) {
	    	if($(".bread-crum label").width() > 150) { 
	    		$(".bread-crum label").width(150); 
	    	}
    	} else {
    		if($(".bread-crum label").width() > 200) { 
	    		$(".bread-crum label").width(200); 
	    	}
    	}
    }
    if (val !== undefined && val !== '' && val !== null) {
        if (val.charAt(0) == '@') {
            var assetsByUser = new Array(), userName = val.substr(1, val.length - 1);
            for (var i = 0; i < assets.length; i++) {
                var curAsset = assets[i];
                if (curAsset.uploadedBy !== null && 
                		curAsset.uploadedBy.indexOf(userName) > -1) {
                    console.log(curAsset.uploadedBy);
                    assetsByUser.push(curAsset);
                }
            }
            eLearningAPP.searchResults(assetsByUser);
        } else {
            AssetBrowse.searchByTags(val, function (orginalAssets) {
                AssetBrowse.removeDuplicates(0, orginalAssets, {}, [], function (assets) {
                    eLearningAPP.searchResults(assets);
                });
            });
        }
    } else {
        eLearningAPP.searchResults(assets);
    }
};
eLearningAPP.searchResults = function (assets) {
	filteredAssets = assets;
    if ($('li.sort-size .sort-inn-cont').hasClass('fa-color')) {
        var bAsc = true;
        var els = $('input[name="sort-size"]:checked');
        if (els.val() == 'A') bAsc = true;
        else if (els.val() == 'D') bAsc = false;
        filteredAssets = eLearningAPP.getSizeWiseAssets(bAsc, filteredAssets);
    }
    
    if ($('li.sort-alph .sort-inn-cont').hasClass('fa-color')) {
        var bAsc = true;
        var els = $('input[name="sort-alph"]:checked');
        if (els.val() == 'A') bAsc = true;
        else if (els.val() == 'D') bAsc = false;
        filteredAssets = eLearningAPP.getAlphaWiseAssets(bAsc, filteredAssets);
    }

    var days = $('input[name="date-range"]:checked').val();
    if (days != 'all' && days > 0) {
        filteredAssets = eLearningAPP.getDateWiseAssets(days, filteredAssets);
    }

    var filetype = $('.type-slider input[name="file_type"]:checked');
    if (filetype.size() > 0 && filetype.size() < 4) {
        var typeAry = new Array();
        filetype.each(function (i, el) {
            if (el.value == 'D') typeAry.push('document');
            else if (el.value == 'I') typeAry.push('image');
            else if (el.value == 'V') typeAry.push('video');
            else if (el.value == 'A') typeAry.push('audio');
        });
        filteredAssets = eLearningAPP.getDocumentTypeAssets(typeAry, filteredAssets);
    }
    
    var download = $('input[name="sort-down"]:checked').val();
    if(download !== undefined && download !== null && download !== 'A') {
    	//filteredAssets = 
    	download = (download == 'D' ? true : false);
    	eLearningAPP.getDownloadedAssets(download, filteredAssets, function(downloadAssets){
    		eLearningAPP.getReadAssets(downloadAssets, function(readAssets){
    			eLearningAPP.finalFilterAssets(readAssets);
    		}, function(){});
    	});
    } else {
    	eLearningAPP.getReadAssets(filteredAssets, function(readAssets){
    		eLearningAPP.finalFilterAssets(readAssets);
		}, function(){});
    }
};
eLearningAPP.finalFilterAssets = function(assets) {
	eLearningAPP.showAssets(this, assets, function () {
        eLearningAPP.resetFilterHide();
        var loader = $('#BulkTaskLoader');
        loader.hide();
        $('body').removeAttr('style');
        $('.asset-detail').hide();
        $('.asset-holder').show();
        $('body').addClass('bg-wood');
//        var viewState = $('.asset-menu li a:visible');
//        if (viewState.attr('id') == 'thumb-view') {
//            $('.asset-holder').show();
//            $('body').addClass('bg-wood');
//        } else {
//            $('.thumb-div').show();
//            $('body').removeClass('bg-wood');
//        }
    }, null);
};
eLearningAPP.resetFilterHide = function () {
    eLearningAPP.resetElements('sort-size');
    eLearningAPP.resetElements('sort-alph');
    //$('li.sort .sort-inn-cont.fa-color').removeClass('fa-color');
    $('li.sort.sort-size .sort-inn-cont').removeClass('fa-color');
    $('li.sort.sort-alph .sort-inn-cont').removeClass('fa-color').addClass('fa-color');
    $('input[name="sort-down"]').get(0).checked = true;
    $('li.sort.sort-down .sort-inn-cont').removeClass('fa-color');
    $('li.sort.sort-down .sort-size').html('Online/<br/>Downloaded');
    $('li.sort.sort-down .fa').removeClass('fa-globe');
    $('li.sort-read input').each(function (i, el) {
        el.checked = false;
    });
    $('li.sort-read .sort-size').html('Read/<br/>Unread');
    $('li.sort-read .sort-inn-cont .fa').removeClass('fa-eye fa-eye-slash').addClass('fa-check-square-o');
    $('li.sort-date .sort-size').text('All Time');
    $('.date-slider').remove();
    $('.type-slider').remove();
};
eLearningAPP.getReadAssets = function (assets, success, failure) {
	if(assets.length == 0) {
		if(success) success(assets);
		return false;
	}
	var selRead = $('input[name="sort-read"]:checked').val();
	var newAssets = new Array();
	if (selRead == 'R') {
        DigitalAssetAnalytics.get(null, function (readAssets) {
			var assetsDaCodes = new Array();
			if(readAssets && readAssets.length > 0) {
				for(var i = 0; i < readAssets.length; i++) {
					assetsDaCodes.push(readAssets[i].daCode);
				}
			}
            for (var i = 0; i < assets.length; i++) {
                if(assets[i].isRead == true) {
                    newAssets.push(assets[i]);
                } else {
                    if (assetsDaCodes.indexOf(assets[i].daCode) > -1) {
                        newAssets.push(assets[i]);
                    }
                }
            }
			if(success) success(newAssets);
		}, function(){
			if(success) success(newAssets);
		});
	} else if (selRead == 'U') {
		DigitalAssetAnalytics.get(null, function (readAssets) {
			var assetsDaCodes = new Array();
			if(readAssets && readAssets.length > 0) {
				for(var i = 0; i < readAssets.length; i++) {
					assetsDaCodes.push(readAssets[i].daCode);
				}
			}
            for (var i = 0; i < assets.length; i++) {
              if(assets[i].isRead == false) {
                    newAssets.push(assets[i]);
                } else {
                    if (assetsDaCodes.indexOf(assets[i].daCode) > 0) {
                        newAssets.push(assets[i]);
                    }
                }
            }
			if(success) success(newAssets);
		});
	} else {
		if(success) success(assets);
	}
};
eLearningAPP.getDownloadedAssets = function (downloaded, assets, success, failure) { 
	var newAssets = new Array();
	if(downloaded) {
		digitalAssetLocalDAO.getAll(function (localAssets) {
			var assetsDaCodes = new Array();
			if(localAssets && localAssets.length > 0) {
				for(var i = 0; i < localAssets.length; i++) {
					assetsDaCodes.push(localAssets[i].daCode);
				}
			
				for (var i = 0; i < assets.length; i++) {
			        if (assetsDaCodes.indexOf(assets[i].daCode) > -1) {
			            newAssets.push(assets[i]);
			        }
			    }
			}
			if(success) success(newAssets);
		}, function(){
			if(success) success(newAssets);
		});
	} else {
		//if(success) success(assets);
		digitalAssetLocalDAO.getAll(function (localAssets) {
			var assetsDaCodes = new Array();
			if(localAssets && localAssets.length > 0) {
				for(var i = 0; i < localAssets.length; i++) {
					assetsDaCodes.push(localAssets[i].daCode);
				}
			
				for (var i = 0; i < assets.length; i++) {
			        if (assetsDaCodes.indexOf(assets[i].daCode) == -1) {
			            newAssets.push(assets[i]);
			        }
			    }
				if(success) success(newAssets);
			} else {
				if(success) success(assets);
			}
		});
	}
};
eLearningAPP.getDateWiseAssets = function (days, assets) {
    var curDate = new Date(),
        newAssets = new Array(),
        daySeconds = days * 24 * 60 * 60;
    for (var i = 0; i < assets.length; i++) {
        var curAsset = assets[i],
            curAssetUploadedDate = new Date(curAsset.uploadedDate);
        if (curDate.getDate() == curAssetUploadedDate.getDate() && curDate.getMonth() == curAssetUploadedDate.getMonth() &&
            curDate.getFullYear() == curAssetUploadedDate.getFullYear()) {
            newAssets.push(curAsset);
        } else {
            var mSeconds = (curDate - curAssetUploadedDate);
            mSeconds = mSeconds / 1000;
            if (mSeconds < daySeconds) {
                console.log('1 -> ' + curAsset.uploadedDate);
                newAssets.push(curAsset);
            }
        }
    }
    return newAssets;
};
eLearningAPP.getDocumentTypeAssets = function (types, assets) {
    var typeAssets = new Array();
    for (var i = 0; i < assets.length; i++) {
        var curAsset = assets[i];
        if(types.indexOf(curAsset.documentType.toLowerCase()) > -1) {
            typeAssets.push(curAsset);
        }
    }
    return typeAssets;
};
eLearningAPP.getSizeWiseAssets = function (sortBySize, assets) {
    var newAssets = new Array();
    newAssets = eLearningAPP.sortAssetByKey(assets, 'fileSize', true, sortBySize);
    return newAssets;
};
eLearningAPP.getAlphaWiseAssets = function (sortByAlph, assets) {
    var newAssets = new Array();
    newAssets = eLearningAPP.sortAssetByKey(assets, 'name', false, sortByAlph);
    return newAssets;
};
eLearningAPP.sortAssetByKey = function (assets, key, isInteger, reverse) {
    if (isInteger) {
        if (reverse) {
            assets.sort(function (a, b) {
                return a[key] - b[key];
            });
        } else {
            assets.sort(function (a, b) {
                return b[key] - a[key];
            });
        }
    } else {
        var moveSmaller = reverse ? 1 : -1;
        var moveLarger = reverse ? -1 : 1;
        assets.sort(function (a, b) {
            //return function (a, b) {
            var fName = a[key].toLowerCase(),
                bName = b[key].toLowerCase();
            if (bName < fName) {
                return moveSmaller;
            }
            if (bName > fName) {
                return moveLarger;
            }
            return 0;
            //};
        });
    }
    return assets;
};
eLearningAPP.showBrowseTags = function (context, assetDatas, success, failure) {
    var metaTags = assetDatas['metaTags'];
    var taggedAssets = assetDatas['taggedAssets'];
    var coreAssets = assetDatas['coreAssets'];
    eLearningAPP.FullAssets = coreAssets;
    
    $('input[name="sort-down"]').get(0).checked = true; 
    $('.search_sec input').unbind('click').bind('click', function (e) {
    	e.preventDefault();
    });
    
    /*discussion forum count*/
    $('.asset-disc-count').unbind('click').bind('click', function () {
        var count = parseInt($('span', $(this)).text(), 10);
        $('.asset-detail').hide();
        if (count > 0) {
            //var notifUserId = window.localStorage.getItem('userId');
            //alert(notifUserId);
            Services.getUnReadAssetDiscussionDetails(userId, function (data) {
                var assetsDiscussion = eLearningAPP.getCommentsAssets(data);
                eLearningAPP.showUnreadDiscussions(eLearningAPP.showAssets, assetsDiscussion, function () { }, function () { });
            }, function () { });
        }
        return false;
    });

    //Services.getUnReadAssetDiscussionCount(userId, function (data) {
    Services.getUnReadAssetDiscussionDetails(userId, function (data) {
        var assetdata = eLearningAPP.getCommentsCount(data);
    	if (assetdata > 0) {
            $('.asset-disc-count').show();
            $('.asset-disc-count span').text(assetdata);
        } else {
            $('.asset-disc-count').hide();
        }
    }, function () { });
    /*discussion forum count*/
    
    $('.search_sec').unbind('click').bind('click', function () {
        //$('input', $(this)).removeAttr('disabled');
        $('.search-filter').show();
        $('body').css({ 'overflow': 'hidden', 'height': $(window).height() });
        return false;
    });
    $('.search-text input').unbind('keyup').bind('keyup', function (e) {
    	if (e.keyCode == 13) {
            eLearningAPP.filterAssets();
            $('.search-filter').hide();
            $(this).blur();
        }
    });
    $(document).unbind('click').bind('click', function (e) {
        var el = $(e.target);
        console.log(el.parents('.search-filter'));
        if (!el.hasClass('search-filter') && el.parents('.search-filter').length == 0) {
            $('.search-filter').hide();
            $('body').removeAttr('style');
            eLearningAPP.resetFilterHide();
        }
        //return false;
    });
    eLearningAPP.filterHtmlLoad();
    /*filter assets*/
    if (metaTags == null) { metaTags = []; }
    var browseTag = $(".left-sec");
    eLearningAPP.tagList = new TagList({
        isOnline: true,
        container: browseTag,
        metaTags: metaTags,
        taggedAssets: taggedAssets,
        breadcrumbContainer: $(".bread-crum"),
        getSubTags: function (metaTag, afterGot) {
            afterGot(metaTag.subTags);
        },
        onSelection: function (metaTag, subTag) {
            var tag = metaTag;
            if (subTag != null) {
            	$(".bread-crum").addClass('right');
                tag = subTag;
            }
            //$('body').removeClass('page-player');
            eLearningAPP.getAssetsWithAnalytics(null, tag, function (assets) {
                eLearningAPP.contentAssetList.assets = assets;
                eLearningAPP.contentAssetList.show();
                var bListView = false;
                var viewEl = $('.asset-menu li:visible');
                $('body').addClass('bg-wood');
                $(".thumb-div").hide();
                $(".asset-holder").show();
//                bListView = (viewEl.index() == 0 ? true : false);
//                if (bListView) {
//                    $('body').addClass('bg-wood');
//                    $(".thumb-div").hide();
//                    $(".asset-holder").show();
//                } else {
//                    $('body').removeClass('bg-wood');
//                    $(".asset-holder").hide();
//                    $(".thumb-div").show();
//                }
                $(".assetDetail").hide();
            }, failure);
        },
        onTagSelection: function (assets) {
            eLearningAPP.contentAssetList.assets = assets;
            eLearningAPP.contentAssetList.show();
            var bListView = false;
            var viewEl = $('.asset-menu li:visible');
            $('body').addClass('bg-wood');
            $(".thumb-div").hide();
            $(".asset-holder").show();
//            bListView = (viewEl.index() == 0 ? true : false);
//            if (bListView) {
//                $('body').addClass('bg-wood');
//                $(".thumb-div").hide();
//                $(".asset-holder").show();
//            } else {
//                $('body').removeClass('bg-wood');
//                $(".asset-holder").hide();
//                $(".thumb-div").show();
//            }
            $(".assetDetail").hide();
            //$('body').removeClass('page-player');
        }
    });
    eLearningAPP.tagList.show();
    eLearningAPP.tagList.breadcrumb('All Assets');
    success({ assets: coreAssets });
};


eLearningAPP.getAssetsWithAnalytics = function (context, data, success, failure) {
    if (data == null) {
        success([]);
    }
    else {
        success(data.assets);
    }
};

eLearningAPP.showAssets = function (context, assets, success, failure) {
    var content = $(".asset-list");
    var assetViewContent = $('.asset_list');
    eLearningAPP.contentAssetList = new AssetList({
        isOnline: true,
        container: content,
        assestContainer: assetViewContent,
        assets: assets,
        bAssetView: false,
        onSelection: function (asset) {
            eLearningAPP.showAsset(asset);
        },
        onDownload: function (asset) {
        	 if (asset.onlineURL.endsWith('.zip')) {
        		 window.open(asset.onlineURL, '_system');
             	return false; 
        	 } else {
				var toShow = true;
				eLearningAPP.download(asset, function (progress) {
			        eLearningAPP.showProgress(progress.progress);
			        if(progress != null && progress.progress != null 
			        		&& progress.progress >= 100 && toShow) {
			        	alert(eLearningAPP.downloadSuccess);
			        	eLearningAPP.updateAssetOffline(asset);
			        	toShow = false;
			        }
			    });
        	 }
        },
        onView: function (asset) {
            /*if (isApp()) {*/
//                eLearningAPP.playOrOpen(asset, function (progress) {
//                    eLearningAPP.showProgress(progress.progress);
//                });
        	eLearningAPP.openSelectedAsset(asset);
           /* } else {
                var ply = new Player({ asset: asset, startTime: new Date() });
                ply.show();
            }*/
        },
        onCompleteRender: function () {
            var li = $('li.asset', content); 
            if (($(window).width() >= 540 && $(window).width() <= 767)) {
                li.eq(0).addClass('asset-list-top');
                li.eq(1).addClass('asset-list-top');
            }
            if (($(window).width() >= 768 && $(window).width() <= 994)) {
                //var li = $('li.asset', content); console.log(li);
                li.eq(0).addClass('asset-list-top');
                li.eq(1).addClass('asset-list-top');
                li.eq(2).addClass('asset-list-top');
            }
            setTimeout(function(){
            	$("img.lazy").lazyload({
                	event:"scrollstop"
                });
            },200);
        }
    });
    eLearningAPP.contentAssetList.show();

    //toggle list and asset view
//    $('.asset-menu li a').unbind('click').bind('click', function () {
//        $('.asset-menu li').show();
//        $('.asset-detail').hide();
//        $(this).parent().hide();
//        if (!$(this).hasClass('thumb-view')) {
//            $('body').addClass('bg-wood');
//            $('.thumb-div').hide();
//            $('.asset-holder').show();
//        } else {
//            $('body').removeClass('bg-wood');
//            $('.asset-holder').hide();
//            $('.thumb-div').show();
//        }
//        $("img.lazy").lazyload({
//        	event:"scrollstop"
//        });
//        return false;
//    });
    success();
};

eLearningAPP.getAssetList = function (context, data, success, failure) {
    success(eLearningAPP.assets);
};

eLearningAPP.showAssetList = function (context, data, success, failure) {
    var content = $(".assetList");
    eLearningAPP.assetList = new AssetList({
        isOnline: true,
        container: content,
        assets: data,
        onSelection: function (asset) {
            eLearningAPP.showAsset(asset);
        }
    });
    eLearningAPP.assetList.show();
    eLearningAPP.assetListPopulated = true;
    eLearningAPP.showAsset(data[0]);
    success();
};

eLearningAPP.showAsset = function (asset) {
    $(".asset-holder, .thumb-div").hide();
    $('body').removeClass('bg-wood');
    if (eLearningAPP.assetDetail == null) {
        eLearningAPP.assetDetail = new AssetDetail({
            isOnline: true,
            container: $(".asset-detail"),
            asset: asset,
            onAssetLike: eLearningAPP.assetLike,
            onAssetUnliked: eLearningAPP.assetUnlike,
            onRated: eLearningAPP.assetRated,
            onSaveComments: eLearningAPP.saveComments,
            onDownload: function (asset) {
             if (asset.onlineURL.endsWith('.zip')) {
           		 window.open(asset.onlineURL, '_system');
                	return false; 
           	 } else {
            	var toShow = true;
                eLearningAPP.download(asset, function (progress) {
                    eLearningAPP.showProgress(progress.progress);
                    if(progress != null && progress.progress != null 
                    		&& progress.progress >= 100 && toShow) {
                    	alert(eLearningAPP.downloadSuccess);
                    	eLearningAPP.updateAssetOffline(asset);
                    	toShow = false;
                    }
                });
           	 }
            },
            onView: function (asset) {
                /*if (isApp()) {*/
//                    eLearningAPP.playOrOpen(asset, function (progress) {
//                        eLearningAPP.showProgress(progress.progress);
//                    });
               /* } else {
                    var ply = new Player({ asset: asset, startTime: new Date() });
                    ply.show();
                }*/
            	eLearningAPP.openSelectedAsset(asset);
            	//var ply = new Player({ assets: [asset] });
                //ply.show();
            }
        });
    } else {
        eLearningAPP.assetDetail.asset = asset;
    }
    eLearningAPP.assetDetail.show();
    Services.updateIsHubReadForAssetDiscussion(userId, asset.daCode, function (data) {
        if (data == true || data == 'true') {
        	Services.getUnReadAssetDiscussionDetails(userId, function (data) {
                var assetdata = eLearningAPP.getCommentsCount(data);
            	if (assetdata > 0) {
                    $('.asset-disc-count').show();
                    $('.asset-disc-count span').text(assetdata);
                } else {
                    $('.asset-disc-count').hide();
                }
            }, function () { });
        }
    }, function () { });

};

/*discussion forum*/
eLearningAPP.getCommentsAssets = function (discussionAssets) {
    var newAssets = new Array();
    for (var i = 0; i < eLearningAPP.FullAssets.length; i++) {
        var curAsset = eLearningAPP.FullAssets[i];
        for (var j = 0; j < discussionAssets.length; j++) {
            console.log(curAsset.daCode + ' , ' + discussionAssets[j].DA_Code);
            if (curAsset.daCode == discussionAssets[j].DA_Code) {
                curAsset.unReadComments = discussionAssets[j].Count;
                newAssets.push(curAsset);
            }
        }
    }
    console.log(newAssets);
    return newAssets;
};
eLearningAPP.getCommentsCount = function (discussionAssets) {
    var newAssets = new Array(), count = 0;
    for (var i = 0; i < eLearningAPP.FullAssets.length; i++) {
        var curAsset = eLearningAPP.FullAssets[i];
        for (var j = 0; j < discussionAssets.length; j++) {
            if (eLearningAPP.FullAssets[i].daCode == discussionAssets[j].DA_Code) {
                count += discussionAssets[j].Count;
            }
        }
    }
    return count;
};

eLearningAPP.showUnreadDiscussions = function (context, assets, success, failure) {
    $('.bread-crum').html('<li class="discussion">Pending Discussion</li><li style="width: 30px !important;"><a href="#" class="fa fa-close" onclick="window.location.reload(); return false;"></a></li>');
    eLearningAPP.showAssets(context, assets, success, failure);
    $('.bread-crum li .fa-close').bind('click', function (e) {
        $('.search_sec input').val('');
        eLearningAPP.refresh(function () {
            $('.asset-menu li a').trigger('click');
        });
    });

};
/*discussion forum*/

eLearningAPP.openSelectedAsset = function(asset) {
	coreView.showLoading("Loading...");
	eLearningAPP.getAssetImages([asset], function(assets) {
		var ply = new Player({
            headerLogo: clientLogoURL_g,
            assets: assets,
            videoUrlProperty: "lstEncodedUrls",
            assetIdProperty: "daCode",
            assetThumbnailProperty: "thumbnailURL",
            assetURLProperty: "onlineURL",
            assetDescriptionProperty: "name",
            encodedDoc: { encodedProperty: "lstAssetImageModel", encodedUrlProperty: "Image_Url", encodedId: "DA_Code" },
            scrolltype: eLearningAPP.defaultScrolltype,
            beforeShow: function () {
                $(".container").hide();
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
                    fnGetPlayTimeAndUpdate(previousAsset.daCode, startTime, previousAsset);
                }

                asset.startTime = new Date().getTime();
            },
            onPlayerClose: function (asset, previousAsset) {
                var _this = this;
                $(".container").show();
                if (asset != null) {
                    var startTime = asset.startTime;
                    var endTime = new Date().getTime();
                    var timeLapsed = endTime - startTime;
                    console.log("Previous Asset Time Lapsed: " + timeLapsed);
                    
                    fnGetPlayTimeAndUpdate(asset.daCode, startTime, asset);
                }
		/*filter assets*/
                DigitalAssetAnalytics.get(asset.daCode, function(data){
	        		if(data.length == 0) {
	        			var userInfo = JSON.parse(window.localStorage.getItem("user"));
	        			var daHistory = {
        					daCode: asset.daCode,
        					companyId: userInfo.companyId,
        					userId: userInfo.userId,
        					regionCode: userInfo.regionCode,
        					isRead: true
	        			};
	        			DigitalAssetAnalytics.insert(daHistory, function(){
	        				eLearningAPP.showAsset(asset);
	        			}, function(){
	        				eLearningAPP.showAsset(asset);
	        			});
	        		} else {
	        			eLearningAPP.showAsset(asset);
	        		}
	        	}, function(){
	        		eLearningAPP.showAsset(asset);
	        	});
		/*filter assets*/
            }
        });
        ply.show();
        coreView.hideLoading();
	}, function(e) {
		coreView.hideLoading();
		alert(networkProblemError);
	});
};

eLearningAPP.getAssetImages = function(assets, success, failure) {
	var daCodes = new Array();
	for(var i=0;i<=assets.length-1;i++) {
		daCodes.push(assets[i].daCode);
	}
	Services.getAssetImages(daCodes, assets, function(data, assets) {
		var assets = eLearningAPP.overrideAssetsWithImages(assets, data);
		if(success) success(assets);
	}, function(e) {
		if(failure) failure(e);
	});
};
eLearningAPP.overrideAssetsWithImages = function(assets, imagesArray) {
	if(assets != null && assets.length > 0) {
		var result = new Array();
		for(var i=0;i<=assets.length-1;i++) {
			var asset = assets[i];
			for(var j=0;j<=imagesArray.length-1;j++) {
				var imageArray = imagesArray[j];
				if(asset.daCode == imageArray.DA_Code) {
					$.extend(true, asset, imageArray);
				}
			}
			result.push(asset);
		}
		return result;
	} else {
		return assets;
	}
};
eLearningAPP.updateAssetOffline = function(asset) {
    var $assetDiv = $("#asset-asset-view-" + asset.daCode + ", #asset-list-view-" + asset.daCode);
    $assetDiv.find(".asset-type span img").attr('src','online/images/Memory_Card.png');
    $assetDiv.find(".down").remove();
    $assetDiv.find("#down-asset").remove();
    $($assetDiv.find("#asset-download")).parent().remove();
    $(".asset-desc .actions ul li #asset-download").parent().remove();
    if($(".asset-desc .actions ul li").length <= 0) {
        $(".asset-desc .actions").remove();
    }
    //$assetDiv.find("p.status .fa").removeClass("fa-globe").addClass("fa-hdd-o");
    $assetDiv.find("p.status span img").attr('src','online/images/Memory_Card.png');
};
eLearningAPP.assetLike = function (asset) {
    eLearningAPP.saveLikeOrUnlike(asset, true);
};

eLearningAPP.assetUnlike = function (asset) {
    eLearningAPP.saveLikeOrUnlike(asset, false);
},

eLearningAPP.saveComments = function (asset, comments) {
    //alert(comments);
    var user = eLearningAPP.currentUser;
    if (comments != null && comments != "") {
        var analytics = null;
        analytics = {
            companyCode: user.companyCode,
            daCode: asset.daCode,
            userCode: user.userCode,
            userName: user.userName,
            userRegionCode: user.regionCode,
            userRegionName: user.regionName,
            like: 0,
            dislike: 0,
            rating: 0,
            dateTime: new Date(),
            tagDescription: comments,
            productCode: ""

        };        
        var result = InsertELDetailsWeb.InsertTagAnalytics(analytics);
    }
};

eLearningAPP.saveLikeOrUnlike = function (asset, isLike) {   
    var liked = 0;
    var disliked = 0;
    if (isLike) {
        liked = 1;
    } else {
        disliked = 1;
    }
    var analytics = null;
    var user = eLearningAPP.currentUser;
    analytics = {
        companyCode: user.companyCode,
        daCode: asset.daCode,
        userCode: user.userCode,
        userName: user.userName,
        userRegionCode: user.regionCode,
        userRegionName: user.regionName,
        like: liked,
        dislike: disliked,
        rating: 0,
        dateTime: new Date(),
        tagDescription: "",
        productCode: ""

    };
    var result = InsertELDetailsWeb.InsertTagAnalytics(analytics);
    //assetService.persistAnalytics(analytics, function (data) { }, function (data) { });
};

eLearningAPP.saveRatingAnalytics = function (asset, rating) {
    var analytics = null;
    var user = eLearningAPP.currentUser;

    analytics = {
        companyCode: user.companyCode,
        daCode: asset.daCode,
        userCode: user.userCode,
        userName: user.userName,
        userRegionCode: user.regionCode,
        userRegionName: user.regionName,
        like: 0,
        dislike: 0,
        rating: rating,
        dateTime: new Date(),
        tagDescription: "",
        productCode: ""
    };
    var result = InsertELDetailsWeb.InsertTagAnalytics(analytics);
    //assetService.persistAnalytics(analytics, function (data) { }, function (data) { });
};

eLearningAPP.assetRated = function (asset, rating) {
    eLearningAPP.saveRatingAnalytics(asset, rating);
};

eLearningAPP.initTestData = function (context, data, success, failure) {
    eLearningAPP.currentUser = {
        companyCode: "COM00000001",
        userName: "administrator",
        password: "hidoctor",
        url: "myapp.hidoctor.in",
        userCode: "USC00000001",
        regionCode: "REC00000001",
        regionName: "India",
        userTypeCode: "UTC00000001",
        userTypeName: "Admin",
        regionHierarchy: "REC00000001",
        lastSyncDate: ""
    };

    //eLearningAPP.metaTags = [];
    //eLearningAPP.assets = [];
    //var java = { metaTag: "MR Learning", tagCount: 10, assets: [] };
    //eLearningAPP.metaTags.push(java);

    //var dotNet = { metaTag: "MR Advanced Learning", tagCount: 2, assets: [] };
    //eLearningAPP.metaTags.push(dotNet);

    //var android = { metaTag: "Product Training Material", tagCount: 3, assets: [] };
    //eLearningAPP.metaTags.push(android);


    //var asset = { daCode: "100", name: "L-JAVA", description: "Learn Java", documentType: "VIDEO", lastFileUpdatedTimeStamp: new Date(), analyticsHistory: { daCode: "100", starValue: 5, totalViewsCount: 35, totalLikesCount: 10, totalDislikesCount: 12 }, metaTag2: "SubTag1" };
    //asset.downloaded = "N";
    //asset.thumbnailURL = "http://landqtech.com/demo/swaas/eLearn/images/asset1.png";
    //asset.onlineURL = "http://stream.swaas.manageanycloud.com:44444/swaas/swaas/6780093179d5457da3416ef65a412c8220140131151108/27/NewMCDefinerwithApproval.mp4/playlist.m3u8?auth=secret";
    //asset.offLineURL = "http://dl.swaas.manageanycloud.com/ln/content/6780093179d5457da3416ef65a412c8220140131151108/15/NewMCDefinerwithApproval.mp4";
    //eLearningAPP.assets.push(asset);
    //java.assets.push(asset);

    //asset = { daCode: "101", name: "ANDROID-APP", description: "How to develop Android APP", documentType: "DOCUMENT", analyticsHistory: { daCode: "101", starValue: 2, totalViewsCount: 15, totalLikesCount: 10, totalDislikesCount: 2 }, metaTag2: "SubTag1" };
    //asset.downloaded = "N";
    //asset.thumbnailURL = "http://landqtech.com/demo/swaas/eLearn/images/asset2.png";
    //asset.onlineURL = "http://dl.swaas.manageanycloud.com/ln/content/7f70e06114284b9b90182f39925a8898201402041247451875/15.png";
    //asset.offLineURL = "http://dl.swaas.manageanycloud.com/ln/content/7f70e06114284b9b90182f39925a8898201402041247451875/15.png";
    //eLearningAPP.assets.push(asset);
    //java.assets.push(asset);
    //android.assets.push(asset);

    //asset = { ddaCode: "102", name: ".NET MVC", description: ".NET MVC with C#", documentType: "VIDEO", analyticsHistory: { daCode: "102", starValue: 3, totalViewsCount: 340, totalLikesCount: 120, totalDislikesCount: 120 }, metaTag2: "SubTag1" };
    //asset.downloaded = "N";
    //asset.thumbnailURL = "http://landqtech.com/demo/swaas/eLearn/images/asset3.png";
    //asset.onlineURL = "http://dl.swaas.manageanycloud.com/ln/content/4220459421414dfcab2983cbe1a69e62201402031416445346/TrainingManualAdmin26122013.ppt";
    //asset.offLineURL = "http://dl.swaas.manageanycloud.com/ln/content/4220459421414dfcab2983cbe1a69e62201402031416445346/TrainingManualAdmin26122013.ppt";
    //eLearningAPP.assets.push(asset);
    //dotNet.assets.push(asset);

    //asset = { daCode: "103", name: "J2EE", description: "J2EE", documentType: "VIDEO", analyticsHistory: { daCode: "103", starValue: 1, totalViewsCount: 45, totalLikesCount: 5, totalDislikesCount: 32 }, metaTag2: "SubTag1" };
    //asset.downloaded = "N";
    //asset.thumbnailURL = "http://landqtech.com/demo/swaas/eLearn/images/asset4.png";
    //asset.onlineURL = "http://stream.swaas.manageanycloud.com:44444/swaas/swaas/6780093179d5457da3416ef65a412c8220140131151108/27/NewMCDefinerwithApproval.mp4/playlist.m3u8?auth=secret";
    //asset.offLineURL = "http://dl.swaas.manageanycloud.com/ln/content/6780093179d5457da3416ef65a412c8220140131151108/15/NewMCDefinerwithApproval.mp4";
    //eLearningAPP.assets.push(asset);
    //java.assets.push(asset);

    //asset = { daCode: "104", name: "APP WIN8", description: "Windows 8 App", documentType: "DOCUMENT", analyticsHistory: { daCode: "104", starValue: 3, totalViewsCount: 2000, totalLikesCount: 1870, totalDislikesCount: 1298 }, metaTag2: "Product Training Material Tag1" };
    //asset.downloaded = "N";
    //asset.thumbnailURL = "http://landqtech.com/demo/swaas/eLearn/images/asset1.png";
    //asset.onlineURL = "http://dl.swaas.manageanycloud.com/ln/content/7f70e06114284b9b90182f39925a8898201402041247451875/15.png";
    //asset.offLineURL = "http://dl.swaas.manageanycloud.com/ln/content/7f70e06114284b9b90182f39925a8898201402041247451875/15.png";
    //eLearningAPP.assets.push(asset);
    //dotNet.assets.push(asset);

    //asset = { daCode: "105", name: "WA", description: "Wide Angle in Android", documentType: "DOCUMENT", analyticsHistory: { daCode: "105", starValue: 3, totalViewsCount: 1, totalLikesCount: 0, totalDislikesCount: 1 }, metaTag2: "Product Training Material Tag1" };
    //asset.downloaded = "N";
    //asset.thumbnailURL = "http://landqtech.com/demo/swaas/eLearn/images/asset2.png";
    //asset.onlineURL = "http://dl.swaas.manageanycloud.com/ln/content/7f70e06114284b9b90182f39925a8898201402041247451875/15.png";
    //asset.offLineURL = "http://dl.swaas.manageanycloud.com/ln/content/7f70e06114284b9b90182f39925a8898201402041247451875/15.png";
    //eLearningAPP.assets.push(asset);
    //android.assets.push(asset);

    //asset = { daCode: "106", name: "TA", description: "Talk back", documentType: "DOCUMENT", analyticsHistory: { daCode: "106", starValue: 1, totalViewsCount: 100, totalLikesCount: 100, totalDislikesCount: 0 }, metaTag2: "SubTag1" };
    //asset.downloaded = "N";
    //asset.thumbnailURL = "http://landqtech.com/demo/swaas/eLearn/images/asset3.png";
    //asset.onlineURL = "http://dl.swaas.manageanycloud.com/ln/content/7f70e06114284b9b90182f39925a8898201402041247451875/15.png";
    //asset.offLineURL = "http://dl.swaas.manageanycloud.com/ln/content/7f70e06114284b9b90182f39925a8898201402041247451875/15.png";
    //eLearningAPP.assets.push(asset);
    //android.assets.push(asset);

    //asset = { daCode: "107", name: "TA 2", description: "Talk back with big title very big", documentType: "VIDEO", analyticsHistory: { daCode: "107", starValue: 2, totalViewsCount: 100000, totalLikesCount: 23434, totalDislikesCount: 238 }, metaTag2: "Product Training Material Tag1" };
    //asset.downloaded = "N";
    //asset.thumbnailURL = "http://landqtech.com/demo/swaas/eLearn/images/asset4.png";
    //asset.onlineURL = "http://stream.swaas.manageanycloud.com:44444/swaas/swaas/6780093179d5457da3416ef65a412c8220140131151108/27/NewMCDefinerwithApproval.mp4/playlist.m3u8?auth=secret";
    //asset.offLineURL = "http://dl.swaas.manageanycloud.com/ln/content/6780093179d5457da3416ef65a412c8220140131151108/15/NewMCDefinerwithApproval.mp4";
    //eLearningAPP.assets.push(asset);
    //android.assets.push(asset);

    //java.tagCount = java.assets.length;
    //android.tagCount = android.assets.length;
    //dotNet.tagCount = dotNet.assets.length;

    //$.each(eLearningAPP.metaTags, function (i, metaTag) {
    //    $.each(metaTag.assets, function (j, asset) {
    //        if (asset.metaTag1 == null) {
    //            asset.metaTag1 = "#";
    //        }
    //        asset.metaTag1 = asset.metaTag1 + metaTag.metaTag + "#";
    //        if (metaTag.subTags == null) {
    //            metaTag.subTags = [];
    //        }
    //        var subTag = null;
    //        var index = -1;
    //        $.each(metaTag.subTags, function (j, subtag) {
    //            if (subtag.subTag == asset.metaTag2) {
    //                index = j;
    //            }
    //        });

    //        if (index != -1) {
    //            subTag = metaTag.subTags[index];
    //            subTag.tagCount++;
    //        } else {
    //            subTag = { subTag: asset.metaTag2, tagCount: 1, assets: [] };
    //            metaTag.subTags.push(subTag);
    //        }
    //        subTag.assets.push(asset);
    //    });


    //});
    success();
};

var asserService = {
	context: {
        asset: 'AssetApi'
    },
    getAssetImages: function (data, assets, success, failure) {
        var _this = Services;
        var context = [_this.context.asset, 'getAssetImages', _this.defaults.subdomainName, _this.defaults.companyId];
        CoreREST.postArray(_this, context, data, function(returnData) {
        	if(success) success(returnData, assets);
        }, failure);
    },
};

$.extend(true, Services, asserService);

/*help text*/
eLearningAPP.showHelpText = function () {
    var imageUrl = "../images/help/helper-1024.png";
    var helps = [{
        left: "0px",
        //right: "25px",
        top: "100px",
        arrowLeft: "3px",
        message: "See your categories and tags.",
        title: null
    }, {
        //left: "0px",
        right: "3px",
        top: "105px",
        arrowLeft: "260px",
        message: "Search, filter your assets.",
        title: null
    }, {
        //left: "0px",
        right: "415px",
        top: "350px",
        arrowLeft: "25px",
        message: "Your digital asset.",
        title: null
    }, {
        //left: "0px",
        right: "20px",
        top: "50px",
        arrowLeft: "158px",
        message: "Access your settings and controls.",
        title: null
    }, {
        left: null,
        right: "25px",
        top: "50px",
        arrowLeft: "90px",
        message: "Your information hub. ",
        title: null
    }];
    var isLandscape = false;
    if (window.innerHeight > window.innerWidth) {
        isLandscape = false;
    } else {
        isLandscape = true;
    }
    if ($(window).width() >= 1006) {
        imageUrl = "../images/help/helper-1024.png";
        helps[1].arrowLeft = "260px";
        helps[2].arrowLeft = "135px";
        helps[3].right = "3px";
        helps[3].arrowLeft = "258px";
        helps[4].right = "10px";
        helps[4].arrowLeft = "250px";
    } else if ($(window).width() >= 768 && $(window).width() < 1024) {
        imageUrl = "../images/help/helper-768.png";
        helps[1].right = "3px";
        helps[1].arrowLeft = "260px";
        helps[2].right = "200px";
        helps[2].downArrow = true;
        helps[2].top = "80px";
        helps[3].right = "3px";
        helps[3].arrowLeft = "258px";
        helps[4].right = "10px";
        helps[4].arrowLeft = "250px";
    } else if ($(window).width() >= 640 && $(window).width() < 768) {
        imageUrl = "../images/help/helper-640.png";
        helps[1].right = "3px";
        helps[1].arrowLeft = "260px";
        helps[2].right = "200px";
        helps[2].downArrow = true;
        helps[2].top = "80px";
        helps[3].right = "3px";
        helps[3].arrowLeft = "258px";
        helps[4].right = "10px";
        helps[4].arrowLeft = "250px";
    } /*else if ($(window).width() >= 480 && $(window).width() < 640) {
        imageUrl = "../images/help/helper-480.png";
        helps[1].right = "5px";
        helps[1].arrowLeft = "110px";
        helps[2].right = "140px";
        helps[2].downArrow = true;
        helps[2].top = "60px";
        helps[3].right = "3px";
        helps[4].right = "10px";
    }*/ else if (($(window).width() == 600 || $(window).width() == 601 || $(window).width() == 960) && $(window).height() <= 1000) {
        imageUrl = "../images/help/helper-600.png";
        helps[1].right = "3px";
        helps[1].arrowLeft = "260px";
        helps[2].right = "200px";
        helps[2].downArrow = true;
        helps[2].top = "80px";
        helps[3].right = "3px";
        helps[3].arrowLeft = "258px";
        helps[4].right = "10px";
        helps[4].arrowLeft = "250px";
    } else if (isLandscape) {
        imageUrl = "../images/help/helper-480.png";
        helps[1].right = "3px";
        helps[1].arrowLeft = "260px";
        helps[2].right = "85px";
        helps[2].downArrow = true;
        helps[2].top = "40px";
        helps[2].arrowLeft = "130px";
        helps[3].right = "1px";
        helps[3].arrowLeft = "270px";
        helps[4].right = "10px";
        helps[4].arrowLeft = "250px";
    } else {
        imageUrl = "../images/help/helper-320.png";
        helps[1].right = "3px";
        helps[1].arrowLeft = "260px";
        helps[2].right = "10px";
        helps[2].downArrow = true;
        helps[2].top = "65px";
        helps[2].arrowLeft = "135px";
        helps[3].right = "0px";
        helps[3].arrowLeft = "269px";
        helps[4].right = "10px";
        helps[4].arrowLeft = "255px";
    }
    var $img = $("<img>");
    $img.load(function() {
        webHelper.loadHelpPopup(imageUrl, helps, assetHelp.beforeShow, assetHelp.afterClose);
    }).attr("src", imageUrl);
};

var assetHelp = {};
assetHelp.afterClose = function () {
    $(".page").show();
    $('body').removeClass("helperlowerheight").css("overflow", "auto");
};
assetHelp.beforeShow = function () {
    $(".page").hide();
    $('body').addClass("helperlowerheight").css("overflow", "hidden");
};
/*help text*/