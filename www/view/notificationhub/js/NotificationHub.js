var hubServices = {
    context: {
    notificationApi: "NotifyHubApi",
    meeting: "Meeting",
    },

    getNotifiationHubDetails: function (userId, hubCategory, success, failure) {
        var _this = Services;
        var context = [_this.context.notificationApi, 'getNotifiationHubDetails', _this.defaults.subdomainName, _this.defaults.companyId, userId, hubCategory, _this.defaults.utcOffset];
        CoreREST.get(_this, context, null, success, failure);
    },
    markasRead: function (hubCategory, postData, success, failure) {
        var _this = Services;
        var context = [_this.context.notificationApi, 'markasRead', _this.defaults.subdomainName, _this.defaults.companyId, hubCategory];
        CoreREST.postArray(_this, context, postData, success, failure);
    },
    markAllHubAsRead: function (userId, hubCategory, success, failure) {
        var _this = Services;
        var context = [_this.context.notificationApi, 'markAllHubAsRead', _this.defaults.subdomainName, _this.defaults.companyId, userId, hubCategory];
        CoreREST.post(_this, context, null, success, failure);
    },
    
    /*new service*/
    getNotificationHubCount: function (userId, success, failure) {
        var _this = Services;
        var context = [_this.context.notificationApi, 'getNotificationHubCount', _this.defaults.subdomainName, _this.defaults.companyId, userId];
        CoreREST.get(_this, context, null, success, failure);
    },
    changeMeetingStatus: function (meetingId, participantId, status, success, failure) {
        var _this = Services, context = '';
        context = [_this.context.meeting, 'changeMeetingStatus', _this.defaults.subdomainName, meetingId, participantId, status];
        CoreREST.post(_this, context, null, success, failure);
    },

};
$.extend(true, Services, hubServices);

var initialCloseHeight = 60;
var initialOpenHeight = 50;

