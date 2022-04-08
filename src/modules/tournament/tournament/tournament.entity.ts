import { PlayerStatsEntity } from "src/modules/player/entities/player.stats.entity";
import { TeamStatsEntity } from "src/modules/team/team_stats/team_stats.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { TeamTournamentEntity } from "../team_tournament/team_tournament.entity";

@Entity({ name: 'tournament' })
export class TournamentEntity {

  @PrimaryGeneratedColumn()
  idTournament: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  duration: number;

  @Column({ nullable: false })
  quantityTeams: number; 

  @Column({ nullable: false, default: "no image" })
  image: string;

  @CreateDateColumn({ nullable: false })
  created_at: Date

  @Column({ default: true })
  active: boolean;

  @OneToMany((type)=> TeamTournamentEntity, (teamTournament)=> teamTournament.idTeamTournament)
  teamTournament: TeamTournamentEntity[];

  @OneToMany((type)=> PlayerStatsEntity, (player_stats)=> player_stats.idPlayerStats)
  player_stats: PlayerStatsEntity[];

  constructor(name:string, duration: number, quantityTeams: number, image: string){
    this.name = name;
    this.duration = duration;
    this.quantityTeams = quantityTeams;
    this.image = image;
    this.created_at = new Date();
  }
}