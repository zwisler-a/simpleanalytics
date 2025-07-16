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
  async create(name: string, id?: string) {
    const ws = new Website();
    ws.name = name;
    if (id) ws.id = id;
    return await this.websiteRepo.save(ws);
  }

  getAll() {
    return this.websiteRepo.find();
  }

  getById(websiteId: string): Promise<Website> {
    return this.websiteRepo.findOne(websiteId);
  }

  async updateWebsite(id: string, newName: string, newId: string) {
    const website = await this.websiteRepo.findOne(id);
    if (!website) throw new Error('Website not found');
    website.name = newName;
    if (website.id !== newId) {
      // Changing primary key: create new, copy fields, delete old
      const newWebsite = this.websiteRepo.create({ ...website, id: newId });
      await this.websiteRepo.save(newWebsite);
      await this.websiteRepo.delete(id);
      return newWebsite;
    } else {
      return await this.websiteRepo.save(website);
    }
  }

  async deleteWebsite(id: string) {
    return await this.websiteRepo.delete(id);
  }
}
