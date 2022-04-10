import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import * as fs from 'fs';

import { InjectRepository } from '@nestjs/typeorm';
import { PlayerRepository } from '../../player/repositories/player.repository';
import { TeamDto } from './dto/team.dto';

import { TeamEntity } from './team.entity';
import { TeamRepository } from './team.repository';

@Injectable()
export class TeamService {
  @InjectRepository(TeamRepository)
  private readonly _teamRepository: TeamRepository;

  @InjectRepository(PlayerRepository)
  private readonly _playerRepository: PlayerRepository;

  async getAllTeams(): Promise<TeamEntity[]> {
    const teams = this._teamRepository
      .createQueryBuilder('team')
      .orderBy('team.name', 'ASC')
      .getMany();

    return teams;
  }

  async getTeamById(idTeam: number): Promise<TeamEntity> {
    const found: TeamEntity = await this._teamRepository.getTeamById(idTeam);
    return found;
  }

  async createTeam(teamDto: TeamDto) {
    const {
      name,
      captain,
      description,
      equipation_color,
      image,
      manager,
      town,
      header_image,
    } = teamDto;
    const team = new TeamEntity();
    team.name = name;
    team.image = image;
    team.headerImage = header_image;

    team.captain = captain;

    team.town = town;
    team.description = description;
    team.equipationColor = equipation_color.toLocaleLowerCase();
    team.manager = manager;
    try {
      await this._teamRepository.save(team);
    } catch (error) {
      if (error.code == '23505')
        throw new ConflictException(
          'Ya existe un equipo con ese nombre en el sistema',
        );
      else throw new InternalServerErrorException();
    }

    return team;
  }

  async updateTeam(idTeam: number, teamDto: TeamDto) {
    const {
      name,
      captain,
      description,
      equipation_color,
      image,
      manager,
      town,
      header_image,
    } = teamDto;
    const team = await this.getTeamById(idTeam);

    if (name) team.name = name;

    if (captain) team.captain = captain;

    if (description) team.description = description;

    if (equipation_color) team.equipationColor = equipation_color.toLowerCase();

    if (manager) team.manager = manager;

    if (image) team.image = image;

    if (header_image) team.headerImage = header_image;

    if (town) team.town = town;

    const teamResult = await this._teamRepository.save(team);

    return teamResult;
  }

  async uploadImageToTeam(idTeam: number, file: any) {
    const team = await this._teamRepository.findOne(idTeam);
    var pathToFile;
    if (!team) throw new NotFoundException();

    if (team.image != 'no image') {
      pathToFile = `./files/${team.image}`;
    }
    try {
      fs.unlinkSync(pathToFile);
      //file removed
    } catch (err) {
      console.error(err);
    }

    if (file != null) team.image = file.filename;

    await this._teamRepository.save(team);

    return team;
  }

  async deleteTeam(idTeam: number) {
    const team = await this.getTeamById(idTeam);

    team.active = false;

    await this._teamRepository.save(team);
  }
}
