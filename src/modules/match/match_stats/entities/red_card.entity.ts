import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { MatchStatsEntity } from "./match_stats.entity";
import { PlayerEntity } from "src/modules/player/entities/player.entity";

@Entity({ name: 'red_card' })
export class RedCardEntity {

  @PrimaryGeneratedColumn()
  idRedCard: number;

  @Column({ default: 0 })
  minute: number;

  @ManyToOne((type)=> MatchStatsEntity, (match_stats)=> match_stats.idMatchStats)
  match_stats: MatchStatsEntity;

  @ManyToOne((type)=> PlayerEntity, (player)=> player.idPlayer)
  player: PlayerEntity;
}