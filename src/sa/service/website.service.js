import { AuthService } from './auth.sevice.js';

export class WebsiteService {
    static getInstance() {
        if (this._instance) return this._instance;
        return (this._instance = new WebsiteService());
    }

    constructor() {
        this._api = {
            all: '/website/all',
            create: '/website/create'
        };
        this._auth = AuthService.getInstance();
    }

    /** Fetch websites from BE */
    async getAll() {
        const websites = await fetch(this._api.all, { headers: { 'x-auth': this._auth._token } })
            .then(res => res.json())
            .then(json => json.data);
        this._websites = websites;
        return websites;
    }

    async get(websiteId) {
        if (!this._websites) await this.getAll();
        return this._websites.find(website => website.id === websiteId);
    }

    /** Not yet implemented */
    async create() {}
}
