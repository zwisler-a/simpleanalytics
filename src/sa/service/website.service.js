import { AuthService } from './auth.sevice.js';
import { BASE_URL } from '../env/env.js';

export class WebsiteService {
    static getInstance() {
        if (this._instance) return this._instance;
        return (this._instance = new WebsiteService());
    }

    constructor() {
        this._api = {
            all: BASE_URL + '/website/all',
            create: BASE_URL + '/website/create'
        };
        this._auth = AuthService.getInstance();
    }

    /** Fetch websites from BE */
    async getAll() {
        const websites = await fetch(this._api.all, {
            credentials: 'include',
            headers: { 'x-auth': this._auth._token }
        })
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
