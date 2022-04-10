import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { GoalEntity } from './entities/goal.entity';
import { MatchRepository } from '../match/match.repository';
import { MatchStatsDto } from './dto/match_stats.dto';
import { GoalRepository } from './repository/goal.repository';
import { MatchStatsEntity } from './entities/match_stats.entity';
import { TeamRepository } from 'src/modules/team/team/team.repository';
import { PlayerRepository } from 'src/modules/player/repositories/player.repository';
import { MatchStatsRepository } from './repository/match_stats.repository';
import { ValidationPlayer } from 'src/common/validations/validation.player';
import { AssistEntity } from './entities/assist.entity';
import { AssistRepository } from './repository/assist.repository';
import { RedCardRepository } from './repository/red_card.repository';
import { YellowCardRepository } from './repository/yellow_card.repository';
import { YellowCardEntity } from './entities/yellow_card.entity';
import { RedCardEntity } from './entities/red_card.entity';
import { PlayerStatsRepository } from 'src/modules/player/repositories/player_stats.repository';
import { TeamStatsRepository } from 'src/modules/team/team_stats/team_stats.repository';
import { TournamentMatchRepository } from 'src/modules/tournament/tournament_match/tournament_match.repository';
import { TeamTournamentRepository } from 'src/modules/tournament/team_tournament/team_tournament.repository';

@Injectable()
export class MatchStatsService {
  @InjectRepository(MatchStatsRepository)
  private readonly _matchStatsRepository: MatchStatsRepository;

  @InjectRepository(MatchRepository)
  private readonly _matchRepository: MatchRepository;

  @InjectRepository(TournamentMatchRepository)
  private readonly _tournamentMatchRepository: TournamentMatchRepository;

  @InjectRepository(TeamRepository)
  private readonly _teamRepository: TeamRepository;

  @InjectRepository(TeamStatsRepository)
  private readonly _teamStatsRepository: TeamStatsRepository;

  @InjectRepository(TeamTournamentRepository)
  private readonly _teamTournamentRepository: TeamTournamentRepository;

  @InjectRepository(PlayerRepository)
  private readonly _playerRepository: PlayerRepository;

  @InjectRepository(PlayerStatsRepository)
  private readonly _playerStatsRepository: PlayerStatsRepository;

  @InjectRepository(GoalRepository)
  private readonly _goalRepository: GoalRepository;

  @InjectRepository(AssistRepository)
  private readonly _assistRepository: AssistRepository;

  @InjectRepository(RedCardRepository)
  private readonly _redCardRepository: RedCardRepository;

  @InjectRepository(YellowCardRepository)
  private readonly _yellowCardRepository: YellowCardRepository;

  async getStatsByMatch(idMatch: number) {
    const match = await this._matchRepository.findOne(idMatch);

    if (match) {
      const stats = await this._matchStatsRepository
        .createQueryBuilder('match_stats')
        .leftJoinAndSelect('match_stats.match', 'match')
        .leftJoinAndSelect('match_stats.team', 'team')
        .where('match_stats.match.idMatch = :idMatch', { idMatch: idMatch })
        .orderBy('match_stats.match.idMatch')
        .getMany();

      return stats;
    } else throw new NotFoundException();
  }

  async getStatsByMatchAndTeam(idMatch: number, idTeam: number) {
    return await this._matchStatsRepository.getStatsByMatchAndTeam(idMatch, idTeam, this._matchRepository);
  }

  async saveStatsOfMatch(
    matchStatsDto: MatchStatsDto,
    idMatch: number,
    idTeam: number,
  ) {
    const match = await this._matchRepository.findOne(idMatch);
    const team = await this._teamRepository.findOne(idTeam);

    //******************************************** */
    //**Verificar si ya el Match tiene 2 equipos */
    //******************************************** */
    const contTeam = await this._matchStatsRepository
      .createQueryBuilder('match_stats')
      .leftJoin('match_stats.match', 'match')
      .where('match_stats.match.idMatch = :idMatch', { idMatch: idMatch })
      .getCount();

    if (match && team && contTeam < 2) {
      const matchStats = new MatchStatsEntity();
      matchStats.match = match;
      matchStats.team = team;

      const matchStatsResult = await this._matchStatsRepository.save(
        matchStats,
      );
      return matchStatsResult;
    } else throw new NotFoundException();
  }

  async addGoal(idMatchStats: number, idPlayer: number, minute: number) {
    const player = await this._playerRepository.findOne(idPlayer);

    const matchStats = await this._matchStatsRepository.findOne(idMatchStats, {
      relations: ['team', 'match'],
    });

    //**Verificar si el jugador entrado es del equipo presente en el mAtchStats
    if (
      matchStats &&
      player &&
      minute &&
      (await ValidationPlayer.checkIfPlayerIsInTeam(
        player,
        matchStats,
        this._teamTournamentRepository,
        this._tournamentMatchRepository,
      ))
    ) {
      //************************************************* */
      //**Añadir un gol a las estadisticas del jugador */
      //************************************************* */
      await this._playerRepository.addGoalToPlayer(
        player,
        matchStats,
        this._playerStatsRepository,
        this._tournamentMatchRepository,
      );

      const goal = new GoalEntity();
      goal.minute = minute;
      goal.player = player;
      goal.match_stats = matchStats;
      const goalResult = await this._goalRepository.save(goal);

      //************************************************* */
      //**Añadir el gol al global
      //************************************************* */

      matchStats.goals++;
      await this._matchStatsRepository.save(matchStats);

      //************************************************* */
      //**Añadir un gol a las estadisticas del equipo */
      //************************************************* */

      await this._teamStatsRepository.addGoalToStats(
        player,
        matchStats,
        this._tournamentMatchRepository,
        this._teamTournamentRepository,
      );

      return goalResult;
    } else throw new NotFoundException();
  }

