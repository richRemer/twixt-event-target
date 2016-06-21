var eventTargets = new WeakMap();

/**
 * Create an event target proxy for an object.
 * @param {object} obj
 * @returns {EventTarget}
 */
function EventTarget(obj) {
    var listeners = {};
    
    function add(type, listener) {
        if (!listeners[type]) listeners[type] = [];
        listeners[type].push(listener);
    }
    
    function remove(type, listener) {
        var i, extant = listeners[type];        
        if (!extant) return;
        while (~(i = extant.indexOf(listener))) extant.splice(i, 1);
        if (!extant.length) delete listeners[type];
    }
    
    function dispatch(event) {
        if (!event.type) {
            throw new Error("UNSPECIFIED_EVENT_TYPE_ERR");
        }
    
        if (!listeners[event.type]) return true;

        Object.defineProperty(event, "target", {
            configurable: true,
            enumerable: true,
            writable: false,
            value: obj
        });
        
        listeners[event.type].forEach(function(listener() {
            listener.call(obj, event);
        });
        
        return !event.defaultPrevented;
    }

    return new Proxy(obj, {
        get: function(obj, name) {
            switch (name) {
                case "addEventListener":
                    return add;
                case "removeEventListener":
                    return remove;
                case "dispatchEvent":
                    return dispatch;
                default:
                    return obj[name];
            }
        }
    });
}

/**
 * Return an EventTarget proxy for the object.
 * @param {object} obj
 * @returns {EventTarget}
 */
function eventTarget(obj) {
    if (!eventTargets.has(obj)) {
        eventTargets.set(obj, EventTarget(obj));
    }
    
    return eventTargets.get(obj);
}

module.exports = eventTarget;

