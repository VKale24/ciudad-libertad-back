import { InjectRepository } from '@nestjs/typeorm';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import * as fs from 'fs';

import { TournamentEntity } from './tournament.entity';
import { TeamRepository } from '../../team/team/team.repository';
import { TournamentRepository } from './tournament.repository';
import { TeamTournamentRepository } from '../team_tournament/team_tournament.repository';
import { TeamTournamentEntity } from '../team_tournament/team_tournament.entity';
import { TournamentDto } from './dto/tournament.dto';
import { TeamStatsRepository } from 'src/modules/team/team_stats/team_stats.repository';
import { TeamStatsEntity } from 'src/modules/team/team_stats/team_stats.entity';
import { PlayerStatsEntity } from 'src/modules/player/entities/player.stats.entity';
import { TeamEntity } from 'src/modules/team/team/team.entity';
import { PlayerRepository } from 'src/modules/player/repositories/player.repository';
import { PlayerStatsRepository } from 'src/modules/player/repositories/player_stats.repository';
import { PlayerEntity } from 'src/modules/player/entities/player.entity';
import { StatsTableEntity } from 'src/modules/stats_table/stats_table.entity';

@Injectable()
export class TournamentService {
  @InjectRepository(TournamentRepository)
  private readonly _tournamentRepository: TournamentRepository;

  @InjectRepository(TeamRepository)
  private readonly _teamRepository: TeamRepository;

  @InjectRepository(TeamTournamentRepository)
  private readonly _teamTournamentRepository: TeamTournamentRepository;

  @InjectRepository(TeamStatsRepository)
  private readonly _teamStatsRepository: TeamStatsRepository;

  @InjectRepository(PlayerRepository)
  private readonly _playerRepository: PlayerRepository;

  @InjectRepository(PlayerStatsRepository)
  private readonly _playerStatsRepository: PlayerStatsRepository;

  async getAllTournaments() {
    const tournaments = await this._tournamentRepository.find();

    return tournaments;
  }

  async getTournamentsNotFinalized() {
    const tournaments = await this._tournamentRepository.find({
      where: { active: true },
    });

    return tournaments;
  }

  async getTournamentById(idTournament: number) {
    const tournament = await this._tournamentRepository.findOne(idTournament);

    if (!tournament) throw new NotFoundException();

    return tournament;
  }

  async createTournament(tournamentDto: TournamentDto) {
    const { name, duration, quantityTeams, image } = tournamentDto;

    const tournament = new TournamentEntity(
      name,
      duration,
      quantityTeams,
      image,
    );

    const result = await this._tournamentRepository.save(tournament);
    return result;
  }

  async addTeamToTournament(idTeam: number, idTournament: number) {
    const tournament = await this._tournamentRepository.findOne({
      idTournament,
    });
    if (tournament) {
      //****************************************
      //**Comprobar si el torneo esta finalizado
      //****************************************
      if (tournament.active) {
        const team = await this._teamRepository.findOne(idTeam);
        if (team) {
          const teamTournament = new TeamTournamentEntity();
          //****************************************
          //**Comprobar si el equipo ya esta en el torneo
          //****************************************
          const isInside = await this._teamTournamentRepository
            .createQueryBuilder('team_tournament')
            .leftJoinAndSelect('team_tournament.team', 'team')
            .leftJoinAndSelect('team_tournament.tournament', 'tournament')
            .where('team_tournament.team.idTeam = :idTeam', { idTeam: idTeam })
            .andWhere(
              'team_tournament.tournament.idTournament = :idTournament',
              { idTournament: idTournament },
            )
            .getOne();
          console.log(isInside);
          if (!isInside) {
            //***************************************************************** */
            //**Inicializar las estadisticas de los jugadores en el torneo */
            //***************************************************************** */
            //  this.initPlayerStats(team, tournament);

            const teamStats = await this._teamStatsRepository.save(
              new TeamStatsEntity(),
            );

            teamTournament.team = team;
            teamTournament.tournament = tournament;
            teamTournament.team_stats = teamStats;
            teamTournament.stats_table = await StatsTableEntity.save(
              new StatsTableEntity(),
            );

            const teamTournamentResult = await this._teamTournamentRepository.save(
              teamTournament,
            );
            return teamTournamentResult;
          } else throw new ConflictException();
        } else {
          throw new NotFoundException();
        }
      } else {
        throw new ConflictException();
      }
    } else throw new NotFoundException();
  }

