export class EventBus {
    static getInstance() {
        if (this._instance) return this._instance;
        return (this._instance = new EventBus());
    }

    constructor() {
        this._subscriptions = {};
        this._log = [];
    }

    dispatch(name, payload) {
        this._log.push({ name, payload });
        if (this._subscriptions[name]) {
            this._subscriptions[name].forEach(sub => sub(payload));
        }
    }

    /**
     * @param {string} eventName
     * @param {function} onEvent
     */
    subscribe(eventName, onEvent) {
        if (!this._subscriptions[eventName]) this._subscriptions[eventName] = [];
        this._subscriptions[eventName].push(onEvent);
    }
}
