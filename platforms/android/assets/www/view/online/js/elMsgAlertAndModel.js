//Message Alert
(function ($) {
    $.msgAlert = function (config) {

        var defaults, options, msgAlert, popup, header, close, content, footer, overlay;

        defaults = {
            type: ''
			, title: ''
			, text: ''
			, callback: function () { }
			, closeTrigger: true
			, escClose: true
			, overlay: true
			, overlayClose: false
			, buttons: [{
			    text: 'Ok'
				, callback: function () {
				    $.msgAlert.close();
				    options.callback();
				}
			}]
        };

        options = $.extend(defaults, config);

        msgAlert = $('<div>', {
            'class': 'msgAlert ' + options.type
        }).appendTo('body');

        popup = $('<div>', {
            'class': 'msgAlert_popup'
        }).appendTo(msgAlert);

        if (options.title != '') {
            header = $('<div/>', {
                'class': 'msgAlert_header', 'html': '<h4>' + options.title + '</h4>'
            }).appendTo(popup);
        }

        if (options.closeTrigger) {
            close = $('<a>', {
                'href': 'javascript:;'
				, 'class': 'msgAlert_close'
				, 'click': close
            }).appendTo(header);
        }

        content = $('<div/>', {
            'class': 'msgAlert_content'
			, 'text': options.text
        }).appendTo(popup);

        footer = $('<div/>', {
            'class': 'msgAlert_footer'
        }).appendTo(msgAlert);

        if (options.overlay) {
            overlay = $('<div/>', {
                'class': 'msgAlert_overlay'
            }).appendTo('body');

            if (options.overlay && options.overlayClose) {
                overlay.bind('click', close);
            }
        }


        if (options.type == 'warning') {
            options.buttons = [{
                text: 'Yes'
				, callback: function () {
				    options.callback();
				    $.msgAlert.close();
				}
            }, {
                text: 'No'
				, callback: function () { $.msgAlert.close(); }
            }, {
                text: 'Cancel'
				, callback: function () { $.msgAlert.close(); }
            }];
        }

        if (options.buttons.length > 0) {
            for (key in options.buttons) {
                if (key !== 'contains') {
                    $('<button>', { 'text': options.buttons[key].text })
					.bind('click', options.buttons[key].callback)
					.appendTo(footer);
                }
            }
        }

        msgAlert.appendTo('body');

        msgAlert.find('button:first').focus();

        if (options.escClose) {
            $(document).bind('keyup.msgAlert', function (e) {
                if (e.keyCode == 27) {
                    $.msgAlert.close();
                }
            });
        }

        function close(e) {
            e.preventDefault();
            $.msgAlert.close();
        }
    };

    $.msgAlert.close = function () {
        $('.msgAlert').fadeOut('fast', function () { $(this).remove(); });
        $('.msgAlert_overlay').fadeOut('fast', function () { $(this).remove(); });
        $(document).unbind('keyup.msgAlert');
    }
})(jQuery);

(function ($) {
    $.msgGrowl = function (config) {

        var defaults, options, container, msgGrowl, content, title, text, close;

        defaults = {
            type: ''
			, title: ''
			, text: ''
			, lifetime: 6500
			, sticky: false
			, position: 'bottom-right'
			, closeTrigger: true
			, onOpen: function () { }
			, onClose: function () { }
        };

        options = $.extend(defaults, config);

        container = $('.msgGrowl-container.' + options.position);

        if (!container.length) {
            container = $('<div>', {
                'class': 'msgGrowl-container ' + options.position
            }).appendTo('body');
        }

        msgGrowl = $('<div>', {
            'class': 'msgGrowl ' + options.type
        });

        content = $('<div>', {
            'class': 'msgGrowl-content'
        }).appendTo(msgGrowl);

        text = $('<span>', {
            text: options.text
        }).appendTo(content);

        if (options.closeTrigger) {
            close = $('<div>', {
                'class': 'msgGrowl-close'
				, 'click': function (e) {
				    e.preventDefault();
				    $(this).parent().fadeOut('medium', function () {
				        $(this).remove();
				        if (typeof options.onClose === 'function') {
				            options.onClose();
				        }
				    });
				}
            }).appendTo(msgGrowl);
        }

        if (options.title != '') {
            title = $('<h4>', {
                text: options.title
            }).prependTo(content);
        }

        if (options.lifetime > 0 && !options.sticky) {
            setTimeout(function () {
                if (typeof options.onClose === 'function') {
                    options.onClose();
                }
                msgGrowl.fadeOut('medium', function () { $(this).remove(); });
            }, options.lifetime);
        }

        container.addClass(options.position);

        if (options.position.split('-')[0] == 'top') {
            msgGrowl.prependTo(container).hide().fadeIn('slow');
        } else {
            msgGrowl.appendTo(container).hide().fadeIn('slow');
        }

        if (typeof options.onOpen === 'function') {
            options.onOpen();
        }
    }
})(jQuery);

