import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";

import { PlayerStatsEntity } from "./player.stats.entity";
import { GoalEntity } from "src/modules/match/match_stats/entities/goal.entity";
import { AssistEntity } from "src/modules/match/match_stats/entities/assist.entity";
import { RedCardEntity } from "src/modules/match/match_stats/entities/red_card.entity";
import { YellowCardEntity } from "src/modules/match/match_stats/entities/yellow_card.entity";
import { TeamTournamentEntity } from "src/modules/tournament/team_tournament/team_tournament.entity";
import { RosterEntity } from "src/modules/team/roster/roster.entity";


@Entity({ name: 'player' })
@Unique(['ci'])
export class PlayerEntity extends BaseEntity{

  @PrimaryGeneratedColumn()
  idPlayer: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  last_name: string;

  @Column({ nullable: false })
  age: number;

  @Column({ nullable: false })
  height: number;

  @Column({ nullable: false })
  weight: number;

  @Column({ nullable: true })
  phone: number;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  profession: string;

  @Column({ nullable: false })
  ci: string;

  @Column({ nullable: true , default: "no image"})
  image: string;

  @Column({ nullable: true, default: "no image" })
  image_face: string;

  @Column({ nullable: false })
  position: string;

  @Column({default: true })
  active: boolean

  @OneToMany((type)=> RedCardEntity, (red_card)=> red_card.idRedCard)
  red_card: RedCardEntity[];

  @OneToMany((type)=> RedCardEntity, (red_card)=> red_card.idRedCard)
  yellow_card: YellowCardEntity[];

  @OneToMany((type)=> GoalEntity, (goal)=> goal.idGoal)
  goal: GoalEntity[];

  @OneToMany((type)=> AssistEntity, (assist)=> assist.idAssist)
  assist: AssistEntity[];

  @OneToMany((type)=> PlayerStatsEntity, (player_stats)=> player_stats.idPlayerStats)
  player_stats: PlayerStatsEntity[];

  @OneToMany((type)=> TeamTournamentEntity, (teamTournament)=> teamTournament.idTeamTournament)
  teamTournament: TeamTournamentEntity[];

  @OneToMany((type)=> RosterEntity, (roster)=> roster.idRoster)
  roster: RosterEntity[];
}