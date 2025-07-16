export class EventBus {
    static getInstance() {
        if (this._instance) return this._instance;
        return (this._instance = new EventBus());
    }

    constructor() {
        this._subscriptions = {};
        this._log = [];
    }

    async dispatch(name, payload) {
        this._log.push({ name, payload });
        const subscriptions = this._subscriptions[name];
        if (subscriptions) {
            for (let index = 0; index < subscriptions.length; index++) {
                await subscriptions[index](payload);
            }
        }
    }

    /**
     * @param {string} eventName
     * @param {function} onEvent
     */
    subscribe(eventName, onEvent) {
        if (!this._subscriptions[eventName]) this._subscriptions[eventName] = [];
        this._subscriptions[eventName].push(onEvent);
        return this;
    }
}