(function ($) {
    $.msgBar = function (config) {

        var defaults, options, bar, icon, close;

        defaults = {
            type: ''
			, title: ''
			, text: ''
			, lifetime: 0
			, closeTrigger: true
        };

        options = $.extend(defaults, config);

        bar = $('<div>', {
            'class': 'msgBar ' + options.type
			, 'text': options.text
        });

        icon = $('<div>', {
            'class': 'icon'
        }).appendTo(bar);

        if (options.closeTrigger) {
            close = $('<div>', {
                'class': 'close'
				, 'text': 'x'
				, 'click': closeBar
            }).appendTo(bar);
        }

        if (options.lifetime > 0) {
            setTimeout(function () {
                closeBar();
            }, options.lifetime);
        }

        function closeBar() {
            bar.slideUp('medium', function () {
                $(this).remove();
            })
        }

        return bar;
    }
})(jQuery);

var SwaaS = {};

SwaaS = function () {
    var defaults = {};
    var options = {};

    return { init: init };

    function init(config) {
        options = $.extend(defaults, config);

        SwaaS.Nav.init();

        //        SwaaS.Charts.visualize({ el: $('table.stats'), theme: options.theme });

        if ($.fn.dataTable) { $('.datatable').dataTable({ "sPaginationType": "full_numbers" }); };

        if ($.fn.placeholder) { $('input, textarea').placeholder(); }

        if (window.location.href.match(/pages/gi) == null) {
            //  $.getScript('./js/SwaaS.Themes.js');
        } else {
            //$.getScript('../js/SwaaS.Themes.js');
        }
    }
} ();

SwaaS.Nav = function () {

    return { init: init };

    function init() {
        $('.dropdown').find('.item').append('<div class="arrow"></div>').live('click', open);
        $('.menu').append('<span class="menu-top"></span>');

        $(document).mouseup(function (e) {
            //if($(e.target).parents(".menu").length==0 && !$(e.target).is ('.menu')) {
            forceClose();
            //}
        });
    }

    function open(e) {
        e.preventDefault();
        var $this = $(this).parent();
        var $menu = $this.find('.menu');
        var docWidth = $(document).width();
        var menuTotal = $this.offset().left + $menu.outerWidth();

        if (menuTotal > docWidth) {
            $menu.addClass('right');
        } else {
            $menu.removeClass('right');
        }

        $this.addClass('hovered active');
        $menu.show();

        $('.dropdown .item').live('mouseenter', enter);
    }

    function enter(e) {
        e.preventDefault();
        if (!$(this).parent().is('.active')) {
            kindaClose();
            $(this).parent().addClass('hovered active').find('.menu').show();
        }
    }

    function kindaClose() {
        $('.menu').hide();
        $('.nav.hovered').removeClass('hovered active');
    }

    function forceClose() {
        kindaClose();
        $('.dropdown .item').die('mouseenter');
    }
} ();


