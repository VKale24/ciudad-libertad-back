import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StatsTableRepository } from 'src/modules/stats_table/stats_table.repository';
import { TeamTournamentRepository } from 'src/modules/tournament/team_tournament/team_tournament.repository';
import { TeamRepository } from '../../team/team/team.repository';
import { TeamMatchEntity } from '../../team/team_match/team_match.entity';
import { TeamMatchRepository } from '../../team/team_match/team_match.repository';
import { TournamentRepository } from '../../tournament/tournament/tournament.repository';
import { TournamentMatchEntity } from '../../tournament/tournament_match/tournament_match.entity';
import { TournamentMatchRepository } from '../../tournament/tournament_match/tournament_match.repository';
import { MatchStatsEntity } from '../match_stats/entities/match_stats.entity';
import { MatchStatsRepository } from '../match_stats/repository/match_stats.repository';
import { MatchDto } from './dto/match.dto';
import { MatchEntity } from './match.entity';
import { MatchRepository } from './match.repository';

@Injectable()
export class MatchService {
  @InjectRepository(MatchRepository)
  private readonly _matchRepository: MatchRepository;

  @InjectRepository(TeamRepository)
  private readonly _teamRepository: TeamRepository;

  @InjectRepository(TeamMatchRepository)
  private readonly _teamMatchRepository: TeamMatchRepository;

  @InjectRepository(TournamentRepository)
  private readonly _tournamentRepository: TournamentRepository;

  @InjectRepository(TournamentMatchRepository)
  private readonly _tournamentMatchRepository: TournamentMatchRepository;

  @InjectRepository(TeamTournamentRepository)
  private readonly _teamTournamentRepository: TeamTournamentRepository;

  @InjectRepository(MatchStatsRepository)
  private readonly _matchStatsRepository: MatchStatsRepository;

  @InjectRepository(StatsTableRepository)
  private readonly _statsTableRepository: StatsTableRepository;

  async getAllMatchs() {
    const matchs = await this._matchRepository.find();

    return matchs;
  }

  async getMatchById(idMatch: number) {
    const match = await this._matchRepository.findOne(idMatch);

    if (!match) throw new NotFoundException();

    return match;
  }

  async getMatchByRound(round: number, idTournament: number) {
    const match = await this._matchRepository.find({ round: round });

    if (!match) throw new NotFoundException();

    return match;
  }

  async createMatch(
    matchDto: MatchDto,
    idTeam1: number,
    idTeam2: number,
    idTournament: number,
  ) {
    const { date, referee, round } = matchDto;

    const team1 = await this._teamRepository.findOne(idTeam1);
    const team2 = await this._teamRepository.findOne(idTeam2);

    if (date && referee && team1 && team2) {
      const match = new MatchEntity();

      match.date = date;
      //match.date = date;
      match.round = round;
      match.referee = referee;

      const matchRes = await this._matchRepository.save(match);

      //Guardo el partido del primer equipo
      const teamMatch1 = new TeamMatchEntity();
      teamMatch1.match = matchRes;
      teamMatch1.team = team1;
      await this._teamMatchRepository.save(teamMatch1);

      //Guardo el partido del primer equipo
      const teamMatch2 = new TeamMatchEntity();
      teamMatch2.match = matchRes;
      teamMatch2.team = team2;
      await this._teamMatchRepository.save(teamMatch2);

      //Guardar el partido con respecto al Torneo
      const tournament = await this._tournamentRepository.findOne(idTournament);
      if (tournament) {
        const tournamentMatch = new TournamentMatchEntity();
        tournamentMatch.match = match;
        tournamentMatch.tournament = tournament;
        await this._tournamentMatchRepository.save(tournamentMatch);
      } else throw new NotFoundException();

      return matchRes;
    } else throw new NotFoundException();
  }

  async updateMatch(idMatch: number, matchDto: MatchDto) {
    const match = await this.getMatchById(idMatch);

    const { referee, date, round } = matchDto;

    if (referee) match.referee = referee;

    if (date) match.date = date;

    if (round) match.round = round;

    const matchResult = await this._matchRepository.save(match);

    return matchResult;
  }

