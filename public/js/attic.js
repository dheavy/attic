var $win = $(window),
    pjs = Processing.getInstanceById('cnvs'),
    intv, configureProcessingSizing,
    tweetsData = null,
    mediumData = null;

$(document).ready(function() {
  configureProcessingSizing = function() {
    function resize() {
      if (pjs != null) {
        pjs.resize($win.width(), $win.height() + 30);
      }
    }
    $win.resize(resize);
    resize();
  };

  $.post('/tweets', {}, function(data) {
    tweetsData = data;
    console.log(data);
    attemptInit();
  });

  $.post('/medium', {}, function(data) {
    mediumData = data;
    console.log(data);
    attemptInit();
  });

  function attemptInit() {
    if (!tweetsData || !mediumData) return;

    var randMaxW = tweetsData.average * 300,
        randMaxH = mediumData.average * 300,
        twitchVariation = Math.floor(Math.random() * 700 + 1),
        multiplier = mediumData.numOfEntries * mediumData.numOfEntries;

    intv = setInterval(function() {
      if (pjs) {
        pjs.addMultiplier(multiplier);
        pjs.addTwitchVariation(twitchVariation);
        pjs.addRandMaxWVariation(randMaxW);
        pjs.addRandMaxHVariation(randMaxH);
        pjs.start();
        clearInterval(intv);
      } else {
        pjs = Processing.getInstanceById('cnvs');
      }
    }, 500);
  }
});