var pluginName = "mSelect",
defaults = {
    bSearch: true,
    bEscClose: false,
    selectedClass: 'selected'
};

function MSelect(element, options) {
    this.el= element;
    this.settings = $.extend({}, defaults, options);
    this._defaults = defaults;
    this._name = pluginName;
    this.init();

    this.refresh = function () {
        console.log(pluginName + ' - refresh Method');
    }

    this.hide = function () {
        console.log(pluginName + ' - hide Method');
        this.container.hide();
    }

    this.show = function () {
        console.log(pluginName + ' - show Method');
        this.container.show();
    }

    this.getSelectedItems = function () {
        return this.selectedItems;
    }
}

$.extend(MSelect.prototype, {
    container: '.mselect',
    input: null,
    items: new Array(),
    selectedItems: new Array(),
    init: function () {
        console.log(pluginName + ' - init Method');

        var self = this;
        $('body').append('<div class="mselect"></div>');
        $('body').live('click', function (e) {
            if ($(e.target).hasClass('mselect') || $(e.target).parents('.mselect').size() > 0) {
                
            } else {
                self.hide();
            }
        });
        this._createHeader();
        this._createOptions();
    },
    _createHeader: function () {
        console.log(pluginName + ' - creatHeader Method');
        var self = this;
        this.container = $(this.container);
        var html = '<div class="mselect-header">';
        if (this.settings.bSearch)
            html += '<input name="search-option" value="" placeholder="Search.." type="text">';
        html += '<a href="#" title="Save" class="">Ok</a></div>';

        this.container.html(html);
        this.container.delegate('.mselect-header a', 'click', function () {
            //alert(4);
            if (self.settings.onOk) {
                self.settings.onOk(self.selectedItems);
                self.hide();
            }
            return false;
        });
        $('.mselect-header input').bind('keyup', function (e) {
            self._searchItems($(this).val());
        });
    },
    _createOptions: function () {
        console.log(pluginName + ' - createOptions Method');
        var lists = $('option', this.element);
        var optionHtml = '';

        var self = this;
        if (lists && lists.length > 0) {
            var $listContainer = $('<ul class="mselect-options"></ul>');
            $.each(lists, function (index, list) {
                var curList = $(list); 
                var listObj = { identifier: curList.val(), value: curList.text() };
                self.items.push(listObj);
                var isSelected = (curList.attr('selected') == 'selected') ? true : false;
                var listHtml = '<li class="mselect-option ' + (isSelected ? "selected" : '') + '" data-identifier="' + curList.val() + '" data-value="' + curList.text() + '">' +
                    curList.text() + '</li>';
                $listContainer.append(listHtml);
            });

            this.container.append($listContainer);
        }
        self._prepareSelectedItems();
        this._createActions();
    },
    _createActions: function () {
        var listItem = $('.mselect-options li'), self = this;
        listItem.unbind('click').bind('click', function () {
            console.log($(this));
            if ($(this).hasClass(self.settings.selectedClass))
                $(this).removeClass(self.settings.selectedClass);
            else
                $(this).addClass(self.settings.selectedClass);

            self._prepareSelectedItems();
            return false;
        });
    },
    _prepareSelectedItems: function () {
        var listItem = $('.mselect-options li.' + this.settings.selectedClass), self = this;
        if (listItem && listItem.length > 0) {
            this.selectedItems = new Array();
            $.each(listItem, function (index, list) {
                var el = $(list);
                self.selectedItems.push({ identifier: el.data('identifier'), value: el.data('value') });
            });
        }
    },
    _searchItems: function (string) {
        var listItem = $('.mselect-options li'), self = this;
        if (string == '') {
            listItem.show();
        } else {
            $.each(listItem, function (index, list) {
                var el = $(list), text = el.data('value').toLowerCase();
                if (text.indexOf(string) > -1)
                    el.show();
                else
                    el.hide();
            });
        }
    }
});

$.fn[pluginName] = function (options) {
    this.each(function () {
        if (!$.data(this, "plugin_" + pluginName)) {
            $.data(this, "plugin_" + pluginName, new MSelect(this, options));
        }
    });

    return this;
};