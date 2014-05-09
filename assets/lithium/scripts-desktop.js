'use strict';

var opacityItems = [];
opacityItems.push($('body .ws-content').not(':has(.sny-header-anchor)').not('.sny-topbar'));
opacityItems.push($('body .ws-content > .sny-product-background'));
opacityItems.push($('body .ws-content > .sny-footer'));
opacityItems.push($('body .ws-content > .sny-fighter-middle'));
opacityItems.push($('body .ws-content > .sny-fighter-middle'));
opacityItems.push($('body .ws-content > .sny-product-testimonial-break'));
opacityItems.push($('body .ws-content > .sny-product-tabset-group'));
opacityItems.push($('body .ws-content .sonyCustomerCare'));
opacityItems.push($('body .ws-footer.sny-footer'));

function setOpacity (percentage) {
  for (var i = 0; i < opacityItems.length; i++) {
    opacityItems[i].css({opacity: percentage});
  }
}

jQuery('.flag2').hover(function () {
  // calculate position
  var kloutElm = jQuery('#klout-score-hover').show();
  var headElm = jQuery('div.sny-product-head-content');
  var leftMargin = 0;
  if (headElm && headElm.position()) {
    leftMargin = headElm.css('marginLeft');
    //kloutElm.css("left", leftMargin).css("z-index", 150);
  }
  setOpacity('.15');
  kloutElm.css('visibility', 'visible').css('left', leftMargin).css('z-index', 150).show();
},
function () {
  jQuery('#klout-score-hover').css('visibility', 'hidden');
  setOpacity(1);
});