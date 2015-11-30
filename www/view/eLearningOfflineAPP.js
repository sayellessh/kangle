if (eLearningAPP == null){
	eLearningAPP = {};
}

		
eLearningAPP.init = function(){
	var _this = this;
	var imgUrl = 'online/images/profile_icon.png';
    
    $('#li-dvUserName').css('background', 'url("' + imgUrl + '") no-repeat top left');
    $('#li-dvUserName').css('background-size', '35px 35px');
    var user = window.localStorage.getItem('userName');
    $('#li-dvUserName').html(user);
    $('#li-dvUserName').bind('click', function(e) {
    	if(coreNET.isConnected())
            window.location.href = 'Rxbook/UserProfile.Mobile.html';
        else
            alert(resource.networkMessage.noNetwork);
    });
	window.addEventListener('orientationchange', eLearningAPP.refresh);
	//alert("offline");
	$(".showAssets").hide();
	eLearningAPP.initSettings();
    var  url = "file:///sdcard/"+resource.logoFolder+"/"+resource.logoFileName;
    $('.logo a').css({'background-image':'url('+url+')',
				        'background-position': '0% 50%',
				        'background-repeat': 'no-repeat',
				        'background-size': '100%'});
    //$('.logo a').css({'background':'url('+url+') no-repeat center left'});
    window.localStorage.setItem("companyLogoUrl", url);
    
    $(document).not($('.k-logo')).click(function(e) {
        $('#menu-panel').animate({ left: '-330px'}, 200, function(){
				$('#menu-panel').removeClass('show'); 
        });
        $('.right-sec').animate({ 'left': '0px' }, 200, function () {
	        $('.wrapper').css({ 'height': 'auto', 'overflow': '','position': '' });
	    });
    });
 	eLearningAPP.menuToggle();
 	
 		 eLearningAPP.assetAlign();
 		 $(window).resize(function(){
 		  eLearningAPP.assetAlign();
 		 });
      
      /*$('input.product_search').unbind('change').bind('change', function(){
    	  var srcString = $.trim($(this).val().toLowerCase());
    	  var matchedAssets = new Array();
    	  digitalAssetLocalDAO.getAll(function(assets){
    		  _this.assets = assets;
    		  if(_this.assets.length == 0)
    			  alert('No assets found for your search string');
    		  var uniqueAsset = {};
    		  $.each(_this.assets, function(i, asset){
                  var name = asset.name;
                  name = name.toLowerCase();
                  if(uniqueAsset[asset.daCode] == null)
                  {
                      uniqueAsset[asset.daCode] = asset;
                      if(name.indexOf(srcString) > -1) {
                          matchedAssets.push(asset);
                      }
                  }
              });
    		  if(matchedAssets && matchedAssets.length > 0 ) {
                                      alert(matchedAssets.length);
                  var finalAssets = new Array();
                  for(var index = 0;index<matchedAssets.length;index++){
                      var matchedAsset = matchedAssets[index];
                	  daAnalyticHistoryLocalDAO.getByAsset(matchedAsset.daCode, function(analyticalHistory){
              			alert(JSON.stringify(analyticalHistory));
                		matchedAsset = $.extend(matchedAsset, {analyticsHistory: analyticalHistory});
                		finalAssets.push(matchedAsset);
                                                           alert("end");
                      //if(index >= (matchedAssets.length-1)) {
                                                           //alert("s");
                      
                     // }

              		  });
                                      
                  }
                                      alert("s");
                      eLearningAPP.tagList.breadcrumb("Search Results for '"+srcString+"'");
                      eLearningAPP.showAssets(null, finalAssets);
                                      
              } else {
            	  eLearningAPP.tagList.breadcrumb("No Results for '"+srcString+"'");
            	  $(".asset-list").html("<p class='noassetfound'>No asstes found for searched string</p>");
            	  $(".asset_list").html("<p class='noassetfound'>No asstes found for searched string</p>");
              }
    	  });
      });*/
      
	var taskSpecifications = [
		//{task: eLearningAPP.initTestData, taskName:"eLearningAPP.initTestData"},
		{firstTask : eLearningAPP.getUserInfo, secondTask : eLearningAPP.showHeader},
		{firstTask : eLearningAPP.getBrowseTags, secondTask : eLearningAPP.showBrowseTags},
		{firstTask : eLearningAPP.getAssetsWithAnalytics, secondTask : eLearningAPP.showAssets}
  	];
	var taskUtil = new TaskUtil(taskSpecifications);
	taskUtil.execute(eLearningAPP, {}, function(data){
		if ($(window).width() < 720){
			$(".content").css('left', "30px");
			$(".assetDetail").css('left', "30px");
			$(".breadcrumb").css('left', "30px");
			
		} else {
			$(".content").css('left', "266px");
			$(".assetDetail").css('left',  "266px");
			$(".breadcrumb").css('left', "266px");
		}
	}, function(data){
		//alert(JSON.stringify(data));
	});
    
    $("body").swipe({
        //Generic swipe handler for all directions
        allowPageScroll: "vertical",
        swipe: function (event, direction, distance, duration, fingerCount, fingerData) {
            if(direction == 'left' || direction == 'right') {
                $('.k-logo').trigger('click');
            }
        }
    });
};

eLearningAPP.beforeMenuShow = function () {
    var innMenuHgt = $('.menu#tag').height() + $('.slide_menu').height();
    var cateMenuHgt = $('.menu#category').height() + $('.slide_menu').height();
    var useHgt = (innMenuHgt > cateMenuHgt ? innMenuHgt : cateMenuHgt);
    
    var winHgt = $(window).height() - $('.header').height();
    useHgt = (useHgt > winHgt ? useHgt : winHgt);
    
    $("#menu-panel").css({'min-height': useHgt});
    $('.wrapper').css({'height': useHgt, 'overflow': 'hidden'});
};

eLearningAPP.assetAlign = function() {
    if ($(window).width() >= 1240) {
        var rightWidth = $(window).width() - $("#menu-panel").width() + 'px';
    }
    var hgt = $(window).height();
    var leftHeight = (hgt) - ($(".header").height() + $(".footer").height()) + 'px';
    //$("#menu-panel").css({ "height": leftHeight,"overflow-y" : "scroll" });
    $("#menu-panel").css("top", $(".header").height()+1);
};

eLearningAPP.menuToggle = function() {
    $('.k-logo').bind('click', function(){
      eLearningAPP.beforeMenuShow();
      var bShow = $('#menu-panel').hasClass('show');
      $('#menu-panel').animate({
           left: (bShow ? '-330px' : '0px')
           }, 200, function(){
           if(bShow) {
           $('#menu-panel').removeClass('show');
           } else {
           $('#menu-panel').addClass('show');
           }
      });
      if(!bShow) {
          $('.right-sec').css('position','relative').animate({'left': '330px'}, 200, function(){});
          } else {
          $('.right-sec').animate({ 'left': '0px' }, 200, function () {
                $('.wrapper').css({ 'height': 'auto', 'overflow': '','position': '' });
          });
      }
      return false;
    });
};



eLearningAPP.refresh = function(){
	$(".showAssets").hide();
	var taskSpecifications = [
                          {firstTask : eLearningAPP.getBrowseTags, secondTask : eLearningAPP.showBrowseTags},
                          {firstTask : eLearningAPP.getAssetsWithAnalytics, secondTask : eLearningAPP.showAssets},
                          ];
	var taskUtil = new TaskUtil(taskSpecifications);
	taskUtil.execute(eLearningAPP, {}, function(data){
	}, function(data){});
};
		
eLearningAPP.getUserInfo = function(context, data, success, failure){
	if (eLearningAPP.currentUser == null){
		userLocalDAO.get(function(user){
			//alert(JSON.stringify(user));
			eLearningAPP.currentUser = user;
            var userDetails = eLearningAPP.currentUser;
            //alert(JSON.stringify(userDetails));
            /*if (userDetails.blobUrl != null && userDetails.blobUrl != '' && userDetails.blobUrl != undefined) {
                $('#user_img').attr('src', userDetails.blobUrl);
            } else {
               $('#user_img').attr('src','online/images/profile_icon.png');
            }*/
            $('#user_img').attr('src','online/images/profile_icon.png');
            $('#user_name').text(window.localStorage.getItem('userName').toProperCase());
            $('#li-dvUserName').html(userDetails.userName);
            
			success(eLearningAPP.currentUser);
		}, failure);
	} else {
		success(eLearningAPP.currentUser);
	}
};
		
eLearningAPP.showHeader = function(context, data, success, failure){
	//alert(JSON.stringify(data));
	/*var customerLogFilePath = resource.logoFolder+"/"+resource.logoFileName;
	var fleEntry = fileUtil.getFileEntry(customerLogFilePath);
	if(fleEntry != null){
		customerLogFilePath = fleEntry.fullPath;
	}*/
	success();
};
		
