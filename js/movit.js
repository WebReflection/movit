(function (browser) {

  var observer = null;
  var videos = [];
  var timer = 0;

  browser.storage.onChanged.addListener(onChanged);
  onChanged();

  function enable(speed) {
    observer = new MutationObserver(function (mutations) {
      var length = mutations.length;
      var i = 0;
      while (i < length) {
        if (mutations[i++].addedNodes.length) {
          clearTimeout(timer);
          timer = setTimeout(queryAndUpdate, 300, speed);
          return;
        }
      }
    });
    observer.observe(document, {childList: true, subtree: true});
    queryAndUpdate(speed);
  }

  function queryAndUpdate(speed) {
    videos = document.querySelectorAll('video');
    update(speed);
  }

  function update(speed) {
    var length = videos.length;
    var i = 0;
    while (i < length)
      videos[i++].playbackRate = speed;
  }

  function disable() {
    update(1);
    observer.disconnect();
    observer = null;
    videos = [];
  }

  function onChanged() {
    browser.storage.local.get('info', function (data) {
      var info = data.info || {checked: false, speed: "1.0"};
      if (info.checked) {
        if (observer)
          update(info.speed);
        else
          enable(info.speed);
      }
      else if (observer) {
        disable();
      }
    });
  }

}(window.chrome || browser));