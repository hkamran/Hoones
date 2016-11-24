/*
 * jQuery TipTop v1.0
 * http://gilbitron.github.io/TipTop
 *
 * Copyright 2013, Dev7studios
 * Free to use and abuse under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 */

;(function($, window, document, undefined){

    var pluginName = 'tipTop',
        defaults = {
        	offsetVertical: 10, // Vertical offset
        	offsetHorizontal: 10  // Horizontal offset
        };

    function TipTop(element, options){
        this.el = element;
        this.$el = $(this.el);
        this.options = $.extend({}, defaults, options);

        this.init();
    }

    TipTop.prototype = {

        init: function(){
        	var $this = this;

			this.$el.mouseenter(function(){
				var title = $(this).attr('title'),
					tooltip = $('<div class="tiptop"></div>').text(title);
				tooltip.appendTo('body');
				$(this).data('title', title).removeAttr('title');
			}).mouseleave(function(){
				$('.tiptop').remove();
				$(this).attr('title', $(this).data('title'));
			}).mousemove(function(e) {
				var tooltip = $('.tiptop'),
					top = e.pageY + $this.options.offsetVertical,
					bottom = 'auto'
					left = e.pageX + $this.options.offsetHorizontal,
					right = 'auto';

				if(top + tooltip.outerHeight() >= $(window).scrollTop() + $(window).height()){
					bottom = $(window).height() - top + ($this.options.offsetVertical * 2);
					top = 'auto';
				}
				if(left + tooltip.outerWidth() >= $(window).width()){
					right = $(window).width() - left + ($this.options.offsetHorizontal * 2);
					left = 'auto';
				}

				$('.tiptop').css({ 'top': top, 'bottom': bottom, 'left': left, 'right': right });
			});

        }

    };

    $.fn[pluginName] = function(options){
        return this.each(function(){
            if(!$.data(this, pluginName)){
                $.data(this, pluginName, new TipTop(this, options));
            }
        });
    };

})(jQuery, window, document);