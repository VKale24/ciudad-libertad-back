import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { SocialMediaEntity } from "../../social_media/social_media.entity";
import { MatchStatsEntity } from "../../match/match_stats/entities/match_stats.entity";
import { TeamTournamentEntity } from "../../tournament/team_tournament/team_tournament.entity";
import { RosterEntity } from "../roster/roster.entity";

@Entity({ name: 'team' })
export class TeamEntity {

  @PrimaryGeneratedColumn()
  idTeam: number;

  @Column({ unique: true, nullable: false })
  name: string;

  @Column({ nullable: true , default: "-"})
  captain: string;

  @Column({ nullable: true , default: "-"})
  manager: string;

  @Column({ nullable: false })
  equipationColor: string;

  @Column({ nullable: true, default: "no image" })
  image: string;

  @Column({ nullable: true, default: "-" })
  headerImage: string;

  @Column({ nullable: true , default: "-"})
  description: string;

  @Column({ nullable: false })
  town: string;

  @Column({ default: true })
  active: boolean;

  @OneToMany((type)=> SocialMediaEntity, (socialMedia)=> socialMedia.idSocialMedia)
  social_media: SocialMediaEntity[];

  @OneToMany((type)=> RosterEntity, (roster)=> roster.idRoster)
  roster: RosterEntity[];

  @OneToMany((type)=> TeamTournamentEntity, (teamTournament)=> teamTournament.idTeamTournament)
  team_tournament: TeamTournamentEntity[];

  @OneToMany((type)=> MatchStatsEntity, (match_stats)=> match_stats.idMatchStats)
  match_stats: MatchStatsEntity[];
}