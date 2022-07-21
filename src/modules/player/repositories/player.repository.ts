import * as fs from 'fs';
import { Repository, EntityRepository } from 'typeorm';
import { ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';


import { PlayerDto } from '../dto/player.dto';
import { PlayerEntity } from '../entities/player.entity';
import { PlayerStatsRepository } from './player_stats.repository';
import { MatchStatsEntity } from 'src/modules/match/match_stats/entities/match_stats.entity';
import { TournamentMatchRepository } from 'src/modules/tournament/tournament_match/tournament_match.repository';

@EntityRepository(PlayerEntity)
export class PlayerRepository extends Repository<PlayerEntity> {
  async getPlayerById(idPlayer: number) {
    const player = await this.findOne(idPlayer);

    if (!player) throw new NotFoundException();
    return player;
  }

  async getAllPlayers() {
    const players = await this
      .createQueryBuilder('player')
      .orderBy('player.active', 'DESC')
      .addOrderBy('player.name', 'ASC')
      .getMany();

    return players;
  }

  async getAllPlayersByTeam(idTeam: number) {
    const players = await this.createQueryBuilder('player')
      .leftJoinAndSelect('player.team', 'team')
      .where('player.team.idTeam = :idTeam', { idTeam: idTeam })
      .getMany();

    return players;
  }

  async createPlayer(playerDto: PlayerDto) {
    const {
      name,
      last_name,
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
      await this.save(player);
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

  async updatePlayer(idPlayer: number, playerDto: PlayerDto) {
    const player = await this.getPlayerById(idPlayer);

    const {
      name,
      last_name,
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
      const playerR = await this.save(player);
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
    const player = await this.findOne(idPlayer);
    var pathToFile;

    if (!player) throw new NotFoundException();

    if (player.image != "no image" || player.image.length == 0)
      pathToFile = `./files/${player.image}`;

    try {
      fs.unlinkSync(pathToFile);
      //file removed
    } catch (err) {
      console.error(err);
    }

    if (file != null) player.image = file.filename;

    await this.save(player);

    return player;
  }

  async activatePlayer(idPlayer: number) {
    const player = await this.getPlayerById(idPlayer);

    player.active = true;

    this.save(player);
  }
  async desactivatePlayer(idPlayer: number) {
    const player = await this.getPlayerById(idPlayer);

    player.active = false;

    this.save(player);
  }
}
