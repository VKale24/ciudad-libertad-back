import { NotFoundException } from '@nestjs/common';
import { MatchStatsEntity } from 'src/modules/match/match_stats/entities/match_stats.entity';
import { TournamentMatchRepository } from 'src/modules/tournament/tournament_match/tournament_match.repository';
import { Repository, EntityRepository } from 'typeorm';

import { PlayerEntity } from '../entities/player.entity';
import { PlayerStatsRepository } from './player_stats.repository';

@EntityRepository(PlayerEntity)
export class PlayerRepository extends Repository<PlayerEntity> {
  async getPlayerById(idPlayer: number) {
    const player = await this.findOne(idPlayer);

    if (!player) throw new NotFoundException();
    return player;
  }

  async getAllPlayersByTeam(idTeam: number) {
    const players = await this.createQueryBuilder('player')
      .leftJoinAndSelect('player.team', 'team')
      .where('player.team.idTeam = :idTeam', { idTeam: idTeam })
      .getMany();

    return players;
  }

  async addGoalToPlayer(
    player: PlayerEntity,
    matchStats: MatchStatsEntity,
    playerStatsRepository: PlayerStatsRepository,
    tournamentMatchRepository: TournamentMatchRepository,
  ) {
    const tournament = await tournamentMatchRepository.getTournamentByMatch(
      matchStats.match.idMatch,
    );
    const playerStats = await playerStatsRepository
      .createQueryBuilder('player_stats')
      .leftJoin('player_stats.player', 'player')
      .leftJoin('player_stats.tournament', 'tournament')
      .where('player_stats.player.idPlayer = :idPlayer', {
        idPlayer: player.idPlayer,
      })
      .andWhere('player_stats.tournament.idTournament = :idTournament', {
        idTournament: tournament.tournament.idTournament,
      })
      .getOne();
    playerStats.goal++;
    await playerStatsRepository.save(playerStats);
  }

  async addAssistToPlayer(
    player: PlayerEntity,
    matchStats: MatchStatsEntity,
    playerStatsRepository: PlayerStatsRepository,
    tournamentMatchRepository: TournamentMatchRepository,
  ) {
    const tournament = await tournamentMatchRepository.getTournamentByMatch(
      matchStats.match.idMatch,
    );
    const playerStats = await playerStatsRepository
      .createQueryBuilder('player_stats')
      .leftJoin('player_stats.player', 'player')
      .leftJoin('player_stats.tournament', 'tournament')
      .where('player_stats.player.idPlayer = :idPlayer', {
        idPlayer: player.idPlayer,
      })
      .andWhere('player_stats.tournament.idTournament = :idTournament', {
        idTournament: tournament.tournament.idTournament,
      })
      .getOne();
    playerStats.assist++;
    await playerStatsRepository.save(playerStats);
  }

  async addYellowCardToPlayer(
    player: PlayerEntity,
    matchStats: MatchStatsEntity,
    playerStatsRepository: PlayerStatsRepository,
    tournamentMatchRepository: TournamentMatchRepository,
  ) {
    const tournament = await tournamentMatchRepository.getTournamentByMatch(
      matchStats.match.idMatch,
    );
    const playerStats = await playerStatsRepository
      .createQueryBuilder('player_stats')
      .leftJoin('player_stats.player', 'player')
      .leftJoin('player_stats.tournament', 'tournament')
      .where('player_stats.player.idPlayer = :idPlayer', {
        idPlayer: player.idPlayer,
      })
      .andWhere('player_stats.tournament.idTournament = :idTournament', {
        idTournament: tournament.tournament.idTournament,
      })
      .getOne();
    playerStats.yellow_card++;
    await playerStatsRepository.save(playerStats);
  }

  async addRedCardToPlayer(
    player: PlayerEntity,
    matchStats: MatchStatsEntity,
    playerStatsRepository: PlayerStatsRepository,
    tournamentMatchRepository: TournamentMatchRepository,
  ) {
    const tournament = await tournamentMatchRepository.getTournamentByMatch(
      matchStats.match.idMatch,
    );
    const playerStats = await playerStatsRepository
      .createQueryBuilder('player_stats')
      .leftJoin('player_stats.player', 'player')
      .leftJoin('player_stats.tournament', 'tournament')
      .where('player_stats.player.idPlayer = :idPlayer', {
        idPlayer: player.idPlayer,
      })
      .andWhere('player_stats.tournament.idTournament = :idTournament', {
        idTournament: tournament.tournament.idTournament,
      })
      .getOne();

    playerStats.red_card++;
    await playerStatsRepository.save(playerStats);
  }
}
