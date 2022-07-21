import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';

import { MatchRepository } from '../match/match.repository';
import { GoalRepository } from './repository/goal.repository';
import { AssistRepository } from './repository/assist.repository';
import { RedCardRepository } from './repository/red_card.repository';
import { TeamRepository } from 'src/modules/team/team/team.repository';
import { MatchStatsRepository } from './repository/match_stats.repository';
import { YellowCardRepository } from './repository/yellow_card.repository';
import { RosterRepository } from 'src/modules/team/roster/roster.repository';
import { PlayerRepository } from 'src/modules/player/repositories/player.repository';
import { TeamStatsRepository } from 'src/modules/team/team_stats/team_stats.repository';
import { PlayerStatsRepository } from 'src/modules/player/repositories/player_stats.repository';
import { TournamentRepository } from 'src/modules/tournament/tournament/tournament.repository';
import { TeamTournamentRepository } from 'src/modules/tournament/team_tournament/team_tournament.repository';
import { TournamentMatchRepository } from 'src/modules/tournament/tournament_match/tournament_match.repository';

@Injectable()
export class MatchStatsService {

  @InjectRepository(MatchRepository)
  private readonly _matchRepository: MatchRepository;

  @InjectRepository(TeamRepository)
  private readonly _teamRepository: TeamRepository;

  @InjectRepository(GoalRepository)
  private readonly _goalRepository: GoalRepository;

  @InjectRepository(AssistRepository)
  private readonly _assistRepository: AssistRepository;

  @InjectRepository(RosterRepository)
  private readonly _rosterRepository: RosterRepository;

  @InjectRepository(PlayerRepository)
  private readonly _playerRepository: PlayerRepository;


  @InjectRepository(RedCardRepository)
  private readonly _redCardRepository: RedCardRepository;

  @InjectRepository(TeamStatsRepository)
  private readonly _teamStatsRepository: TeamStatsRepository;

  @InjectRepository(TournamentRepository)
  private readonly _tournamentRepository: TournamentRepository;

  @InjectRepository(YellowCardRepository)
  private readonly _yellowCardRepository: YellowCardRepository;

  @InjectRepository(MatchStatsRepository)
  private readonly _matchStatsRepository: MatchStatsRepository;

  @InjectRepository(PlayerStatsRepository)
  private readonly _playerStatsRepository: PlayerStatsRepository;

  @InjectRepository(TeamTournamentRepository)
  private readonly _teamTournamentRepository: TeamTournamentRepository;

  @InjectRepository(TournamentMatchRepository)
  private readonly _tournamentMatchRepository: TournamentMatchRepository;

  async getStatsByMatch(idMatch: number) {
    return await this._matchStatsRepository.getStatsByMatch(idMatch, this._matchRepository);
  }

  async getStatsByMatchAndTeam(idMatch: number, idTeam: number) {
    return await this._matchStatsRepository.getStatsByMatchAndTeam(idMatch, idTeam, this._matchRepository);
  }

  async getGoalsByMatchStats(idMatchStats: number) {
    return await this._goalRepository.getGoalsByMatchStats(idMatchStats);
  }

  async createStatsOfMatch(
    idMatch: number,
    idTeam: number,
  ) {
    return await this._matchStatsRepository.createStatsOfMatch(idMatch, idTeam, this._teamRepository, this._matchRepository);
  }

  async addGoal(idMatchStats: number, idPlayer: number, minute: number) {
    return await this._matchStatsRepository.addGoal(idMatchStats, idPlayer, minute, this._playerRepository, this._rosterRepository, this._tournamentMatchRepository, this._playerStatsRepository, this._goalRepository, this._teamStatsRepository, this._tournamentRepository, this._teamTournamentRepository);
  }

  async addAssist(idMatchStats: number, idPlayer: number, minute: number) {
    return await this._matchStatsRepository.addAssist(idMatchStats, idPlayer, minute, this._playerRepository, this._rosterRepository, this._tournamentMatchRepository, this._playerStatsRepository, this._assistRepository, this._teamStatsRepository, this._tournamentRepository, this._teamTournamentRepository);

  }

  async addYellowCard(idMatchStats: number, idPlayer: number, minute: number) {
    return await this._matchStatsRepository.addYellowCard(idMatchStats, idPlayer, minute, this._playerRepository, this._rosterRepository, this._tournamentMatchRepository, this._playerStatsRepository, this._yellowCardRepository, this._teamStatsRepository, this._tournamentRepository, this._teamTournamentRepository, this._redCardRepository);
  }

  async addRedCard(idMatchStats: number, idPlayer: number, minute: number) {
    return await this._matchStatsRepository.addRedCard(idMatchStats, idPlayer, minute, this._playerRepository, this._rosterRepository, this._tournamentMatchRepository, this._playerStatsRepository, this._redCardRepository, this._teamStatsRepository, this._tournamentRepository, this._teamTournamentRepository);
  }
}
