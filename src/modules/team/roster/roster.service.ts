import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PlayerStatsEntity } from 'src/modules/player/entities/player.stats.entity';
import { PlayerRepository } from 'src/modules/player/repositories/player.repository';
import { PlayerStatsRepository } from 'src/modules/player/repositories/player_stats.repository';
import { TeamTournamentRepository } from 'src/modules/tournament/team_tournament/team_tournament.repository';
import { TeamRepository } from '../team/team.repository';
import { RosterEntity } from './roster.entity';
import { RosterRepository } from './roster.repository';

@Injectable()
export class RosterService {
  @InjectRepository(RosterRepository)
  private readonly _rosterRepository: RosterRepository;

  @InjectRepository(PlayerRepository)
  private readonly _playerRepository: PlayerRepository;

  @InjectRepository(PlayerStatsRepository)
  private readonly _playerStatsRepository: PlayerStatsRepository;

  @InjectRepository(TeamRepository)
  private readonly _teamRepository: TeamRepository;

  @InjectRepository(TeamTournamentRepository)
  private readonly _teamTournamentRepository: TeamTournamentRepository;

  async getRosterHistoryByTeam(idTeam: number) {
    const team = await this._teamRepository.getTeamById(idTeam);

    if (!team) throw new NotFoundException();

    const roster = await this._rosterRepository
      .createQueryBuilder('roster')
      .leftJoinAndSelect('roster.team', 'team')
      .leftJoinAndSelect('roster.player', 'player')
      .leftJoinAndSelect('roster.tournament', 'tournament')
      .where('team.idTeam = :idTeam', { idTeam: idTeam })
      .getMany();

    return roster;
  }
  async getTeamsByPlayer(idPlayer: number) {
    const player = await this._playerRepository.getPlayerById(idPlayer);

    if (!player) throw new NotFoundException();

    const roster = await this._rosterRepository
      .createQueryBuilder('roster')
      .leftJoinAndSelect('roster.team', 'team')
      .leftJoinAndSelect('roster.player', 'player')
      .leftJoinAndSelect('roster.tournament', 'tournament')
      .where('player.idPlayer = :idPlayer', { idPlayer: idPlayer })
      .getMany();

    return roster;
  }

  async getRosterActiveByTeam(idTeam: number) {
    const team = await this._teamRepository.getTeamById(idTeam);

    if (!team) throw new NotFoundException();

    const roster = await this._rosterRepository
      .createQueryBuilder('roster')
      .leftJoinAndSelect('roster.team', 'team')
      .leftJoinAndSelect('roster.player', 'player')
      .leftJoinAndSelect('roster.tournament', 'tournament')
      .where('team.idTeam = :idTeam', { idTeam: idTeam })
      .andWhere('roster.player_active = TRUE')
      .getMany();

    return roster;
  }

  async addOnePlayerToRoster(
    idPlayer: number,
    idTeam: number,
    idTournament: number,
  ) {
    //**CHECK IF PLAYER INTRODUCED EXISTS */
    const player = await this._playerRepository.getPlayerById(idPlayer);

    //**Check if Team is inside Tournament */
    const teamInTournament = await this._teamTournamentRepository
      .createQueryBuilder('team_tournament')
      .leftJoinAndSelect('team_tournament.team', 'team')
      .leftJoinAndSelect('team_tournament.tournament', 'tournament')
      .where('team_tournament.team.idTeam = :idTeam', { idTeam: idTeam })
      .andWhere('team_tournament.tournament.idTournament = :idTournament', {
        idTournament: idTournament,
      })
      .getOne();

    if (!teamInTournament) throw new NotFoundException();

    //**Check if Player is inside in some Roster*/
    const playerRoster = await this._rosterRepository
      .createQueryBuilder('roster')
      .leftJoinAndSelect('roster.team', 'team')
      .leftJoinAndSelect('roster.tournament', 'tournament')
      .leftJoinAndSelect('roster.player', 'player')
      .where('roster.player.idPlayer = :idPlayer', {
        idPlayer: idPlayer,
      })
      .andWhere('roster.tournament.idTournament = :idTournament', {
        idTournament: idTournament,
      })
      .getOne();

    if (playerRoster) throw new ConflictException();

    const roster = new RosterEntity();
    roster.team = teamInTournament.team;
    roster.tournament = teamInTournament.tournament;

    roster.player = player;
    const result = await this._rosterRepository.save(roster);

    //Create Stats of Player in PlayerStats
    const playerStats = new PlayerStatsEntity();
    playerStats.player = player;
    playerStats.tournament = roster.tournament;

    await this._playerStatsRepository.save(playerStats);

    return result;
  }
}

/*
  async addListPlayerToRoster(
    listIdPlayer: number[],
    idTeam: number,
    idTournament: number,
  ) {

    //Check if Team is inside Tournament 

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
      //Check if Player is inside Tournament and Team
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
  }*/
