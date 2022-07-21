import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { TeamEntity } from "../team/team.entity";
import { MatchEntity } from "src/modules/match/match/match.entity";

@Entity({ name: 'team_match' })
export class TeamMatchEntity {

  @PrimaryGeneratedColumn()
  idTeamMatch: number;

  @ManyToOne((type)=> TeamEntity, (team)=> team.idTeam, {eager: true})
  team: TeamEntity;

  @ManyToOne((type)=> MatchEntity, (match)=> match.idMatch, {eager: true})
  match: MatchEntity
}