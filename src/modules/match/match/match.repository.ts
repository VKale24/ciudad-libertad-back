import { NotFoundException } from '@nestjs/common';
import { Repository, EntityRepository } from 'typeorm';

import { MatchDto } from './dto/match.dto';
import { MatchEntity } from './match.entity';
import { TeamRepository } from 'src/modules/team/team/team.repository';
import { MatchStatsEntity } from '../match_stats/entities/match_stats.entity';
import { TeamMatchEntity } from 'src/modules/team/team_match/team_match.entity';
import { StatsTableRepository } from 'src/modules/stats_table/stats_table.repository';
import { TeamMatchRepository } from 'src/modules/team/team_match/team_match.repository';
import { MatchStatsRepository } from '../match_stats/repository/match_stats.repository';
import { TournamentRepository } from 'src/modules/tournament/tournament/tournament.repository';
import { TournamentMatchEntity } from 'src/modules/tournament/tournament_match/tournament_match.entity';
import { TeamTournamentRepository } from 'src/modules/tournament/team_tournament/team_tournament.repository';
import { TournamentMatchRepository } from 'src/modules/tournament/tournament_match/tournament_match.repository';

@EntityRepository(MatchEntity)
export class MatchRepository extends Repository<MatchEntity> {

    async getAllMatchs() {
        const matchs = await this.find();

        return matchs;
    }

    async getMatchById(idMatch: number) {
        const match = await this.findOne(idMatch);

        if (!match) throw new NotFoundException();

        return match;
    }

    async create_match(idTeam1: number, idTeam2: number, idTournament: number, matchDto: MatchDto, _teamRepository: TeamRepository, _tournamentRepository: TournamentRepository, _teamTournamentRepository: TeamTournamentRepository, _teamMatchRepository: TeamMatchRepository, _tournamentMatchRepository: TournamentMatchRepository) {
        const { date, referee, round } = matchDto;

        const team1 = await _teamRepository.getTeamById(idTeam1);
        const team2 = await _teamRepository.getTeamById(idTeam2);

        //**VERIFICAR SI EL EQUIPO 1 ESTA DENTRO DEL TORNEO */
        const teamTournament1 = await _teamTournamentRepository.getTeamTournamentByTeamAndTournament(
            idTeam1,
            idTournament,
            _teamRepository,
            _tournamentRepository,
            _teamTournamentRepository,
        );

        if (!teamTournament1) throw new NotFoundException();

        //**VERIFICAR SI EL EQUIPO 2 ESTA DENTRO DEL TORNEO */
        const teamTournament2 = await _teamTournamentRepository.getTeamTournamentByTeamAndTournament(
            idTeam1,
            idTournament,
            _teamRepository,
            _tournamentRepository,
            _teamTournamentRepository,
        );

        if (!teamTournament2) throw new NotFoundException();

        if (date && referee && team1 && team2) {
            const match = new MatchEntity();

            match.date = date;
            match.round = round;
            match.referee = referee;

            const matchRes = await this.save(match);

            //Guardo el partido del primer equipo
            const teamMatch1 = new TeamMatchEntity();
            teamMatch1.match = matchRes;
            teamMatch1.team = team1;
            await _teamMatchRepository.save(teamMatch1);

            //Guardo el partido del primer equipo
            const teamMatch2 = new TeamMatchEntity();
            teamMatch2.match = matchRes;
            teamMatch2.team = team2;
            await _teamMatchRepository.save(teamMatch2);

            //Guardar el partido con respecto al Torneo
            const tournament = await _tournamentRepository.getTournamentById(
                idTeam1,
            );

            const tournamentMatch = new TournamentMatchEntity();
            tournamentMatch.match = match;
            tournamentMatch.tournament = tournament;
            await _tournamentMatchRepository.save(tournamentMatch);

            return matchRes;
        } else throw new NotFoundException();
    }

    async updateMatch(idMatch: number, matchDto: MatchDto) {
        const match = await this.getMatchById(idMatch);

        const { referee, date, round } = matchDto;

        if (referee) match.referee = referee;

        if (date) match.date = date;

        if (round) match.round = round;

        const matchResult = await this.save(match);

        return matchResult;
    }

    async closeMatch(idMatch: number, _tournamentMatchRepository: TournamentMatchRepository, _teamMatchRepository: TeamMatchRepository, _matchStatsRepository: MatchStatsRepository, _teamRepository: TeamRepository, _tournamentRepository: TournamentRepository, _statsTableRepository: StatsTableRepository, _teamTournamentRepository, _matchRepository: MatchRepository) {
        const match = await this.getMatchById(idMatch);
        if (match) {
            match.active = false;
            match.save();

            const tournamentMatch = await _tournamentMatchRepository.getTournamentByMatch(
                match.idMatch
            );

            if (tournamentMatch) {
                const listTeamMatch = await _teamMatchRepository.getTeamsByMatch(
                    idMatch,
                );
                if (listTeamMatch) {
                    //**Comparar los 2 matchStats para saber si es un empate, victoria o derrota */
                    const matchStats1 = await _matchStatsRepository.getStatsByMatchAndTeam(
                        listTeamMatch[0].match.idMatch,
                        listTeamMatch[0].team.idTeam,
                        this
                    );
                    const matchStats2 = await _matchStatsRepository.getStatsByMatchAndTeam(
                        listTeamMatch[1].match.idMatch,
                        listTeamMatch[1].team.idTeam,
                        this,
                    );

                    await this.setStatsTable(matchStats1, matchStats2, _teamRepository, tournamentMatch, _tournamentRepository, _statsTableRepository, _teamTournamentRepository);
                }
            }

            return match;
        }
    }

