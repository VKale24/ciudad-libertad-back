import { Repository, EntityRepository } from 'typeorm';
import { HttpException, HttpStatus, NotFoundException } from '@nestjs/common';

import { GoalRepository } from './goal.repository';
import { GoalEntity } from '../entities/goal.entity';
import { AssistRepository } from './assist.repository';
import { AssistEntity } from '../entities/assist.entity';
import { RedCardRepository } from './red_card.repository';
import { RedCardEntity } from '../entities/red_card.entity';
import { MatchRepository } from '../../match/match.repository';
import { YellowCardRepository } from './yellow_card.repository';
import { YellowCardEntity } from '../entities/yellow_card.entity';
import { MatchStatsEntity } from '../entities/match_stats.entity';
import { TeamRepository } from 'src/modules/team/team/team.repository';
import { ValidationPlayer } from 'src/common/validations/validation.player';
import { RosterRepository } from 'src/modules/team/roster/roster.repository';
import { PlayerRepository } from 'src/modules/player/repositories/player.repository';
import { TeamStatsRepository } from 'src/modules/team/team_stats/team_stats.repository';
import { TournamentRepository } from 'src/modules/tournament/tournament/tournament.repository';
import { PlayerStatsRepository } from 'src/modules/player/repositories/player_stats.repository';
import { TeamTournamentRepository } from 'src/modules/tournament/team_tournament/team_tournament.repository';
import { TournamentMatchRepository } from 'src/modules/tournament/tournament_match/tournament_match.repository';

@EntityRepository(MatchStatsEntity)
export class MatchStatsRepository extends Repository<MatchStatsEntity> {

  async getStatsByMatchAndTeam(idMatch: number, idTeam: number, matchRepository: MatchRepository) {
    const match = await matchRepository.findOne(idMatch);

    if (match) {
      const stats = await this
        .createQueryBuilder('match_stats')
        .leftJoinAndSelect('match_stats.match', 'match')
        .leftJoinAndSelect('match_stats.team', 'team')
        .where('match_stats.match.idMatch = :idMatch', { idMatch: idMatch })
        .andWhere('match_stats.team.idTeam = :idTeam', { idTeam: idTeam })
        .getOne();

      return stats;
    } else throw new NotFoundException();
  }

  async getStatsByMatch(idMatch: number, _matchRepository: MatchRepository) {
    const match = await _matchRepository.findOne(idMatch);

    if (match) {
      const stats = await this
        .createQueryBuilder('match_stats')
        .leftJoinAndSelect('match_stats.match', 'match')
        .leftJoinAndSelect('match_stats.team', 'team')
        .where('match_stats.match.idMatch = :idMatch', { idMatch: idMatch })
        .orderBy('match_stats.match.idMatch')
        .getMany();

      if (stats.length == 0) throw new HttpException("No content", HttpStatus.NO_CONTENT);
      return stats;
    } else throw new NotFoundException();
  }

  async createStatsOfMatch(idMatch: number, idTeam: number, _teamRepository: TeamRepository, _matchRepository: MatchRepository) {
    const team = await _teamRepository.findOne(idTeam);
    const match = await _matchRepository.findOne(idMatch);

    //******************************************** */
    //**Verificar si ya el Match tiene 2 equipos */
    //******************************************** */
    const contTeam = await this
      .createQueryBuilder('match_stats')
      .leftJoin('match_stats.match', 'match')
      .where('match_stats.match.idMatch = :idMatch', { idMatch: idMatch })
      .getCount();

    if (match && team && contTeam < 2) {
      const matchStats = new MatchStatsEntity();
      matchStats.match = match;
      matchStats.team = team;

      const matchStatsResult = await this.save(
        matchStats,
      );
      return matchStatsResult;
    } else throw new NotFoundException();
  }

