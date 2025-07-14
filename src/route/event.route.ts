import { CustomParam, Endpoint, Route } from '@zwisler/bridge';

import { EventService } from '../service/event.service';
import { AuthService } from '../service/auth.service';

@Route({ basePath: '/event' })
export class EventRoute {
    constructor(private eventService: EventService) {}

    @Endpoint({ method: 'POST' })
    async create(
        websiteId: string,
        name: string,
        trackingId: string,
        @CustomParam('cookies') cookies,
        @CustomParam('headers') headers,
        @CustomParam('connection') connection
    ) {
        await this.eventService.create(websiteId, name, cookies.sa || trackingId, headers['x-forwarded-for'] || connection.remoteAddress);
    }

    @Endpoint({ method: 'GET', middleware: [AuthService.authorize()] })
    async get(websiteId: string) {
        return await this.eventService.getByWebsite(websiteId);
    }

    @Endpoint({ middleware: [AuthService.authorize()] })
    async clear(websiteId: string) {
        return this.eventService.clearEvents(websiteId);
    }

    @Endpoint({ middleware: [AuthService.authorize()] })
    async eventsOnWebsite(websiteId: string) {
        return this.eventService.getAvailableEvents(websiteId);
    }

    @Endpoint({ middleware: [AuthService.authorize()] })
    async events(websiteId: string, eventName: string) {
        return this.eventService.getEvents(websiteId, eventName);
    }

    @Endpoint({ middleware: [AuthService.authorize()] })
    async eventsPerDay(websiteId: string, eventName: string) {
        return this.eventService.getEventsPerDay(websiteId, eventName);
    }

    @Endpoint({ middleware: [AuthService.authorize()] })
    async uniqueVisitors(websiteId: string) {
        return this.eventService.getUniqueVisiors(websiteId);
    }

    @Endpoint({ method: 'GET', middleware: [AuthService.authorize()] })
    async eventCountByVisitor(websiteId: string) {
        return await this.eventService.eventCountByVisitor(websiteId);
    }
}
