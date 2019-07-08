import { Service } from '@zwisler/bridge';

import { TrackingEvent } from '../model/event.model';
import { OrmService } from './orm.service';
import { WebsiteService } from './website.service';
import { Repository } from 'typeorm';
import { BridgeError } from '@zwisler/bridge/core/util/bridge.error';

@Service()
export class EventService {
  eventRepo: Repository<TrackingEvent>;

  constructor(private ormService: OrmService, private websiteService: WebsiteService) {
    this.eventRepo = this.ormService.connection.getRepository(TrackingEvent);
  }
  async create(websiteId: number, name: string, owner: string) {
    const website = await this.websiteService.getById(websiteId);
    if (!website) throw new BridgeError(404, 'Website not found!');
    const event = new TrackingEvent(name, owner, website);
    this.eventRepo.save(event);
  }

  async getByWebsite(websiteId: number) {
    return await this.eventRepo.find({ where: { website: websiteId } });
  }

  async eventCountByVisitor(websiteId: number) {
    const a = this.eventRepo
      .createQueryBuilder()
      .select('COUNT(*) as EventCount, TrackingEvent.owner as Visitor')
      .where({ website: websiteId })
      .groupBy('TrackingEvent.owner');
    return await a.getRawMany();
  }
}
