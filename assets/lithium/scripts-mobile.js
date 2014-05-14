;(function() {
  KloutScore = function() {

    var flyout = jQuery('#klout-score-flyout')
    var opacitySections = [];
    var inititializeOpacitySection = function() {
      if(opacitySections.length == 0) {
        opacitySections.push(jQuery(".product-container > section"));
        opacitySections.push(jQuery(".product-container > ul"));
      }
    }


    var hideDropDown = function(event) {
      if(event.currentTarget === document) {
        flyout.css('visibility', 'hidden');
        for(var i=0; i<opacitySections.length; i++) {
          opacitySections[i].css('opacity', '1');
        }
      }
    }

    var clickEventName = 'click.klout.score'

    var showDropDown = function(event) {
      inititializeOpacitySection();
      jQuery(document).unbind(clickEventName + ' click', hideDropDown);

      for(var i=0; i<opacitySections.length; i++) {
        opacitySections[i].css('opacity', '.15');
      }
      flyout.css('visibility', 'visible');
      jQuery(document).bind(clickEventName + ' click', hideDropDown);
      event.preventDefault();
      return false;
    }

    jQuery('.left-block').on('click', showDropDown);
  }();
})();