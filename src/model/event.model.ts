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

  @Column({ type: 'timestamp' })
  timestamp: Date;

  @ManyToOne(() => Website, website => website.events)
  website: Website;

  constructor(name: string, owner: string, website: Website) {
    this.name = name;
    this.owner = owner;
    this.website = website;
    this.timestamp = new Date();
  }
}
