import { Endpoint, Route } from '@zwisler/bridge';

import { WebsiteService } from '../service/website.service';
import { AuthService } from '../service/auth.service';

@Route({ basePath: '/website', middleware: [AuthService.authorize()] })
export class WebsiteRoute {
    constructor(private websiteService: WebsiteService) {}

    @Endpoint({ method: 'POST' })
    async create(name: string, id?: string) {
        return await this.websiteService.create(name, id);
    }

    @Endpoint()
    all() {
        return this.websiteService.getAll();
    }

    @Endpoint({ method: 'POST' })
    async updateWebsite(id: string, name: string, newId: string) {
        return await this.websiteService.updateWebsite(id, name, newId);
    }

    @Endpoint({ method: 'POST' })
    async deleteWebsite(id: string) {
        return await this.websiteService.deleteWebsite(id);
    }
}
