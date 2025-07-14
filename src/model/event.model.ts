import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Website } from './website.model';

@Entity()
export class TrackingEvent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  owner: string;

  @Column()
  ip: string;

  @Column({ type: 'datetime' })
  timestamp: Date;

  @Column()
  data: string;

  @ManyToOne(() => Website, website => website.events)
  website: Website;

  constructor(name: string, owner: string, ip: string, data: string, website: Website) {
    this.ip = ip;
    this.data = data;
    this.name = name;
    this.owner = owner;
    this.website = website;
    this.timestamp = new Date();
  }
}