  async addAssist(idMatchStats: number, idPlayer: number, minute: number) {
    const player = await this._playerRepository.findOne(idPlayer);

    const matchStats = await this._matchStatsRepository.findOne(idMatchStats, {
      relations: ['team', 'match'],
    });

    //**Verificar si el jugador entrado es del equipo presente en el mAtchStats
    if (
      matchStats &&
      player &&
      minute &&
      (await ValidationPlayer.checkIfPlayerIsInTeam(
        player,
        matchStats,
        this._teamTournamentRepository,
        this._tournamentMatchRepository,
      ))
    ) {
      //************************************************* */
      //**Añadir la asistencia a las estadisticas del jugador */
      //************************************************* */
      await this._playerRepository.addAssistToPlayer(
        player,
        matchStats,
        this._playerStatsRepository,
        this._tournamentMatchRepository,
      );

      const assist = new AssistEntity();
      assist.minute = minute;
      assist.player = player;
      assist.match_stats = matchStats;
      const assitResult = await this._assistRepository.save(assist);

      //**Añadir la asistencia al global
      matchStats.assists++;
      await this._matchStatsRepository.save(matchStats);

      //************************************************* */
      //**Añadir la asistencia a las estadisticas del equipo */
      //************************************************* */
      await this._teamStatsRepository.addAssistToStats(
        player,
        matchStats,
        this._tournamentMatchRepository,
        this._teamTournamentRepository,
      );

      return assitResult;
    } else throw new NotFoundException();
  }

  async addYellowCard(idMatchStats: number, idPlayer: number, minute: number) {
    const player = await this._playerRepository.findOne(idPlayer);

    const matchStats = await this._matchStatsRepository.findOne(idMatchStats, {
      relations: ['team', 'match'],
    });
    //**Verificar si el jugador entrado es del equipo presente en el mAtchStats
    if (
      matchStats &&
      player &&
      minute &&
      (await ValidationPlayer.checkIfPlayerIsInTeam(
        player,
        matchStats,
        this._teamTournamentRepository,
        this._tournamentMatchRepository,
      ))
    ) {
      //************************************************* */
      //**Añadir la tarjeta amarilla a las estadisticas del jugador */
      //************************************************* */
      await this._playerRepository.addYellowCardToPlayer(
        player,
        matchStats,
        this._playerStatsRepository,
        this._tournamentMatchRepository,
      );

      //Verificar si ya el jugador tiene una tarjeta amarilla, y de tenerla se le adiciona la tarjeta roja
      const playerHaveYellowCard = await this._yellowCardRepository
        .createQueryBuilder('yellow_card')
        .leftJoinAndSelect('yellow_card.player', 'player')
        .leftJoinAndSelect('yellow_card.match_stats', 'match_stats')
        .where('yellow_card.match_stats.idMatchStats = :idMatchStats', {
          idMatchStats: idMatchStats,
        })
        .andWhere('player.idPlayer = :idPlayer', { idPlayer: idPlayer })
        .getOne();
        
      if (playerHaveYellowCard) {
        await this.addRedCard(idMatchStats, idPlayer, minute);
        matchStats.red_card++;
        await this._teamStatsRepository.addRedCardToStats(
          player,
          matchStats,
          this._tournamentMatchRepository,
          this._teamTournamentRepository,
        );
      }

      const yellowCard = new YellowCardEntity();
      yellowCard.minute = minute;
      yellowCard.player = player;
      yellowCard.match_stats = matchStats;
      const yellowCardResult = await this._yellowCardRepository.save(
        yellowCard,
      );

      //**Añadir la tarjeta amarilla al global
      matchStats.yellow_card++;
      await this._matchStatsRepository.save(matchStats);

      //************************************************* */
      //**Añadir la tarjeta amarilla a las estadisticas del equipo */
      //************************************************* */
      await this._teamStatsRepository.addYellowCardToStats(
        player,
        matchStats,
        this._tournamentMatchRepository,
        this._teamTournamentRepository,
      );
      return yellowCardResult;
    } else throw new NotFoundException();
  }

  async addRedCard(idMatchStats: number, idPlayer: number, minute: number) {
    const player = await this._playerRepository.findOne(idPlayer);

    const matchStats = await this._matchStatsRepository.findOne(idMatchStats, {
      relations: ['team', 'match'],
    });

    //**Verificar si el jugador entrado es del equipo presente en el mAtchStats
    if (
      matchStats &&
      player &&
      minute &&
      (await ValidationPlayer.checkIfPlayerIsInTeam(
        player,
        matchStats,
        this._teamTournamentRepository,
        this._tournamentMatchRepository,
      ))
    ) {
      //************************************************* */
      //**Añadir la tarjeta roja a las estadisticas del jugador */
      //************************************************* */
      await this._playerRepository.addRedCardToPlayer(
        player,
        matchStats,
        this._playerStatsRepository,
        this._tournamentMatchRepository,
      );

      const redCard = new RedCardEntity();
      redCard.minute = minute;
      redCard.player = player;
      redCard.match_stats = matchStats;
      const redCardResult = await this._redCardRepository.save(redCard);

      //**Añadir la tarjeta roja al global
      matchStats.red_card++;
      await this._matchStatsRepository.save(matchStats);

      //************************************************* */
      //**Añadir la tarjeta roja a las estadisticas del equipo */
      //************************************************* */
      await this._teamStatsRepository.addRedCardToStats(
        player,
        matchStats,
        this._tournamentMatchRepository,
        this._teamTournamentRepository,
      );
      return redCardResult;
    } else throw new NotFoundException();
  }
}
