import { Service } from '@zwisler/bridge';
import { Connection } from 'typeorm';

@Service()
export class OrmService {
  ormConnection: Connection;

  get connection() {
    return this.ormConnection;
  }

  setConnection(con) {
    this.ormConnection = con;
  }
}
