console.log('Hey there you.');
console.log('');
console.log("I'm Davy Peter Braun. What is your name?");
console.log("I'd love to hear from you: d.braun@wcie.fr");
console.log('');
console.log('I have left the details of the analysis in the console below, for you to fiddle with.');
console.log('Just so you know: if the payload you are reviewing contains an "_id" field, you are seeing cached, not fresh content.');
console.log('I use a MongoDB datastore to cache the results after polling the Twitter API and scraping Medium for data to analyze.');
console.log('Data renewal happens every 30 minutes or so.');
console.log('');
console.log('Love, DPB');
console.log('');
console.log('--------------------------------------------------------------------------------------')
console.log('');

var $win = $(window),
    pjs = Processing.getInstanceById('cnvs'),
    intv, configureProcessingSizing,
    tweetsData = null,
    mediumData = null,
    showingMainContent = true,
    showingTweets = false,
    showingMedium = false;

$(document).ready(function() {
  var $mainContent = $('#main'),
      $tweetsContent = $('#tweets-content'),
      $mediumContent = $('#medium-content'),
      $tweetsToggle = $('#tweets-data-toggle'),
      $mediumToggle = $('#medium-data-toggle');

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

    setTweetsData();
    setMediumData();

    var randMaxW = tweetsData.average * 300,
        randMaxH = mediumData.average * 300,
        twitchVariation = randomIntFromInterval(1, 100),
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

  function setTweetsData() {
    var average = tweetsData.average;
    $('#tweets-data-score').html(tweetsData.score);
    $('#tweets-data-value').html(average);

    var opinion = '';
    if (average > 0) opinion = '(overall positive opinion)';
    if (average <= 0) opinion = '(overall negative opinion)';
    $('#tweets-opinion').html(opinion);

    var tokensContainer = $('#tweets-tokens'),
        positive = _.uniq(tweetsData.analysis.positive),
        negative = _.uniq(tweetsData.analysis.negative);

    tokensContainer.html(
      '<span class="positive">' + positive.join(' ') + '</span>' +
      '<span class="negative">' + negative.join(' ') + '</span>'
    );

    $tweetsToggle.on('click', function(e) {
      e.preventDefault();
      if (!showingTweets) {
        $mainContent.fadeOut('slow');
        $tweetsContent.fadeIn('slow');
        $mediumContent.fadeOut('slow');
        showingTweets = true;
        showingMedium = false;
        showingMainContent = false;
      } else {
        $mainContent.fadeIn('slow');
        $tweetsContent.fadeOut('slow');
        $mediumContent.fadeOut('slow');
        showingTweets = false;
        showingMedium = false;
        showingMainContent = true;
      }
    });
  }

  function setMediumData() {
    var average = mediumData.average;
    $('#medium-data-score').html(mediumData.score);
    $('#medium-data-value').html(average);

    var opinion = '';
    if (average > 0) opinion = '(overall positive opinion)';
    if (average <= 0) opinion = '(overall negative opinion)';
    $('#medium-opinion').html(opinion);

    var tokensContainer = $('#medium-tokens'),
        positive = _.uniq(mediumData.analysis.positive),
        negative = _.uniq(mediumData.analysis.negative);

    tokensContainer.html(
      '<span class="positive">' + positive.join(' ') + '</span>' +
      '<span class="negative">' + negative.join(' ') + '</span>'
    );

    $mediumToggle.on('click', function(e) {
      e.preventDefault();
      if (!showingMedium) {
        $mainContent.fadeOut('slow');
        $tweetsContent.fadeOut('slow');
        $mediumContent.fadeIn('slow');
        showingTweets = false;
        showingMedium = true;
        showingMainContent = false;
      } else {
        $mainContent.fadeIn('slow');
        $tweetsContent.fadeOut('slow');
        $mediumContent.fadeOut('slow');
        showingTweets = false;
        showingMedium = false;
        showingMainContent = true;
      }
    });
  }
});