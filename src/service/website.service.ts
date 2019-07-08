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
  create(name: string) {
    const ws = new Website();
    ws.name = name;
    this.websiteRepo.save(ws); 
  }

  getAll() {
    return this.websiteRepo.find();
  }

  getById(websiteId: number): Promise<Website> {
    return this.websiteRepo.findOne(websiteId);
  }
}
