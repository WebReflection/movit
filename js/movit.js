/*!
 * Copyright 2019 Andrea Giammarchi
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function (browser) {

  var observer = null;
  var speed = "1.0";
  var timer = 0;
  var videos = [];

  browser.storage.onChanged.addListener(onChanged);
  onChanged();

  function enable() {
    observer = new MutationObserver(function (mutations) {
      var length = mutations.length;
      var i = 0;
      while (i < length) {
        if (mutations[i++].addedNodes.length) {
          clearTimeout(timer);
          timer = setTimeout(queryAndUpdate, 300);
          return;
        }
      }
    });
    observer.observe(document, {childList: true, subtree: true});
    queryAndUpdate();
  }

  function queryAndUpdate() {
    videos = document.querySelectorAll('video');
    update();
  }

  function update() {
    var length = videos.length;
    var i = 0;
    while (i < length)
      videos[i++].playbackRate = speed;
  }

  function disable() {
    clearTimeout(timer);
    observer.disconnect();
    observer = null;
    speed = "1.0";
    timer = 0;
    update();
    videos = [];
  }

  function onChanged() {
    browser.storage.local.get('info', function (data) {
      var info = data.info || {checked: false, speed: "1.0"};
      speed = info.speed;
      if (info.checked) {
        if (observer)
          update();
        else
          enable();
      }
      else if (observer)
        disable();
    });
  }

}(window.chrome || browser));