    async setStatsTable(
        matchStats1: MatchStatsEntity,
        matchStats2: MatchStatsEntity,
        _teamRepository: TeamRepository,
        tournamentMatch: TournamentMatchEntity,
        _tournamentRepository: TournamentRepository,
        _statsTableRepository: StatsTableRepository,
        _teamTournamentRepository: TeamTournamentRepository
    ) {
        if (matchStats1.goals > matchStats2.goals) {
            const teamTournament1 = await _teamTournamentRepository.getTeamTournamentByTeamAndTournament(
                matchStats1.team.idTeam,
                tournamentMatch.tournament.idTournament,
                _teamRepository,
                _tournamentRepository,
                _teamTournamentRepository,
            );
            const teamTournament2 = await _teamTournamentRepository.getTeamTournamentByTeamAndTournament(
                matchStats2.team.idTeam,
                tournamentMatch.tournament.idTournament,
                _teamRepository,
                _tournamentRepository,
                _teamTournamentRepository,
            );

            //teamTournament2.stats_table.pj++;
            //teamTournament2.stats_table.pp++;
            //teamTournament2.stats_table.gf+= matchStats2.goals;
            //teamTournament2.stats_table.gc+= matchStats1.goals;
            //teamTournament2.stats_table.dg= teamTournament2.stats_table.gf - teamTournament2.stats_table.gc;

            const statsTable1 = await _statsTableRepository.findOne(
                teamTournament1.stats_table.idStatsTable,
            );
            const statsTable2 = await _statsTableRepository.findOne(
                teamTournament2.stats_table.idStatsTable,
            );

            statsTable1.pj++;
            statsTable1.pg++;
            statsTable1.pts += 3;
            statsTable1.gf += matchStats1.goals;
            statsTable1.gc += matchStats2.goals;
            statsTable1.dg = statsTable1.gf - statsTable1.gc;

            statsTable2.pj++;
            statsTable2.pp++;
            statsTable2.gf += matchStats2.goals;
            statsTable2.gc += matchStats1.goals;
            statsTable2.dg = statsTable2.gf - statsTable2.gc;

            await _statsTableRepository.save(statsTable1);
            await _statsTableRepository.save(statsTable2);
        }

        if (matchStats1.goals < matchStats2.goals) {
            const teamTournament1 = await _teamTournamentRepository.getTeamTournamentByTeamAndTournament(
                matchStats1.team.idTeam,
                tournamentMatch.tournament.idTournament,
                _teamRepository,
                _tournamentRepository,
                _teamTournamentRepository,
            );
            const teamTournament2 = await _teamTournamentRepository.getTeamTournamentByTeamAndTournament(
                matchStats2.team.idTeam,
                tournamentMatch.tournament.idTournament,
                _teamRepository,
                _tournamentRepository,
                _teamTournamentRepository,
            );

            const statsTable1 = await _statsTableRepository.findOne(
                teamTournament1.stats_table.idStatsTable,
            );
            const statsTable2 = await _statsTableRepository.findOne(
                teamTournament2.stats_table.idStatsTable,
            );

            statsTable1.pj++;
            statsTable1.pp++;
            statsTable1.gf += matchStats1.goals;
            statsTable1.gc += matchStats2.goals;
            statsTable1.dg = statsTable1.gf - statsTable1.gc;


            statsTable2.pj++;
            statsTable2.pg++;
            statsTable2.pts += 3;
            statsTable2.gf += matchStats2.goals;
            statsTable2.gc += matchStats1.goals;
            statsTable2.dg = statsTable2.gf - statsTable2.gc;

            await _statsTableRepository.save(statsTable1);
            await _statsTableRepository.save(statsTable2);
        } else if (matchStats1.goals == matchStats2.goals) {
            const teamTournament1 = await _teamTournamentRepository.getTeamTournamentByTeamAndTournament(
                matchStats1.team.idTeam,
                tournamentMatch.tournament.idTournament,
                _teamRepository,
                _tournamentRepository,
                _teamTournamentRepository,
            );
            const teamTournament2 = await _teamTournamentRepository.getTeamTournamentByTeamAndTournament(
                matchStats2.team.idTeam,
                tournamentMatch.tournament.idTournament,
                _teamRepository,
                _tournamentRepository,
                _teamTournamentRepository,
            );

            const statsTable1 = await _statsTableRepository.findOne(
                teamTournament1.stats_table.idStatsTable,
            );
            const statsTable2 = await _statsTableRepository.findOne(
                teamTournament2.stats_table.idStatsTable,
            );

            statsTable1.pj++;
            statsTable1.pe++;
            statsTable1.pts++;
            statsTable1.gf += matchStats1.goals;
            statsTable1.gc += matchStats2.goals;
            statsTable1.dg = statsTable1.gf - statsTable1.gc;

            statsTable2.pj++;
            statsTable2.pe++;
            statsTable2.pts++;
            statsTable2.gf += matchStats2.goals;
            statsTable2.gc += matchStats1.goals;
            statsTable2.dg = statsTable2.gf - statsTable2.gc;

            await _statsTableRepository.save(statsTable1);
            await _statsTableRepository.save(statsTable2);
        }
    }

    async deletMatch(idMatch: number) {
        const match = await this.getMatchById(idMatch);
        if (match) {
            const result = await this.delete(idMatch);
            return Promise.resolve({
                result: result,
                status: 'success',
            });
        }
    }
}