//modal
(function ($) {
    $.modal = function (config) {
        'use strict';
        var defaults, options, modal, header, content, footer, close, overlay, width, centerOffset;

        defaults = {
            title: ''
			, byline: ''

			, ajax: ''
			, div: ''

			, slide: false
			, slideEl: '.slide'

			, btnClass: 'btn small secondary'

			, overlay: true
			, overlayClose: true

			, beforeOpen: function () { }
			, afterOpen: function () { }

			, debug: false
        };

        options = $.extend(defaults, config);

        $.modal.forceClose();

        modal = $('<div>', { 'id': 'modal' });
        header = $('<div>', { 'id': 'modal_header' });
        content = $('<div>', { 'id': 'modal_content' });
        overlay = $('<div>', { 'id': 'modal_overlay' });
        close = $('<div>', { 'id': 'modal_close', 'html': 'x' });

        header.appendTo(modal);
        content.appendTo(modal);
        close.appendTo(modal);

        options.beforeOpen(modal);

        modal.appendTo('body').hide().fadeIn(500);

        if (options.overlay) {
            overlay.appendTo('body');
        }

        if (options.overlayClose) {
            overlay.bind('click', function (e) { $.modal.close(); });
        }

        close.bind('click', function (e) { $.modal.close(); });

        (options.title !== '') ? header.append('<h3>' + options.title + '</h3>') : '';
        (options.byline !== '') ? header.append('<div class="byline">' + options.byline + '</div>') : '';

        if (options.ajax !== '') {
            content.html('<div id="modal_loader"><img src="../Content/images/common/ajax-loader.gif" /></div>');
            $.modal.reposition();
            $.get(options.ajax, function (response) {
                content.html(response);
                handleContent();
            });
        }

        if (options.div !== '') {
            content.html($(options.div).html());
            handleContent();
        }

        function handleContent() {
            $.modal.reposition();
            if (options.slide) { handleSlides(); }

            setTimeout(function () {
                options.afterOpen(modal);
            }, 1000);
        }

        function handleSlides() {
            var slides = modal.find(options.slideEl);
            slides.hide().eq(0).show().addClass('current_slide');
            var footer = $('<div>', { id: 'modal_footer' }).appendTo(modal);
            var prev = $('<button>', { id: 'prev', html: '<u>P</u>revious' }).addClass(options.btnClass).appendTo(footer);
            var display = $('<span>', { id: 'display' }).appendTo(footer);
            var next = $('<button>', { id: 'next', html: '<u>N</u>ext' }).addClass(options.btnClass).appendTo(footer);
            display.html('<span class="current_page">1</span> of ' + slides.length);
            prev.attr('disabled', 'disabled');

            $(document).bind('keyup.modal', function (e) {
                if (e.keyCode == 78 || e.keyCode == 39) { navigateSlides('forward', slides); }
                if (e.keyCode == 80 || e.keyCode == 37) { navigateSlides('backward', slides); }
            });

            footer.find('button').bind('click', function (e) {
                var direction = ($(this).is('#next')) ? 'forward' : 'backward';
                navigateSlides(direction, slides);
            });

        }

        function navigateSlides(direction, slides) {
            var currentSlide, nextSlide, next, prev;
            next = $('#next');
            prev = $('#prev');
            currentSlide = content.find('.current_slide');
            nextSlide = (direction == 'forward') ? currentSlide.next(options.slideEl) : currentSlide.prev(options.slideEl);

            if (nextSlide.length > 0) {
                nextSlide.addClass('current_slide').show().siblings(options.slideEl).hide().removeClass('current_slide');
                $('#display .current_page').text(nextSlide.index() + 1);

                (nextSlide.index() === 0) ? prev.attr('disabled', 'disabled') : prev.removeAttr('disabled');
                (nextSlide.index() === slides.length - 1) ? next.attr('disabled', 'disabled') : next.removeAttr('disabled');

                var contentWidth = nextSlide.outerWidth();
                content.width(contentWidth + 30);
                //$.modal.reposition ();	
            }
        }

        $(document).bind('keyup.modal', function (e) {
            if (e.keyCode == 27) { $.modal.close(); }
        });

    };

    $.modal.reposition = function () {
        var width = $('#modal').outerWidth();
        var centerOffset = width / 2;
        var pageScroll = getPageScroll();
        $('#modal').css({ 'left': '50%', 'top': pageScroll[1] + 100, 'margin-left': '-' + centerOffset + 'px' });
    };

    $.modal.close = function () {
        $('#modal').fadeOut('medium', function () { $(this).remove(); });
        $('#modal_overlay').fadeOut('medium', function () { $(this).remove(); });
        $(document).unbind('keyup.modal');
    };

    $.modal.forceClose = function () {
        $('#modal').remove();
        $('#modal_overlay').remove();
        $(document).unbind('keyup.modal');
    };

    $.modal.setTitle = function (title) {
        var h3 = $('#modal_header').find('h3');
        if (h3.length > 0) {
            h3.html(title);
        } else {
            $('<h3>', { html: title }).prependTo('#modal_header');
        }
    };

    $.modal.setByline = function (text) {
        var el = $('#modal_header').find('.byline');
        if (el.length > 0) {
            el.html(text);
        } else {
            $('<div>', { 'class': 'byline', html: text }).appendTo('#modal_header');
        }
    };

    // getPageScroll() by quirksmode.com
    function getPageScroll() {
        var xScroll, yScroll;
        if (self.pageYOffset) {
            yScroll = self.pageYOffset;
            xScroll = self.pageXOffset;
        } else if (document.documentElement && document.documentElement.scrollTop) {	 // Explorer 6 Strict
            yScroll = document.documentElement.scrollTop;
            xScroll = document.documentElement.scrollLeft;
        } else if (document.body) {// all other Explorers
            yScroll = document.body.scrollTop;
            xScroll = document.body.scrollLeft;
        }
        return new Array(xScroll, yScroll);
    }
})(jQuery);