var notificationHub = {
hintShow: true,

    messageConstants: {
        loading: "Loading...",
        noNotifications: "No new notifications available.",
        noNotificationsSelected: "No notifications selected, please select at least one notification.",
        noNotificationsToDismissAll: "No notifications available to dismiss."
    },
    dataConstants: {
        filterData: "filterData",
        accept: "accept",
        reject: "reject"
    },
    selectedFilter: null,

    init: function () {
        //Services.getNotificationHubCount(Services.defaults.userId, success, failure);
        //notificationHub.setFilterActions(notificationHub.filterOptions);
    	setInterval(function(){
    		window.location.reload();
    	},300000);
    	notificationHub.showLoading();
    	Services.getNotificationHubCount(Services.defaults.userId, function(data){
    		notificationHub.setFilterActions(data);
            notificationHub.hideLoading();
        }, function() {
        	notificationHub.hideLoading();
        	notificationHub.bindEmptyMessage($(".notificationContainer"), notificationHub.messageConstants.noNotifications);
        });
        //notificationHub.setFilterActions(data);
        $(window).resize(function () {
            notificationHub.setNotfTextWidth();
        });
    },
	    showLoading: function() {
	        $('.loading').show();
	    },
	    hideLoading: function() {
	        $('.loading').hide();
	    },
        setFilterActions: function (filterOptions) {
        var $filterIcon = $(".icon-filter");
        var $body = $("body");
        
        var $wrapper = $("<div class=\"filter-options-wrapper\">");
        //var $arrowUp = $("<div class=\"arrow-up\"></div><div class=\"arrow-up small\"></div>");
        //$wrapper.append($arrowUp);
        var $ul = $("<ul>");
        if (filterOptions != null && filterOptions.length > 0) {
        	var isEmpty = true;
        	for (var i = 0; i <= filterOptions.length - 1; i++) {
        		if (filterOptions[i].Count > 0) {
        			isEmpty = false;
                }
        	}
        	if(isEmpty) {
        		notificationHub.hideLoading();
        		notificationHub.bindEmptyMessage($(".notificationContainer"), notificationHub.messageConstants.noNotifications);
        		return;
        	}
            for (var i = 0; i <= filterOptions.length - 1; i++) {
                //var $img = $("<span class=\"spanImage\">");
                //$img.css("background-image", "url(" + filterOptions[i].logo + ")");
                var $name = $("<span class=\"spanName\">");
                $name.append(filterOptions[i].Category_Name);
                var noMessages = false;
                var $messageCount = $("<span class=\"spanCount\">");
                if (filterOptions[i].Count <= 20)
                    $messageCount.append(filterOptions[i].Count);
                else if (filterOptions[i].Count > 20)
                    $messageCount.append("20+");
                if (filterOptions[i].Count <= 0) {
                    $messageCount.hide();
                    noMessages = true;
                    //$name.parent('li').remove();
                }
                if(!noMessages) {
                    var $li = $("<li></li>");

                    //$li.append($img);
                    $li.append($name);
                    $li.append($messageCount);
                    $li.data(notificationHub.dataConstants.filterData, filterOptions[i]);
                    $li.bind("click", function (e) {
                        notificationHub.bindEmptyMessage($(".notificationContainer"), notificationHub.messageConstants.loading);
                        notificationHub.getFilteredData(this, notificationHub.bindFilteredData, notificationHub.ajaxFailure);
                    });
                    $ul.append($li);
                }
            }
            $wrapper.append($ul);
            $body.append($wrapper);
            $filterIcon.bind("click", function (e) {
                $wrapper.toggleClass("show");
            });
            $(document).bind("click", function (e) {
                var target = $(e.target);
                if(!target.hasClass("icon-filter") && target.parents(".icon-filter").length <= 0)
                    $wrapper.removeClass("show");
            });
            $(document).bind("touchstart", function (e) {
                var target = $(e.target);
                if (!target.hasClass("icon-filter") && target.parents(".icon-filter").length <= 0 && target.parents(".filter-options-wrapper").length <= 0)
                    $wrapper.removeClass("show");
            });
            $ul.find("li").eq(0).trigger("click");
        } else {
        	notificationHub.hideLoading();
        	notificationHub.bindEmptyMessage($div, notificationHub.messageConstants.noNotifications);
        }
    },

    getFilteredData: function (elem, success, failure) {
        $(".filter-options-wrapper ul li").removeClass("active");
        $(elem).addClass("active");
        var filData = $(elem).data(notificationHub.dataConstants.filterData);
        $(".container h2 label").html(filData.Category_Name);
        notificationHub.selectedFilter = filData;
        Services.getNotifiationHubDetails(Services.defaults.userId, $(elem).data(notificationHub.dataConstants.filterData).Category_Id, success, failure);
    },
    getFilteredByDate: function(data) {
        if (data != null && data.length > 0) {
            var dateSorted = {};
            for (var i = 0; i <= data.length - 1; i++) {
                var lDate = Date.parse(data[i].Message_Date);
                var date = new Date(lDate);
                var formatedDate = notificationHub.formatWeekDate(date);
                if (dateSorted[formatedDate] == null) {
                    dateSorted[formatedDate] = new Array()
                }
                dateSorted[formatedDate].push(data[i]);
            }
            return dateSorted;
        } else {
            return [];
        }
    },
    bindFilteredData: function(data) {
        var $content = $("#container");
        var dateSorted = notificationHub.getFilteredByDate(data);

        var hasDismissOptions = false;
        var hasDismissAllOptions = false;
        var hasAcceptButton = false;
        var hasRejectButton = false;
        if (notificationHub.selectedFilter != null && notificationHub.selectedFilter.Action != null
                && notificationHub.selectedFilter.Action.indexOf(-1) >= 0) {
            hasDismissOptions = true;
        }
        if (notificationHub.selectedFilter != null && notificationHub.selectedFilter.Action != null
                && notificationHub.selectedFilter.Action.indexOf(-2) >= 0) {
            hasDismissAllOptions = true;
        }
        if (notificationHub.selectedFilter != null && notificationHub.selectedFilter.Action != null
                && notificationHub.selectedFilter.Action.indexOf(1) >= 0) {
            hasAcceptButton = true;
        }
        if (notificationHub.selectedFilter != null && notificationHub.selectedFilter.Action != null
                && notificationHub.selectedFilter.Action.indexOf(0) >= 0) {
            hasRejectButton = true;
        }

        var $notfOptions = $("<div class=\"notfOptions\">");
        
        if(notificationHub.hintShow) {
            var $body = ("<span class=\"hint\"><span class=\"arrow-up\"></span><label>Filter your notifications</label><a href=\"#\" onclick=\"$(this).parent().remove(); return false;\" class=\"hint-close\">Close</a></span>");
            $('body').append($body);
            
            setInterval(function(){
                $(".hint").remove();
                //$(".hint-close").trigger("click");
            }, 3000);
            notificationHub.hintShow = false;
        }

        var $doneArrow = $("<span id=\"notfOptions-done\" class=\"fa fa-arrow-left\" style=\"transform: rotateY(90deg);\">");
        $doneArrow.bind("click", function (e) {
            notificationHub.clearSelection();
        });
        $notfOptions.append($doneArrow);

        var $selectCount = $("<label class=\"count\" style=\"font-size: 24px\" id=\"notfOptions-count\"></label>");
        $notfOptions.append($selectCount);

        if (hasDismissOptions) {
            var $dismiss = $("<span id=\"notfOptions-dismiss\" class=\"moveright \" style=\"transform: rotateY(90deg);\">");
            $dismiss.bind("click", function (e) {
                notificationHub.dismissSelected(this);
            });
            $notfOptions.append($dismiss);
        }
        if (hasDismissAllOptions) {
            var $dismissAll = $("<span id=\"notfOptions-dismissall\" class=\"moveright \" style=\"transform: rotateY(90deg);\">");
            $dismissAll.bind("click", function (e) {
                notificationHub.dismissAll(this);
            });
            $notfOptions.append($dismissAll);
        }
        if (hasRejectButton) {
            var $rejectBtn = $("<span id=\"notfOptions-reject\" class=\"moveright fa fa-close\" style=\"transform: rotateY(90deg);\">");
            $rejectBtn.bind("click", function (e) {
                notificationHub.acceptOrRejectActions(this, notificationHub.dataConstants.reject);
            });
            $notfOptions.append($rejectBtn);
        }
        if (hasAcceptButton) {
            var $acceptBtn = $("<span id=\"notfOptions-accept\" class=\"moveright fa fa-check\" style=\"transform: rotateY(90deg);\">");
            $acceptBtn.bind("click", function (e) {
                notificationHub.acceptOrRejectActions(this, notificationHub.dataConstants.accept);
            });
            $notfOptions.append($acceptBtn);
        }

        $content.find(".notfOptions").remove();
        $content.append($notfOptions);
        $notfOptions.hide();

        var $div = $content.find(".notificationContainer");
        $div.empty();
        if (data != null && data.length > 0) {
            for (var date in dateSorted) {
                var $dateDiv = $("<div class=\"dateData\">");
                $dateDiv.append("<label>" + date + "</label>");
                var dateData = dateSorted[date];
                var $ul = $("<ul>");
                for (var i = 0; i <= dateData.length - 1; i++) {
                    var $li = $("<li>");
                    //if (hasAcceptButton || hasRejectButton)
                    //    $li.addClass("hasActions");
                    $li.data(notificationHub.dataConstants.filterData, dateData[i]);
                    var $img = $("<span class=\"notfContThumb\">");
                    $img.css("background-image", "url(css/images/bell.png)");
                    var $imgSelected = $("<span class=\"selected fa fa-check-circle\"></span>");
                    $img.append($imgSelected);
                    //if (hasDismissOptions || hasDismissAllOptions) {
                    //    $img.bind("click", function (e) {
                    //        notificationHub.onNotificationForDismiss(this);
                    //    });
                    //}

                    $li.click(function () {
                        if (hasAcceptButton || hasRejectButton) {
                            $(".notificationContainer ul li").not($(this)).removeClass("checked").removeClass("clicked");

                        } 
                            $(this).toggleClass("clicked");
                            $(this).toggleClass("checked");
                            notificationHub.showOptions();
                    });

                    var $notfText = $("<span class=\"notfText\">");
                    $notfText.append(dateData[i].Message_text);
                    var $dateStamp = $("<span class=\"dateStamp\">");
                    var lDate = Date.parse(dateData[i].Message_Date);
                    var date = new Date(lDate);
                    $dateStamp.append(notificationHub.formatAMPM(date));
                    $li.append($img);
                    $li.append($notfText);
                    $li.append($dateStamp);

                    var notfFullTextId = "notfFullText_" + dateData[i].Id;
                    var $notfFullText = $("<span class=\"notfFullText\" id=\"" + notfFullTextId + "\">");
                    $notfFullText.append(dateData[i].Message_text);
                    $li.append($notfFullText);
                    $ul.append($li);
                }
                $dateDiv.append($ul);
                $div.append($dateDiv);
            }
        } else {
        	notificationHub.hideLoading();
            notificationHub.bindEmptyMessage($div, notificationHub.messageConstants.noNotifications);
        }
        $content.append($div);
        notificationHub.setNotfTextWidth();
    },
    hideNotfFullText: function(elem) {
        var $parent = $(elem).parent();
        $parent.toggleClass("clicked");
        var elId = $(elem).attr("id");
        var tTrans = new Transforms({
            y: elId,
            ny: 90
        });
        tTrans.resetXDIV();
        //$parent.find(".notfContThumb").trigger("click");
    },
    showNotfFullText: function(elem) {
        var $allElems = $(".notificationContainer ul li.clicked");
        $.each($allElems, function (index, object) {
            $(object).removeClass("clicked");
            $(object).removeClass("checked");
        });
        var $parent = $(elem).parent();
        var $notfFtEl = $parent.find(".notfFullText");
        $parent.toggleClass("clicked");
        $parent.find(".notfContThumb").trigger("click");
        var elId = $notfFtEl.attr("id");
        var tTrans = new Transforms({
            y: elId,
            ny: 90
        });
        tTrans.rotateXDIV();
    },
    setNotfTextWidth: function() {
        var notfWidth = $(window).width() - 40 - 60 - 30;
        $(".notfText").width(notfWidth);
        $(".notfFullText").width(notfWidth);
    },
    clearSelection: function() {
        $(".notificationContainer ul li.checked").removeClass("checked").removeClass("clicked");
        notificationHub.onNotificationForDismiss();
    },
    /*accept reject btn */
    showOptions: function () {
        var cnt = $(".notificationContainer ul li.checked").length;

        var activeButtons = $(".notfOptions span");
        var buttons = new Array();
        $.each(activeButtons, function (index, object) {
            var tmp = new Transforms({
                y: $(object).attr("id"),
                ny: 90
            });
            buttons.push(tmp);
        });
        $("#notfOptions-count").html(cnt);
        if (cnt > 0) {
            if ($(".notfOptions:visible").length <= 0) {
                $.each(buttons, function (i, b) {
                    b.rotateXDIV();
                });
                
            }
            $(".notfOptions").show();
        } else {
            $(".notfOptions").hide();
            $.each(buttons, function (i, b) {
                b.resetXDIV();
            });
            
        }
    },
    onNotificationForDismiss: function(elem, isSingleSelect) {
        if (isSingleSelect) {
            $(".notificationContainer ul li.checked").not(elem != null ? ($(elem).parents("li")) : "").removeClass("checked");
        }
        if (elem != null) {
            var $li = $(elem).parents("li");
            $li.toggleClass("checked");
        }
        var cnt = $(".notificationContainer ul li.checked").length;

        var activeButtons = $(".notfOptions span");
        var buttons = new Array();
        $.each(activeButtons, function (index, object) {
            var tmp = new Transforms({
                y: $(object).attr("id"),
                ny: 90
            });
            buttons.push(tmp);
        });
        
        $("#notfOptions-count").html(cnt);
        if (cnt > 0) {
            if ($(".notfOptions:visible").length <= 0) {
                $.each(buttons, function (i, b) {
                    b.rotateXDIV();
                });
                
            }
            $(".notfOptions").show();
        } else {
            $(".notfOptions").hide();
            $.each(buttons, function (i, b) {
                b.resetXDIV();
            });
        }
    },
    dismissSelected: function(elem) {
    	var checkedElements = $(".notificationContainer ul li.checked");
        if (checkedElements.length > 0) {
            var postData = new Array();
            var hubCategory = "";
            $.each(checkedElements, function (index, object) {
                var cData = $(object).data(notificationHub.dataConstants.filterData);
                postData.push(cData.Id);
                hubCategory = cData.Category;
            });
            Services.markasRead(hubCategory, postData, function (data) {
            	notificationHub.clearNotification(checkedElements);
            }, notificationHub.ajaxFailure);
        } else {
            alert(notificationHub.messageConstants.noNotificationsSelected);
        }
    },
    dismissAll: function(elem) {
        var checkedElements = $(".notificationContainer ul li");
        if (checkedElements.length > 0) {
            var postData = new Array();
            var hubCategory = "";
            $.each(checkedElements, function (index, object) {
                var cData = $(object).data(notificationHub.dataConstants.filterData);
                postData.push(cData.Id);
                hubCategory = cData.Category;
            });
            Services.markAllHubAsRead(Services.defaults.userId, hubCategory, function (data) {
                notificationHub.clearNotification(checkedElements);
            }, notificationHub.ajaxFailure);
        } else {
            alert(notificationHub.messageConstants.noNotificationsSelected);
        }
    },
    acceptOrRejectActions: function (inputElem, mode) {
        if (mode == notificationHub.dataConstants.accept) {
            if(notificationHub.selectedFilter.Category_Id == "F") {
                var elem = $(".notificationContainer ul li.checked").get(0);
                if ($(elem).attr("disabled")) {
                    return false;
                }
                $(elem).attr("disabled", "disabled");
                var fData = $(elem).data(notificationHub.dataConstants.filterData);
                Services.acceptInvite(Services.defaults.userId, fData.Context, fData.Context1, function (data) {
                    notificationHub.clearNotification($(elem));
                }, function (e) {
                    $(elem).removeAttr("disabled");
                });
            } else if(notificationHub.selectedFilter.Category_Id == "M") {
                var elem = $(".notificationContainer ul li.checked").get(0);
                if ($(elem).attr("disabled")) {
                    return false;
                }
                $(elem).attr("disabled", "disabled");
                var fData = $(elem).data(notificationHub.dataConstants.filterData);
                Services.changeMeetingStatus(fData.Context1,Services.defaults.userId, 1, function (data) {
                    var postData = new Array();
                    var hubCategory = fData.Category;
                    postData.push(fData.Id);
                    Services.markasRead(hubCategory, postData, function (data) {
                       notificationHub.clearNotification($(elem));
                    }, function(e) {
                        $(elem).removeAttr("disabled");
                    });
                }, function () {
                    $(elem).removeAttr("disabled");                         
                });
            }
        } else if (mode == notificationHub.dataConstants.reject) {
            if(notificationHub.selectedFilter.Category_Id == "F") {
                var elem = $(".notificationContainer ul li.checked").get(0);
                if ($(elem).attr("disabled")) {
                    return false;
                }
                $(elem).attr("disabled", "disabled");
                var fData = $(elem).data(notificationHub.dataConstants.filterData);
                Services.rejectInvite(Services.defaults.userId, fData.Context, fData.Context1, function (data) {
                    notificationHub.clearNotification($(elem));
                }, function (e) {
                    $(elem).removeAttr("disabled");
                });
            } else if(notificationHub.selectedFilter.Category_Id == "M") {
               var elem = $(".notificationContainer ul li.checked").get(0);
                if ($(elem).attr("disabled")) {
                    return false;
                }
                $(elem).attr("disabled", "disabled");
                var fData = $(elem).data(notificationHub.dataConstants.filterData);
                //Services.changeMeetingStatus(fData.Id, Services.defaults.userId, 2, function (data) {
                Services.changeMeetingStatus(fData.Context1,Services.defaults.userId, 2, function (data) {
                    var postData = new Array();
                    var hubCategory = fData.Category;
                    postData.push(fData.Id);
                    Services.markasRead(hubCategory, postData, function (data) {
                       notificationHub.clearNotification($(elem));
                    }, function(e) {
                        $(elem).removeAttr("disabled");
                    });
                }, function () {
                    $(elem).removeAttr("disabled");                         
                });
            }
        }
    },
    clearNotification: function(checkedElements) {
    	var selectedElem = $(".filter-options-wrapper ul li.active");
        var fData = selectedElem.data(notificationHub.dataConstants.filterData);
        $.each(checkedElements, function (index, object) {
            $(object).remove();
            --fData.Count;
        });
        selectedElem.data(notificationHub.dataConstants.filterData, fData);
        var $messageCount = $(".filter-options-wrapper ul li.active .spanCount");
        if (fData.Count <= 20)
            $messageCount.html(fData.Count);
        else if (fData.Count > 20)
            $messageCount.html("20+");
        if (fData.Count <= 0) {
            selectedElem.remove()
        }
        
        var listElements = $(".notificationContainer ul");
        $.each(listElements, function (index, object) {
            var lists = $(object).find("li");
            if (lists.length <= 0) {
                $(object).parent().remove();
            }
        });
        
        
        var dateElements = $(".notificationContainer .dateData");
        if (dateElements.length <= 0) {
        	notificationHub.hideLoading();
            notificationHub.bindEmptyMessage($(".notificationContainer"), notificationHub.messageConstants.noNotifications);
        }
        notificationHub.onNotificationForDismiss();
    },
    formatWeekDate: function(date) {
        var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        var weeks = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        var index = date.getDay();
        var weekString = weeks[index];
        var index = date.getMonth();
        var monthString = months[index];
        var dateString = date.getDate();
        var yearString = date.getFullYear();
        var response = weekString + ", " + monthString + " " + dateString + ", " + yearString;
        return response;
    },
    formatAMPM: function(date) {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0'+minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
    },
    bindEmptyMessage: function ($container, message) {
        var msgDiv = $("<div class=\"empty\">" + message + "</div>");
        $container.html(msgDiv);
    },
    ajaxFailure: function (e) {
        notificationHub.bindEmptyMessage($(".notificationContainer"), "Problem connecting to network, please check your internet.");
    }
};

