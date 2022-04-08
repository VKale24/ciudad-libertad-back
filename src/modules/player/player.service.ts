import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import * as fs from 'fs';

import { InjectRepository } from '@nestjs/typeorm';
import { TeamRepository } from '../team/team/team.repository';
import { TeamTournamentEntity } from '../tournament/team_tournament/team_tournament.entity';
import { TeamTournamentRepository } from '../tournament/team_tournament/team_tournament.repository';
import { TournamentEntity } from '../tournament/tournament/tournament.entity';
import { PlayerDto } from './dto/player.dto';
import { PlayerEntity } from './entities/player.entity';
import { PlayerStatsEntity } from './entities/player.stats.entity';
import { PlayerRepository } from './repositories/player.repository';
import { PlayerStatsRepository } from './repositories/player_stats.repository';

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
    const players = await this._playerRepository
      .createQueryBuilder('player')
      .orderBy('player.active', 'DESC')
      .addOrderBy('player.name', 'ASC')
      .getMany();

    return players;
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
    const goals = await this._playerStatsRepository.getStatsOfPlayerByTournament(
      idPlayer,
      idTournament,
    );

    return goals;
  }

  async getAllPlayersByTeam(idTeam: number) {
    const team_tournamentPlayers = await this._teamTournamentRepository
      .createQueryBuilder('team_tournament')
      .leftJoinAndSelect('team_tournament.team', 'team')
      .leftJoinAndSelect('team_tournament.player', 'player')
      .leftJoinAndSelect('team_tournament.team_stats', 'team_stats')
      .leftJoinAndSelect('team_tournament.stats_table', 'stats_table')
      .leftJoinAndSelect('team_tournament.tournament', 'tournament')
      .where('team_tournament.team.idTeam = :idTeam', { idTeam: idTeam })
      .orderBy('player.position', 'DESC')
      .addOrderBy('tournament.name', 'DESC')
      .getMany();

    return team_tournamentPlayers;
  }
  async getAllPlayersByTeamTournament(idTeam: number, idTournament: number) {
    const team_tournamentPlayers = await this._teamTournamentRepository
      .createQueryBuilder('team_tournament')
      .leftJoinAndSelect('team_tournament.team', 'team')
      .leftJoinAndSelect('team_tournament.player', 'player')
      .leftJoinAndSelect('team_tournament.team_stats', 'team_stats')
      .leftJoinAndSelect('team_tournament.stats_table', 'stats_table')
      .leftJoinAndSelect('team_tournament.tournament', 'tournament')
      .where('team_tournament.team.idTeam = :idTeam', { idTeam: idTeam })
      .andWhere('team_tournament.tournament.idTournament = :idTournament', {
        idTournament: idTournament,
      })
      .orderBy('player.position', 'DESC')
      .getMany();

    return team_tournamentPlayers;
  }
  
  async getAllPlayersActiveByTeamTournament(idTeam: number, idTournament: number) {
    const team_tournamentPlayers = await this._teamTournamentRepository
      .createQueryBuilder('team_tournament')
      .leftJoinAndSelect('team_tournament.team', 'team')
      .leftJoinAndSelect('team_tournament.player', 'player')
      .leftJoinAndSelect('team_tournament.team_stats', 'team_stats')
      .leftJoinAndSelect('team_tournament.stats_table', 'stats_table')
      .leftJoinAndSelect('team_tournament.tournament', 'tournament')
      .where('team_tournament.team.idTeam = :idTeam', { idTeam: idTeam })
      .andWhere('team_tournament.tournament.idTournament = :idTournament', {
        idTournament: idTournament,
      })
      .andWhere('team_tournament.player_active = TRUE')
      .orderBy('player.position', 'DESC')
      .getMany();

    return team_tournamentPlayers;
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
  async getAllTeamsTournamentsOfPlayer(
    idTournament: number,
  ): Promise<TeamTournamentEntity[]> {
    const teamTournaments = await this._teamTournamentRepository.getAllTeamsTournamentsOfPlayer(
      idTournament,
      this._playerRepository,
    );

    return teamTournaments;
  }

  /*async getStatsByPlayer(idPlayer: number) {
    const player = await this.getPlayerById(idPlayer);
    const stats = this._playerStatsRepository.findOne({
      where: { idPlayerStats: player.player_stats.idPlayerStats },
    });
    return stats;
  }*/

  async createPlayer(playerDto: PlayerDto) {
    const {
      name,
      last_name,
      nickname,
      ci,
      age,
      email,
      image,
      image_face,
      phone,
      height,
      weight,
      position,
      profession,
    } = playerDto;

    const player = new PlayerEntity();

    player.name = name;
    player.last_name = last_name;
    player.age = age;
    player.ci = ci;
    player.height = height;
    player.weight = weight;
    player.phone = phone;
    player.email = email;
    player.image = image;
    player.image_face = image_face;
    player.position = position;
    player.profession = profession;
    player.player_stats = null;

    try {
      await this._playerRepository.save(player);
      //**Guardar el equipo del jugador */
    } catch (error) {
      if (error.code == '23505')
        throw new ConflictException(
          'Ya existe un jugador con ese carnet de identidad en el sistema',
        );
      else throw new InternalServerErrorException();
    }

    return player;
  }

  async updatePlayer(idPlayer: number, playerDto: PlayerDto) {
    const player = await this.getPlayerById(idPlayer);

    const {
      name,
      last_name,
      nickname,
      age,
      ci,
      email,
      height,
      weight,
      image,
      image_face,
      phone,
      position,
      profession,
      active,
    } = playerDto;

    if (name) player.name = name;

    if (last_name) player.last_name = last_name;

    if (age) player.age = age;

    if (ci) player.ci = ci;

    if (email) player.email = email;

    if (height) player.height = height;

    if (weight) player.weight = weight;

    if (image) player.image = image;

    if (image_face) player.image_face = image_face;

    if (phone) player.phone = phone;

    if (position) player.position = position;

    if (profession) player.profession = profession;

    player.active = active;

    try {
      const playerR = await this._playerRepository.save(player);
      return playerR;
    } catch (error) {
      if (error.code == '23505')
        throw new ConflictException(
          'Ya existe un jugador con ese carnet de identidad en el sistema',
        );
      else throw new InternalServerErrorException();
    }
  }

  async uploadImageToPlayer(idPlayer: number, file: any) {
    const player = await this._playerRepository.findOne(idPlayer);
    var pathToFile;

    if (!player) throw new NotFoundException();

    if(player.image!="no image" || player.image.length==0)
    pathToFile = `./files/${player.image}`;
    
    try {
      fs.unlinkSync(pathToFile);
      //file removed
    } catch (err) {
      console.error(err);
    }

    if (file != null) player.image = file.filename;

    await this._playerRepository.save(player);
   
    
    return player;
  }

  async desactivatePlayer(idPlayer: number) {
    const player = await this.getPlayerById(idPlayer);

    player.active = false;

    this._playerRepository.save(player);
  }

  async activatePlayer(idPlayer: number) {
    const player = await this.getPlayerById(idPlayer);

    player.active = true;

    this._playerRepository.save(player);
  }
}
