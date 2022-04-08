import { PlayerEntity } from "src/modules/player/entities/player.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { MatchStatsEntity } from "./match_stats.entity";

@Entity({ name: 'yellow_card' })
export class YellowCardEntity {

  @PrimaryGeneratedColumn()
  idYellowCard: number;

  @Column({ default: 0 })
  minute: number;

  @ManyToOne((type)=> MatchStatsEntity, (match_stats)=> match_stats.idMatchStats)
  match_stats: MatchStatsEntity;

  @ManyToOne((type)=> PlayerEntity, (player)=> player.idPlayer)
  player: PlayerEntity;
}