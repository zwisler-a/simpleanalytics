import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { TrackingEvent } from './event.model';

@Entity()
export class Website {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => TrackingEvent, event => event.website)
  events: TrackingEvent[];

  @Column()
  name: string;
}
