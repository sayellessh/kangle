var SharePop = function (options) {
    this.options = options;
    this.$container = $("body");
    this.$wrapper = null;
    this.$wBody = null;
    this.$backBtn = null;
    this.$title = null;
    this.title = options.title;
    this.popId = options.popId;
    this.pages = options.pages;
    this.onClose = options.onClose;
    this.currentPage = 0;
    this.pageHistory = new Array();
    this.init();
};

SharePop.prototype.init = function () {
    var self = this;
    self.$container.remove("#" + self.popId);
    console.log(this);
    self.$wrapper = $("<div class=\"share-body-wrapper\" id=\"" + self.popId + "\">");
    self.createHeader();
    self.$container.append(self.$wrapper);
    self.initPages();
};

SharePop.prototype.createHeader = function () {
    var self = this;
    var $headerDiv = $("<div class=\"share-body-header\">");
    var $backBtn = $("<span class=\"fa fa-angle-left\" style=\"color: white; font-size: 50px; float: left;\"></span>");
    var $title = $("<h2>" + self.title + "</h2>");
    self.$backBtn = $backBtn;
    self.$title = $title;
    $headerDiv.append($backBtn);
    $headerDiv.append($title);
    
    self.$wrapper.append($headerDiv);
};

SharePop.prototype.initPages = function () {
    var self = this;
    self.bindPage(0);
};
SharePop.prototype.nextPage = function () {
    var self = this;
    var nxt = self.currentPage + 1;
    self.bindPage(nxt);
};
SharePop.prototype.bindPage = function (pageNumber, onBackPressed, fromBack) {
    var self = this;
    pageOption = self.pages[pageNumber];
    self.currentPage = pageNumber;
    if(!fromBack)
        self.pageHistory.push(pageNumber);
    self.$backBtn.unbind().bind("click", function (e) {
                                //if (onBackPressed != null) {
                                //    onBackPressed();
                                //} else {
                                //    if (self.currentPage <= 0) {
                                //        self.close();
                                //    } else {
                                //        self.bindPage(self.currentPage - 1);
                                //    }
                                //}
                                if (onBackPressed != null) {
                                onBackPressed();
                                } else {
                                if (self.pageHistory != null && self.pageHistory.length > 0) {
                                self.pageHistory.splice(self.pageHistory.length - 1);
                                if (self.pageHistory.length > 0) {
                                self.bindPage(self.pageHistory[self.pageHistory.length - 1], null, true);
                                } else {
                                self.close();
                                }
                                } else {
                                self.close();
                                }
                                }
                                });
    self.$wrapper.find(".share-body-container").remove();
    console.log(pageOption);
    self.$title.html(pageOption.title);
    self.$wBody = $("<div class=\"share-body-container\">");
    self.$wrapper.append(self.$wBody);
    if (pageOption.tabs && pageOption.tabs.length > 0) {
        self.bindTab(pageOption, pageNumber);
    }
    if (pageOption.afterLoad) pageOption.afterLoad(this);
};
SharePop.prototype.bindTab = function (pageOption, pageNumber) {
    var self = this;
    var $tabContainer = $("<div class=\"share-tab\">");
    for (var i = 0; i <= pageOption.tabs.length - 1; i++) {
        var tab = pageOption.tabs[i];
        var $span = $("<span " + (i==0?"class=\"selected\"":"") + ">");
        $span.html(tab.tabName);
        $span.data("pageOpt", tab);
        $span.unbind().bind("click", function (e) {
                            self.bindTabPage(this);
                            });
        $tabContainer.append($span);
    }
    self.$wBody.append($tabContainer);
    self.bindTabPage($tabContainer.find("span").get(0));
};

SharePop.prototype.bindTabPage = function (e) {
    var self = this;
    $(".share-tab span").removeClass("selected");
    $(e).addClass("selected");
    var tab = $(e).data("pageOpt");
    self.$wBody.find(".share-tab-body").remove();
    var $tabBody = $("<div class=\"share-tab-body\">");
    if (tab.formData) {
        for (var i = 0; i < tab.formData.length; i++) {
            var html = "";
            var curInput = tab.formData[i];
            if (curInput.type == 'text') {
                html = self.createInput(curInput);
            } else if (curInput.type == 'select') {
                html = self.createSelect(curInput);
            } else if (curInput.type == 'tags') {
                html = self.createTagSelect(curInput);
            } else if (curInput.type == 'desc') {
                html = self.createDescription(curInput);
            } else if (curInput.type == 'date') {
                html = self.createDate(curInput);
            } else if (curInput.type == 'check') {
                html = self.createCheck(curInput);
            } else if (curInput.type == 'button') {
                html = self.createButton(curInput);
            } else if (curInput.type == 'thumbwithbtn') {
                html = self.createThumbnailWithButton(curInput);
            } else if (curInput.type == 'thumbwithpreview') {
                html = self.createThumbnailWithPreview(curInput);
            } else if (curInput.type == 'bitpreviewtemplate') {
                html = self.createBigPreviewTemplate(curInput);
            } else {
                html = curInput.content;
            }
            $tabBody.append(html);
        }
    }
    if (tab.listData) {
        $tabBody.addClass("nopadding");
        var $ul = $("<ul>");
        for (var i = 0; i < tab.listData.length; i++) {
            var html = "";
            var curInput = tab.listData[i];
            html = self.createListItem(curInput);
            $ul.append(html);
        }
        $tabBody.append($ul);
    }
    self.$wBody.append($tabBody);
    $(window).off("resize");
    $(window).resize(function () {
                     self.resize();
                     });
    if (tab.onTabSelect) tab.onTabSelect(self);
    self.resize();
};


