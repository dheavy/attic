var $win = $(window),
    pjs = Processing.getInstanceById('cnvs'),
    intv, configureProcessingSizing;

$(document).ready(function() {
  configureProcessingSizing = function() {
    function resize() {
      if (pjs != null) {
        pjs.resize($win.width(), $win.height());
      }
    }
    $win.resize(resize);
    resize();
  };

  intv = setInterval(function() {
    if (pjs) {
      pjs.addVariation1(10);
      pjs.addVariation2(10);
      pjs.addVariation3(6);
      pjs.start();
      clearInterval(intv);
    } else {
      pjs = Processing.getInstanceById('cnvs');
    }
  }, 500);
});