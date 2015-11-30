var properties = {
    isUnassign: true,
    userId: 0,
    daCode: 0,
    init: function (userId, daCode, isUnassign) {
        properties.userId = userId;
        properties.daCode = daCode;
        properties.isUnassign = (isUnassign == 'Y' ? true : false);

        $('#change-thumb').bind('change', function () {
            var file = $('#change-thumb')[0].files;
            var frmData = new FormData();
            frmData.append('files', file[0]);
            properties.changeThumbnail(frmData);
        });
    },
    changeThumbnail: function (data) {
        if (properties.isUnassign) {
            Services.showLoader();
            Services.changeUnAssignedThumbnail(properties.userId, properties.daCode, data, function (data) {
                if (data.Transaction_Status) {
                    alert(data.Message_To_Display);
                    $('.change-thumb-img img').attr('src', data.Additional_Context);
                }
                Services.hideLoader();
            }, function () {
                Services.hideLoader();
            });
        } else {
            Services.showLoader();
            Services.changeAssignedThumbnail(properties.userId, properties.daCode, data, function (data) {
                if (data.Transaction_Status) {
                    alert(data.Message_To_Display);
                    $('.change-thumb-img img').attr('src', data.Additional_Context);
                }
                Services.hideLoader();
            }, function () {
                Services.hideLoader();
            });
        }
    },
    getAssetDetails: function () {
        if (properties.isUnassign) {
            Services.showLoader();
            Services.getUnAssignedAssetByStagingId(properties.userId, properties.daCode, function (data) {
                if (data && data.length > 0) {
                    $('.change-thumb-label b').text(data[0].File_Name);
                    $('.change-thumb-img img').attr('src', data[0].DA_Thumbnail_URL);
                }
                Services.hideLoader();
            }, function () {
                Services.hideLoader();
            });
        } else {
            Services.showLoader();
            Services.getAssignedAssetById(properties.userId, properties.daCode, function (data) {
                if (data && data.length > 0) {
                    $('.change-thumb-label b').text(data[0].DA_File_Name);
                    $('.change-thumb-img img').attr('src', data[0].DA_Thumbnail_URL);
                }
                Services.hideLoader();
            }, function () {
                Services.hideLoader();
            });
        }

        var hdrOptions = [];
        
        var hdrEl = new header();
        hdrEl.onBackClick = function () {
            $('body').removeAttr('style');
            if(properties.isUnassign)
                window.location.href = 'UnAssignedAssets.Mobile.html';
            else
                window.location.href = 'AssignedAssets.Mobile.html';
        };
        hdrEl.createHeaderWithIcons(hdrOptions, 'Thumbnail');
        $('.wrapper header').replaceWith(hdrEl.el);
    }
};

var fileForm = function (option) {
    this.userId = option.userId;
    this.option = option;
    this.inputOptions = option.assetProperties;
    this.title = option.title;
    this.headerOpts = option.headerOpts;
    this.hdrElActions = option.hdrElActions;
    this.onBackClick = option.onBackClick;
    this.init();
};
fileForm.prototype.init = function () {
    var self = this;
    var html = '<div class="file-wrapper">';
    html += '<header><div class="fa fa-chevron-left"></div><h2>' + (this.title ? this.title : 'FileProperties') + '</h2>';
    if (this.headerOpts && this.headerOpts.length > 0) {
        html += "<ul>";
        for (var i = 0; i <= this.headerOpts.length - 1; i++) {
            html += '<li><span class="fa ' + this.headerOpts[i].className + '"></span></li>';
        }
        html += "</ul>";
    }
    html += '</header>';
    html += '<div class="content prop-cont">';
    html += '<form action="" method="post">';
    for (var i = 0; i < this.inputOptions.length; i++) {
        var curInput = this.inputOptions[i];
        if (curInput.type == 'text') {
            html += this.createInput(curInput);
        } else if (curInput.type == 'select') {
            html += this.createSelect(curInput);
        } else if (curInput.type == 'tags') {
            html += this.createTagSelect(curInput);
        } else if (curInput.type == 'desc') {
            html += this.createDescription(curInput);
        } else if (curInput.type == 'date') {
            html += this.createDate(curInput);
        } else if (curInput.type == 'check') {
            html += this.createCheck(curInput);
        }
    }
    html += '</form>';
    html += '</div>';
    html += '</div>';

    $('body').append(html);
    $(".file-wrapper header .fa-chevron-left").unbind().bind("click", function (e) {
        if (self.onBackClick) self.onBackClick();
    });
    $(".file-wrapper header ul li").unbind().bind("click", function (e) {
        if (self.hdrElActions) self.hdrElActions($(this).index());
    });
    if (this.option.onCompleteRender)
        this.option.onCompleteRender(this.option.assets);
};

fileForm.prototype.createInput = function (option) {
    var html = '';
    html += '<div class="form-block">';
    html += '<div class="form-label">' + option.displayName + '</div>';
    html += '<div class="input-group">';
    html += '<input type="text" name="' + option.name + '" id="' + option.id + '" value="' + (option.value) + '"/>';
    html += '<span class="input-btn file-ext"></span>';
    html += '</div>';
    html += '</div>';
    return html;
};

fileForm.prototype.createSelect = function (option) {
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

fileForm.prototype.createTagSelect = function (option) {
    var html = '';
    html += '<div class="form-block">';
    html += '<div class="form-label">' + option.displayName + '</div>';
    html += '<div class="form-select select-tags"><select name="' + option.name + '" id="' + option.id + '" multiple>';
    for (var i = 0; i < option.options.length; i++) {
        html += '<option value="' + option.options[i].value + '" ' + (option.value == option.options[i].value ? 'selected':'') + '>' + option.options[i].displayValue + '</option>';
    }
    html += '</select></div>';
    html += '<p class="select-note"><em>Example: Communication skills, Leadership</em></p>';
    html += '</div>';
    return html;
};

fileForm.prototype.createDescription = function (option) {
    var html = '';
    html += '<div class="form-block">';
    html += '<div class="form-label">' + option.displayName + '</div>';
    html += '<textarea name="' + option.name + '" id="' + option.id + '">' + (option.value?option.value:"") + '</textarea>';
    html += '</div>';
    return html;
};

fileForm.prototype.createDate = function (option) {
    var html = '';
    html += '<div class="form-block">';
    html += '<div class="form-label">Expiry Date</div>';
    html += '<div class="input-group">';
    html += '<input type="date" name="' + option.name + '" id="' + option.id + '" value="' + (option.value?option.value:"") + '"/>';
    html += '<span class="input-btn"><span class="fa fa-calendar"></span></span>';
    html += '</div></div>';
    return html;
};

fileForm.prototype.createCheck = function (option) {
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
fileForm.prototype.updateMultipleAssets = function () {

};
fileForm.prototype.show = function () {
    $('.wrapper').hide();
    $('.file-wrapper').show();
};
fileForm.prototype.hide = function () {
    $('.file-wrapper').remove();
    $('.wrapper').show();
};