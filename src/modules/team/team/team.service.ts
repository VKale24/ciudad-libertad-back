import {
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';


import { TeamDto } from './dto/team.dto';
import { TeamEntity } from './team.entity';
import { TeamRepository } from './team.repository';
import { PlayerRepository } from '../../player/repositories/player.repository';

@Injectable()
export class TeamService {
  @InjectRepository(TeamRepository)
  private readonly _teamRepository: TeamRepository;

  @InjectRepository(PlayerRepository)
  private readonly _playerRepository: PlayerRepository;

  async getAllTeams(): Promise<TeamEntity[]> {
    return await this._teamRepository.getAllTeams();
  }

  async getTeamById(idTeam: number): Promise<TeamEntity> {
    const found: TeamEntity = await this._teamRepository.getTeamById(idTeam);
    return found;
  }

  async createTeam(teamDto: TeamDto) {
    return await this._teamRepository.createTeam(teamDto);
  }

  async updateTeam(idTeam: number, teamDto: TeamDto) {
    return await this._teamRepository.updateTeam(idTeam, teamDto);
  }

  async uploadImageToTeam(idTeam: number, file: any) {
    return await this._teamRepository.uploadImageToTeam(idTeam, file);
  }

  async desactivateTeam(idTeam: number) {
    return await this._teamRepository.desactivateTeam(idTeam);
  }
}
