var Settings = function (element, options) {
    this.options = options;
    this.el = null;
    this.init();
};
Settings.prototype.init = function () {
    this.el = $('<div class="settings-wrapper"><header></header></div>');
    var self = this, content = $('<div class="content"></div>');
    var ul = $('<ul class="setting-list"></ul>');

    if (this.options.assigned)
        ul.append(this.createAssignedSettings());
    else
        ul.append(this.createUnAssignedSettings());

    content.append(ul);
    this.el.append(content);
    $('body').append(this.el);
    this.createHeader();

    $('.setting-list li').unbind('click').bind('click', function () {
        if (self.options.oneElementClick) {
            self.hide();
            self.options.oneElementClick($(this).attr('id'));
        }
    });
};
Settings.prototype.createHeader = function() {
    var hdrOptions = [], self = this;

    var hdrEl = new header();
    hdrEl.hdrElActions = function (index) {
        filterEl.hide();
        $('body').removeAttr('style');
        if (index == 1) {
            unassign.filterSelection = filterEl.selectedAssets;
            unassign.getUnassignedList(false);
        }
    };
    hdrEl.onBackClick = function () {
        self.hide();
    };
    hdrEl.createHeaderWithIcons(hdrOptions, 'Settings');
    $('.settings-wrapper header').replaceWith(hdrEl.el);
};
Settings.prototype.createAssignedSettings = function () {
    var html = '';
    html += '<li id="quick-assign"><a href="#" title=""><span class="list-icon fa fa-share"></span><span class="list-title">Quick Share</span></a></li>';
    html += '<li class="setting-sep"></li>';
    //html += '<li id="customer-assign"><a href="#" title=""><span class="list-icon fa fa-share"></span><span class="list-title">Share with Customer</span></a></li>';
    html += '<li class="setting-sep"></li>';
    //html += '<li id="show-users"><a href="#" title=""><span class="list-icon fa fa-user"></span><span class="list-title">Show Shared Users / Groups</span></a></li>';
    html += '<li class="setting-sep"></li>';
    html += '<li id="assg-prop"><a href="#" title=""><span class="list-icon fa fa-list"></span><span class="list-title">Asset Properties</span></a></li>';
	html += '<li class="setting-sep"></li>';
	//html += '<li id="asset-detail"><a href="#" title=""><span class="list-icon fa fa-play-circle-o"></span><span class="list-title">Preview</span></a></li>';
	//html += '<li class="setting-sep"></li>';
	html += '<li id="asset-retire"><a href="#" title=""><span class="list-icon fa fa-remove"></span><span class="list-title">Retire</span></a></li>';
    return html;
};
Settings.prototype.createUnAssignedSettings = function () {
    var html = '';
    html += '<li id="quick-assign"><a href="#" title=""><span class="list-icon fa fa-share"></span><span class="list-title">Quick Share</span></a></li>';
    html += '<li class="setting-sep"></li>';
    //html += '<li id="customer-assign"><a href="#" title=""><span class="list-icon fa fa-share"></span><span class="list-title">Share with Customer</span></a></li>';
    html += '<li class="setting-sep"></li>';
    html += '<li id="assg-all"><a href="#" title=""><span class="list-icon fa fa-user"></span><span class="list-title">Share with all users</span></a></li>';
    html += '<li id="assg-user"><a href="#" title=""><span class="list-icon fa fa-user"></span><span class="list-title">Share with specific user</span></a></li>';
    html += '<li class="setting-sep"></li>';
    html += '<li id="assg-prop"><a href="#" title=""><span class="list-icon fa fa-list"></span><span class="list-title">Asset Properties</span></a></li>';
    html += '<li class="setting-sep"></li>';
    //html += '<li id="assg-detail"><a href="#" title=""><span class="list-icon fa fa-play-circle-o"></span><span class="list-title">Preview</span></a></li>';
    //html += '<li class="setting-sep"></li>';
    html += '<li id="assg-retire"><a href="#" title=""><span class="list-icon fa fa-remove"></span><span class="list-title">Retire</span></a></li>';
    return html;
};
Settings.prototype.show = function () {
    $('.wrapper').hide();
    this.el.show();
};
Settings.prototype.hide = function () {
    $('.wrapper').show();
    this.el.remove();
};