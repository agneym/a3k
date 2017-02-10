new WOW().init();
var easingFn = function (t, b, c, d) {
  var ts = (t /= d) * t;
  var tc = ts * t;
  return b + c * (tc + -3 * ts + 3 * t);
};
var options = {
  useEasing : true, 
  easingFn: easingFn, 
  useGrouping : true, 
  separator : ',', 
  decimal : '.', 
  prefix : '', 
  suffix : '+' 
};
$.fn.visible = function() {
    var elementTop = $(this).offset().top;
    var elementBottom = elementTop + $(this).outerHeight();

    var viewportTop = $(window).scrollTop();
    var viewportBottom = viewportTop + $(window).height();

    return elementTop <= viewportTop;
};

$(window).on("scroll",function() {
  $("#prev").show();
  if($('#stats').visible()===true) {
    $('#video')[0].play();
    var count2 = new CountUp("count2", 0, 40, 0, 3, options);
    count2.start();
    $(window).off("scroll");
  }
});
$("#prev").on("click",function() {
  var tempPos = 0;
  $('.section').each(function() {
    var sectionTop = $(this).position().top;
    if(sectionTop>=$(window).scrollTop()) {
      return false;
    } 
    tempPos = sectionTop;
  });
  $('html, body').animate({
    scrollTop: tempPos
  }, 1500);
});
$("#next").on("click",function() {
  $('.section').each(function() {
    var sectionTop = $(this).position().top;
    if(sectionTop>$(window).scrollTop()) {
      $('html, body').animate({
        scrollTop: sectionTop
      }, 1500);
      return false;
    }
  });
});
$(function(){
  $("#prev").hide();
})