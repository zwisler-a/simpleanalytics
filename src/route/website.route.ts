import { Endpoint, Route } from '@zwisler/bridge';

import { WebsiteService } from '../service/website.service';
import { AuthService } from '../service/auth.service';

@Route({ basePath: '/website', middleware: [AuthService.authorize()] })
export class WebsiteRoute {
    constructor(private websiteService: WebsiteService) {}

    @Endpoint({ method: 'POST' })
    async create(name: string) {
        return await this.websiteService.create(name);
    }

    @Endpoint()
    all() {
        return this.websiteService.getAll();
    }
}
