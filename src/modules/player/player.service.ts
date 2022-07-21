import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { PlayerDto } from './dto/player.dto';
import { TeamRepository } from '../team/team/team.repository';
import { PlayerStatsEntity } from './entities/player.stats.entity';
import { PlayerRepository } from './repositories/player.repository';
import { PlayerStatsRepository } from './repositories/player_stats.repository';
import { TeamTournamentRepository } from '../tournament/team_tournament/team_tournament.repository';

@Injectable()
export class PlayerService {
  @InjectRepository(PlayerRepository)
  private readonly _playerRepository: PlayerRepository;
  @InjectRepository(TeamRepository)
  private readonly _teamRepository: TeamRepository;
  @InjectRepository(PlayerStatsRepository)
  private readonly _playerStatsRepository: PlayerStatsRepository;
  @InjectRepository(TeamTournamentRepository)
  private readonly _teamTournamentRepository: TeamTournamentRepository;

  async getAllPlayers() {
    return await this._playerRepository.getAllPlayers();
  }

  async getPlayerById(idPlayer: number) {
    return await this._playerRepository.getPlayerById(idPlayer);
  }

  async getHistoricStatsOfPlayer(idPlayer: number): Promise<PlayerStatsEntity> {
    const historicalStats = await this._playerStatsRepository.getHistoricStatsOfPlayer(
      idPlayer,
    );

    return historicalStats;
  }

  async getStatsOfPlayerByTournament(idPlayer: number, idTournament: number) {
    const playerStats = await this._playerStatsRepository.getStatsOfPlayerByTournament(
      idPlayer,
      idTournament,
    );

    return playerStats;
  }


  async getRankScoresByTournament(
    idTournament: number,
  ): Promise<PlayerStatsEntity[]> {
    const rankScores = await this._playerStatsRepository.getRankScoresByTournament(
      idTournament,
    );

    return rankScores;
  }

  async getRankAssistByTournament(
    idTournament: number,
  ): Promise<PlayerStatsEntity[]> {
    const rankAssist = await this._playerStatsRepository.getRankAssistByTournament(
      idTournament,
    );

    return rankAssist;
  }
  async getRankYellowCardByTournament(
    idTournament: number,
  ): Promise<PlayerStatsEntity[]> {
    const rankYellowCard = await this._playerStatsRepository.getRankYellowCardByTournament(
      idTournament,
    );

    return rankYellowCard;
  }
  async getRankRedCardByTournament(
    idTournament: number,
  ): Promise<PlayerStatsEntity[]> {
    const rankAssist = await this._playerStatsRepository.getRankRedCardByTournament(
      idTournament,
    );

    return rankAssist;
  }

  async createPlayer(playerDto: PlayerDto) {
    return await this._playerRepository.createPlayer(playerDto);
  }

  async updatePlayer(idPlayer: number, playerDto: PlayerDto) {
    return await this._playerRepository.updatePlayer(idPlayer, playerDto)
  }

  async uploadImageToPlayer(idPlayer: number, file: any) {
    return await this._playerRepository.uploadImageToPlayer(idPlayer, file);
  }

  async activatePlayer(idPlayer: number) {
    return await this._playerRepository.activatePlayer(idPlayer);
  }

  async desactivatePlayer(idPlayer: number) {
    return await this._playerRepository.desactivatePlayer(idPlayer);
  }
}
