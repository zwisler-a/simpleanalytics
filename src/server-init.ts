import { Resolve, Service } from '@zwisler/bridge';
import { createConnection } from 'typeorm';
import { OrmService } from './service/orm.service';
import { TrackingEvent } from './model/event.model';
import { Website } from './model/website.model';
import { Config } from './config.interface';

@Service()
export class ServerInit implements Resolve {
  constructor(private ormService: OrmService) {}
  async resolve(): Promise<any> {
    const config: Config = require('./config.json');
    const usedEntities = { entities: [TrackingEvent, Website] };
    return Promise.all([
      createConnection(Object.assign(config.orm, usedEntities) as any).then(con => this.ormService.setConnection(con))
    ]);
  }
}
