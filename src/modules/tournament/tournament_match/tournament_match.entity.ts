import { MatchEntity } from "src/modules/match/match/match.entity";

import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { TournamentEntity } from "../tournament/tournament.entity";

@Entity({ name: 'tournament_match' })
export class TournamentMatchEntity {

  @PrimaryGeneratedColumn()
  idTournamentMatch: number;

  @ManyToOne((type) => MatchEntity, (match) => match.idMatch, { eager: true })
  match: MatchEntity

  @ManyToOne((type) => TournamentEntity, (tournament) => tournament.idTournament, { eager: true })
  tournament: TournamentEntity;

}