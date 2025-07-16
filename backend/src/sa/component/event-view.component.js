import { EventBus } from '../service/event.bus.js';
import { EventService } from '../service/event.service.js';
import { WebsiteService } from '../service/website.service.js';
import { OPEN_EVENT } from '../util/events.js';

export class EventView extends HTMLElement {
    static get TAG() {
        return 'sa-event-view';
    }

    constructor() {
        super();
        import('./graph.component.js');
        this._eventService = EventService.getInstance();
        this._websiteService = WebsiteService.getInstance();
        this._eventBus = EventBus.getInstance();
        this._eventBus.subscribe(OPEN_EVENT, payload => {
            this._update(payload.eventName, payload.websiteId);
        });
    }

    async _displayGeneralInfo(eventName, websiteId) {
        const [uniqueVisitors, website] = await Promise.all([
            this._eventService.getUniqueVisiors(websiteId),
            this._websiteService.get(websiteId)
        ]);
        const generalInfo = document.createElement('div');
        generalInfo.innerHTML = `<h1>${website.name}</h1>
            <h5>${website.id}</h5>
            <div>Unique Visitors: ${uniqueVisitors}</div>
            <div>Event: ${eventName}</div><br>`;
        this.appendChild(generalInfo);
    }

    async _displayEvents(eventName, websiteId) {
        let eventPerDay = await this._eventService.getEventsPerDay(websiteId, eventName);
        eventPerDay = eventPerDay.slice(Math.max(eventPerDay.length - 7, 0));
        const graph = document.createElement('sa-graph');
        this.appendChild(graph);
        const format = date => {
            const d = new Date(date);
            return d.toLocaleDateString();
        };
        graph.setData(eventPerDay.map(event => ({ label: format(event.Day), value: Number.parseInt(event.Events) })));
    }

    async _update(eventName, websiteId) {
        this.innerHTML = '';
        await this._displayGeneralInfo(eventName, websiteId);
        await this._displayEvents(eventName, websiteId);
    }
}

window.customElements.define(EventView.TAG, EventView);
