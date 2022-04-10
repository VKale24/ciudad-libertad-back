import { EntityRepository, Repository } from "typeorm";
import { RosterEntity } from "./roster.entity";

@EntityRepository(RosterEntity)
export class RosterRepository extends Repository<RosterEntity> {

}