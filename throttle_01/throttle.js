const clickEl = document.getElementById("clickEl");

function clickHandler () {
  console.log("clicked");
  console.log("this: ", this) // this 會是 clickEl
}

const createFilterWrapper = (filter, fn) => {
  function wrapper(...args) {
    // 這邊的 this 源頭會是 clickHandlerThrottled
    return new Promise((resolve, reject) => {
      Promise.resolve(filter(() => fn.apply(this, args), { fn, this: this, args }))
        .then(resolve)
        .catch(reject)
    })
  };

  return wrapper;
}

const throttle = (...args) => {
  const [delay, trailing = true, leading = true, rejectOnCancel = false] = args
  let lastExec = 0;
  let timer = null;
  let isLeading = true;
  let lastRejector = () => {};
  let lastValue;

  return function (_invoke) {
    const duration = Date.now() - lastExec;

    const invoke = () => {
      return lastValue = _invoke()
    }

    const clear = () => {
      if (timer) {
        clearTimeout(timer);
        timer = null;
        lastRejector();
        lastRejector = () => {};
      }
    }

    clear();

    if (duration >= delay && (leading || !isLeading)) {
      lastExec = Date.now();
      invoke();
    } else if (trailing) {
      lastValue = new Promise((resolve, reject) => {
        lastRejector = rejectOnCancel ? reject : resolve
        timer = setTimeout(() => {
          lastExec = Date.now();
          resolve(invoke());
          clear();
        }, Math.max(0, delay - duration))
      })
    }

    if (!leading && !timer)  {
      timer = setTimeout(() => {
        isLeading = true;
      }, delay);
    }

    isLeading = false;

    return lastValue;
  }
};

const useThrottle = (
  fn,
  delay = 200,
  trailing = false,
  leading = true,
  rejectOnCancel = false,
) => {
  return createFilterWrapper(
    throttle(delay, trailing, leading, rejectOnCancel),
    fn,
  )
}

const clickHandlerThrottled = useThrottle(clickHandler, 2000, true, true, true);

clickEl.addEventListener("click", function (){
  clickHandlerThrottled.apply(this).then(() => {
    console.log("clickHandlerThrottled resolve");
  }).catch(() => {
    console.log("clickHandlerThrottled reject");
  })
});