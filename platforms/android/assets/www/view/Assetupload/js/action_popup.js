var ActionPopup = function(el, evt, options) {
	this.el = el;
	this.options = options;
	this.event = evt;
	this.onSelectAction = null;
	this.remove = function() {
		$('.popup-actn').remove();
	};
	
	this.show = function() {
		this.reset();
		$('.popup-actn').show();
	};
	
	this.init = function() {
		this.remove();
		var html = '';
		if(this.options && this.options.length > 0) {
			html += '<ul class="popup-actn" style="display: none">';
			for(var i = 0; i < this.options.length; i++) {
				if(this.options[i].id == 'seperator') {
					html += '<li class="seperator"></li>';
				} else {
				    if (this.options[i].bShow) {
				        html += '<li id="' + this.options[i].id + '"><span class="fa ' + this.options[i].icon + '"></span>' + this.options[i].display_name + '</li>';
				    }
				}
			}
			html += '</ul>';
			$('body').append(html);
		} else {
			alert('No actions found for this item');
		}
		
		var self = this;
		$(document).bind('click', function(e){
			if(!$(e.target).hasClass('popup-actn') && !$(e.target).parents('.popup-actn').size() > 0) {
				self.remove();
			}
		});

		$('.popup-actn li').not('.seperator').unbind('click').bind('click', function () {
		    if (self.onSelectAction !== null)
		        self.onSelectAction($(this).attr('id'));
		});
	}
	
	this.reset = function() { 
		console.log(this.event);
		var screenY = this.event.clientY;
		var wWid = $(window).width(), wHgt = $(window).height();
		var top = this.el.offset().top, 
			left = this.el.offset().left - $('.popup-actn').outerWidth();		
		if(screenY > (wHgt - (wHgt/3))) {
			$('.popup-actn').css({'top': (top - $('.popup-actn').outerHeight()), 'left': left + 25});
		} else {
			$('.popup-actn').css({'top': (top + 25), 'left': left + 25 });
		}
	};
	this.init();
};