  async removeOnePlayerOfRoster(
    idPlayer: number,
    idTeam: number,
    idTournament: number,
  ) {
    //**Check if Team is inside Tournament */
    const teamTournament = await this._teamTournamentRepository
      .createQueryBuilder('team_tournament')
      .leftJoinAndSelect('team_tournament.team', 'team')
      .leftJoinAndSelect('team_tournament.player', 'player')
      .leftJoinAndSelect('team_tournament.team_stats', 'team_stats')
      .leftJoinAndSelect('team_tournament.tournament', 'tournament')
      .leftJoinAndSelect('team_tournament.stats_table', 'stats_table')
      .where('team_tournament.team.idTeam = :idTeam', { idTeam: idTeam })
      .andWhere('team_tournament.tournament.idTournament = :idTournament', {
        idTournament: idTournament,
      })
      .andWhere('team_tournament.player.idPlayer = :idPlayer', {
        idPlayer: idPlayer,
      })
      .getOne();

    if (!teamTournament) throw new NotFoundException();

    teamTournament.player_active = false;
    await teamTournament.save();

    return teamTournament;
  }

  async addOnePlayerToRoster(
    idPlayer: number,
    idTeam: number,
    idTournament: number,
  ) {
    //**Check if Team is inside Tournament */
    const teamTournamentBand = await this._teamTournamentRepository
      .createQueryBuilder('team_tournament')
      .leftJoinAndSelect('team_tournament.team', 'team')
      .leftJoinAndSelect('team_tournament.player', 'player')
      .leftJoinAndSelect('team_tournament.team_stats', 'team_stats')
      .leftJoinAndSelect('team_tournament.tournament', 'tournament')
      .leftJoinAndSelect('team_tournament.stats_table', 'stats_table')
      .where('team_tournament.team.idTeam = :idTeam', { idTeam: idTeam })
      .andWhere('team_tournament.tournament.idTournament = :idTournament', {
        idTournament: idTournament,
      })
      .getOne();

    if (!teamTournamentBand) throw new NotFoundException();
    if (teamTournamentBand.player != null) {
      const teamTournament = new TeamTournamentEntity();

      teamTournament.team = teamTournamentBand.team;
      teamTournament.tournament = teamTournamentBand.tournament;
      teamTournament.team_stats = teamTournamentBand.team_stats;
      teamTournament.stats_table = teamTournamentBand.stats_table;

      //**Check if Player is inside Tournament and Team*/
      const playerTeamTournaments = await this._teamTournamentRepository
        .createQueryBuilder('team_tournament')
        .leftJoinAndSelect('team_tournament.team', 'team')
        .leftJoinAndSelect('team_tournament.tournament', 'tournament')
        .leftJoinAndSelect('team_tournament.player', 'player')
        .where('team_tournament.player.idPlayer = :idPlayer', {
          idPlayer: idPlayer,
        })
        .andWhere('team_tournament.tournament.idTournament = :idTournament', {
          idTournament: idTournament,
        })
        .getMany();

      var isActiveInOneRoster = false;
      var sameTeam = false;

      //**VERIFY IF IS ACTIVE IN THIS TEAM AND IF IS INSIDE OF SAME TEAM*/
      playerTeamTournaments.forEach((playerteamTournament) => {
        if (playerteamTournament.player_active) isActiveInOneRoster = true;
        if (playerteamTournament.team.idTeam == idTeam) sameTeam = true;
      });
      console.log(isActiveInOneRoster);
      console.log(sameTeam);

      //**********************************************/
      //**VERIFY IF IS ACTIVE IN THIS TEAM AND IF IS INSIDE OF SAME TEAM*/
      //**********************************************/
      if (isActiveInOneRoster || sameTeam)
        if (playerTeamTournaments) throw new ConflictException();

      const player = await this._playerRepository.getPlayerById(idPlayer);

      teamTournament.player = player;
      const result = await this._teamTournamentRepository.save(teamTournament);

      //Create Stats of Player in PlayerStats

      const playerStats = new PlayerStatsEntity();
      playerStats.player = player;
      playerStats.tournament = teamTournament.tournament;

      await this._playerStatsRepository.save(playerStats);

      return result;
    } else {
      //**Check if Player is inside Tournament and Team*/
      const playerIsInside = await this._teamTournamentRepository
        .createQueryBuilder('team_tournament')
        .leftJoinAndSelect('team_tournament.team', 'team')
        .leftJoinAndSelect('team_tournament.tournament', 'tournament')
        .leftJoinAndSelect('team_tournament.player', 'player')
        .where('team_tournament.player.idPlayer = :idPlayer', {
          idPlayer: idPlayer,
        })
        .andWhere('team_tournament.team.idTeam = :idTeam', { idTeam: idTeam })
        .andWhere('team_tournament.tournament.idTournament = :idTournament', {
          idTournament: idTournament,
        })
        .getOne();

      if (playerIsInside) throw new ConflictException();

      const player = await this._playerRepository.getPlayerById(idPlayer);

      teamTournamentBand.player = player;
      const result = await this._teamTournamentRepository.save(
        teamTournamentBand,
      );

      //Create Stats of Player in PlayerStats

      const playerStats = new PlayerStatsEntity();
      playerStats.player = player;
      playerStats.tournament = teamTournamentBand.tournament;

      await this._playerStatsRepository.save(playerStats);

      return result;
      //teamTournamentBand.player = player;
    }
  }

