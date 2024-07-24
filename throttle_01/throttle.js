const clickEl = document.getElementById("clickEl");

const clickHandler = () => {
  console.log("clicked");
}

const throttle = (fn, delay, trailing = true) => {
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
    } else if (trailing) {
      timer = setTimeout(() => {
        lastExec = Date.now();
        fn();
        clearTimeout(timer);
        timer = null;
      }, delay - duration)
    }
  }
};

const clickHandlerThrottled = throttle(clickHandler, 2000, false);

clickEl.addEventListener("click", clickHandlerThrottled);