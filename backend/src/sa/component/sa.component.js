import { EventBus } from '../service/event.bus.js';
import { OPEN_WEBSITE, OPEN_EVENT } from '../util/events.js';

export class SaComponent extends HTMLElement {
    constructor() {
        super();
        import('./website-list.component.js');

        EventBus.getInstance()
            .subscribe(OPEN_WEBSITE, () => import('./event-list.component.js'))
            .subscribe(OPEN_EVENT, () => import('./event-view.component.js'));
    }

    static get TAG() {
        return 'simple-analytics';
    }

    connectedCallback() {
        const websiteList = document.createElement('sa-websites');
        const eventList = document.createElement('sa-events');
        const eventView = document.createElement('sa-event-view');
        this.appendChild(websiteList);
        this.appendChild(eventList);
        this.appendChild(eventView);
    }
}

window.customElements.define(SaComponent.TAG, SaComponent);
