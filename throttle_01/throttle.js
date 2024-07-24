const clickEl = document.getElementById("clickEl");

const clickHandler = () => {
  console.log("clicked");
}

const throttle = (fn, delay) => {
  let lastExec = 0;
  let timer = null;

  return function () {
    const duration = Date.now() - lastExec;

    if (timer) {
      clearTimeout(timer);
      timer = null;
    }

    if (duration >= delay) {
      lastExec = Date.now();
      fn();
    } else {
      timer = setTimeout(() => {
        lastExec = Date.now();
        fn();
        clearTimeout(timer);
        timer = null;
      }, delay - duration)
    }
  }
};

const clickHandlerThrottled = throttle(clickHandler, 2000);

clickEl.addEventListener("click", clickHandlerThrottled);