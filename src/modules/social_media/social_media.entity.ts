import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PlayerEntity } from "../player/entities/player.entity";
import { TeamEntity } from "../team/team/team.entity";

@Entity({ name: 'social_media' })
export class SocialMediaEntity {

  @PrimaryGeneratedColumn()
  idSocialMedia: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  link: string;

  @ManyToOne((type)=> TeamEntity, (team)=> team.idTeam, {eager: true})
  team: TeamEntity
}