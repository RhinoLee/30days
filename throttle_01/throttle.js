const clickEl = document.getElementById("clickEl");

function clickHandler () {
  console.log("clicked");
  console.log("this: ", this) // this 會是 clickEl
}

const createFilterWrapper = (filter, fn) => {
  function wrapper(...args) {
    // 這邊的 this 源頭會是 clickHandlerThrottled
    filter(() => fn.apply(this, args), { fn, this: this, args })
  };

  return wrapper;
}

const throttle = (...args) => {
  const [delay, trailing = true, leading = true] = args
  let lastExec = 0;
  let timer = null;
  let isLeading = true;

  return function (invoke) {
    const duration = Date.now() - lastExec;

    if (timer) {
      clearTimeout(timer);
      timer = null;
    }

    if (duration >= delay && (leading || !isLeading)) {
      lastExec = Date.now();
      invoke();
    } else if (trailing) {
      timer = setTimeout(() => {
        lastExec = Date.now();
        invoke();
        clearTimeout(timer);
        timer = null;
      }, Math.max(0, delay - duration))
    }

    if (!leading && !timer)  {
      timer = setTimeout(() => {
        isLeading = true;
      }, delay);
    }

    isLeading = false;
  }
};

const useThrottle = (
  fn,
  delay = 200,
  trailing = false,
  leading = true,
) => {
  return createFilterWrapper(
    throttle(delay, trailing, leading),
    fn,
  )
}

const clickHandlerThrottled = useThrottle(clickHandler, 2000, true, false);

clickEl.addEventListener("click", clickHandlerThrottled);