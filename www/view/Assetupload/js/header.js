var header = function () {
    this.previousTitle = '';
    this.el = null;
    this.hdrElActions = null;
    this.onCreateHeader = null;
    this.onBackClick = null;
    this.createHeaderWithIcons = function (classNameAry, title) {
        var hdrEl = $('<header></header>'), self = this;
        hdrEl.append('<div class="fa fa-chevron-left"></div><h2>' + title + '</h2>');
        this.previousTitle = title;
        
        if (classNameAry.length > 0) {
            var iconEl = $('<ul></ul>');
            for (var i = 0; i < classNameAry.length; i++) {
                var curIcon = classNameAry[i];
                var li = $('<li><span class="fa ' + curIcon.className + '"></span></li>');
                iconEl.append(li);
            }
            $('li', iconEl).unbind('click').bind('click', function () {
                if (self.hdrElActions)
                    self.hdrElActions($(this).index(), $(this));
            });
            hdrEl.append(iconEl);
        }
        if (this.onCreateHeader)
            this.onCreateHeader();
        $('.fa-chevron-left', hdrEl).unbind('click').bind('click', function () {
            if(self.onBackClick)
                self.onBackClick();
        });
        this.el = hdrEl;
    };
    this.createHeaderWithUpload = function (classNameAry, title) {
        var hdrEl = $('<header></header>'), self = this;
        hdrEl.append('<div class="fa fa-chevron-left"></div><h2>' + title + '</h2>');
        this.previousTitle = title;

        if (classNameAry.length > 0) {
            var iconEl = $('<ul></ul>');
            for (var i = 0; i < classNameAry.length; i++) {
                var curIcon = classNameAry[i], li = null;
                if (curIcon.className == 'fa-plus') {
                    li = $('<li style="float: left; width: 36px; text-align: center">' +
                        '<form action="#" method="post" id="upload-file" style="position: relative;">' + 
                        '<input type="file" value="" name="filename[]" multiple accept ="audio/*,video/*,image/*,*/*" style="opacity: 0; position: absolute; width: 100%; height: 100%; left: 0px; top: 0px;"/>' + 
                        '<span class="fa fa-plus"></span></form></li>');
                    
                } else if (curIcon.className == 'fa-pencil') {
                    li = $('<li style="float: left; width: 36px; text-align: center">' +
                            '<form action="#" method="post" id="upload-file" style="position: relative;">' +
                            '<input type="file" value="" name="filename" accept="image/*" style="opacity: 0; position: absolute; width: 100%; height: 100%; left: 0px; top: 0px;"/>' +
                            '<span class="fa ' + curIcon.className + '"></span></form></li>');
                } else {
                    li = $('<li><span class="fa ' + curIcon.className + '"></span></li>');
                }
                iconEl.append(li);
            }
            $('li', iconEl).unbind('click').bind('click', function () {
                if (self.hdrElActions)
                    self.hdrElActions($(this).index(), $(this));
            });
            hdrEl.append(iconEl);
        }
        $('.fa-chevron-left', hdrEl).unbind('click').bind('click', function () {
            if (self.onBackClick)
                self.onBackClick();
            return false;
        });
        this.el = hdrEl;
    };
    this.changeHeaderTitle = function (headerTitle) {
        $('h2', this.el).text(headerTitle);
    };
    this.changePreviousHeaderTitle = function () {
        this.changeHeaderTitle(this.previousTitle);
    };
};