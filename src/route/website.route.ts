import { Endpoint, Route, CustomParam } from '@zwisler/bridge';

import { WebsiteService } from '../service/website.service';

@Route({ basePath: '/website' })
export class WebsiteRoute {
  constructor(private websiteService: WebsiteService) {}

  @Endpoint({ method: 'POST' })
  async create(name: string) {
    await this.websiteService.create(name);
  }

  @Endpoint()
  all() {
    return this.websiteService.getAll();
  }
}