eLearningAPP.getBrowseTags = function(context, data, success, failure){
	
	assetMetaTagLocalDao.getMetaTags(function(data){
		//alert(JSON.stringify(data));
        
		digitalAssetLocalDAO.getAll(function(assets){
			var obj = {};
			obj['coreAssets'] = assets;
			//alert(JSON.stringify(assets));
			assetMetaTagLocalDao.getTaggedAssets(function(tagged) {
				//alert(JSON.stringify(tagged));
                 var taggedArray = new Array();
                 for(var i = 0; i<=tagged.length-1;i++) {
                     var taggedAsset = tagged[i];
                                                 var tmpArray = new Array();
                     var splittedTags = tagged[i].subTag.split(',');
                     for(var j=0;j<=splittedTags.length-1;j++) {
                         var tempAsset = $.extend(true, {}, taggedAsset);
                         var uniqueTag = splittedTags[j];
                         tempAsset['subTag'] = uniqueTag;
                         tmpArray[j] = tempAsset;
                     }
                                                 
                     taggedArray = taggedArray.concat(tmpArray);
                     /*var splittedTags = tagged[i].subTag.split(',');
                     for(var j=0;j<=splittedTags.length-1;j++) {
                                                 debugger;
                         var tempAsset = taggedAsset;
                         var uniqueTag = splittedTags[j];
                         //alert(uniqueTag);
                         tempAsset['subTag'] = uniqueTag;
                         //taggedArray.push(taggedAsset);
                         taggedArray[j] = tempAsset;
                         //alert(JSON.stringify(taggedArray));
                     }*/
                 }
				var obj = {};
				obj['metaTags'] = data;
				obj['taggedAssets'] = taggedArray;
				success(obj);
			});
		});
		//success(data);
	}, failure);
};
eLearningAPP.initSettings = function() {
    //alert(JSON.stringify(eLearningAPP.currentUser));
	
	var hdcustomer = window.localStorage.getItem('hidoctorcustomer')
	if(hdcustomer == 0){
	    showChangePassword = true;
	}
	var popSettingsAry = [
	            {
	            	displaytitle:"My Profile",
	            	iconclass:'arrow-profile',
	            	onclick:function(){
	                    checkNetworkConnection(function() {
	                       arrowPopup.hide();
	                        window.location.href = 'Rxbook/UserProfile.Mobile.html';
	                    },function(){
	                        alert(noNetworkconnection);
	                    });
	            	},
	            	isVisible: true
	            },{
	            	displaytitle:"Sync Data",
	            	iconclass:'arrow-sync',
	            	onclick:function(){
	                   arrowPopup.hide();
	            		eLearningAPP.sync();
	            	},
	            	isVisible: true
	            },/*{
            	displaytitle:"Reset Kangle",
            	iconclass:'arrow-format',
            	onclick : function(){
                   arrowPopup.hide();
            		formatDeviceService.startFormat(function(data){
                        setTimeout(function(){}, 3000);
                        var user = JSON.parse(window.localStorage.getItem("user"));
                        var pushNotification = window.plugins.pushNotification;
                        pushNotification.unregister(function(success) {
                        	window.location.href = 'login.html';
                        	alert("Kangle reset successfully, app will now exit.");
                        	navigator.app.exitApp();
                        }, function(e) { alert('Unable to delete push notification settings.'); }, {
                            "channelName": user.userName
                        });
                  }, function(data){});
            	},
            	isVisible:true
		        }*/{
		        	displaytitle:"Request for training",
		        	iconclass:'arrow-register',
		        	onclick : function(){
		               arrowPopup.hide();
		        		hideAllFrames();
		        		eLearningAPP.showTraingRequestFormAndRequest();
		        	},
		        	isVisible:true
		        },{
	            	displaytitle:"Go online",
	            	iconclass:'arrow-online',
	            	onclick : function() {
	                   checkNetworkConnection(function(){
	                        arrowPopup.hide();
	                        window.location.href = 'eLearningOnline.html?currentUser=' + encodeURIComponent(JSON.stringify(eLearningAPP.currentUser));
	                    },function(){
	                        alert(noNetworkconnection);
	                    });
	            	},
	            	isVisible:true
	            }
	      ];
	if(showChangePassword) {
	  var cpAry = {
	    displaytitle: "Change password",
	    iconclass: 'arrow-offline',
	    onclick: function () {
	    //window.changeActivity.change();
	        checkNetworkConnection(function(){
	            arrowPopup.hide();
	           window.location.href='changePassword.html';
	        },function(){
	            alert(noNetworkconnection);
	        });
	    },
	    isVisible: true
	  };
	  popSettingsAry.push(cpAry);
	  }
		var arrowPopup = new ArrowPopup($('#pop-settings'), {
	        container: "headersection",
	        bodyDiv:"setings",
	        offset: 60,
	        contents: popSettingsAry
	    });
	    /*home settings*/
	  var arrowPopuphome = new ArrowPopup ($('#pop-home'),{
	        container: "headersection",
	        bodyDiv: "home",
	        offset: 60,
	        contents: [
	            {
	                displaytitle: "Kangle Home",
	                iconclass: 'arrow-wire',
	                onclick: function () {
	                    //window.changeActivity.change();
	                      window.location.href = 'homePage.html';
	                },
	                isVisible: true
	            },{
	                displaytitle: "Asset page",
	                iconclass: 'arrow-offline',
	                onclick: function () {
	                    //window.changeActivity.change();
	                       window.location.reload();
	                },
	                isVisible: true
	                }
	       ]
	});
};
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
    $('.bread-crum').html('<li>Filtered by User</li>');
    var val = $('.product_search').val();
    if ($(window).width() <= 640) {
        val = $('.search-text input').val();
    }
    if(val != null && val.trim().length > 0) {
    	$('.bread-crum').html('<li><label>Filtered by "' + val + '"</label></li><li style="width: 30px !important;"><a href="#" class="fa fa-close" onclick="window.location.reload(); return false;"><a></li>');
    	if($(".bread-crum label").width() > 150) { 
    		$(".bread-crum label").width(150); 
    	}
    }
    if (val !== undefined && val !== '' && val !== null) {
        if (val.charAt(0) == '@') {
        	var assetsByUser = new Array(), userName = val.substr(1, val.length - 1);
        	eLearningAPP.searchInputResults(val, assets, false, function(searchAssets){
        		eLearningAPP.searchResults(searchAssets);
        	}, function(){ 
        		eLearningAPP.searchResults([]);
        	});
        } else {          
        	eLearningAPP.searchInputResults(val, assets, false, function(searchAssets){
        		eLearningAPP.searchResults(searchAssets);
        	}, function(){ 
        		eLearningAPP.searchResults([]);
        	});
        }
    } else {
        eLearningAPP.searchResults(assets);
    }
};
eLearningAPP.searchInputResults = function(val, assets, isSearchByUser, success, failure) {
	var matchedAssets = new Array(), uniqueAssets = {};
	digitalAssetLocalDAO.getAll(function(assets){
		if(eLearningAPP.FullAssets && eLearningAPP.FullAssets.length > 0) {
			for(var i = 0; i < eLearningAPP.FullAssets.length; i++) {
				var context = '', asset = eLearningAPP.FullAssets[i]; 
				if(isSearchByUser) {
					context = eLearningAPP.FullAssets[i].name;
				} else {
					context = eLearningAPP.FullAssets[i].name;
				}
				context = context.toLowerCase();
                if(uniqueAssets[asset.daCode] == null)
                {
                	uniqueAssets[asset.daCode] = eLearningAPP.FullAssets[i];
                    if(name.indexOf(val) > -1) {
                        matchedAssets.push(asset);
                    }
                }
			}
			
			if(matchedAssets && matchedAssets.length > 0) {
				var finalAssets = new Array();
				for(var k = 0; k < matchedAssets.length; k++){
					var curAsset = matchedAssets[k];
					daAnalyticHistoryLocalDAO.getByAsset(curAsset.daCode, function(history){
						curAsset = $.extend(curAsset, {analyticsHistory: history});
						finalAssets.push(curAsset);
						if(k == (matchedAssets.length-1)){
							success(finalAssets);
						}
					});
				}
			} else {
				success([]);
			}
		} else {
			success([]);
		}
	});
};
eLearningAPP.searchResults = function (assets) {
	var filteredAssets = assets;
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
    
    eLearningAPP.getReadAssets(filteredAssets, function(rAssets){
    	eLearningAPP.showAssets(this, rAssets, function () {
            eLearningAPP.resetFilterHide();
            var loader = $('#BulkTaskLoader');
            loader.hide();
            $('body').removeAttr('style');
            $('.asset-detail').hide();
            $('.asset-holder').show();
            $('body').addClass('bg-wood');
//            var viewState = $('.asset-menu li a:visible');
//            if (viewState.attr('id') == 'thumb-view') {
//                $('.asset-holder').show();
//                $('body').addClass('bg-wood');
//            } else {
//                $('.thumb-div').show();
//                $('body').removeClass('bg-wood');
//            }
        }, null, true);
    });
};
eLearningAPP.resetFilterHide = function () {
    eLearningAPP.resetElements('sort-size');
    eLearningAPP.resetElements('sort-alph');
    //$('li.sort .sort-inn-cont.fa-color').removeClass('fa-color');
    $('li.sort.sort-size .sort-inn-cont').removeClass('fa-color');
    $('li.sort.sort-alph .sort-inn-cont').removeClass('fa-color').addClass('fa-color');
    $('li.sort-read input').each(function (i, el) {
        el.checked = false;
    });
    $('li.sort-read .sort-size').html('Read/<br/>Unread');
    $('li.sort-read .sort-inn-cont .fa').removeClass('fa-eye fa-eye-slash').addClass('fa-check-square-o');
    $('.date-slider').remove();
    $('.type-slider').remove();
};
eLearningAPP.getReadAssets = function (assets, success, failure) {
    var selRead = $('input[name="sort-read"]:checked').val();
	var newAssets = new Array();
	if (selRead == 'R') {
		DigitalAssetAnalytics.get(null, function (readAssets) {
			var assetsDaCodes = new Array();
			if(readAssets && readAssets.length > 0) {
				for(var i = 0; i < readAssets.length; i++) {
					assetsDaCodes.push(readAssets[i].daCode);
				}
				
				for (var i = 0; i < assets.length; i++) {
					if (assetsDaCodes.indexOf(assets[i].daCode) > -1) {
			        	newAssets.push(assets[i]);    
					}
			    }				
			}
			if(success) 
				success(newAssets);
		}, function(){
			if(success) 
				success(assets);
		});
	} else if(selRead == 'U') {
		DigitalAssetAnalytics.get(null, function (readAssets) {
			var assetsDaCodes = new Array();
			if(readAssets && readAssets.length > 0) {
				for(var i = 0; i < readAssets.length; i++) {
					assetsDaCodes.push(readAssets[i].daCode);
				}
				
				for (var i = 0; i < assets.length; i++) {
					if (assetsDaCodes.indexOf(assets[i].daCode) == -1) {
			        	newAssets.push(assets[i]);
					}
				}
				if(success) 
					success(newAssets);
			} else {
				if(success) 
					success(assets);
			}
		}, function(){
			if(success) 
				success(assets);
		});
	} else {
		if(success) success(assets);
	}
    
};
eLearningAPP.getDownloadedAssets = function (downloaded, assets) { 
	//alert(downloaded);
    var newAssets = new Array();
    for (var i = 0; i < assets.length; i++) {
        if (assets[i].isDownloaded == downloaded) {
            newAssets.push(assets[i]);
        }
    }
    return newAssets;
};
eLearningAPP.getDateWiseAssets = function (days, assets) {
    var curDate = new Date(),
        newAssets = new Array(),
        daySeconds = days * 24 * 60 * 60;
    for (var i = 0; i < assets.length; i++) {
        var curAsset = assets[i],
            curAssetUploadedDate = new Date(curAsset.fileUploadDateTime);
        if (curDate.getDate() == curAssetUploadedDate.getDate() && curDate.getMonth() == curAssetUploadedDate.getMonth() &&
            curDate.getFullYear() == curAssetUploadedDate.getFullYear()) {
            newAssets.push(curAsset);
        } else {
            var mSeconds = (curDate - curAssetUploadedDate);
            mSeconds = mSeconds / 1000;
            if (mSeconds < daySeconds) {
                console.log('1 -> ' + curAsset.fileUploadDateTime);
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
eLearningAPP.showBrowseTags = function(context, metaObjects, success, failure){
	//alert(JSON.stringify(metaTags));
	var browseTag = $(".left-sec");
	console.log('metag tags offline');
	
	var metaTags = metaObjects['metaTags'];
	var taggedAssets = metaObjects['taggedAssets'];
	var coreAssets = metaObjects['coreAssets'];

	eLearningAPP.FullAssets = coreAssets;

	//alert(JSON.stringify(metaTags));
	/*$.each(metaTags, function(index, metaTag){
		var category = metaTag.category;
		var iconURL = coreView.getCategoryIconURL(category);
		metaTag.iconURL = iconURL;
	});*/

	$('.search_sec input').unbind('click').bind('click', function (e) {
    	e.preventDefault();
    });
	$('.search_sec').unbind('click').bind('click', function () {
        //$('input', $(this)).removeAttr('disabled');
        $('body').css({ 'overflow': 'hidden', 'height': $(window).height() });
        $('.search-filter').show();
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
        if (!el.hasClass('search-filter') && el.parents('.search-filter').length == 0) {
            $('.search-filter').hide();
            $('body').removeAttr('style');
            eLearningAPP.resetFilterHide();
        }
    });
	eLearningAPP.filterHtmlLoad();
	
	eLearningAPP.tagList = new TagList({
		isOnline: false,
		container: browseTag,
		taggedAssets: taggedAssets,
		metaTags: metaTags,
		getSubTags: function(metaTag, afterGot){
			assetMetaTagLocalDao.getSubTags(metaTag.metaTag, function(subTags){
				//alert(JSON.stringify(subTags));
				afterGot(subTags);
			}, function (error){
				afterGot([]);
			});
		},
		breadcrumbContainer: $(".bread-crum"),
		onSelection: function(metaTag, subTag){
            eLearningAPP.getAssetsWithAnalytics(null, {metaTag: metaTag, subTag: subTag}, function(assets){
				if(subTag === undefined) {
					formatedAssets = assets;
				} else {
					if(assets && assets.length > 0) {
						for ( var i = 0; i < assets.length; i++) {
                            var curAsset = assets[i];
                                                
							var category = curAsset.metaTag1;
							category = category.charAt(0) == '#' ? category.substr(1, category.length-1) : category;
							category = category.charAt(category.length-1) == '#' ? category.substr(0, category.length-1) : category;
							category = category.split('~')[1];
                            var metaTagArray = (curAsset.metaTag2).split(',');
                            for(var j=0;j < metaTagArray.length;j++){
                                
                                if(category == metaTag.metaTag && metaTagArray[j] == subTag.subTag) {
                                    formatedAssets.push(curAsset);
                                }
                            }
						}
					}
				}
				eLearningAPP.contentAssetList.assets = formatedAssets;
				eLearningAPP.contentAssetList.show();
				var bListView = false;
                var viewEl = $('.asset-menu li:visible');
                $('body').addClass('bg-wood');
                $(".thumb-div").hide();
                $(".asset-holder").show();
//                bListView = (viewEl.index() == 0 ? true : false);
//                if (bListView) {
//                	$('body').addClass('bg-wood');
//                    $(".thumb-div").hide();
//                    $(".asset-holder").show();
//                } else {
//                	$('body').removeClass('bg-wood');
//                    $(".asset-holder").hide();
//                    $(".thumb-div").show();
//                }
                $(".assetDetail").hide();
                $('.trainingRequestContainer').hide();
			}, failure);
		},
		onTagSelection: function (subTag) {                                       
			eLearningAPP.getTaggedAssetsWithAnalytics(null, {subTag: subTag}, function(assets){
                //alert(assets.length);
				var formatedAssets = new Array();
				if(assets && assets.length > 0) {
					for ( var i = 0; i < assets.length; i++) {
                        var curAsset = assets[i];
                        var metaTagArray = (curAsset.metaTag2).split(',');
                        for(var j=0;j < metaTagArray.length;j++){
                            if(metaTagArray[j] == subTag) {
                                formatedAssets.push(curAsset);
                            }
                        }
					}
				}
				
				eLearningAPP.contentAssetList.assets = formatedAssets;
				eLearningAPP.contentAssetList.show();
				var bListView = false;
	            var viewEl = $('.asset-menu li:visible');
	            $('body').addClass('bg-wood');
                $(".thumb-div").hide();
                $(".asset-holder").show();
//	            bListView = (viewEl.index() == 0 ? true : false);
//	            if (bListView) {
//	            	$('body').addClass('bg-wood');
//	                $(".thumb-div").hide();
//	                $(".asset-holder").show();
//	            } else {
//	            	$('body').removeClass('bg-wood');
//	                $(".asset-holder").hide();
//	                $(".thumb-div").show();
//	            }
	            $(".assetDetail").hide();
	            $('.trainingRequestContainer').hide();
			}, failure);
        }
		
	});
	eLearningAPP.tagList.show();
	if (metaTags != null && metaTags.length > 0){
		eLearningAPP.tagList.breadcrumb('All Assets');
		success({metaTag: { assets: coreAssets }});
	} else {
		//$(".breadcrumb").hide();
		//$("#settingsMenuContainer").hide();
		success(null);
	}
};
		
		
eLearningAPP.getAssetsWithAnalytics = function(context, data, success, failure){

	if(data != null){
		var metaTag1 = null;
		if (data.metaTag != null){
			metaTag1 = data.metaTag.metaTag;
		}
		var metaTag2 = null;
		if (data.subTag != null){
			//metaTag2 = "#" + data.subTag.subTag + "#";
			metaTag2 = data.subTag.subTag;
		}
		
		digitalAssetLocalDAO.getByTag(metaTag1, metaTag2, function(assets){
			//alert(assets.length);
			if(assets != null && assets.length > 0) {
				var downloadedAssets = [];
				$.each(assets, function(index, asset){
					if(asset.downloaded == "Y"){
						downloadedAssets.push(asset);
					}
				});
				//alert(JSON.stringify(downloadedAssets));
				eLearningAPP.addAnalyticsHistory(downloadedAssets, success, failure);
			}
		}, failure);
	} else {
		success(null);
	}
};

eLearningAPP.getTaggedAssetsWithAnalytics = function(context, data, success, failure){
	if(data != null){
		var metaTag1 = null;
		var metaTag2 = null;
		if (data.subTag != null){
			//metaTag2 = "#" + data.subTag.subTag + "#";
			metaTag2 = data.subTag;
		}
		
		digitalAssetLocalDAO.getByTag(metaTag1, metaTag2, function(assets){
			//alert(assets.length);
			var downloadedAssets = [];
			$.each(assets, function(index, asset){
				if(asset.downloaded == "Y"){
					downloadedAssets.push(asset);
				}
			});
			eLearningAPP.addAnalyticsHistory(downloadedAssets, success, failure);
		}, failure);
	} else {
		success(null);
	}
};
		
eLearningAPP.addAnalyticsHistory = function(assets, success, failure, index){
	if(index == null){
		index = 0;
	}
	var context = eLearningAPP;
	if(index<assets.length){
		var asset = assets[index];
		daAnalyticHistoryLocalDAO.getByAsset(asset.daCode, function(analyticalHistory){
			asset = $.extend(asset, {analyticsHistory: analyticalHistory});
			index ++;
			context.addAnalyticsHistory(assets, success, failure, index);
		}, failure);

	}else{
		eLearningAPP.FullAssets = assets;
		success(assets);
	}
};
		
eLearningAPP.showAssets = function(context, assets, success, failure, isFilter){
	//alert("showAssets->"+JSON.stringify(assets));
	var content = $(".asset-list");
	var assetViewContent = $('.asset_list');
	
	eLearningAPP.contentAssetList = new AssetList({
		isOnline: false,
		isDeleteButtonRequired : true,
		container: content,
		assestContainer: assetViewContent,
		assets: assets,
		onSelection: function(asset){
			eLearningAPP.showAsset(asset);
		},
		onView: function(asset){
			if (isApp()) {
                
            } else {
                eLearningAPP.playOrOpen(asset, function (progress) {
                    eLearningAPP.showProgress(progress.progress);
                });
            }
		},
		onDelete : function(asset){
			var buttonArray = [];
			buttonArray.push(resource.confirmationBox.no);
			buttonArray.push(resource.confirmationBox.yes);
			
			navigator.notification.confirm(resource.confirmationBox.deleteAssetMessage, function(buttonIndex){
				
				if(buttonIndex == 2){
					makeSpace.deleteAsset(asset);
				}else{
					return ;
				}
			}, resource.confirmationBox.title, buttonArray);
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
          },
	});
	eLearningAPP.contentAssetList.isFilter = (isFilter == undefined || isFilter == null ? false : true);
	eLearningAPP.contentAssetList.show();
	//toggle list and asset view
 
//	$('.asset-menu li a').unbind('click').bind('click', function () {
//		hideAllFrames();
//        $('.asset-menu li').show();
//        $('.asset-detail').hide();
//        $(this).parent().hide();
//        if (!$(this).hasClass('thumb-view')) {
//        	$('body').addClass('bg-wood');
//            $('.thumb-div').hide();
//            $('.asset-holder').show();
//        } else {
//        	$('body').removeClass('bg-wood');
//            $('.asset-holder').hide();
//            $('.thumb-div').show();
//        }
//        return false;
//    });
	//end of toggle list and asset view
	if(success) success();
};
		
eLearningAPP.getAssetList = function(context, data, success, failure){
	eLearningAPP.getAssetsWithAnalytics(null, data, function(assets){
		
		success(assets);
	}, failure);
};
		
eLearningAPP.showAssetList = function(context, data, success, failure){
	var content = $(".assetList");
	eLearningAPP.assetList = new AssetList({
		isOnline: false,
		container: content,
		assets: data,
		onSelection: function(asset){
			eLearningAPP.showAsset(asset);
		}
	});
	eLearningAPP.assetList.show();
	eLearningAPP.assetListPopulated = true;
	eLearningAPP.showAsset(data[0]);
	success();
};
		
eLearningAPP.showAsset = function(asset){
	$('body').removeClass('bg-wood')
	$(".asset-holder, .thumb-div").hide();
	if (eLearningAPP.assetDetail == null){
		eLearningAPP.assetDetail = new AssetDetail({
			isOnline: false,
			container: $(".asset-detail"),
			asset: asset,
			onAssetLike : eLearningAPP.assetLike,
			onAssetUnliked : eLearningAPP.assetUnlike,
			onRated : eLearningAPP.assetRated,
			onSaveComments : eLearningAPP.saveComments,
			onView: function(asset){
				eLearningAPP.playOrOpen(asset, function(progress){
					eLearningAPP.showProgress(progress.progress);
				});
			}
		});
	} else {
		eLearningAPP.assetDetail.asset = asset;
	}
	eLearningAPP.assetDetail.show();

};

		
eLearningAPP.assetLike = function(asset) {
	eLearningAPP.saveLikeOrUnlike(asset, true);
};

eLearningAPP.assetUnlike = function(asset) {
	eLearningAPP.saveLikeOrUnlike(asset, false);
},

eLearningAPP.saveComments = function(asset, comments){
	var user = eLearningAPP.currentUser;
	if(comments != null && comments != ""){
		var tags = comments.split("#");
		var analyticaArray = [];
		$.each(tags, function(index, tag){
			if(tag != null && tag != ""){
				var analytics = {
						companyCode: user.companyCode,
						daCode: asset.daCode,
						userCode: user.userCode,
						userRegionCode: user.regionCode,
						like: 0,
						dislike: 0,
						rating: 0,
						dateTime: new Date(),
						tagDescription: tag,
						productCode : "" 
						
				};
				analytics.daTagAnalyticId = UUIDUtil.getUID();
				analyticaArray.push(analytics);
			}
		});
		if(analyticaArray.length > 0){
			assetService.persistAnalytics(analyticaArray, function(data){}, function(data){});
		}
	}
};

eLearningAPP.saveLikeOrUnlike = function(asset, isLike){
	var liked = 0;
	var disliked = 0;
	if(isLike){
		liked = 1;
	}else{
		disliked = 1;
	}
	var analytics = null;
	var user = eLearningAPP.currentUser;
	analytics = {
			companyCode: user.companyCode,
			daCode: asset.daCode,
			userCode: user.userCode,
			userRegionCode: user.regionCode,
			like: liked,
			dislike: disliked,
			rating: 0,
			dateTime: new Date(),
			tagDescription: "",
			productCode : "" 
			
	};
	assetService.persistAnalytics(analytics, function(data){}, function(data){});
};
		

eLearningAPP.saveRatingAnalytics = function(asset, rating) {
	var analytics = null;
	var user = eLearningAPP.currentUser;
	
	analytics = {
			companyCode: user.companyCode,
			daCode: asset.daCode,
			userCode: user.userCode,
			userRegionCode: user.regionCode,
			like: 0,
			dislike: 0,
			rating: rating,
			dateTime: new Date(),
			tagDescription: "",
			productCode : "" 
	};
	assetService.persistAnalytics(analytics, function(data){}, function(data){});
};
	    
eLearningAPP.assetRated = function(asset, rating){
	eLearningAPP.saveRatingAnalytics(asset, rating);
};


var digitalAssetRemoteDAO = {
		metadata: {
			"service" : "ELInfrastructureService",
			"properties": [
						{name: "outPutId", inProperty: "Output_Id", outProperty: "Output_Id"},
			            ]
		},

		getRetired: function(params, success, failure){
			var result = CoreSOAP.invoke(this, "RetireDigitalAsset", params, "json");
			if (CoreSOAP.isError == true){
				failure();
				return;
			}
			var outputIds = [];

			if(result != null){
				$.each(result, function(index, outputDetail){
					outputIds.push(outputDetail.Output_Id);
				});
			}
			success(outputIds);
		}

		
};

eLearningAPP.sync = function(){
	if(coreNET.isConnected()){
		var taskSpecifications = [
		           {task : eLearningAPP.uploadMyData},
		           {task : eLearningAPP.retiredAssetProcess},
		           {task : trainingRequestUpsyncService.startTrainingRequestUpsyncProcess},
		           {task : errorLogService.sendErrors}
		         ];
			var taskUtil = new TaskUtil(taskSpecifications);
			var data = {};
			data.spinner = false;
			
			taskUtil.execute(eLearningAPP.sync, data, function(data1){
				eLearningAPP.showToast('Sync operation complete.');
			}, function(data1){
				alert("Error Synchronizing the data");
				eLearningAPP.showProgress("NON-DOWNLOAD-ERROR");
			});
	} else {
		alert(resource.networkMessage.noNetwork) ;
	}
};

eLearningAPP.uploadMyData = function(context, data, success, failure){
	eLearningUpsyncService.isUpsyncDataAvailable(function(isAvailable){
		if(isAvailable == true){
			eLearningUpsyncService.startUpsync(function(data){
				success();
			},function(data){
			});
		}else{
			//alert("No data available in device to upload");
			eLearningAPP.showToast("No data available in device to upload");
			success();
			return;						
		}
	},function(data){ 
		success();
	});
};

eLearningAPP.retiredAssetProcess = function(context, data, success, failure){
	eLearningAPP.upDateRetiredAssets(success, failure);
};





// retired asset starts
eLearningAPP.upDateRetiredAssets = function(success, failure){
	if (eLearningAPP.tagList.settings.metaTags == null || eLearningAPP.tagList.settings.metaTags.length == 0){
		eLearningAPP.showToast("No Assets were downloaded to check for latest version.");
		success();
		return;
	}
	
	if (coreNET.isConnected() == false){
		eLearningAPP.showToast(resource.networkMessage.noNetwork);
		success();
		return;
	}
	var params = {};
	params.correlationId = resource.correlationId;
	params.companyCode = eLearningAPP.currentUser.companyCode;
	params.userCode = eLearningAPP.currentUser.userCode;
	params.appPlatForm = resource.ssoDetail.appPlatForm;
	params.appSuiteId = resource.ssoDetail.appSuiteId;
	params.appId = resource.ssoDetail.appId;
	
	params.outPutIds = [];
	digitalAssetLocalDAO.getAll(function(assets){
		$.each(assets, function(i, asset){
			params.outPutIds.push(asset.onLineOutPutId);
		});
        retiredAssetService.checkLatestAssets(params, function(data){
          var retiredAssetsName = data.retiredAssetsName;
			var isCompleted = data.isCompleted;
	
			digitalAssetLocalDAO.getAll(function(assets){
				var assetDaCodes = [];
				$.each(assets, function(i, asset){
					assetDaCodes.push(asset.daCode);
				});
				var taskSpecifications = [
				                          {firstTask :assetAnalyticsHistoryRemoteDAO.getAssetAnalyticsHistory, secondTask :daAnalyticHistoryLocalDAO.update}
				                          ];
					var taskUtil = new TaskUtil(taskSpecifications);
					var data = {};
					data.spinner = false;
					data.user = eLearningAPP.currentUser;
					data.assetDaCodes = assetDaCodes;
					taskUtil.execute(eLearningAPP.upDateRetiredAssets, data, function(data1){
						//delete this code above
						if(retiredAssetsName.length > 0){
							var assetNames  = "";
							$.each(retiredAssetsName, function(i, assetName){
								var index = i+1;
								assetNames = assetNames+ '\n'+index +' :  '+assetName;
							});
							eLearningAPP.showProgress(100);
							eLearningAPP.showToast('Retired Assets Are:'+assetNames);
						}else{
							eLearningAPP.showProgress(100);
						}
						
						if(isCompleted == true){
							eLearningAPP.refresh();
							eLearningAPP.showToast("Check for latest Assets has been completed successfully");
						}
						success();
					},function(data){
						eLearningAPP.showProgress(100);
						success();
					});
	
			}, function(data){
				
			});

		}, function(data){
		});
		
	}, function(data){
	});
};


var retiredAssetService = {
		
		retiredAssetName : [],
		checkLatestAssets : function(params, success, failure){
			eLearningAPP.showProgress(0);
			var taskSpecifications = [
			                          {firstTask :retiredAssetService.getRetiredAssetIds, secondTask : retiredAssetService.getLocalRetiredAssets},
			                          {firstTask : retiredAssetService.deleteAssetsAndUpdateInLocal, secondTask : retiredAssetService.returnRetiredAssetNames},
			                          ];
				var taskUtil = new TaskUtil(taskSpecifications);
				params.spinner = false;
				taskUtil.execute(retiredAssetService, params, function(retiredAssetsName){
					var data = {};
					data.isCompleted = true;
					data.retiredAssetsName = retiredAssetsName;
					success(data);
				}, function(data){
					eLearningAPP.showProgress("NON-DOWNLOAD-ERROR");
					failure(data);
				});	
		},
		
		getRetiredAssetIds : function(context, params, success, failure){
			digitalAssetRemoteDAO.getRetired(params, function(retiredAssetOutputIds){
				eLearningAPP.showProgress(10);
				success(retiredAssetOutputIds);
			}, function(data){
				alert(resource.networkMessage.noNetwork);
				failure(data);
			});
			
		},

		getLocalRetiredAssets : function(context, outputIds, success, failure){
			
			if(outputIds.length > 0){
				retiredAssetService.getAllRetiredAssets(outputIds, function(assets){
					eLearningAPP.showProgress(35);
                    success(assets);
				}, failure);
			}else{
				success([]);
			}
		},
		
		getAllRetiredAssets : function(outputIds, success, failure, index, assets){
			if(index == null){
				index = 0;
			}
			if(index < outputIds.length){
				if(assets == null){
					assets = [];
				}
            digitalAssetLocalDAO.getByOutputId(outputIds[index], function(asset){
					console.log(JSON.stringify(asset));
					index ++;
					if(asset != null){
						assets.push(asset);
					}
					
					retiredAssetService.getAllRetiredAssets(outputIds, success, failure, index, assets);
				}, failure);
				
			}else{
				eLearningAPP.showProgress(25);
				success(assets);
			}
		},
		
		
		deleteAssetsAndUpdateInLocal : function(context, assets, success, failure){
			eLearningAPP.showProgress(45);
			if(assets != null && assets.length > 0){
				retiredAssetService._deleteAndUpdateInLocal(assets, success, failure);

			}else{
				success();
			}			
		},

		_deleteAndUpdateInLocal : function(assets, success, failure, index){
			if(index == null){
				index = 0;
			}
			if(index < assets.length){
				var asset = assets[index];
				
				fileUtil.deleteFile(asset.downloadedFileName);
				fileUtil.deleteFile(asset.downloadedThumbnail);
				digitalAssetLocalDAO.remove(asset.daCode, function(data){
					var metaTag = asset.metaTag1;
					var subTag = asset.metaTag2;
					if (metaTag != null && metaTag.length > 0){
						metaTag = metaTag.replace(/#/g, '');
					}
					
					if (subTag != null && subTag.length > 0){
						subTag = subTag.replace(/#/g, '');
					}
					if(metaTag != null){
						var catAndTag = metaTag.split("~"); 
						metaTag = catAndTag[1];
					}
					retiredAssetService.updateOrRemoveMetaTag(metaTag, subTag, function(data){
						retiredAssetService.retiredAssetName.push(asset.name);
						index++;
						retiredAssetService._deleteAndUpdateInLocal(assets, success, failure, index);
					}, failure);
				}, failure);

			}else{
				eLearningAPP.showProgress(85);
				success();
			}
			
		},
		
		updateOrRemoveMetaTag : function(metaTag, subTag, success, failure){
			assetMetaTagLocalDao.get(metaTag, subTag, function(metaTagDetail){
				if(metaTagDetail != null){
					var tagCount = metaTagDetail.tagCount;
					if(tagCount > 1){
						tagCount = parseInt(tagCount)-1;
						metaTagDetail.tagCount = tagCount;
						assetMetaTagLocalDao.update(metaTagDetail, success, failure);
					}else{
						assetMetaTagLocalDao.remove(metaTag,  subTag, success, failure );
					}
				}else{
					success();
				}
			}, failure);
		},
		returnRetiredAssetNames : function(context, data, success, failure){
			eLearningAPP.showProgress(95);
			success(retiredAssetService.retiredAssetName);
		}
};


var formatDeviceService = {
		startFormat : function(success, failure){
			if(!coreNET.isConnected()){
				alert(resource.networkMessage.noNetwork);
				return;
			}
			
			/*check data to upload
			 * if data available 
			 * 	if network available
			 * 		show confirmation to upload data
			 * 		if yes
			 * 			upload data
			 * 			on success of upload data got deletion step
			 * 		if no stop there		
			 *  if network not available show error alert and stop
			 * if no data to upload 
			 * show confirmation message for format device 
			 * if yes
			 *  goto deletion step
			 * if no stop there 
			 * deletion step: 
			 * delete the physical files from asset folder
			 * delete icon folder
			 * delete data from local
			 * 
			 * unregister the user
			 * show format device completed alert
			 * redirect to login page
			 */
			eLearningUpsyncService.isUpsyncDataAvailable(function(isAvailable){
				if(isAvailable == true){
					if(coreNET.isConnected()){
						var buttonArray = [];
						buttonArray.push(resource.confirmationBox.no);
						buttonArray.push(resource.confirmationBox.yes);
						navigator.notification.confirm(resource.confirmationBox.messageUpSynchOnline, function(buttonIndex){
							if(buttonIndex == 2){
								eLearningAPP.showProgress(0);
								eLearningUpsyncService.startUpsync(function(isUploadSuccess){
									trainingRequestUpsyncService.startTrainingRequestUpsyncProcess(eLearningAPP, {}, function(data){
										trainingRequestLocalDAO.remove();
										formatDeviceService.deletePhysicalDirectory(success, failure);
									}, failure);
									
									//	after data uploaded overall progress will be 25%		
								}, failure, 25);
							}else{
								return ;
							}
						}, resource.confirmationBox.title, buttonArray);
					}else{
						alert(resource.confirmationBox.messageUpSynchOffline);
						return ;
					}
				}else{
					var buttonArray = [];
					buttonArray.push(resource.confirmationBox.no);
					buttonArray.push(resource.confirmationBox.yes);
					
					navigator.notification.confirm(resource.confirmationBox.message, function(buttonIndex){
						if(buttonIndex == 2){
							eLearningAPP.showProgress(0);
							trainingRequestLocalDAO.remove();
							formatDeviceService.deletePhysicalDirectory(success, failure);
							//To do call to delete asset folder
						}else{
							return ;
						}
					}, resource.confirmationBox.title, buttonArray);
				}
			},function(data){
				eLearningAPP.showProgress("Error to get available data to upload");
			});
		},
		
		deletePhysicalDirectory : function(success, failure){
			var assetFolder = resource.assetBaseFolder;
			fileUtil.deleteDirectory(assetFolder, function(isSuccess){
				// we might have the directory if downloaded some asset else it returns false
				if(isSuccess){
					eLearningAPP.showProgress(50);
				formatDeviceService.clearLocalData(success, failure);
				}else{
					var progressObject = {};
					progressObject.error = true;
					progressObject.message = "Error in asset folder deletion";
					eLearningAPP.showProgress(progressObject);
					failure();
				}
			},function(isFailed){
				eLearningAPP.showProgress(50);
				formatDeviceService.clearLocalData(success, failure);
				//alert("Error in asset folder deletion");//if no asset is downloaded and there is no asset folder itself
				failure();
			});
		},
		
		clearLocalData : function(success, failure){
			var taskSpecifications = [
			                          {task :assetMetaTagLocalDao.clean},
			                          {task : digitalAssetLocalDAO.clean},
			                          {task : daAnalyticHistoryLocalDAO.clean},
			                          {task : userLocalDAO.clean}
			                          ];

				var taskUtil = new TaskUtil(taskSpecifications);
				var params = {};
				params.spinner = false;
				taskUtil.execute({}, params, function(data){
					eLearningAPP.showProgress(75);
					formatDeviceService.unregisterUser(success, function(data){
						alert("Error unregistering device");
						eLearningAPP.showProgress("NON-DOWNLOAD-ERROR");
						failure();
					});
					//b.clearApplicationData();
				},function(data){
					eLearningAPP.showProgress("NON-DOWNLOAD-ERROR");
					failure();
				});
		},
		
		
		unregisterUser : function(success, failure){
			//var isUnregistered = SSORemoteDAO.unRegisterUser(eLearningAPP.currentUser, resource.correlationId, device.uuid, resource.ssoDetail.appSuiteId, resource.ssoDetail.appId, resource.ssoDetail.reasonId);
			//if(isUnregistered == true){
				eLearningAPP.showProgress(100);
				success(true);
			//}else{
				//failure();
			//}
		}
		
		
			
};

var makeSpace = {
		deleteAsset : function(asset){
            //alert('delete aset');
			eLearningAPP.showProgress(0);
			var taskSpecifications = [
			                          {task : makeSpace.deleteAssetFile},
			                          {task : makeSpace.deleteThumbnail},
			                          {task : makeSpace.updateDatabase}
			                          ];
			
				var taskUtil = new TaskUtil(taskSpecifications);
				asset.spinner = false;
				taskUtil.execute(makeSpace, asset, function(data){
					eLearningAPP.showProgress(100);
					//alert("Asset deleted successfully.");
					eLearningAPP.refresh();
				}, function(data){});

		},
		
		deleteAssetFile : function(context, asset, success, failure){
            //alert('ast file del');
			var ext = "mp4";
			var assetURLSplit =null;
			if(asset.offLineURL != null){
				assetURLSplit = asset.offLineURL.split(".");
			}
			if (assetURLSplit != null && assetURLSplit.length > 0){
				ext = assetURLSplit.pop();
			}
			var fileName = 'DA_'+ asset.daCode + "." + ext;
			var assetFolder = resource.assetDownloadFolder;
			var assetFile = assetFolder + "/" + fileName;
            
			//var downloader = new Downloader();
            function deleteFile() {
            	fileUtil.deleteFile(assetFile, function(isSuccess){
                    eLearningAPP.showProgress(35);
                    success(asset);
                }, function(isSuccess){
                    var progressObject = {};
                    progressObject.error = true;
                    progressObject.message = "No asset file found";
                    eLearningAPP.showProgress(progressObject);
                    success(asset);
                });
            }
            if(asset.documentType == 'ZIP') {
            	fileUtil.deleteDirectory(assetFolder + '/' + asset.daCode, function(success) {
                     asset.documentType = 'DOCUMENT';
                     deleteFile();
                }, function(e) {
                     asset.documentType = 'DOCUMENT';
                     deleteFile();
                });
//            	downloader.deleteFile(assetFolder + '/' + asset.daCode, function(success) {
//                    asset.documentType = 'DOCUMENT';
//                    deleteFile();
//               }, function(e) {
//                    asset.documentType = 'DOCUMENT';
//                    deleteFile();
//               });
            } else {
                deleteFile();
            }
		},
		
		deleteThumbnail : function(context, asset, success, failure){
			var ext = "jpg";
			var thumbnailURLSplit = null;
			if(asset.thumbnailURL != null){
				thumbnailURLSplit= asset.thumbnailURL.split(".");
			}
			
			if (thumbnailURLSplit != null && thumbnailURLSplit.length > 0){
				ext = asset.thumbnailURL.split(".").pop();
			}	
			var fileName = 'TN_'+ asset.daCode + "." + ext;
			var assetFolder = resource.assetDownloadFolder;
			var assetThumbnailFile = assetFolder + "/" + fileName;
			//var downloader = new Downloader();
			fileUtil.deleteFile(assetThumbnailFile, function(isSuccess){
				eLearningAPP.showProgress(65);
				success(asset);
			}, function(data){
				var progressObject = {};
				progressObject.error = true;
				progressObject.message = "No asset thumbnail file found";
				eLearningAPP.showProgress(progressObject);
                success(asset);
			});
		},
		updateDatabase : function(context, asset, success, failure){
			var tag1 = asset.metaTag1;
			var tag2 = asset.metaTag2;
			metaTagService.removeOrUpdateMetaTag(tag1, tag2, function(data){
				digitalAssetLocalDAO.remove(asset.daCode, function(data){
					success(asset);
				},function(data){});
			}, function(data){});
		},
};

var assetAnalyticsHistoryRemoteDAO = {
		metadata : {
			"service" : "ELTagServices",
			"properties": [
							{name: "daCode", outProperty : "DA_Code"},
							{name: "totalViewsCount", outProperty : "TotalViews" },
							{name: "totalLikesCount", outProperty : "TotalLikes"},
							{name: "totalDislikesCount", outProperty : "TotalDislikes"},
							{name: "starValue", outProperty : "TotalRatings"}
					      ]
			},
			
		getAssetAnalyticsHistory : function(context, data, success, failure){
			if(data != null ){
				var companyCode = data.user.companyCode;
				var userCode = data.user.userCode;
				var assetDaCodes = data.assetDaCodes;
				var params = {
						correlationId : resource.correlationId,
						companyCode : companyCode,
						userCode : userCode,
						appPlatForm : resource.ssoDetail.appPlatForm,
						appSuiteId : resource.ssoDetail.appSuiteId,
						appId : resource.ssoDetail.appId,
						daCodesArr : assetDaCodes
				} ;
				
				var result = CoreSOAP.invokeGet(assetAnalyticsHistoryRemoteDAO, "GetDAConsolidatedAnalytics", params);
				if(result != null && result.length > 0){
					success(result);
				}else{
					success(null);
					return null;
				}
			}else{
				success();
			}
			
			
		}
};


eLearningAPP.showTraingRequestFormAndRequest = function(){
	trainingRequestService.showForm();
	trainingRequestService.showRequests();
};
var trainingRequestService ={
		saveTrainingRequest : function(requestDetails, success, failure){
			var trainingRequestDetails = {
					trainingRequestId : UUIDUtil.getUID(),
					requestDescription : requestDetails,
					requestDateTime : new Date(),
					isSynched : "No"
			};
			trainingRequestLocalDAO.insert(trainingRequestDetails, success, failure);
		},
		
		showForm : function(){
			$(".assetDetail").hide();
			$(".bread-crum").hide();
			var a = $('#trainingRequestContainer').length;
		
			if(a ==0){
				var containerDiv = $('.content');
				containerDiv.empty();
				containerDiv.removeClass("noassetfound");
				containerDiv.show();
				containerDiv.append('<div class="trainingRequestContainer">');
			}
			
			var _this = this;
			var cointainer = $('.trainingRequestContainer');
			cointainer.show();
			var requestformDiv = $('<div class="trainingRequestForm" id="trainingRequestForm" style="padding-top:20px;" />');
			
			requestformDiv.append('<span id="requestFormText" style="font-weight : bold;font-size: 16px;" ><b> Request for Training </b></span></br></br>');
			requestformDiv.append('<textarea id="requestDescriptionContent" cols="45" rows="6"  maxlength="1000" ></textarea></br>');
			var saveButton = $('<button id="saveRequest" class="saveButton" style="margin-top:10px;height:30px;line-height:30px;"/>');
			saveButton.append('Submit Request');
			
			saveButton.click(function(){
				var details = $('#requestDescriptionContent').val();
				$('#requestDescriptionContent').val(details.trim());
				if(details != null && details.trim() != ""){
					_this.saveTrainingRequest(details, function(data){
						$('#requestDescriptionContent').val('');
						alert('Request has been submited successfully');
						trainingRequestService.showRequests();
					}, function(data){});
				} else {
					alert("Please enter the request description");
					$('#requestDescriptionContent').focus();
				}
				
			});
			requestformDiv.append(saveButton);
			cointainer.html(requestformDiv);
		},
		
		showRequests : function(){
			var check = $('#requestContainerDiv').length;
			var  cointainer = null;
			var requestListContainer = $('.trainingRequestContainer');
			if(check == 0){
				cointainer = $('<div id="requestContainerDiv" />');
				requestListContainer.append(cointainer);
			}else{
				cointainer = $('#requestContainerDiv');
				cointainer.empty();
			}
			
			
			
			cointainer.append('<br/><br/><span class="requestText" style="font-weight : bold;font-size: 16px;margin-bottom:10px;display:inline-block;" ><b> Requests List</b></span><br/>');
			this.getRequests(function(requestsDetails){
			
				var requestTable = null;
				if(requestsDetails !=null && requestsDetails.length > 0){
					requestTable = $('<table width="100%" class="requestTable" />');
					var th = $('<tr />');
					var slno = $('<th align="left"  width="10%"/>');
					slno.append('SLNo');
					var Description = $('<th align="left"   width="55%"/>');
					Description.append('Description');
					var Status = $('<th align="left"  width="15%" />');
					Status.append('Synched');
					
					var createdON = $('<th class="requestDateHead" align="left"  width="20%" />');
					createdON.append('Date');
					
					
					th.append(slno).append(Description).append(Status).append(createdON);
					requestTable.append(th);
					cointainer.append(requestTable);
				}
				
				
				$.each(requestsDetails, function(i, requestDetail){
					console.log('inside showRequests '+i);
					console.log(requestDetail);
					i++ ;
					var requestTR = $('<tr />');
					var td1 = $('<td  align="left" />');
					td1.append(i);
					var td2 = $('<td  align="left" class="requestDescription" />');
					var requestDescription = $('<div/>').text(requestDetail.requestDescription).html();
					td2.append(requestDescription);
					
					var td3 = $('<td  align="left" />');
					td3.append(requestDetail.isSynched);
					
					var td4 = $('<td  align="left" class="requestDate" />');
				
					var requestDateTime = requestDetail.requestDateTime.format('dd/mm/yyyy');
					td4.append(requestDateTime);
					requestTR.append(td1).append(td2).append(td3).append(td4);
					requestTable.append(requestTR);

				});
			}, function(data){});
		},
		
		getRequests : function(success, failure){
			trainingRequestLocalDAO.getWithOrderByRequestDate(success, failure);
		}
};


//TrainingRequestLocalDAO

var trainingRequestLocalDAO = {
		
		metadata: {
			"tableName" : "tbl_TrainingRequest",
			"columns": [
			            {name: "trainingRequestId", columnName: "Training_Request_Id", pk:true},
			            {name: "requestDescription", columnName: "Request_Description"},
						{name: "requestDateTime", columnName:"dateTime",isDate:true},
						{name: "isSynched", columnName:"Sync_Status"}
						]
		},
		
		insert: function(trainingRequestDetails, success, failure){
			coreDAO.insert(this, trainingRequestDetails, success, failure);
		},
		
		remove: function(success, failure){
			var criteria = {};
			return coreDAO.remove(this, criteria, success, failure);			
		},
		
		get: function(trainingRequestId, success, failure){
			var criteria = {};
			if(trainingRequestId != null){
				criteria.trainingRequestId = trainingRequestId;
			}

			var result = null;
			coreDAO.getEquals(this, criteria, function(data){
				if (data.length > 0){
					result = data[0];
				} else {
					result = null;
				}
				success(result);
			}, failure);
		},
		
		getCount : function(success, failure){
			coreDAO.getEquals(this, {}, function(trainingRequests){
				if(trainingRequests !=null && trainingRequests.length > 0){
					success(trainingRequests.length);
				}else{
					success(0);
				}
			},failure);
		},
		
		getWithOrderByRequestDate : function(success, failure){
			var query = "select * from tbl_TrainingRequest order by dateTime DESC";
			coreDAO.executeCustomQuery(trainingRequestLocalDAO, query, null, success, failure);
		},
		
		clean : function(success, failure){
			trainingRequestLocalDAO.remove(null, success, failure);
		},
		
		syncGet: function(success, failure){
			var trainingRequestsArray = [];
			var recordsIds = [];
			var columns = [
			               {name: "requestDateTime", columnName:"dateTime",isDate:true}
			               ];
			coreDAO.getEquals(this, {isSynched:"No"}, function(trainingRequests){
				$.each(trainingRequests, function (index, trainingRequest){
					recordsIds.push(trainingRequest.trainingRequestId);
					var trainingRequestDetails = {};
					var requestDate = eLearningAPP.formatDataForSync(trainingRequest, columns);
					trainingRequestDetails.correlationId = resource.correlationId;
					trainingRequestDetails.companyCode = eLearningAPP.currentUser.companyCode;
					trainingRequestDetails.userCode = eLearningAPP.currentUser.userCode;
					trainingRequestDetails.regionCode = eLearningAPP.currentUser.regionCode;
					trainingRequestDetails.userName = eLearningAPP.currentUser.userName;
					trainingRequestDetails.regionName = eLearningAPP.currentUser.regionName;
					trainingRequestDetails.requestName = trainingRequest.requestDescription;
					trainingRequestDetails.requestDate = requestDate;
					trainingRequestDetails.appPlatForm = resource.ssoDetail.appPlatForm;
					trainingRequestDetails.appSuiteId = resource.ssoDetail.appSuiteId;
					trainingRequestDetails.appId = resource.ssoDetail.appId;
					trainingRequestsArray.push(trainingRequestDetails);
				});
				var data ={
					data : 	trainingRequestsArray,
					ids : recordsIds
				};
				success(data);
			}, failure);
		},
		
		update : function(trainingDetails, success, failure){
			coreDAO.update(trainingRequestLocalDAO, trainingDetails, success, failure);
		}
};

//Training data remote data. 
var trainingRequestRemoteDAO = {
		metadata: {
			"service" : "ELRequestService"
		},
		
		syncPut: function(context, params, success, failure){
			var result = null;
			if(params instanceof Array){
				for (var index = 0; index < params.length; index++){
					var requestData = params[index];
					result = CoreSOAP.invoke(trainingRequestRemoteDAO, "InsertRequest", requestData);
					if (CoreSOAP.isError == true){
						failure();
						return;
					} else if (result == false){
						success(false);
						return;
					}
				};
				success(result);
			}else{
				var requestData = params;
				result = CoreSOAP.invoke(trainingRequestRemoteDAO, "InsertRequest", requestData);
				if (CoreSOAP.isError == true){
					failure();
				} else {
					success(result);
				}
			}
		}
};

var errorLogService = {
		sendErrors : function(context, data, success, failure){
			eLearningAPP.showProgress(5);
			var errorLogRecords = ErrorLogsLocalDAO.syncGet(context);
			eLearningAPP.showProgress(50);
			setTimeout(function(){
				$.each(errorLogRecords, function(index, errorLogRecord){
					ErrorLogsRemoteDAO.syncPut(errorLogRecord);
					ErrorLogsLocalDAO.clean(errorLogRecord);
				});
				eLearningAPP.showProgress(100);
                       if(success) success();
			}, 200);
			
		}
};

var trainingRequestUpsyncService = {
		startTrainingRequestUpsyncProcess : function(context, data, success, failure){
			eLearningAPP.showProgress(5);
			var taskSpecifications = [
			                          {firstTask : trainingRequestUpsyncService.getTrainingRequestLocalData, secondTask : trainingRequestUpsyncService.upSyncTrainingRequestData},
			                          {task : trainingRequestUpsyncService.updateLocalRecordStatus}
			                          ];
		                             
				
				var taskUtil = new TaskUtil(taskSpecifications);
				taskUtil.execute(trainingRequestUpsyncService, {spinner: false}, function(data){
					//alert('Training data upload completed.');
					eLearningAPP.showProgress(100);
					eLearningAPP.showToast('Training Request successfully uploaded.');
					//eLearningAPP.showToast('Kangle Reset successfull...');
					success();
				});
		},
		
		getTrainingRequestLocalData : function(context, data, success, failure){
			trainingRequestLocalDAO.syncGet(function(data1){
				eLearningAPP.showProgress(20);
				success(data1);
				
			}, failure);
		},
		
		upSyncTrainingRequestData : function(context, data, success, failure){
			var dataToUpsync = data.data;
			var ids = data.ids;
			trainingRequestRemoteDAO.syncPut(context, dataToUpsync, function(isSuccess){
				if(isSuccess == true){
					eLearningAPP.showProgress(75);
					success(ids);
				}else{
					eLearningAPP.showProgress(75);
					success(null);
				}
			}, failure);
		},
		
		updateLocalRecordStatus : function(context, data, success, failure){
			var trainingRequestRecords = [];
			if(data != null){
				var ids = data;
				$.each(ids, function(i, id){
					trainingRequestRecords.push({trainingRequestId:id, isSynched : "Yes"});
				});
			}
			trainingRequestUpsyncService._updateLocalRecordStatus(trainingRequestRecords, success, failure);
		},
		
		_updateLocalRecordStatus : function(trainingRequestRecords, success, failure, index){
			if(index == null){
				index = 0;
			}
			
			if(trainingRequestRecords != null && index < trainingRequestRecords.length){
				var trainingRequestRecord = trainingRequestRecords[index];
				trainingRequestLocalDAO.update(trainingRequestRecord, function(isUpdated){
					index++;
					trainingRequestUpsyncService._updateLocalRecordStatus(trainingRequestRecords, success, failure, index);
				}, failure);
			}else{
				console.log('update local records status done.');
				success();
			}
			
		}
		
};

document.addEventListener("online", eLearningUpgradeService.alertAndHighLightUpgradeOption, false);


eLearningAPP.initTestData = function(context, data, success, failure){
	eLearningAPP.currentUser = {
			companyCode : "TST00000011",
			userName : "arun391",
			password : "hidoctor",
			url : "hdtesta1.hidoctor.in",
			userCode :"USC00003616",
			regionCode : "REC00000726",
			regionName : "LM MUMBAI BORIVLI WEST BORVILLI",
			userTypeCode : "UTC00000010",
			userTypeName : "MR",
			regionHierarchy : "REC00000001~REC00000709~REC00000710~REC00001351~REC00000712~REC00000713~REC00000714~REC00000715~REC00000726",
			lastSyncDate : ""
		};
	

		eLearningAPP.metaTags = [];
		eLearningAPP.assets = [];
		var java = {metaTag:"CAT001~MR Learning", tagCount:10, assets:[]};
		eLearningAPP.metaTags.push(java);

		var dotNet = {metaTag:"CAT002~MR Advanced Learning", tagCount:2, assets:[]};
		eLearningAPP.metaTags.push(dotNet);

		var android = {metaTag:"CAT002~Product Training Material", tagCount:3, assets:[]};
		eLearningAPP.metaTags.push(android);

		var asset = {daCode: "100", name: "L-JAVA", description : "Learn Java", documentType: "VIDEO", lastFileUpdatedTimeStamp: new Date(), analyticsHistory: {daCode: "100",  starValue : 4, totalViewsCount : 35, totalLikesCount:10, totalDislikesCount: 12 }, metaTag2: "SubTag1"};
		asset.downloaded = "N";
		asset.thumbnailURL = "http://landqtech.com/demo/swaas/eLearn/images/asset1.png";
		asset.onlineURL = "http://stream.swaas.manageanycloud.com:44444/swaas/swaas/6780093179d5457da3416ef65a412c8220140131151108/27/NewMCDefinerwithApproval.mp4/playlist.m3u8?auth=secret";
		asset.offLineURL = "http://dl.swaas.manageanycloud.com/ln/content/6780093179d5457da3416ef65a412c8220140131151108/15/NewMCDefinerwithApproval.mp4";
		eLearningAPP.assets.push(asset);
		java.assets.push(asset);

		asset = {daCode: "101", name: "ANDROID-APP",  description : "How to develop Android APP", documentType: "DOCUMENT", analyticsHistory: {daCode: "101", starValue : 2, totalViewsCount : 15, totalLikesCount:10, totalDislikesCount: 2 }, metaTag2: "SubTag1"};
		asset.downloaded = "N";
		asset.thumbnailURL = "http://landqtech.com/demo/swaas/eLearn/images/asset2.png";
		asset.onlineURL = "http://dl.swaas.manageanycloud.com/ln/content/7f70e06114284b9b90182f39925a8898201402041247451875/15.png";
		asset.offLineURL = "http://dl.swaas.manageanycloud.com/ln/content/7f70e06114284b9b90182f39925a8898201402041247451875/15.png";
		eLearningAPP.assets.push(asset);
		android.assets.push(asset);

		asset = {daCode: "102",  name: ".NET MVC",  description : ".NET MVC with C#", documentType: "VIDEO", analyticsHistory: {daCode: "102", starValue : 3, totalViewsCount : 340, totalLikesCount:120, totalDislikesCount: 120 }, metaTag2: "SubTag1"};
		asset.downloaded = "N";
		asset.thumbnailURL = "http://landqtech.com/demo/swaas/eLearn/images/asset3.png";
		asset.onlineURL = "http://dl.swaas.manageanycloud.com/ln/content/4220459421414dfcab2983cbe1a69e62201402031416445346/TrainingManualAdmin26122013.ppt";
		asset.offLineURL = "http://dl.swaas.manageanycloud.com/ln/content/4220459421414dfcab2983cbe1a69e62201402031416445346/TrainingManualAdmin26122013.ppt";
		eLearningAPP.assets.push(asset);
		dotNet.assets.push(asset);

		asset = {daCode: "103", name: "J2EE", description : "J2EE", documentType: "VIDEO", analyticsHistory: {daCode: "103",  starValue : 1, totalViewsCount : 45, totalLikesCount:5, totalDislikesCount: 32 }, metaTag2: "SubTag1"};
		asset.downloaded = "N";
		asset.thumbnailURL = "http://landqtech.com/demo/swaas/eLearn/images/asset4.png";
		asset.onlineURL = "http://stream.swaas.manageanycloud.com:44444/swaas/swaas/6780093179d5457da3416ef65a412c8220140131151108/27/NewMCDefinerwithApproval.mp4/playlist.m3u8?auth=secret";
		asset.offLineURL = "http://dl.swaas.manageanycloud.com/ln/content/6780093179d5457da3416ef65a412c8220140131151108/15/NewMCDefinerwithApproval.mp4";
		eLearningAPP.assets.push(asset);
		java.assets.push(asset);

		asset = {daCode: "104", name: "APP WIN8", description : "Windows 8 App", documentType: "DOCUMENT", analyticsHistory: {daCode: "104",  starValue : 3, totalViewsCount : 2000, totalLikesCount:1870, totalDislikesCount: 1298 }, metaTag2: "Product Training Material Tag1"};
		asset.downloaded = "N";
		asset.thumbnailURL = "http://landqtech.com/demo/swaas/eLearn/images/asset1.png";
		asset.onlineURL = "http://dl.swaas.manageanycloud.com/ln/content/7f70e06114284b9b90182f39925a8898201402041247451875/15.png";
		asset.offLineURL = "http://dl.swaas.manageanycloud.com/ln/content/7f70e06114284b9b90182f39925a8898201402041247451875/15.png";
		eLearningAPP.assets.push(asset);
		dotNet.assets.push(asset);

		asset = {daCode: "105", name: "WA", description : "Wide Angle in Android", documentType: "DOCUMENT", analyticsHistory: {daCode: "105",  starValue : 3, totalViewsCount : 1, totalLikesCount:0, totalDislikesCount: 1 }, metaTag2: "Product Training Material Tag1"};
		asset.downloaded = "N";
		asset.thumbnailURL = "http://landqtech.com/demo/swaas/eLearn/images/asset2.png";
		asset.onlineURL = "http://dl.swaas.manageanycloud.com/ln/content/7f70e06114284b9b90182f39925a8898201402041247451875/15.png";
		asset.offLineURL = "http://dl.swaas.manageanycloud.com/ln/content/7f70e06114284b9b90182f39925a8898201402041247451875/15.png";
		eLearningAPP.assets.push(asset);
		android.assets.push(asset);

		asset = {daCode: "106", name: "TA", description : "Talk back", documentType: "DOCUMENT", analyticsHistory: {daCode: "106",  starValue : 1, totalViewsCount : 100, totalLikesCount:100, totalDislikesCount: 0 }, metaTag2: "SubTag1"};
		asset.downloaded = "N";
		asset.thumbnailURL = "http://landqtech.com/demo/swaas/eLearn/images/asset3.png";
		asset.onlineURL = "http://dl.swaas.manageanycloud.com/ln/content/7f70e06114284b9b90182f39925a8898201402041247451875/15.png";
		asset.offLineURL = "http://dl.swaas.manageanycloud.com/ln/content/7f70e06114284b9b90182f39925a8898201402041247451875/15.png";
		eLearningAPP.assets.push(asset);
		android.assets.push(asset);

		asset = {daCode: "107", name: "TA 2", description : "Talk back with big title very big", documentType: "VIDEO", analyticsHistory: {daCode: "107",  starValue : 2, totalViewsCount : 100000, totalLikesCount:23434, totalDislikesCount: 238 }, metaTag2: "Product Training Material Tag1"};
		asset.downloaded = "N";
		asset.thumbnailURL = "http://landqtech.com/demo/swaas/eLearn/images/asset4.png";
		asset.onlineURL = "http://stream.swaas.manageanycloud.com:44444/swaas/swaas/6780093179d5457da3416ef65a412c8220140131151108/27/NewMCDefinerwithApproval.mp4/playlist.m3u8?auth=secret";
		asset.offLineURL = "http://dl.swaas.manageanycloud.com/ln/content/6780093179d5457da3416ef65a412c8220140131151108/15/NewMCDefinerwithApproval.mp4";
		eLearningAPP.assets.push(asset);
		android.assets.push(asset);

		java.tagCount = java.assets.length;
		android.tagCount = android.assets.length;
		dotNet.tagCount = dotNet.assets.length;

		$.each (eLearningAPP.metaTags, function(i, metaTag){
			$.each(metaTag.assets, function(j, asset){
				if (asset.metaTag1 == null){
					asset.metaTag1 = "#";
				}
				asset.metaTag1 = asset.metaTag1 + metaTag.metaTag + "#";
				if (metaTag.subTags == null){
					metaTag.subTags = [];
				}
				var subTag = null;
				var index = -1;
				$.each(metaTag.subTags, function(j, subtag){
					if(subtag.subTag == asset.metaTag2){
						index = j;
					}
				});
				
				if (index != -1){
					subTag = metaTag.subTags[index];
					subTag.tagCount++;
				} else {
					subTag = {subTag:asset.metaTag2, tagCount:1, assets:[]};
					metaTag.subTags.push(subTag);
				}
				subTag.assets.push(asset);
			});
			
			
		});		
		success();
		
};

var hideAllFrames = function() {
	$('body').removeClass('bg-wood');
	$('.trainingRequestContainer,.asset-holder,.thumb-div,.asset-detail').hide();
};




