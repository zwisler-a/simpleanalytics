import { EventService } from '../service/event.service.js';
import { EventBus } from '../service/event.bus.js';
import { OPEN_EVENT, OPEN_WEBSITE } from '../util/events.js';

export class EventListComponent extends HTMLElement {
    static get TAG() {
        return 'sa-events';
    }

    constructor() {
        super();
        this.classList.add('navigation-list');
        this._eventService = EventService.getInstance();
        this._eventBus = EventBus.getInstance();
        this.addEventListener('click', this.onClick.bind(this));
        this._eventBus.subscribe(OPEN_WEBSITE, this._displayWebsites.bind(this));
    }

    onClick(event) {
        const closestDiv = event.target.closest('div');
        if (!closestDiv) return;
        const eventName = closestDiv.getAttribute('eventId');
        if (this._currentWebsiteId) {
            this._eventBus.dispatch(OPEN_EVENT, { websiteId: this._currentWebsiteId, eventName });
        }
    }

    async _displayWebsites(event) {
        this._currentWebsiteId = event.id;
        const events = await this._eventService.getAvailableEvents(event.id);
        const content = events.map(event => `<div eventId="${event.name}">${event.name}</div>`).join('');
        this.innerHTML = content;
    }
}

window.customElements.define(EventListComponent.TAG, EventListComponent);