SharePop.prototype.createInput = function (option) {
    var html = '';
    html += '<div class="form-block" ' + (option.hidden?'style="display: none;"':'') + '>';
    html += '<div class="form-label">' + option.displayName + '</div>';
    html += '<div class="input-group">';
    html += '<input placeholder="' + (option.placeholder?option.placeholder:'') + '" ' + (option.max?'maxlength="' + option.max + '"':'') + ' type="text" name="' + option.name + '" id="' + option.id + '" value="' + (option.value?option.value:'') + '"/>';
    //html += '<span class="input-btn file-ext"></span>';
    html += '</div>';
    html += '</div>';
    return html;
};
SharePop.prototype.createButton = function (option) {
    var html = '';
    html += '<input type="button" name="' + option.name + '" id="' + option.id + '" value="' + (option.text) + '" class="input"/>';
    return html;
};

SharePop.prototype.createSelect = function (option) {
    var html = '';
    html += '<div class="form-block">';
    html += '<div class="form-label">' + option.displayName + '</div>';
    html += '<div class="form-select">';
    html += '<select name="' + option.name + '" id="' + option.id + '">';
    for (var i = 0; i < option.options.length; i++) {
        html += '<option value="' + option.options[i].value + '" ' + (option.value == option.options[i].value ? 'selected' : '') + '>' + option.options[i].displayValue + '</option>';
    }
    html += '</select>';
    html += '<span class="select-btn"><span class="fa fa-chevron-down"></span></span></div></div>';
    return html;
};

SharePop.prototype.createTagSelect = function (option) {
    var html = '';
    html += '<div class="form-block">';
    html += '<div class="form-label">' + option.displayName + '</div>';
    html += '<div class="form-select select-tags"><select name="' + option.name + '" id="' + option.id + '" multiple>';
    for (var i = 0; i < option.options.length; i++) {
        html += '<option value="' + option.options[i].value + '" ' + (option.value == option.options[i].value ? 'selected' : '') + '>' + option.options[i].displayValue + '</option>';
    }
    html += '</select></div>';
    html += '<p class="select-note"><em>Example: Communication skills, Leadership</em></p>';
    html += '</div>';
    return html;
};

SharePop.prototype.createDescription = function (option) {
    var html = '';
    html += '<div class="form-block">';
    html += '<div class="form-label">' + option.displayName + '</div>';
    html += '<textarea name="' + option.name + '" id="' + option.id + '">' + (option.value ? option.value : "") + '</textarea>';
    html += '</div>';
    return html;
};

SharePop.prototype.createDate = function (option) {
    var html = '';
    html += '<div class="form-block">';
    html += '<div class="form-label">Expiry Date</div>';
    html += '<div class="input-group">';
    html += '<input type="date" name="' + option.name + '" id="' + option.id + '" value="' + (option.value ? option.value : "") + '"/>';
    html += '<span class="input-btn"><span class="fa fa-calendar"></span></span>';
    html += '</div></div>';
    return html;
};

SharePop.prototype.createCheck = function (option) {
    var html = '';
    html += '<div class="form-block block-check" style="' + (option.hidden ? 'display: none;' : '') + '">';
    html += '<label class="input-check">';
    html += '<input type="checkbox" name="' + option.name +
    '" id="' + option.id + '" ' + (option.checked ? 'checked' : '') + '/>';
    html += '<label for="' + option.id + '">' + option.text + '</label>';
    html += '</label>';
    html += '</div>';
    return html;
};

