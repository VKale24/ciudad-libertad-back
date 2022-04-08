import { NotFoundException } from '@nestjs/common';
import { Repository, EntityRepository } from 'typeorm';

import { TeamTournamentEntity } from './team_tournament.entity';
import { TeamRepository } from 'src/modules/team/team/team.repository';
import { TournamentRepository } from '../tournament/tournament.repository';
import { PlayerRepository } from 'src/modules/player/repositories/player.repository';

@EntityRepository(TeamTournamentEntity)
export class TeamTournamentRepository extends Repository<TeamTournamentEntity> {
  async getTeamTournamentByTeamAndTournament(
    idTeam: number,
    idTournament: number,
    teamRepository: TeamRepository,
    tournamentRepository: TournamentRepository,
    teamTournamentRepository: TeamTournamentRepository,
  ) {
    const team = await teamRepository.findOne(idTeam);
    const tournament = await tournamentRepository.findOne(idTournament);
    if (tournament && team) {
      const teamTournament = await teamTournamentRepository
        .createQueryBuilder('team_tournament')
        .leftJoinAndSelect('team_tournament.team', 'team')
        .leftJoinAndSelect('team_tournament.player', 'player')
        .leftJoinAndSelect('team_tournament.team_stats', 'team_stats')
        .leftJoinAndSelect('team_tournament.stats_table', 'stats_table')
        .leftJoinAndSelect('team_tournament.tournament', 'tournament')
        .where('team_tournament.tournament.idTournament = :idTournament', {
          idTournament: idTournament,
        })
        .andWhere('team_tournament.team.idTeam = :idTeam', {
          idTeam: idTeam,
        })
        .getOne();
      return teamTournament;
    } else throw new NotFoundException();
  }

  async getAllTeamsTournamentsOfPlayer(
    idPlayer: number,
    playerRepository: PlayerRepository,
  ) {
    const player = await playerRepository.findOne(idPlayer);
    if (player) {
      const teamTournament = await this.createQueryBuilder('team_tournament')
        .leftJoinAndSelect('team_tournament.team', 'team')
        .leftJoinAndSelect('team_tournament.player', 'player')
        .leftJoinAndSelect('team_tournament.team_stats', 'team_stats')
        .leftJoinAndSelect('team_tournament.stats_table', 'stats_table')
        .leftJoinAndSelect('team_tournament.tournament', 'tournament')
        .where('team_tournament.player.idPlayer = :idPlayer', {
          idPlayer: idPlayer,
        })
        .getMany();

      return teamTournament;
    } else throw new NotFoundException();
  }
}
