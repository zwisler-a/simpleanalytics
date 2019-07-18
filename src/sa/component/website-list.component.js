import { WebsiteService } from '../service/website.service.js';
import { EventBus } from '../service/event.bus.js';
import { OPEN_WEBSITE } from '../util/events.js';
// import { EventView } from './event-view.component.js/index.js';

export class WebsiteView extends HTMLElement {
    static get TAG() {
        return 'sa-websites';
    }

    constructor(selector) {
        super();
        this._websiteService = WebsiteService.getInstance();
        this._eventBus = EventBus.getInstance();
        this._eventView = null;
        this.addEventListener('click', this.onClick.bind(this));
        this._displayWebsites();
    }

    onClick(event) {
        const websiteId = event.target.closest('div').getAttribute('websiteId');
        this._eventBus.dispatch(OPEN_WEBSITE, { id: websiteId });
    }

    async _displayWebsites() {
        const websites = await this._websiteService.getAll();
        const content = websites.map(website => `<div websiteId="${website.id}">${website.name}</div>`).join('');
        this.innerHTML = content;
    }
}

window.customElements.define(WebsiteView.TAG, WebsiteView);
