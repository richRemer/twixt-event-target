twixt-event-target Function
===========================

```js
var EventTarget = require("twixt-event-target");

function attachEvent(obj, type, handler) {
    EventTarget(obj).addEventListener(type, handler);
}

fuction emitEvent(obj, type) {
    EventTarget(obj).dispatchEvent(new Event(type));
}
```

