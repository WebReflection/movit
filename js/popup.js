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

(function (browser) {'use strict';

  var timer = 0;
  var storage = browser.storage.local;

  storage.get('info', function (data) {
    var info = data.info || {checked: false, speed: "1.0"};
    checkbox.checked = info.checked;
    range.value = speed.textContent = info.speed;

    checkbox.addEventListener('change', function () {
      if (checkbox.checked)
        speed.removeAttribute('disabled');
      else
        speed.setAttribute('disabled', '');
      setStorage();
    });
  
    range.addEventListener('input', function () {
      if (!checkbox.checked) {
        checkbox.checked = true;
        speed.removeAttribute('disabled');
      }
      speed.textContent = getSpeed();
      clearTimeout(timer);
      timer = setTimeout(setStorage, 300);
    });

    if (info.checked)
      speed.removeAttribute('disabled');
  });

  function getSpeed() {
    return range.valueAsNumber.toFixed(1);
  }

  function setStorage() {
    storage.set({
      info: {
        checked: checkbox.checked,
        speed: getSpeed()
      }
    });
  }

}(window.chrome || window.browser));