var Transforms = function (options) {
    this.defaultNy = options.ny;
    this.rotYINT = null;
    this.ny = options.ny;
    this.y = document.getElementById(options.y);
};
Transforms.prototype.rotateYDIV = function () {
    var _this = this;
    clearInterval(_this.rotYINT)
    this.rotYINT = setInterval(function () {
        _this.startYRotate(_this.y)
    }, 10)
};
Transforms.prototype.startYRotate = function () {
    var _this = this;
    if (_this.y == null) return;
    _this.ny = _this.ny + 5;
    _this.y.style.transform = "rotateY(" + _this.ny + "deg)"
    _this.y.style.webkitTransform = "rotateY(" + _this.ny + "deg)"
    _this.y.style.OTransform = "rotateY(" + _this.ny + "deg)"
    _this.y.style.MozTransform = "rotateY(" + _this.ny + "deg)"
    if (_this.ny == 180) {
        clearInterval(_this.rotYINT)
        if (_this.ny >= 180) { _this.ny = _this.defaultNy }
    }
};
Transforms.prototype.resetYDIV = function () {
    var _this = this;
    if (_this.y == null) return;
    _this.y.style.transform = "rotateY(" + _this.defaultNy + "deg)"
    _this.y.style.webkitTransform = "rotateY(" + _this.defaultNy + "deg)"
    _this.y.style.OTransform = "rotateY(" + _this.defaultNy + "deg)"
    _this.y.style.MozTransform = "rotateY(" + _this.defaultNy + "deg)"
};

