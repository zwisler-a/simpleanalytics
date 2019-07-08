import { Endpoint, Route } from '@zwisler/bridge';
import { CustomParam } from '@zwisler/bridge/core/decorators/custom-param.decorator';

import { EventService } from '../service/event.service';

@Route({ basePath: '/event' })
export class EventRoute {
  constructor(private eventService: EventService) {}

  @Endpoint({ method: 'POST' })
  async create(websiteId: number, name: string, @CustomParam('cookies') cookies) {
    await this.eventService.create(websiteId, name, cookies.sa);
  }

  @Endpoint({ method: 'GET' })
  async get(websiteId: number) {
    return await this.eventService.getByWebsite(websiteId);
  }
  
  @Endpoint({ method: 'GET' })
  async eventCountByVisitor(websiteId: number) {
    return await this.eventService.eventCountByVisitor(websiteId);
  }
}
