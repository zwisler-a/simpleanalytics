import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { TrackingEvent } from './event.model';

@Entity()
export class Website {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => TrackingEvent, event => event.website)
  events: TrackingEvent[]; 

  @Column()
  name: string;
}
