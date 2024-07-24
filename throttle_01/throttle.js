const clickEl = document.getElementById("clickEl");

const clickHandler = () => {
  console.log("clicked");
}

const throttle = (fn, delay, trailing = true, leading = true) => {
  let lastExec = 0;
  let timer = null;
  let isLeading = true;

  return function () {
    const duration = Date.now() - lastExec;

    if (timer) {
      clearTimeout(timer);
      timer = null;
    }

    if (duration >= delay && (leading || !isLeading)) {
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

    if (!leading && !timer)  {
      timer = setTimeout(() => {
        isLeading = true;
      }, delay);
    }

    isLeading = false;
  }
};

const clickHandlerThrottled = throttle(clickHandler, 2000, true, false);

clickEl.addEventListener("click", clickHandlerThrottled);