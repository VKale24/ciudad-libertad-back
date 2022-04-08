import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { TeamMatchEntity } from "../../team/team_match/team_match.entity";
import { MatchStatsEntity } from "../match_stats/entities/match_stats.entity";

@Entity({ name: 'match' })
export class MatchEntity extends BaseEntity{

  @PrimaryGeneratedColumn()
  idMatch: number;

  @Column({ nullable: true })
  referee: string;

  @Column({ nullable: false })
  date: string;
  
  @Column({ nullable: true, default: 1 })
  round: number;

  @Column({ nullable: false, default: true })
  active: boolean;

  @OneToMany((type)=> TeamMatchEntity, (teamMatch)=> teamMatch.idTeamMatch)
  teamMatch: TeamMatchEntity[];

  @OneToMany((type)=> MatchStatsEntity, (match_stats)=> match_stats.idMatchStats)
  match_stats: MatchStatsEntity[];
}