import { Endpoint, Route } from '@zwisler/bridge';
import { CustomParam } from '@zwisler/bridge/core/decorators/custom-param.decorator';

import { EventService } from '../service/event.service';

@Route({ basePath: '/event' })
export class EventRoute {
  constructor(private eventService: EventService) {}

  @Endpoint({ method: 'POST' })
  async create(websiteId: string, name: string, @CustomParam('cookies') cookies) {
    await this.eventService.create(websiteId, name, cookies.sa);
  }

  @Endpoint({ method: 'GET' })
  async get(websiteId: string) {
    return await this.eventService.getByWebsite(websiteId);
  }

  @Endpoint()
  async events(websiteId: string, eventName: string) {
    return this.eventService.getEvents(websiteId, eventName);
  }

  @Endpoint()
  async uniqueVisitors(websiteId: string) {
    return this.eventService.getUniqueVisiors(websiteId);
  }

  @Endpoint({ method: 'GET' })
  async eventCountByVisitor(websiteId: string) {
    return await this.eventService.eventCountByVisitor(websiteId);
  }
}
