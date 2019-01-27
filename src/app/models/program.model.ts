import { Entity, Column } from 'typeorm';
import { IsInt, IsMongoId, ValidateNested } from 'class-validator';

import { EntityModel } from './entity.model';
import { ScheduleModel } from './schedule.model';

@Entity('programs')
export class ProgramModel extends EntityModel {
    @Column()
    @IsMongoId()
    // tslint:disable-next-line:variable-name
    training_id: string;

    @Column()
    @IsMongoId()
    // tslint:disable-next-line:variable-name
    org_id: string;

    @Column()
    @IsInt()
    year: number;

    @Column()
    @ValidateNested({ each: true })
    schedules: ScheduleModel[];
}
