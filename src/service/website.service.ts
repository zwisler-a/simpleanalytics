import { Service } from '@zwisler/bridge';
import { OrmService } from './orm.service';
import { Website } from '../model/website.model';
import { Repository } from 'typeorm';

@Service()
export class WebsiteService {
  websiteRepo: Repository<Website>;
  constructor(private ormService: OrmService) {
    this.websiteRepo = this.ormService.connection.getRepository(Website);
  }
  async create(name: string) {
    const ws = new Website();
    ws.name = name;
    return await this.websiteRepo.save(ws);
  }

  getAll() {
    return this.websiteRepo.find();
  }

  getById(websiteId: string): Promise<Website> {
    return this.websiteRepo.findOne(websiteId);
  }
}
