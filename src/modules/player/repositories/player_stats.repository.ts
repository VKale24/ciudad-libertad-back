import { Repository, EntityRepository } from 'typeorm';

import { PlayerStatsEntity } from '../entities/player.stats.entity';

@EntityRepository(PlayerStatsEntity)
export class PlayerStatsRepository extends Repository<PlayerStatsEntity> {
  async getHistoricStatsOfPlayer(idPlayer: number): Promise<PlayerStatsEntity> {
    const playerStats = await this.createQueryBuilder('player_stats')
      .leftJoinAndSelect('player_stats.player', 'player')
      .leftJoinAndSelect('player_stats.tournament', 'tournament')
      .where('player_stats.player.idPlayer = :idPlayer', { idPlayer: idPlayer })
      .getMany();

    if (playerStats != null) {
      var totalGoal = 0;
      var totalAssits = 0;
      var totalYellowCard = 0;
      var totalRedCard = 0;
      const playerStatsResult: PlayerStatsEntity = new PlayerStatsEntity();

      playerStats.forEach((playerStats) => {
        playerStatsResult.idPlayerStats = playerStats.idPlayerStats;
        playerStatsResult.player = playerStats.player;
        playerStatsResult.tournament = playerStats.tournament;
        totalGoal += playerStats.goal;
        totalAssits += playerStats.assist;
        totalYellowCard += playerStats.yellow_card;
        totalRedCard += playerStats.red_card;
      });

      playerStatsResult.goal = totalGoal;
      playerStatsResult.assist = totalAssits;
      playerStatsResult.yellow_card = totalYellowCard;
      playerStatsResult.red_card = totalRedCard;

      return playerStatsResult;
    }
    return null;
  }

  async getStatsOfPlayerByTournament(
    idPlayer: number,
    idTournament: number,
  ): Promise<PlayerStatsEntity> {
    const playerStats = await this.createQueryBuilder('player_stats')
      .leftJoinAndSelect('player_stats.player', 'player')
      .leftJoinAndSelect('player_stats.tournament', 'tournament')
      .where('player_stats.player.idPlayer = :idPlayer', { idPlayer: idPlayer })
      .andWhere('player_stats.tournament.idTournament = :idTournament', {
        idTournament: idTournament,
      })
      .getOne();

    return playerStats;
  }

  async getRankScoresByTournament(idTournament: number) {
    const rankScores = await this.createQueryBuilder('player_stats')
      .leftJoinAndSelect('player_stats.player', 'player')
      .leftJoinAndSelect('player_stats.tournament', 'tournament')
      .where('player_stats.tournament.idTournament = :idTournament', {
        idTournament: idTournament,
      })
      .orderBy('player_stats.goal', 'DESC')
      .limit(10)
      .getMany();

    return rankScores;
  }

  async getRankAssistByTournament(idTournament: number) {
    const rankAssist = await this.createQueryBuilder('player_stats')
      .leftJoinAndSelect('player_stats.player', 'player')
      .leftJoinAndSelect('player_stats.tournament', 'tournament')
      .where('player_stats.tournament.idTournament = :idTournament', {
        idTournament: idTournament,
      })
      .orderBy('player_stats.assist', 'DESC')
      .limit(10)
      .getMany();

    return rankAssist;
  }

  async getRankYellowCardByTournament(idTournament: number) {
    const rankYellowCard = await this.createQueryBuilder('player_stats')
      .leftJoinAndSelect('player_stats.player', 'player')
      .leftJoinAndSelect('player_stats.tournament', 'tournament')
      .where('player_stats.tournament.idTournament = :idTournament', {
        idTournament: idTournament,
      })
      .orderBy('player_stats.yellow_card', 'DESC')
      .limit(10)
      .getMany();

    return rankYellowCard;
  }

  async getRankRedCardByTournament(idTournament: number) {
    const rankRedCard = await this.createQueryBuilder('player_stats')
      .leftJoinAndSelect('player_stats.player', 'player')
      .leftJoinAndSelect('player_stats.tournament', 'tournament')
      .where('player_stats.tournament.idTournament = :idTournament', {
        idTournament: idTournament,
      })
      .orderBy('player_stats.red_card', 'DESC')
      .limit(10)
      .getMany();

    return rankRedCard;
  }
}
