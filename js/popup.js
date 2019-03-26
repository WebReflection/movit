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

    if (info.checked) {
      speed.removeAttribute('disabled');
    }
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