import { EventService } from '../service/event.service.js';
import { WebsiteService } from '../service/website.service.js';
import { EventBus } from '../service/event.bus.js';
import { OPEN_WEBSITE } from '../util/events.js';

export class EventView extends HTMLElement {
    static get TAG() {
        return 'sa-events';
    }

    constructor() {
        super();
        import('./graph.component.js');
        this._eventService = EventService.getInstance();
        this._websiteService = WebsiteService.getInstance();
        this._eventBus = EventBus.getInstance();
        this._eventBus.subscribe(OPEN_WEBSITE, payload => {
            Promise.all([this._loadGeneralInfo(payload.id), this._loadConfiguration(payload.id)]).then(_ => this._update());
        });
    }

    async _loadGeneralInfo(websiteId) {
        const [uniqueVisitors, website] = await Promise.all([this._eventService.getUniqueVisiors(websiteId), this._websiteService.get(websiteId)]);
        this._generalInfo = document.createElement('div');
        this._generalInfo.innerHTML = `<h1>${website.name}</h1><h5>${website.id}</h5><div>Unique Visitors: ${uniqueVisitors}</div>`;
    }

    async _loadConfiguration(websiteId) {
        this._configuration = document.createElement('div');
        this._configuration.classList.add('configuration');

        const eventInput = document.createElement('input');
        eventInput.setAttribute('placeholder', 'Event name');
        this._configuration.appendChild(eventInput);

        const eventLoadBtn = document.createElement('button');
        eventLoadBtn.innerText = 'Lade events';
        eventLoadBtn.addEventListener('click', () => {
            this._displayEvents(eventInput.value, websiteId);
        });
        this._configuration.appendChild(eventLoadBtn);

        const scriptLoadedPreset = document.createElement('button');
        scriptLoadedPreset.innerText = 'script_loaded';
        scriptLoadedPreset.addEventListener('click', () => {
            this._displayEvents('script_loaded', websiteId);
        });
        this._configuration.appendChild(scriptLoadedPreset);

        const spacer = document.createElement('span');
        spacer.classList.add('spacer');
        this._configuration.appendChild(spacer);

        const clearEvents = document.createElement('button');
        clearEvents.innerText = 'Alle Events löschen';
        clearEvents.classList.add('warn');
        clearEvents.addEventListener('click', () => {
            this._eventService.clearEvents(websiteId);
        });
        this._configuration.appendChild(clearEvents);
    }

    async _displayEvents(eventName, websiteId) {
        let eventPerDay = await this._eventService.getEventsPerDay(websiteId, eventName);
        eventPerDay = eventPerDay.slice(Math.max(eventPerDay.length - 7, 0));
        this._events = document.createElement('div');
        this._events.classList.add('events-per-day');
        this._events.innerHTML = eventPerDay
            .map(day => `<span class="day"><div>${new Date(day.Day).toLocaleDateString()}</div><div>${day.Events}</div></span>`)
            .join('');

        const graph = document.createElement('sa-graph');

        this._update();
        this.appendChild(graph);
        const format = date => {
            const d = new Date(date);
            return d.toLocaleDateString();
        };
        graph.setData(eventPerDay.map(event => ({ label: format(event.Day), value: Number.parseInt(event.Events) })));
    }

    _update() {
        this.innerHTML = '';
        this.appendChild(this._generalInfo);
        this.appendChild(this._configuration);
        if (this._events) this.appendChild(this._events);
    }
}

window.customElements.define(EventView.TAG, EventView);