(function (a) { a.tools = a.tools || { version: "v1.2.7" }, a.tools.overlay = { addEffect: function (a, b, d) { c[a] = [b, d] }, conf: { close: null, closeOnClick: !0, closeOnEsc: !0, closeSpeed: "fast", effect: "default", fixed: !a.browser.msie || a.browser.version > 6, left: "center", load: !1, mask: null, oneInstance: !0, speed: "normal", target: null, top: "10%"} }; var b = [], c = {}; a.tools.overlay.addEffect("default", function (b, c) { var d = this.getConf(), e = a(window); d.fixed || (b.top += e.scrollTop(), b.left += e.scrollLeft()), b.position = d.fixed ? "fixed" : "absolute", this.getOverlay().css(b).fadeIn(d.speed, c) }, function (a) { this.getOverlay().fadeOut(this.getConf().closeSpeed, a) }); function d(d, e) { var f = this, g = d.add(f), h = a(window), i, j, k, l = a.tools.expose && (e.mask || e.expose), m = Math.random().toString().slice(10); l && (typeof l == "string" && (l = { color: l }), l.closeOnClick = l.closeOnEsc = !1); var n = e.target || d.attr("rel"); j = n ? a(n) : null || d; if (!j.length) throw "Could not find Overlay: " + n; d && d.index(j) == -1 && d.click(function (a) { f.load(a); return a.preventDefault() }), a.extend(f, { load: function (d) { if (f.isOpened()) return f; var i = c[e.effect]; if (!i) throw "Overlay: cannot find effect : \"" + e.effect + "\""; e.oneInstance && a.each(b, function () { this.close(d) }), d = d || a.Event(), d.type = "onBeforeLoad", g.trigger(d); if (d.isDefaultPrevented()) return f; k = !0, l && a(j).expose(l); var n = e.top, o = e.left, p = j.outerWidth({ margin: !0 }), q = j.outerHeight({ margin: !0 }); typeof n == "string" && (n = n == "center" ? Math.max((h.height() - q) / 2, 0) : parseInt(n, 10) / 100 * h.height()), o == "center" && (o = Math.max((h.width() - p) / 2, 0)), i[0].call(f, { top: n, left: o }, function () { k && (d.type = "onLoad", g.trigger(d)) }), l && e.closeOnClick && a.mask.getMask().one("click", f.close), e.closeOnClick && a(document).on("click." + m, function (b) { a(b.target).parents(j).length || f.close(b) }), e.closeOnEsc && a(document).on("keydown." + m, function (a) { a.keyCode == 27 && f.close(a) }); return f }, close: function (b) { if (!f.isOpened()) return f; b = b || a.Event(), b.type = "onBeforeClose", g.trigger(b); if (!b.isDefaultPrevented()) { k = !1, c[e.effect][1].call(f, function () { b.type = "onClose", g.trigger(b) }), a(document).off("click." + m + " keydown." + m), l && a.mask.close(); return f } }, getOverlay: function () { return j }, getTrigger: function () { return d }, getClosers: function () { return i }, isOpened: function () { return k }, getConf: function () { return e } }), a.each("onBeforeLoad,onStart,onLoad,onBeforeClose,onClose".split(","), function (b, c) { a.isFunction(e[c]) && a(f).on(c, e[c]), f[c] = function (b) { b && a(f).on(c, b); return f } }), i = j.find(e.close || ".close"), !i.length && !e.close && (i = a("<a class=\"close\"></a>"), j.prepend(i)), i.click(function (a) { f.close(a) }), e.load && f.load() } a.fn.overlay = function (c) { var e = this.data("overlay"); if (e) return e; a.isFunction(c) && (c = { onBeforeLoad: c }), c = a.extend(!0, {}, a.tools.overlay.conf, c), this.each(function () { e = new d(a(this), c), b.push(e), a(this).data("overlay", e) }); return c.api ? e : this } })(jQuery);
(function (a) { var b = a.tools.overlay, c = a(window); a.extend(b.conf, { start: { top: null, left: null }, fadeInSpeed: "fast", zIndex: 9999 }); function d(a) { var b = a.offset(); return { top: b.top + a.height() / 2, left: b.left + a.width() / 2} } var e = function (b, e) { var f = this.getOverlay(), g = this.getConf(), h = this.getTrigger(), i = this, j = f.outerWidth({ margin: !0 }), k = f.data("img"), l = g.fixed ? "fixed" : "absolute"; if (!k) { var m = f.css("backgroundImage"); if (!m) throw "background-image CSS property not set for overlay"; m = m.slice(m.indexOf("(") + 1, m.indexOf(")")).replace(/\"/g, ""), f.css("backgroundImage", "none"), k = a("<img src=\"" + m + "\"/>"), k.css({ border: 0, display: "none" }).width(j), a("body").append(k), f.data("img", k) } var n = g.start.top || Math.round(c.height() / 2), o = g.start.left || Math.round(c.width() / 2); if (h) { var p = d(h); n = p.top, o = p.left } g.fixed ? (n -= c.scrollTop(), o -= c.scrollLeft()) : (b.top += c.scrollTop(), b.left += c.scrollLeft()), k.css({ position: "absolute", top: n, left: o, width: 0, zIndex: g.zIndex }).show(), b.position = l, f.css(b), k.animate({ top: b.top, left: b.left, width: j }, g.speed, function () { f.css("zIndex", g.zIndex + 1).fadeIn(g.fadeInSpeed, function () { i.isOpened() && !a(this).index(f) ? e.call() : f.hide() }) }).css("position", l) }, f = function (b) { var e = this.getOverlay().hide(), f = this.getConf(), g = this.getTrigger(), h = e.data("img"), i = { top: f.start.top, left: f.start.left, width: 0 }; g && a.extend(i, d(g)), f.fixed && h.css({ position: "absolute" }).animate({ top: "+=" + c.scrollTop(), left: "+=" + c.scrollLeft() }, 0), h.animate(i, f.closeSpeed, b) }; b.addEffect("apple", e, f) })(jQuery);