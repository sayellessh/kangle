var UserFilter = function(options) {
	var self = this;
	this.options = options;
	this.selectedAssets = options.selectedAssets;
	this.selectedDivisions = options.selectedDivisions;
	this.wrapEl = null; 
	this.el = null;
	this.filterTypes = null;
	this.init();

	self.resize();
	$(window).resize(function () {
	    self.resize();
	});
};
UserFilter.prototype.init = function () {
	var self = this;
	this.wrapEl = $('<div class="wrapper-filter"></div>');
	this.hdrEl = $('<header></header>');
	this.el = $('<div class="filter-cont"></div>');
	
	this.wrapEl.append(this.hdrEl);
	this.wrapEl.append(this.el);
	$('body').append(this.wrapEl);
	
	this.createFilters();
	this.createFilterOptions('divisions');
};
UserFilter.prototype.resize = function () {
	var hgt = $(window).height() - $('header').height();
	this.filterTypes.css('height', hgt);
	$('.filter-details').css('height', hgt - 20);
};
UserFilter.prototype.show = function () {
    this.wrapEl.show();
};
UserFilter.prototype.hide = function () {
    this.wrapEl.remove();
};
UserFilter.prototype.createFilters = function () {
	var filterTypes = '<div class="filter-option">';
	filterTypes += '<ul>';
	filterTypes += '<li><a class="active" href="#" title="divisions"><span class="fa fa-list"></span><span class="filter-option-title">Divisions</span><span class="filter-count" style="display: none"></span></a></li>';
	filterTypes += '<li><a href="#" title="usertype"><span class="fa fa-columns"></span><span class="filter-option-title">User Type</span><span class="filter-count" style="display: none"></span></a></li>';
	filterTypes += '</ul>';
	filterTypes += '</div>';
	this.el.append(filterTypes);

	for (var typeName in this.selectedDivisions) {
	    if (this.selectedDivisions[typeName].length > 0) {
	        $('a[title="' + typeName + '"] .filter-count').show().text(this.selectedDivisions[typeName].length);
	    }
	}

	this.filterTypes = $('.filter-option');
	this.bindActions();
};
UserFilter.prototype.createFilterOptions = function (filterId) {
	$('.filter-details').remove();
	this.resize();
	
	var self = this, filterCont = '<div class="filter-details" style="height: ' + ($(window).height() - $('header').height() - 20) + 'px">';
	filterCont += '<div class="filter-search"><input type="text" value="" placeholder="Search..."/></div>';
	filterCont += '<br/><a href="#" title="clear all" class="clear-filters">Clear <span class="fa fa-remove"></span></a>';
	var items = new Array();
	
	if(filterId == 'divisions') {
	    items = this.getUniqueDivisions(function (data) {
	        self.htmlItems(data, filterCont, filterId);
	    });
	} else if (filterId == 'usertype') {
	    items = this.getUniqueUserTypes(function (data) {
	        self.htmlItems(data, filterCont, filterId);
	    });
	}
};
UserFilter.prototype.htmlItems = function (items, filterCont, typeName) {
    var count = 0, listHtml = '';
    for (var i = 0; i < items.length; i++) {
        count = count + items[i].count;
        listHtml += '<li ' + (items[i].count <= 0 ? 'class="disabled"' : '') + '><span class="list-title">' + items[i].name + '</span>';
        if (this.selectedDivisions[typeName] !== undefined && this.selectedDivisions[typeName].length > 0) {
            var isChecked = false;
            for (var j = 0; j < this.selectedDivisions[typeName].length; j++) {
                if (items[i].value == this.selectedDivisions[typeName][j]) {
                    isChecked = true;
                } 
            }
            listHtml += '<span class="list-input">';
            listHtml += '<input type="checkbox" value="' + items[i].value + '" ' + (isChecked ? 'checked' : '') + '/>';
            listHtml += '</span>';
        } else {
            var isChecked = false;
            if (this.selectedDivisions !== undefined && this.selectedDivisions[typeName] !== undefined) {
                for (var j = 0; j < this.selectedDivisions[typeName].length; j++) {
                    if (items[i].value == this.selectedDivisions[typeName][j]) {
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
UserFilter.prototype.bindActions = function () {
	var self = this;
	$('li a', this.filterTypes).unbind('click').bind('click', function(){
		$('li a', self.filterTypes).removeClass('active');
		$(this).addClass('active');
		self.createFilterOptions($(this).attr('title'));
		return false;
	});
};
UserFilter.prototype.bindCheckActions = function (typeName) {
    var self = this;
    $('.list-input').bind('change', function () {
        self.showSelectedCount(typeName);
    });
};
UserFilter.prototype.bindSearchItems = function (typeName) {
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
        self.selectedDivisions[typeName] = new Array();
        return false;
    });
};
UserFilter.prototype.showSelectedCount = function (typeName) {
    var self = this;
    if (self.selectedDivisions == undefined || self.selectedDivisions[typeName] == undefined)
        self.selectedDivisions[typeName] = new Array();
    var typeArrayEl = $('.list-input input:checked'), typeArray = new Array();
    $.each(typeArrayEl, function (i, el) {
        typeArray.push(el.value);
    });
    self.selectedDivisions[typeName] = typeArray;
    if (typeArray.length > 0) {
        $('a[title="' + typeName + '"] .filter-count').show().text(typeArray.length);
    } else {
        $('a[title="' + typeName + '"] .filter-count').hide();
    }
};
UserFilter.prototype.getUniqueDivisions = function (success, failure) {
    var formattedAssets = new Array(), servObj = null;
    servObj = Services['getDivisions'];
    Services.showLoader();
    servObj(function (data) {
        console.log(data);
        for (var i = 0; i < data.length; i++) {
            formattedAssets.push({ name: data[i].Division_Name, count: 10, value: data[i].Division_Code });
        }
        Services.hideLoader();
        if (success) success(formattedAssets);
    }, function () {
        Services.hideLoader();
    });
};
UserFilter.prototype.getUniqueUserTypes = function (success, failure) {
    var formattedAssets = new Array(), servObj = null;
    Services.showLoader();
    Services.getUserTypeDetails(function (data) {
        for (var i = 0; i < data.length; i++) {
            formattedAssets.push({ name: data[i].User_Type_Name, count: 10, value: data[i].User_Type_Code });
        }
        Services.hideLoader();
        if (success) success(formattedAssets);
    }, function () {
        Services.hideLoader();
    });
};