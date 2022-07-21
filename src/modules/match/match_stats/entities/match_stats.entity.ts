import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { MatchEntity } from "../../match/match.entity";
import { TeamEntity } from "src/modules/team/team/team.entity";

@Entity({ name: 'match_stats' })
export class MatchStatsEntity {

  @PrimaryGeneratedColumn()
  idMatchStats: number;

  @Column({ default: 0 })
  yellow_card: number;

  @Column({ default: 0 })
  red_card: number;

  @Column({ default: 0 })
  goals: number;

  @Column({ default: 0 })
  assists: number;

  @ManyToOne((type)=> MatchEntity, (match)=> match.idMatch)
  match: MatchEntity;

  @ManyToOne((type)=> TeamEntity, (team)=> team.idTeam)
  team: TeamEntity;

}