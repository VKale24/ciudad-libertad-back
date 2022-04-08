import { PlayerEntity } from 'src/modules/player/entities/player.entity';
import { StatsTableEntity } from 'src/modules/stats_table/stats_table.entity';
import { TeamEntity } from 'src/modules/team/team/team.entity';
import { TeamStatsEntity } from 'src/modules/team/team_stats/team_stats.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TournamentEntity } from '../tournament/tournament.entity';

@Entity({ name: 'team_tournament' })
export class TeamTournamentEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  idTeamTournament: number;

  @Column({default: true})
  player_active: boolean

  @ManyToOne((type)=> TeamEntity, (team)=> team.idTeam, {eager: true})
  team: TeamEntity

  @ManyToOne((type)=> TournamentEntity, (tournament)=> tournament.idTournament, {eager: true})
  tournament: TournamentEntity

  @ManyToOne((type)=> TeamStatsEntity, (team_stats)=> team_stats.idTeamStats, {eager: true})
  team_stats: TeamStatsEntity

  @ManyToOne((type)=> PlayerEntity, (player)=> player.idPlayer, {eager: true})
  player: PlayerEntity

  @ManyToOne((type)=> StatsTableEntity, (stats_table)=> stats_table.idStatsTable, {eager: true})
  stats_table: StatsTableEntity
}
