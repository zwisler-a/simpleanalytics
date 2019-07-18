export class SaComponent extends HTMLElement {
    constructor() {
        super();
        import('./website-list.component.js');
        import('./event-view.component.js');
    }

    static get TAG() {
        return 'simple-analytics';
    }

    connectedCallback() {
        const websiteList = document.createElement('sa-websites');
        const eventView = document.createElement('sa-events');
        this.appendChild(websiteList);
        this.appendChild(eventView);
    }
}

window.customElements.define(SaComponent.TAG, SaComponent);