Transforms.prototype.rotateXDIV = function () {
    var _this = this;
    if (_this.y == null) return;
    clearInterval(_this.rotXINT)
    this.rotXINT = setInterval(function () {
        _this.startXRotate(_this.y)
    }, 5)
};
Transforms.prototype.startXRotate = function () {
    var _this = this;
    if (_this.y == null) return;
    _this.ny = _this.ny - 5;
    _this.y.style.transform = "rotateX(" + _this.ny + "deg)"
    _this.y.style.webkitTransform = "rotateX(" + _this.ny + "deg)"
    _this.y.style.OTransform = "rotateX(" + _this.ny + "deg)"
    _this.y.style.MozTransform = "rotateX(" + _this.ny + "deg)"
    if (_this.ny == 0) {
        clearInterval(_this.rotXINT)
        if (_this.ny <= 0) { _this.ny = _this.defaultNy }
    }
};
Transforms.prototype.resetXDIV = function () {
    var _this = this;
    if (_this.y == null) return;
    _this.y.style.transform = "rotateX(" + _this.defaultNy + "deg)"
    _this.y.style.webkitTransform = "rotateX(" + _this.defaultNy + "deg)"
    _this.y.style.OTransform = "rotateX(" + _this.defaultNy + "deg)"
    _this.y.style.MozTransform = "rotateX(" + _this.defaultNy + "deg)"
};