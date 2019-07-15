import { WebsiteService } from '../service/website.service.js';
import { EventView } from './component/event.view.js/index.js';

export class WebsiteView {
    constructor(selector) {
        this._websiteService = WebsiteService.getInstance();
        this._element = document.querySelector(selector);
        this._eventView = null;
        this._element.addEventListener('click', this.onClick.bind(this));
        if (!this._element) throw new Error('Cant find element!');
        this._displayWebsites();
    }

    onClick(event) {
        const websiteId = event.target.closest('div').getAttribute('websiteId');
        if (this._eventView) this._eventView.destroy();
        this._eventView = new EventView('app-event', websiteId);
    }

    async _displayWebsites() {
        const websites = await this._websiteService.getAll();
        const content = websites.map(website => `<div websiteId="${website.id}">${website.name}</div>`).join('');
        this._element.innerHTML = content;
    }

    destroy() {
        this._element.innerHTML = '';
        this._element = undefined;
        this._websiteService = undefined;
    }
}