  async addGoal(idMatchStats: number, idPlayer: number, minute: number, _playerRepository: PlayerRepository, _rosterRepository: RosterRepository, _tournamentMatchRepository: TournamentMatchRepository, _playerStatsRepository: PlayerStatsRepository, _goalRepository: GoalRepository, _teamStatsRepository: TeamStatsRepository, _tournamentRepository: TournamentRepository, _teamTournamentRepository: TeamTournamentRepository){
    const player = await _playerRepository.findOne(idPlayer);

    const matchStats = await this.findOne(idMatchStats, {
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
        _rosterRepository,
        _tournamentMatchRepository,
        ))
        ) {
      
      //************************************************* */
      //**Añadir un gol a las estadisticas del jugador */
      //************************************************* */
      await _playerRepository.addGoalToPlayer(
        player,
        matchStats,
        _playerStatsRepository,
        _tournamentMatchRepository,
      );
      
      const goal = new GoalEntity();
      goal.minute = minute;
      goal.player = player;
      goal.match_stats = matchStats;
      const goalResult = await _goalRepository.save(goal);
      
      //************************************************* */
      //**Añadir el gol al global
      //************************************************* */
      
      matchStats.goals++;
      await this.save(matchStats);
      
      //************************************************* */
      //**Añadir un gol a las estadisticas del equipo */
      //************************************************* */
      
      await _teamStatsRepository.addGoalToStats(
        player,
        matchStats,
        _playerRepository,
        _tournamentRepository,
        _tournamentMatchRepository,
        _teamTournamentRepository,
        _rosterRepository
        );

      return goalResult;
    } else throw new NotFoundException();
  }

  async addAssist(idMatchStats: number, idPlayer: number, minute: number, _playerRepository: PlayerRepository, _rosterRepository: RosterRepository, _tournamentMatchRepository: TournamentMatchRepository, _playerStatsRepository: PlayerStatsRepository, _assistRepository: AssistRepository, _teamStatsRepository: TeamStatsRepository, _tournamentRepository: TournamentRepository, _teamTournamentRepository: TeamTournamentRepository){
    const player = await _playerRepository.findOne(idPlayer);

    const matchStats = await this.findOne(idMatchStats, {
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
        _rosterRepository,
        _tournamentMatchRepository,
      ))
    ) {
      //************************************************* */
      //**Añadir la asistencia a las estadisticas del jugador */
      //************************************************* */
      await _playerRepository.addAssistToPlayer(
        player,
        matchStats,
        _playerStatsRepository,
        _tournamentMatchRepository,
      );

      const assist = new AssistEntity();
      assist.minute = minute;
      assist.player = player;
      assist.match_stats = matchStats;
      const assitResult = await _assistRepository.save(assist);

      //**Añadir la asistencia al global
      matchStats.assists++;
      await this.save(matchStats);

      //************************************************* */
      //**Añadir la asistencia a las estadisticas del equipo */
      //************************************************* */
      await _teamStatsRepository.addAssistToStats(
        player,
        matchStats,
        _playerRepository,
        _tournamentRepository,
        _tournamentMatchRepository,
        _teamTournamentRepository,
        _rosterRepository
        );

      return assitResult;
    } else throw new NotFoundException();
  }

  async addYellowCard(idMatchStats: number, idPlayer: number, minute: number, _playerRepository: PlayerRepository, _rosterRepository: RosterRepository, _tournamentMatchRepository: TournamentMatchRepository, _playerStatsRepository: PlayerStatsRepository, _yellowCardRepository: YellowCardRepository, _teamStatsRepository: TeamStatsRepository, _tournamentRepository: TournamentRepository, _teamTournamentRepository: TeamTournamentRepository, _redCardRepository: RedCardRepository){
    const player = await _playerRepository.findOne(idPlayer);

    const matchStats = await this.findOne(idMatchStats, {
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
        _rosterRepository,
        _tournamentMatchRepository,
      ))
    ) {
      //************************************************* */
      //**Añadir la tarjeta amarilla a las estadisticas del jugador */
      //************************************************* */
      await _playerRepository.addYellowCardToPlayer(
        player,
        matchStats,
        _playerStatsRepository,
        _tournamentMatchRepository,
      );

      //Verificar si ya el jugador tiene una tarjeta amarilla, y de tenerla se le adiciona la tarjeta roja
      const playerHaveYellowCard = await _yellowCardRepository
        .createQueryBuilder('yellow_card')
        .leftJoinAndSelect('yellow_card.player', 'player')
        .leftJoinAndSelect('yellow_card.match_stats', 'match_stats')
        .where('yellow_card.match_stats.idMatchStats = :idMatchStats', {
          idMatchStats: idMatchStats,
        })
        .andWhere('player.idPlayer = :idPlayer', { idPlayer: idPlayer })
        .getOne();
        
      if (playerHaveYellowCard) {
        await this.addRedCard(idMatchStats, idPlayer, minute, _playerRepository, _rosterRepository, _tournamentMatchRepository, _playerStatsRepository, _redCardRepository, _teamStatsRepository, _tournamentRepository, _teamTournamentRepository);
        matchStats.red_card++;
        await _teamStatsRepository.addRedCardToStats(
          player,
          matchStats,
          _playerRepository,
          _tournamentRepository,
          _tournamentMatchRepository,
          _teamTournamentRepository,
          _rosterRepository
          );
      }

      const yellowCard = new YellowCardEntity();
      yellowCard.minute = minute;
      yellowCard.player = player;
      yellowCard.match_stats = matchStats;
      const yellowCardResult = await _yellowCardRepository.save(
        yellowCard,
      );

      //**Añadir la tarjeta amarilla al global
      matchStats.yellow_card++;
      await this.save(matchStats);

      //************************************************* */
      //**Añadir la tarjeta amarilla a las estadisticas del equipo */
      //************************************************* */
      await _teamStatsRepository.addYellowCardToStats(
        player,
        matchStats,
        _playerRepository,
        _tournamentRepository,
        _tournamentMatchRepository,
        _teamTournamentRepository,
        _rosterRepository
        );
      return yellowCardResult;
    } else throw new NotFoundException();
  }

  async addRedCard(idMatchStats: number, idPlayer: number, minute: number, _playerRepository: PlayerRepository, _rosterRepository: RosterRepository, _tournamentMatchRepository: TournamentMatchRepository, _playerStatsRepository: PlayerStatsRepository, _redCardRepository: RedCardRepository, _teamStatsRepository: TeamStatsRepository, _tournamentRepository: TournamentRepository, _teamTournamentRepository: TeamTournamentRepository){
    const player = await _playerRepository.findOne(idPlayer);

    const matchStats = await this.findOne(idMatchStats, {
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
        _rosterRepository,
        _tournamentMatchRepository,
      ))
    ) {
      //************************************************* */
      //**Añadir la tarjeta roja a las estadisticas del jugador */
      //************************************************* */
      await _playerRepository.addRedCardToPlayer(
        player,
        matchStats,
        _playerStatsRepository,
        _tournamentMatchRepository,
      );

      const redCard = new RedCardEntity();
      redCard.minute = minute;
      redCard.player = player;
      redCard.match_stats = matchStats;
      const redCardResult = await _redCardRepository.save(redCard);

      //**Añadir la tarjeta roja al global
      matchStats.red_card++;
      await this.save(matchStats);

      //************************************************* */
      //**Añadir la tarjeta roja a las estadisticas del equipo */
      //************************************************* */
      await _teamStatsRepository.addRedCardToStats(
        player,
        matchStats,
        _playerRepository,
        _tournamentRepository,
        _tournamentMatchRepository,
        _teamTournamentRepository,
        _rosterRepository
        );
      return redCardResult;
    } else throw new NotFoundException();
  }
}
