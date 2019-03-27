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
    update("1.0");
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
      else if (observer)
        disable();
    });
  }

}(window.chrome || browser));