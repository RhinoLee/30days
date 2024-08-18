import { useThrottle } from "./throttle.js";

const clickEl = document.getElementById("clickEl");

function clickHandler () {
  console.log("clicked");
  console.log("this: ", this) // this 會是 clickEl
}

const clickHandlerThrottled = useThrottle(clickHandler, 2000, true, true, true);

clickEl.addEventListener("click", function (){
  clickHandlerThrottled.apply(this).then(() => {
    console.log("clickHandlerThrottled resolve");
  }).catch(() => {
    console.log("clickHandlerThrottled reject");
  })
});