var Filter = function(options) {
	var self = this;
	this.options = options;
	this.selectedAssets = options.selectedAssets;
	this.wrapEl = null; 
	this.el = null;
	this.filterTypes = null;
	this.init();

	self.resize();
	$(window).resize(function () {
	    self.resize();
	});
};
Filter.prototype.init = function() {
	var self = this;
	this.wrapEl = $('<div class="wrapper-filter"></div>');
	this.hdrEl = $('<header></header>');
	this.el = $('<div class="filter-cont"></div>');
	
	this.wrapEl.append(this.hdrEl);
	this.wrapEl.append(this.el);
	$('body').append(this.wrapEl);
	
	this.createFilters();
	this.createFilterOptions('category');

};
Filter.prototype.resize = function() {
	var hgt = $(window).height() - $('header').height();
	this.filterTypes.css('height', hgt);
	$('.filter-details').css('height', hgt - 20);
};
Filter.prototype.show = function() {
    this.wrapEl.show();
};
Filter.prototype.hide = function() {
    this.wrapEl.remove();
};
Filter.prototype.createFilters = function() {
	var filterTypes = '<div class="filter-option">';
	filterTypes += '<ul>';
	filterTypes += '<li><a class="active" href="#" title="category"><span class="fa fa-list"></span><span class="filter-option-title">Category</span><span class="filter-count" style="display: none"></span></a></li>';
	filterTypes += '<li><a href="#" title="types"><span class="fa fa-columns"></span><span class="filter-option-title">Type</span><span class="filter-count" style="display: none"></span></a></li>';
	filterTypes += '<li><a href="#" title="users"><span class="fa fa-user"></span><span class="filter-option-title">Uploaded By</span><span class="filter-count" style="display: none"></span></a></li>';
	filterTypes += '<li><a href="#" title="tags"><span class="fa fa-tags"></span><span class="filter-option-title">Tags</span><span class="filter-count" style="display: none"></span></a></li>';
	filterTypes += '</ul>';
	filterTypes += '</div>';
	this.el.append(filterTypes);

	for (var typeName in this.selectedAssets) {
	    if (this.selectedAssets[typeName].length > 0) {
	        $('a[title="' + typeName + '"] .filter-count').show().text(this.selectedAssets[typeName].length);
	    }
	}

	this.filterTypes = $('.filter-option');
	this.bindActions();
};
Filter.prototype.createFilterOptions = function(filterId) {
	$('.filter-details').remove();
	this.resize();
	
	var self = this, filterCont = '<div class="filter-details" style="height: ' + ($(window).height() - $('header').height() - 20) + 'px">';
	filterCont += '<div class="filter-search"><input type="text" value="" placeholder="Search category"/></div>';
	filterCont += '<br/><a href="#" title="clear all" class="clear-filters">Clear <span class="fa fa-remove"></span></a>';
	var items = new Array();
	
	if(filterId == 'category') {
	    items = this.getUniqueCategories(function (data) {
	        self.htmlItems(data, filterCont, filterId);
	    });
	} else if (filterId == 'types') {
	    items = this.getUniqueTypes(function (data) {
	        self.htmlItems(data, filterCont, filterId);
	    });
	} else if (filterId == 'users') {
	    items = this.getUniqueUsers(function (data) {
	        self.htmlItems(data, filterCont, filterId);
	    });
	} else if (filterId == 'tags') {
	    items = this.getUniqueTags(function (data) {
	        console.log(data);
	        self.htmlItems(data, filterCont, filterId);
	    });
	}
};
Filter.prototype.htmlItems = function(items, filterCont, typeName){
    var count = 0, listHtml = '';
    for (var i = 0; i < items.length; i++) {
        count = count + items[i].count;
        listHtml += '<li ' + (items[i].count <= 0 ? 'class="disabled"' : '') + '><span class="list-title">' + items[i].name + ' (' + items[i].count + ')</span>';
        if (this.selectedAssets[typeName] !== undefined && this.selectedAssets[typeName].length > 0) {
            var isChecked = false;
            for (var j = 0; j < this.selectedAssets[typeName].length; j++) {
                if (items[i].value == this.selectedAssets[typeName][j]) {
                    isChecked = true;
                } 
            }
            if (items[i].count > 0) {
                listHtml += '<span class="list-input">';
                listHtml += '<input type="checkbox" value="' + items[i].value + '" ' + (isChecked ? 'checked' : '') + '/>';
                listHtml += '</span>';
            }
        } else {
            var isChecked = false;
            if (this.selectedAssets !== undefined && this.selectedAssets[typeName] !== undefined) {
                for (var j = 0; j < this.selectedAssets[typeName].length; j++) {
                    if (items[i].value == this.selectedAssets[typeName][j]) {
                        isChecked = true;
                    }
                }
            }
            if (items[i].count > 0) {
                listHtml += '<span class="list-input">';
                listHtml += '<input type="checkbox" value="' + items[i].value + '" ' + (isChecked ? 'checked' : '') + '/>';
                listHtml += '</span>';
            }
        }
        listHtml += '</li>';
    }
	
    filterCont += '<ul>';
    //filterCont += '<li><span class="list-title">All (' + count + ')</span><span class="list-input"><input type="checkbox" value="All"/></span></li></li>';
    filterCont += listHtml;
    filterCont += '</ul>';
    filterCont += '</div>';
    this.el.append(filterCont);

    this.bindSearchItems(typeName);
    this.bindCheckActions(typeName);
};
Filter.prototype.bindActions = function(){
	var self = this;
	$('li a', this.filterTypes).unbind('click').bind('click', function(){
		$('li a', self.filterTypes).removeClass('active');
		$(this).addClass('active');
		self.createFilterOptions($(this).attr('title'));
		return false;
	});
};
Filter.prototype.bindCheckActions = function (typeName) {
    var self = this;
    $('.list-input').bind('change', function () {
        self.showSelectedCount(typeName);
    });
};
Filter.prototype.bindSearchItems = function (typeName) {
    var self = this;
    $('.filter-search input').bind('change', function () {
        var inputVal = $(this).val().toLowerCase();
        $('.filter-details ul li').each(function (i, el) {
            var val = $('.list-title', $(el)).text().toLowerCase();
            if (val.indexOf(inputVal) > -1)
                $(el).show();
            else
                $(el).hide();
        });
    });
    $('.clear-filters').unbind('click').bind('click', function () {
        $('.filter-details ul li input').each(function (i, el) {
            el.checked = false;
            $('a[title="' + typeName + '"] .filter-count').hide().text(0);
        });
        self.selectedAssets[typeName] = new Array();
        return false;
    });
};
Filter.prototype.showSelectedCount = function (typeName) {
    var self = this;
    if (self.selectedAssets == undefined || self.selectedAssets[typeName] == undefined)
        self.selectedAssets[typeName] = new Array();
    var typeArrayEl = $('.list-input input:checked'), typeArray = new Array();
    $.each(typeArrayEl, function (i, el) {
        typeArray.push(el.value);
    });
    self.selectedAssets[typeName] = typeArray;
    if (typeArray.length > 0) {
        $('a[title="' + typeName + '"] .filter-count').show().text(typeArray.length);
    } else {
        $('a[title="' + typeName + '"] .filter-count').hide();
    }
};
Filter.prototype.getUniqueCategories = function(success, failure) {
    var formattedAssets = new Array(), servObj = null;
    if (this.options.isUnassign == true) {
        servObj = Services['getFilterCategoriesUnassign'];
    } else {
        servObj = Services['getFilterCategoriesAssign'];
    }

    var categoryValue = this.selectedAssets['category'].length > 0 ? this.selectedAssets['category'].join() : null,
        typeValue = this.selectedAssets['types'].length > 0 ? this.selectedAssets['types'].join() : null,
        tagsValue = this.selectedAssets['tags'].length > 0 ? this.selectedAssets['tags'].join() : null,
        userValue = this.selectedAssets['users'].length > 0 ? this.selectedAssets['users'].join() : null;
    Services.showLoader();
    servObj(this.options.userId, categoryValue, typeValue, tagsValue, userValue, function (data) {
        for (var i = 0; i < data.length; i++) {
            formattedAssets.push({ name: data[i].DA_Category_Name, count: data[i].Asset_Count, value: data[i].DA_Category_Code });
        }
        Services.hideLoader();
        if (success) success(formattedAssets);
    }, function () {
        Services.hideLoader();
    });
};
Filter.prototype.getUniqueTypes = function (success, failure) {
    var formattedAssets = new Array(), servObj = null;
    if (this.options.isUnassign == true) {
        servObj = Services['getFilterFilesUnassign'];
    } else {
        servObj = Services['getFilterFilesAssign'];
    }

    var categoryValue = this.selectedAssets['category'].length > 0 ? this.selectedAssets['category'].join() : null,
        typeValue = this.selectedAssets['types'].length > 0 ? this.selectedAssets['types'].join() : null,
        tagsValue = this.selectedAssets['tags'].length > 0 ? this.selectedAssets['tags'].join() : null,
        userValue = this.selectedAssets['users'].length > 0 ? this.selectedAssets['users'].join() : null;
    Services.showLoader();
    servObj(this.options.userId, categoryValue, typeValue, tagsValue, userValue, function (data) {
        for (var i = 0; i < data.length; i++) {
            formattedAssets.push({ name: data[i].File_Extension, count: data[i].Asset_Count, value: data[i].File_Extension });
        }
        Services.hideLoader();
        if (success) success(formattedAssets);
    }, function () {
        Services.hideLoader();
    });
};
Filter.prototype.getUniqueUsers = function (success, failure) {
    var formattedAssets = new Array(), servObj = null;
    if (this.options.isUnassign == true) {
        servObj = Services['getFilterUsersUnassign'];
    } else {
        servObj = Services['getFilterUsersAssign'];
    }

    var categoryValue = this.selectedAssets['category'].length > 0 ? this.selectedAssets['category'].join() : null,
        typeValue = this.selectedAssets['types'].length > 0 ? this.selectedAssets['types'].join() : null,
        tagsValue = this.selectedAssets['tags'].length > 0 ? this.selectedAssets['tags'].join() : null,
        userValue = this.selectedAssets['users'].length > 0 ? this.selectedAssets['users'].join() : null;
    Services.showLoader();
    servObj(this.options.userId, categoryValue, typeValue, tagsValue, userValue, function (data) {
        for (var i = 0; i < data.length; i++) {
            formattedAssets.push({ name: data[i].Employee_Name, count: data[i].Asset_Count, value: data[i].Uploaded_By });
        }
        Services.hideLoader();
        if (success) success(formattedAssets);
    }, function () {
        Services.hideLoader();
    });
};
Filter.prototype.getUniqueTags = function (success, failure) {
    var formattedAssets = new Array(), servObj = null;
    if (this.options.isUnassign == true) {
        servObj = Services['getFilterTagsUnassign'];
    } else {
        servObj = Services['getFilterTagsAssign'];
    }

    var categoryValue = this.selectedAssets['category'].length > 0 ? this.selectedAssets['category'].join() : null,
        typeValue = this.selectedAssets['types'].length > 0 ? this.selectedAssets['types'].join() : null,
        tagsValue = this.selectedAssets['tags'].length > 0 ? this.selectedAssets['tags'].join() : null,
        userValue = this.selectedAssets['users'].length > 0 ? this.selectedAssets['users'].join() : null;

    Services.showLoader();
    servObj(this.options.userId, categoryValue, typeValue, tagsValue, userValue, function (data) {
        for (var i = 0; i < data.length; i++) {
            formattedAssets.push({ name: data[i].DA_Tag_Value, count: data[i].Asset_Count, value: data[i].DA_Tag_Value });
        }
        Services.hideLoader();
        if (success) success(formattedAssets);
    }, function () {
        Services.hideLoader();
    });
};