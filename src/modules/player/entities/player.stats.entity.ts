import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { PlayerEntity } from "./player.entity";
import { TournamentEntity } from "src/modules/tournament/tournament/tournament.entity";

@Entity({ name: 'player_stats' })
export class PlayerStatsEntity {

  @PrimaryGeneratedColumn()
  idPlayerStats: number;

  @Column({ default: 0 })
  goal: number;

  @Column({ default: 0 })
  assist: number;

  @Column({ default: 0 })
  yellow_card: number;

  @Column({ default: 0 })
  red_card: number;

  @ManyToOne((type)=> TournamentEntity, (tournament)=> tournament.idTournament)
  tournament: TournamentEntity;

  @ManyToOne((type)=> PlayerEntity, (player)=> player.idPlayer)
  player: PlayerEntity;
}