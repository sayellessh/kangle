var tab = {
    el: null,
    selEl: null,
    onTabSelected: null,
    init: function (onTabClick) {
        tab.el = $('.tabs');
        tab.selEl = $('li', tab.el);
        if(onTabClick)
            tab.onTabSelected = onTabClick;
        //check any active tab on load 
        var actTab = $('li.active', tab.el);
        $('.tab-content').eq(actTab.index()).show();
        if (actTab.size() > 0) {
            if (tab.onTabSelected)
                tab.onTabSelected(actTab);
        }
        tab.attachClick();
    },
    attachClick: function () {
        $('a', tab.selEl).unbind('click').bind('click', function () {
            var pEl = $(this).parent();
            if (!pEl.hasClass('active')) {
                tab.selEl.removeClass('active');
                pEl.addClass('active');
            }
            var ind = pEl.index();
            $('.tab-content').hide();
            $('.tab-content').eq(ind).show();
            if (tab.onTabSelected) {
                tab.onTabSelected(pEl);
            }
            return false;
        });
    }
};