  async closeMatch(idMatch: number) {
    const match = await this.getMatchById(idMatch);
    if (match) {
      match.active = false;
      match.save();

      const tournamentMatch = await this._tournamentMatchRepository.getTournamentByMatch(
        match.idMatch,
      );

      if (tournamentMatch) {
        const listTeamMatch = await this._teamMatchRepository.getTeamsByMatch(
          idMatch,
        );
        if (listTeamMatch) {
          //**Comparar los 2 matchStats para saber si es un empate, victoria o derrota */
          const matchStats1 = await this._matchStatsRepository.getStatsByMatchAndTeam(
            listTeamMatch[0].match.idMatch,
            listTeamMatch[0].team.idTeam,
            this._matchRepository,
          );
          const matchStats2 = await this._matchStatsRepository.getStatsByMatchAndTeam(
            listTeamMatch[1].match.idMatch,
            listTeamMatch[1].team.idTeam,
            this._matchRepository,
          );

          await this.setStatsTable(matchStats1, matchStats2, tournamentMatch);
        }
      }

      return match;
    }
  }

  async setStatsTable(
    matchStats1: MatchStatsEntity,
    matchStats2: MatchStatsEntity,
    tournamentMatch: TournamentMatchEntity,
  ) {
    if (matchStats1.goals > matchStats2.goals) {
      const teamTournament1 = await this._teamTournamentRepository.getTeamTournamentByTeamAndTournament(
        matchStats1.team.idTeam,
        tournamentMatch.tournament.idTournament,
        this._teamRepository,
        this._tournamentRepository,
        this._teamTournamentRepository,
      );
      const teamTournament2 = await this._teamTournamentRepository.getTeamTournamentByTeamAndTournament(
        matchStats2.team.idTeam,
        tournamentMatch.tournament.idTournament,
        this._teamRepository,
        this._tournamentRepository,
        this._teamTournamentRepository,
      );

      teamTournament2.stats_table.pj++;
      teamTournament2.stats_table.pp++;

      const statsTable1 = await this._statsTableRepository.findOne(
        teamTournament1.stats_table.idStatsTable,
      );
      const statsTable2 = await this._statsTableRepository.findOne(
        teamTournament2.stats_table.idStatsTable,
      );

      statsTable1.pj++;
      statsTable1.pg++;
      statsTable1.pts += 3;

      statsTable2.pj++;
      statsTable2.pp++;

      await this._statsTableRepository.save(statsTable1);
      await this._statsTableRepository.save(statsTable2);
    }

    if (matchStats1.goals < matchStats2.goals) {
      const teamTournament1 = await this._teamTournamentRepository.getTeamTournamentByTeamAndTournament(
        matchStats1.team.idTeam,
        tournamentMatch.tournament.idTournament,
        this._teamRepository,
        this._tournamentRepository,
        this._teamTournamentRepository,
      );
      const teamTournament2 = await this._teamTournamentRepository.getTeamTournamentByTeamAndTournament(
        matchStats2.team.idTeam,
        tournamentMatch.tournament.idTournament,
        this._teamRepository,
        this._tournamentRepository,
        this._teamTournamentRepository,
      );

      const statsTable1 = await this._statsTableRepository.findOne(
        teamTournament1.stats_table.idStatsTable,
      );
      const statsTable2 = await this._statsTableRepository.findOne(
        teamTournament2.stats_table.idStatsTable,
      );

      statsTable1.pj++;
      statsTable1.pp++;

      statsTable2.pj++;
      statsTable2.pg++;
      statsTable2.pts += 3;

      await this._statsTableRepository.save(statsTable1);
      await this._statsTableRepository.save(statsTable2);
    } else if (matchStats1.goals == matchStats2.goals) {
      const teamTournament1 = await this._teamTournamentRepository.getTeamTournamentByTeamAndTournament(
        matchStats1.team.idTeam,
        tournamentMatch.tournament.idTournament,
        this._teamRepository,
        this._tournamentRepository,
        this._teamTournamentRepository,
      );
      const teamTournament2 = await this._teamTournamentRepository.getTeamTournamentByTeamAndTournament(
        matchStats2.team.idTeam,
        tournamentMatch.tournament.idTournament,
        this._teamRepository,
        this._tournamentRepository,
        this._teamTournamentRepository,
      );

      const statsTable1 = await this._statsTableRepository.findOne(
        teamTournament1.stats_table.idStatsTable,
      );
      const statsTable2 = await this._statsTableRepository.findOne(
        teamTournament2.stats_table.idStatsTable,
      );

      statsTable1.pj++;
      statsTable1.pe++;
      statsTable1.pts++;

      statsTable2.pj++;
      statsTable2.pe++;
      statsTable2.pts++;

      await this._statsTableRepository.save(statsTable1);
      await this._statsTableRepository.save(statsTable2);
    }
  }

  async deleteMatch(idMatch: number) {
    const match = await this.getMatchById(idMatch);
    if (match) {
      const result = await this._matchRepository.delete(idMatch);
      return Promise.resolve({
        result: result,
        status: 'success',
      });
    }
  }
}
