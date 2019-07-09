import { EventService } from './event.service.js';
import { WebsiteService } from './website.service.js';

export class EventView {
    constructor(selector, websiteId) {
        this._element = document.querySelector(selector);
        if (!this._element) throw new Error('Cant find element!');
        this._eventService = EventService.getInstance();
        this._websiteService = WebsiteService.getInstance();
        this._websiteId = websiteId;
        Promise.all([this._loadGeneralInfo(), this._loadConfiguration()]).then(_ => this._update());
    }

    async _loadGeneralInfo() {
        const [uniqueVisitors, website] = await Promise.all([this._eventService.getUniqueVisiors(this._websiteId), this._websiteService.get(this._websiteId)]);
        this._generalInfo = document.createElement('div');
        this._generalInfo.innerHTML = `<h1>${website.name}</h1><h5>${website.id}</h5><div>Unique Visitors: ${uniqueVisitors}</div>`;
    }

    async _loadConfiguration() {
        this._configuration = document.createElement('div');
        this._configuration.classList.add('configuration');

        const eventInput = document.createElement('input');
        eventInput.setAttribute('placeholder', 'Event name');
        this._configuration.appendChild(eventInput);

        const eventLoadBtn = document.createElement('button');
        eventLoadBtn.innerText = 'Lade events';
        eventLoadBtn.addEventListener('click', () => {
            this._displayEvents(eventInput.value);
        });
        this._configuration.appendChild(eventLoadBtn);

        const scriptLoadedPreset = document.createElement('button');
        scriptLoadedPreset.innerText = 'script_loaded';
        scriptLoadedPreset.addEventListener('click', () => {
            this._displayEvents('script_loaded');
        });
        this._configuration.appendChild(scriptLoadedPreset);

        const spacer = document.createElement('span');
        spacer.classList.add('spacer');
        this._configuration.appendChild(spacer);

        const clearEvents = document.createElement('button');
        clearEvents.innerText = 'Alle Events löschen';
        clearEvents.classList.add('warn');
        clearEvents.addEventListener('click', () => {
            this._eventService.clearEvents(this._websiteId);
        });
        this._configuration.appendChild(clearEvents);
    }

    async _displayEvents(eventName) {
        const eventPerDay = await this._eventService.getEventsPerDay(this._websiteId, eventName);
        this._events = document.createElement('div');
        this._events.classList.add('events-per-day');
        this._events.innerHTML = eventPerDay
            .map(day => `<span class="day"><div>${new Date(day.Day).toLocaleDateString()}</div><div>${day.Events}</div></span>`)
            .join('');
        this._update();
    }

    _update() {
        this._element.innerHTML = '';
        this._element.appendChild(this._generalInfo);
        this._element.appendChild(this._configuration);
        if (this._events) this._element.appendChild(this._events);
    }

    destroy() {
        this._element.innerHTML = '';
        this._element = undefined;
    }
}