SharePop.prototype.createThumbnailWithButton = function (option) {
	var html = '';
    html += '<div class="form-block newwidth" id="' + option.id + '">';
    //html += '<div class="form-label">' + option.displayName + '</div>';
    //html += '<div style="text-align: center;"><div class="html-form-content static-height">' + option.html + '</div></div>';
    html += '<div style="text-align: center;"><div class="html-form-content static-height"><img class="newthumbimage" src=' + option.src + '></div></div>';
    html += '<div class="form-blocker" style="position: absolute;width: 100%;height: 100%;top: 0;left: 0;"></div>';
    html += '<div class="form-field-btn">';
    html += '<div class="share-pop-btn-wrapper"></div>';
    html += '<div class="share-pop-btn" id="changeTemplate"><a href="/">' + option.btnText + '</a></div>';
    html += '<div class="share-pop-btn preview" id="showPreview"><a href="/"><span class="fa fa-eye" style="font-size: 20px;"></span>&nbsp;Preview</a></div>';
    html += '</div>';
    html += '</div>';
    return html;
};

SharePop.prototype.createThumbnailWithPreview = function (option) {
    var html = '';
    var dataString = '';
    if (option.data != null) {
        for (var key in option.data) {
            dataString += 'data-' + key + '="' + option.data[key] + '" ';
        }
    }
    html += '<div class="form-block newwidth" id="' + option.id + '" ' + dataString + '>';
    //html += '<div class="form-label">' + option.displayName + '</div>';
    //html += '<div style="text-align: center;"><div class="html-form-content static-height">' + option.html + '</div></div>';
    html += '<div style="text-align: center;"><div class="html-form-content static-height"><img class="newthumbimage" src=' + option.src + '></div></div>';
    html += '<div class="form-blocker" style="position: absolute;width: 100%;height: 100%;top: 0;left: 0;"></div>';
    html += '<div class="form-field-btn">';
    html += '<div class="share-pop-btn-fullwrapper"></div>';
    html += '<div class="share-pop-btn-full">';
    html += '<span id="' + option.id + '-preview" class="share-btn-preview"><a class="fa fa-eye fonticon"></a><a href="/">Preview</a></span>';
    html += '<span id="' + option.id + '-choose" class="share-btn-choose"><a class="fa fa-check-circle fonticon"></a><a href="/">Choose</a></span>';
    html += '</div>';
    html += '</div>';
    html += '</div>';
    return html;
};

SharePop.prototype.createBigPreviewTemplate = function (option) {
    var html = '';
    html += '<div class="form-block" id="' + option.id + '">';
    html += '<div class="form-label">' + option.displayName + '</div>';
    html += '<div style="text-align: center;"><div class="html-form-content noscale">' + option.html + '"></div>';
    html += '</div>';
    return html;
};

SharePop.prototype.createListItem = function(option) {
    var html = '';
    html += '<li><span class="text">' + option.text + '</span><span class="toright fa fa-share"></span></li>';
    return html;
};

SharePop.prototype.resize = function () {
    var self = this;
    var len = 180;
    if ($(self.$wBody.find(".share-tab:visible")).length <= 0 || self.pages[self.currentPage].tabs.length == 1) {
        len = 150;
    }
    var hgt = $(window).height() - len;
    //$(".share-tab-body").height(hgt);
    var $tabBody = this.$wBody.find(".share-tab-body");
    $($tabBody).height(hgt);
};
SharePop.prototype.close = function () {
    var self = this;
    self.$wrapper.remove();
    if (self.onClose) self.onClose();
};

SharePop.prototype.alert = function (message, callback) {
    var self = this;
    var $alertBg = $("<div class=\"share-pop-alert-bg\"></div>");
    var $alert = $("<div class=\"share-pop-alert\">");
    var $alertHead = $("<div class=\"share-pop-alert-head\">Share Assets</div>");
    var $alertBody = $("<div class=\"share-pop-alert-body\">");
    var $alertAction = $("<div class=\"share-pop-alert-action\">");
    var $okBtn = $("<input type=\"button\" value=\"Ok\"/>");
    $alert.append($alertHead);
    $alertBody.append(message);
    $alertAction.append($okBtn);
    $alertBody.append($alertAction);
    $alert.append($alertBody);
    self.$wrapper.append($alertBg);
    self.$wrapper.append($alert);
    var top = ($(window).height() - $alert.height() - 100) / 2;
    var left = ($(window).width() - $alert.width()) / 2;
    $alert.css({
               "top": 100,
               "margin-left": left 
               });
    self.$alert = $alert;
    $okBtn.unbind().bind("click", function () {
                         self.closeAlert();
                         if (callback) callback();
                         });
};
SharePop.prototype.closeAlert = function () {
    var self = this;
    self.$wrapper.find(".share-pop-alert-bg").remove();
    self.$wrapper.find(".share-pop-alert").remove();
};

SharePop.showLoader = function () {
    $('.loader-image').show();
};
SharePop.hideLoader = function () {
    $('.loader-image').hide();
};