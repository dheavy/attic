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

  function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  function attemptInit() {
    if (!tweetsData || !mediumData) return;

    var randMaxW = tweetsData.average * 300,
        randMaxH = mediumData.average * 300,
        twitchVariation = randomIntFromInterval(1, 500),
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