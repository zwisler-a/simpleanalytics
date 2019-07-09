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
    async create(websiteId: string, name: string, owner: string, data = '') {
        const website = await this.websiteService.getById(websiteId);
        if (!website) throw new BridgeError(404, 'Website not found!');
        const event = new TrackingEvent(name, owner, data, website);
        this.eventRepo.save(event);
    }

    async getByWebsite(websiteId: string) {
        return await this.eventRepo.find({ where: { website: websiteId } });
    }

    getEventsPerDay(websiteId: string, eventName: string) {
        return this.eventRepo.createQueryBuilder()
        .select("DATE(timestamp) as Day, COUNT(id) as Events")
        .where("websiteId = :websiteId AND name = :eventName", {websiteId, eventName})
        .groupBy("DATE(timestamp)")
        .getRawMany();
    }

    clearEvents(websiteId: string) {
        return this.eventRepo
            .createQueryBuilder()
            .delete()
            .where('website = :websiteId', { websiteId })
            .execute();
    }

    getEvents(websiteId: string, event: string): Promise<TrackingEvent[]> {
        return this.eventRepo.find({ where: { website: websiteId, name: event } });
    }

    async getUniqueVisiors(websiteId: string) {
        return (await this.eventRepo
            .createQueryBuilder()
            .select('DISTINCT owner')
            .where({ website: websiteId })
            .getRawMany()).length;
    }

    async eventCountByVisitor(websiteId: string) {
        const a = this.eventRepo
            .createQueryBuilder()
            .select('COUNT(*) as EventCount, TrackingEvent.owner as Visitor')
            .where({ website: websiteId })
            .groupBy('TrackingEvent.owner');
        return await a.getRawMany();
    }
}
