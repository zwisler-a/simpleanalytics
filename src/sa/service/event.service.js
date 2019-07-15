import { AuthService } from './service/auth.sevice.js';

export class EventService {
    static getInstance() {
        if (this._instance) return this._instance;
        return (this._instance = new EventService());
    }

    constructor() {
        this._api = {
            all: '/event/get?websiteId=:websiteId',
            uniqueVisitors: '/event/uniqueVisitors?websiteId=:websiteId',
            events: '/event/events?websiteId=:websiteId&eventName=:eventName',
            clearEvents: '/event/clear?websiteId=:websiteId&eventName=:eventName',
            eventsPerDay: '/event/eventsPerDay?websiteId=:websiteId&eventName=:eventName'
        };
        this._auth = AuthService.getInstance();
    }

    /**
     * @param {string} url
     * @param {object} params
     */
    _replaceQueryParams(url, params) {
        Object.keys(params).forEach(key => {
            url = url.replace(':' + key, params[key]);
        });
        return url;
    }

    getUniqueVisiors(websiteId) {
        return fetch(this._replaceQueryParams(this._api.uniqueVisitors, { websiteId }), { headers: { 'x-auth': this._auth._token } })
            .then(res => res.json())
            .then(json => json.data);
    }

    getEventsPerDay(websiteId, eventName) {
        return fetch(this._replaceQueryParams(this._api.eventsPerDay, { websiteId, eventName }), { headers: { 'x-auth': this._auth._token } })
            .then(res => res.json())
            .then(json => json.data);
    }

    clearEvents(websiteId) {
        return fetch(this._replaceQueryParams(this._api.eventsPerDay, { websiteId }), { headers: { 'x-auth': AuthService._token } })
            .then(res => res.json())
            .then(json => json.data);
    }
}