  async addListPlayerToRoster(
    listIdPlayer: number[],
    idTeam: number,
    idTournament: number,
  ) {
    //**Check if Team is inside Tournament */

    const teamTournamentBand = await this._teamTournamentRepository
      .createQueryBuilder('team_tournament')
      .leftJoinAndSelect('team_tournament.team', 'team')
      .leftJoinAndSelect('team_tournament.team_stats', 'team_stats')
      .leftJoinAndSelect('team_tournament.tournament', 'tournament')
      .leftJoinAndSelect('team_tournament.stats_table', 'stats_table')
      .where('team_tournament.team.idTeam = :idTeam', { idTeam: idTeam })
      .andWhere('team_tournament.tournament.idTournament = :idTournament', {
        idTournament: idTournament,
      })
      .getOne();

    if (!teamTournamentBand) throw new NotFoundException();

    const teamTournament = new TeamTournamentEntity();

    teamTournament.team = teamTournamentBand.team;
    teamTournament.tournament = teamTournamentBand.tournament;
    teamTournament.team_stats = teamTournamentBand.team_stats;
    teamTournament.stats_table = teamTournamentBand.stats_table;

    listIdPlayer.forEach(async (idPlayer) => {
      //**Check if Player is inside Tournament and Team*/
      const playerIsInside = await this._teamTournamentRepository
        .createQueryBuilder('team_tournament')
        .leftJoinAndSelect('team_tournament.team', 'team')
        .leftJoinAndSelect('team_tournament.tournament', 'tournament')
        .leftJoinAndSelect('team_tournament.player', 'player')
        .where('team_tournament.player.idPlayer = :idPlayer', {
          idPlayer: idPlayer,
        })
        .where('team_tournament.team.idTeam = :idTeam', { idTeam: idTeam })
        .andWhere('team_tournament.tournament.idTournament = :idTournament', {
          idTournament: idTournament,
        })
        .getOne();

      if (!playerIsInside) {
        const player = await this._playerRepository.getPlayerById(idPlayer);
        teamTournament.player = player;
        const result = await this._teamTournamentRepository.save(
          teamTournament,
        );
      }
    });
  }

  async uploadImageToTournament(idTournament: number, file: any) {
    const tournament = await this._tournamentRepository.findOne({idTournament: idTournament});
    console.log(tournament);
    console.log(idTournament);
    var pathToFile;
    if (!tournament) throw new NotFoundException();
    console.log(tournament.idTournament);

    if (tournament.image != 'no image') {
      pathToFile = `./files/${tournament.image}`;
    }
    try {
      fs.unlinkSync(pathToFile);
      //file removed
    } catch (err) {
      console.error(err);
    }

    if (file != null) tournament.image = file.filename;

    await this._tournamentRepository.save(tournament);

    return tournament;
  }


  async updateTournament(idTournament: number, tournamentDto: TournamentDto) {
    const { name, duration, quantityTeams, image } = tournamentDto;

    const tournament = await this.getTournamentById(idTournament);

    if (name) tournament.name = name;

    if (duration) tournament.duration = duration;

    if (quantityTeams) tournament.quantityTeams = quantityTeams;

    if (image) tournament.image = image;

    const result = await this._tournamentRepository.save(tournament);

    return result;
  }

  async deleteTournament(idtournament: number) {
    const tournament = await this.getTournamentById(idtournament);
    if (tournament) {
      tournament.active = false;
      const result = await this._tournamentRepository.save(tournament);
      return result;
    }
  }

  async initPlayerStats(team: TeamEntity, tournament: TournamentEntity) {
    const listTeamTournament = await this._teamTournamentRepository
      .createQueryBuilder('team_tournament')
      .leftJoinAndSelect('team_tournament.player', 'player')
      .leftJoinAndSelect('team_tournament.team', 'team')
      .leftJoinAndSelect('team_tournament.tournament', 'tournament')
      .where('team_tournament.team.idTeam = :idTeam', { idTeam: team.idTeam })
      .andWhere('team_tournament.tournament.idTournament = :idTournament', {
        idTournament: tournament.idTournament,
      })
      .getMany();

    if (listTeamTournament)
      listTeamTournament.forEach(async (teamTournament) => {
        const playerStats = new PlayerStatsEntity();
        playerStats.player = teamTournament.player;
        playerStats.tournament = teamTournament.tournament;
        await this._playerStatsRepository.save(playerStats);
      });
  }
}